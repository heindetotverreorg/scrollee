interface StreamConfig {
    meta: {
        'home-feed': boolean;
        subreddits: string[];
    };
    needsLogin: boolean;
    loginData: {
        username: string;
        password: string;
    };
    refreshInterval: number;
    type: 'dom';
    useSelectors: boolean;
    selectors: null;
}

interface Stream {
    title: string;
    name: string;
    url: string;
    config?: StreamConfig;
}

export type { StreamConfig, Stream };