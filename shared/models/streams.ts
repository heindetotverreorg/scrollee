import { Stream, StreamConfig } from "../types";

export function createStream(
    title: string,
    name: string,
    url: string,
    config?: Partial<StreamConfig>
): Stream {
    const defaultConfig: StreamConfig = {
        meta: {
            'home-feed': true,
            subreddits: [],
        },
        needsLogin: true,
        loginData: {
            username: '',
            password: '',
        },
        refreshInterval: 10000,
        type: 'dom',
        useSelectors: false,
        selectors: null,
    };

    return {
        title,
        name,
        config: { ...defaultConfig, ...config },
        url
    };
}