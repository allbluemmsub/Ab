document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const pageFromParam = urlParams.get('fromPage'); // Get page number from URL

    const backToHomeLink = document.getElementById('backToHomeLink');
    const playButton = document.getElementById('playButton');
    const downloadButton = document.getElementById('downloadButton');
    const playDropdown = document.getElementById('playDropdown');
    const downloadDropdown = document.getElementById('downloadDropdown');
    const gallerySlider = document.getElementById('gallerySlider');
    const prevSlideBtn = document.getElementById('prevSlide');
    const nextSlideBtn = document.getElementById('nextSlide');

    let currentSlideIndex = 0;
    let sliderInterval; // For auto-sliding

    // --- Back to Home Link Logic ---
    if (pageFromParam) {
        backToHomeLink.href = `index.html?page=${pageFromParam}`;
    } else {
        backToHomeLink.href = `index.html`; // Default to Page 1 if no param
    }

    if (!postId) {
        document.querySelector('.post-detail-container').innerHTML = '<p>Post ID မတွေ့ပါ။</p>';
        return;
    }

    try {
        const response = await fetch('posts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json();
        const post = posts.find(p => p.id == postId);

        if (post) {
            document.getElementById('detailTitle').textContent = post.title;
            document.getElementById('detailPhoto').src = post.photo;
            document.getElementById('detailPhoto').alt = post.title;
            document.getElementById('detailActor').textContent = post.actor; // Display Actor Name
            document.getElementById('detailDuration').textContent = `ကြာချိန်: ${post.duration}`; // Optional: can display somewhere else
            document.getElementById('detailDescription').textContent = post.description;

            // --- Populate Play Links ---
            if (post.playLinks && post.playLinks.length > 0) {
                playDropdown.innerHTML = '';
                post.playLinks.forEach(link => {
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.textContent = link.name;
                    a.target = "_blank"; // Open in new tab
                    playDropdown.appendChild(a);
                });
            } else {
                playButton.style.display = 'none'; // Hide if no links
            }

            // --- Populate Download Links ---
            if (post.downloadLinks && post.downloadLinks.length > 0) {
                downloadDropdown.innerHTML = '';
                post.downloadLinks.forEach(link => {
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.textContent = link.name;
                    a.target = "_blank"; // Open in new tab
                    downloadDropdown.appendChild(a);
                });
            } else {
                downloadButton.style.display = 'none'; // Hide if no links
            }

            // --- Populate Gallery Photos (Slider) ---
            if (post.galleryPhotos && post.galleryPhotos.length > 0) {
                gallerySlider.innerHTML = '';
                post.galleryPhotos.forEach(photoUrl => {
                    const div = document.createElement('div');
                    div.classList.add('slider-item');
                    const img = document.createElement('img');
                    img.src = photoUrl;
                    img.alt = post.title + ' Gallery';
                    div.appendChild(img);
                    gallerySlider.appendChild(div);
                });

                // Set up slider navigation
                updateSlider();
                startSliderAutoPlay();

                prevSlideBtn.addEventListener('click', () => {
                    currentSlideIndex = (currentSlideIndex > 0) ? currentSlideIndex - 1 : post.galleryPhotos.length - 1;
                    updateSlider();
                    resetSliderAutoPlay();
                });

                nextSlideBtn.addEventListener('click', () => {
                    currentSlideIndex = (currentSlideIndex < post.galleryPhotos.length - 1) ? currentSlideIndex + 1 : 0;
                    updateSlider();
                    resetSliderAutoPlay();
                });
            } else {
                // Hide slider if no gallery photos
                document.querySelector('.slider-container').style.display = 'none';
            }

        } else {
            document.querySelector('.post-detail-container').innerHTML = '<p>ဤ Post ကို ရှာမတွေ့ပါ။</p>';
        }
    } catch (error) {
        console.error('Error fetching post details:', error);
        document.querySelector('.post-detail-container').innerHTML = '<p>Post အသေးစိတ်များကို တင်၍မရပါ။</p>';
    }

    // --- Dropdown Toggle Logic ---
    function toggleDropdown(button, dropdown) {
        dropdown.classList.toggle('show');
    }

    // Close the dropdowns if the user clicks outside of them
    window.onclick = function(event) {
        if (!event.target.matches('.detail-button')) {
            const dropdowns = document.getElementsByClassName("dropdown-content");
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    playButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent closing immediately from window click
        toggleDropdown(playButton, playDropdown);
        downloadDropdown.classList.remove('show'); // Close other dropdown
    });

    downloadButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent closing immediately from window click
        toggleDropdown(downloadButton, downloadDropdown);
        playDropdown.classList.remove('show'); // Close other dropdown
    });


    // --- Slider Logic ---
    function updateSlider() {
        if (post.galleryPhotos.length === 0) return;
        const itemWidth = document.querySelector('.slider-item').clientWidth;
        gallerySlider.style.transform = `translateX(${-currentSlideIndex * itemWidth}px)`;
    }

    function startSliderAutoPlay() {
        sliderInterval = setInterval(() => {
            currentSlideIndex = (currentSlideIndex < post.galleryPhotos.length - 1) ? currentSlideIndex + 1 : 0;
            updateSlider();
        }, 3000); // Change slide every 3 seconds
    }

    function resetSliderAutoPlay() {
        clearInterval(sliderInterval);
        startSliderAutoPlay();
    }

    // Update slider position on window resize
    window.addEventListener('resize', () => {
        updateSlider();
    });
});
