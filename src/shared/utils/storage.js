/**
 * localStorage 封裝工具
 */

const Storage = {
  /**
   * 取得資料
   * @param {string} key
   * @param {*} defaultValue
   * @returns {*}
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * 儲存資料
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  /**
   * 移除資料
   * @param {string} key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  /**
   * 清除所有資料
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  /**
   * 檢查 key 是否存在
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  }
};

// 預定義的 keys
Storage.KEYS = {
  SESSION: 'caremate.session',
  ONBOARDING_DRAFT: 'caremate.onboarding.draft',
  ONBOARDING_SUBMITTED: 'caremate.onboarding.submitted',
  AD8_LAST_RESULT: 'caremate.ad8.lastResult',
  JOURNAL_ENTRIES: 'caremate.journal.entries'
};

export default Storage;

