<template>
  <div class="page-body">
    <div class="title-container">
      <div class="page-title">视频常识抽取</div>
      <div class="icon">
        <i class="el-icon-s-home" @click="$router.push('/kb/home')"></i>
      </div>
    </div>
    <div class="qa-source">
      <div class="source-tab">
        <input
          type="file"
          class="video-upload"
          name = "video_file"
          id = "video_file"
          @change="onVideoUploaded"
          accept=".mov,.mp4"
        />
        <video :src="videoSrc" width="400" height="300" controls>
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="source-tab2">
        <div class="generated-caption" v-loading.fullscreen.lock="loading">
          GENERATED CAPTION
        </div>
        <div class="my-textarea">
          <div v-if="showOutput0">
            <div class="caption" v-if="if_fix">
              <div>{{ caption_res }}</div>
              <div style="
              width: 40px;
              float: right;
              margin-right: 180px;
              margin-top: -20px;
              ">
              <el-button
                type="warning"
                @click="fix"
                round
                size="mini"
                class="fix"
              >
                fix</el-button
              >
              <el-button
                type="warning"
                @click="search2()"
                round
                size="mini"
                class="ok"
              >
                ok</el-button
              >
              </div>
            </div>
            <div class="caption" v-if="if_confirm">
              <textarea
                placeholder="write your caption"
                v-model="text_cap"
                row="1"
                style="
                  border: 0px solid red;
                  font-size: 15px;
                  top: -100px;

                  float: left;
                  width: 100%;
                  height: 20px;
                  resize: none;
                "
              ></textarea>
              <el-button
                type="warning"
                @click="confirm"
                round
                size="small"
                class="confirm"
              >
                confirm</el-button
              >
            </div>
            <!-- <textarea class="caption"></textarea> -->
          </div>
        </div>
        <div
          class="generated-caption"
          v-loading.fullscreen.lock="loading"
        >
          RELATED QUERY
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

      <div class="qa-source-body">
        <div class="output" v-if="showOutput">
          <div class="divider"></div>
          <div class="output-title" style="text-align: left">Result</div>
          <div class="output-data">
            <div class="data-row title-row">
              <div class="data-cell-left">GT CAPTION</div>
              <!-- <div class="data-cell">GT CMS KNOWLEDGE</div> -->
              <div class="data-cell-right">
                Answers
                <!-- <div class="data-cell">{{ item.tab }}</div> -->
              </div>
            </div>
            <div class="data-row">
              <div class="data-cell-left-item">
                {{ trans_res.caption['dst'] }}
              </div>
              <div
                class="data-cell-right-item-title"
                v-for="(item1, index1) in trans_res.cms"
                :key="index1"
              >
                <div class="data-cell-right-item-content">{{ item1.tab }}</div>
                <div class="data-cell-right-item-content">
                  {{ item1.zh }}
                </div>
              </div>
            </div>
            <div class="data-row empty-result" v-if="noResult">
              <div class="data-cell">No result</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="submit" @click="MYtrans()" v-loading.fullscreen.lock="loading" >
      Translate
    </div> -->
  </div>
</template>

<script >
import axios from 'axios'
import md5 from 'js-md5'
import { jsonp } from 'vue-jsonp'
import {
  kbV2C,
  uploadVideo,
  infoExtraction,
  populate
} from '@/service'

