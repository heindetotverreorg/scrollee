<template>
    <img 
        v-for="image, index of imageSrcs"
        :key="index"
        :src="image.src" 
        :alt="image.alt || 'Stream Image'"
        class="stream-image"
    />
</template>
<script lang="ts" setup>
    import { computed } from 'vue'

    const { images } = defineProps<{
        images: HTMLImageElement[]
    }>()

    const imageSrcs = computed(() => {
        return images.filter((image: HTMLImageElement) => {
            return image.src
        })
    })
</script>
<style scoped>
.stream-image {
    max-width: 100%;
    width: 100%;
    height: auto;
    margin: 10px 0;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media screen and (min-width: 400px) {
        /* width: auto; */
    }
}
</style>