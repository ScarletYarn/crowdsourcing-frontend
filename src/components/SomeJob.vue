<template>
  <div class="workpanel">
    <div class="content">
      <i-time-indicator></i-time-indicator>
      <div class='title'>请从下列知识中选出正确且属于常识的条目：</div>
      <el-checkbox-group v-model="checkList" class='box'>
        <el-checkbox label="Pearl IsA Thing"></el-checkbox>
        <el-checkbox label="Pearl IsA ChemicalSubstance"></el-checkbox>
        <el-checkbox label="Pearl IsA ChemicalObject"></el-checkbox>
        <el-checkbox label="Pizza HasA Cheese"></el-checkbox>
        <el-checkbox label="Pizza HasA Sugar"></el-checkbox>
        <el-checkbox label="Pizza HasA Milk"></el-checkbox>
        <el-checkbox label="Repel IsA Place"></el-checkbox>
        <el-checkbox label="Repel IsA Thing"></el-checkbox>
        <el-checkbox label="Repel IsA Location"></el-checkbox>
      </el-checkbox-group>
      <el-button class='action' type='primary'>下一组</el-button>
    </div>
  </div>
</template>

<script>
import TimeIndicator from '@/components/TimeIndicator'

export default {
  name: 'SomeJob',
  components: {
    'i-time-indicator': TimeIndicator
  },
  data() {
    return {
      checkList: []
    }
  }
}
</script>

<style scoped lang='scss'>
.title {
  margin: 1em;
}
.workpanel {
  margin: 20px 100px 0 100px;
  background-color: #fff;
}
.content {
  padding: 0 18px;
}

.box {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding-left: 3em;

  label {
    margin: .3em;
  }
}

.action {
  margin: 1em;
}
</style>
