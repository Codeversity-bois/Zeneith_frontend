/**
 * Client-side Router for Zenith Application
 * Handles navigation between pages without full page reloads
 */

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.beforeRouteChange = null;

        // Listen for navigation events
        window.addEventListener('popstate', () => this.handleRoute());

        // Intercept link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigateTo(e.target.href);
            }
        });
    }

    /**
     * Register a route
     * @param {string} path - Route path
     * @param {Object} config - Route configuration
     */
    addRoute(path, config) {
        this.routes.set(path, {
            ...config,
            pattern: this.pathToRegex(path)
        });
    }

    /**
     * Convert path to regex pattern for matching
     */
    pathToRegex(path) {
        return new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '([^/]+)') + '$');
    }

    /**
     * Extract parameters from URL
     */
    getParams(match) {
        const values = match.result.slice(1);
        const keys = Array.from(match.route.pattern.source.matchAll(/:(\w+)/g)).map(result => result[1]);

        return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
    }

    /**
     * Navigate to a new route
     * @param {string} url - Destination URL
     */
    async navigateTo(url) {
        if (this.beforeRouteChange) {
            const canProceed = await this.beforeRouteChange(url);
            if (!canProceed) return;
        }

        history.pushState(null, null, url);
        await this.handleRoute();
    }

    /**
     * Handle current route
     */
    async handleRoute() {
        const path = window.location.pathname;

        // Find matching route
        const potentialMatches = Array.from(this.routes.entries()).map(([path, route]) => ({
            route,
            path,
            result: window.location.pathname.match(route.pattern)
        }));

        let match = potentialMatches.find(m => m.result !== null);

        if (!match) {
            match = {
                route: this.routes.get('/404') || { handler: () => '404 Not Found' },
                path: '/404',
                result: [window.location.pathname]
            };
        }

        const params = this.getParams(match);

        // Check authentication if required
        if (match.route.requiresAuth) {
            const isAuthenticated = window.StateManager?.isAuthenticated();
            if (!isAuthenticated) {
                this.navigateTo('/login.html');
                return;
            }
        }

        // Check role if required
        if (match.route.role) {
            const userRole = window.StateManager?.getUserRole();
            if (userRole !== match.route.role) {
                this.navigateTo('/403.html');
                return;
            }
        }

        this.currentRoute = match;

        // Execute route handler
        if (match.route.handler) {
            await match.route.handler(params);
        }
    }

    /**
     * Go back in history
     */
    back() {
        window.history.back();
    }

    /**
     * Set navigation guard
     */
    setBeforeRouteChange(callback) {
        this.beforeRouteChange = callback;
    }
}

// Create global router instance
window.Router = new Router();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
}
