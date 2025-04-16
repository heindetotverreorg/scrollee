import path from 'path';
import { Request, Response } from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import { puppeteerRequestController, puppeteerConnectionController } from './puppeteer'; 
import { Browser, Page } from 'puppeteer';

const clientController = {
    serveClient: (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../../../dist/client/index.html'));
    }
}

const wsController = {
    // WebSocket controller logic can be added here
    handleWebSocket: (wss : WebSocketServer) => {
        const connections : Record<string, Record<string, Browser | Page>> = {};
        // Handle WebSocket connections
        wss.on('connection', (ws: WebSocket) => {
            const clientId = Math.random().toString(36).substring(2, 15);
            try {
                console.log('Client connected: ' + clientId);
                ws.on('message', async (data: WebSocket.Data) => {
                    const { connectionConfig } = JSON.parse(data as string);
                    if (connectionConfig === 'setupConnection') {
                        const { browser, page } = await puppeteerConnectionController.handlePuppeteerConnection(data);
                        if (!connections[clientId]) connections[clientId] = {};
                        connections[clientId]['browser'] = browser;
                        connections[clientId]['page'] = page;
                        ws.send('Connection established');
                    }
    
                    if (connectionConfig === 'receiveData') {
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
                    const { browser } = connections[clientId];
                    if (browser) {
                        browser.close();
                    }
                    delete connections[clientId];
                    console.log('Browser closed');
                    console.log('Client disconnected');
                });
            } catch (error) {
                console.error(`Error handling WebSocket connection ${clientId}:', ${error}`);
                ws.send('Error occurred for client: ' + clientId);
            }
        });
    }
}



export { clientController, wsController, puppeteerRequestController }