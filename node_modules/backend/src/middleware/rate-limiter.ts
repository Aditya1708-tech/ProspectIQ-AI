import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 login requests per 15 minutes for testing
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many login attempts from this IP, please try again after 15 minutes'
    }
  },
  standardHeaders: true, // Return rate limit info in standard headers
  legacyHeaders: false // Disable legacy headers
});
