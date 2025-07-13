<template>
    <h3>{{ streamName }}</h3>
    <StreamArticle
        v-for="article, index in streamData"
        :key="`${streamId}_${index}`" 
        :article="article"
        :stream-root-url="streamRootUrl"
    />
</template>

<script lang="ts" setup>
    import { ArticleData } from '@shared/types'
    import StreamArticle from '@/components/StreamArticle.vue';

    const { 
        streamData, 
        streamId,  
        streamRootUrl,
        streamName
    } = defineProps<{
        streamData: ArticleData[],
        streamId: string,
        streamRootUrl: string,
        streamName: string
    }>()

</script>

<style scoped>
</style>