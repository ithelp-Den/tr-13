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
