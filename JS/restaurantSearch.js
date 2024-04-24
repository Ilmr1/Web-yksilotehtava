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