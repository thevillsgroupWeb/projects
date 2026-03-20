/* ============================================
   LIQUID GLASS INTERACTION SYSTEM
   Ripple effects, hover states, modals
   ============================================ */

class GlassSystem {
  constructor() {
    this.modals = new Map();
    this.init();
  }
  
  init() {
    this.initRippleEffect();
    this.initGlassCards();
    this.initMagneticButtons();
    this.initModals();
    this.initAccordion();
  }
  
  /* ============================================
     LIQUID RIPPLE EFFECT
     ============================================ */
  
  initRippleEffect() {
    document.querySelectorAll('.glass-card, .glass-btn, .glass-tag').forEach(element => {
      element.addEventListener('click', (e) => {
        this.createRipple(e, element);
      });
    });
  }
  
  createRipple(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'liquid-ripple';
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 70%);
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
      z-index: 10;
    `;
    
    element.appendChild(ripple);
    
    // Animate
    ripple.animate([
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(20)', opacity: 0 }
    ], {
      duration: 800,
      easing: 'ease-out'
    }).onfinish = () => ripple.remove();
  }
  
  /* ============================================
     GLASS CARDS INTERACTION
     ============================================ */
  
  initGlassCards() {
    document.querySelectorAll('.glass-card[data-modal]').forEach(card => {
      card.addEventListener('click', () => {
        const modalId = card.dataset.modal;
        this.openModal(modalId);
      });
    });
  }
  
  /* ============================================
     MAGNETIC BUTTONS
     ============================================ */
  
  initMagneticButtons() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }
  
  /* ============================================
     MODAL SYSTEM
     ============================================ */
  
  initModals() {
    // Close modal on overlay click
    document.querySelectorAll('.glass-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal(overlay.id);
        }
      });
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.glass-modal-overlay.active').forEach(overlay => {
          this.closeModal(overlay.id);
        });
      }
    });
    
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.closest('.glass-modal-overlay').id;
        this.closeModal(modalId);
      });
    });
  }
  
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Trigger enter animation
    const content = modal.querySelector('.glass-modal');
    if (content) {
      content.animate([
        { transform: 'scale(0.9) translateY(20px)', opacity: 0 },
        { transform: 'scale(1) translateY(0)', opacity: 1 }
      ], {
        duration: 400,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
      });
    }
  }
  
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const content = modal.querySelector('.glass-modal');
    if (content) {
      content.animate([
        { transform: 'scale(1) translateY(0)', opacity: 1 },
        { transform: 'scale(0.9) translateY(20px)', opacity: 0 }
      ], {
        duration: 300,
        easing: 'ease-in'
      }).onfinish = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      };
    } else {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  /* ============================================
     ACCORDION SYSTEM
     ============================================ */
  
  initAccordion() {
    document.querySelectorAll('.glass-accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.glass-accordion-item');
        const isOpen = item.classList.contains('open');
        
        // Close all siblings (optional - for single-open behavior)
        const parent = item.closest('.glass-accordion');
        if (parent && parent.dataset.single === 'true') {
          parent.querySelectorAll('.glass-accordion-item.open').forEach(openItem => {
            if (openItem !== item) {
              openItem.classList.remove('open');
            }
          });
        }
        
        // Toggle current
        item.classList.toggle('open', !isOpen);
      });
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.glassSystem = new GlassSystem();
});

/* ============================================
   NAVIGATION SCROLL EFFECT
   ============================================ */

function initNavScroll() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ============================================
   MOBILE MENU
   ============================================ */

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  
  if (!toggle || !drawer) return;
  
  function openMenu() {
    toggle.classList.add('active');
    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMenu() {
    toggle.classList.remove('active');
    drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  toggle.addEventListener('click', () => {
    if (drawer.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }
  
  // Close on link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
});
