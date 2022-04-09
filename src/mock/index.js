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

Mock.mock(/login(\?.*)?$/, true)
Mock.mock(/user\/signup(\?.*)?$/, () => universalSuccess)
Mock.mock(/logout(\?.*)?$/, () => universalSuccess)

Mock.mock(/job\/all(\?.*)?$/, () =>
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

Mock.mock(/job\/q(\?.*)?$/, () =>
  succeed({
    seq: '10010',
    name: '新规则正误判定',
    publishDate: '2020-12-21 14:00:00',
    desc: '将规则的正误判断出来',
    reward: 1000
  })
)

Mock.mock(/reward\/me(\?.*)?$/, () =>
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

Mock.mock(/reward\/rank(\?.*)?$/, () =>
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

Mock.mock(/questionnaire\/p(\?.*)?$/, () => universalSuccess)

Mock.mock(/ruleData\/byJobId(\?.*)?$/, () => succeed(['12', '23']))

Mock.mock(/ruleData\/q(\?.*)?$/, () =>
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

Mock.mock(/kb\/qa\/mask(\?.*)?$/, () =>
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

Mock.mock(/kb\/qimg(\?.*)?$/, () =>
  succeed('images/kbImage/难受/google_0001.jpg')
)

Mock.mock(/kb\/q(\?.*)?$/, () => {
  return succeed([
    {
      id: 'test-id-1',
      subject: '狮子',
      relation: '*PartOf',
      object: 'b高谷镇'
    },
    {
      id: 'test-id-2',
      subject: '狮子',
      relation: '*PartOf',
      object: 'a凤来乡'
    },
    {
      id: 'test-id-3',
      subject: '狮子',
      relation: '*PartOf',
      object: 'f六狮王朝'
    },
    {
      id: 'test-id-4',
      subject: '狮子',
      relation: '*PartOf',
      object: 'e超级狮子玛丽'
    },
    {
      id: 'test-id-5',
      subject: '狮子',
      relation: '*PartOf',
      object: '逍遥森林舞会'
    },
    {
      id: 'test-id-6',
      subject: '狮子',
      relation: '*PartOf',
      object: '逍遥森林舞会（游戏）'
    },
    {
      id: 'test-id-7',
      subject: '狮子',
      relation: 'RelatedTo',
      object: '狮子（《聊斋志异》篇目）'
    },
    {
      id: 'test-id-8',
      subject: '狮子',
      relation: 'RelatedTo',
      object: '狮子（基督教含义）'
    },
    {
      id: 'test-id-9',
      subject: '狮子',
      relation: 'RelatedTo',
      object: '狮子（大型猫科类动物）'
    },
    {
      id: 'test-id-10',
      subject: '狮子',
      relation: 'RelatedTo',
      object: '狮子（王泰戈画作）'
    }
  ])
})

Mock.mock(/oie\/extract(\?.*)?$/, () =>
  succeed([
    [
      {
        type: 'tag',
        label: 'A0',
        text: '美国'
      },
      {
        type: 'tag',
        label: 'P',
        text: '总统'
      },
      {
        type: 'tag',
        label: 'A1',
        text: '奥巴马'
      },
      {
        type: 'plain',
        text: '将访问中国'
      }
    ],
    [
      {
        type: 'plain',
        text: '美国总统'
      },
      {
        type: 'tag',
        label: 'A0',
        text: '奥巴马'
      },
      {
        type: 'plain',
        text: '将'
      },
      {
        type: 'tag',
        label: 'P',
        text: '访问'
      },
      {
        type: 'tag',
        label: 'A1',
        text: '中国'
      }
    ]
  ])
)

Mock.mock(/kb\/triple\/comment(\?.*)?$/, 'get', () =>
  succeed([
    {
      id: 'test-example-id',
      tripleId: 'test-triple-id',
      type: 'TAIL',
      data: '无敌尾实体',
      upvote: 2,
      downvote: 3
    },
    {
      id: 'test-example-id',
      tripleId: 'test-triple-id',
      type: 'WRONG',
      data: null,
      upvote: 5,
      downvote: 1
    }
  ])
)

Mock.mock(/kb\/triple\/comment(\?.*)?$/, 'put', () => succeed(true))

Mock.mock(/kb\/triple\/comment\/up(\?.*)?$/, () => succeed(true))

Mock.mock(/kb\/triple\/comment\/down(\?.*)?$/, () => succeed(true))

Mock.mock(/kb\/similar\/bm25(\?.*)?$/, () =>
  succeed([
    {
      subject: '斑马',
      relation: '吃',
      object: '草'
    },
    {
      subject: '牛',
      relation: '吃',
      object: '草'
    }
  ])
)

Mock.mock(/kb\/similar\/knn(\?.*)?$/, () =>
  succeed([
    {
      subject: '斑马',
      relation: '吃',
      object: '肉'
    },
    {
      subject: '牛',
      relation: '吃',
      object: '木头'
    }
  ])
)

Mock.mock(/\/kb\/extraction(\?.*)?$/, () =>
  succeed([
    {
      values: ['是', '狮子', '动物'],
      vector: 'dummy'
    },
    {
      values: ['吃', '老虎', '肉'],
      vector: 'dummy'
    }
  ])
)

Mock.mock(/\/kb\/qa\/textQa(\?.*)?$/, () =>
  succeed([
    {
      source: 'Source Text',
      answers: ['Hair', 'Leg', 'Back'],
      context: 'Kotlin is better that Java.'
    }
  ])
)
