<template>
  <div class="page-body">
    <div class="main-section">
      <el-input
        placeholder="输入词条搜索"
        suffix-icon="el-icon-search"
        v-model="search"
        @keyup.enter="q()"
      >
      </el-input>
      <div class="hint">例：人工智能、大学</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      search: ''
    }
  },
  methods: {
    async q() {
      await this.$router.push({
        name: 'entity',
        params: {
          entity: this.search
        }
      })
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
