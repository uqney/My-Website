const uploadInput = document.getElementById('uploadImage');

uploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageUrl = e.target.result;
            const img = new Image();

            img.onload = function () {
                const width = img.width;
                const height = img.height;
                const aspectRatio = width / height;

                console.log('Width:', width, 'Height:', height, 'Aspect Ratio:', aspectRatio);

                const timeStamp = new Date().toLocaleDateString();

                // Hotspots definieren
                const hotspots = [
                    {
                        "pitch": 10,
                        "yaw": 20,
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

                // Speichern des Bildes und der Hotspots im localStorage
                const panoramaData = {
                    imageUrl: imageUrl,
                    hotSpots: hotspots,
                    width: width,
                    height: height,
                    timeStamp: timeStamp
                };
                let panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
                panoramas.push(panoramaData);
                localStorage.setItem('uploadedPanoramas', JSON.stringify(panoramas));
            };

            img.src = imageUrl;
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

