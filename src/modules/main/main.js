/**
 * Main 模組
 */

import router from '../../shared/utils/router.js';
import './main.css';

const MainModule = {
  async init(container) {
    this.container = container;
    this.render();
  },

  render() {
    this.container.innerHTML = `
      <div class="main-page scrollable-content">
        <h1 class="main-page__title">照護助手</h1>
        <p class="main-page__subtitle">為您提供專業的照護支援與建議</p>
        
        <div class="main-page__cards">
          <a href="#/user-info" class="main-page__card card-clickable" data-route="/user-info">
            <div class="main-page__card-icon">👤</div>
            <h3 class="main-page__card-title">個人化設定</h3>
            <p class="main-page__card-description">
              填寫個人與患者資訊，讓 Caremate 為您客製化最適合的照護建議
            </p>
          </a>
          
          <a href="#/ad8" class="main-page__card card-clickable" data-route="/ad8">
            <div class="main-page__card-icon">🧠</div>
            <h3 class="main-page__card-title">失智檢測（AD8）</h3>
            <p class="main-page__card-description">
              2 分鐘快速失智檢測，及早掌握患者狀況
            </p>
          </a>
          
          <a href="#/journal" class="main-page__card card-clickable" data-route="/journal">
            <div class="main-page__card-icon">📝</div>
            <h3 class="main-page__card-title">照護日誌</h3>
            <p class="main-page__card-description">
              記錄每日照護狀況，追蹤患者健康變化
            </p>
          </a>
        </div>
      </div>
    `;

    // 綁定點擊事件
    const cards = this.container.querySelectorAll('.main-page__card[data-route]');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const route = card.getAttribute('data-route');
        router.navigate(route);
      });
    });
  }
};

export default MainModule;

