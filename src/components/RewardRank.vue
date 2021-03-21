<template>
  <div class="rewardbank_container">
    <div class="rewardRule">
      酬劳计算规则：
    </div>
    <div class="rewardBank">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="用户名" width="150">
        </el-table-column>
        <el-table-column prop="reward" label="酬金" width="250">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getRank } from '@/service'

export default {
  name: 'RewardRank',
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    this.getRank()
  },
  methods: {
    async getRank() {
      const res = await getRank()
      this.tableData = res.data.data
      this.tableData.map(e => {
        e.reward = '¥' + e.reward
      })
      console.log(this.tableData)
    }
  }
}
</script>

<style scoped lang="sass">
.rewardbank_container
  box-sizing: border-box
  width: 100%
  padding: 2em 10%
  display: flex
  flex-direction: row
  justify-content: space-between
  align-items: center
</style>
