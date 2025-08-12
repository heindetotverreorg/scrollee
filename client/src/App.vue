<template>
    <StreamSetup
        @on-handle-is-bundled="isBundled = $event"
        @on-handle-show-controls="showControls = $event"
        @on-handle-add-stream="addStream"
    />
    
    <section
        v-show="showControls"
        class="stream-control"
    >
        <StreamControl 
            v-for="stream of activeStreams" 
            :key="stream"
            :stream-name="stream" 
            :is-bundled="isBundled"
        >
            <button @click="removeStream(stream)">Remove stream</button>
        </StreamControl>
    </section>

    <section :class="`stream-content ${!showControls ? 'stream-content--maximized' : ''}`">
        <div class="stream-bundled" v-if="isBundled">
            <BundledStreams />
        </div>
        <div class="stream-list" v-else>
            <StreamList 
                v-for="stream of activeStreams"
                :key="stream"
                :stream-name="stream"
                @on-handle-remove-stream="removeStream"
            />
            <div v-if="!activeStreams.length && hasStreamConfig" class="no-streams">
                <p>No streams added yet. Please add a stream.</p>
            </div>
            <div v-if="!hasStreamConfig" class="no-streams">
                <p>No streams created yet. Please create a stream or enter your unique stream code below:</p>
                <input placeholder="Enter stream code" type="text" />
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
    import StreamSetup from '@/components/StreamSetup.vue'
    import StreamControl from '@/components/StreamView/StreamControl.vue'
    import StreamList from './components/StreamView/StreamList.vue'
    import BundledStreams from '@/components/StreamView/BundledStreams.vue'
    import { computed, onMounted, ref, Ref, unref } from 'vue'
  
    const chooseStream = ref(false)
    const isBundled = ref(false)
    const showControls = ref(true)
    const selectedStream = ref('')
    const activeStreams : Ref<string[]> = ref([])
    const streamConfig = ref({})

    onMounted(() => {
        activeStreams.value = localStorage.getItem('streams') 
            ? JSON.parse(localStorage.getItem('streams') || '[]') 
            : []

        streamConfig.value = localStorage.getItem('streams-config') 
            ? JSON.parse(localStorage.getItem('streams-config') || '{}') 
            : {}
        
    })

    const hasStreamConfig = computed(() => {
        return Object.keys(streamConfig.value).length > 0;
    });
  
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
    .stream-content {
        height: calc(100vh - 135px);
        overflow: hidden;

        &--maximized {
            height: calc(100vh - 50px);
        }
    }

    .stream-control,
    .stream-list {
        display: flex;
        height: 100%;
        gap: 10px;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;

        &--bundled {
            height: auto;
        }
    }

    .stream-bundled {
        height: 100%;
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
    }
</style>
<style lang="scss">
    * {
        box-sizing: border-box;
    }
    
    body {
        margin-top: 0;
        margin-bottom: 0;
    }

    button {
        text-wrap: nowrap;
        white-space: nowrap;
    }
</style>