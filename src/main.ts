import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Router from 'src/Router';
import './style.css';
import App from './App.vue';

const pinia = createPinia();

createApp(App)
	.use(pinia)
	.use(Router)
	.mount('#app');
