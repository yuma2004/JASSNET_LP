/* ==========================================================================
   JASSNET LP - Main JavaScript Controller
   ========================================================================== */

// Core functionality moved to modular files:
// - js/tracking.js - Conversion and tracking scripts
// - js/ui.js - UI components and interactions  
// - js/performance.js - Performance optimization

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('JASSNET LP initialized');
  
  // Add any global functionality here
  initializeGlobalFeatures();
});

function initializeGlobalFeatures() {
  // Add global event listeners or features that need to be in the main file
  
  // Example: Global error handling
  window.addEventListener('error', function(e) {
    console.warn('Global error:', e.error);
  });
  
  // Example: Global click tracking
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('track-click')) {
      // Send tracking event
      console.log('Tracked click:', e.target);
    }
  });
}
(function acsKeep() {
  const PK = "p";
  const IMK = "im";
  const LKEYS = { 
    cid: ["cid", "CL_", "ACT_"], 
    gclid: ["plid", "PL_", "APT_"] 
  };
  const DKEYS = ["gclid", "msclkid", "fbclid", "yclid", "ttclid", "ldtag_cl", "msi"];
  const PDIR = "./";
  const durl = "https://jass-net.com/direct.php";
  
  function saveCookies(data) {
    const p = data[PK];
    const out = Object.keys(LKEYS).reduce(function(ret, k) {
      if (k in data && data[k]) ret[k] = data[k];
      return ret;
    }, {});
    
    if (!p || !Object.keys(out).length) return;
    
    let purl = PDIR + "lptag.php?p=" + p;
    Object.keys(out).forEach(function(k) {
      purl += "&" + LKEYS[k][0] + "=" + out[k];
      localStorage.setItem(LKEYS[k][1] + p, out[k]);
    });
    
    const xhr = new XMLHttpRequest();
    const args = "; expires=" + new Date(new Date().getTime() + 63072000000).toUTCString() + "; path=/; SameSite=None; Secure";
    
    xhr.open("GET", purl);
    xhr.onloadend = function() {
      if (xhr.status === 200 && xhr.response === "") {
        window.acs_cbs.forEach(function(cb) { cb(); });
        return;
      }
      
      Object.keys(out).forEach(function(k) {
        document.cookie = LKEYS[k][1] + p + "=" + decodeURIComponent(out[k]) + args;
        if (LKEYS[k][2]) {
          document.cookie = LKEYS[k][2] + p + "=js" + args;
        }
      });
      
      window.acs_cbs.forEach(function(cb) { cb(); });
    };
    
    xhr.send();
  }
  
  // Parse URL parameters
  const data = location.search.substring(1).split("&").reduce(function(ret, s) {
    const kv = s.split("=");
    if (kv[1]) ret[kv[0]] = kv[1];
    return ret;
  }, {});
  
  if (!(IMK in data)) {
    saveCookies(data);
    return;
  }
  
  let directUrl = durl + "?im=" + data[IMK] + "&navi=" + performance.navigation.type;
  DKEYS.forEach(function(k) {
    if (!(k in data)) return;
    directUrl += "&" + k + "=" + data[k];
  });
  
  const xhr = new XMLHttpRequest();
  xhr.open("GET", directUrl);
  
  function merge(a, b) {
    return Object.keys(LKEYS).reduce(function(ret, k) {
      if (k in b && !(k in a)) ret[k] = b[k];
      return ret;
    }, a);
  }
  
  xhr.onloadend = function() {
    if (xhr.status !== 200) return;
    try {
      let xhrData = JSON.parse(xhr.responseText);
      if (PK !== "p") {
        xhrData[PK] = xhrData["p"];
      }
      saveCookies(merge(xhrData, data));
    } catch (e) {
      console.error('Error parsing tracking data:', e);
    }
  };
  
  xhr.send();
})();

/* ==========================================================================
   UI Functionality
   ========================================================================== */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeFadeInAnimations();
  initializeAccordion();
  initializeComparisonTable();
  initializeTimelineAnimations();
});

// Modern Fade-in Animation Observer
function initializeFadeInAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in-modern, .slide-in-left, .slide-in-right, .scale-in');
  
  if (!fadeElements.length) return;
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
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
      }
    });
  }, { 
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  timelineItems.forEach(element => {
    observer.observe(element);
  });
}

// Modern Accordion Functionality
function initializeAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item-modern');

  accordionItems.forEach(item => {
    const button = item.querySelector('.accordion-button-modern');
    const arrow = item.querySelector('.accordion-arrow-modern');

    if (!button || !arrow) return;

    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all accordions
      accordionItems.forEach(accItem => {
        accItem.classList.remove('active');
        const accArrow = accItem.querySelector('.accordion-arrow-modern');
        if (accArrow) {
          accArrow.classList.remove('rotate-180');
        }
      });

      // If the clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
        arrow.classList.add('rotate-180');
      }
    });
  });
}

// Comparison Table Toggle
function initializeComparisonTable() {
  const comparisonLink = document.querySelector('a[href="#comparison"]');
  const comparisonTable = document.getElementById('comparison');

  if (!comparisonLink || !comparisonTable) return;

  // Hide comparison table initially
  comparisonTable.style.display = 'none';

  comparisonLink.addEventListener('click', (e) => {
    e.preventDefault();

    // Toggle table display
    if (comparisonTable.style.display === 'none') {
      comparisonTable.style.display = 'block';
      comparisonTable.scrollIntoView({ behavior: 'smooth' });
    } else {
      comparisonTable.style.display = 'none';
    }
  });
}

/* ==========================================================================
   Utility Functions
   ========================================================================== */

