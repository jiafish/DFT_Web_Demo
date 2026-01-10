// App initialization and additional page handlers

// Header Manager
const headerManager = {
    header: null,
    dropdownOpen: false,
    scrollSpyActive: false,
    scrollSpyHandlers: null,

    init() {
        this.header = document.querySelector('.header');
        if (!this.header) return;

        this.setupEventListeners();
    },

    setupEventListeners() {
        if (!this.header) return;

        // Navigation tabs click handlers
        const tabs = this.header.querySelectorAll('.home-tab[data-section]');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const sectionId = tab.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Dropdown menu handlers
        const dropdownTrigger = this.header.querySelector('.home-dropdown__trigger');
        const dropdownMenu = this.header.querySelector('.home-dropdown__menu');
        
        if (dropdownTrigger && dropdownMenu) {
            dropdownTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.dropdownOpen = !this.dropdownOpen;
                dropdownMenu.classList.toggle('active', this.dropdownOpen);
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.header?.querySelector('.home-dropdown')?.contains(e.target)) {
                this.dropdownOpen = false;
                this.header?.querySelector('.home-dropdown__menu')?.classList.remove('active');
            }
        });

        // Dropdown item click handlers
        this.header.querySelectorAll('.home-dropdown__item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                if (page) {
                    router.navigate(page);
                }
            });
        });
    },

    show() {
        if (this.header) {
            this.header.style.display = 'flex';
        }
    },

    hide() {
        if (this.header) {
            this.header.style.display = 'none';
        }
    },

    updateVisibility(page) {
        // 只在 main 頁面顯示 header
        if (page === 'main') {
            this.show();
        } else {
            this.hide();
        }
    },

    initScrollSpy() {
        // 只在 main 頁面啟用 scroll spy
        if (router.currentPage !== 'main') {
            this.stopScrollSpy();
            return;
        }

        if (this.scrollSpyActive) return;
        this.scrollSpyActive = true;

        const tabs = this.header?.querySelectorAll('.home-tab[data-section]');
        if (!tabs || tabs.length === 0) return;

        const sections = ['hero', 'about', 'features'];
        let scrollTimeout;
        
        const updateActiveTab = () => {
            const scrollY = window.scrollY + 150; // Offset for header
            let activeSection = 'hero';

            // Check each section from bottom to top to find the current one
            for (let i = sections.length - 1; i >= 0; i--) {
                const sectionId = sections[i];
                const section = document.getElementById(sectionId);
                if (section) {
                    const top = section.offsetTop;
                    if (scrollY >= top) {
                        activeSection = sectionId;
                        break;
                    }
                }
            }

            tabs.forEach(tab => {
                const sectionId = tab.getAttribute('data-section');
                if (sectionId === activeSection) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        };

        // Throttle scroll event for better performance
        const handleScroll = () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(updateActiveTab, 10);
        };

        // Store handlers for cleanup
        this.scrollSpyHandlers = {
            handleScroll,
            updateActiveTab
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateActiveTab(); // Initial call

        // Also update on resize
        window.addEventListener('resize', updateActiveTab, { passive: true });
    },

    stopScrollSpy() {
        if (this.scrollSpyHandlers) {
            window.removeEventListener('scroll', this.scrollSpyHandlers.handleScroll);
            window.removeEventListener('resize', this.scrollSpyHandlers.updateActiveTab);
            this.scrollSpyHandlers = null;
        }
        this.scrollSpyActive = false;
    },

    onPageChange(page) {
        this.updateVisibility(page);
        
        if (page === 'main') {
            // 延遲初始化 scroll spy，確保頁面內容已渲染
            setTimeout(() => {
                this.initScrollSpy();
            }, 100);
        } else {
            this.stopScrollSpy();
        }
    }
};

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

