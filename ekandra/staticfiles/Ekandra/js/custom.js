// custom.js

console.log("Custom JS for profile page loaded.");

document.addEventListener('DOMContentLoaded', function() {
    const collapseForm = document.getElementById('collapseProfileForm');
    const toggleButton = document.querySelector('[data-bs-target="#collapseProfileForm"]');

    if (collapseForm && toggleButton) {

        // Store the original content of the toggle button
        const originalButtonHtml = toggleButton.innerHTML;
        const originalAriaExpanded = toggleButton.getAttribute('aria-expanded'); // Get initial state for restoration

        // Add event listener for when the collapse transition is complete (form is shown)
        collapseForm.addEventListener('shown.bs.collapse', function () {
            console.log('Profile form shown.');

            // 1. Focus the first input field
            // Find the first visible input, select, or textarea
            const firstInput = collapseForm.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])');
            if (firstInput) {
                firstInput.focus();
                console.log('Focused on:', firstInput);
            }

            // 2. Optional: Scroll the form into view
            // Use a slight delay to allow the collapse transition to start
            setTimeout(() => {
                collapseForm.scrollIntoView({
                    behavior: 'smooth', // Smooth scrolling
                    block: 'start' // Align the top of the element to the top of the viewport
                });
                 console.log('Scrolled form into view.');
            }, 300); // Adjust delay if needed

            // 3. Change the toggle button text and icon
            toggleButton.innerHTML = '<i class="bi bi-x-circle me-1"></i> Annuler la modification';
            toggleButton.setAttribute('aria-expanded', 'true'); // Update aria-expanded manually after JS change
        });

        // Add event listener for when the collapse transition is complete (form is hidden)
        collapseForm.addEventListener('hidden.bs.collapse', function () {
             console.log('Profile form hidden.');
            // Restore the original button text and icon
            toggleButton.innerHTML = originalButtonHtml;
            toggleButton.setAttribute('aria-expanded', 'false'); // Update aria-expanded manually after JS change
        });

         // Handle initial state on page load if the form is already visible (e.g., profile incomplete)
         // This ensures the button text is correct if the form starts open
         if (collapseForm.classList.contains('show')) {
             console.log('Profile form initially shown.');
             toggleButton.innerHTML = '<i class="bi bi-x-circle me-1"></i> Annuler la modification';
             toggleButton.setAttribute('aria-expanded', 'true');
         }
    } else {
        console.log('Collapse form element or toggle button not found.');
    }
});

// custom.js
// Add logic specific to the chat page here

console.log("Custom JS for conversation page loaded.");

document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const messageForm = document.getElementById('message-form'); // Assuming you added this ID

    // Function to scroll chat box to the bottom
    function scrollToBottom() {
        if (chatBox) {
            // Scroll to the bottom using the scrollHeight
            chatBox.scrollTop = chatBox.scrollHeight;
             console.log('Scrolled chat box to bottom.');
        }
    }

    // Scroll to bottom when the page loads
    // Use a slight delay to ensure content and images have loaded and height is calculated
    setTimeout(scrollToBottom, 100); // Adjust delay if necessary

    // Optional: Add logic to scroll to bottom after sending a message via AJAX
    // (This would require modifying the form submission to use AJAX)
    // If using standard form submission and page reload, the initial scroll above is sufficient.

});

// Note: The collapse form JS for profile pages should be separate or
// checked for element existence if this custom.js file is shared site-wide.