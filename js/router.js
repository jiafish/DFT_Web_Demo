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

