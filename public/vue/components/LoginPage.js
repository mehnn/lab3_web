// vue/components/LoginPage.js — сторінка входу та реєстрації

const LoginPage = {
  name: "LoginPage",
  emits: ["logged-in"],

  data() {
    return {
      mode: "login",        // 'login' | 'register'
      error: "",
      loading: false,
      form: {
        name: "", email: "", gender: "Жіноча",
        dob: "", password: "",
      },
    };
  },

  methods: {
    setMode(m) { this.mode = m; this.error = ""; },

    async onLogin() {
      this.error = ""; this.loading = true;
      try {
        const res = await apiLogin({ email: this.form.email, password: this.form.password });
        this.$emit("logged-in", res.data.user);
      } catch (e) {
        this.error = e.response?.data?.error ?? "Помилка входу";
      } finally { this.loading = false; }
    },

    async onRegister() {
      this.error = ""; this.loading = true;
      try {
        await apiRegister({
          name: this.form.name, email: this.form.email,
          gender: this.form.gender, dob: this.form.dob, password: this.form.password,
        });
        const res = await apiLogin({ email: this.form.email, password: this.form.password });
        this.$emit("logged-in", res.data.user);
      } catch (e) {
        this.error = e.response?.data?.error ?? "Помилка реєстрації";
      } finally { this.loading = false; }
    },
  },

  template: `
    <div class="container my-5">
      <div class="row g-4 align-items-center">
        <div class="col-lg-7">
          <span class="badge badge-soft rounded-pill px-3 py-2">White • Gray • Yellow/Green accents</span>
          <h1 class="mt-3 display-6 fw-bold">CHIIIIKS 🍌</h1>
          <p class="lead small-muted mb-0">
            Обери режим: <b>Увійти</b> або <b>Зареєструватися</b>.
          </p>
        </div>

        <div class="col-lg-5">
          <div class="glass p-4">
            <div class="d-flex gap-2 flex-wrap mb-3">
              <button class="btn" :class="mode==='login' ? 'btn-brand' : 'btn-soft'" @click="setMode('login')">Вхід</button>
              <button class="btn" :class="mode==='register' ? 'btn-brand' : 'btn-soft'" @click="setMode('register')">Реєстрація</button>
            </div>

            <div v-if="error" class="alert alert-danger py-2 small mb-3">{{ error }}</div>

            <!-- Форма входу -->
            <div v-if="mode === 'login'">
              <h2 class="h5 fw-bold mb-1">Вхід</h2>
              <p class="small-muted mb-3">Увійди, щоб перейти до словника.</p>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control" placeholder="name@example.com">
              </div>
              <div class="mb-3">
                <label class="form-label">Пароль</label>
                <input v-model="form.password" type="password" class="form-control" placeholder="••••••••">
              </div>
              <button class="btn btn-accent w-100" :disabled="loading" @click="onLogin">
                {{ loading ? 'Вхід...' : 'Увійти' }}
              </button>
            </div>

            <!-- Форма реєстрації -->
            <div v-if="mode === 'register'">
              <h2 class="h5 fw-bold mb-1">Реєстрація</h2>
              <p class="small-muted mb-3">Після реєстрації ти одразу зайдеш в акаунт.</p>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Ім'я</label>
                  <input v-model="form.name" class="form-control" placeholder="Напр. Марія">
                </div>
                <div class="col-12">
                  <label class="form-label">Email</label>
                  <input v-model="form.email" type="email" class="form-control" placeholder="name@example.com">
                </div>
                <div class="col-12">
                  <label class="form-label d-block">Стать</label>
                  <div class="d-flex gap-3 flex-wrap">
                    <div class="form-check" v-for="g in ['Жіноча','Чоловіча','Інше']" :key="g">
                      <input class="form-check-input" type="radio" :value="g" v-model="form.gender" :id="'g_'+g">
                      <label class="form-check-label" :for="'g_'+g">{{ g }}</label>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <label class="form-label">Дата народження</label>
                  <input v-model="form.dob" type="date" class="form-control">
                </div>
                <div class="col-12">
                  <label class="form-label">Пароль</label>
                  <input v-model="form.password" type="password" class="form-control" placeholder="••••••••">
                </div>
                <div class="col-12">
                  <button class="btn btn-brand w-100" :disabled="loading" @click="onRegister">
                    {{ loading ? 'Реєстрація...' : 'Зареєструватися' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