// Smooth scroll to element
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Track button clicks (for analytics)
function trackButtonClick(buttonName) {
  // Add your analytics tracking code here
  console.log('Button clicked:', buttonName);
  
  // Example: Google Analytics 4 event tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'click', {
      'event_category': 'CTA',
      'event_label': buttonName
    });
  }
}

// Initialize callback array for conversion scripts
window.acs_cbs = window.acs_cbs || [];

// Responsive utilities and mobile detection
const ResponsiveUtils = {
  // Breakpoints (matching CSS)
  breakpoints: {
    xs: 360,
    sm: 480,
    md: 640,
    lg: 768,
    xl: 1024,
    xxl: 1200
  },
  
  // Get current breakpoint
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width <= this.breakpoints.xs) return 'xs';
    if (width <= this.breakpoints.sm) return 'sm';
    if (width <= this.breakpoints.md) return 'md';
    if (width <= this.breakpoints.lg) return 'lg';
    if (width <= this.breakpoints.xl) return 'xl';
    if (width <= this.breakpoints.xxl) return 'xxl';
    return 'desktop';
  },
  
  // Check if mobile
  isMobile() {
    return window.innerWidth <= this.breakpoints.lg;
  },
  
  // Check if tablet
  isTablet() {
    return window.innerWidth > this.breakpoints.lg && window.innerWidth <= this.breakpoints.xl;
  },
  
  // Check if desktop
  isDesktop() {
    return window.innerWidth > this.breakpoints.xl;
  },
  
  // Throttled resize handler
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
};

// Mobile optimization functions
const MobileOptimization = {
  init() {
    this.optimizeForMobile();
    this.handleOrientationChange();
    this.optimizeScrolling();
    this.handleTouch();
  },
  
  optimizeForMobile() {
    if (ResponsiveUtils.isMobile()) {
      // Reduce particle count on mobile
      const particles = document.querySelectorAll('.particle');
      particles.forEach((particle, index) => {
        if (index > 3) {
          particle.style.display = 'none';
        }
      });
      
      // Optimize animations for mobile
      document.body.classList.add('mobile-optimized');
      
      // Lazy load images
      this.lazyLoadImages();
    }
  },
  
  handleOrientationChange() {
    window.addEventListener('orientationchange', ResponsiveUtils.throttle(() => {
      // Adjust layout after orientation change
      setTimeout(() => {
        this.adjustLayoutForOrientation();
      }, 100);
    }, 250));
  },
  
  adjustLayoutForOrientation() {
    const isLandscape = window.orientation === 90 || window.orientation === -90;
    document.body.classList.toggle('landscape', isLandscape);
    
    if (isLandscape && ResponsiveUtils.isMobile()) {
      // Reduce hero section height in landscape
      const heroSection = document.querySelector('.hero-unified');
      if (heroSection) {
        heroSection.style.minHeight = '100vh';
      }
    }
  },
  
  optimizeScrolling() {
    // Passive scroll listeners for better performance
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollElements();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  },
  
  updateScrollElements() {
    // Parallax effect for desktop only
    if (ResponsiveUtils.isDesktop()) {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.hero-particles .particle');
      
      parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.1;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }
  },
  
  handleTouch() {
    // Improve touch interactions
    document.addEventListener('touchstart', (e) => {
      if (e.target.closest('.cta-button-unified, .cta-button-modern, .cta-button-small')) {
        e.target.style.transform = 'scale(0.95)';
      }
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      if (e.target.closest('.cta-button-unified, .cta-button-modern, .cta-button-small')) {
        setTimeout(() => {
          e.target.style.transform = '';
        }, 150);
      }
    }, { passive: true });
  },
  
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }
};

// Table responsiveness
const TableResponsive = {
  init() {
    this.makeTablesResponsive();
    this.handleTableScroll();
  },
  
  makeTablesResponsive() {
    const tables = document.querySelectorAll('.comparison-table');
    tables.forEach(table => {
      this.addScrollIndicators(table);
    });
  },
  
  addScrollIndicators(table) {
    const wrapper = table.closest('.comparison-table-wrapper');
    if (!wrapper) return;
    
    // Add scroll indicators
    const leftIndicator = document.createElement('div');
    leftIndicator.className = 'scroll-indicator scroll-indicator-left';
    leftIndicator.innerHTML = '←';
    
    const rightIndicator = document.createElement('div');
    rightIndicator.className = 'scroll-indicator scroll-indicator-right';
    rightIndicator.innerHTML = '→';
    
    wrapper.appendChild(leftIndicator);
    wrapper.appendChild(rightIndicator);
    
    this.updateScrollIndicators(wrapper);
    
    wrapper.addEventListener('scroll', () => {
      this.updateScrollIndicators(wrapper);
    });
  },
  
  updateScrollIndicators(wrapper) {
    const leftIndicator = wrapper.querySelector('.scroll-indicator-left');
    const rightIndicator = wrapper.querySelector('.scroll-indicator-right');
    
    if (!leftIndicator || !rightIndicator) return;
    
    const scrollLeft = wrapper.scrollLeft;
    const scrollWidth = wrapper.scrollWidth;
    const clientWidth = wrapper.clientWidth;
    
    leftIndicator.style.opacity = scrollLeft > 0 ? '1' : '0';
    rightIndicator.style.opacity = scrollLeft < scrollWidth - clientWidth ? '1' : '0';
  },
  
  handleTableScroll() {
    // Smooth scrolling for table navigation
    document.querySelectorAll('[data-scroll-to]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(button.dataset.scrollTo);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }
};

// Initialize responsive features
document.addEventListener('DOMContentLoaded', () => {
  MobileOptimization.init();
  TableResponsive.init();
  
  // Handle window resize
  window.addEventListener('resize', ResponsiveUtils.throttle(() => {
    MobileOptimization.optimizeForMobile();
    TableResponsive.makeTablesResponsive();
  }, 250));
});
