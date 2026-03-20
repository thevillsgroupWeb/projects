/* ============================================
   PARTICLE BACKGROUND SYSTEM
   Animated star-particle canvas
   ============================================ */

class ParticleSystem {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.isActive = true;
    
    // Configuration
    this.config = {
      particleCount: options.particleCount || (window.innerWidth < 768 ? 20 : 60),
      maxOpacity: options.maxOpacity || 0.3,
      minSize: options.minSize || 1,
      maxSize: options.maxSize || 3,
      speed: options.speed || 0.3,
      connectionDistance: options.connectionDistance || 100,
      mouseParallax: options.mouseParallax !== false
    };
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize,
        speedX: (Math.random() - 0.5) * this.config.speed,
        speedY: (Math.random() - 0.5) * this.config.speed,
        opacity: Math.random() * this.config.maxOpacity,
        opacitySpeed: (Math.random() - 0.5) * 0.01
      });
    }
  }
  
  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });
    
    if (this.config.mouseParallax) {
      document.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      });
    }
    
    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      this.isActive = document.visibilityState === 'visible';
    });
  }
  
  animate() {
    if (!this.isActive) {
      requestAnimationFrame(() => this.animate());
      return;
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Mouse parallax effect
      if (this.config.mouseParallax) {
        const dx = this.mouseX - particle.x;
        const dy = this.mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          particle.x -= dx * 0.0005;
          particle.y -= dy * 0.0005;
        }
      }
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Pulsing opacity
      particle.opacity += particle.opacitySpeed;
      if (particle.opacity > this.config.maxOpacity || particle.opacity < 0.05) {
        particle.opacitySpeed *= -1;
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      this.ctx.fill();
      
      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const other = this.particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.connectionDistance) {
          const opacity = (1 - distance / this.config.connectionDistance) * 0.1;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem('particle-canvas');
});
