import { createApp } from 'vue'
// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// eslint-disable-next-line no-unused-vars
import installElementPlus from './plugins/element.js'

import './assets/css/global.css'

// if (process.env.NODE_ENV === 'dev') require('./mock')

const app = createApp(App)

installElementPlus(app)
app
  .use(store)
  .use(router)
  .mount('#app')
