import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import portfolioCss from "../portfolio.css?url";
import applyCss from "../apply.css?url";
import { OPEN_CALL_DEADLINE, openCallSchema, type OpenCallInput } from "../lib/open-call-schema";
import { submitOpenCallApplication } from "../lib/open-call.functions";

const TITLE = "Apply — November open call · Arm Srichau";
const DESCRIPTION =
  "Apply for the November open call: three organisations, pay what you can, from THB 0. Applications close 8 November.";

// Same pre-paint language pick as the home page.
const PRE_PAINT = `(function () {
  var d = document.documentElement;
  var lang = new URLSearchParams(location.search).get('lang');
  if (lang !== 'en' && lang !== 'th') { try { lang = localStorage.getItem('lang'); } catch (e) {} }
  d.dataset.lang = lang === 'th' ? 'th' : 'en';
  if (lang === 'th') d.lang = 'th';
  d.classList.add('js');
})();`;

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230E2233'/%3E%3Ctext x='32' y='45' font-family='Arial Black,Arial,sans-serif' font-weight='900' font-size='38' text-anchor='middle' fill='%23F7F9FB'%3EA%3C/text%3E%3C/svg%3E";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { name: "theme-color", content: "#F7F9FB" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
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
      { rel: "stylesheet", href: applyCss },
    ],
    scripts: [{ children: PRE_PAINT }],
  }),
  component: ApplyPage,
});

type Lang = "en" | "th";

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p className="f-error" role="alert">
      <span className="en">
        {message === "url" ? "Please enter a valid link (starting with http:// or https://)." : "Please fill this in."}
      </span>
      <span className="th" lang="th">
        {message === "url" ? "กรุณาใส่ลิงก์ที่ถูกต้อง (ขึ้นต้นด้วย http:// หรือ https://)" : "กรุณากรอกช่องนี้"}
      </span>
    </p>
  );
}

