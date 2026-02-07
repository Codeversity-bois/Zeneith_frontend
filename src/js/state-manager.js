/**
 * State Manager for Zenith Application
 * Manages global application state including authentication and user data
 */

class StateManager {
    constructor() {
        this.state = {
            user: null,
            isAuthenticated: false,
            role: null, // 'candidate' or 'recruiter'
            notifications: [],
            currentJob: null,
            currentCandidate: null
        };

        this.listeners = [];
        this.loadFromStorage();
    }

    /**
     * Load state from localStorage
     */
    loadFromStorage() {
        try {
            const savedState = localStorage.getItem('zenith_state');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                this.state = { ...this.state, ...parsed };
            }

            // Fallback: Check for auth_token and current_user (used by auth-service.js)
            // This ensures compatibility between both auth systems
            const authToken = localStorage.getItem('auth_token');
            const currentUser = localStorage.getItem('current_user');

            if (authToken && currentUser && !this.state.isAuthenticated) {
                try {
                    const user = JSON.parse(currentUser);
                    this.state.user = user;
                    this.state.isAuthenticated = true;
                    this.state.role = user.role;
                    this.state.role = user.role;
                    console.log('✓ StateManager synced with auth_token and current_user');

                    // Validate token with backend
                    try {
                        // Dynamic import to avoid circular dependency issues during init
                        import('./api-client.js').then(({ apiClient }) => {
                            apiClient.post('/auth/refresh-token', {}).then(() => {
                                console.log('✓ Token validated with backend');
                            }).catch(err => {
                                console.warn('❌ Token invalid, logging out...', err);
                                this.logout();
                            });
                        });
                    } catch (err) {
                        console.error('Validation check failed', err);
                    }

                    this.saveToStorage();
                } catch (error) {
                    console.error('Failed to parse current_user:', error);
                }
            }
        } catch (error) {
            console.error('Failed to load state from storage:', error);
        }
    }

    /**
     * Save state to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('zenith_state', JSON.stringify(this.state));
        } catch (error) {
            console.error('Failed to save state to storage:', error);
        }
    }

    /**
     * Update state and notify listeners
     */
    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.saveToStorage();
        this.notifyListeners();
    }

    /**
     * Get current state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Subscribe to state changes
     */
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Notify all listeners of state change
     */
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // Authentication Methods

    /**
     * Login user
     */
    login(userData, role) {
        this.setState({
            user: userData,
            isAuthenticated: true,
            role: role
        });
    }

    /**
     * Logout user
     */
    logout() {
        this.setState({
            user: null,
            isAuthenticated: false,
            role: null,
            currentJob: null,
            currentCandidate: null
        });
        localStorage.removeItem('zenith_state');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.state.isAuthenticated;
    }

    /**
     * Get user role
     */
    getUserRole() {
        return this.state.role;
    }

    /**
     * Get current user
     */
    getUser() {
        return this.state.user;
    }

    // User Data Methods

    /**
     * Update user profile
     */
    updateUser(updates) {
        this.setState({
            user: { ...this.state.user, ...updates }
        });
    }

    /**
     * Set current job (for detailed view)
     */
    setCurrentJob(job) {
        this.setState({ currentJob: job });
    }

    /**
     * Get current job
     */
    getCurrentJob() {
        return this.state.currentJob;
    }

    /**
     * Set current candidate (for recruiter view)
     */
    setCurrentCandidate(candidate) {
        this.setState({ currentCandidate: candidate });
    }

    /**
     * Get current candidate
     */
    getCurrentCandidate() {
        return this.state.currentCandidate;
    }

    // Notifications

    /**
     * Add notification
     */
    addNotification(notification) {
        const notifications = [...this.state.notifications, {
            id: Date.now(),
            timestamp: new Date(),
            read: false,
            ...notification
        }];
        this.setState({ notifications });
    }

    /**
     * Mark notification as read
     */
    markNotificationRead(notificationId) {
        const notifications = this.state.notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
        );
        this.setState({ notifications });
    }

    /**
     * Get unread notification count
     */
    getUnreadCount() {
        return this.state.notifications.filter(n => !n.read).length;
    }

    /**
     * Clear all notifications
     */
    clearNotifications() {
        this.setState({ notifications: [] });
    }
}

// Create global state manager instance
window.StateManager = new StateManager();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateManager;
}
