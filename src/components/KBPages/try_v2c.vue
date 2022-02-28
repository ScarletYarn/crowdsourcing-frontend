<template>
  <div class="page-body">
    <div class="page-title">Video To Commonsense</div>
    <div class="qa-source">
      <div class="source-tab">
        <input
          type="file"
          class="video-upload"
          @change="onVideoUploaded"
          accept=".mov,.mp4"
        />
        <video :src="videoSrc" width="400" height="300" controls>
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="source-tab2">
        <div
          class="submit"
          @click="search1()"
          v-loading.fullscreen.lock="loading"
        >
          CAPTION GENERATION
        </div>
        <div class="my-textarea">
          <div v-if="showOutput0">
            <div class="caption">{{ caption_res }}</div>
          </div>
        </div>
        <div
          class="submit"
          @click="search2()"
          v-loading.fullscreen.lock="loading"
        >
          REALATED QUERY
        </div>
        <div class="my-textarea1">
          <div v-if="showOutput1">
            <div
              class="caption"
              v-for="(item, index) in related_query_res"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
      <div class="label" style="text-align:left">Commonsense List</div>
      <div class="qa-source-body">
        <el-tabs v-model="activeSource" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in commonsense_tab"
            :key="index"
            :label="item.tab"
            :name="item.name"
          >
            <div
              class="submit"
              @click="search()"
              v-loading.fullscreen.lock="loading"
            >
              Submit
            </div>
            <div class="output" v-if="showOutput">
              <div class="divider"></div>
              <div class="output-title" style="text-align:left">Result</div>
              <div class="output-data">
                <div class="data-row title-row">
                  <div class="data-cell">GT CAPTION</div>
                  <div class="data-cell">GT CMS KNOWLEDGE</div>
                  <div class="data-cell">Answers({{ item.tab }})</div>
                </div>
                <div
                  class="data-row"
                  v-for="(item, index) in qaResult"
                  :key="index"
                >
                  <div class="data-cell">{{ item.caption }}</div>
                  <div class="data-cell">
                    <div
                      class="answer-item"
                      v-for="(subItem, subIndex) in item.cms_knowledge[
                        selected_tab
                      ]"
                      :key="subIndex"
                    >
                      {{ subItem }}
                    </div>
                  </div>
                  <div class="data-cell" v-if="show_en">
                    <div
                      class="answer-item"
                      v-for="(subItem, subIndex) in item.answers[selected_tab]"
                      :key="subIndex"
                    >
                      {{ subItem }}
                    </div>
                  </div>
                  <div class="data-cell" v-if="en_to_zh">
                    <div
                      class="answer-item"
                      v-for="(subItem, subIndex) in trans_res[selected_tab]"
                      :key="subIndex"
                    >
                      {{ subItem.dst }}
                    </div>
                  </div>
                </div>
                <div class="data-row empty-result" v-if="noResult">
                  <div class="data-cell">No result</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div class="submit" @click="MYtrans()" v-loading.fullscreen.lock="loading">
      Translate
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import md5 from 'js-md5'
import { jsonp } from 'vue-jsonp'
/*引入资源请求插件*/

