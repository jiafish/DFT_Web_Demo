/**
 * Sidebar/Drawer 元件
 */

import router from '../utils/router.js';

class Sidebar {
  constructor(container) {
    this.container = container;
    this.overlay = null;
    this.isOpen = false;
    this.render();
    this.setupEventListeners();
  }

  render() {
    // 建立 overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'sidebar-overlay';
    document.body.appendChild(this.overlay);

    // Sidebar 內容
    this.container.innerHTML = `
      <nav class="app-sidebar">
        <ul class="sidebar-nav">
          <li class="sidebar-nav__item">
            <a href="#/main" class="sidebar-nav__link" data-route="/main">
              首頁
            </a>
          </li>
          <li class="sidebar-nav__item">
            <a href="#/user-info" class="sidebar-nav__link" data-route="/user-info">
              個人化設定
            </a>
          </li>
          <li class="sidebar-nav__item">
            <a href="#/ad8" class="sidebar-nav__link" data-route="/ad8">
              失智檢測（AD8）
            </a>
          </li>
          <li class="sidebar-nav__item">
            <a href="#/journal" class="sidebar-nav__link" data-route="/journal">
              照護日誌
            </a>
          </li>
        </ul>
        <div class="sidebar-nav__footer">
          <ul class="sidebar-nav">
            <li class="sidebar-nav__item">
              <a href="#/settings" class="sidebar-nav__link" data-route="/settings">
                設定
              </a>
            </li>
            <li class="sidebar-nav__item">
              <a href="#/account" class="sidebar-nav__link" data-route="/account">
                帳號資訊
              </a>
            </li>
            <li class="sidebar-nav__item">
              <a href="#" class="sidebar-nav__link" id="sidebar-logout">
                登出
              </a>
            </li>
          </ul>
        </div>
      </nav>
    `;

    // 綁定連結點擊事件
    const links = this.container.querySelectorAll('.sidebar-nav__link[data-route]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        router.navigate(route);
        this.close();
      });
    });

    // 綁定登出按鈕
    const logoutBtn = this.container.querySelector('#sidebar-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }

    // 綁定 overlay 點擊事件
    this.overlay.addEventListener('click', () => {
      this.close();
    });
  }

  setupEventListeners() {
    // 監聽路由變化，更新 active 狀態
    router.afterEach((path) => {
      this.updateActiveLink(path);
    });
  }

  /**
   * 更新 active 連結
   * @param {string} currentPath
   */
  updateActiveLink(currentPath) {
    const links = this.container.querySelectorAll('.sidebar-nav__link[data-route]');
    links.forEach(link => {
      const route = link.getAttribute('data-route');
      if (route === currentPath) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  /**
   * 開啟 sidebar
   */
  open() {
    this.isOpen = true;
    const sidebar = this.container.querySelector('.app-sidebar');
    if (sidebar) {
      sidebar.classList.add('is-open');
    }
    if (this.overlay) {
      this.overlay.classList.add('is-visible');
    }
    document.body.style.overflow = 'hidden';
  }

  /**
   * 關閉 sidebar
   */
  close() {
    this.isOpen = false;
    const sidebar = this.container.querySelector('.app-sidebar');
    if (sidebar) {
      sidebar.classList.remove('is-open');
    }
    if (this.overlay) {
      this.overlay.classList.remove('is-visible');
    }
    document.body.style.overflow = '';
  }

  /**
   * 切換 sidebar
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * 處理登出
   */
  handleLogout() {
    if (confirm('確定要登出嗎？')) {
      // 清除所有資料
      import('../utils/storage.js').then(({ default: Storage }) => {
        Storage.clear();
        // 清除 session
        Storage.remove(Storage.KEYS.SESSION);
      });
      
      // 導向首頁
      router.navigate('/main');
      this.close();
    }
  }
}

export default Sidebar;

