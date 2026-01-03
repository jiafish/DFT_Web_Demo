// CareJournal Page
let currentCalendarDate = new Date();
let selectedDate = null;

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDateKey(date) {
    return formatDate(date);
}

function renderCalendar(container) {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                       '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    
    const today = new Date();
    const todayKey = getDateKey(today);
    const allJournals = storage.getAllCareJournals();
    
    let calendarHTML = `
        <div class="page-title">照護日誌</div>
        <div class="calendar">
            <div class="calendar-header">
                <button class="calendar-nav-btn" id="prevMonth">‹</button>
                <div class="calendar-month">${year}年 ${monthNames[month]}</div>
                <button class="calendar-nav-btn" id="nextMonth">›</button>
            </div>
            <div class="calendar-grid">
    `;
    
    // Day headers
    dayNames.forEach(day => {
        calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarHTML += `<div class="calendar-day other-month"></div>`;
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateKey = getDateKey(date);
        const journal = allJournals[dateKey];
        const isToday = dateKey === todayKey;
        
        let dayClasses = 'calendar-day';
        if (isToday) dayClasses += ' today';
        if (journal) dayClasses += ' has-record';
        
        calendarHTML += `
            <div class="${dayClasses}" data-date="${dateKey}">
                ${day}
            </div>
        `;
    }
    
    // Fill remaining cells
    const totalCells = startingDayOfWeek + daysInMonth;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let i = 0; i < remainingCells && totalCells + i < 42; i++) {
        calendarHTML += `<div class="calendar-day other-month"></div>`;
    }
    
    calendarHTML += `
            </div>
        </div>
        <div class="btn-fixed">
            <button class="btn btn-primary" id="addJournalBtn">新增日誌</button>
        </div>
    `;
    
    container.innerHTML = calendarHTML;
    
    // Event handlers
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar(container);
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar(container);
    });
    
    // Day click handlers
    container.querySelectorAll('.calendar-day[data-date]').forEach(dayEl => {
        dayEl.addEventListener('click', () => {
            const date = dayEl.getAttribute('data-date');
            showJournalDetail(date);
        });
    });
    
    document.getElementById('addJournalBtn').addEventListener('click', () => {
        showAddJournalModal();
    });
}

function showAddJournalModal() {
    const today = new Date();
    const dateKey = getDateKey(today);
    
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">新增日誌 - ${dateKey}</h3>
                <button class="modal-close" id="closeModal">&times;</button>
            </div>
            <form id="journalForm">
                <div class="form-group">
                    <label class="form-label">個案狀況 <span style="color: red;">*</span></label>
                    <textarea class="form-textarea" name="condition" placeholder="請描述患者今日的狀況..." required></textarea>
                    <div class="error-message" id="conditionError" style="display: none;"></div>
                </div>
                <div class="form-group">
                    <label class="form-label">健康自評 <span style="color: red;">*</span></label>
                    <div class="radio-group">
                        <div class="radio-item">
                            <input type="radio" id="health-good" name="health" value="good" required>
                            <label for="health-good">良好</label>
                        </div>
                        <div class="radio-item">
                            <input type="radio" id="health-ok" name="health" value="ok" required>
                            <label for="health-ok">尚可</label>
                        </div>
                        <div class="radio-item">
                            <input type="radio" id="health-bad" name="health" value="bad" required>
                            <label for="health-bad">糟糕</label>
                        </div>
                    </div>
                    <div class="error-message" id="healthError" style="display: none;"></div>
                </div>
                <div class="btn-fixed">
                    <button type="submit" class="btn btn-primary" id="submitBtn">送出</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeModal = () => {
        modal.remove();
    };
    
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('#closeModal').addEventListener('click', closeModal);
    
    modal.querySelector('#journalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const condition = formData.get('condition');
        const health = formData.get('health');
        
        let hasError = false;
        
        if (!condition || condition.trim() === '') {
            document.getElementById('conditionError').textContent = '請填寫個案狀況';
            document.getElementById('conditionError').style.display = 'block';
            hasError = true;
        } else {
            document.getElementById('conditionError').style.display = 'none';
        }
        
        if (!health) {
            document.getElementById('healthError').textContent = '請選擇健康自評';
            document.getElementById('healthError').style.display = 'block';
            hasError = true;
        } else {
            document.getElementById('healthError').style.display = 'none';
        }
        
        if (hasError) return;
        
        const journalData = {
            condition: condition.trim(),
            health: health,
            date: dateKey,
            createdAt: new Date().toISOString()
        };
        
        storage.saveCareJournal(dateKey, journalData);
        closeModal();
        
        // Refresh calendar
        const container = document.getElementById('pageContent');
        renderCalendar(container);
    });
}

function showJournalDetail(dateKey) {
    // Navigate to detail page instead of modal
    router.navigate('carelog-detail', { date: dateKey });
}

async function renderCareJournalPage(container) {
    renderCalendar(container);
}

