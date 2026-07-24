# Access Terminal Puzzle

A static four-question puzzle with a hacker-style entry screen, locked navigation, image previews, hints, and a final gift download link.

## Edit the page

- Replace the placeholder images in `assets/photos/` with your own photos.
- Edit the intro screen in `index.html`.
- Edit the question page text in `question-1.html`, `question-2.html`, `question-3.html`, and `question-4.html`.
- Edit accepted quiz answers, default hints, specific wrong-answer hints, and the gift link in `script.js`.
- Put the real gift file in `gift/` and set `giftHref` to its filename.
- Each question page has an image preview, prompt text, answer field, submit button, and a locked action button.
- After each correct answer, the locked button changes to `Next page`. On Question 4, it changes to `Download`.

## Hosting

This can be hosted as-is on GitHub Pages or Vercel. It does not require a build step.

Note: because this is fully static, the answers and gift URL are visible in the browser source. For a sweet anniversary puzzle this is usually fine. For real secrecy, use a password-protected zip file or a small serverless/API backend.
