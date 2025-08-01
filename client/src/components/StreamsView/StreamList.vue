<template>
    <section class="articles-list-wrapper">
        <div class="articles-list-header">
           <h3 class="articles-list-title">{{ streamName }}</h3>
        </div>
        <div class="articles-list">
            <StreamArticle
                v-for="article, index in streamData"
                :key="`${streamName}_${index}`" 
                :article="article"
            />
        </div>
    </section>
</template>

<script lang="ts" setup>
    import { computed, toRefs, unref } from 'vue'
    import StreamArticle from '@/components/StreamArticles/StreamArticle.vue';
    import { useStreamStore } from '@/store/streamStore'

    const props = defineProps<{
        streamName: string
    }>()

    const { streamName } = toRefs(props)

    const { getStreamsByName } = useStreamStore()

    const streamData = computed(() => getStreamsByName(unref(streamName)))

</script>

<style scoped>
    .articles-list-wrapper {
        display: flex;
        flex-direction: column;
        min-width: 250px;
        margin-top: 5px;
        width: 250px;
    }

    .articles-list {
        scroll-snap-align: start;
        overflow: auto;
        scroll-snap-type: y mandatory;
        position: relative;
    }

    .articles-list-header {
        background-color: #f0f0f0;
        border-bottom: 1px solid #ccc;
        margin-bottom: 5px;
        padding: 5px;
        position: sticky;
        top: 0;
        width: 100%;
        left: 0;

        h3 {
            margin: 0;
        }
    }
</style>