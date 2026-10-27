import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import portfolioCss from "../portfolio.css?url";
import { initPortfolio } from "../lib/portfolio";

// Dev only: the portfolio scripts rewrite parts of this page's DOM, so an
// in-place hot update makes React crash (removeChild). Reload fully instead.
if (import.meta.hot) {
  import.meta.hot.on("vite:beforeUpdate", (payload) => {
    if (payload.updates.some((u) => /routes\/index|lib\/portfolio/.test(u.path))) {
      window.location.reload();
    }
  });
}

const TITLE = "Siripong “Arm” Srichau — Communication, Digital & Partnerships";
const DESCRIPTION =
  "Siripong “Arm” Srichau: communication, digital innovation and partnerships for health and human rights. Campaigns, platforms, training and funding work from Bangkok.";

// Runs before first paint: picks the language (?lang= or the saved choice) and
// hides the hero pieces until the entrance animation starts (max 3s).
const PRE_PAINT = `(function () {
  var d = document.documentElement;
  var lang = new URLSearchParams(location.search).get('lang');
  if (lang === 'en' || lang === 'th') { try { localStorage.setItem('lang', lang); } catch (e) {} } else { try { lang = localStorage.getItem('lang'); } catch (e) {} }
  d.dataset.lang = lang === 'th' ? 'th' : 'en';
  if (lang === 'th') d.lang = 'th';
  d.classList.add('js');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    d.classList.add('motion');
    setTimeout(function () { d.classList.remove('motion'); }, 3000);
  }
})();`;

