# StageConnect ISET

Premium internship management platform prototype — built with HTML5, CSS3, Vanilla JavaScript, localStorage, Chart.js, Font Awesome, and Google Fonts (Poppins).

---

## Modules included

| Module | Description |
|---|---|
| Landing page | Animated counters, testimonials, student voices, FAQ, and CTA sections |
| Student dashboard | Profile simulation, favorites, CV filename storage, notifications preview |
| Company dashboard | Internship publishing form and applicants table |
| Internship search | Live filters by department, level, duration, and keyword |
| Reviews & Opinions | Star reviews (localStorage) + detailed student opinions (Google Sheets) |
| Notification center | Unread badges and mark-as-read actions |
| Simulated chat | Typing effect and auto-replies per contact |
| Admin dashboards | Analytics tables and Chart.js graphs |
| PDF reports | Print-ready internship report examples for all departments |

---

## How to open

This project is fully static — no Node.js or backend required.

```
Open index.html in any browser.
```

All demo data is stored in the browser via `localStorage` (favorites, notifications, profile, reviews, custom internships, applications, chat messages, CV filename).

---

## Student Opinion Feature (Google Sheets)

### What it does

When a student fills in the opinion form on `reviews/add_review.html` (Step 1), their response is sent directly to a Google Sheets spreadsheet via a Google Apps Script Web App.

The opinions are also displayed publicly:
- **Home page** (`index.html`) → "Student Voices" section shows 3 recent cards
- **Reviews page** (`reviews/list.html`) → Section A shows all opinions with pros, cons, and recommendation badges

### User journey

```
index.html
  └─ "Student Voices" section
       ├─ "Share my opinion" button  ──→  reviews/add_review.html
       └─ "See all opinions" button  ──→  reviews/list.html

reviews/add_review.html
  ├─ STEP 1 — Detailed opinion → sent to Google Sheets
  └─ STEP 2 — Star review      → saved locally, visible to all

reviews/list.html
  ├─ Section A — Student opinions (cards with pros / cons / recommend)
  └─ Section B — Star reviews (classic ratings)
```

---

## Google Sheets Setup (required once)

### Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Rename the bottom tab to exactly: **`Opinions`**
3. In **row 1**, write these headers in columns A to J:

```
A            B              C           D       E       F            G               H     I     J
timestamp    studentName    department  level   email   societyName  overallOpinion  pros  cons  recommend
```

4. Copy the **Spreadsheet ID** from the URL:
```
https://docs.google.com/spreadsheets/d/  YOUR_SPREADSHEET_ID_HERE  /edit
```

---

### Step 2 — Create the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**.
2. Delete all existing code and paste this:

```javascript
var SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE"; // ← replace this
var SHEET_NAME     = "Opinions";

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID)
                              .getSheetByName(SHEET_NAME);
    var p = e.parameter;
    sheet.appendRow([
      p.timestamp      || new Date().toLocaleString(),
      p.studentName    || "",
      p.department     || "",
      p.level          || "",
      p.email          || "",
      p.societyName    || "",
      p.overallOpinion || "",
      p.pros           || "",
      p.cons           || "",
      p.recommend      || ""
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "StageConnect opinion endpoint is live." }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Replace `PASTE_YOUR_SPREADSHEET_ID_HERE` with your real ID.
4. Save the project (Ctrl+S) — name it `StageConnect Opinions`.

---

### Step 3 — Deploy as Web App

1. Click **Deploy → New deployment**.
2. Click the ⚙️ gear icon → select **Web App**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** and authorize when prompted.
5. Copy the **Web App URL** (looks like):
```
https://script.google.com/macros/s/AKfycb.../exec
```

---

### Step 4 — Paste the URL in opinion.js

Open `assets/js/opinion.js` and find line:

```javascript
var GOOGLE_SCRIPT_URL = "...";
```

The URL is already configured:
```
https://script.google.com/macros/s/AKfycbynx1NYxxeKaAsrj8gPahdn8G2xOk4a6cJG8KowM7oYmMsiFC1n8iWiXXQOA93aozdnVA/exec
```

If you redeploy or change scripts, replace this URL with your new one.

---

### Step 5 — Test

1. Open `reviews/add_review.html`
2. Fill in all required fields (marked `*`) in **Step 1**
3. Click **"Envoyer mon opinion à Google Sheets"**
4. A green banner should appear: *"Votre opinion a été enregistrée dans Google Sheets !"*
5. Check your Google Sheet — a new row should appear instantly

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Red banner "Impossible d'atteindre Google Sheets" | Wrong URL | Check `GOOGLE_SCRIPT_URL` in `opinion.js` |
| Nothing appears in the sheet | Wrong SPREADSHEET_ID or sheet name | Verify the ID and that the tab is named exactly `Opinions` |
| CORS error in console | Wrong deployment settings | Redeploy with **"Anyone"** access |
| Script asks for permissions | First run | Click "Authorize" → "Advanced" → "Go to StageConnect…" |
| Columns misaligned in sheet | Headers misspelled | Copy headers exactly from Step 1 above |

---

## Editable areas

| What to change | Where |
|---|---|
| Internship seed data | `assets/js/script.js` → `initialInternships` |
| Department & level config | `assets/js/script.js` → `departmentConfig`, `levelConfig` |
| Seeded demo opinions | `assets/js/opinion.js` → `INITIAL_OPINIONS` |
| Google Sheets URL | `assets/js/opinion.js` → `GOOGLE_SCRIPT_URL` |
| Report examples | `pdf/example_report.html` |
| Company text blocks | `company/dashboard.html`, `company/add_stage.html` |

---

## Privacy

- The **email field is optional** — students can stay anonymous.
- Data is sent over HTTPS directly to Google Sheets.
- Only the spreadsheet owner can see responses.
- A local copy is also saved in `localStorage` under `stageconnect-student-opinions` as a backup.

---

*StageConnect ISET · May 2026*
