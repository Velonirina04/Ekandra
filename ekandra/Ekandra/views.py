from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models import Q, Avg, Count, Max
from Ekandra.forms import DemandeurInscriptionForm, EntrepriseInscriptionForm, OffreEmploiForm, CandidatureForm, ProfileUpdateForm, EntrepriseProfileUpdateForm, MessageForm, NotationForm  # Imports mis à jour
from Ekandra.models import Demandeur, Entreprise, OffreEmploi, Candidature, Message, Notation  # Imports mis à jour
from django.http import HttpResponse
# def get_base_context(request):
#     context = {}
#     if request.user.is_authenticated:
#         context['unread_messages'] = Message.objects.filter(destinataire=request.user, lu=False).count()
#     return context
def get_base_context(request):
    context = {}
    if request.user.is_authenticated:
        try:
            from .models import Message
            context['unread_messages'] = Message.objects.filter(destinataire=request.user, lu=False).count()
        except ImportError:
            context['unread_messages'] = 0 
            pass
    return context

def home(request):
    offres = OffreEmploi.objects.filter(active=True)[:6]
    context = get_base_context(request)
    context.update({'offres': offres})
    return render(request, 'Ekandra/home.html', context)
def a_propos(request):
    """
    Vue pour afficher la page "À Propos de Nous".
    """
    return render(request, 'Ekandra/a_propos.html') 
def contact(request):
    """
    Vue pour afficher la page "Contactez-nous".
    Si vous implémentez un formulaire de contact, la logique irait ici.
    """
    # Example for a basic form, you'd replace this with a real Django form
    # if request.method == 'POST':
    #     form = ContactForm(request.POST)
    #     if form.is_valid():
    #         name = form.cleaned_data['name']
    #         email = form.cleaned_data['email']
    #         message = form.cleaned_data['message']
    #         send_mail(
    #             f'Message de contact de {name}',
    #             f'Email: {email}\n\nMessage:\n{message}',
    #             settings.EMAIL_HOST_USER, # From email
    #             ['your_email@example.com'], # To email
    #             fail_silently=False,
    #         )
    #         # Add a success message or redirect
    #         return redirect('contact_success') # You'd need this URL
    # else:
    #     form = ContactForm()
    
    # context = {'form': form} # Pass the form to the template if used
    context = {} # No form passed for now

    return render(request, 'Ekandra/contact.html', context)
def faq (request):
    """
    Vue pour afficher la page "Foire Aux Questions (FAQ)".
    """
    return render(request, 'Ekandra/faq.html')
def credit(request):
    """
    Vue pour afficher la page "Crédits & Développeur".
    """
    return render(request, 'Ekandra/credit.html')
def register(request):
    if request.method == 'POST':
        user_type = request.POST.get('user_type')
        if user_type == 'demandeur':
            form = DemandeurInscriptionForm(request.POST)
        else:
            form = EntrepriseInscriptionForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            
            messages.success(request, 'Inscription réussie ! Veuillez compléter votre profil.')
            return redirect('profile')
        else:
            messages.error(request, 'Erreur dans le formulaire.')
    else:
        user_type = request.GET.get('user_type', 'demandeur')
        if user_type == 'demandeur':
            form = DemandeurInscriptionForm()
        else:
            form = EntrepriseInscriptionForm()
    context = get_base_context(request)
    context.update({'form': form, 'user_type': user_type})
    return render(request, 'Ekandra/register.html', context)

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, 'Connexion réussie !')
            return redirect('home')
        else:
            messages.error(request, 'Nom d’utilisateur ou mot de passe incorrect.')
    else:
        form = AuthenticationForm()
    context = get_base_context(request)
    context.update({'form': form})
    return render(request, 'Ekandra/login.html', context)

def logout_view(request):
    logout(request)
    messages.success(request, 'Déconnexion réussie.')
    return redirect('home')

