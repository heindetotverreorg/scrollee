<template>
    <div v-if="status === 'CLOSED'">
      <button @click="onOpen">Open {{ streamName }}</button>
    </div>
    <div v-if="status === 'OPEN'">
      <button @click="onClose">Close {{ streamName }}</button>
    </div>
    <div v-if="status === 'OPEN'">
        <div>
            <button @click="sendMessage('setupConnection')">setupConnection</button>
            <button @click="sendMessage('receiveData')">Receive data</button>
        </div>
    </div>
    status: {{ status }}
    data: {{ data }}
    <slot />
  </template>
<script setup lang="ts">
    import { useWebSocket } from '@vueuse/core'

    const { streamName } = defineProps<{
        streamName: string
    }>()
    
    const { status, data, send, open, close } = useWebSocket(`ws://localhost:${import.meta.env.VITE_WS_PORT}`, {
        immediate: false
    })
    
    function sendMessage(connectionConfig : string) {
        const streamConfig = {
            cookies: [],
            streamName,
            url: 'https://www.reddit.com/login',
            loginData: {
                userName: 'vanheindetotverre',
                password: '10*Matthias'
            }
        }

        send(JSON.stringify({ connectionConfig, streamConfig }));
    }
    
    function onClose() {
        close();
    }
    
    function onOpen() {
        open();
    }
</script>