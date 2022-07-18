<template>
  <div class="page-body">
    <div class="logo-section">
      <el-image class="logo" :src="require('@/assets/logo.png')"></el-image>
    </div>
    <div class="main-section">
      <el-input
        ref="search"
        placeholder="输入词条搜索"
        suffix-icon="el-icon-search"
        v-model="search"
        @keyup.enter="q()"
      >
      </el-input>
      <div class="hint">例：狮子、电脑、苹果</div>
    </div>
    <div class="desc-section">
      <div class="title">
        什么是CyBeeKB
      </div>
      <div class="content">
        CyBeeKB是一个通过开放信息抽取的方法基于网络语料自动化构建的常识知识库，CyBeeKB使用了基于提示学习的迭代开放信息抽取方法，从Google搜索引擎的结果上抽取了大量三元组形式的常识知识。
      </div>
    </div>
    <div class="desc-section">
      <div class="title">
        <span>CyBeeKB的规模</span>
        <i
          :class="
            `text-clickable el-icon-refresh ${isRefreshing ? 'spinning' : ''}`
          "
          @click="doRefresh"
        />
        <span class="last-refresh-date"> 上次更新于{{ lastRefreshDate }} </span>
      </div>
      <div class="table-wrapper">
        <div class="data-row title-row">
          <div class="data-cell">
            <el-tooltip placement="top" content="时刻保持最新">
              <span>常识数量⚡</span>️
            </el-tooltip>
          </div>
          <div class="data-cell">
            <el-tooltip placement="top" content="时刻保持最新">
              <span>中文常识数量⚡️</span>
            </el-tooltip>
          </div>
          <div class="data-cell">
            概念数量
          </div>
          <div class="data-cell">
            中文概念数量
          </div>
          <div class="data-cell">
            平均度
          </div>
          <div class="data-cell">
            中文平均度
          </div>
        </div>
        <div class="data-row">
          <div class="data-cell">{{ tripleCount }}</div>
          <div class="data-cell">{{ tripleCountZh }}</div>
          <div class="data-cell">{{ entityCount }}</div>
          <div class="data-cell">{{ entityCountZh }}</div>
          <div class="data-cell">{{ degree }}</div>
          <div class="data-cell">{{ degreeZh }}</div>
        </div>
      </div>
    </div>
    <div class="desc-section">
      <div class="title">
        CyBeeKB可以做什么
      </div>
      <div class="content text-underline">
        <div>
          <span @click="$router.push({ name: 'nqa' })" class="text-clickable">
            常识知识问答
          </span>
        </div>
        <div>
          <span @click="guide" class="text-clickable">常识知识检索</span>
        </div>
        <div>
          <span @click="$router.push({ name: 'oie' })" class="text-clickable">
            开放信息抽取
          </span>
        </div>
        <div>
          <span @click="$router.push({ name: 'v2c' })" class="text-clickable">
            视频常识抽取
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { getScaleP1, getScaleP2, postRefreshFast } from '@/service'

export default {
  name: 'Home',
  data() {
    return {
      search: '',
      tripleCount: 0,
      tripleCountZh: 0,
      entityCount: 0,
      entityCountZh: 0,
      degree: 0,
      degreeZh: 0,
      isRefreshing: false,
      lastRefreshDate: null
    }
  },
  async mounted() {
    const { tripleCount, tripleCountZh } = (await getScaleP1()).data.data
    const { entityCount, entityCountZh, isRefreshing, lastRefreshDate } = (
      await getScaleP2()
    ).data.data
    this.tripleCount = tripleCount
    this.tripleCountZh = tripleCountZh
    this.entityCount = entityCount
    this.entityCountZh = entityCountZh
    this.degree = (this.tripleCount / entityCount).toFixed(4)
    this.degreeZh = (this.tripleCountZh / entityCountZh).toFixed(4)
    this.isRefreshing = isRefreshing
    this.lastRefreshDate = new Date(lastRefreshDate).toLocaleString()
  },
  methods: {
    async q() {
      if (!this.search.trim()) {
        await ElMessage({
          type: 'warning',
          message: '请输入查询内容',
          duration: 1000
        })
        return
      }
      await this.$router.push({
        name: 'entity',
        params: {
          entity: this.search
        }
      })
    },
    async doRefresh() {
      if (this.isRefreshing) return
      await postRefreshFast()
      this.isRefreshing = true
      const handle = setInterval(async () => {
        const { entityCount, entityCountZh, isRefreshing, lastRefreshDate } = (
          await getScaleP2()
        ).data.data
        if (!isRefreshing) {
          clearInterval(handle)
          this.entityCount = entityCount
          this.entityCountZh = entityCountZh
          this.degree = (this.tripleCount / entityCount).toFixed(4)
          this.degreeZh = (this.tripleCountZh / entityCountZh).toFixed(4)
          this.isRefreshing = isRefreshing
          this.lastRefreshDate = new Date(lastRefreshDate).toLocaleString()
        }
      }, 3000)
    },
    guide() {
      this.$refs['search'].focus()
      document.body.scrollTop = 0 // For Safari
      document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
    }
  }
}
</script>

<style scoped lang="sass">
@import "src/app"

.page-body
  background-color: rgba(177, 147, 147, .17)
  width: 100%
  min-height: 100%
  padding-top: 6%
  box-sizing: border-box
  padding-bottom: 3em

.main-section
  width: 65%
  position: relative
  margin: 0 auto

.logo-section
  height: 8em
  padding-bottom: 1em

  .logo
    height: 100%
    margin-bottom: 1em

.desc-section
  width: 65%
  position: relative
  margin: 0 auto
  text-align: left
  color: rgb(111, 99, 99)

  .title
    font-size: 1.25em
    margin: 1.5em 0 1em 0
    font-weight: 600

  .last-refresh-date
    font-weight: normal
    font-size: 14px
    margin-left: 1em

.hint
  margin-top: 1em
  text-align: start
  color: rgb(111, 99, 99)
  font-size: 14px

.table-wrapper
  margin: 1em 0
  width: calc(100% - 2px)

  .data-row
    display: flex

  .title-row
    margin-top: .5em
    font-weight: 600

  .data-row, .title-row
    background-color: rgb(248,249,250)

  .data-cell
    padding: 1em
    width: 33%
    border: 1px solid rgb(222,226,230)

.spinning
  animation: spin 1s infinite

@keyframes spin
  100%
    transform: rotate(360deg)
</style>
