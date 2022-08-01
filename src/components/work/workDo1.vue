<template>
  <div class="workpanel">
    <div class="content">
      <i-time-indicator ref="indicator"></i-time-indicator>
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
            <p class="rule">规则：{{ rules.content }}</p>
            <span class="demonstration">规则解释 {{}}</span>
            <el-carousel
              trigger="click"
              :initial-index="0"
              height="350px"
              :autoplay="false"
              arrow="always"
              class="carousel"
              ref="car"
              @change="handleSwitch"
              v-model="carouselValue"
              indicator-position="none"
            >
              <el-carousel-item v-bind:class="{ grayActive: isGrayActive }">
                <div class="explain">
                  <p>
                    请您对这种<span style="color:red;">谓词逻辑</span>
                    形式呈现下规则的理解程度打1~5颗星。1星代表不能理解，5星代表完全理解。完成后请右翻查看规则3种解释：
                  </p>
                  <el-rate
                    @change="handleNoExpChange"
                    v-model="scores.noexp"
                  ></el-rate>
                </div>
              </el-carousel-item>
              <el-carousel-item v-bind:class="{ grayActive: isGrayActive }">
                <div class="explain">
                  <h2><span style="color:red;">实例</span>解释方式：</h2>
                  <p style="text-align: center">
                    {{ rules.instance }}
                  </p>
                  <br /><br />
                  <p>
                    请对<span style="color:red;">实例</span>
                    解释方式对您理解规则的帮助程度打分，分数越高表示这种方式越能辅助理解：
                  </p>
                  <el-rate
                    @change="handleInsChange"
                    v-model="scores.ins"
                  ></el-rate>
                </div>
              </el-carousel-item>
              <el-carousel-item v-bind:class="{ grayActive: isGrayActive }">
                <div class="explain">
                  <h2><span style="color:red;">自然语言</span>解释方式：</h2>
                  <p style="text-align: center">{{ rules.nl }}</p>
                  <br /><br />
                  <p>
                    请对<span style="color: red">自然语言</span>
                    解释方式对您理解规则的帮助程度打分，分数越高表示这种方式越能辅助理解：
                  </p>
                  <el-rate
                    @change="handleNlChange"
                    v-model="scores.nl"
                  ></el-rate>
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
                  <p>
                    请对<span style="color: red">知识图谱</span>
                    解释方式对您理解规则的帮助程度打分，分数越高表示这种方式越能辅助理解：
                  </p>
                  <el-rate
                    @change="handleKgChange"
                    v-model="scores.kg"
                  ></el-rate>
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
            content="请在完成所有评分及题目回答后再点击下一题"
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
                label-width="250px"
              >
                <el-form-item label="您最喜欢的解释方式是">
                  <el-radio-group v-model="overallScores.like">
                    <el-radio label="INS" @click="likeReasonShow">
                      实例
                    </el-radio>
                    <el-radio label="NL" @click="likeReasonShow">
                      自然语言
                    </el-radio>
                    <el-radio label="KG" @click="likeReasonShow">
                      知识图谱
                    </el-radio>
                    <el-radio label="NO" @click="likeReasonClose">
                      无偏好
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="喜欢的原因是" v-show="!isLikeReasonShow">
                  <el-input
                    type="textarea"
                    v-model="overallScores.likeReason"
                  ></el-input>
                </el-form-item>
                <el-form-item label="您最不喜欢的解释方式是">
                  <el-radio-group v-model="overallScores.dislike">
                    <el-radio label="INS" @click="notLikeReasonShow">
                      实例
                    </el-radio>
                    <el-radio label="NL" @click="notLikeReasonShow">
                      自然语言
                    </el-radio>
                    <el-radio label="KG" @click="notLikeReasonShow">
                      知识图谱
                    </el-radio>
                    <el-radio label="NO" @click="notLikeReasonClose">
                      无偏好
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="不喜欢的原因是"
                  v-show="!isNotLikeReasonShow"
                >
                  <el-input
                    type="textarea"
                    v-model="overallScores.dislikeReason"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">
                    进入下一组题目
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
  getJobStatus,
  ratingSheet,
  ratingSheetComplete,
  jobComplete
} from '@/service'
import { ElMessageBox } from 'element-plus'

