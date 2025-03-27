import express, { type Request, type Response, type Router } from 'express';
import pool from '../../databases/MySQL/pool';
import { mercadopago } from '../..';
import { Preference } from 'mercadopago';
import type { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
import { v4 as uuidv4 } from 'uuid';

const router: Router = express.Router();
const preference = new Preference(mercadopago);

router.post('/', async (req: Request, res: Response) => {
  const { amount, description, currency } = req.body;
  const companySlug = req.body.companySlug.toLowerCase();

  if (!companySlug || !amount || !description) {
    res.status(400).json({ successfully: false, message: 'Parâmetros ausentes: companySlug, amount e description são obrigatórios.' });
    return
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) {
    res.status(400).json({ successfully: false, message: 'O valor de amount deve ser numérico.' });
    return
  }

  const currencyCode = currency || 'BRL';

  try {
    const [companyResult]: any = await pool.execute('SELECT slug FROM company WHERE slug = ?', [companySlug]);
    if (companyResult.length === 0) {
      res.status(404).json({ successfully: false, message: 'Empresa não encontrada.' });
      return
    }

    const bodyId = uuidv4().replace(/-/g, '').slice(0, 16);

    const preferenceData = {
      body: {
        items: [
          {
            id: bodyId,
            title: description,
            quantity: 1,
            currency_id: currencyCode,
            unit_price: parsedAmount,
          },
        ],
        back_urls: {
          success: `${process.env.APP_URL}/invoices/success`,
          failure: `${process.env.APP_URL}/invoices/failure`,
          pending: `${process.env.APP_URL}/invoices/pending`,
        },
        metadata: {
          payment_id: bodyId,
        },
        notification_url: `${process.env.APP_URL}${process.env.MERCADOPAGO_WEBHOOK_ENDPOINT}`,
      },
    } as PreferenceCreateData;

    const response = await preference.create(preferenceData);
    const preferenceId = response.id;

    // Insere o pedido usando companySlug, que é a chave primária da tabela company
    const insertOrderSql = `
      INSERT INTO orders (company_slug, amount, description, preference_id, currency, body_id)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const [orderResult]: any = await pool.execute(insertOrderSql, [companySlug, parsedAmount, description, preferenceId, currencyCode, bodyId]);

    res.status(201).json({
      successfully: true,
      message: 'Pedido criado com sucesso.',
      preferenceId,
      orderId: orderResult.insertId,
      currency: currencyCode,
      bodyId,
      preference: response
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ successfully: false, message: 'Erro ao criar pedido.' });
  }
});

export default router;

