# Armsrichau Workshop Window

I want to make my own portfolio website 

armsrichau

I've already finish it on claude

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dd5d0b5a-e9b8-4be0-b4da-4cbfc77a1d4f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Where the portfolio lives

| What | File |
| --- | --- |
| Page markup (EN + TH side by side) | `src/routes/index.tsx` |
| Styles and colour tokens | `src/portfolio.css` |
| Language switch, request dialog, open call, scroll motion | `src/lib/portfolio.ts` |
| Photos and screenshots | `public/img/` |

The November open call closes itself after the date in `data-deadline` on `#open-call`.
To send "Apply" to a form instead of email, put the form URL in `data-form` on the same element.
