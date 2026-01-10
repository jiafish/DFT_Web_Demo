// Main App Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Nav item clicks (保留以備未來使用，即使目前沒有 nav-item 元素)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            if (page) {
                router.navigate(page);
            }
        });
    });

    // Initialize header manager
    if (typeof headerManager !== 'undefined') {
        headerManager.init();
    }

    // Initialize router
    router.init();
});

