// UserInfo Page - Config-driven questionnaire
const userInfoConfig = {
    'start': {
        type: 'info',
        title: '個人化設定',
        description: '為了提供您最適合的照護建議，請先填寫以下資訊',
        nextButton: '開始填寫'
    },
    '1-1': {
        type: 'radio',
        question: '請問您與患者的關係？',
        options: [
            { value: 'spouse', label: '配偶' },
            { value: 'parent', label: '父母' },
            { value: 'sibling', label: '兄弟姐妹' },
            { value: 'child', label: '兒女' },
            { value: 'other', label: '其他', hasInput: true }
        ],
        required: true,
        key: 'relationship'
    },
    '1-2': {
        type: 'radio',
        question: '請問您與患者同住嗎？',
        options: [
            { value: 'yes', label: '是' },
            { value: 'no', label: '否' }
        ],
        required: true,
        key: 'liveTogether'
    },
    '1-3': {
        type: 'number',
        question: '請問您每天大約花費多少時間照護患者？',
        placeholder: '小時',
        required: true,
        key: 'careHours'
    },
    '1-4': {
        type: 'radio',
        question: '除您之外，患者是否有其他照顧者？',
        options: [
            { value: 'yes', label: '是', hasInput: true },
            { value: 'no', label: '否' }
        ],
        required: true,
        key: 'otherCaregivers'
    },
    '1-5': {
        type: 'checkbox',
        question: '請問您是否使用過其他照護資源？（可複選）',
        options: [
            { value: 'longterm', label: '長照服務' },
            { value: 'homecare', label: '居家照服員' },
            { value: 'nurse', label: '看護' },
            { value: 'daycare', label: '日間照護中心' },
            { value: 'none', label: '無' },
            { value: 'other', label: '其他', hasInput: true }
        ],
        required: true,
        key: 'careResources'
    },
    'next': {
        type: 'info',
        title: '快完成了！',
        description: '接著填寫患者資訊，讓 Caremate 為您客製化最適合的照護建議',
        nextButton: '繼續填寫'
    },
    '2-1': {
        type: 'radio',
        question: '請問患者的性別？',
        options: [
            { value: 'male', label: '男' },
            { value: 'female', label: '女' },
            { value: 'other', label: '其他' }
        ],
        required: true,
        key: 'patientGender'
    },
    '2-2': {
        type: 'number',
        question: '請問患者的年齡？',
        placeholder: '歲',
        required: true,
        key: 'patientAge'
    },
    '2-3': {
        type: 'radio',
        question: '請問患者的確診類型？',
        options: [
            { value: 'alzheimer', label: '阿茲海默症' },
            { value: 'vascular', label: '血管性失智' },
            { value: 'frontotemporal', label: '額顳葉失智' },
            { value: 'lewy', label: '路易體失智' },
            { value: 'mixed', label: '混合型失智' },
            { value: 'undiagnosed', label: '未確診' },
            { value: 'other', label: '其他', hasInput: true }
        ],
        required: true,
        key: 'diagnosisType',
        skipNext: '2-4' // Skip 2-4 if value is 'undiagnosed'
    },
    '2-4': {
        type: 'radio',
        question: '請問患者的確診程度？',
        options: [
            { value: 'level1', label: '第一級：輕度失智' },
            { value: 'level2', label: '第二級：中度失智' },
            { value: 'level3', label: '第三級：重度失智' },
            { value: 'level4', label: '第四級：嚴重失智' },
            { value: 'level5', label: '第五級：深度失智' },
            { value: 'level6', label: '第六級：末期失智' },
            { value: 'uncertain', label: '不確定' }
        ],
        required: true,
        key: 'diagnosisLevel'
    },
    '2-5': {
        type: 'checkbox',
        question: '請問患者是否有其他慢性疾病？（可複選）',
        options: [
            { value: 'hypertension', label: '高血壓' },
            { value: 'diabetes', label: '糖尿病' },
            { value: 'heart', label: '心臟疾病' },
            { value: 'stroke', label: '中風' },
            { value: 'parkinson', label: '帕金森氏症' },
            { value: 'depression', label: '抑鬱症' },
            { value: 'none', label: '無' },
            { value: 'other', label: '其他', hasInput: true }
        ],
        required: true,
        key: 'chronicDiseases'
    },
    '2-6': {
        type: 'checkbox',
        question: '請問患者目前有的失智症行為？（可複選）',
        options: [
            { value: 'memory', label: '記憶變差，常忘記事情' },
            { value: 'repeat', label: '重複提問' },
            { value: 'anger', label: '容易生氣或煩躁' },
            { value: 'delusion', label: '懷疑、妄想' },
            { value: 'hallucination', label: '幻視或幻聽' },
            { value: 'stubborn', label: '固執，不願配合' },
            { value: 'appetite', label: '食慾下降／吞嚥困難' },
            { value: 'wandering', label: '遊走／想外出' },
            { value: 'none', label: '無' },
            { value: 'other', label: '其他', hasInput: true }
        ],
        required: true,
        key: 'dementiaBehaviors'
    },
    '2-7': {
        type: 'checkbox',
        question: '請問患者目前保留較好的能力？（可複選）',
        options: [
            { value: 'eating', label: '吃飯／吞嚥' },
            { value: 'recognition', label: '認人' },
            { value: 'conversation', label: '對話' },
            { value: 'tools', label: '操作工具' },
            { value: 'music', label: '音樂與節奏感' },
            { value: 'walking', label: '行走能力' },
            { value: 'other', label: '其他', hasInput: true }
        ],
        required: true,
        key: 'preservedAbilities'
    },
    '2-8': {
        type: 'checkbox',
        question: '您最希望呼喀幫您解決的問題是？（可複選）',
        options: [
            { value: 'behavior', label: '行為情緒處理' },
            { value: 'communication', label: '溝通方式' },
            { value: 'medical', label: '看診就醫' },
            { value: 'resources', label: '政府資源' },
            { value: 'skills', label: '照護技巧' },
            { value: 'preparation', label: '提早準備' },
            { value: 'other', label: '其他', hasInput: true }
        ],
        required: true,
        key: 'needs'
    },
    'end': {
        type: 'info',
        title: '填寫完成！',
        description: '謝謝您的耐心填寫，點擊下方開始使用照護平台',
        nextButton: '開始使用'
    }
};

