import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// eslint-disable-next-line no-unused-vars
import installElementPlus from './plugins/element.js'

router.beforeEach((to, from, next) => {
  if (!to.meta.roles || process.env.NODE_ENV === 'dev') {
    next()
  } else {
    for (let role of to.meta.roles) {
      if (store.state.roles.indexOf(role) === -1) {
        alert('Please login first! ')
        next({ name: 'login' })
        break
      }
    }
    next()
  }
})

if (process.env.NODE_ENV === 'dev') require('./mock')

const app = createApp(App)

installElementPlus(app)
app
  .use(store)
  .use(router)
  .mount('#app')
