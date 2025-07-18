<template>
    <div class="bundled-streams">
        <StreamArticle 
            v-for="article, index of getBundledStreams" 
            :key="`${article.title}_${index}`" 
            :article="article"
        />
    </div>
</template>
<script setup lang="ts">
import { useStreamStore } from '@/store/streamStore'
import StreamArticle from '@/components/StreamArticle.vue'

const { getBundledStreams } = useStreamStore()
</script>
<style scoped lang="scss">
    .bundled-streams {
        width: 100%;
        scroll-snap-align: start;

        @media screen and (min-width: 400px) {
            min-width: 400px;
            width: 400px;
        }
    }

    // .stream-list {
    //     height: calc(100% - 83px);
    //     overflow: auto;
    //     scroll-snap-type: y mandatory;
    // }
</style>