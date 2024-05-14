document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const loginErrorMessageContainer = document.getElementById('loginErrorMessageContainer');
    const loginStatus = document.getElementById('loginStatus');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const usernameField = document.getElementById('usernameField');
        const passwordField = document.getElementById('passwordField');

        const username = usernameField.value;
        const password = passwordField.value;

        if (!username || !password) {
            loginErrorMessageContainer.textContent = 'Username and password are required.';
            return;
        }

        try {
            const response = await fetch('https://10.120.32.94/restaurant/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed.');
            }

            let userData = JSON.parse(localStorage.getItem('user'));
            if (userData) {
                userData.data = data;
                userData.data.username = username; // Set the username in the session storage
            } else {
                userData = { data: data };
                userData.data.username = username; // Set the username in the session storage
            }
            sessionStorage.setItem('data', JSON.stringify(userData));

            loginStatus.textContent = 'User logged in.';
            hideLoginDialog();
        } catch (error) {
            loginErrorMessageContainer.textContent = error.message;
        }
    });

    function hideLoginDialog() {
        loginForm.reset();
        loginErrorMessageContainer.textContent = '';

        const loginDialog = document.getElementById('loginDialog');
        loginDialog.close();
    }
});