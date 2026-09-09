
import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "amunt-members";

const COLORS = [
  "#dc2626",
  "#2563eb",
  "#16a34a",
  "#7c3aed",
  "#ea580c",
  "#db2777",
];

const CASTELLS = [
  ["pd4", "Pilar de 4", 1, 4, 18, 0, 1, 30, 35, "p"],
  ["4d6", "4 de 6", 4, 6, 32, 0, 1, 120, 145, ""],
  ["3d6", "3 de 6", 3, 6, 34, 0, 1, 125, 150, ""],
  ["3d6a", "3 de 6 amb agulla", 3, 6, 43, 160, 1, 165, 185, "a"],
  ["4d6a", "4 de 6 amb agulla", 4, 6, 46, 210, 1, 170, 190, "a"],
  ["7d6", "7 de 6", 7, 6, 49, 270, 1, 160, 195, ""],
  ["5d6", "5 de 6", 5, 6, 51, 330, 1, 175, 205, ""],
  ["2d6", "2 de 6", 2, 6, 60, 620, 1, 250, 300, ""],
  ["pd5", "Pilar de 5", 1, 5, 62, 700, 1, 260, 315, "p"],
  ["9d6", "9 de 6", 9, 6, 64, 790, 1, 295, 355, ""],
  ["4d7", "4 de 7", 4, 7, 66, 900, 2, 325, 395, ""],
  ["3d7", "3 de 7", 3, 7, 68, 1020, 2, 345, 415, ""],
  ["4d7a", "4 de 7 amb agulla", 4, 7, 70, 1160, 2, 465, 515, "a"],
  ["3d7a", "3 de 7 amb agulla", 3, 7, 71, 1300, 2, 485, 545, "a"],
  ["5d7", "5 de 7", 5, 7, 73, 1600, 2, 470, 565, ""],
  ["2d7", "2 de 7", 2, 7, 78, 2500, 2, 670, 805, ""],
  ["4d8", "4 de 8", 4, 8, 80, 2750, 3, 700, 845, ""],
  ["pd6", "Pilar de 6", 1, 6, 82, 3000, 3, 765, 920, "p"],
  ["3d8", "3 de 8", 3, 8, 83, 3250, 3, 805, 970, ""],
  ["2d8f", "2 de 8 amb folre", 2, 8, 86, 3900, 4, 1005, 1210, "f"],
  ["pd7f", "Pilar de 7 amb folre", 1, 7, 87, 4250, 4, 1055, 1270, "pf"],
  ["5d8", "5 de 8", 5, 8, 88, 4600, 4, 1150, 1385, ""],
  ["4d9f", "4 de 9 amb folre", 4, 9, 93, 6700, 5, 1510, 1820, "f"],
  ["3d9f", "3 de 9 amb folre", 3, 9, 94, 7200, 5, 1585, 1910, "f"],
  ["2d9fm", "2 de 9 amb folre i manilles", 2, 9, 96, 9100, 6, 2265, 2730, "fm"],
  ["pd8fm", "Pilar de 8 amb folre i manilles", 1, 8, 97, 9800, 6, 2380, 2870, "pfm"],
  ["4d9", "4 de 9 sense folre", 4, 9, 98, 13700, 7, 3405, 4105, ""],
  ["2d8", "2 de 8 sense folre", 2, 8, 98, 14600, 7, 3575, 4310, ""],
  ["3d10fm", "3 de 10 amb folre i manilles", 3, 10, 99, 15600, 8, 3755, 4525, "fm"],
  ["4d10fm", "4 de 10 amb folre i manilles", 4, 10, 99, 16600, 8, 4095, 4930, "fm"],
  ["pd9fmp", "Pilar de 9 amb folre, manilles i puntals", 1, 9, 99, 20000, 9, 4920, 5925, "pfmx"],
  ["3d9", "3 de 9 sense folre", 3, 9, 100, 21200, 9, 5165, 6220, ""],
  ["pd7", "Pilar de 7 sense folre", 1, 7, 100, 22500, 9, 5280, 6360, "p"],
  ["2d10fmp", "2 de 10 amb folre, manilles i puntals", 2, 10, 100, 23900, 10, 5630, 6780, "fmx"],
  ["4d10f", "4 de 10 amb folre", 4, 10, 100, 25400, 10, 5910, 7120, "f"],
  ["3d10f", "3 de 10 amb folre", 3, 10, 100, 27000, 10, 6205, 7475, "f"],
].map((item) => ({
  id: item[0],
  name: item[1],
  w: item[2],
  h: item[3],
  difficulty: item[4],
  unlock: item[5],
  season: item[6],
  loaded: item[7],
  unloaded: item[8],
  pillar: item[9].includes("p"),
  folre: item[9].includes("f"),
  manilles: item[9].includes("m"),
  puntals: item[9].includes("x"),
}));

