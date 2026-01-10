// Simple Router
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        this.isNavigating = false; // Flag to prevent hashchange loop
    }

    register(path, handler) {
        this.routes[path] = handler;
    }

    // Encode path and params to URL hash
    encodeParams(path, params = {}) {
        if (Object.keys(params).length === 0) {
            return path;
        }
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                searchParams.append(key, params[key]);
            }
        });
        const queryString = searchParams.toString();
        return queryString ? `${path}?${queryString}` : path;
    }

    // Decode URL hash to path and params
    decodeHash(hash) {
        const [path, queryString] = hash.split('?');
        const params = {};
        
        if (queryString) {
            const searchParams = new URLSearchParams(queryString);
            searchParams.forEach((value, key) => {
                params[key] = value;
            });
        }
        
        return { path, params };
    }

    // Update body class based on fixed CTA presence
    updateFixedCtaLayout() {
        const pageContent = document.getElementById('pageContent');
        const hasFixed = !!pageContent?.querySelector('.btn-fixed');
        document.body.classList.toggle('has-fixed-cta', hasFixed);
    }

    async navigate(path, params = {}) {
        if (this.routes[path]) {
            // Set flag to prevent hashchange loop
            this.isNavigating = true;
            
            // Update URL hash with params
            const hash = this.encodeParams(path, params);
            window.location.hash = hash;
            
            // Reset flag after a short delay
            setTimeout(() => {
                this.isNavigating = false;
            }, 0);
            
            // Update active nav item (保留以備未來使用)
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-page') === path) {
                    item.classList.add('active');
                }
            });

            // Clear footer-bar before rendering new page
            const footerBar = document.querySelector('.footer-bar');
            if (footerBar) {
                // #region agent log
                const beforeClearHeight = footerBar.offsetHeight;
                const appShell = footerBar.closest('.app-shell');
                const appShellComputed = appShell ? window.getComputedStyle(appShell) : null;
                fetch('http://127.0.0.1:7242/ingest/fa9f83e4-bdca-4ac2-a70b-4bdeece900bc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'router.js:navigate',message:'Before clearing footer',data:{path,beforeClearHeight,appShellHeight:appShell?.offsetHeight,gridRows:appShellComputed?.gridTemplateRows,footerPosition:window.getComputedStyle(footerBar).position},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
                // #endregion
                footerBar.innerHTML = '';
                // #region agent log
                setTimeout(() => {
                    const afterClearHeight = footerBar.offsetHeight;
                    fetch('http://127.0.0.1:7242/ingest/fa9f83e4-bdca-4ac2-a70b-4bdeece900bc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'router.js:navigate',message:'After clearing footer',data:{afterClearHeight,heightChange:afterClearHeight-beforeClearHeight},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
                }, 0);
                // #endregion
            }

            // Render page
            const pageContent = document.getElementById('pageContent');
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/fa9f83e4-bdca-4ac2-a70b-4bdeece900bc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'router.js:77',message:'Before clearing innerHTML',data:{path,classNameBefore:pageContent.className,hasPageContent:pageContent.classList.contains('page-content')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
            // #endregion
            pageContent.innerHTML = '';
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/fa9f83e4-bdca-4ac2-a70b-4bdeece900bc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'router.js:80',message:'After clearing innerHTML',data:{classNameAfter:pageContent.className,hasPageContent:pageContent.classList.contains('page-content')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
            // #endregion
            this.currentPage = path;
            
            await this.routes[path](pageContent, params);
            
            // Update fixed CTA layout after render
            this.updateFixedCtaLayout();
            // #region agent log
            setTimeout(() => {
                const footerBar = document.querySelector('.footer-bar');
                const appShell = footerBar?.closest('.app-shell');
                if (footerBar && appShell) {
                    // 強制觸發瀏覽器重新計算 grid layout
                    // 這可以解決 footer 高度計算問題
                    void appShell.offsetHeight; // 觸發 reflow
                    
                    const footerHeight = footerBar.offsetHeight;
                    const footerScrollHeight = footerBar.scrollHeight;
                    const footerActions = footerBar.querySelector('.footer-actions');
                    const actionsHeight = footerActions ? footerActions.offsetHeight : 0;
                    const actionsScrollHeight = footerActions ? footerActions.scrollHeight : 0;
                    const btnElements = footerActions ? footerActions.querySelectorAll('.btn') : [];
                    const btnHeights = Array.from(btnElements).map(btn => ({height: btn.offsetHeight, text: btn.textContent?.trim().substring(0, 20)}));
                    const actionsComputed = footerActions ? window.getComputedStyle(footerActions) : null;
                    const footerComputed = window.getComputedStyle(footerBar);
                    const appShellHeight = appShell.offsetHeight;
                    const appShellComputed = window.getComputedStyle(appShell);
                    const pageContent = document.getElementById('pageContent');
                    const pageContentHeight = pageContent?.offsetHeight || 0;
                    const pageContentScrollHeight = pageContent?.scrollHeight || 0;
                    const viewportHeight = window.innerHeight;
                    const gridRows = appShellComputed.gridTemplateRows;
                    const gridRowsArray = gridRows.split(' ');
                    const footerRowHeight = gridRowsArray.length > 2 ? gridRowsArray[2] : 'unknown';
                    fetch('http://127.0.0.1:7242/ingest/fa9f83e4-bdca-4ac2-a70b-4bdeece900bc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'router.js:navigate',message:'After page render - layout check detailed',data:{path,footerHeight,footerScrollHeight,actionsHeight,actionsScrollHeight,btnCount:btnElements.length,btnHeights,appShellHeight,gridRows,footerRowHeight,pageContentHeight,pageContentScrollHeight,viewportHeight,footerHasContent:footerBar.innerHTML.trim().length>0,actionsPadding:actionsComputed?.padding,actionsPaddingBottom:actionsComputed?.paddingBottom,actionsGap:actionsComputed?.gap,footerMinHeight:footerComputed.minHeight,footerMaxHeight:footerComputed.maxHeight,footerComputedHeight:footerComputed.height,footerDisplay:footerComputed.display},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
                }
            }, 200);
            // #endregion
            
            // Update header visibility and scroll spy
            if (typeof headerManager !== 'undefined') {
                headerManager.onPageChange(path);
            }
        }
    }

    init() {
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            // Skip if we're in the middle of a programmatic navigation
            if (this.isNavigating) {
                return;
            }
            
            const hash = window.location.hash.slice(1) || 'main';
            const { path, params } = this.decodeHash(hash);
            this.navigate(path, params);
        });

        // Handle initial load
        const hash = window.location.hash.slice(1) || 'main';
        const { path, params } = this.decodeHash(hash);
        this.navigate(path, params);
    }
}

const router = new Router();

