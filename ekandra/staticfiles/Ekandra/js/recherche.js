document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const contactList = document.getElementById('contactList'); // Le conteneur des éléments de contact
    const noUsersFoundDiv = document.querySelector('.contacts-list-card .p-5.text-center.text-muted'); // La div "Aucun utilisateur trouvé"
    const cardBody = document.querySelector('.contacts-list-card .card-body');

    if (!searchInput || !contactList) {
        console.warn("Éléments de recherche ou de liste de contacts non trouvés. La fonctionnalité de recherche ne sera pas activée.");
        return;
    }

    const allContactItems = contactList.querySelectorAll('.list-group-item');

    // Assurez-vous que la div "Aucun utilisateur trouvé" est initialement masquée
    if (noUsersFoundDiv) {
        noUsersFoundDiv.style.display = 'none';
    } else {
        // Créer la div "Aucun utilisateur trouvé" si elle n'existe pas dans le HTML initial (utile si potential_contacts est toujours présent)
        const emptyStateHtml = `
            <div class="p-5 text-center text-muted empty-state" style="display: none;">
                <i class="bi bi-person-fill-slash display-1 text-primary mb-4"></i>
                <h3 class="text-dark mb-3">Aucun utilisateur trouvé.</h3>
                <p class="lead text-secondary">Veuillez essayer un autre nom ou ajuster votre recherche.</p>
            </div>
        `;
        cardBody.insertAdjacentHTML('beforeend', emptyStateHtml);
        noUsersFoundDiv = document.querySelector('.contacts-list-card .empty-state');
    }

    const performSearch = (query) => {
        const lowerCaseQuery = query.toLowerCase().trim();
        let found = false;

        allContactItems.forEach(item => {
            const username = item.dataset.username; // Récupérer le nom d'utilisateur de l'attribut data-username
            if (username.includes(lowerCaseQuery)) {
                item.style.display = 'flex'; // Afficher l'élément
                found = true;
            } else {
                item.style.display = 'none'; // Masquer l'élément
            }
        });

        // Afficher ou masquer le message "Aucun utilisateur trouvé"
        if (noUsersFoundDiv) {
            if (found) {
                noUsersFoundDiv.style.display = 'none';
                contactList.style.display = 'block'; // Assurez-vous que la liste est visible si des éléments sont trouvés
            } else {
                noUsersFoundDiv.style.display = 'block';
                contactList.style.display = 'none'; // Masquer la liste si aucun élément n'est trouvé
            }
        }
    };

    // Déclencher la recherche à chaque saisie
    searchInput.addEventListener('input', (event) => {
        performSearch(event.target.value);
    });

    // Déclencher la recherche au clic sur le bouton (facultatif si la recherche est déjà en temps réel)
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
    }

    // Amélioration de l'accessibilité : Annoncer les résultats de la recherche
    const liveAnnouncementRegion = document.createElement('div');
    liveAnnouncementRegion.setAttribute('aria-live', 'polite');
    liveAnnouncementRegion.setAttribute('aria-atomic', 'true');
    liveAnnouncementRegion.classList.add('sr-only'); // Style pour lecteurs d'écran uniquement
    document.body.appendChild(liveAnnouncementRegion);

    const announceResults = (count, query) => {
        let message = '';
        if (query) {
            message = `${count} résultat${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''} pour "${query}".`;
        } else {
            message = `Affichage de ${count} utilisateur${count > 1 ? 's' : ''}.`;
        }
        liveAnnouncementRegion.textContent = message;
    };

    // Modifier la fonction performSearch pour appeler announceResults
    const originalPerformSearch = performSearch;
    performSearch = (query) => {
        originalPerformSearch(query);
        const visibleItemsCount = contactList.querySelectorAll('.list-group-item[style*="display: flex"]').length;
        announceResults(visibleItemsCount, query);
    };

    // Exécuter une recherche initiale si le champ de recherche n'est pas vide au chargement
    if (searchInput.value) {
        performSearch(searchInput.value);
    } else {
        // Initialiser l'annonce du nombre total d'utilisateurs si la recherche est vide
        announceResults(allContactItems.length, '');
    }
});