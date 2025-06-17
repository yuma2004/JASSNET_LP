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
