<template>
  <div class="page-body">
    <div class="page-title">Open Information Extraction</div>
    <div class="example-input">
      <div class="label">Example inputs</div>
      <el-select
        v-model="example"
        @change="onExampleSelected"
        placeholder="Select an example query"
      >
        <el-option
          v-for="item in examples"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </div>
    <div class="query-input">
      <div class="label">Query</div>
      <el-input v-model="query"></el-input>
    </div>
    <div class="submit" @click="search()" v-loading.fullscreen.lock="loading">
      Submit
    </div>
    <div class="output" v-if="showOutput">
      <div class="divider"></div>
      <div class="output-title-section">
        <div class="content-area">
          <div class="output-title">Output</div>
          <div class="output-count">
            {{ qaResult.length }} total Extractions
          </div>
        </div>
      </div>
      <div class="output-data">
        <div class="result-row" v-for="(seq, index) in qaResult" :key="index">
          <div v-if="seq.dividerContent" class="result-divider">
            {{ seq.dividerContent }}
          </div>
          <div v-if="!seq.dividerContent" class="annotation-area">
            <div v-for="(tag, _index) in seq" :key="_index">
              <div
                v-if="tag.type === 'tag'"
                class="tag"
                :style="`border: ${tag.color} solid 2px`"
              >
                <div class="text">{{ tag.text }}</div>
                <div class="label" :style="`background-color: ${tag.color}`">
                  {{ tag.label }}
                </div>
              </div>
              <div v-else-if="tag.type === 'plain'" class="plain">
                {{ tag.text }}
              </div>
              <div v-else>OOPS!</div>
            </div>
            <div class="tail-score-box">
              <div class="tail-score" v-if="seq.score">{{ seq.score }}</div>
              <div class="tail-score" v-if="seq.score < 0.9">
                可能错误/冲突
              </div>
            </div>
            <div class="tail-cnt" v-if="seq.cnt > 1">x {{ seq.cnt }}</div>
            <div class="tail-badge" v-if="seq.source">{{ seq.source }}</div>
          </div>
          <div v-if="!seq.dividerContent && !seq.isExt" class="action-area">
            <div class="edit-button" @click="seq.editDialog = true">Edit</div>
            <el-dialog v-model="seq.editDialog" title="Edit Extraction">
              <div v-for="(tag, _index) in seq" :key="_index">
                <div class="edit-section" v-if="tag.type === 'tag'">
                  <div class="position">{{ tag.label }}</div>
                  <div class="body">
                    <input type="text" v-model="tag.inEdit" />
                  </div>
                </div>
              </div>
              <div class="action-section">
                <div class="discard-button" @click="seq.editDialog = false">
                  Discard
                </div>
                <div class="save-button">Save</div>
              </div>
            </el-dialog>
          </div>
          <div
            v-if="seq.isExt && seq.score < 0.9 && !seq.action"
            class="action-area"
          >
            <div class="accept-button" @click="seq.action = 'Accepted'">
              Accept
            </div>
            <div class="decline-button" @click="seq.action = 'Declined'">
              Decline
            </div>
          </div>
          <div
            class="action-area"
            v-if="seq.isExt && seq.score < 0.9 && seq.action"
          >
            <div class="ext-action">
              {{ seq.action }}
            </div>
          </div>
        </div>
        <div class="empty-result" v-if="noResult">
          <div class="data-cell">No result</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  infoExtraction,
  similarBm25,
  similarKnn,
  getEntailment
} from '@/service'
import { ElMessage } from 'element-plus'

