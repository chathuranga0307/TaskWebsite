(function (window) {
    const Layout = window.Layout;
    const store = window.Store;
    const auth = window.Auth;
    const { timeAgo } = window.Utils;

    window.Profile = (params) => {
        const userId = params.id;
        const user = store.getUser(userId);

        if (!user) return Layout('<div class="p-10 text-center">User not found</div>');

        const reviews = store.getReviewsForUser(userId);
        const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'New';

        // Check if logged in user can review this user (must have had a transaction)
        const currentUser = auth.getCurrentUser();
        let canReview = false;

        if (currentUser && currentUser.id !== user.id) {
            const myTx = store.state.transactions.filter(t =>
                (t.posterId === currentUser.id && t.doerId === user.id) ||
                (t.posterId === user.id && t.doerId === currentUser.id)
            );

            // Find one where I haven't reviewed yet
            const unreviewedTx = myTx.find(t => !store.hasReviewed(t.taskId, currentUser.id));
            if (unreviewedTx) {
                canReview = true;
                window.submitReview = (e) => {
                    e.preventDefault();
                    store.addReview({
                        taskId: unreviewedTx.taskId,
                        fromUserId: currentUser.id,
                        toUserId: user.id,
                        rating: parseInt(e.target.rating.value),
                        text: e.target.text.value
                    });
                    window.location.reload();
                };
            }
        }

        return Layout(`
            <div class="max-w-4xl mx-auto px-4 py-10">
                <div class="bg-white rounded-xl shadow border overflow-hidden">
                    <div class="h-32 bg-blue-600"></div>
                    <div class="px-8 pb-8">
                        <div class="relative flex justify-between items-end -mt-12 mb-6">
                            <div class="h-24 w-24 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-3xl shadow-lg" style="background-color: ${user.avatarColor}">
                                ${user.name[0]}
                            </div>
                            ${currentUser && currentUser.id === user.id ? '<a href="#settings" class="btn-secondary text-sm">Edit Profile</a>' : ''}
                        </div>
                        
                        <h1 class="text-3xl font-bold mb-1">${user.name}</h1>
                        <div class="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                            <span class="flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
                                ${user.suburb}
                            </span>
                            <span class="flex items-center">
                                <svg class="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                ${avgRating} Rating (${reviews.length} reviews)
                            </span>
                            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase">${user.role}</span>
                        </div>

                        ${user.bio ? `<p class="text-gray-700 mb-6 max-w-2xl">${user.bio}</p>` : ''}

                        ${user.skills && user.skills.length > 0 ? `
                            <div class="flex flex-wrap gap-2 mb-8">
                                ${user.skills.map(skill => `<span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">${skill}</span>`).join('')}
                            </div>
                        ` : ''}
                        
                        <hr class="my-8">
                        
                        <h2 class="text-xl font-bold mb-6">Reviews</h2>
                        ${canReview ? `
                            <div class="bg-yellow-50 p-6 rounded-xl border mb-8">
                                <h3 class="font-bold mb-4">Leave a Review</h3>
                                <form onsubmit="submitReview(event)" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-1">Rating</label>
                                        <select name="rating" class="input-field w-32">
                                            <option value="5">5 - Excellent</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="3">3 - Good</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="1">1 - Poor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-1">Comment</label>
                                        <textarea name="text" class="input-field h-24" required placeholder="Describe your experience..."></textarea>
                                    </div>
                                    <button type="submit" class="btn-primary">Post Review</button>
                                </form>
                            </div>
                        ` : ''}
                        
                        ${reviews.length === 0 ? '<p class="text-gray-500">No reviews yet.</p>' : `
                            <div class="space-y-6">
                                ${reviews.map(r => {
            const reviewer = store.getUser(r.fromUserId);
            return `
                                    <div class="flex space-x-4">
                                        <div class="h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center text-white" style="background-color: ${reviewer.avatarColor}">${reviewer.name[0]}</div>
                                        <div>
                                            <div class="flex items-center space-x-2">
                                                <span class="font-bold">${reviewer.name}</span>
                                                <span class="text-gray-400 text-sm">&bull; ${timeAgo(r.createdAt)}</span>
                                            </div>
                                            <div class="flex text-yellow-500 text-sm mb-1">
                                                ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
                                            </div>
                                            <p class="text-gray-700 text-sm">${r.text}</p>
                                        </div>
                                    </div>
                                    `;
        }).join('')}
                            </div>
                        `}

                    </div>
                </div>
            </div>
        `);
    };
})(window);
