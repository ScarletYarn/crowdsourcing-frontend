<template>
  <div class="workpanel">
    <div class="content">
      <div class="overallScros">
        <div class="infos">
          <div class="block">
            <p>恭喜您，您已经完成全部题目，请回答以下问题:</p>
            <div class="overallform">
              <el-form
                ref="overallScore"
                :model="questionScores"
                label-width="170px"
                label-position="left"
              >
                <p>■ 打分题（1-5分表示程度）</p>
                <el-form-item
                  label="1) 您认为当前三类界面表达的辅助信息是否清晰？"
                  label-width="450px"
                >
                  <el-rate
                    style="line-height: 46px"
                    v-model="questionScores.q1"
                  ></el-rate>
                </el-form-item>
                <el-form-item
                  label="2) 您认为当前三类界面表达的辅助信息是否足以帮助您理解规则？"
                  label-width="450px"
                >
                  <el-rate
                    style="line-height: 46px"
                    v-model="questionScores.q2"
                  ></el-rate>
                </el-form-item>
                <el-form-item
                  label="3) 在两组任务中，您对呈现给您的辅助界面总体满意程度为："
                  label-width="450px"
                >
                </el-form-item>
                <el-form-item
                  label="第一组（Q1-Q10）："
                  label-width="200px"
                  style="padding-left: 30px"
                >
                  <el-rate
                    style="line-height: 46px"
                    v-model="questionScores.q3s1"
                  ></el-rate>
                </el-form-item>
                <el-form-item
                  label="第二组（Q11-Q20）："
                  label-width="200px"
                  style="padding-left: 30px"
                >
                  <el-rate
                    style="line-height: 46px"
                    v-model="questionScores.q3s2"
                  ></el-rate>
                </el-form-item>
                <el-form-item
                  label="4) 在两组任务中，您利用辅助界面完成任务的轻松程度？"
                  label-width="450px"
                >
                </el-form-item>
                <el-form-item
                  label="第一组（Q1-Q10）："
                  label-width="200px"
                  style="padding-left: 30px"
                >
                  <el-rate
                    style="line-height: 46px"
                    v-model="questionScores.q4s1"
                  ></el-rate>
                </el-form-item>
                <el-form-item
                  label="第二组（Q11-Q20）："
                  label-width="200px"
                  style="padding-left: 30px"
                >
                  <el-rate
                    style="line-height: 46px"
                    v-model="questionScores.q4s2"
                  ></el-rate>
                </el-form-item>
                <el-form-item
                  label="5) 如果需要您日后完成更多的任务，在两组任务中，您更倾向于用哪组任务呈现的辅助界面？（请根据您完成任务的感受评分，无需您再次完成任务）"
                  label-width="450px"
                >
                </el-form-item>
                <el-form-item
                  label="第一组（Q1-Q10）："
                  label-width="200px"
                  style="padding-left: 30px"
                >
                  <el-rate
                    style="line-height: 46px"
                    v-model="questionScores.q5s1"
                  ></el-rate>
                </el-form-item>
                <el-form-item
                  label="第二组（Q11-Q20）："
                  label-width="200px"
                  style="padding-left: 30px"
                >
                  <el-rate
                    style="line-height: 46px"
                    v-model="questionScores.q5s2"
                  ></el-rate>
                </el-form-item>
                <p>■ 填空题</p>
                <el-form-item label="请给出您的建议（必填）">
                  <el-input
                    type="textarea"
                    v-model="questionScores.advice"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">
                    完成问题，点击查看做题情况
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addOverallQuestionnaire, jobComplete } from '@/service'
import { ElMessageBox } from 'element-plus'

export default {
  name: 'questionOverall',
  data() {
    return {
      questionScores: {
        q1: 0,
        q2: 0,
        q3s1: 0,
        q3s2: 0,
        q4s1: 0,
        q4s2: 0,
        q5s1: 0,
        q5s2: 0,
        advice: ''
      }
    }
  },
  methods: {
    async onSubmit() {
      if (process.env.NODE_ENV === 'dev') {
        this.questionScores.q1 = 1
        this.questionScores.q2 = 1
        this.questionScores.q3s1 = 1
        this.questionScores.q3s2 = 1
        this.questionScores.q4s1 = 1
        this.questionScores.q4s2 = 1
        this.questionScores.q5s1 = 1
        this.questionScores.q5s2 = 1
        this.questionScores.advice = '1233'
      }
      if (
        this.questionScores.q1 === 0 ||
        this.questionScores.q2 === 0 ||
        this.questionScores.q3s1 === 0 ||
        this.questionScores.q3s2 === 0 ||
        this.questionScores.q4s1 === 0 ||
        this.questionScores.q4s2 === 0 ||
        this.questionScores.q5s1 === 0 ||
        this.questionScores.q5s2 === 0 ||
        this.questionScores.advice === ''
      ) {
        await ElMessageBox({
          type: 'warning',
          message: '请完成调查内容'
        })
        return
      }
      await addOverallQuestionnaire(
        this.$route.params.jobId,
        this.questionScores.q1,
        this.questionScores.q2,
        this.questionScores.q3s1,
        this.questionScores.q3s2,
        this.questionScores.q4s1,
        this.questionScores.q4s2,
        this.questionScores.q5s1,
        this.questionScores.q5s2,
        this.questionScores.advice
      )
      await jobComplete(this.$route.params.jobId)
      await this.$router.push({
        name: 'check',
        params: { jobId: this.$route.params.jobId }
      })
    }
  }
}
</script>

<style scoped>
.workpanel {
  margin: 20px 100px 0 100px;
  background-color: #fff;
}
.content {
  padding: 0 18px;
}

.title span {
  font-size: 28px;
  color: #4a4a4a;
  font-weight: 700;
}
.infos {
  margin: 0 auto;
  margin-top: 30px;
  text-align: left;
  padding-top: 30px;
  padding-bottom: 10px;
  border-top: 1px solid hsla(0, 0%, 59%, 0.2);
}
.infos .rule {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.carousel ::v-deep(.el-carousel__arrow) {
  width: 50px;
  height: 55px;
  background-color: #bbb;
}

.carousel ::v-deep(.el-carousel__button) {
  background-color: #9f9f9f;
}
.carousel ::v-deep(.el-rate__icon) {
  /*font-size: 30px;*/
}
.carousel ::v-deep(.el-icon-star-off) {
  color: #2c3e50 !important;
  font-size: 24px;
}
.carousel ::v-deep(.el-icon-star-on) {
  /*color: #2c3e50 !important;*/
  font-size: 29px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.block {
  box-sizing: border-box;
  width: 80%;
  position: relative;
  margin: 0 auto;
}
.overallScros {
  box-sizing: border-box;
  width: 80%;
  position: relative;
  margin: 0 auto;
}

.overallform {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 30px 20px;
}
</style>
