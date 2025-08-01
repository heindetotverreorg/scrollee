<template>
    <div class="stream-setup">
        <div>
            <div class="stream-setup-buttons">
                <button @click="addStream = true">Add stream</button>
                <button @click="createStream = true">Create stream</button>
            </div>
        </div>
        <div>
            <input 
                type="checkbox"
                id="bundle-streams"
                v-model="isBundled"
                @change="$emit('on-handle-is-bundled', isBundled)"
            >
            <label for="bundle-streams">Bundle streams</label>
        </div>
        <div v-if="addStream" class="stream-setup-select">
            <select v-model="selectedStream">
                <option v-for="stream of presetStreamList" :key="stream" :value="stream">
                    {{ stream }}
                </option>
            </select>
            <button @click="[$emit('on-handle-add-stream', selectedStream), addStream = false]">Add stream</button>
        </div>
        <div>
            <input 
                type="checkbox"
                id="show-controls"
                v-model="showControls"
                @change="$emit('on-handle-show-controls', showControls)"
            >
            <label for="show-controls">Show controls</label>
        </div>
        <StreamConfigModal v-if="createStream" @close-modal="createStream = false" />
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    import { presetStreams } from '@shared/models/streams'
    import StreamConfigModal from '@/components/StreamConfig/StreamConfigModal.vue'

    const addStream = ref(false)
    const isBundled = ref(false)
    const showControls = ref(true)
    const selectedStream = ref('')
    const createStream = ref(false)

    const presetStreamList = presetStreams.map((stream : any) => {
        return stream.name
    }) 

</script>

<style scoped>
    .stream-setup {
        display: flex;
        height: 50px;
        position: relative;
    }

    .stream-setup-select {
        position: absolute;
        top: 25px;
        left: 0;
    }

    .stream-setup-buttons {
        display: flex;
        flex-direction: column;
    }

</style>