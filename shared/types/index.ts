import { ElementHandle, Browser, Page } from 'puppeteer';
import WebSocket from 'ws';
interface StreamConfig {
    meta: {
        'home-feed'?: boolean;
        subreddits?: string[];
    };
    useLogin: boolean;
    loginData: {
        selectors: Selectors
    };
    hasCookieBanner: boolean;
    cookieBannerData: {
        selectors: Selectors
    }
    articleData: {
        selectors: Selectors;
    }
    refreshInterval: number;
    type: 'dom';
}

interface StreamConnectionsPayload {
    ws?: WebSocket;
    data?: WebSocket.Data;
    connections: Record<string, Record<string, Browser | Page>>
    clientId: string;
}

interface Stream {
    title: string;
    name: string;
    url: string;
    config?: StreamConfig;
}

interface Selectors {
    [key: string]: {
        selector: string;
        useShadowRoot?: boolean;
        action: 'click' | 'type' | 'get';
        value?: string,
        waitFor?: string;
    }
}

interface Action {
    elementHandle: ElementHandle;
    config: {
        action: string;
        value?: string;
        waitFor?: string;
    },
    meta: {
        selector: string;
    }
}

export type { StreamConfig, StreamConnectionsPayload, Stream, Selectors, Action };