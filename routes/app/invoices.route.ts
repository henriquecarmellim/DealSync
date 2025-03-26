import express, { type Request, type Response, type Router } from 'express';
import pool from '../../databases/MySQL/pool';
import chalk from 'chalk';
import { mercadopago } from '../..';
import { Preference } from 'mercadopago';

const router: Router = express.Router();

const preference = new Preference(mercadopago);

router.post('/', async (req: Request, res: Response) => {
    const { companySlug, amount, description } = req.body;
  
    if (!companySlug || !amount || !description) {
      res.status(400).json({ message: 'Parâmetros ausentes: companySlug, amount e description são obrigatórios.' });
      return;
    }
  
    // Criar preferência de pagamento no Mercado Pago
    const body = {
      items: [
        {
          title: description,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: parseFloat(amount),
        },
      ],
      back_urls: {
        success: 'URL_DE_SUCESSO',
        failure: 'URL_DE_FALHA',
        pending: 'URL_DE_PENDENCIA',
      },
      notification_url: process.env.MERCADOPAGO_WEBHOOK_URL,
    };
  
    try {
      const response = await preference.create(body);

      const preferenceId = response.body.id;
  
      // Inserir o pedido no banco de dados
      const insertOrderSql = `
        INSERT INTO orders (company_slug, amount, description, preference_id)
        VALUES (?, ?, ?, ?);
      `;
      const [result]: any = await pool.query(insertOrderSql, [companySlug, amount, description, preferenceId]);
  
      return res.status(201).json({
        message: 'Pedido criado com sucesso.',
        preferenceId,
        orderId: result.insertId,
      });
    } catch (error) {
      console.error('Erro ao criar pedido no Mercado Pago:', error);
      return res.status(500).json({ message: 'Erro ao criar pedido.' });
    }
  });

export default router;

