import React, { useEffect, useMemo, useState } from "react";

const COLORS = ["#dc2626", "#2563eb", "#16a34a", "#7c3aed", "#ea580c", "#db2777"];
const CASTELLS = [
  {id:"pd4",name:"Pilar de 4",width:1,height:4,difficulty:18,pillar:true,unlock:0,season:1,loaded:30,unloaded:35},
  {id:"4d6",name:"4 de 6",width:4,height:6,difficulty:32,unlock:0,season:1,loaded:120,unloaded:145},
  {id:"3d6",name:"3 de 6",width:3,height:6,difficulty:34,unlock:0,season:1,loaded:125,unloaded:150},
  {id:"3d6a",name:"3 de 6 amb agulla",width:3,height:6,difficulty:43,unlock:160,season:1,loaded:165,unloaded:185,agulla:true},
  {id:"4d6a",name:"4 de 6 amb agulla",width:4,height:6,difficulty:46,unlock:210,season:1,loaded:170,unloaded:190,agulla:true},
  {id:"7d6",name:"7 de 6",width:7,height:6,difficulty:49,unlock:270,season:1,loaded:160,unloaded:195},
  {id:"5d6",name:"5 de 6",width:5,height:6,difficulty:51,unlock:330,season:1,loaded:175,unloaded:205},
  {id:"2d6",name:"2 de 6",width:2,height:6,difficulty:60,unlock:620,season:1,loaded:250,unloaded:300},
  {id:"pd5",name:"Pilar de 5",width:1,height:5,difficulty:62,pillar:true,unlock:700,season:1,loaded:260,unloaded:315},
  {id:"9d6",name:"9 de 6",width:9,height:6,difficulty:64,unlock:790,season:1,loaded:295,unloaded:355},
  {id:"4d7",name:"4 de 7",width:4,height:7,difficulty:66,unlock:900,season:2,loaded:325,unloaded:395},
  {id:"3d7",name:"3 de 7",width:3,height:7,difficulty:68,unlock:1020,season:2,loaded:345,unloaded:415},
  {id:"4d7a",name:"4 de 7 amb agulla",width:4,height:7,difficulty:70,unlock:1160,season:2,loaded:465,unloaded:515,agulla:true},
  {id:"3d7a",name:"3 de 7 amb agulla",width:3,height:7,difficulty:71,unlock:1300,season:2,loaded:485,unloaded:545,agulla:true},
  {id:"5d7",name:"5 de 7",width:5,height:7,difficulty:73,unlock:1600,season:2,loaded:470,unloaded:565},
  {id:"2d7",name:"2 de 7",width:2,height:7,difficulty:78,unlock:2500,season:2,loaded:670,unloaded:805},
  {id:"4d8",name:"4 de 8",width:4,height:8,difficulty:80,unlock:2750,season:3,loaded:700,unloaded:845},
  {id:"pd6",name:"Pilar de 6",width:1,height:6,difficulty:82,pillar:true,unlock:3000,season:3,loaded:765,unloaded:920},
  {id:"3d8",name:"3 de 8",width:3,height:8,difficulty:83,unlock:3250,season:3,loaded:805,unloaded:970},
  {id:"2d8f",name:"2 de 8 amb folre",width:2,height:8,difficulty:86,folre:true,unlock:3900,season:4,loaded:1005,unloaded:1210},
  {id:"pd7f",name:"Pilar de 7 amb folre",width:1,height:7,difficulty:87,pillar:true,folre:true,unlock:4250,season:4,loaded:1055,unloaded:1270},
  {id:"5d8",name:"5 de 8",width:5,height:8,difficulty:88,unlock:4600,season:4,loaded:1150,unloaded:1385},
  {id:"4d9f",name:"4 de 9 amb folre",width:4,height:9,difficulty:93,folre:true,unlock:6700,season:5,loaded:1510,unloaded:1820},
  {id:"3d9f",name:"3 de 9 amb folre",width:3,height:9,difficulty:94,folre:true,unlock:7200,season:5,loaded:1585,unloaded:1910},
  {id:"2d9fm",name:"2 de 9 amb folre i manilles",width:2,height:9,difficulty:96,folre:true,manilles:true,unlock:9100,season:6,loaded:2265,unloaded:2730},
  {id:"pd8fm",name:"Pilar de 8 amb folre i manilles",width:1,height:8,difficulty:97,pillar:true,folre:true,manilles:true,unlock:9800,season:6,loaded:2380,unloaded:2870},
  {id:"4d9",name:"4 de 9 sense folre",width:4,height:9,difficulty:98,unlock:13700,season:7,loaded:3405,unloaded:4105},
  {id:"2d8",name:"2 de 8 sense folre",width:2,height:8,difficulty:98,unlock:14600,season:7,loaded:3575,unloaded:4310},
  {id:"3d10fm",name:"3 de 10 amb folre i manilles",width:3,height:10,difficulty:99,folre:true,manilles:true,unlock:15600,season:8,loaded:3755,unloaded:4525},
  {id:"4d10fm",name:"4 de 10 amb folre i manilles",width:4,height:10,difficulty:99,folre:true,manilles:true,unlock:16600,season:8,loaded:4095,unloaded:4930},
  {id:"pd9fmp",name:"Pilar de 9 amb folre, manilles i puntals",width:1,height:9,difficulty:99,pillar:true,folre:true,manilles:true,puntals:true,unlock:20000,season:9,loaded:4920,unloaded:5925},
  {id:"3d9",name:"3 de 9 sense folre",width:3,height:9,difficulty:100,unlock:21200,season:9,loaded:5165,unloaded:6220},
  {id:"pd7",name:"Pilar de 7 sense folre",width:1,height:7,difficulty:100,pillar:true,unlock:22500,season:9,loaded:5280,unloaded:6360},
  {id:"2d10fmp",name:"2 de 10 amb folre, manilles i puntals",width:2,height:10,difficulty:100,folre:true,manilles:true,puntals:true,unlock:23900,season:10,loaded:5630,unloaded:6780},
  {id:"4d10f",name:"4 de 10 amb folre",width:4,height:10,difficulty:100,folre:true,unlock:25400,season:10,loaded:5910,unloaded:7120},
  {id:"3d10f",name:"3 de 10 amb folre",width:3,height:10,difficulty:100,folre:true,unlock:27000,season:10,loaded:6205,unloaded:7475}
]
const EVENTS = [2, 4, 6, 8, 11, 14].map((week, i) => ({
  week,
  name: ["Mostra d'entitats", "Festa Major del Barri", "Diada de la Plaça Nova", "Trobada de Colles", "Festa Major", "Gran Diada de Tardor"][i],
  icon: ["🏘️", "🎉", "☀️", "⚔️", "🎺", "🏆"][i]
}));
const INITIAL = {
  week: 1, season: 1, energy: 88, prestige: 0, members: 42,
  testsLeft: 6, testsToday: 3,
  unlocked: ["pd4", "3d6", "4d6"],
  prep: { pd4: 42, "3d6": 30, "4d6": 28 }, attended: []
};
const clamp = n => Math.max(0, Math.min(100, n));
const feeling = n => n >= 68 ? "Molt preparat" : n >= 42 ? "Amb opcions" : n >= 22 ? "Just" : "Fora de programa";

