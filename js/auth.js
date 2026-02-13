(function (window) {
    const SESSION_KEY = 'airtasker_clone_session';
    const store = window.Store;

    window.Auth = {
        login(email, password) {
            const user = store.getUserByEmail(email);
            if (user && user.passwordHash === password) { // Simple "hashing" check
                const session = {
                    token: Math.random().toString(36).substr(2),
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                };
                localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                return { success: true, user };
            }
            return { success: false, message: 'Invalid credentials' };
        },

        signup(userData) {
            if (store.getUserByEmail(userData.email)) {
                return { success: false, message: 'Email already exists' };
            }
            const user = store.createUser(userData);
            // Auto login
            return this.login(userData.email, userData.passwordHash);
        },

        logout() {
            localStorage.removeItem(SESSION_KEY);
            window.location.hash = '#login';
            window.location.reload();
        },

        getSession() {
            const sessionStr = localStorage.getItem(SESSION_KEY);
            if (!sessionStr) return null;
            const session = JSON.parse(sessionStr);
            if (new Date() > new Date(session.expiresAt)) {
                this.logout();
                return null;
            }
            return session;
        },

        getCurrentUser() {
            const session = this.getSession();
            if (session) {
                return store.getUser(session.userId);
            }
            return null;
        },

        checkAuth() {
            if (!this.getSession()) {
                window.location.hash = '#login';
                return false;
            }
            return true;
        }
    };
})(window);
