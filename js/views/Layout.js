(function (window) {
    const auth = window.Auth;
    const store = window.Store;

    const Ad = (placement) => {
        const settings = store.getSettings();
        if (!settings.adsEnabled) return '';
        return `<div class="ad-slot" data-placement="${placement}">Ad Space (${placement})</div>`;
    };

    window.Layout = (content, title = 'AirTasker Clone') => {
        const user = auth.getCurrentUser();

        return `
        <div class="min-h-screen flex flex-col font-sans text-gray-900">
            <!-- Navbar -->
            <nav class="bg-white border-b sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <a href="#home" class="text-2xl font-bold text-blue-600 tracking-tighter">TaskRabbitClone</a>
                            <div class="hidden md:ml-10 md:flex md:space-x-8">
                                <a href="#post-task" class="nav-link text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md font-medium">Post a Task</a>
                                <a href="#browse" class="nav-link text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md font-medium">Browse Tasks</a>
                                ${user ? `<a href="#dashboard" class="nav-link text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md font-medium">Dashboard</a>` : ''}
                            </div>
                        </div>
                        <div class="flex items-center space-x-4">
                            ${user ? `
                                <div class="relative group">
                                    <button class="flex items-center space-x-2 text-sm focus:outline-none">
                                        <div class="h-8 w-8 rounded-full flex items-center justify-center text-white" style="background-color: ${user.avatarColor || '#ccc'}">
                                            ${user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span class="hidden md:block font-medium">${user.name}</span>
                                    </button>
                                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block border">
                                        <a href="#profile/${user.id}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a>
                                        <a href="#dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                                        ${user.role === 'admin' ? '<a href="#admin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Panel</a>' : ''}
                                        <a href="#" onclick="window.Auth.logout()" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
                                    </div>
                                </div>
                            ` : `
                                <a href="#login" class="text-gray-500 hover:text-gray-900 font-medium">Log in</a>
                                <a href="#signup" class="btn-primary">Sign up</a>
                            `}
                        </div>
                    </div>
                </div>
                <!-- Mobile Menu -->
                <div class="md:hidden flex justify-around border-t py-2 text-xs text-gray-500">
                    <a href="#post-task" class="flex flex-col items-center"><span>Post</span></a>
                    <a href="#browse" class="flex flex-col items-center"><span>Browse</span></a>
                    <a href="#dashboard" class="flex flex-col items-center"><span>Dash</span></a>
                </div>
            </nav>

            <!-- Main Content -->
            <main class="flex-grow fade-in">
                ${Ad('header')}
                ${content}
                ${Ad('footer-top')}
            </main>

            <!-- Footer -->
            <footer class="bg-gray-800 text-white py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 class="text-lg font-bold mb-4">TaskRabbitClone</h3>
                        <p class="text-gray-400 text-sm">Post tasks, earn money, live better.</p>
                    </div>
                    <div>
                        <h4 class="font-bold mb-4">Discover</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="#browse" class="hover:text-white">New Tasks</a></li>
                            <li><a href="#browse" class="hover:text-white">Categories</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-bold mb-4">Company</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="#" class="hover:text-white">About Us</a></li>
                            <li><a href="#" class="hover:text-white">Careers</a></li>
                            <li><a href="#" class="hover:text-white">Terms & Privacy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-bold mb-4">Support</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="#" class="hover:text-white">Help Center</a></li>
                            <li><a href="#" class="hover:text-white">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                <div class="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
                    &copy; 2026 TaskRabbitClone. All rights reserved.
                </div>
            </footer>
        </div>
        `;
    };
})(window);
