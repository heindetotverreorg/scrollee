import { computed, onMounted, ref, unref, watch } from 'vue'
import { useWebSocket } from '@vueuse/core'
import { Stream, StreamResponse, StreamStatus, ArticleData } from '@shared/types'
import { presetStreams } from '@shared/models/streams'
import { REQUEST_TYPES } from '@shared/constants'
import { useStreamStore } from '@/store/streamStore'

export function useStreamControl(
    streamName : string
) {
    const wsPath = import.meta.env.VITE_WS_SERVER
    const isServer = window.location.protocol === 'https:'
    const protocol = isServer ? 'wss' : 'ws'
    const fullPath = `${protocol}://${wsPath}/ws`

    const {
        status: webSocketStatus, 
        data, 
        send, 
        open 
    } = useWebSocket(fullPath, {
        immediate: false
    })

    const { setStreamArticles } = useStreamStore()

    const streamStatus = ref('' as StreamStatus)
    const streamError = ref('')
    const clientId = ref('')

    const chosenStream = computed(() => presetStreams.find((stream : Stream) => stream.name === streamName) as Stream)

    const streamRootUrl = computed(() => {
        let { url } = unref(chosenStream)

        url = url.replace(/\/$/, '') // Remove trailing slash if present
        url = url.split('/')[0] + '//' + url.split('/')[2] // Reconstruct the URL to get the root

        return url
    })

    watch(streamStatus, async (newStreamStatus) => {
        if (newStreamStatus === StreamStatus.CONNECTED) {
            sendMessage(REQUEST_TYPES.FETCH)
        }
    })

    watch(webSocketStatus, (newWebSocketStatus) => {
        if (newWebSocketStatus === 'OPEN') {
            sendMessage(REQUEST_TYPES.CONNECT)
        }
        if (newWebSocketStatus === 'CLOSED' && streamStatus.value === StreamStatus.SUCCESS) {
            open()
        }
    })

    watch(data, (incomingStream) => {
        if (incomingStream) {
            const {
                streamData: incomingStreamData, 
                streamStatus : incomingStreamStatus,
                error: incomingStreamError,
                clientId: incomingStreamId
            } = JSON.parse(incomingStream) || {} as StreamResponse

            if (incomingStreamData) {
                const parsedStreamData = JSON.parse(incomingStreamData) as ArticleData[]

                setStreamArticles(parsedStreamData, unref(streamRootUrl), streamName)
            }
            if (incomingStreamStatus) {
                streamStatus.value = incomingStreamStatus
            }
            if (incomingStreamError) {
                streamError.value = incomingStreamError
            }
            if (incomingStreamId) {
                clientId.value = incomingStreamId
            }
        }
    })
    
    function sendMessage(requestType : string) {
        const {
            name,
            url,
            config
        } = unref(chosenStream)

        send(JSON.stringify({ requestType, stream: { name, url, config } }));
    }

    onMounted(() => {
        open()
    })
    
    function onOpen() {
        open();
    }

    return {
        webSocketStatus,
        streamRootUrl,
        streamStatus,
        streamError,
        clientId,
        sendMessage,
        onOpen
    }
}