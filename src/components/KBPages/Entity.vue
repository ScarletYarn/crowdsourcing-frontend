<template>
  <div class="page-body">
    <textarea
      style="position: absolute; top: -500px;"
      id="copy-element"
    ></textarea>
    <div class="header-section">
      <div class="title-container">
        <div class="title">{{ entity }}</div>
        <div class="badge">词条</div>
        <div class="icon">
          <i class="el-icon-s-home" @click="$router.push('/kb/home')"></i>
        </div>
      </div>
      <div class="relative">共检索到{{ totalItemsCount }}个相关词条</div>
      <div class="link">
        API(头实体)：<span @click="copyText(headApiEndPoint)">{{
          apiPretty(headApiEndPoint)
        }}</span>
      </div>
      <div class="link">
        API(尾实体)：<span @click="copyText(tailApiEndPoint)">{{
          apiPretty(tailApiEndPoint)
        }}</span>
      </div>
    </div>
    <div class="body-section">
      <div class="body-title">【{{ entity }}】作为头实体</div>
      <div class="item-area">
        <div class="empty-result" v-if="headTriples.length === 0">
          无搜索结果
        </div>
        <div
          class="relation-cell"
          v-for="(item, index) in headTriples"
          :key="index"
        >
          <div class="relation">{{ item.rel }}</div>
          <div
            class="item"
            v-for="(subItem, subIndex) in item.tails"
            :key="subIndex"
            @click="
              $router.push({ name: 'entity', params: { entity: subItem } })
            "
          >
            {{ subItem }}
          </div>
          <div class="more-link" v-if="item.hasMore">
            <span @click="toMore(entity, item.rel, 'head')">More >></span>
          </div>
        </div>
      </div>
      <div class="divide-line"></div>
      <div class="body-title">【{{ entity }}】作为尾实体</div>
      <div class="item-area">
        <div class="empty-result" v-if="tailTriples.length === 0">
          无搜索结果
        </div>
        <div
          class="relation-cell"
          v-for="(item, index) in tailTriples"
          :key="index"
        >
          <div class="relation">{{ item.rel }}</div>
          <div
            class="item"
            v-for="(subItem, subIndex) in item.tails"
            :key="subIndex"
            @click="
              $router.push({ name: 'entity', params: { entity: subItem } })
            "
          >
            {{ subItem }}
          </div>
          <div class="more-link" v-if="item.hasMore">
            <span @click="toMore(entity, item.rel, 'tail')">More >></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { BASE_URL, kbSearch } from '@/service'

export default {
  name: 'Entity',
  async mounted() {
    const headQuery = `select ?x ?y where { <${this.entity}> ?y ?x. }`
    const tailQuery = `select ?x ?y where { ?x ?y <${this.entity}>. }`
    this.headApiEndPoint = encodeURI(`${BASE_URL}/kb/q?q=${headQuery}`)
    this.tailApiEndPoint = encodeURI(`${BASE_URL}/kb/q?q=${tailQuery}`)
    let res = await kbSearch(headQuery)
    const headItems = JSON.parse(res.data.data).results.bindings
    this.headTriples = this.parseItems(headItems)
    res = await kbSearch(tailQuery)
    const tailItems = JSON.parse(res.data.data).results.bindings
    this.tailTriples = this.parseItems(tailItems)
    this.totalItemsCount = headItems.length + tailItems.length
  },
  data() {
    return {
      headTriples: [],
      tailTriples: [],
      totalItemsCount: 0,
      headApiEndPoint: '',
      tailApiEndPoint: ''
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
    parseItems(items) {
      const itemMap = {}
      const parsedItems = []
      for (const item of items) {
        if (Object.hasOwnProperty.call(itemMap, item.y.value)) itemMap[item.y.value].push(item.x.value)
        else itemMap[item.y.value] = [item.x.value]
      }
      for (const rel in itemMap) {
        if (itemMap[rel].length > 4) {
          itemMap[rel] = itemMap[rel].slice(0, 4)
          itemMap[rel].hasMore = true
        }
        parsedItems.push({
          rel,
          tails: itemMap[rel],
          hasMore: itemMap[rel].hasMore
        })
      }
      return parsedItems
    },
    toMore(head, rel, position) {
      this.$router.push({
        name: 'relationship',
        params: {
          entity: head,
          rel: rel,
          position: position
        }
      })
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

  .badge
    font-size: 12px
    padding: .5em 1em
    color: rgba(16, 16, 16, .71)
    border-radius: 15px 15px 15px 15px
    background-color: rgba(166, 255, 246, 1)
    border: 1px solid rgba(115, 97, 97, 1)

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

  &:last-child
    margin-bottom: 1.5em

  .link-indent
    display: inline
    visibility: hidden

  span:hover
    @include external

.body-title
  color: #101010
  text-align: start
  margin-top: 1em
  text-indent: 2em
  font-size: 14px

.divide-line
  border-top: dashed 1px #BBBBBB
  height: 0

.item-area
  display: flex
  flex-direction: row
  flex-wrap: wrap

.relation-cell
  text-align: start
  box-sizing: border-box
  padding: 2em 4%
  width: 25%

  .relation
    font-size: 18px
    margin-bottom: .8em

  .item
    font-size: 14px
    margin-bottom: .5em
    color: #6F6363

    &:hover
      cursor: pointer

.empty-result
  width: 50%
  margin: 3em auto
  color: rgba(111, 99, 99, 1)
  font-size: 16px

.more-link
  margin-top: 1em
  color: #4F4141

  span:hover
    @include external
</style>
