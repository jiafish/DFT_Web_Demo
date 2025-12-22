/**
 * UserInfo 題目配置
 * 依附件「個人資料題目.txt」實作
 */

export const userInfoConfig = [
  // Part 1: 照護者資訊
  {
    id: '1-1',
    question: '請問您與患者的關係？',
    type: 'radio', // 單選，但最後一個選項可輸入文字
    required: true,
    options: [
      { value: 'spouse', label: '配偶' },
      { value: 'parent', label: '父母' },
      { value: 'sibling', label: '兄弟姐妹' },
      { value: 'child', label: '兒女' },
      { value: 'other', label: '其他', hasTextInput: true }
    ]
  },
  {
    id: '1-2',
    question: '請問您與患者同住嗎？',
    type: 'radio',
    required: true,
    options: [
      { value: 'yes', label: '是' },
      { value: 'no', label: '否' }
    ]
  },
  {
    id: '1-3',
    question: '請問您每天大約花費多少時間照護患者？',
    type: 'number',
    required: true,
    placeholder: '小時',
    unit: '小時',
    validation: {
      type: 'number',
      min: 0,
      max: 24
    }
  },
  {
    id: '1-4',
    question: '除您之外，患者是否有其他照顧者？',
    type: 'radio', // 單選，但「是」選項可輸入文字
    required: true,
    options: [
      { value: 'yes', label: '是', hasTextInput: true },
      { value: 'no', label: '否' }
    ]
  },
  {
    id: '1-5',
    question: '請問您是否使用過其他照護資源？',
    type: 'checkbox', // 複選
    required: true,
    options: [
      { value: 'long-term-care', label: '長照服務' },
      { value: 'home-care', label: '居家照服員' },
      { value: 'nurse', label: '看護' },
      { value: 'day-care', label: '日間照護中心' },
      { value: 'none', label: '無' },
      { value: 'other', label: '其他', hasTextInput: true }
    ]
  },
  
  // Part 2: 患者資訊
  {
    id: '2-1',
    question: '請問患者的性別？',
    type: 'radio',
    required: true,
    options: [
      { value: 'male', label: '男' },
      { value: 'female', label: '女' },
      { value: 'other', label: '其他' }
    ]
  },
  {
    id: '2-2',
    question: '請問患者的年齡？',
    type: 'number',
    required: true,
    placeholder: '歲',
    unit: '歲',
    validation: {
      type: 'number',
      min: 0,
      max: 150
    }
  },
  {
    id: '2-3',
    question: '請問患者的確診類型？',
    type: 'radio', // 單選，但最後一個選項可輸入文字
    required: true,
    options: [
      { value: 'alzheimer', label: '阿茲海默症' },
      { value: 'vascular', label: '血管性失智' },
      { value: 'frontotemporal', label: '額顳葉失智' },
      { value: 'lewy-body', label: '路易體失智' },
      { value: 'mixed', label: '混合型失智' },
      { value: 'undiagnosed', label: '未確診' },
      { value: 'other', label: '其他', hasTextInput: true }
    ],
    // 跳題邏輯：選「未確診」則跳失智測驗
    skipLogic: {
      condition: (answer) => answer === 'undiagnosed',
      action: 'jump-to-ad8'
    }
  },
  {
    id: '2-4',
    question: '請問患者的確診程度？',
    type: 'radio',
    required: true,
    options: [
      { value: 'level-1', label: '第一級：輕度失智' },
      { value: 'level-2', label: '第二級：中度失智' },
      { value: 'level-3', label: '第三級：重度失智' },
      { value: 'level-4', label: '第四級：嚴重失智' },
      { value: 'level-5', label: '第五級：深度失智' },
      { value: 'level-6', label: '第六級：末期失智' },
      { value: 'uncertain', label: '不確定' }
    ],
    // 跳題邏輯：若 2-3 為「未確診」則跳過這題
    skipLogic: {
      condition: (answer, allAnswers) => {
        return allAnswers['2-3'] === 'undiagnosed';
      },
      action: 'skip'
    }
  },
  {
    id: '2-5',
    question: '請問患者是否有其他慢性疾病？',
    type: 'checkbox', // 複選
    required: true,
    options: [
      { value: 'hypertension', label: '高血壓' },
      { value: 'diabetes', label: '糖尿病' },
      { value: 'heart-disease', label: '心臟疾病' },
      { value: 'stroke', label: '中風' },
      { value: 'parkinson', label: '帕金森氏症' },
      { value: 'depression', label: '抑鬱症' },
      { value: 'none', label: '無' },
      { value: 'other', label: '其他', hasTextInput: true }
    ]
  },
  {
    id: '2-6',
    question: '請問患者目前有的失智症行為？',
    type: 'checkbox', // 複選
    required: true,
    options: [
      { value: 'memory-loss', label: '記憶變差，常忘記事情' },
      { value: 'repetitive-questions', label: '重複提問' },
      { value: 'irritability', label: '容易生氣或煩躁' },
      { value: 'suspicion', label: '懷疑、妄想' },
      { value: 'hallucination', label: '幻視或幻聽' },
      { value: 'stubbornness', label: '固執，不願配合' },
      { value: 'eating-issues', label: '食慾下降／吞嚥困難' },
      { value: 'wandering', label: '遊走／想外出' },
      { value: 'none', label: '無' },
      { value: 'other', label: '其他', hasTextInput: true }
    ]
  },
  {
    id: '2-7',
    question: '請問患者目前保留較好的能力？',
    type: 'checkbox', // 複選
    required: true,
    options: [
      { value: 'eating', label: '吃飯／吞嚥' },
      { value: 'recognition', label: '認人' },
      { value: 'conversation', label: '對話' },
      { value: 'tool-operation', label: '操作工具' },
      { value: 'music', label: '音樂與節奏感' },
      { value: 'walking', label: '行走能力' },
      { value: 'other', label: '其他', hasTextInput: true }
    ]
  },
  {
    id: '2-8',
    question: '您最希望呼喀幫您解決的問題是？',
    type: 'checkbox', // 複選
    required: true,
    options: [
      { value: 'behavior', label: '行為情緒處理' },
      { value: 'communication', label: '溝通方式' },
      { value: 'medical-care', label: '看診就醫' },
      { value: 'government-resources', label: '政府資源' },
      { value: 'care-skills', label: '照護技巧' },
      { value: 'preparation', label: '提早準備' },
      { value: 'other', label: '其他', hasTextInput: true }
    ]
  }
];

