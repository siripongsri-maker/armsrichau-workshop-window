import portfolioCss from "../portfolio.css?url";
import applyCss from "../apply.css?url";

const PRE_PAINT = `(function () {
  var d = document.documentElement;
  var lang = new URLSearchParams(location.search).get('lang');
  if (lang !== 'en' && lang !== 'th') { try { lang = localStorage.getItem('lang'); } catch (e) {} }
  d.dataset.lang = lang === 'th' ? 'th' : 'en';
  if (lang === 'th') d.lang = 'th';
  d.classList.add('js');
})();`;

/** Head for small utility pages (sign-in, account) styled like /apply. */
export function utilityHead(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anuphan:wght@400;500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap",
      },
      { rel: "stylesheet", href: portfolioCss },
      { rel: "stylesheet", href: applyCss },
    ],
    scripts: [{ children: PRE_PAINT }],
  };
}
