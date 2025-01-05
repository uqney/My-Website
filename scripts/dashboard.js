function updatePanoramaListStatus() {
    const panoramaList = document.getElementById("panorama-list");
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];

    if (panoramas.length === 0) {
        panoramaList.classList.add("empty");
        panoramaList.innerHTML = "<p>Keine Panoramen vorhanden.</p>";
    } else {
        panoramaList.classList.remove("empty");
    }
}

function displayPanoramas() {
    updatePanoramaListStatus();

    const panoramaList = document.getElementById("panorama-list");
    const panoramaTemplate = document.getElementById("panorama-template");
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];

    panoramas.forEach((panorama, index) => {
        const clone = panoramaTemplate.content.cloneNode(true);

        const image = clone.querySelector('.panorama-image');
        image.src = panorama.imageUrl;
        image.alt = `Panorama ${index + 1}`;

        const heading = clone.querySelector('.panorama-title');
        heading.textContent = `Panorama ${index + 1}`;

        const dimensions = clone.querySelector('.panorama-dimensions');
        dimensions.textContent = `${panorama.width}px × ${panorama.height}px`;

        const uploadInfo = clone.querySelector('.panorama-upload-info');
        uploadInfo.textContent = `Uploaded at: ${panorama.timeStamp}`;

        panoramaList.appendChild(clone);
    });
}

function addEventListenersToButtons() {
    const panoramaList = document.getElementById("panorama-list");

    panoramaList.addEventListener("click", (event) => {
        const target = event.target;
        const panoramaElement = target.closest(".panorama-element");

        if (target.classList.contains("edit-button")) {
            handleEdit(panoramaElement);
        } else if (target.classList.contains("delete-button")) {
            handleDelete(panoramaElement);
        } else if (target.classList.contains("activate-button")) {
            handleActivate(panoramaElement);
        }
    });
}

function handleEdit(panoramaElement) {
    const title = panoramaElement.querySelector(".panorama-title").textContent;
    alert(`Bearbeiten von ${title}`);
    // TODO: Hier kannst du das Bearbeiten-Feature implementieren
}

function handleDelete(panoramaElement) {
    if (confirm("Möchtest du dieses Panorama wirklich löschen?")) {
        const title = panoramaElement.querySelector(".panorama-title").textContent;
        removeDataFromLocalStorage(title);
        panoramaElement.remove();
        updatePanoramaListStatus();
        alert(`${title} wurde erfolgreich gelöscht.`);
    }
}

function handleActivate(panoramaElement) {
    const title = panoramaElement.querySelector(".panorama-title").textContent;
    alert(`${title} wurde als aktives Panorama gesetzt!`);
    // TODO: Hier kannst du das Aktivieren-Feature implementieren
}

document.addEventListener("DOMContentLoaded", () => {
    displayPanoramas();
    addEventListenersToButtons();
});
