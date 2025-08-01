import { StreamResponse, StreamStatus } from '@shared/types';

const makeMessage = (state: StreamStatus, clientId?: string,  data?: string, error?: string) => {
    return JSON.stringify({
        streamData: data,
        streamStatus: state,
        error,
        clientId
    } as StreamResponse)
}
 export { makeMessage }