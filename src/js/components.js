/**
 * Reusable UI Components for Zenith Application
 */

const Components = {
    /**
     * Create sidebar navigation
     */
    createSidebar(role, activeItem) {
        const candidateNav = [
            { icon: 'dashboard', label: 'Dashboard', href: '/candidate-dashboard.html' },
            { icon: 'work', label: 'My Jobs', href: '/candidate-jobs.html' },
            { icon: 'assignment', label: 'Assessments', href: '/assessment-taking.html' },
            { icon: 'person', label: 'Profile', href: '/candidate-profile.html' }
        ];

        const recruiterNav = [
            { icon: 'dashboard', label: 'Dashboard', href: '/recruiter-dashboard.html' },
            { icon: 'add_circle', label: 'Post Job', href: '/job-posting.html' },
            { icon: 'group', label: 'Candidates', href: '/candidate-pipeline.html' },
            { icon: 'assignment', label: 'Assessments', href: '/recruiter-assessments.html' },
            { icon: 'calendar_month', label: 'Schedule', href: '/schedule-interview.html' }
        ];

        const bottomNav = role === 'recruiter' ? [
            { icon: 'settings', label: 'Settings', href: '/recruiter-dashboard.html#settings' },
            { icon: 'logout', label: 'Logout', href: '/logout.html' }
        ] : [
            { icon: 'logout', label: 'Logout', href: '/logout.html' }
        ];

        const navItems = role === 'candidate' ? candidateNav : recruiterNav;

        const navHTML = navItems.map(item => `
            <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg ${activeItem === item.label.toLowerCase()
                ? 'bg-blue-50 text-primary font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            } transition-colors" href="${item.href}">
                <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
                <span>${item.label}</span>
            </a>
        `).join('');

        const bottomSection = `
            <div class="pt-4 mt-4 border-t border-slate-200">
                <p class="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account</p>
                ${bottomNav.map(item => `
                    <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="${item.href}">
                        <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
                        <span>${item.label}</span>
                    </a>
                `).join('')}
            </div>
        `;

        return `
            <aside class="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col h-full">
                <div class="flex flex-col h-full">
                    <div class="h-16 flex items-center gap-3 px-6 border-b border-slate-200">
                        <div class="bg-primary/10 text-primary p-1.5 rounded-lg">
                            <span class="material-symbols-outlined text-[24px]">all_inclusive</span>
                        </div>
                        <div>
                            <h1 class="text-slate-900 text-base font-bold leading-none">Zenith</h1>
                            <p class="text-slate-500 text-xs font-medium mt-0.5">${role === 'candidate' ? 'Candidate Portal' : 'Recruiter Platform'}</p>
                        </div>
                    </div>
                    <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                        ${navHTML}
                        ${bottomSection}
                    </nav>
                    <div class="p-4 border-t border-slate-200">
                        <div id="user-profile-sidebar" class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                            <!-- Will be populated by JS -->
                        </div>
                    </div>
                </div>
            </aside>
        `;
    },

    /**
     * Create header with search and notifications
     */
    createHeader(title, showSearch = true) {
        return `
            <header class="h-16 flex items-center justify-between px-6 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex-shrink-0 z-10">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white hidden md:block">${title}</h2>
                <div class="flex items-center gap-4 flex-1 md:flex-none justify-end">
                    ${showSearch ? `
                    <div class="relative w-full max-w-xs md:max-w-md hidden sm:block">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <span class="material-symbols-outlined text-[20px]">search</span>
                        </span>
                        <input 
                            class="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm h-10" 
                            placeholder="Search..." 
                            type="text"
                            id="header-search"
                        />
                    </div>
                    ` : ''}
                    <button class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors relative" id="notifications-btn">
                        <span class="material-symbols-outlined">notifications</span>
                        <span class="notification-badge absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 hidden"></span>
                    </button>
                </div>
            </header>
        `;
    },

    /**
     * Create loading spinner
     */
    createLoader() {
        return `
            <div class="flex items-center justify-center p-8">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        `;
    },

    /**
     * Create empty state
     */
    createEmptyState(icon, title, description, actionLabel, actionHref) {
        return `
            <div class="flex flex-col items-center justify-center p-12 text-center">
                <div class="bg-slate-100 dark:bg-slate-800 rounded-full p-6 mb-4">
                    <span class="material-symbols-outlined text-slate-400 text-[48px]">${icon}</span>
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">${title}</h3>
                <p class="text-slate-500 dark:text-slate-400 mb-6 max-w-md">${description}</p>
                ${actionLabel ? `
                    <a href="${actionHref}" class="bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors" data-link>
                        ${actionLabel}
                    </a>
                ` : ''}
            </div>
        `;
    },

    /**
     * Create modal
     */
    createModal(id, title, content, actions = []) {
        const actionsHTML = actions.map(action => `
            <button 
                class="${action.primary ? 'bg-primary hover:bg-blue-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'} px-4 py-2 rounded-lg font-medium transition-colors"
                onclick="${action.onclick}"
            >
                ${action.label}
            </button>
        `).join('');

        return `
            <div id="${id}" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4">
                <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full">
                    <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white">${title}</h3>
                    </div>
                    <div class="px-6 py-4">
                        ${content}
                    </div>
                    <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                        ${actionsHTML}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-y-20`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.remove('translate-y-20'), 100);
        setTimeout(() => {
            toast.classList.add('translate-y-20');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Update notification badge
     */
    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        const count = window.StateManager?.getUnreadCount() || 0;
        if (badge) {
            badge.classList.toggle('hidden', count === 0);
        }
    },

    /**
     * Populate user profile in sidebar
     */
    populateUserProfile() {
        const container = document.getElementById('user-profile-sidebar');
        if (!container) return;

        const user = window.StateManager?.getUser();
        const role = window.StateManager?.getUserRole();

        if (!user) return;

        const profileUrl = role === 'candidate' ? '/candidate-profile.html' : '/recruiter-profile.html';

        container.innerHTML = `
            <a href="${profileUrl}" class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold">
                ${user.name?.charAt(0) || 'U'}
            </a>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-900 dark:text-white truncate">${user.name || 'User'}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${user.email || ''}</p>
            </div>
        `;
    }
};

// Make globally available
window.Components = Components;

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Components;
}
