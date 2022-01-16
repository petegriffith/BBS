import { createApp } from 'vue'
import i18n from '../src/i18n/index'
import App from './App.vue'
import '../src/css/modals.css'
import { FocusTrap } from 'focus-trap-vue'

createApp(App).component('FocusTrap', FocusTrap).use(i18n).mount('#app')
