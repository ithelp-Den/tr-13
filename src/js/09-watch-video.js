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
