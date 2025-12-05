/**
 * Peri Peri Grill - Menu JavaScript
 * Handles Instagram/TikTok-style video grid with swipe navigation and transitions
 */

(function() {
    'use strict';

    // Get modal elements
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalClose = document.querySelector('.modal-close-fullscreen');
    const modalDishName = document.getElementById('modalDishName');
    const modalPrice = document.getElementById('modalPrice');
    const modalDescription = document.getElementById('modalDescription');
    const modalCategoryName = document.getElementById('modalCategoryName');

    // Get all grid items
    const gridItems = Array.from(document.querySelectorAll('.grid-item'));

    // Current item index
    let currentIndex = 0;

    // Swipe tracking
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // First time flag for swipe hint
    let isFirstTime = !localStorage.getItem('peri-peri-swipe-seen');

    /**
     * Show swipe hint on first use
     */
    function showSwipeHint() {
        if (!isFirstTime) return;

        const hint = document.createElement('div');
        hint.className = 'swipe-hint';
        hint.innerHTML = `
            <div class="swipe-hint-content">
                <span class="swipe-arrow">←</span>
                <span class="swipe-text">Swipe to see more</span>
                <span class="swipe-arrow">→</span>
            </div>
        `;
        videoModal.appendChild(hint);

        // Fade out after 3 seconds
        setTimeout(() => {
            hint.classList.add('fade-out');
            setTimeout(() => {
                if (hint.parentNode) {
                    hint.parentNode.removeChild(hint);
                }
            }, 500);
        }, 3000);

        // Mark as seen
        localStorage.setItem('peri-peri-swipe-seen', 'true');
        isFirstTime = false;
    }

    /**
     * Load dish data into modal with quick fade transition
     * @param {number} index - Index of the grid item to display
     * @param {string} direction - 'left' or 'right' for slide direction (not used in simple version)
     */
    function loadDish(index, direction = 'none') {
        if (index < 0 || index >= gridItems.length) return;

        currentIndex = index;
        const gridItem = gridItems[index];

        // Get dish data
        const videoSrc = gridItem.getAttribute('data-video');
        const dishName = gridItem.getAttribute('data-dish-name');
        const price = gridItem.getAttribute('data-price');
        const description = gridItem.getAttribute('data-description');
        const category = gridItem.getAttribute('data-category');

        if (direction === 'none') {
            // Initial load - no animation
            if (modalVideo && videoSrc) {
                modalVideo.src = videoSrc;
                modalVideo.load();
                modalVideo.play().catch(err => console.log('Autoplay prevented:', err));
            }
        } else {
            // Quick fade transition
            if (modalVideo && videoSrc) {
                // Fade out quickly
                modalVideo.style.opacity = '0';

                // Wait for fade, then change video
                setTimeout(() => {
                    modalVideo.src = videoSrc;
                    modalVideo.load();
                    modalVideo.play().catch(err => console.log('Autoplay prevented:', err));

                    // Fade back in
                    modalVideo.style.opacity = '1';
                }, 150); // Short 150ms fade
            }
        }

        // Update text info
        if (modalDishName) modalDishName.textContent = dishName;
        if (modalPrice) modalPrice.textContent = price;
        if (modalDescription) modalDescription.textContent = description;

        // Update category name badge
        if (modalCategoryName && category) {
            modalCategoryName.textContent = category;
        }
    }

    /**
     * Navigate to next dish with left slide
     */
    function nextDish() {
        if (currentIndex < gridItems.length - 1) {
            loadDish(currentIndex + 1, 'left');
        }
    }

    /**
     * Navigate to previous dish with right slide
     */
    function prevDish() {
        if (currentIndex > 0) {
            loadDish(currentIndex - 1, 'right');
        }
    }

    /**
     * Open fullscreen video modal
     * @param {number} index - Index of the grid item clicked
     */
    function openVideoModal(index) {
        if (!videoModal) return;

        currentIndex = index;
        loadDish(index, 'none');

        // Show the modal
        videoModal.classList.add('active');

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Show swipe hint on first use
        if (isFirstTime) {
            setTimeout(showSwipeHint, 500);
        }
    }

    /**
     * Close fullscreen video modal
     */
    function closeVideoModal() {
        if (!videoModal) return;

        // Pause and reset video
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.currentTime = 0;
            modalVideo.style.opacity = '1'; // Reset opacity
        }

        // Hide the modal
        videoModal.classList.remove('active');

        // Restore body scroll
        document.body.style.overflow = '';
    }

    /**
     * Handle touch start
     */
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }

    /**
     * Handle touch end - detect swipe direction
     */
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }

    /**
     * Determine swipe direction and navigate
     */
    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const minSwipeDistance = 50;

        // Check if horizontal swipe is dominant
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - previous dish
                prevDish();
            } else {
                // Swipe left - next dish
                nextDish();
            }
        }
    }

    /**
     * Check for deep link hash and scroll to specific category section
     */
    function checkDeepLink() {
        const hash = window.location.hash.substring(1); // Remove the '#'
        if (!hash) return;

        // Find the category section by ID
        const categorySection = document.getElementById(hash);
        if (categorySection) {
            // Scroll to the category section after a short delay
            setTimeout(() => {
                categorySection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    /**
     * Initialize event listeners
     */
    function init() {
        // Add click listeners to all grid items
        gridItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                openVideoModal(index);
            });
        });

        // Close modal when close button is clicked
        if (modalClose) {
            modalClose.addEventListener('click', closeVideoModal);
        }

        // Touch events for swipe
        if (videoModal) {
            videoModal.addEventListener('touchstart', handleTouchStart, { passive: true });
            videoModal.addEventListener('touchend', handleTouchEnd, { passive: true });

            // Mouse events for desktop testing
            let mouseDown = false;
            videoModal.addEventListener('mousedown', (e) => {
                if (e.target === videoModal) return; // Only swipe on modal background
                mouseDown = true;
                touchStartX = e.screenX;
                touchStartY = e.screenY;
            });

            videoModal.addEventListener('mouseup', (e) => {
                if (mouseDown) {
                    touchEndX = e.screenX;
                    touchEndY = e.screenY;
                    handleSwipe();
                    mouseDown = false;
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!videoModal || !videoModal.classList.contains('active')) return;

            if (e.key === 'ArrowLeft') {
                prevDish();
            } else if (e.key === 'ArrowRight') {
                nextDish();
            } else if (e.key === 'Escape') {
                closeVideoModal();
            }
        });
    }

    /**
     * Set video thumbnails to show last frame
     */
    function setVideoThumbnails() {
        const thumbnails = document.querySelectorAll('.grid-thumbnail');

        thumbnails.forEach(video => {
            // Skip if video has a poster attribute (custom thumbnail already set)
            if (video.hasAttribute('poster')) return;

            // Wait for metadata to load
            video.addEventListener('loadedmetadata', function() {
                // Seek to last frame (slightly before end to avoid black frame)
                this.currentTime = Math.max(0, this.duration - 0.1);
            });

            // If metadata is already loaded
            if (video.readyState >= 1) {
                video.currentTime = Math.max(0, video.duration - 0.1);
            }
        });
    }

    /**
     * Populate dish name overlays from data attributes
     */
    function populateDishNames() {
        const gridItems = document.querySelectorAll('.grid-item');

        gridItems.forEach(item => {
            const dishName = item.getAttribute('data-dish-name');
            const overlay = item.querySelector('.dish-name-overlay');

            if (dishName && overlay) {
                overlay.textContent = dishName;
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            setVideoThumbnails();
            // Delay for mobile browsers to ensure DOM is fully rendered
            setTimeout(populateDishNames, 100);
            // Check for deep link after initialization
            checkDeepLink();
        });
    } else {
        init();
        setVideoThumbnails();
        // Delay for mobile browsers to ensure DOM is fully rendered
        setTimeout(populateDishNames, 100);
        // Check for deep link after initialization
        checkDeepLink();
    }

})();