function loadSave() {
  try { return JSON.parse(localStorage.getItem("amunt-save")); } catch { return null; }
}

export default function App() {
  const saved = loadSave();
  const [screen, setScreen] = useState(saved ? "hub" : "welcome");
  const [club, setClub] = useState(saved?.club || { name: "", town: "", color: COLORS[0] });
  const [game, setGame] = useState(saved?.game || INITIAL);
  const [selected, setSelected] = useState(null);
  const [event, setEvent] = useState(null);
  const [act, setAct] = useState(null);

  useEffect(() => {
    if (club.name) localStorage.setItem("amunt-save", JSON.stringify({ club, game }));
  }, [club, game]);

  const available = CASTELLS.filter(c => game.unlocked.includes(c.id));
  const currentEvent = EVENTS.find(e => e.week === game.week && !game.attended.includes(e.name));
  const nextUnlock = CASTELLS.find(c => !game.unlocked.includes(c.id) && c.season <= game.season && c.unlock <= game.prestige);

  const advanceWeek = () => {
    if (game.week >= 16) {
      setGame(g => ({ ...g, season: g.season + 1, week: 1, energy: 92, testsLeft: 6, testsToday: 3, attended: [], prep: decay(g) }));
      setScreen("season");
      return;
    }
    setGame(g => ({ ...g, week: g.week + 1, energy: clamp(g.energy + 22), testsLeft: 6, testsToday: 3, unlocked: nextUnlock ? [...g.unlocked, nextUnlock.id] : g.unlocked, prep: nextUnlock ? {...g.prep, [nextUnlock.id]: 5} : g.prep }));
  };

  const startAct = e => {
    setEvent(e);
    setAct({ round: 1, valid: 0, results: [], used: [], phase: "castells" });
    setScreen("act");
  };

  const resolveAttempt = (castell, isPillar = false) => {
    const prep = game.prep[castell.id] || 0;
    const roll = Math.random() * 100;
    const score = prep + game.energy * 0.18 - castell.difficulty * 0.45;
    const result = roll < score + 28 ? "Descarregat" : roll < score + 45 ? "Carregat" : roll < score + 70 ? "Intent desmuntat" : "Intent";
    const valid = result === "Descarregat" || result === "Carregat";
    const cost = result === "Descarregat" ? 3 : result === "Carregat" ? 5 : result === "Intent desmuntat" ? 2 : 6;
    setGame(g => ({ ...g, energy: clamp(g.energy - cost), prestige: g.prestige + (valid ? castell.difficulty : 0), prep: { ...g.prep, [castell.id]: clamp(prep + (valid ? 4 : 1)) } }));
    setAct(a => {
      if (isPillar) return { ...a, pillar: { name: castell.name, result }, phase: "done" };
      const used = valid ? [...a.used, castell.id] : a.used;
      const validCount = a.valid + (valid ? 1 : 0);
      const round = a.round + 1;
      const remaining = available.filter(c => !c.pillar && !used.includes(c.id) && (game.prep[c.id] || 0) >= 22);
      return { ...a, round, valid: validCount, used, results: [...a.results, { name: castell.name, result }], phase: validCount >= 3 || round > 5 || remaining.length === 0 ? "pillar" : "castells" };
    });
  };

  if (screen === "welcome") return <Welcome hasSave={Boolean(saved)} onContinue={() => setScreen("hub")} onNew={() => setScreen("setup")} />;
  if (screen === "setup") return <Setup club={club} setClub={setClub} onStart={() => { if (club.name.trim() && club.town.trim()) { setGame(INITIAL); setScreen("hub"); } }} />;
  if (screen === "training") return <Training castell={selected} color={club.color} onFinish={gain => { setGame(g => ({ ...g, testsLeft: g.testsLeft - 1, testsToday: g.testsToday - 1, energy: clamp(g.energy - gain.cost), prep: { ...g.prep, [selected.id]: clamp((g.prep[selected.id] || 0) + gain.points) } })); setScreen("choose"); }} />;
  if (screen === "act") return <Act event={event} state={act} available={available} game={game} onAttempt={resolveAttempt} onFinish={() => { setGame(g => ({ ...g, attended: [...g.attended, event.name] })); setScreen("hub"); }} />;
  if (screen === "calendar") return <Calendar game={game} onBack={() => setScreen("hub")} onGo={startAct} />;
  if (screen === "choose") return <Choose game={game} available={available} onBack={() => setScreen("hub")} onGo={c => { setSelected(c); setScreen("training"); }} />;
  if (screen === "season") return <Season game={game} onNext={() => setScreen("hub")} />;

  return <Hub club={club} game={game} available={available} currentEvent={currentEvent} onTrain={() => setScreen("choose")} onCalendar={() => setScreen("calendar")} onAdvance={advanceWeek} onAct={() => startAct(currentEvent)} onReset={() => { localStorage.removeItem("amunt-save"); window.location.reload(); }} />;
}

