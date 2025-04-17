import puppeteer from 'puppeteer-extra';
import { Page } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import WebSocket from 'ws';
import { Stream, StreamConfig } from '@shared/types';

const delay = (time : number) => {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

const puppeteerConnectionController = {
    handlePuppeteerConnection: async (data: WebSocket.Data) => {
        puppeteer.use(StealthPlugin());

        const {
            stream,
        } = JSON.parse(data as string);

        const {
            url,
            config,
        } = stream as Stream;

        const {
            useLogin,
        } = config as StreamConfig;

        const browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === 'production',
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

        if (useLogin) {
            await login(config as StreamConfig, page)
            await page.keyboard.press('Enter');
    
            await page.waitForNavigation({
                waitUntil: 'networkidle2',
            });
        }

        console.log('Page loaded');

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
            stream,
        } = JSON.parse(data as string);

        const {
            name,
        } = stream as Stream;

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
            response: `succes: ${name} : ${articles.length} articles found`,
        }
    }
}

export { puppeteerConnectionController, puppeteerRequestController }

const login = async (config : StreamConfig, page : Page) => {
    const { loginData, selectors } = config;

    for (const [loginStep, loginValue] of Object.entries(loginData)) {
        const selector = selectors[loginStep].useShadowRoot
        ? `pierce/${selectors[loginStep].selector}`
        : selectors[loginStep].selector as string

        console.log(`do actions for ${loginStep} with selector: ${selector}`);

        await page.click(selector);
        await page.type(selector, loginValue, { delay: 100 });

        console.log(`Succesfull input at ${selector} with value: ${loginValue}`);

        await delay(2000);
    }
}