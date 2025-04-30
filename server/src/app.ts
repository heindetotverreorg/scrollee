import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import { setRoutes } from './routes/index';
import { wsController } from './controllers/index';

const app = express();
const S_PORT = process.env.VITE_S_PORT || '3001';
const WS_PORT = process.env.VITE_WS_PORT || '3002';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
setRoutes(app, express);

// Setup server
app.listen(S_PORT, () => {
    console.log(`Server is running on http://localhost:${S_PORT}`);
});
const server = http.createServer()

// Set up websocket
const wss = new WebSocketServer({ server });
wsController.handleWebSocket(wss);
server.listen(WS_PORT, () => {
    console.log(`WebSocket server is running on ws://localhost:${WS_PORT}`);
});