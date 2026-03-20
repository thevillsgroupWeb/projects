/* ============================================
   GSAP ANIMATION SYSTEM
   Scroll-triggered animations with IntersectionObserver
   ============================================ */

// Check if GSAP is loaded
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

class AnimationSystem {
  constructor() {
    this.observers = [];
    this.init();
  }
  
  init() {
    this.initScrollAnimations();
    this.initCounterAnimations();
    this.initHeroAnimations();
    this.initStaggerAnimations();
  }
  
  /* ============================================
     SCROLL-TRIGGERED ANIMATIONS
     ============================================ */
  
  initScrollAnimations() {
    // Fade up animation
    document.querySelectorAll('[data-animate="fade-up"]').forEach(el => {
      this.observeElement(el, (element) => {
        gsap.fromTo(element, 
          { y: 60, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            ease: 'power2.out',
            clearProps: 'transform'
          }
        );
      });
    });
    
    // Fade in animation
    document.querySelectorAll('[data-animate="fade-in"]').forEach(el => {
      this.observeElement(el, (element) => {
        gsap.fromTo(element,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: 'power2.out' }
        );
      });
    });
    
    // Slide from left
    document.querySelectorAll('[data-animate="slide-left"]').forEach(el => {
      this.observeElement(el, (element) => {
        gsap.fromTo(element,
          { x: -80, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
        );
      });
    });
    
    // Slide from right
    document.querySelectorAll('[data-animate="slide-right"]').forEach(el => {
      this.observeElement(el, (element) => {
        gsap.fromTo(element,
          { x: 80, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
        );
      });
    });
    
    // Scale animation
    document.querySelectorAll('[data-animate="scale"]').forEach(el => {
      this.observeElement(el, (element) => {
        gsap.fromTo(element,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
        );
      });
    });
    
    // Glass blur animation
    document.querySelectorAll('[data-animate="glass"]').forEach(el => {
      this.observeElement(el, (element) => {
        gsap.fromTo(element,
          { y: 60, opacity: 0, backdropFilter: 'blur(0px)' },
          { 
            y: 0, 
            opacity: 1, 
            backdropFilter: 'blur(40px)',
            duration: 0.8, 
            ease: 'power2.out'
          }
        );
      });
    });
  }
  
  /* ============================================
     COUNTER ANIMATIONS
     ============================================ */
  
  initCounterAnimations() {
    document.querySelectorAll('[data-counter]').forEach(counter => {
      this.observeElement(counter, (element) => {
        const target = parseInt(element.dataset.counter);
        const suffix = element.dataset.suffix || '';
        const duration = parseFloat(element.dataset.duration) || 2;
        
        gsap.fromTo(element,
          { innerText: 0 },
          {
            innerText: target,
            duration: duration,
            ease: 'power2.out',
            snap: { innerText: 1 },
            onUpdate: function() {
              element.innerText = Math.round(this.targets()[0].innerText) + suffix;
            }
          }
        );
      });
    });
  }
  
  /* ============================================
     HERO ANIMATIONS
     ============================================ */
  
  initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Animate hero text characters
    const heroTitle = hero.querySelector('.hero-title');
    if (heroTitle && typeof gsap !== 'undefined') {
      const text = heroTitle.textContent;
      heroTitle.innerHTML = text.split('').map(char => 
        char === ' ' ? ' ' : `<span class="char">${char}</span>`
      ).join('');
      
      gsap.fromTo(heroTitle.querySelectorAll('.char'),
        { y: 80, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.03,
          ease: 'power2.out',
          delay: 0.3
        }
      );
    }
    
    // Animate hero subtitle
    const heroSubtitle = hero.querySelector('.hero-subtitle');
    if (heroSubtitle && typeof gsap !== 'undefined') {
      gsap.fromTo(heroSubtitle,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.8 }
      );
    }
    
