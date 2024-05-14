document.addEventListener('DOMContentLoaded', function () {
    const signInButton = document.getElementById('signInButton');
    const signUpButton = document.getElementById('signUpButton');
    const loginDialog = document.getElementById('loginDialog');
    const signUpDialog = document.getElementById('signUpDialog');
    const closeLoginButton = document.getElementById('closeLoginButton');
    const switchToRegisterButton = document.getElementById('openSignUpButton');
    const closeSignUpButton = document.getElementById('closeSignUpButton');
    const switchToLoginButton = document.getElementById('switchToLoginButton');
    const logoutButton = document.getElementById('logoutButton');
    const exitSignUpButton = document.getElementById('exitSignUpButton');

    signInButton.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById("loginForm").reset();
        console.log('Showing login dialog...');
        loginDialog.showModal();
    });

    switchToRegisterButton.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById("signUpForm").reset();
        console.log('Switching to sign up dialog...');
        signUpDialog.showModal();
        loginDialog.close();
    });

    closeLoginButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Closing login dialog...');
        loginDialog.close();
    });

    signUpButton.addEventListener('click', function() {
        document.getElementById("signUpForm").reset();
        console.log('Showing sign up dialog...');
        signUpDialog.showModal();
    });

    switchToLoginButton.addEventListener('click', function() {
        console.log('Switching to login dialog...');
        loginDialog.showModal();
        signUpDialog.close();
    });

    closeSignUpButton.addEventListener('click', function(event) {
        console.log('Closing sign up dialog...');
        signUpDialog.close();
    });

    exitSignUpButton.addEventListener('click', function(event) {
        console.log('Closing sign up dialog...');
        signUpDialog.close();
    });

    logoutButton.addEventListener('click', function() {
        if (localStorage.getItem('user')) {
            let userData = JSON.parse(localStorage.getItem('user'));
            let usernameLogged = userData.username;
            console.log("User logged out:", usernameLogged);
            localStorage.removeItem('user');

            signInButton.style.display = 'block';
            signUpButton.style.display = 'block';
        } else {
            console.log("No user is currently logged in.");
        }
    });

    if (localStorage.getItem('user')) {
        signInButton.style.display = 'none';
        signUpButton.style.display = 'none';
        logoutButton.style.display = 'block';
        console.log('User is logged in.');
    } else {
        console.log('No user is logged in.');
    }
});
