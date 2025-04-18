import path from 'path';
import { Request, Response } from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import { puppeteerRequestController, puppeteerConnectionController } from './puppeteer'; 
import { Browser, Page } from 'puppeteer';
import { REQUEST_TYPES } from '@shared/constants';

const clientController = {
    serveClient: (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../../../client/index.html'));
    }
}

const wsController = {
    // WebSocket controller logic can be added here
    handleWebSocket: (wss : WebSocketServer) => {
        const connections : Record<string, Record<string, Browser | Page>> = {};
        
        // Handle WebSocket connections
        wss.on('connection', (ws: WebSocket) => {
            const clientId = Math.random().toString(36).substring(2, 15);
            console.log('Client connected: ' + clientId);

            ws.on('message', async (data: WebSocket.Data) => {
                const { requestType } = JSON.parse(data as string);

                if (requestType === REQUEST_TYPES.CONNECT) {
                    ws.send('Connecting...');
                    const { browser, page } = await puppeteerConnectionController.handlePuppeteerConnection(data);
                    if (!connections[clientId]) connections[clientId] = {};
                    connections[clientId]['browser'] = browser;
                    connections[clientId]['page'] = page;
                    ws.send('Connection established');
                }

                if (requestType === REQUEST_TYPES.FETCH) {
                    if (!connections[clientId]) {
                        ws.send('No connection found for client: ' + clientId);
                        return;
                    }
                    const { page } = connections[clientId] as { page: Page };
                    ws.send('Started receiving data');
                    const { response } = await puppeteerRequestController.handlePuppeteerRequest(data, page);
                    ws.send(`Return: ${response}`);
                }
            });

            ws.on('close', () => {
                console.log('client to close: ' + clientId);
                console.log('all clients: ' + Object.keys(connections));
                if (!connections[clientId]) {
                    console.log('No connection found for client: ' + clientId);
                    console.log('Client connection probably never established');
                    return;
                }
                const { browser } = connections[clientId];
                if (browser) {
                    browser.close();
                }
                delete connections[clientId];
                console.log('Browser closed');
                console.log('Client emoved');
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
                ws.send('Error: ' + error);
                ws.close();
            });
        });
    }
}



export { clientController, wsController }