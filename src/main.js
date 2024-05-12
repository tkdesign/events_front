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

const app = createApp(App);

app.use(createVuetify({components, directives,  icons: {defaultSet: 'mdi',},}));
app.use(createPinia());
app.provide('topMenuStore', useTopMenuStore());
const router = createMyRouter();
app.use(router);
app.mount('#app')
