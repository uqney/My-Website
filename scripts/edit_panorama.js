const overlay = document.getElementById('edit-overlay');
const closeButton = document.getElementById('close-edit');
const saveButton = document.getElementById('save-edit');
const addHotpotButton = document.getElementById('add-hotspot');

let currentHotSpots;
let viewer;
let panorama;

function initalizeOverlay(currentPanorama) {
    overlay.classList.add('visible');
    setPanorama(currentPanorama);
    setViewer();
}

function handleClose() {
    overlay.classList.remove('visible');
}

function handleSave(panorama, currentHotSpots) {
    const panoramas = JSON.parse(localStorage.getItem("uploadedPanoramas")) || [];
    const panoramaIndex = panoramas.findIndex(p => p.imageUrl === panorama.imageUrl);

    if (panoramaIndex !== -1) {
        panoramas[panoramaIndex].hotSpots = currentHotSpots;
        localStorage.setItem("uploadedPanoramas", JSON.stringify(panoramas));
        alert("Hotspots erfolgreich gespeichert!");
    } else {
        alert("Panorama nicht gefunden!");
    }

    console.log(panoramas);
}

function handleAddHotspot(viewer) {
    const container = viewer.getContainer();

    // Definiere den Listener
    const handleClick = (event) => {
        const coords = viewer.mouseEventToCoords(event);

        const pitch = coords[0];
        const yaw = coords[1];

        const newHotSpot = {
            pitch: pitch,
            yaw: yaw,
            type: "info",
            text: "Neuer Hotspot"
        };

        viewer.addHotSpot(newHotSpot);

        alert(`Hotspot hinzugefügt bei Pitch: ${pitch.toFixed(2)}, Yaw: ${yaw.toFixed(2)}`);

        // Entferne den Listener nach dem Hinzufügen
        container.removeEventListener("click", handleClick);
    };
    // Füge den neuen Listener hinzu
    container.addEventListener("click", handleClick);
}

function setPanorama(currentPanorama) {
    panorama = currentPanorama;
    currentHotSpots = currentPanorama.hotSpots || [];
}

function setViewer() {
    viewer = pannellum.viewer('panorama-viewer', {
        'type': 'equirectangular',
        'panorama': panorama.imageUrl,
        'autoLoad': true,
        'hotSpots': currentHotSpots
    });
}

function getCurrentPanorama() {
    return panorama;
}

function getCurrentViewer() {
    return viewer;
}

document.addEventListener('DOMContentLoaded', () => {
    closeButton.addEventListener('click', handleClose);

    saveButton.addEventListener('click', () => {
        const panorama = getCurrentPanorama(); // Schreibe eine Funktion, die das aktuelle Panorama zurückgibt
        handleSave(panorama, currentHotSpots);
    });

    addHotpotButton.addEventListener('click', () => {
        const viewer = getCurrentViewer(); // Schreibe eine Funktion, die den aktuellen Viewer zurückgibt
        handleAddHotspot(viewer);
    });
});