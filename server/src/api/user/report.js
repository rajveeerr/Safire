const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { User }=require("../../models/User")
const { HiddenUser } = require('../../models/HiddenUser');
const { Report } = require('../../models/Report');
const { Screenshot } = require('../../models/Screenshot');
const { HiddenMessage } = require('../../models/HiddenMessage');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const { authMiddleware }=require("../../middlewares")
const { generatePDF } = require('../../utils/generatePdf');

//-> {screenshotUrl:"",userName:"",notes: "",time:"",platform:"",userProfileDetails:{},flaggedMessages:[]}
async function generateAISummary(reportData) {
    try {
      const messageHistory = reportData.messages.map(msg => ({
        content: msg.content,
        timestamp: new Date(msg.timestamp).toISOString(),
        type: msg.type
      }));
  
      const summaryPrompt = `You are an expert AI system specializing in digital harassment analysis and online safety assessment.
      Your task is to analyze a collection of messages to identify patterns of harassment, assess severity, and provide actionable insights.
  
      Context:
      - Platform: ${reportData.messageStats.platform}
      - Timeline: ${reportData.timespan} days
      - Total Messages: ${reportData.messageStats.total}
      - Message Frequency: ${reportData.messageStats.frequency} per day
      - Message Types: ${reportData.messageStats.types.join(', ')}
      - Subject is a ${reportData.isKnownHarasser ? 'known' : 'previously unreported'} harasser
  
      Message History:
      ${JSON.stringify(messageHistory, null, 2)}
  
      Additional Context:
      ${reportData.userNotes || 'No additional notes provided'}
  
      Analyze the following aspects:
      1. Message patterns and escalation over time
      2. Type and severity of harassment
      3. Potential risks and threats
      4. Platform-specific context (e.g., professional vs social platforms)
      5. Frequency and intensity patterns
      6. Evidence of coordinated harassment
      7. Use of multiple message types/methods
  
      Provide a strictly-formatted JSON response with NO markdown or code blocks:
      {
        "severityAssessment": "HIGH/MEDIUM/LOW",
        "keyFindings": [
          "List key observations about the harassment patterns",
          "Include specific examples with dates/times",
          "Note any escalation or changes in behavior"
        ],
        "behavioralPatterns": [
          "Describe identified patterns of behavior",
          "Include frequency and timing patterns",
          "Note any platform-specific concerns"
        ],
        "legalConsiderations": [
          "List potential legal violations",
          "Note jurisdiction-relevant concerns",
          "Identify any serious threats or criminal behavior"
        ],
        "recommendedActions": [
          "Provide specific, actionable steps",
          "Include platform-specific reporting steps",
          "Suggest safety measures"
        ],
        "riskLevel": "HIGH/MEDIUM/LOW",
        "summaryText": "Detailed paragraph analyzing the overall situation, patterns, and specific concerns"
      }`;
  
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(summaryPrompt);
      const response = await result.response;
      const text = await response.text();
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(text);
      } catch (parseError) {
        const cleanedText = text
          .replace(/```json\n?|\n?```/g, '')
          .replace(/\\n/g, ' ')
          .trim();
        try {
          parsedResponse = JSON.parse(cleanedText);
        } catch (secondParseError) {
          parsedResponse = {
            severityAssessment: text.includes('HIGH') ? 'HIGH' : 
                               text.includes('MEDIUM') ? 'MEDIUM' : 'LOW',
            keyFindings: text.split('\n')
                            .filter(line => line.includes('•') || line.includes('-'))
                            .map(line => line.replace(/[•-]\s+/, '')),
            behavioralPatterns: ['Manual review recommended'],
            legalConsiderations: ['Consult legal professional for evaluation'],
            recommendedActions: ['Review evidence manually'],
            riskLevel: text.includes('HIGH') ? 'HIGH' : 
                      text.includes('MEDIUM') ? 'MEDIUM' : 'LOW',
            summaryText: text.length > 100 ? text.slice(0, 100) + '...' : text
          };
        }
      }
  
      const sanitizedResponse = {
        severityAssessment: parsedResponse.severityAssessment || 'MEDIUM',
        keyFindings: Array.isArray(parsedResponse.keyFindings) ? 
                    parsedResponse.keyFindings.filter(item => item && typeof item === 'string') :
                    ['Manual review recommended'],
        behavioralPatterns: Array.isArray(parsedResponse.behavioralPatterns) ?
                           parsedResponse.behavioralPatterns.filter(item => item && typeof item === 'string') :
                           ['Pattern analysis required'],
        legalConsiderations: Array.isArray(parsedResponse.legalConsiderations) ?
                            parsedResponse.legalConsiderations.filter(item => item && typeof item === 'string') :
                            ['Legal review recommended'],
        recommendedActions: Array.isArray(parsedResponse.recommendedActions) ?
                           parsedResponse.recommendedActions.filter(item => item && typeof item === 'string') :
                           ['Review evidence manually'],
        riskLevel: parsedResponse.riskLevel || 'MEDIUM',
        summaryText: parsedResponse.summaryText || 'Manual review recommended'
      };
  
      return sanitizedResponse;
    } catch (error) {
      console.error('AI summary generation error:', error);
      return {
        severityAssessment: 'MEDIUM',
        keyFindings: ['Unable to generate AI-powered analysis'],
        behavioralPatterns: ['Manual review recommended'],
        legalConsiderations: ['Consult legal professional for evaluation'],
        recommendedActions: ['Review raw evidence manually'],
        riskLevel: 'MEDIUM',
        summaryText: 'Automated analysis unavailable. Please review provided evidence manually.'
      };
    }
}
  
const reportGenerationSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    profileUrl: z.string().url('Valid profile URL is required'),
    platform: z.string().optional(),
    profilePicUrl: z.string().url('Valid profile picture URL required').optional(),
    screenshots: z.array(z.object({
      url: z.string().url(),
      timestamp: z.string().datetime(),
      context: z.string().optional()
    })).optional(),
    additionalNotes: z.string().optional(),
    requestReason: z.string().optional(),
    userNotes: z.string().optional() 
});

router.post('/generate-report', authMiddleware, async (req, res) => {
    try {
      const validatedData = await reportGenerationSchema.parseAsync(req.body);
  
      const hiddenMessages = await HiddenMessage.find({
        userName: validatedData.username.toLowerCase(),
        profileUrl: validatedData.profileUrl,
        hiddenBy: req.userId
      }).sort({ timeOfMessage: 1 });
  
      const hiddenUser = await HiddenUser.findOne({
        name: validatedData.username.toLowerCase(),
        profileUrl: validatedData.profileUrl,
        hiddenBy: req.userId
      });

  
      const screenshots = [];
      if (validatedData.screenshots?.length) {
        for (const screenshot of validatedData.screenshots) {
          const newScreenshot = await Screenshot.create({
            screenshotUrl: screenshot.url, 
            time: new Date(screenshot.timestamp),
            uploadedBy: req.userId,
            platform: validatedData.platform,
            context: screenshot.context
          });
          
          screenshots.push({
            _id: newScreenshot._id,
            screenshotUrl: screenshot.url,
            timestamp: screenshot.timestamp,
            context: screenshot.context,
            platform: validatedData.platform,
          });
        }
        console.log(screenshots);
      }
  
      const messageStats = {
        total: hiddenMessages.length,
        types: [...new Set(hiddenMessages.map(msg => msg.metadata?.messageType || 'text'))],
        frequency: hiddenMessages.length / 
          (Math.ceil((new Date() - new Date(hiddenMessages[0]?.timeOfMessage)) / (1000 * 60 * 60 * 24)) || 1),
        timespan: hiddenMessages.length ? 
          Math.ceil((new Date(hiddenMessages[hiddenMessages.length - 1].timeOfMessage) - 
                    new Date(hiddenMessages[0].timeOfMessage)) / (1000 * 60 * 60 * 24)) : 0,
        platform: validatedData.platform.toLowerCase() || 'unknown'
      };
  
      const reportSummary = await generateAISummary({
        messageStats,
        isKnownHarasser: hiddenUser?.isHarasser || false,
        timespan: messageStats.timespan,
        userNotes: validatedData.userNotes,
        messages: hiddenMessages.map(msg => ({
          content: msg.messageContent,
          timestamp: msg.timeOfMessage,
          type: msg.metadata?.messageType || 'text'
        }))
      });
  
      const formattedMessages = hiddenMessages.map(msg => ({
        content: msg.messageContent,
        timestamp: msg.timeOfMessage,
        type: msg.metadata?.messageType || 'text',
        context: msg.metadata?.context || ''
      }));
  
      const report = await Report.create({
        userName: validatedData.username.toLowerCase(),
        profileUrl: validatedData.profileUrl,
        platform: validatedData.platform.toLowerCase(),
        reportedBy: req.userId,
        status: 'generated',
        userProfileDetails: {
          profileUrl: validatedData.profileUrl,
          profilePicUrl: validatedData.profilePicUrl,
          platform: validatedData.platform.toLowerCase(),
          isKnownHarasser: hiddenUser?.isHarasser || false,
          totalHideCount: hiddenUser?.totalHideCount || 0
        },
        evidence: {
          messages: formattedMessages,
          screenshots: screenshots,
          statistics: messageStats
        }, 
        summary: reportSummary,
        metadata: {
          generatedAt: new Date(),
          requestReason: validatedData.requestReason,
          additionalNotes: validatedData.additionalNotes,
          userNotes: validatedData.userNotes,
          evidenceTimespan: {
            start: hiddenMessages[0]?.timeOfMessage,
            end: hiddenMessages[hiddenMessages.length - 1]?.timeOfMessage
          }
        },
        legalDisclaimer: `This report was generated on ${new Date().toISOString()} and contains documented evidence of harassment. All timestamps are in UTC.`
      });
   
    const pdfBuffer = await generatePDF(report.toObject(), report._id); 
  
    await User.findByIdAndUpdate(
      req.userId,
      { $push: { reports: report._id } }
    );
  
    res.status(201).json({
      status: 'success',
      data: {
        reportId: report._id,
        summary: reportSummary,
        statistics: messageStats,
        evidenceCount: {
          messages: hiddenMessages.length,
          screenshots: screenshots.length
        },
        reportStatus: 'generated',
        pdf: pdfBuffer.toString('base64'),
        metadata: {
          generatedAt: report.metadata.generatedAt,
          timespan: `${messageStats.timespan} days`,
          platform: validatedData.platform.toLowerCase() || 'unknown'
        }
      }
    });
  
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: 'error',
        type: 'ValidationError',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
  
    console.error('Report generation error:', error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Failed to generate report'
    });
  }
});

