<template>
  <div class="workpanel">
    <div class="content"  style="text-align: left; padding-top: 40px;">
      <span>恭喜您！您已完成全部题目作答</span>
      <div class="infos">
        <div class="block">
          <p>您本次的回答情况如下：</p>
          <span>总准确率为：80%</span>
          <el-table
              :data="checkData1"
              border
              style="width: 100%">
            <el-table-column
                prop="1"
                label="1"
                width="100">
            </el-table-column>
            <el-table-column
                prop="2"
                label="2"
                width="100">
            </el-table-column>
            <el-table-column
                prop="3"
                label="3"
                width="100">
            </el-table-column>
            <el-table-column
                prop="4"
                label="4"
                width="100">
            </el-table-column>
            <el-table-column
                prop="5"
                label="5"
                width="100">
            </el-table-column>
            <el-table-column
                prop="6"
                label="6"
                width="100">
            </el-table-column>
            <el-table-column
                prop="7"
                label="7"
                width="100">
            </el-table-column>
            <el-table-column
                prop="8"
                label="8"
                width="100">
            </el-table-column>
            <el-table-column
                prop="9"
                label="9"
                width="100">
            </el-table-column>
            <el-table-column
                prop="10"
                label="10"
                >
            </el-table-column>
          </el-table>

          <el-table
              :data="checkData2"
              border
              style="width: 100%">
            <el-table-column
                prop="11"
                label="11"
                width="100">
            </el-table-column>
            <el-table-column
                prop="12"
                label="12"
                width="100">
            </el-table-column>
            <el-table-column
                prop="13"
                label="13"
                width="100">
            </el-table-column>
            <el-table-column
                prop="14"
                label="14"
                width="100">
            </el-table-column>
            <el-table-column
                prop="15"
                label="15"
                width="100">
            </el-table-column>
            <el-table-column
                prop="16"
                label="16"
                width="100">
            </el-table-column>
            <el-table-column
                prop="17"
                label="17"
                width="100">
            </el-table-column>
            <el-table-column
                prop="18"
                label="18"
                width="100">
            </el-table-column>
            <el-table-column
                prop="19"
                label="19"
                width="100">
            </el-table-column>
            <el-table-column
                prop="20"
                label="20"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="action">
        <!--        <el-pagination-->
        <!--            background-->
        <!--            :current-page="queryInfo.pagenum"-->
        <!--            :page-size="queryInfo.pagesize"-->
        <!--            layout="prev,  next"-->
        <!--            :total=total>-->
        <!--        </el-pagination>-->
        <el-button type="primary" @click="prevRule">上一题</el-button>
        <el-button type="primary" @click="nextRule" :disabled="disabled">
          完成
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getRules, qRule } from '@/service'

export default {
  name: 'workDo',

  async mounted() {
    this.$refs['indicator'].initiate()
    const jobId = this.$route.params.jobId
    const ruleIdList = await getRules(jobId)
    this.ruleIdList = ruleIdList.data.data
    await this.getCurrentRule()
  },
  data() {
    return {
      checkData1: [{
        1: '×',
        2: '√',
        3: '√',
        4: '√',
        5: '√',
        6: '×',
        7: '√',
        8: '√',
        9: '×',
        10: '√',
      }],
      checkData2: [{
        11: '×',
        12: '√',
        13: '√',
        14: '√',
        15: '×',
        16: '×',
        17: '√',
        18: '√',
        19: '×',
        20: '√',
      }]
    }
  },
  methods: {
    async getCurrentRule() {
      const ruleData = await qRule(this.ruleIdList[this.ruleIndex])
      console.log(ruleData.data.data)
    },
    getRules() {
      console.log('wait..')
    },
    changeButton() {
      this.disabled = false
    },
    prevRule() {
      if (this.ruleIndex === 0) return
      this.ruleIndex--
      this.getCurrentRule()
    },
    nextRule() {
      if (this.ruleIndex === this.ruleIdList.length) return
      this.ruleIndex++
      this.getCurrentRule()
    }
  }
}
</script>

<style scoped>
.workpanel {
  margin: 20px 100px 0 100px;
  background-color: #fff;
}
.content {
  padding: 0 60px;
}
.title {
  padding-top: 30px;
}
.title span {
  font-size: 28px;
  color: #4a4a4a;
  font-weight: 700;
}
.infos {
  width: 1100px;
  margin-top: 10px;
  text-align: left;
  padding-top: 30px;
  padding-bottom: 50px;
  border-top: 1px solid hsla(0, 0%, 59%, 0.2);
  border-bottom: 1px solid hsla(0, 0%, 59%, 0.2);
}
.infos .rule {
  text-align: center;
}

.ruleExp {
  position: relative;
  height: 240px;
}
.left {
  position: absolute;
  top: 50%;
}
.right {
  position: absolute;
  top: 50%;
  right: 0;
}
.ruleExpContent {
  padding: 20px 120px;
}
.el-rate {
  margin-top: 30px;
  font-size: large;
}
.action {
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
.block {
  width: 100%;
  box-sizing: border-box;
  padding: 0 40px;
}
.demonstration {
  padding-left: 80px;
}
/*.el-carousel__item:nth-child(2n) {*/
/*  background-color: #99a9bf;*/
/*}*/

/*.el-carousel__item:nth-child(2n+1) {*/
/*  background-color: #d3dce6;*/
/*}*/
.explain {
  padding: 20px 80px;
}
.answer {
  text-align: left;
  padding-left: 240px;
}
</style>
