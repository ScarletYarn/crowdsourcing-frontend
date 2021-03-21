<template>
  <div class="workpanel">
    <div class="content">
      <div class="title">
        <span>任务描述</span>
      </div>
      <div class="infos"></div>
      <div class="action">
        <el-button type="primary" @click="nextStage">开始任务</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'workDesc',
  methods: {
    nextStage() {
      this.$router.push({
        name: 'questionnaire',
        params: { jobId: this.$route.params.jobId }
      })
    }
  }
}
</script>

<style scoped>
.workpanel {
  margin: 20px 100px 0 100px;
  height: 100%;
  background-color: #fff;
}
.content {
  height: 100%;
  padding: 0 18px;
}
.title {
  padding-top: 30px;
}
.title span {
  font-size: 28px;
  color: #4a4a4a;
  font-weight: 700;
}
.infos {
  margin: auto;
  width: 1100px;
  height: 400px;
  margin-top: 30px;
  text-align: left;
  overflow: hidden;
  padding-bottom: 10px;
  border-top: 1px solid hsla(0, 0%, 59%, 0.2);
  border-bottom: 1px solid hsla(0, 0%, 59%, 0.2);
}
.action {
  margin-top: 60px;
  text-align: center;
  font-size: 15px;
  padding-bottom: 60px;
  position: relative;
}
</style>
