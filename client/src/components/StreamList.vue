<template>
    <StreamArticle
        v-for="article, index in streamData"
        :key="`${streamId}_${index}`" 
        :article="article"
        :stream-root-url="streamRootUrl"
    />
</template>

<script lang="ts" setup>
    import { toRefs } from 'vue'
    import { ArticleData } from '@shared/types'
    import StreamArticle from '@/components/StreamArticle.vue';

    const props = defineProps<{
        streamData: ArticleData[],
        streamId: string,
        streamRootUrl: string
    }>()

    const { streamData, streamId, streamRootUrl } = toRefs(props)
</script>

<style scoped>
</style>