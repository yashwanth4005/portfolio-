/**
 * Theme Manager — Dark / Light Mode
 * - Reads system preference on first visit
 * - Persists choice in localStorage
 * - Applies data-theme attribute to <html>
 */

const Theme = (() => {
    const KEY = 'portfolio-theme';
    const html = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');

    const ICONS = {
        dark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
        light: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    };

    function getPreferred() {
        const saved = localStorage.getItem(KEY);
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function apply(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem(KEY, theme);
        if (toggleBtn) {
            // Show the OPPOSITE icon (what you'd switch TO)
            toggleBtn.innerHTML = theme === 'dark' ? ICONS.dark : ICONS.light;
            toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            toggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        }
    }

    function toggle() {
        const current = html.getAttribute('data-theme') || 'light';
        apply(current === 'dark' ? 'light' : 'dark');
    }

    function init() {
        apply(getPreferred());
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggle);
        }
        // Listen to system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem(KEY)) {
                apply(e.matches ? 'dark' : 'light');
            }
        });
    }

    return { init, toggle, apply };
})();
