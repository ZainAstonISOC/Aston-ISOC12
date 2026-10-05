# Putting astonisoc.com live

`astonisoc.com` was registered at GoDaddy on 2026-10-05. The code is ready; these steps are all
dashboard clicks. **Do them in this order** — the last step is the one that moves the site's
canonical URLs onto the domain, and it must only happen once the domain actually loads the site.

## 1. Add the domain in Vercel

Vercel → the **aston-isoc-12** project → **Settings → Domains** → add `astonisoc.com`.

- When Vercel offers to add `www.astonisoc.com` too, accept.
- Vercel marks one host as primary and redirects the other to it. **Currently `www.astonisoc.com` is
  primary** (`astonisoc.com` 308s to www). Everything below uses whichever host is primary.
- Vercel will now show the DNS records it needs. Keep this tab open.

## 2. Point GoDaddy at Vercel

GoDaddy → **My Products → astonisoc.com → DNS**.

- **Copy the exact values Vercel shows** — don't use values from a blog post; Vercel's dashboard is
  the source of truth. Typically that's an **A record** for `@` and a **CNAME** for `www`.
- GoDaddy pre-creates an `@` A record pointing at "Parked". **Edit that one** to Vercel's value
  rather than adding a second — two A records for `@` means some visitors get the parking page.
- If GoDaddy shows **Forwarding** set up for the domain, remove it.

## 3. Wait for "Valid Configuration"

Back on Vercel's Domains page, wait until `astonisoc.com` shows **Valid Configuration**. Usually
minutes, occasionally a few hours. Vercel issues the HTTPS certificate automatically.

Then open **https://astonisoc.com** and **https://www.astonisoc.com** yourself and confirm both
show the site.

## 4. Flip the switch — only after step 3 works

Vercel → **Settings → Environment Variables** → add:

| Name | Value | Environment |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.astonisoc.com` (the primary host, with `https://`) | Production |

Then **Deployments → latest → ⋯ → Redeploy**.

That one variable:

- moves canonical URLs, the sitemap, robots.txt and the structured data onto the domain;
- puts `astonisoc.com` on the link-preview card shown in WhatsApp, Instagram and iMessage;
- turns on a redirect so anyone with the old `aston-isoc-12.vercel.app` address lands on the same
  page at `www.astonisoc.com`. Preview deployments are not affected.

The code adds `https://` if it is left off and strips a trailing slash. A value that still isn't a
URL stops the build with an error naming the variable (the site stays on the last good deploy).

## 5. Check it worked

- Visit `https://aston-isoc-12.vercel.app/careers` — it should land on `https://www.astonisoc.com/careers`.
- `https://www.astonisoc.com/robots.txt` should end with `Sitemap: https://www.astonisoc.com/sitemap.xml`.
- Paste `https://astonisoc.com` into a WhatsApp chat — the gold-and-purple card should appear.
  (WhatsApp caches previews per link, so test with a link you haven't sent before.)

## 6. Afterwards (optional, recommended)

- **Google Search Console** → add `astonisoc.com` as a Domain property (GoDaddy can add the
  verification TXT record for you) → submit `https://www.astonisoc.com/sitemap.xml`.
- Update the link in the Instagram bio and the Linktree to `astonisoc.com`.
- The redirect in `next.config.ts` is a temporary (307) one on purpose. Once the domain has been
  stable for a few weeks, change `permanent: false` to `permanent: true`.

## If something goes wrong

Delete `NEXT_PUBLIC_SITE_URL` in Vercel and redeploy. Everything falls back to the vercel.app
address and the redirect switches itself off.
