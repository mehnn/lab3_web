// server/server.js — Express сервер

const express   = require("express");
const path      = require("path");
const cors      = require("cors");
const { initDb } = require("./db");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ exposedHeaders: ["x-session-id"] }));

// In-memory сесії
const sessions = new Map();
app.use((req, res, next) => {
  let sid = req.headers["x-session-id"];
  if (!sid || !sessions.has(sid)) {
    sid = Math.random().toString(36).slice(2) + Date.now();
    sessions.set(sid, {});
  }
  req.session = sessions.get(sid);
  res.setHeader("x-session-id", sid);
  next();
});

// Статика з public/
app.use(express.static(path.join(__dirname, "..", "public")));

// Чекаємо ініціалізацію БД, потім підключаємо маршрути і стартуємо
initDb().then(() => {
  app.use("/api", require("./routes/auth"));
  app.use("/api/progress", require("./routes/progress"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });

  app.listen(PORT, () => {
    console.log(`CHIIIIKS running → http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("БД не запустилась:", err);
  process.exit(1);
});
