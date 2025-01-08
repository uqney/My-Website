/**
 * Function: Handles the upload of an image.
 * This function allows uploading either from a file or a camera capture and saves the panorama data in localStorage.
 * 
 * @param {String} imageUrl - The URL of the image (Base64 or file path).
 * @param {Object} additionalData - Additional data related to the image (e.g., width, height, timestamp).
 */
function handleImageUpload(imageUrl, additionalData) {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];

    // Deactivate all other panoramas before adding the new one
    panoramas.forEach(panorama => panorama.isActive = false);

    // Add the new panorama
    const newPanorama = { imageUrl, isActive: true, ...additionalData };
    panoramas.push(newPanorama);
    localStorage.setItem('uploadedPanoramas', JSON.stringify(panoramas));

    viewPanorama(imageUrl, additionalData.hotSpots);
}


/**
 * Function: Processes an image captured from the camera.
 * Captures the image from a video element, compresses it, and then uploads it as a panorama.
 * 
 * @param {HTMLVideoElement} video - The video element showing the camera feed.
 * @param {HTMLCanvasElement} captureCanvas - The canvas element to capture the image.
 */
function uploadFromCamera(video, captureCanvas) {
    const context = captureCanvas.getContext('2d');
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);

    if (isAspectRatioTooSmall((captureCanvas.width / captureCanvas.height), 'camera')) {
        return;
    }

    const compressedImageUrl = getCompressedImageUrl(captureCanvas);
    const timeStamp = new Date().toLocaleString();

    const additionalData = {
        imageUrl: compressedImageUrl,
        title: `Panorama captured on ${timeStamp}`,
        width: captureCanvas.width,
        height: captureCanvas.height,
        hotSpots: [],
        timeStamp: timeStamp
    };

    handleImageUpload(compressedImageUrl, additionalData);
}


/**
 * Function: Processes an image uploaded from a file.
 * Reads the image from the file input, compresses it, and uploads it as a panorama.
 * 
 * @param {File} file - The uploaded file.
 * @param {String} baseName - The name to assign to the uploaded panorama.
 * @param {HTMLInputElement} uploadInput - The file input element.
 */
function uploadFromFile(file, baseName, uploadInput) {
    if (file) {
        // Check if the file is a supported image format
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('The uploaded file is not a supported image format. Allowed are: JPEG, PNG, WEBP.');
            uploadInput.value = ''; // Reset input field
            return;
        }

        // Check if the image has already been uploaded
        const isDuplicate = checkDuplicateImage(baseName);
        if (isDuplicate) {
            alert('This image has already been uploaded.');
            uploadInput.value = ''; // Reset input field
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            const imageUrl = e.target.result;
            const img = new Image();

            img.onload = function () {
                const width = img.width;
                const height = img.height;
                const aspectRatio = width / height;

                if (isAspectRatioTooSmall(aspectRatio, 'file')) {
                    uploadInput.value = ''; // Reset input field
                    return;
                }

                // Compress the image
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                context.drawImage(img, 0, 0, width, height);

                const compressedImageUrl = getCompressedImageUrl(canvas);
                const timeStamp = new Date().toLocaleString();

                const additionalData = {
                    imageUrl: compressedImageUrl,
                    title: baseName,
                    width: width,
                    height: height,
                    hotSpots: [],
                    timeStamp: timeStamp,
                }

                handleImageUpload(compressedImageUrl, additionalData);
            };
            img.src = imageUrl;
        };
        reader.readAsDataURL(file);
    } else { uploadInput = '' }
}


/**
 * Function: Checks if an image is a duplicate by comparing its title.
 * 
 * @param {String} baseName - The title of the image to check against.
 * @returns {Boolean} - Returns true if the image is a duplicate, otherwise false.
 */
function checkDuplicateImage(baseName) {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];
    return panoramas.some(panorama => panorama.title === baseName);
}


/**
 * Function: Checks if the aspect ratio of an image is too small.
 * 
 * @param {Number} aspectRatio - The aspect ratio of the image.
 * @param {String} uploadSrc - The source of the image (either 'camera' or 'file').
 * @returns {Boolean} - Returns true if the aspect ratio is too small, otherwise false.
 */
function isAspectRatioTooSmall(aspectRatio, uploadSrc) {
    if (aspectRatio < 1) {
        if (uploadSrc == 'camera') {
            alert('The aspect ratio of the image is smaller than 1:1. It will be distorted in the display. Please take another one (maybe rotate your device).');
        } else if (uploadSrc == 'file') {
            alert('The aspect ratio of the image is smaller than 1:1. It will be distorted in the display. Please select another one.');
        }
        return true;
    } else if (aspectRatio < (16 / 9)) {
        const proceed = confirm('The aspect ratio of the image is smaller than 16:9. It could be distorted in the display. Would you still like to upload the image?');
        if (!proceed) {
            return true;
        }
    }
    return false;
}


/**
 * Function: Compresses an image and returns the compressed URL.
 * This function compresses the image to reduce its size and ensure it fits within localStorage limits.
 * 
 * @param {HTMLCanvasElement} canvas - The canvas element to compress.
 * @returns {String} - The compressed image URL (Base64 encoded).
 */
function getCompressedImageUrl(canvas) {
    let compressedImageUrl = canvas.toDataURL('image/jpeg', 0.8);

    // Check for storage space
    const imageSize = Math.ceil(compressedImageUrl.length / 1024); // Size in KB
    const maxStorage = 5120; // Example: 5 MB max Local Storage
    const currentStorage = JSON.stringify(localStorage).length / 1024;

    if ((currentStorage + imageSize) > maxStorage) {
        const proceedWithGlobalCompression = confirm('The storage space is almost full. Would you like to compress all saved images to create more space?');
        if (proceedWithGlobalCompression) {
            optimizeLocalStorageSpace();
            alert('All saved images have been compressed.');
        } else {
            const proceedWithLowerQuality = confirm('The storage space is almost full. Would you like to save the image at a lower quality to save space?');
            if (!proceedWithLowerQuality) {
                alert('The image has not been saved.');
                uploadInput.value = ''; // Reset input field
                return;
            }
        }
        const lowerQualityImageUrl = canvas.toDataURL('image/jpeg', 0.5); // Compress further
        compressedImageUrl = lowerQualityImageUrl;
    }

    return compressedImageUrl;
}
