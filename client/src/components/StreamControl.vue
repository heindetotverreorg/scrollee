<template>
    <section class="stream">
        status: {{ streamStatus || webSocketStatus.toLowerCase() }}
        <div v-if="webSocketStatus === WebSocketStatus.CLOSED">
        <button @click="onOpen">Open {{ streamName }}</button>
        </div>
        <div v-if="webSocketStatus === WebSocketStatus.OPEN">
            <button @click="sendMessage(REQUEST_TYPES.CONNECT)">Connect {{ streamName }}</button>
            <button @click="onClose">Close {{ streamName }}</button>
            <div>
                <button @click="sendMessage(REQUEST_TYPES.FETCH)">Receive data</button>
                <slot />
            </div>
        </div>
        <StreamDataHandler
            v-if="streamStatus && streamData"
            :stream-data="streamData"
            :stream-id="clientId"    
        />
    </section>
</template>
<script setup lang="ts">
    import { ref, watch, onMounted } from 'vue'
    import { useWebSocket } from '@vueuse/core'
    import { REQUEST_TYPES } from '@shared/constants'
    import { presetStreams } from '@shared/models/streams'
    import { Stream, StreamResponse, StreamStatus, WebSocketStatus, ArticleData } from '@shared/types'
    import StreamDataHandler from '@/components/StreamDataHandler.vue'

    const { streamName } = defineProps<{
        streamName: string
    }>()

    const streamData = ref([] as ArticleData[])
    const streamStatus = ref('')
    const streamError = ref('')
    const clientId = ref('')

    const wsPath = import.meta.env.VITE_WS_PATH || 'scrollee.heindetotverre.com'
    const isServer = window.location.protocol === 'https:'
    const protocol = isServer ? 'wss' : 'ws'
    const fullPath = `${protocol}://${wsPath}/ws`

    const { status: webSocketStatus, data, send, open, close } = useWebSocket(fullPath, {
        immediate: false
    })

    watch(streamStatus, (newStatus) => {
        if (newStatus === StreamStatus.CONNECTED) {
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
        } = presetStreams.find((stream : Stream) => stream.name === streamName) as Stream

        send(JSON.stringify({ requestType, stream: { name, url, config } }));
    }

    onMounted(() => {
        open()
    })
    
    function onClose() {
        close();
    }
    
    function onOpen() {
        open();
    }
</script>
<style scoped lang="scss">
    .stream {
        width: 200px;
    }
</style>