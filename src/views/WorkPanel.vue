<template>
  <el-container>
    <el-header>
      <div>
        <a href="/availablejobs" style="display: block; height: 100px"><img src="../assets/12345.png" alt="" /></a>
        <span>知识众包系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import {logout} from "@/service";

export default {
  name: 'WorkPanel',
  methods: {
    async logout() {
      await logout()
      this.$store.commit('logout')
      await this.$router.replace('/login')
    },
  }
}
</script>

<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  align-content: center;
  color: #ffffff;
  font-size: 20px;
}
.el-header > div {
  display: flex;
  align-items: center;
}
.el-header > div span {
  margin-left: 15px;
}

.el-main {
  background-color: #eaedf1;
}
</style>