const EVENTS = [
  [2, "Mostra d'entitats", "🏘️", 0, 5],
  [4, "Festa Major del Barri", "🎉", 5, 10],
  [6, "Diada de la Plaça Nova", "☀️", 8, 12],
  [8, "Trobada de Colles Novelles", "⚔️", 13, 18],
  [11, "Festa Major", "🎺", 16, 25],
  [14, "Gran Diada de Tardor", "🏆", 22, 35],
].map((item) => ({
  week: item[0],
  name: item[1],
  icon: item[2],
  pressure: item[3],
  fans: item[4],
}));

const INITIAL_GAME = {
  week: 1,
  season: 1,
  prestige: 0,
  energy: 88,
  morale: 70,
  members: 42,
  tests: 6,
  unlocked: ["pd4", "3d6", "4d6"],
  mastery: { pd4: 38, "3d6": 28, "4d6": 25 },
  prep: { pd4: 38, "3d6": 28, "4d6": 25 },
  attended: [],
  proposal: null,
  declined: [],
  falls: 0,
  actedThisWeek: false,
};

const clamp = (number) => Math.max(0, Math.min(100, number));

function feel(value) {
  if (value >= 68) return "Molt preparat";
  if (value >= 42) return "Amb opcions";
  if (value >= 22) return "Just";
  return "Fora de programa";
}

function loadGame() {
  try {
    const storedGame = localStorage.getItem(STORAGE_KEY);
    return storedGame ? JSON.parse(storedGame) : null;
  } catch (error) {
    return null;
  }
}

function seasonDecay(game) {
  const prep = { ...game.prep };

  game.unlocked.forEach((id) => {
    const castell = CASTELLS.find((item) => item.id === id);
    const mastery = game.mastery[id] || 0;

    let loss = castell.h <= 6 ? 4 : castell.h === 7 ? 10 : castell.h === 8 ? 18 : 28;

    if (castell.folre) loss += 8;
    if (castell.manilles) loss += 8;
    if (castell.puntals) loss += 7;

    prep[id] = Math.max(
      Math.round(mastery * 0.52),
      (prep[id] || 0) - loss,
    );
  });

  return { ...game, prep };
}

function maybePropose(game) {
  if (game.proposal) return game;

  const candidate = CASTELLS.find(
    (castell) =>
      !game.unlocked.includes(castell.id) &&
      !game.declined.includes(castell.id) &&
      castell.season <= game.season &&
      castell.unlock <= game.prestige,
  );

  return candidate ? { ...game, proposal: candidate.id } : game;
}

function recruitment(event, results, game) {
  const valid = results.filter((result) => result.valid).length;
  const falls = results.filter((result) => result.fall).length;

  let change = Math.floor(event.fans / 5) + valid * 2 - falls * 3;

  if (game.morale < 35) change -= 2;
  if (valid === 3) change += 2;

  return Math.max(-6, Math.min(10, change));
}

function structure(castell) {
  const rows = [{ type: "pinya", label: "Pinya i baixos" }];

  if (castell.folre) rows.push({ type: "support", label: "Folre" });
  if (castell.manilles) rows.push({ type: "support", label: "Manilles" });
  if (castell.puntals) rows.push({ type: "support", label: "Puntals" });

  if (castell.pillar) {
    for (let index = 0; index < castell.h - 1; index += 1) {
      const isEnxaneta = index === castell.h - 2;
      rows.push({
        type: isEnxaneta ? "enxaneta" : "trunk",
        number: 1,
        label: isEnxaneta ? "Enxaneta" : `Pis ${index + 2}`,
      });
    }
    return rows;
  }

  const supportFloors =
    Number(castell.folre) +
    Number(castell.manilles) +
    Number(castell.puntals);

  const visibleTrunkFloors = Math.max(0, castell.h - 4 - supportFloors);
  const floorNames = ["Segons", "Terços", "Quarts", "Quints", "Sisens"];

  for (let index = 0; index < visibleTrunkFloors; index += 1) {
    rows.push({
      type: "trunk",
      number: castell.w,
      label: floorNames[index] || `Planta ${index + 2}`,
    });
  }

  rows.push(
    { type: "dosos", number: 2, label: "Dosos" },
    { type: "aixecador", number: 1, label: "Aixecador" },
    { type: "enxaneta", number: 1, label: "Enxaneta" },
  );

  return rows;
}

