<template>
    <div class="articles-list">
        <h3 class="articles-list-title">{{ streamName }}</h3>
        <StreamArticle
            v-for="article, index in streamData"
            :key="`${streamName}_${index}`" 
            :article="article"
        />
    </div>
</template>

<script lang="ts" setup>
    import { computed, toRefs, unref } from 'vue'
    import StreamArticle from '@/components/StreamArticle.vue';
    import { useStreamStore } from '@/store/streamStore'

    const props = defineProps<{
        streamName: string
    }>()

    const { streamName } = toRefs(props)

    const { getStreamsByName } = useStreamStore()

    const streamData = computed(() => getStreamsByName(unref(streamName)))

</script>

<style scoped>
    .articles-list {
        min-width: 250px;
        width: 250px;
        scroll-snap-align: start;
        overflow: auto;
        scroll-snap-type: y mandatory;
    }
</style>