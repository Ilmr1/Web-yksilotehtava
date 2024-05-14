document.addEventListener('DOMContentLoaded', function () {
    const signUpForm = document.getElementById('signUpForm');
    const signUpErrorMessageContainer = document.getElementById('signUpErrorMessageContainer');
    const loginStatus = document.getElementById('loginStatus'); // Add this line

    signUpForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        console.log('Submitting signup form...');

        const rUsernameField = document.getElementById('rUsernameField');
        const rEmailField = document.getElementById('rEmailField');
        const rPasswordField = document.getElementById('rPasswordField');
        const rConfirmPasswordField = document.getElementById('rConfirmPasswordField');

        const username = rUsernameField.value;
        const email = rEmailField.value;
        const password = rPasswordField.value;
        const confirmPassword = rConfirmPasswordField.value;

        // Client-side validation
        if (!username || !email || !password || !confirmPassword) {
            signUpErrorMessageContainer.textContent = 'All fields are required.';
            console.log('Validation failed: All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            signUpErrorMessageContainer.textContent = 'Passwords do not match.';
            console.log('Validation failed: Passwords do not match.');
            return;
        }

        try {
            // Send sign up request to the API
            console.log('User information saved in local storage:', { username, email });
            localStorage.setItem('user', JSON.stringify({ username, email }));

            console.log('Sending sign up request to the API...');
            const response = await fetch('https://10.120.32.94/restaurant/api/v1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Sign up failed: ${errorMessage}`);
            }

            // Display success message
            signUpErrorMessageContainer.textContent = 'Sign up successful. You can now log in.';
            loginStatus.textContent = 'User signed up.'; // Add this line
            console.log('Sign up successful.');

            // Close sign up dialog
            const signUpDialog = document.getElementById('signUpDialog');
            signUpDialog.close();

            // Switch to login dialog
            const loginDialog = document.getElementById('loginDialog');
            loginDialog.showModal();
            console.log('Switched to login dialog.');
        } catch (error) {
            signUpErrorMessageContainer.textContent = error.message;
            console.error('Sign up failed:', error.message);

            // Log out user if signup fails
            localStorage.removeItem('user');
        }
    });
});