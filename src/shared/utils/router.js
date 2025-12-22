/**
 * Hash Router 實作
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.currentParams = {};
    this.currentQuery = {};
    this.beforeEach = null;
    this.afterEach = null;
    
    // 監聽 hashchange 事件
    window.addEventListener('hashchange', () => {
      this.handleRoute();
    });
    
    // 如果 DOM 已經載入，立即處理路由
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => {
        this.handleRoute();
      });
    } else {
      // DOM 已經載入，延遲執行以確保路由已註冊
      setTimeout(() => {
        this.handleRoute();
      }, 0);
    }
  }

  /**
   * 註冊路由
   * @param {string} path
   * @param {Function} handler
   */
  route(path, handler) {
    this.routes.set(path, handler);
  }

  /**
   * 解析 URL
   * @returns {{path: string, query: object, params: object}}
   */
  parseUrl() {
    const hash = window.location.hash.slice(1) || '/main';
    const [path, queryString] = hash.split('?');
    
    const query = {};
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key) {
          query[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
      });
    }
    
    return { path, query, params: {} };
  }

  /**
   * 處理路由
   */
  async handleRoute() {
    const { path, query } = this.parseUrl();
    
    // 執行 beforeEach hook
    if (this.beforeEach) {
      const result = await this.beforeEach(path, query);
      if (result === false) {
        return; // 阻止導航
      }
    }
    
    // 尋找匹配的路由
    let matched = false;
    for (const [routePath, handler] of this.routes.entries()) {
      if (this.matchRoute(routePath, path)) {
        this.currentRoute = path;
        this.currentQuery = query;
        matched = true;
        
        try {
          await handler(path, query);
        } catch (error) {
          console.error('Route handler error:', error);
        }
        
        // 執行 afterEach hook
        if (this.afterEach) {
          this.afterEach(path, query);
        }
        
        break;
      }
    }
    
    // 如果沒有匹配的路由，導向預設路由
    if (!matched) {
      this.navigate('/main');
    }
  }

  /**
   * 匹配路由
   * @param {string} routePath
   * @param {string} currentPath
   * @returns {boolean}
   */
  matchRoute(routePath, currentPath) {
    // 精確匹配
    if (routePath === currentPath) {
      return true;
    }
    
    // 支援動態參數（如 /user/:id）
    const routeParts = routePath.split('/');
    const pathParts = currentPath.split('/');
    
    if (routeParts.length !== pathParts.length) {
      return false;
    }
    
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        continue; // 動態參數，跳過
      }
      if (routeParts[i] !== pathParts[i]) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * 導航到指定路由
   * @param {string} path
   * @param {object} query
   */
  navigate(path, query = {}) {
    let url = `#${path}`;
    
    const queryString = Object.entries(query)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    if (queryString) {
      url += `?${queryString}`;
    }
    
    window.location.hash = url;
  }

  /**
   * 取得當前路由
   * @returns {string}
   */
  getCurrentRoute() {
    return this.currentRoute || this.parseUrl().path;
  }

  /**
   * 取得當前 query 參數
   * @returns {object}
   */
  getCurrentQuery() {
    return this.currentQuery || this.parseUrl().query;
  }

  /**
   * 設定 beforeEach hook
   * @param {Function} fn
   */
  beforeEach(fn) {
    this.beforeEach = fn;
  }

  /**
   * 設定 afterEach hook
   * @param {Function} fn
   */
  afterEach(fn) {
    this.afterEach = fn;
  }
}

// 建立單例
const router = new Router();

export default router;

