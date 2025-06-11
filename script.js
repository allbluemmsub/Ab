document.addEventListener('DOMContentLoaded', () => {
    const postsGrid = document.getElementById('posts-grid');
    const searchInput = document.getElementById('searchInput');
    const paginationControls = document.getElementById('pagination-controls');
    const mySidebar = document.getElementById('mySidebar');
    const mainContent = document.getElementById('main');
    const categoryLinks = document.querySelectorAll('.category-link');

    let allPosts = [];
    let filteredPosts = [];
    let currentPage = 1;
    const postsPerPage = 12; // Adjust as needed
    let currentCategory = 'All'; // Default category

    // Function to open the sidebar
    window.openNav = function() {
        mySidebar.style.width = "250px";
        mainContent.style.marginLeft = "250px";
    }

    // Function to close the sidebar
    window.closeNav = function() {
        mySidebar.style.width = "0";
        mainContent.style.marginLeft= "0";
    }

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
            applyFiltersAndDisplayPosts();
        } catch (error) {
            console.error('Error fetching posts:', error);
            postsGrid.innerHTML = '<p>Posts များကို တင်၍မရပါ။ နောက်မှ ထပ်ကြိုးစားကြည့်ပါ။</p>';
        }
    }

    // Apply category filter and search filter
    function applyFiltersAndDisplayPosts() {
        // 1. Apply Category Filter
        let tempPosts = [];
        if (currentCategory === 'All') {
            tempPosts = [...allPosts];
        } else {
            tempPosts = allPosts.filter(post => post.category === currentCategory);
        }

        // 2. Apply Search Filter
        const searchTerm = searchInput.value.toLowerCase();
        filteredPosts = tempPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm) ||
            post.actor.toLowerCase().includes(searchTerm) // Search by actor name
        );

        currentPage = 1; // Reset to first page after filter/search
        displayCurrentPagePosts();
    }

    // Function to display posts for the current page
    function displayCurrentPagePosts() {
        postsGrid.innerHTML = ''; // Clear previous posts

        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToDisplay = filteredPosts.slice(startIndex, endIndex);

        if (postsToDisplay.length === 0) {
            postsGrid.innerHTML = '<p>ရှာဖွေမှု သို့မဟုတ် အမျိုးအစားနှင့် ကိုက်ညီသော Post မရှိပါ။</p>';
        } else {
            postsToDisplay.forEach(post => {
                const postCard = document.createElement('div');
                postCard.classList.add('post-card');

                postCard.innerHTML = `
                    <img src="${post.photo}" alt="${post.title}" data-post-id="${post.id}">
                    <div class="duration-overlay">${post.duration}</div>
                    <h3>${post.title}</h3>
                    <p class="actor-name">${post.actor}</p> `;
                postsGrid.appendChild(postCard);
            });
        }

        // Add event listener to images for navigation
        document.querySelectorAll('.post-card img').forEach(img => {
            img.addEventListener('click', (event) => {
                const postId = event.target.dataset.postId;
                // Navigate to post.html with ID and current page number
                window.location.href = `post.html?id=${postId}&fromPage=${currentPage}`;
            });
        });

        setupPagination(); // Setup pagination controls after displaying posts
    }

    // Function to setup pagination buttons
    function setupPagination() {
        paginationControls.innerHTML = '';
        const pageCount = Math.ceil(filteredPosts.length / postsPerPage);

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
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        paginationControls.appendChild(prevButton);

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
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            paginationControls.appendChild(button);
        }

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
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        paginationControls.appendChild(nextButton);
    }

    // Search functionality
    searchInput.addEventListener('input', applyFiltersAndDisplayPosts);

    // Category filter functionality
    categoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            currentCategory = event.target.dataset.category;
            closeNav(); // Close sidebar after selecting category
            applyFiltersAndDisplayPosts(); // Apply filter and display posts
        });
    });

    // Check URL for 'page' parameter on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = urlParams.get('page');
    if (pageFromUrl && !isNaN(pageFromUrl) && parseInt(pageFromUrl) > 0) {
        currentPage = parseInt(pageFromUrl);
    }

    // Initial load of posts
    fetchPosts();
});
