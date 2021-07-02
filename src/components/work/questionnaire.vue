<template>
  <div class="workpanel">
    <div class="content">
      <div class="title">
        <span>问卷调查</span>
      </div>
      <div class="infos">
        <div class="question">
          <el-form ref="form" :model="form" :rules="rules" label-width="0">
            <el-form-item prop="name">
              <span>1. 您的姓名是</span><br />
              <el-input style="width: 24%" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item prop="gender">
              <span>2. 您的性别是</span><br />
              <el-radio-group v-model="form.gender">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="age">
              <span>3. 您的年龄是</span><br />
              <el-input style="width: 20%" v-model="form.age"></el-input>
            </el-form-item>
            <el-form-item prop="education">
              <span>4. 您的学历是</span><br />
              <el-select v-model="form.education" placeholder="请选择最高学历">
                <el-option label="<请选择>" value="none"></el-option>
                <el-option label="高中" value="senior"></el-option>
                <el-option label="大专" value="juniorCollege"></el-option>
                <el-option label="本科" value="college"></el-option>
                <el-option label="硕士研究生" value="master"></el-option>
                <el-option label="博士" value="phd"></el-option>
                <el-option label="其他" value="else"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="kg">
              <span>5. 您对知识图谱中规则的了解程度是?</span><br />
              <el-select v-model="form.kg" placeholder="请选择1~5分">
                <el-option label="<请选择>" value="0"></el-option>
                <el-option label="5分（非常了解）" value="5"></el-option>
                <el-option label="4分" value="4"></el-option>
                <el-option label="3分" value="3"></el-option>
                <el-option label="2分" value="2"></el-option>
                <el-option label="1分（完全不了解）" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="logic">
              <span>6. 您对谓词逻辑形式的了解程度是?</span><br />
              <el-select v-model="form.logic" placeholder="请选择1~5分">
                <el-option label="<请选择>" value="0"></el-option>
                <el-option label="5分（非常了解）" value="5"></el-option>
                <el-option label="4分" value="4"></el-option>
                <el-option label="3分" value="3"></el-option>
                <el-option label="2分" value="2"></el-option>
                <el-option label="1分（完全不了解）" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <span>7. 请问您经常关注或具备哪些领域知识？</span><br />
              <el-cascader
                v-model="form.field"
                :options="options"
                :props="{
                  multiple: true
                }"
              ></el-cascader>
            </el-form-item>
            <el-form-item>
              <el-form
                ref="personalityForm"
                :model="personalityForm"
                label-width="210px"
                label-position="left"
              >
                <span>8. 请根据您的实际情况选择最符合您的一项</span>
                <el-form-item label="外向的，热情的">
                  <el-rate
                    v-model="personalityForm.rating[0]"
                    show-text
                    :texts="texts"
                    :max="max"
                  >
                  </el-rate>
                </el-form-item>
                <el-form-item label="挑剔的，爱争吵的">
                  <el-rate
                    v-model="personalityForm.rating[1]"
                    show-text
                    :texts="texts"
                    :max="max"
                  >
                  </el-rate>
                </el-form-item>
                <el-form-item label="可靠的，自律的">
                  <el-rate
                    v-model="personalityForm.rating[2]"
                    show-text
                    :texts="texts"
                    :max="max"
                  >
                  </el-rate>
                </el-form-item>
                <el-form-item label="易焦虑，易心烦">
                  <el-rate
                    v-model="personalityForm.rating[3]"
                    show-text
                    :texts="texts"
                    :max="max"
                  >
                  </el-rate>
                </el-form-item>
                <el-form-item label="乐于体验新鲜事物，有好奇心的">
                  <el-rate
                    v-model="personalityForm.rating[4]"
                    show-text
                    :texts="texts"
                    :max="max"
                  >
                  </el-rate>
                </el-form-item>
                <el-form-item label="保守的，安静的">
                  <el-rate
                    v-model="personalityForm.rating[5]"
                    show-text
                    :texts="texts"
                    :max="max"
                  >
                  </el-rate>
                </el-form-item>
                <el-form-item label="有同情心，温暖的">
                  <el-rate
                    v-model="personalityForm.rating[6]"
                    show-text
                    :texts="texts"
                    :max="max"
                  >
                  </el-rate>
                </el-form-item>
                <el-form-item label="没条理，粗心的">
                  <el-rate
                    v-model="personalityForm.rating[7]"
                    show-text
                    :texts="texts"
                    :max="max"
                  >
                  </el-rate>
                </el-form-item>
                <el-form-item label="冷静，情绪稳定的">
                  <el-rate
                    v-model="personalityForm.rating[8]"
                    show-text
                    :texts="texts"
                    :max="max"
                  >
                  </el-rate>
                </el-form-item>
                <el-form-item label="传统的，无创造性的">
                  <el-rate
                    v-model="personalityForm.rating[9]"
                    show-text
                    :texts="texts"
                    :max="max"
                  >
                  </el-rate>
                </el-form-item>
              </el-form>
            </el-form-item>
            <el-form-item>
              <el-form
                ref="vvq"
                :model="vvqForm"
                label-position="left"
                label-width="440px"
              >
                <span>9. 认知风格调查</span>
                <el-form-item label="(1) 我喜欢做需要文字的工作">
                  <el-radio-group v-model="vvqForm.yon[0]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="(2) 我的白日梦有时是如此生动，我觉得好像我真的经历了场景"
                >
                  <el-radio-group v-model="vvqForm.yon[1]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="(3) 我喜欢学习新单词">
                  <el-radio-group v-model="vvqForm.yon[2]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="(4) 我能很容易地想出单词的同义词">
                  <el-radio-group v-model="vvqForm.yon[3]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="(5) 我的想象力比一般人强">
                  <el-radio-group v-model="vvqForm.yon[4]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="(6) 我很少做梦">
                  <el-radio-group v-model="vvqForm.yon[5]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="(7) 我读的很慢">
                  <el-radio-group v-model="vvqForm.yon[6]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="(8) 当我闭上眼睛时，我无法在脑海中想象出一个朋友的脸"
                >
                  <el-radio-group v-model="vvqForm.yon[7]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="(9) 我不相信任何人可以用脑海中的画面来思考"
                >
                  <el-radio-group v-model="vvqForm.yon[8]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="(10) 我更喜欢阅读关于做某事的说明，而不是让别人告诉我"
                >
                  <el-radio-group v-model="vvqForm.yon[9]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="(11) 我的梦非常生动">
                  <el-radio-group v-model="vvqForm.yon[10]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="(12) 我的用词比一般人流利">
                  <el-radio-group v-model="vvqForm.yon[11]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="(13) 我的白日梦很模糊">
                  <el-radio-group v-model="vvqForm.yon[12]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="(14) 我很少花时间去增加我的词汇量">
                  <el-radio-group v-model="vvqForm.yon[13]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="(15) 我的思维通常由脑海中的画面或图像组成">
                  <el-radio-group v-model="vvqForm.yon[14]">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="action">
        <el-button type="primary" @click="finishQues"
          >完成问卷，即将进入具体任务</el-button
        >
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
        age: '24',
        gender: '男',
        kg: '5分（非常了解）',
        logic: '5分（非常了解）',
        education: '硕士研究生'
      }
      this.personalityForm = {
        rating: [3, 4, 3, 4, 3, 4, 5, 3, 4, 5]
      }
      this.vvqForm = {
        yon: [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false
        ]
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
        age: '',
        gender: '',
        kg: '0',
        logic: '0',
        education: 'none',
        field: []
      },
      personalityForm: {
        rating: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      vvqForm: {
        yon: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
      ],
      options: [
        {
          value: 'xuekechangshi',
          label: '学科常识',
          children: [
            {
              value: 'jiaochakexue',
              label: '交叉科学'
            },
            {
              value: 'renwenkexue',
              label: '人文科学',
              children: [
                {
                  value: 'wenxue',
                  label: '文学'
                },
                {
                  value: 'lishi',
                  label: '历史'
                },
                {
                  value: 'zhexue',
                  label: '哲学'
                },
                {
                  value: 'renwenkexue_qita',
                  label: '其他'
                }
              ]
            },
            {
              value: 'zirankexue',
              label: '自然科学',
              children: [
                {
                  value: 'dili',
                  label: '地理'
                },
                {
                  value: 'shengwu',
                  label: '生物'
                },
                {
                  value: 'huaxue',
                  label: '化学'
                },
                {
                  value: 'wuli',
                  label: '物理'
                },
                {
                  value: 'tianwen',
                  label: '天文'
                },
                {
                  value: 'yixue',
                  label: '医学'
                },
                {
                  value: 'zirankexue_qita',
                  label: '其他'
                }
              ]
            },
            {
              value: 'shehuikexue',
              label: '社会科学',
              children: [
                {
                  value: 'zhengzhi',
                  label: '政治'
                },
                {
                  value: 'shangxue',
                  label: '商学'
                },
                {
                  value: 'falv',
                  label: '法律'
                },
                {
                  value: 'shehuikexue_qita',
                  label: '其他'
                }
              ]
            }
          ]
        },
        {
          value: 'yulechangshi',
          label: '娱乐常识',
          children: [
            {
              value: 'wenhuayule',
              label: '文化娱乐'
            },
            {
              value: 'tiyuyule',
              label: '体育娱乐'
            },
            {
              value: 'yulechangshi_qita',
              label: '其他'
            }
          ]
        },
        {
          value: 'shenghuochangshi',
          label: '生活常识'
        }
      ]
    }
  },
  methods: {
    async finishQues() {
      if (
        this.personalityForm.rating.indexOf(0) !== -1 ||
        this.vvqForm.yon.indexOf(0) !== -1
      ) {
        await ElMessageBox({
          type: 'info',
          message: '请完成所有题目作答'
        })
        return
      }
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const fields = this.form.field.map(e => e[e.length - 1])
          const res = await insertQuestionnaire(
            this.form.name,
            this.form.age,
            this.form.gender,
            this.form.kg,
            this.form.logic,
            this.form.education,
            this.personalityForm.rating.toString(),
            this.vvqForm.yon.toString(),
            fields.toString()
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
  margin-top: 2em;
  margin-left: 4em;
  width: 100%;
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
