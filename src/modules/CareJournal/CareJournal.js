/**
 * CareJournal 模組
 */

import router from '../../shared/utils/router.js';
import { api } from '../../shared/utils/api.js';
import bottomSheet from '../../shared/components/bottomSheet.js';
import toast from '../../shared/components/toast.js';
import './CareJournal.css';

const CareJournalModule = {
  async init(container, { header, footer }) {
    this.container = container;
    this.header = header;
    this.footer = footer;
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.entries = {};
    
    // 綁定 footer 按鈕
    const footerBtn = footer.querySelector('#footer-primary-btn');
    if (footerBtn) {
      footerBtn.textContent = '新增日誌';
      footerBtn.onclick = () => {
        this.showAddEntryForm();
      };
    }
    
    // 載入資料
    await this.loadEntries();
    
    // 顯示日曆
    this.renderCalendar();
  },

  /**
   * 載入日誌資料
   */
  async loadEntries() {
    try {
      const month = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}`;
      const response = await api.get(`/care-journal/month?month=${month}`);
      const data = await response.json();
      if (data.entries) {
        this.entries = data.entries;
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  },

  /**
   * 渲染日曆
   */
  renderCalendar() {
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                       '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    
    // 取得當月第一天和最後一天
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    // 取得上個月的天數
    const prevMonth = new Date(this.currentYear, this.currentMonth, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    // 建立日曆 HTML
    let calendarHTML = `
      <div class="carejournal-calendar scrollable-content">
        <div class="carejournal-calendar__header">
          <h2 class="carejournal-calendar__month">
            ${this.currentYear}年 ${monthNames[this.currentMonth]}
          </h2>
          <div class="carejournal-calendar__nav">
            <button class="carejournal-calendar__nav-btn" id="prev-month">← 上個月</button>
            <button class="carejournal-calendar__nav-btn" id="next-month">下個月 →</button>
          </div>
        </div>
        
        <div class="carejournal-calendar__weekdays">
          ${weekdays.map(day => `<div class="carejournal-calendar__weekday">${day}</div>`).join('')}
        </div>
        
        <div class="carejournal-calendar__days">
    `;
    
    // 上個月的日期
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const dateStr = `${this.currentYear}-${String(this.currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasEntry = this.entries[dateStr];
      calendarHTML += `
        <div class="carejournal-calendar__day is-other-month" data-date="${dateStr}">
          ${day}
        </div>
      `;
    }
    
    // 當月的日期
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasEntry = this.entries[dateStr];
      const isToday = dateStr === todayStr;
      
      let classes = 'carejournal-calendar__day';
      if (isToday) classes += ' is-today';
      if (hasEntry) classes += ' has-entry';
      
      calendarHTML += `
        <div class="${classes}" data-date="${dateStr}">
          ${day}
        </div>
      `;
    }
    
    // 下個月的日期（填滿到 42 格）
    const totalCells = firstDayOfWeek + daysInMonth;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 2).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      calendarHTML += `
        <div class="carejournal-calendar__day is-other-month" data-date="${dateStr}">
          ${day}
        </div>
      `;
    }
    
    calendarHTML += `
        </div>
      </div>
    `;
    
    this.container.innerHTML = calendarHTML;
    
    // 綁定事件
    const prevBtn = this.container.querySelector('#prev-month');
    const nextBtn = this.container.querySelector('#next-month');
    const dayCells = this.container.querySelectorAll('.carejournal-calendar__day[data-date]');
    
    prevBtn.addEventListener('click', () => {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.loadEntries().then(() => this.renderCalendar());
    });
    
    nextBtn.addEventListener('click', () => {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.loadEntries().then(() => this.renderCalendar());
    });
    
    dayCells.forEach(cell => {
      cell.addEventListener('click', () => {
        const date = cell.getAttribute('data-date');
        if (date && !cell.classList.contains('is-other-month')) {
          this.showEntryDetail(date);
        }
      });
    });
  },

  /**
   * 顯示新增日誌表單
   */
  showAddEntryForm() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const formHTML = `
      <div class="carejournal-entry-form">
        <div class="input-group">
          <label class="input-label required">個案狀況</label>
          <textarea 
            class="textarea" 
            id="entry-condition" 
            placeholder="請描述今日的個案狀況..."
            rows="6"
          ></textarea>
          <div class="carejournal-entry-form__error" id="error-condition">此欄位為必填</div>
        </div>
        
        <div class="input-group">
          <label class="input-label required">健康自評</label>
          <div class="health-rating-options">
            <label class="health-rating-option">
              <input type="radio" name="health-rating" value="good" />
              良好
            </label>
            <label class="health-rating-option">
              <input type="radio" name="health-rating" value="fair" />
              尚可
            </label>
            <label class="health-rating-option">
              <input type="radio" name="health-rating" value="poor" />
              糟糕
            </label>
          </div>
          <div class="carejournal-entry-form__error" id="error-rating">此欄位為必填</div>
        </div>
      </div>
    `;
    
    const footerHTML = `
      <button class="btn btn-primary btn-full" id="submit-entry">儲存</button>
    `;
    
    bottomSheet.open({
      title: '新增日誌',
      content: formHTML,
      footer: footerHTML,
      onClose: () => {
        // 清除表單
      }
    });
    
    // 綁定表單事件
    const conditionInput = document.getElementById('entry-condition');
    const ratingInputs = document.querySelectorAll('input[name="health-rating"]');
    const submitBtn = document.getElementById('submit-entry');
    
    // 更新選項樣式
    ratingInputs.forEach(input => {
      input.addEventListener('change', () => {
        document.querySelectorAll('.health-rating-option').forEach(opt => {
          opt.classList.remove('is-selected');
        });
        const selected = input.closest('.health-rating-option');
        if (selected) {
          selected.classList.add('is-selected');
        }
        this.validateForm();
      });
    });
    
    // 驗證表單
    const validateForm = () => {
      const condition = conditionInput.value.trim();
      const rating = document.querySelector('input[name="health-rating"]:checked')?.value;
      
      let isValid = true;
      
      // 驗證個案狀況
      const errorCondition = document.getElementById('error-condition');
      if (!condition) {
        errorCondition.classList.add('is-visible');
        isValid = false;
      } else {
        errorCondition.classList.remove('is-visible');
      }
      
      // 驗證健康自評
      const errorRating = document.getElementById('error-rating');
      if (!rating) {
        errorRating.classList.add('is-visible');
        isValid = false;
      } else {
        errorRating.classList.remove('is-visible');
      }
      
      submitBtn.disabled = !isValid;
      return isValid;
    };
    
    this.validateForm = validateForm;
    
    conditionInput.addEventListener('input', validateForm);
    submitBtn.addEventListener('click', async () => {
      if (!validateForm()) {
        return;
      }
      
      const condition = conditionInput.value.trim();
      const rating = document.querySelector('input[name="health-rating"]:checked').value;
      
      try {
        const response = await api.post('/care-journal/entry', {
          date: dateStr,
          condition,
          healthRating: rating,
          questions: []
        });
        
        const result = await response.json();
        if (result.success) {
          toast.success('日誌已儲存');
          bottomSheet.close();
          await this.loadEntries();
          this.renderCalendar();
        } else {
          toast.error('儲存失敗，請稍後再試');
        }
      } catch (error) {
        console.error('Failed to save entry:', error);
        toast.error('儲存失敗，請稍後再試');
      }
    });
    
    // 初始驗證
    validateForm();
  },

  /**
   * 顯示日誌詳情
   */
  async showEntryDetail(dateStr) {
    try {
      const response = await api.get(`/care-journal/day?date=${dateStr}`);
      const data = await response.json();
      const entry = data.entry;
      
      const date = new Date(dateStr);
      const dateFormatted = `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日`;
      
      let detailHTML = `
        <div class="carejournal-entry-detail">
          <div class="carejournal-entry-detail__section">
            <h3 class="carejournal-entry-detail__section-title">日期</h3>
            <p class="carejournal-entry-detail__content">${dateFormatted}</p>
          </div>
          
          <div class="carejournal-entry-detail__section">
            <h3 class="carejournal-entry-detail__section-title">個案狀況</h3>
            ${entry && entry.condition ? `
              <p class="carejournal-entry-detail__content">${entry.condition}</p>
            ` : `
              <p class="carejournal-entry-detail__empty">今天尚未新增狀況紀錄</p>
            `}
          </div>
          
          <div class="carejournal-entry-detail__section">
            <h3 class="carejournal-entry-detail__section-title">健康自評</h3>
            ${entry && entry.healthRating ? `
              <p class="carejournal-entry-detail__content">
                ${entry.healthRating === 'good' ? '良好' : 
                  entry.healthRating === 'fair' ? '尚可' : '糟糕'}
              </p>
            ` : `
              <p class="carejournal-entry-detail__empty">尚未評分</p>
            `}
          </div>
          
          <div class="carejournal-entry-detail__section">
            <h3 class="carejournal-entry-detail__section-title">當日問題詢問記錄</h3>
            ${entry && entry.questions && entry.questions.length > 0 ? `
              <ul class="carejournal-entry-detail__content">
                ${entry.questions.map(q => `<li>${q}</li>`).join('')}
              </ul>
            ` : `
              <p class="carejournal-entry-detail__empty">今天還沒有提問紀錄</p>
            `}
          </div>
        </div>
      `;
      
      bottomSheet.open({
        title: '日誌詳情',
        content: detailHTML
      });
    } catch (error) {
      console.error('Failed to load entry:', error);
      toast.error('載入失敗，請稍後再試');
    }
  }
};

export default CareJournalModule;

