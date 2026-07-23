# Anniversary Page

A static anniversary page with four separate question pages and a final gift download link.

## Edit the page

- Replace the placeholder images in `assets/photos/` with your own photos.
- Edit the question page text in `index.html`, `question-2.html`, `question-3.html`, and `question-4.html`.
- Edit accepted quiz answers and the gift link in `script.js`.
- Put the real gift file in `gift/` and set `giftHref` to its filename.
- After each correct answer, a `Next page` button appears. On Question 4, the revealed button is `Download`.

## Hosting

This can be hosted as-is on GitHub Pages or Vercel. It does not require a build step.

Note: because this is fully static, the answers and gift URL are visible in the browser source. For a sweet anniversary puzzle this is usually fine. For real secrecy, use a password-protected zip file or a small serverless/API backend.
