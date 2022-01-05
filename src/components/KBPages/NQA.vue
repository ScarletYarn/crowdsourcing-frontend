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
    <div class="qa-source">
      <div class="label">Source</div>
      <div class="qa-source-body">
        <el-tabs v-model="activeSource">
          <el-tab-pane label="KBs" name="first">
            <div class="source-tab">
              <el-radio-group v-model="kb">
                <el-radio label="mask">None</el-radio>
                <el-radio label="span">CSKG</el-radio>
                <el-radio label="mask-word">V2C</el-radio>
              </el-radio-group>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Text" name="second">
            <div class="source-tab">
              <el-input
                v-model="textSource"
                :autosize="{ minRows: 2, maxRows: 8 }"
                type="textarea"
                placeholder="Please input"
              >
              </el-input>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Video" name="third">
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
      Submit
    </div>
    <div class="output" v-if="showOutput">
      <div class="divider"></div>
      <div class="output-title">Result</div>
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
      activeSource: 'first',
      kb: null,
      textSource: null,
      videoSrc: null
    }
  },
  methods: {
    async search() {
      this.loading = true
      await new Promise(resolve => {
        setTimeout(() => {
          this.qaResult = [
            {
              source: 'Source A',
              answers: ['Hair', 'Leg', 'Back'],
              context: 'Kotlin is better that Java.'
            },
            {
              source: 'Source B',
              answers: ['Hair', 'Leg', 'Back'],
              context: 'Kotlin is better that Java.'
            }
          ]
          this.noResult = this.qaResult.length === 0
          this.showOutput = true
          this.loading = false
          resolve()
        }, 2000)
      })
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
  background-color: $primary
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

.qa-source
  .source-tab
    padding: 1em 0
    display: flex
    flex-direction: column

    .video-upload
      margin-bottom: 1em
</style>
