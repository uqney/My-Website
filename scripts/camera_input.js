// Camera activation logic
const activateCameraButton = document.getElementById('activate-camera');
const closeCameraButton = document.getElementById('close-camera');
const cameraContainer = document.querySelector('.camera-container');
const captureButton = document.getElementById('capture-button');
const captureCanvas = document.getElementById('capture-canvas');
const cameraInput = document.getElementById('camera-input');

// Initially hide the camera container
cameraContainer.style.display = 'none';

activateCameraButton.addEventListener('click', () => {
    cameraInput.click();
});

cameraInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const fileName = file.name;
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    uploadFromFile(file, baseName, uploadInput);
})

// Capture image logic
captureButton.addEventListener('click', () => {
    const video = document.getElementById('camera-preview');
    uploadFromCamera(video, captureCanvas);
});

closeCameraButton.addEventListener('click', () => {
    cameraContainer.style.display = 'none';
});
