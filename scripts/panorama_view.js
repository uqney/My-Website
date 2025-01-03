const uploadInput = document.getElementById('uploadImage');

uploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Dynamisch das Bild in den 360°-Viewer laden
            const imageUrl = e.target.result;
            const img = new Image();
            img.src = imageUrl;
            console.log('URL: ' + imageUrl);
            console.log('Width: ' + img.width);
            console.log('Height: ' + img.height);
            const aspectRatio = img.width / img.height;
            if (aspectRatio < (16 / 9)) {
                const userConfirmed = confirm('The picture you uploaded has an aspect ratio of ' + aspectRatio + '. The ratio should be at least 16/9 to get the best experience. Do you want to upload it anyway?');
                if (userConfirmed) {
                    alert('Picture is being uploaded...');
                } else {
                    alert('Picture was not uploaded.')
                }
                return;
            }

            // Definiere Hotspots
            const hotspots = [
                {
                    "pitch": 10,  // Höhe des Hotspots
                    "yaw": 20,    // Richtung des Hotspots
                    "type": "info",
                    "text": "Dies ist ein Beispiel Hotspot!",
                    "clickHandlerFunc": function () {
                        alert('Hotspot angeklickt!');
                    }
                },
                {
                    "pitch": -10,
                    "yaw": -40,
                    "type": "info",
                    "text": "Noch ein Hotspot!",
                    "clickHandlerFunc": function () {
                        alert('Noch ein Hotspot!');
                    }
                }
            ];

            // Pannellum Viewer initialisieren
            pannellum.viewer('panorama', {
                "type": "equirectangular",
                "panorama": imageUrl,
                "autoLoad": true,
                "hotSpots": hotspots
            });

            const timeStamp = new Date().toLocaleDateString();

            // Speichern des Bildes und der Hotspots im localStorage
            const panoramaData = {
                imageUrl: imageUrl,
                hotSpots: hotspots,
                timeStamp: timeStamp
            };
            let panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
            panoramas.push(panoramaData);
            localStorage.setItem('uploadedPanoramas', JSON.stringify(panoramas));
        };
        reader.readAsDataURL(file);
    }
});

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

