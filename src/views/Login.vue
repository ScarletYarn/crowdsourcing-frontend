<template>
  <div class="wrapper">
    <div class="input-group">
      <div class="label">Username:</div>
      <input
        class="input"
        v-model="username"
        placeholder="Username goes here..."
      />
    </div>
    <div class="input-group">
      <div class="label">Password:</div>
      <input
        class="input"
        v-model="password"
        placeholder="Password goes here..."
        type="password"
      />
    </div>
    <button @click="login">Submit</button>
  </div>
</template>

<script>
import { login, roles } from '../service'
import { ROLE_ADMIN } from '../router'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      await login(this.username, this.password)
      const res = await roles()
      this.$store.commit('roles', res.data)
      if (res.data.indexOf(ROLE_ADMIN) !== -1) await this.$router.push('admin')
      else await this.$router.push('user')
    }
  }
}
</script>

<style scoped></style>
