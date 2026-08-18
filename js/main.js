/**
 * DUKE FLORES | Modern Developer Portfolio
 * Master Interactive Logic & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypingEffect();
  initThemeToggle();
  initNavbarAndScroll();
  initStatsCounter();
  initSkillsFilter();
  initProjects();
  initContactForm();
  initCurrentYear();
});

/* ==========================================================================
   1. Interactive Particle Canvas Background
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 70);
  const maxDistance = 140;

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Ripple effect on click
  window.addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(e.clientX, e.clientY, true));
    }
  });

  class Particle {
    constructor(x, y, isTemporary = false) {
      this.x = x || Math.random() * width;
      this.y = y || Math.random() * height;
      this.size = isTemporary ? Math.random() * 3 + 2 : Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.alpha = this.baseAlpha;
      this.isTemporary = isTemporary;
      this.life = isTemporary ? 40 : null;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off screen boundaries
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }

      if (this.isTemporary) {
        this.life--;
      }
    }

    draw() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const color = isLight ? 'rgba(2, 132, 199,' : 'rgba(0, 242, 254,';
      ctx.fillStyle = `${color} ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const lineColor = isLight ? 'rgba(2, 132, 199,' : 'rgba(0, 242, 254,';

    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const lineAlpha = (1 - dist / maxDistance) * 0.22;
          ctx.strokeStyle = `${lineColor} ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Update & draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.isTemporary && p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  createParticles();
  animate();
}

/* ==========================================================================
   2. Dynamic Role Typing Effect
   ========================================================================== */
function initTypingEffect() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const roles = [
    'IT Student',
    'Musician'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const holdTime = 1800;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === currentRole.length) {
      speed = holdTime;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================================
   3. Theme Switcher (Cyber Dark, Light, Midnight)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  if (!toggleBtn) return;

  const themes = ['cyber', 'light', 'midnight'];
  let currentTheme = localStorage.getItem('df_theme') || 'cyber';

  applyTheme(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const currentIdx = themes.indexOf(currentTheme);
    currentTheme = themes[(currentIdx + 1) % themes.length];
    applyTheme(currentTheme);
    localStorage.setItem('df_theme', currentTheme);
  });

  function applyTheme(theme) {
    if (theme === 'cyber') {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) themeIcon.innerHTML = '🌙';
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeIcon) themeIcon.innerHTML = '☀️';
    } else if (theme === 'midnight') {
      document.documentElement.setAttribute('data-theme', 'midnight');
      if (themeIcon) themeIcon.innerHTML = '🌌';
    }
  }
}

/* ==========================================================================
   4. Navbar, Scroll Spy & Mobile Drawer
   ========================================================================== */
