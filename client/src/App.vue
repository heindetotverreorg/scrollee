<template>
    <div class="stream-setup">
        <button @click="chooseStream = true">Add stream</button>
        <div v-if="chooseStream">
            <select v-model="selectedStream">
            <option v-for="stream of presetStreamsList" :key="stream" :value="stream">
                {{ stream }}
            </option>
        </select>
        <button @click="addStream(selectedStream)">Add stream</button>
        </div>
    </div>
    <div class="streams">
        <StreamControl v-for="stream of streams" :stream-name="stream">
            <div>
                <button @click="removeStream(stream)">Remove stream</button>
            </div>
        </StreamControl>
    </div>
</template>
<script setup lang="ts">
    import StreamControl from '@/components/StreamControl.vue'
    import { onMounted, ref, Ref, unref } from 'vue'
    import { presetStreams } from '@shared/models/streams'
  
    const chooseStream = ref(false)
    const selectedStream = ref('')
    const streams : Ref<string[]> = ref([])

    onMounted(() => {
        streams.value = localStorage.getItem('streams') 
            ? JSON.parse(localStorage.getItem('streams') || '[]') 
            : []
    })

    const presetStreamsList = presetStreams.map((stream : any) => {
        return stream.name
    }) 
  
    const addStream = (streamName : string) => {
        streams.value.push(streamName)
        selectedStream.value = ''
        chooseStream.value = false

        localStorage.setItem('streams', JSON.stringify(unref(streams)));
    }
  
    const removeStream = (streamName : string) => {
        streams.value = streams.value.filter(stream => stream !== streamName)
        localStorage.setItem('streams', JSON.stringify(unref(streams)));
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
    }
</style>
<style lang="scss">
    body {
        margin-top: 0;
        margin-bottom: 0;
    }
</style>