/**
 * UserInfo 問卷引擎
 * 單一問題頁模板，動態載入題目/選項，驗證與暫存
 */

import { getQuestion, getNextQuestionId } from './userInfoConfig.js';
import { api } from '../../shared/utils/api.js';
import Validate from '../../shared/utils/validate.js';
import Storage from '../../shared/utils/storage.js';

class UserInfoEngine {
  constructor(container) {
    this.container = container;
    this.currentQuestionId = null;
    this.answers = {};
    this.onNext = null;
    this.onComplete = null;
  }

  /**
   * 載入草稿
   */
  async loadDraft() {
    try {
      const response = await api.get('/onboarding/draft');
      const data = await response.json();
      if (data && typeof data === 'object') {
        this.answers = data;
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }

  /**
   * 儲存草稿
   */
  async saveDraft() {
    try {
      await api.put('/onboarding/draft', this.answers);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }

  /**
   * 顯示題目
   * @param {string} questionId
   * @param {object} options
   */
  async showQuestion(questionId, options = {}) {
    const { resumeFrom = null } = options;
    
    // 載入草稿
    await this.loadDraft();
    
    // 如果指定從某題繼續，跳過之前的題目
    if (resumeFrom) {
      // 從 resumeFrom 開始
      this.currentQuestionId = resumeFrom;
    } else {
      this.currentQuestionId = questionId;
    }
    
    const question = getQuestion(this.currentQuestionId);
    if (!question) {
      console.error(`Question not found: ${this.currentQuestionId}`);
      return;
    }

    // 檢查是否應該跳過這題
    if (question.skipLogic) {
      const { condition, action } = question.skipLogic;
      if (action === 'skip' && condition(null, this.answers)) {
        // 跳過這題，顯示下一題
        const nextId = getNextQuestionId(this.currentQuestionId, this.answers);
        if (nextId && nextId !== 'jump-to-ad8') {
          return this.showQuestion(nextId);
        }
      }
    }

    this.renderQuestion(question);
  }

  /**
   * 渲染題目
   * @param {object} question
   */
  renderQuestion(question) {
    const currentAnswer = this.answers[question.id] || null;
    
    let html = `
      <div class="userinfo-question" data-question-id="${question.id}">
        <h2 class="userinfo-question__title">${question.question}</h2>
        <div class="userinfo-question__content">
    `;

    // 根據題目類型渲染
    if (question.type === 'radio') {
      html += this.renderRadio(question, currentAnswer);
    } else if (question.type === 'checkbox') {
      html += this.renderCheckbox(question, currentAnswer);
    } else if (question.type === 'number') {
      html += this.renderNumber(question, currentAnswer);
    }

    html += `
        </div>
        <div class="userinfo-question__error" id="question-error-${question.id}"></div>
      </div>
    `;

    this.container.innerHTML = html;

    // 綁定事件
    this.bindEvents(question);
  }

  /**
   * 渲染單選題
   */
  renderRadio(question, currentAnswer) {
    let html = '<div class="radio-group">';
    
    question.options.forEach(option => {
      const isChecked = currentAnswer?.value === option.value;
      const textInputValue = currentAnswer?.textInput || '';
      
      html += `
        <div class="radio-item">
          <input 
            type="radio" 
            id="radio-${question.id}-${option.value}" 
            name="question-${question.id}" 
            value="${option.value}"
            ${isChecked ? 'checked' : ''}
          />
          <label for="radio-${question.id}-${option.value}">${option.label}</label>
        </div>
      `;
      
      // 如果有文字輸入框
      if (option.hasTextInput && isChecked) {
        html += `
          <input 
            type="text" 
            class="input" 
            placeholder="請輸入"
            value="${textInputValue}"
            data-option-value="${option.value}"
            style="margin-left: 28px; margin-top: 8px;"
          />
        `;
      }
    });
    
    html += '</div>';
    return html;
  }

  /**
   * 渲染複選題
   */
  renderCheckbox(question, currentAnswer) {
    let html = '<div class="checkbox-group">';
    
    const selectedValues = currentAnswer?.value || [];
    const textInputs = currentAnswer?.textInputs || {};
    
    question.options.forEach(option => {
      const isChecked = Array.isArray(selectedValues) && selectedValues.includes(option.value);
      const textInputValue = textInputs[option.value] || '';
      
      html += `
        <div class="checkbox-item">
          <input 
            type="checkbox" 
            id="checkbox-${question.id}-${option.value}" 
            name="question-${question.id}" 
            value="${option.value}"
            ${isChecked ? 'checked' : ''}
          />
          <label for="checkbox-${question.id}-${option.value}">${option.label}</label>
        </div>
      `;
      
      // 如果有文字輸入框
      if (option.hasTextInput && isChecked) {
        html += `
          <input 
            type="text" 
            class="input" 
            placeholder="請輸入"
            value="${textInputValue}"
            data-option-value="${option.value}"
            style="margin-left: 28px; margin-top: 8px;"
          />
        `;
      }
    });
    
    html += '</div>';
    return html;
  }

  /**
   * 渲染數字輸入
   */
  renderNumber(question, currentAnswer) {
    const value = currentAnswer?.value || '';
    return `
      <div class="input-group">
        <input 
          type="number" 
          class="input" 
          id="input-${question.id}"
          placeholder="${question.placeholder || ''}"
          value="${value}"
          min="${question.validation?.min || 0}"
          max="${question.validation?.max || ''}"
        />
        ${question.unit ? `<span class="input-unit">${question.unit}</span>` : ''}
      </div>
    `;
  }

  /**
   * 綁定事件
   */
  bindEvents(question) {
    if (question.type === 'radio') {
      const radios = this.container.querySelectorAll(`input[type="radio"][name="question-${question.id}"]`);
      radios.forEach(radio => {
        radio.addEventListener('change', () => {
          this.handleRadioChange(question, radio.value);
        });
      });
    } else if (question.type === 'checkbox') {
      const checkboxes = this.container.querySelectorAll(`input[type="checkbox"][name="question-${question.id}"]`);
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          this.handleCheckboxChange(question);
        });
      });
    } else if (question.type === 'number') {
      const input = this.container.querySelector(`#input-${question.id}`);
      if (input) {
        input.addEventListener('input', () => {
          this.handleNumberChange(question, input.value);
        });
      }
    }

