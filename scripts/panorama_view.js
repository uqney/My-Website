function viewPanorama(imageUrl, hotspots) {
    // Pannellum Viewer initialisieren
    pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": imageUrl,
        "autoLoad": true,
        "hotSpots": hotspots
    });
}

// Optional: Das zuletzt gespeicherte Bild laden
window.onload = function () {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
    panoramas.forEach(panorama => {
        if (panorama.isActive) {
            viewPanorama(panorama.imageUrl, panorama.hotSpots);
            return;
        }
    });
};

