import puppeteer from 'puppeteer-extra';
import { Page, KnownDevices } from 'puppeteer';
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
        await page.emulate(randomDevice);

        await page.goto(url, {
            waitUntil: 'networkidle2',
        });

        if (hasCookieBanner) {
            console.log(`${stream.name} -- Cookie banner detected`);
            await puppeteerRequestController.handleCookieBanner(config as StreamConfig, page)
        }

        if (useLogin) {
            console.log(`${stream.name} -- Login detected`);
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
    handleFetchRequest: async (data: WebSocket.Data, page: Page) => {
        const {
            stream: {
                config: {
                    articleData: selectors
                },
            }
        } = JSON.parse(data as string);

        await page.reload({
            waitUntil: 'networkidle2',
        });
        console.log('-- Page reloaded, fetching new articles...')

        const actions = await getActions(page, selectors);

        const articles = await doActions(actions, page)

        return {
            streamData: JSON.stringify(articles),
            streamStatus: StreamStatus.SUCCESS,
            error: ''
        } as StreamResponse
    },
    handleAuthenticate: async (config : StreamConfig, page : Page) => {
        const { loginData: selectors } = config;
    
        const actions = await getActions(page, selectors);

        await doActions(actions, page);
    },
    handleCookieBanner: async (config : StreamConfig, page : Page) => {
        const { cookieBannerData: selectors } = config

        const actions = await getActions(page, selectors);
        await doActions(actions, page);
    }
}

export {
    puppeteerConnectionController,
    puppeteerRequestController
}

const getActions = async (page : Page, selectors : Selectors) : Promise<Action[]> => {
    let actions : Action[] = [];

    console.log('Selectors:', selectors);

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
        } else {
            console.log(`Element with selector "${elementSelector}" not found.`);
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
                    html: article.innerHTML,
                    href: article instanceof HTMLAnchorElement ? article.href : null,
                    title: article instanceof HTMLHeadingElement ? article.textContent : null,
                    image: article instanceof HTMLImageElement ? article.src : null,
                    date: article instanceof HTMLTimeElement ? article.dateTime : null,
                    createdAt: new Date().toISOString()
                }));
            }, meta);
        }
        if (config.waitFor) {
            await page.waitForSelector(config.waitFor as string, {  timeout: 10000 });
        }
        console.log(`did the action for ${action} on handle with selector ${meta.selector}`)
    }
}