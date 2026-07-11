document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('active'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('active')));
  }

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const form = tab.closest('form');
      if (form) {
        let input = form.querySelector('input[name="status"]');
        if (!input) {
          input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'status';
          form.appendChild(input);
        }
        input.value = tab.dataset.value;
      }
    });
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
      obs.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* Count-up stats */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur = 1600;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        };
        requestAnimationFrame(step);
        cObs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cObs.observe(c));
  }

  /* Hero parallax */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < 700) hero.style.backgroundPosition = `center ${y * 0.4}px`;
    }, { passive: true });
  }

  /* Subtle 3D tilt on property cards */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${ -py * 5 }deg) rotateY(${ px * 5 }deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* Back to top */
  const back = document.querySelector('.back-top');
  if (back) {
    window.addEventListener('scroll', () => back.classList.toggle('show', window.scrollY > 500), { passive: true });
    back.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});
