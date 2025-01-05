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
    const lastUploaded = panoramas[panoramas.length - 1];
    if (lastUploaded) {
        pannellum.viewer('panorama', {
            "type": "equirectangular",
            "panorama": lastUploaded.imageUrl,
            "autoLoad": true,
            "hotSpots": lastUploaded.hotspots
        });
    }
};

