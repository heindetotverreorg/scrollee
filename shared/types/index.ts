import { ElementHandle, Browser, Page } from 'puppeteer';
import WebSocket from 'ws';

interface StreamConfig {
    meta: {
        'home-feed'?: boolean;
        subreddits?: string[];
    };
    useLogin: boolean;
    loginData: Selectors;
    hasCookieBanner: boolean;
    cookieBannerData: Selectors
    articleData: Selectors
    refreshInterval: number;
    type: 'dom';
}

interface StreamConnectionsPayload {
    ws?: WebSocket;
    data?: WebSocket.Data;
    connections: StreamConnections
    clientId: string;
}

interface StreamConnections {
    [clientId: string]: {
        browser?: Browser;
        page?: Page;
        data?: string;
        lastActivity?: number; // Timestamp of the last activity
    };
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

interface StreamResponse {
    streamData?: string;
    streamStatus: StreamStatus;
    error?: string;
    clientId?: string
}

interface ArticleData {
    text: string;
    html: string;
    href?: string;
    title?: string;
    image?: string;
    date?: string;
    createdAt: string;
    streamName?: string;
    streamRootUrl?: string
}

enum StreamStatus {
    SUCCESS = 'success',
    ERROR = 'error',
    PENDING = 'pending',
    LOADING = 'loading',
    CONNECTING = 'connecting',
    DISCONNECTED = 'disconnected',
    CONNECTED = 'connected',
    RECONNECTING = 'reconnecting',
    CLOSED = 'closed',
    OPEN = 'open',
    READY = 'ready',
}

enum WebSocketStatus {
    CONNECTING = 'CONNECTING',
    OPEN = 'OPEN',
    CLOSING = 'CLOSING',
    CLOSED = 'CLOSED',
}

export type { StreamConnections, StreamConfig, StreamConnectionsPayload, Stream, Selectors, Action, StreamResponse, ArticleData };

export { StreamStatus, WebSocketStatus }