    // Animate hero CTAs
    const heroCtas = hero.querySelector('.hero-ctas');
    if (heroCtas && typeof gsap !== 'undefined') {
      gsap.fromTo(heroCtas.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 1 }
      );
    }
    
    // Animate hero label
    const heroLabel = hero.querySelector('.hero-label');
    if (heroLabel && typeof gsap !== 'undefined') {
      gsap.fromTo(heroLabel,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.1 }
      );
    }
  }
  
  /* ============================================
     STAGGER ANIMATIONS
     ============================================ */
  
  initStaggerAnimations() {
    // Service cards stagger
    document.querySelectorAll('[data-stagger="cards"]').forEach(container => {
      this.observeElement(container, (element) => {
        const cards = element.querySelectorAll('.glass-card');
        if (cards.length && typeof gsap !== 'undefined') {
          gsap.fromTo(cards,
            { y: 60, opacity: 0, scale: 0.95 },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1,
              duration: 0.6, 
              stagger: 0.15,
              ease: 'power2.out'
            }
          );
        }
      });
    });
    
    // Features stagger
    document.querySelectorAll('[data-stagger="features"]').forEach(container => {
      this.observeElement(container, (element) => {
        const features = element.querySelectorAll('.why-feature');
        if (features.length && typeof gsap !== 'undefined') {
          gsap.fromTo(features,
            { x: -40, opacity: 0 },
            { 
              x: 0, 
              opacity: 1, 
              duration: 0.5, 
              stagger: 0.1,
              ease: 'power2.out'
            }
          );
        }
      });
    });
  }
  
  /* ============================================
     INTERSECTION OBSERVER HELPER
     ============================================ */
  
  observeElement(element, callback) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    observer.observe(element);
    this.observers.push(observer);
  }
  
  /* ============================================
     CLEANUP
     ============================================ */
  
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.animationSystem = new AnimationSystem();
});

/* ============================================
   PRELOADER
   ============================================ */

function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  
  // Hide preloader after animation
  setTimeout(() => {
    preloader.classList.add('hidden');
    
    // Remove from DOM after transition
    setTimeout(() => {
      preloader.remove();
    }, 600);
  }, 1200);
}

// Initialize preloader
document.addEventListener('DOMContentLoaded', initPreloader);

/* ============================================
   PAGE TRANSITIONS
   ============================================ */

function initPageTransitions() {
  // Add transition overlay to body
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #0A1628;
    transform: translateX(-100%);
    pointer-events: none;
  `;
  document.body.appendChild(overlay);
  
  // Handle link clicks
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    
    // Skip external links and anchors
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Animate transition
      overlay.animate([
        { transform: 'translateX(-100%)' },
        { transform: 'translateX(0)' },
        { transform: 'translateX(100%)' }
      ], {
        duration: 800,
        easing: 'ease-in-out'
      });
      
      // Navigate after first half of animation
      setTimeout(() => {
        window.location.href = href;
      }, 400);
    });
  });
}

// Initialize page transitions
document.addEventListener('DOMContentLoaded', initPageTransitions);

/* ============================================
   CAROUSEL AUTO-ROTATE
   ============================================ */

function initCarousels() {
  document.querySelectorAll('.glass-carousel').forEach(carousel => {
    const track = carousel.querySelector('.glass-carousel-track');
    const slides = carousel.querySelectorAll('.glass-carousel-slide');
    const dots = carousel.querySelectorAll('.glass-carousel-dot');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    const interval = parseInt(carousel.dataset.interval) || 4000;
    
    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }
    
    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }
    
    // Auto-rotate
    let autoRotate = setInterval(nextSlide, interval);
    
    // Dot navigation
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(autoRotate);
        goToSlide(i);
        autoRotate = setInterval(nextSlide, interval);
      });
    });
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
    carousel.addEventListener('mouseleave', () => {
      autoRotate = setInterval(nextSlide, interval);
    });
  });
}

// Initialize carousels
document.addEventListener('DOMContentLoaded', initCarousels);
