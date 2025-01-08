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
    if (isMobileDevice) {
        cameraInput.click();
        return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 3840 }, height: { ideal: 2160 } } })
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

function isMobileDevice() {
    return /Android|iPhone|iPad/i.test(navigator.userAgent);
}