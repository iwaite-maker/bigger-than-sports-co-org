document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }
  var dropdown = document.querySelector('.dropdown');
  if (dropdown) {
    var trigger = dropdown.querySelector('a');
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        dropdown.classList.toggle('open');
      }
    });
  }

  // Close mobile nav after clicking a link
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (nav) nav.classList.remove('open');
    });
  });

  // ---- Testimonials carousel ----
  var track = document.querySelector('.carousel-slides');
  if (track) {
    var slides = track.querySelectorAll('.carousel-slide');
    var dotsWrap = document.querySelector('.carousel-dots');
    var index = 0;
    var total = slides.length;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });

    function update() {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dotsWrap.querySelectorAll('.carousel-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === index);
      });
    }
    function goTo(i) {
      index = (i + total) % total;
      update();
    }

    var prevBtn = document.querySelector('.carousel-arrow.prev');
    var nextBtn = document.querySelector('.carousel-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); });

    var autoplay = setInterval(function () { goTo(index + 1); }, 6000);
    document.querySelector('.carousel').addEventListener('mouseenter', function () {
      clearInterval(autoplay);
    });
  }

  // ---- Events horizontal scroll strip ----
  var eventsScroll = document.querySelector('.events-scroll');
  if (eventsScroll) {
    var prevEvt = document.querySelector('.events-arrow.prev');
    var nextEvt = document.querySelector('.events-arrow.next');
    var scrollEvents = function (dir) {
      var card = eventsScroll.querySelector('.event-card');
      var amount = card ? card.getBoundingClientRect().width + 24 : 300;
      eventsScroll.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };
    if (prevEvt) prevEvt.addEventListener('click', function () { scrollEvents(-1); });
    if (nextEvt) nextEvt.addEventListener('click', function () { scrollEvents(1); });
  }
});
