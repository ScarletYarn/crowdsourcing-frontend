<template>
  <div class="login_container">
    <div class="login_box">
      <!-- logo-->
      <div class="avatar_box">
        <img src="../assets/NameLogo2Ver-dark.png" alt="" />
      </div>
      <!--登录表单-->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!--用户名-->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入手机号"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            type="password"
            disabled
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          ></el-input>
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
import { login } from '../service'
import { ElMessageBox } from 'element-plus'

export default {
  name: 'Login',
  mounted() {
    if (process.env.NODE_ENV === 'dev') {
      this.loginForm = {
        username: '12341234100',
        password: '123123'
      }
    }
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { min: 11, max: 11, message: '长度应为11个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async login() {
      this.loginForm.password = '123123'
      await this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        try {
          const res = await login(
            this.loginForm.username,
            this.loginForm.password
          )
          if (res.status !== 200) return this.$message.error('登录失败')
          // this.$message.error('登录成功')
          await ElMessageBox({
            type: 'succeeded',
            message: '登录成功'
          })
          await this.$router.push('availablejobs')
        } catch (e) {
          await ElMessageBox({
            type: 'error',
            message: '用户名或密码错误，请确认已注册账号'
          })
          console.log(e.response.data.msg)
        }
      })
    },
    signup() {
      this.$router.push('/signup')
    }
  }
}
</script>

<style scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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

.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
