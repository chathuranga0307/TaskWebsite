(function (window) {
    const Layout = window.Layout;
    const store = window.Store;
    const auth = window.Auth;
    const { formatDateTime } = window.Utils;

    window.Messages = (params) => {
        const user = auth.getCurrentUser();
        if (!user) {
            window.location.hash = '#login';
            return '';
        }

        const conversations = store.getConversations(user.id);
        const selectedId = params.conversationId;
        const activeConversation = selectedId ? store.getConversation(selectedId) : null;

        if (selectedId && !activeConversation) return Layout('Conversation not found');

        if (activeConversation) {
            // Chat View
            const otherUserId = activeConversation.userAId === user.id ? activeConversation.userBId : activeConversation.userAId;
            const otherUser = store.getUser(otherUserId);
            const task = store.getTask(activeConversation.taskId);
            const messages = store.getMessages(selectedId);

            window.sendMessage = (e) => {
                e.preventDefault();
                const text = e.target.text.value;
                store.addMessage({
                    conversationId: selectedId,
                    fromUserId: user.id,
                    toUserId: otherUserId,
                    taskId: task.id,
                    text
                });
                window.location.reload();
            };

            // Auto scroll to bottom
            setTimeout(() => {
                const el = document.getElementById('chat-history');
                if (el) el.scrollTop = el.scrollHeight;
            }, 100);

            return Layout(`
                <div class="h-[calc(100vh-140px)] flex flex-col max-w-4xl mx-auto px-4 py-6">
                    <div class="border-b pb-4 mb-4 flex justify-between items-center">
                        <div>
                            <a href="#messages" class="text-sm text-gray-500 hover:text-blue-600 mb-1 block">&larr; Back to Inbox</a>
                            <h2 class="font-bold text-xl">${otherUser.name}</h2>
                            <a href="#task/${task.id}" class="text-xs text-blue-600 hover:underline">Re: ${task.title}</a>
                        </div>
                    </div>

                    <div id="chat-history" class="flex-grow overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-xl border mb-4">
                        ${messages.length === 0 ? '<div class="text-center text-gray-400 mt-10">Start the conversation...</div>' :
                    messages.map(m => `
                            <div class="flex ${m.fromUserId === user.id ? 'justify-end' : 'justify-start'}">
                                <div class="max-w-xs md:max-w-md p-3 rounded-lg text-sm ${m.fromUserId === user.id ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none'}">
                                    <p>${m.text}</p>
                                    <div class="text-xs opacity-70 mt-1 ${m.fromUserId === user.id ? 'text-blue-200' : 'text-gray-400'}">${formatDateTime(m.createdAt)}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <form onsubmit="sendMessage(event)" class="flex gap-4">
                        <input type="text" name="text" class="input-field flex-grow" placeholder="Type a message..." required autocomplete="off">
                        <button type="submit" class="btn-primary">Send</button>
                    </form>
                </div>
            `);
        }

        // Inbox View
        return Layout(`
            <div class="max-w-4xl mx-auto px-4 py-10">
                <h1 class="text-3xl font-bold mb-8">Messages</h1>
                ${conversations.length === 0 ? '<p class="text-gray-500">No conversations yet.</p>' : `
                    <div class="space-y-4">
                        ${conversations.map(c => {
            const otherUserId = c.userAId === user.id ? c.userBId : c.userAId;
            const otherUser = store.getUser(otherUserId);
            const task = store.getTask(c.taskId);
            const lastMsg = store.getMessages(c.id).pop();

            return `
                            <a href="#messages?conversationId=${c.id}" class="block bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition">
                                <div class="flex items-center space-x-4">
                                    <div class="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${otherUser.avatarColor}">${otherUser.name[0]}</div>
                                    <div class="flex-grow min-w-0">
                                        <div class="flex justify-between items-baseline mb-1">
                                            <h3 class="font-bold text-gray-900 truncate">${otherUser.name}</h3>
                                            <span class="text-xs text-gray-400 flex-shrink-0">${formatDateTime(c.lastMessageAt)}</span>
                                        </div>
                                        <p class="text-sm font-medium text-blue-600 truncate mb-1">${task.title}</p>
                                        <p class="text-sm text-gray-500 truncate">${lastMsg ? lastMsg.text : 'No messages yet'}</p>
                                    </div>
                                </div>
                            </a>
                            `;
        }).join('')}
                    </div>
                `}
            </div>
        `);
    };
})(window);
