import express, { type Router, type Request, type Response } from 'express';
import * as path from 'path';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
    
router.get('/dashboard', (req: Request, res: Response) => {
    res.redirect('/pages/dashboard');
})

export default router;

