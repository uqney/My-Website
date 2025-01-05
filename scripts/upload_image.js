const uploadInput = document.getElementById('upload-image');

uploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const fileName = file.name;
    if (file) {
        // Überprüfen, ob die Datei ein Bild ist und den erlaubten Typ hat
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Die hochgeladene Datei ist kein unterstütztes Bildformat. Erlaubt sind: JPEG, PNG, WEBP.');
            uploadInput.value = ''; // Zurücksetzen des Eingabefeldes
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const imageUrl = e.target.result;
            const img = new Image();

            img.onload = function () {
                const width = img.width;
                const height = img.height;
                const aspectRatio = width / height;

                // Warnen, falls das Seitenverhältnis kleiner als 16:9 ist
                if (aspectRatio < 16 / 9) {
                    const proceed = confirm('Das Seitenverhältnis des Bildes ist kleiner als 16:9. Es könnte in der Anzeige verzerrt werden. Möchten Sie das Bild dennoch hochladen?');
                    if (!proceed) {
                        uploadInput.value = ''; // Zurücksetzen des Eingabefeldes
                        return;
                    }
                }

                // Komprimierung des Bildes
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                context.drawImage(img, 0, 0, width, height);

                const compressedImageUrl = getCompressedImageUrl(canvas);

                // Hotspots definieren
                const hotspots = [];

                const timeStamp = new Date().toLocaleString();

                viewPanorama(compressedImageUrl, hotspots);

                // Speichern des Bildes und der Hotspots im localStorage
                const panoramaData = {
                    imageUrl: compressedImageUrl,
                    name: fileName.substring(0, fileName.lastIndexOf('.')),
                    hotSpots: hotspots,
                    width: width,
                    height: height,
                    timeStamp: timeStamp
                };
                addDataToLocalStorage(panoramaData);
            };

            img.src = imageUrl;
        };
        reader.readAsDataURL(file);
    } else {
        uploadInput.value = ''; // Zurücksetzen des Eingabefeldes, falls keine Datei gewählt wurde
    }
});

function getCompressedImageUrl(canvas) {
    var compressedImageUrl = canvas.toDataURL('image/jpeg', 0.8)

    // Speicherplatz prüfen
    const imageSize = Math.ceil(compressedImageUrl.length / 1024); // Größe in KB
    const maxStorage = 5120; // Beispiel: 5 MB max Local Storage
    const currentStorage = JSON.stringify(localStorage).length / 1024;

    if ((currentStorage + imageSize) > maxStorage) {
        const proceedWithGlobalCompression = confirm('Der Speicherplatz ist fast voll. Möchten Sie alle gespeicherten Bilder komprimieren, um mehr Platz zu schaffen?');
        if (proceedWithGlobalCompression) {
            optimizeLocalStorageSpace();
            alert('Alle gespeicherten Bilder wurden komprimiert.');
        } else {
            const proceedWithLowerQuality = confirm('Der Speicherplatz ist fast voll. Möchten Sie das Bild mit niedrigerer Qualität speichern, um Platz zu sparen?');
            if (!proceedWithLowerQuality) {
                alert('Das Bild wurde nicht gespeichert.');
                uploadInput.value = ''; // Eingabefeld zurücksetzen
                return;
            }
        }
        const lowerQualityImageUrl = captureCanvas.toDataURL('image/jpeg', 0.5); // Stärker komprimieren
        compressedImageUrl = lowerQualityImageUrl;
    }

    return compressedImageUrl;
}