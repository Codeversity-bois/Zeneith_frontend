import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                signup: resolve(__dirname, 'signup.html'),
                login: resolve(__dirname, 'login.html'),
                logout: resolve(__dirname, 'logout.html'),
                'candidate-dashboard': resolve(__dirname, 'candidate-dashboard.html'),
                'candidate-assessments': resolve(__dirname, 'candidate-assessments.html'),
                'candidate-profile': resolve(__dirname, 'candidate-profile.html'),
                'recruiter-dashboard': resolve(__dirname, 'recruiter-dashboard.html'),
                'test-login': resolve(__dirname, 'test-login.html'),
            }
        }
    },
    server: {
        port: 5173,
        open: true
    }
})