const userInfoFlow = [
    'start',
    '1-1', '1-2', '1-3', '1-4', '1-5',
    'next',
    '2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-7', '2-8',
    'end'
];

let currentUserInfoStep = 0;
let userInfoData = {};

function getCurrentStep() {
    return userInfoFlow[currentUserInfoStep];
}

// Check if userInfo is complete
function isUserInfoComplete(data) {
    // Required steps (excluding info pages: start, next, end)
    const requiredSteps = ['1-1', '1-2', '1-3', '1-4', '1-5', '2-1', '2-2', '2-3', '2-5', '2-6', '2-7', '2-8'];
    
    // If diagnosisType is undiagnosed, skip 2-4
    const shouldSkip2_4 = data.diagnosisType === 'undiagnosed';
    const stepsToCheck = shouldSkip2_4 
        ? requiredSteps.filter(step => step !== '2-4')
        : [...requiredSteps, '2-4'];
    
    // Check if all required steps have answers
    return stepsToCheck.every(stepKey => {
        const config = userInfoConfig[stepKey];
        if (!config || !config.key) return false;
        const value = data[config.key];
        return value !== undefined && value !== null && value !== '';
    });
}

// Format userInfo answer to readable text
function formatUserInfoAnswer(config, value) {
    if (value === undefined || value === null || value === '') {
        return '未填寫';
    }
    
    if (config.type === 'number') {
        return value.toString();
    }
    
    if (config.type === 'radio') {
        // Handle object format {value: 'other', other: 'text'}
        if (typeof value === 'object' && value.value) {
            if (value.value === 'other') {
                return `其他：${value.other || ''}`;
            }
            const option = config.options.find(opt => opt.value === value.value);
            return option ? option.label : value.value;
        }
        
        const option = config.options.find(opt => opt.value === value);
        return option ? option.label : value;
    }
    
    if (config.type === 'checkbox') {
        if (!Array.isArray(value)) {
            return '未填寫';
        }
        
        return value.map(item => {
            // Handle object format {value: 'other', other: 'text'}
            if (typeof item === 'object' && item.value) {
                if (item.value === 'other') {
                    return `其他：${item.other || ''}`;
                }
                const option = config.options.find(opt => opt.value === item.value);
                return option ? option.label : item.value;
            }
            
            const option = config.options.find(opt => opt.value === item);
            return option ? option.label : item;
        }).join('、');
    }
    
    return String(value);
}

