<template>
    <div class="stream-setup">
        <div>
            <button @click="chooseStream = true">Add stream</button>
            <span>
                <input 
                    type="checkbox"
                    id="bundle-streams"
                    v-model="isBundled"
                >
                <label for="bundle-streams">Bundle streams</label>
            </span>
        </div>
        <div v-if="chooseStream">
            <select v-model="selectedStream">
                <option v-for="stream of presetStreamsList" :key="stream" :value="stream">
                    {{ stream }}
                </option>
            </select>
            <button @click="addStream(selectedStream)">Add stream</button>
        </div>
    </div>
    
    <div :class="`streams ${isBundled ? 'streams--bundled' : ''}`">
        <StreamControl 
            v-for="stream of activeStreams" 
            :key="stream"
            :stream-name="stream" 
            :is-bundled="isBundled"
        >
            <div>
                <button @click="removeStream(stream)">Remove stream</button>
            </div>
        </StreamControl>
    </div>
    <div v-if="isBundled">
        <BundledStreams />
    </div>
</template>
<script setup lang="ts">
    import StreamControl from '@/components/StreamControl.vue'
    import BundledStreams from '@/components/BundledStreams.vue'
    import { onMounted, ref, Ref, unref } from 'vue'
    import { presetStreams } from '@shared/models/streams'
  
    const chooseStream = ref(false)
    const isBundled = ref(false)
    const selectedStream = ref('')
    const activeStreams : Ref<string[]> = ref([])

    onMounted(() => {
        activeStreams.value = localStorage.getItem('streams') 
            ? JSON.parse(localStorage.getItem('streams') || '[]') 
            : []
    })

    const presetStreamsList = presetStreams.map((stream : any) => {
        return stream.name
    }) 
  
    const addStream = (streamName : string) => {
        activeStreams.value.push(streamName)
        selectedStream.value = ''
        chooseStream.value = false

        localStorage.setItem('streams', JSON.stringify(unref(activeStreams)));
    }
  
    const removeStream = (streamName : string) => {
        activeStreams.value = activeStreams.value.filter(stream => stream !== streamName)
        localStorage.setItem('streams', JSON.stringify(unref(activeStreams)));
    }
</script>
<style scoped lang="scss">
    .stream-setup {
        height: 50px;
    }

    .streams {
        height: calc(100vh - 50px);
        display: flex;
        gap: 10px;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;

        &--bundled {
            height: auto;
        }
    }
</style>
<style lang="scss">
    body {
        margin-top: 0;
        margin-bottom: 0;
    }
</style>