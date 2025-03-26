import type { Request, Response, NextFunction } from 'express';

/**
 * Verifica se o token de acesso est  presente e se   vlido.
 *
 * @param {Request} req - Requisi o recebida.
 * @param {Response} res - Resposta a ser enviada.
 * @param {NextFunction} next - Fun o a ser chamada ap s a verificao.
 */
export default function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-access-token'] as string;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token missing' });
  }

  if (token !== process.env.APP_MIDDLEWARE) {
    return res.status(403).json({ error: 'Forbidden - Invalid token' });
  }

  next();
}
