<template>
    <div v-if="hasMeaningfulContent" class="article">
        {{ createdAt }}
        <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer">
            {{ title }}
        </a>
        <StreamImage 
            v-if="images.length" 
            :images="images"
        />
        <template v-if="text">
            <div>{{ text }}</div>
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { toRefs } from 'vue'
    import { ArticleData } from '@shared/types'
    import { useArticleMapping } from '@/composables/useArticleMapping'
    import StreamImage from '@/components/StreamArticles/StreamImage.vue';

    const props = defineProps<{
        article: ArticleData
    }>()

    const { article } = toRefs(props)

    const {
        hasMeaningfulContent, 
        title, 
        text,
        images,
        url,
        createdAt
    } = useArticleMapping(article)
</script>

<style scoped>
.article {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    overflow: hidden;
    scroll-snap-align: start end;

    a {
        display: inline-block;
    }
}
</style>