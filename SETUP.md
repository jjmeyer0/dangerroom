# Danger Room Website — Setup Guide

Three things to do: get a domain, connect the form, put the site online.
About 30–45 minutes total, no coding required beyond copy/paste.

## 1. Get a domain name

Register through any registrar — Cloudflare Registrar (sells at cost, no
markup) or Namecheap are both solid and cheap (~$10–15/year for a .com).

Ideas to check availability for for (I can't check live availability myself,
so try these at the registrar):
- dangerroombjj.com
- dangerroommpls.com
- checkmatsouthmpls.com
- checkmatdangerroom.com
- trainatdangerroom.com

Pick whichever is available and easiest to say out loud / put on a gi patch.

## 2. Connect the intake form (email + Google Sheet)

The form is wired to hit one URL that both emails you and logs a row to a
spreadsheet — no paid tools needed.

1. Create a new Google Sheet, name the tab `Submissions`, add header row:
   `Timestamp | First Name | Last Name | Email | Phone | Experience | Class Time | Notes`
2. In the Sheet: Extensions > Apps Script. Paste in the contents of
   `apps-script.gs` (included alongside this file).
3. Change `OWNER_EMAIL` at the top to your real email.
4. Deploy > New deployment > Web app > Execute as **Me**, Who has access
   **Anyone**. Authorize when prompted.
5. Copy the Web App URL you're given.
6. Open `index.html`, find this line near the bottom:
   ```
   const ENDPOINT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
   Replace the placeholder with the URL you copied.
7. Submit a test entry on the live site to confirm you get an email and a
   row lands in the Sheet.

Full step-by-step is also commented at the top of `apps-script.gs`.

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

That's it — domain, form, and hosting all connected.

## Notes

- The real weekly schedule is already built in, pulled from your schedule
  graphic. If it changes, the table is in `<section id="schedule">` and the
  dropdown options are in `<select id="classtime">` — both in `index.html`.
- Only the Beginner/All-Levels and Saturday open-mat slots are offered as
  trial options, since Advanced and Pro-Training are belt-restricted.
  Adjust the `<option>` list if you'd rather offer something else.
