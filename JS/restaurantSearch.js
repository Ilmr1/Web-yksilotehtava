loginButton.addEventListener('click', event => {
    dialog.innerHTML = " ";
    dialog.insertAdjacentHTML('beforeend', `
        <form id="loginForm">
            <button id="closeSearchButton" style="float: right;">X</button>
            <label for="username">Username:</label><br>
            <input type="text" id="username" name="username"><br>
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password"><br>
            <input type="submit" value="Submit">
        </form>
        `);
    dialog.showModal();
    document.getElementById("closeSearchButton").addEventListener('click', function(event) {
        event.preventDefault();
        dialog.close();
    });
});

registerButton.addEventListener('click', event => {
    dialog.innerHTML = " ";
    dialog.insertAdjacentHTML('beforeend', `
        <form id="loginForm">
            <button id="closeSearchButton" style="float: right;">X</button>
            <label for="username">Username:</label><br>
            <input type="text" id="username" name="username"><br>
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password"><br>
            <input type="submit" value="Submit">
        </form>
        `);
    dialog.showModal();
    document.getElementById("closeSearchButton").addEventListener('click', function(event) {
        event.preventDefault();
        dialog.close();
    });
});


async function searchRestaurants(query) {
    const restaurants = await fetchData(baseUrl);

    let lowerCaseQuery = query.toLowerCase();

    let matchingRestaurants = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(lowerCaseQuery));

    if (matchingRestaurants.length === 0) {
        matchingRestaurants = restaurants.sort((a, b) => {
            let aDistance = levenshteinDistance(lowerCaseQuery, a.name.toLowerCase());
            let bDistance = levenshteinDistance(lowerCaseQuery, b.name.toLowerCase());
            return aDistance - bDistance;
        });
        matchingRestaurants = matchingRestaurants.slice(0, 5);
    }

    let restaurantList = document.getElementById('restaurantList');

    restaurantList.innerHTML = '';

    matchingRestaurants.forEach(restaurant => {
        let listItem = document.createElement('li');
        listItem.textContent = restaurant.name;
        listItem.addEventListener('click', function() {
            displayRestaurantDetails(restaurant);
        });
        restaurantList.appendChild(listItem);
    });
}


async function displayRestaurantDetails(restaurant) {
    let restaurantDetails = document.getElementById('restaurantDetails');

    restaurantDetails.innerHTML = '';

    let name = document.createElement('p');
    name.textContent = 'Name: ' + restaurant.name;
    restaurantDetails.appendChild(name);

    let address = document.createElement('p');
    address.textContent = 'Address: ' + restaurant.address;
    restaurantDetails.appendChild(address);

    let dailyMenu = await fetchData(`${baseUrl}/daily/${restaurant._id}/fi`);
    let weeklyMenu = await fetchData(`${baseUrl}/weekly/${restaurant._id}/fi`);

    let dailyMenuElement = document.getElementById('dailyMenu');
    let weeklyMenuElement = document.getElementById('weeklyMenu');

    dailyMenuElement.innerHTML = '';
    weeklyMenuElement.innerHTML = '';

    let dailyMenuTitle = document.createElement('h2');
    dailyMenuTitle.textContent = 'Daily Menu';
    dailyMenuElement.appendChild(dailyMenuTitle);
    dailyMenu.courses.forEach(course => {
        let menuItem = document.createElement('p');
        let diets = Array.isArray(course.diets) ? course.diets.join(', ') : 'No diets available';
        menuItem.textContent = `${course.name} - ${course.price} - Diets: ${diets}`;
        dailyMenuElement.appendChild(menuItem);
    });

    let weeklyMenuTitle = document.createElement('h2');
    weeklyMenuTitle.textContent = 'Weekly Menu';
    weeklyMenuElement.appendChild(weeklyMenuTitle);
    weeklyMenu.days.forEach(day => {
        let dayTitle = document.createElement('h3');
        dayTitle.textContent = day.date;
        weeklyMenuElement.appendChild(dayTitle);
        day.courses.forEach(course => {
            let menuItem = document.createElement('p');
            let diets = Array.isArray(course.diets) ? course.diets.join(', ') : 'No diets available';
            menuItem.textContent = `${course.name} - ${course.price} - Diets: ${diets}`;
            weeklyMenuElement.appendChild(menuItem);
        });
    });
}