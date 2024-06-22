import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
//import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import { createMyRouter } from './router'

import {useTopMenuStore} from "@/stores/topMenuStore.js";
import {useEventStore} from "@/stores/eventStore.js";
import {useUserStore} from "@/stores/userStore.js";

import VueCookies from 'vue-cookies';

const app = createApp(App);

app.use(VueCookies);
app.use(createVuetify({components, directives,  icons: {defaultSet: 'mdi',},}));
app.use(createPinia());
app.provide('topMenuStore', useTopMenuStore());
app.provide('eventStore', useEventStore());
app.provide('userStore', useUserStore());
const router = createMyRouter();
app.use(router);
app.mount('#app')
