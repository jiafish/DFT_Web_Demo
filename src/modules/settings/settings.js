/**
 * Settings 模組
 */

import Storage from '../../shared/utils/storage.js';
import toast from '../../shared/components/toast.js';
import './settings.css';

const SettingsModule = {
  async init(container) {
    this.container = container;
    this.render();
  },

  render() {
    this.container.innerHTML = `
      <div class="settings-page scrollable-content">
        <h1 class="settings-page__title">設定</h1>
        
        <div class="settings-section">
          <h2 class="settings-section__title">外觀</h2>
          <div class="settings-item">
            <span class="settings-item__label">主題</span>
            <button class="settings-item__action" id="theme-toggle">
              淺色
            </button>
          </div>
        </div>
        
        <div class="settings-section">
          <h2 class="settings-section__title">語言</h2>
          <div class="settings-item">
            <span class="settings-item__label">語言</span>
            <button class="settings-item__action" id="language-toggle">
              繁體中文
            </button>
          </div>
        </div>
        
        <div class="settings-section">
          <h2 class="settings-section__title">資料</h2>
          <div class="settings-item">
            <span class="settings-item__label">資料清除</span>
            <button class="settings-item__action danger" id="clear-data">
              清除所有資料
            </button>
          </div>
        </div>
      </div>
    `;
    
    // 綁定事件
    const themeToggle = this.container.querySelector('#theme-toggle');
    const languageToggle = this.container.querySelector('#language-toggle');
    const clearDataBtn = this.container.querySelector('#clear-data');
    
    themeToggle.addEventListener('click', () => {
      // UI 切換（功能可先不做）
      toast.info('主題切換功能開發中');
    });
    
    languageToggle.addEventListener('click', () => {
      // UI 切換（功能可先不做）
      toast.info('語言切換功能開發中');
    });
    
    clearDataBtn.addEventListener('click', () => {
      if (confirm('確定要清除所有資料嗎？此操作無法復原。')) {
        // 清除所有資料
        Storage.clear();
        toast.success('所有資料已清除');
        // 重新載入頁面
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }
};

export default SettingsModule;

