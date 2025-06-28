import path from 'path';
import { Request, Response } from 'express';

const clientController = {
    serveClient: (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../../../client/index.html'));
    }
}

export { clientController };