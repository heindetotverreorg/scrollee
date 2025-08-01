<template>
    <section class="stream-config-modal">
        <h3>Stream configuration</h3>
        <StreamConfigForm />
        <button>Save</button>
        <button @click="$emit('close-modal')">Cancel</button>
    </section>
    <div class="modal-bg"></div>
</template>

<script lang="ts" setup>
import StreamConfigForm from '@/components/StreamConfig/StreamConfigForm.vue'

defineEmits(['close-modal'])

</script>

<style scoped>
h3 {
    margin: 0
}

.modal-bg {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    filter: blur(2px);
    z-index: 2;
}

.stream-config-modal {
    /* Add your styles here */
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    position: fixed;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    top: 50%;
    max-width: 500px;
    height: 80vh;
    width: 80vw;
    z-index: 5;
}

.stream-config-content {
    padding: 20px;
}

.btn-cancel,
.btn-save {
    margin: 0 8px;
    padding: 8px 16px;
}
</style>
