// filepath: /typescript-express-app/typescript-express-app/server/src/types/index.ts
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export interface Request extends ExpressRequest {
    // Add any custom properties to the request here
}

export interface Response extends ExpressResponse {
    // Add any custom properties to the response here
}