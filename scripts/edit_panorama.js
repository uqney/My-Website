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
        alert('Changes saved successfully!');
    } else {
        alert('Panorama not found!');
    }

    hideOverlay();
}

function handleCancel() {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
    hideOverlay();
}

function handleAddHotspot(viewer) {
    const container = viewer.getContainer();

    // Definiere den Listener
    const handleClick = (event) => {
        const coords = viewer.mouseEventToCoords(event);

        const pitch = coords[0];
        const yaw = coords[1];

        pendingHotSpot = {
            pitch: pitch,
            yaw: yaw,
            type: 'info',
            createTooltipFunc: hotspotTooltip,
            createTooltipArgs: {
                text: 'New Hotspot',
                pitch: pitch,
                yaw: yaw,
                type: 'info'
            }
        };

        showHotspotForm(pendingHotSpot);

        // Entferne den Listener nach dem Hinzufügen
        container.removeEventListener('click', handleClick);
    };
    // Füge den neuen Listener hinzu
    container.addEventListener('click', handleClick);
}

function hotspotTooltip(hotSpotDiv, args) {
    hotSpotDiv.classList.add('custom-tooltip'); // Stil hinzufügen
    hotSpotDiv.setAttribute('data-pitch', args.pitch);
    hotSpotDiv.setAttribute('data-yaw', args.yaw);
    var span = document.createElement('span'); // Tooltip-Inhalt hinzufügen
    span.innerHTML = args.text;
    hotSpotDiv.appendChild(span); // Tooltip dem Div hinzufügen

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="material-icons">edit</i>';
    hotSpotDiv.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="material-icons">delete</i>';
    hotSpotDiv.appendChild(deleteButton);

    // Positionierung anpassen
    span.style.width = span.scrollWidth - 20 + 'px';
    span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 + 'px';
    span.style.marginTop = -span.scrollHeight - 12 + 'px';

    editButton.style.width = editButton.scrollWidth - 20 + 'px';
    editButton.style.marginLeft = (editButton.scrollWidth - 90 - hotSpotDiv.offsetWidth) / 2 + 'px';
    editButton.style.marginTop = editButton.scrollHeight - 10 + 'px';

    deleteButton.style.width = deleteButton.scrollWidth - 20 + 'px';
    deleteButton.style.marginLeft = (deleteButton.scrollWidth + 20 - hotSpotDiv.offsetWidth) / 2 + 'px';
    deleteButton.style.marginTop = deleteButton.scrollHeight - 10 + 'px';

    editButton.addEventListener('click', (event) => {
        event.stopPropagation();
        editHotspot(args);
    });

    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (confirm('Do you really want to delete this hotspot?')) {
            deleteHotspot(args);
        }
    });
}

function editHotspot(args) {

    const hotspot = {
        pitch: args.pitch,
        yaw: args.yaw,
        type: args.type,
        createTooltipArgs: args
    }
    showHotspotForm(hotspot);
}

function deleteHotspot(args) {
    const index = currentHotSpots.findIndex(h =>
        h.pitch === args.pitch && h.yaw === args.yaw
    );
    if (index !== -1) {
        currentHotSpots.splice(index, 1);
        viewer.removeHotSpot(currentHotSpots[index]);

        const hotspotDiv = document.querySelector(`[data-pitch="${args.pitch}"][data-yaw="${args.yaw}"]`);
        if (hotspotDiv) {
            hotspotDiv.remove();
        }

        alert(`Hotspot deleted.`);
    }
}

function showHotspotForm(hotspot) {
    formOverlay.classList.add('visible');
    typeSelect.value = hotspot.type;
    textInput.value = hotspot.createTooltipArgs.text;
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
        hotspot.createTooltipArgs.text = textInput.value;
        if (hotspot.type === "scene") {
            hotspot.sceneId = targetInput.value;
        } else if (hotspot.type === "link") {
            hotspot.url = targetInput.value;
        }

        viewer.addHotSpot(hotspot);

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
    if (viewer) {
        viewer.destroy();
    }

    currentHotSpots.forEach(hotspot => {
        hotspot.createTooltipFunc = hotspotTooltip; // Funktion neu zuweisen
    });

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