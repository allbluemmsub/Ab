// Get id from URL query
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const postDetailContainer = document.getElementById('postDetail');

async function loadPostDetail(id) {
  try {
    const res = await fetch('posts.json');
    const posts = await res.json();
    const post = posts.find(p => p.id == id);

    if(!post) {
      postDetailContainer.innerHTML = '<p>ရုပ်ရှင် မတွေ့ပါ။</p>';
      return;
    }

    postDetailContainer.innerHTML = `
      <a href="index.html" class="back-to-home">&larr; နောက်သို့</a>
      <img src="${post.image}" alt="${post.title}" class="main-detail-photo" />
      <h2>${post.title}</h2>
      <div class="actor-name-detail">${post.actor}</div>
      <div class="duration-overlay" style="position:static; margin: 10px auto;">${post.duration}</div>

      <div class="detail-buttons-container">
        <div class="dropdown play-dropdown dropdown">
          <a
