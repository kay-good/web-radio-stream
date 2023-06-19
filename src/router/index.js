import { createRouter, createWebHistory } from 'vue-router';
import Host from '../views/Host.vue';
import Listener from '../views/Listener.vue';
import Home from '../views/Home.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/host',
            name: 'Host',
            component: Host
        },
        {
            path: '/listener',
            name: 'Listener',
            component: Listener
        }
    ]
})

export default router