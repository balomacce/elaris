import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  bg:"#07070c", surface:"#0e0e18", border:"#1e1e2c",
  gold:"#c9a96e", goldDim:"#7a5e30", text:"#cec6b4",
  muted:"#5a5448", red:"#d94f4f", blue:"#4a80d4", green:"#4aaa6a",
  purple:"#a78bfa", orange:"#d97c30",
};

const HEROES_TEMPLATE = {
  balo:{ id:"balo", nome:"Balo Balesco", emoji:"🗡️", classe:"Lutador", arma:"Adaga", poder:"Sombra",
    cor:"#c9a96e", corDim:"#7a5e30", hp:5, maxHp:5, en:5, maxEn:5, maestria:1,
    rank:"bronze", rankPts:0, ouro:50,
    attrs:{"💪 FOR":3,"⚡ AGI":7,"🛡️ RES":3,"🔋 ENE":5,"🎯 CTR":2},
    espec:"Parry", fraq:"Pouca força física", status:null, statusEfeitos:[], regiao:"varnok", missaoAtiva:null },
  fuboka:{ id:"fuboka", nome:"Fuboka", emoji:"🌑", classe:"Especialista", arma:"Cavaleiro das Almas", poder:"Invocação",
    cor:"#8888e8", corDim:"#404080", hp:5, maxHp:5, en:6, maxEn:6, maestria:1,
    rank:"bronze", rankPts:0, ouro:50,
    attrs:{"💪 FOR":2,"⚡ AGI":2,"🛡️ RES":3,"🔋 ENE":6,"🎯 CTR":7},
    espec:"Domar", fraq:"Toma mais dano direto", status:null, statusEfeitos:[], regiao:"varnok", missaoAtiva:null },
  patosauro:{ id:"patosauro", nome:"Patosauro", emoji:"🦖", classe:"Especialista", arma:"T-Rex", poder:"Invocação",
    cor:"#5ab870", corDim:"#2a5a38", hp:5, maxHp:5, en:7, maxEn:7, maestria:1,
    rank:"bronze", rankPts:0, ouro:50,
    attrs:{"💪 FOR":2,"⚡ AGI":3,"🛡️ RES":2,"🔋 ENE":7,"🎯 CTR":6},
    espec:"Controle de Combate", fraq:"Força física", status:null, statusEfeitos:[], regiao:"varnok", missaoAtiva:null },
};

const REGIOES = {
  varnok:{ id:"varnok", nome:"Varnok", emoji:"🏙️", perigo:"Seguro", cor:"#c9a96e",
    desc:"A cidade dos mercenários. Centro de tudo.",
    locais:["Guilda dos Mercenários","Mercado de Armas","Taverna do Osso","Templo Abandonado"] },
  lunaris:{ id:"lunaris", nome:"Floresta de Lunaris", emoji:"🌲", perigo:"Médio", cor:"#5ab870",
    desc:"Névoa permanente. Espíritos. Mais perigosa à noite.",
    locais:["Entrada da Floresta","Árvore Anciã","Gruta dos Lobos"] },
  vale:{ id:"vale", nome:"Vale Carmesim", emoji:"⚔️", perigo:"Alto", cor:"#d94f4f",
    desc:"Terra vermelha. Guerreiros. Ordem de Ferro.",
    locais:["Forte da Ordem","Ruínas do Vale"] },
  cordilheira:{ id:"cordilheira", nome:"Cordilheira Tempestade", emoji:"⛰️", perigo:"Alto", cor:"#4a80d4",
    desc:"Ventos cortantes. Raios. Treino extremo.",
    locais:["Pico do Trovão","Caverna dos Grifos"] },
  deserto:{ id:"deserto", nome:"Deserto Cinzento", emoji:"🏜️", perigo:"Alto", cor:"#d97c30",
    desc:"Calor extremo. Criaturas enormes. Essência rara.",
    locais:["Oásis Secreto","Templo Soterrado"] },
  ruinas:{ id:"ruinas", nome:"Ruínas da Fratura", emoji:"💀", perigo:"Extremo", cor:"#a78bfa",
    desc:"O lugar mais perigoso. Apenas grupos podem entrar.",
    locais:["Epicentro","Templo dos Deuses"], rankMinimo:"ouro" },
};

const MISSOES = [
  { id:"m1", titulo:"Lobos na Floresta", regiao:"lunaris", rank:"bronze", emoji:"🐺",
    desc:"Lobos estão atacando viajantes. Elimine a ameaça.", recompensa:"50 ouros", principal:false },
  { id:"m2", titulo:"Entrega Urgente", regiao:"varnok", rank:"bronze", emoji:"📦",
    desc:"Escorte um comerciante até o posto avançado.", recompensa:"30 ouros", principal:false },
  { id:"m3", titulo:"O Espírito Perturbado", regiao:"lunaris", rank:"prata", emoji:"👻",
    desc:"Um espírito na Árvore Anciã age de forma estranha.", recompensa:"Relíquia + lore", principal:false },
  { id:"m4", titulo:"Cristal de Essência", regiao:"deserto", rank:"prata", emoji:"💎",
    desc:"Recupere um cristal de Essência Pura.", recompensa:"100 ouros + cristal", principal:false },
  { id:"m5", titulo:"A Ameaça do Vale", regiao:"vale", rank:"ouro", emoji:"⚔️",
    desc:"Criatura corrompida domina o Vale. Grupo necessário.", recompensa:"200 ouros + relíquia rara", principal:true },
  { id:"m6", titulo:"O Segredo da Fratura", regiao:"ruinas", rank:"ouro", emoji:"🌀",
    desc:"O epicentro está instável. TODOS necessários.", recompensa:"Relíquia épica + história", principal:true },
];

