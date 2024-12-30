// scripts/main.js

// Standort abrufen
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log(`Standort: ${lat}, ${lon}`);
                // fetchEvents(lat, lon);
                initMap(lat, lon);
            },
            () => {
                alert("Standort konnte nicht ermittelt werden.");
            }
        );
    } else {
        alert("Geolocation wird von deinem Browser nicht unterstützt.");
    }
}

// Map initialisieren
// scripts/main.js

// Initialisiere die Karte
function initMap(lat, lon) {
    // Erstellt eine Karte und zentriert sie auf die Geolocation
    const map = L.map('map').setView([lat, lon], 13);

    // OpenStreetMap-Tiles laden
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Marker für den aktuellen Standort hinzufügen
    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup("You are here!").openPopup();
}


getUserLocation();
