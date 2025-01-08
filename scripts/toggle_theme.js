/**
 * Toggles dark mode on or off. This function changes the body's class to apply dark mode styles, 
 * updates the localStorage to remember the user's choice, and dynamically adjusts the visibility 
 * of the sun and moon icons to indicate the current mode.
 */
const toggleDarkMode = () => {
    // Toggle the 'dark' class on the body element to switch between dark and light modes
    document.body.classList.toggle('dark');

    // Check if dark mode is enabled
    const isDarkMode = document.body.classList.contains('dark');

    // Save the current mode in localStorage so it persists across page reloads
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');

    // Get references to the sun and moon icons
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // Adjust the opacity of the icons to reflect the current mode
    if (isDarkMode) {
        sunIcon.style.opacity = '0'; // Hide sun icon in dark mode
        moonIcon.style.opacity = '1'; // Show moon icon in dark mode
    } else {
        sunIcon.style.opacity = '1'; // Show sun icon in light mode
        moonIcon.style.opacity = '0'; // Hide moon icon in light mode
    }
};

/**
 * Loads the saved dark mode status from localStorage when the page is loaded, 
 * applies the respective mode (dark or light), and sets up the event listener 
 * to toggle the mode when the user changes the toggle input.
 */
window.addEventListener('DOMContentLoaded', () => {
    // Retrieve the saved dark mode status from localStorage
    const savedMode = localStorage.getItem('darkMode');

    // Get the toggle input element and the sun and moon icons
    const toggleInput = document.getElementById('dark-mode-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // Check if dark mode was previously enabled
    if (savedMode === 'enabled') {
        // Apply dark mode styles and check the toggle input
        document.body.classList.add('dark');
        toggleInput.checked = true;

        // Adjust the opacity of the icons to indicate dark mode
        sunIcon.style.opacity = '0';
        moonIcon.style.opacity = '1';
    } else {
        // Adjust the opacity of the icons to indicate light mode
        sunIcon.style.opacity = '1';
        moonIcon.style.opacity = '0';
    }

    // Add an event listener to the toggle input to change the mode when the user interacts with it
    toggleInput.addEventListener('change', toggleDarkMode);
});
