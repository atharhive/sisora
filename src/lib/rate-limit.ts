const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 },       // 5 per 15 min
  form: { maxRequests: 10, windowMs: 60 * 60 * 1000 },       // 10 per hour
  api: { maxRequests: 100, windowMs: 60 * 1000 },            // 100 per minute
};

export function checkRateLimit(
  identifier: string,
  type: keyof typeof RATE_LIMIT_CONFIGS = "api"
): { allowed: boolean; remaining: number; resetIn: number } {
  const config = RATE_LIMIT_CONFIGS[type];
  const now = Date.now();
  const key = `${type}:${identifier}`;

  const existing = rateLimitMap.get(key);

  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs };
  }

  if (existing.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: existing.resetTime - now,
    };
  }

  existing.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - existing.count,
    resetIn: existing.resetTime - now,
  };
}

// Clean up stale entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 60 * 1000);
}
