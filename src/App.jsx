import React,{useEffect,useMemo,useState}from'react';
const COLORS=['#dc2626','#2563eb','#16a34a','#7c3aed','#ea580c','#db2777'];
const RAW=[
['pd4','Pilar de 4',1,4,'p',30,35,18],
  ['4d6','4 de 6',4,6,'',120,145,28],
  ['3d6','3 de 6',3,6,'',125,150,27],
  ['3d6a','3 de 6 amb agulla',3,6,'a',165,185,35],
  ['4d6a','4 de 6 amb agulla',4,6,'a',170,190,37],
//  ['7d6','7 de 6',7,6,'',160,195,39],
  ['5d6','5 de 6',5,6,'',175,205,41],
//  ['7d6a','7 de 6 amb agulla',7,6,'a',210,235,44],
  ['5d6a','5 de 6 amb agulla',5,6,'a',215,240,45],
//  ['3d6s','3 de 6 per sota',3,6,'s',220,245,47],
  ['2d6','2 de 6',2,6,'',250,300,50],
  ['pd5','Pilar de 5',1,5,'p',260,315,52],
  ['9d6','9 de 6',9,6,'',295,355,54],
  ['4d7','4 de 7',4,7,'',325,395,57],
  ['3d7','3 de 7',3,7,'',345,415,59],
  ['4d7a','4 de 7 amb agulla',4,7,'a',465,515,62],
  ['3d7a','3 de 7 amb agulla',3,7,'a',485,545,64],
//  ['7d7','7 de 7',7,7,'',460,555,65],
  ['5d7','5 de 7',5,7,'',470,565,66],
//  ['7d7a','7 de 7 amb agulla',7,7,'a',570,640,68],
  ['5d7a','5 de 7 amb agulla',5,7,'a',605,670,69],
//  ['3d7s','3 de 7 per sota',3,7,'s',635,705,70],
  ['9d7','9 de 7',9,7,'',615,740,71],
  ['2d7','2 de 7',2,7,'',670,805,73],
  ['4d8','4 de 8',4,8,'',700,845,75],
  ['pd6','Pilar de 6',1,6,'p',765,920,76],
  ['3d8','3 de 8',3,8,'',805,970,77],
//  ['7d8','7 de 8',7,8,'',905,1090,79],
  ['2d8f','2 de 8 amb folre',2,8,'f',1005,1210,81],
  ['pd7f','Pilar de 7 amb folre',1,7,'pf',1055,1270,82],
  ['5d8','5 de 8',5,8,'',1150,1385,83],
  ['4d8a','4 de 8 amb agulla',4,8,'a',1310,1455,84],
  ['3d8a','3 de 8 amb agulla',3,8,'a',1375,1530,85],
//  ['7d8a','7 de 8 amb agulla',7,8,'a',1475,1635,86],
//  ['5d8a','5 de 8 amb agulla',5,8,'a',1555,1730,87],
  ['4d9f','4 de 9 amb folre',4,9,'f',1510,1820,88],
  ['3d9f','3 de 9 amb folre',3,9,'f',1585,1910,89],
  ['9d8','9 de 8',9,8,'',1980,2385,90],
  ['3d8s','3 de 8 per sota',3,8,'s',2340,2600,91],
  ['2d9fm','2 de 9 amb folre i manilles',2,9,'fm',2265,2730,92],
  ['pd8fm','Pilar de 8 amb folre i manilles',1,8,'pfm',2380,2870,93],
//  ['7d9f','7 de 9 amb folre',7,9,'f',2500,3010,94],
  ['5d9f','5 de 9 amb folre',5,9,'f',2595,3125,94],
  ['4d9fa','4 de 9 amb folre i agulla',4,9,'fa',2955,3285,95],
  ['3d9fa','3 de 9 amb folre i agulla',3,9,'fa',3100,3445,95],
  ['4d9','4 de 9 sense folre',4,9,'',3405,4105,96],
  ['2d8','2 de 8 sense folre',2,8,'',3575,4310,96],
  ['3d10fm','3 de 10 amb folre i manilles',3,10,'fm',3755,4525,97],
  ['4d10fm','4 de 10 amb folre i manilles',4,10,'fm',4095,4930,97],
  ['9d9f','9 de 9 amb folre',9,9,'f',4295,5180,98],
  ['2d9f','2 de 9 amb folre',2,9,'f',4685,5645,98],
  ['pd9fmp','Pilar de 9 amb folre, manilles i puntals',1,9,'pfmx',4920,5925,98],
  ['3d9','3 de 9 sense folre',3,9,'',5165,6220,99],
  ['pd7','Pilar de 7 sense folre',1,7,'p',5280,6360,99],
  ['2d10fmp','2 de 10 amb folre, manilles i puntals',2,10,'fmx',5630,6780,99],
  ['4d10f','4 de 10 amb folre',4,10,'f',5910,7120,99],
  ['3d10f','3 de 10 amb folre',3,10,'f',6205,7475,100]];
