<template>
    <section class="stream">
        status: {{ streamStatus || status.toLowerCase() }}
        <div v-if="status === 'CLOSED'">
        <button @click="onOpen">Open {{ streamName }}</button>
        </div>
        <div v-if="status === 'OPEN'">
        <button @click="onClose">Close {{ streamName }}</button>
        </div>
        <div v-if="status === 'OPEN'">
            <div>
                <button @click="sendMessage(REQUEST_TYPES.FETCH)">Receive data</button>
                <slot />
            </div>
        </div>
        <div v-if="streamStatus && streamData" v-html="streamData" />
    </section>
  </template>
<script setup lang="ts">
    import { ref, watch, onMounted } from 'vue'
    import { useWebSocket } from '@vueuse/core'
    import { REQUEST_TYPES } from '@shared/constants'
    import { presetStreams } from '@shared/models/streams'
    import { Stream, StreamResponse, StreamStatus } from '@shared/types'

    const { streamName } = defineProps<{
        streamName: string
    }>()

    const streamData = ref('')
    const streamStatus = ref('')
    const error = ref('')
    const clientId = ref('')

    const wsPath = import.meta.env.VITE_WS_PATH || 'scrollee.heindetotverre.com'
    const isServer = window.location.protocol === 'https:'
    const protocol = isServer ? 'wss' : 'ws'
    const fullPath = `${protocol}://${wsPath}/ws`

    const { status, data, send, open, close } = useWebSocket(fullPath, {
        immediate: false
    })

    watch(streamStatus, (newStatus) => {
        if (newStatus === StreamStatus.CONNECTED) {
            sendMessage(REQUEST_TYPES.FETCH)
        }
    })

    watch(status, (webSocketStatus) => {
        if (webSocketStatus === 'OPEN') {
            sendMessage(REQUEST_TYPES.CONNECT)
        }
    })

    watch(data, (incomingStream) => {
        if (incomingStream) {
            const {
                streamData: incomingStreamData, 
                streamStatus : incomingStreamStatus,
                error: incomingError,
                clientId: incomingClientId
            } = JSON.parse(incomingStream) || {} as StreamResponse

            if (incomingStreamData) {
                streamData.value = incomingStreamData
            }
            if (incomingStreamStatus) {
                streamStatus.value = incomingStreamStatus
            }
            if (incomingError) {
                error.value = incomingError
            }
            if (incomingClientId) {
                clientId.value = incomingClientId
            }
        }
    })
    
    function sendMessage(requestType : string) {
        const {
            name,
            url,
            config
        } = presetStreams.find((stream : Stream) => stream.name === streamName)

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