export default {
  name: 'workDo',
  components: {
    'i-time-indicator': TimeIndicator
  },
  beforeMount() {
    this.shuffle()
  },
  async mounted() {
    this.$refs['indicator'].initiate()
    console.log(this.numList)
    const jobId = this.$route.params.jobId
    const ruleIdList = await getRules(jobId)
    this.ruleIdList = ruleIdList.data.data
    await this.getCurrentRule()
    const jobStatus = await getJobStatus(jobId)
    if (jobStatus.data.data !== -1) {
      this.ruleIndex = jobStatus.data.data
    }
    if (this.ruleIndex > 0 && this.ruleIndex % 5 === 0) {
      const isCompleteRatingSheet = await ratingSheetComplete(
        jobId,
        this.ruleIndex
      )
      if (!isCompleteRatingSheet.data.data) {
        this.ruleIndex--
        this.isScoreShow = false
      }
    }
    await this.sendLog('start')
  },
  computed: {
    canNext() {
      return (
        this.answer !== '' &&
        this.scores.noexp !== 0 &&
        this.scores.ins !== 0 &&
        this.scores.nl !== 0 &&
        this.scores.kg !== 0
      )
    }
  },
  data() {
    return {
      isScoreShow: true,
      isLikeReasonShow: true,
      isNotLikeReasonShow: true,
      ruleIndex: 0,
      ruleIdList: [],
      rules: {},
      answer: '',
      disabled: true,
      isGrayActive: true,
      overallScores: {
        like: '',
        dislike: '',
        likeReason: '',
        dislikeReason: ''
      },
      scores: {
        noexp: 0,
        ins: 0,
        nl: 0,
        kg: 0
      },
      nextBusy: false,
      numList: [0, 1, 2, 3],
      carouselValue: 0,
      virtualIndex: 0,
      cancelNext: false
    }
  },
  methods: {
    shuffle() {
      let arr = [1, 2, 3]
      arr = arr.sort(function() {
        return 0.5 - Math.random()
      })
      this.numList = [0, ...arr]
      console.log(this.numList)
    },
    // reset() {
    //   this.answer = ''
    //   this.$refs['car'].setActiveItem(0)
    //   if (process.env.NODE_ENV === 'dev') {
    //     this.scores.noexp = 4
    //     this.scores.ins = 4
    //     this.scores.nl = 4
    //     this.scores.kg = 5
    //   }
    // },
    resetAll() {
      this.shuffle()
      if (this.carouselValue !== 0) this.cancelNext = true
      this.carouselValue = 0
      this.virtualIndex = 0
      this.answer = ''
      this.scores.noexp = 0
      this.scores.ins = 0
      this.scores.nl = 0
      this.scores.kg = 0
      this.$refs['car'].setActiveItem(0)
      if (process.env.NODE_ENV === 'dev') {
        this.scores.noexp = 4
        this.scores.ins = 4
        this.scores.nl = 4
        this.scores.kg = 5
      }
    },
    async getCurrentRule() {
      const ruleData = await qRule(this.ruleIdList[this.ruleIndex])
      this.rules = ruleData.data.data
    },
    async changeButton(e, s) {
      if (e.target.tagName === 'INPUT') return
      this.disabled = false
      await this.sendLog(`answer-${s}`)
    },
    likeReasonShow() {
      this.isLikeReasonShow = false
    },
    likeReasonClose() {
      this.isLikeReasonShow = true
    },
    notLikeReasonShow() {
      this.isNotLikeReasonShow = false
    },
    notLikeReasonClose() {
      this.isNotLikeReasonShow = true
    },
    async nextRule() {
      this.nextBusy = true
      for (const k in this.scores)
        if (Object.prototype.hasOwnProperty.call(this.scores, k)) {
          if (this.scores[k] === 0) {
            await ElMessageBox({
              type: 'warning',
              message: '请完成评分'
            })
            return
          }
        }
      await this.sendLog(`next-rule`)
      const res = await answer(
        this.$route.params.jobId,
        this.ruleIdList[this.ruleIndex],
        this.answer,
        this.scores.noexp,
        this.scores.kg,
        this.scores.nl,
        this.scores.ins
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

      if ((this.ruleIndex + 1) % 5 === 0) {
        this.isScoreShow = false
        return
      }

      if (this.ruleIndex === this.ruleIdList.length - 1) {
        await jobComplete(this.$route.params.jobId)
        await this.$router.push({
          name: 'check',
          params: { jobId: this.$route.params.jobId }
        })
        return
      }

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
    async handleSwitch(e) {
      // if (e === this.carouselValue) return
      console.log(`e is ${e} and cancel is ${this.cancelNext}`)
      if (this.cancelNext) {
        this.cancelNext = false
        return
      }
      console.log(
        `values: {cv: ${this.carouselValue}, vi: ${this.virtualIndex}}`
      )
      if ((this.carouselValue + 1) % 4 === e) {
        this.virtualIndex = this.virtualIndex === 3 ? 0 : this.virtualIndex + 1
      } else {
        this.virtualIndex = this.virtualIndex === 0 ? 3 : this.virtualIndex - 1
      }
      const types = ['noexp', 'ins', 'nl', 'kg']
      this.$refs.car.setActiveItem(this.numList[this.virtualIndex])
      this.carouselValue = this.numList[this.virtualIndex]
      console.log(
        `values: {cv: ${this.carouselValue}, vi: ${this.virtualIndex}}`
      )
      if (this.numList[this.virtualIndex] !== e) this.cancelNext = true
      await this.sendLog(`carousel-switch-${types[this.carouselValue]}`)
    },
    async handleNoExpChange(e) {
      await this.sendLog(`rating-noexp-${e}`)
    },
    async handleInsChange(e) {
      await this.sendLog(`rating-ins-${e}`)
    },
    async handleNlChange(e) {
      await this.sendLog(`rating-nl-${e}`)
    },
    async handleKgChange(e) {
      await this.sendLog(`rating-kg-${e}`)
    },
    async onSubmit() {
      if (
        [this.overallScores.like, this.overallScores.dislike].some(
          e => e === ''
        ) ||
        (this.overallScores.like !== 'NO' &&
          this.overallScores.likeReason === '') ||
        (this.overallScores.dislike !== 'NO' &&
          this.overallScores.dislikeReason === '')
      ) {
        await ElMessageBox({
          type: 'warning',
          message: '请完成调查内容'
        })
        return
      }
      await ratingSheet(
        this.$route.params.jobId,
        this.ruleIdList[this.ruleIndex],
        this.overallScores.like,
        this.overallScores.dislike,
        this.overallScores.likeReason,
        this.overallScores.dislikeReason
      )
      this.isScoreShow = true
      this.overallScores.like = ''
      this.overallScores.dislike = ''
      this.overallScores.likeReason = ''
      this.overallScores.dislikeReason = ''
      this.isLikeReasonShow = true
      this.isNotLikeReasonShow = true
      this.ruleIndex++
      if (this.ruleIndex === this.ruleIdList.length) {
        await jobComplete(this.$route.params.jobId)
        await this.$router.push({
          name: 'check',
          params: { jobId: this.$route.params.jobId }
        })
        return
      }
      await this.getCurrentRule()
      this.nextBusy = false
      this.resetAll()
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
</style>
