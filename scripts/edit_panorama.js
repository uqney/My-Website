const overlay = document.getElementById('edit-overlay');
const cancelButton = document.getElementById('cancel-edit');
const saveButton = document.getElementById('save-edit');
const addHotpotButton = document.getElementById('add-hotspot');

const formOverlay = document.getElementById('hotspot-form-overlay');
const typeSelect = document.getElementById('hotspot-type');
const textInput = document.getElementById('hotspot-text');
const targetLabel = document.getElementById('hotspot-target-label');
const targetInput = document.getElementById('hotspot-target');
const formSaveButton = document.getElementById('hotspot-add');
const formCancelButton = document.getElementById('hotspot-cancel');

let currentHotSpots;
let viewer;
let panorama;
let pendingHotSpot;

function initalizeOverlay(currentPanorama) {
    overlay.classList.add('visible');
    setPanorama(currentPanorama);
    setViewer();
}

function hideOverlay() {
    overlay.classList.remove('visible');
}

function handleSave(panorama, currentHotSpots) {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];

    const panoramaIndex = panoramas.findIndex(p => p.imageUrl === panorama.imageUrl);

    if (panoramaIndex !== -1) {
        panoramas[panoramaIndex].hotSpots = currentHotSpots;
        localStorage.setItem('uploadedPanoramas', JSON.stringify(panoramas));
        alert('Hotspots saved successfully!');
    } else {
        alert('Panorama not found!');
    }

    hideOverlay();
}

function handleAddHotspot(viewer) {
    const container = viewer.getContainer();

    // Definiere den Listener
    const handleClick = (event) => {
        const coords = viewer.mouseEventToCoords(event);

        pendingHotSpot = {
            pitch: coords[0],
            yaw: coords[1],
            type: 'info',
            text: 'New Hotspot'
        };

        showHotspotForm(pendingHotSpot);

        // Entferne den Listener nach dem Hinzufügen
        container.removeEventListener('click', handleClick);
    };
    // Füge den neuen Listener hinzu
    container.addEventListener('click', handleClick);
}

function showHotspotForm(hotspot) {
    formOverlay.classList.add('visible');

    typeSelect.value = hotspot.type;
    textInput.value = hotspot.text;
    targetInput.value = '';

    typeSelect.addEventListener('change', () => {
        const type = typeSelect.value;
        if (type === "scene" || type === "link") {
            targetLabel.style.display = 'block';
            targetInput.style.display = 'block';
        } else {
            targetLabel.style.display = 'none';
            targetInput.style.display = 'none';
        }
    });

    formSaveButton.addEventListener('click', () => {
        hotspot.type = typeSelect.value;
        hotspot.text = textInput.value;
        if (hotspot.type === "scene") {
            hotspot.sceneId = targetInput.value;
        } else if (hotspot.type === "link") {
            hotspot.url = targetInput.value;
        }

        viewer.addHotSpot(hotspot);

        alert("Hotspot added!");
        hideHotspotForm();
    });

    formCancelButton.addEventListener('click', hideHotspotForm);
}

function hideHotspotForm() {
    formOverlay.classList.remove('visible');
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

    currentHotSpots.forEach(hotspot => {
        addDeleteButtonToHotspot(hotspot);
    });
}

function getCurrentPanorama() {
    return panorama;
}

function getCurrentViewer() {
    return viewer;
}

document.addEventListener('DOMContentLoaded', () => {
    cancelButton.addEventListener('click', hideOverlay);

    saveButton.addEventListener('click', () => {
        const panorama = getCurrentPanorama(); // Schreibe eine Funktion, die das aktuelle Panorama zurückgibt
        handleSave(panorama, currentHotSpots);
    });

    addHotpotButton.addEventListener('click', () => {
        const viewer = getCurrentViewer(); // Schreibe eine Funktion, die den aktuellen Viewer zurückgibt
        handleAddHotspot(viewer);
    });
});