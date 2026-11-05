document.addEventListener('DOMContentLoaded', function () {
  var card = document.querySelector('.s-coach__profile');
  if (!card) return;
  var items = card.querySelectorAll('[data-count]');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fmt(v, el) {
    var dec = +el.getAttribute('data-dec') || 0;
    var s = dec ? v.toFixed(dec).replace('.', ',') : String(Math.round(v));
    var sep = el.getAttribute('data-sep');
    if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return s + (el.getAttribute('data-suffix') || '');
  }
  function run() {
    items.forEach(function (el) {
      var to = parseFloat(el.getAttribute('data-count')), t0 = null, dur = 1600;
      (function step(t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(to * e, el);
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }
  if (reduce || !('IntersectionObserver' in window)) return;
  items.forEach(function (el) { el.textContent = fmt(0, el); });
  var io = new IntersectionObserver(function (en) {
    if (en[0].isIntersecting) { io.disconnect(); run(); }
  }, { threshold: 0.4 });
  io.observe(card);
});