router.get('/saved-reports', authMiddleware, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      platform,
      status,
      severity,
      timeframe,
      hasScreenshots
    } = req.query;

    const filters = { reportedBy: req.userId };
    if (platform) filters.platform = platform;
    if (status) filters.status = status;
    if (severity) filters['summary.severityAssessment'] = severity;
    
    if (timeframe) {
      const date = new Date();
      date.setDate(date.getDate() - parseInt(timeframe));
      filters.createdAt = { $gte: date };
    }

    if (hasScreenshots === 'true') {
      filters['evidence.screenshots.0'] = { $exists: true };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reports = await Report.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reportedBy', 'username email')
      .select({
        userName: 1,
        platform: 1,
        profileUrl: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        userProfileDetails: 1,
        'evidence.statistics': 1,
        'evidence.messages': {
          $slice: 5  
        },
        'evidence.screenshots': {
          $slice: 2  
        },
        summary: 1,
        metadata: 1,
        legalDisclaimer: 1
      });

    const totalReports = await Report.countDocuments(filters);
    const totalPages = Math.ceil(totalReports / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const platformStats = await Report.aggregate([
      { $match: { reportedBy: req.userId } },
      { $group: {
        _id: '$platform',
        count: { $sum: 1 },
        avgSeverity: { 
          $avg: {
            $switch: {
              branches: [
                { case: { $eq: ['$summary.severityAssessment', 'HIGH'] }, then: 3 },
                { case: { $eq: ['$summary.severityAssessment', 'MEDIUM'] }, then: 2 }
              ],
              default: 1
            }
          }
        }
      }}
    ]);

    res.status(200).json({
      success: true,
      data: {
        reports: reports.map(report => ({
          id: report._id,
          userName: report.userName,
          platform: report.platform,
          profileUrl: report.profileUrl,
          status: report.status,
          userDetails: {
            isKnownHarasser: report.userProfileDetails?.isKnownHarasser || false,
            totalHideCount: report.userProfileDetails?.totalHideCount || 0,
            randomProfileImage: report.userProfileDetails?.profilePicUrl,
            platform: report.userProfileDetails?.platform
          },
          evidence: {
            statistics: report.evidence?.statistics || {
              total: 0,
              timespan: 0,
              frequency: 0,
              types: []
            },
            messagePreview: report.evidence?.messages?.map(msg => ({
              content: msg.content,
              timestamp: msg.timestamp,
              type: msg.type
            })) || [],
            screenshotCount: report.evidence?.screenshots?.length || 0,
            screenshotPreviews: report.evidence?.screenshots?.map(ss => ({
              url: ss.screenshotUrl,
              timestamp: ss.timestamp,
              context: ss.context
            })) || []
          },
          analysis: {
            severity: report.summary?.severityAssessment || 'MEDIUM',
            riskLevel: report.summary?.riskLevel || 'MEDIUM',
            keyFindings: report.summary?.keyFindings || [],
            behavioralPatterns: report.summary?.behavioralPatterns || [],
            legalConsiderations: report.summary?.legalConsiderations || [],
            recommendedActions: report.summary?.recommendedActions || [],
            summaryText: report.summary?.summaryText
          },
          metadata: {
            generatedAt: report.metadata?.generatedAt,
            requestReason: report.metadata?.requestReason,
            additionalNotes: report.metadata?.additionalNotes,
            userNotes: report.metadata?.userNotes,
            evidenceTimespan: report.metadata?.evidenceTimespan
          },
          timestamps: {
            created: report.createdAt,
            updated: report.updatedAt,
            generated: report.metadata?.generatedAt
          },
          legalDisclaimer: report.legalDisclaimer
        })),
        analytics: {
          platformStats,
          severityDistribution: await Report.aggregate([
            { $match: { reportedBy: req.userId } },
            { $group: {
              _id: '$summary.severityAssessment',
              count: { $sum: 1 }
            }}
          ]),
          timeBasedStats: {
            lastWeek: await Report.countDocuments({
              reportedBy: req.userId,
              createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }),
            lastMonth: await Report.countDocuments({
              reportedBy: req.userId,
              createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            })
          }
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalReports,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        },
        filters: {
          platform,
          status,
          severity,
          timeframe,
          hasScreenshots
        },
        sorting: {
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error('Error fetching saved reports:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch saved reports',
        details: error.message,
      }
    });
  }
});

router.get('/view-report/:reportId', async (req, res) => {
    try {
        const report = await Report.findById(req.params.reportId);
        const pdfBuffer = await generatePDF(report.toObject(), report._id);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
        res.end(pdfBuffer);
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).send('Error generating PDF');
    }
});
  

module.exports = router;