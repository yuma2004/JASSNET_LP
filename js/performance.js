/* ==========================================================================
   Performance Optimization & Lazy Loading
   ========================================================================== */

// Performance optimization utilities
const Performance = {
  // Lazy load images
  initLazyLoading: function() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        img.classList.add('loaded');
      });
    }
  },
  
  // Preload critical resources
  preloadResources: function() {
    const criticalResources = [
      // Add critical CSS/JS files here
      './css/variables.css',
      './css/base.css',
      './css/layout.css'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      link.href = resource;
      document.head.appendChild(link);
    });
  },
  
  // Monitor performance metrics
  monitorPerformance: function() {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        console.log('LCP:', lcpEntry.startTime);
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Monitor First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
      
      // Monitor Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS:', clsValue);
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  },
  
  // Optimize animations for performance
  optimizeAnimations: function() {
    // Reduce animations on low-end devices
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                          navigator.deviceMemory <= 4;
    
    if (isLowEndDevice) {
      document.documentElement.classList.add('reduced-motion');
    }
    
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
      const animations = document.querySelectorAll('.animated, [class*="animate-"]');
      animations.forEach(element => {
        if (document.hidden) {
          element.style.animationPlayState = 'paused';
        } else {
          element.style.animationPlayState = 'running';
        }
      });
    });
  },
  
  // Critical resource hints
  addResourceHints: function() {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//cdn.tailwindcss.com' },
      { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
    ];
    
    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
      document.head.appendChild(link);
    });
  },
  
  // Bundle splitting for better caching
  loadModules: async function() {
    try {
      // Dynamically import non-critical modules
      const { default: Analytics } = await import('./analytics.js');
      const { default: Interactions } = await import('./interactions.js');
      
      // Initialize modules
      Analytics.init();
      Interactions.init();
    } catch (error) {
      console.warn('Failed to load optional modules:', error);
    }
  }
};

// Service Worker registration for caching
const ServiceWorker = {
  register: function() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }
};

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
  Performance.addResourceHints();
  Performance.initLazyLoading();
  Performance.optimizeAnimations();
  Performance.monitorPerformance();
  ServiceWorker.register();
  
  // Load non-critical modules after initial render
  setTimeout(() => {
    Performance.loadModules();
  }, 1000);
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Performance, ServiceWorker };
}
