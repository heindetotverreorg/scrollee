import path from 'path';
import { Request, Response } from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const delay = (time : number) => {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
  }


const clientController = {
    serveClient: (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../../../dist/client/index.html'));
    }
}

const wsController = {
    // WebSocket controller logic can be added here
    handleWebSocket: (wss : WebSocketServer) => {
        // Handle WebSocket connections
        wss.on('connection', (ws: WebSocket) => {
            ws.on('message', async (data: WebSocket.Data) => {
                const { response } = await puppeteerController.handlePuppeteerRequest(data);
                ws.send(`Return: ${response}`);
            });
            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
    }
}

const puppeteerController = {
    // Puppeteer controller logic can be added here
    handlePuppeteerRequest: async (data: WebSocket.Data) => {
        console.log(`Puppeteer received: ${data}`);

        const {
            streamConfig: { url, loginData: { userName, password } },
        } = JSON.parse(data as string);

        puppeteer.use(StealthPlugin());

        // Here you can add your Puppeteer logic
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'networkidle2',
        });

        if (userName){
            const shadowElement = '#login-username'

            await page.click(`pierce/${shadowElement}`);
            await page.type(`pierce/${shadowElement}`, userName, { delay: 100 });
            // await page.keyboard.press('Enter');

            console.log(`Succesfull input with value: ${userName}`);
        }

        await delay(2000);

        if (password){
            const shadowElement = '#login-password'

            await page.click(`pierce/${shadowElement}`);
            page.type(`pierce/${shadowElement}`, password, { delay: 100 });

            console.log(`Succesfull input with value: ${password}`);
        }

        await delay(2000);

        await page.keyboard.press('Enter');

        await page.waitForNavigation({
            waitUntil: 'networkidle2',
        });
        console.log('Page loaded');

        await delay(10000);

        await browser.close();

        return {
            response: 'success'
        }
    }
}

export { clientController, wsController, puppeteerController }