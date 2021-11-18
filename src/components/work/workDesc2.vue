<template>
  <div class="workpanel">
    <div class="content">
      <div class="title">
        <span>任务介绍</span>
      </div>
      <div class="infos" style="padding: 20px 100px; line-height: 30px">
        <p>亲爱的参与者，</p>
        <p style="text-indent: 2em">
          您好！感谢您参加本次用户实验。
        </p>

        <p style="text-indent: 2em">
          <b>实验目标</b
          >：请您使用并且比较三种界面（自然语言界面、图谱界面、实例界面），判断哪种界面能更有效地帮助您更好地理解题目。
        </p>

        <div style="padding-left: 2em">
          <b>实验任务</b>
          <ol style="margin-left: 1em">
            <li>
              本次实验需要完成2组任务，每组任务各自回答10道题。每一题，系统都会推荐一个辅助界面帮助您答题（两组任务的推荐算法不同）。如您觉得该界面无法达到辅助目的，您可以有偿切换下一个不同的界面，<b
                >但请注意，切换后不可再回到上一个辅助界面。</b
              >
            </li>
            <li>当您完成每1组任务（10题）后，请您对当前体验进行评价。</li>
            <li>当您完成全部2组任务（20题）后，请您进行综合评价。</li>
          </ol>
          <div style="margin-left: 2em">
            注：在对每题进行正误判断时，请注意规则的正误是指其逻辑推理过程是否正确，只要该逻辑符合普遍情况，即可认为该规则是正确的。
          </div>
        </div>

        <p style="text-indent: 2em">
          <b>实验报酬</b
          >：与第一轮实验类似，本次实验报酬包括基础工资和绩效奖励两部分。
        </p>
        <p style="text-indent: 2em; padding-left: 34px">
          ·
          基础工资：每题有2个基础金币，当您选择切换辅助界面，将会扣除1个金币，当您答对一题将会获得
          3个金币。<b
            >我们鼓励您在没有把握理解题意的情况下切换界面，虽然切换界面需要扣除一个金币，但答对一题会增加三个金币，答错无金币。</b
          >
        </p>
        <p style="text-indent: 2em; padding-left: 34px">
          ·
          奖励工资：您所得的金币将和所有参与者所得的平均工资进行比较，如你所得金币大于所有参与者平均所得金币，您将获得以下形式的奖励：
        </p>

        <div style="width: 100%; text-align: center">
          <img
            src="@/assets/img/rewardformula.png"
            style="width: 400px; margin: 0 auto"
          />
        </div>
        <p style="text-indent: 4em">
          其中，<img src="@/assets/img/c_gain.png" />表示该用户所得金币，
          <img src="@/assets/img/c_ave.png" />表示所有用户平均所得金币，<img
            src="@/assets/img/c_total.png"
          />为100。
        </p>

        <p style="text-indent: 2em">衷心感谢您的参与和配合！</p>
      </div>
      <div class="action">
        <el-button type="primary" @click="nextStage">开始任务</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { groupCommentComplete } from '@/service'

export default {
  name: 'workDesc1',
  methods: {
    async nextStage() {
      const jobId = this.$route.params.jobId
      const isCompleteGroupComment = await groupCommentComplete(jobId, 20)
      if (isCompleteGroupComment.data.data) {
        await this.$router.push({
          name: 'questionOverall',
          params: { jobId }
        })
      } else {
        await this.$router.push({
          name: 'workdo2',
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
