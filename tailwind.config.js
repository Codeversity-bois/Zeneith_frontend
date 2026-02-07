/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563eb',
                    dark: '#1d4ed8',
                    light: '#3b82f6',
                },
                secondary: {
                    DEFAULT: '#7c3aed',
                    dark: '#6d28d9',
                    light: '#8b5cf6',
                },
                success: '#16a34a',
                warning: '#f59e0b',
                error: '#dc2626',
                background: {
                    light: '#f9fafb',
                    dark: '#111827',
                },
                text: {
                    DEFAULT: '#111827',
                    secondary: '#6b7280',
                },
                border: {
                    DEFAULT: '#e5e7eb',
                    dark: '#374151',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            borderRadius: {
                'sm': '4px',
                DEFAULT: '8px',
                'lg': '12px',
                'xl': '16px',
            },
            boxShadow: {
                'soft': '0 4px 6px rgba(0, 0, 0, 0.1)',
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            },
            animation: {
                'fade-in': 'fadeIn 300ms ease-in-out',
                'slide-in': 'slideIn 300ms ease-in-out',
                'scale-up': 'scaleUp 200ms ease-in-out',
                'shimmer': 'shimmer 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleUp: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
