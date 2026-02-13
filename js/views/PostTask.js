(function (window) {
    const Layout = window.Layout;
    const store = window.Store;
    const auth = window.Auth;

    window.PostTask = () => {
        const user = auth.getCurrentUser();
        if (!user) {
            window.location.hash = '#login';
            return '';
        }

        window.submitTask = (e) => {
            e.preventDefault();
            const task = {
                posterId: user.id,
                title: e.target.title.value,
                category: e.target.category.value,
                suburb: e.target.suburb.value,
                description: e.target.description.value,
                budget: parseFloat(e.target.budget.value),
                dueDate: e.target.dueDate.value
            };

            const newTask = store.createTask(task);
            alert('Task Posted Successfully!');
            window.location.hash = `#task/${newTask.id}`;
        };

        return Layout(`
            <div class="max-w-2xl mx-auto px-4 py-10">
                <h1 class="text-3xl font-bold mb-6">Post a Task</h1>
                
                <form onsubmit="submitTask(event)" class="bg-white p-8 rounded-xl shadow-md border space-y-6">
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Task Title</label>
                        <input type="text" name="title" class="input-field" placeholder="e.g. Move my sofa" required minlength="10">
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Category</label>
                            <select name="category" class="input-field">
                                <option>Cleaning</option>
                                <option>Gardening</option>
                                <option>Handyman</option>
                                <option>Moving</option>
                                <option>Photography</option>
                                <option>Computer IT</option>
                                <option>Assembly</option>
                                <option>Delivery</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Suburb</label>
                            <input type="text" name="suburb" class="input-field" required>
                        </div>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Description</label>
                        <textarea name="description" class="input-field h-32" placeholder="Describe the task in detail..." required></textarea>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">My Budget ($)</label>
                            <input type="number" name="budget" class="input-field" min="5" required>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Due Date</label>
                            <input type="date" name="dueDate" class="input-field" required>
                        </div>
                    </div>

                    <div class="pt-4">
                        <button type="submit" class="btn-primary w-full text-lg font-bold py-4">Post Task</button>
                    </div>

                </form>
            </div>
        `);
    };
})(window);
