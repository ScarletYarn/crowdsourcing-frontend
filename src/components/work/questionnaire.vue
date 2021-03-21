<template>
  <div class="workpanel">
    <div class="content">
      <div class="title">
        <span>问卷调查</span>
      </div>
      <div class="infos">
        <div class="question">
          <el-form ref="form" :model="form" :rules="rules" label-width="130px">
            <el-form-item label="姓名" prop="name">
              <el-input style="width: 65%" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-select v-model="form.age" placeholder="请选择年龄阶段">
                <el-option label="<请选择>" value="none"></el-option>
                <el-option label="7-12岁" value="7_12"></el-option>
                <el-option label="13-18岁" value="13_18"></el-option>
                <el-option label="19-23岁" value="19_23"></el-option>
                <el-option label="24-30岁" value="24_30"></el-option>
                <el-option label="31-40岁" value="31_40"></el-option>
                <el-option label="41-50岁" value="41_50"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学历" prop="education">
              <el-select v-model="form.education" placeholder="请选择最高学历">
                <el-option label="<请选择>" value="none"></el-option>
                <el-option label="高中" value="senior"></el-option>
                <el-option label="大学" value="college"></el-option>
                <el-option label="硕士研究生" value="master"></el-option>
                <el-option label="博士" value="phd"></el-option>
                <el-option label="博士后" value="postdoctor"></el-option>
              </el-select>
            </el-form-item>
            <p>您对知识图谱中规则的了解程度是?</p>
            <el-form-item prop="kg">
              <el-select v-model="form.kg" placeholder="请选择1~5分">
                <el-option label="<请选择>" value="0"></el-option>
                <el-option label="5分（非常了解）" value="5"></el-option>
                <el-option label="4分" value="4"></el-option>
                <el-option label="3分" value="3"></el-option>
                <el-option label="2分" value="2"></el-option>
                <el-option label="1分（完全不了解）" value="1"></el-option>
              </el-select>
            </el-form-item>
            <p>请根据您的实际情况选择最符合您的一项</p>
            <el-form-item label="外向的，热情的">
              <el-rate
                v-model="form.rating[0]"
                show-text
                :texts="texts"
                :max="max"
              >
              </el-rate>
            </el-form-item>
            <el-form-item label="挑剔的，爱争吵的">
              <el-rate
                v-model="form.rating[1]"
                show-text
                :texts="texts"
                :max="max"
              >
              </el-rate>
            </el-form-item>
            <el-form-item label="可靠的，自律的">
              <el-rate
                v-model="form.rating[2]"
                show-text
                :texts="texts"
                :max="max"
              >
              </el-rate>
            </el-form-item>
            <el-form-item label="易焦虑，易心烦">
              <el-rate
                v-model="form.rating[3]"
                show-text
                :texts="texts"
                :max="max"
              >
              </el-rate>
            </el-form-item>
            <el-form-item label="乐于体验新鲜事物，有好奇心的">
              <el-rate
                v-model="form.rating[4]"
                show-text
                :texts="texts"
                :max="max"
              >
              </el-rate>
            </el-form-item>
            <el-form-item label="保守的，安静的">
              <el-rate
                v-model="form.rating[5]"
                show-text
                :texts="texts"
                :max="max"
              >
              </el-rate>
            </el-form-item>
            <el-form-item label="有同情心，温暖的">
              <el-rate
                v-model="form.rating[6]"
                show-text
                :texts="texts"
                :max="max"
              >
              </el-rate>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="action">
        <el-button type="primary" @click="finishQues">完成问卷</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessageBox } from 'element-plus'
import { insertQuestionnaire } from '@/service'

export default {
  name: 'questionnaire',
  mounted() {
    if (process.env.NODE_ENV === 'dev') {
      this.form = {
        name: '张三',
        age: '24-30岁',
        gender: '男',
        kg: '5分（非常了解）',
        education: '大学',
        rating: [3, 4, 3, 4, 3, 4, 5]
      }
    }
  },
  data() {
    const checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('姓名不能为空'))
      } else callback()
    }

    const checkGender = (rule, value, callback) => {
      if (!value) {
        callback(new Error('性别不能为空'))
      } else callback()
    }

    const checkAge = (rule, value, callback) => {
      if (value === 'none') {
        callback(new Error('年龄不能为空'))
      } else callback()
    }

    const checkKg = (rule, value, callback) => {
      if (value === '0') {
        callback(new Error('请输入对知识图谱的理解'))
      } else callback()
    }

    const checkEducation = (rule, value, callback) => {
      if (value === 'none') {
        callback(new Error('请输入教育背景'))
      } else callback()
    }

    return {
      form: {
        name: '',
        age: 'none',
        gender: '',
        kg: '0',
        education: 'none',
        rating: [0, 0, 0, 0, 0, 0, 0]
      },
      rules: {
        name: {
          validator: checkName,
          trigger: 'blur'
        },
        gender: {
          validator: checkGender,
          trigger: 'blur'
        },
        age: {
          validator: checkAge,
          trigger: 'blur'
        },
        kg: {
          validator: checkKg,
          trigger: 'blur'
        },
        education: {
          validator: checkEducation,
          trigger: 'blur'
        }
      },
      max: 7,
      texts: [
        '非常不同意',
        '不同意',
        '基本不同意',
        '中立',
        '基本同意',
        '同意',
        '非常同意'
      ]
    }
  },
  methods: {
    async finishQues() {
      if (this.form.rating.indexOf(0) !== -1) {
        await ElMessageBox({
          type: 'info',
          message: '请完成打分'
        })
        return
      }
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const res = await insertQuestionnaire(
            this.form.name,
            this.form.age,
            this.form.gender,
            this.form.kg,
            this.form.education,
            this.form.rating.toString()
          )
          if (res.data.data) {
            await this.$router.push({
              name: 'workdo',
              params: {
                jobId: this.$route.params.jobId
              }
            })
          } else {
            await ElMessageBox({
              type: 'info',
              message: '问卷提交失败'
            })
          }
        } else {
          await ElMessageBox({
            type: 'info',
            message: '请检查未完成项'
          })
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.workpanel {
  position: relative;
  width: 70%;
  margin: 2em auto;
  background-color: #fff;
}
.content {
  height: 100%;
  padding: 0 18px;
}
.title {
  padding-top: 30px;
  margin-bottom: 1em;
}
.title span {
  font-size: 28px;
  color: #4a4a4a;
  font-weight: 700;
}
.infos {
  width: 100%;
  text-align: left;
  border-top: 1px solid hsla(0, 0%, 59%, 0.2);
  border-bottom: 1px solid hsla(0, 0%, 59%, 0.2);
}
.question {
  margin: 2em auto;
  width: 60%;
  position: relative;
}
.question p {
  padding-left: 130px;
}
.action {
  margin-top: 60px;
  text-align: center;
  font-size: 15px;
  padding-bottom: 60px;
  position: relative;
}
.el-rate {
  margin-top: 10px;
}
.el-rate__icon {
  margin-right: 28px !important;
}
</style>
