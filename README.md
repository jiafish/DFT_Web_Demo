# DFT Web Demo - 照護助手

響應式醫療照護網站，使用原生 HTML/CSS/JavaScript 開發。

## 功能特色

- **個人化設定**：完整的問卷系統，支援跳題邏輯
- **失智檢測（AD8）**：2 分鐘快速失智檢測
- **照護日誌**：日曆式日誌記錄，支援新增與查看
- **響應式設計**：支援桌面與行動裝置
- **資料持久化**：使用 localStorage 和 Mock API 同步

## 專案結構

```
/public
  /assets (圖片資源)
/src
  /shared
    /styles (共用樣式)
    /components (共用元件)
    /utils (共用工具)
  /modules
    /main (首頁模組)
    /userInfo (個人化設定模組)
    /ad8 (失智檢測模組)
    /CareJournal (照護日誌模組)
    /settings (設定模組)
    /account (帳號資訊模組)
index.html (App Shell)
```

## 使用方式

1. 直接在瀏覽器開啟 `index.html`
2. 或使用本地伺服器（推薦）：
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 使用 Node.js (需要安裝 http-server)
   npx http-server
   ```
3. 訪問 `http://localhost:8000`

## 技術規格

- **技術棧**：原生 HTML5 / CSS3 / JavaScript (ES6+)
- **路由**：Hash Router
- **資料儲存**：localStorage + Mock API
- **響應式斷點**：1024px（桌面/行動裝置）

## 主要功能流程

### 個人化設定
1. 填寫 Part 1（照護者資訊）
2. 顯示中繼頁
3. 填寫 Part 2（患者資訊）
4. 若選「未確診」，跳轉至 AD8 檢測
5. 完成後顯示完成頁

### AD8 檢測
1. 閱讀說明與免責聲明
2. 回答 8 題是否題
3. 查看結果（≥2 分建議就醫，≤1 分正常）
4. 若從 UserInfo 跳轉來，完成後回到 UserInfo 繼續

### 照護日誌
1. 查看當月日曆
2. 點擊日期查看詳情
3. 點擊「新增日誌」新增當日記錄
4. 必填：個案狀況、健康自評

## 資料儲存

所有資料儲存在 localStorage，keys：
- `caremate.session`：登入狀態
- `caremate.onboarding.draft`：個人化設定草稿
- `caremate.onboarding.submitted`：個人化設定提交狀態
- `caremate.ad8.lastResult`：AD8 檢測結果
- `caremate.journal.entries`：照護日誌記錄

## 部署

可直接部署到靜態主機：
- Vercel
- Netlify
- GitHub Pages

無需額外建置步驟，直接上傳檔案即可。

