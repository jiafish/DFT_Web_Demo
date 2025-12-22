/**
 * Toast 提示元件
 */

class Toast {
  /**
   * 顯示 Toast
   * @param {string} message
   * @param {string} type - 'success' | 'error' | 'info'
   * @param {number} duration - 顯示時間（毫秒）
   */
  show(message, type = 'info', duration = 3000) {
    // 移除現有的 toast
    const existing = document.querySelector('.toast');
    if (existing) {
      existing.remove();
    }

    // 建立 toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // 自動移除
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  /**
   * 顯示成功訊息
   * @param {string} message
   * @param {number} duration
   */
  success(message, duration = 3000) {
    this.show(message, 'success', duration);
  }

  /**
   * 顯示錯誤訊息
   * @param {string} message
   * @param {number} duration
   */
  error(message, duration = 3000) {
    this.show(message, 'error', duration);
  }

  /**
   * 顯示資訊訊息
   * @param {string} message
   * @param {number} duration
   */
  info(message, duration = 3000) {
    this.show(message, 'info', duration);
  }
}

// 建立單例
const toast = new Toast();

export default toast;

