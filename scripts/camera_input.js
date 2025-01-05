// Camera activation logic
const activateCameraButton = document.getElementById('activate-camera');
const closeCameraButton = document.getElementById('close-camera');
const cameraContainer = document.querySelector('.camera-container');
const captureButton = document.getElementById('capture-button');
const captureCanvas = document.getElementById('capture-canvas');

// Initially hide the camera container
cameraContainer.style.display = 'none';

activateCameraButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 3840 } }, height: { ideal: 2160 } })
        .then((stream) => {
            cameraContainer.style.display = 'block'; // Show the camera container
            const video = document.getElementById('camera-preview');
            video.srcObject = stream;
        })
        .catch((error) => {
            console.error('Error accessing the camera:', error);
            alert('Unable to access the camera. Please check your permissions.');
        });
});

// Capture image logic
captureButton.addEventListener('click', () => {
    const video = document.getElementById('camera-preview');
    uploadFromCamera(video, captureCanvas);
});

closeCameraButton.addEventListener('click', () => {
    cameraContainer.style.display = 'none';
});