export default {
  name: 'try_v2c',
  mounted() {
    this.examples = this.examplesForMask
  },
  data() {
    return {
      if_fix: true,
      if_confirm: false,
      text_cap: '', //用户重新输入的caption
      video_name: '', //用户上传的视频的名字,要传送给后台用来生成caption
      trans_params: {
        q: '', //待翻译的句子或单词
        from: 'en',
        to: 'zh',
        appid: '20201120000621111',
        salt: '',
        sign: ''
      },
      trans_res: {
        caption: { dst: '' },
        cms: [
          { tab: 'INTENTION', zh: '' },
          { tab: 'EFFECT', zh: '' },
          { tab: 'ATTRIBUTE', zh: '' },
          { tab: 'NEED', zh: '' },
          { tab: 'REACT', zh: '' }
        ]
      },
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
      qaResult: [
        {
              caption: 'a man wearing shorts is running',//'a group of short men dance with a tall attractive woman',//'a person is using a spoon to mix a dessert in a bowl',
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
                ATTRIBUTE: ['fashionable'],//['graceful'],//['hungry'],
                EFFECT: ['hats obscure vision'],//['makes new dance moves'],//['gets a spoon'],
                INTENTION: ['to be fashionable'],//['to dance'],//['to eat it'],
                NEED: ['to drive to the mechanic'],//['to like dancing'],//['to gather the ingredients'],
                REACT: ['accomplished'],//['excited'],//['happy to have soup']
              }
            }
      ],
      noResult: false,
      loading: false,
      activeSource: 'first',
      kb: null,
      textSource: null,
      videoSrc: null, //用户上传的视频的地址,要传送给后台用来生成caption
      caption_res: null, //最后确认上传视频的caption，要传到后台生成query等
      related_query_res: null
    }
  },
  methods: {
    fix() {
      this.if_fix = false
      this.if_confirm = true
    },
    confirm() {
      this.if_fix = true
      this.if_confirm = false
      console.log(this.text_cap)
      this.loading = true
       setTimeout(() => {
         this.loading = false
      if (this.text_cap.length == 0) {
        alert('your caption can not be null')
        return
      } else this.caption_res = this.text_cap
       },1000)
    },
  async  MYtrans() {
      if (this.show_en) {
        //var caption_to_trans=this.qaResult[0].caption;
        var caption_to_trans = this.caption_res
        var intention_to_trans = this.qaResult[0].answers['INTENTION'][0]
        var effect_to_trans = this.qaResult[0].answers['EFFECT'][0]
        var attribute_to_trans = this.qaResult[0].answers['ATTRIBUTE'][0]
        var need_to_trans = this.qaResult[0].answers['NEED'][0]
        var react_to_trans = this.qaResult[0].answers['REACT'][0]

        var sentence_to_trans =
          caption_to_trans +
          '\n' +
          intention_to_trans +
          '\n' +
          effect_to_trans +
          '\n' +
          attribute_to_trans +
          '\n' +
          need_to_trans +
          '\n' +
          react_to_trans //this.qaResult[0].answers[this.selected_tab][0]//"to play \n to study"
        //console.log(console.log("sen:",sentence_to_trans))
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
        return jsonp(url, this.trans_params).then((res) => {
          this.en_to_zh = true
          this.show_en = false
          var tab = this.selected_tab
          console.log(res)
          this.trans_res['caption'] = res.trans_result[0]
          console.log('zh-caption:', this.trans_res['caption'])
          // this.trans_res["cms"]=res.trans_result.slice(1)

          for (var i = 1; i < 6; i++) {
            this.trans_res.cms[i - 1]['zh'] = res.trans_result[i].dst
            console.log('zh:', res.trans_result[i].dst)
          }
          console.log('zh-cms:', this.trans_res['cms'])
        })
      } else {
        this.show_en = true
        this.en_to_zh = false
      }
    },
    async search() {
      if (this.caption_res == null) {
        alert('please generate the caption first')
        return
      } else if (this.related_query_res == null) {
        alert('please generate the related query first!')
        return
      }
      this.loading = true
      await new Promise((resolve) => {
        setTimeout(() => {
          this.qaResult = [
            {
              caption: 'a man wearing shorts is running',//'a group of short men dance with a tall attractive woman',//'a person is using a spoon to mix a dessert in a bowl',
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
                ATTRIBUTE: ['fashionable'],//['graceful'],//['hungry'],
                EFFECT: ['hats obscure vision'],//['makes new dance moves'],//['gets a spoon'],
                INTENTION: ['to be fashionable'],//['to dance'],//['to eat it'],
                NEED: ['to drive to the mechanic'],//['to like dancing'],//['to gather the ingredients'],
                REACT: ['accomplished'],//['excited'],//['happy to have soup']
              }
            }
          ]
          this.noResult = this.qaResult.length === 0
          this.MYtrans()
          this.showOutput = true
          this.loading = false
          this.en_to_zh = false
          this.show_en = true
          resolve()
        }, 2000)
      })
    },
    async search1() {
      if (this.videoSrc == null) {
        alert('please upload the video first!')
        return
      }
      this.loading = true
      await new Promise((resolve) => {
        setTimeout(() => {
          this.caption_res =
            'a man wearing shorts is running'
            //'a group of short men dance with a tall attractive woman'
          this.loading = false
          this.showOutput0 = true
          resolve()
        }, 2000)
      })
    },
    async search2() {
      if (this.caption_res == null) {
        alert('please generate the caption first！')
        return
      }
      this.loading = true;
      var video_name = this.video_name

      var idx_v = video_name.search("video")
      if(idx_v!=0){
        this.video_name = 30001;
      }
      else{
        var stop = video_name.search(".mp4")
        this.video_name = Number(video_name.substring(5,stop+1));
      }
      console.log("caption:",this.caption_res);
      console.log("video:",this.video_name);
      let res = await kbV2C(this.caption_res,this.video_name);
      console.log("kbV2C:",res);
      console.log("intention:",res.data.data.intention);
      this.qaResult[0].answers['INTENTION'] = [res.data.data.intention]
      this.qaResult[0].answers['EFFECT'] = [res.data.data.effect]
      this.qaResult[0].answers['ATTRIBUTE'] = [res.data.data.attribute]
      this.qaResult[0].answers['NEED'] = [res.data.data.need]
      this.qaResult[0].answers['REACT'] = [res.data.data.react]
      console.log("answer:",this.qaResult.answers);
      this.related_query_res = []
      for(var i=1;i<=3;i++){
        this.related_query_res[i-1] = res.data.data["query"+i]
      }
      this.showOutput1 = true
      console.log("related_query:",this.related_query_res);
      await this.MYtrans()
      this.showOutput = true
      this.loading = false
      this.seq(this.trans_res['caption']['dst'],this.trans_res.cms)
      // await new Promise((resolve) => {
      //   setTimeout(() => {
      //     this.related_query_res = [
      //       'PersonX wears shorts ',
      //       'PersonX runs fast ',
      //       'PersonX runs very fast '

      //       // 'PersonX dances with PersonX\'s friends',
      //       // 'PersonX dances to the music',
      //       // 'PersonX loves to dance'
      //     ]
      //     this.loading = false
      //     this.showOutput1 = true
      //     resolve()
      //   }, 2000)
      // })
      // await new Promise((resolve) => {
      //   this.search();
      //   resolve();
      // })
    },
    onExampleSelected(e) {
      this.query = e
    },
    async onVideoUploaded(e) {
      let file = e.target.files[0]
      this.videoSrc = URL.createObjectURL(file)
      console.log(e.target.files)
      //this.video_name = e.target.files[0].name

      await new Promise((resolve) => {
        this.loading = true
        setTimeout(() => {
          /*
          视频上传至服务器
          */
          // let res = uploadVideo(file,this.video_name)
          console.log("video start")
          let res = uploadVideo(e.target.files[0],file.name)
          console.log("video_upload:",res)
          this.caption_res =
          'a man wearing shorts is running'
            //'a group of short men dance with a tall attractive woman'

          this.loading = false
          this.showOutput0 = true
          // console.log("caption1");

          resolve()
        }, 2000)
      })
    },
    handleClick(tab, event) {
      console.log(tab.index)
      this.selected_tab = this.commonsense_tab[tab.index].tab
      console.log(this.commonsense_tab[tab.index].tab)
    },
    async seq(caption,cms){
      console.log("zh caption:",caption)
      console.log("zh cms:",cms)
      const extraction = (await infoExtraction(caption)).data.data
      console.log("extract:",extraction)
      const subject = extraction[0].values[1]
      const event = extraction[0].values[2]
      console.log("subject:",subject)
      console.log("event:",event)
      for( var item of cms){
        if (item.tab == "INTENTION"){
          await populate(event,"HasLastSubevent",item.zh)
        }
        else if (item.tab == "EFFECT"){
          await populate(event,"Causes",item.zh)
        }
        else if (item.tab == "ATTRIBUTE"){
          await populate(subject,"HasProperty",item.zh)
        }
        else if (item.tab == "NEED"){
          await populate(event,"HasPrerequisite",item.zh)
        }
        else if (item.tab == "REACT"){
          await populate(subject,"MotivatedByGoal",item.zh)
        }
      }
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

.title-container
  margin-bottom: 1em
  display: flex
  align-items: center
  justify-content: center

  .page-title
    font-size: 24px
    font-weight: 600

  .icon
    padding: .5em
    font-size: 24px

    i
      cursor: pointer

.label
  margin-bottom: .4em
  margin-top: .8em
  font-weight: 600
  text-align: left

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
    .data-cell-right-item-title
      padding: 1em
      width: 12.05%
      border: 1px solid rgb(222,226,230)
    .data-cell-right-item-content
      padding: top 1em
      width: 100%
      height: 50%
      text-align: center
      //border-top: 1px solid rgb(222,226,230)
    .data-cell-left-item
      padding: 1.5em
      width: 30%
      border: 1px solid rgb(222,226,230)
    .data-cell-left
      padding: 1em
      width: 30%
      border: 1px solid rgb(222,226,230)
    .data-cell-right
      padding: 1em
      width: 70%
      border: 1px solid rgb(222,226,230)

.empty-result
  color: rgb(150,150,150)
  font-weight: 300
  font-size: 14px

.answer-item:not(:last-child)
  margin-bottom: .3em
  text-align: center

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
      padding:1em
      //width: 600px
      height: 60px
      align-items: center
      text-align: center
      display: flex

      .fix
        //margin-right: -520px
        margin-bottom: -40px
        width: auto
        margin-top:0px
        //float:left
      .ok
        margin-right: -520px
        margin-bottom: -40px
        margin-top:0px
        width: auto
        background-color: #118ab2
        border: 0px
        &:hover
          opacity: .7
        //float:left
      .confirm
        margin-right: -100px
        margin-bottom: -40px
        //float: right
      .el-button
        //float: right

        padding: 0.5em

      .caption
        padding: 0.5em
        width: 400px
        align-items: center
        text-align: center
        border: 1px solid #e8ecf0
        font-size: 18px
        background-color: rgb(256,256,256)
        border: radius 40px
    .my-textarea1
      width: 600px
      height: 80px
      text-align: center
      //display: flex
      padding:1em
      margin:1em
      .caption
        align-items: center
        text-align: center
        border: 1px solid #e8ecf0
        font-size: 18px
        margin: 1px
        padding : 0.3em
        background-color: rgb(256,256,256)
    .generated-caption
      border-radius:10px
      border: 2px solid #c9d7e6
      background-color: #a6d7e7
      text-align:center
      padding:0.7em
      width: 40%
      color: white
      border: radius 20px
      display: inline-block
      margin: bottom 1em
      //cursor: pointer
      user-select: none
      //transition: .2s
      //text-align: left

    .submit
      background-color: $primary
      width: 40%
      color: white
      border: radius 20px
      display: inline-block
      margin: bottom 1em
      cursor: pointer
      user-select: none
      transition: .2s
      //text-align: left
      &:hover
        opacity: .7

.caption
  text-align: center
</style>
