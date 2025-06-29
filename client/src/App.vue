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
    import { ref, Ref } from 'vue'
    import { presetStreams } from '@shared/models/streams'
  
    const chooseStream = ref(false)
    const selectedStream = ref('')
    const streams : Ref<string[]> = ref([])

    const presetStreamsList = presetStreams.map((stream : any) => {
        return stream.name
    }) 
  
    const addStream = (streamName : string) => {
        streams.value.push(streamName)
        selectedStream.value = ''
        chooseStream.value = false
    }
  
    const removeStream = (streamName : string) => {
        streams.value = streams.value.filter(stream => stream !== streamName)
    }
  </script>
  <style scoped lang="scss">
    .stream-setup {
        height: 50px;
        margin-bottom :20px;
    }

    .streams {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
  </style>