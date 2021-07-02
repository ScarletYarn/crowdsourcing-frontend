<template>
  <div class="page-body">
    <div class="header-section">
      <div class="title-container">
        <div class="title">人工智能——HasA</div>
      </div>
      <div class="relative">共检索到100条记录</div>
      <div class="link">API：https://xxx.xxx.xxx/api/getEntity?eid=1</div>
    </div>
    <div class="body-section">
      <div class="item-container">
        <div v-for="n in 10" :key="n" class="item">
          <div class="head">人工智能</div>
          <div class="relation">HasA</div>
          <div class="tail">人工智能</div>
        </div>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Relationship'
}
</script>

<style scoped lang="sass">
.page-body
  width: 100%
  height: 100%
  box-sizing: border-box
  padding: 2em 5%
  background-color: rgba(177, 147, 147, .17)
  overflow-y: scroll

.header-section
  margin-bottom: 16px

.header-section, .body-section
  border: 1px solid rgb(187, 187, 187)
  background-color: #ffffff

.title-container
  display: flex
  flex-direction: row
  align-items: center

  .title
    font-size: 32px
    margin: .5em .5em .5em .8em

.relative, .link
  text-align: start
  margin-left: 26px

.relative
  color: rgba(111, 99, 99, 1)
  font-size: 16px

.link
  color: rgba(111, 99, 99, 1)
  font-size: 12px
  margin-top: 1em
  margin-bottom: 2em

.body-section
  box-sizing: border-box
  padding: 2em 2em .5em 2em
  margin-bottom: 3em

  .item-container
    display: flex
    flex-wrap: wrap
    margin-bottom: 1em

  .item
    display: flex
    flex-direction: row
    align-items: center
    width: 50%
    margin: 1em auto
    text-indent: 1em
    color: #6F6363

    .relation
      font-weight: 600
      color: #000000
</style>
