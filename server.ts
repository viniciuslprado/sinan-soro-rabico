import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("sinan.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT NOT NULL,
    notification_date TEXT NOT NULL,
    attendance_date TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

function computeStatus(data: any): string {
  const indicacaoSoro = data?.indicacaoSoro;
  const soroAplicado = !!data?.soroAplicado;
  if (indicacaoSoro === "1" && soroAplicado) return "soro_done";
  if (indicacaoSoro === "1" && !soroAplicado) return "soro_pending";
  return "pending";
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/notifications", (req, res) => {
    const rows = db.prepare("SELECT * FROM notifications ORDER BY created_at DESC").all();
    res.json(rows.map(row => ({
      ...row,
      data: JSON.parse(row.data as string)
    })));
  });

  app.get("/api/notifications/:id", (req, res) => {
    const row = db.prepare("SELECT * FROM notifications WHERE id = ?").get(req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json({
      ...row,
      data: JSON.parse(row.data as string)
    });
  });

  app.post("/api/notifications", (req, res) => {
    const { patient_name, notification_date, attendance_date, data } = req.body;
    const status = computeStatus(data);
    const info = db.prepare(
      "INSERT INTO notifications (patient_name, notification_date, attendance_date, status, data) VALUES (?, ?, ?, ?, ?)"
    ).run(patient_name, notification_date, attendance_date, status, JSON.stringify(data));
    res.status(201).json({ id: info.lastInsertRowid });
  });

  app.put("/api/notifications/:id", (req, res) => {
    const { patient_name, notification_date, attendance_date, data } = req.body;
    const status = computeStatus(data);
    db.prepare(
      "UPDATE notifications SET patient_name = ?, notification_date = ?, attendance_date = ?, status = ?, data = ? WHERE id = ?"
    ).run(patient_name, notification_date, attendance_date, status, JSON.stringify(data), req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/notifications/:id", (req, res) => {
    db.prepare("DELETE FROM notifications WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
