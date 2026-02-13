(function (window) {
    const STORAGE_KEY = 'airtasker_clone_data';
    const generateId = window.Utils.generateId;

    const defaultState = {
        users: [],
        tasks: [],
        offers: [],
        messages: [],
        conversations: [],
        reviews: [],
        transactions: [],
        reports: [],
        settings: {
            adsEnabled: true
        }
    };

    class Store {
        constructor() {
            this.load();
        }

        load() {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                this.state = JSON.parse(data);
            } else {
                this.state = defaultState;
                this.save();
            }
        }

        save() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        }

        // --- Users ---
        createUser(user) {
            const newUser = {
                id: generateId(),
                createdAt: new Date().toISOString(),
                freeJobsRemainingPoster: 3,
                totalFeesPaid: 0,
                isBanned: false,
                avatarColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                ...user
            };
            this.state.users.push(newUser);
            this.save();
            return newUser;
        }

        getUser(id) {
            return this.state.users.find(u => u.id === id);
        }

        getUserByEmail(email) {
            return this.state.users.find(u => u.email === email);
        }

        updateUser(id, updates) {
            const index = this.state.users.findIndex(u => u.id === id);
            if (index !== -1) {
                this.state.users[index] = { ...this.state.users[index], ...updates };
                this.save();
                return this.state.users[index];
            }
            return null;
        }

        getAllUsers() {
            return this.state.users;
        }

        // --- Tasks ---
        createTask(task) {
            const newTask = {
                id: generateId(),
                createdAt: new Date().toISOString(),
                status: 'open',
                assignedOfferId: null,
                completedAt: null,
                ...task
            };
            this.state.tasks.push(newTask);
            this.save();
            return newTask;
        }

        getTasks(filters = {}) {
            let tasks = this.state.tasks;
            if (filters.category) tasks = tasks.filter(t => t.category === filters.category);
            if (filters.suburb) tasks = tasks.filter(t => t.suburb.toLowerCase().includes(filters.suburb.toLowerCase()));
            if (filters.status) tasks = tasks.filter(t => t.status === filters.status);
            if (filters.search) {
                const q = filters.search.toLowerCase();
                tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
            }
            if (filters.posterId) tasks = tasks.filter(t => t.posterId === filters.posterId);

            // Sort by newest
            return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        getTask(id) {
            return this.state.tasks.find(t => t.id === id);
        }

        updateTask(id, updates) {
            const index = this.state.tasks.findIndex(t => t.id === id);
            if (index !== -1) {
                this.state.tasks[index] = { ...this.state.tasks[index], ...updates };
                this.save();
                return this.state.tasks[index];
            }
            return null;
        }

        // --- Offers ---
        createOffer(offer) {
            const newOffer = {
                id: generateId(),
                createdAt: new Date().toISOString(),
                status: 'pending',
                ...offer
            };
            this.state.offers.push(newOffer);
            this.save();
            return newOffer;
        }

        getOffersByTask(taskId) {
            return this.state.offers.filter(o => o.taskId === taskId);
        }

        getOffersByDoer(doerId) {
            return this.state.offers.filter(o => o.doerId === doerId);
        }

        updateOffer(id, updates) {
            const index = this.state.offers.findIndex(o => o.id === id);
            if (index !== -1) {
                this.state.offers[index] = { ...this.state.offers[index], ...updates };
                this.save();
                return this.state.offers[index];
            }
        }

        // --- Conversations & Messages ---
        createConversation(taskId, userAId, userBId) {
            // Check existing
            let conv = this.state.conversations.find(c =>
                c.taskId === taskId &&
                ((c.userAId === userAId && c.userBId === userBId) || (c.userAId === userBId && c.userBId === userAId))
            );
            if (!conv) {
                conv = {
                    id: generateId(),
                    taskId,
                    userAId,
                    userBId,
                    lastMessageAt: new Date().toISOString()
                };
                this.state.conversations.push(conv);
                this.save();
            }
            return conv;
        }

        getConversations(userId) {
            return this.state.conversations.filter(c => c.userAId === userId || c.userBId === userId)
                .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
        }

        getConversation(id) {
            return this.state.conversations.find(c => c.id === id);
        }

        addMessage(msg) {
            const newMsg = {
                id: generateId(),
                createdAt: new Date().toISOString(),
                ...msg
            };
            this.state.messages.push(newMsg);

            // Update conversation lastMessageAt
            const convIdx = this.state.conversations.findIndex(c => c.id === msg.conversationId);
            if (convIdx !== -1) {
                this.state.conversations[convIdx].lastMessageAt = newMsg.createdAt;
            }

            this.save();
            return newMsg;
        }

        getMessages(conversationId) {
            return this.state.messages.filter(m => m.conversationId === conversationId)
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        // --- Transactions ---
        createTransaction(tx) {
            const newTx = {
                id: generateId(),
                createdAt: new Date().toISOString(),
                status: 'paid',
                ...tx
            };
            this.state.transactions.push(newTx);
            this.save();
            return newTx;
        }

        getTransactionsByDoer(doerId) {
            return this.state.transactions.filter(t => t.doerId === doerId);
        }

        // --- Reviews ---
        addReview(review) {
            const newReview = {
                id: generateId(),
                createdAt: new Date().toISOString(),
                ...review
            };
            this.state.reviews.push(newReview);
            this.save();
            return newReview;
        }

        getReviewsForUser(userId) {
            return this.state.reviews.filter(r => r.toUserId === userId);
        }

        hasReviewed(taskId, fromUserId) {
            return this.state.reviews.some(r => r.taskId === taskId && r.fromUserId === fromUserId);
        }

        // --- Settings / Admin ---
        getSettings() {
            return this.state.settings;
        }

        updateSettings(key, value) {
            this.state.settings[key] = value;
            this.save();
        }

        seedData() {
            // Only seed if empty
            if (this.state.users.length > 0) return;

            console.log('Seeding data...');

            // Users
            const poster = this.createUser({ name: 'Alice Poster', email: 'alice@example.com', passwordHash: 'password', role: 'poster', suburb: 'New York' });
            const doer = this.createUser({ name: 'Bob Builder', email: 'bob@example.com', passwordHash: 'password', role: 'doer', suburb: 'Brooklyn', skills: ['Gardening', 'Cleaning'] });
            const admin = this.createUser({ name: 'Admin User', email: 'admin@example.com', passwordHash: 'password', role: 'admin', suburb: 'Admin City' });

            // Tasks
            const t1 = this.createTask({ posterId: poster.id, title: 'Clean my apartment', category: 'Cleaning', suburb: 'New York', description: 'Need a full clean of 2 bed apartment.', budget: 120, dueDate: '2025-12-31' });
            const t2 = this.createTask({ posterId: poster.id, title: 'Fix leaking tap', category: 'Handyman', suburb: 'New York', description: 'Kitchen tap is dripping.', budget: 50, dueDate: '2025-11-15' });

            // Offers
            this.createOffer({ taskId: t1.id, doerId: doer.id, price: 110, message: 'I can do this tomorrow!' });

            console.log('Seeding complete.');
            window.location.reload();
        }

        clearData() {
            localStorage.removeItem(STORAGE_KEY);
            window.location.reload();
        }
    }

    window.Store = new Store();
})(window);
