/**
 * Initializes the overlay for editing the panorama.
 * It sets the current panorama and viewer.
 * 
 * @param {Object} currentPanorama - The current panorama to be edited.
 */
function initalizeOverlay(currentPanorama) {
    overlay.classList.add('visible');
    setPanorama(currentPanorama);
    setViewer();
}

/**
 * Hides the overlay and reloads the page to reflect changes.
 */
function hideOverlay() {
    overlay.classList.remove('visible');
    location.reload();
}

/**
 * Saves the current hot spots of a panorama to the local storage.
 * If the panorama is found, it updates the hot spots and saves the updated panorama.
 * 
 * @param {Object} panorama - The panorama whose hot spots are being saved.
 * @param {Array} currentHotSpots - The current hot spots to be saved.
 */
function handleSave(panorama, currentHotSpots) {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];

    const panoramaIndex = panoramas.findIndex(p => p.imageUrl == panorama.imageUrl);

    if (panoramaIndex !== -1) {
        panoramas[panoramaIndex].hotSpots = currentHotSpots;
        localStorage.setItem('uploadedPanoramas', JSON.stringify(panoramas));
        alert('Changes saved successfully!');
    } else {
        alert('Panorama not found!');
    }
    hideOverlay();
}

/**
 * Cancels the editing process by hiding the overlay.
 */
function handleCancel() {
    hideOverlay();
}

/**
 * Generates a unique ID for a hotspot.
 * 
 * @returns {string} - A unique hotspot ID.
 */
function generateUniqueId() {
    return 'hotspot-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Handles the addition of a hotspot by listening for a click event on the viewer.
 * Once clicked, a hotspot is created at the clicked coordinates.
 * 
 * @param {Object} viewer - The pannellum viewer instance.
 */
function handleAddHotspot(viewer) {
    const container = viewer.getContainer();

    // Define the listener for clicking on the viewer to add a hotspot
    const handleClick = (event) => {
        const coords = viewer.mouseEventToCoords(event);

        const hotspotId = generateUniqueId();

        const pitch = coords[0];
        const yaw = coords[1];

        pendingHotSpot = {
            id: hotspotId,
            pitch: pitch,
            yaw: yaw,
            type: 'info',
            createTooltipFunc: hotspotTooltip,
            createTooltipArgs: {
                text: 'New Hotspot',
                pitch: pitch,
                yaw: yaw,
                type: 'info'
            }
        };

        showHotspotForm(pendingHotSpot);

        // Remove the click listener after adding the hotspot
        container.removeEventListener('click', handleClick);
    };
    // Add the listener for click events
    container.addEventListener('click', handleClick);
}

/**
 * Creates a tooltip for a hotspot element.
 * Adds buttons for editing and deleting the hotspot.
 * 
 * @param {Element} hotSpotDiv - The div representing the hotspot.
 * @param {Object} args - Arguments containing information about the hotspot.
 */
function hotspotTooltip(hotSpotDiv, args) {
    hotSpotDiv.classList.add('custom-tooltip'); // Add custom styling
    var span = document.createElement('span'); // Add content to the tooltip
    span.innerHTML = args.text;
    hotSpotDiv.appendChild(span); // Append the tooltip content

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="material-icons">edit</i>';
    hotSpotDiv.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="material-icons">delete</i>';
    hotSpotDiv.appendChild(deleteButton);

    // Adjust positioning of the elements
    span.style.width = span.scrollWidth - 20 + 'px';
    span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 + 'px';
    span.style.marginTop = -span.scrollHeight - 12 + 'px';

    editButton.style.width = editButton.scrollWidth - 20 + 'px';
    editButton.style.marginLeft = (editButton.scrollWidth - 90 - hotSpotDiv.offsetWidth) / 2 + 'px';
    editButton.style.marginTop = editButton.scrollHeight - 10 + 'px';

    deleteButton.style.width = deleteButton.scrollWidth - 20 + 'px';
    deleteButton.style.marginLeft = (deleteButton.scrollWidth + 20 - hotSpotDiv.offsetWidth) / 2 + 'px';
    deleteButton.style.marginTop = deleteButton.scrollHeight - 10 + 'px';

    const index = currentHotSpots.findIndex(h =>
        (h.pitch == args.pitch) && (h.yaw == args.yaw)
    );

    let hotspot = currentHotSpots[index];

    editButton.addEventListener('click', (event) => {
        event.stopPropagation();
        editHotspot(hotspot);
    });

    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (confirm('Do you really want to delete this hotspot?')) {
            deleteHotspotById(hotspot.id);
        }
    });
}

