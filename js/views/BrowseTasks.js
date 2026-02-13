(function (window) {
    const Layout = window.Layout;
    const store = window.Store;
    const { formatCurrency, timeAgo } = window.Utils;

    window.BrowseTasks = (params) => {
        const filters = {
            category: params.category || '',
            suburb: params.suburb || '',
            search: params.search || '',
            status: 'open' // Default to open tasks
        };

        // Simple filter handling
        window.handleFilter = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const newParams = new URLSearchParams();
            if (formData.get('search')) newParams.set('search', formData.get('search'));
            if (formData.get('category')) newParams.set('category', formData.get('category'));
            if (formData.get('suburb')) newParams.set('suburb', formData.get('suburb'));
            window.location.hash = `#browse?${newParams.toString()}`;
        };

        const tasks = store.getTasks(filters);

        return Layout(`
            <div class="max-w-7xl mx-auto px-4 py-8">
                <div class="flex flex-col md:flex-row gap-8">
                    <!-- Sidebar Filters -->
                    <aside class="w-full md:w-64 flex-shrink-0">
                        <div class="bg-white p-6 rounded-xl shadow border sticky top-24">
                            <h2 class="font-bold text-lg mb-4">Filters</h2>
                            <form onsubmit="handleFilter(event)" class="space-y-4">
                                <div>
                                    <label class="text-sm font-bold text-gray-700">Search</label>
                                    <input type="text" name="search" value="${filters.search}" class="input-field text-sm">
                                </div>
                                <div>
                                    <label class="text-sm font-bold text-gray-700">Category</label>
                                    <select name="category" class="input-field text-sm">
                                        <option value="">All Categories</option>
                                        ${['Cleaning', 'Gardening', 'Handyman', 'Moving', 'Photography', 'Computer IT', 'Assembly', 'Delivery', 'Other'].map(c => `
                                            <option value="${c}" ${filters.category === c ? 'selected' : ''}>${c}</option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="text-sm font-bold text-gray-700">Suburb</label>
                                    <input type="text" name="suburb" value="${filters.suburb}" class="input-field text-sm">
                                </div>
                                <button type="submit" class="btn-primary w-full text-sm">Apply Filters</button>
                            </form>
                        </div>
                    </aside>

                    <!-- Task List -->
                    <div class="flex-grow">
                        <h1 class="text-2xl font-bold mb-6">
                            ${tasks.length} Task${tasks.length !== 1 ? 's' : ''} Found
                        </h1>
                        
                        ${tasks.length === 0 ? `
                            <div class="text-center py-20 bg-white rounded-xl border">
                                <p class="text-gray-500 mb-4">No tasks found matching your criteria.</p>
                                <a href="#post-task" class="btn-primary">Post a Task</a>
                            </div>
                        ` : `
                            <div class="space-y-4">
                                ${tasks.map(task => {
            const poster = store.getUser(task.posterId);
            const offerCount = store.getOffersByTask(task.id).length;
            return `
                                    <a href="#task/${task.id}" class="block bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition group">
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h3 class="text-xl font-bold group-hover:text-blue-600 mb-2">${task.title}</h3>
                                                <div class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                                    <span class="flex items-center">
                                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                        ${task.suburb}
                                                    </span>
                                                    <span class="flex items-center">
                                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                        ${task.dueDate}
                                                    </span>
                                                    <span class="bg-gray-100 px-2 py-1 rounded text-xs font-bold uppercase">${task.status}</span>
                                                </div>
                                                <div class="flex items-center space-x-2">
                                                    <div class="h-6 w-6 rounded-full flex items-center justify-center text-xs text-white" style="background-color: ${poster?.avatarColor || '#ccc'}">
                                                        ${poster?.name.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <span class="text-sm text-gray-600">Posted by ${poster?.name || 'Unknown'}</span>
                                                    <span class="text-xs text-gray-400">&bull; ${timeAgo(task.createdAt)}</span>
                                                </div>
                                            </div>
                                            <div class="text-center flex-shrink-0 ml-4">
                                                <div class="text-2xl font-black text-gray-800">${formatCurrency(task.budget)}</div>
                                                <div class="text-xs font-bold text-gray-400 uppercase mt-1">${offerCount} Offers</div>
                                            </div>
                                        </div>
                                    </a>
                                `}).join('')}
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `);
    };
})(window);
