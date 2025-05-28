
document.addEventListener('DOMContentLoaded', function() {
    console.log("recherche.js fonction bien en DOMContentLoaded.");

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const contactItems = document.querySelectorAll('.contact-item');

    
    if (searchInput) {
        console.log(" element trouver:", searchInput);
    } else {
        console.error("Erreur: searchInput l'element (ID 'searchInput') est introuvable!.");
    }
    if (searchButton) {
        console.log("searchButton element trouver:", searchButton);
    } else {
        console.warn("Erreur: searchButton l'element (ID 'searchButton') est introuvable.");
    }
    if (contactItems.length > 0) {
        console.log(`Trouver ${contactItems.length} contact item(s) avec la class 'contact-item'.`);
        contactItems.forEach((item, index) => {
            if (!item.dataset.username) {
                console.warn(`Erreur: Le contact item #${index} ne correspond à aucun 'data-username' ! infilterable.`);
            }
        });
    } else {
        console.warn("Aucun contact items avec la class 'contact-item' trouver.");
    }



    const filterContacts = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        console.log("Filtre des contacts avec search term:", searchTerm);

        let visibleCount = 0;
        contactItems.forEach(item => {
            const username = item.dataset.username; 

            
            if (username && username.includes(searchTerm)) {
                item.style.display = 'flex'; 
                visibleCount++;
            } else {
                item.style.display = 'none'; 
            }
        });
        console.log(`Filtre appliquer. ${visibleCount} contact(s) filtrer.`);
    };

    // --- Add Event Listeners ---
    if (searchInput) {
        
        searchInput.addEventListener('keyup', filterContacts);
        console.log("Event listener pour 'keyup' ajouter à searchInput.");
    }
    if (searchButton) {
        
        searchButton.addEventListener('click', filterContacts);
        console.log("Event listener pour 'click' ajouter à searchButton.");
    }

    if (searchInput && searchInput.value) {
        console.log("searchInput a une valeur initial.");
        filterContacts();
    }
});