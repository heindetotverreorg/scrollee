<template>
    <StreamArticle v-for="article, index in streamData" :key="`${streamId}_${index}`" :article="article" />
</template>

<script lang="ts" setup>
    import { ArticleData } from '@shared/types'
    import StreamArticle from '@/components/StreamArticle.vue';

    const { streamData, streamId } = defineProps<{
        streamData: ArticleData[],
        streamId: string
    }>()

</script>

<style scoped>
.stream-data {
    
}
</style>