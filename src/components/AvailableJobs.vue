<template>
  <div class="available_container">
    <el-table
      class="availableTable"
      stripe
      style="width: 100%"
      :data="tableData"
    >
      <el-table-column prop="id" label="工作编号" width="150">
      </el-table-column>
      <el-table-column prop="name" label="工作名称" width="240">
      </el-table-column>
      <el-table-column prop="reward" label="工作报酬" width="150">
      </el-table-column>
      <el-table-column prop="publishDate" label="发布日期" width="280">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">
            开始任务
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getjoball } from '@/service'

export default {
  name: 'AvailableJobs',
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    this.getJobList()
  },
  methods: {
    async getJobList() {
      const res = await getjoball()
      console.log(res.data.data)
      this.tableData = res.data.data
    },
    handleClick(row) {
      console.log(row)
      this.$router.push({
        name: 'workdesc',
        params: {
          jobId: row.id
        }
      })
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
