/**
 * Optimizes local storage space by compressing the panorama images stored in localStorage.
 * The image URLs are converted to base64 encoded DataURLs with reduced quality to save space.
 */
function optimizeLocalStorageSpace() {
    const panoramas = JSON.parse(localStorage.getItem('uploadedPanoramas')) || [];

    // Iterate through all panoramas
    panoramas.forEach(panorama => {
        const tempImage = new Image();

        // Wait until the image is fully loaded
        tempImage.onload = () => {
            // Create a canvas and draw the image onto it
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = tempImage.width;
            canvas.height = tempImage.height;

            // Draw the image onto the canvas
            context.drawImage(tempImage, 0, 0, canvas.width, canvas.height);

            // Compress and convert the image to DataURL (JPEG format with 50% quality)
            panorama.imageUrl = canvas.toDataURL('image/jpeg', 0.5);

            // Save the updated panoramas back to localStorage
            localStorage.setItem('uploadedPanoramas', JSON.stringify(panoramas));
        };

        // Set the image source to trigger the loading process
        tempImage.src = panorama.imageUrl;
    });
}
