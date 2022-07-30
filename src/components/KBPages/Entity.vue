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
            <div
              class="text"
              :title="isInEditInv ? activeTriple.object : activeTriple.subject"
            >
              {{
                formatSubject(
                  isInEditInv ? activeTriple.object : activeTriple.subject
                )
              }}
            </div>
            <div class="type">{{ isInEditInv ? '尾实体' : '头实体' }}</div>
          </div>
          <div class="cell">
            <div class="text">{{ activeTriple.relation }}</div>
            <div class="type">关系</div>
          </div>
          <div class="cell">
            <input class="text" v-model="tailEdit" :disabled="submitted" />
            <div class="type">{{ isInEditInv ? '头实体' : '尾实体' }}</div>
          </div>
        </div>
      </div>
      <div class="action-section" v-if="!submitted && !showComplete">
        <div class="discard-action" @click="editDialog = false">放弃</div>
        <div class="submit-action" @click="submit">提交</div>
        <div class="submit-action" @click="autoComplete">自动预测</div>
      </div>
      <div class="other-edit-section" v-if="submitted">
        <div class="title">其他用户修订：</div>
        <div
          class="other-edit"
          v-for="(proposal, index) in proposals"
          :key="index"
        >
          <div class="content">
            {{
              proposal.type === 'WRONG'
                ? '知识表述正确但不是常识'
                : (isInEditInv ? activeTriple.subject : activeTriple.object) +
                  '->' +
                  proposal.data
            }}
          </div>
          <div class="action">
            <div class="vote" @click="selectProposal(proposal, 1)">
              <font-awesome-icon
                class="vote-icon"
                icon="thumbs-up"
                :style="proposal.user === 1 ? 'color: #F57F17' : ''"
              />
              <div class="count">{{ proposal.upvote }}</div>
            </div>
            <div class="vote" @click="selectProposal(proposal, 2)">
              <font-awesome-icon
                class="vote-icon"
                icon="thumbs-down"
                :style="proposal.user === 2 ? 'color: #F57F17' : ''"
              />
              <div class="count">{{ proposal.downvote }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="completion-section" v-if="showComplete">
        <div class="title">增量推理结果：</div>
        <div v-if="completionResults.length > 0">
          <div
            class="completion-result-cell"
            :style="`background: ${item.exist ? '#ffa06b' : '#d3f9d3'}`"
            v-for="(item, index) in completionResults"
            :key="index"
          >
            <div class="item" :title="item.item">
              {{ formatSubject(item.item) }}
            </div>
            <div class="score">
              {{ item.score.toFixed(2) }}
            </div>
            <div
              class="action text-button"
              v-if="!item.saved"
              @click="saveItem(item)"
            >
              入库 <i class="el-icon-circle-plus-outline" />
            </div>
            <div class="action" v-else>
              已入库 <i class="el-icon-circle-check" />
            </div>
          </div>
        </div>
        <div v-else-if="inCompleting">
          正在推理中...
        </div>
        <div v-else>
          没有推理结果
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
                $router.push({
                  name: 'entity',
                  params: { entity: subItem.value }
                })
              "
            >
              {{ subItem.value }}
            </div>
            <div class="d-flex-row flex-justify-center">
              <div class="tail-score" v-if="subItem.score">
                {{ subItem.score }}
              </div>
              <i
                class="el-icon-edit"
                @click="
                  openEdit(subItem.id, entity, item, subItem.value, false)
                "
              ></i>
            </div>
          </div>
          <div class="more-link" v-if="headTriples[item].hasMore">
            <span @click="toMore(entity, item, 'head')">更多条目 >></span>
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
                $router.push({
                  name: 'entity',
                  params: { entity: subItem.value }
                })
              "
            >
              {{ subItem.value }}
            </div>
            <div class="d-flex-row flex-justify-center">
              <div class="tail-score" v-if="subItem.score">
                {{ subItem.score }}
              </div>
              <i
                class="el-icon-edit"
                @click="openEdit(subItem.id, subItem.value, item, entity, true)"
              ></i>
            </div>
          </div>
          <div class="more-link" v-if="tailTriples[item].hasMore">
            <span @click="toMore(entity, item, 'tail')">更多条目 >></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import {
  BASE_URL,
  kbSearch,
  kbSearchImage,
  getAllTripleComment,
  postTripleComment,
  tripleCommentUpOrDown,
  getCompletion,
  populate
} from '@/service'

export default {
  name: 'Entity',
  async mounted() {
    let res = await kbSearchImage(this.entity)
    if (res.data.data != 'NA')
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
      proposals: [],
      tailEdit: '',
      activeTriple: null,
      showComplete: false,
      completionResults: [],
      isInEditInv: false,
      inCompleting: false
    }
  },
  methods: {
    formatSubject(subject) {
      if (subject.length < 7) return subject
      else return subject.substring(0, 5) + '...'
    },
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
    async selectProposal(proposal, select) {
      if (proposal.user && proposal.user !== select) return
      const isUpvote = select === 1
      const isCancel = !!proposal.user
      await tripleCommentUpOrDown(proposal.id, isUpvote, isCancel)
      if (select === 1) {
        proposal.upvote += isCancel ? -1 : 1
      } else {
        proposal.downvote += isCancel ? -1 : 1
      }
      proposal.user = select
      if (isCancel) proposal.user = null
    },
    parseItems(items, pos) {
      const res = {}
      items.map(item => {
        if (!Object.hasOwnProperty.call(res, item.relation)) {
          res[item.relation] = []
        }
        if (res[item.relation].length <= 4)
          res[item.relation].push({
            value: item[pos],
            score: item.score ? parseFloat(item.score).toFixed(2) : null,
            id: item.id
          })
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
    async submit() {
      if (this.wrongType === 1 && this.tailEdit.trim().length === 0) {
        await ElMessage({
          type: 'warning',
          message: '请输入尾实体',
          duration: 1000
        })
        return
      }
      await postTripleComment(
        this.activeTriple.id,
        this.wrongType === 1 ? 'TAIL' : 'WRONG',
        this.tailEdit
      )
      const allProposals = await getAllTripleComment(this.activeTriple.id)
      this.proposals = allProposals.data.data
      this.submitted = true
    },
    openEdit(id, subject, relation, object, isInv) {
      this.isInEditInv = isInv
      this.editDialog = true
      this.activeTriple = {
        id,
        subject,
        relation,
        object
      }
    },
    async autoComplete() {
      this.completionResults = []
      this.inCompleting = true
      this.showComplete = !this.showComplete
      this.completionResults = (
        await getCompletion(
          this.activeTriple.subject,
          this.activeTriple.relation,
          this.isInEditInv
        )
      ).data.data
      this.inCompleting = false
    },
    async saveItem(item) {
      await populate(
        this.activeTriple.subject,
        this.activeTriple.relation,
        item.item
      )
      item.saved = true
    }
  },
  computed: {
    entity() {
      return this.$route.params.entity
    }
  },
  watch: {
    editDialog() {
      this.submitted = false
      this.showComplete = false
      this.proposals = []
      this.tailEdit = ''
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
    justify-content: space-between
    align-items: center

    .tail-score
      background: #8f8f8f20
      padding: 1px 6px
      font-size: 12px
      border-radius: 4px

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
          cursor: pointer

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

  .completion-section
    padding-left: 1em
    margin-top: 1.5em

    .title
      text-align: left
      margin-bottom: 1em
      font-size: 1.2em
      font-weight: 600

    .completion-result-cell
      display: flex
      justify-content: end
      margin-bottom: 0.5em
      padding: 0.25em 0
      border-bottom: solid #8f8f8f20 1px

      .item
        margin-right: 1em

      .score
        margin-right: 2em
        background: #8f8f8f20
        padding: 1px 6px
        font-size: 12px
        border-radius: 4px

      .action
        width: 5em
        user-select: none
</style>
