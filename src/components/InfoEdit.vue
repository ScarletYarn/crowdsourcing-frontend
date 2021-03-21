<template>
  <div class="infoedit_container">
    <el-form :model="userMe" label-width="100px" class="update_form">
      <!--姓名-->
      <el-form-item label="姓名">
        <el-input v-model="userMe.username"></el-input>
      </el-form-item>
      <!--手机号-->
      <el-form-item label="支付宝账号">
        <el-input v-model="userMe.mobile"></el-input>
      </el-form-item>

      <!--按钮-->
      <el-form-item>
        <el-button type="primary" @click="update">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {update, getme} from "@/service";
import {ElMessageBox} from "element-plus";

export default {
  name: "InfoEdit",
  data(){
    return{
      userMe:{
        username:'sxw',
        mobile:"12341"
      }
    }
  },
  created(){
    this.getUserMe()
  },
  methods:{
    async getUserMe() {
      const res = await getme()
      console.log(res)
      this.userMe.username = res.data.data.username
      this.userMe.mobile = res.data.data.phone
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    },
    async update(){
      const res = await update(this.userMe.username, this.userMe.mobile)
      console.log(res)
      if (!res.data.data) return this.$message.error(res.data.msg)
      await ElMessageBox({
        type: 'succeeded',
        message: '修改成功'
      })
    }
  }
}
</script>

<style scoped>
.infoedit_container{
  width: 400px;
  height: 100%;
  margin: 0 80px;
  padding-top: 20px;
  text-align: left;
}
</style>