export default function App() {
  const saved = typeof window !== "undefined" ? loadGame() : null;

  const [screen, setScreen] = useState(saved ? "hub" : "welcome");
  const [club, setClub] = useState(
    saved?.club || { name: "", town: "", color: COLORS[0] },
  );
  const [game, setGame] = useState(saved?.game || saved?.g || INITIAL_GAME);
  const [selectedCastell, setSelectedCastell] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!club.name) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ club, game }),
    );
  }, [club, game]);

  const availableCastells = CASTELLS.filter((castell) =>
    game.unlocked.includes(castell.id),
  );

  const currentEvent = EVENTS.find(
    (event) =>
      event.week === game.week &&
      !game.attended.includes(event.name),
  );

  function advanceWeek() {
    if (game.week === 16) {
      setGame((current) =>
        seasonDecay({
          ...current,
          week: 1,
          season: current.season + 1,
          energy: 94,
          tests: 6,
          attended: [],
          proposal: null,
          declined: [],
          actedThisWeek: false,
        }),
      );
      setScreen("season");
      return;
    }

    const noPerformanceBonus = game.actedThisWeek ? 0 : 5;
    const unusedTestBonus = Math.min(4, game.tests);
    const recoveredEnergy = 30 + noPerformanceBonus + unusedTestBonus;

    setGame((current) =>
      maybePropose({
        ...current,
        week: current.week + 1,
        energy: clamp(current.energy + recoveredEnergy),
        tests: 6,
        actedThisWeek: false,
      }),
    );
  }

  function startPerformance(event) {
    setSelectedEvent(event);
    setPerformance({
      round: 1,
      valid: 0,
      used: [],
      results: [],
      phase: "castells",
    });
    setScreen("act");
  }

  function attemptCastell(castell, isPillar = false) {
    const preparation = game.prep[castell.id] || 0;
    const score =
      preparation +
      game.energy * 0.1 +
      game.morale * 0.18 -
      (castell.difficulty - 25) * 0.58 -
      selectedEvent.pressure;

    const roll = Math.random() * 100;

    let result;
    if (roll < score + 23) result = "Descarregat";
    else if (roll < score + 41) result = "Carregat";
    else if (roll < score + 68) result = "Intent desmuntat";
    else result = "Intent";

    const valid = result === "Descarregat" || result === "Carregat";
    const fall = result === "Intent";
    const cost =
      result === "Descarregat"
        ? 3
        : result === "Carregat"
          ? 5
          : result === "Intent desmuntat"
            ? 2
            : 6;

    const points =
      result === "Descarregat"
        ? castell.unloaded
        : result === "Carregat"
          ? castell.loaded
          : 0;

    setGame((current) =>
      maybePropose({
        ...current,
        energy: clamp(current.energy - cost),
        morale: clamp(
          current.morale +
            (result === "Descarregat" ? 4 : fall ? -5 : 0),
        ),
        falls: current.falls + (fall ? 1 : 0),
        prestige: current.prestige + points,
        actedThisWeek: true,
        prep: {
          ...current.prep,
          [castell.id]: clamp(preparation + (valid ? 5 : 1)),
        },
      }),
    );

    setPerformance((current) => {
      if (isPillar) {
        return {
          ...current,
          pillar: { name: castell.name, result, valid, fall },
          phase: "done",
        };
      }

      const used = valid
        ? [...current.used, castell.id]
        : current.used;
      const validCount = current.valid + (valid ? 1 : 0);
      const nextRound = current.round + 1;

      const remaining = availableCastells.filter(
        (candidate) =>
          !candidate.pillar &&
          !used.includes(candidate.id) &&
          (game.prep[candidate.id] || 0) >= 22,
      );

      return {
        ...current,
        used,
        valid: validCount,
        round: nextRound,
        results: [
          ...current.results,
          { name: castell.name, result, valid, fall },
        ],
        phase:
          validCount >= 3 || nextRound > 5 || remaining.length === 0
            ? "pillar"
            : "castells",
      };
    });
  }

  if (screen === "welcome") {
    return <Welcome saved={Boolean(saved)} go={setScreen} />;
  }

  if (screen === "setup") {
    return (
      <Setup
        club={club}
        setClub={setClub}
        done={() => {
          if (!club.name || !club.town) return;
          setGame(INITIAL_GAME);
          setScreen("hub");
        }}
      />
    );
  }

  if (screen === "proposal") {
    const proposedCastell = CASTELLS.find(
      (castell) => castell.id === game.proposal,
    );

    if (!proposedCastell) {
      setScreen("hub");
      return null;
    }

    return (
      <Proposal
        castell={proposedCastell}
        accept={() => {
          setGame((current) => ({
            ...current,
            unlocked: [...current.unlocked, proposedCastell.id],
            prep: { ...current.prep, [proposedCastell.id]: 5 },
            mastery: { ...current.mastery, [proposedCastell.id]: 5 },
            proposal: null,
          }));
          setScreen("hub");
        }}
        later={() => {
          setGame((current) => ({
            ...current,
            declined: [...current.declined, proposedCastell.id],
            proposal: null,
          }));
          setScreen("hub");
        }}
      />
    );
  }

  if (screen === "choose") {
    return (
      <Choose
        game={game}
        available={availableCastells}
        go={(castell) => {
          setSelectedCastell(castell);
          setScreen("training");
        }}
        back={() => setScreen("hub")}
      />
    );
  }

  if (screen === "training") {
    return (
      <Training
        castell={selectedCastell}
        color={club.color}
        done={(outcome) => {
          const before = game.prep[selectedCastell.id] || 0;
          const after = clamp(before + outcome.gain);

          setGame((current) =>
            maybePropose({
              ...current,
              tests: current.tests - 1,
              energy: clamp(current.energy - outcome.cost),
              morale: clamp(
                current.morale +
                  (outcome.result === "Caiguda" ? -3 : 1),
              ),
              falls:
                current.falls +
                (outcome.result === "Caiguda" ? 1 : 0),
              prep: { ...current.prep, [selectedCastell.id]: after },
              mastery: {
                ...current.mastery,
                [selectedCastell.id]: clamp(
                  (current.mastery[selectedCastell.id] || 0) +
                    outcome.gain * 0.3,
                ),
              },
            }),
          );

          setSummary({
            ...outcome,
            before,
            after,
            name: selectedCastell.name,
          });
          setScreen("summary");
        }}
      />
    );
  }

  if (screen === "summary") {
    return (
      <TrainingSummary
        data={summary}
        next={() => setScreen("choose")}
      />
    );
  }

  if (screen === "calendar") {
    return (
      <Calendar
        game={game}
        back={() => setScreen("hub")}
        start={startPerformance}
      />
    );
  }

  if (screen === "act") {
    return (
      <Performance
        event={selectedEvent}
        performance={performance}
        available={availableCastells}
        game={game}
        attempt={attemptCastell}
        finish={() => {
          const allResults = [
            ...performance.results,
            ...(performance.pillar ? [performance.pillar] : []),
          ];
          const memberChange = recruitment(
            selectedEvent,
            allResults,
            game,
          );

          setGame((current) =>
            maybePropose({
              ...current,
              attended: [...current.attended, selectedEvent.name],
              members: Math.max(15, current.members + memberChange),
            }),
          );

          setSummary({ performance: true, memberChange });
          setScreen("performanceSummary");
        }}
      />
    );
  }

  if (screen === "performanceSummary") {
    return (
      <PerformanceSummary
        memberChange={summary.memberChange}
        next={() => setScreen("hub")}
      />
    );
  }

  if (screen === "season") {
    return (
      <Season
        game={game}
        next={() => setScreen("hub")}
      />
    );
  }

  return (
    <Hub
      club={club}
      game={game}
      available={availableCastells}
      currentEvent={currentEvent}
      proposedCastell={
        game.proposal
          ? CASTELLS.find((castell) => castell.id === game.proposal)
          : null
      }
      openProposal={() => setScreen("proposal")}
      train={() => setScreen("choose")}
      calendar={() => setScreen("calendar")}
      advance={advanceWeek}
      act={() => startPerformance(currentEvent)}
      reset={() => {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
      }}
    />
  );
}

