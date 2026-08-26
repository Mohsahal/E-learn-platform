require('dotenv').config();
const Redis = require('ioredis');

async function clearCache() {
  let redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.error("No REDIS_URL found in .env");
    return;
  }
  
  if (redisUrl.includes('upstash.io') && redisUrl.startsWith('redis://')) {
    redisUrl = redisUrl.replace('redis://', 'rediss://');
  }

  const redisOptions = {};
  if (redisUrl.startsWith('rediss://')) {
    redisOptions.tls = { rejectUnauthorized: false };
  }

  const redisClient = new Redis(redisUrl, redisOptions);

  redisClient.on('connect', async () => {
    console.log("Connected to Redis. Clearing cache...");
    try {
      const keys = await redisClient.keys("courses:*");
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(`Cleared ${keys.length} cache keys!`);
      } else {
        console.log("No course cache keys found.");
      }
      process.exit(0);
    } catch (err) {
      console.error("Error clearing cache:", err);
      process.exit(1);
    }
  });

  redisClient.on('error', (err) => {
    console.error("Redis connection error:", err.message);
    process.exit(1);
  });
}

clearCache();
