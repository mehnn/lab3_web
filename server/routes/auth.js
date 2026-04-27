// server/routes/auth.js — реєстрація, вхід, вихід, поточний юзер

const express    = require("express");
const router     = express.Router();
const { get, all, run } = require("../db");

// POST /api/register
router.post("/register", (req, res) => {
  const { name, email, gender, dob, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Заповни ім'я, email та пароль" });

  if (get("SELECT id FROM users WHERE email = ?", email))
    return res.status(409).json({ error: "Користувач з таким email вже існує" });

  run(
    "INSERT INTO users (name, email, gender, dob, password) VALUES (?, ?, ?, ?, ?)",
    name, email, gender ?? "", dob ?? "", password
  );
  res.json({ ok: true });
});

// POST /api/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = get(
    "SELECT id, name, email, gender, dob FROM users WHERE email = ? AND password = ?",
    email, password
  );
  if (!user) return res.status(401).json({ error: "Невірний email або пароль" });

  req.session.email = user.email;
  res.json({ ok: true, user });
});

// POST /api/logout
router.post("/logout", (req, res) => {
  req.session.email = null;
  res.json({ ok: true });
});

// GET /api/me
router.get("/me", (req, res) => {
  if (!req.session.email)
    return res.status(401).json({ error: "Не авторизовано" });

  const user = get(
    "SELECT id, name, email, gender, dob FROM users WHERE email = ?",
    req.session.email
  );
  if (!user) return res.status(401).json({ error: "Користувача не знайдено" });
  res.json({ user });
});

module.exports = router;
