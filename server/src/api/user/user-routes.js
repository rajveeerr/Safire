const express = require('express');
const router = express.Router();
const { z } = require('zod');
const bcrypt = require('bcrypt');
const { User }=require("../../models/User")
const { HiddenUser } = require('../../models/HiddenUser');
const { Report } = require('../../models/Report');
const { BlacklistedKeyword } = require('../../models/BlacklistedKeyword');
const { Screenshot } = require('../../models/Screenshot');

const { authMiddleware }=require("../../middlewares")

const profileRoutes = require('./profile');

router.use("/",profileRoutes)

router.post('/hide-user', authMiddleware, async (req, res) => {//-> {name: string, userId: "", platform: ""} // userId will be used to correctly identify user to hide
  try {
    const { name, userId, platform } = req.body;
    
    if (!name) {
      return res.status(400).json({
        status: 'error',
        type: 'ValidationError',
        message: 'Name is required'
      });
    }

    const existingHiddenUser = await HiddenUser.findOne({
      name,
      userId,
      hiddenBy: req.userId
    });

    if (existingHiddenUser) {
      return res.status(409).json({
        status: 'error',
        type: 'DuplicateError',
        message: 'User is already hidden'
      });
    }

    const hiddenUser = await HiddenUser.create({
      userId,
      name,
      hiddenBy: req.userId,
      platform: req.body.platform || 'unknown'
    });

    await User.findByIdAndUpdate(
      req.userId,
      { $push: { hiddenUsers: hiddenUser._id } }
    );

    res.status(201).json({
      status: 'success',
      data: {
        hiddenUser
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error', 
      type: 'ServerError',
      message: 'Internal server error'
    });
  }
});

router.get('/hidden-users', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('hiddenUsers');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        type: 'NotFoundError',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        hiddenUsers: user.hiddenUsers,
        total: user.hiddenUsers.length
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Internal server error'
    });
  }
});

//-> {name: string, userId: ""}
router.post('/unhide', authMiddleware, async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'error',
        type: 'ValidationError',
        message: 'Name is required'
      });
    }

    const hiddenUser = await HiddenUser.findOne({
      userId,
      name,
      hiddenBy: req.userId
    });

    if (!hiddenUser) {
      return res.status(404).json({
        status: 'error',
        type: 'NotFoundError',
        message: 'Hidden user not found'
      });
    }

    await HiddenUser.findByIdAndDelete(hiddenUser._id);

    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { hiddenUsers: hiddenUser._id } }
    );

    res.json({
      status: 'success',
      data: {
        message: 'User unhidden successfully',
        unHiddenUser: {
          userId: hiddenUser.userId,
          name: hiddenUser.name,
          platform: hiddenUser.platform
        }
      }
    });

  } catch (error) {
    console.error('Unhide user error:', error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Internal server error'
    });
  }
});

//-> {blacklist-keywords: ["","",""]}
router.post('/blacklist-keywords', authMiddleware, async (req, res) => {
  try {
    const { keywords } = req.body;

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        status: 'error',
        type: 'ValidationError',
        message: 'Keywords must be a non-empty array'
      });
    }

    let blacklist = await BlacklistedKeyword.findOne({ createdBy: req.userId });

    if (blacklist) {
      blacklist.keywords = [...new Set([...blacklist.keywords, ...keywords])];
      await blacklist.save();
    } else {
      blacklist = await BlacklistedKeyword.create({
        keywords,
        createdBy: req.userId
      });
    }

    res.status(201).json({
      status: 'success',
      data: { blacklist }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Internal server error'
    });
  }
});

