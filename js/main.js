/* ============================================
   THE VILLS GROUP - MAIN JAVASCRIPT
   Core functionality and utilities
   ============================================ */

// Utility functions
const utils = {
  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Check if element is in viewport
  isInViewport: (element, offset = 0) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= -offset &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
  
  // Smooth scroll to element
  scrollTo: (target, offset = 80) => {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;
    
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  },
  
  // Format number with commas
  formatNumber: (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

// Form validation
const forms = {
  validate: (form) => {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
      
      // Email validation
      if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          isValid = false;
          input.classList.add('error');
        }
      }
      
      // Phone validation
      if (input.type === 'tel' && input.value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(input.value)) {
          isValid = false;
          input.classList.add('error');
        }
      }
    });
    
    return isValid;
  },
  
  init: () => {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!forms.validate(form)) {
          e.preventDefault();
        }
      });
      
      // Clear error on input
      form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', () => {
          input.classList.remove('error');
        });
      });
    });
  }
};

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        utils.scrollTo(target);
      }
    });
  });
}

// Lazy loading for images
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
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

// Active nav link highlighting
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  
  if (!sections.length || !navLinks.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.5 });
  
  sections.forEach(section => observer.observe(section));
}

// Copy to clipboard
function initCopyToClipboard() {
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
      const text = el.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        const original = el.textContent;
        el.textContent = 'Copied!';
        setTimeout(() => el.textContent = original, 2000);
      });
    });
  });
}

// Initialize all on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  forms.init();
  initSmoothScroll();
  initLazyLoading();
  initActiveNavLink();
  initCopyToClipboard();
  
  // Console greeting
  console.log('%c The Vills Group ', 'background: linear-gradient(135deg, #2563EB, #1B3A6B); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
  console.log('%c Premium HR & Outsourcing Solutions ', 'color: #94A3B8; font-size: 14px;');
});

// Handle window resize
window.addEventListener('resize', utils.debounce(() => {
  // Reinitialize components that need resize handling
  if (window.particleSystem) {
    window.particleSystem.resize();
  }
}, 250));

// Export utilities for use in other scripts
window.TVGUtils = utils;
window.TVGForms = forms;