const RANKS = ["bronze","prata","ouro","platina","lendario"];
const RANK_EMOJI = { bronze:"🥉", prata:"🥈", ouro:"🥇", platina:"💎", lendario:"👑" };
const RANK_PTS = { bronze:5, prata:10, ouro:15, platina:20, lendario:999 };

const INIMIGOS_BASE = [
  { id:"loboB", nome:"Lobo B", emoji:"🐺", hp:1, maxHp:3, status:"Gravemente ferido", vivo:true, traits:[], moral:30 },
  { id:"loboC", nome:"Lobo C", emoji:"🐺", hp:3, maxHp:3, status:"Enraivecido", vivo:true, traits:["furioso"], moral:80 },
];

// ── STORAGE ───────────────────────────────────────────────
async function saveUser(username, data) {
  try { await window.storage.set(`user:${username.toLowerCase()}`, JSON.stringify(data)); } catch(e){}
}
async function loadUser(username) {
  try {
    const r = await window.storage.get(`user:${username.toLowerCase()}`);
    return r ? JSON.parse(r.value) : null;
  } catch(e){ return null; }
}
async function saveGroup(groupId, data) {
  try { await window.storage.set(`group:${groupId}`, JSON.stringify(data), true); } catch(e){}
}
async function loadGroup(groupId) {
  try {
    const r = await window.storage.get(`group:${groupId}`, true);
    return r ? JSON.parse(r.value) : null;
  } catch(e){ return null; }
}

function makeUser(username, password, heroId) {
  return {
    username, password,
    heroId,
    hero: JSON.parse(JSON.stringify(HEROES_TEMPLATE[heroId])),
    grupo: null,
    amigos: [],
    narracao: "",
    inimigos: JSON.parse(JSON.stringify(INIMIGOS_BASE)),
    log: [],
    createdAt: Date.now(),
    lastSeen: Date.now(),
  };
}

function makeGroup(id, members) {
  return { id, members, historiaPts:0, log:[], updatedAt:Date.now() };
}

// ── PROMPT ────────────────────────────────────────────────
function buildPrompt(user, acao, dado, dadoLabel) {
  const h = user.hero;
  const r = REGIOES[h.regiao]||REGIOES.varnok;
  const inimigosVivos = (user.inimigos||[]).filter(e=>e.vivo);
  const emCombate = inimigosVivos.length>0 && h.regiao!=="varnok";
  return `Você é o Mestre do RPG ELARIS. Narre em português — frases curtas, estilo sombrio e dramático.

MUNDO: Elaris pós-Fratura. Céu rachado. Monstros. Essência. Poderes.
REGIÃO: ${r.emoji} ${r.nome} — ${r.desc}
PERSONAGEM: ${h.nome} (${h.classe}) HP:${h.hp}/${h.maxHp} EN:${h.en}/${h.maxEn} Rank:${RANK_EMOJI[h.rank]} Ouro:${h.ouro}
${emCombate?`COMBATE: ${inimigosVivos.map(e=>`${e.nome} HP:${e.hp}/${e.maxHp} Moral:${e.moral}%`).join(" | ")}`:h.regiao==="varnok"?"VARNOK: NPCs disponíveis — Maren(Guilda), Durk(Ferreiro), Taverna do Osso":"EXPLORAÇÃO LIVRE"}

AÇÃO: "${acao}" | d20: ${dado} (${dadoLabel})

REGRAS: 1-5=falha crítica,6-10=ruim,11-15=normal,16-19=bom,20=crítico. Bônus estratégia +2 a +5.
Dano: ½❤ fraco,1❤ médio,2❤ forte,3❤+ ultimate.

Responda SOMENTE com JSON sem markdown:
{"narracao":"2-3 parágrafos","danoInimigos":[{"id":"string","valor":0}],"danoHeroi":0,"curaHeroi":0,"custoEnergia":0,"ganhouOuro":0,"maestriaPts":0,"rankPts":0,"missaoConcluida":false}`;
}

