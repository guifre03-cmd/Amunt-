import React, { useEffect, useMemo, useRef, useState } from "react";

const COLORS = ["#dc2626", "#2563eb", "#16a34a", "#7c3aed", "#ea580c", "#db2777"];

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
  ["3d10f", "3 de 10 amb folre", 3, 10, 100, 27000, 10, 6205, 7475, "f"]
].map(x => ({
  id: x[0], name: x[1], w: x[2], h: x[3], difficulty: x[4], unlock: x[5],
  season: x[6], loaded: x[7], unloaded: x[8], pillar: x[9].includes("p"),
  folre: x[9].includes("f"), manilles: x[9].includes("m"), puntals: x[9].includes("x")
}));

const EVENTS = [
  [2, "Mostra d'entitats", "🏘️", 0, 5], [4, "Festa Major del Barri", "🎉", 5, 10],
  [6, "Diada de la Plaça Nova", "☀️", 8, 12], [8, "Trobada de Colles Novelles", "⚔️", 13, 18],
  [11, "Festa Major", "🎺", 16, 25], [14, "Gran Diada de Tardor", "🏆", 22, 35]
].map(x => ({ week:x[0], name:x[1], icon:x[2], pressure:x[3], fans:x[4] }));

const INIT = {
  week:1, season:1, prestige:0, energy:88, morale:70, members:42,
  trainingDays:2, testsLeft:6, testsToday:3,
  unlocked:["pd4", "3d6", "4d6"],
  mastery:{ pd4:38, "3d6":28, "4d6":25 },
  form:{ pd4:38, "3d6":28, "4d6":25 }, attended:[], proposal:null
};

const clamp = n => Math.max(0, Math.min(100, n));
const feel = n => n >= 68 ? "Molt preparat" : n >= 42 ? "Amb opcions" : n >= 22 ? "Just" : "Fora de programa";

function seasonDecay(game) {
  const form = { ...game.form };
  game.unlocked.forEach(id => {
    const c = CASTELLS.find(x => x.id === id);
    const mastery = game.mastery[id] || 0;
    let loss = c.h <= 6 ? 4 : c.h === 7 ? 10 : c.h === 8 ? 18 : 28;
    if (c.folre) loss += 8;
    if (c.manilles) loss += 8;
    if (c.puntals) loss += 7;
    if (c.difficulty >= 98) loss += 8;
    const permanentFloor = Math.min(55, Math.round(mastery * 0.55));
    form[id] = Math.max(permanentFloor, (form[id] ?? mastery) - loss);
  });
  return { ...game, form };
}

function structure(c) {
  const rows = [{ t:"pinya", label:"Pinya i baixos" }];
  if (c.folre) rows.push({ t:"support", label:"Folre" });
  if (c.manilles) rows.push({ t:"support", label:"Manilles" });
  if (c.puntals) rows.push({ t:"support", label:"Puntals" });
  if (c.pillar) {
    for (let i=0; i<c.h-1; i++) rows.push({ t:i===c.h-2 ? "enxaneta" : "trunk", n:1, label:i===c.h-2 ? "Enxaneta" : `Pis ${i+2}` });
    return rows;
  }
  const names = ["Segons", "Terços", "Quarts", "Quints", "Sisens"];
  for (let i=0; i<Math.max(0, c.h-4); i++) rows.push({ t:"trunk", n:c.w, label:names[i] || `Pis ${i+2}` });
  rows.push({t:"dosos",n:2,label:"Dosos"},{t:"aixecador",n:1,label:"Aixecador"},{t:"enxaneta",n:1,label:"Enxaneta"});
  return rows;
}

function Person({ color, small }) {
  return <span className="person" style={{ transform: small ? "scale(.78)" : "none" }}><i className="head"/><i className="body" style={{ background:color }}/></span>;
}

