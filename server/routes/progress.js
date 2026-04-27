// server/routes/progress.js — прогрес (вивчені слова + квіз)

const express    = require("express");
const router     = express.Router();
const { get, all, run } = require("../db");

// Перевірка авторизації
router.use((req, res, next) => {
  if (!req.session.email) return res.status(401).json({ error: "Не авторизовано" });
  next();
});

// GET /api/progress
router.get("/", (req, res) => {
  const email    = req.session.email;
  const rows     = all("SELECT word_id FROM known_words WHERE email = ?", email);
  const known    = {};
  rows.forEach(r => { known[r.word_id] = true; });

  const stats = get("SELECT correct, total FROM quiz_stats WHERE email = ?", email)
    ?? { correct: 0, total: 0 };

  res.json({ known, quiz: stats });
});

// POST /api/progress/known
router.post("/known", (req, res) => {
  const email          = req.session.email;
  const { wordId, known } = req.body;
  if (!wordId) return res.status(400).json({ error: "wordId обов'язковий" });

  if (known) {
    run("INSERT OR IGNORE INTO known_words (email, word_id) VALUES (?, ?)", email, wordId);
  } else {
    run("DELETE FROM known_words WHERE email = ? AND word_id = ?", email, wordId);
  }
  res.json({ ok: true });
});

// POST /api/progress/quiz
router.post("/quiz", (req, res) => {
  const email     = req.session.email;
  const isCorrect = !!req.body.correct;
  const existing  = get("SELECT email FROM quiz_stats WHERE email = ?", email);

  if (existing) {
    run(
      "UPDATE quiz_stats SET correct = correct + ?, total = total + 1 WHERE email = ?",
      isCorrect ? 1 : 0, email
    );
  } else {
    run(
      "INSERT INTO quiz_stats (email, correct, total) VALUES (?, ?, 1)",
      email, isCorrect ? 1 : 0
    );
  }
  res.json({ ok: true });
});

// DELETE /api/progress
router.delete("/", (req, res) => {
  const email = req.session.email;
  run("DELETE FROM known_words WHERE email = ?", email);
  run("DELETE FROM quiz_stats  WHERE email = ?", email);
  res.json({ ok: true });
});

module.exports = router;
