let profileButton = document.getElementById('profileButton');
let profileModal = document.getElementById('profileDialog');
let closeProfile = document.getElementById('closeProfileButton');
let usernameBox = document.getElementById('usernameDisplayBox');
let favoriteRestaurant = document.getElementById('favoriteRestaurantDisplay');
let logoutButton = document.getElementById('logoutButton');
let loginStatus = document.getElementById('loginStatus');

profileButton.addEventListener('click', function() {
    let userData = JSON.parse(sessionStorage.getItem('data'));

    if (userData) {
        usernameBox.textContent = userData.data.username;
        favoriteRestaurant.innerHTML = ''; // Clear the favorite restaurants list
        if (userData.favoriteRestaurants) {
            userData.favoriteRestaurants.forEach((restaurant, index) => {
                let restaurantElement = document.createElement('div');
                restaurantElement.textContent = restaurant.name;

                let deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', function() {
                    userData.favoriteRestaurants.splice(index, 1); // Remove the restaurant from the favorites list
                    sessionStorage.setItem('data', JSON.stringify(userData));
                    profileButton.click(); // Refresh the profile dialog
                });

                restaurantElement.appendChild(deleteButton);
                favoriteRestaurant.appendChild(restaurantElement);
            });
        }
    }
    profileModal.style.display = 'inline-block';
    profileModal.showModal();
});

closeProfile.addEventListener('click', function() {
    profileModal.style.display = 'none';
    profileModal.close();
});

logoutButton.addEventListener('click', function() {
    // Get user data from session storage
    let userData = JSON.parse(sessionStorage.getItem('data'));
    localStorage.setItem('user', JSON.stringify(userData));

    // Remove user data from session storage
    sessionStorage.removeItem('data');

    // Update login status when user logs out
    loginStatus.textContent = 'User logged out.';

    // Clear user information from the user interface
    usernameBox.textContent = '';
    favoriteRestaurant.innerHTML = ''; // Clear the favorite restaurants list

    // Hide profile dialog
    profileModal.style.display = 'none';
    profileModal.close();

    console.log('User logged out.');
});