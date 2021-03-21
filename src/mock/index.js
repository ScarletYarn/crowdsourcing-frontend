const Mock = require('mockjs')
import { BASE_URL } from '@/service'

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

Mock.mock(`${BASE_URL}/login`, () => true)
Mock.mock(RegExp(`${BASE_URL}/user/signup` + '.*'), () => universalSuccess)
Mock.mock(`${BASE_URL}/logout`, () => universalSuccess)

Mock.mock(`${BASE_URL}/job/all`, () =>
  succeed([
    {
      id: '10086',
      name: '规则正误判定',
      publishDate: '2020-12-12 14:00:00',
      desc: '将规则的正误判断出来',
      reward: 2.58
    },
    {
      id: '10010',
      name: '新规则正误判定',
      publishDate: '2020-12-21 14:00:00',
      desc: '将规则的正误判断出来',
      reward: 3.56
    }
  ])
)

Mock.mock(RegExp(`${BASE_URL}/job/q?` + '.*'), () =>
  succeed({
    id: '10010',
    name: '新规则正误判定',
    publishDate: '2020-12-21 14:00:00',
    desc: '将规则的正误判断出来',
    reward: 3.56
  })
)

Mock.mock(`${BASE_URL}/reward/me`, () =>
  succeed([
    {
      id: '1233',
      jobId: '10086',
      completeTime: '2021-2-22 15:00:00',
      value: 3.56,
      status: '未支付',
      userId: '123'
    },
    {
      id: '3322',
      jobId: '10010',
      completeTime: '2021-2-22 15:00:00',
      value: 3.56,
      status: '未支付',
      userId: '123'
    }
  ])
)

Mock.mock(`${BASE_URL}/reward/rank`, () =>
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

Mock.mock(RegExp(`${BASE_URL}/questionnaire/p` + '.*'), () => universalSuccess)

Mock.mock(RegExp(`${BASE_URL}/ruleData/byJobId` + '.*'), () =>
  succeed(['12', '23'])
)

Mock.mock(RegExp(`${BASE_URL}/ruleData/q` + '.*'), () =>
  succeed({
    id: '223333rfergefr',
    jobId: 'uvhsihisheviev',
    content: '国籍(A,v0) & 简称(v0,v1) & 出生地(B,v0) =>配偶(A,B)',
    graph: '1111111',
    nl: 'v0和A结婚，B的母亲是v0，那么得出B的父亲是A。',
    instance: '结婚(梅拉尼娅·特朗普,唐纳德·特朗普) & 母亲(伊万卡·特朗普,梅拉尼娅·特朗普 ) =>父亲(伊万卡·特朗普,唐纳德·特朗普 )',
    goldenAnswer: 'ho'
  })
)