function Welcome({ saved, go }) {
  return (
    <main className="hero">
      <div className="human">🙂<br />😤<br />😤<br /><small>👥👥👥</small></div>
      <h1>AMUNT!</h1>
      <p>Simulador casteller</p>
      {saved && <button onClick={() => go("hub")}>CONTINUAR</button>}
      <button onClick={() => go("setup")}>NOVA COLLA</button>
    </main>
  );
}

function Setup({ club, setClub, done }) {
  return (
    <main className="wrap">
      <h1>Funda la teva colla</h1>
      <input
        placeholder="Nom de la colla"
        value={club.name}
        onChange={(event) => setClub({ ...club, name: event.target.value })}
      />
      <input
        placeholder="Ciutat o poble"
        value={club.town}
        onChange={(event) => setClub({ ...club, town: event.target.value })}
      />
      <div className="colors">
        {COLORS.map((color) => (
          <button
            key={color}
            aria-label="Color de camisa"
            className={club.color === color ? "selected" : ""}
            style={{ background: color }}
            onClick={() => setClub({ ...club, color })}
          />
        ))}
      </div>
      <button onClick={done}>COMENÇA LA HISTÒRIA</button>
    </main>
  );
}

function Hub({
  club,
  game,
  available,
  currentEvent,
  proposedCastell,
  openProposal,
  train,
  calendar,
  advance,
  act,
  reset,
}) {
  return (
    <main className="wrap">
      <small>TEMPORADA {game.season} · SETMANA {game.week}/16</small>
      <h1>{club.name}</h1>
      <b>{club.town}</b>

      <div className="grid stats">
        <Stat label="COLLA" value={game.members} />
        <Stat label="PRESTIGI" value={game.prestige} />
        <Stat label="ENERGIA" value={`${game.energy}%`} />
        <Stat label="CASTELLS" value={available.length} />
        <Stat label="MORAL" value={`${game.morale}%`} />
      </div>

      {proposedCastell && (
        <button className="card proposal" onClick={openProposal}>
          🧑‍🏫 Proposta: començar a treballar el {proposedCastell.name}
        </button>
      )}

      {currentEvent && (
        <button className="card event" onClick={act}>
          <h2>{currentEvent.icon} {currentEvent.name}</h2>
          <b>ANAR A PLAÇA</b>
        </button>
      )}

      <div className="grid g3">
        <MenuCard emoji="🏋️" title="Assaig" text={`${game.tests} proves aquesta setmana`} action={train} />
        <MenuCard emoji="📅" title="Calendari" text="Consulta les actuacions" action={calendar} />
        <MenuCard emoji="🌙" title="Passar setmana" text="Recupera 30 o més d'energia" action={advance} />
      </div>

      <div className="card">
        <h2>Llibreta del cap de colla</h2>
        {available.map((castell) => (
          <div className="row" key={castell.id}>
            <b>{castell.name}</b>
            <span>{feel(game.prep[castell.id] || 0)}</span>
          </div>
        ))}
      </div>

      <button className="btn ghost" onClick={reset}>Esborrar partida</button>
    </main>
  );
}

