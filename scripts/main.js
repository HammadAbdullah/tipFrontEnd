const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Mock database
const users = [];

// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    // Destructure the request body
    const { username, firstname, lastname, email, password } = req.body;

    // Simple email validation
    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: {
          message: "\"email\" must be a valid email",
          details: [
            {
              path: ["email"],
              type: "string.email",
              context: {
                value: email,
                label: "email",
                key: "email"
              }
            }
          ]
        }
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to the mock database
    const newUser = {
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      _id: Date.now().toString(), // Mock ID generation
    };
    users.push(newUser);

    // Respond with success
    res.json({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email is provided
    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          message: "\"email\" is required",
          details: [
            {
              path: ["email"],
              type: "any.required",
              context: {
                label: "email",
                key: "email"
              }
            }
          ]
        }
      });
    }

    // Find the user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Compare the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Respond with success
    res.json({
      success: true,
      data: {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        _id: user._id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
