/**
 * Script JavaScript pour la page d'accueil E-kandra
 * Améliore l'expérience utilisateur avec des interactions modernes
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // Animation au scroll (Intersection Observer)
    // ==========================================================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.feature-card, .category-card, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ==========================================================================
    // Amélioration du formulaire de recherche
    // ==========================================================================
    const searchForm = document.querySelector('.search-form');
    const jobInput = document.getElementById('job-search');
    const locationInput = document.getElementById('location-search');

    if (searchForm) {
        // Validation en temps réel
        function validateInput(input) {
            const value = input.value.trim();
            if (value.length > 0 && value.length < 2) {
                input.style.borderColor = 'var(--color-warning)';
                return false;
            } else {
                input.style.borderColor = '';
                return true;
            }
        }

        jobInput?.addEventListener('input', () => validateInput(jobInput));
        locationInput?.addEventListener('input', () => validateInput(locationInput));

        // Gestion de la soumission du formulaire
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const jobValue = jobInput.value.trim();
            const locationValue = locationInput.value.trim();
            
            if (!jobValue && !locationValue) {
                showNotification('Veuillez saisir au moins un critère de recherche', 'warning');
                return;
            }
            
            // Animation de chargement
            const submitBtn = searchForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recherche...';
            submitBtn.disabled = true;
            
            // Simulation d'une recherche (remplacer par votre logique)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showNotification('Recherche effectuée avec succès !', 'success');
                // Redirection vers la page de résultats
                // window.location.href = '/recherche/?q=' + encodeURIComponent(jobValue) + '&loc=' + encodeURIComponent(locationValue);
            }, 1500);
        });
    }

    // ==========================================================================
    // Autocomplétion pour les champs de recherche
    // ==========================================================================
    const jobSuggestions = [
        'Développeur Web',
        'Développeur Full Stack',
        'Chef de Projet',
        'Commercial',
        'Marketing Digital',
        'Designer UX/UI',
        'Data Analyst',
        'Consultant',
        'Ingénieur',
        'Comptable'
    ];

    const locationSuggestions = [
        'Paris',
        'Lyon',
        'Marseille',
        'Toulouse',
        'Nice',
        'Nantes',
        'Bordeaux',
        'Lille',
        'Télétravail',
        'Remote'
    ];

    function createAutocomplete(input, suggestions) {
        if (!input) return;
        
        const wrapper = input.closest('.input-group');
        let suggestionsList = null;

        input.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            
            if (suggestionsList) {
                suggestionsList.remove();
            }

            if (value.length < 2) return;

            const filteredSuggestions = suggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(value)
            );

            if (filteredSuggestions.length === 0) return;

            suggestionsList = document.createElement('ul');
            suggestionsList.className = 'autocomplete-suggestions';
            suggestionsList.innerHTML = filteredSuggestions
                .slice(0, 5)
                .map(suggestion => `<li class="autocomplete-item">${suggestion}</li>`)
                .join('');

            wrapper.appendChild(suggestionsList);

            // Gestion des clics sur les suggestions
            suggestionsList.addEventListener('click', function(e) {
                if (e.target.classList.contains('autocomplete-item')) {
                    input.value = e.target.textContent;
                    suggestionsList.remove();
                    suggestionsList = null;
                }
            });
        });

        // Fermer les suggestions en cliquant ailleurs
        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target) && suggestionsList) {
                suggestionsList.remove();
                suggestionsList = null;
            }
        });
    }

    createAutocomplete(jobInput, jobSuggestions);
    createAutocomplete(locationInput, locationSuggestions);

    // ==========================================================================
    // Gestion des liens de recherches populaires
    // ==========================================================================
    const trendingLinks = document.querySelectorAll('.trending-searches__link');
    trendingLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const searchTerm = this.textContent;
            if (jobInput) {
                jobInput.value = searchTerm;
                jobInput.focus();
                // Déclencher l'animation de focus
                jobInput.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    jobInput.style.transform = '';
                }, 200);
            }
        });
    });

    // ==========================================================================
    // Compteur animé pour les statistiques
    // ==========================================================================
    function animateCounter(element, target) {
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString() + '+';
        }, 20);
    }

    const categoryCards = document.querySelectorAll('.category-card');
    const categoryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const countElement = entry.target.querySelector('.category-card__count');
                if (countElement && !countElement.dataset.animated) {
                    const text = countElement.textContent;
                    const number = parseInt(text.replace(/[^\d]/g, ''));
                    if (number) {
                        countElement.dataset.animated = 'true';
                        animateCounter(countElement, number);
                    }
                }
            }
        });
    }, { threshold: 0.5 });

    categoryCards.forEach(card => categoryObserver.observe(card));

    // ==========================================================================
    // Système de notifications
    // ==========================================================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas fa-${getIconForType(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification__close" aria-label="Fermer">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => notification.classList.add('notification--show'), 100);

        // Fermeture automatique
        const autoClose = setTimeout(() => {
            closeNotification(notification);
        }, 5000);

        // Fermeture manuelle
        notification.querySelector('.notification__close').addEventListener('click', () => {
            clearTimeout(autoClose);
            closeNotification(notification);
        });
    }

    function closeNotification(notification) {
        notification.classList.remove('notification--show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    function getIconForType(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    // ==========================================================================
    // Gestion du mode sombre (optionnel)
    // ==========================================================================
    function initDarkMode() {
        const darkModeToggle = document.querySelector('[data-dark-mode-toggle]');
        if (!darkModeToggle) return;

        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        }

        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');
            const isNowDark = document.documentElement.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isNowDark);
        });
    }

    initDarkMode();

    // ==========================================================================
    // Amélioration de l'accessibilité au clavier
    // ==========================================================================
    function initKeyboardNavigation() {
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && this.tagName === 'A') {
                    this.click();
                }
            });
        });

        // Navigation par flèches dans les grilles
        const grids = document.querySelectorAll('.categories__grid, .features__grid');
        grids.forEach(grid => {
            const items = grid.querySelectorAll('a, button');
            items.forEach((item, index) => {
                item.addEventListener('keydown', function(e) {
                    let targetIndex = index;
                    
                    switch(e.key) {
                        case 'ArrowRight':
                            targetIndex = Math.min(index + 1, items.length - 1);
                            break;
                        case 'ArrowLeft':
                            targetIndex = Math.max(index - 1, 0);
                            break;
                        case 'ArrowDown':
                            const itemsPerRow = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 2;
                            targetIndex = Math.min(index + itemsPerRow, items.length - 1);
                            break;
                        case 'ArrowUp':
                            const itemsPerRowUp = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 2;
                            targetIndex = Math.max(index - itemsPerRowUp, 0);
                            break;
                        default:
                            return;
                    }
                    
                    e.preventDefault();
                    items[targetIndex].focus();
                });
            });
        });
    }

    initKeyboardNavigation();

    // ==========================================================================
    // Analytics et tracking (à adapter selon vos besoins)
    // ==========================================================================
    function trackUserInteraction(action, category, label) {
        // Exemple avec Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        // Ou avec votre système d'analytics personnalisé
        console.log('Track:', { action, category, label });
    }

    // Tracking des interactions utilisateur
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoryName = card.querySelector('.category-card__title').textContent;
            trackUserInteraction('click', 'category', categoryName);
        });
    });

    trendingLinks.forEach(link => {
        link.addEventListener('click', () => {
            trackUserInteraction('click', 'trending_search', link.textContent);
        });
    });
});

// ==========================================================================
// CSS pour les notifications (à ajouter au CSS principal)
// ==========================================================================
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 16px;
    min-width: 300px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
}

.notification--show {
    transform: translateX(0);
}

.notification--success {
    border-left: 4px solid var(--color-success);
}

.notification--warning {
    border-left: 4px solid var(--color-warning);
}

.notification--error {
    border-left: 4px solid var(--color-error);
}

.notification__content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.notification__close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #666;
}

.autocomplete-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    z-index: 100;
    list-style: none;
    margin: 0;
    padding: 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.autocomplete-item {
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
}

.autocomplete-item:hover {
    background-color: #f8f9fa;
}

.autocomplete-item:last-child {
    border-bottom: none;
}
`;

// Injecter les styles des notifications
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);