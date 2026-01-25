document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();

    function setupThemeToggle() {
        const toggleButton = document.getElementById('theme-toggle');
        if (!toggleButton) return;

        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'light') {
            document.body.classList.add('light-mode');
        }

        toggleButton.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');

            let theme = 'dark';
            if (document.body.classList.contains('light-mode')) {
                theme = 'light';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // Back to Top Button
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});