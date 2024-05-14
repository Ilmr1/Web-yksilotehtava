'use strict'

document.addEventListener('DOMContentLoaded', (event) => {
    var map = L.map('mapContainer').setView([60.24, 25], 11);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let restaurants = [];
    let selectedMarker = null;

    let cityFilter = document.getElementById('cityFilter');
    let companyFilter = document.getElementById('companyFilter');
    let filterButton = document.getElementById('filterButton');

    let searchButton = document.getElementById("searchButton");
    let selectedRestaurant = null;

    function filterRestaurants(input) {
        let lowerCaseInput = input.toLowerCase();
        return restaurants.filter(restaurant => restaurant.name.toLowerCase().startsWith(lowerCaseInput));
    }

    searchButton.addEventListener('click', function() {
        document.getElementById('searchDialog').style.display = 'block';
        document.getElementById('searchField').value = ''; // Clear the search field

        // Remove all suggestions
        let oldSuggestions = document.querySelectorAll('.suggestion');
        oldSuggestions.forEach(suggestion => suggestion.remove());
    });

    document.getElementById('searchField').addEventListener('input', function() {
        let oldSuggestions = document.querySelectorAll('.suggestion');
        oldSuggestions.forEach(suggestion => suggestion.remove());

        let input = document.getElementById('searchField').value;

        if (input.length > 0) {
            let suggestions = filterRestaurants(input);

            suggestions.forEach(suggestion => {
                let suggestionElement = document.createElement('div');
                suggestionElement.textContent = suggestion.name;
                suggestionElement.classList.add('suggestion');

                suggestionElement.addEventListener('click', function() {
                    document.getElementById('searchField').value = suggestion.name;
                    selectedRestaurant = suggestion;
                });
                document.getElementById('searchDialog').appendChild(suggestionElement);
            });
        }
    });

    let exitButton = document.createElement('button');
    exitButton.textContent = 'X';
    exitButton.id = 'exitButton'; // Assign an id to the exit button
    exitButton.addEventListener('click', function() {
        document.getElementById('searchDialog').style.display = 'none';
    });
    document.getElementById('searchDialog').appendChild(exitButton);

    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();

        if (selectedRestaurant) {
            map.setView([selectedRestaurant.location.coordinates[1], selectedRestaurant.location.coordinates[0]], 13);
            displayRestaurantDetails(selectedRestaurant);
            document.getElementById('searchDialog').style.display = 'none';
        }
    });

    async function getRestaurants() {
        try {
            const response = await fetch("https://10.120.32.94/restaurant/api/v1/restaurants");
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            } else {
                const data = await response.json();
                console.log(data);
                data.forEach((restaurant) => {
                    restaurants.push(restaurant);
                    let lat = restaurant.location.coordinates[1];
                    let lng = restaurant.location.coordinates[0];
                    let marker = L.marker([lat, lng]).addTo(map).bindPopup(`
                        <h3>${restaurant.name}</h3>
                        <p>${restaurant.address}</p>
                        <p>Company: ${restaurant.company}</p>
                        <p>City: ${restaurant.city}</p>
                    `);

                    marker.on('click', function() {
                        displayRestaurantDetails(restaurant);
                    });
                });

                let cities = [...new Set(restaurants.map(restaurant => restaurant.city))];
                let companies = [...new Set(restaurants.map(restaurant => restaurant.company))];

                cities.forEach(city => {
                    let option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    cityFilter.appendChild(option);
                });

                companies.forEach(company => {
                    let option = document.createElement('option');
                    option.value = company;
                    option.textContent = company;
                    companyFilter.appendChild(option);
                });
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    filterButton.addEventListener('click', function() {
        let city = cityFilter.value.toLowerCase();
        let company = companyFilter.value.toLowerCase();

        let filteredRestaurants = restaurants.filter(restaurant =>
            (!city || restaurant.city.toLowerCase() === city) &&
            (!company || restaurant.company.toLowerCase() === company)
        );

        updateMapMarkers(filteredRestaurants);
    });

    function updateMapMarkers(filteredRestaurants) {
        // Remove all markers from the map
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        filteredRestaurants.forEach(restaurant => {
            let lat = restaurant.location.coordinates[1];
            let lng = restaurant.location.coordinates[0];
            let marker = L.marker([lat, lng]).addTo(map).bindPopup(`
                <h3>${restaurant.name}</h3>
                <p>${restaurant.address}</p>
                <p>Company: ${restaurant.company}</p>
                <p>City: ${restaurant.city}</p>
            `);

            marker.on('click', function() {
                displayRestaurantDetails(restaurant);
            });
        });
    }

    function displayRestaurantDetails(restaurant) {
        let restaurantInfoContainer = document.getElementById('restaurantInfoContainer');
        restaurantInfoContainer.innerHTML = `
        <h2 id="restaurantName">${restaurant.name}</h2>
        <button id="favoriteButton">Favorite</button>
        <p id="restaurantAddress">${restaurant.address}</p>
        <p id="restaurantPhonenumber">Puh: ${restaurant.phone}</p>
        <div id="menuButtons">
            <button id="dailyMenuButton">Today's Menu</button>
            <button id="weeklyMenuButton">Weekly Menu</button>
        </div>
        <div id="menuBox">
        </div>
    `;

        document.getElementById("dailyMenuButton").addEventListener('click', async function() {
            const menu = await getDailyMenu(restaurant._id, 'fi');
            let menuBox = document.getElementById('menuBox');
            menuBox.innerHTML = '<h3>Todays Menu</h3>';
            menu.courses.forEach(course => {
                menuBox.innerHTML += `<p>${course.name} - ${course.price} - ${course.diets}</p>`;
            });
        });

        document.getElementById("weeklyMenuButton").addEventListener('click', async function() {
            const menu = await getWeeklyMenu(restaurant._id, 'fi');
            let menuBox = document.getElementById('menuBox');
            menuBox.innerHTML = '<h3>Weekly Menu</h3>';
            menu.days.forEach(day => {
                menuBox.innerHTML += `<h4>${day.date}</h4>`;
                day.courses.forEach(course => {
                    menuBox.innerHTML += `<p>${course.name} - ${course.price} - ${course.diets}</p>`;
                });
            });
        });

        let lat = restaurant.location.coordinates[1];
        let lng = restaurant.location.coordinates[0];
        if (selectedMarker) {
            map.removeLayer(selectedMarker);
        }
        selectedMarker = L.marker([lat, lng]).addTo(map).bindPopup(`<h3>${restaurant.name}</h3>
            <p>${restaurant.address}</p>
            <p>Company: ${restaurant.company}</p>
            <p>City: ${restaurant.city}</p>
        `);
        selectedMarker.openPopup();
        map.setView([lat, lng], 13);

        let favoriteButton = document.getElementById('favoriteButton');
        favoriteButton.addEventListener('click', function() {
            let userData = JSON.parse(sessionStorage.getItem('data'));
            if (!userData.favoriteRestaurants) {
                userData.favoriteRestaurants = [];
            }
            // Check if the restaurant is already in the favorites list
            if (!userData.favoriteRestaurants.some(fav => fav._id === restaurant._id)) {
                userData.favoriteRestaurants.push(restaurant);
                sessionStorage.setItem('data', JSON.stringify(userData));
            }
        });
    }

    async function getDailyMenu(id, language){
        try{
            const response = await fetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/${language}`);
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            const menu = await response.json();
            console.log(menu);
            return menu;
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    async function getWeeklyMenu(id, language){
        try{
            const response = await fetch(`https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/${language}`);
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            const menu = await response.json();
            console.log(menu);
            return menu;
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    getRestaurants();
});