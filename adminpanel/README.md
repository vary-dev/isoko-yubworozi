# Isoko y'Ubworozi Admin Studio

Next.js administration application for books, articles, reusable media,
YouTube content, analytics and premium-book payment verification.

## Local development

```bash
npm ci
npm run dev
```

The application uses the production API at
`https://isoko-yubworozi.onrender.com/api`.

## Netlify deployment

The checked-in `netlify.toml` configures Netlify to build the Next.js app and
publish its `.next` output through Netlify's Next.js runtime. The production
site should use this directory as its project root.

## Vercel deployment

Create this as a separate Vercel project with these settings:

- Production branch: `codex`
- Root Directory: `adminpanel`
- Framework Preset: `Next.js`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: leave empty (do not use `dist`)

The checked-in `vercel.json` also declares the Next.js framework and commands.
Vercel must use the `adminpanel` directory as the project root for that file to
take effect.

After a successful production deployment, assign
`isoko-yubworozi-admin.vercel.app` to it under **Settings → Domains**.

## Production verification

Check all of these routes after deployment:

- `/` — admin welcome page
- `/login` — administrator authentication
- `/admin` — protected dashboard
- `/admin/books` — book management
- `/admin/articles` — editorial workspace
- `/admin/payments` — customer payment requests and access PINs

The backend must allow the deployed admin origin in its CORS configuration.
