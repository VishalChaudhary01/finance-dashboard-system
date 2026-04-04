import rateLimit from "express-rate-limit";

// Base Limiter — applied to all routes
export const baseLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// Auth Limiter — applied to signin only
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes.",
  },
});
