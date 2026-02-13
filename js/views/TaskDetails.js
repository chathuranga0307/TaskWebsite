(function (window) {
    const Layout = window.Layout;
    const store = window.Store;
    const auth = window.Auth;
    const { formatCurrency, formatDate } = window.Utils;

    window.TaskDetails = (params) => {
        const task = store.getTask(params.id);
        if (!task) return Layout('<div class="p-10 text-center">Task not found</div>');

        const user = auth.getCurrentUser();
        const poster = store.getUser(task.posterId);
        const offers = store.getOffersByTask(task.id);
        const isPoster = user && user.id === task.posterId;
        const hasOffered = user && offers.some(o => o.doerId === user.id);
        const assignedOffer = task.assignedOfferId ? store.state.offers.find(o => o.id === task.assignedOfferId) : null;
        const isAssignedDoer = user && assignedOffer && assignedOffer.doerId === user.id;

        // --- Actions ---
        window.makeOffer = (e) => {
            e.preventDefault();
            const price = parseFloat(e.target.price.value);
            const message = e.target.message.value;
            store.createOffer({ taskId: task.id, doerId: user.id, price, message });
            window.location.reload();
        };

        window.acceptOffer = (offerId) => {
            if (!confirm('Accept this offer?')) return;
            store.updateOffer(offerId, { status: 'accepted' });
            store.updateTask(task.id, { status: 'assigned', assignedOfferId: offerId });

            // Create conversation
            const offerObj = store.state.offers.find(o => o.id === offerId);
            store.createConversation(task.id, task.posterId, offerObj.doerId);

            window.location.reload();
        };

        window.completeTask = () => {
            if (!confirm('Mark task as complete and pay?')) return;

            // Fee logic
            let fee = 0;
            let finalAmount = assignedOffer.price;
            const posterUser = store.getUser(task.posterId);

            if (posterUser.freeJobsRemainingPoster > 0) {
                store.updateUser(posterUser.id, { freeJobsRemainingPoster: posterUser.freeJobsRemainingPoster - 1 });
            } else {
                fee = parseFloat((finalAmount * 0.10).toFixed(2));
            }

            const netToDoer = finalAmount - fee;

            store.createTransaction({
                taskId: task.id,
                posterId: task.posterId,
                doerId: assignedOffer.doerId,
                amount: finalAmount,
                fee,
                netToDoer
            });

            store.updateTask(task.id, { status: 'completed', completedAt: new Date().toISOString() });
            store.updateUser(posterUser.id, { totalFeesPaid: posterUser.totalFeesPaid + fee });

            alert(`Payment Successful!\nAmount: ${formatCurrency(finalAmount)}\nFee: ${formatCurrency(fee)}\nNet to Doer: ${formatCurrency(netToDoer)}`);
            window.location.reload();
        };

        // --- Components ---
        const StatusBadge = `<span class="px-3 py-1 rounded text-sm font-bold uppercase bg-blue-100 text-blue-800">${task.status}</span>`;

        const ActionSection = () => {
            if (!user) return `<div class="bg-gray-50 p-6 rounded-xl border text-center"><a href="#login" class="btn-primary">Log in to make an offer</a></div>`;

            if (isPoster) {
                if (task.status === 'open') return `
                    <div class="bg-blue-50 p-6 rounded-xl border mt-8">
                        <h3 class="font-bold text-lg mb-4">Offers (${offers.length})</h3>
                        ${offers.length === 0 ? '<p class="text-gray-500">No offers yet.</p>' :
                        offers.map(o => {
                            const doer = store.getUser(o.doerId);
                            return `
                                <div class="bg-white p-4 rounded-lg shadow mb-4">
                                    <div class="flex justify-between items-center mb-2">
                                        <div class="flex items-center space-x-2">
                                            <div class="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs" style="background-color: ${doer.avatarColor}">${doer.name[0]}</div>
                                            <span class="font-bold">${doer.name}</span>
                                        </div>
                                        <span class="font-black text-green-600 text-lg">${formatCurrency(o.price)}</span>
                                    </div>
                                    <p class="text-gray-600 text-sm mb-4">${o.message}</p>
                                    <button onclick="acceptOffer('${o.id}')" class="btn-primary text-sm w-full">Accept Offer</button>
                                </div>
                            `}).join('')
                    }
                    </div>
                `;
                if (task.status === 'assigned') return `
                    <div class="bg-green-50 p-6 rounded-xl border mt-8 text-center">
                        <h3 class="font-bold text-lg mb-2">Task Assigned</h3>
                        <p class="mb-4">You accepted an offer for <strong>${formatCurrency(assignedOffer.price)}</strong>.</p>
                        <div class="flex justify-center space-x-4">
                            <a href="#messages" class="btn-secondary">Message Doer</a>
                            <button onclick="completeTask()" class="btn-primary">Mark Completed & Pay</button>
                        </div>
                    </div>
                `;
                if (task.status === 'completed') return `
                    <div class="bg-gray-100 p-6 rounded-xl border mt-8 text-center">
                        <h3 class="font-bold text-lg text-green-600 mb-2">Task Completed</h3>
                        <p class="mb-4">Payment released.</p>
                        <a href="#profile/${assignedOffer.doerId}" class="text-blue-600 hover:underline">Leave a Review</a>
                    </div>
                `;
            } else {
                // Doer View
                if (task.status === 'open') {
                    if (hasOffered) return `<div class="bg-green-50 p-6 rounded-xl border text-center font-bold text-green-800">Offer Submitted</div>`;
                    return `
                        <div class="bg-white p-6 rounded-xl border shadow-sm mt-8">
                            <h3 class="font-bold text-lg mb-4">Make an Offer</h3>
                            <form onsubmit="makeOffer(event)" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-1">Your Price ($)</label>
                                    <input type="number" name="price" class="input-field" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-1">Message</label>
                                    <textarea name="message" class="input-field h-24" placeholder="Why are you the best person for this task?" required></textarea>
                                </div>
                                <button type="submit" class="btn-primary w-full">Submit Offer</button>
                            </form>
                        </div>
                    `;
                }
                if (task.status === 'assigned' && isAssignedDoer) return `
                    <div class="bg-green-50 p-6 rounded-xl border mt-8 text-center">
                        <h3 class="font-bold text-lg mb-2">You are assigned!</h3>
                        <p class="mb-4">The poster has accepted your offer.</p>
                        <a href="#messages" class="btn-primary">Message Poster</a>
                    </div>
                `;
            }
            return '';
        };

        return Layout(`
            <div class="max-w-4xl mx-auto px-4 py-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="md:col-span-2">
                        <div class="bg-white p-8 rounded-xl shadow border mb-6 relative">
                            <div class="absolute top-8 right-8">${StatusBadge}</div>
                            <h1 class="text-3xl font-bold mb-4 pr-20">${task.title}</h1>
                            
                            <div class="flex items-center space-x-6 text-gray-500 mb-8 border-b pb-6">
                                <div class="flex items-center">
                                    <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    ${task.suburb}
                                </div>
                                <div class="flex items-center">
                                    <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    ${formatDate(task.dueDate)}
                                </div>
                                <div class="flex items-center">
                                    <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                    ${task.category}
                                </div>
                            </div>

                            <div class="prose max-w-none mb-8">
                                <h3 class="text-lg font-bold mb-2">Details</h3>
                                <p class="whitespace-pre-line text-gray-700">${task.description}</p>
                            </div>

                        </div>
                        
                        ${ActionSection()}
                    </div>

                    <!-- Sidebar -->
                    <div class="space-y-6">
                        <div class="bg-white p-6 rounded-xl shadow border text-center">
                            <div class="text-gray-500 uppercase font-bold text-xs tracking-wider mb-1">Budget</div>
                            <div class="text-3xl font-black text-green-600">${formatCurrency(task.budget)}</div>
                        </div>

                        <div class="bg-white p-6 rounded-xl shadow border">
                            <h3 class="font-bold text-gray-700 mb-4">Posted By</h3>
                            <div class="flex items-center space-x-3">
                                <div class="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style="background-color: ${poster.avatarColor}">${poster.name[0]}</div>
                                <div>
                                    <div class="font-bold">${poster.name}</div>
                                    <div class="text-xs text-gray-400">Member since ${new Date(poster.createdAt).getFullYear()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    };
})(window);
