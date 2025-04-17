<template>
    <div v-if="status === 'CLOSED'">
      <button @click="onOpen">Open {{ streamName }}</button>
    </div>
    <div v-if="status === 'OPEN'">
      <button @click="onClose">Close {{ streamName }}</button>
    </div>
    <div v-if="status === 'OPEN'">
        <div>
            <button @click="sendMessage(REQUEST_TYPES.CONNECT)">setupConnection</button>
            <button @click="sendMessage(REQUEST_TYPES.FETCH)">Receive data</button>
        </div>
    </div>
    status: {{ status }}
    data: {{ data }}
    <slot />
  </template>
<script setup lang="ts">
    import { useWebSocket } from '@vueuse/core'
    import { REQUEST_TYPES } from '@shared/constants'
    import { presetStreams } from '@shared/models/streams'
    import { Stream } from '@shared/types'
    import { onMounted } from 'vue';

    const { streamName } = defineProps<{
        streamName: string
    }>()
    
    const { status, data, send, open, close } = useWebSocket(`ws://localhost:${import.meta.env.VITE_WS_PORT}`, {
        immediate: false
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