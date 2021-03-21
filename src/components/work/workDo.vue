<template>
  <div class="workpanel">
    <div class="content">
      <div class="title">
        <span>做题时间 | 23：39</span>
      </div>
<!--      <div class="infos">-->
<!--        <p class="rule">规则：国籍(A,v0) & 简称(v0,v1) & 出生地(B,v0) =>配偶(A,B)</p>-->
<!--        <div class="ruleExp">-->
<!--          <div class="left" @click="left"><img src="../../assets/img/left.png" alt=""></div>-->
<!--          <div class="right" @click="right"><img src="../../assets/img/right.png" alt=""></div>-->
<!--          <div class="ruleExpContent">-->
<!--            <span>请您对这种谓词逻辑形式呈现下规则的理解程度打1~5颗星。1星代表不能理解，5星代表完全理解。完成后请右翻查看规则3种解释：</span>-->
<!--            <el-rate v-model="value1"></el-rate>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
      <div class="infos">
        <div class="block">
          <p class="rule">规则：{{rules[0]}}</p>
          <span class="demonstration">规则解释</span>
          <el-carousel trigger="click" height="350px" :autoplay="false" arrow="always">
            <el-carousel-item>
              <div class="explain">
                <p>请您对这种谓词逻辑形式呈现下规则的理解程度打1~5颗星。1星代表不能理解，5星代表完全理解。完成后请右翻查看规则3种解释：</p>
                <el-rate v-model="scores.noexp"></el-rate>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="explain">
                <p>引用实例：</p>
                <h2>国籍(孙中山,中华人民共和国) & 简称(中华人民共和国,中国) & 出生地(宋庆龄,中华人民共和国) =>配偶(孙中山,宋庆龄)
                </h2>
                <p>请对实例解释方式对您理解规则的帮助程度打分，分数越高表示这种方式越能辅助理解：</p>
                <el-rate v-model="scores.ins"></el-rate>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="explain">
                <p>引用自然语言：</p>
                <h2>A国籍的为v0，v0的简称是v1，B的出生地是v0，那么得出A的配偶是B。
                </h2>
                <p>请对实例解释方式对您理解规则的帮助程度打分，分数越高表示这种方式越能辅助理解：</p>
                <el-rate v-model="scores.nl"></el-rate>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="explain">
                <p>引用知识图谱：</p>
                <img src="../../assets/img/kgdemo.png" alt="">
                <p>请对实例解释方式对您理解规则的帮助程度打分，分数越高表示这种方式越能辅助理解：</p>
                <el-rate v-model="scores.kg"></el-rate>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="answer">
        <p>通过对规则的理解后，请判断规则是否正确。</p>
        <el-radio v-model="answer" label=true @click="changeButton">正确</el-radio>
        <el-radio v-model="answer" label=false @click="changeButton">错误</el-radio>
      </div>
      <div class="action">
<!--        <el-pagination-->
<!--            background-->
<!--            :current-page="queryInfo.pagenum"-->
<!--            :page-size="queryInfo.pagesize"-->
<!--            layout="prev,  next"-->
<!--            :total=total>-->
<!--        </el-pagination>-->
        <el-button type="primary" @click="prepques" disabled>上一题</el-button>
        <el-button type="primary" @click="nextques" :disabled="disabled">下一题</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "workDo",
  data(){
    return{
      rulelist:[{
        rule:'国籍(A,v0) & 简称(v0,v1) & 出生地(B,v0) =>配偶(A,B)',
        answer: false,
      }, {
        rule: '结婚(v0,A) & 母亲(v0,B) => 父亲(A,B)',
        answer: true,
      }],
      rules:['国籍(A,v0) & 简称(v0,v1) & 出生地(B,v0) =>配偶(A,B)','结婚(v0,A) & 母亲(v0,B) => 父亲(A,B)'],
      total:4,
      queryInfo:{
        pagenum:1,
        pagesize:1,
      },
      answer: '',
      disabled:true,
      scores:{
        noexp:0,
        ins:0,
        nl:0,
        kg:0
      }
    }
  },
  methods:{
    getRules(){
      console.log('wait..')
    },
    changeButton(){
      this.disabled = false;
    },
    nextques(){
      this.$router.push("check")
    }
  }
}
</script>

<style scoped>
.workpanel{
  margin: 20px 100px 0 100px;
  height: 100%;
  background-color: #fff;
}
.content{
  height: 100%;
  padding: 0 18px;
}
.title{
  padding-top: 30px;
}
.title span{
  font-size: 28px;
  color: #4a4a4a;
  font-weight: 700;
}
.infos{
  margin: auto;
  width: 1100px;
  height: 400px;
  margin-top: 30px;
  text-align: left;
  overflow: hidden;
  padding-top: 30px;
  padding-bottom: 10px;
  border-top: 1px solid hsla(0,0%,59%,.2);
  border-bottom: 1px solid hsla(0,0%,59%,.2);
}
.infos .rule{
  text-align: center;
}

.ruleExp{
  position: relative;
  height: 240px;
}
.left{
  position: absolute;
  top: 50%;
}
.right{
  position: absolute;
  top: 50%;
  right: 0;
}
.ruleExpContent{
  padding: 20px 120px;
}
.el-rate{
  margin-top: 30px;
  font-size: large;

}
.action{
  margin-top: 60px;
  text-align: center;
  font-size: 15px;
  padding-bottom: 60px;
  position: relative;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}
.block{
  padding: 0 40px;
}
.demonstration{
  padding-left: 80px;
}
/*.el-carousel__item:nth-child(2n) {*/
/*  background-color: #99a9bf;*/
/*}*/

/*.el-carousel__item:nth-child(2n+1) {*/
/*  background-color: #d3dce6;*/
/*}*/
.explain{
  padding: 20px 80px;
}
.answer{
  text-align: left;
  padding-left: 240px;
}
</style>