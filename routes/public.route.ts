import express, { type Router, type Request, type Response, type NextFunction } from "express";
import path from "path";

const router: Router = express.Router();

router.use('/:file', (req: Request, res: Response, next: NextFunction) => {
    const filePath = path.join(__dirname, '../public/', req.params['file']);
    return res.sendFile(filePath, (err) => {
        if (err) {
            return next(err);
        }
    });
});

router.use(express.static(path.join(__dirname, 'public'), { fallthrough: false }));

export default router;

