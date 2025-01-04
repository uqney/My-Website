const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
};

// Laden des Dark Mode Status
window.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('darkMode');
    const toggleInput = document.getElementById('dark-mode-toggle');
    if (savedMode === 'enabled') {
        document.body.classList.add('dark');
        toggleInput.checked = true;
    }
    toggleInput.addEventListener('change', toggleDarkMode);
});
