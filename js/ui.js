/* ==========================================================================
   UI Components and Interactions
   ========================================================================== */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeFadeInAnimations();
  initializeAccordion();
  initializeComparisonTable();
  initializeTimelineAnimations();
  initializeResponsiveHelpers();
});

// Modern Fade-in Animation Observer
function initializeFadeInAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in-modern, .slide-in-left, .slide-in-right, .scale-in');
  
  if (!fadeElements.length) return;
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Add stagger effect for multiple elements
        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
        entry.target.style.animationDelay = `${delay}ms`;
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

// Timeline Animation Observer
function initializeTimelineAnimations() {
  const timelineItems = document.querySelectorAll('.timeline-item-modern');
  
  if (!timelineItems.length) return;
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Add counter animation if number element exists
        const numberElement = entry.target.querySelector('.timeline-number-modern');
        if (numberElement && !numberElement.classList.contains('animated')) {
          animateNumber(numberElement);
          numberElement.classList.add('animated');
        }
      }
    });
  }, { 
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  timelineItems.forEach(item => {
    observer.observe(item);
  });
}

// Animated number counter
function animateNumber(element) {
  const finalNumber = parseInt(element.textContent);
  let currentNumber = 0;
  const increment = finalNumber / 30; // 30 frames
  const timer = setInterval(() => {
    currentNumber += increment;
    if (currentNumber >= finalNumber) {
      currentNumber = finalNumber;
      clearInterval(timer);
    }
    element.textContent = Math.floor(currentNumber);
  }, 50);
}

// Accordion functionality
function initializeAccordion() {
  const accordionButtons = document.querySelectorAll('.accordion-button-modern');
  
  accordionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const item = this.closest('.accordion-item-modern');
      const content = item.querySelector('.accordion-content-modern');
      const arrow = this.querySelector('.accordion-arrow-modern');
      
      // Toggle current item
      const isActive = item.classList.contains('active');
      
      // Close all accordion items in the same group
      const accordionGroup = item.closest('.faq-container-modern');
      if (accordionGroup) {
        accordionGroup.querySelectorAll('.accordion-item-modern').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.accordion-content-modern');
            const otherArrow = otherItem.querySelector('.accordion-arrow-modern');
            if (otherContent) otherContent.style.maxHeight = null;
            if (otherArrow) otherArrow.style.transform = 'rotate(0deg)';
          }
        });
      }
      
      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      }
    });
  });
}

// Comparison table functionality
function initializeComparisonTable() {
  const tableWrapper = document.querySelector('.comparison-table-wrapper');
  const table = document.querySelector('.comparison-table');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  
  if (!tableWrapper || !table) return;
  
  // Update scroll indicator
  function updateScrollIndicator() {
    if (!scrollIndicator) return;
    
    const scrollLeft = tableWrapper.scrollLeft;
    const scrollWidth = tableWrapper.scrollWidth - tableWrapper.clientWidth;
    const percentage = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
    
    scrollIndicator.style.width = percentage + '%';
  }
  
  // Add scroll event listener
  tableWrapper.addEventListener('scroll', updateScrollIndicator);
  
  // Initialize scroll indicator
  updateScrollIndicator();
  
  // Add touch scroll support for mobile
  let isScrolling = false;
  
  tableWrapper.addEventListener('touchstart', function() {
    isScrolling = true;
  });
  
  tableWrapper.addEventListener('touchend', function() {
    setTimeout(() => {
      isScrolling = false;
    }, 100);
  });
  
  // Prevent text selection while scrolling on mobile
  tableWrapper.addEventListener('touchmove', function(e) {
    if (isScrolling) {
      e.preventDefault();
    }
  });
}

// Responsive helpers
function initializeResponsiveHelpers() {
  // Mobile menu toggle (if exists)
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      this.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      mobileMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
    }
  });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Recalculate comparison table scroll indicator
      const tableWrapper = document.querySelector('.comparison-table-wrapper');
      if (tableWrapper) {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
          const scrollLeft = tableWrapper.scrollLeft;
          const scrollWidth = tableWrapper.scrollWidth - tableWrapper.clientWidth;
          const percentage = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
          scrollIndicator.style.width = percentage + '%';
        }
      }
        // Update accordion heights
      const activeAccordions = document.querySelectorAll('.accordion-item-modern.active .accordion-content-modern');
      activeAccordions.forEach(content => {
        content.style.maxHeight = content.scrollHeight + 'px';
      });
    }, 100);
  });
}

// Utility functions
const Utils = {
  // Smooth scroll to element
  scrollTo: function(target, offset = 0) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;
    
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  },
  
  // Debounce function
  debounce: function(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },
  
  // Check if element is in viewport
  isInViewport: function(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
  
  // Get device type
  getDeviceType: function() {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Utils };
}
