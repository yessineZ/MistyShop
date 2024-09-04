import Redis from "ioredis"
import env from 'dotenv' ; 

env.config() ; 

export const redis = new Redis(process.env.UPSTASH_REDIS_URL) ; 
await redis.set('foo', 'bar'); 