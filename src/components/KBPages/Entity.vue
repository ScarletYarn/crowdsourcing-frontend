<template>
  <div class="page-body">
    <textarea
      style="position: absolute; top: -500px;"
      id="copy-element"
    ></textarea>
    <el-dialog
      v-model="editDialog"
      custom-class="edit-dialog"
      width="30%"
      title="常识修订"
    >
      <div class="choice-section">
        <div class="title">您认为这条常识？</div>
        <el-radio-group v-model="wrongType" :disabled="submitted">
          <el-radio :label="1">知识表述错误</el-radio>
          <el-radio :label="2">知识表述正确但不是常识</el-radio>
        </el-radio-group>
        <div class="triple-edit" v-if="wrongType === 1">
          <div class="cell">
            <div class="text">狮子</div>
            <div class="type">头实体</div>
          </div>
          <div class="cell">
            <div class="text">喜欢</div>
            <div class="type">关系</div>
          </div>
          <div class="cell">
            <input class="text" :disabled="submitted" />
            <div class="type">尾实体</div>
          </div>
        </div>
      </div>
      <div class="action-section" v-if="!submitted">
        <div class="discard-action" @click="editDialog = false">放弃</div>
        <div class="submit-action" @click="submit">提交</div>
      </div>
      <div class="other-edit-section" v-if="submitted">
        <div class="title">其他用户修订：</div>
        <div
          class="other-edit"
          v-for="(proposal, index) in proposals"
          :key="index"
        >
          <div class="content">{{ proposal.content }}</div>
          <div class="action">
            <div class="vote">
              <font-awesome-icon
                class="vote-icon"
                icon="thumbs-up"
                :style="proposal.user === 1 ? 'color: #F57F17' : ''"
                @click="selectProposal(proposal, 1)"
              />
              <div class="count">{{ proposal.up }}</div>
            </div>
            <div class="vote">
              <font-awesome-icon
                class="vote-icon"
                icon="thumbs-down"
                :style="proposal.user === 2 ? 'color: #F57F17' : ''"
                @click="selectProposal(proposal, 2)"
              />
              <div class="count">{{ proposal.down }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <div class="header-section">
      <div class="title-container">
        <div class="title">{{ entity }}</div>
        <div class="badge">词条</div>
        <div class="icon">
          <i class="el-icon-s-home" @click="$router.push('/kb/home')"></i>
        </div>
      </div>
      <div class="head-control" style="display:flex;height:120px;">
        <div class="left" style="max-width:60%;">
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
        <div
          class="right"
          style="margin-left:50px;height:170px;margin-top:-60px;display:flex;justify-content:center;align-items:center;"
        >
          <img
            class="image"
            style="max-width:300px;max-height:165px;"
            v-if="entityImageURL != 'NA'"
            :src="entityImageURL"
            mode="aspectFit"
          />
        </div>
      </div>
    </div>
    <div class="body-section">
      <div class="body-title">【{{ entity }}】作为头实体</div>
      <div class="item-area">
        <div class="empty-result" v-if="Object.keys(headTriples).length === 0">
          无搜索结果
        </div>
        <div
          class="relation-cell"
          v-for="(item, index) in Object.keys(headTriples)"
          :key="index"
        >
          <div class="relation">{{ item }}</div>
          <div
            class="item"
            v-for="(subItem, subIndex) in headTriples[item]"
            :key="subIndex"
          >
            <div
              @click="
                $router.push({ name: 'entity', params: { entity: subItem } })
              "
            >
              {{ subItem }}
            </div>
            <i class="el-icon-edit" @click="editDialog = true"></i>
          </div>
          <div class="more-link" v-if="headTriples[item].hasMore">
            <span @click="toMore(entity, item, 'head')">More >></span>
          </div>
        </div>
      </div>
      <div class="divide-line"></div>
      <div class="body-title">【{{ entity }}】作为尾实体</div>
      <div class="item-area">
        <div class="empty-result" v-if="Object.keys(tailTriples).length === 0">
          无搜索结果
        </div>
        <div
          class="relation-cell"
          v-for="(item, index) in Object.keys(tailTriples)"
          :key="index"
        >
          <div class="relation">{{ item }}</div>
          <div
            class="item"
            v-for="(subItem, subIndex) in tailTriples[item]"
            :key="subIndex"
          >
            <div
              @click="
                $router.push({ name: 'entity', params: { entity: subItem } })
              "
            >
              {{ subItem }}
            </div>
            <i class="el-icon-edit" @click="editDialog = true"></i>
          </div>
          <div class="more-link" v-if="tailTriples[item].hasMore">
            <span @click="toMore(entity, item, 'tail')">More >></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { BASE_URL, kbSearch, kbSearchImage } from '@/service'

export default {
  name: 'Entity',
  async mounted() {
    let res = await kbSearchImage(this.entity)
    if(res.data.data != 'NA')
      this.entityImageURL = BASE_URL + '/' + res.data.data
    this.headApiEndPoint = encodeURI(`${BASE_URL}/kb/q?subject=${this.entity}`)
    this.tailApiEndPoint = encodeURI(`${BASE_URL}/kb/q?object=${this.entity}`)
    const headResp = await kbSearch(this.entity)
    this.headTriples = this.parseItems(headResp.data.data, 'object')
    const tailResp = await kbSearch(null, this.entity)
    this.tailTriples = this.parseItems(tailResp.data.data, 'subject')
    this.totalItemsCount = headResp.data.data.length + tailResp.data.data.length
  },
  data() {
    return {
      entityImageURL: 'NA',
      headTriples: [],
      tailTriples: [],
      totalItemsCount: 0,
      headApiEndPoint: '',
      tailApiEndPoint: '',
      editDialog: false,
      wrongType: 1,
      submitted: false,
      proposals: [
        {
          content: '知识表述正确但不是常识',
          up: 1,
          down: 12,
          user: 0
        },
        {
          content: '草->肉',
          up: 3,
          down: 1,
          user: 0
        }
      ]
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
    selectProposal(proposal, select) {
      if (proposal.user === select) return
      if (proposal.user === 0) {
        if (select === 1) {
          proposal.up++
        } else {
          proposal.down++
        }
      } else {
        if (select === 1) {
          proposal.up++
          proposal.down--
        } else {
          proposal.up--
          proposal.down++
        }
      }
      proposal.user = select
    },
    parseItems(items, pos) {
      const res = {}
      items.map(item => {
        if (!Object.hasOwnProperty.call(res, item.relation)) {
          res[item.relation] = []
        }
        if (res[item.relation].length <= 4) res[item.relation].push(item[pos])
        else res[item.relation].hasMore = true
      })

      Object.keys(res).map(k => res[k].sort())

      return res
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
    },
    submit() {
      this.submitted = true
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
@use "sass:list"
@import "src/app"

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
    display: flex
    align-items: center

    *:hover
      cursor: pointer

    i
      margin-left: .5em
      display: block

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

::v-deep(.edit-dialog)
  .choice-section
    text-align: left
    padding-left: 1em

    .title
      margin-bottom: 1em
      font-size: 1.2em
      font-weight: 600

    .el-radio-group
      display: block
      font-size: inherit
      margin-left: 1em
      margin-bottom: 1em

      ::v-deep(.el-radio__label)
        font-weight: 400

    .triple-edit
      text-align: center
      margin-bottom: 1em

      .cell
        display: inline-block

        &:not(:last-child)
          margin-right: 1em

        .type
          color: white

        input.text
          width: 3em
          line-height: 18px

      $colors: (#1BCAE3, #E396DF, #E37D6C)

      @for $i from 1 through 3
        .cell:nth-child(#{$i})
          .text
            border: solid list.nth($colors, $i) 2px

          .type
            background: list.nth($colors, $i)

  .other-edit-section
    padding-left: 1em
    margin-top: 1.5em

    .title
      text-align: left
      margin-bottom: 1em
      font-size: 1.2em
      font-weight: 600

    .other-edit
      border-bottom: solid #efefef 1px

      .content
        text-align: left
        margin-top: 0.5em

      .action
        display: flex
        justify-content: flex-end
        margin-bottom: 0.5em
        margin-top: 1em

        .vote
          display: flex
          align-items: center
          user-select: none

          .count
            margin-left: 0.5em
            min-width: 2em

          .vote-icon
            cursor: pointer

          &:not(:last-child)
            margin-right: 1.5em

  .action-section
    display: flex
    justify-content: flex-end
    padding-top: 1.5em

    :not(:last-child)
      margin-right: 1em

    .discard-action
      @include button
      background: $cancel
      padding: .3em 1em

    .submit-action
      @include button
      background: $primary
      padding: .3em 1em
</style>
