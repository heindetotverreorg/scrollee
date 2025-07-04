<template>
    <div v-if="hasMeaningfulContent" class="stream-article">
        {{ title }}
        ---
        {{ text }}
    </div>
</template>

<script lang="ts" setup>
    import { ArticleData } from '@shared/types'
    import { useArticleMapping } from '@/composables/useArticleMapping'

    const { article } = defineProps<{
        article: ArticleData
    }>()

    const { hasMeaningfulContent, title, text } = useArticleMapping(article)
</script>

<style scoped>
.stream-article {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
}
</style>