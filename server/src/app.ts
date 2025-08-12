import express from 'express';
import { serverConfig } from '@shared/env/config'
import WebSocket from 'ws';
import http from 'http';
import { setRoutes } from './routes/index';
import { wsController } from './controllers/websocket';

const app = express();
const S_PORT = serverConfig.serverPort;
const WS_PORT = serverConfig.wsPort;
const host = serverConfig.wsHost;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Set up routes
setRoutes(app, express);

// Setup server
app.listen(S_PORT, () => {
    console.log(`Server is running on port ${S_PORT}`);
});

// Set up WebSocket server
const server = http.createServer(app);

const wss = new WebSocket.Server({
    server,
    path: '/ws',
    clientTracking: true,
});

wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
    wss.close();
});

server.listen(parseInt(WS_PORT as string), host as string, () => {
    const address = server.address();
    console.log(`WebSocket server is listening on ${JSON.stringify(address)}`);
})

wsController.handleWebSocket(wss);