// ── UI ────────────────────────────────────────────────────
function Pip({ filled, half, color, size=9 }) {
  return <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,
    background:filled?color:half?`linear-gradient(90deg,${color} 50%,#111 50%)`:"#111",
    border:`1px solid ${filled||half?color+"99":"#222"}`,
    boxShadow:filled?`0 0 5px ${color}66`:"none",transition:"all 0.4s"}}/>;
}
function PipRow({ val, max, color, size=9 }) {
  return <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
    {Array.from({length:max},(_,i)=>
      <Pip key={i} filled={i<Math.floor(val)} half={!(i<Math.floor(val))&&i<val} color={color} size={size}/>)}
  </div>;
}
function RankBar({ rank, pts }) {
  const needed=RANK_PTS[rank]||5;
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
      <span style={{fontSize:9,color:T.gold}}>{RANK_EMOJI[rank]} {rank.toUpperCase()}</span>
      <span style={{fontSize:9,color:T.muted}}>{pts}/{needed}</span>
    </div>
    <div style={{height:2,background:"#111",borderRadius:1}}>
      <div style={{width:`${Math.min(100,(pts/needed)*100)}%`,height:"100%",background:T.gold,borderRadius:1,transition:"width 0.5s"}}/>
    </div>
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

// ── LOGIN / REGISTRO ──────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [modo,setModo]=useState("login");
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [heroId,setHeroId]=useState(null);
  const [erro,setErro]=useState("");
  const [loading,setLoading]=useState(false);
  const [hover,setHover]=useState(null);

  async function handleLogin() {
    if(!username.trim()||!password.trim()) return setErro("Preencha todos os campos.");
    setLoading(true); setErro("");
    const u = await loadUser(username.trim());
    if(!u) { setErro("Usuário não encontrado."); setLoading(false); return; }
    if(u.password!==password) { setErro("Senha incorreta."); setLoading(false); return; }
    u.lastSeen=Date.now();
    await saveUser(username.trim(),u);
    onLogin(u);
    setLoading(false);
  }

  async function handleRegistro() {
    if(!username.trim()||!password.trim()) return setErro("Preencha todos os campos.");
    if(!heroId) return setErro("Escolha um personagem.");
    if(username.trim().length<3) return setErro("Nome deve ter pelo menos 3 caracteres.");
    setLoading(true); setErro("");
    const existe = await loadUser(username.trim());
    if(existe) { setErro("Nome já está em uso."); setLoading(false); return; }
    const u = makeUser(username.trim(), password, heroId);
    await saveUser(username.trim(), u);
    onLogin(u);
    setLoading(false);
  }

  return <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 16px"}}>
    <div style={{textAlign:"center",marginBottom:32}}>
      <div style={{fontSize:36,color:T.gold,fontWeight:700,letterSpacing:6,textShadow:`0 0 40px ${T.gold}44`}}>ELARIS</div>
      <div style={{fontSize:11,color:T.goldDim,letterSpacing:4,marginTop:6}}>MUNDO ABERTO · MULTIPLAYER</div>
      <div style={{width:60,height:1,background:`linear-gradient(90deg,transparent,${T.goldDim},transparent)`,margin:"14px auto 0"}}/>
    </div>

    {/* Tabs */}
    <div style={{display:"flex",gap:4,marginBottom:20,background:T.surface,borderRadius:10,padding:4,border:`1px solid ${T.border}`}}>
      {["login","registro"].map(m=>(
        <button key={m} onClick={()=>{setModo(m);setErro("");setHeroId(null);}}
          style={{padding:"8px 20px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:12,letterSpacing:1,
            background:modo===m?T.gold:"transparent",color:modo===m?"#07070c":T.muted,fontWeight:modo===m?700:400}}>
          {m==="login"?"ENTRAR":"CRIAR CONTA"}
        </button>
      ))}
    </div>

    <div style={{width:"100%",maxWidth:360,display:"flex",flexDirection:"column",gap:10}}>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Nome de aventureiro" maxLength={20}
        style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontFamily:"Georgia,serif",fontSize:14,padding:"11px 14px",outline:"none",boxSizing:"border-box",width:"100%"}}/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" type="password" maxLength={30}
        style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontFamily:"Georgia,serif",fontSize:14,padding:"11px 14px",outline:"none",boxSizing:"border-box",width:"100%"}}/>

      {modo==="registro"&&<>
        <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginTop:6,textAlign:"center"}}>ESCOLHA SEU PERSONAGEM</div>
        {Object.values(HEROES_TEMPLATE).map(p=>(
          <div key={p.id} onClick={()=>setHeroId(p.id)}
            onMouseEnter={()=>setHover(p.id)} onMouseLeave={()=>setHover(null)}
            style={{borderRadius:12,overflow:"hidden",cursor:"pointer",
              border:`1px solid ${heroId===p.id?p.cor+"88":hover===p.id?p.cor+"44":T.border}`,
              background:heroId===p.id?`${p.cor}15`:hover===p.id?`${p.cor}08`:T.surface,
              transition:"all 0.2s",transform:heroId===p.id||hover===p.id?"scale(1.01)":"scale(1)"}}>
            <div style={{display:"flex"}}>
              <div style={{width:4,background:`linear-gradient(180deg,${p.cor},${p.corDim})`,flexShrink:0}}/>
              <div style={{padding:"11px 14px",flex:1}}>
                <div style={{fontSize:13,color:heroId===p.id?p.cor:T.text,fontWeight:700}}>{p.emoji} {p.nome}</div>
                <div style={{fontSize:10,color:T.muted,marginTop:2}}>{p.classe} · {p.espec}</div>
                <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                  {Object.entries(p.attrs).map(([k,v])=>(
                    <div key={k} style={{textAlign:"center"}}>
                      <div style={{fontSize:7,color:T.muted}}>{k}</div>
                      <div style={{fontSize:12,color:v>=6?p.cor:v>=4?T.text:T.muted,fontWeight:700}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </>}

      {erro&&<div style={{fontSize:11,color:T.red,textAlign:"center"}}>{erro}</div>}

      <button onClick={modo==="login"?handleLogin:handleRegistro} disabled={loading}
        style={{background:`linear-gradient(135deg,${T.gold},${T.goldDim})`,border:"none",borderRadius:10,color:"#07070c",fontWeight:700,fontSize:15,padding:"13px",cursor:"pointer",fontFamily:"Georgia,serif",marginTop:4}}>
        {loading?"⏳ Carregando...":modo==="login"?"⚔️ ENTRAR":"⚔️ CRIAR CONTA"}
      </button>
    </div>
  </div>;
}

// ── MAPA ──────────────────────────────────────────────────
function MapaModal({ hero, onViajar, onFechar }) {
  const [hover,setHover]=useState(null);
  return <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(4,4,8,0.96)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16,overflowY:"auto"}}>
    <div style={{width:"100%",maxWidth:480}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:16,color:T.gold,fontWeight:700}}>🗺️ MAPA DE ELARIS</div>
        <button onClick={onFechar} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>✕</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {Object.values(REGIOES).map(r=>{
          const aqui=hero.regiao===r.id;
          const bloqueada=r.rankMinimo&&RANKS.indexOf(hero.rank)<RANKS.indexOf(r.rankMinimo);
          return <div key={r.id} onClick={()=>!bloqueada&&!aqui&&onViajar(r.id)}
            onMouseEnter={()=>setHover(r.id)} onMouseLeave={()=>setHover(null)}
            style={{borderRadius:12,padding:12,cursor:bloqueada||aqui?"default":"pointer",
              border:`1px solid ${aqui?r.cor+"88":hover===r.id&&!bloqueada?r.cor+"44":T.border}`,
              background:aqui?`${r.cor}15`:hover===r.id&&!bloqueada?`${r.cor}08`:T.surface,
              opacity:bloqueada?0.4:1,transition:"all 0.2s"}}>
            <div style={{fontSize:20,marginBottom:4}}>{r.emoji}</div>
            <div style={{fontSize:11,color:aqui?r.cor:T.text,fontWeight:700}}>{r.nome}</div>
            <div style={{fontSize:9,color:T.muted,marginTop:2,lineHeight:1.4}}>{r.desc.substring(0,45)}...</div>
            <div style={{marginTop:5,fontSize:9,padding:"2px 6px",borderRadius:4,display:"inline-block",
              background:r.perigo==="Seguro"?T.green+"22":r.perigo==="Médio"?T.orange+"22":r.perigo==="Alto"?T.red+"22":"#a78bfa22",
              color:r.perigo==="Seguro"?T.green:r.perigo==="Médio"?T.orange:r.perigo==="Alto"?T.red:T.purple}}>
              {r.perigo}
            </div>
            {aqui&&<div style={{fontSize:9,color:r.cor,marginTop:4}}>📍 Você está aqui</div>}
            {bloqueada&&<div style={{fontSize:9,color:T.muted,marginTop:4}}>🔒 Rank {r.rankMinimo}</div>}
          </div>;
        })}
      </div>
    </div>
  </div>;
}

// ── GRUPO ─────────────────────────────────────────────────
function GrupoModal({ user, onFechar, onSave }) {
  const [busca,setBusca]=useState("");
  const [resultado,setResultado]=useState(null);
  const [buscando,setBuscando]=useState(false);
  const [erro,setErro]=useState("");
  const [grupo,setGrupo]=useState(null);

  useEffect(()=>{
    if(user.grupo) loadGroup(user.grupo).then(g=>{ if(g) setGrupo(g); });
  },[user.grupo]);

  async function buscarJogador() {
    if(!busca.trim()) return;
    setBuscando(true); setErro(""); setResultado(null);
    const u = await loadUser(busca.trim());
    if(!u) setErro("Jogador não encontrado.");
    else if(u.username===user.username) setErro("Você não pode se adicionar.");
    else setResultado(u);
    setBuscando(false);
  }

  async function convidarJogador() {
    if(!resultado) return;
    const groupId = `${user.username}-${resultado.username}`.toLowerCase();
    const g = makeGroup(groupId, [user.username, resultado.username]);
    await saveGroup(groupId, g);
    const updUser = {...user, grupo:groupId};
    await saveUser(user.username, updUser);
    const updAmigo = {...resultado, grupo:groupId};
    await saveUser(resultado.username, updAmigo);
    setGrupo(g);
    onSave(updUser);
    setErro(""); setResultado(null); setBusca("");
  }

  async function sairDoGrupo() {
    const updUser = {...user, grupo:null};
    await saveUser(user.username, updUser);
    setGrupo(null);
    onSave(updUser);
  }

  return <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(4,4,8,0.96)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{width:"100%",maxWidth:400,background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:15,color:T.gold,fontWeight:700}}>👥 GRUPO</div>
        <button onClick={onFechar} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>✕</button>
      </div>

      {grupo ? <>
        <div style={{fontSize:11,color:T.muted,marginBottom:10}}>Membros do grupo:</div>
        {grupo.members.map(m=>(
          <div key={m} style={{background:"#0a0a14",border:`1px solid ${m===user.username?T.gold+"44":T.border}`,borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>⚔️</span>
            <div>
              <div style={{fontSize:12,color:m===user.username?T.gold:T.text,fontWeight:600}}>{m}{m===user.username&&" (você)"}</div>
            </div>
          </div>
        ))}
        <button onClick={sairDoGrupo} style={{width:"100%",marginTop:10,padding:"10px",background:"#1a0808",border:`1px solid ${T.red}44`,borderRadius:10,color:T.red,fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif"}}>Sair do Grupo</button>
      </> : <>
        <div style={{fontSize:11,color:T.muted,marginBottom:12}}>Busque um jogador pelo nome para formar grupo.</div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Nome do jogador..."
            onKeyDown={e=>e.key==="Enter"&&buscarJogador()}
            style={{flex:1,background:"#0a0a14",border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontFamily:"Georgia,serif",fontSize:13,padding:"9px 12px",outline:"none"}}/>
          <button onClick={buscarJogador} disabled={buscando} style={{background:T.gold,border:"none",borderRadius:8,color:"#07070c",fontWeight:700,fontSize:12,padding:"9px 14px",cursor:"pointer"}}>🔍</button>
        </div>
        {erro&&<div style={{fontSize:11,color:T.red,marginBottom:8}}>{erro}</div>}
        {resultado&&<div style={{background:"#0a0a14",border:`1px solid ${T.green}44`,borderRadius:10,padding:"12px 14px",marginBottom:10}}>
          <div style={{fontSize:12,color:T.green,fontWeight:600}}>✅ {resultado.username} encontrado!</div>
          <div style={{fontSize:10,color:T.muted,marginTop:2}}>{HEROES_TEMPLATE[resultado.heroId]?.nome||"Aventureiro"}</div>
          <button onClick={convidarJogador} style={{marginTop:8,width:"100%",padding:"8px",background:"#0a1a0a",border:`1px solid ${T.green}`,borderRadius:8,color:T.green,fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif"}}>Convidar para o Grupo</button>
        </div>}
        <div style={{fontSize:10,color:T.muted,fontStyle:"italic",textAlign:"center",marginTop:8}}>O grupo permite missões principais e missões cooperativas.</div>
      </>}
    </div>
  </div>;
}

// ── GUILDA ────────────────────────────────────────────────
function GuildaModal({ user, onAceitar, onFechar }) {
  const missoesDispo = MISSOES.filter(m=>RANKS.indexOf(user.hero.rank)>=RANKS.indexOf(m.rank));
  return <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(4,4,8,0.96)",overflowY:"auto",padding:16}}>
    <div style={{maxWidth:460,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:15,color:T.gold,fontWeight:700}}>⚔️ GUILDA DOS MERCENÁRIOS</div>
        <button onClick={onFechar} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>✕</button>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",marginBottom:14}}>
        <RankBar rank={user.hero.rank} pts={user.hero.rankPts||0}/>
        <div style={{fontSize:10,color:T.muted,marginTop:6}}>💰 {user.hero.ouro} ouros</div>
      </div>
      {missoesDispo.map(m=>(
        <div key={m.id} style={{background:T.surface,border:`1px solid ${m.principal?"#a78bfa44":T.border}`,borderRadius:12,padding:14,marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div style={{fontSize:13,color:m.principal?T.purple:T.gold,fontWeight:700}}>{m.emoji} {m.titulo}</div>
            <span style={{fontSize:9,color:T.gold}}>{RANK_EMOJI[m.rank]}</span>
          </div>
          {m.principal&&<div style={{fontSize:9,color:T.purple,marginTop:2}}>🌀 Missão principal — grupo necessário</div>}
          <div style={{fontSize:11,color:T.muted,marginTop:5,lineHeight:1.5}}>{m.desc}</div>
          <div style={{fontSize:10,color:T.green,marginTop:4}}>💰 {m.recompensa}</div>
          <button onClick={()=>onAceitar(m)} disabled={user.hero.missaoAtiva===m.id}
            style={{marginTop:8,width:"100%",padding:"7px",background:user.hero.missaoAtiva===m.id?"#111":"#0a1a0a",border:`1px solid ${user.hero.missaoAtiva===m.id?"#222":T.green}`,borderRadius:8,color:user.hero.missaoAtiva===m.id?T.muted:T.green,fontSize:11,cursor:user.hero.missaoAtiva===m.id?"default":"pointer",fontFamily:"Georgia,serif"}}>
            {user.hero.missaoAtiva===m.id?"✅ Aceita":"Aceitar Missão"}
          </button>
        </div>
      ))}
    </div>
  </div>;
}

// ── GAME SCREEN ───────────────────────────────────────────
function GameScreen({ user, onUpdate, onLogout }) {
  const [acao,setAcao]=useState("");
  const [dado,setDado]=useState(null);
  const [diceVal,setDiceVal]=useState(null);
  const [showDice,setShowDice]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [tab,setTab]=useState("mundo");
  const [showMapa,setShowMapa]=useState(false);
  const [showGrupo,setShowGrupo]=useState(false);
  const [showGuilda,setShowGuilda]=useState(false);
  const [narracao,setNarracao]=useState(user.narracao||"");
  const [inimigos,setInimigos]=useState(user.inimigos||JSON.parse(JSON.stringify(INIMIGOS_BASE)));
  const bottomRef=useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[narracao]);

  const h = user.hero;
  const regiao = REGIOES[h.regiao]||REGIOES.varnok;
  const emVarnok = h.regiao==="varnok";
  const missaoAtiva = MISSOES.find(m=>m.id===h.missaoAtiva);

  const dadoColor=!dado?"#666":dado<=5?T.red:dado<=10?T.orange:dado<=15?T.gold:dado<20?T.green:T.purple;
  const dadoLabel=!dado?"":dado<=5?"Falha crítica!":dado<=10?"Ruim":dado<=15?"Normal":dado<20?"Muito bom!":"CRÍTICO! 🔥";

  function rollDice(){ const v=Math.ceil(Math.random()*20); setDiceVal(v); setShowDice(true); }
  function closeDice(){ if(diceVal) setDado(diceVal); setShowDice(false); }

  async function viajar(regiaoId) {
    const newH={...h,regiao:regiaoId};
    const newUser={...user,hero:newH,narracao:`Você viajou para ${REGIOES[regiaoId].emoji} ${REGIOES[regiaoId].nome}.`};
    await saveUser(user.username,newUser);
    onUpdate(newUser);
    setNarracao(newUser.narracao);
    setShowMapa(false);
    if(regiaoId==="lunaris") setInimigos(JSON.parse(JSON.stringify(INIMIGOS_BASE)));
  }

  async function aceitarMissao(m) {
    const newH={...h,missaoAtiva:m.id};
    const newUser={...user,hero:newH};
    await saveUser(user.username,newUser);
    onUpdate(newUser);
    setShowGuilda(false);
    setNarracao(`📋 Missão aceita: ${m.titulo}\n\n${m.desc}`);
  }

  async function confirmar() {
    if(!dado||!acao.trim()||submitting) return;
    setSubmitting(true);
    const sys=buildPrompt({...user,inimigos},acao,dado,dadoLabel);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content:acao}]}),
      });
      const data=await res.json();
      const txt=data.content?.find(b=>b.type==="text")?.text||"{}";
      let result={};
      try{ result=JSON.parse(txt.replace(/```json|```/g,"").trim()); }catch(e){ result={narracao:txt}; }

      const narr=result.narracao||"O Mestre observa em silêncio.";
      setNarracao(narr);

      let newH={...h};
      let newInimigos=[...inimigos];
      let newLog=[...(user.log||[])];

      (result.danoInimigos||[]).forEach(d=>{
        const idx=newInimigos.findIndex(e=>e.id===d.id);
        if(idx>=0&&newInimigos[idx].vivo){
          const ni=[...newInimigos];
          const hp=Math.max(0,ni[idx].hp-d.valor);
          ni[idx]={...ni[idx],hp,vivo:hp>0};
          newInimigos=ni;
          if(d.valor>0) newLog=[`⚔️ ${h.nome} causou ${d.valor}❤️ em ${ni[idx].nome}`,...newLog.slice(0,29)];
        }
      });
      setInimigos(newInimigos);

      if(result.danoHeroi>0){ newH={...newH,hp:Math.max(0,newH.hp-result.danoHeroi)}; newLog=[`💔 Tomou ${result.danoHeroi}❤️ de dano`,...newLog.slice(0,29)]; }
      if(result.curaHeroi>0) newH={...newH,hp:Math.min(newH.maxHp,newH.hp+result.curaHeroi)};
      if(result.custoEnergia>0) newH={...newH,en:Math.max(0,newH.en-result.custoEnergia)};
      if(result.ganhouOuro>0){ newH={...newH,ouro:(newH.ouro||0)+result.ganhouOuro}; newLog=[`💰 Ganhou ${result.ganhouOuro} ouros`,...newLog.slice(0,29)]; }
      if(result.maestriaPts>0) newH={...newH,maestria:(newH.maestria||1)+result.maestriaPts};

      let rankPts=(newH.rankPts||0)+(result.rankPts||0);
      let rank=newH.rank;
      if(rankPts>=(RANK_PTS[rank]||5)&&RANKS.indexOf(rank)<RANKS.length-1){
        rank=RANKS[RANKS.indexOf(rank)+1]; rankPts=0;
        newLog=[`🎉 Subiu para ${RANK_EMOJI[rank]} ${rank.toUpperCase()}!`,...newLog.slice(0,29)];
      }
      newH={...newH,rank,rankPts};
      if(result.missaoConcluida){ newH={...newH,missaoAtiva:null}; newLog=[`✅ Missão concluída!`,...newLog.slice(0,29)]; }

      const newUser={...user,hero:newH,inimigos:newInimigos,log:newLog,narracao:narr,lastSeen:Date.now()};
      await saveUser(user.username,newUser);
      onUpdate(newUser);
      setAcao(""); setDado(null);
    } catch(err){ setNarracao("O Mestre hesita. Tente novamente."); }
    setSubmitting(false);
  }

  const tabs=[{id:"mundo",label:"🌍 Mundo"},{id:"ficha",label:"📋 Ficha"},{id:"log",label:"📜 Log"}];

  return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Georgia,serif"}}>
    {showDice&&diceVal&&<DiceOverlay value={diceVal} onClose={closeDice}/>}
    {showMapa&&<MapaModal hero={h} onViajar={viajar} onFechar={()=>setShowMapa(false)}/>}
    {showGrupo&&<GrupoModal user={user} onFechar={()=>setShowGrupo(false)} onSave={u=>{onUpdate(u);setShowGrupo(false);}}/>}
    {showGuilda&&<GuildaModal user={user} onAceitar={aceitarMissao} onFechar={()=>setShowGuilda(false)}/>}

    {/* Header */}
    <div style={{borderBottom:`1px solid ${T.border}`,padding:"8px 14px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
      <div style={{fontSize:15,color:T.gold,fontWeight:700,letterSpacing:3}}>⚔️ ELARIS</div>
      <div style={{display:"flex",gap:3}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?"#1e1e28":"transparent",border:tab===t.id?`1px solid ${T.border}`:"1px solid transparent",color:tab===t.id?T.gold:T.muted,borderRadius:6,padding:"4px 9px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{t.label}</button>)}
      </div>
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:10,color:h.cor}}>{h.emoji} {user.username}</span>
        <button onClick={onLogout} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:6,padding:"3px 8px",fontSize:10,cursor:"pointer"}}>Sair</button>
      </div>
    </div>

    {tab==="mundo"&&<div style={{display:"flex",height:"calc(100vh - 50px)"}}>
      {/* Sidebar */}
      <div style={{width:180,borderRight:`1px solid ${T.border}`,padding:10,overflowY:"auto",flexShrink:0}}>
        <div style={{background:`${regiao.cor}10`,border:`1px solid ${regiao.cor}33`,borderRadius:10,padding:"9px 11px",marginBottom:10}}>
          <div style={{fontSize:11,color:regiao.cor,fontWeight:700}}>{regiao.emoji} {regiao.nome}</div>
          <div style={{fontSize:9,color:T.muted,marginTop:1}}>⚠️ {regiao.perigo}</div>
          {missaoAtiva&&<div style={{fontSize:9,color:T.green,marginTop:4}}>📋 {missaoAtiva.titulo}</div>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
          <button onClick={()=>setShowMapa(true)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,color:T.gold,fontSize:11,padding:"6px",cursor:"pointer",fontFamily:"inherit"}}>🗺️ Mapa</button>
          <button onClick={()=>setShowGrupo(true)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,color:T.blue,fontSize:11,padding:"6px",cursor:"pointer",fontFamily:"inherit"}}>👥 Grupo{user.grupo?" ✓":""}</button>
          {emVarnok&&<button onClick={()=>setShowGuilda(true)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,color:T.gold,fontSize:11,padding:"6px",cursor:"pointer",fontFamily:"inherit"}}>⚔️ Guilda</button>}
        </div>
        <div style={{background:T.surface,border:`1px solid ${h.cor}22`,borderRadius:9,padding:"9px 10px",marginBottom:8}}>
          <div style={{fontSize:11,color:h.cor,fontWeight:600,marginBottom:6}}>{h.emoji} {h.nome}</div>
          <div style={{marginBottom:4}}><div style={{fontSize:7,color:T.muted,marginBottom:2}}>HP</div><PipRow val={h.hp} max={h.maxHp} color={T.red} size={6}/></div>
          <div style={{marginBottom:6}}><div style={{fontSize:7,color:T.muted,marginBottom:2}}>EN</div><PipRow val={h.en} max={h.maxEn} color={T.blue} size={6}/></div>
          <RankBar rank={h.rank} pts={h.rankPts||0}/>
          <div style={{fontSize:9,color:T.gold,marginTop:5}}>💰 {h.ouro}</div>
        </div>
        {inimigos.filter(e=>e.vivo&&h.regiao!=="varnok").map(e=>(
          <div key={e.id} style={{borderRadius:8,marginBottom:5,padding:"7px 9px",border:"1px solid #3a1a1a",background:"#0f0a0a"}}>
            <div style={{color:T.red,fontSize:10,fontWeight:600}}>{e.emoji} {e.nome}</div>
            <div style={{height:2,background:"#1a0a0a",borderRadius:1,margin:"4px 0 2px"}}>
              <div style={{width:`${(e.hp/e.maxHp)*100}%`,height:"100%",background:T.red,borderRadius:1}}/>
            </div>
            <div style={{fontSize:8,color:T.muted}}>{e.hp}/{e.maxHp} · Moral {e.moral}%</div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{flex:1,padding:"16px 18px",overflowY:"auto"}}>
        <div style={{fontSize:17,color:T.gold,fontWeight:700,marginBottom:2}}>{regiao.emoji} {regiao.nome}</div>
        <div style={{fontSize:10,color:T.muted,marginBottom:10}}>{regiao.desc}</div>
        {regiao.locais&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
          {regiao.locais.map(l=><span key={l} style={{fontSize:9,padding:"2px 7px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,color:T.muted}}>📍 {l}</span>)}
        </div>}
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${T.border},transparent)`,marginBottom:12}}/>

        <div style={{fontSize:12,color:h.cor,fontWeight:700,marginBottom:8}}>{h.emoji} {h.nome} — o que você faz?</div>
        <textarea value={acao} onChange={e=>setAcao(e.target.value)}
          placeholder={emVarnok?"Fale com NPCs, aceite missões, compre equipamentos...":"Descreva sua ação..."}
          style={{width:"100%",minHeight:75,background:T.surface,border:`1px solid ${T.border}`,borderRadius:9,color:T.text,fontFamily:"Georgia,serif",fontSize:13,padding:10,resize:"vertical",outline:"none",boxSizing:"border-box",marginBottom:8}}/>
        <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:8,marginBottom:10}}>
          <button onClick={rollDice} disabled={submitting} style={{background:T.gold,border:"none",borderRadius:8,color:"#07070c",fontWeight:700,fontSize:13,padding:"8px 15px",cursor:"pointer",fontFamily:"inherit"}}>🎲 Rolar d20</button>
          <button onClick={confirmar} disabled={!dado||!acao.trim()||submitting}
            style={{background:dado&&acao.trim()&&!submitting?"#1a2e1a":"#111",border:`1px solid ${dado&&acao.trim()&&!submitting?T.green:"#222"}`,color:dado&&acao.trim()&&!submitting?T.green:"#333",borderRadius:8,fontWeight:700,fontSize:13,padding:"8px 15px",cursor:dado&&acao.trim()&&!submitting?"pointer":"default",fontFamily:"inherit"}}>
            {submitting?"⏳ Narrando...":"✅ Confirmar"}
          </button>
          {dado&&<div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:28,color:dadoColor,fontWeight:700,textShadow:`0 0 14px ${dadoColor}66`}}>{dado}</span>
            <span style={{fontSize:11,color:dadoColor,fontWeight:600}}>{dadoLabel}</span>
          </div>}
        </div>
        {narracao&&<div style={{background:"#0a0a12",border:`1px solid ${T.gold}33`,borderRadius:11,padding:"12px 14px"}}>
          <div style={{fontSize:9,color:T.goldDim,letterSpacing:3,marginBottom:7}}>⚔️ O MESTRE NARRA</div>
          {narracao.split("\n\n").map((p,i)=><p key={i} style={{color:T.text,lineHeight:1.85,fontSize:13,margin:"0 0 7px"}}>{p}</p>)}
        </div>}
        <div ref={bottomRef}/>
      </div>
    </div>}

    {tab==="ficha"&&<div style={{padding:14,maxWidth:380,margin:"0 auto"}}>
      <div style={{background:T.surface,border:`1px solid ${h.cor}33`,borderRadius:12,padding:14}}>
        <div style={{fontSize:15,color:h.cor,fontWeight:700,marginBottom:4}}>{h.emoji} {h.nome}</div>
        <div style={{fontSize:10,color:T.muted,letterSpacing:1,marginBottom:10}}>{h.classe} · {h.espec} · {h.poder}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          {[["❤️ HP",h.hp,h.maxHp,T.red],["🔵 EN",h.en,h.maxEn,T.blue]].map(([lbl,v,mx,col])=>(
            <div key={lbl} style={{padding:"8px",background:"#0a0a14",borderRadius:7,border:`1px solid ${col}22`}}>
              <div style={{fontSize:9,color:T.muted,marginBottom:4}}>{lbl} {v}/{mx}</div>
              <PipRow val={v} max={mx} color={col} size={8}/>
            </div>
          ))}
        </div>
        {Object.entries(h.attrs).map(([k,v])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
            <span style={{fontSize:9,color:T.muted,width:54,flexShrink:0}}>{k}</span>
            <div style={{flex:1,height:3,background:"#111",borderRadius:2,overflow:"hidden"}}><div style={{width:`${(v/10)*100}%`,height:"100%",background:h.cor}}/></div>
            <span style={{fontSize:9,color:T.muted,width:10,textAlign:"right"}}>{v}</span>
          </div>
        ))}
        <div style={{marginTop:10}}><RankBar rank={h.rank} pts={h.rankPts||0}/></div>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <div style={{flex:1,padding:"6px 9px",background:"#080f08",border:"1px solid #1a2a1a",borderRadius:7}}>
            <div style={{fontSize:8,color:"#4a8a4a"}}>✅ ESPEC.</div>
            <div style={{fontSize:10,color:"#6aaa6a"}}>{h.espec}</div>
          </div>
          <div style={{flex:1,padding:"6px 9px",background:"#0f0808",border:"1px solid #2a1a1a",borderRadius:7}}>
            <div style={{fontSize:8,color:"#8a4a4a"}}>❌ FRAQ.</div>
            <div style={{fontSize:10,color:"#aa6a6a"}}>{h.fraq}</div>
          </div>
        </div>
        <div style={{marginTop:8,display:"flex",gap:12,fontSize:11}}>
          <span style={{color:T.gold}}>💰 {h.ouro} ouros</span>
          <span style={{color:T.muted}}>⭐ Maestria {h.maestria}</span>
        </div>
      </div>
    </div>}

    {tab==="log"&&<div style={{padding:14,maxWidth:460,margin:"0 auto"}}>
      <div style={{fontSize:12,color:T.gold,fontWeight:700,letterSpacing:2,marginBottom:10}}>📜 LOG</div>
      {(!user.log||user.log.length===0)&&<div style={{color:T.muted,fontStyle:"italic",fontSize:12}}>Nenhuma ação registrada.</div>}
      {(user.log||[]).map((e,i)=><div key={i} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"7px 11px",marginBottom:5,color:T.text,fontSize:12}}>{e}</div>)}
    </div>}
  </div>;
}

// ── APP ───────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null);

  function handleLogin(u){ setUser(u); }
  function handleLogout(){ setUser(null); }
  async function handleUpdate(u){ setUser(u); }

  if(!user) return <AuthScreen onLogin={handleLogin}/>;
  return <GameScreen user={user} onUpdate={handleUpdate} onLogout={handleLogout}/>;
}
