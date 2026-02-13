(function (window) {
    const Router = window.Router;
    const auth = window.Auth;
    const store = window.Store;

    // View Components are already attached to window by their respective files
    const routes = {
        'home': { render: window.Home },
        'login': { render: window.Login, publicOnly: true },
        'signup': { render: window.Register, publicOnly: true },
        'dashboard': { render: window.Dashboard, requiresAuth: true },
        'post-task': { render: window.PostTask, requiresAuth: true },
        'browse': { render: window.BrowseTasks },
        'task/:id': { render: window.TaskDetails },
        'messages': { render: window.Messages, requiresAuth: true },
        'profile/:id': { render: window.Profile },
        'admin': { render: window.Admin, requiresAuth: true },
    };

    // Expose for debugging
    window.seedData = () => store.seedData();
    window.logout = () => auth.logout();

    // Initialize Router
    const router = new Router(routes);
})(window);
