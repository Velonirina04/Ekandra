from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator, MinValueValidator, MaxValueValidator

class Demandeur(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nom = models.CharField(max_length=100, blank=True, default="Utilisateur")
    competences = models.TextField(blank=True)
    cv = models.FileField(upload_to='cvs/', validators=[FileExtensionValidator(['pdf'])], blank=True, null=True)
    photo_profil = models.ImageField(upload_to='profils/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom} (Demandeur)"

class Entreprise(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nom = models.CharField(max_length=100, blank=True, default="Entreprise")
    description = models.TextField(blank=True)
    secteur = models.CharField(max_length=100, blank=True)
    siret = models.CharField(max_length=14,unique=False)
    photo_profil = models.ImageField(upload_to='profils/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom} (Entreprise)"

class OffreEmploi(models.Model):
    entreprise = models.ForeignKey(Entreprise, on_delete=models.CASCADE)
    titre = models.CharField(max_length=200)
    description = models.TextField()
    salaire = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    date_publication = models.DateTimeField(auto_now_add=True)
    date_fin = models.DateTimeField(default=' j/m/n ')
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.titre

class Candidature(models.Model):
    demandeur = models.ForeignKey(Demandeur, on_delete=models.CASCADE)
    cv = models.FileField(upload_to='cvs/', validators=[FileExtensionValidator(['pdf'])], blank=True, null=True)
    offre = models.ForeignKey(OffreEmploi, on_delete=models.CASCADE)
    lettre_motivation = models.FileField(upload_to='cvs/', validators=[FileExtensionValidator(['pdf'])], blank=True, null=True)
    date_candidature = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=50, choices=[
        ('en_attente', 'En attente'),
        ('acceptee', 'Acceptée'),
        ('refusee', 'Refusée')
    ], default='en_attente')

    def __str__(self):
        return f"{self.demandeur.nom} - {self.offre.titre}"

class Message(models.Model):
    expediteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_envoyes')
    destinataire = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_recus')
    contenu = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)
    lu = models.BooleanField(default=False)

    def __str__(self):
        return f"De {self.expediteur.username} à {self.destinataire.username}"

class Notation(models.Model):
    demandeur = models.ForeignKey(Demandeur, on_delete=models.CASCADE)
    entreprise = models.ForeignKey(Entreprise, on_delete=models.CASCADE)
    note = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    commentaire = models.TextField(blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('demandeur', 'entreprise')

    def __str__(self):
        return f"{self.demandeur.nom} - {self.entreprise.nom} ({self.note}/5)"