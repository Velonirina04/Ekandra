from django.core.management.base import BaseCommand
from Ekandra.models import OffreEmploi  # Assurez-vous d'importer votre modèle OffreEmploi
from django.utils import timezone

class Command(BaseCommand):
    help = 'Supprime les OffreEmplois d\'emploi expirées de la base de données.'

    def handle(self, *args, **options):
        today = timezone.localdate() # Obtient la date actuelle du fuseau horaire de Django

        # Sélectionne les OffreEmplois dont la date de fin est strictement inférieure à aujourd'hui.
        # Cela signifie que si une OffreEmploi se termine le 24 mai, elle sera supprimée
        # lors de l'exécution de la tâche le 25 mai ou après.
        # Si vous voulez qu'elle soit supprimée le jour même de la date de fin,
        # remplacez '__lt' par '__lte' (less than or equal to).
        OffreEmplois_a_supprimer = OffreEmploi.objects.filter(date_fin__lt=today)

        # Exécute la suppression et renvoie le nombre d'objets supprimés
        count, _ = OffreEmplois_a_supprimer.delete()

        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} expired offers.'))
        if count > 0:
            self.stdout.write(self.style.NOTICE(f'Detailed: Deleted offers with end date before {today}.'))