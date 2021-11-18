<template>
  <div class="workpanel">
    <div class="content">
      <i-time-indicator ref="indicator"></i-time-indicator>
      <div>基础金币：{{ coins }}</div>
      <div class="workdo" v-show="isScoreShow">
        <div class="infos">
          <div class="progress">
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="
                ruleIdList.length
                  ? ((ruleIndex + 1) * 100) / ruleIdList.length
                  : 0
              "
              :format="
                v => `第${(v * ruleIdList.length) / 100}/${ruleIdList.length}题`
              "
            ></el-progress>
          </div>
          <div class="block">
            <div
              class="next-page"
              v-if="activePageIndex < 2"
              @click="handlePageNext"
            >
              <i class="el-icon-right" />
            </div>
            <p class="rule">
              <el-tooltip effect="dark" placement="top" v-model="showTip">
                <template #content>
                  如果您觉得每题首次出现的辅助界面对于您理解规则帮助不大，可以点击下方右箭头切换辅助界面。注意：一经切换，将无法回到之前的界面。
                </template>
                <i class="el-icon-warning" />
              </el-tooltip>
              规则：{{ rules.content }}
            </p>
            <el-carousel
              indicator-position="none"
              height="350px"
              :autoplay="false"
              arrow="never"
              class="carousel"
              ref="car"
            >
              <el-carousel-item v-bind:class="{ grayActive: isGrayActive }">
                <div class="explain">
                  <h2><span style="color:red;">实例</span>解释方式：</h2>
                  <p style="text-align: center">
                    {{ rules.instance }}
                  </p>
                  <br /><br />
                </div>
              </el-carousel-item>
              <el-carousel-item v-bind:class="{ grayActive: isGrayActive }">
                <div class="explain">
                  <h2><span style="color:red;">自然语言</span>解释方式：</h2>
                  <p style="text-align: center">{{ rules.nl }}</p>
                  <br /><br />
                </div>
              </el-carousel-item>
              <el-carousel-item
                style="overflow-x: hidden; overflow-y: scroll"
                v-bind:class="{ grayActive: isGrayActive }"
              >
                <div class="explain">
                  <h2><span style="color:red;">知识图谱</span>解释方式：</h2>
                  <div style="margin: 0 auto; width: 70%;">
                    <img
                      :src="rules.graph"
                      alt=""
                      style="display: block;width: 77%;padding: 30px;box-sizing: border-box;margin: 0 auto;"
                    />
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <div class="answer">
          <p>通过对规则的理解后，请判断规则是否正确。</p>
          <el-radio
            v-model="answer"
            label="TRUE"
            @click="changeButton($event, 'TRUE')"
          >
            正确
          </el-radio>
          <el-radio
            v-model="answer"
            label="FALSE"
            @click="changeButton($event, 'FALSE')"
          >
            错误
          </el-radio>
        </div>
        <div class="action">
          <el-tooltip
            class="item"
            :disabled="canNext"
            effect="dark"
            content="请在回答后再点击下一题"
            placement="top-start"
          >
            <div class="btn">
              <el-button
                type="primary"
                @click="nextRule"
                :disabled="!canNext || nextBusy"
              >
                下一题
              </el-button>
            </div>
          </el-tooltip>
        </div>
      </div>

      <div class="overallScros" v-show="!isScoreShow">
        <div class="infos">
          <div class="block">
            <p>恭喜您，您已经完成一组题目，请回答以下问题:</p>
            <div class="overallform">
              <el-form
                ref="overallScore"
                :model="overallScores"
                label-width="170px"
              >
                <p>■ 打分题（1-5分表示程度）</p>
                <el-form-item
                  label="您觉得每题首次出现的辅助界面对于您理解规则有帮助吗？"
                  label-width="450px"
                >
                  <el-rate
                    style="line-height: 46px"
                    v-model="overallScores.q1"
                  ></el-rate>
                </el-form-item>
                <el-form-item
                  label="您觉得您切换后的辅助界面对您理解规则有帮助吗？"
                  label-width="450px"
                >
                  <el-rate
                    style="line-height: 46px"
                    v-model="overallScores.q2"
                  ></el-rate>
                </el-form-item>
                <p>■ 填空题</p>
                <el-form-item
                  class="switch-question"
                  label="您为什么会切换界面？什么时候切换界面？"
                >
                  <el-input
                    type="textarea"
                    v-model="overallScores.whyChange"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">
                    {{
                      ruleIndex === ruleIdList.length - 1
                        ? '提交'
                        : '第一组已完成，提交进入第二组测试'
                    }}
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
import TimeIndicator from '@/components/TimeIndicator'
import {
  getRules,
  qRule,
  answer,
  userAct,
  addGroupComment,
  getPageOrder,
  getJobStatus,
  groupCommentComplete,
  getCoinInfo,
  coinInfoNext,
  coinInfoPageSwitch
} from '@/service'
import { ElMessageBox } from 'element-plus'

