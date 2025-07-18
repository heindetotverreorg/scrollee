<template>
    <section class="stream-wrapper">
        <h3>{{ streamName }}</h3>
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
                <button @click="sendMessage(REQUEST_TYPES.FETCH)">Receive data</button>
            </div>
        </div>
        <div v-if="!isBundled" class="stream-list">
            <StreamList
                v-if="streamStatus"
                :stream-name="streamName"
                :stream-id="clientId"    
            />
        </div>
    </section>
</template>
<script setup lang="ts">
    import { REQUEST_TYPES } from '@shared/constants'
    import { StreamStatus, WebSocketStatus } from '@shared/types'
    import StreamList from '@/components/StreamList.vue'
    import { useStreamControl } from '@/composables/useStreamControl'
    import { useStreamStore } from '@/store/streamStore'
    import { onUnmounted } from 'vue';

    const { streamName } = defineProps<{
        streamName: string,
        isBundled?: boolean
    }>()

    const {
        streamStatus,
        clientId,
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
    .stream-wrapper {
        min-width: 250px;
        width: 250px;
        scroll-snap-align: start;
    }

    .stream-list {
        height: calc(100% - 83px);
        overflow: auto;
        scroll-snap-type: y mandatory;

        &--bundled {
            height: auto;
            overflow: hidden;
        }
    }

    h3 {
        margin: 0;
    }
</style>