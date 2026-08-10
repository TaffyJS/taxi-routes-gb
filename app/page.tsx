"use client";

import { useEffect, useMemo, useState } from "react";

type StudyMode = "random" | "manual";
type PlaceType = "institution" | "tourism" | "street";

type StudyItem = {
  id: string;
  name: string;
  street: string;
  address: string;
  type: PlaceType;
  hint: string;
};

type RouteItem = {
  id: string;
  from: string;
  to: string;
  path: string[];
};

const places: StudyItem[] = [
  { id: "court", name: "Районен съд Габрово", street: "пл. Възраждане", address: "пл. Възраждане No 1", type: "institution", hint: "Център, около пл. Възраждане." },
  { id: "municipality", name: "Община Габрово", street: "пл. Възраждане", address: "пл. Възраждане No 3", type: "institution", hint: "В същата зона като съда." },
  { id: "province", name: "Областна управа", street: "пл. Възраждане", address: "пл. Възраждане No 5", type: "institution", hint: "Административна сграда на площада." },
  { id: "police", name: "РПУ Габрово", street: "ул. Орловска", address: "ул. Орловска No 50", type: "institution", hint: "Запомни Орловска като улица с институции и спортни обекти." },
  { id: "kat", name: "КАТ Габрово", street: "бул. Трети март", address: "бул. Трети март No 175", type: "institution", hint: "На един от дългите булеварди в града." },
  { id: "fire", name: "Пожарна Габрово", street: "ул. Ген. Николов", address: "ул. Ген. Николов", type: "institution", hint: "Кратък адрес, запомни името на генерала." },
  { id: "bus", name: "Автогара Габрово", street: "ул. Стефан Караджа", address: "ул. Стефан Караджа No 2", type: "institution", hint: "Начална точка в много маршрути." },
  { id: "aa", name: "ОО АА Габрово", street: "ул. Стефан Караджа", address: "ул. Стефан Караджа No 2", type: "institution", hint: "Същият адрес като автогарата." },
  { id: "rail", name: "ЖП гара Габрово", street: "пл. Марсел Де Бископ", address: "пл. Марсел Де Бископ", type: "institution", hint: "Гарата е на площад, не на улица." },
  { id: "hospital", name: "МБАЛ Д-р Т. Венкова", street: "ул. Илиев Детски", address: "ул. Илиев Детски No 1", type: "institution", hint: "Болницата е добра котва за маршрути." },
  { id: "nap", name: "ТД НАП", street: "ул. Радецка", address: "ул. Радецка No 11", type: "institution", hint: "Данъчната служба е на Радецка." },
  { id: "noi", name: "ТД НОИ", street: "ул. Николаевска", address: "ул. Николаевска No 17", type: "institution", hint: "Не бъркай с Историческия музей, който също е на Николаевска." },
  { id: "balkan", name: "Хотел Балкан", street: "ул. Емануил Манолов", address: "ул. Емануил Манолов No 14", type: "tourism", hint: "Хотел в централната част." },
  { id: "gabrovo-hotel", name: "Хотел Габрово", street: "бул. Хемус", address: "бул. Хемус No 4", type: "tourism", hint: "Името на хотела съвпада с града." },
  { id: "orlovez", name: "Хотел Орловец", street: "ул. Орловска", address: "ул. Орловска No 106", type: "tourism", hint: "Орловска се среща и при РПУ, и при спортната зала." },
  { id: "education-museum", name: "Музей на образованието", street: "ул. Априловска", address: "ул. Априловска No 15", type: "tourism", hint: "Свържи го с Априловската гимназия." },
  { id: "history-museum", name: "Исторически музей", street: "ул. Николаевска", address: "ул. Николаевска No 10", type: "tourism", hint: "Близо по памет до адреса на НОИ, но с друг номер." },
  { id: "theatre", name: "Драматичен театър", street: "пл. Възраждане", address: "пл. Възраждане No 2", type: "tourism", hint: "Трети важен обект на пл. Възраждане." },
  { id: "tu", name: "ТУ Ректорат", street: "ул. Хаджи Димитър", address: "ул. Хаджи Димитър No 4", type: "tourism", hint: "Учебен обект, запомни Хаджи Димитър." },
  { id: "pmg", name: "ПМГ Габрово", street: "ул. Елин Пелин", address: "ул. Елин Пелин No 2", type: "tourism", hint: "Име на писател като улица." },
  { id: "ptg", name: "ПТГ Д-р Никола Василиади", street: "ул. Брянска", address: "ул. Брянска No 3", type: "tourism", hint: "Брянска участва и в няколко маршрута." },
  { id: "aprilov", name: "Априловска гимназия", street: "ул. Априловска", address: "ул. Априловска No 15", type: "tourism", hint: "Същият адрес като Музея на образованието." },
  { id: "sports", name: "Спортна зала", street: "ул. Орловска", address: "ул. Орловска No 111", type: "tourism", hint: "Орловска с номер над 100." },
  { id: "planetarium", name: "Планетариум", street: "ул. Петкова Нива", address: "ул. Петкова Нива No 5", type: "tourism", hint: "Запомни Петкова Нива като по-рядко срещана улица." },
  { id: "humor", name: "Дом на хумора и сатирата", street: "ул. Брянска", address: "ул. Брянска No 68", type: "tourism", hint: "Един от най-разпознаваемите обекти в Габрово." },
];

