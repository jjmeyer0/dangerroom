/**
 * Danger Room / Checkmat South Minneapolis — Site Backend
 *
 * SETUP:
 * 1. Go to https://sheets.google.com and create a new blank spreadsheet.
 *
 * 2. Create three tabs:
 *
 *    Submissions — header row:
 *    Timestamp | First Name | Last Name | Email | Phone | Experience | Class Time | Notes
 *
 *    Schedule — header row:
 *    Time | Mon | Tue | Wed | Thu | Fri | Sat
 *    Then add one row per time slot. Leave a cell blank (or use "-") for no class.
 *    Prefix a class with * to highlight it on the site (e.g. *Beginner / All-Levels).
 *    Use line breaks inside a cell for two-line labels.
 *
 *    Trial Classes — header row:
 *    Label
 *    Then one trial-booking option per row, e.g.:
 *    Monday 6:15 PM — Beginner / All-Levels
 *
 * 3. In that spreadsheet, go to Extensions > Apps Script.
 *    Delete any starter code and paste in this entire file.
 *
 * 4. OWNER_EMAIL below is already set to checkmatsouthminneapolis@gmail.com.
 *    Change it if bookings should go somewhere else.
 *
 * 5. Click Deploy > New deployment > select type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    Click Deploy, authorize the permissions it asks for.
 *
 * 6. Copy the Web App URL it gives you. Paste it into ENDPOINT_URL in index.html.
 *
 * 7. Test it: load the site (schedule should appear) and submit the form
 *    (row + email should arrive).
 *
 * When you change this script, use Deploy > Manage deployments > Edit > New version.
 */

const OWNER_EMAIL = "checkmatsouthminneapolis@gmail.com"; // <-- change if needed

function doGet() {
  return jsonResponse({
    schedule: readSchedule(),
    trialClasses: readTrialClasses()
  });
}

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

  return jsonResponse({ status: "ok" });
}

function readSchedule() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Schedule");
  if (!sheet || sheet.getLastRow() < 2) {
    return { headers: [], rows: [] };
  }

  const colCount = Math.min(sheet.getLastColumn(), 7);
  const values = sheet.getRange(1, 1, sheet.getLastRow(), colCount).getValues();
  const headers = values[0].slice(1).map(normalizeHeader);
  const rows = values.slice(1).map(function (row) {
    const time = String(row[0] || "").trim();
    if (!time) return null;
    const days = row.slice(1, 7).map(parseScheduleCell);
    while (days.length < 6) days.push(parseScheduleCell(""));
    return { time: time, days: days };
  }).filter(Boolean);

  return { headers: headers, rows: rows };
}

function readTrialClasses() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Trial Classes");
  if (!sheet || sheet.getLastRow() < 2) return [];

  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 1)
    .getValues()
    .map(function (row) { return String(row[0] || "").trim(); })
    .filter(Boolean);
}

function parseScheduleCell(cell) {
  const raw = String(cell || "").trim();
  if (!raw || raw === "-" || raw === "—") {
    return { text: "", highlight: false };
  }

  const highlight = raw.charAt(0) === "*";
  return {
    text: highlight ? raw.slice(1).trim() : raw,
    highlight: highlight
  };
}

function normalizeHeader(cell) {
  return String(cell || "").trim();
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
