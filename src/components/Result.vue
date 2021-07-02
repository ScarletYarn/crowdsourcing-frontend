<template>
  <div class="page-body">
    <div class="home-link">
      <i title="回到首页" class="el-icon-s-home" @click="$router.replace('/')"></i>
    </div>
    <div class="bottom-cloud"><img src="@/assets/result-page/bottom.png"></div>
    <div class="center-bubble"><img src="@/assets/result-page/center.png"></div>
    <div class="tree"><img src="@/assets/result-page/tree.png"></div>
    <div class="note pink">
      <div class="pin"><img src="@/assets/result-page/pink.png"></div>
      <div class="title">性格指数</div>
      <div class="content">点击<span class="link" @click="showDialog">这里</span>查看您的性格指数</div>
    </div>
    <div class="note green">
      <div class="pin"><img src="@/assets/result-page/green.png"></div>
      <div class="title">准确率</div>
      <div class="content">本次正确X题，您的准确率是X</div>
    </div>
    <div class="note blue">
      <div class="pin"><img src="@/assets/result-page/blue.png"></div>
      <div class="title">排名</div>
      <div class="content">本次任务，平均准确率X，您超过了X人</div>
    </div>
    <div class="note yellow">
      <div class="pin"><img src="@/assets/result-page/yellow.png"></div>
      <div class="title">您的酬劳</div>
      <div class="content">感谢您的参与，您已获取了X金额的酬劳</div>
    </div>
    <el-dialog v-model="showChart">
      <div class="chart-body">
        <canvas id="canvas" width="100" height="100"></canvas>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  Chart,
  registerables
} from 'chart.js'

Chart.register(
  ...registerables
)

export default {
  name: 'Result',
  data() {
    return {
      showChart: false,
      loaded: false
    }
  },
  mounted() {
    console.log(this.$route.params.id)
  },
  methods: {
    showDialog() {
      this.showChart = true
      if (!this.loaded) {
        this.$nextTick(() => this.load())
        this.loaded = true
      }
    },
    load() {
      const labels = ['A', 'B', 'C', 'D', 'E']
      const data = {
        labels: labels,
        datasets: [
          {
            label: '得分',
            data: [70, 45, 100, 44, 65],
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
            }
          }
        }
      }
      const ctx = document.getElementById('canvas').getContext('2d')
      new Chart(ctx, config)
    }
  }
}
</script>

<style scoped lang="sass">
.page-body
  background-color: rgb(180,199,231)
  width: 100%
  height: 100%
  position: relative
  user-select: none

.bottom-cloud
  position: absolute
  bottom: 0
  left: 0
  z-index: 10

.center-bubble
  position: absolute
  left: 10%
  top: 10%
  width: 80%
  height: 80%

.tree
  position: absolute
  width: 20%
  left: 40%
  bottom: 26%

.note
  width: 20%
  position: absolute

  .title
    font-size: 24px
    margin-bottom: 12px

  .pin
    font-size: 32px
    width: 1em
    height: 1em
    position: relative
    margin: 0 auto

  .content
    font-size: 14px

.link
  cursor: pointer
  text-decoration: underline

.pink
  left: 15%
  top: 21%

  .title
    color: rgb(255,163,163)

.green
  left: 65%
  top: 21%

  .title
    color: rgb(0,176,80)

.blue
  left: 15%
  top: 48%

  .title
    color: rgb(68,125,196)

.yellow
  left: 65%
  top: 48%

  .title
    color: rgb(255,192,0)

img
  width: 100%
  height: 100%

.chart-body
  width: 25em
  height: 25em
  position: relative
  margin: 0 auto

.home-link
  position: absolute
  left: 1em
  top: 1em

  i
    cursor: pointer
</style>
