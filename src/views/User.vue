<template>
  <el-container class="user_container">
    <el-header>
      <div>
        <img src="../assets/12345.png" alt="" />
        <span>知识众包系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="isMenuCollapse? '64px' : '200px' ">
        <div class="toggle_button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isMenuCollapse"
          :collapse-transition="false"
          router
        >
          <el-menu-item index="/availablejobs">
            <template #title>
              <i class="el-icon-s-claim"></i>
              <span>可获得的工作</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/myreward">
            <template #title>
              <i class="el-icon-coin"></i>
              <span>我的酬劳</span>
            </template>
          </el-menu-item>
          <el-menu-item index="infoedit">
            <template #title>
              <i class="el-icon-edit-outline"></i>
              <span>资料编辑</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <div class="user_info">
          <div class="user_img">
            <img src="../assets/contributor.png" alt="" />
          </div>
          <div class="user_name_time">
            <p class="user_name">
              姓名: <span>{{ userMe.username }}</span>
            </p>
            <p class="user_time">
              注册时间: <span>{{ userMe.signupDate }}</span>
            </p>
          </div>
        </div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getme, logout } from '../service'

export default {
  name: 'User',
  data() {
    return {
      menuList: [],
      isMenuCollapse: false,
      userMe: {
        username: '',
        mobile: '',
        signupDate: ''
      }
    }
  },
  created() {
    this.getUserMe()
  },
  methods: {
    async getUserMe() {
      const res = await getme()
      this.userMe.username = res.data.data.username
      this.userMe.mobile = res.data.data.phone
      this.userMe.signupDate = res.data.data.signupDate.slice(0, 10)
    },
    async logout() {
      await logout()
      this.$store.commit('logout')
      await this.$router.replace('login')
    },
    toggleCollapse() {
      this.isMenuCollapse = !this.isMenuCollapse
    }
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
.el-aside {
  background-color: #333744;
}
.el-aside .el-menu {
  border-right: 0;
}
.el-main {
  background-color: #eaedf1;
}
.user_container {
  height: 100%;
}
.el-menu-item {
  text-align: left;
}
.toggle_button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.user_info {
  /*width: 1250px;*/
  height: 150px;
  margin: 35px 80px 0 80px;
  border-bottom: 2px solid gray;
  padding-bottom: 35px;
}
.user_img {
  float: left;
}
.user_name_time {
  float: left;
  padding-left: 40px;
  padding-top: 15px;
  text-align: left;
}
.user_name {
  font-size: 22px;
  font-weight: bold;
}
.user_time {
  font-style: oblique;
}
</style>
