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
            // headless: process.env.NODE_ENV === 'production',
            headless: true,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage'
            ],
            env: {
                DISPLAY: ":10.0"
            }
        });

        const page = await browser.newPage();

        await page.setViewport({
            width: 1920,
            height: 1080,
        });

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        );

        await page.goto(url, {
            waitUntil: 'networkidle2',
        });

        if (useLogin) {
            await login(config as StreamConfig, page)

            // log all requests and responses related to login
            page.on("request", async (request) => {
                const url = request.url();
                const method = request.method();
                const postData = request.postData();

                if (method === 'POST' && url.includes('reddit.com/svc/shreddit/account/login')) {
                    console.log(`Request made to: ${url}`);
                    console.log(`Method: ${method}`);
                    console.log(`Post data: ${postData}`);
                }
            })

            page.on("response", async (response) => {
                const url = response.url();
                const status = response.status();
                const statusText = response.statusText();

                if (status !== 200 && status !== 204 && status !== 206) {
                    console.log(`Response received from: ${url}`);
                    console.log(`Status: ${status}`);
                    console.log(`Status text: ${statusText}`);
                }
            });
    
            try {
                await page.waitForNavigation({
                    waitUntil: 'networkidle2',
                });
            } catch (error) {
                page.screenshot({ path: 'error.png' });
                console.log('Error during navigation:', error);
                console.log('Screenshot saved as error.png');

                console.log('Login failed, please check your credentials and try again.');

                return {
                    browser,
                    page
                }
            }
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
            stream: { name },
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

    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();

    await page.click('button.login')
}