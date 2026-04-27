// vue/components/StudyPage.js — режим вивчення карток

const StudyPage = {
  name: "StudyPage",

  data() {
    return {
      level:      getLevels()[0],
      topic:      getTopics(getLevels()[0])[0],
      index:      0,
      showUA:     false,
      known:      {},   // { wordId: true }
      loadingProg: true,
    };
  },

  computed: {
    levels()  { return getLevels(); },
    topics()  { return getTopics(this.level); },
    words()   { return getWords(this.level, this.topic); },
    card()    { return this.words[this.index] ?? null; },
    knownCount() { return this.words.filter(w => this.known[w.id]).length; },
    pct()     { return this.words.length ? Math.round((this.knownCount / this.words.length) * 100) : 0; },
  },

  watch: {
    // При зміні рівня — скидаємо тему та індекс
    level(val) {
      this.topic = getTopics(val)[0];
      this.index = 0;
      this.showUA = false;
    },
    topic() { this.index = 0; this.showUA = false; },
  },

  async created() {
    await this.loadProgress();
  },

  methods: {
    async loadProgress() {
      this.loadingProg = true;
      try {
        const prog = await apiGetProgress();
        this.known = prog.known ?? {};
      } finally {
        this.loadingProg = false;
      }
    },

    flip()     { this.showUA = !this.showUA; },
    prevCard() { this.index--; this.showUA = false; },
    nextCard() { this.index++; this.showUA = false; },

    async markKnown(isKnown) {
      const word = this.words[this.index];
      await apiSetKnown(word.id, isKnown);
      if (isKnown) {
        this.known = { ...this.known, [word.id]: true };
        if (this.index < this.words.length - 1) this.index++;
      } else {
        const k = { ...this.known };
        delete k[word.id];
        this.known = k;
      }
      this.showUA = false;
    },

    async resetProgress() {
      if (!confirm("Скинути прогрес?")) return;
      await apiResetProgress();
      this.known = {};
      this.index = 0;
    },
  },

  template: `
    <div>
      <!-- Фільтри -->
      <div class="glass p-4 mb-4">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label">Рівень</label>
            <select v-model="level" class="form-select">
              <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Тема</label>
            <select v-model="topic" class="form-select">
              <option v-for="t in topics" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="col-md-4 d-flex gap-2 flex-wrap align-items-center">
            <button class="btn btn-soft" @click="resetProgress">Скинути прогрес</button>
            <span class="badge badge-soft rounded-pill px-3 py-2">{{ knownCount }}/{{ words.length }} вивчено</span>
          </div>
        </div>
        <div class="mt-3">
          <div class="progress" style="height:10px">
            <div class="progress-bar" :style="{ width: pct + '%' }"></div>
          </div>
          <div class="small-muted mt-2">Прогрес: {{ pct }}%</div>
        </div>
      </div>

      <div v-if="loadingProg" class="text-center py-5 small-muted">Завантаження...</div>

      <div v-else class="row g-4">
        <!-- Картка -->
        <div class="col-lg-6">
          <div class="glass p-4 p-md-5">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div>
                <div class="small-muted">Картка</div>
                <div class="fw-bold">{{ index + 1 }}/{{ words.length }}</div>
              </div>
              <span class="badge badge-soft">{{ level }} • {{ topic }}</span>
            </div>

            <div v-if="card" class="glass p-4 mt-3" style="border-radius:16px;background:rgba(255,255,255,.75)">
              <div class="text-center">
                <div class="small-muted mb-2">EN</div>
                <div class="display-6 fw-bold">{{ card.en }}</div>
                <button class="btn btn-soft mt-3" @click="flip">
                  {{ showUA ? 'Сховати переклад' : 'Показати переклад' }}
                </button>
                <div v-if="showUA" class="mt-4">
                  <div class="small-muted mb-2">UA</div>
                  <div class="fs-2 fw-semibold">{{ card.ua }}</div>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2 flex-wrap justify-content-between mt-4">
              <button class="btn btn-soft" :disabled="index === 0" @click="prevCard">← Назад</button>
              <div class="d-flex gap-2">
                <button class="btn btn-soft" @click="markKnown(false)">Не знаю</button>
                <button class="btn btn-brand" @click="markKnown(true)">Знаю ✅</button>
              </div>
              <button class="btn btn-soft" :disabled="index === words.length - 1" @click="nextCard">Далі →</button>
            </div>
          </div>
        </div>

        <!-- Таблиця слів -->
        <div class="col-lg-6">
          <div class="glass p-4 p-md-5">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h5 fw-semibold mb-0">Список слів</h2>
              <span class="badge badge-soft">{{ words.length }} слів</span>
            </div>
            <div class="table-responsive">
              <table class="table table-bordered align-middle mb-0">
                <thead>
                  <tr><th>EN</th><th>UA</th><th>Статус</th></tr>
                </thead>
                <tbody>
                  <tr v-for="w in words" :key="w.id">
                    <td class="fw-semibold">{{ w.en }}</td>
                    <td>{{ w.ua }}</td>
                    <td>{{ known[w.id] ? '✅ Вивчено' : '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
