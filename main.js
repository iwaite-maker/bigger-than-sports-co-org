// ---- Custom smooth scroll (bypasses the OS/browser's own "Reduce Motion"
// handling) ----
// Safari/WebKit silently forces instant, un-animated scrolling for native
// CSS `scroll-behavior: smooth` and native scrollBy/scrollIntoView smooth
// calls whenever the visitor has the system "Reduce Motion" accessibility
// setting on, overriding the page's own CSS. That makes every same-page
// link and every carousel arrow jump instantly for those visitors instead
// of gliding the way it does for everyone else. These two helpers animate
// scroll position by hand, frame by frame, so the motion is identical
// for every visitor regardless of that setting - same mechanism/reasoning
// as the journey timeline below.
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function animateScrollTo(getPos, setPos, targetPos, duration) {
  duration = duration || 600;
  var startPos = getPos();
  var distance = targetPos - startPos;
  if (distance === 0) return;
  var startTime = null;
  function step(timestamp) {
    if (startTime === null) startTime = timestamp;
    var elapsed = timestamp - startTime;
    var progress = Math.min(elapsed / duration, 1);
    setPos(startPos + distance * easeInOutQuad(progress));
    if (progress < 1) window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
}
function smoothScrollWindowTo(targetY, duration) {
  animateScrollTo(
    function () { return window.pageYOffset; },
    function (y) { window.scrollTo(0, y); },
    targetY,
    duration
  );
}
function smoothScrollElementX(el, targetX, duration) {
  animateScrollTo(
    function () { return el.scrollLeft; },
    function (x) { el.scrollLeft = x; },
    targetX,
    duration
  );
}

document.addEventListener('DOMContentLoaded', function () {
  // Hand-animate every same-page anchor jump (nav links, footer links,
  // hero buttons, logo) instead of letting the browser's native smooth
  // scroll handle it.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var hash = link.getAttribute('href');
    if (!hash || hash.length < 2) return;
    link.addEventListener('click', function (e) {
      var target = document.getElementById(hash.slice(1));
      if (!target) return;
      e.preventDefault();
      var targetY = target.getBoundingClientRect().top + window.pageYOffset;
      smoothScrollWindowTo(targetY, 700);
      if (history.pushState) history.pushState(null, '', hash);
    });
  });

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
      smoothScrollElementX(testimonialsScroll, testimonialsScroll.scrollLeft + dir * amount, 450);
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
      smoothScrollElementX(eventsScroll, eventsScroll.scrollLeft + dir * amount, 450);
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
      smoothScrollElementX(newsScroll, newsScroll.scrollLeft + dir * amount, 450);
    };
    if (prevNews) prevNews.addEventListener('click', function () { scrollNews(-1); });
    if (nextNews) nextNews.addEventListener('click', function () { scrollNews(1); });
  }

  // ---- Journey timeline: scroll-driven progress line + item reveal ----
  // Every piece of this (the line AND each item's photo/text) is driven
  // directly off scroll position every frame, the same mechanism end to
  // end, so the whole section visibly animates together as you scroll.
  // It never checks prefers-reduced-motion: this is a content reveal, not
  // a jitter/parallax effect, so it runs the same for everyone.
  var journeyTimeline = document.querySelector('.journey-timeline');
  if (journeyTimeline) {
    var journeyItems = journeyTimeline.querySelectorAll('.journey-item');
    var progressLine = journeyTimeline.querySelector('.journey-progress-line');

    var tickingJourney = false;
    var updateJourneyProgress = function () {
      tickingJourney = false;
      var rect = journeyTimeline.getBoundingClientRect();
      var triggerY = window.innerHeight * 0.75;
      var progress = rect.height > 0 ? (triggerY - rect.top) / rect.height : 0;
      progress = Math.min(Math.max(progress, 0), 1);
      if (progressLine) progressLine.style.height = (progress * 100) + '%';

      var revealStart = window.innerHeight * 0.92;
      var revealEnd = window.innerHeight * 0.55;
      journeyItems.forEach(function (item) {
        var itemRect = item.getBoundingClientRect();
        var itemProgress = (revealStart - itemRect.top) / (revealStart - revealEnd);
        itemProgress = Math.min(Math.max(itemProgress, 0), 1);
        item.style.opacity = itemProgress;
        item.style.transform = 'translateY(' + ((1 - itemProgress) * 44) + 'px)';
      });
    };
    var onJourneyScroll = function () {
      if (!tickingJourney) {
        tickingJourney = true;
        window.requestAnimationFrame(updateJourneyProgress);
      }
    };
    window.addEventListener('scroll', onJourneyScroll, { passive: true });
    window.addEventListener('resize', onJourneyScroll);
    updateJourneyProgress();
  }
});
