/**
 * Account 模組
 */

import { api } from '../../shared/utils/api.js';
import Storage from '../../shared/utils/storage.js';
import './account.css';

const AccountModule = {
  async init(container) {
    this.container = container;
    await this.loadUserData();
    this.render();
  },

  async loadUserData() {
    try {
      const response = await api.get('/users/me');
      this.userData = await response.json();
    } catch (error) {
      console.error('Failed to load user data:', error);
      // 使用假資料
      this.userData = {
        name: '測試使用者',
        email: 'test@example.com',
        onboardingCompleted: false
      };
    }
    
    // 檢查是否完成個人化設定
    const submitted = Storage.get(Storage.KEYS.ONBOARDING_SUBMITTED, false);
    this.userData.onboardingCompleted = submitted;
  },

  render() {
    const { name = '測試使用者', email = 'test@example.com', onboardingCompleted = false } = this.userData || {};
    
    this.container.innerHTML = `
      <div class="account-page scrollable-content">
        <h1 class="account-page__title">帳號資訊</h1>
        
        <div class="account-section">
          <h2 class="account-section__title">基本資訊</h2>
          <div class="account-item">
            <span class="account-item__label">姓名</span>
            <span class="account-item__value">${name}</span>
          </div>
          <div class="account-item">
            <span class="account-item__label">電子郵件</span>
            <span class="account-item__value">${email}</span>
          </div>
        </div>
        
        <div class="account-section">
          <h2 class="account-section__title">設定狀態</h2>
          <div class="account-item">
            <span class="account-item__label">個人化設定</span>
            <span class="account-item__value">
              ${onboardingCompleted ? `
                <span class="account-item__badge">已完成</span>
              ` : `
                <span class="account-item__badge incomplete">未完成</span>
              `}
            </span>
          </div>
        </div>
      </div>
    `;
  }
};

export default AccountModule;

