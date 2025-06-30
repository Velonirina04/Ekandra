
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const themeText = document.getElementById('theme-text');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        sunIcon.classList.add('d-none');
        moonIcon.classList.remove('d-none');
        themeText.textContent = 'Mode claire';
    } else {
        body.classList.remove('dark-mode');
        sunIcon.classList.remove('d-none');
        moonIcon.classList.add('d-none');
        themeText.textContent = 'Mode sombre';
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            sunIcon.classList.add('d-none');
            moonIcon.classList.remove('d-none');
            themeText.textContent = 'Mode sombre';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-mode');
            sunIcon.classList.remove('d-none');
            moonIcon.classList.add('d-none');
            themeText.textContent = 'Mode claire';
            localStorage.setItem('theme', 'dark');
        }
    });
});