// filepath: /typescript-express-app/typescript-express-app/server/src/routes/index.ts
import { Router } from 'express';
import path from 'path';
import { clientController } from '@/controllers/client';
import { mongoController } from '@/controllers/mongo';
import cors from 'cors';

const router = Router();

export function setRoutes(app: any, express: any) {
    const corsOptions = {
        origin: 'http://localhost:3000',
    }

    app.use(cors(corsOptions));

    app.use('/', router);
    app.use(express.static(path.join(__dirname, '../../../client')));

    router.get('/', clientController.serveClient);
    router.post('/db/connect', mongoController.connectToMongoClient);
}