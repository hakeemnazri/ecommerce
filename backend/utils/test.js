import Redis from "ioredis"

export const redis = new Redis("rediss://default:Aef1AAIjcDFhMmNhMDdhOTZlYmY0YjJmOTQ5NTg0MWNmMDc1NzY5ZnAxMA@splendid-tomcat-59381.upstash.io:6379");

async function hehe(){
    try {
        // Set the cache with a TTL of 30 seconds (EX 30)
        const reply = await redis.set('time', '1min', 'EX', 30);
        console.log('booking set:', reply);  // Should log: booking set: OK
      } catch (err) {
        console.error('Error setting cache:', err);
      }
}

await hehe()

  setTimeout(async () => {
    try {
      // Attempt to get the cache from Redis
      const cachedValue = await redis.get('time');
      
      if (cachedValue === null) {
        // If cache does not exist (expired or never set), log "finish"
        console.log('bonts kamu habis ah hehehehehehe');
        return
      } else {
        console.log('Cache still available:', cachedValue);
      }
    } catch (error) {
      console.error('Error checking cache:', error);
    }
  }, 30 * 1000); // Timeout set for 1 minute (60 seconds)


  console.log("hehehehehehehehehe")