function Tower({ c, rows, color, stress }) {
  return <div className="tower" style={{ transform:`rotate(${stress>80?2:stress>55?1:0}deg)` }}>
    {rows.map((r,i) => r.t === "pinya"
      ? <div className="pinya" key={i}>👤👤👤👤👤👤👤👤👤👤</div>
      : r.t === "support"
        ? <div className="support" style={{background:color}} key={i}>{r.label}</div>
        : <div className="people" key={i}>{Array.from({length:r.n}).map((_,j)=><Person key={j} color={color} small={["dosos","aixecador","enxaneta"].includes(r.t)}/>)}</div>
    )}
  </div>;
}

export default function App() {
  const saved = (() => { try { return JSON.parse(localStorage.getItem("amunt-app-v1")); } catch { return null; } })();
  const [screen,setScreen] = useState(saved ? "hub" : "welcome");
  const [club,setClub] = useState(saved?.club || {name:"",town:"",color:COLORS[0]});
  const [game,setGame] = useState(saved?.game || INIT);
  const [picked,setPicked] = useState(null);
  const [event,setEvent] = useState(null);
  const [run,setRun] = useState(null);
  const [installPrompt,setInstallPrompt] = useState(null);

  useEffect(() => { if (club.name) localStorage.setItem("amunt-app-v1", JSON.stringify({club,game})); }, [club,game]);
  useEffect(() => { const fn=e=>{e.preventDefault();setInstallPrompt(e)}; window.addEventListener("beforeinstallprompt",fn); return()=>window.removeEventListener("beforeinstallprompt",fn); }, []);

  const available = CASTELLS.filter(c => game.unlocked.includes(c.id));
  const currentEvent = EVENTS.find(e => e.week === game.week && !game.attended.includes(e.name));
  const checkProposal = next => {
    if (next.proposal) return next;
    const candidate = CASTELLS.find(c => !next.unlocked.includes(c.id) && c.season <= next.season && c.unlock <= next.prestige);
    return candidate ? {...next, proposal:candidate.id} : next;
  };

  const advanceWeek = () => {
    if (game.week === 16) {
      setGame(x => seasonDecay({...x,season:x.season+1,week:1,attended:[],energy:92,trainingDays:2,testsLeft:6,testsToday:3}));
      setScreen("season");
      return;
    }
    setGame(x => checkProposal({...x,week:x.week+1,energy:clamp(x.energy+22),trainingDays:2,testsLeft:6,testsToday:3}));
  };

  const startAct = e => { setEvent(e); setRun({round:1,valid:0,results:[],phase:"castells",used:[]}); setScreen("act"); };

  const attempt = (c,pillar=false) => {
    const prep = game.form[c.id] ?? game.mastery[c.id] ?? 0;
    const base = prep + game.morale*.2 + game.energy*.1 - (c.difficulty-30)*.62 - event.pressure;
    const roll = Math.random()*100;
    const result = roll<base+22 ? "Descarregat" : roll<base+39 ? "Carregat" : roll<base+66 ? "Intent desmuntat" : "Intent";
    const valid = result === "Descarregat" || result === "Carregat";
    const cost = result === "Descarregat" ? 3 : result === "Carregat" ? 5 : result === "Intent desmuntat" ? 2 : 6;
    const points = result === "Descarregat" ? c.unloaded : result === "Carregat" ? c.loaded : 0;
    setGame(x => checkProposal({...x,energy:clamp(x.energy-cost),prestige:x.prestige+points,morale:clamp(x.morale+(result==="Descarregat"?4:result==="Intent"?-5:0)),form:{...x.form,[c.id]:clamp(prep+(valid?5:1))},mastery:{...x.mastery,[c.id]:clamp((x.mastery[c.id]||0)+(valid?2:.5))}}));
    setRun(r => {
      if (pillar) return {...r,pillar:{name:c.name,result},phase:"done"};
      const validCount = r.valid + (valid?1:0);
      const used = valid ? [...r.used,c.id] : r.used;
      const nextRound = r.round + 1;
      const remaining = available.filter(x => !x.pillar && !used.includes(x.id) && (game.form[x.id]??0)>=22);
      return {...r,round:nextRound,valid:validCount,used,results:[...r.results,{name:c.name,result}],phase:validCount>=3||nextRound>5||remaining.length===0?"pillar":"castells"};
    });
  };

  const finishTraining = outcome => {
    setGame(x => {
      const currentForm = x.form[picked.id] ?? 0;
      return checkProposal({...x,testsLeft:x.testsLeft-1,testsToday:x.testsToday-1,energy:clamp(x.energy-outcome.cost),form:{...x.form,[picked.id]:clamp(currentForm+outcome.gain)},mastery:{...x.mastery,[picked.id]:clamp((x.mastery[picked.id]||0)+outcome.gain*.25)}});
    });
    setScreen("choose");
  };

  return <div className="app">
    {installPrompt && <button className="btn red install" onClick={async()=>{await installPrompt.prompt();setInstallPrompt(null)}}>Instal·lar Amunt!</button>}
    {screen==="welcome" && <Welcome saved={!!saved} resume={()=>setScreen("hub")} create={()=>setScreen("setup")}/>} 
    {screen==="setup" && <Setup club={club} setClub={setClub} start={()=>{if(club.name&&club.town){setGame(INIT);setScreen("hub")}}}/>} 
    {screen==="hub" && <Hub club={club} game={game} available={available} currentEvent={currentEvent} train={()=>setScreen("choose")} calendar={()=>setScreen("calendar")} advance={advanceWeek} act={()=>startAct(currentEvent)} proposal={()=>setScreen("proposal")} reset={()=>{localStorage.removeItem("amunt-app-v1");window.location.reload()}}/>}
    {screen==="proposal" && <Proposal c={CASTELLS.find(c=>c.id===game.proposal)} yes={()=>{const id=game.proposal;setGame(x=>({...x,unlocked:[...x.unlocked,id],mastery:{...x.mastery,[id]:5},form:{...x.form,[id]:5},proposal:null}));setScreen("hub")}} no={()=>{setGame(x=>({...x,proposal:null}));setScreen("hub")}/>} 
    {screen==="calendar" && <Calendar game={game} back={()=>setScreen("hub")} go={startAct}/>} 
    {screen==="choose" && <Choose game={game} available={available} back={()=>setScreen("hub")} go={c=>{setPicked(c);setScreen("training")}}/>}
    {screen==="training" && <Training c={picked} color={club.color} done={finishTraining}/>} 
    {screen==="act" && <Act event={event} run={run} available={available} game={game} attempt={attempt} finish={()=>{setGame(x=>({...x,attended:[...x.attended,event.name],members:x.members+Math.ceil(event.fans/8)}));setScreen("hub")}/>} 
    {screen==="season" && <Season game={game} next={()=>setScreen("hub")}/>} 
    <div className="bottom">AMUNT! · Partida desada automàticament</div>
  </div>;
}

function Welcome({saved,resume,create}) { return <section className="hero"><div><div style={{fontSize:90}}>🏰</div><small className="small">SIMULADOR CASTELLER</small><h1>AMUNT!</h1><p>Funda una colla, dirigeix els assajos i completa temporades.</p><div className="grid">{saved&&<button className="btn red" onClick={resume}>CONTINUAR PARTIDA</button>}<button className="btn" onClick={create}>NOVA COLLA</button></div></div></section>; }
function Setup({club,setClub,start}) { return <main className="wrap"><h1>Funda la teva colla</h1><p className="small">NOM DE LA COLLA</p><input className="field" value={club.name} onChange={e=>setClub({...club,name:e.target.value})}/><p className="small">CIUTAT O POBLE</p><input className="field" value={club.town} onChange={e=>setClub({...club,town:e.target.value})}/><p className="small">COLOR DE LA CAMISA</p><div className="colors">{COLORS.map(c=><button key={c} className={`color ${club.color===c?"selected":""}`} style={{background:c}} onClick={()=>setClub({...club,color:c})}/>)}</div><div className="card" style={{background:club.color,color:"white",marginTop:22}}><h2>{club.name||"Nom de la colla"}</h2><p>{club.town||"Ciutat o poble"}</p></div><button className="btn" style={{width:"100%",marginTop:15}} onClick={start}>COMENÇA LA HISTÒRIA</button></main>; }
function Hub({club,game,available,currentEvent,train,calendar,advance,act,proposal,reset}) { return <main className="wrap"><div className="top"><div><small className="small">TEMPORADA {game.season} · SETMANA {game.week}/16</small><h2>{club.name}</h2><b>{club.town}</b></div><span style={{fontSize:50}}>🏰</span></div><div className="grid stats" style={{margin:"18px 0"}}>{[["COLLA",game.members],["PRESTIGI",game.prestige],["ENERGIA",`${game.energy}%`],["CASTELLS",available.length],["MORAL",`${game.morale}%`]].map(x=><div className="card stat" key={x[0]}><b>{x[1]}</b><small className="small">{x[0]}</small></div>)}</div>{game.proposal&&<button className="card proposal" style={{width:"100%",textAlign:"left"}} onClick={proposal}><b>🧑‍🏫 Proposta de l'equip tècnic</b><p>Podem començar a treballar un castell nou →</p></button>}{currentEvent&&<button className="card event" style={{width:"100%",textAlign:"left",marginTop:12}} onClick={act}><h2>{currentEvent.icon} {currentEvent.name}</h2><b>ANAR A PLAÇA</b></button>}<div className="grid g3" style={{marginTop:12}}><Card e="🏋️" t="Assaig" p={`${game.testsLeft} proves aquesta setmana`} b="ANAR AL LOCAL" fn={train}/><Card e="📅" t="Calendari" p="Consulta les actuacions" b="VEURE" fn={calendar}/><Card e="🌙" t="Passar setmana" p="Recupera 22 d'energia" b="AVANÇAR" fn={advance}/></div><div className="card" style={{marginTop:12}}><h2>Llibreta del cap de colla</h2><div className="castle-list">{available.map(c=><div className="row" key={c.id}><b>{c.name}</b><span>{feel(game.form[c.id]??0)}</span></div>)}</div></div><button className="btn ghost" style={{marginTop:12}} onClick={reset}>Esborrar partida</button></main>; }
function Card({e,t,p,b,fn}) { return <div className="card"><span style={{fontSize:44}}>{e}</span><h2>{t}</h2><p>{p}</p><button className="btn" onClick={fn}>{b}</button></div>; }
function Proposal({c,yes,no}) { return <main className="wrap"><div className="card" style={{textAlign:"center"}}><div style={{fontSize:70}}>🧑‍🏫</div><h2>Comencem a treballar el {c.name}?</h2><p>Quedarà disponible als assajos amb preparació inicial baixa.</p><div className="grid"><button className="btn green" onClick={yes}>SÍ, COMENCEM</button><button className="btn ghost" onClick={no}>ARA NO</button></div></div></main>; }
function Calendar({game,back,go}) { return <main className="wrap"><button className="btn ghost" onClick={back}>← Tornar</button><h1>Calendari</h1>{EVENTS.map(e=><button key={e.name} className={`card ${e.week===game.week?"event":""}`} style={{width:"100%",textAlign:"left",marginTop:10,opacity:e.week < game.week ? 0.45 : 1}} onClick={()=>e.week===game.week&&!game.attended.includes(e.name)&&go(e)}><b>Setmana {e.week} · {e.icon} {e.name}</b></button>)}</main>; }
function Choose({game,available,back,go}) { return <main className="wrap"><button className="btn ghost" onClick={back}>← Tornar</button><h1>Assaig</h1><div className="notice"><b>{game.testsLeft} proves setmanals · {game.testsToday} proves avui</b></div><div className="grid g2">{available.map(c=><button className="card" style={{textAlign:"left"}} disabled={game.testsToday<=0} key={c.id} onClick={()=>go(c)}><b>{c.name}</b><span style={{display:"block"}}>{feel(game.form[c.id]??0)}</span></button>)}</div></main>; }
function Training({c,color,done}) { const stages=useMemo(()=>structure(c),[c]); const[step,setStep]=useState(1); const[stress,setStress]=useState(8); const[phase,setPhase]=useState("wait"); const ended=useRef(false); useEffect(()=>{const timer=setInterval(()=>phase!=="wait"&&setStress(x=>clamp(x+Math.random()*3+c.difficulty*.018+step*.4)),550);return()=>clearInterval(timer)},[phase,step,c]); useEffect(()=>{if(stress>=98&&!ended.current){ended.current=true;done({gain:1,cost:4})}},[stress,done]); const up=()=>{setPhase("up");setStress(x=>clamp(x+3+c.difficulty*.045+step*.6));setTimeout(()=>{setStep(x=>Math.min(stages.length,x+1));setPhase("wait")},800)}; const down=()=>{if(ended.current)return;ended.current=true;const ratio=step/stages.length;done({gain:Math.max(2,Math.round(ratio*10)),cost:ratio>.9?3:ratio>.55?2:1})}; return <main className="wrap"><h2>Prova de {c.name}</h2><div className="local"><div className="local-title">LOCAL D'ASSAIG</div><Tower c={c} rows={stages.slice(0,step)} color={color} stress={stress}/><div className="bubble"><span>{stages[step]?.label||"L'enxaneta ja és a dalt. Desmuntem?"}</span></div></div><div className="controls"><button className="green" disabled={step>=stages.length||phase!=="wait"} onClick={up}>⬆ AMUNT</button><button className="amber" disabled={phase!=="wait"} onClick={()=>{setPhase("hold");setTimeout(()=>setPhase("wait"),1500)}}>⏸ AGUANTEM</button><button className="red" onClick={down}>⬇ DESMUNTEM</button></div></main>; }
function Act({event,run,available,game,attempt,finish}) { const pool=run.phase==="pillar"?available.filter(c=>c.pillar):available.filter(c=>!c.pillar&&!run.used.includes(c.id)&&(game.form[c.id]??0)>=22); return <main className="wrap"><div style={{fontSize:55,textAlign:"center"}}>{event.icon}</div><h2 style={{textAlign:"center"}}>{event.name}</h2><p style={{textAlign:"center",fontWeight:900}}>{run.phase==="castells"?`Ronda ${run.round} de 5 · ${run.valid}/3 castells vàlids`:run.phase==="pillar"?"Ronda de pilars":"Actuació acabada"}</p><div className="card">{run.results.map((r,i)=><div className="result" key={i}><b>{i+1}a · {r.name}</b><span>{r.result}</span></div>)}{run.pillar&&<div className="result"><b>{run.pillar.name}</b><span>{run.pillar.result}</span></div>}</div>{run.phase!=="done"?<div className="grid g2" style={{marginTop:12}}>{pool.map(c=><button className="card" style={{textAlign:"left"}} key={c.id} onClick={()=>attempt(c,run.phase==="pillar")}><b>{c.name}</b><span style={{display:"block"}}>{feel(game.form[c.id]??0)}</span></button>)}</div>:<button className="btn" style={{width:"100%",marginTop:12}} onClick={finish}>TANCAR ACTUACIÓ</button>}</main>; }
function Season({game,next}) { return <main className="hero"><div><div style={{fontSize:80}}>🏆</div><h1>Temporada {game.season-1} completada</h1><p>Els castells alts i poc consolidats han perdut preparació. Els coneixements permanents es conserven.</p><div className="card castle-list" style={{textAlign:"left"}}>{CASTELLS.filter(c=>game.unlocked.includes(c.id)).map(c=><div className="row" key={c.id}><b>{c.name}</b><span>{feel(game.form[c.id]??0)}</span></div>)}</div><button className="btn red" style={{marginTop:15}} onClick={next}>COMENÇAR NOVA TEMPORADA</button></div></main>; }
