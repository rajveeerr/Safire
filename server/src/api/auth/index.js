const express = require('express');
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const router = express.Router();
const { User }=require("../../models/User")

const signupSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain uppercase, lowercase, number and special character'
    ),
    profilePicture: z.string().url().optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required')
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

// route: "/api/v1/auth/register" -> payload: {name: "", email: "", password: "",profilePicture:""}
router.post('/register', async (req, res) => {
  try {
    const validatedData = await signupSchema.parseAsync(req.body);
    
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(409).json({ 
        status: 'error',
        type: 'DuplicateError',
        errors: {
          email: {
            message: 'Email already registered',
            type: 'unique',
            field: 'email'
          }
        }
      });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const user = await User.create({
      ...validatedData,
      password: hashedPassword,
      preferences: {
        autoGenerateReport: false,
        autoSaveScreenshots: false,
        enableTags: true
      }
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture
        }
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(formatZodError(error));
    }
    
    res.status(500).json({ 
      status: 'error',
      type: 'ServerError',
      message: 'Internal server error'
    });
  }
});


router.post('/check-unique-email', async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                status: 'error',
                type: 'DuplicateError',
                errors: {
                    email: {
                        message: 'Email already registered',
                        type: 'unique',
                        field: 'email'
                    }
                }
            });
        }
        res.status(200).json({ status: 'success', message: 'Email is available' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: 'error',
            type: 'ServerError',
            message: 'Internal server error'
        });
    }
});

router.post('/login', async (req, res) => {
  try {
    const validatedData = await loginSchema.parseAsync(req.body);
    
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        type: 'AuthError',
        errors: {
          email: {
            message: 'Invalid Email',
            type: 'auth',
            field: 'email'
          }
        }
      });
    }

    const validPassword = await bcrypt.compare(validatedData.password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        status: 'error',
        type: 'AuthError',
        errors: {
          password: {
            message: 'Invalid Password',
            type: 'auth',
            field: 'password'
          }
        }
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture
        }
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(formatZodError(error));
    }
    
    res.status(500).json({
      status: 'error',
      type: 'ServerError',
      message: 'Internal server error'
    });
  }
});

module.exports = router;