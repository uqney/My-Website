/**
 * Funktion: Hochladen einer Datei (universelle Logik)
 * @param {String} imageUrl - Die URL des Bildes (Base64 oder Dateipfad).
 * @param {Object} additionalData - Zusätzliche Daten (z. B. Breite, Höhe, Zeitstempel).
 */
function handleImageUpload(imageUrl, additionalData) {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];

    // Alle anderen Panoramen deaktivieren
    panoramas.forEach(panorama => panorama.isActive = false);

    // Neues Panorama hinzufügen
    const newPanorama = { imageUrl, isActive: true, ...additionalData };
    panoramas.push(newPanorama);
    localStorage.setItem('uploadedPanoramas', JSON.stringify(panoramas));

    viewPanorama(imageUrl, additionalData.hotSpots);
}


/**
 * Verarbeitung eines Bildes aus der Kamera
 * @param {HTMLVideoElement} video - Videoelement, das die Kamera zeigt.
 */
function uploadFromCamera(video, captureCanvas) {
    const context = captureCanvas.getContext('2d');
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);

    const compressedImageUrl = getCompressedImageUrl(captureCanvas);
    const timeStamp = new Date().toLocaleString();

    const additionalData = {
        imageUrl: compressedImageUrl,
        title: `Panorama captured on ${timeStamp}`,
        width: captureCanvas.width,
        height: captureCanvas.height,
        timeStamp: timeStamp
    };

    handleImageUpload(compressedImageUrl, additionalData);
}