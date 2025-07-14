<template>
    <section class="stream-wrapper">
        status: {{ streamStatus || webSocketStatus.toLowerCase() }}
        <div v-if="webSocketStatus === WebSocketStatus.CLOSED">
            <button @click="onOpen">Open {{ streamName }}</button>
        </div>
        <div v-else>
            <slot />
            <div v-if="streamStatus === StreamStatus.DISCONNECTED">
                <button @click="sendMessage(REQUEST_TYPES.CONNECT)">Connect {{ streamName }}</button>
            </div>
            <div v-if="streamStatus === StreamStatus.SUCCESS">
                <div>
                    <button @click="sendMessage(REQUEST_TYPES.FETCH)">Receive data</button>
                </div>
            </div>
        </div>
        <h3>{{ streamName }}</h3>
        <div class="stream-list">
            <StreamList
                v-if="streamStatus && streamData"
                :stream-root-url="streamRootUrl"
                :stream-data="streamData"
                :stream-id="clientId"    
            />
        </div>
    </section>
</template>
<script setup lang="ts">
    import { computed, ref, watch, onMounted, unref } from 'vue'
    import { useWebSocket } from '@vueuse/core'
    import { REQUEST_TYPES } from '@shared/constants'
    import { presetStreams } from '@shared/models/streams'
    import { Stream, StreamResponse, StreamStatus, WebSocketStatus, ArticleData } from '@shared/types'
    import StreamList from '@/components/StreamList.vue'

    const { streamName } = defineProps<{
        streamName: string
    }>()

    const streamData = ref([] as ArticleData[])
    const streamStatus = ref('' as StreamStatus)
    const streamError = ref('')
    const clientId = ref('')

    const wsPath = import.meta.env.VITE_WS_PATH || 'scrollee.heindetotverre.com'
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

    const chosenStream = computed(() => presetStreams.find((stream : Stream) => stream.name === streamName) as Stream)

    const streamRootUrl = computed(() => {
        let { url } = unref(chosenStream)

        url = url.replace(/\/$/, '') // Remove trailing slash if present
        url = url.split('/')[0] + '//' + url.split('/')[2] // Reconstruct the URL to get the root

        return url
    })

    watch(streamStatus, async (newStreamStatus) => {
        if (newStreamStatus === StreamStatus.CONNECTED) {
            console.log('FETCH DATA')
            sendMessage(REQUEST_TYPES.FETCH)
        }
    })

    watch(webSocketStatus, (newWebSocketStatus) => {
        if (newWebSocketStatus === 'OPEN') {
            sendMessage(REQUEST_TYPES.CONNECT)
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

                streamData.value = parsedStreamData
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
</script>
<style scoped lang="scss">
    .stream-wrapper {
        min-width: 250px;
        width: 250px;
        scroll-snap-align: start;
    }

    .stream-list {
        height: 100%;
        overflow: auto;
        scroll-snap-type: y mandatory;
    }
</style>