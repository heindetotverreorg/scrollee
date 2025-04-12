<template>
    <div>
        <button @click="addStream(`test_${streams.length}`)">Add stream</button>
    </div>
    <Stream v-for="stream of streams" :stream-name="stream">
        <div>
            <button @click="removeStream(stream)">Remove stream</button>
        </div>
    </Stream>
</template>
<script setup lang="ts">
    import Stream from '@/components/Stream.vue'
    import { ref, Ref } from 'vue'
  
    const streams : Ref<string[]> = ref([])
  
    const addStream = (streamName : string) => {
        streams.value.push(streamName)
    }
  
    const removeStream = (streamName : string) => {
        streams.value = streams.value.filter(stream => stream !== streamName)
    }
  </script>