/**
 * Shows the form to edit a hotspot's details.
 * 
 * @param {Object} hotspot - The hotspot to be edited.
 */
function editHotspot(hotspot) {
    showHotspotForm(hotspot);
}

/**
 * Deletes a hotspot by its ID.
 * It removes the hotspot from the viewer and updates the hot spot list.
 * 
 * @param {string} hotspotId - The ID of the hotspot to be deleted.
 */
function deleteHotspotById(hotspotId) {
    // Remove the hotspot from the viewer
    const success = viewer.removeHotSpot(hotspotId);
    if (!success) {
        alert('Hotspot could not be deleted.');
        return;
    }

    // Update the hot spot list
    currentHotSpots = currentHotSpots.filter(h => h.id != hotspotId);

    alert('Hotspot has been deleted.');
    refreshViewer();
}

/**
 * Refreshes the viewer by destroying and recreating it with the updated hot spots.
 */
function refreshViewer() {
    viewer.destroy(); // Destroy the current viewer

    // Recreate the viewer with the updated hot spots
    viewer = pannellum.viewer('panorama-viewer', {
        type: 'equirectangular',
        panorama: panorama.imageUrl,
        autoLoad: true,
        hotSpots: currentHotSpots,
    });
}

/**
 * Displays the hotspot form with the current hotspot data.
 * It also handles the visibility of the form based on the type of hotspot.
 * 
 * @param {Object} hotspot - The hotspot data to populate the form.
 */
function showHotspotForm(hotspot) {
    let updatedData = hotspot;
    const index = currentHotSpots.findIndex(h =>
        (h.pitch == hotspot.pitch) && (h.yaw == hotspot.yaw)
    );

    if (index >= 0) {
        viewer.removeHotSpot(hotspot.id);
    }

    formOverlay.classList.add('visible');
    typeSelect.value = updatedData.type;
    textInput.value = updatedData.createTooltipArgs.text;
    targetInput.value = '';

    // Handle visibility of target input based on hotspot type
    typeSelect.addEventListener('change', () => {
        const type = typeSelect.value;
        if (type === "scene" || type === "link") {
            targetLabel.style.display = 'block';
            targetInput.style.display = 'block';
        } else {
            targetLabel.style.display = 'none';
            targetInput.style.display = 'none';
        }
    });

    formSaveButton.addEventListener('click', () => {
        updatedData.type = typeSelect.value;
        updatedData.createTooltipArgs.text = textInput.value;
        if (updatedData.type === "scene") {
            updatedData.sceneId = targetInput.value;
        } else if (updatedData.type === "link") {
            updatedData.url = targetInput.value;
        }

        viewer.addHotSpot(updatedData);

        hideHotspotForm();
    });

    formCancelButton.addEventListener('click', hideHotspotForm);
}

/**
 * Hides the hotspot form overlay.
 */
function hideHotspotForm() {
    formOverlay.classList.remove('visible');
}

/**
 * Sets the current panorama and its associated hot spots.
 * 
 * @param {Object} currentPanorama - The current panorama to be set.
 */
function setPanorama(currentPanorama) {
    panorama = currentPanorama;
    currentHotSpots = currentPanorama.hotSpots || [];
}

/**
 * Initializes the viewer with the current panorama and its hot spots.
 */
function setViewer() {
    currentHotSpots.forEach(hotspot => {
        hotspot.createTooltipFunc = hotspotTooltip; // Reassign tooltip creation function
    });

    viewer = pannellum.viewer('panorama-viewer', {
        'type': 'equirectangular',
        'panorama': panorama.imageUrl,
        'autoLoad': true,
        'hotSpots': currentHotSpots
    });
}

/**
 * Retrieves the current panorama being viewed.
 * 
 * @returns {Object} - The current panorama.
 */
function getCurrentPanorama() {
    return panorama;
}

/**
 * Retrieves the current viewer instance.
 * 
 * @returns {Object} - The current pannellum viewer.
 */
function getCurrentViewer() {
    return viewer;
}

// Event listeners for the page
document.addEventListener('DOMContentLoaded', () => {
    cancelButton.addEventListener('click', handleCancel);

    saveButton.addEventListener('click', () => {
        const panorama = getCurrentPanorama();
        handleSave(panorama, currentHotSpots);
    });

    addHotpotButton.addEventListener('click', () => {
        const viewer = getCurrentViewer();
        handleAddHotspot(viewer);
    });
});
