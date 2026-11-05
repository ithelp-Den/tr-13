/* 00-main.js */
/* Shared behaviour: scroll reveal + payment-link binding. Section scripts live in src/js/NN-*.js */
window.ZBL = window.ZBL || {
  // >>> Put the checkout URL here once it exists. Every element with [data-pay] gets it. <<<
  payUrl: ''
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

;
/* 02-reviews.js */
document.addEventListener('DOMContentLoaded', function () {
  var root = document.querySelector('.s-reviews');
  if (!root || typeof Swiper === 'undefined') return;
  var el = root.querySelector('.s-reviews__slider');
  var prev = root.querySelector('.s-reviews__btn--prev');
  var next = root.querySelector('.s-reviews__btn--next');
  var track = root.querySelector('.s-reviews__progress');
  var thumb = root.querySelector('.s-reviews__thumb');

  var sw = new Swiper(el, {
    slidesPerView: 'auto',
    spaceBetween: 0,
    speed: 750,
    grabCursor: true,
    resistanceRatio: 0.6,
    threshold: 4,
    watchOverflow: false,
    on: { progress: function (s, p) { setProgress(p); } }
  });

  function setProgress(p) {
    p = Math.min(1, Math.max(0, p || 0));
    var travel = track.clientWidth - thumb.clientWidth;
    thumb.style.setProperty('--tx', (travel * p) + 'px');
    prev.disabled = p <= 0.001;
    next.disabled = p >= 0.999;
  }
  function update() { sw.update(); setProgress(sw.progress); }
  prev.addEventListener('click', function () { sw.slidePrev(); });
  next.addEventListener('click', function () { sw.slideNext(); });
  sw.on('slideChange', function () { setProgress(sw.progress); });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
});

;
/* 04-stat.js */
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

;
/* 06-transformations.js */
document.addEventListener('DOMContentLoaded', function () {
  var root = document.querySelector('.s-transformations');
  if (!root || typeof Swiper === 'undefined') return;
  var el = root.querySelector('.s-transformations__swiper');
  var prev = root.querySelector('.s-transformations__btn--prev');
  var next = root.querySelector('.s-transformations__btn--next');
  var track = root.querySelector('.s-transformations__progress');
  var thumb = root.querySelector('.s-transformations__thumb');

  var sw = new Swiper(el, {
    slidesPerView: 'auto',
    spaceBetween: 0,
    speed: 750,
    grabCursor: true,
    resistanceRatio: 0.6,
    threshold: 4,
    watchOverflow: false,
    on: { progress: function (s, p) { setProgress(p); } }
  });

  function setProgress(p) {
    p = Math.min(1, Math.max(0, p || 0));
    var travel = track.clientWidth - thumb.clientWidth;
    thumb.style.setProperty('--tx', (travel * p) + 'px');
    prev.disabled = p <= 0.001;
    next.disabled = p >= 0.999;
  }
  function update() { sw.update(); setProgress(sw.progress); }
  prev.addEventListener('click', function () { sw.slidePrev(); });
  next.addEventListener('click', function () { sw.slideNext(); });
  sw.on('slideChange', function () { setProgress(sw.progress); });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
});

;
/* 07-video-reviews.js */
document.addEventListener('DOMContentLoaded', function () {
  var root = document.querySelector('.s-videos');
  if (!root) return;

  /* ---- slider (mobile only; on desktop the 3 posters sit in a row) ---- */
  var el = root.querySelector('.s-videos__swiper');
  var prev = root.querySelector('.s-videos__btn--prev');
  var next = root.querySelector('.s-videos__btn--next');
  var track = root.querySelector('.s-videos__progress');
  var thumb = root.querySelector('.s-videos__thumb');

  if (typeof Swiper !== 'undefined' && el) {
    var setProgress = function (p) {
      p = Math.min(1, Math.max(0, p || 0));
      var travel = track.clientWidth - thumb.clientWidth;
      thumb.style.setProperty('--tx', (travel * p) + 'px');
      prev.disabled = p <= 0.001;
      next.disabled = p >= 0.999;
    };
    var sw = new Swiper(el, {
      slidesPerView: 'auto',
      spaceBetween: 0,
      speed: 750,
      grabCursor: true,
      resistanceRatio: 0.6,
      threshold: 4,
      watchOverflow: false,
      breakpoints: { 800: { enabled: false } },
      on: { progress: function (s, p) { setProgress(p); } }
    });
    var update = function () { sw.update(); setProgress(sw.progress); };
    prev.addEventListener('click', function () { sw.slidePrev(); });
    next.addEventListener('click', function () { sw.slideNext(); });
    sw.on('slideChange', function () { setProgress(sw.progress); });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();
  }

  /* ---- video posters ---- */
  /* <div class="js-video" data-video-src="">: empty src -> poster stays, button pulses;
     filled src -> poster is replaced with <video controls autoplay playsinline>. */
  function activate(box) {
    var src = box.getAttribute('data-video-src');
    if (!src) {
      box.classList.remove('is-pulse');
      void box.offsetWidth;
      box.classList.add('is-pulse');
      return;
    }
    if (box.classList.contains('is-playing')) return;
    // only one testimonial plays at a time
    root.querySelectorAll('.js-video.is-playing video').forEach(function (o) { o.pause(); });
    var v = document.createElement('video');
    v.className = 's-videos__video';
    var im = box.querySelector('img'); if (im) v.poster = im.currentSrc || im.src;
    v.preload = 'auto';
    v.src = src;
    v.controls = true;
    v.autoplay = true;
    v.setAttribute('playsinline', '');
    box.classList.add('is-playing');
    box.appendChild(v);
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  root.querySelectorAll('.js-video').forEach(function (box) {
    box.addEventListener('click', function (e) { if (e.target.tagName === 'VIDEO') return; activate(box); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(box); }
    });
    box.addEventListener('animationend', function () { box.classList.remove('is-pulse'); }, true);
  });
});

;
/* 09-watch-video.js */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.js-video').forEach(function (box) {
    var btn = box.querySelector('.s-watch-video__btn') || box;
    btn.addEventListener('click', function () {
      var src = box.getAttribute('data-video-src');
      if (!src || box.classList.contains('is-playing')) return; // empty src: decorative only
      var v = document.createElement('video');
      v.className = 's-watch-video__video';
      var im = box.querySelector('img'); if (im) v.poster = im.currentSrc || im.src;
      v.preload = 'auto'; v.loop = true; /* the source clip is only ~3 s */
      v.src = src; v.controls = true; v.autoplay = true; v.setAttribute('playsinline', '');
      box.appendChild(v);
      box.classList.add('is-playing');
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    });
  });
});

;
/* 12-coach.js */
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

;
/* 14-faq.js */
(function () {
  function init() {
    var list = document.querySelector('[data-faq]');
    if (!list) return;
    var items = Array.prototype.slice.call(list.querySelectorAll('.s-faq__item'));
    function set(item, open) {
      var btn = item.querySelector('.s-faq__btn');
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    items.forEach(function (item) {
      item.querySelector('.s-faq__btn').addEventListener('click', function () {
        var open = !item.classList.contains('is-open');
        items.forEach(function (o) { if (o !== item) set(o, false); });
        set(item, open);
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
