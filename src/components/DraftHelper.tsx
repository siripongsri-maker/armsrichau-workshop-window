import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { suggestDraftRevision, type SuggestField, type SuggestResult } from "@/lib/draft-suggest.functions";

type Props = {
  field: SuggestField;
  text: string;
  lang: "en" | "th";
  onUse: (value: string) => void;
};

const FAIL: Record<string, [string, string]> = {
  invalid: ["Write at least a sentence first (10+ characters).", "กรุณาเขียนอย่างน้อยหนึ่งประโยคก่อน (10 ตัวอักษรขึ้นไป)"],
  rate_limited: ["You've used all suggestions for now. Please try again in about an hour.", "ใช้คำแนะนำครบจำนวนแล้ว กรุณาลองใหม่ในอีกประมาณหนึ่งชั่วโมง"],
  busy: ["Suggestions are busy right now. Please try again shortly.", "ระบบคำแนะนำกำลังทำงานหนัก กรุณาลองใหม่อีกครั้งในไม่ช้า"],
  error: ["Couldn't get a suggestion. Your text is safe — please try again.", "ขอคำแนะนำไม่สำเร็จ ข้อความเดิมยังอยู่ครบ กรุณาลองใหม่"],
};

export function DraftHelper({ field, text, lang, onUse }: Props) {
  const suggest = useServerFn(suggestDraftRevision);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SuggestResult | null>(null);
  const t = (en: string, th: string) => (lang === "th" ? th : en);

  async function ask() {
    if (text.trim().length < 10) {
      setResult({ ok: false, reason: "invalid" });
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      setResult(await suggest({ data: { field, text, lang } }));
    } catch {
      setResult({ ok: false, reason: "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="draft-helper">
      <button type="button" className="btn btn-line draft-helper-btn" onClick={ask} disabled={busy} aria-busy={busy}>
        {busy ? t("Thinking…", "กำลังคิด…") : t("✦ Suggest a clearer version", "✦ ขอคำแนะนำให้ชัดขึ้น")}
      </button>
      <div aria-live="polite">
        {result && !result.ok && <p className="f-hint">{t(...(FAIL[result.reason] ?? FAIL["error"]!))}</p>}
        {result?.ok && (
          <div className="draft-helper-card">
            <p className="draft-helper-label">{t("Suggested version", "ฉบับที่แนะนำ")}</p>
            <p className="draft-helper-text">{result.suggestion}</p>
            {result.notes.length > 0 && (
              <ul className="draft-helper-notes">
                {result.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            )}
            <div className="draft-helper-actions">
              <button type="button" className="btn btn-accent" onClick={() => { onUse(result.suggestion); setResult(null); }}>
                {t("Use this version", "ใช้ฉบับนี้")}
              </button>
              <button type="button" className="btn btn-line" onClick={() => setResult(null)}>
                {t("Keep mine", "ใช้ของเดิม")}
              </button>
            </div>
            <p className="f-hint">
              {t(
                "AI-generated suggestion — please check it says what you mean. Your draft is sent only to create it and isn't saved.",
                "คำแนะนำนี้สร้างโดย AI กรุณาตรวจว่าตรงกับที่ต้องการสื่อ ร่างคำตอบถูกส่งเพื่อสร้างคำแนะนำเท่านั้นและไม่ถูกบันทึก",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
