document.addEventListener('DOMContentLoaded', () => {
  // Sticky header
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Pause videos that scroll off screen (saves battery/data)
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target; if (!v.hasAttribute('autoplay')) return;
    e.isIntersecting ? v.play().catch(()=>{}) : v.pause();
  }), { threshold: .25 });
  document.querySelectorAll('video[autoplay]').forEach(v => vio.observe(v));

  // Lightbox
  const items = [...document.querySelectorAll('.gallery a')];
  if (items.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button><button class="lb-prev" aria-label="Previous">&#8249;</button><img alt=""><button class="lb-next" aria-label="Next">&#8250;</button><div class="lb-caption"></div>';
    document.body.appendChild(lb);
    const img = lb.querySelector('img'), cap = lb.querySelector('.lb-caption');
    let i = 0;
    const show = n => {
      i = (n + items.length) % items.length;
      img.src = items[i].href;
      img.alt = items[i].querySelector('img').alt;
      cap.textContent = img.alt;
    };
    const open = n => { show(n); lb.classList.add('open'); document.body.style.overflow = 'hidden'; lb.querySelector('.lb-close').focus(); };
    const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
    items.forEach((a, n) => a.addEventListener('click', e => { e.preventDefault(); open(n); }));
    lb.querySelector('.lb-close').onclick = close;
    lb.querySelector('.lb-prev').onclick = () => show(i - 1);
    lb.querySelector('.lb-next').onclick = () => show(i + 1);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
  }

  // Contact form (Formspree-style fetch)
  const form = document.querySelector('#contact-form');
  if (form) {
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (form.querySelector('.hp input').value) return; // honeypot
      status.className = 'form-status'; status.textContent = 'Sending...';
      try {
        const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!r.ok) throw 0;
       window.location.href = '/thank-you.html';
return;
      } catch {
        status.classList.add('err');
        status.textContent = 'Something went wrong. Please call (719) 963-1496 or email us directly.';
      }
    });
  }
});
