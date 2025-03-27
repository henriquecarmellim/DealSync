import express, { type Request, type Response, type Router } from 'express';
import { mercadopago } from '../index';
import pool from '../databases/MySQL/pool';
import { Payment, Preference } from 'mercadopago';

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
        res.status(200).json({ successfully: true, message: 'Evento processado com sucesso.' });
    } catch (error) {
        console.error('Erro ao processar evento do webhook do Mercado Pago:', error);
        res.status(500).json({ error: 'Erro ao processar evento do webhook do Mercado Pago.' });
    }
});

async function handlePaymentCreatedEvent(req: Request, res: Response) {
    const { data } = req.body;

    console.log('Received request body:', JSON.stringify(req.body, null, 2));

    try {
        const payment = new Payment(mercadopago);
        const response = await payment.get({ id: data.id });

        console.log('Fetched payment metadata:', JSON.stringify(response.metadata, null, 2));

        const [[order]]: any = await pool.execute(
            'SELECT * FROM orders WHERE body_id = ?',
            [response.metadata?.payment_id]
        );

        if (!order) {
            console.error('Order not found:', `No order found with ID ${response.metadata?.payment_id}`);
            return res.status(404).json({ successfully: false, message: 'Order not found.' });
        }

        console.log('Order found:', JSON.stringify(order, null, 2));

        await pool.execute(
            'UPDATE orders SET status = ? WHERE body_id = ?',
            ['approved', order.body_id]
        );

        console.log('Order status updated to approved for order ID:', order.id);

        return res.status(200).json({ successfully: true, message: 'Event processed successfully.' });
    } catch (error) {
        console.error('Error processing payment created event:', error);
        return res.status(500).json({ successfully: false, message: 'Error processing payment created event.' });
    }
}

export default router;
