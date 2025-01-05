function addDataToLocalStorage(data) {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
    panoramas.push(data);
    localStorage.setItem('uploadedPanoramas', JSON.stringify(panoramas));
}

function removeDataFromLocalStorage(title) {
    var panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
    var updatedPanoramas = [];
    panoramas.forEach(panorama => {
        if (panorama.title != title) {
            updatedPanoramas.push(panorama);
        }
    })

    // Aktualisiere den Local Storage
    localStorage.setItem('uploadedPanoramas', JSON.stringify(updatedPanoramas));
}

function optimizeLocalStorageSpace() {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
    panoramas.forEach(panorama => {
        const tempImage = new Image();
        tempImage.src = panorama.imageUrl;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = tempImage.width;
        canvas.height = tempImage.height;
        context.drawImage(tempImage, 0, 0, canvas.width, canvas.height);
        panorama.imageUrl = canvas.toDataURL('image/jpeg', 0.5);
    });
    localStorage.setItem('uploadedPanoramas', JSON.stringify(panoramas));
    console.log("image deletet");
}
