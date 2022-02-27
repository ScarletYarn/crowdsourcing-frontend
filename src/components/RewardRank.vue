<template>
  <div class="rewardbank_container">
    <div class="rewardRule">
      <span>酬劳计算规则：</span>
      <div style="padding-top: 1em">
        薪酬由两部分组成，一部分是您的任务正确率乘以金额总数。另一部分，如果您的准确率高于其他所有用户的平均准确率，将会按
        您的准确率与其他所有用户的平均准确率之差除以100%正确率（任务全部正确完成时）与其他所有用户的平均准确率之差
        的比例 乘以最大奖励额度，计算奖励金额；否则奖励0元。
      </div>
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

<style scoped>
.rewardbank_container {
  box-sizing: border-box;
  width: 100%;
  padding: 2em 10%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /*align-items: center;*/
}
.rewardRule {
  width: 42%;
  /*padding-right: 90px;*/
  text-align: left;
  /*letter-spacing: 3px;*/
  /*line-height: 20px;*/
}
.rewardBank {
  width: 45%;
}
</style>
