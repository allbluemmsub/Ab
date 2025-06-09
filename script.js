document.addEventListener('DOMContentLoaded', () => {
    const postsGrid = document.getElementById('posts-grid');
    const searchInput = document.getElementById('searchInput');
    const paginationControls = document.getElementById('pagination-controls'); // Pagination Control Div

    let allPosts = []; // All posts data will be stored here
    let filteredPosts = []; // Posts after search filter
    let currentPage = 1;
    const postsPerPage = 12; // တစ်မျက်နှာလျှင် Post ၁၂ ခု

    // Function to fetch posts from JSON
    async function fetchPosts() {
        try {
            const response = await fetch('posts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Sort posts: newest first by ID
            allPosts = data.sort((a, b) => b.id - a.id);
            filteredPosts = [...allPosts]; // Initially, filtered posts are all posts
            displayCurrentPagePosts(); // Display posts for the current page
        } catch (error) {
            console.error('Error fetching posts:', error);
            postsGrid.innerHTML = '<p>Posts များကို တင်၍မရပါ။ နောက်မှ ထပ်ကြိုးစားကြည့်ပါ။</p>';
        }
    }

    // Function to display posts for the current page
    function displayCurrentPagePosts() {
        postsGrid.innerHTML = ''; // Clear previous posts

        // Calculate start and end index for current page
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToDisplay = filteredPosts.slice(startIndex, endIndex);

        if (postsToDisplay.length === 0) {
            postsGrid.innerHTML = '<p>ရှာဖွေမှုနှင့် ကိုက်ညီသော Post မရှိပါ။</p>';
        } else {
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
        }

        // Add event listener to images for navigation
        document.querySelectorAll('.post-card img').forEach(img => {
            img.addEventListener('click', (event) => {
                const postId = event.target.dataset.postId;
                window.location.href = `post.html?id=${postId}`; // Navigate to post.html with ID
            });
        });

        setupPagination(); // Setup pagination controls after displaying posts
    }

    // Function to setup pagination buttons
    function setupPagination() {
        paginationControls.innerHTML = ''; // Clear existing controls
        const pageCount = Math.ceil(filteredPosts.length / postsPerPage);

        // Add "Previous" button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.classList.add('page-button');
        if (currentPage === 1) {
            prevButton.classList.add('disabled');
        }
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayCurrentPagePosts();
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
            }
        });
        paginationControls.appendChild(prevButton);


        // Add page number buttons
        for (let i = 1; i <= pageCount; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('page-button');
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                currentPage = i;
                displayCurrentPagePosts();
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
            });
            paginationControls.appendChild(button);
        }

        // Add "Next" button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.classList.add('page-button');
        if (currentPage === pageCount) {
            nextButton.classList.add('disabled');
        }
        nextButton.addEventListener('click', () => {
            if (currentPage < pageCount) {
                currentPage++;
                displayCurrentPagePosts();
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
            }
        });
        paginationControls.appendChild(nextButton);
    }

    // Search functionality (unchanged)
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        filteredPosts = allPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm)
        );
        currentPage = 1; // Reset to first page after search
        displayCurrentPagePosts();
    }

    // Real-time search (unchanged)
    searchInput.addEventListener('input', performSearch);

    // Initial load of posts
    fetchPosts();
});
