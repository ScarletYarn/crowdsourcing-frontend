import { createApp } from 'vue'
// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// eslint-disable-next-line no-unused-vars
import installElementPlus from './plugins/element.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './assets/css/global.css'

if (process.env.NODE_ENV === 'dev') require('./mock')

library.add(faThumbsUp)
library.add(faThumbsDown)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'ICA众包平台'
  }
  next()
})

installElementPlus(app)
app
  .use(store)
  .use(router)
  .mount('#app')