function initNavbarAndScroll() {
  const navbar = document.getElementById('navbar');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  // Sticky navbar shadow & back-to-top visibility
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (window.scrollY > 500) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Mobile menu toggle
  mobileBtn?.addEventListener('click', () => {
    mobileBtn.classList.toggle('active');
    navMenu?.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileBtn?.classList.remove('active');
      navMenu?.classList.remove('active');
    });
  });

  // Active section scroll spy
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   5. Animated Stats Counter
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const suffix = stat.getAttribute('data-suffix') || '';
          const decimals = parseInt(stat.getAttribute('data-decimals') || '0', 10);
          const duration = 1800;
          const startTime = performance.now();

          function updateCount(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOutQuad = 1 - (1 - progress) * (1 - progress);
            const current = target * easeOutQuad;

            stat.textContent = `${current.toFixed(decimals)}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              stat.textContent = `${target.toFixed(decimals)}${suffix}`;
            }
          }

          requestAnimationFrame(updateCount);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   6. Skills Matrix Filter & Animated Progress Bars
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter .filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  const skillBars = document.querySelectorAll('.skill-bar');

  // Animate skill bars when in viewport
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const progress = bar.getAttribute('data-progress') || '85%';
        bar.style.width = progress;
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => barObserver.observe(bar));

  // Filter tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. Projects Showcase, Category Filter & Modal System
   ========================================================================== */
const projectData = {
  'project-1': {
    title: 'Aurora AI | Predictive SaaS Analytics',
    category: 'Full Stack & AI',
    image: 'assets/project_ai_saas.jpg',
    tags: ['React', 'TypeScript', 'Python FastAPI', 'PyTorch', 'Tailwind', 'PostgreSQL'],
    description: 'An enterprise-grade real-time AI intelligence platform that aggregates multi-tenant application telemetry, computes predictive churn & anomaly detection models with 96.4% confidence intervals, and visualizes complex telemetry data in low-latency WebGL charts.',
    features: [
      '⚡ Sub-15ms real-time metric stream processing',
      '🤖 Integrated LLM-driven anomaly diagnosis & summaries',
      '🔒 SOC2 Type II compliant RBAC authentication',
      '📊 Interactive drill-down metric dashboards with custom exports'
    ],
    demoUrl: 'https://aurora-ai-demo.example.com',
    codeUrl: 'https://github.com/dukeflores-dev/aurora-ai-analytics'
  },
  'project-2': {
    title: 'NexusPay | Next-Gen Crypto & Fiat Gateway',
    category: 'Fintech & Web3',
    image: 'assets/project_fintech.svg',
    tags: ['Next.js', 'Solidity', 'Go (Golang)', 'Ethers.js', 'TailwindCSS', 'Redis'],
    description: 'High-frequency institutional settlement gateway unifying multichain EVM smart contracts with traditional SWIFT and ACH payment rails. Includes multi-signature treasury security, automated gas optimization, and institutional ledger auditing.',
    features: [
      '🛡️ Multi-sig automated vault contract security',
      '🔄 Dynamic gas routing saving ~32% on transaction fees',
      '📈 Real-time exchange rate websocket feeds',
      '📱 PWA ready with biometrics and hardware wallet support'
    ],
    demoUrl: 'https://nexuspay-demo.example.com',
    codeUrl: 'https://github.com/dukeflores-dev/nexuspay-gateway'
  },
  'project-3': {
    title: 'CyberPulse | 3D Spatial E-Commerce Studio',
    category: 'Creative Tech & UI/UX',
    image: 'assets/project_ecommerce.svg',
    tags: ['Three.js', 'GLSL Shaders', 'WebGL', 'Vue 3', 'GSAP', 'Pinia'],
    description: 'An immersive 3D interactive product customizer featuring physically-based rendering (PBR), dynamic lighting shaders, and smooth GSAP cinematic camera transitions for next-generation virtual luxury shopping.',
    features: [
      '🎮 60 FPS interactive 3D model customization and inspection',
      '✨ Custom GLSL holographic & reflection shaders',
      '🛒 Seamless cart sync with Headless Shopify Storefront API',
      '📱 Optimized low-poly LOD models for mobile devices'
    ],
    demoUrl: 'https://cyberpulse-3d.example.com',
    codeUrl: 'https://github.com/dukeflores-dev/cyberpulse-3d-studio'
  },
  'project-4': {
    title: 'MeshOps | Kubernetes Cloud Mesh Orchestrator',
    category: 'Cloud & DevOps',
    image: 'assets/project_cloud.svg',
    tags: ['Go', 'Kubernetes', 'gRPC', 'Docker', 'Prometheus', 'Grafana'],
    description: 'Distributed cloud observability & canary deployment controller for high-load microservice clusters. Automatically manages traffic mirroring, dynamic auto-scaling pods, and zero-downtime blue/green deployments.',
    features: [
      '🌐 Dynamic Istio service mesh traffic balancing & failover',
      '⏱️ Automated canary rollback on P99 latency spikes',
      '📊 Native Prometheus metric exporter and real-time alerts',
      '🔒 eBPF-based network topology visualization'
    ],
    demoUrl: 'https://meshops-demo.example.com',
    codeUrl: 'https://github.com/dukeflores-dev/meshops-cloud-orchestrator'
  }
};

function initProjects() {
  const filterBtns = document.querySelectorAll('.projects-filter .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const modalBackdrop = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Filter tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal open
  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project-id');
      openProjectModal(projectId);
    });
  });

  // Modal close
  modalCloseBtn?.addEventListener('click', closeProjectModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeProjectModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) {
      closeProjectModal();
    }
  });

  function openProjectModal(id) {
    const data = projectData[id];
    if (!data || !modalBackdrop) return;

    document.getElementById('modal-img').src = data.image;
    document.getElementById('modal-img').alt = data.title;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').textContent = data.description;
    document.getElementById('modal-demo-link').href = data.demoUrl;
    document.getElementById('modal-code-link').href = data.codeUrl;

    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = data.tags.map(t => `<span class="tag-badge">${t}</span>`).join('');

    const featuresContainer = document.getElementById('modal-features');
    featuresContainer.innerHTML = data.features.map(f => `<div class="feature-item">${f}</div>`).join('');

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   8. Contact Form Validation & Toast Notification
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const feedback = document.getElementById('form-feedback');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name']?.value.trim();
    const email = form.elements['email']?.value.trim();
    const subject = form.elements['subject']?.value.trim();
    const message = form.elements['message']?.value.trim();

    // Basic Validation
    if (!name || !email || !subject || !message) {
      showToast('⚠️ Please fill in all required fields.', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('⚠️ Please provide a valid email address.', 'warning');
      return;
    }

    // Button loading animation
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"/>
      </svg>
      Sending message...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showToast('🚀 Thank you! Your message has been sent successfully.', 'success');
    }, 1200);
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.35s ease';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

/* ==========================================================================
   9. Current Year Utility
   ========================================================================== */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
