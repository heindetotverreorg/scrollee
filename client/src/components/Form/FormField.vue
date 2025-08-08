<template>
    <div class="form-field">
        <div class="form-field-label">
            <label 
                :for="id" 
            >
                {{ fieldName }}
            </label>
        </div>
        <div                 
            class="form-field-input"
            :class="`form-field-input-${type}`"
        >
            <input
                v-if="type !== 'select'"
                v-model="value" 
                :id="id"
                :placeholder="fieldName" 
                :type="type"
                @change="emit('update:modelValue', value)"
            />
            <div v-else>
                <select v-model="value">
                    <option v-for="type in options" :key="type" :value="type">{{ type }}</option>
                </select>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';

type ModelValue = string | number | boolean | undefined;

const props = defineProps<{
    modelValue: ModelValue;
    fieldName: string;
    type?: string;
    options?: string[];
}>();

const id = `${props.fieldName.toLowerCase().replace(/\s+/g, '-')}`;

const emit = defineEmits<{
    (e: 'update:modelValue', value: ModelValue): void;
}>();

const value = ref(props.modelValue);

watch(value, (newValue) => {
    emit('update:modelValue', newValue);
});
</script>
<style lang="scss" scoped>
.form-field {
    margin-top: 10px;
}

input[type="text"] {
    width: 100%;
    ;
}
</style>