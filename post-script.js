document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id'); // Get the post ID from the URL

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
        const post = posts.find(p => p.id == postId); // Find the post by ID

        if (post) {
            document.getElementById('postTitle').textContent = post.title;
            document.getElementById('detailPhoto').src = post.photo;
            document.getElementById('detailPhoto').alt = post.title;
            document.getElementById('detailTitle').textContent = post.title;
            document.getElementById('detailDuration').textContent = `ကြာချိန်: ${post.duration}`;
            document.getElementById('detailDescription').textContent = post.description;
            document.getElementById('detailDownloadLink').href = post.downloadLink;
        } else {
            document.querySelector('.post-detail-container').innerHTML = '<p>ဤ Post ကို ရှာမတွေ့ပါ။</p>';
        }
    } catch (error) {
        console.error('Error fetching post details:', error);
        document.querySelector('.post-detail-container').innerHTML = '<p>Post အသေးစိတ်များကို တင်၍မရပါ။</p>';
    }
});