function Stat({ label, value }) {
  return <div className="card stat"><b>{value}</b><small>{label}</small></div>;
}

function MenuCard({ emoji, title, text, action }) {
  return (
    <div className="card">
      <span style={{ fontSize: 44 }}>{emoji}</span>
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="btn" onClick={action}>OBRIR</button>
    </div>
  );
}

function Proposal({ castell, accept, later }) {
  return (
    <main className="wrap">
      <div className="card">
        <div style={{ fontSize: 70 }}>🧑‍🏫</div>
        <h2>Comencem a treballar el {castell.name}?</h2>
        <p>Quedarà disponible als assajos amb preparació inicial baixa.</p>
        <button className="btn green" onClick={accept}>SÍ, COMENCEM</button>
        <button className="btn ghost" onClick={later}>ARA NO</button>
      </div>
    </main>
  );
}

function Calendar({ game, back, start }) {
  return (
    <main className="wrap">
      <button className="btn ghost" onClick={back}>← Tornar</button>
      <h1>Calendari</h1>
      {EVENTS.map((event) => (
        <button
          key={event.name}
          className={`card ${event.week === game.week ? "event" : ""}`}
          disabled={event.week !== game.week || game.attended.includes(event.name)}
          onClick={() => start(event)}
        >
          Setmana {event.week} · {event.icon} {event.name}
        </button>
      ))}
    </main>
  );
}

function Choose({ game, available, go, back }) {
  return (
    <main className="wrap">
      <button className="btn ghost" onClick={back}>← Tornar</button>
      <h1>Assaig</h1>
      <div className="notice"><b>{game.tests} proves setmanals</b></div>
      <div className="grid g2">
        {available.map((castell) => (
          <button
            key={castell.id}
            className="card"
            disabled={game.tests <= 0}
            onClick={() => go(castell)}
          >
            <b>{castell.name}</b>
            <span>{feel(game.prep[castell.id] || 0)}</span>
          </button>
        ))}
      </div>
    </main>
  );
}

