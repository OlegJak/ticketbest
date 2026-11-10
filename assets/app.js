(() => {
  "use strict";

  const DATA = window.TB_DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  /* ------------------------------------------------------------------ i18n */
  const T = {
    et: {
      skip: "Sisu juurde",
      searchPlaceholder: "Otsi üritust, artisti või linna",
      heroTitle: "Parimad kontserdid ja etendused <em>üle Euroopa</em>",
      events: "üritust", countries: "riiki", cities: "linna",
      tours: "Kontserttuurid", toursSub: "Üks show — palju linnu. Vali endale lähim.",
      allEvents: "Kõik üritused",
      allCountries: "Kõik riigid",
      cat_all: "Kõik", cat_concert: "Kontserdid", cat_theatre: "Teater ja tants", cat_show: "Klubid ja show", cat_sport: "Sport",
      when_any: "Igal ajal", when_week: "See nädal", when_weekend: "Nädalavahetusel", when_month: "See kuu", when_next: "Järgmine kuu",
      found: (n) => `${n} ${n === 1 ? "üritus" : "üritust"}`,
      forQuery: "päringule", reset: "Lähtesta filtrid",
      emptyTitle: "Midagi ei leitud", emptyText: "Proovi muuta filtreid või otsingut.",
      showMore: "Näita rohkem",
      buy: "Osta pilet", buyShort: "Osta", chooseCity: "Vali linn",
      back: "Tagasi", about: "Ürituse kohta", readMore: "Loe edasi", readLess: "Näita vähem",
      offerOnSale: "Piletid müügil", offerMulti: (n) => (n > 1 ? `Vali linn ja kuupäev · ${n} linna` : "Vali sobiv kuupäev"),
      viewGrid: "Afišid", viewList: "Kuupäevade kaupa", addCal: "Lisa kalendrisse", today: "Täna", tomorrow: "Homme",
      dates: "Kuupäevad ja piletid", datesCount: (n) => `${n} ${n === 1 ? "kuupäev" : "kuupäeva"}`,
      otherCities: "Sama show teistes linnades", seeTour: "Vaata kogu tuuri",
      organizer: "Korraldaja", age: "Vanusepiirang", when: "Millal", where: "Kus",
      venue: "Toimumiskoht", map: "Ava kaardil", share: "Jaga", copied: "Link kopeeritud",
      secure: "Turvaline makse. E-pilet saadetakse kohe e-postile.",
      tourDates: (n, c) => `${n} kontserti · ${c} linna`,
      notFound: "Üritust ei leitud", toHome: "Avalehele",
      viewAll: "Näita kõiki tulemusi",
      noMatch: "Vasteid ei leitud",
      ctaTitle: "Korraldad üritust?", ctaText: "Müü pileteid Ticket Best Europe kaudu üle Euroopa — piletimüük, skaneerimine ja turundus ühest kohast.", ctaBtn: "Hakka müüma",
      footerTagline: "Piletid kontsertidele, etendustele ja show'dele Baltikumis, Põhjamaades ja üle Euroopa.",
      fBuyers: "Pileti ostjale", fHowToBuy: "Kuidas osta piletit", fRules: "Tellimuse reeglid", fEticket: "E-pilet", fFaq: "KKK",
      fOrganizers: "Korraldajale", fSell: "Müü pileteid meie kaudu",
      fAbout: "Firmast", fContact: "Kontakt", fOffer: "Avalik pakkumine", fPrivacy: "Privaatsuspoliitika",
      cookieText: "Kasutame küpsiseid, et leht töötaks mugavamalt ja sisu oleks asjakohasem.",
      cookieYes: "Nõustun", cookieNo: "Ainult vajalikud",
      countryNames: { EE: "Eesti", FI: "Soome", LV: "Läti", LT: "Leedu", SE: "Rootsi", ES: "Hispaania", RS: "Serbia", PT: "Portugal" },
    },
    ru: {
      skip: "К содержимому",
      searchPlaceholder: "Поиск событий, артистов, городов",
      heroTitle: "Лучшие концерты и шоу <em>по всей Европе</em>",
      events: "событий", countries: "стран", cities: "городов",
      tours: "Концертные туры", toursSub: "Одно шоу — много городов. Выберите ближайший.",
      allEvents: "Афиша",
      allCountries: "Все страны",
      cat_all: "Все", cat_concert: "Концерты", cat_theatre: "Театр и танец", cat_show: "Клубы и шоу", cat_sport: "Спорт",
      when_any: "Любая дата", when_week: "Эта неделя", when_weekend: "Выходные", when_month: "Этот месяц", when_next: "Следующий месяц",
      found: (n) => `${n} ${ruPlural(n, "событие", "события", "событий")}`,
      forQuery: "по запросу", reset: "Сбросить фильтры",
      emptyTitle: "Ничего не найдено", emptyText: "Попробуйте изменить фильтры или запрос.",
      showMore: "Показать ещё",
      buy: "Купить билет", buyShort: "Купить", chooseCity: "Выбрать город",
      back: "Назад", about: "О событии", readMore: "Читать дальше", readLess: "Свернуть",
      offerOnSale: "Билеты в продаже", offerMulti: (n) => (n > 1 ? `Выберите город и дату · ${n} ${ruPlural(n, "город", "города", "городов")}` : "Выберите удобную дату"),
      viewGrid: "Афиши", viewList: "По датам", addCal: "В календарь", today: "Сегодня", tomorrow: "Завтра",
      dates: "Даты и билеты", datesCount: (n) => `${n} ${ruPlural(n, "дата", "даты", "дат")}`,
      otherCities: "Это шоу в других городах", seeTour: "Весь тур",
      organizer: "Организатор", age: "Возраст", when: "Когда", where: "Где",
      venue: "Место проведения", map: "Открыть на карте", share: "Поделиться", copied: "Ссылка скопирована",
      secure: "Безопасная оплата. Электронный билет сразу придёт на e-mail.",
      tourDates: (n, c) => `${n} ${ruPlural(n, "концерт", "концерта", "концертов")} · ${c} ${ruPlural(c, "город", "города", "городов")}`,
      notFound: "Событие не найдено", toHome: "На главную",
      viewAll: "Показать все результаты",
      noMatch: "Ничего не найдено",
      ctaTitle: "Организуете мероприятие?", ctaText: "Продавайте билеты через Ticket Best Europe по всей Европе — продажа, сканирование и продвижение в одном месте.", ctaBtn: "Начать продажи",
      footerTagline: "Билеты на концерты, спектакли и шоу в Балтии, Скандинавии и по всей Европе.",
      fBuyers: "Покупателю", fHowToBuy: "Как купить билет", fRules: "Правила заказа", fEticket: "Электронный билет", fFaq: "Частые вопросы",
      fOrganizers: "Организатору", fSell: "Продавать билеты у нас",
      fAbout: "О компании", fContact: "Контакты", fOffer: "Публичная оферта", fPrivacy: "Конфиденциальность",
      cookieText: "Мы используем cookie, чтобы сайт работал удобнее, а предложения были полезнее.",
      cookieYes: "Принять", cookieNo: "Только необходимые",
      countryNames: { EE: "Эстония", FI: "Финляндия", LV: "Латвия", LT: "Литва", SE: "Швеция", ES: "Испания", RS: "Сербия", PT: "Португалия" },
    },
    en: {
      skip: "Skip to content",
      searchPlaceholder: "Search events, artists or cities",
      heroTitle: "The best concerts and shows <em>across Europe</em>",
      events: "events", countries: "countries", cities: "cities",
      tours: "Concert tours", toursSub: "One show, many cities. Pick the one nearest you.",
      allEvents: "What's on",
      allCountries: "All countries",
      cat_all: "All", cat_concert: "Concerts", cat_theatre: "Theatre & dance", cat_show: "Clubs & shows", cat_sport: "Sport",
      when_any: "Any date", when_week: "This week", when_weekend: "This weekend", when_month: "This month", when_next: "Next month",
      found: (n) => `${n} ${n === 1 ? "event" : "events"}`,
      forQuery: "for", reset: "Reset filters",
      emptyTitle: "Nothing found", emptyText: "Try changing the filters or your search.",
      showMore: "Show more",
      buy: "Buy tickets", buyShort: "Buy", chooseCity: "Choose city",
      back: "Back", about: "About the event", readMore: "Read more", readLess: "Show less",
      offerOnSale: "Tickets on sale", offerMulti: (n) => (n > 1 ? `Pick your city and date · ${n} cities` : "Pick a date"),
      viewGrid: "Posters", viewList: "By date", addCal: "Add to calendar", today: "Today", tomorrow: "Tomorrow",
      dates: "Dates & tickets", datesCount: (n) => `${n} ${n === 1 ? "date" : "dates"}`,
      otherCities: "This show in other cities", seeTour: "See full tour",
      organizer: "Organizer", age: "Age limit", when: "When", where: "Where",
      venue: "Venue", map: "Open in Maps", share: "Share", copied: "Link copied",
      secure: "Secure payment. Your e-ticket arrives by email instantly.",
      tourDates: (n, c) => `${n} ${n === 1 ? "concert" : "concerts"} · ${c} ${c === 1 ? "city" : "cities"}`,
      notFound: "Event not found", toHome: "Go home",
      viewAll: "Show all results",
      noMatch: "No matches",
      ctaTitle: "Organising an event?", ctaText: "Sell tickets across Europe with Ticket Best Europe — ticketing, scanning and promotion in one place.", ctaBtn: "Start selling",
      footerTagline: "Tickets for concerts, theatre and shows in the Baltics, the Nordics and across Europe.",
      fBuyers: "For buyers", fHowToBuy: "How to buy", fRules: "Order rules", fEticket: "E-ticket", fFaq: "FAQ",
      fOrganizers: "For organizers", fSell: "Sell tickets with us",
      fAbout: "About us", fContact: "Contact", fOffer: "Terms of sale", fPrivacy: "Privacy policy",
      cookieText: "We use cookies to make the site work better and keep content relevant.",
      cookieYes: "Accept", cookieNo: "Only necessary",
      countryNames: { EE: "Estonia", FI: "Finland", LV: "Latvia", LT: "Lithuania", SE: "Sweden", ES: "Spain", RS: "Serbia", PT: "Portugal" },
    },
  };
  function ruPlural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }
  const LOCALE = { et: "et-EE", ru: "ru-RU", en: "en-GB" };

  /* ----------------------------------------------------------------- state */
  const state = {
    lang: ["et", "ru", "en"].includes(store.get("tb.lang")) ? store.get("tb.lang") : "et",
    country: store.get("tb.country", "all"),
    cat: "all",
    when: "any",
    q: "",
    limit: 24,
    view: store.get("tb.view", "grid") === "list" ? "list" : "grid",
  };
  const t = (k, ...a) => { const v = T[state.lang][k] ?? T.et[k] ?? k; return typeof v === "function" ? v(...a) : v; };
  const countryName = (c) => T[state.lang].countryNames[c] || c;

  /* ------------------------------------------------------------ data prep */
  const toDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  // Posters already shout in capitals — the UI doesn't need to.
  const SMALL = new Set(["by", "of", "and", "the", "in", "on", "a", "an", "to", "for", "ja", "un", "ir", "och", "de", "la", "y", "и", "в"]);
  const isCaps = (w) => /\p{Lu}/u.test(w) && w === w.toUpperCase();
  const capsRatio = (s) => { const l = s.match(/\p{L}/gu) || []; return l.length ? l.filter((c) => c === c.toUpperCase()).length / l.length : 0; };
  const titleCase = (w) => w.toLowerCase().replace(/(^|[-'’“„"(«/])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
  function niceTitle(s) {
    if (!s) return s;
    const allCaps = capsRatio(s) > 0.6;
    return s.split(" ").map((w, i) => {
      if (!isCaps(w) || /\d/.test(w)) return w;
      if (!allCaps && w.replace(/\P{L}/gu, "").length < 4) return w;
      const lw = w.toLowerCase();
      return i > 0 && SMALL.has(lw) ? lw : titleCase(w);
    }).join(" ");
  }
  const niceSub = (s) => (s && capsRatio(s) > 0.6 ? cap(s.toLowerCase()) : s);

  const events = DATA.events
    .map((e, i) => ({ ...e, i, title: niceTitle(e.title), subtitle: niceSub(e.subtitle), d: toDate(e.date), search: norm(`${e.fullTitle} ${e.city} ${e.venue} ${e.subtitle}`) }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const bySlug = new Map();
  events.forEach((e) => { if (!bySlug.has(e.slug)) bySlug.set(e.slug, []); bySlug.get(e.slug).push(e); });
  const tourBySlug = new Map(DATA.tours.map((tr) => [tr.slug, tr]));

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

  // Same show, same day, several start times → one card
  function groupSessions(list) {
    const map = new Map();
    for (const e of list) {
      const k = e.slug + "|" + e.date;
      if (!map.has(k)) map.set(k, { ...e, times: [] });
      const g = map.get(k);
      if (!g.times.includes(e.time)) g.times.push(e.time);
    }
    return [...map.values()];
  }

  // Same show in several cities/dates → one card (tour, or same title)
  const showKey = (e) => (e.tour ? "t:" + e.tour : "n:" + norm(e.title));
  function groupShows(list) {
    const map = new Map();
    for (const e of list) {
      const k = showKey(e);
      if (!map.has(k)) map.set(k, { key: k, first: e, events: [] });
      map.get(k).events.push(e);
    }
    return [...map.values()].map((g) => {
      g.last = g.events[g.events.length - 1];
      g.cities = [...new Set(g.events.map((e) => e.city))];
      g.dates = new Set(g.events.map((e) => e.date)).size;
      g.slugs = new Set(g.events.map((e) => e.slug));
      return g;
    });
  }
  // All events of a show, ignoring filters (for the show page)
  const showEvents = (key) => events.filter((e) => showKey(e) === key);
  function showHref(g) {
    const all = showEvents(g.key);
    if (new Set(all.map((e) => e.slug)).size === 1) return `#/e/${encodeURIComponent(g.first.slug)}`;
    if (g.key.startsWith("t:")) return `#/t/${encodeURIComponent(g.key.slice(2))}`;
    return `#/s/${encodeURIComponent(g.key.slice(2))}`;
  }

  /* ------------------------------------------------------------ formatting */
  const fmt = (opts) => new Intl.DateTimeFormat(LOCALE[state.lang], opts);
  const fDay = (d) => d.getDate();
  const fMonShort = (d) => fmt({ month: "short" }).format(d).replace(".", "");
  const fWeekday = (d) => fmt({ weekday: "short" }).format(d).replace(".", "");
  const fWeekdayLong = (d) => fmt({ weekday: "long" }).format(d);
  const fLong = (d) => fmt({ day: "numeric", month: "long", year: "numeric" }).format(d);
  const fMonthYear = (d) => fmt({ month: "long", year: "numeric" }).format(d);
  const fDM = (d) => `${fDay(d)} ${fMonShort(d)}`;
  const fRange = (a, b) => (a.getTime() === b.getTime() ? fDM(a)
    : a.getMonth() === b.getMonth() ? `${fDay(a)}–${fDay(b)} ${fMonShort(b)}` : `${fDM(a)} – ${fDM(b)}`);

  /* ------------------------------------------------------------ filtering */
  function dateRange(when) {
    const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const day = (today.getDay() + 6) % 7; // Mon=0
    const add = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
    switch (when) {
      case "week": return [today, add(today, 6 - day)];
      case "weekend": return day >= 4 ? [today, add(today, 6 - day)] : [add(today, 4 - day), add(today, 6 - day)];
      case "month": return [today, new Date(today.getFullYear(), today.getMonth() + 1, 0)];
      case "next": return [new Date(today.getFullYear(), today.getMonth() + 1, 1), new Date(today.getFullYear(), today.getMonth() + 2, 0)];
      default: return null;
    }
  }
  function matches(e, { ignore } = {}) {
    if (ignore !== "country" && state.country !== "all" && e.country !== state.country) return false;
    if (ignore !== "cat" && state.cat !== "all" && !e.tags.includes(state.cat)) return false;
    if (ignore !== "when") {
      const r = dateRange(state.when);
      if (r && (e.d < r[0] || e.d > r[1])) return false;
    }
    if (state.q) {
      const words = norm(state.q).split(/\s+/).filter(Boolean);
      if (!words.every((w) => e.search.includes(w))) return false;
    }
    return true;
  }

  /* --------------------------------------------------------------- icons */
  const I = {
    arrowL: '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
    ticket: '<svg viewBox="0 0 24 24"><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M13 6v2M13 11v2M13 16v2"/></svg>',
    cal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-5.8-7-11a7 7 0 0 1 14 0c0 5.2-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M12 3v13M7 8l5-5 5 5"/><path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>',
    map: '<svg viewBox="0 0 24 24"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    grid: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/></svg>',
    download: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5"/></svg>',
    ext: '<svg viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></svg>',
  };

  // Every "buy" opens the real seat-map/checkout widget in our own modal (see openBuy)
  const buyLink = (e, cls = "btn btn--accent", label = t("buy")) =>
    `<button type="button" class="${cls}" data-buy="${e.i}">${label}</button>`;
  const eventHref = (e) => `#/e/${encodeURIComponent(e.slug)}${bySlug.get(e.slug).length > 1 ? `?d=${e.date}` : ""}`;

  /* ================================================================ HOME */
  function renderHome(main) {
    if (mqMobile.matches) return renderMobileHome(main);
    const countriesN = new Set(events.map((e) => e.country)).size;
    const citiesN = new Set(events.map((e) => e.city)).size;
    main.innerHTML = `
      <div class="page">
        <section class="hero">
          <div class="hero__glow" aria-hidden="true"><i></i><i></i></div>
          <div class="container">
            <div class="hero__intro">
              <h1 class="hero__title">${t("heroTitle")}</h1>
              <div class="hero__stats">
                <span><b>${events.length}</b>${t("events")}</span>
                <span><b>${countriesN}</b>${t("countries")}</span>
                <span><b>${citiesN}</b>${t("cities")}</span>
              </div>
            </div>
            ${carouselHTML()}
          </div>
        </section>

        <section class="section">
          <div class="container">
            <div class="section__head">
              <div><h2 class="section__title">${t("tours")}</h2><p class="section__sub">${t("toursSub")}</p></div>
            </div>
            <div class="tours">${DATA.tours.map((tr) => tourCardHTML(tr)).join("")}</div>
          </div>
        </section>

        <section class="section" id="afisha">
          <div class="container">
            <div class="section__head"><h2 class="section__title">${t("allEvents")}</h2></div>
            <div class="listing">
              <div class="filters" id="filters"></div>
              <div id="results"></div>
            </div>
            <div class="cta">
              <div><h2>${t("ctaTitle")}</h2><p>${t("ctaText")}</p></div>
              <a class="btn btn--light" href="http://forms.ticketbest.ee/et/pealeht/" target="_blank" rel="noopener">${t("ctaBtn")} ${I.arrowR}</a>
            </div>
          </div>
        </section>
      </div>`;
    initCarousel($(".carousel", main));
    renderFilters();
    renderResults();
    observeStuck();
  }

  /* ------------------------------------------- MOBILE HOME: tall swipe cards + list */
  const mqMobile = matchMedia("(max-width: 640px)");
  const mobile = { limit: 12 };
  const FX = {
    et: { m_recommended: "Soovitame", m_empty: "Selles valikus praegu üritusi pole.", m_cities: (n) => `${n} linna` },
    ru: { m_recommended: "Рекомендуем", m_empty: "По этому запросу пока нет событий.", m_cities: (n) => `${n} ${ruPlural(n, "город", "города", "городов")}` },
    en: { m_recommended: "Recommended", m_empty: "Nothing here right now.", m_cities: (n) => `${n} ${n === 1 ? "city" : "cities"}` },
  };
  Object.keys(FX).forEach((l) => Object.assign(T[l], FX[l]));

  // Events for the phone home: country + search query
  function mobileEvents() {
    const words = norm(state.q).split(/\s+/).filter(Boolean);
    return events.filter((e) => (state.country === "all" || e.country === state.country) && words.every((w) => e.search.includes(w)));
  }
  const groupTitle = (g) => (g.key.startsWith("t:") && tourBySlug.get(g.key.slice(2))?.title) || g.first.title;
  const groupWhen = (g) => (g.first.date !== g.last.date ? fRange(g.first.d, g.last.d)
    : `${cap(fWeekday(g.first.d))}, ${fDM(g.first.d)} · ${g.first.time}`);
  const groupWhere = (g) => (g.cities.length > 1 ? `${g.first.city} · ${t("m_cities", g.cities.length)}`
    : [g.first.venue, g.first.city].filter(Boolean).join(", "));

  // Featured cards: the organisers' slider picks first, then the soonest shows
  function mobileFeatured(groups) {
    const out = [];
    for (const s of DATA.slides) {
      const g = s.kind === "tour" ? groups.find((x) => x.key === "t:" + s.slug) : groups.find((x) => x.slugs.has(s.slug));
      if (g && !out.includes(g)) out.push(g);
    }
    for (const g of groups) { if (out.length >= 10) break; if (!out.includes(g)) out.push(g); }
    return out;
  }

  function mCardHTML(g, i, n) {
    const e = g.first, href = showHref(g), title = groupTitle(g);
    const action = g.events.length > 1
      ? `<a class="m-card__buy" href="${esc(href)}" aria-label="${esc(t("chooseCity"))}">${I.ticket}</a>`
      : `<button type="button" class="m-card__buy" data-buy="${e.i}" aria-label="${esc(t("buy"))}">${I.ticket}</button>`;
    return `<article class="m-card">
      <div class="m-card__media">
        <img class="m-card__img" src="${esc(e.poster || e.image)}" alt="" ${i > 1 ? 'loading="lazy"' : ""} draggable="false">
        <span class="m-card__count">${i + 1}/${n}</span>
      </div>
      <div class="m-card__body">
        <p class="m-card__meta">${I.cal}<span>${esc(groupWhen(g))}</span></p>
        <h3 class="m-card__title"><a href="${esc(href)}">${esc(title)}</a></h3>
        <p class="m-card__meta">${I.pin}<span>${esc(groupWhere(g))}</span></p>
        ${action}
      </div>
    </article>`;
  }

  function mRowHTML(g) {
    const e = g.first;
    const href = showHref(g);
    // the button leads to the event page (a tour/series: to its page with the cities)
    const action = `<a class="m-row__buy" href="${esc(href)}">${I.ticket}${t(g.events.length > 1 ? "chooseCity" : "buy")}</a>`;
    return `<article class="m-row">
      <span class="m-row__img"><img src="${esc(e.poster || e.image)}" alt="" loading="lazy"></span>
      <span class="m-row__body">
        <span class="m-row__when">${I.cal}<span>${esc(groupWhen(g))}</span></span>
        <a class="m-row__title" href="${esc(href)}">${esc(groupTitle(g))}</a>
        <span class="m-row__where">${I.pin}<span>${esc(groupWhere(g))}</span></span>
      </span>
      ${action}
    </article>`;
  }

  let mCardsTimer;
  // Own swipe instead of native scroll-snap: iOS momentum + snap kept leaving cards half-way.
  // The track moves with the finger (transform), and on release always lands on a card: one card per flick.
  function initMobileCards(track, onChange) {
    const cards = [...track.children];
    const view = track.parentElement;
    let idx = 0, x = 0, maxX = 0;
    const pos = (i) => Math.min(cards[i].offsetLeft - cards[0].offsetLeft, maxX);
    const measure = () => {
      const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0, lastC = cards[cards.length - 1];
      const span = lastC.offsetLeft + lastC.offsetWidth - cards[0].offsetLeft;
      maxX = Math.max(0, span - (view.clientWidth - 2 * pad)); // last card ends at the right gutter
    };
    const setX = (v, animate) => {
      x = v;
      track.style.transition = animate ? "transform .5s cubic-bezier(.22, .8, .24, 1)" : "none";
      track.style.transform = `translate3d(${-v}px, 0, 0)`;
    };
    const goTo = (i, animate = true) => {
      idx = (i + cards.length) % cards.length;
      setX(pos(idx), animate);
      onChange && onChange(idx);
    };
    measure(); goTo(0, false);

    let drag = null, moved = false, pausedUntil = 0;
    const hold = () => { pausedUntil = Date.now() + 8000; };
    track.addEventListener("pointerdown", (ev) => {
      if (ev.pointerType === "mouse" && ev.button !== 0) return;
      measure(); hold();
      drag = { id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, start: x, horiz: null, samples: [[ev.timeStamp, ev.clientX]] };
      moved = false;
    });
    track.addEventListener("pointermove", (ev) => {
      if (!drag || ev.pointerId !== drag.id) return;
      const dx = ev.clientX - drag.x0, dy = ev.clientY - drag.y0;
      if (drag.horiz === null) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        drag.horiz = Math.abs(dx) > Math.abs(dy);
        if (!drag.horiz) { drag = null; return; } // vertical: let the page scroll
        try { track.setPointerCapture(ev.pointerId); } catch {}
        moved = true;
      }
      let v = drag.start - dx;
      if (v < 0) v *= 0.35; else if (v > maxX) v = maxX + (v - maxX) * 0.35; // rubber band at the ends
      setX(v, false);
      drag.samples.push([ev.timeStamp, ev.clientX]);
      if (drag.samples.length > 6) drag.samples.shift();
    });
    const end = (ev) => {
      if (!drag || ev.pointerId !== drag.id) return;
      const d = drag; drag = null; hold();
      if (!d.horiz) return;
      const [t0, x0] = d.samples[0], [t1, x1] = d.samples[d.samples.length - 1];
      const vel = t1 > t0 ? (x1 - x0) / (t1 - t0) : 0; // px/ms, + = finger moving right
      const dx = ev.clientX - d.x0, w = cards[0].offsetWidth;
      let next = idx;
      if (vel < -0.3 || dx < -w * 0.2) next = idx + 1;
      else if (vel > 0.3 || dx > w * 0.2) next = idx - 1;
      next = Math.max(0, Math.min(cards.length - 1, next));
      if (next === idx && pos(next) === pos(cards.length - 1) && next < cards.length - 1 && dx < 0) next = cards.length - 1;
      goTo(next);
    };
    track.addEventListener("pointerup", end);
    track.addEventListener("pointercancel", end);
    // A swipe must not open the card it started on
    track.addEventListener("click", (ev) => { if (moved) { ev.preventDefault(); ev.stopPropagation(); moved = false; } }, true);
    addEventListener("resize", () => { if (track.isConnected) { measure(); goTo(idx, false); } });

    // Autoplay every 5 s; touching pauses it for 8 s
    clearInterval(mCardsTimer);
    if (cards.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    mCardsTimer = setInterval(() => {
      if (!track.isConnected) { clearInterval(mCardsTimer); return; }
      if (document.hidden || drag || co.open || Date.now() < pausedUntil) return;
      const r = track.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return; // not on screen
      goTo(idx + 1);
    }, 5000);
  }

  function renderMobileHome(main) {
    const groups = groupShows(mobileEvents());
    const featured = state.q ? [] : mobileFeatured(groups);
    const shown = groups.slice(0, mobile.limit);
    const evs = mobileEvents();
    const tours = state.q ? [] : DATA.tours.filter((tr) => evs.some((e) => e.tour === tr.slug));
    main.innerHTML = `<div class="m-home">
      ${featured.length ? `<div class="m-glow" aria-hidden="true"><i></i><i></i></div>` : ""}
      ${featured.length ? `<section class="m-cards" aria-roledescription="carousel">
        <div class="m-cards__track">${featured.map((g, i) => mCardHTML(g, i, featured.length)).join("")}</div>
      </section>` : ""}
      ${tours.length ? `<section class="m-tours container">
        <div class="m-list__head"><h2>${t("tours")}</h2></div>
        <div class="tours tours--posters">${tours.map((tr) => tourCardHTML(tr, true)).join("")}</div>
      </section>` : ""}
      <section class="m-list container">
        <div class="m-list__head">
          <h2>${state.q ? `«${esc(state.q)}»` : t("m_recommended")}</h2>
          ${state.q ? `<button class="chip" data-clear-q>${t("reset")} ×</button>` : ""}
        </div>
        ${groups.length ? `<div class="m-list__items">${shown.map(mRowHTML).join("")}</div>` : `<p class="m-list__empty">${t("m_empty")}</p>`}
        ${groups.length > shown.length ? `<div class="more"><button class="btn btn--ghost" data-m-more>${t("showMore")} <small>(${groups.length - shown.length})</small></button></div>` : ""}
      </section>
    </div>`;
    // Background glow takes the colours of the card in view and cross-fades as you swipe
    const track = $(".m-cards__track", main), glows = $$(".m-glow i", main);
    document.body.classList.toggle("glass-head", !!glows.length);
    let front = 0, last = -1;
    const glowTo = (i) => {
      if (!glows.length || i === last || !track.children[i]) return;
      last = i;
      const next = glows[1 - front];
      next.style.backgroundImage = `url("${track.children[i].querySelector("img").src}")`;
      next.classList.add("is-on"); glows[front].classList.remove("is-on");
      front = 1 - front;
    };
    if (track) initMobileCards(track, glowTo);
    const more = $("[data-m-more]", main);
    if (more) more.onclick = () => { mobile.limit += 12; renderMobileHome(main); };
    const clearQ = $("[data-clear-q]", main);
    if (clearQ) clearQ.onclick = () => { state.q = ""; $("#search").value = ""; mobile.limit = 12; renderMobileHome(main); scrollTo(0, 0); };
  }

  function carouselHTML() {
    const slides = DATA.slides.map((s, i) => {
      let href;
      if (s.kind === "tour" && tourBySlug.has(s.slug)) href = `#/t/${s.slug}`;
      else if (s.kind === "event" && bySlug.has(s.slug)) href = `#/e/${s.slug}`;
      else href = `https://ticketbest.eu/${s.kind === "tour" ? "compilations" : "performances"}/${s.slug}`;
      return `<a class="slide" href="${esc(href)}" role="group" aria-roledescription="slide" aria-label="${i + 1} / ${DATA.slides.length}">
        <img src="${esc(s.image)}" alt="" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} draggable="false"></a>`;
    }).join("");
    return `<div class="carousel" aria-roledescription="carousel">
      <div class="carousel__stage">
        <div class="carousel__track">${slides}</div>
        <button class="carousel__btn carousel__btn--prev" aria-label="Previous">${I.arrowL}</button>
        <button class="carousel__btn carousel__btn--next" aria-label="Next">${I.arrowR}</button>
      </div>
      <div class="carousel__card">
        <div class="carousel__info" aria-live="polite"></div>
        <div class="carousel__nav">
          <div class="carousel__dots">${DATA.slides.map((_, i) => `<button class="carousel__dot" aria-label="${i + 1}"></button>`).join("")}</div>
          <span class="carousel__count"></span>
        </div>
      </div>
    </div>`;
  }

  function rangeLabel(list) {
    const first = list[0].d, last = list[list.length - 1].d;
    return first.getTime() === last.getTime() ? `${fDay(first)} ${fMonShort(first)}`
      : `${fDay(first)} ${fMonShort(first)} – ${fDay(last)} ${fMonShort(last)}`;
  }

  // Text for the floating card under the active slide
  function slideInfoHTML(s, href) {
    let title, meta, action;
    const tourList = s.kind === "tour" ? events.filter((e) => e.tour === s.slug) : [];
    if (tourList.length) {
      title = tourBySlug.get(s.slug).title;
      meta = `${rangeLabel(tourList)} · ${t("tourDates", tourList.length, new Set(tourList.map((e) => e.city)).size)}`;
      action = `<a class="btn btn--accent btn--sm" href="${esc(href)}">${t("chooseCity")}</a>`;
    } else if (s.kind === "event" && bySlug.has(s.slug)) {
      const list = bySlug.get(s.slug), e = list[0];
      title = e.title;
      meta = list.length > 1 ? `${rangeLabel(list)} · ${e.city} · ${t("datesCount", list.length)}`
        : `${cap(fWeekday(e.d))}, ${fDay(e.d)} ${fMonShort(e.d)} · ${e.time} · ${e.city}`;
      action = list.length > 1 ? `<a class="btn btn--accent btn--sm" href="${esc(href)}">${I.ticket}${t("buyShort")}</a>`
        : buyLink(e, "btn btn--accent btn--sm", I.ticket + t("buyShort"));
    } else {
      return `<a class="carousel__title" href="${esc(href)}">${t("buy")}</a>`;
    }
    return `<div class="carousel__text"><a class="carousel__title" href="${esc(href)}">${esc(title)}</a><p class="carousel__meta">${esc(meta)}</p></div>${action}`;
  }

  let carouselTimer;
  function initCarousel(root) {
    if (!root) return;
    const track = $(".carousel__track", root);
    const dots = $$(".carousel__dot", root);
    const n = dots.length;
    const idx = () => Math.round(track.scrollLeft / track.firstElementChild.offsetWidth);
    const go = (i) => {
      const slide = track.children[(i + n) % n];
      track.scrollTo({ left: slide.offsetLeft - track.firstElementChild.offsetLeft, behavior: "smooth" });
    };
    const info = $(".carousel__info", root), count = $(".carousel__count", root);
    const pad = (x) => String(x).padStart(2, "0");
    // Two stacked layers so the glow cross-fades between slides
    const glows = $$(".hero__glow i");
    let glowFront = 0;
    const setGlow = (src) => {
      if (!glows.length) return;
      const next = glows[1 - glowFront];
      next.style.backgroundImage = `url("${src}")`;
      next.classList.add("is-on"); glows[glowFront].classList.remove("is-on");
      glowFront = 1 - glowFront;
    };
    let lastIdx = -1, swapT;
    const sync = () => {
      const i0 = Math.max(0, Math.min(n - 1, idx()));
      if (!root.isConnected || Number.isNaN(i0) || i0 === lastIdx) return; // re-rendered or hidden mid-scroll
      const first = lastIdx < 0;
      lastIdx = i0;
      dots.forEach((d, i) => d.setAttribute("aria-current", i === i0 ? "true" : "false"));
      count.innerHTML = `<b>${pad(i0 + 1)}</b> / ${pad(n)}`;
      setGlow(track.children[i0].querySelector("img").src);
      const html = slideInfoHTML(DATA.slides[i0], track.children[i0].getAttribute("href"));
      clearTimeout(swapT);
      if (first) { info.innerHTML = html; return; }
      info.classList.add("is-swapping");
      swapT = setTimeout(() => { info.innerHTML = html; info.classList.remove("is-swapping"); }, 160);
    };
    track.addEventListener("scroll", () => requestAnimationFrame(sync), { passive: true });
    $(".carousel__btn--prev", root).onclick = () => { go(idx() - 1); restart(); };
    $(".carousel__btn--next", root).onclick = () => { go(idx() + 1); restart(); };
    dots.forEach((d, i) => (d.onclick = () => { go(i); restart(); }));
    let paused = false;
    root.addEventListener("pointerenter", () => (paused = true));
    root.addEventListener("pointerleave", () => (paused = false));
    root.addEventListener("focusin", () => (paused = true));
    root.addEventListener("focusout", () => (paused = false));
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function restart() {
      clearInterval(carouselTimer);
      if (reduce) return;
      carouselTimer = setInterval(() => { if (!paused && !document.hidden && root.isConnected) go(idx() + 1); }, 6000);
    }
    sync(); restart();
  }

  // Desktop: wide tour picture. Phone home (poster = true): the vertical poster.
  function tourCardHTML(tr, poster = false) {
    const list = events.filter((e) => e.tour === tr.slug);
    if (!list.length) return "";
    const cities = new Set(list.map((e) => e.city)).size;
    const range = rangeLabel(list);
    const wide = tr.image || list[0].image;
    const img = poster ? list[0].poster || wide : wide || list[0].poster;
    return `<a class="tour ${!poster && !wide ? "tour--fallback" : ""}" href="#/t/${esc(tr.slug)}">
      <img src="${esc(img)}" alt="" loading="lazy">
      <div class="tour__body">
        <h3 class="tour__title">${esc(tr.title)}</h3>
        <div class="tour__meta"><span class="pill">${range}</span><span class="pill">${t("tourDates", list.length, cities)}</span></div>
      </div>
    </a>`;
  }

  function renderFilters() {
    const el = $("#filters"); if (!el) return;
    const cats = ["all", "concert", "theatre", "show", "sport"];
    const catCount = (c) => events.filter((e) => (c === "all" || e.tags.includes(c)) && matches(e, { ignore: "cat" })).length;
    const whens = ["any", "week", "weekend", "month", "next"];
    el.innerHTML = `
      <div class="chips" role="group" aria-label="Category">
        ${cats.map((c) => { const n = catCount(c); return (n || c === "all" || state.cat === c) ? `<button class="chip" data-cat="${c}" aria-pressed="${state.cat === c}">${t("cat_" + c)} <small>${n}</small></button>` : ""; }).join("")}
        <span class="chips__sep"></span>
        ${whens.map((w) => `<button class="chip" data-when="${w}" aria-pressed="${state.when === w}">${t("when_" + w)}</button>`).join("")}
      </div>`;
    $$("[data-cat]", el).forEach((b) => (b.onclick = () => { state.cat = b.dataset.cat; state.limit = 24; renderFilters(); renderResults(); }));
    $$("[data-when]", el).forEach((b) => (b.onclick = () => { state.when = b.dataset.when; state.limit = 24; renderFilters(); renderResults(); }));
  }

  function renderResults() {
    const el = $("#results"); if (!el) return;
    const filtered = events.filter((e) => matches(e));
    const isFiltered = state.cat !== "all" || state.when !== "any" || state.q || state.country !== "all";
    const list = state.view === "list";

    let html = `<div class="results-bar">
      <span>${t("found", filtered.length)}${state.q ? ` ${t("forQuery")} «${esc(state.q)}»` : ""}${state.country !== "all" ? ` · ${esc(countryName(state.country))}` : ""}
        ${isFiltered ? `<button data-reset>${t("reset")}</button>` : ""}</span>
      <div class="viewtoggle" role="group">
        <button data-view="grid" aria-pressed="${!list}" title="${t("viewGrid")}">${I.grid}<span>${t("viewGrid")}</span></button>
        <button data-view="list" aria-pressed="${list}" title="${t("viewList")}">${I.list}<span>${t("viewList")}</span></button>
      </div>
    </div>`;

    let total = 0, shownN = 0;
    if (!filtered.length) {
      html += `<div class="empty"><div class="empty__icon" aria-hidden="true">🎟️</div><h3>${t("emptyTitle")}</h3><p>${t("emptyText")}</p><button class="btn btn--dark" data-reset>${t("reset")}</button></div>`;
    } else if (!list) {
      const shows = groupShows(filtered);
      total = shows.length;
      const shown = shows.slice(0, state.limit);
      shownN = shown.length;
      html += `<div class="grid">${shown.map(cardHTML).join("")}</div>`;
    } else {
      const sessions = groupSessions(filtered);
      total = sessions.length;
      const shown = sessions.slice(0, state.limit * 2);
      shownN = shown.length;
      let day = "", month = "";
      html += `<div class="agenda">`;
      for (const g of shown) {
        const m = g.date.slice(0, 7);
        if (m !== month) { if (day) html += `</div></div>`; day = ""; month = m; html += `<h3 class="agenda__month">${cap(fMonthYear(g.d))}</h3>`; }
        if (g.date !== day) {
          if (day) html += `</div></div>`;
          day = g.date;
          const rel = relDay(g.d);
          html += `<div class="agenda__day"><div class="agenda__date"><b>${fDay(g.d)}</b><span>${esc(rel || cap(fWeekdayLong(g.d)))}</span></div><div class="agenda__rows">`;
        }
        html += rowHTML(g);
      }
      html += `</div></div></div>`;
    }
    if (total > shownN) html += `<div class="more"><button class="btn btn--ghost" data-more>${t("showMore")} <small>(${total - shownN})</small></button></div>`;

    el.innerHTML = html;
    fadeImages(el);
    $$("[data-reset]", el).forEach((b) => (b.onclick = resetFilters));
    $$("[data-view]", el).forEach((b) => (b.onclick = () => { state.view = b.dataset.view; store.set("tb.view", state.view); state.limit = 24; renderResults(); }));
    const more = $("[data-more]", el);
    if (more) more.onclick = () => { state.limit += 24; renderResults(); };
  }

  function relDay(d) {
    const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = Math.round((d - today) / 864e5);
    return diff === 0 ? t("today") : diff === 1 ? t("tomorrow") : "";
  }

  function fadeImages(root) {
    $$("img[loading=lazy]", root).forEach((img) => {
      if (img.complete) return;
      img.classList.add("is-loading");
      const done = () => img.classList.remove("is-loading");
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });
  }

  function resetFilters() {
    state.cat = "all"; state.when = "any"; state.q = ""; state.limit = 24;
    state.country = "all"; store.set("tb.country", "all");
    $("#search").value = ""; syncCountrySelect();
    renderFilters(); renderResults();
  }

  function cardHTML(g, i) {
    const e = g.first, multi = g.dates > 1;
    const when = multi ? fRange(e.d, g.last.d)
      : `${cap(fWeekday(e.d))}, ${fDM(e.d)} · ${[...new Set(g.events.map((x) => x.time))].join(" · ")}`;
    const more = g.cities.length > 3 ? ` +${g.cities.length - 3}` : "";
    const place = g.cities.length > 1 ? esc(g.cities.slice(0, 3).join(", ") + more) : `<b>${esc(e.city)}</b> · ${esc(e.venue)}`;
    return `<article class="card" style="--i:${i % 12}">
      <div class="card__media">
        <img src="${esc(e.poster)}" alt="" loading="lazy" decoding="async">
        ${multi ? `<span class="card__count">${I.cal}${t("datesCount", g.dates)}</span>` : ""}
        ${e.age && e.age !== "0+" ? `<span class="card__age">${esc(e.age)}</span>` : ""}
        <div class="card__offer">
          <small>${t("offerOnSale")}</small>
          <b>${multi ? esc(t("offerMulti", g.cities.length)) : `${esc(fDM(e.d))} · ${esc(e.time)} · ${esc(e.city)}`}</b>
          ${multi
            ? `<a class="btn btn--accent btn--sm" href="${showHref(g)}">${I.ticket}${t("buy")}</a>`
            : buyLink(e, "btn btn--accent btn--sm", I.ticket + t("buy"))}
        </div>
      </div>
      <div class="card__body">
        <span class="card__when">${esc(when)}</span>
        <h4 class="card__title"><a href="${showHref(g)}">${esc(e.title)}</a></h4>
        <p class="card__place">${place}</p>
      </div>
    </article>`;
  }

  function rowHTML(g) {
    return `<div class="row">
      <span class="row__time">${g.times.map(esc).join("<br>")}</span>
      <img class="row__img" src="${esc(g.poster)}" alt="" loading="lazy">
      <div class="row__info">
        <a class="row__title" href="${eventHref(g)}">${esc(g.title)}</a>
        <span class="row__place"><b>${esc(g.city)}</b> · ${esc(g.venue)}</span>
      </div>
      ${buyLink(g, "btn btn--accent btn--sm row__buy", t("buyShort"))}
    </div>`;
  }

  function observeStuck() {
    const f = $("#filters"); if (!f) return;
    const sentinel = document.createElement("div");
    f.before(sentinel);
    const top = $(".header").offsetHeight + 1;
    new IntersectionObserver(([en]) => f.classList.toggle("is-stuck", !en.isIntersecting), { rootMargin: `-${top}px 0px 0px 0px` }).observe(sentinel);
  }

  /* ========================================================== EVENT PAGE */
  function renderEvent(main, slug, params) {
    const list = bySlug.get(slug);
    if (!list) return renderNotFound(main);
    const cur = list.find((e) => e.date === params.get("d")) || list[0];
    const desc = DATA.descriptions[slug] || "";
    const tour = cur.tour && tourBySlug.get(cur.tour);
    const key = showKey(cur);
    const others = groupSessions(showEvents(key).filter((e) => e.slug !== slug));
    const seriesHref = tour ? `#/t/${encodeURIComponent(tour.slug)}` : `#/s/${encodeURIComponent(key.slice(2))}`;
    const cats = cur.tags.map((c) => `<span class="tag">${t("cat_" + c)}</span>`).join("");
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cur.venue}, ${cur.city}`)}`;
    const sameVenue = list.every((e) => e.venue === cur.venue);

    document.title = `${cur.title} — ${cur.city} | Ticket Best Europe`;
    main.innerHTML = `
      <div class="page">
        ${posterHeroHTML(cur.poster, cur.title, "", cur.image)}

        <div class="container">
          <div class="ev">
            <div class="ev__head">
              <div class="ev__eyebrow">
                ${cats}
                ${cur.age ? `<span class="tag">${esc(cur.age)}</span>` : ""}
                ${tour ? `<a class="tag tag--accent" href="#/t/${esc(tour.slug)}">${esc(tour.title)} →</a>` : ""}
              </div>
              <h1 class="ev__title">${esc(cur.title)}</h1>
              ${cur.subtitle ? `<p class="ev__subtitle">${esc(cur.subtitle)}</p>` : ""}

              <div class="facts">
                <div class="fact">${I.cal}<div><small>${t("when")}</small><span>${esc(fLong(cur.d))}</span><span style="color:var(--muted);font-weight:600">${esc(cap(fWeekdayLong(cur.d)))}, ${esc(cur.time)}</span></div></div>
                <div class="fact">${I.pin}<div><small>${t("where")}</small><span>${esc(cur.venue)}</span><span style="color:var(--muted);font-weight:600">${esc(cur.city)}, ${esc(countryName(cur.country))}</span></div></div>
                <div class="fact">${I.user}<div><small>${t("age")}</small><span>${esc(cur.age || "—")}</span>${cur.organizer ? `<span style="color:var(--muted);font-weight:600">${esc(cur.organizer)}</span>` : ""}</div></div>
              </div>
            </div>

            <div class="ev__body">
              ${desc ? `<div class="prose" id="desc"><h2>${t("about")}</h2>${desc}</div>
              <button class="btn btn--ghost btn--sm readmore" id="readmore" hidden>${t("readMore")}</button>` : ""}
              ${cur.organizer ? `<p class="organizer">${t("organizer")}: <b>${esc(cur.organizer)}</b></p>` : ""}
            </div>

            <aside class="aside">
              <div class="panel" id="tickets">
                <div class="panel__title">${t("dates")}<small>${t("datesCount", list.length)}</small></div>
                ${list.map((e) => `
                  <div class="session ${e === cur ? "is-current" : ""}">
                    <div class="session__day"><b>${fDay(e.d)}</b><span>${esc(fMonShort(e.d))}</span></div>
                    <div class="session__info"><b>${esc(cap(fWeekday(e.d)))}, ${esc(e.time)}</b><span>${esc(sameVenue ? e.city : `${e.venue}, ${e.city}`)}</span></div>
                    ${buyLink(e, "btn btn--accent btn--sm", t("buyShort"))}
                  </div>`).join("")}
                <p class="panel__note">${I.lock}<span>${t("secure")}</span></p>
              </div>

              <div class="panel">
                <div class="panel__title">${t("venue")}</div>
                <p class="venue__name">${esc(cur.venue)}</p>
                <p class="venue__city">${esc(cur.city)}, ${esc(countryName(cur.country))}</p>
                <div class="venue__actions">
                  <a class="btn btn--ghost btn--sm" href="${mapUrl}" target="_blank" rel="noopener">${I.map}${t("map")}</a>
                  <button class="btn btn--ghost btn--sm" data-ics>${I.download}${t("addCal")}</button>
                  <button class="btn btn--ghost btn--sm" data-share>${I.share}${t("share")}</button>
                </div>
              </div>

              ${others.length ? `<div class="panel">
                <div class="panel__title">${t("otherCities")}<small>${others.length}</small></div>
                ${others.slice(0, 5).map((o) => `<a class="mini" href="${eventHref(o)}"><img src="${esc(o.poster)}" alt="" loading="lazy"><div><b>${esc(o.city)}</b><span>${fDM(o.d)} · ${esc(o.times.join(", "))} · ${esc(o.venue)}</span></div></a>`).join("")}
                ${others.length > 5 ? `<a class="link-more" href="${seriesHref}" style="display:block;margin-top:10px">${t("seeTour")} →</a>` : ""}
              </div>` : ""}
            </aside>
          </div>
        </div>

        <div class="buybar" id="buybar">
          <div class="buybar__info"><b>${fDay(cur.d)} ${esc(fMonShort(cur.d))}, ${esc(cur.time)}</b><span>${esc(cur.venue)}, ${esc(cur.city)}</span></div>
          ${list.length > 1 ? `<a class="btn btn--accent" href="#tickets" data-jump>${t("buy")}</a>` : buyLink(cur)}
        </div>
      </div>`;

    // Read more for long descriptions
    const d = $("#desc"), rm = $("#readmore");
    if (d && d.scrollHeight > 460) {
      d.classList.add("prose--clamp"); rm.hidden = false;
      rm.onclick = () => { const open = d.classList.toggle("prose--clamp"); rm.textContent = open ? t("readMore") : t("readLess"); };
    }
    // Mobile sticky buy bar: show once the tickets panel scrolled out of view
    const bar = $("#buybar"), panel = $("#tickets");
    document.body.classList.add("has-buybar");
    new IntersectionObserver(([en]) => bar.classList.toggle("is-visible", !en.isIntersecting)).observe(panel);
    const jump = $("[data-jump]", bar);
    if (jump) jump.onclick = (ev) => { ev.preventDefault(); panel.scrollIntoView({ behavior: "smooth", block: "start" }); };
    $("[data-share]", main).onclick = () => share(cur);
    $("[data-ics]", main).onclick = () => downloadIcs(cur);
  }

  function downloadIcs(e) {
    const [h, m] = e.time.split(":").map(Number);
    const start = new Date(e.d.getFullYear(), e.d.getMonth(), e.d.getDate(), h, m);
    const end = new Date(start.getTime() + 2 * 36e5);
    // Floating local time: the event starts at e.time in the venue's own time zone
    const p2 = (n) => String(n).padStart(2, "0");
    const local = (d) => `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}T${p2(d.getHours())}${p2(d.getMinutes())}00`;
    const stamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const clean = (s) => String(s).replace(/([,;\\])/g, "\\$1");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ticket Best Europe//EN", "BEGIN:VEVENT",
      `UID:${e.id || e.slug}@ticketbest.eu`, `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${local(start)}`, `DTEND:${local(end)}`,
      `SUMMARY:${clean(e.title)}`, `LOCATION:${clean(`${e.venue}, ${e.city}`)}`, `URL:${e.url}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `${e.slug.slice(0, 60)}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* =========================================================== TOUR PAGE */
  function renderTour(main, slug) {
    const tr = tourBySlug.get(slug);
    const list = events.filter((e) => e.tour === slug);
    if (!tr || !list.length) return renderNotFound(main);
    renderSeries(main, { title: tr.title, image: tr.image, list });
  }
  function renderShow(main, key) {
    const list = showEvents("n:" + key);
    if (!list.length) return renderNotFound(main);
    renderSeries(main, { title: list[0].title, image: list[0].image, list });
  }

  // Poster page top: the vertical poster on a soft glow made from its own colours (glow runs up under the glass header)
  // Wide picture failed to load: fall back to the poster layout
  window.pHeroFallback = (img) => {
    img.onerror = null;
    img.closest(".p-hero")?.classList.remove("p-hero--wide");
    img.parentElement.querySelector("source")?.remove();
    img.src = img.dataset.poster;
  };
  // On a desktop screen the wide picture is shown instead of the poster (when there is one)
  function posterHeroHTML(src, alt, extra = "", wide = "") {
    return `<section class="p-hero ${wide ? "p-hero--wide" : ""}">
      <div class="p-hero__glow" aria-hidden="true"><img src="${esc(src || wide)}" alt=""></div>
      <div class="container p-hero__inner">
        <button class="back" data-back>${I.arrowL}${t("back")}</button>
        <picture class="p-hero__pic">
          ${wide ? `<source media="(min-width: 641px)" srcset="${esc(wide)}">` : ""}
          <img class="p-hero__poster" src="${esc(src || wide)}" alt="${esc(alt)}"${wide && src ? ` data-poster="${esc(src)}" onerror="pHeroFallback(this)"` : ""}>
        </picture>
        ${extra}
      </div>
    </section>`;
  }

  function renderSeries(main, { title, image, list }) {
    const groups = groupSessions(list);
    const cities = new Set(list.map((e) => e.city)).size;
    const countries = [...new Set(list.map((e) => e.country))].map(countryName).join(", ");
    const range = fRange(list[0].d, list[list.length - 1].d);
    document.title = `${title} | Ticket Best Europe`;
    main.innerHTML = `
      <div class="page">
        ${posterHeroHTML(list[0].poster, title, `
          <h1 class="p-hero__title">${esc(title)}</h1>
          <div class="tour__meta"><span class="pill">${esc(range)}</span><span class="pill">${t("tourDates", list.length, cities)}</span><span class="pill">${esc(countries)}</span></div>`, image || list[0].image)}
        <div class="container">
        <div class="dates">
          ${groups.map((g) => `
            <div class="daterow">
              <div class="daterow__day"><b>${fDay(g.d)}</b><span>${esc(fMonShort(g.d))}</span></div>
              <img src="${esc(g.poster)}" alt="" loading="lazy">
              <div class="daterow__info"><a class="daterow__link" href="${eventHref(g)}"><b>${esc(g.city)}</b></a><span>${esc(cap(fWeekday(g.d)))}, ${esc(g.times.join(" · "))} · ${esc(g.venue)}</span></div>
              ${buyLink(g, "btn btn--accent", t("buyShort"))}
            </div>`).join("")}
        </div>
        </div>
      </div>`;
  }

  function renderNotFound(main) {
    main.innerHTML = `<div class="page container"><div class="empty"><div class="empty__icon">🎭</div><h3>${t("notFound")}</h3><p></p><a class="btn btn--dark" href="#/">${t("toHome")}</a></div></div>`;
  }

  /* ============================================================== SEARCH */
  function initSearch() {
    const input = $("#search"), box = $("#search-results");
    let active = -1, items = [];

    const close = () => { box.hidden = true; input.setAttribute("aria-expanded", "false"); active = -1; };
    const hl = (s, q) => {
      let out = esc(s);
      norm(q).split(/\s+/).filter((w) => w.length > 1).forEach((w) => {
        const i = norm(s).indexOf(w);
        if (i >= 0) out = esc(s.slice(0, i)) + "<mark>" + esc(s.slice(i, i + w.length)) + "</mark>" + esc(s.slice(i + w.length));
      });
      return out;
    };
    const update = () => {
      const q = input.value.trim();
      if (q.length < 2) { close(); return; }
      const words = norm(q).split(/\s+/);
      items = groupSessions(events.filter((e) => words.every((w) => e.search.includes(w))));
      const top = items.slice(0, 6);
      box.innerHTML = top.length
        ? top.map((g, i) => `<a class="sr" role="option" id="sr-${i}" href="${eventHref(g)}" aria-selected="false">
            <img src="${esc(g.poster)}" alt="">
            <div><div class="sr__title">${hl(g.title, q)}</div><div class="sr__meta">${fDay(g.d)} ${esc(fMonShort(g.d))} · ${esc(g.times[0])} · ${hl(g.city, q)}, ${esc(g.venue)}</div></div></a>`).join("")
          + (items.length > 6 || getRoute().name !== "home" ? `<a class="sr__all" href="#/" data-all>${t("viewAll")} (${items.length})</a>` : "")
        : `<div class="sr__empty">${t("noMatch")}</div>`;
      box.hidden = false; input.setAttribute("aria-expanded", "true"); active = -1;
      const all = $("[data-all]", box);
      if (all) all.onclick = (ev) => { ev.preventDefault(); applyQuery(q); };
      $$(".sr", box).forEach((a) => a.addEventListener("click", () => { input.value = ""; close(); }));
    };
    const setActive = (i) => {
      const opts = $$(".sr", box); if (!opts.length) return;
      active = (i + opts.length) % opts.length;
      opts.forEach((o, j) => o.setAttribute("aria-selected", j === active ? "true" : "false"));
      input.setAttribute("aria-activedescendant", opts[active].id);
      opts[active].scrollIntoView({ block: "nearest" });
    };
    function applyQuery(q) {
      state.q = q; state.limit = 24; close(); input.blur();
      if (mqMobile.matches) { mobile.limit = 12; if (getRoute().name !== "home") location.hash = "#/"; else { route(); scrollTo(0, 0); } }
      else if (getRoute().name !== "home") { location.hash = "#/"; pendingScroll = "#afisha"; }
      else { renderFilters(); renderResults(); $("#afisha")?.scrollIntoView({ behavior: "smooth" }); }
    }

    input.addEventListener("input", () => {
      update();
      if (!input.value.trim() && state.q && getRoute().name === "home") { state.q = ""; renderFilters(); renderResults(); }
    });
    input.addEventListener("focus", update);
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Escape") { close(); input.blur(); }
      else if (e.key === "Enter") {
        e.preventDefault();
        const opts = $$(".sr", box);
        if (active >= 0 && opts[active]) { location.hash = opts[active].getAttribute("href"); input.value = ""; close(); input.blur(); }
        else if (input.value.trim()) applyQuery(input.value.trim());
      }
    });
    document.addEventListener("click", (e) => { if (!e.target.closest(".search")) close(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
    });
  }

  /* ============================================================ CONTROLS */
  function syncCountrySelect() {
    const sel = $("#country");
    const counts = {};
    events.forEach((e) => (counts[e.country] = (counts[e.country] || 0) + 1));
    const codes = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    sel.innerHTML = `<option value="all">${t("allCountries")}</option>` +
      codes.map((c) => `<option value="${c}">${esc(countryName(c))} (${counts[c]})</option>`).join("");
    sel.value = codes.includes(state.country) ? state.country : "all";
    state.country = sel.value;
    const all = state.country === "all";
    $("#country-label").innerHTML = `<span class="f">${esc(all ? t("allCountries") : countryName(state.country))}</span><span class="s">${all ? t("cat_all") : state.country}</span>`;
  }
  function initControls() {
    const lang = $("#lang"), country = $("#country");
    lang.value = state.lang;
    lang.onchange = () => { state.lang = lang.value; store.set("tb.lang", state.lang); applyStatic(); syncCountrySelect(); route(); };
    country.onchange = () => {
      state.country = country.value; store.set("tb.country", state.country); state.limit = 24;
      syncCountrySelect();
      if (mqMobile.matches) { mobile.limit = 12; if (getRoute().name !== "home") location.hash = "#/"; else { route(); scrollTo(0, 0); } }
      else if (getRoute().name !== "home") { location.hash = "#/"; pendingScroll = "#afisha"; }
      else { renderFilters(); renderResults(); $("#afisha")?.scrollIntoView({ behavior: "smooth" }); }
    };
    syncCountrySelect();
  }
  function applyStatic() {
    document.documentElement.lang = state.lang;
    $$("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    $$("[data-i18n-placeholder]").forEach((el) => (el.placeholder = t(el.dataset.i18nPlaceholder)));
  }
  function initCookie() {
    const c = $("#cookie");
    if (store.get("tb.cookie")) return;
    c.hidden = false;
    $$("[data-cookie]", c).forEach((b) => (b.onclick = () => { store.set("tb.cookie", b.dataset.cookie); c.hidden = true; }));
  }
  function toast(msg) {
    const el = $("#toast"); el.textContent = msg; el.classList.add("is-on");
    clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("is-on"), 2200);
  }
  async function share(e) {
    const url = location.href;
    if (navigator.share) { try { await navigator.share({ title: e.title, url }); } catch { /* cancelled */ } return; }
    try { await navigator.clipboard.writeText(url); toast(t("copied")); } catch { prompt("", url); }
  }

  /* ===================================================== DEMO CHECKOUT
     A design demo of the purchase flow: seats → details → payment → e-ticket.
     Nothing is charged and nothing leaves the browser. */
  const TX = {
    et: {
      co_demo: "Demo", co_demoNote: "See on demo: päris makset ei toimu ja andmeid ei saadeta kuhugi.",
      co_real: "Osta päris pilet", co_close: "Sulge",
      co_s1: "Kohad", co_s2: "Andmed", co_s3: "Makse",
      co_stage: "Lava", co_pick: "Vali kohad saaliplaanil", co_time: "Algus",
      co_free: "Vaba", co_taken: "Hõivatud", co_mine: "Sinu valik",
      co_seatLabel: (r, s, p) => `Rida ${r}, koht ${s}, ${p}`, co_rowSeat: (r, s) => `Rida ${r} · koht ${s}`,
      co_max: "Korraga saab valida kuni 8 kohta", co_empty: "Kohti pole veel valitud",
      co_tickets: (n) => `${n} ${n === 1 ? "pilet" : "piletit"}`,
      co_fee: "Teenustasu", co_total: "Kokku", co_next: "Edasi", co_back: "Tagasi",
      co_hold: (m) => `Kohad on sinu jaoks hoitud ${m}`, co_expired: "Broneeringu aeg sai läbi — vali kohad uuesti",
      co_contacts: "Kuhu piletid saata?", co_name: "Nimi", co_email: "E-post", co_phone: "Telefon (valikuline)",
      co_emailHint: "Saadame piletid sellele aadressile", co_agree: "Nõustun tellimuse reeglitega",
      co_errName: "Sisesta nimi", co_errEmail: "Kontrolli e-posti aadressi", co_errAgree: "Kinnita reeglitega nõustumine",
      co_payWith: "Vali makseviis", co_card: "Pangakaart", co_pay: (s) => `Maksa ${s}`, co_processing: "Makse töötlemine…",
      co_doneTitle: "Aitäh! Piletid on teel", co_doneText: (e) => `Saatsime piletid aadressile ${e}. Näita QR-koodi sissepääsul.`,
      co_swipe: "← Libista saaliplaani küljele →", co_order: "Tellimus", co_row: "Rida", co_seat: "Koht", co_done: "Valmis", co_ticketN: (i, n) => `Pilet ${i}/${n}`,
    },
    ru: {
      co_demo: "Демо", co_demoNote: "Это демо: оплата не проводится, данные никуда не отправляются.",
      co_real: "Купить настоящий билет", co_close: "Закрыть",
      co_s1: "Места", co_s2: "Данные", co_s3: "Оплата",
      co_stage: "Сцена", co_pick: "Выберите места на схеме зала", co_time: "Начало",
      co_free: "Свободно", co_taken: "Занято", co_mine: "Ваш выбор",
      co_seatLabel: (r, s, p) => `Ряд ${r}, место ${s}, ${p}`, co_rowSeat: (r, s) => `Ряд ${r} · место ${s}`,
      co_max: "За один заказ можно выбрать до 8 мест", co_empty: "Места пока не выбраны",
      co_tickets: (n) => `${n} ${ruPlural(n, "билет", "билета", "билетов")}`,
      co_fee: "Сервисный сбор", co_total: "Итого", co_next: "Далее", co_back: "Назад",
      co_hold: (m) => `Места забронированы за вами ещё ${m}`, co_expired: "Время брони истекло — выберите места заново",
      co_contacts: "Куда отправить билеты?", co_name: "Имя и фамилия", co_email: "E-mail", co_phone: "Телефон (необязательно)",
      co_emailHint: "Отправим билеты на этот адрес", co_agree: "Согласен с правилами заказа",
      co_errName: "Введите имя", co_errEmail: "Проверьте адрес e-mail", co_errAgree: "Подтвердите согласие с правилами",
      co_payWith: "Способ оплаты", co_card: "Банковская карта", co_pay: (s) => `Оплатить ${s}`, co_processing: "Обрабатываем оплату…",
      co_doneTitle: "Спасибо! Билеты уже в пути", co_doneText: (e) => `Мы отправили билеты на ${e}. Покажите QR-код на входе.`,
      co_swipe: "← Листайте схему зала в стороны →", co_order: "Заказ", co_row: "Ряд", co_seat: "Место", co_done: "Готово", co_ticketN: (i, n) => `Билет ${i}/${n}`,
    },
    en: {
      co_demo: "Demo", co_demoNote: "This is a demo: no real payment is made and no data is sent anywhere.",
      co_real: "Buy a real ticket", co_close: "Close",
      co_s1: "Seats", co_s2: "Details", co_s3: "Payment",
      co_stage: "Stage", co_pick: "Pick your seats on the map", co_time: "Starts",
      co_free: "Available", co_taken: "Taken", co_mine: "Your pick",
      co_seatLabel: (r, s, p) => `Row ${r}, seat ${s}, ${p}`, co_rowSeat: (r, s) => `Row ${r} · seat ${s}`,
      co_max: "You can pick up to 8 seats per order", co_empty: "No seats selected yet",
      co_tickets: (n) => `${n} ${n === 1 ? "ticket" : "tickets"}`,
      co_fee: "Service fee", co_total: "Total", co_next: "Continue", co_back: "Back",
      co_hold: (m) => `Seats held for you for ${m}`, co_expired: "Your hold expired — please pick seats again",
      co_contacts: "Where should we send the tickets?", co_name: "Full name", co_email: "Email", co_phone: "Phone (optional)",
      co_emailHint: "We'll send your tickets to this address", co_agree: "I accept the order rules",
      co_errName: "Enter your name", co_errEmail: "Check your email address", co_errAgree: "Please accept the rules",
      co_payWith: "Payment method", co_card: "Bank card", co_pay: (s) => `Pay ${s}`, co_processing: "Processing payment…",
      co_doneTitle: "Thank you! Your tickets are on the way", co_doneText: (e) => `We sent the tickets to ${e}. Show the QR code at the entrance.`,
      co_swipe: "← Swipe to see the whole hall →", co_order: "Order", co_row: "Row", co_seat: "Seat", co_done: "Done", co_ticketN: (i, n) => `Ticket ${i}/${n}`,
    },
  };
  Object.keys(TX).forEach((l) => Object.assign(T[l], TX[l]));

  const eventByI = new Map(events.map((e) => [e.i, e]));
  const FEE = 1.5, MAX_SEATS = 8, HOLD_MS = 10 * 60 * 1000;
  const money = (n) => new Intl.NumberFormat(LOCALE[state.lang], { style: "currency", currency: "EUR" }).format(n);
  function rng(seed) { // mulberry32 — deterministic per event, so the hall looks the same every time
    return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
  }
  const seedOf = (e) => [...(e.slug + e.date + e.time)].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);

  function buildHall(e) {
    const r = rng(seedOf(e));
    const base = [19, 25, 29, 35][Math.floor(r() * 4)];
    const zones = [
      { id: "a", price: base + 20 }, { id: "b", price: base + 10 }, { id: "c", price: base },
    ];
    const rows = [];
    const nRows = 11;
    for (let i = 1; i <= nRows; i++) {
      const n = 12 + Math.min(8, Math.round(i * 0.9));
      const zone = i <= 3 ? zones[0] : i <= 7 ? zones[1] : zones[2];
      const seats = [];
      for (let s = 1; s <= n; s++) {
        const centre = 1 - Math.abs(s - (n + 1) / 2) / ((n + 1) / 2); // centre seats sell first
        seats.push({ id: `${i}-${s}`, row: i, n: s, zone, taken: r() < 0.08 + centre * 0.28 + (i <= 3 ? 0.1 : 0) });
      }
      rows.push({ n: i, seats, aisle: Math.ceil(n / 2) });
    }
    return { zones, rows };
  }

  const co = { open: false };
  let coTimer = null, coLastFocus = null;

  function openCheckout(i) {
    const e = eventByI.get(i); if (!e) return;
    coLastFocus = document.activeElement;
    Object.assign(co, { open: true, e, hall: buildHall(e), step: 1, seats: new Map(), name: "", email: "", phone: "", agree: false, method: "swedbank", errors: {}, holdUntil: 0, order: null });
    let root = $("#co");
    if (!root) { root = document.createElement("div"); root.id = "co"; document.body.appendChild(root); }
    root.className = "co";
    root.innerHTML = `<div class="co__backdrop" data-co-close></div>
      <div class="co__panel" role="dialog" aria-modal="true" aria-labelledby="co-title"></div>`;
    document.documentElement.classList.add("co-lock");
    requestAnimationFrame(() => root.classList.add("is-open"));
    renderCheckout();
    $(".co__close", root)?.focus();
  }

  function closeCheckout() {
    const root = $("#co"); if (!root) return;
    co.open = false; clearInterval(coTimer);
    root.classList.remove("is-open");
    document.documentElement.classList.remove("co-lock");
    setTimeout(() => { if (!co.open) root.remove(); }, 250);
    coLastFocus?.focus?.();
  }

  const coSelected = () => [...co.seats.values()].sort((a, b) => a.row - b.row || a.n - b.n);
  const coSubtotal = () => coSelected().reduce((s, x) => s + x.zone.price, 0);
  const coTotal = () => coSubtotal() + co.seats.size * FEE;

  function renderCheckout() {
    const panel = $("#co .co__panel"); if (!panel) return;
    const e = co.e;
    const sameDay = (bySlug.get(e.slug) || []).filter((x) => x.date === e.date);
    const steps = [t("co_s1"), t("co_s2"), t("co_s3")];
    panel.innerHTML = `
      <header class="co__head">
        <img class="co__thumb" src="${esc(e.poster)}" alt="">
        <div class="co__event">
          <span class="co__badge">${t("co_demo")}</span>
          <h2 id="co-title">${esc(e.title)}</h2>
          <p>${esc(cap(fWeekday(e.d)))}, ${esc(fLong(e.d))} · ${esc(e.time)} · ${esc(e.venue)}, ${esc(e.city)}</p>
        </div>
        <button class="co__close" data-co-close aria-label="${t("co_close")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </header>
      ${co.step < 4 ? `<ol class="co__steps">${steps.map((s, k) => `<li class="${k + 1 === co.step ? "is-current" : k + 1 < co.step ? "is-done" : ""}"><span>${k + 1 < co.step ? "✓" : k + 1}</span>${s}</li>`).join("")}</ol>` : ""}
      <div class="co__body ${co.step === 4 ? "co__body--done" : ""}">
        <div class="co__main">${co.step === 1 ? stepSeats(sameDay) : co.step === 2 ? stepDetails() : co.step === 3 ? stepPay() : stepDone()}</div>
        ${co.step < 4 ? `<aside class="co__summary" id="co-summary">${summaryHTML()}</aside>` : ""}
      </div>
      <footer class="co__foot">
        <span>${I.lock}${t("co_demoNote")}</span>
        <a href="${esc(e.url)}" target="_blank" rel="noopener">${t("co_real")} ↗</a>
      </footer>`;
    bindCheckout(panel);
  }

  function stepSeats(sameDay) {
    const { hall } = co;
    return `
      ${sameDay.length > 1 ? `<div class="co__times" role="group" aria-label="${t("co_time")}">${sameDay.map((x) => `<button class="chip" data-co-time="${x.i}" aria-pressed="${x === co.e}">${esc(x.time)}</button>`).join("")}</div>` : ""}
      <h3 class="co__h">${t("co_pick")}</h3>
      <div class="legend">
        ${hall.zones.map((z) => `<span><i class="seat seat--${z.id}"></i>${money(z.price)}</span>`).join("")}
        <span><i class="seat seat--taken"></i>${t("co_taken")}</span>
        <span><i class="seat seat--mine"></i>${t("co_mine")}</span>
      </div>
      <div class="hall" id="co-hall">
        <div class="hall__inner">
          <div class="hall__stage"><svg viewBox="0 0 300 48" preserveAspectRatio="none" aria-hidden="true"><path d="M1 1 Q150 47 299 1" vector-effect="non-scaling-stroke"/></svg><span>${t("co_stage")}</span></div>
          ${hall.rows.map((row) => `<div class="hall__row">
            <span class="hall__num">${row.n}</span>
            <div class="hall__seats">${row.seats.map((s) => `${s.n === row.aisle + 1 ? '<span class="hall__aisle"></span>' : ""}<button class="seat seat--${s.taken ? "taken" : s.zone.id}${co.seats.has(s.id) ? " is-mine" : ""}" data-seat="${s.id}" ${s.taken ? "disabled" : ""} aria-pressed="${co.seats.has(s.id)}" aria-label="${esc(t("co_seatLabel", row.n, s.n, money(s.zone.price)))}" title="${esc(t("co_seatLabel", row.n, s.n, money(s.zone.price)))}"></button>`).join("")}</div>
            <span class="hall__num">${row.n}</span>
          </div>`).join("")}
        </div>
      </div>`;
  }

  function field(id, label, type, value, err, extra = "") {
    return `<label class="field ${err ? "has-error" : ""}">
      <span>${label}</span>
      <input id="co-${id}" name="${id}" type="${type}" value="${esc(value)}" ${extra}>
      ${err ? `<small class="field__err">${err}</small>` : ""}
    </label>`;
  }
  function stepDetails() {
    const er = co.errors;
    return `<h3 class="co__h">${t("co_contacts")}</h3>
      <form class="form" id="co-form" novalidate>
        ${field("name", t("co_name"), "text", co.name, er.name, 'autocomplete="name"')}
        ${field("email", t("co_email"), "email", co.email, er.email, 'autocomplete="email" inputmode="email"')}
        <p class="field__hint">${t("co_emailHint")}</p>
        ${field("phone", t("co_phone"), "tel", co.phone, "", 'autocomplete="tel" inputmode="tel"')}
        <label class="check ${er.agree ? "has-error" : ""}"><input type="checkbox" name="agree" ${co.agree ? "checked" : ""}><span>${t("co_agree")}</span></label>
        ${er.agree ? `<small class="field__err">${er.agree}</small>` : ""}
      </form>`;
  }
  const METHODS = [
    { id: "swedbank", label: "Swedbank", color: "#ee7023" }, { id: "seb", label: "SEB", color: "#41a62a" },
    { id: "lhv", label: "LHV", color: "#16131a" }, { id: "luminor", label: "Luminor", color: "#481c5c" },
    { id: "coop", label: "Coop Pank", color: "#0067b1" }, { id: "card", label: "card", color: "#16131a" },
    { id: "apple", label: "Apple Pay", color: "#000" }, { id: "google", label: "Google Pay", color: "#4285f4" },
  ];
  function stepPay() {
    return `<h3 class="co__h">${t("co_payWith")}</h3>
      <div class="methods" role="radiogroup">
        ${METHODS.map((m) => `<label class="method ${co.method === m.id ? "is-on" : ""}">
          <input type="radio" name="method" value="${m.id}" ${co.method === m.id ? "checked" : ""}>
          <span class="method__logo" style="--c:${m.color}">${m.id === "card" ? '<span class="pay pay--visa">VISA</span><span class="pay pay--mc"><i></i><i></i></span>' : esc(m.label)}</span>
          ${m.id === "card" ? `<span class="method__name">${t("co_card")}</span>` : ""}
        </label>`).join("")}
      </div>
      <p class="panel__note">${I.lock}<span>${t("secure")}</span></p>`;
  }

  function qrSVG(seed) {
    const r = rng(seed), n = 25, cell = 4;
    let rects = "";
    const finder = (x, y) => `<rect x="${x * cell}" y="${y * cell}" width="${7 * cell}" height="${7 * cell}" fill="#16131a"/><rect x="${(x + 1) * cell}" y="${(y + 1) * cell}" width="${5 * cell}" height="${5 * cell}" fill="#fff"/><rect x="${(x + 2) * cell}" y="${(y + 2) * cell}" width="${3 * cell}" height="${3 * cell}" fill="#16131a"/>`;
    const inFinder = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!inFinder(x, y) && r() < 0.5) rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}"/>`;
    return `<svg class="qr" viewBox="0 0 ${n * cell} ${n * cell}" aria-hidden="true"><rect width="100%" height="100%" fill="#fff"/><g fill="#16131a">${rects}</g>${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`;
  }
  function stepDone() {
    const o = co.order, e = co.e;
    return `<div class="done">
      <div class="done__icon"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
      <h3>${t("co_doneTitle")}</h3>
      <p>${esc(t("co_doneText", o.email))}</p>
      <p class="done__order">${t("co_order")} <b>${o.id}</b> · ${t("co_total")} <b>${money(o.total)}</b></p>
      <div class="tickets-demo">
        ${o.seats.map((s, k) => `<div class="eticket">
          <div class="eticket__main">
            <span class="eticket__n">${t("co_ticketN", k + 1, o.seats.length)}</span>
            <b class="eticket__title">${esc(e.title)}</b>
            <span>${esc(fLong(e.d))} · ${esc(e.time)}</span>
            <span>${esc(e.venue)}, ${esc(e.city)}</span>
            <div class="eticket__seat"><span><small>${t("co_row")}</small>${s.row}</span><span><small>${t("co_seat")}</small>${s.n}</span><span><small>€</small>${s.zone.price}</span></div>
          </div>
          <div class="eticket__stub">${qrSVG(seedOf(e) + s.row * 100 + s.n)}<small>${o.id}-${k + 1}</small></div>
        </div>`).join("")}
      </div>
      <div class="done__actions">
        <button class="btn btn--ghost" data-co-ics>${I.download}${t("addCal")}</button>
        <button class="btn btn--dark" data-co-close>${t("co_done")}</button>
      </div>
    </div>`;
  }

  function summaryHTML() {
    const sel = coSelected();
    const left = Math.max(0, co.holdUntil - Date.now());
    const mm = `${Math.floor(left / 60000)}:${String(Math.floor(left / 1000) % 60).padStart(2, "0")}`;
    const nextLabel = co.step === 3 ? t("co_pay", money(coTotal())) : t("co_next");
    return `
      <div class="sum__list">
        ${sel.length ? sel.map((s) => `<div class="sum__row"><span><i class="dot dot--${s.zone.id}"></i>${esc(t("co_rowSeat", s.row, s.n))}</span><b>${money(s.zone.price)}</b>${co.step === 1 ? `<button class="sum__x" data-unseat="${s.id}" aria-label="×">×</button>` : ""}</div>`).join("")
          : `<p class="sum__empty">${t("co_empty")}</p>`}
      </div>
      ${sel.length ? `<div class="sum__row sum__row--muted"><span>${t("co_fee")} · ${t("co_tickets", sel.length)}</span><b>${money(sel.length * FEE)}</b></div>` : ""}
      <div class="sum__total"><span>${t("co_total")}</span><b>${money(coTotal())}</b></div>
      ${co.holdUntil && sel.length ? `<p class="sum__hold" id="co-hold">⏱ ${t("co_hold", mm)}</p>` : ""}
      <div class="sum__actions">
        ${co.step > 1 ? `<button class="btn btn--ghost" data-co-back>${t("co_back")}</button>` : ""}
        <button class="btn btn--accent" data-co-next ${sel.length ? "" : "disabled"}>${nextLabel}</button>
      </div>
      ${co.step === 1 && sel.length >= MAX_SEATS ? `<p class="sum__note">${t("co_max")}</p>` : ""}`;
  }

  function refreshSummary() { const s = $("#co-summary"); if (s) { s.innerHTML = summaryHTML(); bindSummary(s); } }

  function startHold() {
    if (co.holdUntil) return;
    co.holdUntil = Date.now() + HOLD_MS;
    clearInterval(coTimer);
    coTimer = setInterval(() => {
      if (!co.open) return clearInterval(coTimer);
      if (Date.now() >= co.holdUntil && co.step < 4) {
        clearInterval(coTimer);
        Object.assign(co, { step: 1, seats: new Map(), holdUntil: 0 });
        renderCheckout(); toast(t("co_expired")); return;
      }
      const el = $("#co-hold");
      if (el) { const left = co.holdUntil - Date.now(); el.textContent = `⏱ ${t("co_hold", `${Math.floor(left / 60000)}:${String(Math.floor(left / 1000) % 60).padStart(2, "0")}`)}`; }
    }, 1000);
  }

  function validate() {
    const er = {};
    if (co.name.trim().length < 2) er.name = t("co_errName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(co.email.trim())) er.email = t("co_errEmail");
    if (!co.agree) er.agree = t("co_errAgree");
    co.errors = er;
    return !Object.keys(er).length;
  }

  function goNext() {
    if (co.step === 1) { if (!co.seats.size) return; co.step = 2; }
    else if (co.step === 2) { if (!validate()) { renderCheckout(); $("#co .has-error input")?.focus(); return; } co.step = 3; }
    else if (co.step === 3) {
      const btn = $("#co [data-co-next]");
      btn.disabled = true; btn.innerHTML = `<span class="spinner"></span>${t("co_processing")}`;
      setTimeout(() => {
        if (!co.open) return;
        co.order = { id: "TB-" + String(Math.abs(seedOf(co.e) + Date.now() % 100000)).slice(-6), email: co.email.trim(), total: coTotal(), seats: coSelected() };
        co.step = 4; clearInterval(coTimer); renderCheckout();
      }, 1400);
      return;
    }
    renderCheckout();
    $("#co .co__main")?.scrollTo?.(0, 0);
  }

  function bindSummary(root) {
    $("[data-co-next]", root)?.addEventListener("click", goNext);
    $("[data-co-back]", root)?.addEventListener("click", () => { co.step -= 1; co.errors = {}; renderCheckout(); });
    $$("[data-unseat]", root).forEach((b) => b.addEventListener("click", () => {
      co.seats.delete(b.dataset.unseat);
      const seat = $(`#co [data-seat="${b.dataset.unseat}"]`);
      if (seat) { seat.classList.remove("is-mine"); seat.setAttribute("aria-pressed", "false"); }
      refreshSummary();
    }));
  }

  function bindCheckout(panel) {
    $$("[data-co-close]", panel.parentElement).forEach((b) => (b.onclick = closeCheckout));
    $$("[data-co-time]", panel).forEach((b) => (b.onclick = () => { const x = eventByI.get(+b.dataset.coTime); Object.assign(co, { e: x, hall: buildHall(x), seats: new Map(), holdUntil: 0 }); renderCheckout(); }));
    const hall = $("#co-hall", panel);
    if (hall) {
      // Centre the map horizontally on narrow screens
      hall.scrollLeft = (hall.scrollWidth - hall.clientWidth) / 2;
      hall.addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-seat]"); if (!b || b.disabled) return;
        const id = b.dataset.seat;
        if (co.seats.has(id)) co.seats.delete(id);
        else {
          if (co.seats.size >= MAX_SEATS) { toast(t("co_max")); return; }
          const [r, n] = id.split("-").map(Number);
          co.seats.set(id, co.hall.rows[r - 1].seats[n - 1]);
          startHold();
        }
        b.classList.toggle("is-mine", co.seats.has(id));
        b.setAttribute("aria-pressed", co.seats.has(id));
        refreshSummary();
      });
    }
    const form = $("#co-form", panel);
    if (form) {
      form.addEventListener("input", (ev) => {
        const el = ev.target;
        if (el.name === "agree") co.agree = el.checked; else co[el.name] = el.value;
      });
      form.addEventListener("submit", (ev) => { ev.preventDefault(); goNext(); });
    }
    $$("input[name=method]", panel).forEach((r) => r.addEventListener("change", () => {
      co.method = r.value;
      $$(".method", panel).forEach((m) => m.classList.toggle("is-on", $("input", m).checked));
    }));
    $("[data-co-ics]", panel)?.addEventListener("click", () => downloadIcs(co.e));
    const s = $("#co-summary", panel); if (s) bindSummary(s);
  }

  document.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-buy]");
    if (!b) return;
    ev.preventDefault();
    openCheckout(+b.dataset.buy);
  });
  document.addEventListener("keydown", (ev) => {
    if (!co.open) return;
    if (ev.key === "Escape") closeCheckout();
    if (ev.key === "Tab") { // keep focus inside the dialog
      const f = $$('#co button:not([disabled]), #co a[href], #co input', document).filter((x) => x.offsetParent);
      if (!f.length) return;
      if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); }
      else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); }
    }
  });

  /* ============================================================== ROUTER */
  let pendingScroll = null, homeScroll = 0, lastRoute = null;
  function getRoute() {
    const h = location.hash.slice(1) || "/";
    const [path, qs] = h.split("?");
    const params = new URLSearchParams(qs || "");
    let m;
    if ((m = path.match(/^\/e\/(.+)$/))) return { name: "event", slug: decodeURIComponent(m[1]), params };
    if ((m = path.match(/^\/t\/(.+)$/))) return { name: "tour", slug: decodeURIComponent(m[1]), params };
    if ((m = path.match(/^\/s\/(.+)$/))) return { name: "show", slug: decodeURIComponent(m[1]), params };
    return { name: "home", params };
  }
  function route() {
    const r = getRoute(), main = $("#main");
    if (co.open) closeCheckout();
    if (lastRoute === "home") homeScroll = scrollY;
    document.body.classList.remove("has-buybar", "glass-head");
    document.title = "Ticket Best Europe — " + (state.lang === "ru" ? "билеты на концерты и шоу" : state.lang === "en" ? "concert & show tickets" : "piletid kontsertidele ja etendustele");
    if (r.name === "event") renderEvent(main, r.slug, r.params);
    else if (r.name === "tour") renderTour(main, r.slug);
    else if (r.name === "show") renderShow(main, r.slug);
    else renderHome(main);
    if ($(".p-hero__glow", main)) document.body.classList.add("glass-head");

    $$("[data-back]", main).forEach((b) => (b.onclick = () => (history.length > 1 && lastNav ? history.back() : (location.hash = "#/"))));

    if (pendingScroll) { const target = $(pendingScroll); pendingScroll = null; target?.scrollIntoView(); }
    else if (r.name === "home" && lastRoute && lastRoute !== "home") scrollTo(0, homeScroll);
    else scrollTo(0, 0);
    lastRoute = r.name;
    lastNav = true;
  }
  let lastNav = false;

  /* ================================================================ BOOT */
  const header = $(".header");
  const setStickyTop = () => document.documentElement.style.setProperty("--sticky-top", header.offsetHeight + "px");
  new ResizeObserver(setStickyTop).observe(header);
  setStickyTop();
  applyStatic();
  initControls();
  initSearch();
  initCookie();
  addEventListener("hashchange", route);
  // Phone and desktop have different home pages — re-render when crossing the breakpoint
  mqMobile.addEventListener("change", () => { if (getRoute().name === "home") route(); });
  route();
  lastNav = false;
})();
