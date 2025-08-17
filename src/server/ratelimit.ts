import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { calculateTimeStringRemaining } from "@/lib/utils";

export const redis = Redis.fromEnv();

export class RateLimitService {
  private static instance: RateLimitService;
  private limiters: Record<string, Ratelimit> = {};
  private ttls: Record<string, number> = {};
  private friendlyName: Record<string, string> = {
    'hwidreset': 'HWID Reset - /resethwid',
    'syncuser': 'Luarmor User Sync - users/(discord_id)'
  };

  //"...in general you can make 60 requests per minute."
  private luarmorRatelimitConfig = {
    time: 60 * 1000,
    maxreq: 60
  };

  private constructor() {
    this.createLimiter("hwidreset", {
      analytics: false,
      prefix: "ratelimit:hwidreset",
      limiter: Ratelimit.slidingWindow(1, "6h"),
    }, 6 * 60 * 60 * 1000); // 6 hours in ms
    
    this.createLimiter("syncuser", {
      analytics: true,
      prefix: "ratelimit:syncuser",
      limiter: Ratelimit.slidingWindow(2, "5m"),
    }, 5 * 60 * 1000); // 5 minutes in ms

    this.createLimiter("redeemkey", {
      analytics: true,
      prefix: "ratelimit:redeemkey",
      limiter: Ratelimit.slidingWindow(10, "2m"),
    }, 2 * 60 * 1000); // 2 minutes in ms

  }

  public static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService();
    }
    return RateLimitService.instance;
  }

  public createLimiter(
    name: string,
    config: {
      analytics: boolean;
      prefix: string;
      limiter: Ratelimit["limiter"];
    },
    ttl: number // TTL in milliseconds
  ): Ratelimit {
    if (!this.limiters[name]) {
      this.limiters[name] = new Ratelimit({
        redis,
        ...config,
      });
      this.ttls[name] = ttl;
    }
    return this.limiters[name];
  }

  public getLimiter(name: string): Ratelimit {
    if (!this.limiters[name]) {
      throw new Error(`Rate limiter ${name} not found`);
    }
    return this.limiters[name];
  }

  public async trackRequest(
    endpoint: string,
    identifier: string = 'mspaint_admin_server'
  ): Promise<void> {
    const key = `ratelimit:${endpoint}`;
    const now = Date.now();
    const ttl = this.ttls[endpoint] || 30 * 60 * 1000; // Default to 30 minutes
    const expireAt = now + ttl;
    
    await redis.zadd(key, { score: expireAt, member: `${identifier}:${now}` });
    await redis.expire(key, Math.ceil(ttl / 1000)); // Convert ms to seconds
  }

  public async getMetrics() {
    const now = Date.now();
    const results = [];
    
    for (const [name, _] of Object.entries(this.limiters)) {
      const key = `ratelimit:${name}`;
      
      // Get all members (we'll filter by timestamp later)
      const members = await redis.zrange(key, 0, "+inf", { byScore: true }) as string[];

      // Filter and process members
      const validMembers = members.filter(member => {
        const [_, timestampStr] = member.split(':');
        const timestamp = parseInt(timestampStr, 10);
        return (now - timestamp) <= this.luarmorRatelimitConfig.time;
      });
      
      // Count unique users
      const uniqueUsers = new Set<string>();
      members.forEach(member => {
        const [userId] = member.split(':');
        uniqueUsers.add(userId);
      });
      
      results.push({
        name: this.friendlyName[name] ?? `${name} - key`,
        api_usage: validMembers.length,
        api_maxusage: this.luarmorRatelimitConfig.maxreq,
        total: members.length,
        users: uniqueUsers.size,
        time_limit: calculateTimeStringRemaining(Date.now(), this.ttls[name])[0]
      });
    }
    
    return results;
  }
}

export const rateLimitService = RateLimitService.getInstance();
