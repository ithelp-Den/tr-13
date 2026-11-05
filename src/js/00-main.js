/* Shared behaviour: scroll reveal + payment-link binding. Section scripts live in src/js/NN-*.js */
window.ZBL = window.ZBL || {
  // >>> Put the checkout URL here once it exists. Every element with [data-pay] gets it. <<<
  payUrl: 'https://mmoschool.online/shop/item/13702'
};

(function () {
  if (/[?&]static\b/.test(location.search)) document.documentElement.classList.add('is-static');
  if (/[?&]static\b/.test(location.search)) document.querySelectorAll('img').forEach(function (i) { i.loading = 'eager'; i.decoding = 'sync'; });
  // payment links
  document.querySelectorAll('[data-pay]').forEach(function (el) {
    if (window.ZBL.payUrl) el.setAttribute('href', window.ZBL.payUrl);
    el.addEventListener('click', function (e) {
      if (!el.getAttribute('href')) e.preventDefault();
    });
  });

  // scroll reveal (add ?static to the URL to show everything at once — used for screenshots)
  if (/[?&]static\b/.test(location.search)) { document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); }); return; }
  var els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (el) {
    var d = el.getAttribute('data-delay'); if (d) el.style.setProperty('--d', d);
    io.observe(el);
  });
})();
