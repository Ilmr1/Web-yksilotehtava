// Initialize the Leaflet map
var map = L.map('map-container').setView([60.17, 24.94], 13); // Set center coordinates and zoom level for Helsinki

// Add a base map layer (replace with your preferred tile provider URL)
L.tileLayer('https
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();