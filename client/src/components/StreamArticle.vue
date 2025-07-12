<template>
    <div v-if="hasMeaningfulContent" class="stream-article">
        <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer">
            {{ title }}
        </a>
        <StreamImage 
            v-if="images.length" 
            :images="images"
        />
        <template v-if="text">
            {{ text }}
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { ArticleData } from '@shared/types'
    import { useArticleMapping } from '@/composables/useArticleMapping'
    import StreamImage from './StreamImage.vue';

    const {
        article,
        streamRootUrl
     } = defineProps<{
        article: ArticleData,
        streamRootUrl: string
    }>()

    const {
        hasMeaningfulContent, 
        title, 
        text,
        images,
        url
    } = useArticleMapping(article, streamRootUrl)
</script>

<style scoped>
.stream-article {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
    overflow: hidden;
}
</style>