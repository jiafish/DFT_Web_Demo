// Main Page
async function renderMainPage(container) {
    container.innerHTML = `
        <div class="page-title">歡迎使用 Caremate 照護平台</div>
        <div class="page-description">選擇下方功能開始使用</div>
        
        <div class="card" data-action="userinfo">
            <div class="card-title">個人化設定</div>
            <div class="card-description">填寫個人與患者資訊，讓 Caremate 為您客製化最適合的照護建議</div>
        </div>
        
        <div class="card" data-action="ad8">
            <div class="card-title">失智小檢測</div>
            <div class="card-description">2 分鐘快速失智檢測，及早掌握患者狀況</div>
        </div>
        
        <div class="card" data-action="carejournal">
            <div class="card-title">照護日誌</div>
            <div class="card-description">記錄每日照護狀況，追蹤患者健康變化</div>
        </div>
    `;

    // Add click handlers
    container.querySelectorAll('.card[data-action]').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.getAttribute('data-action');
            // Mark that AD8 is accessed from Main
            if (action === 'ad8') {
                router.navigate(action, { fromMain: true });
            } else {
                router.navigate(action);
            }
        });
    });
}

router.register('main', renderMainPage);

