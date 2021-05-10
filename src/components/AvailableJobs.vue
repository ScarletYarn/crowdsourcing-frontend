<template>
  <div class="available_container">
    <el-table :data="tableData" :row-style="columnStyle">
      <el-table-column prop="seq" label="工作编号" width="150">
      </el-table-column>
      <el-table-column prop="name" label="工作名称" width="240">
      </el-table-column>
      <el-table-column width="200">
        <template #header>
          工作报酬
          <el-popover
              placement="right"
              :width="400"
              trigger="hover"
          >
            <template #reference>
              <span style="color: blue"> (查看规则)</span>
            </template>
            <p>薪酬由基础工资和资历两部分组成，一部分是您的任务正确率乘以金额总数。另一部分，如果您的准确率<img src="../assets/formula1.png" alt="" width="20">高于其他所有用户的平均准确率<img src="../assets/formula2.png" alt="" width="30">，您将会得到最大奖励金额乘以<img src="../assets/formula3.png" alt="" width="75">，否则奖励0元。</p>
          </el-popover>
        </template>
        <template #default="scope">
          <span>基础工资：{{ scope.row.reward }} ，资历金额：待算</span>
        </template>
      </el-table-column>
      <el-table-column prop="publishDate" label="发布日期" width="230">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button
            @click="handleClick(scope.row)"
            type="text"
            size="small"
            v-show="isActionShow"
          >
            开始任务
          </el-button>
          <el-tag v-show="!isActionShow" type="info" effect="dark">
            已完成
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getjoball, getJobComplete, getJobStatus } from '@/service'

export default {
  name: 'AvailableJobs',
  data() {
    return {
      isActionShow: true,
      completeSeq: [],
      tableData: []
    }
  },
  mounted() {
    this.getJobList()
  },
  methods: {
    columnStyle({ rowIndex }) {
      if (!this.completeSeq.indexOf(rowIndex + 1)) {
        console.log('haha')
        this.isActionShow = false
        return 'background:#bbb;'
      } else {
        return 'background:#fff'
      }
    },
    async getJobList() {
      const res = await getjoball()
      this.tableData = res.data.data
      this.handleFormat()
      await this.handleStatus()
    },
    async handleStatus() {
      for (var i in this.tableData) {
        var data = this.tableData[i]
        const res = await getJobComplete(data.id)
        console.log(res)
        if (res.data.data === true) {
          this.completeSeq.push(data.seq)
        }
      }
    },
    handleFormat() {
      var i
      for (i in this.tableData) {
        var data = this.tableData[i]
        data.publishDate = data.publishDate.slice(0, 10)
        data.reward = '¥' + (parseFloat(data.reward) / 100).toFixed(2)
      }
    },
    async handleClick(row) {
      const jobStatus = await getJobStatus(row.id)
      if (jobStatus.data.data !== -1) {
        await this.$router.push({
          name: 'workdo',
          params: {
            jobId: row.id
          }
        })
      } else {
        await this.$router.push({
          name: 'workdesc',
          params: {
            jobId: row.id
          }
        })
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
</style>
