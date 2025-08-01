<template>
    <section class="stream-controls-wrapper">
        <h3>{{ streamName }}</h3>
        status: {{ streamStatus || webSocketStatus.toLowerCase() }}
        <div v-if="webSocketStatus === WebSocketStatus.CLOSED">
            <button @click="onOpen">Open {{ streamName }}</button>
        </div>
        <div v-else>
            <div v-if="streamStatus === StreamStatus.DISCONNECTED">
                <button @click="sendMessage(REQUEST_TYPES.CONNECT)">Connect {{ streamName }}</button>
            </div>
            <div v-if="streamStatus === StreamStatus.SUCCESS">
                <button @click="sendMessage(REQUEST_TYPES.FETCH)">Receive data</button>
            </div>
        </div>
        <slot />
    </section>
</template>
<script setup lang="ts">
    import { REQUEST_TYPES } from '@shared/constants'
    import { StreamStatus, WebSocketStatus } from '@shared/types'
    import { useStreamControl } from '@/composables/useStreamControl'
    import { useStreamStore } from '@/store/streamStore'
    import { onUnmounted } from 'vue';

    const { streamName } = defineProps<{
        streamName: string,
        isBundled?: boolean
    }>()

    const {
        streamStatus,
        webSocketStatus,
        sendMessage,
        onOpen
     } = useStreamControl(streamName)

     onUnmounted(() => {
        const { removeStreamByName } = useStreamStore()
        removeStreamByName(streamName)
     })

</script>
<style scoped lang="scss">
    h3 {
        margin: 0;
    }

    .stream-controls-wrapper {
        scroll-snap-align: start;
    }
</style>