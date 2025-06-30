/**
 * Job Offers Page - Enhanced JavaScript Functionality
 * Améliore l'expérience utilisateur avec des interactions fluides
 */

class JobOffersPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeIntersectionObserver();
        this.setupLoadingStates();
        this.initializeAccessibility();
        this.setupPerformanceOptimizations();
    }

    /**
     * Configuration des écouteurs d'événements
     */
    setupEventListeners() {
        // Gestion des clics sur les cartes d'offres
        this.setupCardInteractions();
        
        // Gestion des boutons de candidature
        this.setupApplicationButtons();
        
        // Gestion du filtrage et de la recherche
        this.setupFiltering();
        
        // Gestion du scroll et de la navigation
        this.setupScrollEffects();
        
        // Gestion des événements clavier
        this.setupKeyboardNavigation();
    }

    /**
     * Interactions avec les cartes d'offres
     */
    setupCardInteractions() {
        const offerCards = document.querySelectorAll('.offer-card');
        
        offerCards.forEach((card, index) => {
            // Animation d'entrée échelonnée est gérée par la classe animate-in
            // card.style.animationDelay = `${index * 100}ms`; 

            // Effet de survol amélioré
            card.addEventListener('mouseenter', (e) => {
                this.enhanceCardHover(e.currentTarget.querySelector('.offer-card-inner'));
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.resetCardHover(e.currentTarget.querySelector('.offer-card-inner'));
            });
            
            // Prévisualisation rapide au clic
            card.addEventListener('click', (e) => {
                // S'assurer que le clic sur les boutons à l'intérieur de la carte ne déclenche pas la prévisualisation
                if (!e.target.closest('.btn') && !e.target.closest('.preview-close') && !e.target.closest('.preview-cancel') && !e.target.closest('.preview-apply')) {
                    this.showQuickPreview(card);
                }
            });

             // Support clavier pour activer la prévisualisation rapide sur focus de la carte
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Empêche le défilement par défaut pour la barre d'espace
                    this.showQuickPreview(card);
                }
            });
        });
    }

    /**
     * Amélioration de l'effet de survol des cartes
     */
    enhanceCardHover(cardInner) { 
        const title = cardInner.querySelector('.card-title');
        
        if (title) {
            title.style.transform = 'scale(1.02)';
            title.style.transition = 'transform 0.2s ease';
        }
    }

    /**
     * Réinitialisation de l'effet de survol
     */
    resetCardHover(cardInner) { 
        const title = cardInner.querySelector('.card-title');
        
        if (title) {
            title.style.transform = 'scale(1)';
        }
    }

    /**
     * Prévisualisation rapide d'une offre
     */
    showQuickPreview(card) {
        // Récupérer les détails complets de la carte
        const title = card.querySelector('.card-title').textContent;
        const company = card.querySelector('.company-name').textContent;
        // Utilise data-full-description si disponible pour une description complète, sinon le texte tronqué
        const description = card.querySelector('.offer-description').getAttribute('data-full-description') || card.querySelector('.offer-description').textContent; 
        const salary = card.querySelector('.salary-amount') ? card.querySelector('.salary-amount').textContent : 'Non précisé';
        const datePosted = card.querySelector('time[itemprop="datePosted"]') ? card.querySelector('time[itemprop="datePosted"]').textContent : 'Non précisé';
        const dateEnd = card.querySelector('[itemprop="validThrough"]') ? card.querySelector('[itemprop="validThrough"]').textContent : 'Non précisé';
        const companyRating = card.querySelector('.rating-text') ? card.querySelector('.rating-text').textContent : 'Non notée';
        const applyLink = card.querySelector('.btn-apply, .btn-login').href; // Récupère le lien de candidature réel

        // Création du modal de prévisualisation
        const modal = this.createPreviewModal({
            title,
            company,
            description,
            salary,
            datePosted,
            dateEnd,
            companyRating,
            applyLink
        });
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden'; // Empêche le défilement du corps quand le modal est ouvert
        requestAnimationFrame(() => {
            modal.classList.add('active');
            modal.querySelector('.preview-close').focus(); // Met le focus sur le bouton de fermeture pour l'accessibilité
        });
    }

    /**
     * Création du modal de prévisualisation
     */
    createPreviewModal({ title, company, description, salary, datePosted, dateEnd, companyRating, applyLink }) {
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.innerHTML = `
            <div class="preview-overlay" role="dialog" aria-modal="true" aria-labelledby="preview-title">
                <div class="preview-content">
                    <header class="preview-header">
                        <h3 id="preview-title" class="preview-title">${title}</h3>
                        <button class="preview-close" aria-label="Fermer la prévisualisation">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </header>
                    <div class="preview-body">
                        <p class="preview-company">
                            <i class="bi bi-building"></i>
                            ${company}
                        </p>
                        <p class="preview-description">${description}</p>
                        <hr class="my-3">
                        <div class="preview-details">
                            <p><i class="bi bi-cash-stack me-2 text-success"></i><strong>Salaire :</strong> ${salary}</p>
                            <p><i class="bi bi-calendar-event me-2 text-warning"></i><strong>Publié :</strong> ${datePosted}</p>
                            <p><i class="bi bi-calendar-x me-2 text-danger"></i><strong>Limite :</strong> ${dateEnd}</p>
                            <p><i class="bi bi-star-fill me-2 text-warning"></i><strong>Note entreprise :</strong> ${companyRating}</p>
                        </div>
                    </div>
                    <footer class="preview-footer">
                        <button class="btn btn-outline-secondary preview-cancel">Fermer</button>
                        <a href="${applyLink}" class="btn btn-primary preview-apply">Voir l'offre complète / Postuler</a>
                    </footer>
                </div>
            </div>
        `;

        // Gestion de la fermeture du modal
        const closeBtn = modal.querySelector('.preview-close');
        const cancelBtn = modal.querySelector('.preview-cancel');
        const overlay = modal.querySelector('.preview-overlay');

        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => this.closePreviewModal(modal));
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closePreviewModal(modal);
            }
        });

        // Gestion des touches clavier
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePreviewModal(modal);
            }
             // Piège le focus à l'intérieur du modal pour l'accessibilité
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });

        return modal;
    }

    /**
     * Fermeture du modal de prévisualisation
     */
    closePreviewModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurer le défilement du corps
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300); // Correspond à la durée de transition CSS
    }

    /**
     * Configuration des boutons de candidature
     */
    setupApplicationButtons() {
        const applyButtons = document.querySelectorAll('.btn-apply, .btn-login');
        
        applyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleApplicationClick(e);
            });
        });
    }

    /**
     * Gestion du clic sur candidature
     */
    handleApplicationClick(e) {
        const button = e.currentTarget;
        const originalText = button.querySelector('.btn-text').textContent;
        const originalIconClass = button.querySelector('.btn-icon').className;
        
        // Animation de chargement
        button.classList.add('loading');
        button.setAttribute('aria-busy', 'true'); // Annoncer l'état de chargement aux lecteurs d'écran
        button.querySelector('.btn-text').textContent = 'Chargement...';
        button.querySelector('.btn-icon').className = 'bi bi-hourglass-split btn-icon';
        
        // Simulation du chargement (sera remplacé par la vraie logique d'appel API)
        setTimeout(() => {
            button.classList.remove('loading');
            button.removeAttribute('aria-busy');
            button.querySelector('.btn-text').textContent = originalText;
            button.querySelector('.btn-icon').className = originalIconClass; // Restaurer l'icône originale
            
            // Dans une application réelle, vous géreriez le succès/échec ici
            // ex : redirection, affichage d'un message de succès, etc.
        }, 1500);
    }

    /**
     * Configuration de l'Intersection Observer pour les animations
     */
    initializeIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observer les cartes d'offres
        document.querySelectorAll('.offer-card').forEach(card => {
            observer.observe(card);
        });
    }

    /**
     * Configuration des états de chargement
     */
    setupLoadingStates() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        // Simuler le chargement au premier chargement de page
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.remove('active');
                // Annoncer que le contenu est chargé pour les lecteurs d'écran
                const liveRegion = document.getElementById('live-announcements');
                if (liveRegion) {
                    liveRegion.textContent = "Contenu de la page chargé.";
                }
            }, 800);
        }
    }

    /**
     * Configuration du filtrage et de la recherche
     */
    setupFiltering() {
        // Création dynamique de filtres si nécessaire
        this.createFilterControls();
        
        // Recherche en temps réel
        this.setupLiveSearch();
        
        // Filtres par catégorie
        this.setupCategoryFilters();

        // Initialiser l'affichage du nombre de résultats
        this.updateResultsCount(document.querySelectorAll('.offer-card').length, '');
    }

    /**
     * Création des contrôles de filtrage
     */
    createFilterControls() {
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'filters-container';
        filtersContainer.innerHTML = `
            <div class="filters-wrapper">
                <div class="search-container">
                    <div class="search-input-wrapper">
                        <i class="bi bi-search search-icon"></i>
                        <input type="text" 
                               class="search-input" 
                               placeholder="Rechercher une offre..." 
                               aria-label="Rechercher parmi les offres d'emploi">
                        <button class="search-clear" aria-label="Effacer la recherche" style="display: none;">
                            <i class="bi bi-x-circle-fill"></i>
                        </button>
                    </div>
                </div>
                <div class="filter-buttons">
                    <button class="filter-btn active" data-filter="all">Toutes</button>
                    <button class="filter-btn" data-filter="recent">Récentes</button>
                    <button class="filter-btn" data-filter="high-salary">Salaire élevé</button>
                    <button class="filter-btn" data-filter="rated">Bien notées</button>
                </div>
            </div>
        `;

        // Insertion avant la grille d'offres
        const offersGrid = document.querySelector('.offers-grid');
        if (offersGrid) {
            offersGrid.parentNode.insertBefore(filtersContainer, offersGrid);
        }
    }

    /**
     * Configuration de la recherche en temps réel
     */
    setupLiveSearch() {
        const searchInput = document.querySelector('.search-input');
        const clearButton = document.querySelector('.search-clear');
        
        if (!searchInput) return;

        // Utiliser la méthode debounce utilitaire
        const debouncedSearch = this.debounce((query) => {
            this.performSearch(query);
            const liveRegion = document.getElementById('live-announcements');
            if (liveRegion) {
                const count = document.querySelectorAll('.offer-card:not([style*="display: none"])').length;
                if (query) {
                    liveRegion.textContent = `${count} résultat${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''} pour "${query}".`;
                } else {
                    liveRegion.textContent = `Recherche effacée. ${count} offre${count > 1 ? 's' : ''} affichée${count > 1 ? 's' : ''}.`;
                }
            }
        }, 300); // 300ms de délai

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Afficher/masquer le bouton de clear
            clearButton.style.display = query ? 'block' : 'none';
            
            debouncedSearch(query);
        });

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.style.display = 'none';
            debouncedSearch(''); // Effectuer la recherche avec une requête vide
            searchInput.focus();
        });
    }

    /**
     * Exécution de la recherche
     */
    performSearch(query) {
        const cards = document.querySelectorAll('.offer-card');
        let visibleCount = 0;
        const noOffersMessage = document.querySelector('.no-offers-found');
        const offersGrid = document.getElementById('offersGrid'); // Obtenir le conteneur de la grille

        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const company = card.querySelector('.company-name').textContent.toLowerCase();
            const description = card.querySelector('.offer-description').textContent.toLowerCase();
            
            const matches = !query || 
                             title.includes(query.toLowerCase()) ||
                             company.includes(query.toLowerCase()) ||
                             description.includes(query.toLowerCase());
            
            if (matches) {
                card.style.display = 'block';
                card.classList.add('fade-in'); // Appliquer l'effet de fade-in
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });

        // Afficher/masquer le message "Aucune offre trouvée"
        if (noOffersMessage) { 
            if (visibleCount === 0 && cards.length > 0) { // Afficher seulement s'il y a des cartes mais aucune ne correspond
                noOffersMessage.style.display = 'block';
                offersGrid.style.display = 'none'; // Cacher la grille si aucune offre ne correspond
            } else if (visibleCount === 0 && cards.length === 0) {
                 // Cela signifie que le rendu initial n'avait aucune offre
                 noOffersMessage.style.display = 'block';
                 offersGrid.style.display = 'none';
            }
            else {
                noOffersMessage.style.display = 'none';
                offersGrid.style.display = 'flex'; // Restaurer l'affichage flex pour la grille
            }
        }

        // Mise à jour du compteur de résultats
        this.updateResultsCount(visibleCount, query);
    }

    /**
     * Mise à jour du compteur de résultats
     */
    updateResultsCount(count, query) {
        let resultsInfo = document.querySelector('.results-info');
        
        if (!resultsInfo) {
            resultsInfo = document.createElement('div');
            resultsInfo.className = 'results-info';
            const filtersContainer = document.querySelector('.filters-container');
            if (filtersContainer) {
                filtersContainer.appendChild(resultsInfo);
            }
        }

        if (query) {
            resultsInfo.textContent = `${count} résultat${count > 1 ? 's' : ''} pour "${query}"`;
            resultsInfo.classList.add('active'); // Afficher les informations sur les résultats
        } else {
            // Afficher le nombre total seulement si aucune requête et aucun filtre spécifique n'est actif
            const activeFilter = document.querySelector('.filter-btn.active');
            if (activeFilter && activeFilter.dataset.filter === 'all') {
                 resultsInfo.textContent = `${count} offre${count > 1 ? 's' : ''} disponible${count > 1 ? 's' : ''}.`;
                 resultsInfo.classList.add('active');
            } else {
                resultsInfo.classList.remove('active'); // Cacher si aucune requête et un filtre spécifique est actif
            }
        }
    }

    /**
     * Configuration des filtres par catégorie
     */
    setupCategoryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Mise à jour de l'état actif
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Application du filtre
                const filter = e.target.dataset.filter;
                this.applyFilter(filter);

                 const liveRegion = document.getElementById('live-announcements');
                if (liveRegion) {
                    const count = document.querySelectorAll('.offer-card:not([style*="display: none"])').length;
                    liveRegion.textContent = `Filtre "${e.target.textContent}" appliqué. ${count} offre${count > 1 ? 's' : ''} affichée${count > 1 ? 's' : ''}.`;
                }
            });
        });
    }

    /**
     * Application des filtres
     */
    applyFilter(filter) {
        const cards = document.querySelectorAll('.offer-card');
        let visibleCount = 0;
        const noOffersMessage = document.querySelector('.no-offers-found');
        const offersGrid = document.getElementById('offersGrid');

        cards.forEach(card => {
            let shouldShow = true;
            
            switch (filter) {
                case 'recent':
                    shouldShow = this.isRecentOffer(card);
                    break;
                case 'high-salary':
                    shouldShow = this.isHighSalary(card);
                    break;
                case 'rated':
                    shouldShow = this.isWellRated(card);
                    break;
                case 'all':
                default:
                    shouldShow = true;
                    break;
            }
            
            if (shouldShow) {
                card.style.display = 'block';
                card.classList.add('fade-in');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });

        // Afficher/masquer le message "Aucune offre trouvée" pour les filtres
        if (noOffersMessage) {
            if (visibleCount === 0) {
                noOffersMessage.style.display = 'block';
                offersGrid.style.display = 'none';
            } else {
                noOffersMessage.style.display = 'none';
                offersGrid.style.display = 'flex';
            }
        }
        
        // Mettre à jour le nombre de résultats en fonction du filtre appliqué
        this.updateResultsCount(visibleCount, ''); // Requête vide pour les mises à jour de filtre
    }

    /**
     * Vérification si l'offre est récente
     */
    isRecentOffer(card) {
        const dateElement = card.querySelector('time[itemprop="datePosted"]');
        if (!dateElement) return false;
        
        const publishDate = new Date(dateElement.getAttribute('datetime'));
        const now = new Date();
        const daysDiff = (now - publishDate) / (1000 * 60 * 60 * 24);
        
        return daysDiff <= 7; // Offres de moins de 7 jours
    }

    /**
     * Vérification si le salaire est élevé
     */
    isHighSalary(card) {
        const salaryElement = card.querySelector('.salary-amount');
        if (!salaryElement) return false;
        
        const salaryText = salaryElement.textContent.replace(/[^\d]/g, '');
        const salary = parseInt(salaryText);
        
        return salary >= 1000000; // Salaire >= 1M Ar
    }

    /**
     * Vérification si l'entreprise est bien notée
     */
    isWellRated(card) {
        const ratingElement = card.querySelector('.rating-text');
        if (!ratingElement) return false;
        
        const ratingMatch = ratingElement.textContent.match(/(\d+\.?\d*)/);
        if (!ratingMatch) return false;
        
        const rating = parseFloat(ratingMatch[1]);
        return rating >= 4.0; // Note >= 4.0
    }

    /**
     * Configuration des effets de scroll
     */
    setupScrollEffects() {
        let lastScrollTop = 0;
        const header = document.querySelector('.hero-section');
        const filtersContainer = document.querySelector('.filters-container');
        
        // Utiliser le gestionnaire de défilement throttled
        const throttledScroll = this.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Effet parallaxe sur la section héro
            if (header) {
                const scrolled = scrollTop * 0.3; // Parallaxe moins intense
                header.style.transform = `translateY(${Math.min(scrolled, header.offsetHeight / 2)}px)`; // Limite le mouvement parallaxe
            }

            // Effet de filtre collant (ajuster si déjà en position: sticky)
            // Si vous utilisez `position: sticky;` en CSS, ce JS pourrait être redondant
            if (filtersContainer) {
                if (scrollTop > (header ? header.offsetHeight : 200)) { // Ajuster le seuil
                    filtersContainer.classList.add('sticky-active'); // Ajouter une classe pour les styles collants
                } else {
                    filtersContainer.classList.remove('sticky-active');
                }
            }
            
            // Visibilité du bouton retour en haut
            this.toggleBackToTop(scrollTop > 300);
            
            lastScrollTop = scrollTop;
        }, 100); // Throttler les événements de défilement pour qu'ils s'exécutent toutes les 100ms

        window.addEventListener('scroll', throttledScroll);
        
        // Création du bouton retour en haut
        this.createBackToTopButton();
    }

    /**
     * Création du bouton retour en haut
     */
    createBackToTopButton() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
        backToTop.setAttribute('aria-label', 'Retour en haut de page');
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Annoncer pour les lecteurs d'écran
            const liveRegion = document.getElementById('live-announcements');
            if (liveRegion) {
                liveRegion.textContent = "Retour en haut de page.";
            }
        });
        
        document.body.appendChild(backToTop);
    }

    /**
     * Affichage/masquage du bouton retour en haut
     */
    toggleBackToTop(show) {
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            if (show) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        }
    }

    /**
     * Configuration de la navigation clavier
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Navigation avec les flèches uniquement lorsqu'une carte est en focus
            if (document.activeElement && document.activeElement.classList.contains('offer-card')) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    this.handleArrowNavigation(e);
                }
            }
            
            // Raccourcis clavier
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'f': // Ctrl/Cmd + F pour la recherche
                    case 'k': // Ctrl/Cmd + K pour la recherche (courant dans de nombreuses applications)
                        e.preventDefault();
                        this.focusSearchInput();
                        break;
                    case 'Escape': // Touche Échap pour fermer le modal (également géré dans l'écouteur du modal)
                        const activeModal = document.querySelector('.preview-modal.active');
                        if (activeModal) {
                            this.closePreviewModal(activeModal);
                        }
                        break;
                }
            }
        });
    }

    /**
     * Focus sur le champ de recherche
     */
    focusSearchInput() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
            const liveRegion = document.getElementById('live-announcements');
            if (liveRegion) {
                liveRegion.textContent = "Champ de recherche activé.";
            }
        }
    }

    /**
     * Navigation avec les flèches (améliorée pour la disposition en grille)
     */
    handleArrowNavigation(e) {
        const focusableCards = Array.from(document.querySelectorAll('.offer-card:not([style*="display: none"])'));
        if (focusableCards.length === 0) return;

        const currentFocusedCard = document.activeElement;
        let currentIndex = focusableCards.indexOf(currentFocusedCard);

        if (currentIndex === -1) {
            // Si aucune carte n'est actuellement en focus, mettre le focus sur la première
            focusableCards[0].focus();
            e.preventDefault();
            return;
        }

        let nextIndex = currentIndex;
        const cardsPerRow = this.getCardsPerRow(); // Fonction d'aide pour déterminer la disposition de la grille

        if (e.key === 'ArrowDown') {
            nextIndex = currentIndex + cardsPerRow;
        } else if (e.key === 'ArrowUp') {
            nextIndex = currentIndex - cardsPerRow;
        } else if (e.key === 'ArrowRight') {
            nextIndex = currentIndex + 1;
        } else if (e.key === 'ArrowLeft') {
            nextIndex = currentIndex - 1;
        }

        // Logique de bouclage pour les flèches horizontales dans une ligne (facultatif, peut être supprimé)
        if (e.key === 'ArrowRight' && (nextIndex % cardsPerRow === 0) && nextIndex !== currentIndex + 1) {
            nextIndex = currentIndex - (cardsPerRow - 1); // Retour au début de la ligne suivante
        }
        if (e.key === 'ArrowLeft' && ((currentIndex % cardsPerRow === 0) || nextIndex < 0) && nextIndex !== currentIndex - 1) {
            nextIndex = currentIndex + (cardsPerRow - 1); // Retour à la fin de la ligne précédente
        }

        // S'assurer que nextIndex est dans les limites et faire un bouclage vertical
        if (nextIndex >= focusableCards.length) {
            nextIndex = nextIndex % focusableCards.length; // Retour au début
        } else if (nextIndex < 0) {
            nextIndex = focusableCards.length + nextIndex; // Retour à la fin
        }
        
        if (focusableCards[nextIndex]) {
            e.preventDefault();
            focusableCards[nextIndex].focus();
        }
    }

     getCardsPerRow() {
        const grid = document.getElementById('offersGrid');
        if (!grid || !grid.firstElementChild) return 1; // Par défaut à 1 si la grille non trouvée

        const cardStyle = window.getComputedStyle(grid.firstElementChild);
        const cardWidth = grid.firstElementChild.offsetWidth + parseFloat(cardStyle.marginLeft || 0) + parseFloat(cardStyle.marginRight || 0);
        if (cardWidth === 0) return 1; // Éviter la division par zéro

        const gridWidth = grid.offsetWidth;
        return Math.floor(gridWidth / cardWidth) || 1; // Au moins 1 carte par ligne
    }

    /**
     * Configuration de l'accessibilité
     */
    initializeAccessibility() {
        // `tabindex` et `role` sont déjà ajoutés dans le template Django pour '.offer-card'.
        // Cela signifie que la carte elle-même est focusable, ce qui est bien.
        
        // Amélioration des messages d'état
        this.setupAriaLiveRegions();
        
        // Support des lecteurs d'écran (déjà géré avec les mises à jour de la région live dans la recherche/filtre)
        this.enhanceScreenReaderSupport();
    }

    /**
     * Configuration des régions ARIA live
     */
    setupAriaLiveRegions() {
        // S'assurer qu'une seule région live existe
        let liveRegion = document.getElementById('live-announcements');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.id = 'live-announcements';
            document.body.appendChild(liveRegion);
        }
    }

    /**
     * Amélioration du support des lecteurs d'écran (déjà intégré dans la logique de filtre/recherche)
     */
    enhanceScreenReaderSupport() {
        // Cette méthode contient actuellement une logique qui a été déplacée dans `setupLiveSearch` et `setupCategoryFilters`
        // pour rendre les annonces directement au moment de l'action.
        // Nous pouvons ajouter plus d'améliorations générales pour les lecteurs d'écran ici si nécessaire, ex. : annonces pour l'ouverture/fermeture du modal.
    }

    /**
     * Optimisations de performance
     */
    setupPerformanceOptimizations() {
        // Lazy loading des images si présentes
        this.setupLazyLoading();
        
        // Throttling des événements scroll (déjà intégré dans setupScrollEffects)
        // this.throttleScrollEvents(); // Cette ligne n'est pas nécessaire ici car elle est appelée à l'intérieur de setupScrollEffects
        
        // Préchargement des pages de candidature
        this.preloadApplicationPages();
    }

    /**
     * Configuration du lazy loading
     */
    setupLazyLoading() {
        // En supposant que les images ont la classe "lazy" et l'attribut data-src
        const images = document.querySelectorAll('img.lazy[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src'); // Supprimer data-src une fois chargé
                        img.classList.remove('lazy');
                        observer.unobserve(img); // Arrêter d'observer une fois chargé
                    }
                });
            }, { rootMargin: '0px 0px 200px 0px' }); // Charger les images 200px avant qu'elles n'entrent dans la fenêtre d'affichage
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy');
            });
        }
    }

    /**
     * Throttling des événements scroll (la méthode est appelée dans setupScrollEffects)
     */
    throttleScrollEvents() {
        // Le gestionnaire de défilement principal dans setupScrollEffects est déjà throttlé.
        // Cette méthode elle-même est un utilitaire, non destinée à être appelée directement depuis init.
    }

    /**
     * Préchargement des pages de candidature
     */
    preloadApplicationPages() {
        const applyLinks = document.querySelectorAll('.btn-apply, .btn-login'); // Cible tous les liens de candidature potentiels
        
        applyLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                // Vérifier si le lien est réellement une page interne à précharger
                if (link.href && link.href.startsWith(window.location.origin)) {
                    const linkTag = document.createElement('link');
                    linkTag.rel = 'prefetch';
                    linkTag.href = link.href;
                    document.head.appendChild(linkTag);
                }
            }, { once: true }); // Précharger une seule fois par lien
        });
    }

    /**
     * Méthodes utilitaires
     */
    
    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!inThrottle) {
                func.apply(context, args);
                lastRan = Date.now();
                inThrottle = true;
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
}

// Initialiser la fonctionnalité de la page lorsque le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new JobOffersPage();
});