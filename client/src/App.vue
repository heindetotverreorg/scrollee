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
            />
        </div>
    </section>
</template>
<script setup lang="ts">
    import StreamSetup from '@/components/StreamSetup.vue'
    import StreamControl from '@/components/StreamView/StreamControl.vue'
    import StreamList from './components/StreamView/StreamList.vue'
    import BundledStreams from '@/components/StreamView/BundledStreams.vue'
    import { onMounted, ref, Ref, unref } from 'vue'
  
    const chooseStream = ref(false)
    const isBundled = ref(false)
    const showControls = ref(true)
    const selectedStream = ref('')
    const activeStreams : Ref<string[]> = ref([])

    onMounted(() => {
        activeStreams.value = localStorage.getItem('streams') 
            ? JSON.parse(localStorage.getItem('streams') || '[]') 
            : []
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