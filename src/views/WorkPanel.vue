<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/12345.png" alt="" />
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
export default {
  name: 'WorkPanel'
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
