document.addEventListener('DOMContentLoaded', () => {
  const sec = document.querySelector('.s-stat');
  if (!sec) return;
  const el = sec.querySelector('[data-count]');
  const target = +el.dataset.count;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static\b/.test(location.search);
  const run = () => {
    sec.classList.add('is-in');
    if (reduce) return;
    const t0 = performance.now(), dur = 1600;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0';
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) return run();
  const io = new IntersectionObserver((es) => {
    if (es.some(e => e.isIntersecting)) { io.disconnect(); run(); }
  }, { threshold: 0.35 });
  io.observe(sec);
});
