function updatePanoramaListStatus() {
    const panoramaList = document.getElementById("panorama-list");
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];

    if (panoramas.length == 0) {
        panoramaList.classList.add("empty");
        panoramaList.innerHTML = "<p>No panoramas available.</p>";
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

        const rootElement = clone.querySelector('.panorama-element');

        const image = rootElement.querySelector('.panorama-image');
        image.src = panorama.imageUrl;
        image.alt = `Panorama ${index + 1}`;

        const heading = rootElement.querySelector('.panorama-title');
        const title = panorama.title;
        heading.textContent = title;
        heading.title = title; // Tooltip mit vollem Titel

        const dimensions = rootElement.querySelector('.panorama-dimensions');
        dimensions.textContent = `${panorama.width}px × ${panorama.height}px`;

        const uploadInfo = rootElement.querySelector('.panorama-upload-info');
        uploadInfo.textContent = `Uploaded on: ${panorama.timeStamp}`;

        // Aktives Panorama hervorheben
        if (panorama.isActive) {
            rootElement.classList.add("active");
        }

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
    if (confirm("Do you really want to remove this panorama?")) {
        const title = panoramaElement.querySelector(".panorama-title").textContent;
        removeDataFromLocalStorage(title);
        panoramaElement.remove();
        updatePanoramaListStatus();
        alert(`${title} has been removed successfully.`);
    }
}

function handleActivate(panoramaElement) {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
    const title = panoramaElement.querySelector(".panorama-title").textContent;

    // Finde das Panorama und markiere es als aktiv
    panoramas.forEach(panorama => {
        panorama.isActive = (panorama.title === title);
    });

    // Speichere die aktualisierte Liste im Local Storage
    localStorage.setItem('uploadedPanoramas', JSON.stringify(panoramas));

    // Visuelles Feedback im Dashboard
    const allElements = document.querySelectorAll(".panorama-element");
    allElements.forEach(element => element.classList.remove("active"));
    panoramaElement.classList.add("active");

    alert(`${title} wurde als aktives Panorama gesetzt!`);
}

document.addEventListener("DOMContentLoaded", () => {
    displayPanoramas();
    addEventListenersToButtons();
});
