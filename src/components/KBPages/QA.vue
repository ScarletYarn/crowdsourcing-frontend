<template>
  <div class="page-body">
    <div class="page-title">Commonsense Question Answering</div>
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
    <div class="qa-mode">
      <el-radio-group v-model="mode" @change="handleModeChange">
        <el-radio label="mask">Mask</el-radio>
        <el-radio label="span">Span</el-radio>
        <el-radio label="mask-word">Mask Word</el-radio>
      </el-radio-group>
    </div>
    <div class="submit" @click="search()" v-loading.fullscreen.lock="loading">
      Submit
    </div>
    <div class="output" v-if="showOutput">
      <div class="divider"></div>
      <div class="output-title">Output</div>
      <div class="output-data">
        <div class="data-row title-row">
          <div class="data-cell">Source</div>
          <div class="data-cell">Answers</div>
          <div class="data-cell">Context</div>
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
import { kbQAMask, kbQASpan, kbQAMaskWord } from '@/service'

export default {
  name: 'QA',
  mounted() {
    this.examples = this.examplesForMask
  },
  data() {
    return {
      examples: [],
      examplesForMask: [
        'Lions like to eat [MASK].',
        'Elephants like to eat [MASK].',
        'Dogs like to eat [MASK].',
        '狮子最喜欢吃[MASK][MASK][MASK]。'
      ],
      examplesForSpan: ['where do lions live ?', '大象喜欢吃什么？'],
      examplesForMaskWord: ['熊猫喜欢吃[MASK]'],
      example: null,
      query: '',
      showOutput: false,
      qaResult: [],
      noResult: false,
      loading: false,
      mode: 'mask'
    }
  },
  methods: {
    async search() {
      this.loading = true
      let res
      if (this.mode === 'mask') {
        res = await kbQAMask(this.query)
      } else if (this.mode === 'span') {
        res = await kbQASpan(this.query)
      } else {
        res = await kbQAMaskWord(this.query)
      }
      this.qaResult = res.data.data
      this.noResult = this.qaResult.length === 0
      this.showOutput = true
      this.loading = false
    },
    handleModeChange(e) {
      if (e === 'mask') {
        this.examples = this.examplesForMask
      } else if (e === 'span') {
        this.examples = this.examplesForSpan
      } else {
        this.examples = this.examplesForMaskWord
      }
    },
    onExampleSelected(e) {
      this.query = e
    }
  }
}
</script>

<style scoped lang="sass">
.page-body
  background-color: rgba(177, 147, 147, .17)
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
  background-color: rgb(17,138,178)
  color: white
  padding: .7em
  display: inline-block
  margin: 1em 0
  cursor: pointer
  user-select: none
  transition: .2s

  &:hover
    opacity: .7

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

.qa-mode
  margin-top: 1em
</style>
