// Simple Router
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
    }

    register(path, handler) {
        this.routes[path] = handler;
    }

    async navigate(path, params = {}) {
        if (this.routes[path]) {
            // Update URL hash
            window.location.hash = path;
            
            // Hide sidebar on mobile after navigation
            if (window.innerWidth < 1024) {
                document.getElementById('sidebar').classList.remove('open');
                document.getElementById('overlay').classList.remove('show');
            }

            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-page') === path) {
                    item.classList.add('active');
                }
            });

            // Render page
            const pageContent = document.getElementById('pageContent');
            pageContent.innerHTML = '';
            this.currentPage = path;
            
            await this.routes[path](pageContent, params);
        }
    }

    init() {
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1) || 'main';
            this.navigate(hash);
        });

        // Handle initial load
        const hash = window.location.hash.slice(1) || 'main';
        this.navigate(hash);
    }
}

const router = new Router();

