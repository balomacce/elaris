import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  bg:"#07070c", surface:"#0e0e18", border:"#1e1e2c",
  gold:"#c9a96e", goldDim:"#7a5e30", text:"#cec6b4",
  muted:"#5a5448", red:"#d94f4f", blue:"#4a80d4", green:"#4aaa6a",
  purple:"#a78bfa", orange:"#d97c30",
};

// ── REGIÕES ──────────────────────────────────────────────
const REGIOES = {
  varnok:{ id:"varnok", nome:"Varnok", emoji:"🏙️", tipo:"Cidade", perigo:"Seguro",
    cor:"#c9a96e", desc:"A cidade dos mercenários. Centro de tudo.", clima:"limpo",
    locais:["Guilda dos Mercenários","Mercado de Armas","Taverna do Osso","Templo Abandonado","Porto da Essência"],
    missoes:["caça","proteção","investigação"] },
  lunaris:{ id:"lunaris", nome:"Floresta de Lunaris", emoji:"🌲", tipo:"Floresta", perigo:"Médio",
    cor:"#5ab870", desc:"Névoa permanente. Monstros. Espíritos. Mais perigosa à noite.", clima:"nevoa",
    locais:["Entrada da Floresta","Árvore Anciã","Acampamento Abandonado","Gruta dos Lobos"],
    missoes:["caça","recuperação"] },
  vale:{ id:"vale", nome:"Vale Carmesim", emoji:"⚔️", tipo:"Campo de batalha", perigo:"Alto",
    cor:"#d94f4f", desc:"Terra vermelha. PvP comum. Ordem de Ferro tem presença forte.", clima:"tempestade",
    locais:["Forte da Ordem de Ferro","Ruínas do Vale","Campo dos Guerreiros"],
    missoes:["eliminação","facção"] },
  cordilheira:{ id:"cordilheira", nome:"Cordilheira Tempestade", emoji:"⛰️", tipo:"Montanha", perigo:"Alto",
    cor:"#4a80d4", desc:"Ventos cortantes. Raios frequentes. Ótimo para treino extremo.", clima:"tempestade",
    locais:["Pico do Trovão","Caverna dos Grifos","Altar de Velthor"],
    missoes:["caça","treino"] },
  deserto:{ id:"deserto", nome:"Deserto Cinzento", emoji:"🏜️", tipo:"Deserto", perigo:"Alto",
    cor:"#d97c30", desc:"Calor extremo. Criaturas enormes. Cristais de Essência raros.", clima:"calor",
    locais:["Oásis Secreto","Templo Soterrado","Ninho das Serpentes"],
    missoes:["caça","recuperação"] },
  ruinas:{ id:"ruinas", nome:"Ruínas da Fratura", emoji:"💀", tipo:"Zona Endgame", perigo:"Extremo",
    cor:"#a78bfa", desc:"O lugar mais perigoso do mundo. Apenas grupo completo pode entrar.", clima:"luavermelha",
    locais:["Epicentro da Fratura","Templo dos Deuses","Aberração Dormente"],
    missoes:["história principal"], rankMinimo:"ouro" },
};

// ── MISSÕES ───────────────────────────────────────────────
const MISSOES_DISPONIVEIS = [
  { id:"m1", titulo:"Lobos na Floresta", regiao:"lunaris", tipo:"caça", rank:"bronze",
    desc:"Lobos estão atacando viajantes perto de Lunaris. Elimine a ameaça.", emoji:"🐺",
    recompensa:"50 ouros + item comum", principal:false },
  { id:"m2", titulo:"Entrega Urgente", regiao:"varnok", tipo:"proteção", rank:"bronze",
    desc:"Escorte um comerciante de Varnok até o posto avançado.", emoji:"📦",
    recompensa:"30 ouros + reputação Guilda", principal:false },
  { id:"m3", titulo:"O Espírito Perturbado", regiao:"lunaris", tipo:"investigação", rank:"prata",
    desc:"Um espírito antigo na Árvore Anciã está agindo de forma estranha. Descubra o motivo.", emoji:"👻",
    recompensa:"Relíquia comum + lore", principal:false },
  { id:"m4", titulo:"Cristal de Essência", regiao:"deserto", tipo:"recuperação", rank:"prata",
    desc:"Recupere um cristal de Essência Pura do Templo Soterrado.", emoji:"💎",
    recompensa:"100 ouros + cristal", principal:false },
  { id:"m5", titulo:"A Ameaça do Vale", regiao:"vale", tipo:"eliminação", rank:"ouro",
    desc:"Uma criatura corrompida domina o Vale Carmesim. Grupo completo necessário.", emoji:"⚔️",
    recompensa:"200 ouros + relíquia rara", principal:true },
  { id:"m6", titulo:"O Segredo da Fratura", regiao:"ruinas", tipo:"história principal", rank:"ouro",
    desc:"Os Guardiões Antigos enviaram uma mensagem. O epicentro está instável. TODOS necessários.", emoji:"🌀",
    recompensa:"Lore + relíquia épica + avanço da história", principal:true },
];

// ── PERSONAGENS ───────────────────────────────────────────
const HEROES_TEMPLATE = {
  balo:{ id:"balo", nome:"Balo Balesco", emoji:"🗡️", classe:"Lutador", arma:"Adaga", poder:"Sombra",
    cor:"#c9a96e", corDim:"#7a5e30", hp:2.5, maxHp:5, en:5, maxEn:5, maestria:1,
    rank:"bronze", rankPts:3, ouro:50,
    attrs:{"💪 FOR":3,"⚡ AGI":7,"🛡️ RES":3,"🔋 ENE":5,"🎯 CTR":2},
    espec:"Parry", fraq:"Pouca força física", status:"Arranhão no braço",
    statusEfeitos:[], regiao:"lunaris", missaoAtiva:null },
  fuboka:{ id:"fuboka", nome:"Fuboka", emoji:"🌑", classe:"Especialista", arma:"Cavaleiro das Almas", poder:"Invocação",
    cor:"#8888e8", corDim:"#404080", hp:3, maxHp:5, en:6, maxEn:6, maestria:1,
    rank:"bronze", rankPts:0, ouro:50,
    attrs:{"💪 FOR":2,"⚡ AGI":2,"🛡️ RES":3,"🔋 ENE":6,"🎯 CTR":7},
    espec:"Domar", fraq:"Toma mais dano direto", status:null,
    statusEfeitos:[], regiao:"lunaris", missaoAtiva:null },
  patosauro:{ id:"patosauro", nome:"Patosauro", emoji:"🦖", classe:"Especialista", arma:"T-Rex", poder:"Invocação",
    cor:"#5ab870", corDim:"#2a5a38", hp:3, maxHp:5, en:7, maxEn:7, maestria:1,
    rank:"bronze", rankPts:0, ouro:50,
    attrs:{"💪 FOR":2,"⚡ AGI":3,"🛡️ RES":2,"🔋 ENE":7,"🎯 CTR":6},
    espec:"Controle de Combate", fraq:"Força física", status:null,
    statusEfeitos:[], regiao:"lunaris", missaoAtiva:null },
};

