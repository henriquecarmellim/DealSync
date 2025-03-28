import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Conectado ao Redis com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao Redis:', error);
  }
})();

export default redisClient;
