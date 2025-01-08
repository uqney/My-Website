/**
 * Initializes the Pannellum viewer to display a panorama with hotspots.
 * @param {string} imageUrl - The URL of the panorama image.
 * @param {Array} hotSpots - The list of hotspots to be displayed on the panorama.
 */
function viewPanorama(imageUrl, hotSpots) {
    // Ensure that the `createTooltipFunc` is assigned to each hotspot
    hotSpots.forEach(hotspot => {
        hotspot.createTooltipFunc = hotspotTooltip; // Reassign the tooltip function
    });

    // Initialize the Pannellum viewer with the specified panorama image and hotspots
    pannellum.viewer('panorama', {
        'type': 'equirectangular',  // Set the type of the panorama (equirectangular)
        'panorama': imageUrl,       // Set the image URL for the panorama
        'autoLoad': true,           // Automatically load the panorama
        'hotSpots': hotSpots       // Add the hotspots to the panorama
    });
}

/**
 * Creates and displays a tooltip for a hotspot.
 * @param {HTMLElement} hotSpotDiv - The div element representing the hotspot.
 * @param {Object} args - Arguments containing the tooltip text and position for the hotspot.
 */
function hotspotTooltip(hotSpotDiv, args) {
    // Add a custom class to the hotspot to apply custom styles
    hotSpotDiv.classList.add('custom-tooltip');

    // Create a span element to display the tooltip text
    var span = document.createElement('span');
    span.innerHTML = args.text; // Set the text content of the tooltip
    hotSpotDiv.appendChild(span); // Append the tooltip span to the hotspot div

    // Adjust the positioning of the tooltip for better alignment
    span.style.width = span.scrollWidth - 20 + 'px';  // Set the width to the text length, minus padding
    span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 + 'px';  // Center the tooltip horizontally
    span.style.marginTop = -span.scrollHeight - 12 + 'px';  // Position the tooltip above the hotspot
}

// When the window is loaded, check if there are any active panoramas
window.onload = function () {
    // Retrieve the list of panoramas from localStorage
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];

    // Iterate over all panoramas and display the first active panorama
    panoramas.forEach(panorama => {
        if (panorama.isActive) {
            // Display the active panorama using the viewer
            viewPanorama(panorama.imageUrl, panorama.hotSpots);
            return; // Stop iteration after finding the active panorama
        }
    });
};
