function viewPanorama(imageUrl, hotSpots) {
    // Stelle sicher, dass `createTooltipFunc` wieder hinzugefügt wird
    hotSpots.forEach(hotspot => {
        hotspot.createTooltipFunc = hotspotTooltip; // Funktion neu zuweisen
    });

    // Pannellum Viewer initialisieren
    pannellum.viewer('panorama', {
        'type': 'equirectangular',
        'panorama': imageUrl,
        'autoLoad': true,
        'hotSpots': hotSpots
    });
}

function hotspotTooltip(hotSpotDiv, args) {
    hotSpotDiv.classList.add('custom-tooltip');
    var span = document.createElement('span');
    span.innerHTML = args.text; // Tooltip-Text
    hotSpotDiv.appendChild(span);

    span.style.width = span.scrollWidth - 20 + 'px';
    span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 + 'px';
    span.style.marginTop = -span.scrollHeight - 12 + 'px';
}

window.onload = function () {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
    panoramas.forEach(panorama => {
        if (panorama.isActive) {
            viewPanorama(panorama.imageUrl, panorama.hotSpots);
            return;
        }
    });
};
