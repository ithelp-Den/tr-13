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
