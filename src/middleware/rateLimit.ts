import rateLimit from "express-rate-limit";
import { failure } from "../utils/apiResponse";

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    failure(res, 429, "Too many login attempts. Please wait a minute and try again.");
  },
});
