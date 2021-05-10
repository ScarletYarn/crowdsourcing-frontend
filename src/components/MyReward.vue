<template>
  <div class="available_container">
    <div class="total">累计赚得  ¥{{ total }} + <span style="font-weight: bold">？</span></div>
    <el-table
      class="availableTable"
      stripe
      style="width: 100%"
      :data="tableData"
    >
      <el-table-column prop="seq" label="任务编号" width="150">
      </el-table-column>
      <el-table-column prop="completeTime" label="完成时间" width="200">
      </el-table-column>
      <el-table-column prop="jobName" label="任务名称" width="280">
      </el-table-column>
      <el-table-column label="酬劳" width="200">
        <template #default="scope">
          <span>¥{{ scope.row.value }} + </span>
          <el-tooltip class="item" effect="dark" content="奖金数额需根据用户平均准确率计算所得，请您之后查看" placement="top-start">
            <span style="font-weight: bold">？</span>
<!--            <img src="../assets/问号1.png" alt="" width="20">-->
<!--            <span><i class="el-icon-question"></i></span>-->
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="status" fixed="right" label="状态">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRewardAll, queryJob } from '@/service'

export default {
  name: 'MyReward',
  data() {
    return {
      tableData: [],
      total: 0
    }
  },
  mounted() {
    this.getRewardList()
  },
  methods: {
    async getRewardList() {
      const res = await getRewardAll()
      // console.log(res.data.data)
      this.tableData = res.data.data
      this.tableData.map(async reward => {
        const job = await queryJob(reward.jobId)
        console.log(job)
        reward.jobName = job.data.data.name
        reward.seq = job.data.data.seq
        reward.value = parseFloat(job.data.data.reward / 100).toFixed(2)
        this.total += parseFloat(reward.value)
      })
      // this.handleFormat()
      // console.log(this.tableData)
    },
    handleFormat(){
      for(var i in this.tableData){
        var data = this.tableData[i]
        data.completeTime = data.completeTime.slice(0,10)
        data.value = (parseFloat(data.value)/100).toFixed(2)
      }
    }
  }
}
</script>

<style scoped>
.available_container {
  margin: 0 80px;
  padding-top: 20px;
  padding-bottom: 40px;
}

.total {
  margin-bottom: 1em;
  text-align: end;
  user-select: none;
}
</style>
