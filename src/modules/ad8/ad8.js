/**
 * AD8 模組
 */

import router from '../../shared/utils/router.js';
import { api } from '../../shared/utils/api.js';
import toast from '../../shared/components/toast.js';
import './ad8.css';

// AD8 題目（依附件）
const AD8_QUESTIONS = [
  '他是否有判斷力上的困難？',
  '他是否對活動和嗜好的興趣降低？',
  '他是否會重複相同問題、故事和陳述？',
  '他是否在學習如何使用工具、設備和小器具上有困難？',
  '他是否會忘記正確的月份和日期？',
  '他是否在處理複雜的財物上有困難？',
  '他是否容易記約會時間？',
  '他是否有持續的思考和記憶方面問題？'
];

const AD8Module = {
  async init(container, { header, footer, query }) {
    this.container = container;
    this.header = header;
    this.footer = footer;
    this.query = query;
    this.state = 'intro'; // 'intro' | 'questions' | 'result'
    this.answers = {};
    this.score = 0;
    this.disclaimerAccepted = false;
    
    // 綁定 footer 按鈕
    const footerBtn = footer.querySelector('#footer-primary-btn');
    if (footerBtn) {
      footerBtn.onclick = () => {
        this.handleNextButton();
      };
    }
    
    // 顯示說明頁
    this.showIntro();
  },

  /**
   * 顯示說明頁
   */
  showIntro() {
    this.state = 'intro';
    this.container.innerHTML = `
      <div class="ad8-intro scrollable-content">
        <h1 class="ad8-intro__title">2 分鐘快速失智檢測</h1>
        
        <div class="ad8-intro__section">
          <h2 class="ad8-intro__section-title">說明</h2>
          <p class="ad8-intro__content">
            AD-8 是一份由照護者填寫的快速失智檢測，約 2 分鐘即可完成。請依患者近期狀況作答，以及早掌握狀況。
          </p>
        </div>
        
        <div class="ad8-intro__section">
          <h2 class="ad8-intro__section-title">規則與聲明</h2>
          <ul class="ad8-intro__rules">
            <li>若總分 ≥ 2 分，建議安排專科醫師進一步評估。</li>
            <li>本量表結果僅作為初步篩檢參考，不代表確定診斷。如需更準確診斷，請至醫療機構詢問。</li>
          </ul>
        </div>
        
        <div class="ad8-intro__disclaimer">
          <p class="ad8-intro__content">
            <strong>免責聲明：</strong>本檢測結果僅供參考，不應作為醫療診斷依據。如有任何健康疑慮，請諮詢專業醫師。
          </p>
          <div class="ad8-intro__checkbox">
            <input 
              type="checkbox" 
              id="ad8-disclaimer" 
              ${this.disclaimerAccepted ? 'checked' : ''}
            />
            <label for="ad8-disclaimer">
              我已閱讀並同意上述聲明，願意進行檢測
            </label>
          </div>
        </div>
      </div>
    `;
    
    // 綁定 checkbox 事件
    const checkbox = this.container.querySelector('#ad8-disclaimer');
    if (checkbox) {
      checkbox.addEventListener('change', (e) => {
        this.disclaimerAccepted = e.target.checked;
        this.updateFooterButton();
      });
    }
    
    this.updateFooterButton();
  },

  /**
   * 顯示題目頁
   */
  showQuestions() {
    this.state = 'questions';
    this.container.innerHTML = `
      <div class="ad8-questions scrollable-content">
        <h2 class="ad8-questions__title">請依患者近期狀況作答</h2>
        ${AD8_QUESTIONS.map((question, index) => {
          const questionId = `q${index + 1}`;
          const currentAnswer = this.answers[questionId];
          return `
            <div class="ad8-question-item">
              <div class="ad8-question-item__number">題目 ${index + 1}</div>
              <div class="ad8-question-item__text">${question}</div>
              <div class="ad8-question-item__options">
                <label class="ad8-question-item__option ${currentAnswer === 'yes' ? 'is-selected' : ''}">
                  <input 
                    type="radio" 
                    name="ad8-${questionId}" 
                    value="yes"
                    ${currentAnswer === 'yes' ? 'checked' : ''}
                  />
                  是
                </label>
                <label class="ad8-question-item__option ${currentAnswer === 'no' ? 'is-selected' : ''}">
                  <input 
                    type="radio" 
                    name="ad8-${questionId}" 
                    value="no"
                    ${currentAnswer === 'no' ? 'checked' : ''}
                  />
                  否
                </label>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    
    // 綁定選項事件
    const radios = this.container.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const questionId = e.target.name.replace('ad8-', '');
        this.answers[questionId] = e.target.value;
        this.updateOptionStyles(e.target);
        this.updateFooterButton();
      });
    });
    
    // 初始化選項樣式
    radios.forEach(radio => {
      if (radio.checked) {
        this.updateOptionStyles(radio);
      }
    });
    
    this.updateFooterButton();
  },

  /**
   * 更新選項樣式
   */
  updateOptionStyles(radio) {
    const questionItem = radio.closest('.ad8-question-item');
    const options = questionItem.querySelectorAll('.ad8-question-item__option');
    options.forEach(option => {
      option.classList.remove('is-selected');
    });
    
    const selectedOption = radio.closest('.ad8-question-item__option');
    if (selectedOption) {
      selectedOption.classList.add('is-selected');
    }
  },

  /**
   * 計算分數
   */
  calculateScore() {
    let score = 0;
    for (let i = 1; i <= 8; i++) {
      const questionId = `q${i}`;
      if (this.answers[questionId] === 'yes') {
        score += 1;
      }
    }
    this.score = score;
    return score;
  },

  /**
   * 顯示結果頁
   */
  async showResult() {
    this.state = 'result';
    const score = this.calculateScore();
    const isHighRisk = score >= 2;
    
    // 提交結果到 API
    try {
      await api.post('/assessments/ad8', {
        score,
        answers: this.answers
      });
    } catch (error) {
      console.error('Failed to submit AD8 result:', error);
    }
    
    if (isHighRisk) {
      // 可能確診
      this.container.innerHTML = `
        <div class="ad8-result ad8-result--high-risk scrollable-content">
          <div class="ad8-result__icon">⚠️</div>
          <h2 class="ad8-result__title">建議進一步就醫評估</h2>
          <div class="ad8-result__score">分數：${score} 分（≥ 2 分）</div>
          <p class="ad8-result__message">
            患者的狀況可能符合失智的早期徵兆
          </p>
          <div class="ad8-result__details">
            <h3 class="ad8-result__details-title">建議事項：</h3>
            <ul class="ad8-result__details-list">
              <li>分數達到建議門檻（≥ 2 分）</li>
              <li>建議盡快就醫，由醫師評估確認</li>
              <li>及早診斷與治療有助於延緩病情發展</li>
            </ul>
          </div>
        </div>
      `;
    } else {
      // 可能沒確診
      this.container.innerHTML = `
        <div class="ad8-result ad8-result--low-risk scrollable-content">
          <div class="ad8-result__icon">✓</div>
          <h2 class="ad8-result__title">目前沒有明顯失智風險！</h2>
          <div class="ad8-result__score">分數：${score} 分（0–1 分）</div>
          <p class="ad8-result__message">
            目前無明顯失智跡象
          </p>
          <div class="ad8-result__details">
            <h3 class="ad8-result__details-title">建議事項：</h3>
            <ul class="ad8-result__details-list">
              <li>分數在正常範圍內（0–1 分）</li>
              <li>建議仍持續觀察日常狀況</li>
              <li>如有任何疑慮或變化，仍可尋求醫師協助</li>
            </ul>
          </div>
        </div>
      `;
    }
    
    // 更新 footer 按鈕
    const footerBtn = this.footer.querySelector('#footer-primary-btn');
    if (footerBtn) {
      footerBtn.textContent = '下一題';
      footerBtn.onclick = () => {
        this.handleNextButton();
      };
    }
  },

  /**
   * 更新 footer 按鈕狀態
   */
  updateFooterButton() {
    const footerBtn = this.footer.querySelector('#footer-primary-btn');
    if (!footerBtn) return;
    
    if (this.state === 'intro') {
      footerBtn.textContent = '開始檢測';
      footerBtn.disabled = !this.disclaimerAccepted;
    } else if (this.state === 'questions') {
      footerBtn.textContent = '查看結果';
      // 檢查是否所有題目都已回答
      const allAnswered = AD8_QUESTIONS.every((_, index) => {
        const questionId = `q${index + 1}`;
        return this.answers[questionId];
      });
      footerBtn.disabled = !allAnswered;
    }
  },

  /**
   * 處理下一步按鈕
   */
  async handleNextButton() {
    if (this.state === 'intro') {
      if (!this.disclaimerAccepted) {
        toast.error('請先閱讀並同意免責聲明');
        return;
      }
      this.showQuestions();
    } else if (this.state === 'questions') {
      // 檢查是否所有題目都已回答
      const allAnswered = AD8_QUESTIONS.every((_, index) => {
        const questionId = `q${index + 1}`;
        return this.answers[questionId];
      });
      
      if (!allAnswered) {
        toast.error('請回答所有題目');
        return;
      }
      
      await this.showResult();
    } else if (this.state === 'result') {
      // 根據來源決定導向
      if (this.query.from === 'userInfo') {
        // 從 UserInfo 跳轉來的，回到 UserInfo 並從 2-5 繼續
        router.navigate('/user-info', { resume: '2-5' });
      } else {
        // 直接進入的，回到首頁
        router.navigate('/main');
      }
    }
  }
};

export default AD8Module;

