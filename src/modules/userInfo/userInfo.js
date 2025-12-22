/**
 * UserInfo 模組
 */

import UserInfoEngine from './userInfoEngine.js';
import { getPart1QuestionIds, getPart2QuestionIds } from './userInfoConfig.js';
import router from '../../shared/utils/router.js';
import { api } from '../../shared/utils/api.js';
import toast from '../../shared/components/toast.js';
import './userInfo.css';

const UserInfoModule = {
  async init(container, { header, footer, query }) {
    this.container = container;
    this.header = header;
    this.footer = footer;
    this.query = query;
    this.engine = new UserInfoEngine(container);
    this.currentState = 'start'; // 'start' | 'question' | 'intermediate' | 'complete'
    this.currentPart = 'part1'; // 'part1' | 'part2'
    
    // 設定引擎回調
    this.engine.onNext = (nextId) => {
      this.handleNext(nextId);
    };
    
    this.engine.onComplete = () => {
      this.handleComplete();
    };
    
    // 綁定 footer 按鈕
    const footerBtn = footer.querySelector('#footer-primary-btn');
    if (footerBtn) {
      footerBtn.textContent = '下一步';
      footerBtn.onclick = () => {
        this.handleNextButton();
      };
    }
    
    // 檢查是否從 AD8 回來
    if (query.resume) {
      // 從指定題目繼續
      await this.startFromQuestion(query.resume);
    } else {
      // 檢查是否有草稿
      await this.engine.loadDraft();
      const answers = this.engine.getAnswers();
      const hasDraft = Object.keys(answers).length > 0;
      
      if (hasDraft) {
        // 有草稿，繼續問卷
        await this.start();
      } else {
        // 沒有草稿，顯示起始頁（user info page-start）
        this.showStartPage();
      }
    }
  },

  /**
   * 顯示起始頁（user info page-start）
   */
  showStartPage() {
    this.currentState = 'start';
    this.container.innerHTML = `
      <div class="userinfo-start scrollable-content">
        <div class="userinfo-start__icon">👤</div>
        <h2 class="userinfo-start__title">個人化設定</h2>
        <p class="userinfo-start__message">
          填寫個人與患者資訊，讓 Caremate 為您客製化最適合的照護建議
        </p>
        <p class="userinfo-start__submessage">
          我們將詢問一些基本問題，幫助我們更好地了解您和患者的情況
        </p>
      </div>
    `;
    
    // 更新 footer 按鈕
    const footerBtn = this.footer.querySelector('#footer-primary-btn');
    if (footerBtn) {
      footerBtn.textContent = '開始';
      footerBtn.onclick = () => {
        this.start();
      };
    }
  },

  /**
   * 開始問卷
   */
  async start() {
    // 載入草稿，檢查進度
    await this.engine.loadDraft();
    const answers = this.engine.getAnswers();
    
    // 更新狀態為 question
    this.currentState = 'question';
    
    // 更新 footer 按鈕
    const footerBtn = this.footer.querySelector('#footer-primary-btn');
    if (footerBtn) {
      footerBtn.textContent = '下一步';
      footerBtn.onclick = () => {
        this.handleNextButton();
      };
    }
    
    // 檢查 Part 1 是否完成
    const part1Ids = getPart1QuestionIds();
    const part1Completed = part1Ids.every(id => answers[id]);
    
    if (!part1Completed) {
      // 從 Part 1 第一題開始
      await this.engine.showQuestion('1-1');
      this.currentPart = 'part1';
    } else {
      // Part 1 完成，顯示中繼頁
      this.showIntermediate();
    }
  },

  /**
   * 從指定題目開始
   */
  async startFromQuestion(questionId) {
    await this.engine.showQuestion(questionId, { resumeFrom: questionId });
    this.currentPart = 'part2';
  },

  /**
   * 顯示中繼頁
   */
  showIntermediate() {
    this.currentState = 'intermediate';
    this.container.innerHTML = `
      <div class="userinfo-intermediate scrollable-content">
        <div class="userinfo-intermediate__icon">🎉</div>
        <h2 class="userinfo-intermediate__title">快完成了！</h2>
        <p class="userinfo-intermediate__message">
          接著填寫患者資訊，讓 Caremate 為您客製化最適合的照護建議
        </p>
      </div>
    `;
    
    // 更新 footer 按鈕
    const footerBtn = this.footer.querySelector('#footer-primary-btn');
    if (footerBtn) {
      footerBtn.textContent = '開始';
      footerBtn.onclick = () => {
        this.startPart2();
      };
    }
  },

  /**
   * 開始 Part 2
   */
  async startPart2() {
    this.currentState = 'question';
    this.currentPart = 'part2';
    await this.engine.showQuestion('2-1');
    
    // 更新 footer 按鈕
    const footerBtn = this.footer.querySelector('#footer-primary-btn');
    if (footerBtn) {
      footerBtn.textContent = '下一步';
      footerBtn.onclick = () => {
        this.handleNextButton();
      };
    }
  },

  /**
   * 處理下一步按鈕
   */
  async handleNextButton() {
    if (this.currentState === 'start') {
      // 從起始頁開始問卷
      this.start();
      return;
    }
    
    if (this.currentState === 'intermediate') {
      this.startPart2();
      return;
    }
    
    if (this.currentState === 'complete') {
      router.navigate('/main');
      return;
    }
    
    // 驗證並進入下一題
    const success = await this.engine.next();
    if (!success) {
      // 驗證失敗，錯誤訊息已由引擎顯示
      return;
    }
  },

  /**
   * 處理下一步（由引擎觸發）
   */
  async handleNext(nextId) {
    if (nextId === 'jump-to-ad8') {
      // 跳轉到 AD8
      router.navigate('/ad8', { from: 'userInfo' });
      return;
    }
    
    // 檢查是否完成 Part 1
    if (this.currentPart === 'part1') {
      const part1Ids = getPart1QuestionIds();
      const currentIndex = part1Ids.indexOf(this.engine.currentQuestionId);
      
      if (currentIndex === part1Ids.length - 1) {
        // Part 1 最後一題完成，顯示中繼頁
        this.showIntermediate();
        return;
      }
    }
    
    // 檢查是否完成 Part 2
    if (this.currentPart === 'part2') {
      const part2Ids = getPart2QuestionIds();
      const currentIndex = part2Ids.indexOf(this.engine.currentQuestionId);
      
      if (currentIndex === part2Ids.length - 1) {
        // Part 2 最後一題完成，顯示完成頁
        await this.submitAndShowComplete();
        return;
      }
    }
  },

  /**
   * 處理完成
   */
  async handleComplete() {
    await this.submitAndShowComplete();
  },

  /**
   * 提交並顯示完成頁
   */
  async submitAndShowComplete() {
    try {
      const answers = this.engine.getAnswers();
      
      // 提交到 API
      const response = await api.post('/onboarding/submit', answers);
      const result = await response.json();
      
      if (result.success) {
        this.showComplete();
        toast.success('個人化設定已提交成功！');
      } else {
        toast.error('提交失敗，請稍後再試');
      }
    } catch (error) {
      console.error('Failed to submit:', error);
      toast.error('提交失敗，請稍後再試');
    }
  },

  /**
   * 顯示完成頁
   */
  showComplete() {
    this.currentState = 'complete';
    this.container.innerHTML = `
      <div class="userinfo-complete scrollable-content">
        <div class="userinfo-complete__icon">✓</div>
        <h2 class="userinfo-complete__title">填寫完成！</h2>
        <p class="userinfo-complete__message">
          謝謝您的耐心填寫，我們已為您準備好個人化的照護建議。點擊下方開始使用 Caremate 的完整功能。
        </p>
      </div>
    `;
    
    // 更新 footer 按鈕
    const footerBtn = this.footer.querySelector('#footer-primary-btn');
    if (footerBtn) {
      footerBtn.textContent = '開始';
      footerBtn.onclick = () => {
        router.navigate('/main');
      };
    }
  }
};

export default UserInfoModule;

