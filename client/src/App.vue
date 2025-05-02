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
        <input type="text" v-model="wsHost" />
    </div>
    <div class="streams">
        <Stream v-for="stream of streams" :stream-name="stream" :ws-host="wsHost">
            <div>
                <button @click="removeStream(stream)">Remove stream</button>
            </div>
        </Stream>
    </div>
</template>
<script setup lang="ts">
    import Stream from '@/components/Stream.vue'
    import { ref, Ref } from 'vue'
    import { presetStreams } from '@shared/models/streams'
  
    const chooseStream = ref(false)
    const selectedStream = ref('')
    const streams : Ref<string[]> = ref([])
    const wsHost = ref('localhost')

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