const routes: RouteItem[] = [
  { id: "bus-mladost", from: "Автогара", to: "кв. Младост", path: ["ул. Стефан Караджа", "бул. Могильов", "ул. Свищовска", "кв. Младост"] },
  { id: "bus-hospital", from: "Автогара", to: "МБАЛ Д-р Т. Венкова", path: ["ул. Д-р Н. Василиади", "ул. Стефан Караджа", "ул. Емануил Манолов", "ул. Баждар", "ул. Ал. Константинов", "МБАЛ Д-р Т. Венкова"] },
  { id: "may-trendafila", from: "пл. Първи май 1876", to: "кв. Трендафила", path: ["пл. Първи май 1876", "моста Игото", "ул. Брянска", "ул. Стефан Караджа", "бул. Могильов", "ул. Тота Венкова", "кв. Трендафила"] },
  { id: "rail-varovnik", from: "ЖП гара Габрово", to: "кв. Варовник", path: ["пл. Марсел Де Бископ", "ул. Брянска", "ул. Н. Василиади", "ул. Стефан Караджа", "ул. В. Друмев", "кв. Варовник"] },
  { id: "vazrajdane-smirnenski", from: "пл. Възраждане", to: "кв. Смирненски", path: ["пл. Възраждане", "бул. Априлов", "бул. Трети март", "бул. Вапцаров", "кв. Смирненски"] },
  { id: "vazrajdane-sports", from: "пл. Възраждане", to: "Спортна зала", path: ["пл. Възраждане", "ул. Скобелевска", "ул. Брянска", "ул. Н. Василиади", "Спортна зала"] },
  { id: "bus-emo", from: "Автогара Габрово", to: "ЕМО Етър", path: ["ул. Д-р Н. Василиади", "ул. Брянска", "ул. Скобелевска", "бул. Априлов", "бул. Хемус", "бул. Столетов", "бул. Ген. Дерожински", "ЕМО Етър"] },
];

const streetPool = Array.from(
  new Set([
    ...places.map((place) => place.street),
    ...routes.flatMap((route) => route.path.filter((part) => /^(ул\.|бул\.|пл\.)/.test(part))),
  ]),
).sort((a, b) => a.localeCompare(b, "bg"));

function pickMany<T>(items: T[], count: number) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count);
}

function buildTest() {
  return {
    streets: pickMany(streetPool, Math.min(10, streetPool.length)),
    routes: pickMany(routes, Math.min(2, routes.length)),
  };
}

function queryFor(item: StudyItem | string) {
  const text = typeof item === "string" ? item : `${item.address}, ${item.name}`;
  return `${text}, Габрово, България`;
}

function MapPanel({ selected }: { selected: StudyItem | string }) {
  const [marker, setMarker] = useState<{ lat: string; lon: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const query = queryFor(selected);
  const searchUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setMarker(null);

    fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`)
      .then((response) => response.ok ? response.json() : [])
      .then((results: Array<{ lat: string; lon: string }>) => {
        if (!ignore && results[0]) setMarker({ lat: results[0].lat, lon: results[0].lon });
      })
      .catch(() => undefined)
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  const src = marker
    ? (() => {
        const lat = Number(marker.lat);
        const lon = Number(marker.lon);
        const box = [lon - 0.008, lat - 0.006, lon + 0.008, lat + 0.006].join("%2C");
        return `https://www.openstreetmap.org/export/embed.html?bbox=${box}&layer=mapnik&marker=${marker.lat}%2C${marker.lon}`;
      })()
    : `https://www.openstreetmap.org/export/embed.html?bbox=25.25%2C42.82%2C25.37%2C42.91&layer=mapnik`;

  return (
    <section className="map-panel" aria-label="Карта">
      <div className="map-toolbar">
        <div>
          <p className="eyebrow">Карта без API key</p>
          <h2>{typeof selected === "string" ? selected : selected.name}</h2>
        </div>
        <a href={searchUrl} target="_blank" rel="noreferrer">Отвори в OSM</a>
      </div>
      <div className="map-frame">
        <iframe title={`Карта за ${query}`} src={src} loading="lazy" />
        <div className={`visual-pin ${marker ? "" : "fallback"}`} aria-hidden="true">
          <span />
        </div>
      </div>
      <p className="map-note">
        {loading ? "Търся точен маркер..." : marker ? "Маркерът е центриран върху намереното място." : "Показана е карта на Габрово с ориентировъчен маркер. Отвори търсенето за по-точна позиция."}
      </p>
    </section>
  );
}

