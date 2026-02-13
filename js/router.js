(function (window) {
    const auth = window.Auth;

    class Router {
        constructor(routes) {
            this.routes = routes;
            this.root = document.getElementById('app');
            window.addEventListener('hashchange', () => this.handleRoute());
            window.addEventListener('load', () => this.handleRoute());
        }

        async handleRoute() {
            let path = window.location.hash.slice(1) || 'home';

            // Handle params (e.g. task/123)
            let routeKey = path;
            let params = {};

            // Find matching route
            let route = this.routes[path];

            if (!route) {
                // Regex match for params
                for (const key in this.routes) {
                    if (key.includes(':')) {
                        const regex = new RegExp('^' + key.replace(/:\w+/g, '([^/]+)') + '$');
                        const match = path.match(regex);
                        if (match) {
                            routeKey = key;
                            route = this.routes[key];
                            // Extract params
                            const paramNames = key.match(/:\w+/g).map(s => s.slice(1));
                            match.slice(1).forEach((val, i) => {
                                params[paramNames[i]] = val;
                            });
                            break;
                        }
                    }
                }
            }

            if (!route) {
                route = this.routes['404'] || { render: () => '<h1>404 Not Found</h1>' };
            }

            // Auth Guard
            if (route.requiresAuth && !auth.getSession()) {
                window.location.hash = '#login';
                return;
            }

            // Public only guard (e.g. login page when logged in)
            if (route.publicOnly && auth.getSession()) {
                window.location.hash = '#dashboard';
                return;
            }

            // Render
            this.root.innerHTML = await route.render(params);
            if (route.afterRender) route.afterRender(params);

            // Scroll to top
            window.scrollTo(0, 0);

            // Update Active Nav
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('text-blue-600', 'font-bold');
                if (link.getAttribute('href') === `#${path}`) {
                    link.classList.add('text-blue-600', 'font-bold');
                }
            });
        }

        navigateTo(path) {
            window.location.hash = path;
        }
    }

    window.Router = Router;
})(window);