const C=RAW.map((x,i)=>({id:x[0],name:x[1],w:x[2],h:x[3],flags:x[4],pillar:x[4].includes('p'),folre:x[4].includes('f'),manilles:x[4].includes('m'),puntals:x[4].includes('x'),loaded:x[5],unloaded:x[6],difficulty:x[7],order:i}));
const EVENTS=[[2,"Mostra d'entitats",'🏘️',0,5],[4,'Festa Major del Barri','🎉',5,10],[6,'Diada de la Plaça Nova','☀️',8,12],[8,'Trobada de Colles Novelles','⚔️',13,18],[11,'Festa Major','🎺',16,25],[14,'Gran Diada de Tardor','🏆',22,35]].map(x=>({week:x[0],name:x[1],icon:x[2],pressure:x[3],fans:x[4]}));
const INIT={week:1,season:1,energy:88,morale:70,prestige:0,score:0,members:42,tests:6,acted:false,unlocked:['pd4','3d6','4d6'],prep:{pd4:38,'3d6':28,'4d6':25},mastery:{pd4:38,'3d6':28,'4d6':25},attended:[],proposal:null};
const clamp=n=>Math.max(0,Math.min(100,n));const feel=n=>n>=68?'Molt preparat':n>=42?'Amb opcions':n>=22?'Just':'Fora de programa';
function load(){try{const s=localStorage.getItem('amunt-final-v3');return s?JSON.parse(s):null}catch{return null}}
function rows(c){const a=['Pinya i baixos'];if(c.folre)a.push('Folre');if(c.manilles)a.push('Manilles');if(c.puntals)a.push('Puntals');const supports=+c.folre + +c.manilles + +c.puntals;if(c.pillar){while(a.length<c.h)a.push(a.length===c.h-1?'Enxaneta':`Pis ${a.length+1}`);return a}for(let i=0;i<Math.max(0,c.h-4-supports);i++)a.push(['Segons','Terços','Quarts','Quints','Sisens'][i]||`Pis ${i+2}`);return [...a,'Dosos','Aixecador','Enxaneta']}
function App(){const saved=load();const[screen,setScreen]=useState(saved?'hub':'welcome'),[club,setClub]=useState(saved?.club||{name:'',town:'',color:COLORS[0]}),[g,setG]=useState(saved?.g||INIT),[pick,setPick]=useState(null),[event,setEvent]=useState(null),[run,setRun]=useState(null),[rules,setRules]=useState(false);useEffect(()=>{if(club.name)localStorage.setItem('amunt-final-v3',JSON.stringify({club,g}))},[club,g]);const avail=C.filter(c=>g.unlocked.includes(c.id)),now=EVENTS.find(e=>e.week===g.week&&!g.attended.includes(e.name));function propose(x){if(x.proposal)return x;const last=C.find(c=>c.id===x.unlocked.at(-1)),next=C[last.order+1];return next&&(x.mastery[last.id]||0)>=45&&x.prestige>=last.unloaded?{...x,proposal:next.id}:x}function advance(){if(g.week===16){const prep={...g.prep};g.unlocked.forEach(id=>{prep[id]=Math.max(Math.round((g.mastery[id]||0)*.5),(prep[id]||0)-(C.find(c=>c.id===id).h<=6?4:12))});setG(x=>({...x,season:x.season+1,week:1,energy:100,attended:[],tests:6,prep,acted:false}));setScreen('season');return}const gain=30+(g.acted?0:5)+Math.min(4,g.tests);setG(x=>propose({...x,week:x.week+1,energy:clamp(x.energy+gain),tests:6,acted:false}))}function startAct(e){setEvent(e);setRun({round:1,valid:0,used:[],results:[],phase:'castells'});setScreen('act')}function attempt(c,pillar=false){const prep=g.prep[c.id]||0,base=prep+g.energy*.1+g.morale*.18-(c.difficulty-25)*.58-event.pressure,r=Math.random()*100,res=r<base+23?'Descarregat':r<base+41?'Carregat':r<base+68?'Intent desmuntat':'Intent',valid=['Descarregat','Carregat'].includes(res),pts=res==='Descarregat'?c.unloaded:res==='Carregat'?c.loaded:0;setG(x=>propose({...x,energy:clamp(x.energy-(res==='Intent'?6:res==='Carregat'?5:3)),morale:clamp(x.morale+(res==='Descarregat'?4:res==='Intent'?-5:0)),prestige:x.prestige+(valid?Math.max(1,Math.round(Math.log10(pts)*2)):0),score:x.score+pts,acted:true,prep:{...x.prep,[c.id]:clamp(prep+(valid?5:1))},mastery:{...x.mastery,[c.id]:clamp((x.mastery[c.id]||0)+(valid?2:.5))}}));setRun(x=>pillar?{...x,pillar:{name:c.name,res,pts},phase:'done'}:(()=>{const used=valid?[...x.used,c.id]:x.used,v=x.valid+(valid?1:0),round=x.round+1;return{...x,used,valid:v,round,results:[...x.results,{name:c.name,res,pts}],phase:v>=3||round>5?'pillar':'castells'}})())}
if(screen==='welcome')return <main className="hero"><div className="emoji">🏰</div><small>SIMULADOR CASTELLER</small><h1>AMUNT!</h1><p>Funda una colla, assaja i completa temporades.</p>{saved&&<button onClick={()=>setScreen('hub')}>CONTINUAR</button>}<button className="dark" onClick={()=>setScreen('setup')}>NOVA COLLA</button></main>;
if(screen==='setup')return <main className="wrap"><h1>Funda la teva colla</h1><input placeholder="Nom de la colla" value={club.name} onChange={e=>setClub({...club,name:e.target.value})}/><input placeholder="Ciutat o poble" value={club.town} onChange={e=>setClub({...club,town:e.target.value})}/><div className="colors">{COLORS.map(c=><button key={c} className={club.color===c?'selected':''} style={{background:c}} onClick={()=>setClub({...club,color:c})}/>)}</div><button className="dark wide" onClick={()=>club.name&&club.town&&(setG(INIT),setScreen('hub'))}>COMENÇA LA HISTÒRIA</button></main>;
if(screen==='choose')return <main className="wrap"><button onClick={()=>setScreen('hub')}>← Tornar</button><h1>Assaig</h1><div className="notice">{g.tests} proves disponibles aquesta setmana</div><div className="grid">{avail.map(c=><button className="card" disabled={!g.tests} key={c.id} onClick={()=>{setPick(c);setScreen('training')}}><b>{c.name}</b><span>{feel(g.prep[c.id]||0)}</span></button>)}</div></main>;
if(screen==='training')return <Training c={pick} color={club.color} done={o=>{setG(x=>propose({...x,tests:x.tests-1,energy:clamp(x.energy-o.cost),prep:{...x.prep,[pick.id]:clamp((x.prep[pick.id]||0)+o.gain)},mastery:{...x.mastery,[pick.id]:clamp((x.mastery[pick.id]||0)+o.gain*.3)}}));setScreen('choose')}}/>;
if(screen==='act')return <Act event={event} run={run} avail={avail} g={g} attempt={attempt} finish={()=>{setG(x=>({...x,attended:[...x.attended,event.name],members:x.members+Math.ceil(event.fans/8)}));setScreen('hub')}}/>;
if(screen==='proposal'){const c=C.find(x=>x.id===g.proposal);return <main className="hero"><div className="emoji">🧑‍🏫</div><h2>Comencem a treballar el {c.name}?</h2><button onClick={()=>{setG(x=>({...x,unlocked:[...x.unlocked,c.id],prep:{...x.prep,[c.id]:5},mastery:{...x.mastery,[c.id]:5},proposal:null}));setScreen('hub')}}>SÍ, COMENCEM</button><button className="ghost" onClick={()=>{setG(x=>({...x,proposal:null}));setScreen('hub')}}>ARA NO</button></main>}
if(screen==='season')return <main className="hero"><div className="emoji">🏆</div><h1>Temporada {g.season-1} completada</h1><p>Conserves colla, prestigi i castells. La preparació baixa, però mai per sota del 50% del domini permanent.</p><button onClick={()=>setScreen('hub')}>NOVA TEMPORADA</button></main>;
return <main className="wrap"><button className="rules" onClick={()=>setRules(true)}>📖 Regles</button><small>TEMPORADA {g.season} · SETMANA {g.week}/16</small><h1>{club.name}</h1><b>{club.town}</b><div className="stats">{[['COLLA',g.members],['ENERGIA',g.energy+'%'],['MORAL',g.morale+'%'],['PRESTIGI',g.prestige],['PUNTS',g.score]].map(x=><div className="card" key={x[0]}><strong>{x[1]}</strong><small>{x[0]}</small></div>)}</div>{g.proposal&&<button className="proposal wide" onClick={()=>setScreen('proposal')}>🧑‍🏫 Hi ha una proposta tècnica nova</button>}{now&&<button className="event wide" onClick={()=>startAct(now)}><b>{now.icon} {now.name}</b><span>ANAR A PLAÇA</span></button>}<div className="grid three"><button className="card" onClick={()=>setScreen('choose')}>🏋️<b>Assaig</b><span>{g.tests} proves</span></button><button className="card" onClick={()=>alert(EVENTS.map(e=>`Setmana ${e.week}: ${e.name}`).join('\n'))}>📅<b>Calendari</b><span>Veure actuacions</span></button><button className="card" onClick={advance}>🌙<b>Passar setmana</b><span>+30 o més energia</span></button></div><section className="card"><h2>Llibreta del cap de colla</h2>{avail.map(c=><div className="row" key={c.id}><b>{c.name}</b><span>{feel(g.prep[c.id]||0)}</span></div>)}</section>{rules&&<Rules close={()=>setRules(false)}/>}</main>}
function Training({c,color,done}){const s=useMemo(()=>rows(c),[c]),[step,setStep]=useState(1),[stress,setStress]=useState(8),[busy,setBusy]=useState(false);function up(){setBusy(true);setStress(x=>clamp(x+5+c.difficulty*.05+step*.5));setTimeout(()=>{setStep(x=>Math.min(s.length,x+1));setBusy(false)},500)}function down(){const ratio=step/s.length;done({gain:Math.max(2,Math.round(ratio*10)),cost:ratio>.9?3:ratio>.55?2:1})}return <main className="wrap"><h1>Prova de {c.name}</h1><div className="local"><div className="local-title">LOCAL D'ASSAIG</div><div className="tower">{s.slice(0,step).reverse().map((r,i)=><div key={i} className={r.includes('Pinya')?'pinya':r==='Folre'||r==='Manilles'||r==='Puntals'?'support':'floor'} style={{borderColor:color}}>{r}</div>)}</div><div className="bubble">{s[step]||"L'enxaneta ja és a dalt. Desmuntem?"}</div></div><div className="controls"><button disabled={busy||step>=s.length} onClick={up}>⬆ AMUNT</button><button className="amber" disabled={busy} onClick={()=>{setBusy(true);setStress(x=>clamp(x+8));setTimeout(()=>setBusy(false),900)}}>⏸ AGUANTEM</button><button className="red" onClick={down}>⬇ DESMUNTEM</button></div><p>Com més amunt arribi la prova, més millora. Aguantar augmenta la tensió i no dona millora extra per si sol.</p></main>}
function Act({event,run,avail,g,attempt,finish}){const pool=run.phase==='pillar'?avail.filter(c=>c.pillar):avail.filter(c=>!c.pillar&&!run.used.includes(c.id));return <main className="wrap"><div className="center emoji">{event.icon}</div><h1 className="center">{event.name}</h1><p className="center"><b>{run.phase==='castells'?`Ronda ${run.round} de 5 · ${run.valid}/3 castells vàlids`:run.phase==='pillar'?'Ronda obligatòria de pilars':'Actuació acabada'}</b></p><section className="card">{run.results.map((r,i)=><div className="row" key={i}><b>{i+1}a · {r.name}</b><span>{r.res} · {r.pts}</span></div>)}{run.pillar&&<div className="row"><b>{run.pillar.name}</b><span>{run.pillar.res}</span></div>}</section>{run.phase!=='done'?<div className="grid">{pool.map(c=><button className="card" key={c.id} onClick={()=>attempt(c,run.phase==='pillar')}><b>{c.name}</b><span>{feel(g.prep[c.id]||0)} · C {c.loaded} / D {c.unloaded}</span></button>)}</div>:<button className="dark wide" onClick={finish}>TANCAR L'ACTUACIÓ</button>}</main>}
function Rules({close}){return <div className="modal"><div className="sheet"><button onClick={close}>✕</button><h1>Regles d'Amunt!</h1><p><b>⚡ Energia:</b> +30 per setmana, +5 sense actuació i fins a +4 per proves no usades.</p><p><b>⭐ Prestigi:</b> reconeixement de la colla, separat dels punts castellers.</p><p><b>🏆 Punts:</b> puntuació 2026 de carregat i descarregat.</p><p><b>🏋️ Assaig:</b> 6 proves setmanals. Com més amunt i millor desmuntada, més millora.</p><p><b>🏰 Pisos:</b> pinya i baixos compten un pis. Folre, manilles i puntals també compten.</p><p><b>🎺 Actuació:</b> 5 rondes per fer 3 castells vàlids, més ronda de pilars.</p><p><b>❄️ Hivern:</b> la forma baixa, però es conserva almenys el 50% del domini permanent.</p></div></div>}
export default App;
