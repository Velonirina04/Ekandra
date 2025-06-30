# Ekandra/templatetags/star_filters.py

from django import template
from django.utils.safestring import mark_safe # Pour marquer le HTML comme sûr

register = template.Library()

@register.filter
def render_stars(rating_value):
    """
    Renders star icons (full, half, empty) based on a decimal rating value.
    Example: 2.7 -> 2 full stars, 1 half star, 2 empty stars.
    """
    if rating_value is None:
        return mark_safe('<span class="text-muted">Non notée</span>')

    try:
        rating_val = float(rating_value) # Assurez-vous que c'est un float
    except (ValueError, TypeError):
        return mark_safe('<span class="text-danger">Erreur de note</span>')

    stars_html = ""
    for i in range(1, 6): # Pour les 5 étoiles
        if rating_val >= i:
            stars_html += '<i class="bi bi-star-fill text-warning"></i>' # Étoile pleine
        elif rating_val > (i - 1) and rating_val < i:
            stars_html += '<i class="bi bi-star-half text-warning"></i>' # Demi-étoile
        else:
            stars_html += '<i class="bi bi-star text-secondary"></i>' # Étoile vide
    
    # Ajoutez la note numérique à côté des étoiles
    stars_html += f' ({rating_val:.1f}/5)'

    return mark_safe(stars_html) # Marquez le HTML comme sûr pour l'affichage dans le template