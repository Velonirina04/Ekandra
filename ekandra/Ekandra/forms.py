from django import forms
from django.contrib.auth.models import User
from Ekandra.models import Demandeur, Entreprise, OffreEmploi, Candidature, Notation ,Message # Import mis à jour

class DemandeurInscriptionForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, label='Mot de passe')
    confirm_password = forms.CharField(widget=forms.PasswordInput, label='Confirmer le mot de passe')
    
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')
        labels = {
            'username': 'Nom d’utilisateur',
            'first_name': 'Prénom',
            'last_name': 'Nom',
            'email': 'Email',
        }

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')
        if password and confirm_password and password != confirm_password:
            raise forms.ValidationError("Les mots de passe ne correspondent pas.")
        return cleaned_data
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
            Demandeur.objects.create(user=user)
        return user

class EntrepriseInscriptionForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, label='Mot de passe')
    confirm_password = forms.CharField(widget=forms.PasswordInput, label='Confirmer le mot de passe')
    siret = forms.CharField(max_length=14,label='Siret')
    
    class Meta:
        model = User
        fields = ('username', 'email')
        labels = {
            'username': 'Nom de l’entreprise',
            'email': 'Email',
        }

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')
        if password and confirm_password and password != confirm_password:
            raise forms.ValidationError("Les mots de passe ne correspondent pas.")
        return cleaned_data
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        user.is_staff = True  
        if commit:
            user.save()
            Entreprise.objects.create(user=user)
        return user

class OffreEmploiForm(forms.ModelForm):
    class Meta:
        model = OffreEmploi
        fields = ['titre', 'description', 'salaire','date_fin']
        title = forms.CharField(
        label="Titre de l'offre",
        widget=forms.TextInput(attrs={'class': 'form-control-lg'})
    )
        widgets = {
            'description': forms.Textarea(attrs={'rows': 6}),
        }

class CandidatureForm(forms.ModelForm):
    class Meta:
        model = Candidature
        fields = ['cv','lettre_motivation']
       
class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Demandeur
        fields = ['nom', 'competences', 'cv', 'photo_profil']
        widgets = {
            'competences': forms.Textarea(attrs={'rows': 5}),
            
        }
        label={
            'nom': User.username,
        }

class EntrepriseProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Entreprise
        fields = ['nom', 'description', 'secteur', 'photo_profil']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 5}),
        }

class MessageForm(forms.Form):
    class Meta:
        model: Message
        fields = [ 'contenu']
        widgets = {
            'contenu': forms.Textarea(attrs={
                'rows': 5, # Nombre de lignes visibles par défaut
                'placeholder': 'Écrivez votre message ici...',
                'class': 'form-control chat-message-input' # Ajoutez vos classes CSS ici
                 }),
            }

class NotationForm(forms.ModelForm):
    class Meta:
        model = Notation
        fields = ['note', 'commentaire'] 
        widgets = {
            'commentaire': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Ajoutez votre commentaire ici...'}),
        }
        labels = {
            'note': 'Votre note',
            'commentaire': 'Commentaire (facultatif)',
        }
        help_texts = {
            'note': 'Cliquez sur une étoile pour donner une note.',
            
        }
        #  sudo kill -9 19268 ,sudo lsof -i :8000 | grep LISTEN au cas ou nahavopitsa ctrl+z ou ctrl+x am terminal