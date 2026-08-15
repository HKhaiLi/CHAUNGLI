(function () {
  'use strict';

  const slider = document.getElementById('slider');
  const slides = document.querySelectorAll('.slide');
  const navDots = document.querySelectorAll('.nav-dot');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  const arrowPrev = document.getElementById('arrowPrev');
  const arrowNext = document.getElementById('arrowNext');
  const loader = document.getElementById('loader');
  const header = document.querySelector('.header');
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const contactForm = document.getElementById('contactForm');

  let currentIndex = 0;
  const totalSlides = slides.length;
  let isAnimating = false;
  let touchStartX = 0;
  let touchEndX = 0;

  function goToSlide(index, animate = true) {
    if (isAnimating || index < 0 || index >= totalSlides) return;
    isAnimating = true;
    currentIndex = index;

    slider.style.transition = animate ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    slider.style.transform = `translateX(-${currentIndex * 100}vw)`;

    updateNavigation();
    updateSlideStates();

    setTimeout(() => {
      isAnimating = false;
    }, animate ? 800 : 0);
  }

  function updateNavigation() {
    navDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    mobileNavItems.forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });

    if (arrowPrev) arrowPrev.disabled = currentIndex === 0;
    if (arrowNext) arrowNext.disabled = currentIndex === totalSlides - 1;
  }

  function updateSlideStates() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    if (currentIndex > 0) goToSlide(currentIndex - 1);
  }

  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index, 10));
    });
  });

  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      goToSlide(parseInt(item.dataset.index, 10));
      mobileMenu.classList.remove('open');
    });
  });

  if (arrowPrev) arrowPrev.addEventListener('click', prevSlide);
  if (arrowNext) arrowNext.addEventListener('click', nextSlide);

  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      goToSlide(parseInt(btn.dataset.goto, 10));
    });
  });

  document.querySelector('.logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    goToSlide(0);
  });

  document.getElementById('langToggle')?.addEventListener('click', toggleLanguage);

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      prevSlide();
    }
  });

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  let wheelTimeout;
  slider.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaX > 30) nextSlide();
        else if (e.deltaX < -30) prevSlide();
      }, 50);
    }
  }, { passive: false });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 60;
    if (Math.abs(diff) < threshold) return;
    if (diff > 0) nextSlide();
    else prevSlide();
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const company = document.getElementById('company').value;
      const message = document.getElementById('message').value;

      const subject = encodeURIComponent(`Business Inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`
      );

      window.location.href = `mailto:Jacque.lyneCarbal969@gmail.com?subject=${subject}&body=${body}`;
      alert(t('form.success'));
      contactForm.reset();
    });
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1600);

    goToSlide(0, false);
    updateNavigation();
  });

  window.addEventListener('resize', () => {
    goToSlide(currentIndex, false);
  });
})();
