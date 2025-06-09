document.addEventListener('DOMContentLoaded', () => {
    const postsGrid = document.getElementById('posts-grid');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    let allPosts = []; // All posts data will be stored here

    // Function to fetch posts from JSON
    async function fetchPosts() {
        try {
            const response = await fetch('posts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Sort posts: newest first (assuming 'id' can represent creation order or you can add a 'date' field)
            // For now, let's assume higher ID means newer, or you can add a 'date' field.
            allPosts = data.sort((a, b) => b.id - a.id); // Sort by ID descending for newest first
            displayPosts(allPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            postsGrid.innerHTML = '<p>Posts များကို တင်၍မရပါ။ နောက်မှ ထပ်ကြိုးစားကြည့်ပါ။</p>';
        }
    }

    // Function to display posts in the grid
    function displayPosts(postsToDisplay) {
        postsGrid.innerHTML = ''; // Clear previous posts
        if (postsToDisplay.length === 0) {
            postsGrid.innerHTML = '<p>ရှာဖွေမှုနှင့် ကိုက်ညီသော Post မရှိပါ။</p>';
            return;
        }
        postsToDisplay.forEach(post => {
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');

            postCard.innerHTML = `
                <img src="${post.photo}" alt="${post.title}" data-post-id="${post.id}">
                <h3>${post.title}</h3>
                <p>ကြာချိန်: ${post.duration}</p>
            `;
            postsGrid.appendChild(postCard);
        });

        // Add event listener to images for navigation
        document.querySelectorAll('.post-card img').forEach(img => {
            img.addEventListener('click', (event) => {
                const postId = event.target.dataset.postId;
                window.location.href = `post.html?id=${postId}`; // Navigate to post.html with ID
            });
        });
    }

    // Search functionality
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPosts = allPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm)
        );
        displayPosts(filteredPosts);
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Initial load of posts
    fetchPosts();
});