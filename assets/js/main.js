const { members, timeline } = window.royaData;

function renderPhotoRotator() {
  const gallery = document.getElementById('galleryCarousel');
  if (!gallery) return;

  const images = (window.royaData.gallery || []).filter((src) => typeof src === 'string' && src.trim());

  if (!images.length) {
    gallery.innerHTML = `
      <div class="gallery-empty">
        <div class="placeholder-box">+</div>
        <div>
          <h4><ar>جاهز لاستقبال الصور</ar><en>Ready for your images</en></h4>
          <p><ar>أرسل الصور وسأضيفها هنا تلقائياً مع التبديل كل 4 ثوانٍ.</ar><en>Send the photos and I’ll add them here automatically with a 4-second rotation.</en></p>
        </div>
      </div>`;
    return;
  }

  const slides = images.map((src, index) => `
    <div class="gallery-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
      <img src="${src}" alt="Gallery image ${index + 1}" loading="eager" decoding="async">
      <div class="gallery-overlay"></div>
    </div>
  `).join('');

  const dots = images.map((_, index) => `
    <button class="gallery-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Show image ${index + 1}"></button>
  `).join('');

  gallery.innerHTML = `${slides}<div class="gallery-dots">${dots}</div>`;

  let activeIndex = 0;
  const slidesEls = gallery.querySelectorAll('.gallery-slide');
  const dotEls = gallery.querySelectorAll('.gallery-dot');

  const showSlide = (nextIndex) => {
    activeIndex = (nextIndex + slidesEls.length) % slidesEls.length;

    slidesEls.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === activeIndex);
    });

    dotEls.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  };

  dotEls.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.index));
      clearInterval(autoRotateTimer);
      autoRotateTimer = setInterval(() => showSlide(activeIndex + 1), window.royaData.galleryIntervalMs || 4000);
    });
  });

  let autoRotateTimer = setInterval(() => {
    showSlide(activeIndex + 1);
  }, window.royaData.galleryIntervalMs || 4000);
}

function renderMembers() {
  const grid = document.getElementById('membersGrid');
  if (!grid) return;

  members.forEach((member) => {
    const card = document.createElement('div');
    card.className = 'm-card';

    if (member.empty) {
      card.innerHTML = `
        <div class="m-photo">
          <div class="m-empty">
            <div class="ring">+</div>
            <span class="m-soon"><ar>مكان محجوز</ar><en>Seat reserved</en></span>
          </div>
        </div>
        <div class="m-body">
          <h4><ar>عضو جديد قريباً</ar><en>New member soon</en></h4>
          <p class="m-sub m-soon"><ar>هيتضاف بمجرد وصول البيانات</ar><en>Will appear once data arrives</en></p>
        </div>`;
    } else {
      const showRoleBadge = member.role.en === 'Family President' || member.role.en === 'Vice President';
      const hasPhoto = member.photo && member.photo.trim() !== '';
      const initials = (member.name.en || 'Member')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('') || 'M';

      card.innerHTML = `
        <div class="m-photo">
          ${showRoleBadge ? `<span class="m-role">${member.role.ar} · ${member.role.en}</span>` : ''}
          ${hasPhoto
            ? `<img src="${member.photo}" alt="${member.name.ar || member.name.en}" loading="lazy" decoding="async">`
            : `<div class="m-photo-fallback"><span>${initials}</span></div>`}
        </div>
        <div class="m-body">
          <h4>${member.name.ar || member.name.en}</h4>
          <div class="m-name-en">${member.name.en}</div>
          <div class="m-sub"><span>${member.role.ar}</span><span class="m-role-en">· ${member.role.en}</span></div>
          <ul class="m-ach">${member.achievements.map((item) => `<li><ar>${item.ar}</ar><en>${item.en}</en></li>`).join('')}</ul>
        </div>`;
    }

    grid.appendChild(card);
  });

  const count = document.getElementById('memberCount');
  if (count) {
    count.textContent = members.filter((member) => !member.empty).length;
  }
}

function renderTimeline() {
  const timelineList = document.getElementById('timelineList');
  if (!timelineList) return;

  timeline.forEach((item) => {
    const node = document.createElement('div');
    node.className = 'ev-card';
    node.style.setProperty('--ev-color', item.color);
    node.innerHTML = `
      <div class="ev-icon">${item.icon}</div>
      <div class="ev-body">
        <h4>${item.title.ar} <span style="font-weight:600; font-size:13px; color:var(--ink-soft);">— ${item.title.en}</span></h4>
        <div class="ev-tags"><ar>${item.tags.ar}</ar><en>${item.tags.en}</en></div>
        <div class="ev-org"><ar>${item.org.ar}</ar><en>${item.org.en}</en></div>
        <div class="ev-impact"><ar>${item.impact.ar}</ar><en>${item.impact.en}</en></div>
      </div>
      <div class="ev-status"><ar>${item.status.ar}</ar><en>${item.status.en}</en></div>`;

    timelineList.appendChild(node);
  });

  const eventCount = document.getElementById('eventCount');
  if (eventCount) {
    eventCount.textContent = String(timeline.length);
  }
}

function setLang(language) {
  document.documentElement.setAttribute('data-lang', language);
  document.documentElement.setAttribute('lang', language);
}

function toggleNav() {
  const nav = document.getElementById('siteNav');
  const burger = document.getElementById('navBurger');
  const isOpen = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
}

function closeNav() {
  const nav = document.getElementById('siteNav');
  const burger = document.getElementById('navBurger');
  nav.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
}

function applyTheme(theme) {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('roya-theme', nextTheme);

  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.innerHTML = nextTheme === 'dark'
      ? '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>'
      : '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>';
  }
}

function initTheme() {
  try {
    const saved = localStorage.getItem('roya-theme');
    const isDark = saved ? saved === 'dark' : true;
    applyTheme(isDark ? 'dark' : 'light');
  } catch (e) {
    applyTheme('dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(isDark ? 'light' : 'dark');
}

function initTiltEffects() {
  const stage = document.getElementById('emblemStage');
  const mediaQueryFinePointer = window.matchMedia('(pointer: fine)');

  if (!stage || !mediaQueryFinePointer.matches) return;

  let pointerX = 0;
  let pointerY = 0;
  let rafScheduled = false;

  function handlePointerFrame() {
    rafScheduled = false;
    const cx = (pointerX / window.innerWidth - 0.5) * 2;
    const cy = (pointerY / window.innerHeight - 0.5) * 2;
    stage.style.transform = `rotateY(${cx * 10}deg) rotateX(${-cy * 10}deg)`;
  }

  document.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(handlePointerFrame);
    }
  }, { passive: true });
}

function bootRoyaSite() {
  initTheme();
  renderPhotoRotator();
  renderMembers();
  renderTimeline();
  initTiltEffects();

  if (typeof window.initScrollAnimations === 'function') {
    window.initScrollAnimations();
  } else if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.wa-card').forEach((card) => {
      card.style.opacity = '1';
      card.style.visibility = 'visible';
    });
  }

  if (typeof window.royaSyncScrollLayout === 'function') {
    requestAnimationFrame(window.royaSyncScrollLayout);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootRoyaSite);
} else {
  bootRoyaSite();
}

window.setLang = setLang;
window.toggleNav = toggleNav;
window.closeNav = closeNav;
window.toggleTheme = toggleTheme;
window.applyTheme = applyTheme;
window.initTheme = initTheme;
