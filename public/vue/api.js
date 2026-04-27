// vue/api.js — Axios клієнт для всіх запитів до сервера

// Зберігаємо sessionId між запитами
let _sid = localStorage.getItem("sid") || null;

const http = axios.create({ baseURL: "/api" });

// Додаємо x-session-id до кожного запиту
http.interceptors.request.use(cfg => {
  if (_sid) cfg.headers["x-session-id"] = _sid;
  return cfg;
});

// Зберігаємо новий sid з відповіді сервера
http.interceptors.response.use(res => {
  const sid = res.headers["x-session-id"];
  if (sid && sid !== _sid) {
    _sid = sid;
    localStorage.setItem("sid", sid);
  }
  return res;
});

// --- Auth ---
const apiRegister = (data)          => http.post("/register", data);
const apiLogin    = (data)          => http.post("/login", data);
const apiLogout   = ()              => http.post("/logout").then(() => { localStorage.removeItem("sid"); _sid = null; });
const apiMe       = ()              => http.get("/me").then(r => r.data.user);

// --- Progress ---
const apiGetProgress   = ()              => http.get("/progress").then(r => r.data);
const apiSetKnown      = (wordId, known) => http.post("/progress/known", { wordId, known });
const apiRecordQuiz    = (correct)       => http.post("/progress/quiz", { correct });
const apiResetProgress = ()              => http.delete("/progress");
