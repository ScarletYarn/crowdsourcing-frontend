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

Mock.mock(/ruleData\/byJobId(\?.*)?$/, () => succeed(new Array(20).fill(1)))

Mock.mock(/ruleData\/q(\?.*)?$/, () =>
  succeed({
    id: '223333rfergefr',
    jobId: 'uvhsihisheviev',
    content: '父母(A,v0) & 配偶(v0,B)=> 父母(A,B)',
    graph: '/img/job2/3.svg',
    nl: 'A的父母是v0，v0的配偶是B，那么得出A的父母是B。',
    instance:
      '父母(Albert_II, Rainier_III) &配偶(Rainier_III, Grace_Kelly)=>父母(Albert_II, Grace_Kelly)',
    goldenAnswer: 'ho'
  })
)

Mock.mock(/ruleData\/pageSeq(\?.*)?$/, () => succeed(['INS', 'NL', 'KG']))

Mock.mock(/userAction\/add(\?.*)?$/, () => universalSuccess)

Mock.mock(/coinInfo\/get(\?.*)?$/, () =>
  succeed({
    currentIndex: 0,
    count: 40
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
      object: 'b高谷镇',
      score: '0.998'
    },
    {
      id: 'test-id-2',
      subject: '狮子',
      relation: '*PartOf',
      object: 'a凤来乡',
      score: '0.998'
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
      object: 'e超级狮子玛丽',
      score: '0.09'
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
      object: '狮子（《聊斋志异》篇目）',
      score: '0.598'
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
      object: '狮子（大型猫科类动物）',
      score: '0.33'
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

Mock.mock(/kb\/triple\/comment\/upOrDown(\?.*)?$/, () => succeed(true))

Mock.mock(/kb\/similar\/bm25(\?.*)?$/, () =>
  succeed([
    {
      subject: '斑马',
      relation: '吃',
      object: '草',
      id: 'bm251'
    },
    {
      subject: '牛',
      relation: '吃',
      object: '草',
      id: 'bm252'
    }
  ])
)

Mock.mock(/kb\/similar\/knn(\?.*)?$/, () =>
  succeed([
    {
      subject: '斑马',
      relation: '吃',
      object: '肉',
      id: '123'
    },
    {
      subject: '牛',
      relation: '吃',
      object: '木头',
      id: '124'
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

Mock.mock(/\/kb\/entailment(\?.*)?$/, () => succeed([0.234, 0.999]))

Mock.mock(/\/kb\/modifyTriple(\?.*)?$/, () => succeed(true))

Mock.mock(/\/kb\/scale\/p1(\?.*)?$/, () =>
  succeed({
    tripleCount: 1234,
    tripleCountZh: 1232
  })
)

Mock.mock(/\/kb\/scale\/p2(\?.*)?$/, () =>
  succeed({
    entityCount: 112,
    entityCountZh: 56,
    isRefreshing: Math.random() > 0.5,
    lastRefreshDate: '2022-07-10T07:46:18.390+00:00'
  })
)

Mock.mock(/\/kb\/scale\/refresh(\?.*)?$/, () => succeed(true))

Mock.mock(/\/kb\/scale\/refresh\/fast(\?.*)?$/, () => succeed(true))

Mock.mock(/\/kb\/completion(\?.*)?$/, () =>
  succeed([
    {
      item: '老虎',
      score: 0.998
    },
    {
      item: '吃人',
      score: 0.334,
      exist: true
    },
    {
      item: '第三项',
      score: 0.567
    },
    {
      item: '很有道理的话很有道理的话很有道理的话',
      score: 0.567
    }
  ])
)

Mock.mock(/\/kb\/populate(\?.*)?$/, () => succeed(true))
