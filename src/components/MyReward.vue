<template>
  <div class="available_container">
    <div class="total">累计赚得{{ total }}元</div>
    <el-table
      class="availableTable"
      stripe
      style="width: 100%"
      :data="tableData"
    >
      <el-table-column prop="jobId" label="任务编号" width="100">
      </el-table-column>
      <el-table-column prop="completeTime" label="完成时间" width="210">
      </el-table-column>
      <el-table-column prop="jobName" label="任务名称" width="300">
      </el-table-column>
      <el-table-column prop="value" label="酬劳" width="150"> </el-table-column>
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
      console.log(res.data.data)
      this.tableData = res.data.data
      this.tableData.map(async reward => {
        const job = await queryJob(reward.jobId)
        reward.jobName = job.data.data.name
        this.total += reward.value
      })
      console.log(this.tableData)
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