// Render userInfo summary page
function renderUserInfoSummary(container) {
    const data = storage.getUserInfo();
    
    // Get all question steps (excluding info pages)
    const questionSteps = userInfoFlow.filter(step => {
        const config = userInfoConfig[step];
        return config && config.type !== 'info' && config.key;
    });
    
    // Filter steps based on diagnosisType
    const stepsToShow = data.diagnosisType === 'undiagnosed'
        ? questionSteps.filter(step => step !== '2-4')
        : questionSteps;
    
    let summaryHTML = `
        <div class="page-title">個人化設定 - 答案總覽</div>
        <div class="card">
            <h3 style="margin-bottom: 1.5rem; color: var(--primary-color);">已填寫的資訊</h3>
    `;
    
    stepsToShow.forEach(stepKey => {
        const config = userInfoConfig[stepKey];
        if (!config || !config.key) return;
        
        const value = data[config.key];
        const formattedAnswer = formatUserInfoAnswer(config, value);
        
        summaryHTML += `
            <div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-color);">
                <div style="font-weight: 600; color: var(--text-color); margin-bottom: 0.5rem;">
                    ${config.question}
                </div>
                <div style="color: var(--text-light); line-height: 1.6;">
                    ${formattedAnswer}
                </div>
            </div>
        `;
    });
    
    summaryHTML += `
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;">
            <button class="btn btn-primary" id="backToMainBtn">回首頁</button>
            <button class="btn btn-secondary" id="restartBtn">重新填寫</button>
        </div>
    `;
    
    container.innerHTML = summaryHTML;
    
    // Back to main button
    document.getElementById('backToMainBtn').addEventListener('click', () => {
        router.navigate('main');
    });
    
    // Restart button
    document.getElementById('restartBtn').addEventListener('click', () => {
        if (confirm('確定要重新填寫嗎？這將清除所有已填寫的資料。')) {
            storage.clearUserInfo();
            userInfoData = {};
            currentUserInfoStep = 0;
            router.navigate('userinfo');
        }
    });
}

