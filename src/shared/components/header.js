/**
 * AppHeader 元件
 */

class AppHeader {
  constructor(container) {
    this.container = container;
    this.onBackClick = null;
    this.onMenuClick = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="app-header">
        <div class="app-header__left">
          <button class="app-header__back-btn" id="header-back-btn" style="display: none;">
            ←
          </button>
          <button class="app-header__menu-btn" id="header-menu-btn">
            ☰
          </button>
        </div>
        <div class="app-header__center" id="header-title">
          首頁
        </div>
        <div class="app-header__right"></div>
      </div>
    `;

    // 綁定事件
    const backBtn = this.container.querySelector('#header-back-btn');
    const menuBtn = this.container.querySelector('#header-menu-btn');

    backBtn.addEventListener('click', () => {
      if (this.onBackClick) {
        this.onBackClick();
      }
    });

    menuBtn.addEventListener('click', () => {
      if (this.onMenuClick) {
        this.onMenuClick();
      }
    });
  }

  /**
   * 設定標題
   * @param {string} title
   */
  setTitle(title) {
    const titleEl = this.container.querySelector('#header-title');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  /**
   * 顯示/隱藏返回按鈕
   * @param {boolean} show
   */
  showBackButton(show) {
    const backBtn = this.container.querySelector('#header-back-btn');
    if (backBtn) {
      backBtn.style.display = show ? 'block' : 'none';
    }
  }

  /**
   * 設定返回按鈕點擊事件
   * @param {Function} callback
   */
  setOnBackClick(callback) {
    this.onBackClick = callback;
  }

  /**
   * 設定選單按鈕點擊事件
   * @param {Function} callback
   */
  setOnMenuClick(callback) {
    this.onMenuClick = callback;
  }
}

export default AppHeader;

