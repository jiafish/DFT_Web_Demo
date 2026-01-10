// CareJournal Page
let selectedDate = null;
let currentWeekDate = new Date(); // 用於週曆的當前日期

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDateKey(date) {
    return formatDate(date);
}

// 獲取一週的日期
function getWeekDates(centerDate) {
    const dates = [];
    const dayOfWeek = centerDate.getDay();
    const startDate = new Date(centerDate);
    startDate.setDate(centerDate.getDate() - dayOfWeek);
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(date);
    }
    return dates;
}

// 渲染週曆（水平滑動）
function renderWeekCalendar(container) {
    const allJournals = storage.getAllCareJournals();
    const today = new Date();
    const todayKey = getDateKey(today);
    const selectedDateKey = selectedDate ? getDateKey(selectedDate) : null;
    
    // 獲取當前週的日期
    const weekDates = getWeekDates(currentWeekDate);
    
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                       '七月', '八月', '九月', '十月', '十一月', '十二月'];
    
    const year = currentWeekDate.getFullYear();
    const month = currentWeekDate.getMonth();
    
    let weekHTML = `
        <div class="page-title">照護日誌</div>
        <div class="week-calendar-container">
            <div class="week-calendar-header">
                <div class="week-calendar-title">選擇日期</div>
                <div class="week-calendar-month-nav">
                    <button class="calendar-nav-btn" id="prevMonthWeek">‹</button>
                    <span class="calendar-month">${monthNames[month]} ${year}</span>
                    <button class="calendar-nav-btn" id="nextMonthWeek">›</button>
                </div>
            </div>
            <div class="week-calendar-scroll" id="weekCalendarScroll">
                <div class="week-calendar-days">
    `;
    
    weekDates.forEach(date => {
        const dateKey = getDateKey(date);
        const isToday = dateKey === todayKey;
        const isSelected = dateKey === selectedDateKey;
        const hasRecord = !!allJournals[dateKey];
        const dayName = weekDays[date.getDay()];
        const dayNumber = date.getDate();
        
        let dayClasses = 'week-calendar-day';
        if (isSelected) dayClasses += ' selected';
        if (hasRecord) dayClasses += ' has-record';
        if (isToday) dayClasses += ' today';
        
        weekHTML += `
            <div class="${dayClasses}" data-date="${dateKey}">
                <div class="week-day-name">${dayName}</div>
                <div class="week-day-number">${dayNumber}</div>
            </div>
        `;
    });
    
    weekHTML += `
                </div>
            </div>
        </div>
        <div class="btn-fixed">
            <button class="btn btn-primary" id="addJournalBtn">新增日誌</button>
        </div>
    `;
    
    container.innerHTML = weekHTML;
    
    // 月份切換按鈕事件
    document.getElementById('prevMonthWeek').addEventListener('click', () => {
        currentWeekDate.setMonth(currentWeekDate.getMonth() - 1);
        renderWeekCalendar(container);
    });
    
    document.getElementById('nextMonthWeek').addEventListener('click', () => {
        currentWeekDate.setMonth(currentWeekDate.getMonth() + 1);
        renderWeekCalendar(container);
    });
    
    // 新增日誌按鈕事件
    document.getElementById('addJournalBtn').addEventListener('click', () => {
        showAddJournalModal();
    });
    
    // 觸摸和滑鼠滑動支持
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    let isDragging = false;
    let mouseStartX = 0;
    let mouseStartTime = 0;
    let mouseIsDragging = false;
    let scrollLeftStart = 0;
    let clickAllowed = true;
    
    const scrollContainer = document.getElementById('weekCalendarScroll');
    
    // 日期點擊事件（需要區分點擊和拖動）
    container.querySelectorAll('.week-calendar-day').forEach(dayEl => {
        let dayTouchStartX = 0;
        let dayTouchStartTime = 0;
        let dayIsDragging = false;
        
        // 觸摸事件（移動端）
        dayEl.addEventListener('touchstart', (e) => {
            dayTouchStartX = e.touches[0].clientX;
            dayTouchStartTime = Date.now();
            dayIsDragging = false;
        }, { passive: true });
        
        dayEl.addEventListener('touchmove', (e) => {
            const diff = Math.abs(e.touches[0].clientX - dayTouchStartX);
            if (diff > 10) {
                dayIsDragging = true;
            }
        }, { passive: true });
        
        dayEl.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - dayTouchStartTime;
            const diff = Math.abs(e.changedTouches[0].clientX - dayTouchStartX);
            
            if (!dayIsDragging && diff < 10 && touchDuration < 300) {
                // 這是點擊
                const dateKey = dayEl.getAttribute('data-date');
                selectedDate = new Date(dateKey);
                renderWeekCalendar(container);
                showJournalDetail(dateKey);
            }
        }, { passive: true });
        
        // 滑鼠事件（桌面端）
        dayEl.addEventListener('mousedown', (e) => {
            dayTouchStartX = e.clientX;
            dayTouchStartTime = Date.now();
            dayIsDragging = false;
            clickAllowed = true;
        });
        
        dayEl.addEventListener('mousemove', (e) => {
            if (dayTouchStartX !== 0) {
                const diff = Math.abs(e.clientX - dayTouchStartX);
                if (diff > 5) {
                    dayIsDragging = true;
                    clickAllowed = false;
                }
            }
        });
        
        dayEl.addEventListener('mouseup', (e) => {
            if (clickAllowed && !dayIsDragging) {
                const dateKey = dayEl.getAttribute('data-date');
                selectedDate = new Date(dateKey);
                renderWeekCalendar(container);
                showJournalDetail(dateKey);
            }
            dayTouchStartX = 0;
            dayTouchStartTime = 0;
            dayIsDragging = false;
            clickAllowed = true;
        });
        
        dayEl.addEventListener('click', (e) => {
            // 只有在沒有拖動的情況下才處理點擊
            if (!dayIsDragging && clickAllowed) {
                const dateKey = dayEl.getAttribute('data-date');
                selectedDate = new Date(dateKey);
                renderWeekCalendar(container);
                showJournalDetail(dateKey);
            }
        });
    });
    
    if (scrollContainer) {
        // 觸摸事件（移動端）- 用於整個滾動容器
        scrollContainer.addEventListener('touchstart', (e) => {
            // 如果觸摸的是日期卡片，不處理
            if (e.target.closest('.week-calendar-day')) {
                return;
            }
            touchStartX = e.changedTouches[0].screenX;
            touchStartTime = Date.now();
            isDragging = false;
        }, { passive: true });
        
        scrollContainer.addEventListener('touchmove', (e) => {
            // 如果觸摸的是日期卡片，不處理
            if (e.target.closest('.week-calendar-day')) {
                return;
            }
            isDragging = true;
        }, { passive: true });
        
        scrollContainer.addEventListener('touchend', (e) => {
            // 如果觸摸的是日期卡片，不處理
            if (e.target.closest('.week-calendar-day')) {
                return;
            }
            if (!isDragging) return;
            touchEndX = e.changedTouches[0].screenX;
            const touchDuration = Date.now() - touchStartTime;
            handleSwipe(touchDuration);
        }, { passive: true });
        
        // 滑鼠事件（桌面端）- 用於整個滾動容器
        scrollContainer.addEventListener('mousedown', (e) => {
            // 如果點擊的是日期卡片，不處理
            if (e.target.closest('.week-calendar-day')) {
                return;
            }
            mouseStartX = e.clientX;
            mouseStartTime = Date.now();
            mouseIsDragging = true;
            scrollLeftStart = scrollContainer.scrollLeft;
            scrollContainer.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        scrollContainer.addEventListener('mousemove', (e) => {
            if (mouseIsDragging) {
                const diff = mouseStartX - e.clientX;
                scrollContainer.scrollLeft = scrollLeftStart + diff;
            }
        });
        
        scrollContainer.addEventListener('mouseup', (e) => {
            if (mouseIsDragging) {
                const mouseEndX = e.clientX;
                const mouseDuration = Date.now() - mouseStartTime;
                const diff = mouseStartX - mouseEndX;
                
                // 如果滑動距離小，可能是切換週的意圖
                if (Math.abs(diff) > 50 && mouseDuration < 300) {
                    // 快速拖動，切換週
                    handleSwipe(mouseDuration, diff);
                }
                
                mouseIsDragging = false;
                scrollContainer.style.cursor = 'grab';
            }
        });
        
        scrollContainer.addEventListener('mouseleave', () => {
            if (mouseIsDragging) {
                mouseIsDragging = false;
                scrollContainer.style.cursor = 'grab';
            }
        });
        
        scrollContainer.style.cursor = 'grab';
        
        function handleSwipe(touchDuration, diffOverride = null) {
            const swipeThreshold = 50;
            const diff = diffOverride !== null ? diffOverride : (touchStartX - touchEndX);
            
            // 只有快速滑動才切換週，慢速滑動是滾動
            if (Math.abs(diff) > swipeThreshold && touchDuration < 300) {
                if (diff > 0) {
                    // 向左滑動，下一週（可以滑動到未來的日期）
                    currentWeekDate.setDate(currentWeekDate.getDate() + 7);
                } else {
                    // 向右滑動，上一週（可以滑動到過去的日期）
                    currentWeekDate.setDate(currentWeekDate.getDate() - 7);
                }
                renderWeekCalendar(container);
            }
        }
    }
    
    // 確保選中的日期可見
    setTimeout(() => {
        const selectedDay = container.querySelector('.week-calendar-day.selected');
        if (selectedDay && scrollContainer) {
            selectedDay.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, 100);
}


function showAddJournalModal(dateKey = null) {
    // If no dateKey provided, use today's date
    if (!dateKey) {
        const today = new Date();
        dateKey = getDateKey(today);
    }
    
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
    const journal = storage.getCareJournal(dateKey);
    const hasLog = !!journal;
    
    // Generate logId if journal exists (using date as ID for simplicity)
    const logId = hasLog ? dateKey : null;
    
    const modal = document.createElement('div');
    modal.className = 'modal show';
    
    let contentHTML = '';
    
    if (journal) {
        const healthLabels = {
            'good': '良好',
            'ok': '尚可',
            'bad': '糟糕'
        };
        
        contentHTML = `
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
        contentHTML = `
            <div class="card">
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <p>今天尚未新增狀況紀錄</p>
                </div>
            </div>
        `;
    }
    
    const buttonText = hasLog ? '編輯記錄' : '新增記錄';
    const mode = hasLog ? 'edit' : 'new';
    
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">日誌詳情 - ${dateKey}</h3>
                <button class="modal-close" id="closeModal">&times;</button>
            </div>
            <div style="max-height: 70vh; overflow-y: auto;">
                ${contentHTML}
            </div>
            <div class="btn-fixed">
                <button class="btn btn-primary" id="entryBtn">${buttonText}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeModal = () => {
        modal.remove();
    };
    
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('#closeModal').addEventListener('click', closeModal);
    
    modal.querySelector('#entryBtn').addEventListener('click', () => {
        closeModal();
        
        // If it's a new record, use the same modal as add journal page
        if (mode === 'new') {
            showAddJournalModal(dateKey);
        } else {
            // For edit mode, navigate to entry page
            router.navigate('carelog-entry', { 
                date: dateKey, 
                mode: mode,
                logId: logId || undefined
            });
        }
    });
}

async function renderCareJournalPage(container) {
    // 初始化週曆日期
    if (!selectedDate) {
        currentWeekDate = new Date();
        selectedDate = new Date();
    } else {
        currentWeekDate = new Date(selectedDate);
    }
    renderWeekCalendar(container);
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
    
    // 更新選中的日期
    selectedDate = new Date(dateKey);
    currentWeekDate = new Date(dateKey);
    
    let contentHTML = `
        <button class="btn-back-page" id="backBtnDetail">← 返回</button>
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
    
    // 返回按鈕事件
    document.getElementById('backBtnDetail').addEventListener('click', () => {
        router.navigate('carejournal');
    });
    
    // Set footer actions based on hasLog
    const footer = document.querySelector('.footer-bar');
    if (footer) {
        // #region agent log
        const beforeHeight = footer.offsetHeight;
        const appShell = footer.closest('.app-shell');
        const appShellHeight = appShell ? appShell.offsetHeight : 0;
        fetch('http://127.0.0.1:7242/ingest/fa9f83e4-bdca-4ac2-a70b-4bdeece900bc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'carejournal-page.js:renderCareLogPage',message:'Before setting footer',data:{beforeHeight,appShellHeight,hasLog},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        const buttonText = hasLog ? '編輯記錄' : '新增記錄';
        const mode = hasLog ? 'edit' : 'new';
        
        footer.innerHTML = `
            <div class="footer-actions">
                <button class="btn btn-primary" id="entryBtn">${buttonText}</button>
            </div>
        `;
        // 強制觸發瀏覽器重新計算 grid layout
        if (appShell) {
            void appShell.offsetHeight; // 觸發 reflow，強制重新計算 grid
        }
        // #region agent log
        setTimeout(() => {
            const afterHeight = footer.offsetHeight;
            const footerScrollHeight = footer.scrollHeight;
            const footerActions = footer.querySelector('.footer-actions');
            const actionsHeight = footerActions ? footerActions.offsetHeight : 0;
            const actionsScrollHeight = footerActions ? footerActions.scrollHeight : 0;
            const actionsComputed = footerActions ? window.getComputedStyle(footerActions) : null;
            const footerComputed = window.getComputedStyle(footer);
            const gridRowsAfter = appShell ? window.getComputedStyle(appShell).gridTemplateRows : '';
            const pageContent = document.getElementById('pageContent');
            const pageContentHeight = pageContent ? pageContent.offsetHeight : 0;
            const viewportHeight = window.innerHeight;
            fetch('http://127.0.0.1:7242/ingest/fa9f83e4-bdca-4ac2-a70b-4bdeece900bc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'carejournal-page.js:renderCareLogPage',message:'After setting footer - detailed',data:{afterHeight,footerScrollHeight,actionsHeight,actionsScrollHeight,heightChange:afterHeight-beforeHeight,gridRowsAfter,pageContentHeight,viewportHeight,actionsPadding:actionsComputed?.padding,actionsPaddingBottom:actionsComputed?.paddingBottom,actionsGap:actionsComputed?.gap,footerMinHeight:footerComputed.minHeight,footerHeight:footerComputed.height},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        }, 100);
        // #endregion
        
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
        <button class="btn-back-page" id="backBtnEntry">← 返回</button>
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
    
    // 返回按鈕事件
    document.getElementById('backBtnEntry').addEventListener('click', () => {
        router.navigate('carelog-detail', { date: dateKey });
    });
    
    // Set footer actions
    const footer = document.querySelector('.footer-bar');
    if (footer) {
        // #region agent log
        const beforeHeight = footer.offsetHeight;
        fetch('http://127.0.0.1:7242/ingest/fa9f83e4-bdca-4ac2-a70b-4bdeece900bc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'carejournal-page.js:renderCareLogEntryPage',message:'Before setting footer',data:{beforeHeight},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        footer.innerHTML = `
            <div class="footer-actions">
                <button type="submit" form="journalEntryForm" class="btn btn-primary" id="submitBtn">送出</button>
            </div>
        `;
        // 強制觸發瀏覽器重新計算 grid layout
        const appShell = footer.closest('.app-shell');
        if (appShell) {
            void appShell.offsetHeight; // 觸發 reflow，強制重新計算 grid
        }
        // #region agent log
        setTimeout(() => {
            const afterHeight = footer.offsetHeight;
            const footerScrollHeight = footer.scrollHeight;
            const footerActions = footer.querySelector('.footer-actions');
            const actionsHeight = footerActions ? footerActions.offsetHeight : 0;
            const actionsScrollHeight = footerActions ? footerActions.scrollHeight : 0;
            const actionsComputed = footerActions ? window.getComputedStyle(footerActions) : null;
            const footerComputed = window.getComputedStyle(footer);
            const gridRowsAfter = appShell ? window.getComputedStyle(appShell).gridTemplateRows : '';
            const pageContent = document.getElementById('pageContent');
            const pageContentHeight = pageContent ? pageContent.offsetHeight : 0;
            const viewportHeight = window.innerHeight;
            fetch('http://127.0.0.1:7242/ingest/fa9f83e4-bdca-4ac2-a70b-4bdeece900bc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'carejournal-page.js:renderCareLogEntryPage',message:'After setting footer - detailed',data:{afterHeight,footerScrollHeight,actionsHeight,actionsScrollHeight,heightChange:afterHeight-beforeHeight,gridRowsAfter,pageContentHeight,viewportHeight,actionsPadding:actionsComputed?.padding,actionsPaddingBottom:actionsComputed?.paddingBottom,actionsGap:actionsComputed?.gap,footerMinHeight:footerComputed.minHeight,footerHeight:footerComputed.height},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        }, 100);
        // #endregion
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
        
        // Navigate back to calendar page and refresh
        router.navigate('carejournal');
    });
}

router.register('carejournal', renderCareJournalPage);
router.register('carelog-detail', renderCareLogDetailPage);
router.register('carelog-entry', renderCareLogEntryPage);

