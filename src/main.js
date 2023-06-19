import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"
import { AudioRecorder } from "jnaudiostream";

createApp(App).use(router).mount('#app')
