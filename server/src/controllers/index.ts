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
                const { response } = await puppeteerController.handlePuppeteer(data);
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
    handlePuppeteer: async (data: WebSocket.Data) => {
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
            const targetElement = '[name="username"]'

            await page.evaluate((shadowElement, targetElement, userName) => {
                const shadow = document.querySelector(shadowElement);
                if (!shadow) {
                    throw new Error(`Element with selector ${shadowElement} not found`);
                }
                const target = shadow?.shadowRoot?.querySelector(targetElement) as HTMLInputElement;
                if (!target) {
                    throw new Error(`Element with selector ${targetElement} not found`);
                }
                target.value = userName
                target.dispatchEvent(new Event('focus', { bubbles: true }));
                target.dispatchEvent(new Event('input', { bubbles: true }));
                shadow.dispatchEvent(new Event('blur', { bubbles: true }));
                target.click()
            }, shadowElement, targetElement, userName);
        }

        await delay(2000);

        console.log(`Succesfull input with value: ${userName}`);

        if (password){
            const shadowElement = '#login-password'
            const targetElement = '[name="password"]'

            await page.evaluate((shadowElement, targetElement, password) => {
                const shadow = document.querySelector(shadowElement);
                if (!shadow) {
                    throw new Error(`Element with selector ${shadowElement} not found`);
                }
                const target = shadow?.shadowRoot?.querySelector(targetElement) as HTMLInputElement;
                if (!target) {
                    throw new Error(`Element with selector ${targetElement} not found`);
                }
                target.value = password
                const inputEvent = new Event('input');
                target.dispatchEvent(inputEvent);
                const blurEvent = new Event('blur');
                target.dispatchEvent(blurEvent);
            }, shadowElement, targetElement, password);
        }

        await delay(2000);

        console.log(`Succesfull input with value: ${password}`);

        await browser.close();

        return {
            response: 'success'
        }
    }
}

export { clientController, wsController, puppeteerController }