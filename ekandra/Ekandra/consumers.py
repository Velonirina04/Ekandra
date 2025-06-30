# Ekandra/consumers.py

import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import Message # Import your Message model

User = get_user_model()

class ChatConsumer(WebsocketConsumer):
    """
    Handles WebSocket connections for real-time chat conversations.
    """

    def connect(self):
        """
        Called when a WebSocket connection is established.
        """
        # Get the recipient user ID from the URL route
        self.recipient_id = self.scope['url_route']['kwargs']['user_id']
        # Get the recipient user object
        self.recipient = get_object_or_404(User, id=self.recipient_id)

        # Determine the conversation group name.
        # This ensures both users in a conversation join the same group.
        # We sort the IDs to have a consistent group name regardless of who initiates.
        user_ids = sorted([self.scope['user'].id, self.recipient.id])
        self.room_group_name = f'chat_{user_ids[0]}_{user_ids[1]}'

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        """
        Called when a WebSocket connection is closed.
        """
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        """
        Called when a message is received from the WebSocket.
        """
        text_data_json = json.loads(text_data)
        message_content = text_data_json['message']

        # Get the sender user (the current connected user)
        sender = self.scope['user']

        # Create and save the message in the database
        message = Message.objects.create(
            expediteur=sender,
            destinataire=self.recipient,
            contenu=message_content
        )

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message', # Calls the chat_message method
                'message': message.contenu,
                'sender_username': sender.username,
                'timestamp': message.date_envoi.isoformat() # Send timestamp
            }
        )

    def chat_message(self, event):
        """
        Receives a message from the room group and sends it over the WebSocket.
        """
        message = event['message']
        sender_username = event['sender_username']
        timestamp = event['timestamp']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'sender_username': sender_username,
            'timestamp': timestamp
        }))
# ~/Desktop/project/ekandra/Ekandra/consumers.py



class MessageListConsumer(AsyncWebsocketConsumer): # <--- This class must exist and be named correctly
    async def connect(self):
        # You might want to add users to a group here for general message list updates
        # e.g., self.room_group_name = 'messages_list_updates'
        # await self.channel_layer.group_add(
        #     self.room_group_name,
        #     self.channel_name
        # )
        await self.accept()
        print(f"WebSocket connected: {self.scope['url_route']['kwargs']}")

    async def disconnect(self, close_code):
        # Leave room group
        # await self.channel_layer.group_discard(
        #     self.room_group_name,
        #     self.channel_name
        # )
        print(f"WebSocket disconnected: {close_code}")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        print(f"Received message: {message}")

        await self.send(text_data=json.dumps({"message": message}))

    # Add methods to receive messages from the channel layer if you're sending updates
    # async def your_custom_event(self, event):
    #     message = event['message']
    #     await self.send(text_data=json.dumps({
    #         'message': message
    #     }))