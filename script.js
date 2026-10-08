/* =========================================================
   PRANAV PORTFOLIO — script.js
   ========================================================= */

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.leftnav a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      if (id) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    }
  });
}, {
  rootMargin: '-35% 0px -60% 0px',
  threshold: 0
});

sections.forEach(s => navObserver.observe(s));

// ---------- Fade-in sections on scroll ----------
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

sections.forEach(s => fadeObserver.observe(s));

// Make all sections already in view visible on load
window.addEventListener('load', () => {
  const vh = window.innerHeight;
  sections.forEach(s => {
    const rect = s.getBoundingClientRect();
    if (rect.top < vh) {
      s.classList.add('visible');
    }
  });
});
