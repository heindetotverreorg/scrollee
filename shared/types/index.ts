interface StreamConfig {
    meta: {
        'home-feed'?: boolean;
        subreddits?: string[];
    };
    useLogin: boolean;
    loginData: {
        values: {
            [key: string]: string;
        };
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
        subSelectors?: Selectors
    }
}

export type { StreamConfig, Stream, Selectors };