<template>
    <StreamArticle
        v-for="article, index in streamData"
        :key="`${streamId}_${index}`" 
        :article="article"
    />
</template>

<script lang="ts" setup>
    import { computed, toRefs, unref } from 'vue'
    import StreamArticle from '@/components/StreamArticle.vue';
    import { useStreamStore } from '@/store/streamStore'

    const props = defineProps<{
        streamName: string,
        streamId: string
    }>()

    const { streamName, streamId } = toRefs(props)

    const { getStreamsByName } = useStreamStore()

    const streamData = computed(() => getStreamsByName(unref(streamName)))

</script>

<style scoped>
</style>