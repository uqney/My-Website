/**
 * Updates the status of the panorama list based on the uploaded panoramas.
 * If no panoramas are available, the list shows a "No panoramas available" message.
 * If panoramas exist, it ensures the list is not marked as empty.
 */
function updatePanoramaListStatus() {
    const panoramaList = document.getElementById('panorama-list');
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];

    if (panoramas.length == 0) {
        panoramaList.classList.add('empty');
        panoramaList.innerHTML = '<p>No panoramas available.</p>';
    } else {
        panoramaList.classList.remove('empty');
    }
}

/**
 * Displays the list of uploaded panoramas.
 * It clones a template for each panorama, populates the fields with the panorama data,
 * and appends the elements to the panorama list.
 */
function displayPanoramas() {
    updatePanoramaListStatus(); // Update the status of the panorama list (empty or filled)

    const panoramaList = document.getElementById('panorama-list');
    const panoramaTemplate = document.getElementById('panorama-template');
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];

    panoramas.forEach((panorama, index) => {
        const clone = panoramaTemplate.content.cloneNode(true); // Clone the panorama template

        const rootElement = clone.querySelector('.panorama-element');

        // Set the image source and alt text
        const image = rootElement.querySelector('.panorama-image');
        image.src = panorama.imageUrl;
        image.alt = `Panorama ${index + 1}`;

        // Set the title and tooltip for the panorama
        const heading = rootElement.querySelector('.panorama-title');
        const title = panorama.title;
        heading.textContent = title;
        heading.title = title; // Tooltip with full title

        // Set the dimensions of the panorama
        const dimensions = rootElement.querySelector('.panorama-dimensions');
        dimensions.textContent = `${panorama.width}px × ${panorama.height}px`;

        // Set the upload date for the panorama
        const uploadInfo = rootElement.querySelector('.panorama-upload-date');
        uploadInfo.textContent = `Uploaded on: ${panorama.timeStamp}`;

        const activateButton = rootElement.querySelector('.activate-button');

        // Highlight the active panorama
        if (panorama.isActive) {
            rootElement.classList.add('active');
            activateButton.disabled = true;
            activateButton.textContent = 'Already active';
        }

        panoramaList.appendChild(clone); // Append the cloned and populated element to the list
    });
}

/**
 * Adds event listeners to buttons in the panorama list (edit, delete, and activate buttons).
 * Handles button actions when clicked (edit, delete, or activate a panorama).
 */
function addEventListenersToButtons() {
    const panoramaList = document.getElementById('panorama-list');

    panoramaList.addEventListener('click', (event) => {
        const target = event.target;
        const panoramaElement = target.closest('.panorama-element');

        if (target.classList.contains('edit-button')) {
            handleEdit(panoramaElement); // Handle edit button click
        } else if (target.classList.contains('delete-button')) {
            handleDelete(panoramaElement); // Handle delete button click
        } else if (target.classList.contains('activate-button')) {
            handleActivate(panoramaElement, false); // Handle activate button click
        }
    });
}

/**
 * Handles the edit action for a panorama.
 * It finds the selected panorama and initializes the overlay for editing.
 * 
 * @param {Element} panoramaElement - The panorama element that is being edited.
 */
function handleEdit(panoramaElement) {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
    const title = panoramaElement.querySelector('.panorama-title').textContent;
    const panorama = panoramas.find(panorama => panorama.title == title);

    initalizeOverlay(panorama); // Initialize the overlay for editing the panorama
}

/**
 * Handles the delete action for a panorama.
 * It confirms the deletion with the user, removes the panorama from the list, 
 * updates the active panorama if necessary, and stores the updated list in Local Storage.
 * 
 * @param {Element} panoramaElement - The panorama element to be deleted.
 */
function handleDelete(panoramaElement) {
    if (confirm('Do you really want to remove this panorama?')) {
        const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
        const title = panoramaElement.querySelector('.panorama-title').textContent;

        // Filter the panorama to remove from the list
        const updatedPanoramas = panoramas.filter(panorama => panorama.title !== title);

        // Check if the deleted panorama was active
        const wasActive = panoramas.find(panorama => panorama.title === title)?.isActive;

        // If the active panorama was deleted, set the next panorama as active
        if (wasActive && updatedPanoramas.length > 0) {
            updatedPanoramas[0].isActive = true;
        }

        // Save the updated list back to Local Storage
        localStorage.setItem('uploadedPanoramas', JSON.stringify(updatedPanoramas));

        // Remove the panorama element from the DOM
        panoramaElement.remove();
        updatePanoramaListStatus();

        // If a new panorama is active, update the visual state
        if (wasActive && updatedPanoramas.length > 0) {
            const newActiveElement = document.querySelector('.panorama-element');
            handleActivate(newActiveElement, true);
        }

        alert(`${title} has been removed successfully.`);
    }
}

/**
 * Handles the activation of a panorama.
 * Sets the selected panorama as active, updates the visual feedback, 
 * and stores the updated list in Local Storage.
 * 
 * @param {Element} panoramaElement - The panorama element to be activated.
 * @param {boolean} isSilent - If true, suppresses the alert message after activation.
 */
function handleActivate(panoramaElement, isSilent) {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
    const title = panoramaElement.querySelector('.panorama-title').textContent;

    // Mark the selected panorama as active
    panoramas.forEach(panorama => {
        panorama.isActive = (panorama.title === title);
    });

    // Save the updated list back to Local Storage
    localStorage.setItem('uploadedPanoramas', JSON.stringify(panoramas));

    // Update the visual feedback for active panorama
    const allElements = document.querySelectorAll('.panorama-element');
    allElements.forEach(element => element.classList.remove('active'));
    panoramaElement.classList.add('active');

    // Update the button text and state for each panorama
    const allButtons = document.querySelectorAll('.activate-button');
    allButtons.forEach(button => {
        const buttonTitle = button.closest('.panorama-element').querySelector('.panorama-title').textContent;
        button.disabled = (buttonTitle === title);
        button.textContent = (buttonTitle === title) ? 'Already active' : 'Set as active';
    });

    // Only show an alert if isSilent is false
    if (!isSilent) {
        alert(`${title} has been set as active!`);
    }
}

// Initialize panorama display and event listeners once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    displayPanoramas(); // Display the list of panoramas
    addEventListenersToButtons(); // Add event listeners to the buttons
});