function renderUserInfoQuestion(container, stepKey) {
    const config = userInfoConfig[stepKey];
    if (!config) return;

    if (config.type === 'info') {
        let imageSrc = '';
        if (stepKey === 'start') {
            imageSrc = 'IMG/個人化設定首頁圖.png';
        } else if (stepKey === 'next') {
            imageSrc = 'IMG/個人化設定＿快完成了.png';
        } else if (stepKey === 'end') {
            imageSrc = 'IMG/個人化設定＿填寫完成.png';
        }
        
        container.innerHTML = `
            <div class="text-center" style="padding: 3rem 1rem;">
                ${imageSrc ? `<img src="${imageSrc}" alt="${config.title}" style="max-width: 100%; height: auto; margin-bottom: 2rem;">` : ''}
                <h2 class="page-title">${config.title}</h2>
                <p class="page-description" style="margin-bottom: 2rem;">${config.description}</p>
                <div class="btn-fixed">
                    <button class="btn btn-primary" id="nextBtn">${config.nextButton}</button>
                </div>
            </div>
        `;
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            currentUserInfoStep++;
            const nextStep = getCurrentStep();
            if (nextStep) {
                renderUserInfoQuestion(container, nextStep);
            } else {
                router.navigate('main');
            }
        });
        return;
    }

    let questionHTML = `
        <div class="form-group">
            <label class="form-label">${config.question}${config.required ? ' <span style="color: red;">*</span>' : ''}</label>
    `;

    if (config.type === 'radio') {
        questionHTML += '<div class="radio-group">';
        config.options.forEach(option => {
            const inputId = `option-${option.value}`;
            questionHTML += `
                <div class="radio-item">
                    <input type="radio" id="${inputId}" name="${config.key}" value="${option.value}">
                    <label for="${inputId}">${option.label}</label>
                    ${option.hasInput ? `<input type="text" class="other-input" placeholder="請輸入" style="display: none;">` : ''}
                </div>
            `;
        });
        questionHTML += '</div>';
    } else if (config.type === 'checkbox') {
        questionHTML += '<div class="checkbox-group">';
        config.options.forEach(option => {
            const inputId = `option-${option.value}`;
            questionHTML += `
                <div class="checkbox-item">
                    <input type="checkbox" id="${inputId}" name="${config.key}" value="${option.value}">
                    <label for="${inputId}">${option.label}</label>
                    ${option.hasInput ? `<input type="text" class="other-input" placeholder="請輸入" style="display: none;">` : ''}
                </div>
            `;
        });
        questionHTML += '</div>';
    } else if (config.type === 'number') {
        questionHTML += `
            <input type="number" class="form-input" name="${config.key}" placeholder="${config.placeholder || ''}" required>
        `;
    }

    questionHTML += `
            <div class="error-message" id="errorMsg" style="display: none;"></div>
        </div>
        <div class="btn-fixed">
            <button class="btn btn-primary" id="nextBtn">下一步</button>
        </div>
    `;

    container.innerHTML = questionHTML;

    // Handle other input visibility
    container.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const item = e.target.closest('.radio-item, .checkbox-item');
            const otherInput = item?.querySelector('.other-input');
            if (otherInput) {
                otherInput.style.display = e.target.checked ? 'block' : 'none';
                if (e.target.checked) {
                    otherInput.required = true;
                } else {
                    otherInput.required = false;
                    otherInput.value = '';
                }
            }
        });
    });

    // Load saved data
    const savedData = storage.getUserInfo();
    if (savedData[config.key]) {
        if (config.type === 'checkbox') {
            const savedValue = savedData[config.key];
            const values = Array.isArray(savedValue) ? savedValue : [savedValue];
            values.forEach(val => {
                let inputValue = val;
                let otherText = '';
                
                // Handle object format {value: 'other', other: 'text'}
                if (typeof val === 'object' && val.value) {
                    inputValue = val.value;
                    otherText = val.other || '';
                }
                
                const input = container.querySelector(`input[value="${inputValue}"]`);
                if (input) {
                    input.checked = true;
                    // Show and fill other input if needed
                    if (inputValue === 'other' && otherText) {
                        const otherInput = input.closest('.checkbox-item').querySelector('.other-input');
                        if (otherInput) {
                            otherInput.style.display = 'block';
                            otherInput.value = otherText;
                            otherInput.required = true;
                        }
                    }
                }
            });
        } else if (config.type === 'radio') {
            const savedValue = savedData[config.key];
            let inputValue = savedValue;
            let otherText = '';
            
            // Handle object format {value: 'other', other: 'text'}
            if (typeof savedValue === 'object' && savedValue.value) {
                inputValue = savedValue.value;
                otherText = savedValue.other || '';
            }
            
            const input = container.querySelector(`input[value="${inputValue}"]`);
            if (input) {
                input.checked = true;
                // Show and fill other input if needed
                if (inputValue === 'other' && otherText) {
                    const otherInput = input.closest('.radio-item').querySelector('.other-input');
                    if (otherInput) {
                        otherInput.style.display = 'block';
                        otherInput.value = otherText;
                        otherInput.required = true;
                    }
                }
            }
        } else {
            const input = container.querySelector(`input[name="${config.key}"]`);
            if (input) {
                input.value = savedData[config.key];
            }
        }
    }

    // Next button handler
    document.getElementById('nextBtn').addEventListener('click', () => {
        const errorMsg = document.getElementById('errorMsg');
        errorMsg.style.display = 'none';

        // Collect answer
        let answer = null;
        if (config.type === 'radio') {
            const selected = container.querySelector(`input[name="${config.key}"]:checked`);
            if (!selected && config.required) {
                errorMsg.textContent = '請選擇一個選項';
                errorMsg.style.display = 'block';
                return;
            }
            if (selected) {
                if (selected.value === 'other') {
                    const otherInput = selected.closest('.radio-item').querySelector('.other-input');
                    if (otherInput) {
                        if (otherInput.value && otherInput.value.trim()) {
                            answer = { value: selected.value, other: otherInput.value.trim() };
                        } else {
                            errorMsg.textContent = '請輸入「其他」選項的內容';
                            errorMsg.style.display = 'block';
                            return;
                        }
                    } else {
                        answer = selected.value;
                    }
                } else {
                    answer = selected.value;
                }
            }
        } else if (config.type === 'checkbox') {
            const selected = container.querySelectorAll(`input[name="${config.key}"]:checked`);
            if (selected.length === 0 && config.required) {
                errorMsg.textContent = '請至少選擇一個選項';
                errorMsg.style.display = 'block';
                return;
            }
            answer = [];
            let hasError = false;
            
            Array.from(selected).forEach(input => {
                if (input.value === 'other') {
                    const otherInput = input.closest('.checkbox-item').querySelector('.other-input');
                    if (otherInput) {
                        if (otherInput.value && otherInput.value.trim()) {
                            answer.push({ value: input.value, other: otherInput.value.trim() });
                        } else {
                            errorMsg.textContent = '請輸入「其他」選項的內容';
                            errorMsg.style.display = 'block';
                            hasError = true;
                        }
                    } else {
                        answer.push(input.value);
                    }
                } else {
                    answer.push(input.value);
                }
            });
            
            if (hasError) {
                return;
            }
        } else if (config.type === 'number') {
            const input = container.querySelector(`input[name="${config.key}"]`);
            if (!input.value && config.required) {
                errorMsg.textContent = '請輸入數值';
                errorMsg.style.display = 'block';
                return;
            }
            answer = input.value ? parseInt(input.value) : null;
        }

        // Save answer
        if (answer !== null) {
            userInfoData[config.key] = answer;
            storage.saveUserInfo(userInfoData);
        }

        // Handle special flow
        if (config.key === 'diagnosisType' && answer === 'undiagnosed') {
            // Jump to AD8
            router.navigate('ad8', { returnTo: 'userinfo', returnStep: '2-5' });
            return;
        }

        // Move to next step
        currentUserInfoStep++;
        const nextStep = getCurrentStep();
        if (nextStep) {
            renderUserInfoQuestion(container, nextStep);
        } else {
            router.navigate('main');
        }
    });
}

