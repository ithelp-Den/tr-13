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
