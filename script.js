document.addEventListener('DOMContentLoaded', () => {
    const postsGrid = document.getElementById('posts-grid');
    const searchInput = document.getElementById('searchInput');
    const paginationControls = document.getElementById('pagination-controls');

    let allPosts = [];
    let filteredPosts = [];
    let currentPage = 1;
    const postsPerPage = 12;

    async function fetchPosts() {
        try {
            const response = await fetch('posts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allPosts = data.sort((a, b) => b.id - a.id);
            filteredPosts = [...allPosts];
            displayCurrentPagePosts();
        } catch (error) {
            console.error('Error fetching posts:', error);
            postsGrid.innerHTML = '<p>Posts များကို တင်၍မရပါ။ နောက်မှ ထပ်ကြိုးစားကြည့်ပါ။</p>';
        }
    }

    function displayCurrentPagePosts() {
        postsGrid.innerHTML = '';

        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToDisplay = filteredPosts.slice(startIndex, endIndex);

        if (postsToDisplay.length === 0) {
            postsGrid.innerHTML = '<p>ရှာဖွေမှုနှင့် ကိုက်ညီသော Post မရှိပါ။</p>';
        } else {
            postsToDisplay.forEach(post => {
                const postCard = document.createElement('div');
                postCard.classList.add('post-card');

                // *** ဒီနေရာကို ပြင်ဆင်ပါ ***
                postCard.innerHTML = `
                    <img src="${post.photo}" alt="${post.title}" data-post-id="${post.id}">
                    <div class="duration-overlay">${post.duration}</div> <h3>${post.title}</h3>
                    `;
                postsGrid.appendChild(postCard);
            });
        }

        document.querySelectorAll('.post-card img').forEach(img => {
            img.addEventListener('click', (event) => {
                const postId = event.target.dataset.postId;
                window.location.href = `post.html?id=${postId}`;
            });
        });

        setupPagination();
    }

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

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        filteredPosts = allPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        displayCurrentPagePosts();
    }

    searchInput.addEventListener('input', performSearch);

    fetchPosts();
});
