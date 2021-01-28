<template>
  <div class="login_container">
    <div class="login_box">
      <!-- logo-->
      <div class="avatar_box">
        <img src="../assets/NameLogo2Ver-dark.png" alt="">
      </div>
      <!--登录表单-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入手机号" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="info" @click="signup">注册</el-button>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login, roles } from '../service'
import { ROLE_ADMIN } from '../router'

export default {
  name: 'Login',
  data() {
    return {
      loginForm:{
        username: '',
        password: ''
      },
      loginFormRules:{
        username:[
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { min: 11, max: 11, message: '长度应为11个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async login() {
      this.$refs.loginFormRef.validate(async valid=>{
        console.log(valid)
        if (!valid) return
        await login(this.username, this.password)
        const res = await roles()
        this.$store.commit('roles', res.data)
        if (res.data.indexOf(ROLE_ADMIN) !== -1) await this.$router.push('admin')
        else await this.$router.push('user')
      })
    },
    signup(){
      this.$router.push("/signup")
    },
    loginLoginForm(){
      this.$refs.loginFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return;
        const result = await this.$http.post("login",this.loginForm)
        if (result != 200) return this.$message.error('登录失败')
        this.$message.error('登录成功')
      })
    }
  }
}
</script>

<style scoped>
.login_container{
  height: 100%;
  background-color: #2b4b6b;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.avatar_box img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
