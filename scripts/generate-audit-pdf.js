const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generatePDF() {
  const doc = new PDFDocument({ bufferPages: true, margin: 50, size: "A4" });
  const outputPath = path.join(__dirname, "../public/Forex_Weekly_Technical_Audit_Report.pdf");

  // Ensure public directory exists
  const publicDir = path.dirname(outputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Styling helper constants
  const primaryColor = "#B91C1C"; // Brand Red
  const darkColor = "#111827";    // Dark Gray/Black
  const grayColor = "#4B5563";    // Body Gray

  // Header Banner
  doc.rect(0, 0, 595.28, 75).fill(primaryColor);
  doc
    .fillColor("#FFFFFF")
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("FOREX WEEKLY CMS", 50, 20);

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Comprehensive Technical Audit & Architectural Review Report", 50, 44);

  doc.moveDown(3);

  // Metadata block
  doc.fillColor(darkColor).fontSize(8.5).font("Helvetica-Bold").text("DATE:", 50, 90);
  doc.font("Helvetica").text("July 21, 2026", 85, 90);
  doc.font("Helvetica-Bold").text("AUTHOR:", 190, 90);
  doc.font("Helvetica").text("Engineering Architecture Team", 240, 90);
  doc.font("Helvetica-Bold").text("SCOPE:", 410, 90);
  doc.font("Helvetica").text("Full System Review", 450, 90);

  doc.moveTo(50, 108).lineTo(545, 108).strokeColor("#E5E7EB").lineWidth(1).stroke();

  let currentY = 120;

  // Function to add section headers
  function addSectionHeader(title) {
    if (currentY > 700) {
      doc.addPage();
      currentY = 50;
    }
    doc.fillColor(primaryColor).fontSize(12).font("Helvetica-Bold").text(title, 50, currentY);
    currentY += 16;
    doc.moveTo(50, currentY).lineTo(545, currentY).strokeColor(primaryColor).lineWidth(1).stroke();
    currentY += 10;
  }

  // Function to add subheaders and body
  function addTopic(subtitle, body) {
    if (currentY > 680) {
      doc.addPage();
      currentY = 50;
    }
    doc.fillColor(darkColor).fontSize(10).font("Helvetica-Bold").text(subtitle, 50, currentY);
    currentY += 14;
    doc.fillColor(grayColor).fontSize(8.5).font("Helvetica").text(body, 50, currentY, { width: 495, align: "justify", lineGap: 2 });
    currentY = doc.y + 10;
  }

  // --- Section 1 ---
  addSectionHeader("1. Current Technical Issues & Discrepancies");

  addTopic(
    "A. Acting Supervisor Role UI Mismatch",
    "The backend permission validator dynamically escalates an EMPLOYEE role to SUPERVISOR during active acting supervisor date windows. However, the profile API (/api/users/me) returns the static database role. As a result, the frontend UI continues to render Employee layout views—hiding supervisor approval buttons—even though API requests are authorized on the backend."
  );

  addTopic(
    "B. Article Schema vs. Workspace Model Mismatch",
    "The Article database table records a department string column but lacks a workspace foreign key. Workspace filtering currently relies on matching workspace names to department names, which breaks if a workspace spans multiple departments or uses different naming conventions."
  );

  addTopic(
    "C. In-Memory RSS Ticker Cache",
    "The breaking news ticker uses in-memory JavaScript variables for caching Yahoo Finance RSS feeds. In multi-worker or serverless environments, in-memory variables are lost on cold starts and not shared across server instances."
  );

  // --- Section 2 ---
  addSectionHeader("2. Loose Ends & Non-Functional / Partial Features");

  addTopic(
    "A. Lack of UI for Department & Workspace Management",
    "Departments and Workspaces exist in the database schema but lack an Admin UI screen to create, rename, or delete them dynamically. They currently rely on initial database seeding."
  );

  addTopic(
    "B. Local File Uploads (/public/uploads)",
    "Uploaded cover images are saved directly to local disk. On serverless/cloud platforms, local disk storage is ephemeral and uploaded files will be lost on container restarts."
  );

  addTopic(
    "C. Real-Time Chat & Notifications (Polling vs WebSockets)",
    "DMs, Group chats, and Notifications are functional in the database but rely on manual refreshes or periodic polling rather than WebSocket/SSE real-time push streams."
  );

  addTopic(
    "D. Automated Email Delivery",
    "No SMTP email service (SendGrid, Resend) is connected. Temporary passwords and invitation tokens cannot be dispatched directly to user email addresses."
  );

  // --- Section 3 ---
  addSectionHeader("3. Potential Production Risks & Future Challenges");

  addTopic(
    "A. SQLite Database Concurrency",
    "SQLite (dev.db) locks the database file during write operations. Under concurrent multi-user write operations, it will throw SQLITE_BUSY lock errors. A migration to PostgreSQL or MySQL is required for production."
  );

  addTopic(
    "B. Authentication Cookie Security",
    "Cookies are currently configured with secure: false to permit testing over local Wi-Fi HTTP IP addresses. Before deploying to an HTTPS production domain, set secure: true and sameSite: 'strict'."
  );

  addTopic(
    "C. Stringified JSON Columns in Chat",
    "Chat read receipts store usernames as stringified JSON arrays. As chat volume increases, parsing stringified JSON within database queries will degrade performance."
  );

  // --- Section 4 ---
  addSectionHeader("4. Development Style & Workflow Insights");

  addTopic(
    "A. Upfront Architecture vs. Iterative Refactoring",
    "Early phases focused on visual features before strictly isolating the Control Room layout shell from the public storefront. Establishing explicit route groups upfront avoids major layout refactoring later."
  );

  addTopic(
    "B. Database Schema Alignment Before UI Construction",
    "Discrepancies (like storing display names instead of username handles) occurred when UI forms were built before locking down schema relationships. Defining a strict data model specification upfront eliminates field mismatches."
  );

  addTopic(
    "C. Component Decomposition",
    "Large dashboard files managing multiple tabs in one file degrade maintainability. Splitting dashboards into modular domain components (e.g. UserDirectoryPanel, TickerPanel) improves testability and code health."
  );

  // Footer on all pages
  const totalPages = doc.bufferedPageRange().count;
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(7.5)
      .fillColor("#9CA3AF")
      .text(`Forex Weekly CMS Architecture Review Document | Page ${i + 1} of ${totalPages}`, 50, 785, { align: "center" });
  }

  doc.end();

  stream.on("finish", () => {
    console.log(`[PDF SUCCESS] Report generated at: ${outputPath}`);
  });
}

generatePDF();
