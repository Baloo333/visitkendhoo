// Visit Kendhoo — shared site behaviour
document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var isHidden = menu.classList.contains('hidden');
      if (isHidden) {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
      });
    });
  }

  // Mark active nav link
  var here = (location.pathname.split('/').pop() || 'index.html');
  if (here === '' || here === '/') here = 'index.html';

  document.querySelectorAll('nav a, .mobile-menu a').forEach(function (a) {
    var target = a.getAttribute('href');
    if (target === here) {
      a.classList.add('active');
      // Adding common active styles from the redesign
      a.classList.add('font-bold', 'border-b-2');
      // Remove default inactive styles if present
      a.classList.remove('text-on-surface-variant', 'opacity-70');
    }
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    window.observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          window.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { window.observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Current year in footer
  var yearEl = document.querySelectorAll('[data-year]');
  yearEl.forEach(function(el) {
      el.textContent = new Date().getFullYear();
  });
});
