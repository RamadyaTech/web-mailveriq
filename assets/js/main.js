(function() {
  'use strict';

  var navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  var mobileToggle = document.getElementById('mobile-toggle');
  var navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        var offset = navbar.offsetHeight + 20;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  var animateEls = document.querySelectorAll(
    '.feature-card, .solution-card, .step-card, .compliance-card, .price-card, .sec-card, .outcome-card, .audience-card, .why-stat'
  );

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  animateEls.forEach(function(el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.45s ease ' + (i % 6) * 0.06 + 's, transform 0.45s ease ' + (i % 6) * 0.06 + 's';
    observer.observe(el);
  });

  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var orig = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;

      var data = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        company: form.querySelector('#company').value,
        employees: form.querySelector('#employees').value,
        message: form.querySelector('#message').value
      };

      fetch('https://brk8a9vqh6.execute-api.ap-south-1.amazonaws.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function(res) { return res.json(); })
      .then(function(result) {
        if (result.success) {
          btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Demo Requested!';
          btn.style.background = '#059669';
          form.reset();
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.disabled = false;
          }, 4000);
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      })
      .catch(function(err) {
        btn.innerHTML = 'Failed — try again';
        btn.style.background = '#DC2626';
        setTimeout(function() {
          btn.innerHTML = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      });
    });
  }
})();