// Render journal detail page
async function renderCareLogDetailPage(container, params = {}) {
    const dateKey = params.date;
    if (!dateKey) {
        router.navigate('carejournal');
        return;
    }
    
    const journal = storage.getCareJournal(dateKey);
    const hasLog = !!journal;
    
    // Generate logId if journal exists (using date as ID for simplicity)
    const logId = hasLog ? dateKey : null;
    
    let contentHTML = `
        <div class="page-title">日誌詳情 - ${dateKey}</div>
        <div style="padding-bottom: calc(96px + env(safe-area-inset-bottom));">
    `;
    
    if (journal) {
        const healthLabels = {
            'good': '良好',
            'ok': '尚可',
            'bad': '糟糕'
        };
        
        contentHTML += `
            <div class="card">
                <div class="form-group">
                    <label class="form-label">個案狀況</label>
                    <div style="padding: 1rem; background: #f5f5f5; border-radius: 8px; min-height: 80px;">
                        ${journal.condition || '今天尚未新增狀況紀錄'}
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">健康自評</label>
                    <div style="padding: 0.75rem; background: #f5f5f5; border-radius: 8px;">
                        ${healthLabels[journal.health] || journal.health}
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">當日問題詢問記錄</label>
                    <div class="empty-state" style="padding: 2rem 1rem;">
                        <div class="empty-state-icon">💬</div>
                        <p>今天還沒有提問紀錄</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        contentHTML += `
            <div class="card">
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <p>今天尚未新增狀況紀錄</p>
                </div>
            </div>
        `;
    }
    
    contentHTML += `</div>`;
    
    container.innerHTML = contentHTML;
    
    // Set footer actions based on hasLog
    const footer = document.querySelector('.footer-bar');
    if (footer) {
        const buttonText = hasLog ? '編輯記錄' : '新增記錄';
        const mode = hasLog ? 'edit' : 'new';
        
        footer.innerHTML = `
            <div class="footer-actions">
                <button class="btn btn-primary" id="entryBtn">${buttonText}</button>
            </div>
        `;
        
        document.getElementById('entryBtn').addEventListener('click', () => {
            router.navigate('carelog-entry', { 
                date: dateKey, 
                mode: mode,
                logId: logId || undefined
            });
        });
    }
}

// Render journal entry page (new/edit)
async function renderCareLogEntryPage(container, params = {}) {
    const dateKey = params.date;
    const mode = params.mode || 'new';
    const logId = params.logId || dateKey;
    
    if (!dateKey) {
        router.navigate('carejournal');
        return;
    }
    
    // Load existing data if editing
    let journalData = null;
    if (mode === 'edit' && logId) {
        journalData = storage.getCareJournal(logId);
    }
    
    const isEditMode = mode === 'edit' && journalData;
    
    let formHTML = `
        <div class="page-title">${isEditMode ? '編輯記錄' : '新增記錄'} - ${dateKey}</div>
        <form id="journalEntryForm" style="padding-bottom: calc(96px + env(safe-area-inset-bottom));">
            <div class="card">
                <div class="form-group">
                    <label class="form-label">個案狀況 <span style="color: red;">*</span></label>
                    <textarea class="form-textarea" name="condition" placeholder="請描述患者今日的狀況..." required>${isEditMode ? (journalData.condition || '') : ''}</textarea>
                    <div class="error-message" id="conditionError" style="display: none;"></div>
                </div>
                <div class="form-group">
                    <label class="form-label">健康自評 <span style="color: red;">*</span></label>
                    <div class="radio-group">
                        <div class="radio-item">
                            <input type="radio" id="health-good" name="health" value="good" ${isEditMode && journalData.health === 'good' ? 'checked' : ''} required>
                            <label for="health-good">良好</label>
                        </div>
                        <div class="radio-item">
                            <input type="radio" id="health-ok" name="health" value="ok" ${isEditMode && journalData.health === 'ok' ? 'checked' : ''} required>
                            <label for="health-ok">尚可</label>
                        </div>
                        <div class="radio-item">
                            <input type="radio" id="health-bad" name="health" value="bad" ${isEditMode && journalData.health === 'bad' ? 'checked' : ''} required>
                            <label for="health-bad">糟糕</label>
                        </div>
                    </div>
                    <div class="error-message" id="healthError" style="display: none;"></div>
                </div>
            </div>
        </form>
    `;
    
    container.innerHTML = formHTML;
    
    // Set footer actions
    const footer = document.querySelector('.footer-bar');
    if (footer) {
        footer.innerHTML = `
            <div class="footer-actions">
                <button type="submit" form="journalEntryForm" class="btn btn-primary" id="submitBtn">送出</button>
            </div>
        `;
    }
    
    // Form submit handler
    document.getElementById('journalEntryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const condition = formData.get('condition');
        const health = formData.get('health');
        
        let hasError = false;
        
        if (!condition || condition.trim() === '') {
            document.getElementById('conditionError').textContent = '請填寫個案狀況';
            document.getElementById('conditionError').style.display = 'block';
            hasError = true;
        } else {
            document.getElementById('conditionError').style.display = 'none';
        }
        
        if (!health) {
            document.getElementById('healthError').textContent = '請選擇健康自評';
            document.getElementById('healthError').style.display = 'block';
            hasError = true;
        } else {
            document.getElementById('healthError').style.display = 'none';
        }
        
        if (hasError) return;
        
        const savedJournalData = {
            condition: condition.trim(),
            health: health,
            date: dateKey,
            createdAt: isEditMode && journalData ? journalData.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        storage.saveCareJournal(dateKey, savedJournalData);
        
        // Navigate back to detail page
        router.navigate('carelog-detail', { date: dateKey });
    });
}

router.register('carejournal', renderCareJournalPage);
router.register('carelog-detail', renderCareLogDetailPage);
router.register('carelog-entry', renderCareLogEntryPage);

