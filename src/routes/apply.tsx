import { createFileRoute, useHydrated } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import portfolioCss from "../portfolio.css?url";
import applyCss from "../apply.css?url";
import { openCallSchema, type OpenCallInput, type OpenCallData } from "../lib/open-call-schema";
import { getOpenCallState, submitOpenCallApplication } from "../lib/open-call.functions";

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
  staticData: { sitemap: false },
  loader: () => getOpenCallState(),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { name: "theme-color", content: "#F7F9FB" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

function errorText(message: string, lang: Lang) {
  const limit = message.startsWith("too_long:") ? message.split(":")[1] : null;
  if (limit) return lang === "en" ? `Use no more than ${limit} characters.` : `กรุณากรอกไม่เกิน ${limit} ตัวอักษร`;
  const messages: Record<string, [string, string]> = {
    required: ["This field is required.", "กรุณากรอกช่องนี้"],
    email: ["Enter a valid email address.", "กรุณากรอกอีเมลที่ถูกต้อง"],
    url: ["Enter a valid website or page link.", "กรุณากรอกลิงก์เว็บไซต์หรือเพจที่ถูกต้อง"],
    choose_one: ["Choose one option.", "กรุณาเลือกหนึ่งตัวเลือก"],
  };
  const pair = messages[message];
  return pair ? pair[lang === "en" ? 0 : 1] : (lang === "en" ? "This field is required." : "กรุณากรอกช่องนี้");
}

function FieldError({ message, name }: { message?: string | undefined; name: string }) {
  if (!message) return null;
  return <p className="f-error" id={`error-${name}`}>
    <span className="en">{errorText(message, "en")}</span>
    <span className="th" lang="th">{errorText(message, "th")}</span>
  </p>;
}

function ApplyPage() {
  const initial = Route.useLoaderData();
  const hydrated = useHydrated();
  const outcomeRef = useRef<HTMLHeadingElement>(null);
  const failureRef = useRef<HTMLParagraphElement>(null);
  const [validationNotice, setValidationNotice] = useState("");
  const [lang, setLangState] = useState<Lang>("en");
  const [status, setStatus] = useState<"form" | "done" | "closed">(initial.closed ? "closed" : "form");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submit = useServerFn(submitOpenCallApplication);

  useEffect(() => {
    const current = document.documentElement.dataset["lang"] === "th" ? "th" : "en";
    setLangState(current);

  }, []);

  useEffect(() => {
    if (status !== "form") outcomeRef.current?.focus();
  }, [status]);
  useEffect(() => {
    if (submitError) failureRef.current?.focus();
  }, [submitError]);

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
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<OpenCallInput, unknown, OpenCallData>({
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
      hp_extra: "",
    },
  });

  const about = watch("about") ?? "";
  const problem = watch("problem") ?? "";
  const oneMonthChange = watch("oneMonthChange") ?? "";

  function fieldA11y(name: keyof OpenCallInput, required = true) {
    return {
      "aria-invalid": !!errors[name],
      "aria-describedby": errors[name] ? `error-${name}` : undefined,
      "aria-required": required,
    };
  }

  function onInvalid(invalid: typeof errors) {
    const order: (keyof OpenCallInput)[] = ["organisation", "link", "about", "workType", "problem", "oneMonthChange", "contactName", "email", "channel", "channelDetail", "agreeTerms", "budget"];
    const first = order.find((name) => invalid[name]);
    setValidationNotice(`${Date.now()}`);
    if (first) setFocus(first);
  }

  async function onSubmit(values: OpenCallData) {
    setSubmitError(null);
    setValidationNotice("");
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
          <a href="/#open-call" className="apply-back">
            <span aria-hidden="true">←</span>
            <span className="en">Back to portfolio</span>
            <span className="th" lang="th">กลับหน้าพอร์ต</span>
          </a>
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

      <div className="apply-live" aria-live="polite" aria-atomic="true">
        {validationNotice && (lang === "en" ? "Please correct the marked fields." : "กรุณาแก้ไขช่องที่ระบุ")}
        {submitError && (lang === "en" ? "Application not sent. Please check the message." : "ยังไม่ได้ส่งใบสมัคร กรุณาตรวจสอบข้อความ")}
        {status !== "form" && (lang === "en" ? (status === "done" ? "Your application is in." : "Applications are closed.") : (status === "done" ? "ได้รับใบสมัครแล้ว" : "ปิดรับสมัครแล้ว"))}
      </div>
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
              <h2 ref={outcomeRef} tabIndex={-1}>
                <span className="en">Applications for November are closed.</span>
                <span className="th" lang="th">ปิดรับสมัครรอบพฤศจิกายนแล้ว</span>
              </h2>
              <p>
                <a href="/#open-call" className="link">
                  <span className="en">Back to the portfolio</span>
                  <span className="th" lang="th">กลับไปหน้าพอร์ต</span>
                </a>
              </p>
            </div>
          )}

          {status === "done" && (
            <div className="apply-done">
              <h2 ref={outcomeRef} tabIndex={-1}>
                <span className="en">Thank you. Your application is in.</span>
                <span className="th" lang="th">ขอบคุณที่สมัครเข้ามา</span>
              </h2>
              <p>
                <span className="en">The three organisations picked will hear back by 15 November.</span>
                <span className="th" lang="th">จะติดต่อกลับ 3 องค์กรที่ได้รับเลือกภายใน 15 พฤศจิกายน</span>
              </p>
              <p>
                <a href="/#open-call" className="link">
                  <span className="en">Back to the portfolio</span>
                  <span className="th" lang="th">กลับไปหน้าพอร์ต</span>
                </a>
              </p>
            </div>
          )}

          {status === "form" && (
            <form className="apply-form" method="post" onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
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
                  {...fieldA11y("organisation", true)}
                  {...register("organisation")}
                />
                <FieldError name="organisation" message={errors.organisation?.message} />
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
                  type="text" inputMode="url"
                  placeholder="https://"
                  {...fieldA11y("link", false)}
                  {...register("link")}
                />
                <FieldError name="link" message={errors.link?.message} />
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
                  {...fieldA11y("about", true)}
                  {...register("about")}
                />
                <p className="f-count">{about.length}/600</p>
                <FieldError name="about" message={errors.about?.message} />
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
                    <input type="radio" value="one_page_website" {...fieldA11y("workType")} {...register("workType")} />
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
                    <input type="radio" value="marketing_plan" {...fieldA11y("workType")} {...register("workType")} />
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
                    <input type="radio" value="content_set" {...fieldA11y("workType")} {...register("workType")} />
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
                <FieldError name="workType" message={errors.workType?.message} />
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
                  {...fieldA11y("problem", true)}
                  {...register("problem")}
                />
                <p className="f-count">{problem.length}/600</p>
                <FieldError name="problem" message={errors.problem?.message} />
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
                  {...fieldA11y("oneMonthChange", true)}
                  {...register("oneMonthChange")}
                />
                <p className="f-count">{oneMonthChange.length}/600</p>
                <FieldError name="oneMonthChange" message={errors.oneMonthChange?.message} />
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
                  {...fieldA11y("contactName", true)}
                  {...register("contactName")}
                />
                <FieldError name="contactName" message={errors.contactName?.message} />
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
                    {...fieldA11y("email", true)}
                    {...register("email")}
                  />
                  <FieldError name="email" message={errors.email?.message} />
                </div>
                <div className="f-field">
                  <label className="f-label" htmlFor="f-channel">
                    <span className="en">Preferred channel</span>
                    <span className="th" lang="th">ช่องทางที่สะดวกที่สุด</span>
                    <span className="f-req" aria-hidden="true">*</span>
                  </label>
                  <select id="f-channel" className="f-select" {...fieldA11y("channel", true)} {...register("channel")}>
                    <option value="">—</option>
                    <option value="email">{lang === "en" ? "Email" : "อีเมล"}</option>
                    <option value="line">LINE</option>
                    <option value="phone">
                      {lang === "en" ? "Phone" : "โทรศัพท์"}
                    </option>
                    <option value="messenger">Facebook Messenger</option>
                    <option value="other">
                      {lang === "en" ? "Other" : "อื่น ๆ"}
                    </option>
                  </select>
                  <FieldError name="channel" message={errors.channel?.message} />
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
                <input id="f-channel-detail" className="f-input" type="text" {...fieldA11y("channelDetail", false)} {...register("channelDetail")} />
                <FieldError name="channelDetail" message={errors.channelDetail?.message} />
              </div>

              {/* 7. Terms */}
              <fieldset className="f-field" style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="f-label" style={{ padding: 0 }}>
                  <span className="en">
                    Do you agree to: showing the work in the portfolio with your brand name, a one-paragraph review,
                    and sharing your numbers after one month?
                  </span>
                  <span className="th" lang="th">
                    ยินยอมให้นำงานไปลงพอร์ตพร้อมชื่อแบรนด์ เขียนรีวิวสั้น ๆ หนึ่งย่อหน้า และแชร์ตัวเลขหลังใช้งาน 1 เดือนหรือไม่
                  </span>
                  <span className="f-req" aria-hidden="true">*</span>
                </legend>
                <div className="f-options" style={{ gridTemplateColumns: "1fr 1fr", display: "grid" }}>
                  <label className="f-option">
                    <input type="radio" value="yes" {...fieldA11y("agreeTerms")} {...register("agreeTerms")} />
                    <span className="f-option-title">
                      <span className="en">Yes</span>
                      <span className="th" lang="th">ตกลง</span>
                    </span>
                  </label>
                  <label className="f-option">
                    <input type="radio" value="no" {...fieldA11y("agreeTerms")} {...register("agreeTerms")} />
                    <span className="f-option-title">
                      <span className="en">No</span>
                      <span className="th" lang="th">ไม่ตกลง</span>
                    </span>
                  </label>
                </div>
                <FieldError name="agreeTerms" message={errors.agreeTerms?.message} />
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
                    <input type="radio" value="0" {...fieldA11y("budget")} {...register("budget")} />
                    <span className="f-option-title"><span className="en">THB 0</span><span className="th" lang="th">ไม่เสียค่าใช้จ่าย 0 บาท</span></span>
                  </label>
                  <label className="f-option">
                    <input type="radio" value="up_to_2000" {...fieldA11y("budget")} {...register("budget")} />
                    <span className="f-option-title">
                      <span className="en">Up to THB 2,000</span>
                      <span className="th" lang="th">ไม่เกิน 2,000 บาท</span>
                    </span>
                  </label>
                  <label className="f-option">
                    <input type="radio" value="2000_5000" {...fieldA11y("budget")} {...register("budget")} />
                    <span className="f-option-title"><span className="en">THB 2,000–5,000</span><span className="th" lang="th">2,000–5,000 บาท</span></span>
                  </label>
                  <label className="f-option">
                    <input type="radio" value="over_5000" {...fieldA11y("budget")} {...register("budget")} />
                    <span className="f-option-title">
                      <span className="en">Over THB 5,000</span>
                      <span className="th" lang="th">มากกว่า 5,000 บาท</span>
                    </span>
                  </label>
                </div>
                <FieldError name="budget" message={errors.budget?.message} />
              </fieldset>

              {/* Honeypot — invisible to people, bots fill it */}
              <div className="f-honeypot" aria-hidden="true">
                <label htmlFor="f-hp-extra">Extra</label>
                <input id="f-hp-extra" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" {...fieldA11y("hp_extra", false)} {...register("hp_extra")} />
                <FieldError name="hp_extra" message={errors.hp_extra?.message} />
              </div>

              {submitError && (
                <p className="apply-fail" ref={failureRef} tabIndex={-1}>
                  {submitError === "rate_limited" ? (
                    <>
                      <span className="en">
                        Too many applications right now. Please wait about an hour and try again, or email 
                      </span>
                      <span className="th" lang="th">
                        มีการส่งใบสมัครมากเกินไปในขณะนี้ กรุณารอประมาณ 1 ชั่วโมงแล้วลองใหม่ หรือส่งอีเมลไปที่ 
                      </span>
                      <a href="mailto:srichausiripong@gmail.com">srichausiripong@gmail.com</a>
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
                <button className="btn btn-accent" type="submit" disabled={!hydrated || isSubmitting}>
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
                  <span className="en">Siripong Srichau (srichausiripong@gmail.com) collects your answers and contact details to choose the three organisations for this round and contact them. A technical IP log is kept for up to one hour to prevent spam. Applications that are not picked will be deleted by 31 January 2027. You can ask to see or delete your data by emailing <a href="mailto:srichausiripong@gmail.com">srichausiripong@gmail.com</a>.</span>
                  <span className="th" lang="th">ศิริพงษ์ ศรีเชื้อ (srichausiripong@gmail.com) เก็บคำตอบและข้อมูลติดต่อเพื่อคัดเลือก 3 องค์กรในรอบนี้และติดต่อกลับ โดยเก็บบันทึก IP ทางเทคนิคไว้ไม่เกิน 1 ชั่วโมงเพื่อป้องกันสแปม ใบสมัครที่ไม่ได้รับเลือกจะถูกลบภายใน 31 มกราคม 2570 สามารถขอดูหรือลบข้อมูลได้โดยส่งอีเมลไปที่ <a href="mailto:srichausiripong@gmail.com">srichausiripong@gmail.com</a></span>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
