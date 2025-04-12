import express from 'express';
import { WebSocketServer } from 'ws';
import { setRoutes } from './routes/index';
import { wsController } from './controllers/index';

const app = express();
const S_PORT = 3002;
const WS_PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
setRoutes(app, express);

// Setup server
app.listen(S_PORT, () => {
    console.log(`Server is running on http://localhost:${S_PORT}`);
});

// Set up websocket
const wss = new WebSocketServer({ port: WS_PORT });
wsController.handleWebSocket(wss);