function decay(game) {
  const prep = { ...game.prep };
  game.unlocked.forEach(id => {
    const c = CASTELLS.find(x => x.id === id);
    const loss = c.height <= 6 ? 4 : c.height === 7 ? 10 : c.height === 8 ? 18 : 28;
    prep[id] = Math.max(8, (prep[id] || 0) - loss - (c.folre ? 8 : 0) - (c.manilles ? 8 : 0));
  });
  return prep;
}

function Welcome({ hasSave, onContinue, onNew }) {
  return <section className="hero"><div><div style={{ fontSize: 90 }}>🏰</div><small className="small">SIMULADOR CASTELLER</small><h1>AMUNT!</h1><p>Funda una colla, dirigeix els assajos i completa temporades.</p><div className="grid">{hasSave && <button className="btn red" onClick={onContinue}>CONTINUAR PARTIDA</button>}<button className="btn" onClick={onNew}>NOVA COLLA</button></div></div></section>;
}
function Setup({ club, setClub, onStart }) {
  return <main className="wrap"><h1>Funda la teva colla</h1><p className="small">NOM DE LA COLLA</p><input className="field" value={club.name} onChange={e => setClub({ ...club, name: e.target.value })}/><p className="small">CIUTAT O POBLE</p><input className="field" value={club.town} onChange={e => setClub({ ...club, town: e.target.value })}/><p className="small">COLOR DE LA CAMISA</p><div className="colors">{COLORS.map(c => <button key={c} className={`color ${club.color === c ? "selected" : ""}`} style={{ background: c }} onClick={() => setClub({ ...club, color: c })}/>)}</div><button className="btn" style={{ width: "100%", marginTop: 20 }} onClick={onStart}>COMENÇA LA HISTÒRIA</button></main>;
}
function Hub({ club, game, available, currentEvent, onTrain, onCalendar, onAdvance, onAct, onReset }) {
  return <main className="wrap"><h2>{club.name}</h2><b>{club.town}</b><p className="small">TEMPORADA {game.season} · SETMANA {game.week}/16</p><div className="grid stats">{[["COLLA", game.members], ["PRESTIGI", game.prestige], ["ENERGIA", `${game.energy}%`], ["CASTELLS", available.length]].map(x => <div className="card stat" key={x[0]}><b>{x[1]}</b><small className="small">{x[0]}</small></div>)}</div>{currentEvent && <button className="card event" style={{ width: "100%", marginTop: 12 }} onClick={onAct}><h2>{currentEvent.icon} {currentEvent.name}</h2><b>ANAR A PLAÇA</b></button>}<div className="grid g3" style={{ marginTop: 12 }}><Card icon="🏋️" title="Assaig" text={`${game.testsLeft} proves aquesta setmana`} action={onTrain}/><Card icon="📅" title="Calendari" text="Consulta les actuacions" action={onCalendar}/><Card icon="🌙" title="Passar setmana" text="Recupera energia" action={onAdvance}/></div><div className="card" style={{ marginTop: 12 }}><h2>Llibreta del cap de colla</h2>{available.map(c => <div className="row" key={c.id}><b>{c.name}</b><span>{feeling(game.prep[c.id] || 0)}</span></div>)}</div><button className="btn ghost" style={{ marginTop: 12 }} onClick={onReset}>Esborrar partida</button></main>;
}
function Card({ icon, title, text, action }) { return <div className="card"><span style={{ fontSize: 44 }}>{icon}</span><h2>{title}</h2><p>{text}</p><button className="btn" onClick={action}>OBRIR</button></div>; }
function Calendar({ game, onBack, onGo }) { return <main className="wrap"><button className="btn ghost" onClick={onBack}>← Tornar</button><h1>Calendari</h1>{EVENTS.map(e => <button key={e.name} className={`card ${e.week === game.week ? "event" : ""}`} style={{ width: "100%", marginTop: 10, opacity: e.week < game.week ? 0.45 : 1 }} onClick={() => e.week === game.week && !game.attended.includes(e.name) && onGo(e)}><b>Setmana {e.week} · {e.icon} {e.name}</b></button>)}</main>; }
function Choose({ game, available, onBack, onGo }) { return <main className="wrap"><button className="btn ghost" onClick={onBack}>← Tornar</button><h1>Assaig</h1><div className="notice"><b>{game.testsLeft} proves setmanals · {game.testsToday} proves avui</b></div><div className="grid g2">{available.map(c => <button className="card" disabled={game.testsToday <= 0} key={c.id} onClick={() => onGo(c)}><b>{c.name}</b><span style={{ display: "block" }}>{feeling(game.prep[c.id] || 0)}</span></button>)}</div></main>; }
function Training({ castell, color, onFinish }) {
  const stages = useMemo(() => {
    const list = [{ label: "Pinya i baixos", count: 0 }];
    for (let i = 0; i < Math.max(0, castell.height - 4); i++) list.push({ label: ["Segons", "Terços", "Quarts", "Quints"][i], count: castell.width });
    if (!castell.pillar) list.push({ label: "Dosos", count: 2 }, { label: "Aixecador", count: 1 }, { label: "Enxaneta", count: 1 });
    else for (let i = 1; i < castell.height; i++) list.push({ label: i === castell.height - 1 ? "Enxaneta" : `Pis ${i + 1}`, count: 1 });
    return list;
  }, [castell]);
  const [step, setStep] = useState(1);
  const [stress, setStress] = useState(8);
  const up = () => { setStress(x => clamp(x + 4 + castell.difficulty * 0.04)); setStep(x => Math.min(stages.length, x + 1)); };
  const down = () => { const ratio = step / stages.length; onFinish({ points: Math.max(2, Math.round(ratio * 10)), cost: ratio > 0.9 ? 3 : ratio > 0.55 ? 2 : 1 }); };
  return <main className="wrap"><h2>Prova de {castell.name}</h2><div className="local"><div className="local-title">LOCAL D'ASSAIG</div><div className="tower"><div className="pinya">👤👤👤👤👤👤👤👤</div>{stages.slice(1, step).map((s, i) => <div className="people" key={i}>{Array.from({ length: s.count }).map((_, j) => <Person key={j} color={color} small={s.count <= 2}/>)}</div>)}</div><div className="bubble"><span>{stages[step]?.label || "L'enxaneta ja és a dalt"}</span></div></div><div className="controls"><button className="green" disabled={step >= stages.length} onClick={up}>⬆ AMUNT</button><button className="amber" onClick={() => setStress(x => clamp(x + 2))}>⏸ AGUANTEM</button><button className="red" onClick={down}>⬇ DESMUNTEM</button></div></main>;
}
function Person({ color, small }) { return <span className="person" style={{ transform: small ? "scale(.78)" : "none" }}><i className="head"/><i className="body" style={{ background: color }}/></span>; }
function Act({ event, state, available, game, onAttempt, onFinish }) {
  const pool = state.phase === "pillar" ? available.filter(c => c.pillar) : available.filter(c => !c.pillar && !state.used.includes(c.id) && (game.prep[c.id] || 0) >= 22);
  return <main className="wrap"><h2 style={{ textAlign: "center" }}>{event.icon} {event.name}</h2><p style={{ textAlign: "center", fontWeight: 900 }}>{state.phase === "castells" ? `Ronda ${state.round} de 5 · ${state.valid}/3 castells vàlids` : state.phase === "pillar" ? "Ronda de pilars" : "Actuació acabada"}</p><div className="card">{state.results.map((r, i) => <div className="result" key={i}><b>{i + 1}a · {r.name}</b><span>{r.result}</span></div>)}{state.pillar && <div className="result"><b>{state.pillar.name}</b><span>{state.pillar.result}</span></div>}</div>{state.phase !== "done" ? <div className="grid g2" style={{ marginTop: 12 }}>{pool.map(c => <button className="card" key={c.id} onClick={() => onAttempt(c, state.phase === "pillar")}><b>{c.name}</b></button>)}</div> : <button className="btn" style={{ width: "100%", marginTop: 12 }} onClick={onFinish}>TANCAR ACTUACIÓ</button>}</main>;
}
function Season({ game, onNext }) { return <main className="hero"><div><div style={{ fontSize: 80 }}>🏆</div><h1>Temporada {game.season - 1} completada</h1><p>Els castells alts han perdut preparació entre temporades.</p><button className="btn red" onClick={onNext}>COMENÇAR NOVA TEMPORADA</button></div></main>; }
