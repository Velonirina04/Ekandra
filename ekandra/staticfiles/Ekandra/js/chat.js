
const recipientId = document.getElementById('destinataire.id');
    // Construct the WebSocket URL
    // Adjust the WebSocket URL if your server is not running on the same host/port
    const chatSocket = new WebSocket(
        'ws://' + window.location.host +
        '/ws/chat/' + recipientId + '/'
    );

    // Function to format timestamp
    function formatTimestamp(isoString) {
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const message = data['message'];
        const senderUsername = data['sender_username'];
        const timestamp = data['timestamp']; // Get the timestamp from the WebSocket data
        const chatLog = document.querySelector('#chat-log');
        const currentUser = "{{ request.user.username }}"; // Get the current user's username

        // Create a new message element
        const messageElement = document.createElement('div');
        messageElement.classList.add('mb-2');

        // Add text-end or text-start class based on the sender (Bootstrap 5)
        if (senderUsername === currentUser) {
            messageElement.classList.add('text-end');
        } else {
            messageElement.classList.add('text-start');
        }

        // Add sender username and timestamp
        const metaSpan = document.createElement('small'); // Use small tag for smaller text
        metaSpan.classList.add('text-muted'); // Use text-muted for grey text
        metaSpan.textContent = `${senderUsername} - ${formatTimestamp(timestamp)}`; // Use formatted timestamp
        messageElement.appendChild(metaSpan);

        // Add the message content
        const contentPara = document.createElement('p');
        contentPara.classList.add('d-inline-block', 'p-2', 'rounded-3'); // Use Bootstrap classes
         if (senderUsername === currentUser) {
            contentPara.classList.add('bg-primary', 'text-white'); // Use Bootstrap primary color
        } else {
            contentPara.classList.add('bg-light', 'text-dark'); // Use Bootstrap light background
        }
        contentPara.textContent = message;
        messageElement.appendChild(contentPara);

        // Append the new message to the chat log
        chatLog.appendChild(messageElement);

        // Scroll to the bottom of the chat log
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('#chat-message-input').focus();
    document.querySelector('#chat-message-input').onkeyup = function(e) {
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('#chat-form button[type="submit"]').click();
        }
    };

    document.querySelector('#chat-form').onsubmit = function(e) {
        e.preventDefault(); // Prevent default form submission
        const messageInput = document.querySelector('#chat-message-input');
        const message = messageInput.value;
        if (message.trim() === '') { // Prevent sending empty messages
             console.log("Cannot send empty message."); // Or show a user-friendly message
             return;
        }
        chatSocket.send(JSON.stringify({
            'message': message
        }));
        messageInput.value = ''; // Clear the input field
    };

    // Scroll to the bottom when the page loads to show the latest messages
    window.onload = function() {
        const chatLog = document.querySelector('#chat-log');
        chatLog.scrollTop = chatLog.scrollHeight;
    };
