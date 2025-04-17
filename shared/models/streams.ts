import { Stream, StreamConfig } from "../types";
import presetStreams from './preset-streams.json'

function createStream(
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
        useLogin: true,
        loginData: {
            username: '',
            password: '',
        },
        refreshInterval: 10000,
        type: 'dom',
        selectors: null,
    };

    return {
        title,
        name,
        config: { ...defaultConfig, ...config },
        url
    };
}

export {
    createStream,
    presetStreams
}