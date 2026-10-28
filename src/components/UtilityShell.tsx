import type { ReactNode } from "react";

export function T({ en, th }: { en: ReactNode; th: ReactNode }) {
  return (
    <>
      <span className="en">{en}</span>
      <span className="th">{th}</span>
    </>
  );
}

export function UtilityShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="apply-top">
        <div className="wrap apply-top-inner">
          <a className="apply-back" href="/">
            <T en="← Back to portfolio" th="← กลับหน้าพอร์ต" />
          </a>
        </div>
      </header>
      <main className="apply-main">
        <div className="wrap" style={{ maxWidth: 480 }}>{children}</div>
      </main>
    </>
  );
}
