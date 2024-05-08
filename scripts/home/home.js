var selectedCategory = "";
var currentUser = JSON.parse(localStorage.getItem("currentUser"));

// MARK: - VIEW CREATOR
function createCategoryButton(category, isActive = false) {
    const tempContainer = document.createElement('div');

    tempContainer.innerHTML = `<button type="button" 
        class="list-group-item btn list-group-item-action text-start${isActive ? ' active list-group-item-secondary' : ''} border-0 mb-2 text-capitalize"
        id="categoryButton">${category.title}</button>`;

    const button = tempContainer.firstChild;
    button.onclick = function () {
        selectedCategory = category;
        getCategoryData();
        getPostsByCategory(category.id);
    };

    return button;
}

function createPostCard(post, container) {
    const card = document.createElement('div');
    card.className = 'card flex-md-row mb-3 box-shadow h-md-250 bg-white border-0 shadow-sm';

    card.innerHTML = `
    <div class="card-body d-flex flex-column align-items-start">
        <strong class="d-inline-block mb-2 text-capitalize text-primary">${post.author}</strong>
        <h3 class="mb-0">
            <div class="text-dark text-start text-capitalize" href="${post.link}">${post.title}</div>
        </h3>
        <div class="mb-1 text-muted">${post.date}</div>
        <p class="card-text mb-2 text-muted text-start" style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">${post.content}</p>
        <button type="button" class="btn btn-link p-0 text-primary" onclick="onContinueReadingTapped('${post._id}')">Continue reading</button>
    </div>
`;

    container.appendChild(card);
}

// MARK: - VIEW BINDER
function updateListGroup(categories) {
    const listGroup = document.querySelector('.list-group');
    listGroup.innerHTML = '<h5 class="mb-3 text-start" > Explore categories</h5>';

    categories.forEach((category, index) => {
        var isActive = false
        if (selectedCategory == "") {
            isActive = index === 0;
            selectedCategory = category;
        } else if (selectedCategory.title == category.title) {
            isActive = true
        } else {
            isActive = false
        }

        const button = createCategoryButton(category, isActive);
        listGroup.appendChild(button);
    });
}

function populateSelect(data) {
    const select = document.getElementById('category-select');
    select.classList.add('text-capitalize');
    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.title;
        select.appendChild(option);
    });
}

function addPostsToContainer(posts) {
    const container = document.getElementById('container');
    const children = container.children;
    for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        if (child.classList.contains('card')) {
            container.removeChild(child);
        }
    }

    posts.forEach(async post => {
        var user = await getUserById(post.user_id);
        post.author = user.data.username;
        post.date = getDateMonthYear(post.created_time);
        createPostCard(post, container);
    });
}

// MARK: - NETWORK CALLS
async function getCategoryData() {
    try {
        const response = await fetch('http://localhost:30002/category');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        updateListGroup(data.data);
        populateSelect(data.data);
    } catch (error) {
        alert('Error getCategoryData:' + error);
        updateListGroup([]);
    }
}

async function getPostsByCategory(categoryId) {
    try {
        const response = await fetch(`http://localhost:30002/post/category/${categoryId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        addPostsToContainer(data.data);
    } catch (error) {
        alert('Error getPostsByCategory:' + error);
        addPostsToContainer([]);
    }
}

async function getUserById(id) {
    try {
        const response = await fetch(`http://localhost:30002/auth/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

async function createPost() {
    const categoryId = document.getElementById('category-select').value;
    const title = document.getElementById('title-input').value;
    const content = document.getElementById('content-textarea').value;
    const question = document.getElementById('question-input').value;
    const answers = [
        document.getElementById('answer1-input').value,
        document.getElementById('answer2-input').value,
        document.getElementById('answer3-input').value,
        document.getElementById('answer4-input').value
    ];
    const correctAnswer = document.getElementById('correct-answer-input').value;

    const post = {
        user_id: currentUser._id,
        category_id: categoryId,
        title: title,
        content: content,
        question: question,
        answers: answers,
        correctAnswer: correctAnswer
    };

    try {
        const response = await fetch('http://localhost:30002/post/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(post)
        });
        const data = await response.json();
        console.log('Success:', data);
        displayAlert(true, "Post created successfully!");
        getPostsByCategory(categoryId);
    } catch (error) {
        console.error('Error:', error);
        displayAlert(false, "Failed to create post. Please check your network connection and try again.");
    }

    clearForm();
}

function clearForm() {
    document.getElementById('category-select').value = '';
    document.getElementById('title-input').value = '';
    document.getElementById('content-textarea').value = '';
    document.getElementById('question-input').value = '';
    document.getElementById('answer1-input').value = '';
    document.getElementById('answer2-input').value = '';
    document.getElementById('answer3-input').value = '';
    document.getElementById('answer4-input').value = '';
    document.getElementById('correct-answer-input').value = '';
}

// MARK: - FUNCTIONS
function displayAlert(isSuccess, message) {
    const alertBox = document.querySelector('.alert');
    alertBox.textContent = message;
    alertBox.hidden = false;

    if (isSuccess) {
        alertBox.classList.remove('alert-danger');
        alertBox.classList.add('alert-success');
    } else {
        alertBox.classList.remove('alert-success');
        alertBox.classList.add('alert-danger');
    }
}

function onContinueReadingTapped(postID) {
    sessionStorage.setItem('postID', postID);
    sessionStorage.setItem('category', JSON.stringify(selectedCategory));
    window.location.href = 'postDetail.html';
}

// MARK: - HELPER FUNCTIONS
function getMonthName(monthNumber) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1];
}

function getDateMonthYear(dateString) {
    const dateObject = new Date(dateString);
    const date = dateObject.getDate();
    const month = getMonthName(dateObject.getMonth() + 1);
    const year = dateObject.getFullYear();
    return date + " " + month + ", " + year
}

// MARK: - INIT
function init() {
    getCategoryData();
    getPostsByCategory(1);
    var createPostBtn = document.getElementById('create-post-btn');
    createPostBtn.onclick = createPost;
}

window.onload = init;
