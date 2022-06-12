<template>
  <div class="page-body">
    <div class="page-title">常识知识问答</div>
    <div class="example-input">
      <div class="label">查询样例</div>
      <el-select
        v-model="example"
        @change="onExampleSelected"
        placeholder="请选择查询样例"
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
      <div class="label">查询语句</div>
      <el-input v-model="query"></el-input>
    </div>
    <div class="qa-source">
      <div class="label">来源</div>
      <div class="qa-source-body">
        <el-tabs v-model="activeSource">
          <el-tab-pane label="知识库" name="first">
            <div class="source-tab">
              <el-checkbox-group v-model="kb">
                <el-checkbox label="none">None</el-checkbox>
                <el-checkbox label="cskg">CSKG</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-tab-pane>
          <el-tab-pane label="文本" name="second">
            <div class="source-tab">
              <el-input
                v-model="textSource"
                :autosize="{ minRows: 2, maxRows: 8 }"
                type="textarea"
                placeholder="请输入文本"
              >
              </el-input>
            </div>
          </el-tab-pane>
          <el-tab-pane label="视频" name="third">
            <div class="source-tab">
              <div class="source-tab">
                <input
                  type="file"
                  class="video-upload"
                  @change="onVideoUploaded"
                  accept=".mov,.mp4"
                />
                <video :src="videoSrc" width="320" height="240" controls>
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="submit" @click="search()" v-loading.fullscreen.lock="loading">
      提交
    </div>
    <div class="output" v-if="showOutput">
      <div class="divider"></div>
      <div class="output-title">结果</div>
      <div class="output-data">
        <div class="data-row title-row">
          <div class="data-cell">来源</div>
          <div class="data-cell">答案</div>
          <div class="data-cell">上下文</div>
        </div>
        <div class="data-row" v-for="(item, index) in qaResult" :key="index">
          <div class="data-cell">{{ item.source }}</div>
          <div class="data-cell">
            <div
              class="answer-item"
              v-for="(subItem, subIndex) in item.answers"
              :key="subIndex"
            >
              {{ subItem }}
            </div>
          </div>
          <div class="data-cell">{{ item.context }}</div>
        </div>
        <div class="data-row empty-result" v-if="noResult">
          <div class="data-cell">No result</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { kbQAMask, getTextQaResult } from '@/service'
import { ElMessage } from 'element-plus'

export default {
  name: 'NQA',
  mounted() {
    this.examples = this.examplesForMask
  },
  data() {
    return {
      examples: [],
      examplesForMask: [
        'Lions like to eat [MASK].',
        'Elephants like to eat [MASK].',
        'Dogs like to eat [MASK].'
      ],
      examplesForSpan: ['where do lions live ?', '大象喜欢吃什么？'],
      examplesForMaskWord: ['熊猫喜欢吃[MASK]'],
      example: null,
      query: '',
      showOutput: false,
      qaResult: [],
      noResult: false,
      loading: false,
      activeSource: 'first',
      kb: [],
      textSource: null,
      videoSrc: null
    }
  },
  methods: {
    async search() {
      if (!this.query.trim()) {
        await ElMessage({
          type: 'warning',
          message: '请输入QA内容',
          duration: 1000
        })
        return
      }
      if (this.activeSource === 'first') {
        if (this.kb.length === 0) {
          await ElMessage({
            type: 'warning',
            message: '请选择来源',
            duration: 1000
          })
          return
        }
        this.loading = true
        const includeNone = this.kb.indexOf('none') !== -1
        const includeCSKG = this.kb.indexOf('cskg') !== -1
        let res = await kbQAMask(this.query, includeNone, includeCSKG)
        this.qaResult = res.data.data
        this.noResult = this.qaResult.length === 0
        this.showOutput = true
        this.loading = false
      } else if (this.activeSource === 'second') {
        if (!this.textSource.trim()) {
          await ElMessage({
            type: 'warning',
            message: '请输入补充文本',
            duration: 1000
          })
          return
        }
        this.loading = true
        let res = await getTextQaResult(this.query, this.textSource)
        this.qaResult = res.data.data
        this.noResult = this.qaResult.length === 0
        this.showOutput = true
        this.loading = false
      }
    },
    onExampleSelected(e) {
      this.query = e
    },
    onVideoUploaded(e) {
      let file = e.target.files[0]
      this.videoSrc = URL.createObjectURL(file)
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
  background: $primary
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

  .output-title
    margin: .5em 0
    font-weight: 600

  .output-data
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

.empty-result
  color: rgb(150,150,150)
  font-weight: 300
  font-size: 14px

.answer-item:not(:last-child)
  margin-bottom: .3em

.qa-source
  .source-tab
    padding: 1em 0
    display: flex
    flex-direction: column

    .video-upload
      margin-bottom: 1em
</style>
