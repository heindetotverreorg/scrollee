<template>
    <div class="stream-setup">
        <div>
            <div class="stream-setup-buttons">
                <button @click="addStream = true">Add stream</button>
                <button @click="[createStream = true, editStream = false]">Create stream</button>
                <button @click="[createStream = true, editStream = true]">Edit stream</button>
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
                <option v-for="stream of createdStreams.map(s => s.name)" :key="stream" :value="stream">
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
        <StreamConfigModal
            v-if="createStream" 
            :edit-mode="editStream"
            @close-modal="createStream = false"
             @save-stream="onSaveStream" />
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    import { createdStreams } from '@shared/models/streams'
    import StreamConfigModal from '@/components/StreamConfig/StreamConfigModal.vue'
    import { Stream } from '@shared/types'

    const addStream = ref(false)
    const isBundled = ref(false)
    const showControls = ref(true)
    const selectedStream = ref('')
    const createStream = ref(false)
    const editStream = ref(false)

    const onSaveStream = (form: Stream) => {
        try {
            if (!form.name || !form.config?.articleData.articles || !form.url) {
                throw new Error('Invalid stream configuration');
            }
        } catch(e) {
            console.log(e)
            return
        }

        const existingIndex = createdStreams.findIndex(s => s.name === form.name);
        
        if (existingIndex !== -1) {
            createdStreams[existingIndex] = form;
        } else {
            createdStreams.push(form);
        }

        localStorage.setItem('streams-config', JSON.stringify(createdStreams));
        createStream.value = false;
    };

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
        flex-direction: row;
    }

</style>