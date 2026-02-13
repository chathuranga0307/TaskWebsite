(function (window) {
    const Layout = window.Layout;

    window.Home = async () => {
        return Layout(`
            <!-- Hero -->
            <div class="bg-blue-600 text-white py-20">
                <div class="max-w-7xl mx-auto px-4 text-center">
                    <h1 class="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        Get more done.<br/>Have more fun.
                    </h1>
                    <p class="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
                        From cleaning to gardening, find the right person for the job.
                    </p>
                    
                    <div class="max-w-2xl mx-auto bg-white rounded-full p-2 flex shadow-lg">
                        <input type="text" placeholder="What do you need done?" 
                            class="flex-grow px-6 py-3 rounded-l-full text-gray-800 focus:outline-none"
                            onkeypress="if(event.key === 'Enter') location.hash = '#browse?search=' + this.value"
                        >
                        <button onclick="location.hash='#post-task'" class="bg-green-500 text-white font-bold px-8 py-3 rounded-full hover:bg-green-600 transition">
                            Get it done
                        </button>
                    </div>
                </div>
            </div>

            <!-- Categories -->
            <div class="max-w-7xl mx-auto px-4 py-16">
                <h2 class="text-3xl font-bold mb-8 text-center">Explore Categories</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    ${['Cleaning', 'Gardening', 'Handyman', 'Moving', 'Photography', 'Computer IT', 'Assembly', 'Delivery'].map(cat => `
                        <a href="#browse?category=${cat}" class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center border group">
                            <div class="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 class="font-bold text-gray-700">${cat}</h3>
                        </a>
                    `).join('')}
                </div>
            </div>

            <!-- How it works -->
            <div class="bg-white py-16">
                <div class="max-w-7xl mx-auto px-4">
                    <h2 class="text-3xl font-bold mb-12 text-center">How it works</h2>
                    <div class="grid md:grid-cols-3 gap-12 text-center">
                        <div>
                            <div class="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-blue-600">1</div>
                            <h3 class="text-xl font-bold mb-2">Post a task</h3>
                            <p class="text-gray-600">Tell us what you need done, when and where.</p>
                        </div>
                        <div>
                            <div class="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-blue-600">2</div>
                            <h3 class="text-xl font-bold mb-2">Choose the best person</h3>
                            <p class="text-gray-600">Browse offers, check profiles and reviews.</p>
                        </div>
                        <div>
                            <div class="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-blue-600">3</div>
                            <h3 class="text-xl font-bold mb-2">Job done!</h3>
                            <p class="text-gray-600">Get it done and pay securely.</p>
                        </div>
                    </div>
                </div>
            </div>
        `);
    };
})(window);
