/**
 * Mock API Client
 * 模擬 API 呼叫，實際資料儲存在 localStorage
 */

import Storage from './storage.js';

const API_BASE_URL = '/api';

// 模擬延遲
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API 類別
 */
class MockAPI {
  /**
   * 通用 fetch 方法
   * @param {string} endpoint
   * @param {object} options
   * @returns {Promise<Response>}
   */
  async fetch(endpoint, options = {}) {
    await delay();
    
    const url = `${API_BASE_URL}${endpoint}`;
    const method = options.method || 'GET';
    
    try {
      let response;
      
      switch (method) {
        case 'GET':
          response = await this.handleGet(endpoint);
          break;
        case 'POST':
          response = await this.handlePost(endpoint, options.body);
          break;
        case 'PUT':
          response = await this.handlePut(endpoint, options.body);
          break;
        case 'DELETE':
          response = await this.handleDelete(endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      return {
        ok: true,
        status: 200,
        json: async () => response,
        text: async () => JSON.stringify(response)
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        json: async () => ({ error: error.message }),
        text: async () => JSON.stringify({ error: error.message })
      };
    }
  }

  /**
   * 處理 GET 請求
   */
  async handleGet(endpoint) {
    if (endpoint === '/users/me') {
      return {
        id: 'user-001',
        name: '測試使用者',
        email: 'test@example.com',
        onboardingCompleted: Storage.get(Storage.KEYS.ONBOARDING_SUBMITTED, false)
      };
    }
    
    if (endpoint === '/onboarding/draft') {
      return Storage.get(Storage.KEYS.ONBOARDING_DRAFT, {});
    }
    
    if (endpoint.startsWith('/care-journal/month')) {
      const params = new URLSearchParams(endpoint.split('?')[1] || '');
      const month = params.get('month') || new Date().toISOString().slice(0, 7);
      const entries = Storage.get(Storage.KEYS.JOURNAL_ENTRIES, {});
      
      // 過濾該月份的記錄
      const monthEntries = {};
      Object.keys(entries).forEach(date => {
        if (date.startsWith(month)) {
          monthEntries[date] = entries[date];
        }
      });
      
      return { entries: monthEntries };
    }
    
    if (endpoint.startsWith('/care-journal/day')) {
      const params = new URLSearchParams(endpoint.split('?')[1] || '');
      const date = params.get('date') || new Date().toISOString().slice(0, 10);
      const entries = Storage.get(Storage.KEYS.JOURNAL_ENTRIES, {});
      
      return { entry: entries[date] || null };
    }
    
    throw new Error(`Unknown GET endpoint: ${endpoint}`);
  }

  /**
   * 處理 POST 請求
   */
  async handlePost(endpoint, body) {
    const data = typeof body === 'string' ? JSON.parse(body) : body;
    
    if (endpoint === '/onboarding/submit') {
      Storage.set(Storage.KEYS.ONBOARDING_SUBMITTED, true);
      Storage.set(Storage.KEYS.ONBOARDING_DRAFT, data);
      return { success: true, message: '個人化設定已提交' };
    }
    
    if (endpoint === '/assessments/ad8') {
      const result = {
        score: data.score,
        answers: data.answers,
        timestamp: new Date().toISOString()
      };
      Storage.set(Storage.KEYS.AD8_LAST_RESULT, result);
      return result;
    }
    
    if (endpoint === '/care-journal/entry') {
      const entries = Storage.get(Storage.KEYS.JOURNAL_ENTRIES, {});
      const date = data.date || new Date().toISOString().slice(0, 10);
      
      entries[date] = {
        date,
        condition: data.condition,
        healthRating: data.healthRating,
        questions: data.questions || [],
        createdAt: new Date().toISOString()
      };
      
      Storage.set(Storage.KEYS.JOURNAL_ENTRIES, entries);
      return { success: true, entry: entries[date] };
    }
    
    throw new Error(`Unknown POST endpoint: ${endpoint}`);
  }

  /**
   * 處理 PUT 請求
   */
  async handlePut(endpoint, body) {
    const data = typeof body === 'string' ? JSON.parse(body) : body;
    
    if (endpoint === '/onboarding/draft') {
      Storage.set(Storage.KEYS.ONBOARDING_DRAFT, data);
      return { success: true, message: '草稿已儲存' };
    }
    
    throw new Error(`Unknown PUT endpoint: ${endpoint}`);
  }

  /**
   * 處理 DELETE 請求
   */
  async handleDelete(endpoint) {
    throw new Error(`Unknown DELETE endpoint: ${endpoint}`);
  }
}

// 建立單例
const mockAPI = new MockAPI();

/**
 * 包裝原生 fetch，使用 mock API
 */
export async function fetch(endpoint, options = {}) {
  return mockAPI.fetch(endpoint, options);
}

/**
 * 便利方法
 */
export const api = {
  get: (endpoint) => fetch(endpoint, { method: 'GET' }),
  post: (endpoint, data) => fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => fetch(endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => fetch(endpoint, { method: 'DELETE' })
};

export default api;

