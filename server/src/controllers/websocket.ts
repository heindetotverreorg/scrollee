import WebSocket, { WebSocketServer } from 'ws';
import { puppeteerRequestController, puppeteerConnectionController } from './puppeteer'; 
import { Browser,Page } from 'puppeteer';
import { REQUEST_TYPES } from '@shared/constants';
import { StreamConnectionsPayload, StreamResponse, StreamStatus } from '@shared/types';


const wsController = {
    handleWebSocket: (wss : WebSocketServer) => {
        const connections : Record<string, Record<string, Browser | Page>>  = {};
        
        wss.on('connection', (ws: WebSocket) => {
            const clientId = Math.random().toString(36).substring(2, 15);
            console.log('Client connected: ' + clientId);

            ws.on('message', async (data: WebSocket.Data) => {
                const { requestType } = JSON.parse(data as string);

                if (requestType === REQUEST_TYPES.CONNECT) {
                    connectToStream({ ws, data, connections, clientId });
                }

                if (requestType === REQUEST_TYPES.FETCH) {
                    fetchFromStream({ ws, data, connections, clientId });
                }
            });

            ws.on('close', () => {
                closeStream({ connections, clientId });
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
                ws.send(makeMessage(StreamStatus.ERROR, clientId, undefined, error.message));
                
                ws.close();
            });
        });
    }
}

export { wsController }

const connectToStream = async ({ ws, data, connections, clientId } : StreamConnectionsPayload) => {
    ws?.send(makeMessage(StreamStatus.CONNECTING, clientId));

    const { browser, page } = await puppeteerConnectionController.handlePuppeteerConnection(data as string);
    if (!connections[clientId]) connections[clientId] = {};
    connections[clientId]['browser'] = browser;
    connections[clientId]['page'] = page;

    ws?.send(makeMessage(StreamStatus.CONNECTED, clientId));
}

const fetchFromStream = async ({ ws, data, connections, clientId } : StreamConnectionsPayload) => {
    if (!connections[clientId]) {
        ws?.send(makeMessage(StreamStatus.ERROR, clientId, undefined, 'No connection found'));

        return;
    }
    const { page } = connections[clientId] as { page: Page };
    ws?.send(makeMessage(StreamStatus.PENDING));
    const response = await puppeteerRequestController.handlePuppeteerRequest(data as string, page);
    ws?.send(JSON.stringify(response));
}

const closeStream = async ({ connections, clientId } : StreamConnectionsPayload) => {
    console.log('client to close: ' + clientId);
    console.log('all clients: ' + Object.keys(connections));
    if (!connections[clientId]) {
        console.log('No connection found for client: ' + clientId);
        console.log('Client connection never established');
        return;
    }

    const { browser } = connections[clientId];
    if (browser) {
        browser.close();
    }

    delete connections[clientId];
    console.log('Browser closed');
    console.log('Client emoved');
}

const makeMessage = (state: StreamStatus, clientId?: string,  data?: string, error?: string) => {
    return JSON.stringify({
        streamData: data,
        streamStatus: state,
        error,
        clientId
    } as StreamResponse)
}