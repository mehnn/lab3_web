// vue/App.js — кореневий Vue компонент (SPA роутинг через стан)

const App = {
  name: "App",

  components: { LoginPage, StudyPage, QuizPage, ProfilePage },

  data() {
    return {
      user:    null,       // поточний авторизований юзер
      page:    "study",    // 'study' | 'quiz' | 'profile' | 'about'
      loading: true,       // перевірка сесії при старті
    };
  },

  async created() {
    // Перевіряємо чи є активна сесія на сервері
    try {
      this.user = await apiMe();
    } catch {
      this.user = null;
    } finally {
      this.loading = false;
    }
  },

  methods: {
    onLoggedIn(user) { this.user = user; this.page = "study"; },
    onLogout()       { this.user = null; },
    goTo(p)          { this.page = p; },
  },

  template: `
    <div>
      <!-- Навігація -->
      <nav class="navbar navbar-expand-lg sticky-top">
        <div class="container">
          <a class="navbar-brand brand-wrap" href="#">
            <img class="brand-logo-img" src="assets/logo.png" alt="CHIIIIKS logo" onerror="this.style.display='none'">
            <span class="brand-text">CHIIIIKS</span>
          </a>

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div id="nav" class="collapse navbar-collapse" v-if="user">
            <ul class="navbar-nav ms-auto gap-lg-2">
              <li class="nav-item">
                <a class="nav-link" :class="{ active: page==='study' }" href="#" @click.prevent="goTo('study')">📚 Вивчення</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: page==='quiz' }" href="#" @click.prevent="goTo('quiz')">🧠 Вікторина</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: page==='profile' }" href="#" @click.prevent="goTo('profile')">👤 Профіль</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: page==='about' }" href="#" @click.prevent="goTo('about')">Про додаток</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Завантаження -->
      <div v-if="loading" class="container my-5 text-center small-muted">
        Завантаження...
      </div>

      <!-- Не авторизований — показуємо форму входу -->
      <div v-else-if="!user">
        <LoginPage @logged-in="onLoggedIn" />
      </div>

      <!-- Авторизований — SPA навігація -->
      <div v-else class="container my-5">
        <!-- Заголовок сторінки -->
        <div class="d-flex justify-content-between align-items-end gap-3 mb-4" v-if="page !== 'about'">
          <div>
            <h1 class="h3 fw-bold mb-1">
              <span v-if="page==='study'">Словник CHIIIIKS 🍌</span>
              <span v-if="page==='quiz'">Вікторина 🧠</span>
              <span v-if="page==='profile'">Профіль 👤</span>
            </h1>
            <div class="small-muted" v-if="page==='study'">Обери рівень + тему → вчи слова.</div>
            <div class="small-muted" v-if="page==='quiz'">Перевір свої знання.</div>
          </div>
        </div>

        <StudyPage   v-if="page==='study'"   />
        <QuizPage    v-if="page==='quiz'"    />
        <ProfilePage v-if="page==='profile'" :user="user" @logout="onLogout" />

        <!-- Про додаток -->
        <div v-if="page==='about'" class="row g-4 align-items-center">
          <div class="col-lg-5">
            <div class="glass p-4 text-center">
              <img src="assets/logo.png" alt="CHIIIIKS logo" style="width:140px;height:140px;object-fit:contain" onerror="this.style.display='none'">
              <div class="fw-bold fs-4 mt-2">CHIIIIKS</div>
              <div class="small-muted">Vue 3 • Express • SQLite • Axios</div>
            </div>
          </div>
          <div class="col-lg-7">
            <div class="glass p-4 p-md-5">
              <h1 class="h3 fw-bold mb-2">Про додаток</h1>
              <p class="small-muted mb-0">
                CHIIIIKS — навчальний веб-додаток для вивчення англійських слів.
                Рівні A1/A2/B1, теми, режим вивчення карток і вікторина.
                Клієнт побудований на <b>Vue 3</b>, сервер на <b>Express + SQLite</b>,
                взаємодія через <b>Axios</b>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Футер -->
      <footer class="mt-5 py-4">
        <div class="container d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <div class="small-muted">© 2026 CHIIIIKS</div>
          <div class="small-muted">Vue 3 • Express • SQLite • Axios</div>
        </div>
      </footer>
    </div>
  `,
};
