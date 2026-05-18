/* ═══════════════════════════════════════════
   LINEAR STYLE — Minimal JS v2
   + split-word, parallax, stat counter
   ═══════════════════════════════════════════ */
(function(){
    'use strict';


    /* ── Custom cursor ── */
    const cur = document.getElementById('cursor');
    if (window.matchMedia('(pointer:fine)').matches) {
        document.addEventListener('mousemove', e => {
            cur.style.left = e.clientX + 'px';
            cur.style.top = e.clientY + 'px';
            if (!cur.classList.contains('visible')) cur.classList.add('visible');
        });
        document.addEventListener('mouseleave', () => cur.classList.remove('visible'));
        document.addEventListener('mouseenter', () => cur.classList.add('visible'));
        document.querySelectorAll('a,button,.vcard,.sqcard,.feat,.client-card,.cpill,.btn').forEach(el => {
            el.addEventListener('mouseenter', () => cur.classList.add('hover'));
            el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
        });
    }

    /* Smooth scroll (Lenis) */
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.8 });
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

    /* Scroll animations (includes split-word) */
    const obs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                const parent = e.target.parentElement;
                const siblings = parent.querySelectorAll('[data-a]');
                let idx = Array.from(siblings).indexOf(e.target);
                if (idx < 0) idx = 0;
                setTimeout(() => e.target.classList.add('in'), idx * 100);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
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

    /* Stat counter */
    const sobs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            sobs.unobserve(e.target);
            const raw = e.target.textContent;
            const m = raw.match(/(\d+)/);
            if (!m) return;
            const end = +m[1], suf = raw.replace(m[1],'');
            const dur = 1600, t0 = performance.now();
            e.target.textContent = '0' + suf;
            (function tick(now){
                const p = Math.min((now-t0)/dur,1);
                const eased = 1 - Math.pow(1 - p, 3);
                e.target.textContent = Math.floor(eased * end) + suf;
                if(p<1) requestAnimationFrame(tick);
            })(t0);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stats__num').forEach(el => sobs.observe(el));

    /* Bento counter */
    const bentoObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            bentoObs.unobserve(e.target);
            const count = +e.target.dataset.count;
            if (!count) return;
            const dur = 2000, t0 = performance.now();
            const suffix = e.target.textContent.includes('+') ? '+' : '';
            (function tick(now){
                const p = Math.min((now-t0)/dur,1);
                const eased = 1 - Math.pow(1 - p, 3);
                const val = Math.floor(eased * count);
                e.target.textContent = val.toLocaleString('ru-RU').replace(/ /g, ' ') + suffix;
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
            'nav.contact': 'Contact',
            'nav.cta': 'Discuss project →',
            'hero.h': 'AI\u00a0video\u00a0production of\u00a0the\u00a0new generation',
            'hero.p': 'I create visual content that takes brands beyond the ordinary and generates a flow of clients. VFX, AI,\u00a0Motion\u00a0Design.',
            'stats.views': 'Views',
            'stats.projects': 'Projects',
            'stats.days': 'Days on average',
            'stats.result': 'Result',
            'work.label': 'Projects',
            'work.h': 'Built for\u00a0results',
            'work.p': 'Each project is a business solution through visual storytelling.',
            'feat.label': 'Capabilities',
            'feat.h': 'Full production\u00a0cycle',
            'feat.p': 'From idea to finished content — all in one hands.',
            'clients.label': 'Clients',
            'clients.a7': 'Timber holding',
            'clients.gww': 'HR platform',
            'clients.teplo': 'Skolkovo',
            'case.label': 'Case: A7DOK',
            'case.h': 'Results in 2\u00a0weeks',
            'case.p': 'Instagram launch from scratch for a timber factory.\u00a0Zero ad budget.',
            'case.c1': 'Views on <strong>one Reels</strong> in an ultra-conservative B2B niche (timber export) in the\u00a0first 10\u00a0days.',
            'case.c2': '<strong>Targeted followers</strong> — buyers, builders, furniture makers — attracted to a brand new account.',
            'case.c3': 'Viral AI content → profile visit → targeted click to\u00a0<strong>WhatsApp sales dept</strong>.',
            'case.c4': '<strong>Total organic reach</strong> of the brand in 2 weeks. Content makes social media algorithms work for\u00a0business.',
            'case.posts': 'posts',
            'case.followers': 'followers',
            'case.following': 'following',
            'case2.label': 'Case: GlobalWorkWay',
            'case2.h': 'Content that sells\u00a0services',
            'case2.p': 'Instagram management for an HR platform helping drivers find jobs in\u00a0Russia.',
            'case2.range': '40\u201380K',
            'case2.c1': 'Average views per\u00a0Reels. Consistent reach to the target audience \u2014 drivers, carriers, logistics.',
            'case2.c2': '<strong>Followers</strong> \u2014 target audience of drivers and job seekers, attracted by organic AI\u00a0content.',
            'case2.c3': 'Constant flow of incoming messages. Every reel generates leads in DM and\u00a0<strong>WhatsApp</strong>.',
            'case2.c4': 'Content converts into <strong>real sales</strong>. Job seekers pay for document processing and employment services directly through the\u00a0profile.',
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
            'faq.a3': 'From 3 to 7 days for one fully finished video.'
        },
        ru: {
            'nav.work': '\u041f\u0440\u043e\u0435\u043a\u0442\u044b',
            'nav.feat': '\u0423\u0441\u043bу\u0433\u0438',
            'nav.contact': '\u041aонт\u0430\u043aт',
            'nav.cta': '\u041e\u0431\u0441\u0443\u0434\u0438\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442 \u2192',
            'hero.h': 'AI-\u0432\u0438\u0434\u0435\u043e\u043f\u0440\u043eд\u0430\u043a\u0448\u043d \u043dо\u0432ого\u00a0\u043fокол\u0435ни\u044f',
            'hero.p': '\u0421\u043e\u0437\u0434\u0430\u044e \u0432\u0438\u0437\u0443\u0430\u043b\u044c\u043d\u044b\u0439 \u043aонт\u0435н\u0442, \u043a\u043eт\u043e\u0440\u044b\u0439 \u0432\u044b\u0432\u043e\u0434\u0438\u0442 \u0431\u0440\u0435н\u0434\u044b<br class="desk">\u0437\u0430\u00a0\u0440\u0430м\u043a\u0438 \u043f\u0440\u0438\u0432\u044b\u0447\u043dого \u0438\u00a0\u0433\u0435\u043d\u0435\u0440\u0438\u0440\u0443\u0435\u0442 \u043f\u043e\u0442\u043e\u043a\u00a0\u043aл\u0438\u0435н\u0442\u043e\u0432. VFX, AI,\u00a0Motion\u00a0Design.',
            'stats.views': '\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u043e\u0432',
            'stats.projects': '\u041f\u0440\u043e\u0435\u043a\u0442\u043e\u0432',
            'stats.days': '\u0414\u043d\u0435\u0439 \u0432 \u0441\u0440\u0435\u0434\u043d\u0435\u043c',
            'stats.result': '\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442',
            'work.label': '\u041f\u0440\u043e\u0435\u043a\u0442\u044b',
            'work.h': '\u0421\u043e\u0437\u0434\u0430\u043d\u044b \u0434\u043b\u044f\u00a0\u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442а',
            'work.p': '\u041a\u0430\u0436\u0434\u044b\u0439 \u043f\u0440\u043e\u0435\u043a\u0442 \u2014 \u044d\u0442\u043e \u0440\u0435\u0448\u0435\u043d\u0438\u0435 \u0432\u0438\u0437\u0443\u0430\u043b\u044c\u043d\u044b\u0439 \u0441\u0442\u043e\u0440\u0438\u0442\u0435\u043b\u043b\u0438\u043d\u0433.',
            'feat.label': '\u0412\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u0438',
            'feat.h': '\u041f\u043e\u043b\u043d\u044b\u0439 \u0446\u0438\u043a\u043b\u00a0\u043f\u0440\u043e\u0434\u0430\u043a\u0448\u043d\u0430',
            'feat.p': '\u041e\u0442 \u0438\u0434\u0435\u0438 \u0434\u043e \u0433о\u0442\u043e\u0432\u043e\u0433о \u043aонт\u0435н\u0442а \u2014 \u0432\u0441\u0451 \u0432 \u043e\u0434\u043d\u0438\u0445 \u0440\u0443\u043a\u0430\u0445.',
            'clients.label': '\u041a\u043b\u0438\u0435н\u0442\u044b',
            'clients.a7': '\u041b\u0435\u0441\u043e\u043f\u0440о\u043c\u044b\u0448\u043b\u0435\u043d\u043d\u044b\u0439 \u0445ол\u0434\u0438\u043d\u0433',
            'clients.gww': 'HR-\u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430',
            'clients.teplo': '\u0421\u043a\u043e\u043b\u043a\u043e\u0432\u043e',
            'case.label': '\u041a\u0435\u0439\u0441: A7DOK',
            'case.h': '\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0437\u0430 2\u00a0\u043d\u0435\u0434\u0435л\u0438',
            'case.p': '\u0417\u0430\u043f\u0443\u0441\u043a Instagram \u0441 \u043d\u0443\u043b\u044f \u0434\u043b\u044f \u0434\u0435\u0440\u0435\u0432\u043e\u043e\u0431\u0440\u0430\u0431\u0430\u0442\u044b\u0432\u0430\u044e\u0449\u0435\u0433о \u0437\u0430\u0432\u043e\u0434а.\u00a0\u0411\u0435\u0437 \u0440\u0435\u043a\u043b\u0430\u043cно\u0433о \u0431\u044e\u0434\u0436\u0435\u0442\u0430.',
            'case.c1': '\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u043e\u0432 \u043d\u0430 <strong>\u043eдно\u043c Reels</strong> \u0432 \u0443\u043b\u044c\u0442\u0440\u0430-\u043aо\u043d\u0441\u0435\u0440\u0432\u0430\u0442\u0438\u0432\u043d\u043e\u0439 B2B-\u043d\u0438\u0448\u0435 (\u044d\u043a\u0441\u043f\u043e\u0440\u0442 \u043f\u0438\u043b\u043e\u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u043e\u0432) \u0437\u0430\u00a0\u043f\u0435\u0440\u0432\u044b\u0435 10\u00a0\u0434\u043d\u0435\u0439.',
            'case.c2': '<strong>\u0426\u0435\u043b\u0435\u0432\u044b\u0445 \u043fо\u0434\u043f\u0438\u0441\u0447\u0438\u043a\u043e\u0432</strong> \u2014 \u0431\u0430\u0439\u0435\u0440\u044b, \u0437\u0430\u0441\u0442\u0440\u043e\u0439\u0449\u0438\u043a\u0438, \u043c\u0435\u0431\u0435\u043b\u044c\u0449\u0438\u043a\u0438 \u2014 \u043f\u0440\u0438\u0432\u043b\u0435\u0447\u0435\u043dо \u043d\u0430 \u0430\u0431\u0441\u043e\u043b\u044e\u0442\u043dо \u043d\u043e\u0432\u044b\u0439 \u0430\u043a\u043a\u0430\u0443нт.',
            'case.c3': '\u0412\u0438\u0440\u0443\u0441\u043d\u044b\u0439 AI-\u043aон\u0442\u0435нт \u2192 \u043f\u0435\u0440\u0435\u0445\u043e\u0434 \u0432 \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u2192 \u0446\u0435\u043b\u0435\u0432\u043e\u0439 \u043a\u043b\u0438\u043a \u0432\u00a0<strong>WhatsApp \u043e\u0442\u0434\u0435л\u0430 \u043f\u0440\u043e\u0434\u0430\u0436</strong>.',
            'case.c4': '<strong>\u0426\u0443\u043c\u043c\u0430\u0440\u043d\u044b\u0439 \u043e\u0440\u0433\u0430\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043e\u0445\u0432\u0430\u0442</strong> \u0431\u0440\u0435н\u0434\u0430 \u0437\u0430 2 \u043d\u0435\u0434\u0435\u043b\u0438. \u041aонт\u0435нт \u0437\u0430\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u0442 \u0430\u043b\u0433\u043e\u0440\u0438\u0442\u043c\u044b \u0441\u043e\u0446\u0441\u0435\u0442\u0435\u0439 \u0440\u0430\u0431\u043eт\u0430\u0442\u044c \u043d\u0430\u00a0\u0431\u0438\u0437\u043dе\u0441.',
            'case.posts': '\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0439',
            'case.followers': '\u043f\u043eд\u043f\u0438\u0441\u0447\u0438\u043a\u043e\u0432',
            'case.following': '\u043f\u043eд\u043f\u0438\u0441\u043e\u043a',
            'case2.label': '\u041a\u0435\u0439\u0441: GlobalWorkWay',
            'case2.h': '\u041aонт\u0435нт, \u043aотор\u044b\u0439 \u043f\u0440\u043e\u0434\u0430\u0451\u0442\u00a0\u0443с\u043bу\u0433и',
            'case2.p': '\u0412\u0435\u0434\u0435\u043d\u0438\u0435 Instagram \u0434\u043b\u044f HR-\u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u044b \u043f\u043e\u00a0\u0442\u0440\u0443\u0434\u043e\u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0443 \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u0435\u0439 \u0432\u00a0\u0420\u0424.',
            'case2.range': '40\u201380K',
            'case2.c1': '\u0421\u0440\u0435\u0434\u043d\u0438\u0435 \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u043e\u0432 \u043d\u0430\u00a0Reels. \u0421\u0442\u0430\u0431\u0438\u043b\u044c\u043d\u044b\u0439 \u043e\u0445\u0432\u0430\u0442 \u0446\u0435\u043b\u0435\u0432\u043e\u0439 \u0430\u0443\u0434\u0438\u0442\u043eр\u0438\u0438 \u2014 \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u0438, \u043f\u0435\u0440\u0435\u0432\u043e\u0437\u0447\u0438\u0447\u0438, \u043b\u043e\u0433\u0438\u0441\u0442\u044b.',
            'case2.c2': '<strong>\u041f\u043e\u0434\u043f\u0438\u0441\u0447\u0438\u043a\u043e\u0432</strong> \u2014 \u0446\u0435\u043b\u0435\u0432\u0430\u044f \u0430\u0443\u0434\u0438\u0442\u043e\u0440\u0438\u044f \u0437\u00a0\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u0435\u0439 \u0438\u00a0\u0441\u043e\u0438\u0441\u043a\u0430\u0442\u0435\u043b\u0435\u0439, \u043f\u0440\u0438\u0432\u043b\u0435\u0447\u0451\u043d\u043d\u0430\u044f \u043e\u0440\u0433\u0430\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u043c AI-\u043aон\u0442\u0435нт\u043e\u043c.',
            'case2.c3': '\u041f\u043e\u0441\u0442\u043e\u044f\u043d\u043d\u044b\u0439 \u043f\u043e\u0442\u043e\u043a \u0432\u0445\u043e\u0434\u044f\u0449\u0438\u0445 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439. \u041a\u0430\u0436\u0434\u044b\u0439 \u0440\u043e\u043b\u0438\u043a \u0433\u0435н\u0435\u0440\u0438\u0440\u0443\u0435\u0442 \u0437\u0430\u044f\u0432\u043a\u0438 \u0432\u00a0\u0434\u0438\u0440\u0435\u043a\u0442 \u0438\u00a0<strong>WhatsApp</strong>.',
            'case2.c4': '\u041aонт\u0435нт \u043aон\u0432\u0435\u0440\u0442\u0438\u0440\u0443\u0435\u0442\u0441\u044f \u0432\u00a0<strong>\u0440\u0435а\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u043e\u0434\u0430\u0436\u0438</strong>. \u0421\u043e\u0438\u0441\u043a\u0430\u0442\u0435\u043b\u0438 \u043e\u043f\u043b\u0430\u0447\u0438\u0432\u0430\u044e\u0442 \u0443\u0441\u043b\u0443\u0433\u0438 \u043f\u043e\u00a0\u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u044e \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432 \u0438\u00a0\u0442\u0440\u0443\u0434\u043e\u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0443 \u043d\u0430\u043f\u0440\u044f\u043c\u0443\u044e \u0447\u0435\u0440\u0435\u0437 \u043f\u0440\u043e\u0444\u0438\u043b\u044c.',
            'case2.dm': 'DM / WhatsApp',
            'case2.sales': '\u041f\u043e\u043a\u0443\u043f\u043a\u0430 \u0443\u0441\u043b\u0443\u0433',
            'case2.posts': '\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0439',
            'case2.followers': '\u043f\u043e\u0434\u043f\u0438\u0441\u0447\u0438\u043a\u043e\u0432',
            'case2.following': '\u043f\u043e\u0434\u043f\u0438\u0441\u043e\u043a',
            'contact.label': '\u041aонт\u0430кт\u044b',
            'contact.sub': '\u041d\u0443\u0436\u0435\u043d \u043f\u0440о\u0435\u043a\u0442, \u0435\u0441\u0442\u044c \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0438\u043b\u0438 \u0432\u044b \u0445\u043e\u0442\u0438\u0442\u0435<br>\u043f\u0440\u043e\u0441\u0442\u043e \u043f\u043e\u0437\u0434\u043e\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f \u2014 \u043f\u0438\u0448\u0438\u0442\u0435',
            'faq.label': 'FAQ',
            'faq.h': 'Частые вопросы',
            'faq.p': 'Снимаем страхи перед AI и делаем процесс прозрачным.',
            'faq.q1': 'Нужно ли нам организовывать съемки?',
            'faq.a1': 'Нет, мы создаем фотореалистичный контент полностью на базе ИИ и графики, экономя вам сотни тысяч рублей на аренде студий и операторах.',
            'faq.q2': 'Кому принадлежат авторские права?',
            'faq.a2': 'Полностью вам. Вы получаете чистый эксклюзивный контент для любых коммерческих целей.',
            'faq.q3': 'Каковы сроки?',
            'faq.a3': 'От 3 до 7 дней на один готовый ролик под ключ.'
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
            
            /* Re-wrap split-word headings */
            if (el.dataset.a === 'word') {
                el.innerHTML = val.replace(/&nbsp;/g, '\u00a0').split(/\s+/).map((w, i) =>
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