<template>
    <div class="stream-config-form">
        <div>
            <input v-model="form.name" placeholder="Stream Name" />
        </div>
        <div>
            <input v-model="form.url" placeholder="Stream URL" />
        </div>
        <div>
            <input v-model="form.title" placeholder="Stream Title" />
        </div>
        <div>
            <input type="checkbox" :value="form.config?.useLogin" @change="doInput('form.config.useLogin', $event)" />
            <label>Use Login</label>
        </div>
        <div v-if="form.config?.useLogin">
            <div>
                <input v-model="form.config.loginData.username.selector" placeholder="Username Selector" />
            </div>
            <div>
                <input v-model="form.config.loginData.username.useShadowRoot" type="checkbox" />
                <label>Use Shadow Root</label>
            </div>
            <div>
                <select v-model="form.config.loginData.username.action">
                    <option value="type">Type</option>
                    <option value="click">Click</option>
                    <option value="get">Get</option>
                </select>
            </div>
            <div>
                <input v-model="form.config.loginData.username.value" placeholder="Username Value" />
            </div>
            <div>
                <input v-model="form.config.loginData.username.waitFor" placeholder="Wait For" />
            </div>
        </div>
        <div>
            <input type="checkbox" :value="form.config?.hasCookieBanner" @change="doInput('form.config.hasCookieBanner', $event)" />
            <label>Has Cookie Banner</label>
        </div>
        <div v-if="form.config?.hasCookieBanner">
            <div>
                <input v-model="form.config.cookieBannerData.selector" placeholder="Cookie Banner Selector" />
            </div>
            <div>
                <input v-model="form.config.cookieBannerData.useShadowRoot" type="checkbox" />
                <label>Use Shadow Root</label>
            </div>
            <div>
                <select v-model="form.config.cookieBannerData.action">
                    <option value="click">Click</option>
                    <option value="type">Type</option>
                    <option value="get">Get</option>
                </select>
            </div>
            <div>
                <input v-model="form.config.cookieBannerData.value" placeholder="Cookie Banner Value" />
            </div>
            <div>
                <input v-model="form.config.cookieBannerData.waitFor" placeholder="Wait For" />
            </div>
        </div>
        <div>
            <button @click="$emit('submit', form)">Submit</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Stream } from '@shared/types';
import { reactive, Reactive } from 'vue';

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

</script>

<style scoped>
.stream-config-form {
    
}
</style>