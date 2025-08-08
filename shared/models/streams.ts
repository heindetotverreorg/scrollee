import { Stream, StreamConfig } from "../types";
import presetStreamsJson from './preset-streams.json';

// Type assertion for the imported JSON array
const createdStreams = JSON.parse(localStorage.getItem('streams-config') || '[]') as Stream[]
const presetStreams: Stream[] = presetStreamsJson as unknown as Stream[];


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
        loginData: {},
        hasCookieBanner: false,
        cookieBannerData: {},
        articleData: {},
        refreshInterval: 10000,
        type: 'dom'
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
    presetStreams,
    createdStreams,
}