/*使用VueResource插件*/
export default {
  name: 'try_v2c',
  mounted() {
    this.examples = this.examplesForMask
  },
  data() {
    return {
      trans_params: {
        q: '', //待翻译的句子或单词
        from: 'en',
        to: 'zh',
        appid: '20201120000621111',
        salt: '',
        sign: ''
      },
      trans_res: {},
      en_to_zh: false,
      show_en: true,
      commonsense_tab: [
        { tab: 'INTENTION', name: 'first' },
        { tab: 'EFFECT', name: 'second' },
        { tab: 'ATTRIBUTE', name: 'third' },
        { tab: 'NEED', name: 'fourth' },
        { tab: 'REACT', name: 'fifth' }
      ],
      selected_tab: 'INTENTION',
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
      showOutput0: false,
      showOutput1: false,
      qaResult: [],
      noResult: false,
      loading: false,
      activeSource: 'first',
      kb: null,
      textSource: null,
      videoSrc: null,
      caption_res: null,
      related_query_res: null
    }
  },
  methods: {
    MYtrans() {
      if (this.show_en) {
        var sentence_to_trans = this.qaResult[0].answers[this.selected_tab][0] //"to play \n to study"
        console.log(sentence_to_trans)
        const url = 'http://fanyi-api.baidu.com/api/trans/vip/translate'
        var appid = '20201120000621111' //"20200725000526254"
        var userkey = 'grnMILFaU8ZH1obS6aeP' //"Us3Vayxw3SGmccAs7ytg"
        //var salt=Math.random(32768, 65536);

        this.trans_params.salt = Math.random(32768, 65536)
        //var sign = md5(appid + sentence_to_trans + salt + userkey);
        this.trans_params.sign = md5(
          this.trans_params.appid +
            sentence_to_trans +
            this.trans_params.salt +
            userkey
        )
        //var q = encodeURIComponent(sentence_to_trans);
        this.trans_params.q = sentence_to_trans
        //let url=/baidu
        jsonp(url, this.trans_params).then(res => {
          this.en_to_zh = true
          this.show_en = false
          var tab = this.selected_tab
          console.log(tab)
          this.trans_res[tab] = res.trans_result
          console.log(res.trans_result)
        })
      } else {
        this.show_en = true
        this.en_to_zh = false
      }
    },
    async search() {
      this.loading = true
      await new Promise(resolve => {
        setTimeout(() => {
          this.qaResult = [
            {
              caption: 'a person is using a spoon to mix a dessert in a bowl',
              cms_knowledge: {
                ATTRIBUTE: ['hungry', 'starving', 'eating', 'prepared'],
                EFFECT: [
                  'thinks about what to put in the bowl next',
                  'tastes the cereal flavour',
                  'Person X eats the dessert'
                ],
                INTENTION: [
                  'to bake a cake',
                  'to eat something sweet',
                  'to serve cake to each other'
                ],
                NEED: [
                  'to mix the ingredients',
                  'To get the bowl',
                  'to gather the ingredients'
                ],
                REACT: ['proud of the pudding', 'hungry', 'stomach full']
              },

              answers: {
                ATTRIBUTE: ['hungry'],
                EFFECT: ['gets a spoon'],
                INTENTION: ['to eat it'],
                NEED: ['to gather the ingredients'],
                REACT: ['happy to have soup']
              }
            }
          ]
          this.noResult = this.qaResult.length === 0
          this.showOutput = true
          this.loading = false
          this.en_to_zh = false
          this.show_en = true
          resolve()
        }, 2000)
      })
    },
    async search1() {
      this.loading = true
      await new Promise(resolve => {
        setTimeout(() => {
          this.caption_res =
            'a person is using a spoon to mix a dessert in a bowl'
          this.loading = false
          this.showOutput0 = true
          resolve()
        }, 2000)
      })
    },
    async search2() {
      this.loading = true
      await new Promise(resolve => {
        setTimeout(() => {
          this.related_query_res = [
            'PersonX makes dessert',
            'PersonX mixes the ingredients together',
            'PersonX mixes it up'
          ]
          this.loading = false
          this.showOutput1 = true
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
    },
    handleClick(tab, event) {
      console.log(tab.index)
      this.selected_tab = this.commonsense_tab[tab.index].tab
      console.log(this.commonsense_tab[tab.index].tab)
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
  // text-align: left
  overflow-y: scroll

.page-title
  font-size: 24px
  margin-bottom: 1em
  font-weight: 600

.label
  margin-bottom: .4em
  margin-top: .8em
  font-weight:600
  text-align:left

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
  text-align:center

.qa-source
  .source-tab
    padding: 1em 0
    display: flex
    float: left
    flex-direction: column
    .video-upload
      margin-bottom: 1em
  .source-tab2
    padding: 1em 120px
    display: flex
    align-items: center
    flex-direction: column
    .my-textarea
      width:600px
      height:50px
      align-items:center
      text-align:center
      display:flex
      .caption
        align-items:center
        text-align:center
        border: 1px solid rgb(222,226,230)
        font-size:18px
        background-color: rgb(256,256,256)
        border: radius 40px
    .my-textarea1
      width:600px
      height:130px
      text-align:center
      display:flex
      .caption
        align-items:center
        text-align:center
        border: 1px solid rgb(222,226,230)
        font-size:18px
        margin:1px
        background-color: rgb(256,256,256)

    .submit
      background-color: $primary
      width:40%
      color: white

      display: inline-block
      margin: bottom 1em
      cursor: pointer
      user-select: none
      transition: .2s
      text-align:left
      &:hover
        opacity: .7

.caption
  text-align:center
</style>
