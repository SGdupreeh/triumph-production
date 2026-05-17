/* ═══════════════════════════════════════════════════════
   TRIUMPH PRODUCTION — Landing Page Scripts
   Lenis smooth scroll, custom cursor, 3D tilt, carousel,
   magnetic buttons, scroll progress, animations
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Lenis Smooth Scroll ───
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);


    // ─── Custom Cursor ───
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursor && cursorDot) {
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            // Dot follows instantly
            cursorDot.style.left = cursorX + 'px';
            cursorDot.style.top = cursorY + 'px';
            if (!cursor.classList.contains('visible')) {
                cursor.classList.add('visible');
                cursorDot.classList.add('visible');
            }
        });

        // Smooth cursor follow
        function animateCursor() {
            dotX += (cursorX - dotX) * 0.15;
            dotY += (cursorY - dotY) * 0.15;
            cursor.style.left = dotX + 'px';
            cursor.style.top = dotY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Expand cursor on interactive elements
        const interactives = document.querySelectorAll('a, button, [data-tilt], .carousel__viewport');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
        });

        // Hide cursor when it leaves the window
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('visible');
            cursorDot.classList.remove('visible');
        });
        document.addEventListener('mouseenter', () => {
            cursor.classList.add('visible');
            cursorDot.classList.add('visible');
        });
    }


    // ─── Scroll Progress Bar ───
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = percent + '%';
        }, { passive: true });
    }


    // ─── Header scroll effect ───
    const header = document.getElementById('site-header');

    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();


    // ─── Mobile menu ───
    const burgerBtn = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            const isOpen = mobileMenu.classList.contains('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
            if (isOpen) lenis.stop(); else lenis.start();
        });

        mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                lenis.start();
            });
        });
    }


    // ─── Smooth scroll for anchor links (via Lenis) ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, {
                    offset: -80,
                    duration: 1.5,
                });
            }
        });
    });


    // ─── Intersection Observer for scroll animations ───
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });


    // ─── Hero video playback rate (slow down) ───
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('loadedmetadata', () => {
            heroVideo.playbackRate = 0.6;
        });
        heroVideo.playbackRate = 0.6;
    }


    // ─── 3D Tilt Effect on Cards ───
    const tiltCards = document.querySelectorAll('[data-tilt]');

    if (!isTouchDevice) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = 'transform 0.1s ease';

                // Update mouse position for glow effect
                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)';
            });
        });
    }


    // ─── Card Glow (mouse-following gradient for non-tilt cards) ───
    const glowCards = document.querySelectorAll('.project-card:not([data-tilt]), .service-card:not([data-tilt])');
    if (!isTouchDevice) {
        glowCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');
            });
        });
    }


    // ─── Magnetic Buttons ───
    const magneticBtns = document.querySelectorAll('[data-magnetic]');

    if (!isTouchDevice) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }


    // ─── Project Carousel ───
    const carousel = document.getElementById('project-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel__track');
        const slides = carousel.querySelectorAll('.carousel__slide');
        const dots = carousel.querySelectorAll('.carousel__dot');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoplayTimer = null;

        function goToSlide(index, animate = true) {
            // Clamp
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;

            currentSlide = index;

            // Move track
            if (!animate) track.style.transition = 'none';
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            if (!animate) {
                // Force reflow
                track.offsetHeight;
                track.style.transition = '';
            }

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });

            // Handle video play/pause
            slides.forEach((slide, i) => {
                const video = slide.querySelector('video');
                if (video) {
                    if (i === currentSlide) {
                        video.currentTime = 0;
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                }
            });

            // Reset autoplay timer
            resetAutoplay();
        }

        // Arrow buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
            });
        }

        // Dot buttons
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const goto = parseInt(dot.dataset.goto);
                goToSlide(goto);
            });
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isDragging = true;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToSlide(currentSlide + 1);
                } else {
                    goToSlide(currentSlide - 1);
                }
            }
            isDragging = false;
        }, { passive: true });

        // Keyboard navigation
        carousel.setAttribute('tabindex', '0');
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToSlide(currentSlide - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToSlide(currentSlide + 1);
            }
        });

        // Autoplay
        function resetAutoplay() {
            if (autoplayTimer) clearInterval(autoplayTimer);
            autoplayTimer = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 8000);
        }

        // Pause autoplay on hover
        carousel.addEventListener('mouseenter', () => {
            if (autoplayTimer) clearInterval(autoplayTimer);
        });

        carousel.addEventListener('mouseleave', () => {
            resetAutoplay();
        });

        // Initialize first slide
        goToSlide(0, false);
    }


    // ─── Lazy video playback: only play when visible ───
    const allVideos = document.querySelectorAll('.project-card video');

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                if (video.paused) {
                    video.play().catch(() => {});
                }
            } else {
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.1
    });

    allVideos.forEach(video => {
        video.pause();
        videoObserver.observe(video);
    });


    // ─── Stat counter animation ───
    function animateCounter(el, target, duration = 1500) {
        const startTime = performance.now();
        const suffix = el.textContent.replace(/[\d,.]/g, '');

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const current = Math.floor(easeProgress * target);

            if (target >= 1000) {
                el.textContent = (current / 1000).toFixed(0) + 'K+';
            } else {
                el.textContent = current + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const statValues = document.querySelectorAll('.stat__value');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent.trim();
                let num = parseInt(text.replace(/[^\d]/g, ''));
                if (text.includes('K')) num *= 1000;
                animateCounter(el, num);
                statObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => statObserver.observe(el));


    // ─── Parallax Orbs on scroll ───
    const heroOrbs = document.querySelector('.hero__orbs');
    if (heroOrbs) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const orbs = heroOrbs.children;
            if (orbs[0]) orbs[0].style.transform = `translateY(${scrollY * 0.15}px)`;
            if (orbs[1]) orbs[1].style.transform = `translateY(${scrollY * -0.1}px)`;
            if (orbs[2]) orbs[2].style.transform = `translateY(${scrollY * 0.08}px)`;
        }, { passive: true });
    }

});