router.get('/blacklisted-keywords', authMiddleware, async (req, res) => {
  try {
    const blacklist = await BlacklistedKeyword.findOne({ createdBy: req.userId });

    res.json({
      status: 'success',
      data: {
        keywords: blacklist?.keywords || [],
        total: blacklist?.keywords?.length || 0
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Internal server error'
    });
  }
});

const screenshotSchema = z.object({
  screenshotUrl: z.string().url('Invalid screenshot URL'),
  time: z.string().datetime('Invalid timestamp'),
  platform: z.string().optional(),
  relatedReport: z.string().optional(),
  metadata: z.object({
    source: z.string().optional(),
    size: z.number().optional(),
    format: z.string().optional()
  }).optional()
});

router.post('/save-screenshot', authMiddleware, async (req, res) => {
  try {
    const validatedData = await screenshotSchema.parseAsync(req.body);

    const existingScreenshot = await Screenshot.findOne({
      screenshotUrl: validatedData.screenshotUrl,
      uploadedBy: req.userId
    });

    if (existingScreenshot) {
      return res.status(409).json({
        status: 'error',
        type: 'DuplicateError',
        message: 'Screenshot already exists'
      });
    }

    const screenshot = await Screenshot.create({
      ...validatedData,
      uploadedBy: req.userId,
      time: new Date(validatedData.time)
    });

    await User.findByIdAndUpdate(
      req.userId,
      { $push: { screenshots: screenshot._id } }
    );

    res.status(201).json({
      status: 'success',
      data: {
        screenshot: {
          id: screenshot._id,
          screenshotUrl: screenshot.screenshotUrl,
          time: screenshot.time,
          platform: screenshot.platform,
          metadata: screenshot.metadata,
          createdAt: screenshot.createdAt
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

    console.error('Save screenshot error:', error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Failed to save screenshot'
    });
  }
});

const querySchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
  offset: z.string().regex(/^\d+$/).transform(Number).optional().default('0'),
  platform: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

router.get('/saved-screenshots', authMiddleware, async (req, res) => {
  try {
    const { limit, offset, platform, startDate, endDate } = await querySchema.parseAsync(req.query);

    const filters = { uploadedBy: req.userId }; // Add uploadedBy filter

    if (platform) {
      filters.platform = platform;
    }

    if (startDate || endDate) {
      filters.time = {};
      if (startDate) filters.time.$gte = new Date(startDate);
      if (endDate) filters.time.$lte = new Date(endDate);
    }

    const screenshots = await Screenshot.find(filters)
      .sort({ time: -1 })
      .skip(offset)
      .limit(limit)
      .select('screenshotUrl time platform metadata createdAt'); // Select specific fields

    const total = await Screenshot.countDocuments(filters);

    res.json({
      status: 'success',
      data: {
        screenshots,
        pagination: {
          total,
          offset,
          limit,
          hasMore: offset + screenshots.length < total
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

    console.error('Error fetching screenshots:', error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Failed to fetch screenshots'
    });
  }
});


router.delete('/delete-screenshot/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedScreenshot = await Screenshot.findOneAndDelete({
      _id: id,
      uploadedBy: req.userId 
    });

    if (!deletedScreenshot) {
      return res.status(404).json({
        status: 'error',
        type: 'NotFoundError',
        message: 'Screenshot not found'
      });
    }

    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { screenshots: id } }
    );

    res.json({
      status: 'success',
      data: {
        message: 'Screenshot deleted successfully',
        deletedScreenshot: {
          id: deletedScreenshot._id,
          screenshotUrl: deletedScreenshot.screenshotUrl,
          time: deletedScreenshot.time,
          platform: deletedScreenshot.platform
        }
      }
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        type: 'ValidationError',
        message: 'Invalid screenshot ID format'
      });
    }

    console.error('Error deleting screenshot:', error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Failed to delete screenshot'
    });
  }
});

