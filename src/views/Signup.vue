<template>
  <div class="signUp_container">
    <div class="signUp_box">
      <!-- logo-->
      <div class="avatar_box">
        <img src="../assets/NameLogo2Ver-dark.png" alt="" />
      </div>
      <!--登录表单-->
      <el-form
        ref="signUpFormRef"
        :model="signUpForm"
        :rules="signUpFormRules"
        label-width="0px"
        class="signUp_form"
      >
        <!--姓名-->
        <el-form-item prop="username">
          <el-input
            v-model="signUpForm.username"
            placeholder="请输入姓名"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!--手机号-->
        <el-form-item prop="mobile">
          <el-input
            v-model="signUpForm.mobile"
            placeholder="请输入手机号"
            prefix-icon="el-icon-mobile-phone"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            v-model="signUpForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!--确认密码-->
        <el-form-item prop="ppassword">
          <el-input
            v-model="signUpForm.ppassword"
            type="password"
            placeholder="请确认密码"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!--按钮-->
        <div
          style="width: 80px;float: left; padding-top: 12px; font-size: 0.9em"
        >
          <a href="login" style="display: block; text-align: left">返回登录</a>
        </div>
        <el-form-item class="btns">
          <el-button type="info" @click="resetSignupForm">重置</el-button>
          <el-button type="primary" @click="signup">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { signup, user, admin } from '../service'
import { ElMessageBox } from 'element-plus'

export default {
  data() {
    return {
      signUpForm: {
        username: '',
        mobile: '',
        password: '',
        ppassword: ''
      },
      signUpFormRules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个汉字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        ppassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { min: 11, max: 11, message: '长度应为11个数字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetSignupForm() {
      this.$refs.signUpFormRef.resetFields()
    },
    signup() {
      this.$refs.signUpFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        console.log(this.signUpForm)
        const res = await signup(
          this.signUpForm.username,
          this.signUpForm.password,
          this.signUpForm.mobile,
          this.signUpForm.mobile
        )
        console.log(res)
        if (!res.data.data) return this.$message.error(res.data.msg)
        await ElMessageBox({
          type: 'succeeded',
          message: '注册成功'
        })
        this.$router.push('login')
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

<style scoped>
.signUp_container {
  height: 100%;
  background-color: #2b4b6b;
}
.signUp_box {
  width: 450px;
  height: 450px;
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
.signUp_form {
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
