async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const apiUrl = 'http://localhost:30002/auth/login';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "email": email, "password": password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to login.');
        }

        if (data.success) {
            console.log('Login Success:', data);
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.data.validEmail));
            window.location.href = 'categories.html';
        } else {
            if (data.error && data.error.details) {
                throw new Error(data.error.details.map(detail => detail.message).join(', '));
              } else {
                throw new Error(data.error);
              }
        }
    } catch (error) {
        // console.log('Error:', error);
        // alert(`Login failed: ${error.message}`);
        showErrorAlert(error.message);
    }
}

function showErrorAlert(errorMsg) {
    const errorAlert = document.getElementById('errorAlert');
    errorAlert.hidden = false;
    errorAlert.classList.add('show');
    errorAlert.classList.remove('fade');
    errorAlert.innerHTML = `<strong>Error!<br></strong> ${errorMsg}`;
}

function hideErrorAlert() {
    const errorAlert = document.getElementById('errorAlert');
    errorAlert.hidden = true;
    errorAlert.classList.remove('show');
    errorAlert.classList.add('fade');
}

function init() { 
    var loginBtn = document.getElementById('login-btn'); 
    loginBtn.onclick = handleLogin;
    hideErrorAlert();
}

window.onload = init; 