const RANKS = ["bronze","prata","ouro","platina","lendario"];
const RANK_EMOJI = { bronze:"🥉", prata:"🥈", ouro:"🥇", platina:"💎", lendario:"👑" };
const RANK_PTS_NEEDED = { bronze:5, prata:10, ouro:15, platina:20, lendario:999 };

const INIMIGOS_LUNARIS = [
  { id:"loboB", nome:"Lobo B", emoji:"🐺", categoria:"Comum", hp:1, maxHp:3, status:"Gravemente ferido", vivo:true, traits:[], statusEfeitos:[], moral:30 },
  { id:"loboC", nome:"Lobo C", emoji:"🐺", categoria:"Comum", hp:3, maxHp:3, status:"Enraivecido", vivo:true, traits:["furioso"], statusEfeitos:[], moral:80 },
];

const TRAITS_DEF = {
  furioso:{ nome:"Furioso", emoji:"🔴", cor:"#d94f4f", desc:"+1 dano abaixo 50% HP" },
  blindado:{ nome:"Blindado", emoji:"🟤", cor:"#a0724a", desc:"Reduz 1 dano recebido" },
  vampirico:{ nome:"Vampírico", emoji:"🟣", cor:"#9b59b6", desc:"Cura ½❤️ ao atacar" },
  regenerativo:{ nome:"Regenerativo", emoji:"💚", cor:"#4aaa6a", desc:"Recupera 1❤️/turno" },
  instavel:{ nome:"Instável", emoji:"💥", cor:"#e74c3c", desc:"Explode ao morrer 1❤️ AoE" },
  maldito:{ nome:"Maldito", emoji:"💀", cor:"#c0392b", desc:"Aplica Maldição" },
};

const STATUS_DEFS = {
  sangramento:{ nome:"Sangramento", emoji:"🩸", cor:"#c0392b", dur:2 },
  veneno:{ nome:"Veneno", emoji:"☠️", cor:"#27ae60", dur:3 },
  congelamento:{ nome:"Congelado", emoji:"❄️", cor:"#3498db", dur:1 },
  maldicao:{ nome:"Maldição", emoji:"💀", cor:"#c0392b", dur:2 },
  corrupcao:{ nome:"Corrupção", emoji:"⚫", cor:"#555", dur:99 },
  choque:{ nome:"Choque", emoji:"⚡", cor:"#f1c40f", dur:1 },
};

const POLL_MS = 2500;
function genCode() { return Math.random().toString(36).substring(2,6).toUpperCase(); }

// ── STORAGE ───────────────────────────────────────────────
async function saveRoom(code, data) {
  try { await window.storage.set(`elarisv3:${code}`, JSON.stringify(data), true); } catch(e){}
}
async function loadRoom(code) {
  try {
    const r = await window.storage.get(`elarisv3:${code}`, true);
    return r ? JSON.parse(r.value) : null;
  } catch(e){ return null; }
}

function makeRoom(code) {
  return {
    code, phase:"lobby",
    players:{},
    heroes: JSON.parse(JSON.stringify(HEROES_TEMPLATE)),
    mundoEstado:"paz_fragil",
    historiaPts:0,
    combates:{},
    log:[], globalLog:[],
    updatedAt:Date.now(),
  };
}

// ── SYSTEM PROMPT ─────────────────────────────────────────
function buildPrompt(hero, contexto, acao, dado, dadoLabel, regiao, missao) {
  const r = REGIOES[regiao]||REGIOES.varnok;
  return `Você é o Mestre do RPG ELARIS. Narre em português — frases curtas, impacto dramático.

MUNDO: Elaris pós-Fratura. O céu tem uma cicatriz. Monstros, Essência, poderes.
REGIÃO: ${r.emoji} ${r.nome} — ${r.desc} · Clima: ${r.clima}
MISSÃO ATIVA: ${missao||"Exploração livre"}

PERSONAGEM: ${hero.nome} (${hero.classe}) | HP:${hero.hp}/${hero.maxHp} EN:${hero.en}/${hero.maxEn} | Rank:${RANK_EMOJI[hero.rank]} | Ouro:${hero.ouro}
Status: ${(hero.statusEfeitos||[]).map(e=>e.id).join(", ")||"nenhum"}

${contexto||""}

AÇÃO: "${acao}"
DADO d20: ${dado} (${dadoLabel})

REGRAS:
- d20: 1-5=falha crítica,6-10=ruim,11-15=normal,16-19=bom,20=crítico
- Bônus estratégia +2 a +5 (usar cenário, fraqueza, armadilha)
- Dano: ½❤ fraco,1❤ médio,2❤ forte,3❤+ ultimate
- Essência: uso excessivo pode corromper
- Em Varnok: narrar interações com NPCs, compras, missões
- Em combate: narrar resultado do dado
- Fora de combate: narrar exploração, descobertas, encontros

Responda SOMENTE com JSON sem markdown:
{
  "narracao": "2-3 parágrafos dramáticos ou descritivos",
  "danoInimigos": [{"id":"id_inimigo","valor":0,"statusAplicado":"null|id_status"}],
  "danoHeroi": {"valor":0,"statusAplicado":"null|id_status"},
  "curaHeroi": 0,
  "custoEnergia": 0,
  "ganhouOuro": 0,
  "maestriaPts": 0,
  "rankPts": 0,
  "missaoConcluida": false,
  "eventoEspecial": null
}`;
}

// ── UI ATOMS ──────────────────────────────────────────────
function Pip({ filled, half, color, size=9 }) {
  return <div style={{ width:size,height:size,borderRadius:"50%",flexShrink:0,
    background:filled?color:half?`linear-gradient(90deg,${color} 50%,#111 50%)`:"#111",
    border:`1px solid ${filled||half?color+"99":"#222"}`,
    boxShadow:filled?`0 0 5px ${color}66`:"none",transition:"all 0.4s" }}/>;
}
function PipRow({ val, max, color, size=9 }) {
  return <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
    {Array.from({length:max},(_,i)=>
      <Pip key={i} filled={i<Math.floor(val)} half={!(i<Math.floor(val))&&i<val} color={color} size={size}/>)}
  </div>;
}

