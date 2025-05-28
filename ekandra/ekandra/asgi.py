"""
ASGI config for ekandra project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""
# your_project_name/asgi.py

# ekandra/asgi.py

# ekandra/asgi.py

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

# Set the DJANGO_SETTINGS_MODULE environment variable early.
# Ensure 'ekandra.settings' is the correct path to your settings.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ekandra.settings')

# Call get_asgi_application() to load settings and initialize the app registry
# This needs to happen before importing modules that rely on the app registry
django_asgi_app = get_asgi_application()

# Import your routing configuration *after* get_asgi_application() is called
# This helps ensure the app registry is ready when routing and consumers are imported
from Ekandra import routing # Ensure this path is correct for your app

application = ProtocolTypeRouter({
    "http": django_asgi_app, # Use the initialized Django ASGI application for HTTP
    # Configuration du routage WebSocket
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                routing.websocket_urlpatterns # Use your app's websocket URL patterns
            )
        )
    ),
})