    // 綁定文字輸入框（當選項有 hasTextInput 時）
    const textInputs = this.container.querySelectorAll('input[type="text"][data-option-value]');
    textInputs.forEach(textInput => {
      textInput.addEventListener('input', () => {
        this.handleTextInputChange(question, textInput);
      });
    });
  }

  /**
   * 處理單選變更
   */
  handleRadioChange(question, value) {
    this.answers[question.id] = { value };
    
    // 檢查是否需要顯示文字輸入框
    const option = question.options.find(opt => opt.value === value);
    if (option?.hasTextInput) {
      // 重新渲染以顯示文字輸入框
      this.renderQuestion(question);
      // 恢復文字輸入值
      const textInput = this.container.querySelector(`input[type="text"][data-option-value="${value}"]`);
      if (textInput && this.answers[question.id]?.textInput) {
        textInput.value = this.answers[question.id].textInput;
      }
    } else {
      // 移除文字輸入值
      if (this.answers[question.id]) {
        delete this.answers[question.id].textInput;
      }
    }
    
    this.saveDraft();
  }

  /**
   * 處理複選變更
   */
  handleCheckboxChange(question) {
    const checkboxes = this.container.querySelectorAll(`input[type="checkbox"][name="question-${question.id}"]:checked`);
    const selectedValues = Array.from(checkboxes).map(cb => cb.value);
    
    this.answers[question.id] = {
      value: selectedValues,
      textInputs: this.answers[question.id]?.textInputs || {}
    };
    
    // 檢查是否需要顯示文字輸入框
    const hasTextInputOptions = question.options.filter(opt => opt.hasTextInput && selectedValues.includes(opt.value));
    if (hasTextInputOptions.length > 0) {
      // 重新渲染以顯示文字輸入框
      this.renderQuestion(question);
      // 恢復文字輸入值
      hasTextInputOptions.forEach(option => {
        const textInput = this.container.querySelector(`input[type="text"][data-option-value="${option.value}"]`);
        if (textInput && this.answers[question.id]?.textInputs?.[option.value]) {
          textInput.value = this.answers[question.id].textInputs[option.value];
        }
      });
    }
    
    this.saveDraft();
  }

  /**
   * 處理數字變更
   */
  handleNumberChange(question, value) {
    this.answers[question.id] = { value: value ? parseFloat(value) : '' };
    this.saveDraft();
  }

  /**
   * 處理文字輸入變更
   */
  handleTextInputChange(question, textInput) {
    const optionValue = textInput.getAttribute('data-option-value');
    if (!this.answers[question.id]) {
      this.answers[question.id] = question.type === 'checkbox' 
        ? { value: [], textInputs: {} }
        : { value: optionValue, textInput: '' };
    }
    
    if (question.type === 'checkbox') {
      if (!this.answers[question.id].textInputs) {
        this.answers[question.id].textInputs = {};
      }
      this.answers[question.id].textInputs[optionValue] = textInput.value;
    } else {
      this.answers[question.id].textInput = textInput.value;
    }
    
    this.saveDraft();
  }

  /**
   * 驗證當前題目
   * @returns {object} { valid: boolean, error: string }
   */
  validateCurrentQuestion() {
    const question = getQuestion(this.currentQuestionId);
    if (!question) {
      return { valid: false, error: '題目不存在' };
    }

    if (!question.required) {
      return { valid: true, error: null };
    }

    const answer = this.answers[question.id];
    
    // 檢查是否有答案
    if (!answer || (question.type === 'checkbox' && (!answer.value || answer.value.length === 0))) {
      return { valid: false, error: '請回答此題目' };
    }

    // 檢查文字輸入（如果有）
    if (question.type === 'radio') {
      const option = question.options.find(opt => opt.value === answer.value);
      if (option?.hasTextInput && !answer.textInput?.trim()) {
        return { valid: false, error: '請輸入其他選項的內容' };
      }
    } else if (question.type === 'checkbox') {
      const textInputOptions = question.options.filter(opt => opt.hasTextInput && answer.value.includes(opt.value));
      for (const option of textInputOptions) {
        if (!answer.textInputs?.[option.value]?.trim()) {
          return { valid: false, error: '請輸入其他選項的內容' };
        }
      }
    }

    // 數字驗證
    if (question.type === 'number') {
      const value = answer.value;
      if (value === '' || value === null || value === undefined) {
        return { valid: false, error: '請輸入數字' };
      }
      if (question.validation) {
        const num = parseFloat(value);
        if (question.validation.min !== undefined && num < question.validation.min) {
          return { valid: false, error: `數值不能小於 ${question.validation.min}` };
        }
        if (question.validation.max !== undefined && num > question.validation.max) {
          return { valid: false, error: `數值不能大於 ${question.validation.max}` };
        }
      }
    }

    return { valid: true, error: null };
  }

  /**
   * 顯示錯誤訊息
   */
  showError(message) {
    const errorEl = this.container.querySelector(`#question-error-${this.currentQuestionId}`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  /**
   * 清除錯誤訊息
   */
  clearError() {
    const errorEl = this.container.querySelector(`#question-error-${this.currentQuestionId}`);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  /**
   * 下一步
   */
  async next() {
    // 驗證
    const validation = this.validateCurrentQuestion();
    if (!validation.valid) {
      this.showError(validation.error);
      return false;
    }

    this.clearError();

    // 儲存草稿
    await this.saveDraft();

    // 檢查跳題邏輯
    const question = getQuestion(this.currentQuestionId);
    if (question?.skipLogic?.action === 'jump-to-ad8') {
      const { condition } = question.skipLogic;
      if (condition(this.answers[this.currentQuestionId]?.value, this.answers)) {
        // 跳轉到 AD8
        if (this.onNext) {
          this.onNext('jump-to-ad8');
        }
        return true;
      }
    }

    // 取得下一題
    const nextId = getNextQuestionId(this.currentQuestionId, this.answers);
    
    if (!nextId) {
      // 沒有下一題，完成
      if (this.onComplete) {
        this.onComplete();
      }
      return true;
    }

    if (nextId === 'jump-to-ad8') {
      // 跳轉到 AD8
      if (this.onNext) {
        this.onNext('jump-to-ad8');
      }
      return true;
    }

    // 顯示下一題
    await this.showQuestion(nextId);
    
    if (this.onNext) {
      this.onNext(nextId);
    }

    return true;
  }

  /**
   * 取得所有答案
   * @returns {object}
   */
  getAnswers() {
    return this.answers;
  }

  /**
   * 設定答案（用於恢復狀態）
   * @param {object} answers
   */
  setAnswers(answers) {
    this.answers = answers || {};
  }
}

export default UserInfoEngine;

