// Main Page

// Check if userInfo is complete (simplified version for main page)
function isUserInfoCompleteFromMain() {
    const data = storage.getUserInfo();
    // Required steps (excluding info pages)
    const requiredSteps = ['1-1', '1-2', '1-3', '1-4', '1-5', '2-1', '2-2', '2-3', '2-5', '2-6', '2-7', '2-8'];
    
    // If diagnosisType is undiagnosed, skip 2-4
    const shouldSkip2_4 = data.diagnosisType === 'undiagnosed';
    const stepsToCheck = shouldSkip2_4 
        ? requiredSteps.filter(step => step !== '2-4')
        : [...requiredSteps, '2-4'];
    
    // Check if all required steps have answers
    // We need to check against userInfoConfig, but since it's in another file,
    // we'll use a simpler check based on keys
    const requiredKeys = [
        'relationship', 'liveTogether', 'careHours', 'otherCaregivers', 'careResources',
        'patientGender', 'patientAge', 'diagnosisType', 'chronicDiseases', 
        'dementiaBehaviors', 'preservedAbilities', 'needs'
    ];
    
    const keysToCheck = shouldSkip2_4
        ? requiredKeys.filter(key => key !== 'diagnosisLevel')
        : [...requiredKeys, 'diagnosisLevel'];
    
    return keysToCheck.every(key => {
        const value = data[key];
        return value !== undefined && value !== null && value !== '';
    });
}

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
            if (action === 'ad8') {
                // Mark that AD8 is accessed from Main
                router.navigate(action, { fromMain: true });
            } else if (action === 'userinfo') {
                // Check if userInfo is complete
                if (isUserInfoCompleteFromMain()) {
                    router.navigate(action, { mode: 'summary' });
                } else {
                    router.navigate(action);
                }
            } else {
                router.navigate(action);
            }
        });
    });
}

router.register('main', renderMainPage);

