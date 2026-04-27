// server/db.js — SQLite через sql.js (не потребує компілятора C++)

const initSqlJs = require("sql.js");
const fs        = require("fs");
const path      = require("path");

const DB_PATH = path.join(__dirname, "..", "chiiiiks.db");

let db; // глобальний екземпляр БД

// Завантажує існуючий файл або створює новий
async function initDb() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Створення таблиць
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      name     TEXT NOT NULL,
      email    TEXT NOT NULL UNIQUE,
      gender   TEXT,
      dob      TEXT,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS known_words (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      email   TEXT NOT NULL,
      word_id TEXT NOT NULL,
      UNIQUE(email, word_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS quiz_stats (
      email   TEXT PRIMARY KEY,
      correct INTEGER NOT NULL DEFAULT 0,
      total   INTEGER NOT NULL DEFAULT 0
    )
  `);

  persist();
  return db;
}

// Зберігає стан БД у файл після кожної зміни
function persist() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// Обгортки для зручного використання як better-sqlite3

function get(sql, ...params) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return row;
}

function all(sql, ...params) {
  const stmt   = db.prepare(sql);
  const rows   = [];
  stmt.bind(params);
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function run(sql, ...params) {
  db.run(sql, params);
  persist();
}

module.exports = { initDb, get, all, run };
