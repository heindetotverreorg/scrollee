<template>
    <section class="form-group">
        {{ name }}
        <FormField v-model="formGroup.selector" fieldName="Selector" type="text" />
        <FormField v-model="formGroup.useShadowRoot" fieldName="Use Shadow Root" type="checkbox" />
        <FormField v-model="formGroup.action" fieldName="Action" type="select" :options="['type', 'click', 'get']" />
        <FormField v-model="formGroup.value" fieldName="Value" type="text" />
        <FormField v-model="formGroup.waitFor" fieldName="Wait For" type="text" />
    </section>
</template>
<script lang="ts" setup>
import { defineProps, watch } from 'vue';
import FormField from '@/components/Form/FormField.vue';

const props = defineProps<{
    formGroup: {
        selector: string | undefined;
        useShadowRoot?: boolean | undefined;
        action: string | undefined;
        value?: string | undefined;
        waitFor?: string | undefined;
    },
    name: string;
}>();

const emit = defineEmits<{
    (e: 'input', value: any): void;
}>();

watch(() => props.formGroup, (newForm) => {
    emit('input', newForm);
}, { deep: true });
</script>
<style lang="scss" scoped>
.form-group {
    border: 1px grey solid;
    border-radius: 5px;
    margin-bottom: 1rem;
    padding: 5px;
}
</style>
