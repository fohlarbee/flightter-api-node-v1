import { env } from '#/lib/env';
import { createClient } from 'redis';


const redisConnect = async() => {
    const client = createClient({url:env.REDIS_URL});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect().then(() => console.log('connected to redis')).catch(err => console.log('Error connecting to redis', err))

}
 redisConnect() ;