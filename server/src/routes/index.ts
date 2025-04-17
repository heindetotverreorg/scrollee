// filepath: /typescript-express-app/typescript-express-app/server/src/routes/index.ts
import { Router } from 'express';
import path from 'path';
import { clientController } from '../controllers/index';

const router = Router();

export function setRoutes(app: any, express: any) {
    app.use('/', router);
    app.use(express.static(path.join(__dirname, '../../../client')));

    router.get('/', clientController.serveClient);
}