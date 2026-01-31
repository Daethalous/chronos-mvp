import { EventNode } from '../types';

export const INITIAL_STATS = {
  wealth: 50,
  popularity: 50,
  health: 80,
  sanity: 80,
};

export const MOCK_NODES: Record<string, EventNode> = {
  'root': {
    node_id: 'root',
    parent_id: null,
    timeline_id: 'alpha',
    year: 1980,
    age: 34,
    description: '你的父亲建议你专注于布鲁克林和皇后区的收租业务，但你看到了曼哈顿中心破旧的科摩多酒店(Commodore Hotel)的潜力。这是一个巨大的赌注。',
    is_historical_fact: true,
    choices: {
      left: {
        text: '听从父亲，稳扎稳打',
        consequence_type: 'divergence',
        next_node_id: 'queens_king',
        next_node_preview: '你留在了舒适区...'
      },
      right: {
        text: '冒险买下，改造它！',
        consequence_type: 'convergence',
        next_node_id: 'trump_tower',
        next_node_preview: '凯悦酒店项目启动，你迈出了帝国的第一步。'
      }
    },
    status_effect: {
      wealth: -10,
      popularity: 5
    }
  },
  'queens_king': {
    node_id: 'queens_king',
    parent_id: 'root',
    timeline_id: 'beta',
    year: 1985,
    age: 39,
    description: '你在皇后区成为了“公寓之王”，生活富足但平淡。此时，好莱坞的一个剧组想租用你的公寓拍摄电影，并邀请你客串。',
    is_historical_fact: false,
    choices: {
      left: {
        text: '拒绝，我是个商人',
        consequence_type: 'divergence',
        next_node_id: 'local_landlord_end',
        next_node_preview: '你度过了平凡的一生。'
      },
      right: {
        text: '同意，我要当明星',
        consequence_type: 'divergence',
        next_node_id: 'hollywood_star',
        next_node_preview: '你意外走红，开启了演艺生涯。'
      }
    },
    status_effect: {
      wealth: 5,
      popularity: -5
    }
  },
  'trump_tower': {
    node_id: 'trump_tower',
    parent_id: 'root',
    timeline_id: 'alpha',
    year: 1983,
    age: 37,
    description: '凯悦酒店大获成功。现在你要建造属于自己的旗舰大厦——特朗普大厦(Trump Tower)。设计师建议采用低调的石灰石外墙以融入周边环境。',
    is_historical_fact: true,
    choices: {
      left: {
        text: '同意，低调奢华',
        consequence_type: 'divergence',
        next_node_id: 'architect_trump',
        next_node_preview: '大厦好评如潮，但缺乏标志性。'
      },
      right: {
        text: '不行！我要金色和玻璃！',
        consequence_type: 'convergence',
        next_node_id: 'plaza_deal',
        next_node_preview: '这座大厦成为了第五大道的各种地标。'
      }
    },
    status_effect: {
      wealth: -20,
      popularity: 20
    }
  },
  'plaza_deal': {
    node_id: 'plaza_deal',
    parent_id: 'trump_tower',
    timeline_id: 'alpha',
    year: 1988,
    age: 42,
    description: '你已经拥有了名声。现在，传奇的广场饭店(Plaza Hotel)出售，但价格高得离谱。',
    is_historical_fact: true,
    choices: {
      left: {
        text: '太贵了，放弃',
        consequence_type: 'divergence',
        next_node_id: 'prudent_investor',
        next_node_preview: '你避开了随后的破产危机。'
      },
      right: {
        text: '买下它！这才是蒙娜丽莎！',
        consequence_type: 'convergence',
        next_node_id: 'apprentice_era',
        next_node_preview: '你买下了它，但债务也随之而来。'
      }
    },
    status_effect: {
      wealth: -30,
      popularity: 15
    }
  },
  'apprentice_era': {
    node_id: 'apprentice_era',
    parent_id: 'plaza_deal',
    timeline_id: 'alpha',
    year: 2004,
    age: 58,
    description: '经历了90年代的起伏，NBC制片人马克·伯内特向你推销一个真人秀节目《学徒》(The Apprentice)。',
    is_historical_fact: true,
    choices: {
      left: {
        text: '真人秀太掉价了',
        consequence_type: 'divergence',
        next_node_id: 'real_estate_only',
        next_node_preview: '你继续专注于地产，逐渐淡出公众视野。'
      },
      right: {
        text: 'You\'re Fired!',
        consequence_type: 'convergence',
        next_node_id: 'election_2016',
        next_node_preview: '你成为了全美家喻户晓的电视明星。'
      }
    },
    status_effect: {
      wealth: 10,
      popularity: 30
    }
  },
  'election_2016': {
    node_id: 'election_2016',
    parent_id: 'apprentice_era',
    timeline_id: 'alpha',
    year: 2015,
    age: 69,
    description: '你的声望达到了顶峰。此时，共和党内初选局势混乱。你是否要正式宣布参选总统？',
    is_historical_fact: true,
    choices: {
      left: {
        text: '还是算了吧，继续做生意',
        consequence_type: 'divergence',
        next_node_id: 'kingmaker',
        next_node_preview: '你成为了共和党背后的金主。'
      },
      right: {
        text: '让美国再次伟大！',
        consequence_type: 'convergence',
        next_node_id: 'president_trump',
        next_node_preview: '你乘坐金色扶梯下楼，改变了历史。'
      }
    },
    status_effect: {
      wealth: -10,
      popularity: 50
    }
  },
  // Endings / Divergences
  'local_landlord_end': {
    node_id: 'local_landlord_end',
    parent_id: 'queens_king',
    timeline_id: 'beta',
    year: 2020,
    age: 74,
    description: '【结局：无名富翁】你在皇后区安度晚年，虽然富有，但世界上没有人知道唐纳德·特朗普这个名字。',
    is_historical_fact: false,
    choices: {
      left: { text: '重来', consequence_type: 'divergence', next_node_id: null },
      right: { text: '重来', consequence_type: 'divergence', next_node_id: null }
    }
  },
  'hollywood_star': {
    node_id: 'hollywood_star',
    parent_id: 'queens_king',
    timeline_id: 'gamma',
    year: 1990,
    age: 44,
    description: '【结局：好莱坞巨星】你凭借独特的个人魅力成为了动作片巨星，甚至获得了一座奥斯卡奖。',
    is_historical_fact: false,
    choices: {
      left: { text: '重来', consequence_type: 'divergence', next_node_id: null },
      right: { text: '重来', consequence_type: 'divergence', next_node_id: null }
    }
  },
  'president_trump': {
    node_id: 'president_trump',
    parent_id: 'election_2016',
    timeline_id: 'alpha',
    year: 2017,
    age: 70,
    description: '【结局：第45任总统】你宣誓就职。历史从此不同。（MVP版本演示结束）',
    is_historical_fact: true,
    choices: {
      left: { text: '结束', consequence_type: 'convergence', next_node_id: null },
      right: { text: '结束', consequence_type: 'convergence', next_node_id: null }
    }
  },
  'architect_trump': {
      node_id: 'architect_trump',
      parent_id: 'trump_tower',
      timeline_id: 'delta',
      year: 1990,
      age: 44,
      description: '【结局：受尊敬的开发商】你的建筑因品味高雅而受到业界赞誉，但你从未获得过那种狂热的崇拜。',
      is_historical_fact: false,
      choices: {
        left: { text: '重来', consequence_type: 'divergence', next_node_id: null },
        right: { text: '重来', consequence_type: 'divergence', next_node_id: null }
      }
  },
  'prudent_investor': {
      node_id: 'prudent_investor',
      parent_id: 'plaza_deal',
      timeline_id: 'epsilon',
      year: 2000,
      age: 54,
      description: '【结局：华尔街大亨】你转型成为了更加稳健的投资人，避开了破产，但也没有了成为超级名人的机会。',
      is_historical_fact: false,
      choices: {
        left: { text: '重来', consequence_type: 'divergence', next_node_id: null },
        right: { text: '重来', consequence_type: 'divergence', next_node_id: null }
      }
  },
  'real_estate_only': {
      node_id: 'real_estate_only',
      parent_id: 'apprentice_era',
      timeline_id: 'zeta',
      year: 2010,
      age: 64,
      description: '【结局：地产大亨】你继续在地产界呼风唤雨，但对于普通大众来说，你只是又一个有钱人罢了。',
      is_historical_fact: false,
      choices: {
        left: { text: '重来', consequence_type: 'divergence', next_node_id: null },
        right: { text: '重来', consequence_type: 'divergence', next_node_id: null }
      }
  },
  'kingmaker': {
      node_id: 'kingmaker',
      parent_id: 'election_2016',
      timeline_id: 'eta',
      year: 2016,
      age: 70,
      description: '【结局：幕后玩家】你资助了另一位候选人成功当选，成为华盛顿最有权势的幕后推手。',
      is_historical_fact: false,
      choices: {
        left: { text: '重来', consequence_type: 'divergence', next_node_id: null },
        right: { text: '重来', consequence_type: 'divergence', next_node_id: null }
      }
  }
};