const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Siripong Srichau",
  alternateName: ["Arm Srichau", "ศิริพงษ์ ศรีเชื้อ"],
  jobTitle: "Communication, Digital Innovation and Partnerships Lead",
  address: { "@type": "PostalAddress", addressLocality: "Bangkok", addressCountry: "TH" },
  email: "mailto:srichausiripong@gmail.com",
  sameAs: ["https://www.linkedin.com/in/siripong-srichau-7107b5147"],
  alumniOf: "Chulalongkorn University",
  knowsLanguage: ["th", "en"],
};

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230E2233'/%3E%3Ctext x='32' y='45' font-family='Arial Black,Arial,sans-serif' font-weight='900' font-size='38' text-anchor='middle' fill='%23F7F9FB'%3EA%3C/text%3E%3C/svg%3E";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Siripong Srichau" },
      { name: "theme-color", content: "#F7F9FB" },
      { property: "og:title", content: "Siripong “Arm” Srichau — Portfolio" },
      {
        property: "og:description",
        content: "Campaigns, platforms, training and the funding behind them. Health and human rights, Bangkok.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://armsrichau.com/" },
      { property: "og:image", content: "https://armsrichau.com/img/og.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://armsrichau.com/img/og.jpg" },
    ],
    links: [
      { rel: "icon", href: FAVICON },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anuphan:wght@400;500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap",
      },
      { rel: "stylesheet", href: portfolioCss },
    ],
    scripts: [
      { children: PRE_PAINT },
      { type: "application/ld+json", children: JSON.stringify(PERSON) },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" },
      { src: "https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    initPortfolio();
  }, []);

  return (
    <div id="top" className="portfolio">

      <a className="skip" href="#work"><span className="en">Skip to work</span><span className="th" lang="th">ข้ามไปที่ผลงาน</span></a>

      {/* Navigation */}
      <header className="nav" id="nav">
        <div className="nav-inner wrap">
          <a className="nav-logo" href="#top" aria-label="Arm Srichau, back to top">Arm Srichau</a>
          <nav className="nav-links" aria-label="Sections">
            <a href="#work"><span className="en">Work</span><span className="th" lang="th">ผลงาน</span></a>
            <a href="#impact"><span className="en">Impact</span><span className="th" lang="th">ผลลัพธ์</span></a>
            <a href="#experience"><span className="en">Experience</span><span className="th" lang="th">ประสบการณ์</span></a>
            <a href="#recognition"><span className="en">Recognition</span><span className="th" lang="th">เวทีและรางวัล</span></a>
            <a href="#contact"><span className="en">Contact</span><span className="th" lang="th">ติดต่อ</span></a>
          </nav>
          <div className="nav-tools">
            <div className="lang" role="group" aria-label="Language">
              <span className="lang-pill" aria-hidden="true"></span>
              <button type="button" data-set-lang="en" aria-pressed="true">EN</button>
              <button type="button" data-set-lang="th" aria-pressed="false" lang="th">ไทย</button>
            </div>
            <button className="btn btn-accent btn-sm nav-cv" type="button" data-request="cv">
              <span className="en">Request CV</span><span className="th" lang="th">ขอ CV</span>
            </button>
            <button className="menu-btn" type="button" aria-expanded="false" aria-controls="menu">
              <span className="en">Menu</span><span className="th" lang="th">เมนู</span>
            </button>
          </div>
        </div>
        <nav className="menu" id="menu" aria-label="Sections" hidden>
          <a href="#work"><span className="en">Work</span><span className="th" lang="th">ผลงาน</span></a>
          <a href="#impact"><span className="en">Impact</span><span className="th" lang="th">ผลลัพธ์</span></a>
          <a href="#experience"><span className="en">Experience</span><span className="th" lang="th">ประสบการณ์</span></a>
          <a href="#recognition"><span className="en">Recognition</span><span className="th" lang="th">เวทีและรางวัล</span></a>
          <a href="#contact"><span className="en">Contact</span><span className="th" lang="th">ติดต่อ</span></a>
        </nav>
      </header>

      <main>
      {/* Hero */}
      <section className="hero wrap" aria-labelledby="hero-name">
        <div className="wm-slot">
          <a className="wm" href="#top" id="wordmark" aria-label="Arm Srichau, back to top"><span className="wm-text" aria-hidden="true">Arm Srichau</span></a>
        </div>
        <h1 className="sr-only" id="hero-name">Siripong “Arm” Srichau</h1>

        <div className="hero-body">
          <p className="hero-id" data-hero="">
            <span>Siripong “Arm” Srichau</span><span className="dot" aria-hidden="true">·</span><span lang="th">ศิริพงษ์ ศรีเชื้อ</span><span className="dot" aria-hidden="true">·</span><span className="en">Bangkok</span><span className="th" lang="th"><span className="nw">กรุงเทพฯ</span></span>
          </p>
          <p className="hero-statement en" data-hero="">I turn complex health and rights programmes into things people actually use: <em>campaigns, platforms, training</em> and the funding behind them.</p>
          <p className="hero-statement th" lang="th" data-hero="">ทำให้งาน<span className="nw">สุขภาพและสิทธิ</span>ที่<span className="nw">ซับซ้อน</span> กลายเป็น<span className="nw">สิ่งที่คนใช้ได้จริง</span> ทั้ง<em><span className="nw">แคมเปญ</span> <span className="nw">แพลตฟอร์ม</span> <span className="nw">และการอบรม</span></em> รวมถึง<span className="nw">ทุนที่ทำให้งาน</span><span className="nw">เดินต่อได้</span></p>
          <div className="hero-actions" data-hero="">
            <button className="btn btn-accent" type="button" data-request="cv">
              <span className="en">Request CV</span><span className="th" lang="th">ขอดู CV</span>
            </button>
            <a className="call-pill" href="#open-call"><b className="en">November open call</b><b className="th" lang="th">เปิดรับงานเดือนพฤศจิกายน</b> <span className="en">3 organisations, pay what you can</span> <span className="th" lang="th">3 องค์กร <span className="nw">จ่ายตามกำลัง →</span></span><span className="en" aria-hidden="true">→</span></a>
            <p className="status"><span className="status-dot" aria-hidden="true"></span><span className="en">Open to communication, digital and partnership roles</span><span className="th" lang="th">เปิดรับงานด้านสื่อสาร ดิจิทัล และพันธมิตร</span></p>
          </div>
        </div>

        <ul className="triptych" aria-label="Photos">
          <li data-hero="">
            <figure>
              <div className="ph"><img src="img/speaking-aids-concern.webp" width="1000" height="871" alt="Arm speaking at a podium at the AIDS Concern Conference 2024 in Hong Kong" /></div>
              <figcaption><b className="en">On stage</b><b className="th" lang="th">บนเวที</b> <span className="en">AIDS Concern Conference, Hong Kong 2024</span><span className="th" lang="th">AIDS Concern Conference ฮ่องกง 2567</span></figcaption>
            </figure>
          </li>
          <li data-hero="">
            <figure>
              <div className="ph"><img src="img/outreach-online.webp" width="1400" height="933" alt="Arm on a Bangkok train answering outreach messages on a phone" /></div>
              <figcaption><b className="en">In the field</b><b className="th" lang="th">ในพื้นที่</b> <span className="en">Online outreach for SWING. Photo: UNAIDS</span><span className="th" lang="th">งานเข้าถึงออนไลน์กับ SWING ภาพ: UNAIDS</span></figcaption>
            </figure>
          </li>
          <li data-hero="">
            <figure>
              <div className="ph"><img src="img/parliament.webp" width="1000" height="870" alt="Arm seated at a Thai parliamentary subcommittee meeting with a laptop and name plate" /></div>
              <figcaption><b className="en">In the room</b><b className="th" lang="th">ในห้องประชุม</b> <span className="en">Adviser, Thai parliamentary subcommittee</span><span className="th" lang="th">ที่ปรึกษา<span className="nw">อนุกรรมาธิการ</span> <span className="nw">รัฐสภาไทย</span></span></figcaption>
            </figure>
          </li>
        </ul>
      </section>

      {/* Impact ledger */}
      <section className="ledger-section" id="impact" aria-labelledby="impact-h">
        <div className="wrap">
          <h2 className="h-section" id="impact-h"><span className="en">Ten years of work, in numbers</span><span className="th" lang="th">สิบปีของงาน ในตัวเลข</span></h2>
          <dl className="ledger">
            <div><dt><span data-count="1" data-prefix="USD " data-suffix="M">USD 1M</span></dt><dd><span className="en">won in grants from proposals written end to end (PEPFAR/EpiC)</span><span className="th" lang="th">ทุนที่ได้จากข้อเสนอโครงการซึ่งเขียนเอง<span className="nw">ทั้งฉบับ</span> (PEPFAR/EpiC)</span></dd></div>
            <div><dt><span data-count="1.4" data-decimals="1" data-suffix="M">1.4M</span></dt><dd><span className="en">sessions on testD, a platform designed and built in-house</span><span className="th" lang="th"><span className="nw">เซสชัน</span>บน testD <span className="nw">แพลตฟอร์ม</span>ที่ออกแบบและสร้างเอง</span></dd></div>
            <div><dt><span data-count="5.5" data-decimals="1" data-suffix="M">5.5M</span></dt><dd><span className="en">people reached across Southeast Asia with brand and influencer partners</span><span className="th" lang="th">คนที่แคมเปญเข้าถึงทั่วอาเซียน ร่วมกับแบรนด์และ<span className="nw">อินฟลูเอนเซอร์</span></span></dd></div>
            <div><dt><span data-count="25" data-prefix="+" data-suffix="%">+25%</span></dt><dd><span className="en">more HIV test bookings after a redesign guided by GA4 data</span><span className="th" lang="th">การจองตรวจ<span className="nw">เอชไอวี</span>ที่เพิ่มขึ้น หลังปรับเว็บตามข้อมูล GA4</span></dd></div>
            <div><dt><span data-count="1000" data-suffix="+">1,000+</span></dt><dd><span className="en">teachers trained to use a new curriculum across 8 schools</span><span className="th" lang="th">ครูที่ผ่านการอบรมหลักสูตรใหม่ใน 8 โรงเรียน</span></dd></div>
            <div><dt><span data-count="12" data-suffix=" of 20">12 of 20</span></dt><dd><span className="en">SWING submissions accepted at AIDS 2026, Rio de Janeiro</span><span className="th" lang="th">ผลงานของ SWING ที่ผ่านการคัดเลือกในเวที AIDS 2026 <span className="nw">ริโอเดจาเนโร</span></span></dd></div>
          </dl>
        </div>
      </section>

      {/* Work: platforms */}
      <section className="chapter" id="work" aria-labelledby="work-h">
        <div className="wrap">
          <header className="chapter-head">
            <p className="chapter-no">01</p>
            <div>
              <h2 className="h-section" id="work-h"><span className="en">Platforms people use every day</span><span className="th" lang="th"><span className="nw">แพลตฟอร์ม</span>ที่คนใช้อยู่ทุกวัน</span></h2>
              <p className="lede en">Three services for sex workers, LGBTQ+ people and youth, designed with clinic and outreach teams, then handed over so staff run them day to day.</p>
              <p className="lede th" lang="th">สามบริการสำหรับ<span className="nw">พนักงานบริการ</span> คน<span className="nw">หลากหลายทางเพศ</span> และเยาวชน ออกแบบร่วมกับทีมคลินิกและทีมลงพื้นที่ แล้วส่งต่อให้ทีมงานดูแลเองได้ทุกวัน</p>
            </div>
          </header>

          <article className="feature">
            <div className="feature-media">
              <a className="shot shot-lg reveal-img" href="https://testd.website" target="_blank" rel="noopener">
              <span className="shot-bar" aria-hidden="true"><i></i><i></i><i></i><span>testd.website</span></span>
              <img src="img/shot-testd.webp" width="1440" height="900" loading="lazy" alt="testD home page: order a free HIV self-test kit" />
            </a>
              <figure className="clinic reveal-img">
                <img src="img/clinic-swing.webp" width="1400" height="1050" loading="lazy" alt="Inside a SWING clinic: a bright counselling room with the SWING logo on the wall" />
                <figcaption><b className="en">Where the journey ends</b><b className="th" lang="th">ปลายทางของบริการ</b> <span className="en">A SWING clinic that people can book through testD.</span><span className="th" lang="th">คลินิก SWING ที่จองผ่าน testD ได้</span></figcaption>
              </figure>
            </div>
            <div className="feature-text">
              <h3 className="h-work">testD</h3>
              <p className="en">Free HIV self-testing for anyone in Thailand, from the first click to a clinic visit.</p>
              <p className="th" lang="th">ตรวจ<span className="nw">เอชไอวี</span>ด้วยตัวเองฟรี สำหรับทุกคนในไทย ตั้งแต่คลิกแรกจนถึงคลินิก</p>
              <dl className="mini-stats">
                <div><dt>1.4M</dt><dd><span className="en">sessions</span><span className="th" lang="th"><span className="nw">เซสชัน</span></span></dd></div>
                <div><dt>17,932</dt><dd><span className="en">members</span><span className="th" lang="th">สมาชิก</span></dd></div>
                <div><dt>77</dt><dd><span className="en">provinces requesting kits</span><span className="th" lang="th">จังหวัดที่ขอชุดตรวจ</span></dd></div>
              </dl>
              <ul className="ticks en">
                <li>Order a self-test kit to your door and track the parcel</li>
                <li>Send back a result so a counsellor can follow up</li>
                <li>Book a test or online counselling at the nearest clinic</li>
                <li>Learn about PrEP through a short game</li>
              </ul>
              <ul className="ticks th" lang="th">
                <li>สั่งชุดตรวจถึงบ้าน และติดตามพัสดุได้</li>
                <li>ส่งผลตรวจกลับ ให้<span className="nw">ผู้ให้คำปรึกษา</span>ติดตามต่อ</li>
                <li>จองตรวจหรือปรึกษาออนไลน์กับคลินิกใกล้บ้าน</li>
                <li>เรียนรู้เรื่อง PrEP ผ่านเกมสั้น ๆ</li>
              </ul>
              <p className="role"><b className="en">My part</b><b className="th" lang="th">บทบาท</b> <span className="en">Service journey, content, design and build, handover. Supported by EJAF.</span><span className="th" lang="th">ออกแบบเส้นทางบริการ เขียนเนื้อหา ออกแบบและสร้างเว็บ และส่งมอบให้ทีม สนับสนุนโดย EJAF</span></p>
              <a className="link" href="https://testd.website" target="_blank" rel="noopener">testd.website <span aria-hidden="true">↗</span></a>
            </div>
          </article>

          <div className="pair">
            <article className="card-plain">
              <a className="shot reveal-img" href="https://swingrights.app" target="_blank" rel="noopener">
                <span className="shot-bar" aria-hidden="true"><i></i><i></i><i></i><span>swingrights.app</span></span>
                <img src="img/shot-swingrights.webp" width="1440" height="900" loading="lazy" alt="SWING Rights home page: a safe space to report rights violations" />
              </a>
              <h3 className="h-work">SWING Rights</h3>
              <p className="en">A safe way for sex workers to report a rights violation and get help. No sign-up, no cost, a quick-exit button on every page, and reports by voice or text.</p>
              <p className="th" lang="th">ช่องทางปลอดภัยให้<span className="nw">พนักงานบริการ</span>แจ้งเหตุละเมิดสิทธิและขอความช่วยเหลือ ไม่ต้องสมัคร ไม่มีค่าใช้จ่าย มีปุ่มออกด่วนทุกหน้า แจ้งได้ทั้งเสียงและข้อความ</p>
              <p className="role"><span className="en">Supported by UNAIDS and APCOM</span><span className="th" lang="th">สนับสนุนโดย UNAIDS และ APCOM</span></p>
              <a className="link" href="https://swingrights.app" target="_blank" rel="noopener">swingrights.app <span aria-hidden="true">↗</span></a>
            </article>
            <article className="card-plain">
              <a className="shot reveal-img" href="https://swingacademy.life" target="_blank" rel="noopener">
                <span className="shot-bar" aria-hidden="true"><i></i><i></i><i></i><span>swingacademy.life</span></span>
                <img src="img/shot-academy.webp" width="1440" height="900" loading="lazy" alt="SWING Academy home page: free bilingual courses" />
              </a>
              <h3 className="h-work">SWING Academy</h3>
              <p className="en">Free bilingual courses on sexual health, rights and life skills. No ID card, no judgement, and anyone can check that a certificate is real.</p>
              <p className="th" lang="th">คอร์สเรียนฟรีสองภาษา เรื่องสุขภาพทางเพศ สิทธิ และทักษะชีวิต ไม่ต้องใช้<span className="nw">บัตรประชาชน</span> ไม่มีการตัดสิน และใครก็ตรวจสอบ<span className="nw">ใบประกาศ</span>ได้</p>
              <p className="role"><span className="en">SWING Foundation</span><span className="th" lang="th">มูลนิธิเพื่อน<span className="nw">พนักงานบริการ</span> (SWING)</span></p>
              <a className="link" href="https://swingacademy.life" target="_blank" rel="noopener">swingacademy.life <span aria-hidden="true">↗</span></a>
            </article>
          </div>
        </div>
      </section>

      {/* Also built and made */}
      <section className="chapter chapter-made" id="made" aria-labelledby="made-h">
        <div className="wrap">
          <header className="chapter-head">
            <p className="chapter-no">02</p>
            <div>
              <h2 className="h-section" id="made-h"><span className="en">Also built and made</span><span className="th" lang="th">งานอื่นที่สร้างและทำเอง</span></h2>
              <p className="lede en">A website and an event app, made outside the SWING platforms.</p>
              <p className="lede th" lang="th">เว็บไซต์และแอปสำหรับงานประชุม ที่ทำนอกเหนือจากแพลตฟอร์มของ SWING</p>
            </div>
          </header>
          <div className="made-grid">
            <article className="made">
              <a className="shot reveal-img" href="https://cnsconnexts.lovable.app" target="_blank" rel="noopener">
                <span className="shot-bar" aria-hidden="true"><i></i><i></i><i></i><span>cnsconnexts.lovable.app</span></span>
                <img src="img/shot-cnsconnext.webp" width="1440" height="900" loading="lazy" alt="คนส connext on a phone: the Connecting Power home page, people to meet today, and the power map" />
              </a>
              <h3 className="h-work">คนส connext</h3>
              <p className="en">A mobile web app that matches participants at Thailand’s National Health Assembly by interests, needs and resources. A live big screen shows new connections without showing names.</p>
              <p className="th" lang="th">เว็บแอปบนมือถือ จับคู่ผู้เข้าร่วม<span className="nw">สมัชชาสุขภาพแห่งชาติ</span>จากความสนใจ สิ่งที่มี และสิ่งที่ต้องการ พร้อมจอใหญ่แสดงคู่ที่เชื่อมกันแบบไม่เปิดเผยชื่อ</p>
              <p className="role"><b className="en">My part</b><b className="th" lang="th">บทบาท</b> <span className="en">Product design and build</span><span className="th" lang="th">ออกแบบและสร้างระบบ</span></p>
              <a className="link" href="https://cnsconnexts.lovable.app" target="_blank" rel="noopener">cnsconnexts.lovable.app <span aria-hidden="true">↗</span></a>
            </article>
            <article className="made">
              <a className="shot reveal-img" href="https://cherryleeandco.com" target="_blank" rel="noopener">
                <span className="shot-bar" aria-hidden="true"><i></i><i></i><i></i><span>cherryleeandco.com</span></span>
                <img src="img/shot-cherrylee.webp" width="1440" height="900" loading="lazy" alt="CherryLee &amp; Co. home page: English through creative drama for kids" />
              </a>
              <h3 className="h-work">CherryLee &amp; Co.</h3>
              <p className="en">A bilingual site for a creative-drama learning space for kids and families in Bangkok, with classes, LINE booking, a map and parent FAQs.</p>
              <p className="th" lang="th">เว็บสองภาษาของพื้นที่เรียนรู้ทักษะชีวิตผ่านละครสำหรับเด็กและครอบครัว มีคลาสเรียน จองผ่าน LINE แผนที่ และคำถามที่ผู้ปกครองพบบ่อย</p>
              <p className="role"><b className="en">My part</b><b className="th" lang="th">บทบาท</b> <span className="en">Design, bilingual copy and build</span><span className="th" lang="th">ออกแบบ เขียนเนื้อหาสองภาษา และสร้างเว็บ</span></p>
              <a className="link" href="https://cherryleeandco.com" target="_blank" rel="noopener">cherryleeandco.com <span aria-hidden="true">↗</span></a>
            </article>
          </div>
        </div>
      </section>

      {/* Regional campaigns */}
      <section className="chapter chapter-alt" id="campaigns" aria-labelledby="camp-h">
        <div className="wrap">
          <header className="chapter-head">
            <p className="chapter-no">03</p>
            <div>
              <h2 className="h-section" id="camp-h"><span className="en">One site model, seven Asian cities</span><span className="th" lang="th">เว็บต้นแบบเดียว เจ็ดเมืองในเอเชีย</span></h2>
              <p className="lede en">The test-city series: HIV testing and prevention sites for LGBTQ+ communities, run at APCOM from 2021 to 2024.</p>
              <p className="lede th" lang="th">ซีรีส์ test-city เว็บไซต์ชวนตรวจและป้องกัน<span className="nw">เอชไอวี</span>สำหรับชุมชนคน<span className="nw">หลากหลายทางเพศ</span> ดำเนินงานที่ APCOM ระหว่างปี 2564–2567</p>
            </div>
          </header>
          <div className="mosaic">
            <a className="shot m-main reveal-img" href="https://testbkk.org" target="_blank" rel="noopener">
              <span className="shot-bar" aria-hidden="true"><i></i><i></i><i></i><span>testbkk.org</span></span>
              <img src="img/shot-testbkk.webp" width="1440" height="900" loading="lazy" alt="testBKK.org: media clips and clinic finder on a dark background" />
            </a>
            <figure className="m-side reveal-img"><img src="img/shot-testmnl.webp" width="1000" height="625" loading="lazy" alt="testMNL.org home page, Manila" /><figcaption>testMNL · Manila</figcaption></figure>
            <figure className="m-side reveal-img"><img src="img/shot-testjkt.webp" width="1000" height="625" loading="lazy" alt="testJKT.org home page, Jakarta" /><figcaption>testJKT · Jakarta</figcaption></figure>
          </div>
          <p className="cities"><span>testBKK</span><span>testJKT</span><span>testMNL</span><span>testSGN</span><span>testBOM</span><span>testVTE</span><span>test4UB</span></p>
          <p className="inline-facts en">A redesign guided by GA4 data <b>more than doubled</b> time on testBKK.org and lifted HIV test bookings through the site by <b>25%</b>. Brand and influencer partners took reach past <b>5.5 million</b> people, on an outreach budget of <b>THB 30 million</b> managed with finance and programme teams.</p>
          <p className="inline-facts th" lang="th">การปรับเว็บตามข้อมูล GA4 ทำให้คนอยู่บน testBKK.org <b>นานขึ้นกว่าเท่าตัว</b> และจองตรวจ<span className="nw">เอชไอวี</span>ผ่านเว็บเพิ่มขึ้น <b>25%</b> แคมเปญร่วมกับแบรนด์และ<span className="nw">อินฟลูเอนเซอร์</span>เข้าถึงคนกว่า <b>5.5 ล้านคน</b> ด้วยงบงานเข้าถึง <b>30 ล้านบาท</b> ที่บริหารร่วมกับทีมการเงินและทีมโครงการ</p>
          <p className="award-note"><span className="en">testBKK received the Ardhanareeswara Award for community media (2025).</span><span className="th" lang="th">testBKK ได้รับรางวัล<span className="nw">อรรธนารีศวร</span> ด้านสื่อชุมชน (2568)</span></p>
        </div>
      </section>

      {/* Campaign media (dark) */}
      <section className="night" id="media" aria-labelledby="media-h">
        <div className="wrap">
          <header className="chapter-head">
            <p className="chapter-no">04</p>
            <div>
              <h2 className="h-section" id="media-h"><span className="en">Stories that bring people to services</span><span className="th" lang="th">เรื่องเล่าที่พาคนไปถึงบริการ</span></h2>
              <p className="lede en">Film, photo and social series for health and rights campaigns, made as a freelance director with Sodsai Studio.</p>
              <p className="lede th" lang="th"><span className="nw">ภาพยนตร์</span> ภาพถ่าย และ<span className="nw">ซีรีส์<span className="nw">โซเชียล</span></span>สำหรับแคมเปญสุขภาพและสิทธิ กำกับในฐานะฟรีแลนซ์ร่วมกับ Sodsai Studio</p>
            </div>
          </header>
          <div className="media-grid">
            <figure className="media">
              <div className="ph reveal-img"><img src="img/media-testbkk.webp" width="1200" height="425" loading="lazy" alt="Still from the testBKK campaign film" /></div>
              <figcaption>
                <h3>testBKK: anyone can get tested</h3>
                <p className="en">Directed and produced the campaign film for APCOM. It spread widely on Facebook.</p>
                <p className="th" lang="th">กำกับและอำนวยการผลิต<span className="nw">ภาพยนตร์</span>แคมเปญให้ APCOM ถูกแชร์ต่ออย่างกว้างขวางบนเฟซบุ๊ก</p>
              </figcaption>
            </figure>
            <figure className="media">
              <div className="ph reveal-img"><img src="img/media-pride.webp" width="1200" height="426" loading="lazy" alt="Pride campaign photos of LGBTQ+ friends holding rainbow flags" /></div>
              <figcaption>
                <h3><span className="en">Pride photo campaign</span><span className="th" lang="th">แคมเปญภาพถ่าย Pride</span></h3>
                <p className="en">Photography for APCOM and testBKK showing LGBTQ+ friends and couples as they are.</p>
                <p className="th" lang="th">ภาพถ่ายให้ APCOM และ testBKK ที่เล่าเพื่อนและคู่รัก LGBTQ+ ในแบบที่พวกเขาเป็น</p>
              </figcaption>
            </figure>
            <figure className="media">
              <div className="ph reveal-img"><img src="img/media-inclusive.webp" width="1200" height="420" loading="lazy" alt="Still from the Inclusive Workplaces documentary series" /></div>
              <figcaption>
                <h3>Inclusive Workplaces</h3>
                <p className="en">Co-produced, directed and edited a short documentary series for APCOM on gender identity at work.</p>
                <p className="th" lang="th">ร่วมผลิต กำกับ และตัดต่อ<span className="nw">สารคดีสั้น</span>ให้ APCOM ว่าด้วย<span className="nw">อัตลักษณ์ทางเพศ</span>ในที่ทำงาน</p>
              </figcaption>
            </figure>
            <figure className="media">
              <div className="ph reveal-img"><img src="img/media-righttolove.webp" width="1200" height="421" loading="lazy" alt="Cover art and behind-the-scenes photos for Right to Love, Right to Care" /></div>
              <figcaption>
                <h3>Right to Love, Right to Care</h3>
                <p className="en">Directing a TikTok series for SWING about family, love and the rights no one should have to ask for.</p>
                <p className="th" lang="th">กำลังกำกับซีรีส์ TikTok ให้ SWING เรื่องครอบครัว ความรัก และสิทธิที่ไม่ควรต้องร้องขอ</p>
              </figcaption>
            </figure>
          </div>
          <article className="armshares">
            <figure className="as-cover reveal-img"><img src="img/armshares-cover.webp" width="1640" height="720" loading="lazy" alt="ArmShares channel banner: sex, health and gay life, told without judgement" /></figure>
            <div className="as-body">
              <h3 className="h-work">ArmShares</h3>
              <p className="en">My own short-video channel on sex, health and gay life, told with humour and no judgement. EP.1, “Dating app dictionary”, is out in Thai and English.</p>
              <p className="th" lang="th">ช่องวิดีโอสั้นของตัวเอง เล่าเรื่องเพศ สุขภาพ และชีวิตเกย์ แบบสนุกและไม่ตัดสิน EP.1 “พจนานุกรมแอปหาคู่” มีทั้งเวอร์ชันไทยและอังกฤษ</p>
              <p className="role"><b className="en">My part</b><b className="th" lang="th">บทบาท</b> <span className="en">Script, shoot, edit, motion graphics and brand kit</span><span className="th" lang="th">เขียนบท ถ่าย ตัดต่อ ทำโมชันกราฟิก และชุดแบรนด์</span></p>
              <a className="link" href="https://www.tiktok.com/@armshares" target="_blank" rel="noopener">TikTok @armshares <span aria-hidden="true">↗</span></a>
            </div>
            <figure className="as-ep reveal-img"><img src="img/armshares-ep1.webp" width="720" height="1280" loading="lazy" alt="Cover of ArmShares EP.1, Dating app dictionary" /></figure>
          </article>
        </div>
      </section>

      {/* Training */}
      <section className="chapter" id="training" aria-labelledby="train-h">
        <div className="wrap">
          <header className="chapter-head">
            <p className="chapter-no">05</p>
            <div>
              <h2 className="h-section" id="train-h"><span className="en">Teaching people to use AI for outreach</span><span className="th" lang="th">สอนให้คนทำงานชุมชนใช้ AI ได้จริง</span></h2>
              <p className="lede en">AI-Powered Digital Outreach Bootcamp for CBOs, 7–9 September 2026. Run by RSAT and SWING under PEPFAR/EpiC. Designed the course, built the deck and taught it.</p>
              <p className="lede th" lang="th">AI-Powered Digital Outreach Bootcamp for CBOs วันที่ 7–9 <span className="nw">กันยายน</span> 2569 จัดโดย RSAT และ SWING ภายใต้ PEPFAR/EpiC ออกแบบหลักสูตร ทำสไลด์ และสอนเอง</p>
            </div>
          </header>
          <div className="bootcamp">
            <figure className="bc-photo reveal-img">
              <img src="img/bootcamp-group.webp" width="1567" height="1045" loading="lazy" alt="Group photo of bootcamp participants and facilitators in a hotel ballroom" />
            </figure>
            <div className="bc-side">
              <p className="inline-facts en"><b>77</b> frontline staff from community organisations worked in <b>8</b> small groups over <b>3 days</b> of AI-assisted content production for health outreach.</p>
              <p className="inline-facts th" lang="th">เจ้าหน้าที่ภาคสนาม <b>77 คน</b> จากองค์กรชุมชน แบ่งเป็น <b>8 กลุ่ม</b> ฝึกผลิต<span className="nw">คอนเทนต์</span>สุขภาพด้วย AI ตลอด <b>3 วัน</b></p>
              <figure className="bc-portrait reveal-img"><img src="img/bootcamp-teaching.webp" width="900" height="1350" loading="lazy" alt="Arm holding a microphone, leading a session" /></figure>
            </div>
          </div>
          <h3 className="h-sub"><span className="en">What staff practised: one 30-second TikTok, built step by step</span><span className="th" lang="th">สิ่งที่ผู้เข้าอบรมฝึก: คลิป TikTok 30 วินาที ทีละขั้น</span></h3>
          <ol className="steps">
            <li><span className="en">Script</span><span className="th" lang="th">บท</span></li>
            <li><span className="en">Character sheet</span><span className="th" lang="th">ชีตตัวละคร</span></li>
            <li><span className="en">Shot list</span><span className="th" lang="th">ลิสต์ช็อต</span></li>
            <li><span className="en">Storyboard</span><span className="th" lang="th">สตอรีบอร์ด</span></li>
            <li><span className="en">Image to video</span><span className="th" lang="th">ภาพเป็น<span className="nw">วิดีโอ</span></span></li>
            <li><span className="en">Edit in CapCut</span><span className="th" lang="th">ตัดต่อใน CapCut</span></li>
          </ol>
          <p className="note en">The groups shared one camera vocabulary, including a rule of no high-angle shots of service users.</p>
          <p className="note th" lang="th">
          </p>
        </div>
      </section>

      {/* Experience */}
      <section className="chapter" id="experience" aria-labelledby="exp-h">
        <div className="wrap">
          <header className="chapter-head">
            <p className="chapter-no">06</p>
            <div>
              <h2 className="h-section" id="exp-h"><span className="en">Experience</span><span className="th" lang="th">ประสบการณ์ทำงาน</span></h2>
            </div>
          </header>
          <ol className="timeline">
            <li>
              <p className="t-when">2025–2026</p>
              <div className="t-body">
                <h3>Strategic Communication and Innovation Lead</h3>
                <p className="t-org">SWING Foundation</p>
                <p className="en">Led the communication and online team across 8 departments. Wrote funding proposals, built three platforms and AI-supported tools such as social listening and service dashboards.</p>
                <p className="th" lang="th">นำทีมสื่อสารและออนไลน์ ทำงานร่วมกับ 8 ฝ่าย เขียนข้อเสนอขอทุน สร้างสาม<span className="nw">แพลตฟอร์ม</span> และเครื่องมือที่ใช้ AI เช่น ระบบฟังเสียง<span className="nw">โซเชียล</span>และ<span className="nw">แดชบอร์ด</span>บริการ</p>
              </div>
            </li>
            <li>
              <p className="t-when"><span className="en">Ongoing</span><span className="th" lang="th">ปัจจุบัน</span></p>
              <div className="t-body">
                <h3>Creative Collaborator <span className="t-tag">freelance</span></h3>
                <p className="t-org">Sodsai Studio</p>
                <p className="en">Directs and edits campaign film, photo and social series. Coordinates tender proposals for NGO and public-health communication contracts.</p>
                <p className="th" lang="th">กำกับและตัดต่อ<span className="nw">ภาพยนตร์</span> ภาพถ่าย และ<span className="nw">ซีรีส์<span className="nw">โซเชียล</span></span>สำหรับแคมเปญ ประสานงานยื่นข้อเสนอประมูลงานสื่อสาร<span className="nw">สาธารณสุข</span>และ<span className="nw">องค์กรพัฒนาเอกชน</span></p>
              </div>
            </li>
            <li>
              <p className="t-when">2025</p>
              <div className="t-body">
                <h3>Project Manager, Tourism Route Development</h3>
                <p className="t-org">Local Alike</p>
                <p className="en">Designed community tourism routes with the Ministry of Culture. Two routes were selected among Thailand’s 12 model cities for the creative economy.</p>
                <p className="th" lang="th">ออกแบบเส้นทางท่องเที่ยวชุมชนกับกระทรวงวัฒนธรรม สองเส้นทางได้รับเลือกเป็น 1 ใน 12 เมืองต้นแบบ<span className="nw">เศรษฐกิจสร้างสรรค์</span></p>
              </div>
            </li>
            <li>
              <p className="t-when">2021–2024</p>
              <div className="t-body">
                <h3>Digital Key Population Engagement Officer</h3>
                <p className="t-org">APCOM Foundation</p>
                <p className="en">Ran HIV testing campaigns in seven cities, managed a THB 30M outreach budget, and delivered PEPFAR/EpiC work across five countries.</p>
                <p className="th" lang="th">ดูแลแคมเปญชวนตรวจ<span className="nw">เอชไอวี</span>ในเจ็ดเมือง บริหารงบ 30 ล้านบาท และดำเนินงาน PEPFAR/EpiC ในห้าประเทศ</p>
              </div>
            </li>
            <li>
              <p className="t-when">2019–2021</p>
              <div className="t-body">
                <h3>Head of Academic</h3>
                <p className="t-org">Learning Ability Promotion Center</p>
                <p className="en">Prepared 1,000+ teachers for an updated curriculum and introduced blended-learning labs that raised engagement and English scores by 18%.</p>
                <p className="th" lang="th">เตรียมครูกว่า 1,000 คนให้พร้อมใช้หลักสูตรใหม่ และริเริ่มห้องเรียนแบบผสมผสานที่ทำให้ความมีส่วนร่วมและคะแนน<span className="nw">ภาษาอังกฤษ</span>เพิ่มขึ้น 18%</p>
              </div>
            </li>
            <li>
              <p className="t-when">2014–2019</p>
              <div className="t-body">
                <h3>Business Development Manager · HR Supervisor</h3>
                <p className="t-org">MAKE A WIT · Gymboree Play &amp; Music</p>
                <p className="en">Grew an English programme to 12 new campuses (+150% revenue), mentored 40 teachers, then managed 25 instructors.</p>
                <p className="th" lang="th">ขยายหลักสูตร<span className="nw">ภาษาอังกฤษ</span>ไป 12 <span className="nw">วิทยาเขต</span>ใหม่ (รายได้เพิ่ม 150%) ดูแลครู 40 คน และต่อมาดูแลผู้สอน 25 คน</p>
              </div>
            </li>
          </ol>

          <h3 className="h-sub"><span className="en">Funding raised</span><span className="th" lang="th">ทุนที่ระดมได้</span></h3>
          <p className="inline-facts en">Wrote the proposals behind a <b>USD 1M</b> PEPFAR/EpiC grant and a <b>USD 5,000</b> APCOM grant funded by UNAIDS, brought in about <b>THB 380,000</b> of in-kind CSR support from Maybelline and PepsiCo, and opened public giving for SWING.</p>
          <p className="inline-facts th" lang="th">เขียนข้อเสนอที่ได้ทุน PEPFAR/EpiC <b>1 ล้านดอลลาร์</b> และทุน APCOM จาก UNAIDS <b>5,000 ดอลลาร์</b> ได้การสนับสนุน CSR จาก Maybelline และ PepsiCo ราว <b>380,000 บาท</b> และเปิดช่องทางบริจาคสาธารณะให้ SWING</p>
          <a className="fund" href="https://taejai.com/th/project/ots-swing-fund" target="_blank" rel="noopener">
            <figure className="fund-img reveal-img"><img src="img/taejai-swing-fund.webp" width="900" height="600" loading="lazy" alt="SWING Fund campaign cover: SWING outreach staff carrying supply bags" /></figure>
            <div className="fund-body">
              <p className="fund-k"><span className="en">Public fundraising</span><span className="th" lang="th">ระดมทุนสาธารณะ</span></p>
              <h3 className="h-work"><span className="en">SWING Fund on Taejai</span><span className="th" lang="th">SWING Fund บนเทใจ</span></h3>
              <p className="en">A fund for health and rights services for sex workers and LGBTQ+ people in Bangkok: outreach and community clinics, emergency support, and community leaders telling their own stories.</p>
              <p className="th" lang="th">กองทุนสุขภาพและสิทธิสำหรับ<span className="nw">พนักงานบริการ</span>และคนหลากหลายทางเพศในกรุงเทพฯ ทั้งงานลงพื้นที่และคลินิกชุมชน กองทุนช่วยเหลือฉุกเฉิน และการให้ผู้นำชุมชนเล่าเรื่องของตัวเอง</p>
              <p className="fund-n"><b>THB 96,963</b> <span className="en">raised · open until 31 Dec 2026</span><span className="th" lang="th">ยอดบริจาค · <span className="nw">เปิดถึง 31 ธ.ค. 2569</span></span></p>
              <span className="link"><span className="en">See the campaign</span><span className="th" lang="th">ดูหน้าระดมทุน</span> <span aria-hidden="true">↗</span></span>
            </div>
          </a>
        </div>
      </section>

      {/* Recognition */}
      <section className="chapter chapter-alt" id="recognition" aria-labelledby="rec-h">
        <div className="wrap">
          <header className="chapter-head">
            <p className="chapter-no">07</p>
            <div>
              <h2 className="h-section" id="rec-h"><span className="en">On the record</span><span className="th" lang="th">บนเวทีและในสื่อ</span></h2>
            </div>
          </header>
          <div className="quote-block">
            <figure className="q-photo reveal-img"><img src="img/outreach-prep.webp" width="1400" height="933" loading="lazy" alt="Arm holding a bottle of PrEP pills and making a peace sign at the SWING clinic" /><figcaption><span className="en">Photo: UNAIDS</span><span className="th" lang="th">ภาพ: UNAIDS</span></figcaption></figure>
            <blockquote>
              <p className="q-text en">“If you want to reach people online, you have to understand them.”</p>
              <p className="q-text th" lang="th">“ถ้าอยากเข้าถึงผู้คนบนโลกออนไลน์ ต้องเข้าใจพวกเขาก่อน”</p>
              <footer><span className="en">Quoted in “Built on trust”, a UNAIDS feature story on community-led HIV services in Thailand, August 2026.</span><span className="th" lang="th">จากบทความ “Built on trust” ของ UNAIDS ว่าด้วยบริการ<span className="nw">เอชไอวี</span>ที่นำโดยชุมชนในไทย สิงหาคม 2569</span></footer>
            </blockquote>
          </div>
          <div className="story">
            <figure className="reveal-img"><img src="img/unaids-session.webp" width="1400" height="933" loading="lazy" alt="Arm holding up PrEP materials during a community session" /><figcaption><span className="en">A community session on PrEP and PEP.</span><span className="th" lang="th">วงคุยชุมชนเรื่อง PrEP และ PEP</span></figcaption></figure>
            <figure className="reveal-img"><img src="img/unaids-clinic.webp" width="1400" height="933" loading="lazy" alt="SWING staff at the clinic counter" /><figcaption><span className="en">At the SWING counter, where people who found us online come in.</span><span className="th" lang="th">ที่เคาน์เตอร์ SWING ปลายทางของคนที่รู้จักเราจากออนไลน์</span></figcaption></figure>
          </div>
          <p className="story-link"><a className="link" href="https://unaids.org/en/resources/presscentre/featurestories/2026/august/20260826_CS_HIV_responses_Thailand" target="_blank" rel="noopener"><span className="en">Read “Built on trust” on unaids.org</span><span className="th" lang="th">อ่าน “Built on trust” บน unaids.org</span> <span aria-hidden="true">↗</span></a> <span className="muted"><span className="en">Photos: UNAIDS</span><span className="th" lang="th">ภาพ: UNAIDS</span></span></p>

          <h3 className="h-sub h-sub-first"><span className="en">On stage and in the room</span><span className="th" lang="th">บนเวทีและในห้องประชุม</span></h3>
          <div className="moments">
            <figure className="reveal-img"><img src="img/moment-aids2026-stage.webp" width="720" height="1280" loading="lazy" alt="Arm speaking from the stage at AIDS 2026 in Rio de Janeiro" /><figcaption><span className="en">On stage at AIDS 2026, Rio de Janeiro: can police and sex workers work together?</span><span className="th" lang="th">บนเวที AIDS 2026 ริโอเดจาเนโร: ตำรวจกับ<span className="nw">พนักงานบริการ</span>ทำงานด้วยกันได้ไหม</span></figcaption></figure>
            <figure className="reveal-img"><img src="img/moment-parliament.webp" width="1200" height="800" loading="lazy" alt="Arm speaking with a microphone at the Thai Parliament" /><figcaption><span className="en">Speaking at the Thai Parliament on law reform for sex workers.</span><span className="th" lang="th">พูดที่รัฐสภาเรื่องกฎหมายที่เป็นธรรมกับ<span className="nw">พนักงานบริการ</span></span></figcaption></figure>
            <figure className="reveal-img"><img src="img/moment-aids2026-poster.webp" width="1200" height="1536" loading="lazy" alt="Arm standing next to the testD poster at AIDS 2026" /><figcaption><span className="en">With the testD poster at AIDS 2026.</span><span className="th" lang="th">กับโปสเตอร์ testD ในเวที AIDS 2026</span></figcaption></figure>
            <figure className="reveal-img"><img src="img/moment-forum.webp" width="1200" height="900" loading="lazy" alt="Arm holding a microphone at SWING's public forum on sex workers' voices" /><figcaption><span className="en">Hosting SWING’s public forum on sex workers’ voices.</span><span className="th" lang="th">ดำเนินรายการเวทีสาธารณะของ SWING เรื่องเสียงของ<span className="nw">พนักงานบริการ</span></span></figcaption></figure>
            <figure className="reveal-img"><img src="img/moment-aids2026-team.webp" width="1080" height="720" loading="lazy" alt="The SWING team with partners at AIDS 2026" /><figcaption><span className="en">The SWING team and partners at AIDS 2026.</span><span className="th" lang="th">ทีม SWING และเพื่อนร่วมงานใน AIDS 2026</span></figcaption></figure>
            <figure className="reveal-img"><img src="img/moment-australia-awards.webp" width="1400" height="733" loading="lazy" alt="Australia Awards fellows around a workshop table" /><figcaption><span className="en">Australia Awards fellows working on community-led health services.</span><span className="th" lang="th">กับเพื่อนทุน Australia Awards เรื่องบริการสุขภาพที่ชุมชนนำ</span></figcaption></figure>
          </div>

          <div className="rec-grid">
            <div>
              <h3 className="col-h"><span className="en">Speaking</span><span className="th" lang="th">การบรรยาย</span></h3>
              <ul className="list">
                <li>Speaker, AIDS Concern Conference, Hong Kong <span className="yr">2024</span></li>
                <li>Presenter, IPPF Sex Work Consortium, Rio de Janeiro <span className="yr">2026</span></li>
                <li>Speaker, SWC Communications Learning Series <span className="yr">2026</span></li>
                <li><a href="https://plus.iasociety.org/e-posters/ias-educational-fund-thailand-4-november-2025-meeting-report-and-recommendations" target="_blank" rel="noopener">Panellist, IAS Educational Fund, Bangkok ↗</a> <span className="yr">2025</span></li>
                <li>Testimony, CEVAW Feminist Inquiry, Melbourne <span className="yr">2026</span></li>
              </ul>
            </div>
            <div>
              <h3 className="col-h"><span className="en">Honours</span><span className="th" lang="th">รางวัลและตำแหน่ง</span></h3>
              <ul className="list">
                <li>Ardhanareeswara Award, community media (testBKK) <span className="yr">2025</span></li>
                <li>Ardhanareeswara Award, LGBTQI+ human rights <span className="yr">2022</span></li>
                <li>Australia Awards Fellowship, Community-Based Harm Reduction <span className="yr">2024</span></li>
                <li>Community Advisory Panel, Medicines Patent Pool <span className="yr">2022–25</span></li>
              </ul>
            </div>
            <div>
              <h3 className="col-h"><span className="en">Policy and media</span><span className="th" lang="th">นโยบายและสื่อ</span></h3>
              <ul className="list">
                <li>Adviser to a Thai parliamentary subcommittee on women, LGBTQ+ laws and sex workers’ rights</li>
                <li>Youth delegate, Thailand National HIV Programme Review <span className="yr">2022</span></li>
                <li>Featured in UNAIDS <span className="yr">2026</span> and STAT News <span className="yr">2025</span></li>
              </ul>
            </div>
            <figure className="rec-photo reveal-img"><img src="img/award.webp" width="900" height="1135" loading="lazy" alt="Arm holding the Ardhanareeswara Award trophy on stage" /></figure>
          </div>
          <h3 className="h-sub" id="publications"><span className="en">Publications and writing</span><span className="th" lang="th">ผลงานตีพิมพ์และงานเขียน</span></h3>
          <ol className="pubs">
            <li>
              <p className="pub-meta">Harm Reduction Journal · 2026 · <span className="en">peer-reviewed</span><span className="th" lang="th">ผ่านการพิชญพิจารณ์</span></p>
              <p className="pub-title">Developing a locally grounded definition of <i>hi-fun</i> (chemsex) with gay, bisexual and other men who have sex with men in Thailand: a qualitative study</p>
              <p className="pub-authors">Witzel TC, Waratworawan W, Samoh N, … <b>Srichau S</b>, … Guadamuz TE. <span className="en">With UCL, Mahidol University, La Trobe University and IHRI. Funded by Wellcome Trust.</span><span className="th" lang="th">ร่วมกับ UCL มหาวิทยาลัยมหิดล La Trobe และ IHRI ทุนจาก Wellcome Trust</span></p>
              <a className="link" href="https://doi.org/10.1186/s12954-026-01426-w" target="_blank" rel="noopener">doi.org/10.1186/s12954-026-01426-w <span aria-hidden="true">↗</span></a>
            </li>
            <li>
              <p className="pub-meta">medRxiv · 2026 · <span className="en">preprint</span><span className="th" lang="th">พรีปรินต์</span></p>
              <p className="pub-title">Living <i>hi</i>: GBMSM narratives of pleasure, risk, and everyday <i>hi-fun</i> (chemsex) navigation in Thailand</p>
              <p className="pub-authors">Waratworawan W, Samoh N, Rodger AJ, … <b>Srichau S</b>, … Witzel TC.</p>
              <a className="link" href="https://www.medrxiv.org/content/10.64898/2026.03.19.26348853v1" target="_blank" rel="noopener">medrxiv.org <span aria-hidden="true">↗</span></a>
            </li>
            <li>
              <p className="pub-meta">HR25, Bogotá · 2025 · <span className="en">conference abstract</span><span className="th" lang="th">บทคัดย่อในงานประชุม</span></p>
              <p className="pub-title">Developing a locally grounded definition of hi-fun (chemsex) with gay, bisexual and other men who have sex with men in Thailand</p>
              <p className="pub-authors">Witzel TC, … <b>Srichau S</b>, … Guadamuz T.</p>
              <a className="link" href="https://hr25.hri.global/abstract/44" target="_blank" rel="noopener">hr25.hri.global <span aria-hidden="true">↗</span></a>
            </li>
            <li>
              <p className="pub-meta">APCS 2026 · <span className="en">poster presentation</span><span className="th" lang="th">นำเสนอโปสเตอร์</span></p>
              <p className="pub-title"><span className="en">Asia-Pacific Chemsex Symposium: one of five SWING works selected (1 oral, 4 posters).</span><span className="th" lang="th">Asia-Pacific Chemsex Symposium: หนึ่งใน 5 ผลงานของ SWING ที่ได้รับคัดเลือก (บรรยาย 1 โปสเตอร์ 4)</span></p>
            </li>
            <li>
              <p className="pub-meta">AIDS 2026, Rio de Janeiro · <span className="en">poster</span><span className="th" lang="th">โปสเตอร์</span></p>
              <p className="pub-title"><span className="en">First-author poster, presented in Rio de Janeiro.</span><span className="th" lang="th">ผู้เขียนหลักโปสเตอร์ นำเสนอที่ริโอเดจาเนโร</span></p>
            </li>
                <li>
              <p className="pub-meta">APCOM · <span className="en">reflection piece</span><span className="th" lang="th">บทความ</span></p>
              <p className="pub-title">AIDS2024: Insights and implications for advancing global health</p>
              <p className="pub-authors"><span className="en">What APCOM took from AIDS 2024 in Munich: person-centred care, PrEP for young people, AI in HIV care and harm reduction.</span><span className="th" lang="th">สิ่งที่ได้จาก AIDS 2024 ที่มิวนิก: การดูแลที่ยึดคนเป็นศูนย์กลาง PrEP สำหรับคนรุ่นใหม่ AI ในงานเอชไอวี และการลดอันตราย</span></p>
              <a className="link" href="https://www.apcom.org/aids2024-insights-implications-advancing-global-health-siripong/" target="_blank" rel="noopener">apcom.org <span aria-hidden="true">↗</span></a>
            </li>
          </ol>
        </div>
      </section>

      {/* Skills & education */}
      <section className="chapter" id="skills" aria-labelledby="skills-h">
        <div className="wrap">
          <header className="chapter-head">
            <p className="chapter-no">08</p>
            <div>
              <h2 className="h-section" id="skills-h"><span className="en">What I bring to a team</span><span className="th" lang="th">สิ่งที่นำมาสู่ทีม</span></h2>
            </div>
          </header>
          <div className="skills">
            <div>
              <h3 className="col-h"><span className="en">Communication and campaigns</span><span className="th" lang="th">สื่อสารและแคมเปญ</span></h3>
              <p className="en">Strategy, storytelling, social and content planning, GA4 analytics, donor decks, plain-language copy in Thai and English.</p>
              <p className="th" lang="th">วางกลยุทธ์ เล่าเรื่อง วางแผน<span className="nw">คอนเทนต์</span>และ<span className="nw">โซเชียล</span> วิเคราะห์ GA4 ทำเด็คสำหรับแหล่งทุน เขียนภาษาที่เข้าใจง่ายทั้งไทยและอังกฤษ</p>
            </div>
            <div>
              <h3 className="col-h"><span className="en">Digital and AI</span><span className="th" lang="th">ดิจิทัลและ AI</span></h3>
              <p className="en">Web and app design and build (React, Supabase, Lovable), trauma-informed design, AI for research, writing and automation, dashboards, video.</p>
              <p className="th" lang="th">ออกแบบและสร้างเว็บและแอป (React, Supabase, Lovable) การออกแบบที่คำนึงถึง<span className="nw">บาดแผลทางใจ</span> ใช้ AI ในงานวิจัย งานเขียน และระบบอัตโนมัติ <span className="nw">แดชบอร์ด</span> และ<span className="nw">วิดีโอ</span></p>
            </div>
            <div>
              <h3 className="col-h"><span className="en">Funding and partnerships</span><span className="th" lang="th">ทุนและพันธมิตร</span></h3>
              <p className="en">Concept notes, full proposals, budgets and donor reporting. CSR, crowdfunding and earned income. UN agencies, PEPFAR, NHSO, INGOs and corporates.</p>
              <p className="th" lang="th">แนวคิดโครงการ ข้อเสนอฉบับเต็ม งบประมาณ และรายงานแหล่งทุน CSR <span className="nw">ระดมทุนสาธารณะ</span> และรายได้ของตัวเอง ทำงานกับหน่วยงาน UN, PEPFAR, <span className="nw">สปสช.</span>, INGO และภาคธุรกิจ</p>
            </div>
            <div>
              <h3 className="col-h"><span className="en">Training and people</span><span className="th" lang="th">การอบรมและการนำทีม</span></h3>
              <p className="en">Participatory and scenario-based training, curriculum design, team leadership, facilitation for youth, communities, teachers and NGO staff.</p>
              <p className="th" lang="th">การอบรมแบบมีส่วนร่วมและใช้<span className="nw">สถานการณ์จำลอง</span> ออกแบบหลักสูตร นำทีม และเป็น<span className="nw">กระบวนกร</span>ให้เยาวชน ชุมชน ครู และเจ้าหน้าที่องค์กร</p>
            </div>
          </div>
          <dl className="edu">
            <div><dt><span className="en">Education</span><span className="th" lang="th">การศึกษา</span></dt><dd><span className="en">BA in Dramatic Arts, Chulalongkorn University</span><span className="th" lang="th">ศิลปศาสตรบัณฑิต สาขาการละคร จุฬาลงกรณ์มหาวิทยาลัย</span></dd></div>
            <div><dt><span className="en">Languages</span><span className="th" lang="th">ภาษา</span></dt><dd><span className="en">Thai (native), English (professional)</span><span className="th" lang="th">ไทย (ภาษาแม่) อังกฤษ (ระดับทำงาน)</span></dd></div>
            <div><dt><span className="en">Also</span><span className="th" lang="th">งานอื่น</span></dt><dd><span className="en">Playwright; translated four full-length plays into Thai. Creator of ArmShares, a short-video channel on sexual health.</span><span className="th" lang="th">นักเขียนบทละคร แปลบทละครเต็มเรื่อง 4 เรื่องเป็นภาษาไทย และทำช่อง<span className="nw">วิดีโอ</span>สั้น ArmShares เรื่องสุขภาพทางเพศ</span></dd></div>
          </dl>
        </div>
      </section>

      {/* Open call */}
      <section className="call" id="open-call" aria-labelledby="call-h" data-deadline="2026-11-08T23:59:59+07:00" data-form="/apply">
        <div className="wrap">
          <p className="call-k"><span className="call-dot" aria-hidden="true"></span><span className="en">Open call · November 2026</span><span className="th" lang="th">เปิดรับ · พฤศจิกายน 2569</span></p>
          <h2 className="h-section" id="call-h"><span className="en">Three organisations this November. Pay what you can, from THB 0.</span><span className="th" lang="th">พฤศจิกายนนี้ รับทำงานให้ 3 องค์กร <span className="nw">จ่ายตามกำลัง</span> <span className="nw">เริ่มที่ 0 บาท</span></span></h2>
          <p className="lede en">Ten-plus years of communication work for social-sector organisations, from health campaigns like testBKK with APCOM to rights work and online media. This round is a chance to build work with new groups.</p>
          <p className="lede th" lang="th">ทำงานสื่อสารให้องค์กรภาคสังคมมาสิบกว่าปี ทั้งแคมเปญสุขภาพ งานสิทธิ และสื่อออนไลน์ เคยทำแคมเปญ testBKK กับ APCOM ช่วงนี้อยากเก็บผลงานกับคนกลุ่มใหม่ ๆ บ้าง เลยเปิดรอบนี้ขึ้นมา</p>

          <h3 className="h-sub"><span className="en">Pick one</span><span className="th" lang="th">เลือกได้หนึ่งอย่าง</span></h3>
          <ul className="offers">
            <li>
              <p className="offer-n">01</p>
              <h4><span className="en">One-page website</span><span className="th" lang="th">เว็บไซต์หน้าเดียว</span></h4>
              <p className="offer-p"><span className="en">Usually about THB 15,000</span><span className="th" lang="th">ปกติราว 15,000 บาท</span></p>
              <a className="link" href="#made"><span className="en">See sites I’ve built</span><span className="th" lang="th">ดูเว็บที่เคยทำ</span> <span aria-hidden="true">↑</span></a>
            </li>
            <li>
              <p className="offer-n">02</p>
              <h4><span className="en">30-day marketing plan, on one page</span><span className="th" lang="th">แผนการตลาด 30 วัน <span className="nw">สรุปจบในหน้าเดียว</span></span></h4>
              <p className="offer-p"><span className="en">Usually about THB 10,000</span><span className="th" lang="th">ปกติราว 10,000 บาท</span></p>
            </li>
            <li>
              <p className="offer-n">03</p>
              <h4><span className="en">Content set: 4 posts with captions</span><span className="th" lang="th">ชุดคอนเทนต์ 4 โพสต์พร้อมแคปชัน</span></h4>
              <p className="offer-p"><span className="en">Usually about THB 8,000</span><span className="th" lang="th">ปกติราว 8,000 บาท</span></p>
            </li>
          </ul>

          <div className="call-terms">
            <div>
              <h3 className="col-h"><span className="en">How it works</span><span className="th" lang="th">เงื่อนไขงาน</span></h3>
              <ul className="ticks en"><li>Two rounds of revisions</li><li>Done in two weeks</li><li>Real costs such as domain, hosting or printing are paid by you</li></ul>
              <ul className="ticks th" lang="th"><li>แก้ได้ 2 รอบ</li><li>เสร็จใน 2 สัปดาห์</li><li>ค่าใช้จ่ายจริงอย่างโดเมน โฮสติ้ง หรือค่าพิมพ์ เจ้าของงานออกเอง</li></ul>
            </div>
            <div>
              <h3 className="col-h"><span className="en">What I ask in return</span><span className="th" lang="th">ที่ขอแลก</span></h3>
              <ul className="ticks en"><li>Show the work in my portfolio with your brand name</li><li>A short review, one paragraph</li><li>Your numbers after one month: more messages, visits or sales</li></ul>
              <ul className="ticks th" lang="th"><li>เอางานไปลงพอร์ตพร้อมชื่อแบรนด์</li><li>รีวิวสั้น ๆ หนึ่งย่อหน้า</li><li>ตัวเลขหลังใช้งาน 1 เดือน ว่ามีคนทักเพิ่ม เข้าเว็บเพิ่ม หรือขายได้เพิ่มแค่ไหน</li></ul>
            </div>
            <div>
              <h3 className="col-h"><span className="en">A good fit for</span><span className="th" lang="th">เหมาะกับ</span></h3>
              <p className="en">Community groups, small NGOs, social enterprises, and small shops and brands without an agency budget.</p>
              <p className="th" lang="th">กลุ่มชุมชน NGO เล็ก ธุรกิจเพื่อสังคม หรือร้านและแบรนด์เล็กที่ยังไม่มีงบจ้างเอเจนซี่</p>
            </div>
          </div>

          <ol className="call-steps">
            <li><b>8 Nov</b><span className="en">Last day to apply</span><span className="th" lang="th">วันสุดท้ายของการสมัคร</span></li>
            <li><b>15 Nov</b><span className="en">Three picked and contacted</span><span className="th" lang="th">เลือก 3 ที่และติดต่อกลับ</span></li>
            <li><b><span className="en">2 weeks</span><span className="th" lang="th">2 สัปดาห์</span></b><span className="en">Work delivered</span><span className="th" lang="th">ส่งงาน</span></li>
          </ol>

          <div className="call-cta call-open-only">
            <button className="btn btn-accent" type="button" data-request="apply" id="call-apply"><span className="en">Apply for a slot</span><span className="th" lang="th">สมัครรอบนี้</span></button>
            <p className="muted"><span className="en">8 short questions. Takes about 5 minutes.</span><span className="th" lang="th">คำถามสั้น ๆ 8 ข้อ ใช้เวลาราว 5 นาที</span></p>
          </div>
          <p className="call-closed-msg call-closed-only"><span className="en">Applications for November are closed. Thank you to everyone who applied.</span><span className="th" lang="th">ปิดรับสมัครรอบพฤศจิกายนแล้ว ขอบคุณทุกองค์กรที่สมัครเข้ามา</span></p>
        </div>
      </section>

      {/* Contact */}
      <section className="contact" id="contact" aria-labelledby="contact-h">
        <div className="wrap">
          <h2 className="contact-h" id="contact-h"><span className="en">Let’s work together.</span><span className="th" lang="th">มาทำงานด้วยกัน</span></h2>
          <div className="contact-grid">
            <div>
              <p className="contact-lede en">Open to roles where communication, digital tools and partnerships meet health, rights or social impact. Based in Bangkok, happy to work across the region.</p>
              <p className="contact-lede th" lang="th">เปิดรับงานที่การสื่อสาร เครื่องมือดิจิทัล และงานพันธมิตร มาเจอกับงานสุขภาพ สิทธิ หรือผลกระทบทางสังคม อยู่<span className="nw">กรุงเทพฯ</span> และพร้อมทำงานทั่วภูมิภาค</p>
              <ul className="roles">
                <li><span className="en">Communications and campaigns lead</span><span className="th" lang="th">หัวหน้างานสื่อสารและแคมเปญ</span></li>
                <li><span className="en">Digital and AI for social impact</span><span className="th" lang="th">ดิจิทัลและ AI เพื่อสังคม</span></li>
                <li><span className="en">Partnerships and fundraising</span><span className="th" lang="th">พันธมิตรและระดมทุน</span></li>
                <li><span className="en">Learning and training design</span><span className="th" lang="th">ออกแบบการเรียนรู้และการอบรม</span></li>
              </ul>
            </div>
            <div className="contact-actions">
              <a className="mail" href="mailto:srichausiripong@gmail.com">srichausiripong@gmail.com</a>
              <div className="contact-btns">
                <button className="btn btn-accent" type="button" id="copy-email" data-email="srichausiripong@gmail.com">
                  <span className="en">Copy email</span><span className="th" lang="th">คัดลอกอีเมล</span>
                </button>
                <a className="btn btn-line-light" href="https://www.linkedin.com/in/siripong-srichau-7107b5147" target="_blank" rel="noopener">LinkedIn <span aria-hidden="true">↗</span></a>
              </div>
              <ul className="downloads">
                <li><button type="button" data-request="cv"><span className="en">Request CV and portfolio</span><span className="th" lang="th">ขอ CV และพอร์ตโฟลิโอ</span> <small><span className="en">sent by email</span><span className="th" lang="th">ส่งให้ทางอีเมล</span></small></button></li>
                <li className="call-open-only"><button type="button" data-request="apply"><span className="en">Apply for the November open call</span><span className="th" lang="th">สมัครรอบพฤศจิกายน</span> <small><span className="en">by 8 Nov</span><span className="th" lang="th">ภายใน 8 พ.ย.</span></small></button></li>
                <li><button type="button" data-request="collab"><span className="en">Propose a collaboration</span><span className="th" lang="th">ชวนทำงานร่วมกัน</span> <small><span className="en">campaigns, platforms, training</span><span className="th" lang="th">แคมเปญ แพลตฟอร์ม อบรม</span></small></button></li>
              </ul>
            </div>
          </div>
          <footer className="foot">
            <p>© 2026 Siripong Srichau</p>
            <p><span className="en">Photos: UNAIDS, APCOM, SWING Foundation, RSAT, Taejai</span><span className="th" lang="th">ภาพ: UNAIDS, APCOM, มูลนิธิ SWING, RSAT, เทใจ</span></p>
          </footer>
        </div>
      </section>
      </main>

      <dialog className="req" id="request" aria-labelledby="req-h">
        <form method="dialog" className="req-inner">
          <div className="req-top">
            <h2 id="req-h"><span className="req-t-default"><span className="en">Get in touch</span><span className="th" lang="th">ติดต่อ</span></span><span className="req-t-apply"><span className="en">Apply for November</span><span className="th" lang="th">สมัครรอบพฤศจิกายน</span></span></h2>
            <button className="req-x" value="close" aria-label="Close"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9m0-9-9 9"/></svg></button>
          </div>
          <div className="seg" role="radiogroup" aria-label="Purpose">
            <span className="seg-pill" aria-hidden="true"></span>
            <button type="button" role="radio" data-purpose="cv" aria-checked="true"><span className="en">Request CV</span><span className="th" lang="th">ขอ CV</span></button>
            <button type="button" role="radio" data-purpose="collab" aria-checked="false"><span className="en">Collaboration</span><span className="th" lang="th">ชวนทำงานร่วมกัน</span></button>
          </div>
          <p className="req-note req-apply-note"><span className="en">Answer the 8 questions below, then send. Apply by 8 November; the three picked will hear back by 15 November.</span><span className="th" lang="th">ตอบคำถาม 8 ข้อด้านล่างแล้วส่งได้เลย สมัครภายใน 8 พฤศจิกายน เลือก 3 ที่และติดต่อกลับภายใน 15 พฤศจิกายน</span></p>
          <p className="req-note req-default-note"><span className="en">The CV and full portfolio are sent by email on request. Edit the draft below, then send it from your email.</span><span className="th" lang="th">CV และพอร์ตโฟลิโอฉบับเต็มจะส่งให้ทางอีเมลเมื่อขอเข้ามา แก้ข้อความด้านล่างได้ แล้วส่งจากอีเมลของคุณ</span></p>
          <label className="req-label" htmlFor="req-msg"><span className="en">Message</span><span className="th" lang="th">ข้อความ</span></label>
          <textarea id="req-msg" rows={8}></textarea>
          <div className="req-actions">
            <a className="btn btn-accent" id="req-send" href="mailto:srichausiripong@gmail.com"><span className="en">Open in email</span><span className="th" lang="th">เปิดในแอปอีเมล</span> <span aria-hidden="true">↗</span></a>
            <button className="btn btn-line" type="button" id="req-copy"><span className="en">Copy message</span><span className="th" lang="th">คัดลอกข้อความ</span></button>
          </div>
          <p className="req-to"><span className="en">To</span><span className="th" lang="th">ถึง</span> srichausiripong@gmail.com · <a href="https://www.linkedin.com/in/siripong-srichau-7107b5147" target="_blank" rel="noopener">LinkedIn ↗</a></p>
        </form>
      </dialog>

      <div className="toast" id="toast" role="status" aria-live="polite"></div>
    </div>
  );
}
