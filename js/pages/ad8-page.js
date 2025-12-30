// AD8 Page
const ad8Questions = [
    '他是否有判斷力上的困難？',
    '他是否對活動和嗜好的興趣降低？',
    '他是否會重複相同問題、故事和陳述？',
    '他是否在學習如何使用工具、設備和小器具上有困難？',
    '他是否會忘記正確的月份和日期？',
    '他是否在處理複雜的財物上有困難？',
    '他是否容易記約會時間？',
    '他是否有持續的思考和記憶方面問題？'
];

let ad8Answers = {};
let ad8ReturnTo = null;
let ad8ReturnStep = null;
let ad8FromMain = false; // Track if AD8 was accessed from Main

function renderAD8Intro(container) {
    container.innerHTML = `
        <div class="page-title">AD-8 失智檢測</div>
        <div class="card">
            <h3 style="margin-bottom: 1rem; color: var(--primary-color);">2 分鐘快速失智檢測說明</h3>
            <p style="margin-bottom: 1.5rem; line-height: 1.8;">
                AD-8 是一份由照護者填寫的快速失智檢測，約 2 分鐘即可完成。請依患者近期狀況作答，以及早掌握狀況。
            </p>
            
            <h3 style="margin-bottom: 1rem; color: var(--primary-color);">規則與聲明：</h3>
            <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; line-height: 1.8;">
                <li>若總分 ≥ 2 分，建議安排專科醫師進一步評估。</li>
                <li>本量表結果僅作為初步篩檢參考，不代表確定診斷。如需更準確診斷，請至醫療機構詢問。</li>
            </ul>
            
            <div class="form-group">
                <label class="checkbox-item" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px;">
                    <input type="checkbox" id="disclaimer" required>
                    <span>我已閱讀並同意上述說明與免責聲明</span>
                </label>
                <div class="error-message" id="disclaimerError" style="display: none; margin-top: 0.5rem;">請勾選免責聲明</div>
            </div>
            
            <div class="btn-fixed">
                <button class="btn btn-primary" id="startBtn" disabled>開始檢測</button>
            </div>
        </div>
    `;

    const disclaimer = document.getElementById('disclaimer');
    const startBtn = document.getElementById('startBtn');
    const errorMsg = document.getElementById('disclaimerError');

    disclaimer.addEventListener('change', () => {
        startBtn.disabled = !disclaimer.checked;
        errorMsg.style.display = 'none';
    });

    startBtn.addEventListener('click', () => {
        if (!disclaimer.checked) {
            errorMsg.style.display = 'block';
            return;
        }
        renderAD8Questions(container);
    });
}

function renderAD8Questions(container) {
    // Load saved answers
    const savedResult = storage.getAD8Result();
    if (savedResult && savedResult.answers) {
        ad8Answers = savedResult.answers;
    }

    let questionsHTML = `
        <div class="page-title">AD-8 檢測題目</div>
        <div class="card">
            <p style="margin-bottom: 1.5rem; color: var(--text-light);">請依患者近期狀況作答</p>
    `;

    ad8Questions.forEach((question, index) => {
        const qNum = index + 1;
        const qKey = `q${qNum}`;
        const savedAnswer = ad8Answers[qKey];
        
        questionsHTML += `
            <div class="form-group" style="margin-bottom: 2rem;">
                <label class="form-label">${qNum}. ${question}</label>
                <div class="radio-group">
                    <div class="radio-item">
                        <input type="radio" id="${qKey}-yes" name="${qKey}" value="yes" ${savedAnswer === 'yes' ? 'checked' : ''}>
                        <label for="${qKey}-yes">是</label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" id="${qKey}-no" name="${qKey}" value="no" ${savedAnswer === 'no' ? 'checked' : ''}>
                        <label for="${qKey}-no">否</label>
                    </div>
                </div>
            </div>
        `;
    });

    questionsHTML += `
            <div class="error-message" id="errorMsg" style="display: none;"></div>
            <div class="btn-fixed">
                <button class="btn btn-primary" id="submitBtn">提交</button>
            </div>
        </div>
    `;

    container.innerHTML = questionsHTML;

    document.getElementById('submitBtn').addEventListener('click', () => {
        // Collect answers
        ad8Answers = {};
        let allAnswered = true;

        ad8Questions.forEach((_, index) => {
            const qKey = `q${index + 1}`;
            const selected = container.querySelector(`input[name="${qKey}"]:checked`);
            if (!selected) {
                allAnswered = false;
            } else {
                ad8Answers[qKey] = selected.value;
            }
        });

        if (!allAnswered) {
            document.getElementById('errorMsg').textContent = '請回答所有題目';
            document.getElementById('errorMsg').style.display = 'block';
            return;
        }

        // Calculate score
        let score = 0;
        Object.values(ad8Answers).forEach(answer => {
            if (answer === 'yes') score++;
        });

        // Save result (including return info)
        const result = {
            answers: ad8Answers,
            score: score,
            date: new Date().toISOString(),
            returnTo: ad8ReturnTo,
            returnStep: ad8ReturnStep,
            fromMain: ad8FromMain
        };
        storage.saveAD8Result(result);

        // Show result
        renderAD8Result(container, score);
    });
}

