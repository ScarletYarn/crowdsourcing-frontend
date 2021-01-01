<template>
  <div class="wrapper">You are an administrator!</div>
  <button @click="logout">Logout</button>
</template>

<script>
import { logout } from '../service'

export default {
  name: 'Admin',
  methods: {
    async logout() {
      await logout()
      this.$store.commit('logout')
      await this.$router.replace('login')
    }
  }
}
</script>

<style scoped></style>