function Training({ castell, color, done }) {
  const rows = useMemo(() => structure(castell), [castell]);
  const [step, setStep] = useState(1);
  const [stress, setStress] = useState(8);
  const [phase, setPhase] = useState("wait");
  const ended = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (phase !== "wait") {
        setStress((current) =>
          clamp(current + Math.random() * 3 + castell.difficulty * 0.018 + step * 0.4),
        );
      }
    }, 550);
    return () => clearInterval(timer);
  }, [phase, step, castell.difficulty]);

  useEffect(() => {
    if (stress >= 98 && !ended.current) {
      ended.current = true;
      done({ gain: 1, cost: 4, result: "Caiguda" });
    }
  }, [stress, done]);

  function goUp() {
    setPhase("up");
    setStress((current) => clamp(current + 3 + castell.difficulty * 0.045 + step * 0.6));
    setTimeout(() => {
      setStep((current) => Math.min(rows.length, current + 1));
      setPhase("wait");
    }, 800);
  }

  function dismantle() {
    ended.current = true;
    const ratio = step / rows.length;
    done({
      gain: Math.max(2, Math.round(ratio * 10)),
      cost: ratio > 0.9 ? 3 : ratio > 0.55 ? 2 : 1,
      result: "Desmuntada",
    });
  }

  return (
    <main className="wrap">
      <h2>Prova de {castell.name}</h2>
      <div className="local">
        <div className="local-title">LOCAL D'ASSAIG</div>
        <div className="tower-placeholder">{rows.slice(0, step).map((row) => row.label).join(" · ")}</div>
        <div className="bubble">{rows[step]?.label || "L'enxaneta ja és a dalt. Desmuntem?"}</div>
      </div>
      <div className="controls">
        <button disabled={step >= rows.length || phase !== "wait"} onClick={goUp}>⬆ AMUNT</button>
        <button disabled={phase !== "wait"} onClick={() => { setPhase("hold"); setTimeout(() => setPhase("wait"), 1500); }}>⏸ AGUANTEM</button>
        <button onClick={dismantle}>⬇ DESMUNTEM</button>
      </div>
    </main>
  );
}

function TrainingSummary({ data, next }) {
  return <main className="wrap"><div className="card"><h1>{data.name}</h1><p>Preparació: {data.before} → {data.after}</p><button onClick={next}>CONTINUAR</button></div></main>;
}

function Performance({ event, performance, available, game, attempt, finish }) {
  const pool = performance.phase === "pillar"
    ? available.filter((castell) => castell.pillar)
    : available.filter((castell) => !castell.pillar && !performance.used.includes(castell.id) && (game.prep[castell.id] || 0) >= 22);

  return (
    <main className="wrap">
      <h1>{event.icon} {event.name}</h1>
      <p>{performance.phase === "castells" ? `Ronda ${performance.round} de 5 · ${performance.valid}/3 castells vàlids` : performance.phase === "pillar" ? "Ronda de pilars" : "Actuació acabada"}</p>
      <div className="card">
        {performance.results.map((result, index) => <div className="result" key={`${result.name}-${index}`}><b>{index + 1}a · {result.name}</b><span>{result.result}</span></div>)}
      </div>
      {performance.phase !== "done" ? (
        <div className="grid g2">
          {pool.map((castell) => <button className="card" key={castell.id} onClick={() => attempt(castell, performance.phase === "pillar")}><b>{castell.name}</b><span>{feel(game.prep[castell.id] || 0)}</span></button>)}
        </div>
      ) : <button className="btn" onClick={finish}>TANCAR ACTUACIÓ</button>}
    </main>
  );
}

function PerformanceSummary({ memberChange, next }) {
  return <main className="wrap"><div className="card"><h1>Actuació completada</h1><p>Canvi de castellers: {memberChange >= 0 ? "+" : ""}{memberChange}</p><button onClick={next}>CONTINUAR</button></div></main>;
}

function Season({ game, next }) {
  return <main className="hero"><div><div style={{ fontSize: 80 }}>🏆</div><h1>Temporada {game.season - 1} completada</h1><p>La colla conserva els castells, el prestigi i el domini permanent.</p><button onClick={next}>COMENÇAR NOVA TEMPORADA</button></div></main>;
}
