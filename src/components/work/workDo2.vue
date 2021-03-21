<template>
  <div class="workpanel">
    <div class="content">
      <i-time-indicator ref="indicator"></i-time-indicator>
      <!--      <div class="infos">-->
      <!--        <p class="rule">规则：国籍(A,v0) & 简称(v0,v1) & 出生地(B,v0) =>配偶(A,B)</p>-->
      <!--        <div class="ruleExp">-->
      <!--          <div class="left" @click="left"><img src="../../assets/img/left.png" alt=""></div>-->
      <!--          <div class="right" @click="right"><img src="../../assets/img/right.png" alt=""></div>-->
      <!--          <div class="ruleExpContent">-->
      <!--            <span>请您对这种谓词逻辑形式呈现下规则的理解程度打1~5颗星。1星代表不能理解，5星代表完全理解。完成后请右翻查看规则3种解释：</span>-->
      <!--            <el-rate v-model="value1"></el-rate>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="infos">
        <div class="block">
          <span>第{{ ruleIndex + 1 }}/{{ ruleIdList.length }}题</span>
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
          >
            <el-carousel-item>
              <div class="explain">
                <p>
                  请您对这种谓词逻辑形式呈现下规则的理解程度打1~5颗星。1星代表不能理解，5星代表完全理解。完成后请右翻查看规则3种解释：
                </p>
                <el-rate v-model="scores.noexp"></el-rate>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="explain">
                <h2>引用实例：</h2>
                <p style="text-align: center">
                  {{ rules.instance }}
                </p>
                <br /><br />
                <p>
                  请对实例解释方式对您理解规则的帮助程度打分，分数越高表示这种方式越能辅助理解：
                </p>
                <el-rate v-model="scores.ins"></el-rate>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="explain">
                <h2>引用自然语言：</h2>
                <p style="text-align: center">{{ rules.nl }}</p>
                <br /><br />
                <p>
                  请对实例解释方式对您理解规则的帮助程度打分，分数越高表示这种方式越能辅助理解：
                </p>
                <el-rate v-model="scores.nl"></el-rate>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="explain">
                <h2>引用知识图谱：</h2>
                <div style="margin: 0 auto; width: 300px">
                  <img src="../../assets/img/kgdemo.png" alt="" />
                </div>
                <p>
                  请对实例解释方式对您理解规则的帮助程度打分，分数越高表示这种方式越能辅助理解：
                </p>
                <el-rate v-model="scores.kg"></el-rate>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="answer">
        <p>通过对规则的理解后，请判断规则是否正确。</p>
        <el-radio v-model="answer" label="TRUE" @click="changeButton">
          正确
        </el-radio>
        <el-radio v-model="answer" label="FALSE" @click="changeButton">
          错误
        </el-radio>
      </div>
      <div class="action">
        <div class="btn">
          <el-button type="primary" @click="prevRule">上一题</el-button>
        </div>
        <el-tooltip
          class="item"
          :disabled="!disabled"
          effect="dark"
          content="请在完成所有评分及题目回答后再点击下一题"
          placement="top-start"
        >
          <div class="btn">
            <el-button type="primary" @click="nextRule" :disabled="disabled">
              下一题
            </el-button>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import TimeIndicator from '@/components/TimeIndicator'
import { getRules, qRule, answer } from '@/service'
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
    await this.getCurrentRule()
  },
  data() {
    return {
      ruleIndex: 0,
      ruleIdList: [],
      rules: {},
      answer: '',
      disabled: true,
      scores: {
        noexp: 0,
        ins: 0,
        nl: 0,
        kg: 0
      }
    }
  },
  methods: {
    reset() {
      this.answer = ''
      this.$refs['car'].setActiveItem(0)
    },
    async getCurrentRule() {
      const ruleData = await qRule(this.ruleIdList[this.ruleIndex])
      this.rules = ruleData.data.data
    },
    changeButton() {
      this.disabled = false
    },
    prevRule() {
      if (this.ruleIndex === 0) return
      this.ruleIndex--
      this.getCurrentRule()
    },
    async nextRule() {
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
      const res = await answer(
        this.$route.params.jobId,
        this.ruleIdList[this.ruleIndex],
        this.answer,
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
        return
      }
      if (this.ruleIndex === this.ruleIdList.length-1) {
        await this.$router.push({
          name: 'check',
          params: { jobId: this.$route.params.jobId }
        })
        return
      }
      this.ruleIndex++
      await this.getCurrentRule()
      this.reset()
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

.ruleExp {
  position: relative;
  height: 240px;
}
.left {
  position: absolute;
  top: 50%;
}
.right {
  position: absolute;
  top: 50%;
  right: 0;
}
.ruleExpContent {
  padding: 20px 120px;
}
.el-rate {
  margin-top: 30px;
  font-size: large;
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
  border: 1px solid #eee;
  border-radius: 10px;
  margin-top: 20px;
}

.carousel /deep/.el-carousel__button {
  background-color: #9f9f9f;
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
</style>
