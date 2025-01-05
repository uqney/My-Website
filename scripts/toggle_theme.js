const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');

    // Icons dynamisch anpassen
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    if (isDarkMode) {
        sunIcon.style.opacity = '0';
        moonIcon.style.opacity = '1';
    } else {
        sunIcon.style.opacity = '1';
        moonIcon.style.opacity = '0';
    }
};

// Laden des Dark Mode Status
window.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('darkMode');
    const toggleInput = document.getElementById('dark-mode-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    if (savedMode === 'enabled') {
        document.body.classList.add('dark');
        toggleInput.checked = true;
        sunIcon.style.opacity = '0';
        moonIcon.style.opacity = '1';
    } else {
        sunIcon.style.opacity = '1';
        moonIcon.style.opacity = '0';
    }

    toggleInput.addEventListener('change', toggleDarkMode);
});
