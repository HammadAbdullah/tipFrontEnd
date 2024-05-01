function createPost() {
    var postContent = document.getElementById('postContent').value;
    if (postContent.trim() !== '') {
        var postList = document.getElementById('postList');
        var newPost = document.createElement('div');
        newPost.className = 'post';
        newPost.textContent = postContent;
        postList.appendChild(newPost);
        document.getElementById('message').textContent = 'Posted!';
        document.getElementById('postContent').value = ''; // Clear input after posting
        document.getElementById('loadingOverlay').style.display = 'block'; // Show the loading animation
    setTimeout(() => {
      document.getElementById('loadingOverlay').style.display = 'none'; // Hide the loading animation after 2 seconds
      document.getElementById('message').innerText = 'Posted successfully!';
      // Add logic here to dynamically add the new post to the post list

      
    }, 2000);
        
    } else {
        alert('Please write something before posting.');
    }
}