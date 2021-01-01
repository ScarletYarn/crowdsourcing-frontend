<template>
  <div class="wrapper">Anyone can see this!</div>
  <button @click="any">Anyone</button>
  <button @click="user">User</button>
  <button @click="admin">Admin</button>
  <router-link to="login">Login</router-link>
</template>

<script>
import { any, user, admin } from '../service'
import { ElMessageBox } from 'element-plus'

export default {
  name: 'Any',
  methods: {
    async any() {
      const data = await any()
      await ElMessageBox({
        type: 'succeeded',
        message: data.data
      })
    },
    async user() {
      const data = await user()
      await ElMessageBox({
        type: 'succeeded',
        message: data.data
      })
    },
    async admin() {
      const data = await admin()
      await ElMessageBox({
        type: 'succeeded',
        message: data.data
      })
    }
  }
}
</script>

<style scoped></style>
