import express, { type Request, type Response, type Application } from 'express';
import { registerRoutes } from './handlers/route.handler';
import dotenv from 'dotenv';
import mpsdk, { Payment } from 'mercadopago';
import chalk from 'chalk';
dotenv.config();

export const mercadopago = new mpsdk({
    accessToken: process.env.MERCADOPAGO_PRODUCTION_ACCESS_TOKEN as string
});

const app: Application = express();

app.use(express.json({ limit: '10mb' }));

async function main() {
    await registerRoutes(app);

    app.listen(process.env.APPLICATION_PORT, () => {
        console.log(chalk.bgGreen.black(` ONLINE `),chalk.white(`Acesse o servidor:`),chalk.yellow(`http://localhost:${process.env.APPLICATION_PORT}`));
    });
}

main();

