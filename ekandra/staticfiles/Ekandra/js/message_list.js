// static/Ekandra/js/messages-list.js

document.addEventListener('DOMContentLoaded', () => {
    // Get the current user's ID
    const currentUserId = document.body.dataset.userId || "{{ request.user.id }}"; // Fallback to Django context if data-user-id is on body

    // Construct the WebSocket URL for the messages list
    // This URL should be routed to your MessagesListConsumer
    const messagesListSocket = new WebSocket(
        'ws://' + window.location.host +
        '/ws/messages_list/' // Make sure this matches your Django Channels routing
    );

    messagesListSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log('Liste des Message:', data);

        if (data.type === 'message_list_update') {
            const otherUserId = data.other_user_id;
            const lastMessageContent = data.last_message_content;
            const lastMessageTimestamp = data.last_message_date; // ISO format string
            const unreadCount = data.unread_count;
            const senderId = data.sender_id;
            const senderUsername = data.sender_username; // Assuming sender username is sent

            const conversationItem = document.querySelector(`.list-group-item[data-user-id="${otherUserId}"]`);

            if (conversationItem) {
                // Update the last message snippet
                const lastMessageSnippetElement = conversationItem.querySelector('.last-message-snippet');
                if (lastMessageSnippetElement) {
                    const prefix = (senderId == currentUserId) ? "You:" : `${senderUsername}:`;
                    lastMessageSnippetElement.innerHTML = `<span class="fw-bold">${prefix}</span> ${lastMessageContent}`;
                }

                // Update the date
                const dateElement = conversationItem.querySelector('.text-end small.text-muted');
                if (dateElement && lastMessageTimestamp) {
                    const date = new Date(lastMessageTimestamp);
                    const formattedDate = date.toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                    dateElement.textContent = formattedDate;
                }

                // Update the unread badge and unread-conversation class
                let unreadBadge = conversationItem.querySelector('.unread-badge');
                if (unreadCount > 0) {
                    if (unreadBadge) {
                        unreadBadge.textContent = unreadCount;
                    } else {
                        unreadBadge = document.createElement('span');
                        unreadBadge.classList.add('badge', 'bg-primary', 'rounded-pill', 'unread-badge');
                        unreadBadge.textContent = unreadCount;
                        conversationItem.querySelector('.text-end').appendChild(unreadBadge);
                    }
                    conversationItem.classList.add('unread-conversation');
                } else {
                    if (unreadBadge) {
                        unreadBadge.remove();
                    }
                    conversationItem.classList.remove('unread-conversation');
                }

                // Move the updated conversation item to the top of the list
                const listGroup = conversationItem.closest('.list-group');
                if (listGroup) {
                    listGroup.prepend(conversationItem);
                }

            } else {
                // If the conversation item doesn't exist (e.g., first message in a new conversation)
                // This is more complex. For a robust solution, you might send a full
                // HTML snippet for the new item from the consumer, or make an AJAX
                // call to fetch it. For now, we'll log a warning.
                console.warn(`Conversation item pour l'utilisateur ID ${otherUserId} introuvable`);
                // Alternatively, you could trigger a full page refresh if a new conversation starts.
                // location.reload();
            }
        }
    };

    messagesListSocket.onopen = function(e) {
        console.log('Liste des Messages  socket ouvert');
    };

    messagesListSocket.onclose = function(e) {
        console.error('Liste des Messages socket fermer ');
    };

    messagesListSocket.onerror = function(e) {
        console.error('Messages list socket error:', e);
    };
});