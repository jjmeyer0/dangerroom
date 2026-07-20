# Danger Room Website — Setup Guide

Three things to do: get a domain, connect the form + schedule, put the site online.
About 30–45 minutes total, no coding required beyond copy/paste.

## 1. Get a domain name

Register through any registrar — Cloudflare Registrar (sells at cost, no
markup) or Namecheap are both solid and cheap (~$10–15/year for a .com).

Ideas to check availability for (try these at the registrar):
- dangerroombjj.com
- dangerroommpls.com
- checkmatsouthmpls.com
- checkmatdangerroom.com
- trainatdangerroom.com

Pick whichever is available and easiest to say out loud / put on a gi patch.

## 2. Connect the Google Sheet backend

The site reads the weekly schedule from the Sheet and posts trial signups to it.
One Apps Script URL handles both.

### Create the spreadsheet

Create a new Google Sheet with three tabs:

**Submissions** — header row:
`Timestamp | First Name | Last Name | Email | Phone | Experience | Class Time | Notes`

**Schedule** — header row:
`Time | Mon | Tue | Wed | Thu | Fri | Sat`

Then paste in the current schedule (one row per time slot). Example:

| Time | Mon | Tue | Wed | Thu | Fri | Sat |
|---|---|---|---|---|---|---|
| 10:00–11:30 AM | Advanced (blue–black belt) | Pro-Training | Advanced (blue–black belt) | Pro-Training | Advanced (blue–black belt) | |
| 12:00–5:00 PM | Privates | Privates | Privates | Privates | Privates | *Wrestling / No-Gi Open Mat |
| 5:30–6:15 PM | Advanced Open Mat | Advanced Open Mat | Advanced Open Mat | Advanced Open Mat | Advanced Open Mat | |
| 6:15 PM–Close | *Beginner / All-Levels | *Beginner / All-Levels | *Beginner / All-Levels | *Beginner / All-Levels | *Beginner / All-Levels | |

- Leave a cell blank (or use `-`) for no class.
- Prefix a class with `*` to highlight it in red on the site.
- Use line breaks inside a cell for two-line labels.

**Trial Classes** — header row:
`Label`

Then one booking option per row (these populate the form dropdown):

| Label |
|---|
| Monday 6:15 PM — Beginner / All-Levels |
| Tuesday 6:15 PM — Beginner / All-Levels |
| Wednesday 6:15 PM — Beginner / All-Levels |
| Thursday 6:15 PM — Beginner / All-Levels |
| Friday 6:15 PM — Beginner / All-Levels |
| Saturday — Wrestling / No-Gi Open Mat |

### Deploy Apps Script

1. In the Sheet: **Extensions > Apps Script**. Paste in the contents of `apps-script.gs`.
2. Change `OWNER_EMAIL` at the top if needed.
3. **Deploy > New deployment > Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize when prompted.
5. Copy the Web App URL.
6. Open `index.html` and replace:
   ```
   const ENDPOINT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
7. Load the site — the schedule table and trial-class dropdown should fill in automatically.
8. Submit a test entry to confirm you get an email and a row in **Submissions**.

When you change the script later, use **Deploy > Manage deployments > Edit > New version**.

## 3. Put the site online

Three files need to travel together: `index.html`, `logo-checkmat.jpg`, and
`logo-dangerroom.png`. Keep them in the same folder — the page references
the logos by filename.

Easiest free option: **Netlify** or **Cloudflare Pages**.
1. Create a free account.
2. Drag-and-drop the whole folder (all three files) onto the dashboard
   (Netlify has a literal "drag and drop to deploy" box).
3. In the site's settings, add your custom domain from step 1 and follow
   the DNS instructions it gives you (usually just updating nameservers or
   adding a couple of DNS records at your registrar).

That's it — domain, form, schedule, and hosting all connected.

## SEO checklist

When you connect a custom domain, search `index.html`, `robots.txt`, and
`sitemap.xml` for `jjmeyer0.github.io/dangerroom` and replace with your live
URL (include `https://`, use a trailing slash on the homepage URL in
canonical/og tags).

After the site is live:

1. **Google Search Console** — add your domain and submit `sitemap.xml`.
2. **Google Business Profile** — claim or create a listing for the gym; link
   to this site and match the name, address, and phone exactly.
3. **Keep NAP consistent** — name, address, and phone should match everywhere
   (site footer, Google, Instagram, Facebook).

The page already includes a meta description, Open Graph tags, JSON-LD local
business schema, semantic headings, and crawl files (`robots.txt`,
`sitemap.xml`).

## Updating the schedule later

Edit the **Schedule** or **Trial Classes** tab in Google Sheets. Changes show
on the site the next time someone loads the page — no need to redeploy the
website.
