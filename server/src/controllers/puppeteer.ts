import puppeteer from 'puppeteer-extra';
import { Page } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import WebSocket from 'ws';

const delay = (time : number) => {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

const puppeteerConnectionController = {
    handlePuppeteerConnection: async (data: WebSocket.Data) => {
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

        await page.setViewport({
            width: 1920,
            height: 1080,
        });

        await page.goto(url, {
            waitUntil: 'networkidle2',
        });

        if (userName && password) {
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
        }

        return {
            browser,
            page
        }
    }
}

const puppeteerRequestController = {
    // Puppeteer controller logic can be added here
    handlePuppeteerRequest: async (data: WebSocket.Data, page: Page) => {
        const {
            streamConfig: { streamName }
        } = JSON.parse(data as string);

        const articles = await page.evaluate(() => {
            const elements = document.getElementsByTagName('article');
            return Array.from(elements).map(article => ({
                text: article.textContent,
                html: article.innerHTML
            }));
        });

        console.log('Found articles:', articles.length);

        await delay(10000);

        return {
            response: `succes: ${streamName} : ${articles.length} articles found`,
        }
    }
}

export { puppeteerConnectionController, puppeteerRequestController }