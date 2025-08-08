<template>
    <div class="stream-config-form">
        <FormField 
            v-model="form.name" 
            fieldName="Stream Name" type="text" />
        <FormField 
            v-model="form.url" 
            fieldName="Stream URL" type="text" />
        <FormField 
            v-model="form.title" 
            fieldName="Stream Title" type="text" />
        <FormField 
            :model-value="form.config?.useLogin" 
            fieldName="Use Login" type="checkbox"  
            @change="doInput('form.config.useLogin', $event)" />
        <FormGroup 
            v-if="form.config?.useLogin" 
            :form-group="form.config.loginData.username" 
            name="Username"
            @input="doInput('form.config.loginData.username', $event)" />
        <FormGroup 
            v-if="form.config?.useLogin" 
            :form-group="form.config.loginData.password" 
            name="Password"
            @input="doInput('form.config.loginData.password', $event)" />
        <FormGroup 
            v-if="form.config?.useLogin" 
            :form-group="form.config.loginData.loginButton" 
            name="Login Button"
            @input="doInput('form.config.loginData.loginButton', $event)" />
        <FormField 
            :model-value="form.config?.hasCookieBanner" 
            fieldName="Has Cookie Banner" type="checkbox" 
            @change="doInput('form.config.hasCookieBanner', $event)" />
        <FormGroup 
            v-if="form.config?.hasCookieBanner" 
            :form-group="form.config.cookieBannerData.cookieBanner" 
            name="Cookie Banner"
            @input="doInput('form.config.cookieBannerData.cookieBanner', $event)" />
        <FormGroup 
            v-if="form.config?.articleData.articles" 
            :form-group="form.config?.articleData.articles" 
            name="Articles"
            @input="doInput('form.config.articleData.articles', $event)" />
        <pre>{{ form }}</pre>
    </div>
</template>

<script lang="ts" setup>
import { Stream } from '@shared/types';
import { reactive, Reactive, watch } from 'vue';
import FormField from '@/components/Form/FormField.vue';
import FormGroup from '@/components/Form/FormGroup.vue';

const emit = defineEmits<{
    (e: 'input', form: Stream): void;
}>();

const props = defineProps<{
    formToEdit?: Stream | null;
}>();

const form = reactive({
    name: '',
    url: '',
    title: '',
    config: {
        meta: {},
        useLogin: false,
        loginData: {
            username: {
                selector: '',
                useShadowRoot: false,
                action: "type",
                value: '',
                waitFor: ''
            },
            password: {
                selector: '',
                useShadowRoot: false,
                action: "type",
                value: '',
                waitFor: ''
            },
            loginButton: {
                selector: '',
                useShadowRoot: false,
                action: "click",
                value: '',
                waitFor: ''
            }
        },
        hasCookieBanner: false,
        cookieBannerData: {
            cookieBanner: {
                selector: '',
                useShadowRoot: false,
                action: "click",
                value: '',
                waitFor: ''
            }
        },
        articleData: {
            articles: {
                selector: '',
                useShadowRoot: false,
                action: "get",
                value: '',
                waitFor: ''
            },
        },
        refreshInterval: 120000,
        type: 'dom'
    }
}) as Reactive<Stream>
 
const doInput = (path: string, event: any) => {
    if (form.config && path === 'form.config.useLogin') {
        form.config.useLogin = event.target.checked;
    }
    if (form.config && path === 'form.config.hasCookieBanner') {
        form.config.hasCookieBanner = event.target.checked;
    }
}

watch(form, (newForm) => {
    emit('input', newForm)
}, {deep: true})

if (props.formToEdit) {
    Object.assign(form, props.formToEdit);
}

</script>

<style scoped>
.stream-config-form {
    height: auto;
    overflow: auto;
}
</style>