@login_required
def profile(request):
    try:
        demandeur = Demandeur.objects.get(user=request.user)
        candidatures = Candidature.objects.filter(demandeur=demandeur)
        profile_incomplete = not (demandeur.nom and demandeur.nom != "Utilisateur" and demandeur.competences)
        if request.method == 'POST':
            form = ProfileUpdateForm(request.POST, request.FILES, instance=demandeur)
            if form.is_valid():
                form.save()
                messages.success(request, 'Profil mis à jour.')
                return redirect('profile')
        else:
            form = ProfileUpdateForm(instance=demandeur)
        context = get_base_context(request)
        context.update({
            'demandeur': demandeur, 
            'candidatures': candidatures, 
            'form': form,
            'profile_incomplete': profile_incomplete
        })
        return render(request, 'Ekandra/profile_demandeur.html', context)
    except Demandeur.DoesNotExist:
        try:
            to_date=timezone.now().date ()
            entreprise = Entreprise.objects.get(user=request.user)
            offres = OffreEmploi.objects.filter(entreprise=entreprise)
            moyenne = Notation.objects.filter(entreprise=entreprise).aggregate(Avg('note'))['note__avg'] or 0
            notations = Notation.objects.filter(entreprise=entreprise)
            profile_incomplete = not (entreprise.nom and entreprise.nom != "Entreprise" and entreprise.description)
            if request.method == 'POST':
                form = EntrepriseProfileUpdateForm(request.POST, request.FILES, instance=entreprise)
                if form.is_valid():
                    form.save()
                    messages.success(request, 'Profil mis à jour.')
                    return redirect('profile')
            else:
                form = EntrepriseProfileUpdateForm(instance=entreprise)
            context = get_base_context(request)
            context.update({
                'entreprise': entreprise, 
                'offres': offres, 
                'form': form,
                'moyenne': moyenne,
                'notations': notations,
                'profile_incomplete': profile_incomplete,
                'to_date':to_date,
            })
            return render(request, 'Ekandra/profile_entreprise.html', context)
        except Entreprise.DoesNotExist:
            messages.error(request, 'Profil non configuré.')
            return redirect('home')
@login_required # Cette vue ne sera accessible qu'aux utilisateurs connectés
def parametre(request):
    """
    Vue pour afficher la page des paramètres du compte.
    """
    return render(request, 'Ekandra/parametre.html')
@login_required
def offre_create(request):
    try:
        entreprise = Entreprise.objects.get(user=request.user)
        if request.method == 'POST':
            form = OffreEmploiForm(request.POST)
            if form.is_valid():
                offre = form.save(commit=False)
                offre.entreprise = entreprise
                offre.save()
                messages.success(request, 'Offre publiée.')
                return redirect('profile')
            else:
                messages.error(request, 'Erreur dans le formulaire.')
        else:
            form = OffreEmploiForm()
        context = get_base_context(request)
        context.update({'form': form})
        return render(request, 'Ekandra/offre_form.html', context)
    except Entreprise.DoesNotExist:
        messages.error(request, 'Seules les entreprises peuvent publier des offres.')
        return redirect('home')

def offres_list(request):
    offres = OffreEmploi.objects.filter(active=True)
    context = get_base_context(request)
    context.update({'offres': offres})
    return render(request, 'Ekandra/offres.html', context)
def offres_view(request):
    today = timezone.localdate()

    
    offres_valides = OffreEmploi.objects.filter(date_fin__gte=today).order_by('-date_publication')

    context = {
        'offres': offres_valides,
        'to_date': today, # Passe la date actuelle au template
    }
    return render(request, 'Ekandra/offres.html', context)

@login_required
def candidature_create(request, offre_id):
    
    offre = get_object_or_404(OffreEmploi, id=offre_id, active=True)

    try:
       
        demandeur = Demandeur.objects.get(user=request.user)

        if Candidature.objects.filter(demandeur=demandeur, offre=offre).exists():
            messages.info(request, "Vous avez déjà postulé à cette offre.")
            return redirect('offre_detail', offre_id=offre.id) 

        if request.method == 'POST':
            form = CandidatureForm(request.POST, request.FILES) 
            if form.is_valid():
                candidature = form.save(commit=False)

                candidature.demandeur = demandeur
                candidature.offre = offre
                candidature.statut = 'en_attente' 

                candidature.save()

                messages.success(request, 'Votre candidature a été envoyée avec succès.')
                return redirect('profile') 
            else:
                messages.error(request, 'Erreur dans le formulaire. Veuillez vérifier les informations soumises.')
        else:
            form = CandidatureForm()

        context = {
            'form': form,
            'offre': offre,
        }
      
        return render(request, 'Ekandra/candidature_form.html', context) 

    except Demandeur.DoesNotExist:
        messages.error(request, "Vous devez avoir un profil de demandeur d'emploi pour postuler à une offre. Veuillez compléter votre profil.")
        return redirect('home') 
    except Exception as e:
        messages.error(request, f"Une erreur inattendue est survenue: {e}")
        return redirect('offres')

