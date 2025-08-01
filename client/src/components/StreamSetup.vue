<template>
    <div class="stream-setup">
        <div>
            <button @click="chooseStream = true">Add stream</button>
            <span>
                <input 
                    type="checkbox"
                    id="bundle-streams"
                    v-model="isBundled"
                    @change="$emit('on-handle-is-bundled', isBundled)"
                >
                <label for="bundle-streams">Bundle streams</label>
            </span>
        </div>
        <div v-if="chooseStream" class="stream-setup-select">
            <select v-model="selectedStream">
                <option v-for="stream of presetStreamsList" :key="stream" :value="stream">
                    {{ stream }}
                </option>
            </select>
            <button @click="$emit('on-handle-add-stream', selectedStream)">Add stream</button>
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
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    import { presetStreams } from '@shared/models/streams'

    const chooseStream = ref(false)
    const isBundled = ref(false)
    const showControls = ref(true)
    const selectedStream = ref('')

    const presetStreamsList = presetStreams.map((stream : any) => {
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

</style>