async function handleRegister() {
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const apiUrl = 'http://localhost:30002/auth/register';
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname, lastname, username, email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to register.');
        }

        if (data.success) {
            console.log('Registration Success:', data);
            alert(`Registration successful! Welcome, ${data.data.firstname}.`);
            window.location.href = 'home.html';
        } else {
            if (data.error && data.error.details) {
                throw new Error(data.error.details.map(detail => detail.message).join(', '));
            } else {
                throw new Error(data.error || 'An unknown error occurred during registration.');
            }
        }
    } catch (error) {
        console.log('Error:', error);
        alert(`Registration failed: ${error.message}`);
    }
}

function init() { 
    var registerBtn = document.getElementById('register-btn'); 
    registerBtn.onclick = handleRegister;
}

window.onload = init; 
