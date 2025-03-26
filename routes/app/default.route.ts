import express, { type Request, type Response, type Router } from 'express';
import pool from '../../databases/MySQL/pool';

const router: Router = express.Router();

// Criar uma empresa
router.get('/', async (req: Request, res: Response) => {
    res.send("Hello World")
});

export default router;