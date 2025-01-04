function displayPanoramas() {
    const panoramaList = document.getElementById("panorama-list");
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
    panoramas.forEach((panorama, index) => {
        const panoramaCard = document.createElement('div');
        panoramaCard.classList.add('panorama-element');

        const panoramaSrc = panorama.imageUrl;
        const panoramaWidth = panorama.width;
        const panoramaHeight = panorama.height;
        const timeStamp = panorama.timeStamp;

        const image = document.createElement('img');
        image.src = panoramaSrc;
        image.alt = `Panorama ${index + 1}`;
        image.classList.add('panorama-image'); // CSS-Klasse anwenden

        const heading = document.createElement('h3');
        heading.textContent = `Panorama ${index + 1}`;

        const dimensions = document.createElement('p');
        dimensions.textContent = `${panoramaWidth}px × ${panoramaHeight}px`;

        const uploadInfo = document.createElement('p');
        uploadInfo.textContent = `Uploaded at: ${timeStamp}`;

        panoramaCard.appendChild(heading);
        panoramaCard.appendChild(image);
        panoramaCard.appendChild(dimensions);
        panoramaCard.appendChild(uploadInfo);

        panoramaList.appendChild(panoramaCard);
    });
}

document.addEventListener("DOMContentLoaded", displayPanoramas);

window.addEventListener("storage", function (event) {
    if (event.key === "uploadedImages") {
        displayPanoramas();
    }
});
