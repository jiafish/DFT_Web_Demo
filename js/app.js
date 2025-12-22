// App initialization and additional page handlers

// Settings page
router.register('settings', async (container) => {
    container.innerHTML = `
        <div class="page-title">設定</div>
        <div class="card">
            <p>設定功能開發中...</p>
        </div>
    `;
});

// Account page
router.register('account', async (container) => {
    container.innerHTML = `
        <div class="page-title">帳號資訊</div>
        <div class="card">
            <p>帳號資訊功能開發中...</p>
        </div>
    `;
});

// Logout page
router.register('logout', async (container) => {
    container.innerHTML = `
        <div class="page-title">登出</div>
        <div class="card">
            <p>確定要登出嗎？</p>
            <button class="btn btn-primary" style="margin-top: 1rem;">確認登出</button>
        </div>
    `;
});

