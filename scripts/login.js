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
            throw new Error('Failed to login.');
        }

        if (data.success) {
            console.log('Login Success:', data);
            alert(`Login successful! Welcome ${data.data.validEmail.firstname}.`);
            localStorage.setItem('token', data.data.token);
            window.location.href = 'home.html';
        } else {
            if (data.error && data.error.details) {
                throw new Error(data.error.details.map(detail => detail.message).join(', '));
              } else {
                throw new Error(data.error);
              }
        }
    } catch (error) {
        console.log('Error:', error);
        alert(`Login failed: ${error.message}`);
    }
}