async function renderUserInfoPage(container, params = {}) {
    // Load saved data first
    userInfoData = storage.getUserInfo();

    // Handle summary mode
    if (params.mode === 'summary') {
        renderUserInfoSummary(container);
        return;
    }

    // Reset or continue from saved step
    if (params.step) {
        currentUserInfoStep = userInfoFlow.indexOf(params.step);
        if (currentUserInfoStep === -1) currentUserInfoStep = 0;
        
        // If returning from AD8 and 2-3 was undiagnosed, skip 2-4
        if (params.step === '2-5' && userInfoData.diagnosisType === 'undiagnosed') {
            // Already at 2-5, which is correct
        }
    } else {
        // Check if we should skip 2-4 based on saved data
        if (userInfoData.diagnosisType === 'undiagnosed') {
            // Find where we left off, but ensure we skip 2-4
            const lastStep = Object.keys(userInfoConfig).find(key => {
                if (key === 'start' || key === 'next' || key === 'end') return false;
                return userInfoData[userInfoConfig[key]?.key] !== undefined;
            });
            
            if (lastStep) {
                const lastIndex = userInfoFlow.indexOf(lastStep);
                if (lastIndex > -1) {
                    // If we're before 2-4, skip to 2-5
                    const step2_4Index = userInfoFlow.indexOf('2-4');
                    if (lastIndex < step2_4Index) {
                        currentUserInfoStep = step2_4Index + 1; // Skip to 2-5
                    } else {
                        currentUserInfoStep = lastIndex + 1;
                    }
                } else {
                    currentUserInfoStep = 0;
                }
            } else {
                currentUserInfoStep = 0;
            }
        } else {
            // Find where we left off
            const lastStep = Object.keys(userInfoConfig).find(key => {
                if (key === 'start' || key === 'next' || key === 'end') return false;
                return userInfoData[userInfoConfig[key]?.key] !== undefined;
            });
            
            if (lastStep) {
                const lastIndex = userInfoFlow.indexOf(lastStep);
                currentUserInfoStep = lastIndex > -1 ? lastIndex + 1 : 0;
            } else {
                currentUserInfoStep = 0;
            }
        }
    }

    const step = getCurrentStep();
    if (step) {
        // Skip 2-4 if diagnosisType is undiagnosed
        if (step === '2-4' && userInfoData.diagnosisType === 'undiagnosed') {
            currentUserInfoStep++;
            const nextStep = getCurrentStep();
            if (nextStep) {
                renderUserInfoQuestion(container, nextStep);
            } else {
                router.navigate('main');
            }
        } else {
            renderUserInfoQuestion(container, step);
        }
    } else {
        router.navigate('main');
    }
}

router.register('userinfo', renderUserInfoPage);

