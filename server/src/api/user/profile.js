const express = require('express');
const router = express.Router();
const { z } = require('zod');
const bcrypt = require('bcrypt');
const { User }=require("../../models/User")

const { authMiddleware }=require("../../middlewares")

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  profilePicture: z.string().url().optional(),
  preferences: z.object({
    autoGenerateReport: z.boolean(),
    autoSaveScreenshots: z.boolean(),
    enableTags: z.boolean(),
  }).optional(),
  currentPassword: z.string().min(8).optional(),
  newPassword: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must contain uppercase, lowercase, number, and special character nad should be atleast 8 characters long.'
  ).optional()
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: 'Current password is required when changing password',
  path: ['currentPassword']
});

const formatZodError = (error) => {
  const formattedErrors = {};
  
  error.errors.forEach((err) => {
      const field = err.path[0];
      formattedErrors[field] = {
          message: err.message,
          type: err.code,
          field
      };
  });
  
  return {
      status: 'error',
      type: 'ValidationError',
      errors: formattedErrors
  };
};

router.get('/profile', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.userId)
        .select('-password')
        .populate([
          { path: 'trustedContacts', select: 'name email' },
          { 
            path: 'hiddenUsers',
            model: 'HiddenUser',
            populate: {
              path: 'hiddenMessages',
              model: 'HiddenMessage',
              select: 'messageContent timeOfMessage platform metadata'
            }
          },
          { path: 'hiddenMessages', model: 'HiddenMessage' },
          { path: 'reports', model: 'Report' },
          { path: 'screenshots', model: 'Screenshot' }
        ]);
  
      if (!user) {
        return res.status(404).json({ 
          status: 'error', 
          type: 'NotFoundError', 
          message: 'User not found'
        });
      }
  
      const messageStats = {
        totalMessages: user.hiddenMessages.length,
        byPlatform: user.hiddenMessages.reduce((acc, msg) => {
          acc[msg.platform] = (acc[msg.platform] || 0) + 1;
          return acc;
        }, {}),
        byMessageType: user.hiddenMessages.reduce((acc, msg) => {
          const type = msg.metadata?.messageType || 'text';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
      };
  
      const hiddenUserStats = {
        total: user.hiddenUsers.length,
        byPlatform: user.hiddenUsers.reduce((acc, hu) => {
          acc[hu.platform] = (acc[hu.platform] || 0) + 1;
          return acc;
        }, {}),
        mostActive: user.hiddenUsers
          .sort((a, b) => (b.statistics?.totalMessagesHidden || 0) - (a.statistics?.totalMessagesHidden || 0))
          .slice(0, 5)
          .map(hu => ({
            name: hu.name,
            platform: hu.platform,
            totalMessages: hu.statistics?.totalMessagesHidden || 0,
            firstMessageDate: hu.statistics?.firstMessageHidden,
            lastMessageDate: hu.statistics?.lastMessageHidden
          }))
      };
  
      const stats = {
        totalBlockedMessages: user.totalBlockedMessages,
        totalReports: user.reports?.length || 0,
        totalScreenshots: user.screenshots?.length || 0,
        totalHiddenUsers: user.hiddenUsers?.length || 0,
        messageStats,
        hiddenUserStats
      };
  
      const recentActivity = {
        messages: user.hiddenMessages
          .sort((a, b) => b.timeOfMessage - a.timeOfMessage)
          .slice(0, 5)
          .map(msg => ({
            id: msg._id,
            content: msg.messageContent,
            time: msg.timeOfMessage,
            platform: msg.platform,
            type: msg.metadata?.messageType
          }))
      };
  
      res.json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            preferences: user.preferences,
            trustedContacts: user.trustedContacts,
            stats,
            recentActivity,
            createdAt: user.createdAt
          }
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
  

// payload-> {name: string, profilePicture: string, currentPassword: string,newPassword: string, preferences: {autoGenerateReport: false,autoSaveScreenshots: true,enableTags: true}}   
router.post('/update-profile', authMiddleware, async (req, res) => {
  try {
    const validatedData = await updateProfileSchema.parseAsync(req.body);
    const { name, profilePicture, preferences, currentPassword, newPassword } = validatedData;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        type: 'NotFoundError',
        message: 'User not found'
      });
    }

    const updatedFields = {};
    let passwordChanged = false;

    if (name && name !== user.name) {
      user.name = name;
      updatedFields.name = name;
    }
    if (profilePicture && profilePicture !== user.profilePicture) {
      user.profilePicture = profilePicture;
      updatedFields.profilePicture = profilePicture;
    }
    if (preferences && JSON.stringify(preferences) !== JSON.stringify(user.preferences)) {
      user.preferences = preferences;
      updatedFields.preferences = preferences;
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          status: 'error',
          type: 'ValidationError',
          errors: {
            currentPassword: {
              message: 'Incorrect current password',
              type: 'invalid',
              field: 'currentPassword'
            }
          }
        });
      }
      user.password = await bcrypt.hash(newPassword, 12);
      passwordChanged = true;
      updatedFields.passwordChanged = true;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        status: 'error',
        type: 'NoUpdateError',
        message: 'No changes were made'
      });
    }

    await user.save();

    res.json({
      status: 'success',
      message: `Profile updated successfully${passwordChanged ? ', password changed' : ''}`,
      data: {
        updatedFields,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(formatZodError(error));
    }
    console.error(error);
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Internal server error'
    });
  }
});

  

module.exports = router;