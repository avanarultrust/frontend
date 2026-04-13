import { API_URL } from './config.js';

// ===== Project Detail Page Logic =====

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  if (!projectId) {
    showError();
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/projects/${projectId}`);
    
    if (!response.ok) {
      showError();
      return;
    }

    const project = await response.json();
    renderProject(project);

  } catch (error) {
    console.error('Error fetching project:', error);
    showError();
  }
});

function showError() {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('error-state').style.display = 'block';
}

function renderProject(project) {
  // Hide loading, show content
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('project-content').style.display = 'block';

  // Update page title
  document.title = `${project.title} | Avanarul Trust`;

  // Hero
  const heroImgPath = project.images[0] || 'https://images.unsplash.com/photo-1541339905195-4360e7746c70?auto=format&fit=crop&w=1920&q=80';
  const heroImg = heroImgPath.startsWith('http') ? heroImgPath : `${API_URL}${heroImgPath}`;
  document.getElementById('hero-image').src = heroImg;
  document.getElementById('hero-image').alt = project.title;
  document.getElementById('project-title').textContent = project.title;

  // Date
  const dateFormatted = new Date(project.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  document.getElementById('project-date').querySelector('span').textContent = dateFormatted;
  document.getElementById('meta-date').textContent = dateFormatted;

  // Photos count
  document.getElementById('meta-photos').textContent = `${project.images.length} Photo${project.images.length !== 1 ? 's' : ''}`;

  // Description
  document.getElementById('project-description').textContent = project.description;

  // Gallery
  const galleryGrid = document.getElementById('gallery-grid');
  const gallerySection = document.getElementById('gallery-section');

  if (project.images.length === 0) {
    gallerySection.style.display = 'none';
    return;
  }

  galleryGrid.innerHTML = project.images.map((img, index) => `
    <div class="gallery-item" onclick="openLightbox(${index})">
      <img src="${img.startsWith('http') ? img : `${API_URL}${img}`}" alt="${project.title} - Photo ${index + 1}" loading="lazy">
      <div class="gallery-item-overlay">
        <i class="fas fa-search-plus"></i>
      </div>
    </div>
  `).join('');

  // Setup Lightbox
  setupLightbox(project.images);
}

// ===== LIGHTBOX =====
let currentImages = [];
let currentIndex = 0;

function setupLightbox(images) {
  currentImages = images;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const counter = document.getElementById('lightbox-counter');

  // Close
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Navigation
  document.getElementById('lightbox-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
  });

  document.getElementById('lightbox-next').addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(1);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox(index) {
  currentIndex = index;
  const lightbox = document.getElementById('lightbox');
  const imgSrc = currentImages[currentIndex];
  document.getElementById('lightbox-img').src = imgSrc.startsWith('http') ? imgSrc : `${API_URL}${imgSrc}`;
  document.getElementById('lightbox-counter').textContent = `${currentIndex + 1} / ${currentImages.length}`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
  const imgSrc = currentImages[currentIndex];
  document.getElementById('lightbox-img').src = imgSrc.startsWith('http') ? imgSrc : `${API_URL}${imgSrc}`;
  document.getElementById('lightbox-counter').textContent = `${currentIndex + 1} / ${currentImages.length}`;
}

// Expose to window for inline onclick
window.openLightbox = openLightbox;
