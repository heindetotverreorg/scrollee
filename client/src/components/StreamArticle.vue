<template>
    <div v-if="hasMeaningfulContent" class="stream-article">
        {{ createdAt }}
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
    import { toRefs } from 'vue'
    import { ArticleData } from '@shared/types'
    import { useArticleMapping } from '@/composables/useArticleMapping'
    import StreamImage from './StreamImage.vue';

    const props = defineProps<{
        article: ArticleData,
        streamRootUrl: string
    }>()

    const { article, streamRootUrl } = toRefs(props)

    const {
        hasMeaningfulContent, 
        title, 
        text,
        images,
        url,
        createdAt
    } = useArticleMapping(article, streamRootUrl)
</script>

<style scoped>
.stream-article {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    overflow: hidden;
    scroll-snap-align: start end;
}
</style>