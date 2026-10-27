// @ts-nocheck
// Page behaviour for the portfolio: language switch, request dialog, open call,
// and GSAP/Lenis motion. GSAP, ScrollTrigger and Lenis load from the CDN in the
// route head, so they are read from window here.

let started = false;

function waitForLibs(timeoutMs = 4000): Promise<void> {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const tick = () => {
      const w = window as any;
      if ((w.gsap && w.ScrollTrigger && w.Lenis) || Date.now() - t0 > timeoutMs) resolve();
      else setTimeout(tick, 50);
    };
    tick();
  });
}

export async function initPortfolio() {
  if (started) return;
  started = true;
  await waitForLibs();
  const { gsap, ScrollTrigger, Lenis } = window as any;

  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = !reduce && window.gsap && window.ScrollTrigger;
  if (!motion) root.classList.remove('motion');

  const nav = document.getElementById('nav');
  const navLogo = nav.querySelector('.nav-logo');
  const refresh = () => { if (motion) ScrollTrigger.refresh(); };

  /* ---------- Language ---------- */
  const lang = nav.querySelector('.lang');
  const pill = lang.querySelector('.lang-pill');
  const langBtns = [...lang.querySelectorAll('button')];

  function placePill() {
    const active = langBtns.find((b) => b.getAttribute('aria-pressed') === 'true');
    pill.style.width = active.offsetWidth + 'px';
    pill.style.transform = `translateX(${active.offsetLeft}px)`;
  }
  function setLang(l, save) {
    root.dataset.lang = l;
    root.lang = l;
    langBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setLang === l)));
    placePill();
    if (save) { try { localStorage.setItem('lang', l); } catch (e) { /* storage blocked */ } }
    refresh();
  }
  langBtns.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.setLang, true)));
  pill.style.transition = 'none';
  setLang(root.dataset.lang || 'en', false);
  requestAnimationFrame(() => requestAnimationFrame(() => { pill.style.transition = ''; }));
  document.fonts && document.fonts.ready.then(placePill);

  /* ---------- Mobile menu ---------- */
  const menuBtn = nav.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    root.classList.toggle('menu-open', open);
  }
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
  document.addEventListener('click', (e) => { if (!menu.hidden && !nav.contains(e.target)) setMenu(false); });

  /* ---------- Copy email ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2600);
  }
  document.getElementById('copy-email').addEventListener('click', async (e) => {
    const email = e.currentTarget.dataset.email;
    const th = root.dataset.lang === 'th';
    let ok = false;
    try { await navigator.clipboard.writeText(email); ok = true; } catch (err) {
      // Older browsers and file:// pages: fall back to a hidden textarea.
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      ta.remove();
    }
    say(ok ? (th ? 'คัดลอกแล้ว: ' : 'Copied: ') + email : (th ? 'คัดลอกไม่ได้ ใช้อีเมลนี้: ' : 'Could not copy. Email: ') + email);
  });

  /* ---------- Request CV / collaboration ---------- */
  const EMAIL = 'srichausiripong@gmail.com';
  const drafts = {
    cv: {
      en: { subject: 'CV request', body: 'Hi Arm,\n\nI’m [your name] from [organisation]. We’re hiring for [role] and would like to see your CV and portfolio.\n\nThanks,\n[your name]' },
      th: { subject: 'ขอดู CV', body: 'สวัสดีคุณอาร์ม\n\n[ชื่อของคุณ] จาก [องค์กร] กำลังเปิดรับตำแหน่ง [ชื่อตำแหน่ง] และอยากขอดู CV กับพอร์ตโฟลิโอ\n\nขอบคุณ\n[ชื่อของคุณ]' },
    },
    apply: {
      en: { subject: 'Application: November open call', body: 'Hi Arm,\n\nWe’d like to apply for the November open call.\n\n1. Organisation or brand name, and page or website link (if any):\n2. What you do and for whom (2–3 lines):\n3. Which piece of work (one-page website / marketing plan / content set):\n4. Your biggest problem right now:\n5. If this works, what do you want to see change in one month:\n6. Main contact person and best channel:\n7. Do you agree to the portfolio, review and one-month numbers terms (yes / no):\n8. If you can pay, roughly how much (THB 0 / up to 2,000 / 2,000–5,000 / over 5,000):\n\nThanks,\n' },
      th: { subject: 'สมัครรอบพฤศจิกายน', body: 'สวัสดีคุณอาร์ม\n\nขอสมัครรอบเดือนพฤศจิกายน\n\n1. ชื่อองค์กรหรือแบรนด์ และลิงก์เพจหรือเว็บ (ถ้ามี):\n2. ทำอะไร ให้ใครอยู่ เล่าสั้น ๆ 2–3 บรรทัด:\n3. อยากได้งานแบบไหน (เว็บหน้าเดียว / แผนการตลาด / ชุดคอนเทนต์):\n4. ตอนนี้ติดปัญหาอะไรที่สุด:\n5. ถ้างานนี้เวิร์ก 1 เดือนข้างหน้าอยากเห็นอะไรเปลี่ยน:\n6. ใครเป็นผู้ประสานงานหลัก และสะดวกคุยช่องทางไหน:\n7. ตกลงเงื่อนไขลงพอร์ต รีวิว และแชร์ตัวเลขหลัง 1 เดือนไหม (ใช่ / ไม่ใช่):\n8. ถ้าจ่ายได้ ประมาณเท่าไร (0 บาท / ไม่เกิน 2,000 / 2,000–5,000 / มากกว่า 5,000):\n\nขอบคุณ\n' },
    },
    collab: {
      en: { subject: 'Collaboration idea', body: 'Hi Arm,\n\nI’m [your name] from [organisation]. We’re working on [project] and would like to talk about [campaign / platform / training / proposal].\n\nTimeline: \nBudget (if known): \n\nThanks,\n[your name]' },
      th: { subject: 'ชวนทำงานร่วมกัน', body: 'สวัสดีคุณอาร์ม\n\n[ชื่อของคุณ] จาก [องค์กร] กำลังทำโครงการ [ชื่อโครงการ] และอยากคุยเรื่อง [แคมเปญ / แพลตฟอร์ม / การอบรม / ข้อเสนอโครงการ]\n\nช่วงเวลา: \nงบประมาณ (ถ้ามี): \n\nขอบคุณ\n[ชื่อของคุณ]' },
    },
  };
  const dlg = document.getElementById('request');
  const seg = dlg.querySelector('.seg');
  const segBtns = [...seg.querySelectorAll('button')];
  const msg = document.getElementById('req-msg');
  const send = document.getElementById('req-send');
  let purpose = 'cv';
  const curLang = () => (root.dataset.lang === 'th' ? 'th' : 'en');
  function updateSend() {
    const d = drafts[purpose][curLang()];
    send.href = `mailto:${EMAIL}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(msg.value)}`;
  }
  function setPurpose(p) {
    purpose = p;
    seg.dataset.purpose = p;
    dlg.dataset.purpose = p;
    segBtns.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.purpose === p)));
    msg.value = drafts[p][curLang()].body;
    updateSend();
  }
  segBtns.forEach((b) => b.addEventListener('click', () => setPurpose(b.dataset.purpose)));
  msg.addEventListener('input', updateSend);
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-request]');
    if (!t) return;
    setMenu(false);
    setPurpose(t.dataset.request);
    dlg.showModal();
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  document.getElementById('req-copy').addEventListener('click', async () => {
    const th = curLang() === 'th';
    const text = `${EMAIL}\n${drafts[purpose][curLang()].subject}\n\n${msg.value}`;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      msg.select();
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
    }
    say(ok ? (th ? 'คัดลอกข้อความและอีเมลแล้ว' : 'Copied the message and email address') : (th ? 'คัดลอกไม่ได้ ลองเลือกข้อความเอง' : 'Could not copy. Select the text instead.'));
  });

  /* ---------- Open call ---------- */
  const call = document.getElementById('open-call');
  if (call) {
    if (Date.now() > Date.parse(call.dataset.deadline)) root.classList.add('call-closed');
    const form = call.dataset.form;
    if (form) {
      // When a form link is set on the section, Apply goes straight to it.
      // Same-site links ("/apply") open in the same tab; external links open a new tab.
      const internal = form.startsWith('/');
      document.querySelectorAll('[data-request="apply"]').forEach((b) => {
        const a = document.createElement('a');
        a.className = b.className; a.href = form;
        if (internal) {
          a.innerHTML = b.innerHTML;
        } else {
          a.target = '_blank'; a.rel = 'noopener';
          a.innerHTML = b.innerHTML + ' <span aria-hidden="true">↗</span>';
        }
        b.replaceWith(a);
      });
    }
  }

  /* ---------- Active section in nav ---------- */
  const navLinks = [...nav.querySelectorAll('.nav-links a')];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => { const s = document.querySelector(a.getAttribute('href')); if (s) io.observe(s); });

  /* ---------- Static fallback (reduced motion or no GSAP) ---------- */
  if (!motion) {
    const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return;
  }

  /* ---------- Motion ---------- */
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : document.querySelector(id);
    if (target === null) return;
    e.preventDefault();
    setMenu(false);
    lenis.scrollTo(target, { offset: target === 0 ? 0 : -(nav.offsetHeight + 12), duration: 1.1 });
    if (target !== 0) history.replaceState(null, '', id);
  });

  /* Wordmark: fills the hero width, then shrinks into the nav logo as you scroll (1:1 with scroll). */
  const wm = document.getElementById('wordmark');
  const slot = wm.parentElement;
  const wmText = wm.querySelector('.wm-text');
  const word = wmText.textContent;
  wmText.textContent = '';
  [...word].forEach((ch) => {
    const s = document.createElement('span');
    s.className = 'wm-char';
    s.textContent = ch === ' ' ? ' ' : ch;
    wmText.appendChild(s);
  });

  const geo = { x: 0, y: 0, s: 1, dist: 1 };
  function measure() {
    gsap.set(wm, { clearProps: 'transform' });
    wm.classList.remove('is-fixed');
    wm.style.left = wm.style.top = '';
    // Fit the word to the column width; two passes because the font's optical size shifts glyph widths.
    let fs = 100;
    for (let i = 0; i < 3; i++) {
      wm.style.fontSize = fs + 'px';
      fs *= (slot.clientWidth * 0.995) / wmText.offsetWidth;
    }
    wm.style.fontSize = fs + 'px';
    slot.style.height = wm.offsetHeight + 'px';
    const r = slot.getBoundingClientRect();
    const startTop = r.top + window.scrollY;
    const n = navLogo.getBoundingClientRect();
    const logoSize = parseFloat(getComputedStyle(navLogo).fontSize);
    geo.s = logoSize / fs;
    geo.x = n.left - r.left;
    const targetTop = (nav.offsetHeight - wm.offsetHeight * geo.s) / 2;
    geo.y = targetTop - startTop;
    geo.dist = Math.max(1, startTop - targetTop);
    wm.style.left = r.left + 'px';
    wm.style.top = startTop + 'px';
    wm.classList.add('is-fixed');
  }

  function buildWordmark() {
    root.classList.add('has-wm');
    ScrollTrigger.addEventListener('refreshInit', measure);
    measure();
    gsap.to(wm, {
      x: () => geo.x,
      y: () => geo.y,
      scale: () => geo.s,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: () => geo.dist,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => nav.classList.toggle('is-solid', self.progress > 0.96),
        onRefresh: (self) => nav.classList.toggle('is-solid', self.progress > 0.96),
      },
    });
  }

  /* Hero entrance: wordmark letters rise, then the rest follows in reading order. */
  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.wm-char', { yPercent: 105, duration: 1.1, stagger: 0.035 })
      .from('[data-hero]', { y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.07, clearProps: 'transform' }, 0.35);
    root.classList.remove('motion');
  }

  /* Section reveals: once, never replayed on scroll back. */
  function reveals() {
    gsap.utils.toArray('.h-section, .lede, .h-sub, .contact-h, .q-text').forEach((el) => {
      gsap.from(el, { y: 32, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    gsap.utils.toArray('.reveal-img').forEach((el) => {
      const img = el.querySelector('img');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.0, ease: 'expo.out', clearProps: 'clipPath' });
      if (img) tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.3, ease: 'expo.out', clearProps: 'transform' }, 0);
    });

    // Cards and list items land one after another, the first one leads.
    ScrollTrigger.batch('.ledger > div, .card-plain > :not(.shot), .feature-text > *, .media figcaption, .facts > div, .list li, .skills > div, .stat-row > div, .edu > div, .roles li, .contact-actions > *, .cities span, .mini-stats-col > div, .made > :not(.shot), .as-body > *, .pubs li, .fund-body > *, .offers li, .call-steps li, .call-terms > div, .moments figure figcaption', {
      start: 'top 90%',
      once: true,
      onEnter: (els) => gsap.from(els, { y: 22, autoAlpha: 0, duration: 0.7, ease: 'back.out(1.3)', stagger: 0.06, clearProps: 'transform' }),
    });

    // Numbers roll up to their value.
    gsap.utils.toArray('[data-count]').forEach((el) => {
      const to = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      const pre = el.dataset.prefix || '';
      const suf = el.dataset.suffix || '';
      const fmt = (v) => pre + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      // The final value stays in the markup until the roll starts, so nothing ever reads "0".
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el.closest('div') || el,
        start: 'top 90%',
        once: true,
        onEnter: () => gsap.to(obj, {
          v: to, duration: 1.6, ease: 'power4.out',
          onUpdate: () => { el.textContent = fmt(dec ? obj.v : Math.round(obj.v)); },
          onComplete: () => { el.textContent = fmt(to); },
        }),
      });
    });

    // Timeline: the rule draws down first, then each role lands.
    const tlList = document.querySelector('.timeline');
    gsap.timeline({ scrollTrigger: { trigger: tlList, start: 'top 80%', once: true } })
      .fromTo(tlList, { '--draw': 0 }, { '--draw': 1, duration: 1.4, ease: 'power2.inOut' })
      .from('.timeline li', { x: -14, autoAlpha: 0, duration: 0.6, stagger: 0.09, ease: 'power3.out', clearProps: 'transform' }, 0.15);

    // Bootcamp steps: the line runs left to right, the numbered stops drop in behind it.
    const steps = document.querySelector('.steps');
    gsap.timeline({ scrollTrigger: { trigger: steps, start: 'top 85%', once: true } })
      .fromTo(steps, { '--draw': 0 }, { '--draw': 1, duration: 1.0, ease: 'power2.inOut' })
      .from('.steps li', { y: -12, autoAlpha: 0, duration: 0.55, stagger: 0.12, ease: 'back.out(2)', clearProps: 'transform' }, 0.1);
  }

  const start = () => {
    buildWordmark();
    heroIntro();
    reveals();
    ScrollTrigger.refresh();
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(start);
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
