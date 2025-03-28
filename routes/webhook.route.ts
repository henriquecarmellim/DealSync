import express, { type Request, type Response, type Router } from 'express';
import { mercadopago } from '../index';
import pool from '../databases/MySQL/pool';
import { Payment } from 'mercadopago';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    switch (req.body.action) {
        case "payment.created":
            await handlePaymentCreatedEvent(req, res);
            return;
        default:
            break;
    }

    try {
        res.status(200);
        res.json({ successfully: true, message: 'Evento processado com sucesso.' });
        return;
    } catch (error) {
        console.error('Erro ao processar evento do webhook do Mercado Pago:', error);
        res.status(500);
        res.json({ error: 'Erro ao processar evento do webhook do Mercado Pago.' });
        return;
    }
});

async function handlePaymentCreatedEvent(req: Request, res: Response) {
    const { data } = req.body;

    console.log('Received request body:', JSON.stringify(req.body, null, 2));

    try {
        const payment = new Payment(mercadopago);
        const response = await payment.get({ id: data.id });

        console.log('Fetched payment metadata:', JSON.stringify(response.metadata, null, 2));

        const [[transaction]]: any = await pool.execute(
            'SELECT * FROM transactions WHERE body_id = ?',
            [response.metadata?.payment_id]
        );

        if (!transaction) {
            console.error('Transaction not found:', `No transaction found with ID ${response.metadata?.payment_id}`);
            res.status(404);
            res.json({ successfully: false, message: 'Transaction not found.' });
            return;
        }

        console.log('Transaction found:', JSON.stringify(transaction, null, 2));

        await pool.execute(
            'UPDATE transactions SET status = ? WHERE body_id = ?',
            ['approved', transaction.body_id]
        );

        console.log('Transaction status updated to approved for transaction ID:', transaction.id);

        res.status(200);
        res.json({ successfully: true, message: 'Event processed successfully.' });
        return;
    } catch (error) {
        console.error('Error processing payment created event:', error);
        res.status(500);
        res.json({ successfully: false, message: 'Error processing payment created event.' });
        return;
    }
}

export default router;