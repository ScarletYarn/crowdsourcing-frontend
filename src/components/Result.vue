<template>
  <div :class="{ ['page-body']: true, ['page-body-loading']: loading }">
    <div class="lds-facebook" v-if="loading">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-else>
      <div class="home-link">
        <i
          title="回到首页"
          class="el-icon-s-home"
          @click="$router.replace('/')"
        ></i>
      </div>
      <div class="user-name-section">
        您好，<span class="user-name">{{ username }}</span> 同学
      </div>
      <div class="section-body section-position-right">
        <div class="section-title">
          <div class="section-title-number light-shadow">
            <img src="@/assets/result-page-v2/accuracy.svg" alt="accuracy" />
          </div>
          <div class="section-title-text">准确率</div>
        </div>
        <div class="section-content">
          您于{{
            formatTime(completeTime)
          }}完成了我们的测试。在本次测试中，您评分最高的界面是{{
            formatExp(favoriteExp)
          }}。您本次答对{{ correctAmount }}题，您的准确率是{{ correctRate }}%
        </div>
      </div>
      <div class="section-body section-position-left">
        <div class="section-title">
          <div class="section-title-number light-shadow">
            <img src="@/assets/result-page-v2/rank.svg" alt="rank" />
          </div>
          <div class="section-title-text">排名</div>
        </div>
        <div class="section-content">
          本次任务，平均准确率{{ avgCorrect.toFixed(2) }}%，您超过了{{
            surpassed.toFixed(2)
          }}%的参与者
        </div>
      </div>
      <div class="section-body section-position-right">
        <div class="section-title">
          <div class="section-title-number light-shadow">
            <img src="@/assets/result-page-v2/reward.svg" alt="accuracy" />
          </div>
          <div class="section-title-text">您的酬劳</div>
        </div>
        <div class="section-content">
          <div class="reward">
            感谢您的参与，您已获得基础酬劳{{ formatMoney(basic) }}元，奖励{{
              formatMoney(bonus)
            }}元，共计{{ formatMoney(reward) }}元的酬劳
          </div>
          <div class="reward-rule">
            <div class="rule-title">酬劳的计算规则：</div>
            <div class="rule-body">
              薪酬由基础工资和奖励两部分组成，一部分是您的任务正确率乘以金额总数。另一部分，如果您的准确率
              <img
                src="../assets/formula/1.svg"
                alt="formula-1"
              />高于其他所有用户的平均准确率<img
                src="../assets/formula/2.svg"
                alt="formula-2"
              />，您将会得到最大奖励金额乘以<img
                src="../assets/formula/3.svg"
                alt="formula-3"
                style="height: 2.5em"
              />，否则奖励0元。
            </div>
          </div>
        </div>
      </div>
      <div class="section-body section-position-left">
        <div class="section-title">
          <div class="section-title-number light-shadow">
            <img src="@/assets/result-page-v2/personality.svg" alt="accuracy" />
          </div>
          <div class="section-title-text">性格与认知</div>
        </div>
        <div class="section-content">
          <div class="chart-body">
            <canvas id="canvas" width="100" height="100"></canvas>
          </div>
          <div class="chart-description">
            <div class="description-title">大五人格测试</div>
            <div class="description-body">
              <p>
                开放性（Openness）：具有想象、审美、情感丰富、求异、创造、智能等特质。
              </p>
              <p>
                责任心（Conscientiousness）：显示胜任、公正、条理、尽职、成就、自律、谨慎、克制等特点。
              </p>
              <p>
                外倾性（Extraversion）：表现出热情、社交、果断、活跃、冒险、乐观等特质。
              </p>
              <p>
                宜人性（Agreeableness）：具有信任、利他、直率、依从、谦虚、移情等特质。
              </p>
              <p>
                情绪稳定（Emotional
                Stability）：擅长平衡焦虑、敌对、压抑、自我意识、冲动、脆弱等情绪，具有保持情绪稳定的能力。
              </p>
            </div>
          </div>
          <div class="cognition-style">
            <div class="cognition-style-title">您的认知风格是：</div>
            <div class="cognition-style-content">
              <div v-for="(_, index) in 41" :key="index" class="line"></div>
              <div class="sign">
                <div>0</div>
                <div>15</div>
              </div>
              <div class="identifier">语言型</div>
              <div class="identifier">表象型</div>
              <div class="gauge" :style="{ left: `${cognitionStyle}em` }">
                <div class="gauge-sign">{{ cognitionStyleNumber }}</div>
              </div>
            </div>
          </div>
          <div class="chart-description">
            <div class="description-title">认知风格测试</div>
            <div class="description-body">
              表象型的人是指试图执行认知任务时更喜欢想象过程并依赖图表、图解或图形信息的人；语言型的人在认知信息处理中主要依赖于动词逻辑手段，并依赖于文本信息。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { getResultInfo } from '@/service'

