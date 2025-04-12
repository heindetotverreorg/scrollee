<template>
    <div v-if="status === 'CLOSED'">
      <button @click="onOpen">Open {{ streamName }}</button>
    </div>
    <div v-if="status === 'OPEN'">
      <button @click="onClose">Close {{ streamName }}</button>
    </div>
    <div v-if="status === 'OPEN'">
        <div>
            <button @click="sendMessage('sendTest')">Receive data</button>
        </div>
        <div>  
            <button @click="sendMessage('startInterval')">Receive data on interval</button>
            <button @click="sendMessage('stopInterval')">Stop receiving data on interval</button>
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
  
const { status, data, send, open, close } = useWebSocket(`ws://localhost:3001`, {
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