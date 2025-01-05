// Camera activation logic
const activateCameraButton = document.getElementById('activate-camera');
const closeCameraButton = document.getElementById('close-camera');
const cameraContainer = document.querySelector('.camera-container');
const captureButton = document.getElementById('capture-button');
const captureCanvas = document.getElementById('capture-canvas');

// Initially hide the camera container
cameraContainer.style.display = 'none';

activateCameraButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
            cameraContainer.style.display = 'block'; // Show the camera container
            const cameraPreview = document.getElementById('camera-preview');
            cameraPreview.srcObject = stream;
        })
        .catch((error) => {
            console.error('Error accessing the camera:', error);
            alert('Unable to access the camera. Please check your permissions.');
        });
});

// Capture image logic
captureButton.addEventListener('click', () => {
    const cameraPreview = document.getElementById('camera-preview');
    const context = captureCanvas.getContext('2d');
    captureCanvas.width = cameraPreview.videoWidth;
    captureCanvas.height = cameraPreview.videoHeight;
    context.drawImage(cameraPreview, 0, 0, captureCanvas.width, captureCanvas.height);

    const imageData = captureCanvas.toDataURL('image/png');
    const img = document.createElement('img');
    img.src = imageData;
    img.alt = 'Captured Panorama';
    img.width = captureCanvas.width;
    img.height = captureCanvas.height;
    img.style.maxWidth = '100%';

    // Save image to Local Storage
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
    const panoramaData = {
        imageUrl: imageData,
        width: img.width,
        height: img.height,
        timeStamp: new Date().toLocaleString()
    };
    panoramas.push(panoramaData);
    localStorage.setItem('uploadedPanoramas', JSON.stringify(panoramas));

    alert('Bild wurde erfolgreich gespeichert!');
});

closeCameraButton.addEventListener('click', () => {
    cameraContainer.style.display = 'none';
});
