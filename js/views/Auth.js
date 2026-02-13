(function (window) {
    const Layout = window.Layout;
    const auth = window.Auth;

    window.Login = () => {
        window.handleLogin = (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            const result = auth.login(email, password);
            if (result.success) {
                window.location.hash = '#dashboard';
            } else {
                alert(result.message);
            }
        };

        return Layout(`
            <div class="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg border">
                <h2 class="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
                <form onsubmit="handleLogin(event)" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" class="input-field" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" class="input-field" required>
                    </div>
                    <button type="submit" class="btn-primary w-full py-3">Log In</button>
                </form>
                <p class="mt-6 text-center text-sm text-gray-600">
                    Don't have an account? <a href="#signup" class="text-blue-600 font-bold">Sign up</a>
                </p>
                <div class="mt-4 text-center">
                    <button onclick="window.seedData()" class="text-xs text-gray-400 hover:text-gray-600 underline">Load Demo Data (Seeds)</button>
                </div>
            </div>
        `);
    };

    window.Register = () => {
        window.handleSignup = (e) => {
            e.preventDefault();
            const data = {
                name: e.target.name.value,
                email: e.target.email.value,
                passwordHash: e.target.password.value,
                role: e.target.role.value,
                suburb: e.target.suburb.value
            };
            const result = auth.signup(data);
            if (result.success) {
                window.location.hash = '#dashboard';
            } else {
                alert(result.message);
            }
        };

        return Layout(`
            <div class="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg border">
                <h2 class="text-2xl font-bold mb-6 text-center">Join TaskRabbitClone</h2>
                <form onsubmit="handleSignup(event)" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" name="name" class="input-field" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" class="input-field" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" class="input-field" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Suburb</label>
                        <input type="text" name="suburb" class="input-field" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">I want to...</label>
                        <select name="role" class="input-field">
                            <option value="poster">Post tasks</option>
                            <option value="doer">Earn money</option>
                            <option value="both">Both</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary w-full py-3">Sign Up</button>
                </form>
                <p class="mt-6 text-center text-sm text-gray-600">
                    Already have an account? <a href="#login" class="text-blue-600 font-bold">Log in</a>
                </p>
            </div>
        `);
    };
})(window);
