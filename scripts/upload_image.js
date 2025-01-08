// Reference to the file upload input element
const uploadInput = document.getElementById('upload-image');

// Event listener for the file input change event
uploadInput.addEventListener('change', function (event) {
    // Extract the selected file from the event
    const file = event.target.files[0];

    // Extract the base name of the file (without the extension)
    const fileName = file.name;
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));

    // Call the function to upload the file
    uploadFromFile(file, baseName, uploadInput);
});
