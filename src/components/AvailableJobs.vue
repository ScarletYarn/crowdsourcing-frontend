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
          <el-popover placement="right" :width="400" trigger="hover">
            <template #reference>
              <span style="color: blue"> (查看规则)</span>
            </template>
            <p>
              薪酬由基础工资和奖励两部分组成，一部分是您的任务正确率乘以金额总数。另一部分，如果您的准确率
              <img
                src="../assets/formula/1.svg"
                alt="formula-1"
              />高于其他所有用户的平均准确率<img
                src="../assets/formula/2.svg"
                alt="formula-2"
              />，您将会得到最大奖励金额乘以<img
                src="../assets/formula/3.svg"
                alt="formula-3"
                style="height: 2.5em"
              />，否则奖励0元。
            </p>
          </el-popover>
        </template>
        <template #default="scope">
          <span
            >基础工资：{{ scope.row.reward }} ，奖励金额：{{
              scope.row.bonus
            }}</span
          >
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
            v-show="!scope.row.completed"
          >
            开始任务
          </el-button>
          <el-tag v-show="scope.row.completed" type="info" effect="dark">
            已完成
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getjoball,
  getJobComplete,
  getJobStatus,
  getRewardAll
} from '@/service'

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
        return 'background:#bbb;'
      } else {
        return 'background:#fff'
      }
    },
    async getJobList() {
      const res = await getjoball()
      this.tableData = res.data.data
      await this.handleFormat()
      await this.handleStatus()
    },
    async handleStatus() {
      for (let i in this.tableData) {
        let data = this.tableData[i]
        const res = await getJobComplete(data.id)
        data.completed = res.data.data
        if (res.data.data === true) {
          this.completeSeq.push(data.seq)
        }
      }
    },
    async handleFormat() {
      const res = await getRewardAll()
      const rewardData = res.data.data
      for (let i in this.tableData) {
        let data = this.tableData[i]
        data.publishDate = data.publishDate.slice(0, 10)
        data.reward = '¥' + (parseFloat(rewardData[i].basic) / 100).toFixed(2)
        data.bonus = '¥' + (parseFloat(rewardData[i].bonus) / 100).toFixed(2)
      }
    },
    async handleClick(row) {
      if (row.seq === 1) {
        const jobStatus = await getJobStatus(row.id)
        if (jobStatus.data.data !== -1) {
          await this.$router.push({
            name: 'workdo1',
            params: {
              jobId: row.id
            }
          })
        } else {
          await this.$router.push({
            name: 'workdesc1',
            params: {
              jobId: row.id
            }
          })
        }
      } else if (row.seq === 2) {
        await this.$router.push({
          name: 'workdesc2',
          params: {
            jobId: row.id
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="sass">
.available_container
  margin: 0 80px
  padding-top: 20px
  padding-bottom: 40px

img
  height: 16px
  vertical-align: text-bottom
</style>