export default {
  name: 'OIE',
  data() {
    return {
      examples: ['狮是一种生存在非洲和亚洲的大型猫科动物。'],
      example: null,
      query: '',
      showOutput: false,
      qaResult: [],
      noResult: false,
      loading: false,
      predefinedColors: ['#1BCAE3FF', '#E396DFFF', '#E37D6CFF'],
      editDialog: false,
      startPosition: 0,
      length: 1
    }
  },
  methods: {
    packPremise(p) {
      // eslint-disable-next-line
      return (p[0].text + p[1].text + p[2].text).replace(/[\[\]\|]/g, '')
    },
    packHypo(h) {
      // eslint-disable-next-line
      return (h[0].text + h[1].text + h[2].text).replace(/[\[\]\|]/g, '')
    },
    wrapSeq(subject, relation, object, source, cnt) {
      const res = [
        {
          type: 'tag',
          label: '头实体',
          text: subject,
          inEdit: subject
        },
        {
          type: 'tag',
          label: '关系',
          text: relation,
          inEdit: relation
        },
        {
          type: 'tag',
          label: '尾实体',
          text: object,
          inEdit: object
        }
      ]
      if (source) res.source = source
      if (cnt) res.cnt = cnt
      return res
    },
    deduplicate(res) {
      const dMap = {}
      const cleanArr = []
      res.map(item => {
        const q = item.subject + item.relation + item.object
        if (!(q in dMap)) {
          cleanArr.push(item)
          dMap[q] = 1
        } else {
          dMap[q]++
        }
      })

      cleanArr.map(item => {
        const q = item.subject + item.relation + item.object
        item.cnt = dMap[q]
      })

      return cleanArr
    },
    async search() {
      if (!this.query.trim()) {
        await ElMessage({
          type: 'warning',
          message: '请输入抽取内容',
          duration: 1000
        })
        return
      }
      this.loading = true
      const res = []
      const extraction = (await infoExtraction(this.query)).data.data
      res.push({
        dividerContent: 'Extraction result:'
      })
      const extSet = []
      for (const item of extraction) {
        const wExt = this.wrapSeq(
          item.values[1],
          item.values[0],
          item.values[2]
        )
        wExt.isExt = true
        res.push(wExt)
        extSet.push(wExt)
      }

      res.push({
        dividerContent: 'BM25 similar items:'
      })

      const bSim = []
      for (const item of extraction) {
        const query = item.values[1] + item.values[0] + item.values[2]
        // eslint-disable-next-line
        const sim = (await similarBm25(query.replace(/[\[\]\|]/g, ''))).data
          .data
        bSim.push(...sim)
      }
      const dBmSim = this.deduplicate(bSim)
      const bSet = []
      dBmSim.map(e => {
        const wExt = this.wrapSeq(
          e.subject,
          e.relation,
          e.object,
          'BM25',
          e.cnt
        )
        bSet.push(wExt)
        res.push(wExt)
      })

      res.push({
        dividerContent: 'KNN similar items:'
      })

      const kSim = []
      for (const item of extraction) {
        const knn = (await similarKnn(item.vector.toString())).data.data
        kSim.push(...knn)
      }
      const dKnnSim = this.deduplicate(kSim)
      dKnnSim.map(e => {
        const wExt = this.wrapSeq(e.subject, e.relation, e.object, 'KNN', e.cnt)
        bSet.push(wExt)
        res.push(wExt)
      })

      res.map(seq => {
        if (seq.dividerContent) return
        let tagIndex = 0
        seq.editDialog = false
        seq.reason = null
        seq.map(tag => {
          if (tag.type === 'tag') {
            tag.color = this.predefinedColors[tagIndex++]
          }
        })
      })

      const premise = bSet.map(this.packPremise).join('。') + '。'
      const hyp = extSet.map(this.packHypo)
      const scoreList = (await getEntailment(premise, hyp.join(';'))).data.data
      extSet.map((e, i) => {
        e.score = scoreList[i]
      })

      this.qaResult = res
      this.noResult = this.qaResult.length === 0
      this.showOutput = true
      this.loading = false
    },
    onExampleSelected(e) {
      this.query = e
    }
  }
}
</script>

<style scoped lang="sass">
@import "src/app"

.page-body
  background-color: $background
  width: 100%
  height: 100%
  padding: 4em
  box-sizing: border-box
  text-align: left
  overflow-y: scroll

.page-title
  font-size: 24px
  margin-bottom: 1em
  font-weight: 600

.label
  margin-bottom: .4em
  margin-top: .8em

.submit
  @include button
  background-color: $primary
  padding: .7em
  margin: 1em 0

.el-select
  width: 100%

.output
  .divider
    background-color: rgb(229,229,229)
    height: 2px
    width: 100%
    margin: .5em 0

  .output-title-section
    display: flex
    flex-direction: row
    justify-content: space-between
    padding: 12px 0

  .output-title
    font-weight: 600
    margin-bottom: 1em

  .save-button
    @include button
    background-color: $primary
    padding: .3em 1em
    margin: 1em 0.5em

  .output-data
    .result-row
      display: flex
      justify-content: space-between
      padding-bottom: 1em

      &:not(:last-child)
        border-bottom: rgb(229,229,229) solid 2px
        margin-bottom: 1em

    .result-divider
      margin-top: 1em

    .annotation-area
      margin: 0 1em
      display: flex
      align-items: flex-start

      .plain
        margin-right: .5em

      .tag
        margin-right: .5em

        .text
          text-align: center

        .label
          text-align: center
          margin: 0
          color: white

      .tail-score, .tail-cnt, .tail-badge
        border: solid 1px gray
        border-radius: 5px
        font-size: 12px
        padding: 0 6px
        cursor: pointer
        margin-right: 0.5em

      .tail-score-box
        display: flex
        flex-direction: column
        align-items: flex-start

      .tail-score
        margin-bottom: 4px

    .action-area
      width: 8em

      .edit-button, .decline-button
        @include button
        background-color: $attention
        padding: .3em 1em
        width: 100%
        box-sizing: border-box
        text-align: center

      .accept-button
        margin-bottom: 4px

      .accept-button
        @include button
        background-color: $primary
        padding: .3em 1em
        width: 100%
        box-sizing: border-box
        text-align: center

      .ext-action
        border: solid 1px gray
        border-radius: 5px
        text-align: center
        padding: calc(.3em - 2px) calc(1em - 2px)

.empty-result
  color: rgb(150,150,150)
  font-weight: 300
  font-size: 14px

.answer-item:not(:last-child)
  margin-bottom: .3em

.qa-mode
  margin-top: 1em

.edit-section
  padding: 1em
  display: flex
  flex-direction: row
  justify-content: space-between
  align-items: center

  .position
    font-weight: bold
    min-width: 3em

.action-section
  display: flex
  flex-direction: row
  justify-content: flex-end
  align-items: center

  .discard-button
    @include button
    background-color: $cancel
    padding: .3em 1em
    margin: 1em 0.5em
</style>
