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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fa9f83e4-bdca-4ac2-a70b-4bdeece900bc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main-page.js:34',message:'renderMainPage entry',data:{containerId:container.id,classNameBefore:container.className,hasPageContent:container.classList.contains('page-content'),hasMainPageContent:container.classList.contains('main-page-content')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    // 確保保留 page-content 類別（router 清空 innerHTML 不會影響類別，但為了安全起見確保存在）
    if (!container.classList.contains('page-content')) {
        container.classList.add('page-content');
    }
    // 添加 main-page-content 類別
    container.classList.add('main-page-content');
    
    // #region agent log
    const computedStyle = window.getComputedStyle(container);
    const containerRect = container.getBoundingClientRect();
    const appShell = container.closest('.app-shell');
    const appShellRect = appShell ? appShell.getBoundingClientRect() : null;
    fetch('http://127.0.0.1:7242/ingest/fa9f83e4-bdca-4ac2-a70b-4bdeece900bc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main-page.js:40',message:'After adding class, before innerHTML',data:{classNameAfter:container.className,overflowY:computedStyle.overflowY,overflowX:computedStyle.overflowX,minHeight:computedStyle.minHeight,height:computedStyle.height,containerHeight:containerRect.height,containerScrollHeight:container.scrollHeight,appShellHeight:appShellRect?.height},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    container.innerHTML = `
        <div class="home">
            <!-- Hero Banner -->
            <section id="hero" class="home-hero">
                <div class="home-hero__overlay"></div>
                <div class="home-hero__content">
                    <h1 class="home-hero__title">為您提供最專業、客製化的照顧建議</h1>
                    <a href="https://lin.ee/XNWrtJt" target="_blank" rel="noopener noreferrer" class="home-hero__cta btn btn-primary">
                        立即試用 CareMate AI
                    </a>
                </div>
            </section>

            <!-- Section 2: About CareMate -->
            <section id="about" class="home-section home-about">
                <div class="home-about__content">
                    <div class="home-about__text">
                        <h2 class="home-section__title">CareMate 引導您找出最合適的照顧方式</h2>
                    </div>
                    <div class="home-about__image">
                        <img src="IMG/產品圖01.png" alt="CareMate 產品" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div style="display:none; width:100%; height:300px; background:#e0e0e0; border-radius:8px;"></div>
                    </div>
                </div>
            </section>

            <!-- Section 3: Features -->
            <section id="features" class="home-section home-features">
                <div class="home-features__image">
                    <img src="IMG/產品圖01.png" alt="產品特色" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div style="display:none; width:100%; height:400px; background:#e0e0e0; border-radius:8px;"></div>
                </div>
            </section>

            <!-- Section 4: Action Cards -->
            <section class="home-section home-actions">
                <div class="home-actions__grid">
                    <div class="home-action-card home-action-card--large">
                        <h3 class="home-action-card__title">幫助 CareMate 更了解你！</h3>
                        <p class="home-action-card__desc">填寫相關問題，讓我們為你推薦更符合的照顧建議</p>
                        <button class="home-action-card__btn btn btn-primary" data-action="userinfo">前往填寫</button>
                    </div>
                    <div class="home-action-card home-action-card--small">
                        <button class="home-action-card__btn btn btn-primary" data-action="ad8">懷疑失智？</button>
                    </div>
                </div>
            </section>
        </div>
    `;

    // #region agent log
    // Wait for DOM to update and also log to console for immediate debugging
    setTimeout(() => {
        const computedStyle = window.getComputedStyle(container);
        const containerRect = container.getBoundingClientRect();
        const homeElement = container.querySelector('.home');
        const homeRect = homeElement ? homeElement.getBoundingClientRect() : null;
        const appShell = container.closest('.app-shell');
        const appShellRect = appShell ? appShell.getBoundingClientRect() : null;
        const appShellStyle = appShell ? window.getComputedStyle(appShell) : null;
        
        // Test scroll capability
        const initialScrollTop = container.scrollTop;
        container.scrollTop = 10;
        const canActuallyScroll = container.scrollTop !== initialScrollTop;
        container.scrollTop = initialScrollTop; // Reset
        
        const debugData = {
            className: container.className,
            overflowY: computedStyle.overflowY,
            overflowX: computedStyle.overflowX,
            minHeight: computedStyle.minHeight,
            height: computedStyle.height,
            maxHeight: computedStyle.maxHeight,
            display: computedStyle.display,
            position: computedStyle.position,
            touchAction: computedStyle.touchAction,
            containerClientHeight: container.clientHeight,
            containerScrollHeight: container.scrollHeight,
            containerOffsetHeight: container.offsetHeight,
            containerScrollTop: container.scrollTop,
            containerTop: containerRect.top,
            containerBottom: containerRect.bottom,
            homeHeight: homeRect?.height,
            homeScrollHeight: homeElement?.scrollHeight,
            homeOffsetHeight: homeElement?.offsetHeight,
            appShellHeight: appShellRect?.height,
            appShellDisplay: appShellStyle?.display,
            appShellGridTemplateRows: appShellStyle?.gridTemplateRows,
            appShellOverflow: appShellStyle?.overflow,
            canScroll: container.scrollHeight > container.clientHeight,
            scrollDifference: container.scrollHeight - container.clientHeight,
            canActuallyScroll: canActuallyScroll,
            hasPageContentClass: container.classList.contains('page-content'),
            hasMainPageContentClass: container.classList.contains('main-page-content'),
            windowScrollY: window.scrollY,
            documentBodyScrollHeight: document.body.scrollHeight,
            documentBodyClientHeight: document.body.clientHeight
        };
        console.log('[DEBUG] Main page scroll check:', debugData);
        console.log('[DEBUG] Container element:', container);
        console.log('[DEBUG] App shell element:', appShell);
        
        // Test if scroll events work
        const testScrollHandler = () => {
            console.log('[DEBUG] Container scroll event fired!', container.scrollTop);
        };
        container.addEventListener('scroll', testScrollHandler, { once: true });
        
        // Try to programmatically scroll
        setTimeout(() => {
            const beforeScroll = container.scrollTop;
            container.scrollBy({ top: 50, behavior: 'auto' });
            const afterScroll = container.scrollTop;
            console.log('[DEBUG] Programmatic scroll test:', { beforeScroll, afterScroll, changed: beforeScroll !== afterScroll });
        }, 200);
        
        fetch('http://127.0.0.1:7242/ingest/fa9f83e4-bdca-4ac2-a70b-4bdeece900bc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main-page.js:102',message:'After innerHTML, DOM updated',data:debugData,timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'B'})}).catch(()=>{});
    }, 100);
    // #endregion

    // Action card handlers
    container.querySelectorAll('.home-action-card__btn[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            if (action === 'ad8') {
                router.navigate('ad8', { fromMain: true });
            } else if (action === 'userinfo') {
                if (isUserInfoCompleteFromMain()) {
                    router.navigate('userinfo', { mode: 'summary' });
                } else {
                    router.navigate('userinfo');
                }
            }
        });
    });
}

router.register('main', renderMainPage);