export default {
  name: 'workDo',
  components: {
    'i-time-indicator': TimeIndicator
  },
  async mounted() {
    this.$refs['indicator'].initiate()
    const jobId = this.$route.params.jobId
    const ruleIdList = await getRules(jobId)
    this.ruleIdList = ruleIdList.data.data
    await this.sendLog('start')
    const coinInfo = (await getCoinInfo()).data.data
    console.log(coinInfo.currentIndex)
    this.coins = coinInfo.count
    await this.getCurrentRule()
    this.activePageIndex = coinInfo.currentIndex
    this.$refs.car.setActiveItem(this.pageOrder[this.activePageIndex])
    const jobStatus = await getJobStatus(jobId)
    if (jobStatus.data.data !== -1) {
      this.ruleIndex = jobStatus.data.data
    }
    if (this.ruleIndex > 0 && this.ruleIndex % 10 === 0) {
      const isCompleteGroupComment = await groupCommentComplete(
        jobId,
        this.ruleIndex
      )
      if (!isCompleteGroupComment.data.data) {
        this.ruleIndex--
        this.isScoreShow = false
      }
    }
    this.resetAll()
    await this.$nextTick(() => {
      this.showTip = true
      setTimeout(() => {
        this.showTip = false
      }, 5 * 1000)
    })
  },
  computed: {
    canNext() {
      return this.answer !== ''
    }
  },
  data() {
    return {
      isScoreShow: true,
      ruleIndex: 0,
      ruleIdList: [],
      rules: {},
      answer: '',
      disabled: true,
      isGrayActive: true,
      overallScores: {
        q1: 0,
        q2: 0,
        whyChange: ''
      },
      nextBusy: false,
      showTip: false,
      coins: 40,
      pageOrder: [2, 1, 0],
      activePageIndex: 0
    }
  },
  methods: {
    resetAll() {
      this.answer = ''
      if (process.env.NODE_ENV === 'dev') {
        this.answer = 'TRUE'
      }
    },
    async getCurrentRule() {
      const types = ['INS', 'NL', 'KG']
      const order = await getPageOrder(this.ruleIdList[this.ruleIndex])
      this.pageOrder = [
        types.indexOf(order.data.data[0]),
        types.indexOf(order.data.data[1]),
        types.indexOf(order.data.data[2])
      ]
      console.log(this.pageOrder)
      this.activePageIndex = 0
      this.$refs['car'].setActiveItem(this.pageOrder[0])
      await this.sendLog(
        `carousel-switch-${types[this.pageOrder[this.activePageIndex]]}`
      )
      const ruleData = await qRule(this.ruleIdList[this.ruleIndex])
      this.rules = ruleData.data.data
    },
    async changeButton(e, s) {
      if (e.target.tagName === 'INPUT') return
      this.disabled = false
      await this.sendLog(`answer-${s}`)
    },
    async nextRule() {
      this.nextBusy = true
      await this.sendLog(`next-rule`)
      await coinInfoNext()
      const res = await answer(
        this.$route.params.jobId,
        this.ruleIdList[this.ruleIndex],
        this.answer,
        0,
        0,
        0,
        0
      )
      if (!res.data.data) {
        await ElMessageBox({
          type: 'error',
          message: res.data.msg
        })
        console.log(res.data.msg)
        this.nextBusy = false
        return
      }

      if ((this.ruleIndex + 1) % 10 === 0) {
        this.isScoreShow = false
        return
      }

      // if (this.ruleIndex === this.ruleIdList.length - 1) {
      //   await this.$router.push({
      //     name: 'check',
      //     params: { jobId: this.$route.params.jobId }
      //   })
      //   return
      // }

      this.ruleIndex++
      await this.getCurrentRule()
      this.resetAll()
      this.isGrayActive = !this.isGrayActive
      this.nextBusy = false

      const app = document.getElementById('app')
      const delta = app.scrollTop / 10
      const f = () => {
        if (app.scrollTop < delta) app.scrollTop = 0
        else {
          app.scrollTop -= delta
          requestAnimationFrame(f)
        }
      }
      requestAnimationFrame(f)
    },
    async sendLog(s) {
      console.log(`Send log ${s}`)
      const res = await userAct(
        this.$route.params.jobId,
        this.ruleIdList[this.ruleIndex],
        s
      )
      if (res.data.msg) console.error(res.data.msg)
    },
    handlePageNext() {
      if (this.activePageIndex === 2) return
      ElMessageBox.confirm(
        '请问您确定要切换界面吗？我们鼓励您在没有把握理解题意的情况下切换界面，虽然切换界面需要扣除一个金币，但答对一题会增加三个金币，答错无金币。',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.activePageIndex++
          this.coins--
          this.$refs.car.setActiveItem(this.pageOrder[this.activePageIndex])
          const types = ['INS', 'NL', 'KG']
          coinInfoPageSwitch(this.activePageIndex)
          this.sendLog(
            `carousel-switch-${types[this.pageOrder[this.activePageIndex]]}`
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消切换'
          })
        })
    },
    async onSubmit() {
      if (process.env.NODE_ENV === 'dev') {
        this.overallScores.q1 = 3
        this.overallScores.q2 = 3
        this.overallScores.whyChange = '123'
      }
      if (
        [this.overallScores.q1, this.overallScores.q2].some(e => !e) ||
        (this.overallScores.q1 !== 'NO' && this.overallScores.whyChange === '')
      ) {
        await ElMessageBox({
          type: 'warning',
          message: '请完成调查内容'
        })
        return
      }
      await addGroupComment(
        this.$route.params.jobId,
        this.ruleIdList[this.ruleIndex],
        this.overallScores.q1,
        this.overallScores.q2,
        this.overallScores.whyChange
      )
      if (this.ruleIndex === this.ruleIdList.length - 1) {
        await this.sendLog(`coins-${this.coins}`)
        await this.$router.push({
          name: 'questionOverall',
          params: { jobId: this.$route.params.jobId }
        })
        return
      }
      this.ruleIndex++
      await this.getCurrentRule()
      this.nextBusy = false
      this.resetAll()
      this.isScoreShow = true

      this.overallScores.q1 = 0
      this.overallScores.q2 = 0
      this.overallScores.whyChange = ''
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
.title {
  padding-top: 30px;
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

.carousel ::v-deep(.is-animating) {
  transition: 0s;
}

.action {
  margin-top: 60px;
  text-align: center;
  font-size: 15px;
  padding-bottom: 60px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
}
.carousel {
  border: 1px solid #bbb;
  border-radius: 10px;
  margin-top: 20px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}
.progress {
  width: 80%;
  margin: 0 auto;
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
.demonstration {
  padding-left: 80px;
}

.explain {
  padding: 20px 80px;
}
.answer {
  text-align: center;
}
.btn {
  display: inline-block;
  width: 84px;
  margin-left: 10px;
}
.overallform {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 30px 20px;
}
.grayActive {
  background-color: rgba(235, 237, 240, 1);
}

.next-page {
  position: absolute;
  font-size: 24px;
  right: 1em;
  z-index: 10;
  top: 50%;
  background-color: #ffffff;
  width: 2em;
  height: 2em;
  text-align: center;
  line-height: 2em;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: -1px 1px 4px 1px #bfbfbf;
  transition: 500ms;
}

.next-page:hover {
  background-color: #cfcfcf;
}

.next-page:active {
  background-color: #5f5f5f;
}

.switch-question ::v-deep(.el-form-item__label) {
  line-height: 20px;
  width: 160px !important;
}
</style>
