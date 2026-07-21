// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu on hamburger click
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (name && email && message) {
            // You can replace this with actual form submission logic
            console.log('Form Data:', { name, email, message });
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
        }
    });
}

// Smooth scroll effect for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

document.querySelectorAll('.gallery-section').forEach((section) => {
    const track = section.querySelector('.gallery-track');
    const prevButton = section.querySelector('.gallery-btn.prev');
    const nextButton = section.querySelector('.gallery-btn.next');

    if (!track || !prevButton || !nextButton) return;

    const getScrollAmount = () => {
        const firstCard = track.querySelector('.gallery-card');
        const gap = parseInt(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '24', 10);
        return firstCard ? firstCard.getBoundingClientRect().width + gap : 320;
    };

    prevButton.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    nextButton.addEventListener('click', () => {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards and other elements
document.querySelectorAll('.project-card, .skills-list li').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// ARTWORK MODAL FUNCTIONALITY
// ============================================

const modal = document.getElementById('artworkModal');
const modalClose = document.querySelector('.modal-close');
const modalImage = document.getElementById('modalImage');
const modalPrev = document.querySelector('.modal-prev');
const modalNext = document.querySelector('.modal-next');
const modalThumbnails = document.getElementById('modalThumbnails');

let galleryImages = [];
let currentImageIndex = 0;

function toggleGalleryControls(show) {
    if (!modalPrev || !modalNext || !modalThumbnails) return;
    modalPrev.style.display = show ? 'block' : 'none';
    modalNext.style.display = show ? 'block' : 'none';
    modalThumbnails.style.display = show ? 'flex' : 'none';
}

function renderThumbnails() {
    modalThumbnails.innerHTML = '';

    galleryImages.forEach((src, index) => {
        const thumbButton = document.createElement('button');
        thumbButton.className = `modal-thumbnail${index === currentImageIndex ? ' active' : ''}`;
        thumbButton.type = 'button';
        thumbButton.innerHTML = `<img src="${src}" alt="Thumbnail ${index + 1}">`;
        thumbButton.addEventListener('click', () => {
            currentImageIndex = index;
            updateModalImage();
        });
        modalThumbnails.appendChild(thumbButton);
    });
}

function openArtworkModal(card) {
    const fallbackImage = card.querySelector('.project-image img');
    const imageList = (card.dataset.images || '')
        .split(',')
        .map((src) => src.trim())
        .filter(Boolean);

    if (imageList.length === 0 && fallbackImage) {
        galleryImages = [fallbackImage.getAttribute('src')];
    } else {
        galleryImages = imageList;
    }

    modalImage.classList.toggle('ending-soon-preview', card.classList.contains('ending-soon-card'));

    currentImageIndex = 0;
    updateModalImage();

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Make every non-website card clickable, but only cards with a gallery list will show multi-image controls
const allCardButtons = document.querySelectorAll('.project-card:not(.website-card)');
allCardButtons.forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openArtworkModal(card));
});

// Allow the See more buttons inside gallery cards to open the modal without triggering the card click
document.querySelectorAll('.see-more-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
        event.stopPropagation();
        const card = button.closest('.project-card');
        if (card) {
            openArtworkModal(card);
        }
    });
});

function updateModalImage() {
    if (!galleryImages.length) return;

    const imageSrc = galleryImages[currentImageIndex];
    modalImage.src = imageSrc;
    modalImage.alt = 'Artwork preview';
    renderThumbnails();
    toggleGalleryControls(galleryImages.length > 1);
}

modalPrev.addEventListener('click', () => {
    if (!galleryImages.length) return;
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateModalImage();
});

modalNext.addEventListener('click', () => {
    if (!galleryImages.length) return;
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateModalImage();
});

// Close modal function
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    toggleGalleryControls(false);
}

// Close modal when clicking close button
modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});
