/**
 * Bottom Sheet 元件
 */

class BottomSheet {
  constructor() {
    this.container = null;
    this.overlay = null;
    this.isOpen = false;
    this.onClose = null;
  }

  /**
   * 建立 Bottom Sheet
   */
  create() {
    // 建立 overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'sidebar-overlay';
    this.overlay.style.zIndex = '400';
    
    // 建立 bottom sheet
    this.container = document.createElement('div');
    this.container.className = 'bottom-sheet';
    
    document.body.appendChild(this.overlay);
    document.body.appendChild(this.container);

    // 綁定事件
    this.overlay.addEventListener('click', () => {
      this.close();
    });

    // 點擊 bottom sheet 本身不關閉
    this.container.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  /**
   * 開啟 Bottom Sheet
   * @param {object} options
   */
  open(options = {}) {
    if (!this.container) {
      this.create();
    }

    const {
      title = '',
      content = '',
      footer = '',
      onClose = null
    } = options;

    this.onClose = onClose;

    this.container.innerHTML = `
      <div class="bottom-sheet__handle"></div>
      ${title ? `
        <div class="bottom-sheet__header">
          <h3 class="bottom-sheet__title">${title}</h3>
          <button class="bottom-sheet__close" id="bottom-sheet-close">×</button>
        </div>
      ` : ''}
      <div class="bottom-sheet__body" id="bottom-sheet-body">
        ${content}
      </div>
      ${footer ? `
        <div class="bottom-sheet__footer" id="bottom-sheet-footer">
          ${footer}
        </div>
      ` : ''}
    `;

    // 綁定關閉按鈕
    const closeBtn = this.container.querySelector('#bottom-sheet-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.close();
      });
    }

    // 顯示
    this.isOpen = true;
    this.container.classList.add('is-open');
    this.overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';

    // 觸發動畫
    setTimeout(() => {
      this.container.style.transform = 'translateY(0)';
    }, 10);
  }

  /**
   * 關閉 Bottom Sheet
   */
  close() {
    if (!this.container) return;

    this.isOpen = false;
    this.container.classList.remove('is-open');
    this.overlay.classList.remove('is-visible');
    document.body.style.overflow = '';

    if (this.onClose) {
      this.onClose();
    }

    // 延遲移除 DOM（等待動畫完成）
    setTimeout(() => {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      this.container = null;
      this.overlay = null;
    }, 300);
  }

  /**
   * 更新內容
   * @param {string} content
   */
  updateContent(content) {
    const body = this.container?.querySelector('#bottom-sheet-body');
    if (body) {
      body.innerHTML = content;
    }
  }

  /**
   * 更新 footer
   * @param {string} footer
   */
  updateFooter(footer) {
    const footerEl = this.container?.querySelector('#bottom-sheet-footer');
    if (footerEl) {
      footerEl.innerHTML = footer;
    } else if (footer) {
      // 如果 footer 不存在，建立它
      const body = this.container?.querySelector('#bottom-sheet-body');
      if (body && this.container) {
        const footerDiv = document.createElement('div');
        footerDiv.className = 'bottom-sheet__footer';
        footerDiv.id = 'bottom-sheet-footer';
        footerDiv.innerHTML = footer;
        this.container.appendChild(footerDiv);
      }
    }
  }

  /**
   * 取得 body 元素
   * @returns {HTMLElement|null}
   */
  getBody() {
    return this.container?.querySelector('#bottom-sheet-body');
  }

  /**
   * 取得 footer 元素
   * @returns {HTMLElement|null}
   */
  getFooter() {
    return this.container?.querySelector('#bottom-sheet-footer');
  }
}

// 建立單例
const bottomSheet = new BottomSheet();

export default bottomSheet;

