<template>
    <img 
        v-for="image, index of images" 
        :key="index"
        :src="image.src" 
        :alt="image.alt || 'Stream Image'"
        class="stream-image"
    />
</template>
<script lang="ts" setup>
    const { images } = defineProps<{
        images: HTMLImageElement[]
    }>()
</script>
<style scoped>
.stream-image {
    max-width: 100%;
    height: auto;
    margin: 10px 0;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>