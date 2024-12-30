// scripts/api.js

// Eventbrite API: Events abrufen
function fetchEvents(lat, lon) {
    const apiKey = 'DEIN_API_KEY'; // Eventbrite API Key
    const radius = 10; // Radius in Kilometern
    const url = `https://www.eventbriteapi.com/v3/events/search/?location.latitude=${lat}&location.longitude=${lon}&location.within=${radius}km&token=${apiKey}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            displayEvents(data.events);
        })
        .catch((error) => console.error('Fehler beim Abrufen der Events:', error));
}

// Events anzeigen
function displayEvents(events) {
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = ''; // Vorherige Events löschen

    events.forEach((event) => {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');

        eventCard.innerHTML = `
            <h3>${event.name.text}</h3>
            <p>${event.start.local}</p>
            <a href="${event.url}" target="_blank">Mehr erfahren</a>
        `;
        eventList.appendChild(eventCard);
    });
}
