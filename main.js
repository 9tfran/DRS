// Animaciones de Scroll (Intersection Observer)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Solo animar una vez
      }
    });
  }, observerOptions);
  
  document.addEventListener('DOMContentLoaded', () => {
    // Inicializar observador para animaciones
    const elementsToAnimate = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right, .zoom-in');
    elementsToAnimate.forEach(el => observer.observe(el));
  
    // Menú móvil
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  
    // Cerrar menú al hacer click en un enlace (móvil)
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
      });
    });
  
    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  
    // Contadores animados (Sección Por Qué Elegirnos)
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.getAttribute('data-target'));
          let startValue = 0;
          const duration = 2000; // 2 segundos
          const step = Math.ceil(endValue / (duration / 16)); // ~60fps
          
          const timer = setInterval(() => {
            startValue += step;
            if (startValue >= endValue) {
              target.innerText = endValue;
              clearInterval(timer);
            } else {
              target.innerText = startValue;
            }
          }, 16);
          obs.unobserve(target);
        }
      });
    }, { threshold: 0.5 });
  
    counters.forEach(counter => counterObserver.observe(counter));
  
    // Año en el footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // ===== SLIDER DE NOSOTROS =====
    const slider = document.getElementById('about-slider');
    if (slider) {
      const slides = slider.querySelectorAll('.slide-img');
      const dotsContainer = document.getElementById('slider-dots');
      const counter = document.getElementById('slider-counter');
      const prevBtn = document.getElementById('slider-prev');
      const nextBtn = document.getElementById('slider-next');
      const total = slides.length;
      let current = 0;
      let autoPlay;

      // Crear dots
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Imagen ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      });

      const dots = dotsContainer.querySelectorAll('.dot');
      slides[0].classList.add('active');

      function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + total) % total;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
        counter.textContent = `${current + 1} / ${total}`;
      }

      function startAutoPlay() {
        autoPlay = setInterval(() => goTo(current + 1), 3500);
      }

      function stopAutoPlay() {
        clearInterval(autoPlay);
      }

      prevBtn.addEventListener('click', () => { stopAutoPlay(); goTo(current - 1); startAutoPlay(); });
      nextBtn.addEventListener('click', () => { stopAutoPlay(); goTo(current + 1); startAutoPlay(); });

      slider.addEventListener('mouseenter', stopAutoPlay);
      slider.addEventListener('mouseleave', startAutoPlay);

      // Touch/swipe support
      let touchStartX = 0;
      slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      slider.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          stopAutoPlay();
          goTo(diff > 0 ? current + 1 : current - 1);
          startAutoPlay();
        }
      }, { passive: true });

      startAutoPlay();
    }
  
    // Manejo básico del formulario con FormSubmit
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = 'Enviando...';
        btn.disabled = true;
  
        const formData = new FormData(contactForm);

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                btn.innerText = '¡Mensaje Enviado!';
                btn.style.backgroundColor = '#2ecc71';
                btn.style.borderColor = '#2ecc71';
                contactForm.reset();
            } else {
                btn.innerText = 'Error al enviar';
                btn.style.backgroundColor = '#e74c3c';
                btn.style.borderColor = '#e74c3c';
            }
        }).catch(error => {
            btn.innerText = 'Error de conexión';
            btn.style.backgroundColor = '#e74c3c';
            btn.style.borderColor = '#e74c3c';
        }).finally(() => {
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                btn.disabled = false;
            }, 3000);
        });
      });
    }
  });
