import { NextRequest } from 'next/server';
import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
  interval: number; // in milliseconds
  uniqueTokenPerInterval: number;
};

export class RateLimit {
  private cache: LRUCache<string, number>;

  constructor(options: RateLimitOptions) {
    this.cache = new LRUCache<string, number>({
      max: options.uniqueTokenPerInterval || 500,
      ttl: options.interval || 60000, // 1 minute
    });
  }

  public async check(request: NextRequest, limit: number = 100): Promise<{ success: boolean; remaining: number }> {
    const clientId = this.getClientId(request);
    const tokenCount = this.cache.get(clientId) || 0;
    
    if (tokenCount >= limit) {
      return { success: false, remaining: 0 };
    }
    
    this.cache.set(clientId, tokenCount + 1);
    return { success: true, remaining: limit - (tokenCount + 1) };
  }

  private getClientId(request: NextRequest): string {
    // Try to get client IP from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    
    const ip = forwarded || realIp || cfConnectingIp || 'unknown';
    
    // Combine IP and user agent for better uniqueness
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    return `${ip}-${userAgent}`;
  }
}

// Default rate limiter instance
export const rateLimit = new RateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

// Middleware function for API routes
export async function applyRateLimit(request: NextRequest, limit: number = 100) {
  const result = await rateLimit.check(request, limit);
  
  if (!result.success) {
    throw new Error('Rate limit exceeded');
  }
  
  return result;
}