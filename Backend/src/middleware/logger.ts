import { Request, Response, NextFunction } from 'express';

function logger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, url } = req;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        
        console.log(`[${new Date().toISOString()}] ${method} ${url} | Status: ${status} | ${duration}ms`);
    });

    next();
}

export default logger;