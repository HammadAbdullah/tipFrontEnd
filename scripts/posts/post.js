function createPost() {
    var postHeading = document.getElementById('postHeading').value;
    var postContent = document.getElementById('postContent').value;
    var category = document.getElementById('category').value;

    if (postContent.trim() !== '') {
        var postList = document.getElementById('postList');
        var newPost = document.createElement('div');
        newPost.className = 'post';

        // Create elements for heading, category, and description
        var headingElement = document.createElement('h2');
        headingElement.textContent = postHeading;

        var categoryElement = document.createElement('p');
        categoryElement.textContent = 'Category: ' + category;

        var descriptionElement = document.createElement('p');
        descriptionElement.textContent = postContent;

        // Append elements to the new post div
        newPost.appendChild(headingElement);
        newPost.appendChild(categoryElement);
        newPost.appendChild(descriptionElement);

        // Append the new post to the post list
        postList.appendChild(newPost);

        document.getElementById('message').textContent = 'Posted!';
        document.getElementById('postHeading').value = ''; // Clear heading input after posting
        document.getElementById('postContent').value = ''; // Clear description input after posting
        document.getElementById('loadingOverlay').style.display = 'block'; // Show the loading animation

        setTimeout(() => {
            document.getElementById('loadingOverlay').style.display = 'none'; // Hide the loading animation after 2 seconds
            document.getElementById('message').innerText = 'Posted successfully!';
        }, 2000);
    } else {
        alert('Please write something before posting.');
    }
}



// Backend for the post page 
// ==============================================================================




const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// In-memory storage for posts (replace this with a database in a real application)
let posts = [];

// Route to handle post creation
app.post('/posts', (req, res) => {
    const { heading, category, description } = req.body;

    if (!heading || !category || !description) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const newPost = { heading, category, description };
    posts.push(newPost);

    res.status(201).json({ message: 'Post created successfully', post: newPost });
});

// Route to get all posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

