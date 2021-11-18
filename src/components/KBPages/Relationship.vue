<template>
  <div class="page-body">
    <textarea
      style="position: absolute; top: -500px;"
      id="copy-element"
    ></textarea>
    <div class="header-section">
      <div class="title-container">
        <div class="title">{{ pageTitle }}</div>
        <div class="icon">
          <i class="el-icon-s-home" @click="$router.push('/kb/home')"></i>
        </div>
      </div>
      <div class="relative">共检索到{{ items.length }}条记录</div>
      <div class="link">
        API：<span @click="copyText(apiEndPoint)">{{
          apiPretty(apiEndPoint)
        }}</span>
      </div>
    </div>
    <div class="body-section">
      <div class="item-container">
        <div v-for="(item, index) in itemsInPage" :key="index" class="item">
          <div class="head">{{ item.head }}</div>
          <div class="relation">{{ item.rel }}</div>
          <div class="tail">{{ item.tail }}</div>
        </div>
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :size="pageSize"
        :total="items.length"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { BASE_URL, kbSearch } from '@/service'
import { ElMessage } from 'element-plus'

export default {
  name: 'Relationship',
  async mounted() {
    const query =
      this.$route.params.position === 'head'
        ? `select ?x where { <${this.entity}> <${this.rel}> ?x. }`
        : `select ?x where { ?x <${this.rel}> <${this.entity}>. }`
    this.apiEndPoint = encodeURI(`${BASE_URL}/kb/q?q=${query}`)
    const res = await kbSearch(query)
    for (const item of JSON.parse(res.data.data).results.bindings) {
      this.items.push({
        head:
          this.$route.params.position === 'head' ? this.entity : item.x.value,
        rel: this.rel,
        tail:
          this.$route.params.position === 'head' ? item.x.value : this.entity
      })
    }
  },
  data() {
    return {
      items: [],
      apiEndPoint: '',
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    async copyText(text) {
      const inputElement = document.getElementById('copy-element')
      inputElement.value = text
      inputElement.select()
      document.execCommand('copy')
      await ElMessage({
        type: 'success',
        message: '复制成功',
        duration: 1000
      })
    },
    handlePageChange(e) {
      this.currentPage = e
    },
    apiPretty(endPoint) {
      if (endPoint.length < 40) return endPoint
      else
        return (
          endPoint.slice(0, 30) +
          '...' +
          endPoint.slice(endPoint.length - 5, endPoint.length)
        )
    }
  },
  computed: {
    entity() {
      return this.$route.params.entity
    },
    rel() {
      return this.$route.params.rel
    },
    itemsInPage() {
      return this.items.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      )
    },
    pageTitle() {
      if (this.$route.params.position === 'head')
        return `${this.entity}——${this.rel}——<尾实体>`
      else return `<头实体>——${this.rel}——${this.entity}`
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/app.sass"

.page-body
  width: 100%
  height: 100%
  box-sizing: border-box
  padding: 2em 5%
  background-color: rgba(177, 147, 147, .17)
  overflow-y: scroll

.header-section
  margin-bottom: 16px

.header-section, .body-section
  border: 1px solid rgb(187, 187, 187)
  background-color: #ffffff

.title-container
  display: flex
  flex-direction: row
  align-items: center

  .title
    font-size: 32px
    margin: .5em .5em .5em .8em

  .icon
    flex-grow: 1
    text-align: end
    align-self: start
    padding: .5em
    font-size: 24px

    i
      cursor: pointer

.relative, .link
  text-align: start
  margin-left: 26px

.relative
  color: rgba(111, 99, 99, 1)
  font-size: 16px

.link
  color: rgba(111, 99, 99, 1)
  font-size: 12px
  margin-top: 1em
  margin-bottom: 2em

  span:hover
    @include external

.body-section
  box-sizing: border-box
  padding: 2em 2em .5em 2em
  margin-bottom: 3em

  .item-container
    overflow: hidden
    margin-bottom: 1em

  .item
    float: left
    display: flex
    flex-direction: row
    align-items: center
    width: 50%
    margin: 1em auto
    text-indent: 1em
    color: #6F6363

    .relation
      font-weight: 600
      color: #000000
</style>