export default function Home() {
  const [view, setView] = useState<"study" | "test">("study");
  const [studyMode, setStudyMode] = useState<StudyMode>("random");
  const [selectedId, setSelectedId] = useState(places[0].id);
  const [test, setTest] = useState(buildTest);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const selected = useMemo(() => places.find((place) => place.id === selectedId) ?? places[0], [selectedId]);
  const randomItem = () => setSelectedId(pickMany(places, 1)[0].id);
  const relatedRoutes = routes.filter((route) => route.path.some((part) => part.includes(selected.street.replace(/^(ул\.|бул\.|пл\.) /, ""))));

  return (
    <main>
      <header className="app-header">
        <div>
          <p className="eyebrow">Такси изпит Габрово</p>
          <h1>Учи улици, обекти и маршрути</h1>
          <p className="lead">Бързо упражнение по списъците от таблото: избираш режим, гледаш адреса на карта и после пускаш тест с 10 улици и 2 маршрута.</p>
        </div>
        <nav className="main-tabs" aria-label="Основна навигация">
          <button className={view === "study" ? "active" : ""} onClick={() => setView("study")}>Учи</button>
          <button className={view === "test" ? "active" : ""} onClick={() => setView("test")}>Тест</button>
        </nav>
      </header>

      {view === "study" ? (
        <div className="workspace">
          <section className="study-panel">
            <div className="mode-row" role="tablist" aria-label="Режим на учене">
              <button className={studyMode === "random" ? "active" : ""} onClick={() => setStudyMode("random")}>Ти избираш</button>
              <button className={studyMode === "manual" ? "active" : ""} onClick={() => setStudyMode("manual")}>Аз избирам от лист</button>
            </div>

            {studyMode === "random" ? (
              <div className="focus-card">
                <p className="eyebrow">{selected.type === "institution" ? "Институция" : "Обект"}</p>
                <h2>{selected.name}</h2>
                <dl>
                  <div><dt>Улица</dt><dd>{selected.street}</dd></div>
                  <div><dt>Адрес</dt><dd>{selected.address}</dd></div>
                  <div><dt>Подсказка</dt><dd>{selected.hint}</dd></div>
                </dl>
                <button className="primary" onClick={randomItem}>Дай ми следваща</button>
              </div>
            ) : (
              <div className="manual-layout">
                <div className="street-list" aria-label="Списък с улици и обекти">
                  {places.map((place) => (
                    <button key={place.id} className={selected.id === place.id ? "selected" : ""} onClick={() => setSelectedId(place.id)}>
                      <span>{place.name}</span>
                      <small>{place.address}</small>
                    </button>
                  ))}
                </div>
                <div className="focus-card compact">
                  <p className="eyebrow">Избран запис</p>
                  <h2>{selected.name}</h2>
                  <p>{selected.address}</p>
                  <p className="muted">{selected.hint}</p>
                </div>
              </div>
            )}

            <div className="route-strip">
              <p className="eyebrow">Свързани маршрути</p>
              {relatedRoutes.length ? relatedRoutes.slice(0, 3).map((route) => (
                <article key={route.id}>
                  <strong>{route.from} - {route.to}</strong>
                  <span>{route.path.join(" -> ")}</span>
                </article>
              )) : <span className="muted">Няма пряко свързан маршрут в текущия списък.</span>}
            </div>
          </section>

          <MapPanel selected={selected} />
        </div>
      ) : (
        <section className="test-panel">
          <div className="test-head">
            <div>
              <p className="eyebrow">Тест комплект</p>
              <h2>10 улици и 2 маршрута</h2>
            </div>
            <button className="primary" onClick={() => { setTest(buildTest()); setRevealed({}); }}>Нов тест</button>
          </div>

          <div className="question-grid">
            {test.streets.map((street, index) => {
              const key = `street-${index}`;
              const examples = places.filter((place) => place.street === street).map((place) => place.name).slice(0, 3);
              return (
                <article className="question-card" key={key}>
                  <span className="counter">{index + 1}</span>
                  <h3>{street}</h3>
                  <label>
                    Напиши поне един обект или посока, с която я свързваш
                    <input placeholder="Моят отговор..." />
                  </label>
                  <button onClick={() => setRevealed((state) => ({ ...state, [key]: !state[key] }))}>
                    {revealed[key] ? "Скрий отговор" : "Покажи подсказка"}
                  </button>
                  {revealed[key] && <p className="answer">{examples.length ? examples.join(", ") : "Среща се в маршрутите."}</p>}
                </article>
              );
            })}

            {test.routes.map((route, index) => {
              const key = `route-${index}`;
              return (
                <article className="question-card route-question" key={key}>
                  <span className="counter">M{index + 1}</span>
                  <h3>{route.from} - {route.to}</h3>
                  <label>
                    Напиши улиците по ред
                    <textarea placeholder="Маршрут..." />
                  </label>
                  <button onClick={() => setRevealed((state) => ({ ...state, [key]: !state[key] }))}>
                    {revealed[key] ? "Скрий маршрут" : "Покажи маршрут"}
                  </button>
                  {revealed[key] && <p className="answer">{route.path.join(" -> ")}</p>}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
