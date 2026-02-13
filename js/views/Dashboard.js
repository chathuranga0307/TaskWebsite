(function (window) {
    const Layout = window.Layout;
    const auth = window.Auth;
    const store = window.Store;
    const { formatCurrency, formatDate } = window.Utils;

    window.Dashboard = () => {
        const user = auth.getCurrentUser();

        // Poster Data
        const myPostedTasks = store.getTasks({ posterId: user.id });
        const freeJobs = user.freeJobsRemainingPoster;

        // Doer Data
        const myOffers = store.getOffersByDoer(user.id);
        const myTransactions = store.getTransactionsByDoer(user.id);
        const totalEarned = myTransactions.reduce((acc, tx) => acc + tx.netToDoer, 0);

        const PosterDashboard = `
            <div class="mb-12">
                <h2 class="text-2xl font-bold mb-4">Poster Dashboard</h2>
                <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 flex justify-between items-center">
                    <div>
                        <span class="font-bold text-blue-800">Free Jobs Remaining:</span> 
                        <span class="text-2xl font-black text-blue-600">${freeJobs}</span>
                    </div>
                    <a href="#post-task" class="btn-primary">Post New Task</a>
                </div>

                <h3 class="text-xl font-bold mb-4">My Posted Tasks</h3>
                ${myPostedTasks.length === 0 ? '<p class="text-gray-500">No tasks posted yet.</p>' : `
                    <div class="space-y-4">
                        ${myPostedTasks.map(task => `
                            <div class="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
                                <div>
                                    <a href="#task/${task.id}" class="font-bold text-lg hover:underline text-blue-600">${task.title}</a>
                                    <div class="text-sm text-gray-500">
                                        Status: <span class="uppercase font-bold ${task.status === 'open' ? 'text-green-600' : 'text-gray-600'}">${task.status}</span>
                                        | Created: ${formatDate(task.createdAt)}
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="block font-bold">${formatCurrency(task.budget)}</span>
                                    <span class="text-xs text-gray-400">${store.getOffersByTask(task.id).length} offers</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;

        const DoerDashboard = `
            <div>
                <h2 class="text-2xl font-bold mb-4">Doer Dashboard</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-lg shadow text-center">
                        <div class="text-gray-500 mb-1">Total Earned</div>
                        <div class="text-3xl font-black text-green-600">${formatCurrency(totalEarned)}</div>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow text-center">
                        <div class="text-gray-500 mb-1">Active Offers</div>
                        <div class="text-3xl font-black text-blue-600">${myOffers.filter(o => o.status === 'pending').length}</div>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow text-center">
                        <div class="text-gray-500 mb-1">Jobs Completed</div>
                        <div class="text-3xl font-black text-purple-600">${myTransactions.length}</div>
                    </div>
                </div>

                <h3 class="text-xl font-bold mb-4">My Offers</h3>
                ${myOffers.length === 0 ? '<p class="text-gray-500">No offers made yet. <a href="#browse" class="text-blue-600">Browse tasks</a></p>' : `
                    <div class="space-y-4">
                        ${myOffers.map(offer => {
            const task = store.getTask(offer.taskId);
            if (!task) return '';
            return `
                            <div class="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
                                <div>
                                    <a href="#task/${task.id}" class="font-bold text-lg hover:underline text-blue-600">${task.title}</a>
                                    <div class="text-sm text-gray-500">
                                        Offer Status: <span class="uppercase font-bold ${offer.status === 'accepted' ? 'text-green-600' : 'text-gray-600'}">${offer.status}</span>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="block font-bold text-green-600">My Offer: ${formatCurrency(offer.price)}</span>
                                </div>
                            </div>
                        `}).join('')}
                    </div>
                `}
            </div>
        `;

        return Layout(`
            <div class="max-w-4xl mx-auto px-4 py-8">
                <h1 class="text-3xl font-bold mb-8">Dashboard</h1>
                ${user.role === 'poster' || user.role === 'both' || user.role === 'admin' ? PosterDashboard : ''}
                ${user.role === 'doer' || user.role === 'both' || user.role === 'admin' ? '<div class="border-t my-8"></div>' + DoerDashboard : ''}
            </div>
        `);
    };
})(window);
