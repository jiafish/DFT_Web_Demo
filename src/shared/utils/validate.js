/**
 * 驗證工具
 */

const Validate = {
  /**
   * 檢查是否為空
   * @param {*} value
   * @returns {boolean}
   */
  isEmpty(value) {
    if (value === null || value === undefined) {
      return true;
    }
    if (typeof value === 'string') {
      return value.trim().length === 0;
    }
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }
    return false;
  },

  /**
   * 檢查必填欄位
   * @param {*} value
   * @param {string} fieldName
   * @returns {string|null}
   */
  required(value, fieldName = '此欄位') {
    if (this.isEmpty(value)) {
      return `${fieldName}為必填`;
    }
    return null;
  },

  /**
   * 檢查數字
   * @param {*} value
   * @param {string} fieldName
   * @returns {string|null}
   */
  number(value, fieldName = '此欄位') {
    if (this.isEmpty(value)) {
      return null; // 空值由 required 處理
    }
    if (isNaN(value) || isNaN(parseFloat(value))) {
      return `${fieldName}必須為數字`;
    }
    return null;
  },

  /**
   * 檢查整數
   * @param {*} value
   * @param {string} fieldName
   * @returns {string|null}
   */
  integer(value, fieldName = '此欄位') {
    if (this.isEmpty(value)) {
      return null;
    }
    const num = parseFloat(value);
    if (isNaN(num) || !Number.isInteger(num)) {
      return `${fieldName}必須為整數`;
    }
    return null;
  },

  /**
   * 檢查範圍
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @param {string} fieldName
   * @returns {string|null}
   */
  range(value, min, max, fieldName = '此欄位') {
    if (this.isEmpty(value)) {
      return null;
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return `${fieldName}必須為數字`;
    }
    if (num < min || num > max) {
      return `${fieldName}必須在 ${min} 到 ${max} 之間`;
    }
    return null;
  },

  /**
   * 檢查 Email
   * @param {string} value
   * @param {string} fieldName
   * @returns {string|null}
   */
  email(value, fieldName = 'Email') {
    if (this.isEmpty(value)) {
      return null;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return `${fieldName}格式不正確`;
    }
    return null;
  },

  /**
   * 檢查最小長度
   * @param {string} value
   * @param {number} minLength
   * @param {string} fieldName
   * @returns {string|null}
   */
  minLength(value, minLength, fieldName = '此欄位') {
    if (this.isEmpty(value)) {
      return null;
    }
    if (value.length < minLength) {
      return `${fieldName}至少需要 ${minLength} 個字元`;
    }
    return null;
  },

  /**
   * 檢查最大長度
   * @param {string} value
   * @param {number} maxLength
   * @param {string} fieldName
   * @returns {string|null}
   */
  maxLength(value, maxLength, fieldName = '此欄位') {
    if (this.isEmpty(value)) {
      return null;
    }
    if (value.length > maxLength) {
      return `${fieldName}最多 ${maxLength} 個字元`;
    }
    return null;
  },

  /**
   * 驗證表單
   * @param {object} data
   * @param {object} rules
   * @returns {object} { valid: boolean, errors: object }
   */
  validate(data, rules) {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
      const value = data[field];
      
      for (const rule of fieldRules) {
        let error = null;
        
        if (typeof rule === 'function') {
          error = rule(value, data);
        } else if (typeof rule === 'string') {
          if (rule === 'required') {
            error = this.required(value, field);
          }
        } else if (typeof rule === 'object') {
          if (rule.required && this.isEmpty(value)) {
            error = this.required(value, rule.fieldName || field);
          } else if (!this.isEmpty(value)) {
            if (rule.type === 'number') {
              error = this.number(value, rule.fieldName || field);
            } else if (rule.type === 'integer') {
              error = this.integer(value, rule.fieldName || field);
            } else if (rule.type === 'email') {
              error = this.email(value, rule.fieldName || field);
            } else if (rule.min !== undefined) {
              error = this.range(value, rule.min, rule.max || Infinity, rule.fieldName || field);
            } else if (rule.minLength !== undefined) {
              error = this.minLength(value, rule.minLength, rule.fieldName || field);
            } else if (rule.maxLength !== undefined) {
              error = this.maxLength(value, rule.maxLength, rule.fieldName || field);
            }
          }
        }
        
        if (error) {
          errors[field] = error;
          break; // 只顯示第一個錯誤
        }
      }
    });
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default Validate;

