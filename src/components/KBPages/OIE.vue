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
          <div class="output-count">2 total Extractions</div>
        </div>
        <div class="action-area">
          <div class="save-button">Save</div>
        </div>
      </div>
      <div class="output-data">
        <div class="result-row" v-for="(seq, index) in qaResult" :key="index">
          <div class="annotation-area">
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
          </div>
          <div class="action-area">
            <div class="category">
              <el-select v-model="value" placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="edit-button">Edit</div>
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
import { infoExtraction } from '@/service'

export default {
  name: 'OIE',
  data() {
    return {
      examples: ['美国总统奥巴马将访问中国。'],
      example: null,
      query: '',
      showOutput: false,
      qaResult: [],
      noResult: false,
      loading: false,
      predefinedColors: ['#1bcae3', '#e396df', '#e37d6c'],
      options: [
        {
          value: 'Option1',
          label: 'Option1'
        },
        {
          value: 'Option2',
          label: 'Option2'
        },
        {
          value: 'Option3',
          label: 'Option3'
        },
        {
          value: 'Option4',
          label: 'Option4'
        },
        {
          value: 'Option5',
          label: 'Option5'
        }
      ],
      value: null
    }
  },
  methods: {
    async search() {
      this.loading = true
      const res = await infoExtraction(this.query)
      for (let seq of res.data) {
        let tagIndex = 0
        for (let tag of seq) {
          if (tag.type === 'tag') {
            tag.color = this.predefinedColors[tagIndex++]
          }
        }
      }
      this.qaResult = res.data
      console.log(res.data)
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

  .output-title-section
    display: flex
    flex-direction: row
    justify-content: space-between
    padding: 12px 0

  .output-title
    font-weight: 600
    margin-bottom: 1em

  .save-button
    background-color: rgb(17,138,178)
    color: white
    padding: .3em 1em
    display: inline-block
    margin: 1em 0.5em
    cursor: pointer
    user-select: none
    transition: .2s

    &:hover
      opacity: .7

  .output-data
    .result-row
      display: flex
      justify-content: space-between

      &:not(:last-child)
        border-bottom: rgb(229,229,229) solid 2px
        margin-bottom: 1em

    .annotation-area
      margin: 0 1em
      display: flex
      align-items: flex-start

      .plain
        margin-right: .5em

      .tag
        margin-right: .5em

        .label
          text-align: center
          margin: 0
          color: white

    .action-area
      width: 8em

      .category
        width: 100%

      .edit-button
        background-color: #f24e6e
        color: white
        padding: .3em 1em
        border-radius: 4px
        display: inline-block
        margin: 1em 0
        cursor: pointer
        user-select: none
        transition: .2s
        width: 100%
        box-sizing: border-box
        text-align: center

        &:hover
          opacity: .7

.empty-result
  color: rgb(150,150,150)
  font-weight: 300
  font-size: 14px

.answer-item:not(:last-child)
  margin-bottom: .3em

.qa-mode
  margin-top: 1em
</style>
