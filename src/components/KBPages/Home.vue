<template>
  <div class="page-body">
    <div class="main-section">
      <el-input
        placeholder="输入词条搜索"
        suffix-icon="el-icon-search"
        v-model="search"
      >
      </el-input>
      <div class="hint">例：人工智能、大学</div>
    </div>
  </div>
</template>

<script>
import GStoreClient from 'gstore-whu'

export default {
  name: 'Home',
  async mounted() {
    const client = new GStoreClient(
      'root',
      '123456',
      'http://192.168.10.174:9000'
    )
    const result = await client.query(
      'cskg',
      'select ?x where { <早睡早起> <MotivatedByGoal> ?x. }'
    )
    console.log(result)
  },
  data() {
    return {
      search: ''
    }
  }
}
</script>

<style scoped lang="sass">
.page-body
  background-color: rgba(177, 147, 147, .17)
  width: 100%
  height: 100%
  padding-top: 15%
  box-sizing: border-box

.main-section
  width: 65%
  position: relative
  margin: 0 auto

.hint
  margin-top: 1em
  text-align: start
  text-indent: 1em
  color: rgb(111, 99, 99)
  font-size: 14px
</style>
