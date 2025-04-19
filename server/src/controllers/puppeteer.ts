import puppeteer from 'puppeteer-extra';
import { Page, Browser, KnownDevices, ElementHandle } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import WebSocket from 'ws';
import { Stream, StreamConfig, Selectors } from '@shared/types';
import e from 'express';
const iPhone = KnownDevices['iPhone 15 Pro'];
const iPhoneLandscape = KnownDevices['iPhone 15 Pro landscape'];
const iPad = KnownDevices['iPad Pro 11'];
const Galaxy = KnownDevices['Galaxy S5'];

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
            hasCookieBanner
        } = config as StreamConfig;

        const browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === 'production',
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

        const devices = [iPhone, iPad, Galaxy, iPhoneLandscape];
        const randomDevice = devices[Math.floor(Math.random() * devices.length)];
        await page.emulate(randomDevice);

        await page.goto(url, {
            waitUntil: 'networkidle2',
        });

        if (hasCookieBanner) {
            await puppeteerRequestController.handleCookieBanner(config as StreamConfig, page)
        }

        if (useLogin) {
            handleAuthenticationRequestLogs(page);
    
            await puppeteerRequestController.handleAuthenticate(config as StreamConfig, page)

            try {
                await page.waitForNavigation({
                    waitUntil: 'networkidle2',
                });

            } catch (error) {
                return handleError(error, page, browser);
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
    },
    handleAuthenticate: async (config : StreamConfig, page : Page) => {
        const { loginData: { values, selectors } } = config;
    
        for (const [loginStep, loginValue] of Object.entries(values)) {
            const selector = selectors[loginStep].useShadowRoot
                ? `pierce/${selectors[loginStep].selector}`
                : selectors[loginStep].selector as string
    
            console.log(`do actions for ${loginStep} with selector: ${selector}`);
    
            await page.click(selector);
            await page.type(selector, loginValue, { delay: 50 });
    
            console.log(`Succesfull input at ${selector} with value: ${loginValue}`);
    
            await delay(1000);
        }
    
        await page.click('button.login')
    },
    handleCookieBanner: async (config : StreamConfig, page : Page) => {
        // await delay(100000);
        const { cookieBannerData: { selectors } } = config as StreamConfig;

        const determineDeepElement = async (selectors : Selectors, rootElement? : ElementHandle) : Promise<{ elementHandle: ElementHandle }> => {
            let targetElementHandle : ElementHandle | null = null;
            for (const selector of Object.values(selectors)) {
                console.log(selector)
                const { useShadowRoot, subSelectors, selector: elementSelector } = selector;

                const root = rootElement || page;

                const derivedSelector = useShadowRoot
                    ? `>>> ${elementSelector}`
                    : elementSelector

                const elementHandle = await root.$(derivedSelector);

                if (elementHandle) {
                    if (subSelectors) {
                        return await determineDeepElement(subSelectors, elementHandle);
                    } else {
                        targetElementHandle = elementHandle;
                    }
                } else {
                    targetElementHandle = rootElement as ElementHandle;
                }
            }

            return {
                elementHandle: targetElementHandle as ElementHandle
            }
        }

        const { elementHandle } = await determineDeepElement(selectors);

        if (elementHandle) {
            await elementHandle.click();
            console.log('Clicked on cookie banner');
        }
    }
}

export {
    puppeteerConnectionController,
    puppeteerRequestController
}

const handleAuthenticationRequestLogs = (page: Page) => {
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
        const body = await response.text().catch(() => null);

        if (status !== 200 && status !== 204 && status !== 206) {
            console.log(`Response received from: ${url}`);
            console.log(`Status: ${status}`);
            console.log(`Status text: ${statusText}`);
            console.log(`Body: ${body}`);
        }
    });
}

const handleError = (error: any, page: Page, browser: Browser) => {
    page.screenshot({ path: 'error.png' });
    console.log('Error during navigation:', error);
    console.log('Screenshot saved as error.png');

    console.log('Login failed, please check your credentials and try again.');

    return {
        browser,
        page
    }
}