interface StreamConfig {
    meta: {
        'home-feed'?: boolean;
        subreddits?: string[];
    };
    useLogin: boolean;
    loginData: {
        username: string;
        password: string;
    };
    refreshInterval: number;
    type: 'dom';
    selectors: Record<string, {
        useShadowRoot?: boolean;
        selector?: string;
    }>
}

interface Stream {
    title: string;
    name: string;
    url: string;
    config?: StreamConfig;
}

export type { StreamConfig, Stream };