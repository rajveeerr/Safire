const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { User }=require("../../models/User")
const { HiddenUser } = require('../../models/HiddenUser');
const { Report } = require('../../models/Report');
const { BlacklistedKeyword } = require('../../models/BlacklistedKeyword');
const { Screenshot } = require('../../models/Screenshot');
const { HiddenMessage } = require('../../models/HiddenMessage');

const { authMiddleware }=require("../../middlewares")

const profileRoutes = require('./profile');
const reportRoutes = require('./report');

const HARASSER_THRESHOLD = 5;

router.use("/",profileRoutes)
router.use("/",reportRoutes)

//-> {name: string, userId: "", platform: ""} // userId will be used to correctly identify user to hide
router.post('/hide-user', authMiddleware, async (req, res) => {
  try {
    let { name, userId, platform, profileUrl, profilePicture } = req.body;

    if (!name || !profileUrl) {
      return res.status(400).json({
        status: 'error',
        type: 'ValidationError',
        message: 'Name, ProfileUrl is required'
      });
    }

    name = name.toLowerCase();
    platform = platform ? platform.toLowerCase() : 'unknown';

    const existingHiddenUser = await HiddenUser.findOne({
      name,
      profileUrl,
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
      profileUrl,
      profilePicture,
      hiddenBy: req.userId,
      platform
    });

    await User.findByIdAndUpdate(
      req.userId,
      { $push: { hiddenUsers: hiddenUser._id } }
    );

    res.status(201).json({
      status: 'success',
      data: {
        ...hiddenUser.toObject(),
        randomProfileImage: hiddenUser.randomProfileImage
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
        total: user.hiddenUsers.length,
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
    let { userId, name, profileUrl } = req.body;

    if (!name || !profileUrl) {
      return res.status(400).json({
        status: 'error',
        type: 'ValidationError',
        message: 'Name, profileUrl are required'
      });
    }

    name = name.toLowerCase();

    const hiddenUser = await HiddenUser.findOne({
      name,
      profileUrl,
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
          profileUrl: hiddenUser.profileUrl,
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

    const lowerCaseKeywords = keywords.map(keyword => keyword.toLowerCase());

    let blacklist = await BlacklistedKeyword.findOne({ createdBy: req.userId });

    if (blacklist) {
      blacklist.keywords = [...new Set([...blacklist.keywords, ...lowerCaseKeywords])];
      await blacklist.save();
    } else {
      blacklist = await BlacklistedKeyword.create({
        keywords: lowerCaseKeywords,
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

router.delete('/blacklisted-keyword', authMiddleware, async (req, res) => {
  try {
    let { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({
        status: 'error',
        type: 'ValidationError',
        message: 'Keyword is required'
      });
    }

    keyword = keyword.toLowerCase();

    const blacklist = await BlacklistedKeyword.findOne({ createdBy: req.userId });

    if (!blacklist || !blacklist.keywords.includes(keyword)) {
      return res.status(404).json({
        status: 'error',
        type: 'NotFoundError',
        message: 'Keyword not found in blacklist'
      });
    }

    blacklist.keywords = blacklist.keywords.filter(kw => kw !== keyword);
    await blacklist.save();

    res.json({
      status: 'success',
      data: { blacklist }
    });

  } catch (error) {
    console.error('Delete blacklisted keyword error:', error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Failed to delete blacklisted keyword'
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

    const platform = validatedData.platform ? validatedData.platform.toLowerCase() : 'unknown';

    const screenshot = await Screenshot.create({
      ...validatedData,
      uploadedBy: req.userId,
      time: new Date(validatedData.time),
      platform
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

    const filters = { uploadedBy: req.userId };

    if (platform) {
      filters.platform = platform.toLowerCase();
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
      .select('screenshotUrl time platform metadata createdAt'); 

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


const hideMessageSchema = z.object({
  id: z.string().min(1, 'Enter a valid userId').optional(),
  userName: z.string().min(1, 'Username is required'),
  profileUrl: z.string().url('Valid profile URL is required'),
  profilePicUrl: z.string().url('Valid profilePic URL is required').optional(),
  messageContent: z.string().min(1, 'Message content is required'),
  timeOfMessage: z.string().datetime('Valid timestamp is required'),
  time: z.string().optional(),
  platform: z.string().optional(),
  metadata: z.object({
    messageType: z.enum(['text', 'media', 'voice']).default('text'),
    context: z.string().optional(),
    source: z.string().optional()
  }).optional()
});

async function findHiddenUser(userData, userId) {
  let hiddenUser = await HiddenUser.findOne({
      name: userData.userName,
      profileUrl: userData.profileUrl,
      hiddenBy: userId
  });
  return hiddenUser;
  
  // if (!hiddenUser) {
  //     hiddenUser = await HiddenUser.create({
  //         name: userData.userName,
  //         profileUrl: userData.profileUrl,
  //         hiddenBy: userId,
  //         platform: userData.platform || 'unknown',
  //         reason: userData.reason,
  //         'metadata.lastKnownActivity': new Date(),
  //         'metadata.associatedPlatforms': [userData.platform || 'unknown']
  //     });

  //     await User.findByIdAndUpdate(
  //         userId,
  //         { $push: { hiddenUsers: hiddenUser._id } }
  //     );
  // }
}

router.post('/hide-message', authMiddleware, async (req, res) => {
  try {
      const validatedData = await hideMessageSchema.parseAsync(req.body);

      validatedData.userName = validatedData.userName.toLowerCase();
      validatedData.platform = validatedData.platform ? validatedData.platform.toLowerCase() : 'unknown';

      const existingMessage = await HiddenMessage.findOne({
          messageContent: validatedData.messageContent,
          userName: validatedData.userName,
          profileUrl: validatedData.profileUrl,
          hiddenBy: req.userId,
          platform: validatedData.platform
      });

      if (existingMessage) {
          return res.status(409).json({
              status: 'error',
              type: 'DuplicateError',
              message: 'This message has already been hidden'
          });
      }
      
      const hiddenUser = await findHiddenUser(validatedData, req.userId);

      const hiddenMessage = await HiddenMessage.create({
          ...validatedData,
          timeOfMessage: new Date(validatedData.timeOfMessage),
          hiddenBy: req.userId,
          relatedHiddenUser: hiddenUser?._id || null
      });

      await User.findByIdAndUpdate(
          req.userId,
          {
              $inc: { totalBlockedMessages: 1 },
              $push: { hiddenMessages: hiddenMessage._id }
          }
      );

      const messageType = validatedData.metadata?.messageType || 'text';
      if(hiddenUser){
        await HiddenUser.findByIdAndUpdate(
            hiddenUser._id,
            {
                $push: { hiddenMessages: hiddenMessage._id },
                $inc: {
                    'statistics.totalMessagesHidden': 1,
                    [`statistics.messageTypes.${messageType}`]: 1
                },
                $set: {
                    'statistics.lastMessageHidden': new Date(),
                    'metadata.lastKnownActivity': validatedData.timeOfMessage
                },
                $setOnInsert: {
                    'statistics.firstMessageHidden': new Date()
                }
            },
            { new: true }
        );
      }

      res.status(201).json({
          status: 'success',
          data: {
              hiddenMessage: {
                  id: hiddenMessage._id,
                  userName: hiddenMessage.userName,
                  profileUrl: hiddenMessage.profileUrl,
                  profilePicUrl: hiddenMessage.profilePicUrl,
                  messageContent: hiddenMessage.messageContent,
                  timeOfMessage: hiddenMessage.timeOfMessage,
                  time: hiddenMessage.time,
                  platform: hiddenMessage.platform,
                  metadata: hiddenMessage.metadata,
                  relatedHiddenUser: {
                      id: hiddenUser?._id,
                      name: hiddenUser?.name,
                      statistics: hiddenUser?.statistics
                  }||null
              }
          }
      });

  }  catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: 'error',
        type: 'DuplicateError',
        message: 'This message has already been hidden'
      });
    }

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

    console.error('Hide message error:', error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError', 
      message: 'Failed to hide message'
    });
  }
});
router.get('/hidden-messages', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      userName,
      platform,
      startDate,
      endDate,
      messageType,
      sortBy = 'timeOfMessage',
      sortOrder = 'desc'
    } = req.query;
    
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 20);
    
    let matchStage = { hiddenBy: new mongoose.Types.ObjectId(req.userId) };
    
    if (userName) {
      matchStage.userName = { $regex: new RegExp(userName.toLowerCase(), 'i') };
    }
    
    if (platform) {
      matchStage.platform = platform.toLowerCase();
    }
    
    if (messageType) {
      matchStage['metadata.messageType'] = messageType;
    }
    
    if (startDate || endDate) {
      matchStage.timeOfMessage = {};
      if (startDate) matchStage.timeOfMessage.$gte = new Date(startDate);
      if (endDate) matchStage.timeOfMessage.$lte = new Date(endDate);
    }
    
    const totalCount = await HiddenMessage.countDocuments(matchStage);
    
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'hiddenusers',
          localField: 'relatedHiddenUser',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      { $skip: (pageNum - 1) * limitNum },
      { $limit: limitNum }
    ];
    
    const messages = await HiddenMessage.aggregate(pipeline);
    
    res.status(200).json({
      status: 'success',
      data: {
        messages: messages.map(msg => ({
          id: msg._id,
          userName: msg.userName,
          profileUrl: msg.profileUrl,
          profilePicUrl: msg.profilePicUrl,
          messageContent: msg.messageContent,
          timeOfMessage: msg.timeOfMessage,
          platform: msg.platform,
          metadata: msg.metadata,
          relatedHiddenUser: msg.userDetails.length > 0 ? {
            id: msg.userDetails[0]._id,
            name: msg.userDetails[0].name,
            statistics: msg.userDetails[0].statistics
          } : null
        })),
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalItems: totalCount,
          itemsPerPage: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Fetch hidden messages error:', error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Failed to fetch hidden messages'
    });
  }
});

//we will allow users to search for harraser status for any other user from dashboard
router.get('/check-harasser', async (req, res) => {
  try {
    let { name, profileUrl } = req.query;

    if (!name || !profileUrl) {
      return res.status(400).json({
        status: 'error',
        type: 'ValidationError',
        message: 'Name and profileUrl are required query parameters'
      });
    }

    name = name.toLowerCase();

    const hiddenInstances = await HiddenUser.find({
      name,
      profileUrl
    }).populate('hiddenBy', 'name email');

    const uniqueHiders = new Set(hiddenInstances.map(instance => 
      instance.hiddenBy._id.toString()
    ));
    const hideCount = uniqueHiders.size;
    const isHarasser = hideCount >= HARASSER_THRESHOLD;

    if (hiddenInstances.length > 0 && 
        hiddenInstances[0].isHarasser !== isHarasser) {
      await HiddenUser.updateMany(
        { name, profileUrl },
        { 
          $set: {
            isHarasser,
            totalHideCount: hideCount,
            lastReviewDate: new Date()
          }
        }
      );
    }

    const reports = await Report.find({
      name,
      'userProfileDetails.profileUrl': profileUrl
    }).select('reportType severity status createdAt');

    res.json({
      status: 'success',
      data: {
        isHarasser,
        statistics: {
          totalUniqueHiders: hideCount,
          threshold: HARASSER_THRESHOLD,
          totalReports: reports.length,
          reportSeverityBreakdown: reports.reduce((acc, report) => {
            acc[report.severity] = (acc[report.severity] || 0) + 1;
            return acc;
          }, {}),
          reportTypeBreakdown: reports.reduce((acc, report) => {
            acc[report.reportType] = (acc[report.reportType] || 0) + 1; 
            return acc;
          }, {})
        },
        hiddenBy: hiddenInstances.map(instance => ({
          userId: instance.hiddenBy._id,
          name: instance.hiddenBy.name,
          date: instance.createdAt,
          reason: instance.reason || 'Not specified'
        })),
        lastReviewDate: new Date(),
        metadata: {
          name,
          profileUrl,
          recentReports: reports
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 3)
            .map(report => ({
              type: report.reportType,
              severity: report.severity,
              status: report.status,
              date: report.createdAt
            }))
        }
      }
    });
  } catch (error) {
    console.error('Check harasser status error:', error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Failed to check harasser status'
    });
  }
});

router.get('/check-dummy-harasser', async (req, res) => {
    res.json({
      status: 'success',
      data: {
        isHarasser: true
      }
    })
});

router.get('/known-harassers', authMiddleware, async (req, res) => {
  try {
    const { platform } = req.query;
    const query = { isHarasser: true };
    if (platform) {
      query.platform = platform.toLowerCase();
    }
    const harassers = await HiddenUser.find(query)
      .select('name profileUrl platform totalHideCount lastReviewDate randomProfileImage')
      .sort({ totalHideCount: -1 });

    const uniqueHarassers = Array.from(
      harassers.reduce((map, user) => {
        if (!map.has(user.profileUrl)) {
          map.set(user.profileUrl, {
            name: user.name,
            profileUrl: user.profileUrl,
            platform: user.platform,
            totalHideCount: user.totalHideCount,
            lastReviewDate: user.lastReviewDate,
            randomProfileImage: user.randomProfileImage
          });
        }
        return map;
      }, new Map())
    ).map(([_, value]) => value);
    res.json({
      status: 'success',
      data: {
        harassers: uniqueHarassers,
        total: uniqueHarassers.length,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Fetch known harassers error:', error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Failed to fetch known harassers'
    });
  }
});

// router.post('/review-harraser-status', (req, res) => { 
// });


module.exports = router;