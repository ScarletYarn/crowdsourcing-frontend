const Mock = require('mockjs')

const universalSuccess = {
  msg: null,
  data: true
}

const succeed = data => {
  return {
    msg: null,
    data: data
  }
}

Mock.mock(/login.*/, true)
Mock.mock(/user\/signup.*/, () => universalSuccess)
Mock.mock(/logout.*/, () => universalSuccess)

Mock.mock(/job\/all.*/, () =>
  succeed([
    {
      seq: '10086',
      name: '规则正误判定',
      publishDate: '2020-12-12 14:00:00',
      desc: '将规则的正误判断出来',
      reward: 1000
    },
    {
      seq: '10010',
      name: '新规则正误判定',
      publishDate: '2020-12-21 14:00:00',
      desc: '将规则的正误判断出来',
      reward: 1000
    }
  ])
)

Mock.mock(/job\/q.*/, () =>
  succeed({
    seq: '10010',
    name: '新规则正误判定',
    publishDate: '2020-12-21 14:00:00',
    desc: '将规则的正误判断出来',
    reward: 1000
  })
)

Mock.mock(/reward\/me.*/, () =>
  succeed([
    {
      id: '1233',
      seq: '10086',
      completeTime: '2021-2-22 15:00:00',
      value: 1000,
      status: '未支付',
      userId: '123'
    },
    {
      id: '3322',
      seq: '10010',
      completeTime: '2021-2-22 15:00:00',
      value: 1000,
      status: '未支付',
      userId: '123'
    }
  ])
)

Mock.mock(/reward\/rank.*/, () =>
  succeed([
    {
      reward: '35.00',
      name: '王小虎'
    },
    {
      reward: '35.00',
      name: '王小虎'
    },
    {
      reward: '35.00',

      name: '王小虎'
    },
    {
      reward: '35.00',
      name: '王小虎'
    }
  ])
)

Mock.mock(/questionnaire\/p.*/, () => universalSuccess)

Mock.mock(/ruleData\/byJobId.*/, () => succeed(['12', '23']))

Mock.mock(/ruleData\/q.*/, () =>
  succeed({
    id: '223333rfergefr',
    jobId: 'uvhsihisheviev',
    content: '国籍(A,v0) & 简称(v0,v1) & 出生地(B,v0) =>配偶(A,B)',
    graph: '1111111',
    nl: 'v0和A结婚，B的母亲是v0，那么得出B的父亲是A。',
    instance:
      '结婚(梅拉尼娅·特朗普,唐纳德·特朗普) & 母亲(伊万卡·特朗普,梅拉尼娅·特朗普 ) =>父亲(伊万卡·特朗普,唐纳德·特朗普 )',
    goldenAnswer: 'ho'
  })
)

Mock.mock(/kb\/qa\/mask.*/, () =>
  succeed([
    {
      source: 'Source A',
      answers: ['Hair', 'Leg', 'Back'],
      context: 'Kotlin is better that Java.'
    },
    {
      source: 'Source B',
      answers: ['Hair', 'Leg', 'Back'],
      context: 'Kotlin is better that Java.'
    }
  ])
)

Mock.mock(/kb\/q.*/, () => {
  return succeed(
    JSON.stringify({
      results: {
        bindings: [
          {
            x: {
              value: '草'
            },
            y: {
              value: '吃'
            }
          },
          {
            x: {
              value: '牛奶'
            },
            y: {
              value: '吃'
            }
          },
          {
            x: {
              value: '牛'
            },
            y: {
              value: '吃'
            }
          },
          {
            x: {
              value: '草原'
            },
            y: {
              value: '喜欢'
            }
          },
          {
            x: {
              value: '肉'
            },
            y: {
              value: '喜欢'
            }
          },
          {
            x: {
              value: '捕猎'
            },
            y: {
              value: '擅长'
            }
          }
        ]
      }
    })
  )
})
