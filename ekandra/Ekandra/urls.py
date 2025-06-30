from django.urls import path
from Ekandra import views  # Import mis à jour

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('a-propos/', views.a_propos, name='a_propos'),
    path('contact/', views.contact, name='contact'),
    path('faq/', views.faq, name='faq'),
    path('parametre/', views.parametre, name='parametre'),
     path('credits/', views.credit, name='credits'),
    path('profile/', views.profile, name='profile'),
    path('offres/', views.offres_list, name='offres'),
    path('offre/create/', views.offre_create, name='offre_create'),
    path('candidature/<int:offre_id>/', views.candidature_create, name='candidature_create'),
    path('candidature/detail/<int:candidature_id>/', views.candidature_detail, name='candidature_detail'),
    path('messages/', views.messages_list, name='messages'),
    path('messages/chercher_utilisateur/', views.chercher_utilisateur, name='chercher_utilisateur'),
    path('messages/<int:user_id>/', views.message_conversation, name='message_conversation'),
    path('profile/supprimer_offre/<int:offeremploi_id>/', views.supprimer_offre, name='supprimer_offre'),
    path('noter/<int:entreprise_id>/', views.noter_entreprise, name='noter_entreprise'),
    path('profile/candidature/<int:candidature_id>/', views.voir_candidatures, name='voir_candidatures'),
]