function DiceOverlay({ value, onClose }) {
  const [cur,setCur]=useState(1); const [done,setDone]=useState(false);
  useEffect(()=>{let i=0;const iv=setInterval(()=>{setCur(Math.ceil(Math.random()*20));i++;if(i>22){clearInterval(iv);setCur(value);setDone(true);}},60);return()=>clearInterval(iv);},[value]);
  const col=value>=16?T.green:value>=11?T.gold:value>=6?T.orange:T.red;
  const lbl=value===20?"CRÍTICO! 🔥":value>=16?"Muito bom!":value>=11?"Normal":value>=6?"Ruim":"Falha crítica!";
  return <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:999,background:"rgba(4,4,8,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
    <div style={{fontSize:9,letterSpacing:4,color:"#333",marginBottom:24}}>d20</div>
    <div style={{fontSize:120,lineHeight:1,color:done?col:"#2a2a2a",textShadow:done?`0 0 60px ${col},0 0 20px ${col}`:"none",transition:"all 0.3s",minWidth:160,textAlign:"center",fontWeight:700}}>{cur}</div>
    <div style={{marginTop:20,fontSize:16,color:done?col:"transparent",letterSpacing:2,transition:"color 0.4s"}}>{lbl}</div>
    <div style={{marginTop:32,fontSize:11,color:"#2a2a2a"}}>toque para fechar</div>
  </div>;
}

function TraitBadge({ tid }) {
  const t=TRAITS_DEF[tid]; if(!t) return null;
  return <span style={{fontSize:9,padding:"1px 5px",borderRadius:4,background:t.cor+"22",border:`1px solid ${t.cor}44`,color:t.cor,marginRight:2}}>{t.emoji} {t.nome}</span>;
}
function StatusBadge({ sid, dur }) {
  const s=STATUS_DEFS[sid]; if(!s) return null;
  return <span style={{fontSize:9,padding:"1px 5px",borderRadius:4,background:s.cor+"22",border:`1px solid ${s.cor}44`,color:s.cor,marginRight:2}}>{s.emoji} {s.nome}{dur?` (${dur})`:""}</span>;
}

function RankBar({ rank, pts }) {
  const needed = RANK_PTS_NEEDED[rank]||5;
  const pct = Math.min(100,(pts/needed)*100);
  const emoji = RANK_EMOJI[rank]||"🥉";
  return <div style={{marginTop:4}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
      <span style={{fontSize:9,color:T.gold}}>{emoji} {rank.toUpperCase()}</span>
      <span style={{fontSize:9,color:T.muted}}>{pts}/{needed}</span>
    </div>
    <div style={{height:2,background:"#111",borderRadius:1}}>
      <div style={{width:`${pct}%`,height:"100%",background:T.gold,borderRadius:1,transition:"width 0.5s"}}/>
    </div>
  </div>;
}

// ── MAPA ──────────────────────────────────────────────────
function MapaScreen({ myHero, room, onViajar, onFechar }) {
  const [hover,setHover]=useState(null);
  const outrosJogadores = Object.entries(room.heroes)
    .filter(([id])=>id!==myHero.id&&room.players[id])
    .map(([id,h])=>({ id, nome:room.players[id]?.nome, regiao:h.regiao, emoji:h.emoji }));

  return <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(4,4,8,0.96)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{width:"100%",maxWidth:480}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:18,color:T.gold,fontWeight:700}}>🗺️ MAPA DE ELARIS</div>
        <button onClick={onFechar} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"5px 10px",cursor:"pointer"}}>✕</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {Object.values(REGIOES).map(r=>{
          const aqui = myHero.regiao===r.id;
          const outros = outrosJogadores.filter(j=>j.regiao===r.id);
          const bloqueada = r.rankMinimo && RANKS.indexOf(myHero.rank)<RANKS.indexOf(r.rankMinimo);
          return <div key={r.id}
            onClick={()=>!bloqueada&&onViajar(r.id)}
            onMouseEnter={()=>setHover(r.id)} onMouseLeave={()=>setHover(null)}
            style={{
              borderRadius:12,padding:14,cursor:bloqueada?"not-allowed":"pointer",opacity:bloqueada?0.4:1,
              border:`1px solid ${aqui?r.cor+"88":hover===r.id?r.cor+"44":T.border}`,
              background:aqui?`${r.cor}15`:hover===r.id?`${r.cor}08`:T.surface,
              transition:"all 0.2s",
            }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{fontSize:20}}>{r.emoji}</div>
              <div style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:
                r.perigo==="Seguro"?T.green+"22":r.perigo==="Médio"?T.orange+"22":r.perigo==="Alto"?T.red+"22":"#a78bfa22",
                color:r.perigo==="Seguro"?T.green:r.perigo==="Médio"?T.orange:r.perigo==="Alto"?T.red:T.purple
              }}>{r.perigo}</div>
            </div>
            <div style={{fontSize:12,color:aqui?r.cor:T.text,fontWeight:700,marginTop:6}}>{r.nome}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:2,lineHeight:1.4}}>{r.desc.substring(0,50)}...</div>
            {aqui&&<div style={{marginTop:6,fontSize:9,color:r.cor}}>📍 Você está aqui</div>}
            {outros.length>0&&<div style={{marginTop:4,display:"flex",gap:4}}>
              {outros.map(j=><span key={j.id} style={{fontSize:10}}>{j.emoji}</span>)}
            </div>}
            {bloqueada&&<div style={{marginTop:4,fontSize:9,color:T.muted}}>🔒 Requer rank {r.rankMinimo}</div>}
          </div>;
        })}
      </div>
    </div>
  </div>;
}

// ── GUILDA ────────────────────────────────────────────────
function GuildaScreen({ myHero, room, onAceitarMissao, onFechar }) {
  const missoesDispo = MISSOES_DISPONIVEIS.filter(m=>{
    const rankOk = RANKS.indexOf(myHero.rank)>=RANKS.indexOf(m.rank);
    if(m.principal){
      const todos = Object.keys(room.players).every(id=>room.heroes[id]?.regiao==="varnok");
      return rankOk && todos;
    }
    return rankOk;
  });

  return <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(4,4,8,0.96)",overflowY:"auto",padding:16}}>
    <div style={{maxWidth:480,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:18,color:T.gold,fontWeight:700}}>⚔️ GUILDA DOS MERCENÁRIOS</div>
        <button onClick={onFechar} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"5px 10px",cursor:"pointer"}}>✕</button>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",marginBottom:14}}>
        <div style={{fontSize:10,color:T.muted,marginBottom:4}}>SEU RANK</div>
        <RankBar rank={myHero.rank} pts={myHero.rankPts}/>
        <div style={{fontSize:10,color:T.muted,marginTop:8}}>💰 {myHero.ouro} ouros</div>
      </div>
      <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:10}}>MISSÕES DISPONÍVEIS</div>
      {missoesDispo.map(m=>(
        <div key={m.id} style={{background:T.surface,border:`1px solid ${m.principal?"#a78bfa44":T.border}`,borderRadius:12,padding:14,marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{fontSize:14,color:m.principal?T.purple:T.gold,fontWeight:700}}>{m.emoji} {m.titulo}</div>
            <div style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:`${RANK_EMOJI[m.rank]?"#c9a96e":"#888"}22`,color:T.gold}}>{RANK_EMOJI[m.rank]} {m.rank}</div>
          </div>
          {m.principal&&<div style={{fontSize:9,color:T.purple,marginTop:2}}>🌀 MISSÃO PRINCIPAL — requer todos em Varnok</div>}
          <div style={{fontSize:12,color:T.muted,marginTop:6,lineHeight:1.5}}>{m.desc}</div>
          <div style={{fontSize:10,color:T.green,marginTop:6}}>Recompensa: {m.recompensa}</div>
          <button
            onClick={()=>onAceitarMissao(m)}
            disabled={myHero.missaoAtiva===m.id}
            style={{marginTop:10,width:"100%",padding:"8px",background:myHero.missaoAtiva===m.id?"#1a2a1a":"#1a2e1a",border:`1px solid ${myHero.missaoAtiva===m.id?"#2a3a2a":T.green}`,borderRadius:8,color:myHero.missaoAtiva===m.id?T.muted:T.green,fontSize:12,cursor:myHero.missaoAtiva===m.id?"default":"pointer",fontFamily:"Georgia,serif"}}>
            {myHero.missaoAtiva===m.id?"✅ Missão aceita":"Aceitar Missão"}
          </button>
        </div>
      ))}
      {missoesDispo.length===0&&<div style={{fontSize:12,color:T.muted,fontStyle:"italic",textAlign:"center",padding:20}}>Nenhuma missão disponível para seu rank neste momento.</div>}
    </div>
  </div>;
}

