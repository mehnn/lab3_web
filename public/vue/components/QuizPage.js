// vue/components/QuizPage.js — режим вікторини

const QuizPage = {
  name: "QuizPage",

  data() {
    return {
      level:       getLevels()[0],
      topic:       getTopics(getLevels()[0])[0],
      onlyUnknown: false,
      known:       {},
      questions:   [],
      qi:          0,
      locked:      false,
      chosen:      null,
      score:       0,
      finished:    false,
      loading:     true,
      PAD: ["місяць", "вікно", "міст", "ручка", "сумка", "дерево", "вогонь"],
    };
  },

  computed: {
    levels()   { return getLevels(); },
    topics()   { return getTopics(this.level); },
    question() { return this.questions[this.qi] ?? null; },
    total()    { return this.questions.length; },
  },

  watch: {
    level(val) { this.topic = getTopics(val)[0]; this.startQuiz(); },
    topic()    { this.startQuiz(); },
  },

  async created() {
    await this.loadAndStart();
  },

  methods: {
    async loadAndStart() {
      this.loading = true;
      const prog = await apiGetProgress();
      this.known  = prog.known ?? {};
      this.loading = false;
      this.buildQuiz();
    },

    async startQuiz() {
      const prog  = await apiGetProgress();
      this.known  = prog.known ?? {};
      this.buildQuiz();
    },

    buildQuiz() {
      const words = getWords(this.level, this.topic);
      const pool  = this.onlyUnknown ? words.filter(w => !this.known[w.id]) : words;
      const src   = pool.length ? pool : words;

      this.questions = shuffle(src).map(w => ({
        word:    w,
        correct: w.ua,
        options: this.makeOptions(w, words),
      }));
      this.qi       = 0;
      this.locked   = false;
      this.chosen   = null;
      this.score    = 0;
      this.finished = false;
    },

    makeOptions(target, words) {
      const wrongs = shuffle(words.filter(x => x.en !== target.en).map(x => x.ua)).slice(0, 3);
      const opts   = shuffle([target.ua, ...wrongs]);
      while (opts.length < 4) opts.push(this.PAD[opts.length % this.PAD.length]);
      return opts.slice(0, 4);
    },

    async choose(opt) {
      if (this.locked) return;
      this.locked = true;
      this.chosen = opt;

      const isCorrect = opt === this.question.correct;
      await apiRecordQuiz(isCorrect);

      if (isCorrect) {
        this.score++;
        setTimeout(() => this.next(), 1300);
      }
    },

    next() {
      if (this.qi + 1 >= this.total) {
        this.finished = true;
      } else {
        this.qi++;
        this.locked = false;
        this.chosen = null;
      }
    },

    optClass(opt) {
      if (!this.locked) return "btn btn-soft w-100 py-3 text-start";
      if (opt === this.question.correct) return "btn btn-accent w-100 py-3 text-start";
      if (opt === this.chosen)           return "btn btn-danger w-100 py-3 text-start";
      return "btn btn-soft w-100 py-3 text-start";
    },

    toggleUnknown() {
      this.onlyUnknown = !this.onlyUnknown;
      this.buildQuiz();
    },
  },

  template: `
    <div class="glass p-4 p-md-5">
      <!-- Фільтри -->
      <div class="row g-3 mb-4 align-items-end">
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
        <div class="col-md-4 d-flex gap-2 flex-wrap">
          <button class="btn btn-brand" @click="buildQuiz">Перезапустити</button>
          <button class="btn btn-soft"  @click="toggleUnknown">
            {{ onlyUnknown ? 'Тільки невивчені ✅' : 'Тільки невивчені' }}
          </button>
        </div>
      </div>

      <!-- Рахунок -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4 fw-bold mb-0">Вікторина</h2>
        <div class="text-end">
          <div class="small-muted">Рахунок</div>
          <div class="fw-bold fs-4">{{ score }} / {{ total }}</div>
        </div>
      </div>

      <hr class="my-3">

      <div v-if="loading" class="text-center py-5 small-muted">Завантаження...</div>

      <!-- Фінальний екран -->
      <div v-else-if="finished" class="text-center py-4">
        <div class="alert alert-success fs-5">
          ✅ Вікторина завершена! Рахунок: <b>{{ score }}</b> / <b>{{ total }}</b>
        </div>
        <button class="btn btn-brand mt-2" @click="buildQuiz">Спробувати ще раз</button>
      </div>

      <!-- Питання -->
      <div v-else-if="question" class="glass p-4" style="border-radius:16px;background:rgba(255,255,255,.75)">
        <div class="small-muted mb-2">Переклади слово (EN):</div>
        <div class="display-6 fw-bold mb-4">{{ question.word.en }}</div>

        <div class="row g-2">
          <div class="col-12 col-md-6" v-for="opt in question.options" :key="opt">
            <button :class="optClass(opt)" @click="choose(opt)">{{ opt }}</button>
          </div>
        </div>

        <div class="mt-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div class="small-muted">
            <span v-if="!locked">Натисни варіант відповіді.</span>
            <span v-else-if="chosen === question.correct">✅ Правильно!</span>
            <span v-else>❌ Ні. Правильно: {{ question.correct }}</span>
          </div>
          <button class="btn btn-accent"
            :disabled="!locked || chosen === question.correct"
            @click="next">Далі</button>
        </div>
      </div>
    </div>
  `,
};
