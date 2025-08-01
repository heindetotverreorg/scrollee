<template>
    <div class="stream-config-modal">
        <Modal v-model="isVisible">
            <template #header>
                <h3>Stream Configuration</h3>
            </template>
            
            <div class="stream-config-content">
                <!-- Add your configuration form elements here -->
            </div>

            <template #footer>
                <button class="btn-cancel" @click="closeModal">Cancel</button>
                <button class="btn-save" @click="saveConfig">Save</button>
            </template>
        </Modal>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)

const closeModal = () => {
    isVisible.value = false
}

const saveConfig = () => {
    // Add your save logic here
    closeModal()
}
</script>

<style scoped>
.stream-config-modal {
    /* Add your styles here */
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    
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
