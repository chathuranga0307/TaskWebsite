(function (window) {
    const Layout = window.Layout;
    const store = window.Store;
    const auth = window.Auth;
    const { formatDate } = window.Utils;

    window.Admin = () => {
        const currentUser = auth.getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            window.location.hash = '#home';
            return '';
        }

        const users = store.getAllUsers();
        const tasks = store.getTasks();
        const settings = store.getSettings();

        window.toggleBan = (userId) => {
            const user = store.getUser(userId);
            store.updateUser(userId, { isBanned: !user.isBanned });
            window.location.reload();
        };

        window.toggleAds = () => {
            store.updateSettings('adsEnabled', !settings.adsEnabled);
            window.location.reload();
        };

        window.cancelTask = (taskId) => {
            if (confirm('Are you sure you want to cancel this task?')) {
                store.updateTask(taskId, { status: 'cancelled' });
                window.location.reload();
            }
        };

        return Layout(`
            <div class="max-w-6xl mx-auto px-4 py-10">
                <h1 class="text-3xl font-bold mb-8">Admin Panel</h1>

                <!-- Settings -->
                <div class="bg-white p-6 rounded-xl shadow border mb-8 flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-lg">Site Settings</h3>
                        <p class="text-gray-500 text-sm">Manage global configurations</p>
                    </div>
                    <div class="flex items-center">
                        <span class="mr-3 font-medium text-gray-700">Display Ads</span>
                        <button onclick="toggleAds()" class="${settings.adsEnabled ? 'bg-green-500' : 'bg-gray-300'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                            <span aria-hidden="true" class="${settings.adsEnabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Users -->
                    <div class="bg-white p-6 rounded-xl shadow border">
                        <h3 class="font-bold text-lg mb-4">Users (${users.length})</h3>
                        <div class="overflow-y-auto max-h-96">
                            <table class="min-w-full text-sm">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-2 text-left">Name</th>
                                        <th class="px-4 py-2 text-left">Role</th>
                                        <th class="px-4 py-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y">
                                    ${users.map(u => `
                                        <tr>
                                            <td class="px-4 py-3">
                                                <div class="font-medium">${u.name}</div>
                                                <div class="text-xs text-gray-500">${u.email}</div>
                                            </td>
                                            <td class="px-4 py-3 capitalize">${u.role}</td>
                                            <td class="px-4 py-3 text-right">
                                                ${u.role !== 'admin' ? `
                                                    <button onclick="toggleBan('${u.id}')" class="text-xs font-bold ${u.isBanned ? 'text-green-600' : 'text-red-600'} hover:underline">
                                                        ${u.isBanned ? 'Unban' : 'Ban'}
                                                    </button>
                                                ` : ''}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Recent Tasks -->
                    <div class="bg-white p-6 rounded-xl shadow border">
                        <h3 class="font-bold text-lg mb-4">Recent Tasks</h3>
                        <div class="overflow-y-auto max-h-96">
                            <table class="min-w-full text-sm">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-2 text-left">Title</th>
                                        <th class="px-4 py-2 text-left">Status</th>
                                        <th class="px-4 py-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y">
                                    ${tasks.slice(0, 20).map(t => `
                                        <tr>
                                            <td class="px-4 py-3">
                                                <a href="#task/${t.id}" class="font-medium text-blue-600 hover:underline truncate block w-48">${t.title}</a>
                                                <div class="text-xs text-gray-500">${formatDate(t.createdAt)}</div>
                                            </td>
                                            <td class="px-4 py-3">
                                                <span class="px-2 py-1 bg-gray-100 rounded text-xs uppercase font-bold">${t.status}</span>
                                            </td>
                                            <td class="px-4 py-3 text-right">
                                                ${['open', 'assigned'].includes(t.status) ? `
                                                    <button onclick="cancelTask('${t.id}')" class="text-xs font-bold text-red-600 hover:underline">Cancel</button>
                                                ` : ''}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `);
    };
})(window);
