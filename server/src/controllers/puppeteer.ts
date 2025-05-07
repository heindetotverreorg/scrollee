import puppeteer from 'puppeteer-extra';
import { Page, Browser, KnownDevices, ElementHandle } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import WebSocket from 'ws';
import { Stream, StreamConfig, Selectors, Action, StreamResponse, StreamStatus } from '@shared/types';

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

        const devices = Object.values(KnownDevices)
        const randomDevice = devices[Math.floor(Math.random() * devices.length)];
        console.log('Emulating device:', randomDevice);
        await page.emulate(randomDevice);

        await page.goto(url, {
            waitUntil: 'networkidle2',
        });

        if (hasCookieBanner) {
            console.log('-- Cookie banner detected');
            await puppeteerRequestController.handleCookieBanner(config as StreamConfig, page)
        }

        if (useLogin) {
            console.log('-- Login detected');
            await puppeteerRequestController.handleAuthenticate(config as StreamConfig, page)
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
            stream: {
                name,
                config: {
                    articleData: { selectors }
                },
            }
        } = JSON.parse(data as string);

        const actions = await getActions(page, selectors);
        const articles = await doActions(actions, page) as any

        return {
            streamData: JSON.stringify(articles),
            streamStatus: StreamStatus.SUCCESS,
            error: ''
        } as StreamResponse
    },
    handleAuthenticate: async (config : StreamConfig, page : Page) => {
        handleAuthenticationRequestLogs(page);

        const { loginData: { selectors } } = config;
    
        const actions = await getActions(page, selectors);
        await doActions(actions, page);

        try {
            await page.waitForNavigation({
                waitUntil: 'networkidle2',
                timeout: 5000
            });

        } catch (error) {
            return handleError(error, page);
        }
    },
    handleCookieBanner: async (config : StreamConfig, page : Page) => {
        const { cookieBannerData: { selectors } } = config as StreamConfig;

        const actions = await getActions(page, selectors);
        await doActions(actions, page);
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

const handleError = (error: any, page: Page) => {
    page.screenshot({ path: 'error.png' });
    console.log('Error during navigation:', error);
    console.log('Screenshot saved as error.png');

    console.log('Login failed, please check your credentials and try again.');

    return {
        streamData: '',
        streamStatus: StreamStatus.ERROR,
        error: JSON.stringify(error)
    } as StreamResponse
}

const getActions = async (page : Page, selectors : Selectors) : Promise<Action[]> => {
    let actions : Action[] = [];

    for (const selector of Object.values(selectors)) {
        const { useShadowRoot, selector: elementSelector } = selector;

        const derivedSelector = useShadowRoot
            ? `>>> ${elementSelector}`
            : elementSelector

        const elementHandle = await page.$(derivedSelector);
        if (elementHandle) {
            actions.push({
                elementHandle,
                config: {
                    action: selector.action,
                    value: selector.value,
                    waitFor: selector.waitFor
                },
                meta: {
                    selector: elementSelector
                }
            });
        }
    }

    return actions     
}

const doActions = async (actions : Action[], page : Page) => {
    for (const { elementHandle, config, meta } of actions) {
        const { action, value } = config;
        if (action === 'type') {
            await elementHandle.click()
            await elementHandle.type(value as string, { delay: 20 });
        } else if (config.action === 'click') {
            await elementHandle.click();
        } else if (action === 'get') {
            return await elementHandle.evaluate((_, meta) => {
                const elements = document.querySelectorAll(meta.selector);
                return Array.from(elements).map(article => ({
                    text: article.textContent,
                    html: article.innerHTML
                }));
            }, meta);
        }
        if (config.waitFor) {
            await page.waitForSelector(config.waitFor as string, {  timeout: 1000 });
        }
        console.log(`did the action for ${action} on handle with selector ${meta.selector}`)
    }
}