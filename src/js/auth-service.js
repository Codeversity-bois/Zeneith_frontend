/**
 * Authentication Service
 * Handles login, signup, and session management
 * Uses mock data for development
 */

import { mockUsers } from './mock-data.js';
import { storage } from './utils.js';
import API_ENDPOINTS, { buildApiUrl } from './api-config.js';

// Mock mode flag - reads from environment variable
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.MODE === 'development';

/**
 * Login with email and password
 */
export async function login(email, password) {
    if (USE_MOCK) {
        // Mock authentication
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check against mock users
                const user = Object.values(mockUsers).find(u => u.email === email);

                if (user && password.length > 0) {
                    // Generate mock token
                    const token = `mock_token_${Date.now()}`;

                    // Store auth data
                    storage.set('auth_token', token);
                    storage.set('current_user', user);

                    // Sync with StateManager
                    if (window.StateManager) {
                        window.StateManager.login(user, user.role);
                    }

                    resolve({
                        success: true,
                        user,
                        token
                    });
                } else {
                    reject({
                        success: false,
                        error: 'Invalid email or password'
                    });
                }
            }, 500); // Simulate network delay
        });
    } else {
        // Real API call
        try {
            const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.login), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                storage.set('auth_token', data.token);
                storage.set('current_user', data.user);
                return data;
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (error) {
            throw error;
        }
    }
}

/**
 * Register new user
 */
export async function register(userData) {
    if (USE_MOCK) {
        // Mock registration
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Validate
                if (!userData.email || !userData.password || !userData.name) {
                    reject({
                        success: false,
                        error: 'All fields are required'
                    });
                    return;
                }

                // Create new user
                const newUser = {
                    id: `user-${Date.now()}`,
                    name: userData.name,
                    email: userData.email,
                    avatar: `https://i.pravatar.cc/150?u=${userData.email}`,
                    role: userData.role || 'candidate',
                    company: userData.company || null,
                };

                // Generate token
                const token = `mock_token_${Date.now()}`;

                // Store auth data
                storage.set('auth_token', token);
                storage.set('current_user', newUser);

                // Sync with StateManager
                if (window.StateManager) {
                    window.StateManager.login(newUser, newUser.role);
                }

                resolve({
                    success: true,
                    user: newUser,
                    token
                });
            }, 500);
        });
    } else {
        // Real API call
        try {
            const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.register), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                storage.set('auth_token', data.token);
                storage.set('current_user', data.user);
                return data;
            } else {
                throw new Error(data.error || 'Registration failed');
            }
        } catch (error) {
            throw error;
        }
    }
}

/**
 * Logout user
 */
export async function logout() {
    if (USE_MOCK) {
        storage.remove('auth_token');
        storage.remove('current_user');
        storage.remove('zenith_state'); // Clear state manager data
        window.location.href = '/login.html';
    } else {
        try {
            const token = storage.get('auth_token');
            await fetch(buildApiUrl(API_ENDPOINTS.auth.logout), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        } finally {
            storage.remove('auth_token');
            storage.remove('current_user');
            storage.remove('zenith_state'); // Clear state manager data
            window.location.href = '/login.html';
        }
    }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
    const token = storage.get('auth_token');
    return !!token;
}

/**
 * Get current user
 */
export function getCurrentUser() {
    return storage.get('current_user');
}

/**
 * Require authentication (redirect if not logged in)
 */
export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

/**
 * Get redirect URL based on user role
 */
export function getDashboardUrl(user) {
    if (!user) return '/';

    // Redirect to appropriate dashboard based on role
    const currentPath = window.location.pathname; // Assuming currentPath is needed and derived here
    if (user.role === 'candidate') {
        if (currentPath !== '/candidate-dashboard.html') {
            return '/candidate-dashboard.html';
        }
    } else if (user.role === 'recruiter') {
        if (currentPath !== '/recruiter-dashboard.html') {
            return '/recruiter-dashboard.html';
        }
    }
    return '/'; // Default return if no specific dashboard is matched or if already on the correct one
}

export default {
    login,
    register,
    logout,
    isAuthenticated,
    getCurrentUser,
    requireAuth,
    getDashboardUrl,
};