Chart.register(...registerables)

export default {
  name: 'Result',
  data() {
    return {
      username: '',
      loading: true,
      completeTime: '',
      favoriteExp: [],
      correctAmount: 0,
      correctRate: 0,
      avgCorrect: 0,
      surpassed: 0,
      characterDimension: [],
      cognitionStyle: 0,
      cognitionStyleNumber: 0,
      basic: 0,
      bonus: 0,
      reward: 0
    }
  },
  async mounted() {
    const resultInfo = (await getResultInfo(this.$route.params.id)).data.data
    this.username = resultInfo.name
    this.completeTime = resultInfo.completionTime
    this.favoriteExp = resultInfo.favoriteExp
    this.correctAmount = resultInfo.correctAmount
    this.correctRate = (this.correctAmount * 100) / resultInfo.questionAmount
    this.basic = resultInfo.basic
    this.bonus = resultInfo.bonus
    this.reward = resultInfo.reward

    const totalPeople = resultInfo.correctList.length
    let surpassed = 0,
      totalCorrect = 0
    for (const i of resultInfo.correctList) {
      if (this.correctAmount > i) surpassed++
      totalCorrect += i
    }
    this.surpassed = (100 * surpassed) / resultInfo.correctList.length
    this.avgCorrect =
      (100 * totalCorrect) / (totalPeople * resultInfo.questionAmount)

    this.characterDimension = resultInfo.characterRating.map(e => e / 2)
    const leftBound = window.innerWidth < 1024 ? 0.9 : 5.7
    this.cognitionStyle = leftBound + (11 * resultInfo.cognitionStyle) / 15
    this.cognitionStyleNumber = resultInfo.cognitionStyle

    this.loading = false
    await this.$nextTick(() => this.load())
  },
  methods: {
    load() {
      const labels = ['外倾性', '宜人性', '责任感', '情绪稳定', '开放性']
      const data = {
        labels: labels,
        datasets: [
          {
            label: '得分',
            data: this.characterDimension,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.6)'
          }
        ]
      }
      const config = {
        type: 'radar',
        data: data,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: '您的性格指数'
            },
            legend: {
              display: false
            }
          },
          scales: {
            r: {
              min: 0,
              max: 7,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      }
      const ctx = document.getElementById('canvas').getContext('2d')
      new Chart(ctx, config)
    },
    formatTime(date) {
      date = new Date(date)
      return `${date.getFullYear()}年${date.getMonth()}月${date.getDay()}日`
    },
    formatExp(list) {
      const map = {
        INS: '实例',
        NL: '自然语言',
        KG: '知识图谱',
        NO: '谓词逻辑'
      }
      list = list.map(e => map[e])
      return list.join('、')
    },
    formatMoney(money) {
      return (money / 100).toFixed(2)
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/app.sass"

.page-body
  background-image: url("../assets/result-page-v2/background.png")
  background-size: 100%
  width: 100%
  user-select: none
  box-sizing: border-box
  font-family: "Microsoft YaHei", 微软雅黑, "Microsoft JhengHei", 华文细黑, STHeiti, MingLiu, serif

.page-body-loading
  height: 100%

@media screen and (min-width: 1024px)
  .page-body
    padding: 3em 25%

@media screen and (max-width: 1024px)
  .page-body
    padding: 3em 1em

.home-link
  position: absolute
  left: 1em
  top: 1em

  i
    cursor: pointer

.section-body
  margin: 5em auto

  .section-title
    display: flex
    flex-direction: row
    align-items: flex-end
    margin-bottom: .5em

    .section-title-number
      background-color: rgb(240,157,177)
      color: #ffffff
      font-size: 2em
      width: 2.5em
      height: 2.5em
      line-height: 2.5em
      font-weight: 700
      border-radius: 50%

      img
        width: 1em
        height: 1em
        display: block
        margin-left: calc(50% - .5em)
        margin-top: calc(50% - .5em)

    .section-title-text
      color: rgb(68,84,105)
      margin: 0 1.2em .6em 1.2em
      font-weight: 700
      font-size: 1.1em

.chart-body
  width: 20em
  height: 20em
  position: relative
  margin: 0 auto

.section-position-right
  width: 70%
  margin-right: 0

  .section-title
    flex-direction: row-reverse

.user-name-section
  text-align: start
  margin-top: 3em

  .user-name
    font-size: 24px
    font-weight: 600
    color: rgba(68,84,105, 0.95)

@media screen and (min-width: 1024px)
  .reward-rule
    margin-left: 3em

@media screen and (max-width: 1024px)
  .reward-rule
    margin-left: 1em

.reward-rule
  text-align: start

  .rule-title
    font-size: 14px
    font-weight: 600
    margin-top: 2em
    margin-bottom: 2em
    text-indent: 1em

  .rule-body
    img
      height: 16px
      vertical-align: text-bottom

.chart-description
  text-align: left

  .description-title
    font-size: 14px
    font-weight: 600
    margin-top: 2em
    margin-bottom: 2em
    text-indent: 1em

.cognition-style
  text-align: start
  padding: 1em
  margin-top: 2em

  .cognition-style-title
    font-weight: 600
    font-size: .9em

  .cognition-style-content
    position: relative
    text-align: center
    padding: 3em 0 2em 0

    .identifier
      position: absolute

    .gauge
      width: 2px
      height: 2.5em
      background-color: rgb(240,157,177)
      position: absolute
      top: 2.5em
      left: 8em

      .gauge-sign
        position: absolute
        top: 100%
        font-size: 12px
        font-weight: 300
        left: -2px

    @media screen and (min-width: 1024px)
      .sign
        width: 52%

    @media screen and (max-width: 1024px)
      .sign
        width: 90%

    .sign
      display: flex
      justify-content: space-between
      margin: 0 auto
      font-size: 12px
      font-weight: 300

    .line
      display: inline-block
      border-left: solid 1px
      height: 1.2em
      margin-right: .2em

      &:nth-child(5n + 1)
        border-left: solid 2px
        height: 1.5em

      &:nth-child(20n + 1)
        border-left: solid 2px
        height: 2em

@media screen and (min-width: 1024px)
  .cognition-style
    margin-left: 3em

    .identifier:nth-last-child(3)
      left: 4em

    .identifier:nth-last-child(2)
      left: 15.3em

@media screen and (max-width: 1024px)
  .cognition-style
    margin-left: 0

    .identifier:nth-last-child(3)
      left: 0

    .identifier:nth-last-child(2)
      left: 9.5em

.section-position-left
  width: 70%
  margin-left: 0

.light-shadow
  box-shadow: 3px 3px 0 0 rgba(240,157,177,0.5), -1px -1px 0 0 rgba(240,157,177,0.5), 2px 3px 0 0 rgba(240,157,177,0.3)
</style>