function ApplyPage() {
  const [lang, setLangState] = useState<Lang>("en");
  const [status, setStatus] = useState<"form" | "done" | "closed">("form");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submit = useServerFn(submitOpenCallApplication);

  useEffect(() => {
    const current = document.documentElement.dataset["lang"] === "th" ? "th" : "en";
    setLangState(current);
    if (Date.now() > Date.parse(OPEN_CALL_DEADLINE)) setStatus("closed");
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    document.documentElement.dataset["lang"] = l;
    document.documentElement.lang = l;
    try {
      localStorage.setItem("lang", l);
    } catch {
      /* storage blocked */
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OpenCallInput>({
    resolver: zodResolver(openCallSchema),
    defaultValues: {
      organisation: "",
      link: "",
      about: "",
      problem: "",
      oneMonthChange: "",
      contactName: "",
      email: "",
      channelDetail: "",
      language: "en",
      website: "",
    },
  });

  const about = watch("about") ?? "";
  const problem = watch("problem") ?? "";
  const oneMonthChange = watch("oneMonthChange") ?? "";

  async function onSubmit(values: OpenCallInput) {
    setSubmitError(null);
    try {
      const result = await submit({ data: { ...values, language: lang } });
      if (result.ok) {
        setStatus("done");
        window.scrollTo({ top: 0 });
      } else if (result.reason === "closed") {
        setStatus("closed");
      } else if (result.reason === "rate_limited") {
        setSubmitError("rate_limited");
      } else {
        setSubmitError("error");
      }
    } catch {
      setSubmitError("error");
    }
  }

  return (
    <div className="portfolio">
      <header className="apply-top">
        <div className="apply-top-inner wrap">
          <Link to="/" hash="open-call" className="apply-back">
            <span aria-hidden="true">←</span>
            <span className="en">Back to portfolio</span>
            <span className="th" lang="th">กลับหน้าพอร์ต</span>
          </Link>
          <div className="lang" role="group" aria-label="Language">
            <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>
              EN
            </button>
            <button type="button" aria-pressed={lang === "th"} onClick={() => setLang("th")} lang="th">
              ไทย
            </button>
          </div>
        </div>
      </header>

      <main className="apply-main">
        <div className="wrap">
          <div className="apply-intro">
            <p className="col-h">
              <span className="en">Open call · November 2026</span>
              <span className="th" lang="th">เปิดรับ · พฤศจิกายน 2569</span>
            </p>
            <h1 className="h-section" style={{ marginTop: 24 }}>
              <span className="en">Apply for the November open call</span>
              <span className="th" lang="th">สมัครรอบพฤศจิกายน</span>
            </h1>
            <p className="lede en">
              Three organisations, pay what you can, from THB 0. Apply by 8 November; the three picked will hear back
              by 15 November.
            </p>
            <p className="lede th" lang="th">
              รับทำงานให้ 3 องค์กร จ่ายตามกำลัง เริ่มที่ 0 บาท สมัครภายใน 8 พฤศจิกายน เลือก 3 ที่และติดต่อกลับภายใน
              15 พฤศจิกายน
            </p>
          </div>

          {status === "closed" && (
            <div className="apply-closed">
              <h2>
                <span className="en">Applications for November are closed.</span>
                <span className="th" lang="th">ปิดรับสมัครรอบพฤศจิกายนแล้ว</span>
              </h2>
              <p>
                <Link to="/" hash="open-call" className="link">
                  <span className="en">Back to the portfolio</span>
                  <span className="th" lang="th">กลับไปหน้าพอร์ต</span>
                </Link>
              </p>
            </div>
          )}

          {status === "done" && (
            <div className="apply-done">
              <h2>
                <span className="en">Thank you. Your application is in.</span>
                <span className="th" lang="th">ขอบคุณที่สมัครเข้ามา</span>
              </h2>
              <p>
                <span className="en">The three organisations picked will hear back by 15 November.</span>
                <span className="th" lang="th">จะติดต่อกลับ 3 องค์กรที่ได้รับเลือกภายใน 15 พฤศจิกายน</span>
              </p>
              <p>
                <Link to="/" hash="open-call" className="link">
                  <span className="en">Back to the portfolio</span>
                  <span className="th" lang="th">กลับไปหน้าพอร์ต</span>
                </Link>
              </p>
            </div>
          )}

          {status === "form" && (
            <form className="apply-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* 1. Organisation */}
              <div className="f-field">
                <label className="f-label" htmlFor="f-organisation">
                  <span className="en">Organisation or brand name</span>
                  <span className="th" lang="th">ชื่อองค์กรหรือแบรนด์</span>
                  <span className="f-req" aria-hidden="true">*</span>
                </label>
                <input
                  id="f-organisation"
                  className="f-input"
                  type="text"
                  aria-invalid={!!errors.organisation}
                  {...register("organisation")}
                />
                <FieldError message={errors.organisation?.message} />
              </div>

              <div className="f-field">
                <label className="f-label" htmlFor="f-link">
                  <span className="en">Page or website link</span>
                  <span className="th" lang="th">ลิงก์เพจหรือเว็บ</span>
                  <span className="f-hint">
                    {" "}
                    · <span className="en">optional</span>
                    <span className="th" lang="th">ถ้ามี</span>
                  </span>
                </label>
                <input
                  id="f-link"
                  className="f-input"
                  type="url"
                  placeholder="https://"
                  aria-invalid={!!errors.link}
                  {...register("link")}
                />
                <FieldError message={errors.link?.message} />
              </div>

              {/* 2. About */}
              <div className="f-field">
                <label className="f-label" htmlFor="f-about">
                  <span className="en">What you do and for whom (2–3 lines)</span>
                  <span className="th" lang="th">ทำอะไร ให้ใครอยู่ เล่าสั้น ๆ 2–3 บรรทัด</span>
                  <span className="f-req" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="f-about"
                  className="f-textarea"
                  maxLength={600}
                  aria-invalid={!!errors.about}
                  {...register("about")}
                />
                <p className="f-count">{about.length}/600</p>
                <FieldError message={errors.about?.message} />
              </div>

              {/* 3. Piece of work */}
              <fieldset className="f-field" style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="f-label" style={{ padding: 0 }}>
                  <span className="en">Which piece of work</span>
                  <span className="th" lang="th">อยากได้งานแบบไหน</span>
                  <span className="f-req" aria-hidden="true">*</span>
                </legend>
                <div className="f-options">
                  <label className="f-option">
                    <input type="radio" value="one_page_website" {...register("workType")} />
                    <span>
                      <span className="f-option-title">
                        <span className="en">One-page website</span>
                        <span className="th" lang="th">เว็บหน้าเดียว</span>
                      </span>
                      <span className="f-option-sub">
                        <span className="en">usually about THB 15,000</span>
                        <span className="th" lang="th">ปกติประมาณ 15,000 บาท</span>
                      </span>
                    </span>
                  </label>
                  <label className="f-option">
                    <input type="radio" value="marketing_plan" {...register("workType")} />
                    <span>
                      <span className="f-option-title">
                        <span className="en">30-day marketing plan on one page</span>
                        <span className="th" lang="th">แผนการตลาด 30 วันในหน้าเดียว</span>
                      </span>
                      <span className="f-option-sub">
                        <span className="en">usually about THB 10,000</span>
                        <span className="th" lang="th">ปกติประมาณ 10,000 บาท</span>
                      </span>
                    </span>
                  </label>
                  <label className="f-option">
                    <input type="radio" value="content_set" {...register("workType")} />
                    <span>
                      <span className="f-option-title">
                        <span className="en">Content set: 4 posts with captions</span>
                        <span className="th" lang="th">ชุดคอนเทนต์ 4 โพสต์พร้อมแคปชัน</span>
                      </span>
                      <span className="f-option-sub">
                        <span className="en">usually about THB 8,000</span>
                        <span className="th" lang="th">ปกติประมาณ 8,000 บาท</span>
                      </span>
                    </span>
                  </label>
                </div>
                <FieldError message={errors.workType?.message} />
              </fieldset>

              {/* 4. Problem */}
              <div className="f-field">
                <label className="f-label" htmlFor="f-problem">
                  <span className="en">Your biggest problem right now</span>
                  <span className="th" lang="th">ตอนนี้ติดปัญหาอะไรที่สุด</span>
                  <span className="f-req" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="f-problem"
                  className="f-textarea"
                  maxLength={600}
                  aria-invalid={!!errors.problem}
                  {...register("problem")}
                />
                <p className="f-count">{problem.length}/600</p>
                <FieldError message={errors.problem?.message} />
              </div>

              {/* 5. One month */}
              <div className="f-field">
                <label className="f-label" htmlFor="f-month">
                  <span className="en">If this works, what do you want to see change in one month?</span>
                  <span className="th" lang="th">ถ้างานนี้เวิร์ก 1 เดือนข้างหน้าอยากเห็นอะไรเปลี่ยน</span>
                  <span className="f-req" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="f-month"
                  className="f-textarea"
                  maxLength={600}
                  aria-invalid={!!errors.oneMonthChange}
                  {...register("oneMonthChange")}
                />
                <p className="f-count">{oneMonthChange.length}/600</p>
                <FieldError message={errors.oneMonthChange?.message} />
              </div>

              {/* 6. Contact */}
              <div className="f-field">
                <label className="f-label" htmlFor="f-contact-name">
                  <span className="en">Main contact person</span>
                  <span className="th" lang="th">ผู้ประสานงานหลัก</span>
                  <span className="f-req" aria-hidden="true">*</span>
                </label>
                <input
                  id="f-contact-name"
                  className="f-input"
                  type="text"
                  aria-invalid={!!errors.contactName}
                  {...register("contactName")}
                />
                <FieldError message={errors.contactName?.message} />
              </div>

              <div className="f-row">
                <div className="f-field">
                  <label className="f-label" htmlFor="f-email">
                    <span className="en">Email</span>
                    <span className="th" lang="th">อีเมล</span>
                    <span className="f-req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="f-email"
                    className="f-input"
                    type="email"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
                <div className="f-field">
                  <label className="f-label" htmlFor="f-channel">
                    <span className="en">Preferred channel</span>
                    <span className="th" lang="th">ช่องทางที่สะดวกที่สุด</span>
                    <span className="f-req" aria-hidden="true">*</span>
                  </label>
                  <select id="f-channel" className="f-select" aria-invalid={!!errors.channel} {...register("channel")}>
                    <option value="">—</option>
                    <option value="email">Email</option>
                    <option value="line">LINE</option>
                    <option value="phone">
                      Phone<span className="th" lang="th"> / โทรศัพท์</span>
                    </option>
                    <option value="messenger">Facebook Messenger</option>
                    <option value="other">
                      Other<span className="th" lang="th"> / อื่น ๆ</span>
                    </option>
                  </select>
                  <FieldError message={errors.channel?.message} />
                </div>
              </div>

              <div className="f-field">
                <label className="f-label" htmlFor="f-channel-detail">
                  <span className="en">Contact detail for that channel (LINE ID, phone, etc.)</span>
                  <span className="th" lang="th">รายละเอียดช่องทางนั้น (LINE ID, เบอร์โทร ฯลฯ)</span>
                  <span className="f-hint">
                    {" "}
                    · <span className="en">optional</span>
                    <span className="th" lang="th">ไม่บังคับ</span>
                  </span>
                </label>
                <input id="f-channel-detail" className="f-input" type="text" {...register("channelDetail")} />
              </div>

              {/* 7. Terms */}
              <fieldset className="f-field" style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="f-label" style={{ padding: 0 }}>
                  <span className="en">
                    Do you agree to: showing the work in the portfolio with your brand name, a one-paragraph review,
                    and sharing your numbers after one month?
                  </span>
                  <span className="th" lang="th">
                    ตกลงเงื่อนไข: ลงผลงานในพอร์ตพร้อมชื่อแบรนด์ เขียนรีวิวหนึ่งย่อหน้า และแชร์ตัวเลขหลังครบ 1 เดือน
                    ไหม
                  </span>
                  <span className="f-req" aria-hidden="true">*</span>
                </legend>
                <div className="f-options" style={{ gridTemplateColumns: "1fr 1fr", display: "grid" }}>
                  <label className="f-option">
                    <input type="radio" value="yes" {...register("agreeTerms")} />
                    <span className="f-option-title">
                      <span className="en">Yes</span>
                      <span className="th" lang="th">ตกลง</span>
                    </span>
                  </label>
                  <label className="f-option">
                    <input type="radio" value="no" {...register("agreeTerms")} />
                    <span className="f-option-title">
                      <span className="en">No</span>
                      <span className="th" lang="th">ไม่ตกลง</span>
                    </span>
                  </label>
                </div>
                <FieldError message={errors.agreeTerms?.message} />
              </fieldset>

              {/* 8. Budget */}
              <fieldset className="f-field" style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="f-label" style={{ padding: 0 }}>
                  <span className="en">If you can pay, roughly how much?</span>
                  <span className="th" lang="th">ถ้าจ่ายได้ ประมาณเท่าไร</span>
                  <span className="f-req" aria-hidden="true">*</span>
                </legend>
                <div className="f-options">
                  <label className="f-option">
                    <input type="radio" value="0" {...register("budget")} />
                    <span className="f-option-title">THB 0</span>
                  </label>
                  <label className="f-option">
                    <input type="radio" value="up_to_2000" {...register("budget")} />
                    <span className="f-option-title">
                      <span className="en">Up to 2,000</span>
                      <span className="th" lang="th">ไม่เกิน 2,000</span>
                    </span>
                  </label>
                  <label className="f-option">
                    <input type="radio" value="2000_5000" {...register("budget")} />
                    <span className="f-option-title">2,000–5,000</span>
                  </label>
                  <label className="f-option">
                    <input type="radio" value="over_5000" {...register("budget")} />
                    <span className="f-option-title">
                      <span className="en">Over 5,000</span>
                      <span className="th" lang="th">มากกว่า 5,000</span>
                    </span>
                  </label>
                </div>
                <FieldError message={errors.budget?.message} />
              </fieldset>

              {/* Honeypot — invisible to people, bots fill it */}
              <div className="f-honeypot" aria-hidden="true">
                <label htmlFor="f-website">Website</label>
                <input id="f-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
              </div>

              {submitError && (
                <p className="apply-fail" role="alert">
                  {submitError === "rate_limited" ? (
                    <>
                      <span className="en">
                        Too many submissions from this connection. Please wait a while and try again.
                      </span>
                      <span className="th" lang="th">
                        มีการส่งจากเครือข่ายนี้บ่อยเกินไป รอสักครู่แล้วลองใหม่
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="en">
                        Something went wrong while sending. Your answers are still here — please try again.
                      </span>
                      <span className="th" lang="th">
                        ส่งไม่สำเร็จ คำตอบยังอยู่ครบ กรุณาลองส่งอีกครั้ง
                      </span>
                    </>
                  )}
                </p>
              )}

              <div className="apply-submit">
                <button className="btn btn-accent" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="en">Sending…</span>
                      <span className="th" lang="th">กำลังส่ง…</span>
                    </>
                  ) : (
                    <>
                      <span className="en">Send application</span>
                      <span className="th" lang="th">ส่งใบสมัคร</span>
                    </>
                  )}
                </button>
                <p className="apply-privacy">
                  <span className="en">Your answers are only used to choose the three organisations for this round.</span>
                  <span className="th" lang="th">ข้อมูลนี้ใช้เพื่อคัดเลือก 3 องค์กรในรอบนี้เท่านั้น</span>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
