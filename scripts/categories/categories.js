var selectedCategory = "";

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

// MARK: - FUNCTIONS
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
}

window.onload = init;
