const uploadInput = document.getElementById('upload-image');

uploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const fileName = file.name;
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));

    uploadFromFile(file, baseName, uploadInput);
});