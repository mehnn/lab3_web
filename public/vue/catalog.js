// vue/catalog.js — словниковий каталог (статичні дані, не потребують сервера)

const CATALOG = {
  A1: {
    Everyday: [
      { en: "book", ua: "книга" }, { en: "sun", ua: "сонце" }, { en: "water", ua: "вода" },
      { en: "house", ua: "будинок" }, { en: "friend", ua: "друг" }, { en: "school", ua: "школа" },
      { en: "phone", ua: "телефон" }, { en: "time", ua: "час" }, { en: "day", ua: "день" },
      { en: "night", ua: "ніч" }, { en: "family", ua: "родина" }, { en: "city", ua: "місто" },
      { en: "street", ua: "вулиця" }, { en: "door", ua: "двері" }, { en: "window", ua: "вікно" },
      { en: "table", ua: "стіл" }, { en: "chair", ua: "стілець" }, { en: "pen", ua: "ручка" },
      { en: "bag", ua: "сумка" }, { en: "key", ua: "ключ" },
    ],
    Food: [
      { en: "apple", ua: "яблуко" }, { en: "banana", ua: "банан" }, { en: "bread", ua: "хліб" },
      { en: "milk", ua: "молоко" }, { en: "cheese", ua: "сир" }, { en: "tea", ua: "чай" },
      { en: "coffee", ua: "кава" }, { en: "salt", ua: "сіль" }, { en: "sugar", ua: "цукор" },
      { en: "orange", ua: "апельсин" }, { en: "egg", ua: "яйце" }, { en: "meat", ua: "м'ясо" },
      { en: "fish", ua: "риба" }, { en: "rice", ua: "рис" }, { en: "soup", ua: "суп" },
    ],
    Travel: [
      { en: "ticket", ua: "квиток" }, { en: "train", ua: "поїзд" }, { en: "bus", ua: "автобус" },
      { en: "map", ua: "карта" }, { en: "hotel", ua: "готель" }, { en: "airport", ua: "аеропорт" },
      { en: "passport", ua: "паспорт" }, { en: "luggage", ua: "багаж" }, { en: "road", ua: "дорога" },
    ],
    Work: [
      { en: "job", ua: "робота" }, { en: "task", ua: "завдання" }, { en: "team", ua: "команда" },
      { en: "boss", ua: "керівник" }, { en: "office", ua: "офіс" }, { en: "meeting", ua: "зустріч" },
      { en: "plan", ua: "план" }, { en: "call", ua: "дзвінок" }, { en: "break", ua: "перерва" },
    ],
  },
  A2: {
    Everyday: [
      { en: "weather", ua: "погода" }, { en: "message", ua: "повідомлення" }, { en: "weekend", ua: "вихідні" },
      { en: "decision", ua: "рішення" }, { en: "problem", ua: "проблема" }, { en: "idea", ua: "ідея" },
      { en: "choice", ua: "вибір" }, { en: "reason", ua: "причина" }, { en: "history", ua: "історія" },
      { en: "important", ua: "важливий" }, { en: "usually", ua: "зазвичай" }, { en: "comfortable", ua: "зручний" },
    ],
    Food: [
      { en: "recipe", ua: "рецепт" }, { en: "breakfast", ua: "сніданок" }, { en: "delicious", ua: "смачний" },
      { en: "healthy", ua: "корисний" }, { en: "dessert", ua: "десерт" }, { en: "spicy", ua: "гострий" },
      { en: "sweet", ua: "солодкий" }, { en: "hungry", ua: "голодний" }, { en: "menu", ua: "меню" },
    ],
    Travel: [
      { en: "journey", ua: "подорож" }, { en: "reservation", ua: "бронювання" }, { en: "tourist", ua: "турист" },
      { en: "guide", ua: "гід" }, { en: "museum", ua: "музей" }, { en: "bridge", ua: "міст" },
      { en: "crowded", ua: "людний" }, { en: "safe", ua: "безпечний" }, { en: "dangerous", ua: "небезпечний" },
    ],
    Work: [
      { en: "project", ua: "проєкт" }, { en: "deadline", ua: "дедлайн" }, { en: "report", ua: "звіт" },
      { en: "result", ua: "результат" }, { en: "improve", ua: "покращувати" }, { en: "discuss", ua: "обговорювати" },
      { en: "schedule", ua: "розклад" }, { en: "experience", ua: "досвід" }, { en: "priority", ua: "пріоритет" },
    ],
  },
  B1: {
    Everyday: [
      { en: "relationship", ua: "стосунки" }, { en: "opportunity", ua: "можливість" }, { en: "confidence", ua: "впевненість" },
      { en: "challenge", ua: "виклик" }, { en: "achievement", ua: "досягнення" }, { en: "responsibility", ua: "відповідальність" },
      { en: "environment", ua: "середовище" }, { en: "influence", ua: "вплив" }, { en: "nevertheless", ua: "проте" },
    ],
    Food: [
      { en: "nutrition", ua: "харчування" }, { en: "portion", ua: "порція" }, { en: "allergy", ua: "алергія" },
      { en: "organic", ua: "органічний" }, { en: "texture", ua: "текстура" }, { en: "consume", ua: "споживати" },
    ],
    Travel: [
      { en: "accommodation", ua: "житло" }, { en: "itinerary", ua: "маршрут" }, { en: "sightseeing", ua: "огляд пам'яток" },
      { en: "destination", ua: "пункт призначення" }, { en: "postpone", ua: "відкласти" }, { en: "explore", ua: "досліджувати" },
    ],
    Work: [
      { en: "performance", ua: "ефективність" }, { en: "collaboration", ua: "співпраця" }, { en: "feedback", ua: "зворотний зв'язок" },
      { en: "negotiate", ua: "домовлятися" }, { en: "requirement", ua: "вимога" }, { en: "stakeholder", ua: "зацікавлена сторона" },
    ],
  },
};

// Повертає слова з унікальним id
function getWords(level, topic) {
  return (CATALOG[level]?.[topic] ?? []).map(w => ({
    ...w,
    id: `${level}|${topic}|${w.en.toLowerCase()}`,
  }));
}

function getLevels()       { return Object.keys(CATALOG); }
function getTopics(level)  { return Object.keys(CATALOG[level] ?? {}); }
function allWordsCount()   {
  return Object.values(CATALOG).flatMap(l => Object.values(l)).flat().length;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