// -----------havent tested report generation thingy yet, will be doing soom---------
//gotta figure out how to analyse these screenshots to generate report, using google model
const reportSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  userId: z.string().min(1, "Enter Valid User ID").optional(),
  platform: z.string().min(1, "Platform is required"),
  reportType: z.enum(["harassment", "hate_speech", "threats", "stalking", "other"]),
  userProfileDetails: z.object({
    profileUrl: z.string().optional(),
    displayName: z.string(),
    accountCreationDate: z.string().datetime().optional(),
    bio: z.string().optional(),
  }),
  flaggedMessages: z.array(z.object({
    content: z.string(),
    timestamp: z.string().datetime(),
    type: z.enum(["text", "media", "voice"]),
    severity: z.enum(["low", "medium", "high"]).optional(),
  })).min(1, "At least one flagged message is required"),
  screenshots: z.array(z.object({
    screenshotUrl: z.string().url(),
    time: z.string().datetime(),
    context: z.string().optional()
  })).optional(),
  notes: z.string().optional(),
  severity: z.enum(["low", "medium", "high", "critical"]),
});

//-> {screenshotUrl:"",userName:"",notes: "",time:"",platform:"",userProfileDetails:{},flaggedMessages:[]}
router.post('/generate-report', authMiddleware, async (req, res) => {
  try {
    const validatedData = await reportSchema.parseAsync(req.body);
    
    // Create report document
    const report = await Report.create({
      ...validatedData,
      reportedBy: req.userId,
      reportStatus: "pending",
      evidenceTimeline: [
        ...validatedData.flaggedMessages.map(msg => ({
          time: new Date(msg.timestamp),
          type: "message",
          content: msg.content,
          severity: msg.severity
        })),
        ...(validatedData.screenshots?.map(ss => ({
          time: new Date(ss.time),
          type: "screenshot",
          content: ss.screenshotUrl,
          context: ss.context
        })) || [])
      ].sort((a, b) => a.time - b.time),
      metadata: {
        generatedAt: new Date(),
        lastUpdated: new Date(),
        totalEvidence: validatedData.flaggedMessages.length + (validatedData.screenshots?.length || 0),
        platformDetails: {
          name: validatedData.platform,
          reportedUserUrl: validatedData.userProfileDetails.profileUrl
        }
      }
    });

    await User.findByIdAndUpdate(
      req.userId,
      { $push: { reports: report._id } }
    );

    res.status(201).json({
      status: 'success',
      data: {
        reportId: report._id,
        summary: {
          reportedUser: report.userName,
          platform: report.platform,
          totalEvidence: report.metadata.totalEvidence,
          severity: report.severity,
          status: report.reportStatus
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
    const { limit = 10, offset = 0, status } = req.query;
    
    const filters = { reportedBy: req.userId };
    if (status) filters.reportStatus = status;

    const reports = await Report.find(filters)
      .sort({ 'metadata.generatedAt': -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .select([
        'userName',
        'platform',
        'reportType',
        'severity',
        'reportStatus',
        'metadata.generatedAt',
        'metadata.totalEvidence'
      ]);

    const total = await Report.countDocuments(filters);

    res.json({
      status: 'success',
      data: {
        reports,
        pagination: {
          total,
          offset: Number(offset),
          limit: Number(limit),
          hasMore: offset + reports.length < total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Failed to fetch reports'
    });
  }
});


// update the total blocked messages by 1, this updated count can be viewed through profile ep
router.get('/update-blocked-messages-count', authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { totalBlockedMessages: 1 } },
      { new: true }
    ).select('totalBlockedMessages');

    if (!updatedUser) {
      return res.status(404).json({
        status: 'error',
        type: 'NotFoundError',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        totalBlockedMessages: updatedUser.totalBlockedMessages
      }
    });

  } catch (error) {
    console.error('Total hidden messages error:', error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Internal server error'
    });
  }
});


// router.post('/report-user', (req, res) => {//this will fetch generated user report for the user and then we will send it to cyberhelpline
  
// });

// endpoint to store all the hidden/flagged messages with userName of sender

// endpoint to add tag of harraser on user profile, this will return true when a lot of user hide and report someone, gotta
// maintain how many times an user has been hidden/blocked if its greater that a certain number lets say 5(maybe we can change 
// this number by changing sensitivity)

module.exports = router;