function renderAD8Result(container, score) {
    const isHighRisk = score >= 2;
    const imageSrc = isHighRisk ? 'IMG/AD8_建議就醫.png' : 'IMG/AD8_沒有明顯失智.png';
    
    // Determine button text based on entry source
    const isFromUserInfo = ad8ReturnTo === 'userinfo' && ad8ReturnStep;
    const buttonText = isFromUserInfo ? '繼續填寫' : '回首頁';
    
    container.innerHTML = `
        <div style="padding: 2rem 1rem; padding-bottom: 100px;">
            <div class="text-center" style="margin-bottom: 2rem;">
                <img src="${imageSrc}" alt="檢測結果" style="max-width: 100%; height: auto; margin-bottom: 1.5rem;">
                <div style="font-size: 2rem; font-weight: 600; color: var(--primary-color); margin-bottom: 1rem;">
                    得分：${score} 分
                </div>
            </div>
            
            <div class="card" style="margin-bottom: 2rem;">
                ${isHighRisk ? `
                    <h2 style="color:rgb(0, 0, 0); margin-bottom: 1rem; text-align: center;">建議進一步就醫評估</h2>
                    <div style="text-align: center; line-height: 1.8; color: var(--text-color);">
                        <p style="margin-bottom: 1rem;"><strong>分數達到建議門檻（≥ 2 分）</strong></p>
                        <p style="margin-bottom: 1rem;">患者的狀況可能符合失智的早期徵兆</p>
                        <p>建議盡快就醫，由醫師評估確認</p>
                    </div>
                ` : `
                    <h2 style="color: var(--secondary-color); margin-bottom: 1rem; text-align: center;">目前沒有明顯失智風險！</h3>
                    <div style="text-align: center; line-height: 1.8; color: var(--text-color);">
                        <p style="margin-bottom: 1rem;"><strong>分數在正常範圍內（0–1 分）</strong></p>
                        <p style="margin-bottom: 1rem;">目前無明顯失智跡象</p>
                        <p>建議仍持續觀察日常狀況</p>
                        <p>如有任何疑慮或變化，仍可尋求醫師協助。</p>
                    </div>
                `}
            </div>
            
            <div class="btn-fixed">
                <button class="btn btn-primary" id="nextBtn">
                    ${buttonText}
                </button>
            </div>
        </div>
    `;

    document.getElementById('nextBtn').addEventListener('click', () => {
        // If from userinfo, return to userinfo step 2-5
        if (isFromUserInfo) {
            router.navigate('userinfo', { step: ad8ReturnStep });
        } 
        // If from Main, return to Main
        else {
            router.navigate('main');
        }
    });
}

async function renderAD8Page(container, params = {}) {
    // 以本次導頁參數為準（非常重要）
    ad8ReturnTo = params.returnTo || null;
    ad8ReturnStep = params.returnStep || null;

    // Track if accessed from Main (not from userinfo)
    // 優先檢查本次 params，再檢查 savedResult
    if (params.fromMain !== undefined) {
        ad8FromMain = !!params.fromMain;
    } else if (!ad8ReturnTo) {
        ad8FromMain = true;
    } else {
        ad8FromMain = false;
    }

    // Check if already completed
    const savedResult = storage.getAD8Result();
    if (savedResult && savedResult.score !== undefined) {
        // 合併：本次 params 優先，避免被舊結果覆蓋
        const merged = {
            ...savedResult,
            returnTo: ad8ReturnTo || savedResult.returnTo || null,
            returnStep: ad8ReturnStep || savedResult.returnStep || null,
            fromMain: (params.fromMain !== undefined) ? !!params.fromMain : (savedResult.fromMain ?? ad8FromMain)
        };

        // 更新全域狀態，確保 renderAD8Result 判斷正確
        ad8ReturnTo = merged.returnTo;
        ad8ReturnStep = merged.returnStep;
        ad8FromMain = merged.fromMain;

        // 可選：回存，避免重新整理後上下文丟失
        storage.saveAD8Result(merged);

        renderAD8Result(container, merged.score);
    } else {
        renderAD8Intro(container);
    }
}

router.register('ad8', renderAD8Page);