@login_required
def candidature_detail(request, candidature_id):
    candidature = get_object_or_404(Candidature, id=candidature_id)
    if request.user == candidature.demandeur.user or request.user == candidature.offre.entreprise.user:
        if request.GET.get('download_cv') and candidature.cv:
            response = HttpResponse(candidature.cv, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="cv_{candidature.demandeur.nom}.pdf"'
            return response
        if request.GET.get('download_lm') and candidature.lettre_motivation:
            response = HttpResponse(candidature.lettre_motivation, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="LM_{candidature.demandeur.nom}.pdf"'
            return response
        context = get_base_context(request)
        context.update({'candidature': candidature})
        return render(request, 'Ekandra/candidature_detail.html', context)
    messages.error(request, 'Accès non autorisé.')
    return redirect('home')

@login_required
def messages_list(request):
    """
    Displays a list of conversations for the logged-in user.
    """
    conversations = User.objects.filter(
        Q(messages_envoyes__destinataire=request.user) | Q(messages_recus__expediteur=request.user)
    ).distinct().annotate(
        unread_count=Count('messages_recus', filter=Q(messages_recus__destinataire=request.user, messages_recus__lu=False)),
        last_message_date_sent=Max('messages_envoyes__date_envoi', filter=Q(messages_envoyes__destinataire=request.user)),
        last_message_date_received=Max('messages_recus__date_envoi', filter=Q(messages_recus__expediteur=request.user))
    )

    conversations_list = []
    for user in conversations:
        last_message = Message.objects.filter(
            Q(expediteur=request.user, destinataire=user) | Q(expediteur=user, destinataire=request.user)
        ).order_by('-date_envoi').first()

        conversations_list.append({
            'user': user, 
            'unread_count': user.unread_count, 
            'last_message': last_message, 
        })

    conversations_list.sort(key=lambda x: x['last_message'].date_envoi if x['last_message'] else None, reverse=True)


    context = get_base_context(request)
    get_base_context(request) 
    #  context = {}

    context.update({'conversations': conversations_list})

    return render(request, 'Ekandra/messages_list.html', context)

@login_required
def message_conversation(request, user_id):
    
    destinataire = get_object_or_404(User, id=user_id)

    conversation_messages = Message.objects.filter(
        Q(expediteur=request.user, destinataire=destinataire) |
        Q(expediteur=destinataire, destinataire=request.user)
    ).order_by('date_envoi')

    conversation_messages.filter(destinataire=request.user, lu=False).update(lu=True)

  
    users_to_message = User.objects.exclude(id=request.user.id).order_by('username')

    
    context = get_base_context(request)
    get_base_context(request) 
    # context = {}


    context.update({
        'destinataire': destinataire,
        'messages': conversation_messages, 
        'form': MessageForm(), 
        'users_to_message': users_to_message, 
    })

    # Render the conversation template
    return render(request, 'Ekandra/message_conversation.html', context)

@login_required
def chercher_utilisateur(request):
    
    users_to_find = User.objects.exclude(id=request.user.id).order_by('username')

    potential_contacts = users_to_find

    context = get_base_context(request)
    get_base_context(request)
    # context = {}
    context.update({
        'potential_contacts': potential_contacts,
    })

    return render(request, 'Ekandra/chercher_utilisateur.html', context)
@login_required
def supprimer_offre(request, offeremploi_id):
    offer = get_object_or_404(OffreEmploi, id=offeremploi_id)
    user_entreprise = Entreprise.objects.get(user=request.user)
    form = OffreEmploiForm(request.POST)
    
    

    
    if offer.entreprise == user_entreprise:
        if request.method == 'POST':
            offer.delete()
            messages.success(request, "L'offre a été supprimée avec succès.")

            return redirect('profile')

        else:
            offer.delete()
            messages.success(request, "L'offre a été supprimée avec succès.")
            return redirect('profile')
        #     context = get_base_context(request) 
        #     context.update({
        # 'offre': offer,
        # 'entreprise': user_entreprise, 
        # 'form': form,
        #                  })
            
        #     return render(request, 'Ekandra/profile_entreprise.html', context)

    else:
        messages.error(request, "Vous n'avez pas la permission de supprimer cette offre.")
        return redirect('profile', offeremploi_id=offeremploi_id)




@login_required
def noter_entreprise(request, entreprise_id):
    entreprise = get_object_or_404(Entreprise, id=entreprise_id)
    try:
        demandeur = Demandeur.objects.get(user=request.user)
        if request.method == 'POST':
            form = NotationForm(request.POST)
            if form.is_valid():
                notation, created = Notation.objects.update_or_create(
                    demandeur=demandeur,
                    entreprise=entreprise,
                    defaults={
                        'note': form.cleaned_data['note'],
                        'commentaire': form.cleaned_data['commentaire']
                    }
                )
                messages.success(request, 'Notation enregistrée.')
                return redirect('profile')
            else:
                messages.error(request, 'Erreur dans le formulaire.')
        else:
            try:
                notation = Notation.objects.get(demandeur=demandeur, entreprise=entreprise)
                form = NotationForm(instance=notation)
            except Notation.DoesNotExist:
                form = NotationForm()
        context = get_base_context(request)
        context.update({'form': form, 'entreprise': entreprise})
        return render(request, 'Ekandra/noter_entreprise.html', context)
    except Demandeur.DoesNotExist:
        messages.error(request, 'Seuls les demandeurs peuvent noter.')
        return redirect('home')
    

@login_required
def voir_candidatures(request, candidature_id):
    """
    Displays candidatures submitted for job offers of the logged-in entreprise.
    Allows accepting or refuseeing candidatures.
    """
    try:

        entreprise = Entreprise.objects.get(user=request.user)
    except Entreprise.DoesNotExist:
        messages.error(request, "Seules les entreprises peuvent gérer les candidatures.")
        return redirect('home') 

    entreprise_offers = OffreEmploi.objects.filter(entreprise=entreprise)

    candidatures = Candidature.objects.filter(offre__in=entreprise_offers).order_by('-date_candidature')

    if request.method == 'POST':
        candidature_id = request.POST.get('candidature_id')
        action = request.POST.get('action') 

        if not candidature_id or not action:
            messages.error(request, "Requête invalide.")
            return redirect('profile') 

        try:
            
            candidature = get_object_or_404(Candidature, id=candidature_id)

            
            if candidature.offre.entreprise != entreprise:
                messages.error(request, "Vous n'avez pas la permission de modifier cette candidature.")
                return redirect('profile') 

            
            if action == 'acceptee':
        
                candidature.statut = 'acceptee'
                candidature.save()
                messages.success(request, f"Candidature de {candidature.demandeur.user.username} pour '{candidature.offre.titre}' acceptée.")

            elif action == 'refusee':
                
                candidature.statut = 'refusee'
                candidature.save()
                messages.error(request, f"Candidature de {candidature.demandeur.user.username} pour '{candidature.offre.titre}' refusée.")

            else:
                messages.error(request, "Action non reconnue.")

        except Candidature.DoesNotExist:
            messages.error(request, "Candidature introuvable.")
        context = get_base_context(request) 
        context.update({
        'entreprise': entreprise,
        'candidatures': candidatures,
        'entreprise_offers': entreprise_offers, 
                        })

        
        # return redirect('voir_candidatures')
        return render(request,'Ekandra/voir_candidature.html',context)



    context = get_base_context(request) 
    context.update({
        'entreprise': entreprise,
        'candidatures': candidatures,
        'entreprise_offers': entreprise_offers, 
    })

    return render(request, 'Ekandra/voir_candidature.html', context)