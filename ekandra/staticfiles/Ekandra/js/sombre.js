// document.addEventListener('DOMContentLoaded', () => {
//     const themeToggle = document.getElementById('theme-toggle');
//     const body = document.body;
//     const sunIcon = document.getElementById('sun-icon');
//     const moonIcon = document.getElementById('moon-icon');
//     const themeText = document.getElementById('theme-text');

//     // Fonction pour appliquer le thème
//     function applyTheme(theme) {
//         if (theme === 'dark') {
//             body.classList.add('dark-mode');
//             body.classList.remove('light-mode');
//             if (sunIcon) sunIcon.classList.add('d-none'); // Cache l'icône soleil
//             if (moonIcon) moonIcon.classList.remove('d-none'); // Affiche l'icône lune
//             if (themeText) themeText.textContent = 'Mode sombre';
//         } else {
//             body.classList.add('light-mode');
//             body.classList.remove('dark-mode');
//             if (sunIcon) sunIcon.classList.remove('d-none'); // Affiche l'icône soleil
//             if (moonIcon) moonIcon.classList.add('d-none'); // Cache l'icône lune
//             if (themeText) themeText.textContent = 'Mode clair';
//         }
//         localStorage.setItem('theme', theme); // Sauvegarde la préférence dans le stockage local
//     }

//     // Récupérer la préférence de l'utilisateur ou utiliser celle du système
//     const savedTheme = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

//     if (savedTheme) {
//         applyTheme(savedTheme); // Applique le thème sauvegardé
//     } else if (prefersDark) {
//         applyTheme('dark'); // Applique le mode sombre si le système le préfère
//     } else {
//         applyTheme('light'); // Par défaut si aucune préférence n'est trouvée
//     }

//     // Gérer le clic sur le bouton de basculement du thème
//     if (themeToggle) {
//         themeToggle.addEventListener('click', () => {
//             const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
//             const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
//             applyTheme(newTheme);
//         });
//     }
// });

// Example (assuming your current JS does something similar)
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const themeText = document.getElementById('theme-text');
    const body = document.body;

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        sunIcon.classList.add('d-none');
        moonIcon.classList.remove('d-none');
        themeText.textContent = 'Mode claire';
    } else {
        // Default to light mode or ensure light mode is active
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