// ── GAME SCREEN ───────────────────────────────────────────
function GameScreen({ room, myHeroId, myName, onUpdate }) {
  const [acao,setAcao]=useState("");
  const [dado,setDado]=useState(null);
  const [diceVal,setDiceVal]=useState(null);
  const [showDice,setShowDice]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [narracao,setNarracao]=useState("");
  const [tab,setTab]=useState("mundo");
  const [showMapa,setShowMapa]=useState(false);
  const [showGuilda,setShowGuilda]=useState(false);
  const [inimigos,setInimigos]=useState(JSON.parse(JSON.stringify(INIMIGOS_LUNARIS)));
  const [combatando,setCombatando]=useState(true);
  const bottomRef=useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[narracao]);

  const myH = room.heroes[myHeroId];
  const regiao = REGIOES[myH?.regiao]||REGIOES.varnok;
  const emVarnok = myH?.regiao==="varnok";
  const missionaAtiva = MISSOES_DISPONIVEIS.find(m=>m.id===myH?.missaoAtiva);

  const dadoColor=!dado?"#666":dado<=5?T.red:dado<=10?T.orange:dado<=15?T.gold:dado<20?T.green:T.purple;
  const dadoLabel=!dado?"":dado<=5?"Falha crítica!":dado<=10?"Ruim":dado<=15?"Normal":dado<20?"Muito bom!":"CRÍTICO! 🔥";

  function rollDice(){ const v=Math.ceil(Math.random()*20); setDiceVal(v); setShowDice(true); }
  function closeDice(){ if(diceVal) setDado(diceVal); setShowDice(false); }

  async function viajar(regiaoId) {
    const updated={...room,heroes:{...room.heroes,[myHeroId]:{...myH,regiao:regiaoId}},updatedAt:Date.now()};
    await saveRoom(room.code,updated);
    onUpdate(updated);
    setShowMapa(false);
    setNarracao(`Você viajou para ${REGIOES[regiaoId].emoji} **${REGIOES[regiaoId].nome}**.`);
    if(regiaoId==="lunaris") setCombatando(true);
    else setCombatando(false);
  }

  async function aceitarMissao(m) {
    const updated={...room,heroes:{...room.heroes,[myHeroId]:{...myH,missaoAtiva:m.id}},updatedAt:Date.now()};
    await saveRoom(room.code,updated);
    onUpdate(updated);
    setShowGuilda(false);
    setNarracao(`📋 Missão aceita: **${m.titulo}**\n\n${m.desc}\n\nDirija-se para ${REGIOES[m.regiao]?.nome||m.regiao} e complete o objetivo.`);
  }

  async function confirmar() {
    if(!dado||!acao.trim()||submitting) return;
    setSubmitting(true);
    const inimigosVivos = inimigos.filter(e=>e.vivo);
    const ctx = combatando&&inimigosVivos.length>0
      ? `COMBATE ATIVO:\n${inimigosVivos.map(e=>`${e.emoji} ${e.nome}(${e.categoria}): HP ${e.hp}/${e.maxHp} Moral:${e.moral}% Traits:[${e.traits.join(",")||"nenhum"}]`).join("\n")}`
      : emVarnok
        ? `VARNOK: Jogador está na cidade. NPCs disponíveis: Maren(Guilda), Durk(Ferreiro), Taverna do Osso.`
        : `EXPLORAÇÃO LIVRE em ${regiao.nome}.`;

    const sys = buildPrompt(myH, ctx, acao, dado, dadoLabel, myH.regiao, missionaAtiva?.titulo);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content:acao}]}),
      });
      const data=await res.json();
      const txt=data.content?.find(b=>b.type==="text")?.text||"{}";
      let result={};
      try{ result=JSON.parse(txt.replace(/```json|```/g,"").trim()); }catch(e){ result={narracao:txt}; }

      setNarracao(result.narracao||"O Mestre observa em silêncio.");

      let newH={...myH};
      let newInimigos=[...inimigos];
      let newLog=[...(room.log||[])];

      // Dano em inimigos
      (result.danoInimigos||[]).forEach(d=>{
        const idx=newInimigos.findIndex(e=>e.id===d.id);
        if(idx>=0&&newInimigos[idx].vivo){
          const ni=[...newInimigos];
          ni[idx]={...ni[idx],hp:Math.max(0,ni[idx].hp-d.valor),vivo:(ni[idx].hp-d.valor)>0};
          if(d.statusAplicado&&d.statusAplicado!=="null"){
            ni[idx].statusEfeitos=[...(ni[idx].statusEfeitos||[]),{id:d.statusAplicado,dur:STATUS_DEFS[d.statusAplicado]?.dur||2}];
          }
          newInimigos=ni;
          if(d.valor>0) newLog=[`⚔️ ${myH.nome} causou ${d.valor}❤️ em ${ni[idx].nome}`,...newLog.slice(0,19)];
        }
      });
      setInimigos(newInimigos);

      // Dano no herói
      if(result.danoHeroi?.valor>0){
        newH={...newH,hp:Math.max(0,newH.hp-result.danoHeroi.valor)};
        if(result.danoHeroi.statusAplicado&&result.danoHeroi.statusAplicado!=="null"){
          newH={...newH,statusEfeitos:[...(newH.statusEfeitos||[]),{id:result.danoHeroi.statusAplicado,dur:STATUS_DEFS[result.danoHeroi.statusAplicado]?.dur||2}]};
        }
        newLog=[`💔 ${myH.nome} recebeu ${result.danoHeroi.valor}❤️`,...newLog.slice(0,19)];
      }
      if(result.curaHeroi>0) newH={...newH,hp:Math.min(newH.maxHp,newH.hp+result.curaHeroi)};
      if(result.custoEnergia>0) newH={...newH,en:Math.max(0,newH.en-result.custoEnergia)};
      if(result.ganhouOuro>0){ newH={...newH,ouro:(newH.ouro||0)+result.ganhouOuro}; newLog=[`💰 ${myH.nome} ganhou ${result.ganhouOuro} ouros`,...newLog.slice(0,19)]; }

      // Rank e maestria
      let rankPts=(newH.rankPts||0)+(result.rankPts||0);
      let rank=newH.rank;
      if(rankPts>=(RANK_PTS_NEEDED[rank]||5)&&RANKS.indexOf(rank)<RANKS.length-1){
        rank=RANKS[RANKS.indexOf(rank)+1];
        rankPts=0;
        newLog=[`🎉 ${myH.nome} subiu para ${RANK_EMOJI[rank]} ${rank.toUpperCase()}!`,...newLog.slice(0,19)];
      }
      newH={...newH,rank,rankPts,maestria:(newH.maestria||1)+(result.maestriaPts||0)};

      if(result.missaoConcluida){ newH={...newH,missaoAtiva:null}; newLog=[`✅ ${myH.nome} concluiu missão!`,...newLog.slice(0,19)]; }

      const updated={...room,heroes:{...room.heroes,[myHeroId]:newH},log:newLog,updatedAt:Date.now()};
      await saveRoom(room.code,updated);
      onUpdate(updated);
      setAcao(""); setDado(null);
    } catch(err){ console.error(err); setNarracao("O Mestre hesita. Tente novamente."); }
    setSubmitting(false);
  }

  const tabs=[{id:"mundo",label:"🌍 Mundo"},{id:"fichas",label:"📋 Ficha"},{id:"grupo",label:"👥 Grupo"},{id:"log",label:"📜 Log"}];
  const outrosJogadores=Object.entries(room.heroes).filter(([id])=>id!==myHeroId&&room.players[id]);

  return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Georgia,serif"}}>
    {showDice&&diceVal&&<DiceOverlay value={diceVal} onClose={closeDice}/>}
    {showMapa&&<MapaScreen myHero={myH} room={room} onViajar={viajar} onFechar={()=>setShowMapa(false)}/>}
    {showGuilda&&<GuildaScreen myHero={myH} room={room} onAceitarMissao={aceitarMissao} onFechar={()=>setShowGuilda(false)}/>}

    {/* Header */}
    <div style={{borderBottom:`1px solid ${T.border}`,padding:"9px 14px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
      <div style={{fontSize:15,color:T.gold,fontWeight:700,letterSpacing:3}}>⚔️ ELARIS</div>
      <div style={{display:"flex",gap:3}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?"#1e1e28":"transparent",border:tab===t.id?`1px solid ${T.border}`:"1px solid transparent",color:tab===t.id?T.gold:T.muted,borderRadius:6,padding:"4px 9px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{t.label}</button>)}
      </div>
      <div style={{marginLeft:"auto",fontSize:10,color:myH?.cor||T.muted}}>{myH?.emoji} {myName} · {RANK_EMOJI[myH?.rank]}</div>
    </div>

    {tab==="mundo"&&<div style={{display:"flex",height:"calc(100vh - 50px)"}}>
      {/* Sidebar */}
      <div style={{width:185,borderRight:`1px solid ${T.border}`,padding:10,overflowY:"auto",flexShrink:0}}>
        {/* Região atual */}
        <div style={{background:`${regiao.cor}10`,border:`1px solid ${regiao.cor}33`,borderRadius:10,padding:"10px 12px",marginBottom:10}}>
          <div style={{fontSize:11,color:regiao.cor,fontWeight:700}}>{regiao.emoji} {regiao.nome}</div>
          <div style={{fontSize:9,color:T.muted,marginTop:2}}>⚠️ {regiao.perigo}</div>
          {missionaAtiva&&<div style={{marginTop:6,fontSize:9,color:T.green}}>📋 {missionaAtiva.titulo}</div>}
        </div>
        {/* Ações rápidas */}
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
          <button onClick={()=>setShowMapa(true)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.gold,fontSize:11,padding:"7px",cursor:"pointer",fontFamily:"inherit"}}>🗺️ Mapa</button>
          {emVarnok&&<button onClick={()=>setShowGuilda(true)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.gold,fontSize:11,padding:"7px",cursor:"pointer",fontFamily:"inherit"}}>⚔️ Guilda</button>}
        </div>
        {/* HP/EN do herói */}
        <div style={{background:T.surface,border:`1px solid ${myH?.cor||T.border}33`,borderRadius:10,padding:"10px 12px",marginBottom:10}}>
          <div style={{fontSize:11,color:myH?.cor,fontWeight:600,marginBottom:6}}>{myH?.emoji} {myH?.nome}</div>
          <div style={{marginBottom:5}}>
            <div style={{fontSize:8,color:T.muted,marginBottom:3}}>HP</div>
            <PipRow val={myH?.hp||0} max={myH?.maxHp||5} color={T.red} size={7}/>
          </div>
          <div style={{marginBottom:5}}>
            <div style={{fontSize:8,color:T.muted,marginBottom:3}}>ENERGIA</div>
            <PipRow val={myH?.en||0} max={myH?.maxEn||5} color={T.blue} size={7}/>
          </div>
          <RankBar rank={myH?.rank||"bronze"} pts={myH?.rankPts||0}/>
          <div style={{fontSize:10,color:T.gold,marginTop:5}}>💰 {myH?.ouro||0} ouros</div>
          {(myH?.statusEfeitos||[]).length>0&&<div style={{marginTop:5,display:"flex",flexWrap:"wrap"}}>
            {myH.statusEfeitos.map((e,i)=><StatusBadge key={i} sid={e.id} dur={e.dur}/>)}
          </div>}
        </div>
        {/* Inimigos se em combate */}
        {combatando&&myH?.regiao==="lunaris"&&<>
          <div style={{fontSize:9,color:T.muted,letterSpacing:2,marginBottom:6}}>INIMIGOS</div>
          {inimigos.map(e=>(
            <div key={e.id} style={{borderRadius:8,marginBottom:6,padding:"8px 10px",border:`1px solid ${e.vivo?"#3a1a1a":T.border}`,background:e.vivo?"#0f0a0a":T.surface,opacity:e.vivo?1:0.4}}>
              <div style={{color:e.vivo?T.red:"#444",fontSize:11,fontWeight:600}}>{e.emoji} {e.nome} {!e.vivo&&"💀"}</div>
              {e.vivo&&<>
                <div style={{height:2,background:"#1a0a0a",borderRadius:1,margin:"4px 0 2px"}}>
                  <div style={{width:`${(e.hp/e.maxHp)*100}%`,height:"100%",background:T.red,borderRadius:1,transition:"width 0.5s"}}/>
                </div>
                <div style={{fontSize:9,color:T.muted}}>{e.hp}/{e.maxHp}</div>
                {e.traits.length>0&&<div style={{marginTop:3}}>{e.traits.map((t,i)=><TraitBadge key={i} tid={t}/>)}</div>}
                <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                  <span style={{fontSize:8,color:T.muted}}>MORAL</span>
                  <span style={{fontSize:8,color:e.moral>50?T.green:T.red}}>{e.moral}%</span>
                </div>
              </>}
            </div>
          ))}
        </>}
        {/* Outros jogadores */}
        {outrosJogadores.length>0&&<>
          <div style={{fontSize:9,color:T.muted,letterSpacing:2,margin:"8px 0 6px"}}>OUTROS JOGADORES</div>
          {outrosJogadores.map(([id,h])=>(
            <div key={id} style={{borderRadius:8,marginBottom:5,padding:"7px 10px",border:`1px solid ${T.border}`,background:T.surface}}>
              <div style={{fontSize:10,color:h.cor,fontWeight:600}}>{h.emoji} {room.players[id]?.nome}</div>
              <div style={{fontSize:9,color:T.muted}}>{REGIOES[h.regiao]?.emoji} {REGIOES[h.regiao]?.nome||h.regiao}</div>
              <div style={{display:"flex",gap:4,marginTop:3}}>
                <PipRow val={h.hp} max={h.maxHp} color={T.red} size={5}/>
              </div>
            </div>
          ))}
        </>}
      </div>

      {/* Main */}
      <div style={{flex:1,padding:"16px 20px",overflowY:"auto"}}>
        <div style={{fontSize:18,color:T.gold,fontWeight:700,marginBottom:2}}>{regiao.emoji} {regiao.nome}</div>
        <div style={{fontSize:10,color:T.muted,marginBottom:12,letterSpacing:1}}>{regiao.desc}</div>
        {regiao.locais&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
          {regiao.locais.map(l=><span key={l} style={{fontSize:9,padding:"3px 8px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,color:T.muted}}>📍 {l}</span>)}
        </div>}
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${T.border},transparent)`,marginBottom:14}}/>

        <div style={{fontSize:12,color:myH?.cor||T.gold,fontWeight:700,marginBottom:10}}>
          {myH?.emoji} {myH?.nome} — o que você faz?
        </div>
        <textarea value={acao} onChange={e=>setAcao(e.target.value)}
          placeholder={emVarnok?"Fale com NPCs, aceite missões, compre equipamentos, descanse...":combatando?"Descreva sua ação de combate...":"Explore, investigue, interaja com o ambiente..."}
          style={{width:"100%",minHeight:80,background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontFamily:"Georgia,serif",fontSize:13,padding:11,resize:"vertical",outline:"none",boxSizing:"border-box",marginBottom:9}}/>
        <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:8,marginBottom:12}}>
          <button onClick={rollDice} disabled={submitting} style={{background:T.gold,border:"none",borderRadius:8,color:"#07070c",fontWeight:700,fontSize:13,padding:"9px 16px",cursor:"pointer",fontFamily:"inherit"}}>🎲 Rolar d20</button>
          <button onClick={confirmar} disabled={!dado||!acao.trim()||submitting}
            style={{background:dado&&acao.trim()&&!submitting?"#1a2e1a":"#111",border:`1px solid ${dado&&acao.trim()&&!submitting?T.green:"#222"}`,color:dado&&acao.trim()&&!submitting?T.green:"#333",borderRadius:8,fontWeight:700,fontSize:13,padding:"9px 16px",cursor:dado&&acao.trim()&&!submitting?"pointer":"default",fontFamily:"inherit"}}>
            {submitting?"⏳ Narrando...":"✅ Confirmar"}
          </button>
          {dado&&<div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:30,color:dadoColor,fontWeight:700,textShadow:`0 0 16px ${dadoColor}66`}}>{dado}</span>
            <span style={{fontSize:12,color:dadoColor,fontWeight:600}}>{dadoLabel}</span>
          </div>}
        </div>

        {narracao&&<div style={{background:"#0a0a12",border:`1px solid ${T.gold}33`,borderRadius:12,padding:"13px 15px",marginTop:4}}>
          <div style={{fontSize:9,color:T.goldDim,letterSpacing:3,marginBottom:8}}>⚔️ O MESTRE NARRA</div>
          {narracao.split("\n\n").map((p,i)=><p key={i} style={{color:T.text,lineHeight:1.85,fontSize:13,margin:"0 0 8px"}}>{p.replace(/\*\*/g,"")}</p>)}
        </div>}
        <div ref={bottomRef}/>
      </div>
    </div>}

    {tab==="fichas"&&<div style={{padding:16,maxWidth:400,margin:"0 auto"}}>
      {myH&&<div style={{background:T.surface,border:`1px solid ${myH.cor}33`,borderRadius:12,padding:16}}>
        <div style={{fontSize:16,color:myH.cor,fontWeight:700,marginBottom:4}}>{myH.emoji} {myH.nome}</div>
        <div style={{fontSize:10,color:T.muted,letterSpacing:1,marginBottom:12}}>{myH.classe} · {myH.espec} · {myH.poder}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {[["❤️ HP",myH.hp,myH.maxHp,T.red],["🔵 EN",myH.en,myH.maxEn,T.blue]].map(([lbl,v,mx,col])=>(
            <div key={lbl} style={{padding:"8px",background:"#0a0a14",borderRadius:7,border:`1px solid ${col}22`}}>
              <div style={{fontSize:9,color:T.muted,marginBottom:4}}>{lbl} {v}/{mx}</div>
              <PipRow val={v} max={mx} color={col} size={8}/>
            </div>
          ))}
        </div>
        {Object.entries(myH.attrs).map(([k,v])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
            <span style={{fontSize:9,color:T.muted,width:54,flexShrink:0}}>{k}</span>
            <div style={{flex:1,height:3,background:"#111",borderRadius:2,overflow:"hidden"}}><div style={{width:`${(v/10)*100}%`,height:"100%",background:myH.cor}}/></div>
            <span style={{fontSize:9,color:T.muted,width:10,textAlign:"right"}}>{v}</span>
          </div>
        ))}
        <div style={{marginTop:10}}>
          <RankBar rank={myH.rank} pts={myH.rankPts}/>
        </div>
        <div style={{marginTop:8,display:"flex",gap:8}}>
          <div style={{padding:"6px 10px",background:"#080f08",border:"1px solid #1a2a1a",borderRadius:7,flex:1}}>
            <div style={{fontSize:8,color:"#4a8a4a"}}>✅ ESPEC.</div>
            <div style={{fontSize:11,color:"#6aaa6a"}}>{myH.espec}</div>
          </div>
          <div style={{padding:"6px 10px",background:"#0f0808",border:"1px solid #2a1a1a",borderRadius:7,flex:1}}>
            <div style={{fontSize:8,color:"#8a4a4a"}}>❌ FRAQ.</div>
            <div style={{fontSize:11,color:"#aa6a6a"}}>{myH.fraq}</div>
          </div>
        </div>
        {myH.status&&<div style={{marginTop:8,fontSize:11,color:"#aa7040",fontStyle:"italic"}}>⚠️ {myH.status}</div>}
        <div style={{marginTop:8,fontSize:12,color:T.gold}}>💰 {myH.ouro} ouros · ⭐ Maestria {myH.maestria}</div>
      </div>}
    </div>}

    {tab==="grupo"&&<div style={{padding:16,maxWidth:440,margin:"0 auto"}}>
      <div style={{fontSize:12,color:T.gold,fontWeight:700,letterSpacing:2,marginBottom:14}}>👥 GRUPO</div>
      {Object.entries(room.heroes).map(([id,h])=>{
        const player=room.players[id];
        if(!player) return null;
        const r=REGIOES[h.regiao];
        return <div key={id} style={{background:T.surface,border:`1px solid ${id===myHeroId?h.cor+"44":T.border}`,borderRadius:12,padding:14,marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:13,color:h.cor,fontWeight:700}}>{h.emoji} {player.nome} {id===myHeroId&&"(você)"}</div>
              <div style={{fontSize:10,color:T.muted}}>{h.nome} · {RANK_EMOJI[h.rank]} {h.rank}</div>
            </div>
            <div style={{fontSize:10,color:r?.cor||T.muted,textAlign:"right"}}>
              <div>{r?.emoji} {r?.nome}</div>
              <div style={{fontSize:9,color:T.muted,marginTop:2}}>⚠️ {r?.perigo}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <div style={{flex:1}}>
              <div style={{fontSize:8,color:T.muted,marginBottom:3}}>HP</div>
              <PipRow val={h.hp} max={h.maxHp} color={T.red} size={7}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:8,color:T.muted,marginBottom:3}}>EN</div>
              <PipRow val={h.en} max={h.maxEn} color={T.blue} size={7}/>
            </div>
          </div>
          {h.missaoAtiva&&<div style={{marginTop:6,fontSize:10,color:T.green}}>📋 {MISSOES_DISPONIVEIS.find(m=>m.id===h.missaoAtiva)?.titulo||"Missão ativa"}</div>}
        </div>;
      })}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:14,marginTop:4}}>
        <div style={{fontSize:11,color:T.gold,fontWeight:700,marginBottom:8}}>🌀 MISSÕES PRINCIPAIS</div>
        <div style={{fontSize:11,color:T.muted,marginBottom:8}}>Requerem todos os jogadores em Varnok.</div>
        {MISSOES_DISPONIVEIS.filter(m=>m.principal).map(m=>{
          const todosEmVarnok=Object.keys(room.players).every(id=>room.heroes[id]?.regiao==="varnok");
          return <div key={m.id} style={{padding:"8px 10px",background:"#0a0814",border:`1px solid ${T.purple}33`,borderRadius:8,marginBottom:6}}>
            <div style={{fontSize:11,color:T.purple,fontWeight:600}}>{m.emoji} {m.titulo}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:3}}>{m.desc}</div>
            <div style={{marginTop:5,fontSize:9,color:todosEmVarnok?T.green:T.orange}}>
              {todosEmVarnok?"✅ Todos em Varnok — disponível!":"⏳ Aguardando todos irem a Varnok"}
            </div>
          </div>;
        })}
      </div>
    </div>}

    {tab==="log"&&<div style={{padding:16,maxWidth:480,margin:"0 auto"}}>
      <div style={{fontSize:12,color:T.gold,fontWeight:700,letterSpacing:2,marginBottom:12}}>📜 LOG</div>
      {(!room.log||room.log.length===0)&&<div style={{color:T.muted,fontStyle:"italic",fontSize:12}}>Nenhuma ação registrada.</div>}
      {(room.log||[]).map((e,i)=><div key={i} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",marginBottom:6,color:T.text,fontSize:12}}>{e}</div>)}
    </div>}
  </div>;
}

// ── LOBBY ─────────────────────────────────────────────────
function LobbyScreen({ room, myHeroId, myName, setMyName, onJoin, onReady }) {
  const [hover,setHover]=useState(null);
  const taken=Object.keys(room.players);
  const allReady=taken.length>=2&&taken.every(id=>room.players[id]?.ready);
  return <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 16px"}}>
    <div style={{textAlign:"center",marginBottom:24}}>
      <div style={{fontSize:32,color:T.gold,fontWeight:700,letterSpacing:6,textShadow:`0 0 40px ${T.gold}44`}}>ELARIS</div>
      <div style={{fontSize:11,color:T.goldDim,letterSpacing:4,marginTop:6}}>MUNDO ABERTO · MULTIPLAYER</div>
    </div>
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px",marginBottom:16,textAlign:"center",width:"100%",maxWidth:360}}>
      <div style={{fontSize:10,color:T.muted,letterSpacing:3,marginBottom:4}}>CÓDIGO DA SALA</div>
      <div style={{fontSize:32,color:T.gold,fontWeight:700,letterSpacing:8}}>{room.code}</div>
    </div>
    {!myHeroId&&<>
      <input value={myName} onChange={e=>setMyName(e.target.value)} placeholder="Seu nome de aventureiro..." maxLength={16}
        style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontFamily:"Georgia,serif",fontSize:14,padding:"10px 14px",outline:"none",marginBottom:12,width:"100%",maxWidth:360,boxSizing:"border-box"}}/>
      <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:360}}>
        {Object.values(HEROES_TEMPLATE).map(p=>{
          const isTaken=taken.includes(p.id);
          return <div key={p.id} onClick={()=>!isTaken&&myName.trim()&&onJoin(p.id)}
            onMouseEnter={()=>setHover(p.id)} onMouseLeave={()=>setHover(null)}
            style={{borderRadius:12,overflow:"hidden",cursor:isTaken||!myName.trim()?"not-allowed":"pointer",opacity:isTaken?0.4:1,
              border:`1px solid ${hover===p.id&&!isTaken?p.cor+"66":T.border}`,
              background:hover===p.id&&!isTaken?`${p.cor}0d`:T.surface,transition:"all 0.2s",transform:hover===p.id&&!isTaken?"scale(1.02)":"scale(1)"}}>
            <div style={{display:"flex"}}>
              <div style={{width:4,background:`linear-gradient(180deg,${p.cor},${p.corDim})`,flexShrink:0}}/>
              <div style={{padding:"12px 14px",flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div style={{fontSize:14,color:p.cor,fontWeight:700}}>{p.emoji} {p.nome}</div>
                  {isTaken&&<div style={{fontSize:10,color:T.muted}}>🔒 {room.players[p.id]?.nome}</div>}
                </div>
                <div style={{fontSize:10,color:T.muted,marginTop:2}}>{p.classe} · {p.espec}</div>
              </div>
            </div>
          </div>;
        })}
      </div>
    </>}
    {myHeroId&&<>
      <div style={{width:"100%",maxWidth:360,marginBottom:12}}>
        {Object.entries(room.players).map(([id,p])=>{
          const h=HEROES_TEMPLATE[id];
          return <div key={id} style={{background:T.surface,border:`1px solid ${id===myHeroId?h.cor+"44":T.border}`,borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>{h.emoji}</span>
            <div style={{flex:1}}><div style={{fontSize:12,color:id===myHeroId?h.cor:T.text,fontWeight:600}}>{p.nome}{id===myHeroId&&" (você)"}</div><div style={{fontSize:10,color:T.muted}}>{h.nome}</div></div>
            <div style={{fontSize:11,color:p.ready?T.green:T.muted}}>{p.ready?"✅":"⏳"}</div>
          </div>;
        })}
        {taken.length<2&&<div style={{fontSize:11,color:T.muted,fontStyle:"italic",textAlign:"center",padding:8}}>Aguardando mais jogadores...</div>}
      </div>
      {!room.players[myHeroId]?.ready&&<button onClick={onReady} style={{background:T.green,border:"none",borderRadius:10,color:"#07070c",fontWeight:700,fontSize:15,padding:"12px 32px",cursor:"pointer",letterSpacing:2}}>✅ ESTOU PRONTO</button>}
      {room.players[myHeroId]?.ready&&!allReady&&<div style={{fontSize:13,color:T.muted,fontStyle:"italic"}}>Aguardando os outros...</div>}
      {allReady&&<div style={{fontSize:13,color:T.green,fontWeight:600}}>🎲 Iniciando...</div>}
    </>}
  </div>;
}

// ── ENTRY ─────────────────────────────────────────────────
function EntryScreen({ onCreate, onJoinRoom }) {
  const [code,setCode]=useState(""); const [loading,setLoading]=useState(false); const [err,setErr]=useState("");
  async function join(){
    if(code.trim().length<4) return;
    setLoading(true); setErr("");
    const r=await loadRoom(code.trim().toUpperCase());
    if(r) onJoinRoom(r); else setErr("Sala não encontrada.");
    setLoading(false);
  }
  return <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 16px"}}>
    <div style={{textAlign:"center",marginBottom:44}}>
      <div style={{fontSize:38,color:T.gold,fontWeight:700,letterSpacing:6,textShadow:`0 0 40px ${T.gold}55`}}>ELARIS</div>
      <div style={{fontSize:11,color:T.goldDim,letterSpacing:4,marginTop:8}}>MUNDO ABERTO · MULTIPLAYER</div>
      <div style={{width:60,height:1,background:`linear-gradient(90deg,transparent,${T.goldDim},transparent)`,margin:"14px auto 0"}}/>
    </div>
    <div style={{width:"100%",maxWidth:340,display:"flex",flexDirection:"column",gap:12}}>
      <button onClick={onCreate} style={{background:`linear-gradient(135deg,${T.gold},${T.goldDim})`,border:"none",borderRadius:12,color:"#07070c",fontWeight:700,fontSize:16,padding:"15px",cursor:"pointer",letterSpacing:2,fontFamily:"Georgia,serif"}}>⚔️ CRIAR NOVA SALA</button>
      <div style={{height:1,background:T.border,margin:"2px 0"}}/>
      <div style={{fontSize:10,color:T.muted,letterSpacing:2,textAlign:"center"}}>JÁ TEM UM CÓDIGO?</div>
      <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="XXXX" maxLength={4}
        style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,color:T.gold,fontFamily:"Georgia,serif",fontSize:24,padding:"11px 14px",outline:"none",textAlign:"center",letterSpacing:8,boxSizing:"border-box",width:"100%"}}/>
      {err&&<div style={{fontSize:11,color:T.red,textAlign:"center"}}>{err}</div>}
      <button onClick={join} disabled={loading||code.trim().length<4}
        style={{background:code.trim().length>=4?"#1a2e1a":"#111",border:`1px solid ${code.trim().length>=4?T.green:"#222"}`,color:code.trim().length>=4?T.green:"#333",borderRadius:10,fontWeight:700,fontSize:15,padding:"12px",cursor:code.trim().length>=4?"pointer":"default",fontFamily:"Georgia,serif"}}>
        {loading?"⏳ Buscando...":"🔍 ENTRAR NA SALA"}
      </button>
    </div>
  </div>;
}

// ── APP ROOT ──────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState("entry");
  const [room,setRoom]=useState(null);
  const [myHeroId,setMyHeroId]=useState(null);
  const [myName,setMyName]=useState("");
  const pollRef=useRef(null);
  const updateRoom=useCallback((r)=>setRoom(r),[]);

  useEffect(()=>{
    if(!room||screen==="entry") return;
    pollRef.current=setInterval(async()=>{
      const fresh=await loadRoom(room.code);
      if(fresh&&fresh.updatedAt!==room.updatedAt){
        setRoom(fresh);
        if(fresh.phase==="game"&&screen==="lobby") setScreen("game");
      }
    },POLL_MS);
    return()=>clearInterval(pollRef.current);
  },[room,screen]);

  async function handleCreate(){
    const code=genCode(); const r=makeRoom(code);
    await saveRoom(code,r); setRoom(r); setScreen("lobby");
  }
  async function handleJoinRoom(r){ setRoom(r); setScreen("lobby"); }
  async function handleJoin(heroId){
    if(!myName.trim()) return;
    const fresh=await loadRoom(room.code);
    if(!fresh||fresh.players[heroId]) return;
    fresh.players[heroId]={nome:myName.trim(),ready:false};
    fresh.updatedAt=Date.now();
    await saveRoom(room.code,fresh); setRoom(fresh); setMyHeroId(heroId);
  }
  async function handleReady(){
    const fresh=await loadRoom(room.code); if(!fresh||!myHeroId) return;
    fresh.players[myHeroId]={...fresh.players[myHeroId],ready:true};
    const ids=Object.keys(fresh.players);
    if(ids.length>=2&&ids.every(id=>fresh.players[id]?.ready)) fresh.phase="game";
    fresh.updatedAt=Date.now();
    await saveRoom(room.code,fresh); setRoom(fresh);
    if(fresh.phase==="game") setScreen("game");
  }

  if(screen==="entry") return <EntryScreen onCreate={handleCreate} onJoinRoom={handleJoinRoom}/>;
  if(screen==="lobby"&&room) return <LobbyScreen room={room} myHeroId={myHeroId} myName={myName} setMyName={setMyName} onJoin={handleJoin} onReady={handleReady}/>;
  if(screen==="game"&&room&&myHeroId) return <GameScreen room={room} myHeroId={myHeroId} myName={myName} onUpdate={updateRoom}/>;
  return <div style={{color:T.text,padding:32}}>Carregando...</div>;
}
