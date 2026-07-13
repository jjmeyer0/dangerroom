/**
 * Danger Room / Checkmat South Minneapolis — Trial Class Intake Handler
 *
 * SETUP:
 * 1. Go to https://sheets.google.com and create a new blank spreadsheet.
 *    Rename the first sheet tab to: Submissions
 *    Add this header row in row 1:
 *    Timestamp | First Name | Last Name | Email | Phone | Experience | Class Time | Notes
 *
 * 2. In that spreadsheet, go to Extensions > Apps Script.
 *    Delete any starter code and paste in this entire file.
 *
 * 3. OWNER_EMAIL below is already set to checkmatsouthminneapolis@gmail.com.
 *    Change it if bookings should go somewhere else.
 *
 * 4. Click Deploy > New deployment > select type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    Click Deploy, authorize the permissions it asks for.
 *
 * 5. Copy the Web App URL it gives you. Paste it into ENDPOINT_URL near
 *    the bottom of index.html, replacing PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE.
 *
 * 6. Test it: submit the form on your site and confirm a row appears in
 *    the sheet and you receive an email.
 */

const OWNER_EMAIL = "checkmatsouthminneapolis@gmail.com"; // <-- change if needed

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Submissions");
  sheet.appendRow([
    new Date(),
    data.firstName || "",
    data.lastName || "",
    data.email || "",
    data.phone || "",
    data.experience || "",
    data.classTime || "",
    data.notes || ""
  ]);

  const subject = `New Trial Class Request: ${data.firstName} ${data.lastName}`;
  const body =
    `New trial class booking from the website:\n\n` +
    `Name: ${data.firstName} ${data.lastName}\n` +
    `Email: ${data.email}\n` +
    `Phone: ${data.phone}\n` +
    `Experience: ${data.experience}\n` +
    `Requested class: ${data.classTime}\n` +
    `Notes: ${data.notes}\n`;

  MailApp.sendEmail(OWNER_EMAIL, subject, body);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
