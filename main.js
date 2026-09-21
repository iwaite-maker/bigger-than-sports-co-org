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

  // ---- Testimonials horizontal scroll strip ----
  var testimonialsScroll = document.querySelector('.testimonials-scroll');
  if (testimonialsScroll) {
    var prevTest = document.querySelector('.testimonials-arrow.prev');
    var nextTest = document.querySelector('.testimonials-arrow.next');
    var scrollTestimonials = function (dir) {
      var card = testimonialsScroll.querySelector('.testimonial-card');
      var amount = card ? card.getBoundingClientRect().width + 24 : 420;
      testimonialsScroll.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };
    if (prevTest) prevTest.addEventListener('click', function () { scrollTestimonials(-1); });
    if (nextTest) nextTest.addEventListener('click', function () { scrollTestimonials(1); });
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

  // ---- News & Stories horizontal scroll strip ----
  var newsScroll = document.querySelector('.news-scroll');
  if (newsScroll) {
    var prevNews = document.querySelector('.news-arrow.prev');
    var nextNews = document.querySelector('.news-arrow.next');
    var scrollNews = function (dir) {
      var card = newsScroll.querySelector('.news-card');
      var amount = card ? card.getBoundingClientRect().width + 24 : 300;
      newsScroll.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };
    if (prevNews) prevNews.addEventListener('click', function () { scrollNews(-1); });
    if (nextNews) nextNews.addEventListener('click', function () { scrollNews(1); });
  }
});
