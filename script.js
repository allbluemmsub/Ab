const postsPerPage = 6;
let currentPage = 1;
let posts = [];
let filteredPosts = [];

const postsGrid = document.getElementById('posts-grid');
const paginationControls = document.getElementById('pagination-controls');
const searchInput = document.getElementById('searchInput');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const closeSidebarBtn = document.getElementById('closeSidebar');

menuBtn.addEventListener('click', () => {
  sidebar.style.width = '250px';
});
closeSidebarBtn.addEventListener('click', () => {
  sidebar.style.width = '0';
});

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm) ||
    p.actor.toLowerCase().includes(searchTerm)
  );
  currentPage = 1;
  renderPosts();
  renderPagination();
});

async function loadPosts() {
  try {
    const res = await fetch('posts.json');
    posts = await res.json();
    // Newest first
    posts.reverse();
    filteredPosts = posts;
    renderPosts();
    renderPagination();
  } catch (error) {
    postsGrid.innerHTML = `<p>အချက်အလက်တွေ တင်ရန် အခက်အခဲရှိပါတယ်။</p>`;
  }
}

function renderPosts() {
  postsGrid.innerHTML = '';
  if(filteredPosts.length === 0) {
    postsGrid.innerHTML = `<p>မတွေ့ပါ။</p>`;
    return;
  }
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pagePosts = filteredPosts.slice(start, end);

  pagePosts.forEach(post => {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';

    postCard.innerHTML = `
      <div class="duration-overlay">${post.duration}</div>
      <img src="${post.image}" alt="${post.title}" onclick="location.href='post.html?id=${post.id}'" />
      <h3>${post.title}</h3>
      <div class="actor-name">${post.actor}</div>
    `;
    postsGrid.appendChild(postCard);
  });
}

function renderPagination() {
  paginationControls.innerHTML = '';

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  if(totalPages <= 1) return;

  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'နောက်သို့';
  prevBtn.className = 'page-button';
  if(currentPage === 1) {
    prevBtn.classList.add('disabled');
    prevBtn.disabled = true;
  }
  prevBtn.addEventListener('click', () => {
    if(currentPage > 1) {
      currentPage--;
      renderPosts();
      renderPagination();
      window.scrollTo(0,0);
    }
  });
  paginationControls.appendChild(prevBtn);

  // Page numbers
  for(let i=1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.className = 'page-button';
    if(i === currentPage) {
      pageBtn.classList.add('active');
    }
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderPosts();
      renderPagination();
      window.scrollTo(0,0);
    });
    paginationControls.appendChild(pageBtn);
  }

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'ရှေ့သို့';
  nextBtn.className = 'page-button';
  if(currentPage === totalPages) {
    nextBtn.classList.add('disabled');
    nextBtn.disabled = true;
  }
  nextBtn.addEventListener('click', () => {
    if(currentPage < totalPages) {
      currentPage++;
      renderPosts();
      renderPagination();
      window.scrollTo(0,0);
    }
  });
  paginationControls.appendChild(nextBtn);
}

loadPosts();
