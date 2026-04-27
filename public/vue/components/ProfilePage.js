// vue/components/ProfilePage.js — профіль користувача

const ProfilePage = {
  name: "ProfilePage",
  props: ["user"],
  emits: ["logout"],

  data() {
    return {
      known:      0,
      total:      allWordsCount(),
      qCorrect:   0,
      qTotal:     0,
      loading:    true,
    };
  },

  computed: {
    pct() { return this.total ? Math.round((this.known / this.total) * 100) : 0; },
    acc() { return this.qTotal ? Math.round((this.qCorrect / this.qTotal) * 100) : 0; },
  },

  async created() {
    const prog    = await apiGetProgress();
    this.known    = Object.keys(prog.known ?? {}).length;
    this.qCorrect = prog.quiz?.correct ?? 0;
    this.qTotal   = prog.quiz?.total   ?? 0;
    this.loading  = false;
  },

  methods: {
    async onLogout() {
      await apiLogout();
      this.$emit("logout");
    },
  },

  template: `
    <div class="glass p-4 p-md-5">
      <div class="d-flex justify-content-between align-items-center gap-2 flex-wrap">
        <div>
          <h1 class="h3 fw-bold mb-1">Профіль</h1>
          <p class="small-muted mb-0">Дані та прогрес зберігаються в базі даних SQLite.</p>
        </div>
        <button class="btn btn-soft" @click="onLogout">Вийти</button>
      </div>

      <hr class="my-4">

      <div v-if="loading" class="text-center py-4 small-muted">Завантаження...</div>

      <div v-else class="row g-3">
        <!-- Дані користувача -->
        <div class="col-lg-6">
          <div class="table-responsive">
            <table class="table table-bordered align-middle mb-0">
              <tbody>
                <tr><th style="width:35%">Ім'я</th><td>{{ user.name }}</td></tr>
                <tr><th>Email</th><td>{{ user.email }}</td></tr>
                <tr><th>Стать</th><td>{{ user.gender || '—' }}</td></tr>
                <tr><th>Дата народження</th><td>{{ user.dob || '—' }}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- KPI -->
        <div class="col-lg-6">
          <div class="row g-3">
            <div class="col-6">
              <div class="kpi">
                <div class="small-muted">Вивчено слів</div>
                <div class="n">{{ known }}</div>
              </div>
            </div>
            <div class="col-6">
              <div class="kpi">
                <div class="small-muted">Всього слів у базі</div>
                <div class="n">{{ total }}</div>
              </div>
            </div>
            <div class="col-6">
              <div class="kpi">
                <div class="small-muted">Прогрес</div>
                <div class="n">{{ pct }}%</div>
              </div>
            </div>
            <div class="col-6">
              <div class="kpi">
                <div class="small-muted">Точність квізу</div>
                <div class="n">{{ acc }}%</div>
                <div class="small-muted">{{ qCorrect }}/{{ qTotal }}</div>
              </div>
            </div>
          </div>
          <div class="mt-3">
            <div class="small-muted mb-2">Загальний прогрес:</div>
            <div class="progress" style="height:10px">
              <div class="progress-bar" :style="{ width: pct + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
