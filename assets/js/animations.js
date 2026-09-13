/**
 * Scroll + hero animations. Must run after dynamic content (members, timeline) is in the DOM.
 */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const scrollDefaults = { once: true, invalidateOnRefresh: true };
  const fromScroll = { immediateRender: false };

  gsap.timeline({ defaults: { ease: 'power2.out' } })
    .from('.hero-copy .eyebrow', { y: 16, opacity: 0, duration: 0.4 })
    .from('.hero-copy h1', { y: 26, opacity: 0, duration: 0.5 }, '-=0.25')
    .from('.hero-copy .lead', { y: 16, opacity: 0, duration: 0.4 }, '-=0.3')
    .from('.hstat', { y: 14, opacity: 0, duration: 0.35, stagger: 0.08 }, '-=0.2')
    .from('.cta-row .btn', { y: 10, opacity: 0, duration: 0.3, stagger: 0.06 }, '-=0.2')
    .from('.emblem-stage', { scale: 0.75, opacity: 0, rotateY: 40, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.55');

  const rtl = document.documentElement.dir === 'rtl';

  gsap.utils.toArray('section:not(.hero) .eyebrow').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      x: rtl ? 20 : -20,
      duration: 0.4,
      ...fromScroll,
      scrollTrigger: { trigger: el, start: 'top 92%', ...scrollDefaults },
    });
  });

  gsap.utils.toArray('section:not(.hero) h2.head').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 22,
      duration: 0.45,
      ease: 'power2.out',
      ...fromScroll,
      scrollTrigger: { trigger: el, start: 'top 90%', ...scrollDefaults },
    });
  });

  gsap.utils.toArray('section:not(.hero) p.lead').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 16,
      duration: 0.4,
      delay: 0.05,
      ...fromScroll,
      scrollTrigger: { trigger: el, start: 'top 90%', ...scrollDefaults },
    });
  });

  gsap.from('.badge-card', {
    opacity: 0,
    y: 18,
    rotateX: -25,
    transformOrigin: 'top center',
    duration: 0.45,
    stagger: 0.07,
    ease: 'power2.out',
    ...fromScroll,
    scrollTrigger: { trigger: '.badge-row', start: 'top 90%', ...scrollDefaults },
  });

  ScrollTrigger.batch('.m-card', {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.from(batch, {
      opacity: 0,
      y: 28,
      rotateY: -15,
      scale: 0.95,
      duration: 0.45,
      stagger: 0.07,
      ease: 'power2.out',
      immediateRender: false,
    }),
  });

  gsap.utils.toArray('.ev-card').forEach((card, i) => {
    const fromX = i % 2 === 0 ? -30 : 30;
    gsap.from(card, {
      opacity: 0,
      x: fromX,
      rotateY: i % 2 === 0 ? -5 : 5,
      duration: 0.45,
      ease: 'power2.out',
      ...fromScroll,
      scrollTrigger: { trigger: card, start: 'top 94%', ...scrollDefaults },
    });
  });

  // No opacity on .wa-card — avoids invisible QR if ScrollTrigger misfires after layout shifts
  gsap.from('.wa-card', {
    y: 24,
    scale: 0.96,
    duration: 0.4,
    ease: 'power2.out',
    immediateRender: false,
    scrollTrigger: { trigger: '.wa-grid', start: 'top 90%', ...scrollDefaults },
  });

  gsap.from('footer .foot-grid, footer .foot-bottom', {
    opacity: 0,
    y: 16,
    duration: 0.45,
    stagger: 0.07,
    ...fromScroll,
    scrollTrigger: { trigger: 'footer', start: 'top 95%', ...scrollDefaults },
  });

  const originalSetLang = window.setLang;
  if (typeof originalSetLang === 'function') {
    window.setLang = function setLangWithRefresh(language) {
      originalSetLang(language);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }

  refreshScrollTriggers();
}

function ensureWaCardVisible() {
  document.querySelectorAll('.wa-card').forEach((card) => {
    if (typeof gsap !== 'undefined') {
      gsap.set(card, { opacity: 1, visibility: 'visible', clearProps: 'opacity,visibility' });
    } else {
      card.style.opacity = '1';
      card.style.visibility = 'visible';
    }
  });
}

function refreshScrollTriggers() {
  if (typeof ScrollTrigger === 'undefined') return;
  ScrollTrigger.refresh();
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    ensureWaCardVisible();
  });
}

window.initScrollAnimations = initScrollAnimations;
window.refreshScrollTriggers = refreshScrollTriggers;

if (typeof window !== 'undefined') {
  window.addEventListener('load', refreshScrollTriggers, { passive: true });
}
