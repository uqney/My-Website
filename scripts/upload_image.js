const uploadInput = document.getElementById('upload-image');

uploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const fileName = file.name;
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    if (file) {
        // Überprüfen, ob die Datei ein Bild ist und den erlaubten Typ hat
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('The uploaded file is not a supported image format. Allowed are: JPEG, PNG, WEBP.');
            uploadInput.value = ''; // Zurücksetzen des Eingabefeldes
            return;
        }

        // Überprüfen, ob das Bild bereits hochgeladen wurde
        const isDuplicate = checkDuplicateImage(baseName);
        if (isDuplicate) {
            alert('This image has already been uploaded.');
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
                    const proceed = confirm('The aspect ratio of the image is smaller than 16:9. It could be distorted in the display. Would you still like to upload the image?');
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
                    title: baseName,
                    hotSpots: hotspots,
                    width: width,
                    height: height,
                    timeStamp: timeStamp,
                    isActive: true
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

function checkDuplicateImage(baseName) {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
    return panoramas.some(panorama => panorama.title === baseName);
}

function getCompressedImageUrl(canvas) {
    var compressedImageUrl = canvas.toDataURL('image/jpeg', 0.8);

    // Speicherplatz prüfen
    const imageSize = Math.ceil(compressedImageUrl.length / 1024); // Größe in KB
    const maxStorage = 5120; // Beispiel: 5 MB max Local Storage
    const currentStorage = JSON.stringify(localStorage).length / 1024;

    if ((currentStorage + imageSize) > maxStorage) {
        const proceedWithGlobalCompression = confirm('The storage space is almost full. Would you like to compress all saved images to create more space?');
        if (proceedWithGlobalCompression) {
            optimizeLocalStorageSpace();
            alert('All saved images have been compressed.');
        } else {
            const proceedWithLowerQuality = confirm('The storage space is almost full. Would you like to save the image at a lower quality to save space?');
            if (!proceedWithLowerQuality) {
                alert('The image has not been saved.');
                uploadInput.value = ''; // Eingabefeld zurücksetzen
                return;
            }
        }
        const lowerQualityImageUrl = canvas.toDataURL('image/jpeg', 0.5); // Stärker komprimieren
        compressedImageUrl = lowerQualityImageUrl;
    }

    return compressedImageUrl;
}