/**
 * 取得題目
 * @param {string} questionId
 * @returns {object|null}
 */
export function getQuestion(questionId) {
  return userInfoConfig.find(q => q.id === questionId) || null;
}

/**
 * 取得下一題 ID
 * @param {string} currentQuestionId
 * @param {object} allAnswers
 * @returns {string|null}
 */
export function getNextQuestionId(currentQuestionId, allAnswers = {}) {
  const currentIndex = userInfoConfig.findIndex(q => q.id === currentQuestionId);
  if (currentIndex === -1) return null;
  
  const currentQuestion = userInfoConfig[currentIndex];
  
  // 檢查跳題邏輯
  if (currentQuestion.skipLogic) {
    const { condition, action } = currentQuestion.skipLogic;
    const shouldSkip = condition(allAnswers[currentQuestionId], allAnswers);
    
    if (shouldSkip) {
      if (action === 'jump-to-ad8') {
        return 'jump-to-ad8'; // 特殊標記，需要跳轉到 AD8
      } else if (action === 'skip') {
        // 跳過這題，找下一題
        return getNextQuestionId(userInfoConfig[currentIndex + 1]?.id, allAnswers);
      }
    }
  }
  
  // 檢查下一題是否應該被跳過
  const nextQuestion = userInfoConfig[currentIndex + 1];
  if (nextQuestion && nextQuestion.skipLogic) {
    const { condition, action } = nextQuestion.skipLogic;
    if (action === 'skip' && condition(null, allAnswers)) {
      // 下一題應該被跳過，繼續找
      return getNextQuestionId(nextQuestion.id, allAnswers);
    }
  }
  
  return nextQuestion?.id || null;
}

/**
 * 取得所有題目 ID
 * @returns {string[]}
 */
export function getAllQuestionIds() {
  return userInfoConfig.map(q => q.id);
}

/**
 * 取得 Part 1 的題目 ID
 * @returns {string[]}
 */
export function getPart1QuestionIds() {
  return userInfoConfig.filter(q => q.id.startsWith('1-')).map(q => q.id);
}

/**
 * 取得 Part 2 的題目 ID
 * @returns {string[]}
 */
export function getPart2QuestionIds() {
  return userInfoConfig.filter(q => q.id.startsWith('2-')).map(q => q.id);
}

