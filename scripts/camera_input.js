// Camera activation logic
const activateCameraButton = document.getElementById('activate-camera'); // Get the button to activate the camera
const closeCameraButton = document.getElementById('close-camera'); // Get the button to close the camera
const cameraContainer = document.querySelector('.camera-container'); // Get the container for the camera preview
const captureButton = document.getElementById('capture-button'); // Get the button to capture the image
const captureCanvas = document.getElementById('capture-canvas'); // Get the canvas to display the captured image
const cameraInput = document.getElementById('camera-input'); // Get the input field to upload images

// Initially hide the camera container
cameraContainer.style.display = 'none'; // Hide the camera container on page load

/**
 * Handles the activation of the camera.
 * Requests access to the user's camera and starts the video stream if permission is granted.
 * If an error occurs (e.g., permission denied), an alert is shown.
 */
activateCameraButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 3840 }, height: { ideal: 2160 } }
    })
        .then((stream) => {
            // If access is granted, display the camera container and start the video stream
            cameraContainer.style.display = 'block'; // Show the camera container
            const video = document.getElementById('camera-preview'); // Get the video element for live preview
            video.srcObject = stream; // Set the video source to the camera stream
        })
        .catch((error) => {
            // If an error occurs (e.g., permission denied), log the error and show an alert
            console.error('Error accessing the camera:', error);
            alert('Unable to access the camera. Please check your permissions.');
        });
});

/**
 * Handles the change event when a file is selected from the file input.
 * Extracts the file name without extension and uploads the file using the uploadFromFile function.
 * 
 * @param {Event} event - The event triggered by the file input change.
 */
cameraInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // Get the selected file
    const fileName = file.name; // Get the file name
    const baseName = fileName.substring(0, fileName.lastIndexOf('.')); // Get the file name without extension
    uploadFromFile(file, baseName, uploadInput); // Call function to upload the file
});

/**
 * Handles the capture of an image from the camera preview.
 * Captures the current frame from the video stream and uploads it to the server.
 */
captureButton.addEventListener('click', () => {
    const video = document.getElementById('camera-preview'); // Get the video element for capturing the image
    uploadFromCamera(video, captureCanvas); // Call function to capture the image from the video and upload it
});

/**
 * Closes the camera container and stops the video stream.
 * Hides the camera container when the close button is clicked.
 */
closeCameraButton.addEventListener('click', () => {
    cameraContainer.style.display = 'none'; // Hide the camera container when the button is clicked
});