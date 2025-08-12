<template>
    <section class="stream-config-modal">
        <h3>Stream configuration</h3>
        <FormField
            v-if="editMode"
            v-model="saveStreams"
            fieldName="Save streams"
            type="checkbox" />
        <FormField
            v-if="editMode && saveStreams"
            v-model="uniqueStreamsKey"
            fieldName="Unique streams key (click to copy)"
            type="text"
            @click="copyToClipBoard" />
        <div v-if="showTooltip" class="tooltip">
            Unique streams key copied to clipboard!
        </div>
        <FormField
            v-if="editMode"
            v-model="editFormName"
            fieldName="Stream to edit"
            placeholder="Stream to edit" 
            :options="createdStreams.map(s => s.name)"
            type="select" />
        <StreamConfigForm 
            v-if="!editMode || editMode && editFormName"
            @input="onInput" 
            :form-to-edit="editForm" />
        <div class="buttons">
            <button @click="$emit('save-stream', form)">Save</button>
            <button @click="$emit('close-modal')">Cancel</button>
        </div>
    </section>
    <div class="modal-bg"></div>
</template>

<script lang="ts" setup>
import { Stream } from '@shared/types';
import StreamConfigForm from '@/components/StreamConfig/StreamConfigForm.vue'
import { computed, ref } from 'vue';
import FormField from '../Form/FormField.vue';
import { createdStreams } from '@shared/models/streams';

const props = defineProps<{
    editMode?: boolean;
}>();

defineEmits<{
    (e: 'save-stream', form: Stream): void;
    (e: 'close-modal'): void;
}>();

const form = ref<Stream>({} as Stream);
const editFormName = ref(''); 
const saveStreams = ref<boolean>(false);
const uniqueStreamsKey = ref(crypto.randomUUID());
const showTooltip = ref(false); 

const editForm = computed(() => {
    if (props.editMode && editFormName.value) {
        return createdStreams.find(s => s.name === editFormName.value) || {} as Stream;
    }
    return null
});

const copyToClipBoard = async () => {
    try {
        await navigator.clipboard.writeText(uniqueStreamsKey.value);
        console.log('Unique streams key copied to clipboard');
        showTooltip.value = true;
        setTimeout(() => showTooltip.value = false, 2000);
    } catch (err) {
        console.error('Failed to copy unique streams key: ', err);
    }
};

const onInput = (newForm : Stream) => {
    form.value = { ...newForm }; 
};

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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
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

.buttons {
    margin-top: auto;
}

.btn-cancel,
.btn-save {
    margin: 0 8px;
    padding: 8px 16px;
}
</style>
