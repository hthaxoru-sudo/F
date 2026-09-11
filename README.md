# BeeHouse | Official — Node.js Production Build

This build is designed to behave like a real website: the public UI renders immediately, API requests have a timeout, and the Node.js server is the authoritative source for CMS data.

## Recommended deployment

Run the whole folder from one Node.js server:

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## GitHub Pages warning

GitHub Pages can host the HTML/CSS/JS frontend, but it cannot run this Express server. If the frontend remains on GitHub Pages, deploy `server.js` to a Node.js host and set `window.BEEHOUSE_API_BASE` in `api-config.js` to that backend origin. Also set `FRONTEND_ORIGIN` on the backend to the exact GitHub Pages origin.

## Important behavior

- The loading screen has a hard limit and cannot spin forever.
- If the API is temporarily unavailable, the bundled `site-default.js` is used so the public page still opens.
- Browser `localStorage` is only a cache; it is not the authoritative CMS source.
- `/api/site` always returns JSON.
- Unknown `/api/*` routes return JSON instead of an HTML page.
- CMS writes go to `data/site.json` on the Node.js server.
