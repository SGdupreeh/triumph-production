/* ═══════════════════════════════════════════
   LINEAR STYLE — Minimal JS v2
   + Квантовая топологическая волна (The Quantum Wave / Grid)
   + Obsession Metrics Loading Animation
   ═══════════════════════════════════════════ */
(function(){
    'use strict';

    // Объявляем переменную на самом верхнем уровне, чтобы избежать ошибки Temporal Dead Zone
    let lenis; 

    /* ── Shutter Footer Reveal Height Auto-adjust ── */
    function adjustFooterReveal() {
        const wrapper = document.querySelector('.site-wrapper');
        const footer = document.querySelector('.foot');
        if (wrapper && footer && window.innerWidth > 768) {
            wrapper.style.marginBottom = footer.offsetHeight + 'px';
        } else if (wrapper) {
            wrapper.style.marginBottom = '0px';
        }
        
        // Синхронизация с Lenis без краша
        if (lenis && typeof lenis.resize === 'function') {
            lenis.resize();
        }
    }
    window.addEventListener('resize', adjustFooterReveal);
    window.addEventListener('load', adjustFooterReveal);
    document.addEventListener('DOMContentLoaded', adjustFooterReveal);
    
    // Безопасный мгновенный вызов для блокировки сдвига
    adjustFooterReveal(); 
    setTimeout(adjustFooterReveal, 50);
    setTimeout(adjustFooterReveal, 400);

    /* ── WebGL: Квантовая топологическая волна (Slow, Elegant, High-End Visuals) ── */
    function initWebGL() {
        const container = document.getElementById('webgl-hero');
        if (!container) return;
        
        if (typeof THREE === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => startThreeScene(container);
            document.head.appendChild(script);
        } else {
            startThreeScene(container);
        }
    }

    function startThreeScene(container) {
        const scene = new THREE.Scene();
        
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Создаем широкую трехмерную топологическую плоскость
        const geometry = new THREE.PlaneGeometry(100, 75, 55, 45);
        
        // Премиальная сетка чисто белого цвета с тонкой прозрачностью
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.065
        });
        const waveMesh = new THREE.Mesh(geometry, material);
        
        // Наклоняем плоскость горизонтально в глубину сцены
        waveMesh.rotation.x = -Math.PI / 2.3;
        // Опускаем сильно вниз, чтобы сформировать роскошную подложку и полностью освободить буквы TRIUMPH
        waveMesh.position.y = -14;
        waveMesh.position.z = -3;
        scene.add(waveMesh);

        camera.position.z = 22;
        camera.position.y = 0;

        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;

        document.addEventListener('mousemove', (e) => {
            // Элегантные микро-движения без неконтролируемого разгона
            targetX = (e.clientX - window.innerWidth / 2) * 0.0003;
            targetY = (e.clientY - window.innerHeight / 2) * 0.0003;
        });

        const posAttr = geometry.attributes.position;
        const count = posAttr.count;

        function animate() {
            requestAnimationFrame(animate);
            
            // Очень медленный, благородный синематичный темп времени
            const time = performance.now() * 0.0006;
            
            // Плавное следование за курсором (Lerp)
            currentX += (targetX - currentX) * 0.04;
            currentY += (targetY - currentY) * 0.04;
            
            // Процедурное моделирование волн математической ткани
            for (let i = 0; i < count; i++) {
                const x = posAttr.getX(i);
                const y = posAttr.getY(i);
                
                // Композиция независимых тригонометрических волн для естественности
                const wave1 = Math.sin(x * 0.12 + time * 1.3) * Math.cos(y * 0.08 + time * 1.0) * 3.4;
                const wave2 = Math.sin(x * 0.05 - time * 0.6) * Math.sin(y * 0.06 + time * 0.8) * 1.8;
                
                // Локальная интерактивная рябь от мыши
                const mouseWave = Math.sin(x * 0.07 + currentX * 8) * Math.cos(y * 0.07 + currentY * 8) * 1.0;
                
                posAttr.setZ(i, wave1 + wave2 + mouseWave);
            }
            posAttr.needsUpdate = true;
            
            // Легкий параллакс плоскости от курсора
            waveMesh.rotation.z = currentX * 0.35;
            waveMesh.rotation.x = -Math.PI / 2.3 + (currentY * 0.2);
            
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            const w = container.clientWidth || window.innerWidth;
            const h = container.clientHeight || window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }
    window.addEventListener('DOMContentLoaded', initWebGL);


    /* ── 3D Tilt ── */
    document.querySelectorAll('.tilt-card').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const cx = r.width / 2;
            const cy = r.height / 2;
            const rx = ((y - cy) / cy) * -4;
            const ry = ((x - cx) / cx) * 4;
            el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    /* ── Magnetic Buttons ── */
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) * 0.3;
            const y = (e.clientY - r.top - r.height / 2) * 0.3;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    /* ── Custom cursor ── */
    const cur = document.getElementById('cursor');
    if (window.matchMedia('(pointer:fine)').matches) {
        let isCursorVisible = false;
        
        document.addEventListener('mousemove', e => {
            cur.style.left = e.clientX + 'px';
            cur.style.top = e.clientY + 'px';
            if (!isCursorVisible) {
                cur.classList.add('visible');
                isCursorVisible = true;
            }
        });

        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
                cur.classList.remove('visible');
                isCursorVisible = false;
            }
        });

        document.addEventListener('mouseenter', () => {
            cur.classList.add('visible');
            isCursorVisible = true;
        });
        
        document.querySelectorAll('a,button,.vcard,.sqcard,.feat,.client-card,.cpill,.btn').forEach(el => {
            el.addEventListener('mouseenter', () => cur.classList.add('hover'));
            el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
        });
    }

    /* Smooth scroll (Lenis) */
    // Инициализируем объявленную выше переменную
    lenis = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.8 });
    function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    /* Anchor scroll */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const t = document.querySelector(a.getAttribute('href'));
            if(t){ e.preventDefault(); lenis.scrollTo(t,{offset:-40}); }
        });
    });

    /* ── Split-word setup ── */
    document.querySelectorAll('[data-a="word"]').forEach(el => {
        const text = el.textContent.trim();
        el.innerHTML = text.split(/\s+/).map((w, i) =>
            `<span class="word" style="--i:${i};transition-delay:${i * 0.07}s">${w}</span>`
        ).join(' ');
    });

    /* Nav scroll */
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', scrollY > 30);
    }, { passive: true });

    /* Burger */
    const burger = document.getElementById('burger');
    const mob = document.getElementById('mob');
    function close(){ burger.classList.remove('on'); mob.classList.remove('on'); }
    burger.addEventListener('click', () => { burger.classList.toggle('on'); mob.classList.toggle('on'); });
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

    /* Scroll animations */
    const obs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                const parent = e.target.parentElement;
                const siblings = parent.querySelectorAll('[data-a]');
                let idx = Array.from(siblings).indexOf(e.target);
                if (idx < 0) idx = 0;
                setTimeout(() => e.target.classList.add('in'), idx * 250);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -10px 0px' });
    document.querySelectorAll('[data-a]').forEach(el => obs.observe(el));

    /* ── Parallax ── */
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length) {
        window.addEventListener('scroll', () => {
            const sy = window.scrollY;
            parallaxEls.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.1;
                el.style.transform = `translateY(${sy * speed}px)`;
            });
        }, { passive: true });
    }

    /* Lazy video */
    const vobs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.play().catch(()=>{});
            else e.target.pause();
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.vcard__vid video, .sqcard__vid video').forEach(v => { v.pause(); vobs.observe(v); });

    /* Card glow tracking */
    document.querySelectorAll('.vcard, .sqcard, .feat, .bento__card, .client-card, .faq-card').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    /* ── Stat counter + Obsession Metrics (Синхронное заполнение прогресс-баров) ── */
    const sobs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            sobs.unobserve(e.target);
            
            const parentItem = e.target.closest('.stats__item');
            const progressBar = parentItem ? parentItem.querySelector('.stats__bar') : null;
            const statusText = parentItem ? parentItem.querySelector('.stats__status') : null;
            
            if (statusText) statusText.classList.add('active');

            const raw = e.target.textContent;
            const m = raw.match(/(\d+)/);
            if (!m) return;
            const end = +m[1], suf = raw.replace(m[1],'');
            const dur = 1800, t0 = performance.now();
            e.target.textContent = '0' + suf;
            
            (function tick(now){
                const p = Math.min((now-t0)/dur,1);
                const eased = 1 - Math.pow(1 - p, 3);
                
                e.target.textContent = Math.floor(eased * end) + suf;
                
                if (progressBar) progressBar.style.width = (eased * 100) + '%';
                
                if(p < 1) {
                    requestAnimationFrame(tick);
                } else {
                    if (statusText) {
                        statusText.classList.remove('active');
                        statusText.style.opacity = '0.4';
                    }
                }
            })(t0);
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.stats__num').forEach(el => sobs.observe(el));

    /* Bento counter */
    const bentoObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            bentoObs.unobserve(e.target);
            const count = +e.target.dataset.count;
            if (!count) return;
            const dur = 2000, t0 = performance.now();
            const suffix = (e.target.dataset.suffix || (e.target.textContent.includes('+') ? '+' : '')).replace(/ /g, ' ');
            (function tick(now){
                const p = Math.min((now-t0)/dur,1);
                const eased = 1 - Math.pow(1 - p, 3);
                const val = Math.floor(eased * count);
                e.target.textContent = val.toLocaleString('ru-RU').replace(/ | /g, ' ') + suffix;
                if(p<1) requestAnimationFrame(tick);
            })(t0);
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.bento__num[data-count]').forEach(el => bentoObs.observe(el));

    /* ── i18n ── */
    const i18n = {
        en: {
            'nav.work': 'Projects',
            'nav.feat': 'Services',
            'nav.faq': 'FAQ',
            'nav.contact': 'Contact',
            'nav.cta': 'Discuss project →',
            'hero.h': 'AI video production of the new generation',
            'hero.p': 'Visual content that takes brands beyond the ordinary<br class=\"desk\">and generates a flow of clients.<br class=\"desk\">VFX, AI, Motion Design.',
            'stats.views': 'Views',
            'stats.projects': 'Projects',
            'stats.days': 'Days on average',
            'stats.result': 'Result',
            'work.label': 'Projects',
            'work.h': 'Built for results',
            'work.p': 'Each project is a business solution through visual storytelling.',
            'feat.label': 'Capabilities',
            'feat.h': 'Full production cycle',
            'feat.p': 'From idea to finished content — all in one hands.',
            'feat.t1': 'Creative & AI',
            'feat.d1': 'Generation of unique visuals, photo-realistic models, and scripts without huge budgets for large-scale shoots. Midjourney, Kling AI, Gen-3 Alpha.',
            'feat.t2': 'VFX & Editing',
            'feat.d2': 'After Effects, camera tracking, CG element integration. Top-tier dynamic editing.',
            'feat.t3': 'Web & Bots',
            'feat.d3': 'High-converting landing pages for projects, Telegram bots for automated lead processing.',
            'clients.label': 'Clients',
            'clients.a7': 'Timber holding',
            'clients.gww': 'HR platform',
            'clients.teplo': 'Skolkovo',
            'clients.damo': 'AI Startup',
            'case.label': 'Case: A7DOK',
            'case.h': 'Results in 2 weeks',
            'case.p': 'Instagram launch from scratch for a timber factory. Zero ad budget.',
            'case.c1': 'Views on <strong>one Reels</strong> in an ultra-conservative B2B niche (timber export) in the first 10 days.',
            'case.c2': '<strong>Targeted followers</strong> — buyers, builders, furniture makers — attracted to a brand new account.',
            'case.c3': '<strong>In direct sales</strong> generated in two weeks. Viral content directly converted into major B2B deals.',
            'case.c4': '<strong>Total organic reach</strong> of the brand in 2 weeks. Content makes social media algorithms work for business.',
            'case.posts': 'posts',
            'case.followers': 'followers',
            'case.following': 'following',
            'case2.label': 'Case: GlobalWorkWay',
            'case2.h': 'Content that sells services',
            'case2.p': 'Instagram management for an HR platform helping drivers find jobs in Russia.',
            'case2.range': '40–80K',
            'case2.c1': 'Average views per Reels. Consistent reach to the target audience — drivers, carriers, logistics.',
            'case2.c2': '<strong>Followers</strong> — target audience of drivers and job seekers, attracted by organic AI content.',
            'case2.c3': 'Constant flow of incoming messages. Every reel generates leads in DM and <strong>WhatsApp</strong>.',
            'case2.c4': 'Content converts into <strong>real sales</strong>. Job seekers pay for document processing and employment services directly through the profile.',
            'case2.dm': 'DM / WhatsApp',
            'case2.sales': 'Service purchases',
            'case2.posts': 'posts',
            'case2.followers': 'followers',
            'case2.following': 'following',
            'contact.label': 'Contacts',
            'contact.sub': 'Need a project, have a proposal, or just<br>want to say hello — write to me',
            'btn.work': 'View works ↓',
            'btn.tg': 'Write on Telegram',
            'faq.label': 'FAQ',
            'faq.h': 'Frequently Asked Questions',
            'faq.p': 'Demystifying AI and making the process completely transparent.',
            'faq.q1': 'Do we need to organize video shoots?',
            'faq.a1': 'No, we create photorealistic content entirely using AI and CG, saving you thousands on studio rentals and film crews.',
            'faq.q2': 'Who owns the copyrights?',
            'faq.a2': 'They belong entirely to you. You receive pure, exclusive content for any commercial use.',
            'faq.q3': 'What are the timelines?',
            'faq.a3': 'From 3 to 7 days for one fully finished video.',
            'proj.b1': 'B2B & Industry',
            'proj.t1': 'Corporate Factory Promo',
            'proj.v1': '120K+ views',
            'proj.d1': '14 days',
            'proj.b2': 'AI Generation & VFX',
            'proj.t2': 'Creative AI Composition',
            'proj.v2': '85K+ views',
            'proj.d2': '7 days',
            'proj.b3': 'Video Production',
            'proj.t3': 'Dynamic Video Content',
            'proj.v3': '200K+ views',
            'proj.d3': '10 days',
            'proj.b4': 'AI Marketing',
            'proj.t4': 'AI Promo for FMCG',
            'proj.b5': 'Fashion & Lifestyle',
            'proj.t5': 'Brand Promo'
        },
        ru: {
            'nav.work': 'Проекты',
            'nav.feat': 'Услуги',
            'nav.faq': 'FAQ',
            'nav.contact': 'Контакт',
            'nav.cta': 'Обсудить проект →',
            'hero.h': 'AI-видеопродакшн нового поколения',
            'hero.p': 'Визуальный контент, который выводит бренды<br class=\"desk\">за рамки привычного и генерирует поток клиентов.<br class=\"desk\">VFX, AI, Motion Design.',
            'stats.views': 'Просмотров',
            'stats.projects': 'Проектов',
            'stats.days': 'Дней в среднем',
            'stats.result': 'Результат',
            'work.label': 'Проекты',
            'work.h': 'Созданы для результата',
            'work.p': 'Каждый проект — это решение бизнес-задачи через визуальный сторителлинг.',
            'feat.label': 'Возможности',
            'feat.h': 'Полный цикл продакшна',
            'feat.p': 'От идеи до готового контента — всё в одних руках.',
            'clients.label': 'Клиенты',
            'clients.a7': 'Лесопромышленный холдинг',
            'clients.gww': 'HR-платформа',
            'clients.teplo': 'Сколково',
            'clients.damo': 'AI-стартап',
            'case.label': 'Кейс: A7DOK',
            'case.h': 'Результаты за 2 недели',
            'case.p': 'Запуск Instagram с нуля для деревообрабатывающего завода. Без рекламного бюджета.',
            'case.c1': 'Просмотров на <strong>одном Reels</strong> в ультра-консервативной B2B-нише (экспорт пиломатериалов) за первые 10 дней.',
            'case.c2': '<strong>Целевых подписчиков</strong> — байеры, застройщики, мебельщики — привлечено на абсолютно новый аккаунт.',
            'case.c3': '<strong>Новых продаж</strong> сгенерировано за две недели. Вирусный контент напрямую конвертировался в крупные B2B-сделки.',
            'case.c4': '<strong>Суммарный органический охват</strong> бренда за 2 недели. Контент заставляет алгоритмы соцсетей работать на бизнес.',
            'case.posts': 'публикаций',
            'case.followers': 'подписчиков',
            'case.following': 'подписок',
            'case2.label': 'Кейс: GlobalWorkWay',
            'case2.h': 'Контент, который продаёт услуги',
            'case2.p': 'Ведение Instagram для HR-платформы по трудоустройству водителей в РФ.',
            'case2.range': '40–80K',
            'case2.c1': 'Средние просмотры на Reels. Стабильный охват целевой аудитории — водители, перевозчики, логисты.',
            'case2.c2': '<strong>Подписчиков</strong> — целевая аудитория из водителей и соискателей, привлечённая органическим AI-контентом.',
            'case2.c3': 'Постоянный поток входящих сообщений. Каждый ролик генерирует заявки в директ и <strong>WhatsApp</strong>.',
            'case2.c4': 'Контент конвертируется в <strong>реальные продажи</strong>. Соискатели оплачивают услуги по оформлению документов и трудоустройству напрямую через профиль.',
            'case2.dm': 'DM / WhatsApp',
            'case2.sales': 'Покупка услуг',
            'case2.posts': 'публикаций',
            'case2.followers': 'подписчиков',
            'case2.following': 'подписок',
            'contact.label': 'Контакты',
            'contact.sub': 'Нужен проект, есть предложение или вы хотите<br>просто поздороваться — пишите',
            'btn.work': 'Смотреть работы ↓',
            'btn.tg': 'Написать в Telegram',
            'faq.label': 'FAQ',
            'faq.h': 'Частые вопросы',
            'faq.p': 'Снимаем страхи перед AI и делаем процесс прозрачным.',
            'faq.q1': 'Нужно ли нам организовывать съемки?',
            'faq.a1': 'Нет, мы создаем фотореалистичный контент полностью на базе ИИ и графики, экономя вам сотни тысяч рублей на аренде студий и операторах.',
            'faq.q2': 'Кому принадлежат авторские права?',
            'faq.a2': 'Полностью вам. Вы получаете чистый эксклюзивный контент для любых коммерческих целей.',
            'faq.q3': 'Каковы сроки?',
            'faq.a3': 'От 3 до 7 дней на один готовый ролик под ключ.',
            'proj.b1': 'Б2Б & Промышленность',
            'proj.t1': 'Имиджевое продвижение завода',
            'proj.v1': '120K+ просмотров',
            'proj.d1': '14 дней',
            'proj.b2': 'AI-генерация & VFX',
            'proj.t2': 'Креативная AI-композиция',
            'proj.v2': '85K+ просмотров',
            'proj.d2': '7 дней',
            'proj.b3': 'Видеопродакшн',
            'proj.t3': 'Динамичный видеоконтент',
            'proj.v3': '200K+ просмотров',
            'proj.d3': '10 дней',
            'proj.b4': 'AI-маркетинг',
            'proj.t4': 'AI-промо для FMCG',
            'proj.b5': 'Fashion & Lifestyle',
            'proj.t5': 'Имиджевый промо'
        }
    };

    let currentLang = 'ru';
    const langBtn = document.getElementById('langToggle');
    
    function setLang(lang) {
        currentLang = lang;
        langBtn.textContent = lang === 'ru' ? 'EN' : 'RU';
        document.documentElement.lang = lang;
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const val = i18n[lang][key];
            if (!val) return;
            
            if (el.dataset.a === 'word') {
                el.innerHTML = val.replace(/&nbsp;/g, ' ').split(/\s+/).map((w, i) =>
                    `<span class="word" style="transition-delay:${i * 0.07}s">${w}</span>`
                ).join(' ');
                if (el.classList.contains('in')) {
                    el.querySelectorAll('.word').forEach(w => w.style.opacity = 1);
                }
            } else {
                el.innerHTML = val;
            }
        });
    }
    
    langBtn.addEventListener('click', () => {
        setLang(currentLang === 'ru' ? 'en' : 'ru');
    });

})();
