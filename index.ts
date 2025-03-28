import express, { type Application } from 'express';
import { registerRoutes } from './handlers/route.handler';
import dotenv from 'dotenv';
import mpsdk from 'mercadopago';
import chalk from 'chalk';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import redisClient from './databases/Redis/pool';
import { setupWebSocket } from './handlers/websocket.handler';

dotenv.config();

export const mercadopago = new mpsdk({
  accessToken: process.env.MERCADOPAGO_TEST_SECOND_ACCESS_TOKEN as string,
});

async function checkRedis() {
  try {
    const response = await redisClient.ping();
    console.log(chalk.green(`Redis online: ${response}`)); // Deve imprimir "PONG"
  } catch (error) {
    console.error(chalk.red('Erro ao conectar no Redis:'), error);
  }
}

const app: Application = express();
export const server = http.createServer(app);
app.use(express.json({ limit: '10mb' }));

async function main() {
  await checkRedis();
  await setupWebSocket(server);
  await registerRoutes(app);

  const port = process.env.APPLICATION_PORT || 3000;

  server.listen(port, () => {
    console.log(
      chalk.bgGreen.black(' ONLINE '),
      chalk.white('Acesse o servidor:'),
      chalk.yellow(`http://localhost:${port}`)
    );
  });
}

main();
