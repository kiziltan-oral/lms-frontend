import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from '@/plugins/axios'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'

import 'admin-lte/dist/css/adminlte.min.css'
import 'admin-lte/dist/js/adminlte.min.js'

import 'bootstrap'
import 'admin-lte'

import 'toastr/build/toastr.min.css'
import toastr from 'toastr'

const app = createApp(App)
app.config.globalProperties.$axios = axios
app.config.globalProperties.$toastr = toastr
app.use(createPinia())
app.use(router)

app.mount('#app')
