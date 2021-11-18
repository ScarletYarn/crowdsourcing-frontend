<template>
  <div class="workpanel">
    <div class="content">
      <div class="title">
        <span>任务描述</span>
      </div>
      <div class="infos">
        <video
          style="width: 100%; height: 100%"
          src="/video/知识众包讲解.mov"
          controls="controls"
        >
          您的浏览器不支持视频播放。
        </video>
      </div>
      <div class="action">
        <el-button type="primary" @click="nextStage">开始任务</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getQuestionnaire } from '@/service'

export default {
  name: 'workDesc',
  methods: {
    async nextStage() {
      const jobId = this.$route.params.jobId
      const res = await getQuestionnaire(jobId)
      if (res.data.data !== null) {
        await this.$router.push({
          name: 'workdo1',
          params: { jobId }
        })
      } else {
        await this.$router.push({
          name: 'questionnaire',
          params: { jobId }
        })
      }
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
