import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  bg:"#07070c", surface:"#0e0e18", border:"#1e1e2c",
  gold:"#c9a96e", goldDim:"#7a5e30", text:"#cec6b4",
  muted:"#5a5448", red:"#d94f4f", blue:"#4a80d4", green:"#4aaa6a",
  purple:"#a78bfa", orange:"#d97c30",
};

// ══════════════════════════════════════════════════════════
// HISTÓRIA PRINCIPAL — 6 CAPÍTULOS
// ══════════════════════════════════════════════════════════
const HISTORIA = [
  {
    id: 0,
    titulo: "Prólogo — A Cicatriz do Céu",
    regiaoNecessaria: "varnok",
    rankNecessario: "bronze",
    emoji: "🌑",
    cor: "#c9a96e",
    cena: `A cicatriz no céu voltou a brilhar.

Três noites seguidas. Sempre à meia-noite. Uma luz pálida que corta o horizonte de leste a oeste e desaparece antes que alguém possa ter certeza do que viu.

Maren, da Guilda, não costuma chamar mercenários para conversas. Mas essa manhã ela fechou a porta do escritório.

**"Não é a primeira vez que isso acontece,"** ela disse, sem rodeios. **"Mas é a primeira vez que acontece com essa frequência. Algo está acordando. E eu preciso saber o que é antes que a cidade perceba."**

Ela colocou três fichas na mesa. Uma para cada um de vocês.

**"Investigação. Sem prazo. Sem testemunhas."**`,
    escolhas: [
      { id:"aceitar", texto:"Aceitar a missão", resultado:"Vocês aceitaram. A história começou.", efeito:"historiaPts+1" },
      { id:"questionar", texto:"Questionar Maren sobre o que ela sabe", resultado:"Maren revelou mais: a cicatriz pulsou pela primeira vez há 30 anos — no dia da Fratura.", efeito:"lore+1" },
    ],
    proximoCapitulo: 1,
  },
  {
    id: 1,
    titulo: "Capítulo I — O Templo Esquecido",
    regiaoNecessaria: "lunaris",
    rankNecessario: "bronze",
    emoji: "🌲",
    cor: "#5ab870",
    cena: `A Floresta de Lunaris não é silenciosa à noite.

Mas essa noite está.

Nem pássaro. Nem vento. Só a névoa se movendo devagar entre as árvores, como se respirasse.

O templo estava no mapa antigo que Maren deu. Marcado com um símbolo que nenhum de vocês reconheceu. Agora, na frente dele, o símbolo faz mais sentido — é o mesmo da cicatriz no céu.

A porta está aberta.

Não arrombada. Não forçada.

**Aberta.**

Como se alguém soubesse que vocês viriam.`,
    escolhas: [
      { id:"entrar", texto:"Entrar com cautela", resultado:"Vocês encontraram marcas no chão — rituais recentes. Alguém esteve aqui dias atrás.", efeito:"pista+1" },
      { id:"examinar", texto:"Examinar o exterior primeiro", resultado:"Uma marca na pedra: o símbolo dos Filhos da Fratura. Eles chegaram primeiro.", efeito:"faccao_rival+1" },
    ],
    proximoCapitulo: 2,
  },
  {
    id: 2,
    titulo: "Capítulo II — O Nome Proibido",
    regiaoNecessaria: "lunaris",
    rankNecessario: "prata",
    emoji: "📜",
    cor: "#8888e8",
    cena: `Dentro do templo, as paredes falam.

Não metaforicamente. Literalmente — as inscrições nas pedras vibram quando vocês passam. Uma frequência baixa, quase inaudível, que você sente mais no peito do que nos ouvidos.

No centro, um altar. E no altar, um livro.

Não um livro comum. As páginas são feitas de algo que parece pele — mas não é animal. E o título, gravado na capa com letras que parecem ter sido escritas por alguém com as mãos tremendo:

**VAEL.**

Nenhum de vocês conhece esse nome.

Mas quando Fuboka toca a capa, o Cavaleiro das Almas recua. Pela primeira vez desde que foi invocado, ele recua.`,
    escolhas: [
      { id:"abrir", texto:"Abrir o livro", resultado:"Visões. Fragmentadas. A Fratura não foi um acidente — foi um ritual. E Vael estava no centro.", efeito:"lore+2" },
      { id:"fechar", texto:"Não tocar. Levar o livro para Maren", resultado:"Maren pálida. Ela conhece o nome. E agora deve uma explicação.", efeito:"reputacao_guilda+1" },
    ],
    proximoCapitulo: 3,
  },
  {
    id: 3,
    titulo: "Capítulo III — A Ordem Sabe",
    regiaoNecessaria: "vale",
    rankNecessario: "prata",
    emoji: "⚔️",
    cor: "#d94f4f",
    cena: `A Ordem de Ferro estava esperando.

Não emboscada — pior. Eles estavam esperando **educadamente**. Capitão Revan, de uniforme, com dois soldados atrás dele e um sorriso que não chegava aos olhos.

**"Ouvi dizer que encontraram algo interessante na floresta,"** ele disse. **"A Ordem gostaria de... colaborar."**

Nenhum de vocês acredita na palavra colaborar quando ela sai da boca dele.

Mas ele sabe sobre Vael. Isso fica claro nas próximas palavras:

**"Vael não era um homem. Era um título. E o próximo a recebê-lo já foi escolhido."**

Ele esperou. Observou as reações.

**"Não por nós,"** ele adicionou, quase como uma concessão. **"Pelos Filhos."**`,
    escolhas: [
      { id:"aliar", texto:"Fingir colaborar com a Ordem", resultado:"Acesso a informações militares. Mas a Ordem vai cobrar isso mais tarde.", efeito:"ordem+1" },
      { id:"recusar", texto:"Recusar abertamente", resultado:"Revan não ficou surpreso. Ele esperava isso. 'Quando mudarem de ideia, já sabem onde nos encontrar.'", efeito:"ordem-1" },
    ],
    proximoCapitulo: 4,
  },
  {
    id: 4,
    titulo: "Capítulo IV — O Ritual da Fratura",
    regiaoNecessaria: "deserto",
    rankNecessario: "ouro",
    emoji: "🏜️",
    cor: "#d97c30",
    cena: `O Deserto Cinzento esconde o que o mundo não quer lembrar.

Sob a areia, a três horas de caminhada do Oásis Secreto, existe uma câmara. Não construída — **escavada**. Como se algo enorme tivesse saído de dentro da terra há muito tempo e deixado um buraco para trás.

No centro da câmara: o diagrama do ritual.

Trinta anos atrás, seis pessoas se reuniram aqui. Cada uma representando um dos deuses. Cada uma cedendo sua Essência voluntariamente.

O ritual funcionou. A Fratura aconteceu.

Mas o objetivo não era destruir. Era **invocar**.

E o que tentaram invocar — Vael — não chegou completamente.

**Só uma parte dele atravessou.**

A outra parte ainda está do outro lado. Esperando. E a cicatriz no céu é a costura que está se desfazendo.`,
    escolhas: [
      { id:"destruir", texto:"Destruir o diagrama", resultado:"A câmara treme. Algo do outro lado percebeu. A costura ficou mais fina.", efeito:"fratura+1" },
      { id:"estudar", texto:"Copiar o diagrama antes de destruir", resultado:"Vocês têm o ritual completo. Isso pode ser usado para fechar a Fratura — ou abrí-la.", efeito:"conhecimento+1" },
    ],
    proximoCapitulo: 5,
  },
  {
    id: 5,
    titulo: "Capítulo V — O Epicentro",
    regiaoNecessaria: "ruinas",
    rankNecessario: "ouro",
    emoji: "💀",
    cor: "#a78bfa",
    cena: `As Ruínas da Fratura não parecem um lugar.

Parecem uma **ferida**.

O ar vibra. A luz dobra. Sons chegam de direções que não existem. E no centro de tudo — onde a cicatriz do céu aponta quando você a segue com os olhos — existe uma fenda.

Não grande. Do tamanho de uma porta.

Mas do outro lado dela, algo se move.

Vael — ou o que resta de Vael depois de trinta anos preso entre dois mundos — olha para vocês com olhos que são todos ao mesmo tempo: fogo, gelo, sombra, luz.

Ele não ataca.

Ele **fala**.

**"Eu não vim destruir. Eu vim completar o que foi começado. E vocês,"** — uma pausa, quase humana — **"vocês têm exatamente o que eu preciso."**

Silêncio.

**"A escolha é de vocês. Sempre foi."**`,
    escolhas: [
      { id:"fechar", texto:"Fechar a Fratura — sacrificar a Essência do grupo", resultado:"A fenda se fecha. Vael desaparece. A cicatriz some. O mundo respira. Mas os poderes de vocês nunca serão os mesmos.", efeito:"final_luz" },
      { id:"negociar", texto:"Negociar com Vael", resultado:"Vael cumpre o acordo. A Fratura permanece — controlada. O mundo muda. Vocês mudaram com ele.", efeito:"final_equilibrio" },
      { id:"combate", texto:"Lutar contra Vael", resultado:"A batalha mais difícil que já travaram. Vael não é invencível — mas o custo é alto.", efeito:"final_guerra" },
    ],
    proximoCapitulo: null,
  },
];

// ══════════════════════════════════════════════════════════
// DADOS BASE
// ══════════════════════════════════════════════════════════
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
  varnok:{ id:"varnok", nome:"Varnok", emoji:"🏙️", perigo:"Seguro", cor:"#c9a96e", desc:"A cidade dos mercenários.", locais:["Guilda","Mercado","Taverna","Templo"] },
  lunaris:{ id:"lunaris", nome:"Floresta de Lunaris", emoji:"🌲", perigo:"Médio", cor:"#5ab870", desc:"Névoa permanente. Espíritos. Lobos.", locais:["Entrada","Árvore Anciã","Templo Esquecido"] },
  vale:{ id:"vale", nome:"Vale Carmesim", emoji:"⚔️", perigo:"Alto", cor:"#d94f4f", desc:"Terra vermelha. Ordem de Ferro.", locais:["Forte da Ordem","Ruínas do Vale"] },
  cordilheira:{ id:"cordilheira", nome:"Cordilheira Tempestade", emoji:"⛰️", perigo:"Alto", cor:"#4a80d4", desc:"Ventos. Raios. Treino extremo.", locais:["Pico do Trovão","Caverna dos Grifos"] },
  deserto:{ id:"deserto", nome:"Deserto Cinzento", emoji:"🏜️", perigo:"Alto", cor:"#d97c30", desc:"Calor extremo. Criaturas enormes.", locais:["Oásis","Câmara do Ritual"] },
  ruinas:{ id:"ruinas", nome:"Ruínas da Fratura", emoji:"💀", perigo:"Extremo", cor:"#a78bfa", desc:"O epicentro. O fim e o começo.", locais:["Epicentro","A Fenda"], rankMinimo:"ouro" },
};

const MISSOES_SECUNDARIAS = [
  { id:"m1", titulo:"Lobos na Floresta", regiao:"lunaris", rank:"bronze", emoji:"🐺", desc:"Elimine a ameaça de lobos.", recompensa:"50 ouros" },
  { id:"m2", titulo:"Entrega Urgente", regiao:"varnok", rank:"bronze", emoji:"📦", desc:"Escorte um comerciante.", recompensa:"30 ouros" },
  { id:"m3", titulo:"Cristal de Essência", regiao:"deserto", rank:"prata", emoji:"💎", desc:"Recupere um cristal raro.", recompensa:"100 ouros" },
];

const RANKS = ["bronze","prata","ouro","platina","lendario"];
const RANK_EMOJI = { bronze:"🥉", prata:"🥈", ouro:"🥇", platina:"💎", lendario:"👑" };
const RANK_PTS = { bronze:5, prata:10, ouro:15, platina:20, lendario:999 };

// ── STORAGE ───────────────────────────────────────────────
async function saveUser(username, data) {
  try { await window.storage.set(`elaris:user:${username.toLowerCase()}`, JSON.stringify(data)); } catch(e){}
}
async function loadUser(username) {
  try { const r = await window.storage.get(`elaris:user:${username.toLowerCase()}`); return r ? JSON.parse(r.value) : null; } catch(e){ return null; }
}
async function saveGroup(gid, data) {
  try { await window.storage.set(`elaris:group:${gid}`, JSON.stringify(data), true); } catch(e){}
}
async function loadGroup(gid) {
  try { const r = await window.storage.get(`elaris:group:${gid}`, true); return r ? JSON.parse(r.value) : null; } catch(e){ return null; }
}

function makeUser(username, password, heroId) {
  return { username, password, heroId, hero: JSON.parse(JSON.stringify(HEROES_TEMPLATE[heroId])),
    grupo:null, narracao:"", log:[], lastSeen:Date.now() };
}
function makeGroup(id, members) {
  return { id, members, historiaCapitulo:0, historiaEscolhas:{}, historiaCompleta:false,
    aguardandoEscolha:false, escolhaAtual:null, log:[], updatedAt:Date.now() };
}

// ── PROMPT ────────────────────────────────────────────────
function buildPrompt(user, acao, dado, dadoLabel) {
  const h = user.hero;
  const r = REGIOES[h.regiao]||REGIOES.varnok;
  return `Você é o Mestre do RPG ELARIS. Narre em português — frases curtas, impacto dramático, estilo sombrio.
MUNDO: Elaris pós-Fratura. Céu rachado. Monstros. Essência. Poderes. Organização secreta (Filhos da Fratura) tenta invocar Vael.
REGIÃO: ${r.emoji} ${r.nome} — ${r.desc}
PERSONAGEM: ${h.nome} (${h.classe}) HP:${h.hp}/${h.maxHp} EN:${h.en}/${h.maxEn} Rank:${RANK_EMOJI[h.rank]} Ouro:${h.ouro}
${h.regiao==="varnok"?"VARNOK: Maren(Guilda), Durk(Ferreiro), Taverna do Osso":"EXPLORAÇÃO/COMBATE LIVRE"}
AÇÃO: "${acao}" | d20: ${dado} (${dadoLabel})
REGRAS: 1-5=falha,6-10=ruim,11-15=normal,16-19=bom,20=crítico. Bônus estratégia +2 a +5. Dano: ½❤ fraco,1❤ médio,2❤ forte.
Responda SOMENTE com JSON: {"narracao":"2-3 parágrafos","danoHeroi":0,"curaHeroi":0,"custoEnergia":0,"ganhouOuro":0,"rankPts":0,"maestriaPts":0}`;
}

// ── UI ATOMS ──────────────────────────────────────────────
function Pip({ filled, half, color, size=9 }) {
  return <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,
    background:filled?color:half?`linear-gradient(90deg,${color} 50%,#111 50%)`:"#111",
    border:`1px solid ${filled||half?color+"99":"#222"}`,boxShadow:filled?`0 0 5px ${color}66`:"none",transition:"all 0.4s"}}/>;
}
function PipRow({ val, max, color, size=9 }) {
  return <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
    {Array.from({length:max},(_,i)=><Pip key={i} filled={i<Math.floor(val)} half={!(i<Math.floor(val))&&i<val} color={color} size={size}/>)}
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
      <div style={{width:`${Math.min(100,(pts/needed)*100)}%`,height:"100%",background:T.gold,transition:"width 0.5s",borderRadius:1}}/>
    </div>
  </div>;
}

function DiceOverlay({ value, onClose }) {
  const [cur,setCur]=useState(1); const [done,setDone]=useState(false);
  useEffect(()=>{let i=0;const iv=setInterval(()=>{setCur(Math.ceil(Math.random()*20));i++;if(i>22){clearInterval(iv);setCur(value);setDone(true);}},60);return()=>clearInterval(iv);},[value]);
  const col=value>=16?T.green:value>=11?T.gold:value>=6?T.orange:T.red;
  const lbl=value===20?"CRÍTICO! 🔥":value>=16?"Muito bom!":value>=11?"Normal":value>=6?"Ruim":"Falha crítica!";
  return <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:999,background:"rgba(4,4,8,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
    <div style={{fontSize:9,letterSpacing:4,color:"#333",marginBottom:20}}>d20</div>
    <div style={{fontSize:110,lineHeight:1,color:done?col:"#2a2a2a",textShadow:done?`0 0 60px ${col},0 0 20px ${col}`:"none",transition:"all 0.3s",minWidth:140,textAlign:"center",fontWeight:700}}>{cur}</div>
    <div style={{marginTop:18,fontSize:15,color:done?col:"transparent",letterSpacing:2,transition:"color 0.4s"}}>{lbl}</div>
    <div style={{marginTop:28,fontSize:10,color:"#2a2a2a"}}>toque para fechar</div>
  </div>;
}

// ── HISTÓRIA MODAL ────────────────────────────────────────
function HistoriaModal({ grupo, user, membrosData, onEscolha, onFechar }) {
  const cap = HISTORIA[grupo.historiaCapitulo];
  if(!cap) return null;

  const membros = grupo.members || [];
  const todosNaRegiao = membros.every(m => {
    const md = membrosData[m];
    return md && md.hero.regiao === cap.regiaoNecessaria;
  });
  const rankOk = RANKS.indexOf(user.hero.rank) >= RANKS.indexOf(cap.rankNecessario);
  const podeAvancar = todosNaRegiao && rankOk && !grupo.aguardandoEscolha;
  const jaEscolheu = grupo.historiaEscolhas?.[`cap${cap.id}_${user.username}`];

  const aguardandoMembros = membros.filter(m => {
    const md = membrosData[m];
    return !md || md.hero.regiao !== cap.regiaoNecessaria;
  });

  return <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(4,4,8,0.97)",overflowY:"auto",padding:16}}>
    <div style={{maxWidth:500,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontSize:13,color:cap.cor,fontWeight:700,letterSpacing:2}}>📖 HISTÓRIA PRINCIPAL</div>
        <button onClick={onFechar} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>✕</button>
      </div>

      {/* Progresso */}
      <div style={{display:"flex",gap:4,marginBottom:20,flexWrap:"wrap"}}>
        {HISTORIA.map((h,i)=>(
          <div key={i} style={{flex:1,minWidth:30,height:4,borderRadius:2,
            background:i<grupo.historiaCapitulo?cap.cor:i===grupo.historiaCapitulo?`${cap.cor}88`:"#1a1a2a",
            transition:"all 0.5s"}}/>
        ))}
      </div>

      {/* Capítulo atual */}
      <div style={{background:`${cap.cor}08`,border:`1px solid ${cap.cor}33`,borderRadius:14,padding:20,marginBottom:16}}>
        <div style={{fontSize:11,color:cap.cor,letterSpacing:3,marginBottom:8}}>{cap.emoji} CAPÍTULO {cap.id}</div>
        <div style={{fontSize:18,color:cap.cor,fontWeight:700,marginBottom:16}}>{cap.titulo}</div>

        {/* Cena */}
        <div style={{borderLeft:`2px solid ${cap.cor}44`,paddingLeft:14,marginBottom:20}}>
          {cap.cena.split("\n\n").map((p,i)=>{
            const html=p.replace(/\*\*(.+?)\*\*/g,`<strong style="color:${cap.cor}">$1</strong>`);
            return <p key={i} style={{color:T.text,lineHeight:1.9,fontSize:13,margin:"0 0 10px"}} dangerouslySetInnerHTML={{__html:html}}/>;
          })}
        </div>

        {/* Requisito de região */}
        <div style={{background:"#0a0a14",border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",marginBottom:14}}>
          <div style={{fontSize:10,color:T.muted,marginBottom:8}}>REQUISITOS PARA AVANÇAR</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{fontSize:12}}>{REGIOES[cap.regiaoNecessaria]?.emoji}</span>
            <span style={{fontSize:11,color:T.text}}>Todos em {REGIOES[cap.regiaoNecessaria]?.nome}</span>
            {todosNaRegiao
              ?<span style={{fontSize:10,color:T.green,marginLeft:"auto"}}>✅</span>
              :<span style={{fontSize:10,color:T.orange,marginLeft:"auto"}}>⏳</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:12}}>{RANK_EMOJI[cap.rankNecessario]}</span>
            <span style={{fontSize:11,color:T.text}}>Rank {cap.rankNecessario}+</span>
            {rankOk
              ?<span style={{fontSize:10,color:T.green,marginLeft:"auto"}}>✅</span>
              :<span style={{fontSize:10,color:T.orange,marginLeft:"auto"}}>⏳</span>}
          </div>
        </div>

        {/* Aguardando membros */}
        {!todosNaRegiao && aguardandoMembros.length>0 && (
          <div style={{background:"#0a0a0e",border:`1px solid ${T.orange}33`,borderRadius:10,padding:"10px 14px",marginBottom:14}}>
            <div style={{fontSize:10,color:T.orange,marginBottom:6}}>⏳ AGUARDANDO</div>
            {aguardandoMembros.map(m=>{
              const md=membrosData[m];
              const regiaoAtual=md?REGIOES[md.hero.regiao]:null;
              return <div key={m} style={{fontSize:11,color:T.muted,marginBottom:3}}>
                {md?`${HEROES_TEMPLATE[md.heroId]?.emoji||"⚔️"} ${m} está em ${regiaoAtual?.emoji} ${regiaoAtual?.nome||"?"}`:`${m} — offline`}
              </div>;
            })}
            <div style={{fontSize:10,color:T.muted,marginTop:8,fontStyle:"italic"}}>
              Todos precisam ir para {REGIOES[cap.regiaoNecessaria]?.emoji} {REGIOES[cap.regiaoNecessaria]?.nome}
            </div>
          </div>
        )}

        {/* Escolhas */}
        {podeAvancar && !jaEscolheu && (
          <div>
            <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:10}}>O QUE FAZER?</div>
            {cap.escolhas.map(e=>(
              <button key={e.id} onClick={()=>onEscolha(cap.id, e)}
                style={{width:"100%",marginBottom:8,padding:"12px 14px",background:`${cap.cor}10`,
                  border:`1px solid ${cap.cor}44`,borderRadius:10,color:cap.cor,fontSize:12,
                  cursor:"pointer",fontFamily:"Georgia,serif",textAlign:"left",lineHeight:1.5}}>
                ▶ {e.texto}
              </button>
            ))}
          </div>
        )}

        {/* Já escolheu, aguardando outros */}
        {jaEscolheu && grupo.aguardandoEscolha && (
          <div style={{background:"#0a0a14",border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px"}}>
            <div style={{fontSize:11,color:T.green}}>✅ Você escolheu: {jaEscolheu}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:4}}>Aguardando os outros membros escolherem...</div>
          </div>
        )}

        {/* Resultado da escolha */}
        {grupo.historiaEscolhas?.[`cap${cap.id}_resultado`] && !grupo.aguardandoEscolha && grupo.historiaCapitulo===cap.id+1 && (
          <div style={{background:`${cap.cor}10`,border:`1px solid ${cap.cor}44`,borderRadius:10,padding:"10px 14px"}}>
            <div style={{fontSize:10,color:cap.cor,marginBottom:4}}>✨ RESULTADO</div>
            <div style={{fontSize:12,color:T.text}}>{grupo.historiaEscolhas[`cap${cap.id}_resultado`]}</div>
          </div>
        )}
      </div>

      {/* Histórico de capítulos */}
      {grupo.historiaCapitulo>0&&<div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:14}}>
        <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:10}}>CAPÍTULOS CONCLUÍDOS</div>
        {HISTORIA.slice(0,grupo.historiaCapitulo).map(h=>(
          <div key={h.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:14}}>{h.emoji}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:T.muted}}>{h.titulo}</div>
              {grupo.historiaEscolhas?.[`cap${h.id}_resultado`]&&
                <div style={{fontSize:10,color:h.cor,marginTop:2}}>{grupo.historiaEscolhas[`cap${h.id}_resultado`]}</div>}
            </div>
            <span style={{color:T.green,fontSize:12}}>✅</span>
          </div>
        ))}
      </div>}
    </div>
  </div>;
}

// ── AUTH ──────────────────────────────────────────────────
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
    const u=await loadUser(username.trim());
    if(!u){ setErro("Usuário não encontrado."); setLoading(false); return; }
    if(u.password!==password){ setErro("Senha incorreta."); setLoading(false); return; }
    u.lastSeen=Date.now(); await saveUser(username.trim(),u); onLogin(u); setLoading(false);
  }
  async function handleRegistro() {
    if(!username.trim()||!password.trim()) return setErro("Preencha todos os campos.");
    if(!heroId) return setErro("Escolha um personagem.");
    if(username.trim().length<3) return setErro("Nome muito curto.");
    setLoading(true); setErro("");
    const existe=await loadUser(username.trim());
    if(existe){ setErro("Nome já em uso."); setLoading(false); return; }
    const u=makeUser(username.trim(),password,heroId);
    await saveUser(username.trim(),u); onLogin(u); setLoading(false);
  }

  return <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 16px"}}>
    <div style={{textAlign:"center",marginBottom:28}}>
      <div style={{fontSize:36,color:T.gold,fontWeight:700,letterSpacing:6,textShadow:`0 0 40px ${T.gold}44`}}>ELARIS</div>
      <div style={{fontSize:11,color:T.goldDim,letterSpacing:4,marginTop:6}}>MUNDO ABERTO · MULTIPLAYER</div>
      <div style={{width:60,height:1,background:`linear-gradient(90deg,transparent,${T.goldDim},transparent)`,margin:"12px auto 0"}}/>
    </div>
    <div style={{display:"flex",gap:4,marginBottom:18,background:T.surface,borderRadius:10,padding:4,border:`1px solid ${T.border}`}}>
      {["login","registro"].map(m=>(
        <button key={m} onClick={()=>{setModo(m);setErro("");setHeroId(null);}}
          style={{padding:"7px 18px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:12,letterSpacing:1,background:modo===m?T.gold:"transparent",color:modo===m?"#07070c":T.muted,fontWeight:modo===m?700:400}}>
          {m==="login"?"ENTRAR":"CRIAR CONTA"}
        </button>
      ))}
    </div>
    <div style={{width:"100%",maxWidth:360,display:"flex",flexDirection:"column",gap:9}}>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Nome de aventureiro" maxLength={20}
        style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontFamily:"Georgia,serif",fontSize:14,padding:"10px 13px",outline:"none",boxSizing:"border-box",width:"100%"}}/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" type="password"
        style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontFamily:"Georgia,serif",fontSize:14,padding:"10px 13px",outline:"none",boxSizing:"border-box",width:"100%"}}/>
      {modo==="registro"&&<>
        <div style={{fontSize:10,color:T.muted,letterSpacing:2,textAlign:"center",marginTop:4}}>ESCOLHA SEU PERSONAGEM</div>
        {Object.values(HEROES_TEMPLATE).map(p=>(
          <div key={p.id} onClick={()=>setHeroId(p.id)} onMouseEnter={()=>setHover(p.id)} onMouseLeave={()=>setHover(null)}
            style={{borderRadius:12,overflow:"hidden",cursor:"pointer",
              border:`1px solid ${heroId===p.id?p.cor+"88":hover===p.id?p.cor+"44":T.border}`,
              background:heroId===p.id?`${p.cor}15`:T.surface,transition:"all 0.2s"}}>
            <div style={{display:"flex"}}>
              <div style={{width:4,background:`linear-gradient(180deg,${p.cor},${p.corDim})`,flexShrink:0}}/>
              <div style={{padding:"10px 13px",flex:1}}>
                <div style={{fontSize:13,color:heroId===p.id?p.cor:T.text,fontWeight:700}}>{p.emoji} {p.nome}</div>
                <div style={{fontSize:10,color:T.muted,marginTop:1}}>{p.classe} · {p.espec}</div>
              </div>
            </div>
          </div>
        ))}
      </>}
      {erro&&<div style={{fontSize:11,color:T.red,textAlign:"center"}}>{erro}</div>}
      <button onClick={modo==="login"?handleLogin:handleRegistro} disabled={loading}
        style={{background:`linear-gradient(135deg,${T.gold},${T.goldDim})`,border:"none",borderRadius:10,color:"#07070c",fontWeight:700,fontSize:14,padding:"12px",cursor:"pointer",fontFamily:"Georgia,serif",marginTop:4}}>
        {loading?"⏳...":modo==="login"?"⚔️ ENTRAR":"⚔️ CRIAR CONTA"}
      </button>
    </div>
  </div>;
}

// ── MAPA ──────────────────────────────────────────────────
function MapaModal({ hero, onViajar, onFechar }) {
  const [hover,setHover]=useState(null);
  return <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(4,4,8,0.96)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{width:"100%",maxWidth:480}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:15,color:T.gold,fontWeight:700}}>🗺️ MAPA DE ELARIS</div>
        <button onClick={onFechar} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>✕</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {Object.values(REGIOES).map(r=>{
          const aqui=hero.regiao===r.id;
          const bloqueada=r.rankMinimo&&RANKS.indexOf(hero.rank)<RANKS.indexOf(r.rankMinimo);
          return <div key={r.id} onClick={()=>!bloqueada&&!aqui&&onViajar(r.id)}
            onMouseEnter={()=>setHover(r.id)} onMouseLeave={()=>setHover(null)}
            style={{borderRadius:11,padding:12,cursor:bloqueada||aqui?"default":"pointer",
              border:`1px solid ${aqui?r.cor+"88":hover===r.id&&!bloqueada?r.cor+"44":T.border}`,
              background:aqui?`${r.cor}15`:T.surface,opacity:bloqueada?0.4:1,transition:"all 0.2s"}}>
            <div style={{fontSize:18,marginBottom:3}}>{r.emoji}</div>
            <div style={{fontSize:11,color:aqui?r.cor:T.text,fontWeight:700}}>{r.nome}</div>
            <div style={{fontSize:9,color:T.muted,marginTop:2,lineHeight:1.4}}>{r.desc}</div>
            {aqui&&<div style={{fontSize:9,color:r.cor,marginTop:4}}>📍 Você está aqui</div>}
            {bloqueada&&<div style={{fontSize:9,color:T.muted,marginTop:4}}>🔒 Rank {r.rankMinimo}</div>}
          </div>;
        })}
      </div>
    </div>
  </div>;
}

// ── GRUPO MODAL ────────────────────────────────────────────
function GrupoModal({ user, onFechar, onSave }) {
  const [busca,setBusca]=useState(""); const [resultado,setResultado]=useState(null);
  const [buscando,setBuscando]=useState(false); const [erro,setErro]=useState("");
  const [grupo,setGrupo]=useState(null);
  useEffect(()=>{ if(user.grupo) loadGroup(user.grupo).then(g=>{ if(g) setGrupo(g); }); },[user.grupo]);
  async function buscar() {
    if(!busca.trim()) return; setBuscando(true); setErro(""); setResultado(null);
    const u=await loadUser(busca.trim());
    if(!u) setErro("Jogador não encontrado."); else if(u.username===user.username) setErro("Você não pode se adicionar."); else setResultado(u);
    setBuscando(false);
  }
  async function convidar() {
    if(!resultado) return;
    const gid=`${[user.username,resultado.username].sort().join("-")}`.toLowerCase();
    const g=makeGroup(gid,[user.username,resultado.username]);
    await saveGroup(gid,g);
    const u1={...user,grupo:gid}; await saveUser(user.username,u1);
    const u2={...resultado,grupo:gid}; await saveUser(resultado.username,u2);
    setGrupo(g); onSave(u1); setResultado(null); setBusca("");
  }
  async function sair() {
    const u={...user,grupo:null}; await saveUser(user.username,u); setGrupo(null); onSave(u);
  }
  return <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(4,4,8,0.96)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{width:"100%",maxWidth:400,background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:14,color:T.gold,fontWeight:700}}>👥 GRUPO</div>
        <button onClick={onFechar} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>✕</button>
      </div>
      {grupo?<>
        <div style={{fontSize:10,color:T.muted,marginBottom:8}}>Membros:</div>
        {grupo.members.map(m=><div key={m} style={{background:"#0a0a14",border:`1px solid ${m===user.username?T.gold+"44":T.border}`,borderRadius:9,padding:"9px 12px",marginBottom:7,display:"flex",alignItems:"center",gap:8}}>
          <span>{HEROES_TEMPLATE[m===user.username?user.heroId:"balo"]?.emoji||"⚔️"}</span>
          <div style={{fontSize:12,color:m===user.username?T.gold:T.text,fontWeight:600}}>{m}{m===user.username&&" (você)"}</div>
        </div>)}
        <div style={{fontSize:10,color:T.muted,fontStyle:"italic",marginBottom:10}}>ID do grupo: {grupo.id}</div>
        <button onClick={sair} style={{width:"100%",padding:"9px",background:"#1a0808",border:`1px solid ${T.red}44`,borderRadius:9,color:T.red,fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif"}}>Sair do Grupo</button>
      </>:<>
        <div style={{fontSize:11,color:T.muted,marginBottom:10}}>Busque um jogador pelo nome para formar grupo.</div>
        <div style={{display:"flex",gap:7,marginBottom:10}}>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Nome do jogador..." onKeyDown={e=>e.key==="Enter"&&buscar()}
            style={{flex:1,background:"#0a0a14",border:`1px solid ${T.border}`,borderRadius:7,color:T.text,fontFamily:"Georgia,serif",fontSize:13,padding:"8px 11px",outline:"none"}}/>
          <button onClick={buscar} disabled={buscando} style={{background:T.gold,border:"none",borderRadius:7,color:"#07070c",fontWeight:700,fontSize:12,padding:"8px 12px",cursor:"pointer"}}>🔍</button>
        </div>
        {erro&&<div style={{fontSize:11,color:T.red,marginBottom:7}}>{erro}</div>}
        {resultado&&<div style={{background:"#0a0a14",border:`1px solid ${T.green}44`,borderRadius:9,padding:"11px 13px",marginBottom:9}}>
          <div style={{fontSize:12,color:T.green,fontWeight:600}}>✅ {resultado.username} encontrado!</div>
          <button onClick={convidar} style={{marginTop:7,width:"100%",padding:"7px",background:"#0a1a0a",border:`1px solid ${T.green}`,borderRadius:7,color:T.green,fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif"}}>Convidar</button>
        </div>}
      </>}
    </div>
  </div>;
}

// ── GAME SCREEN ───────────────────────────────────────────
function GameScreen({ user, onUpdate, onLogout }) {
  const [acao,setAcao]=useState(""); const [dado,setDado]=useState(null);
  const [diceVal,setDiceVal]=useState(null); const [showDice,setShowDice]=useState(false);
  const [submitting,setSubmitting]=useState(false); const [narracao,setNarracao]=useState(user.narracao||"");
  const [tab,setTab]=useState("mundo");
  const [showMapa,setShowMapa]=useState(false); const [showGrupo,setShowGrupo]=useState(false);
  const [showGuilda,setShowGuilda]=useState(false); const [showHistoria,setShowHistoria]=useState(false);
  const [grupo,setGrupo]=useState(null); const [membrosData,setMembrosData]=useState({});
  const bottomRef=useRef(null);
  const pollRef=useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[narracao]);

  useEffect(()=>{
    if(!user.grupo) return;
    async function syncGrupo() {
      const g=await loadGroup(user.grupo);
      if(g){ setGrupo(g);
        const md={};
        await Promise.all(g.members.map(async m=>{ const u=await loadUser(m); if(u) md[m]=u; }));
        setMembrosData(md);
      }
    }
    syncGrupo();
    pollRef.current=setInterval(syncGrupo,3000);
    return()=>clearInterval(pollRef.current);
  },[user.grupo]);

  const h=user.hero;
  const regiao=REGIOES[h.regiao]||REGIOES.varnok;
  const emVarnok=h.regiao==="varnok";
  const dadoColor=!dado?"#666":dado<=5?T.red:dado<=10?T.orange:dado<=15?T.gold:dado<20?T.green:T.purple;
  const dadoLabel=!dado?"":dado<=5?"Falha crítica!":dado<=10?"Ruim":dado<=15?"Normal":dado<20?"Muito bom!":"CRÍTICO! 🔥";

  function rollDice(){ const v=Math.ceil(Math.random()*20); setDiceVal(v); setShowDice(true); }
  function closeDice(){ if(diceVal) setDado(diceVal); setShowDice(false); }

  async function viajar(rId) {
    const newH={...h,regiao:rId};
    const newUser={...user,hero:newH,narracao:`Você viajou para ${REGIOES[rId].emoji} ${REGIOES[rId].nome}.`};
    await saveUser(user.username,newUser); onUpdate(newUser);
    setNarracao(newUser.narracao); setShowMapa(false);
  }

  async function handleEscolha(capId, escolha) {
    if(!grupo) return;
    const key=`cap${capId}_${user.username}`;
    const newGrupo={...grupo, historiaEscolhas:{...(grupo.historiaEscolhas||{}), [key]:escolha.texto}, aguardandoEscolha:true, updatedAt:Date.now()};
    // Verifica se todos escolheram
    const capObj=HISTORIA[capId];
    const todosEscolheram=newGrupo.grupo?.members?.every(m=>newGrupo.historiaEscolhas[`cap${capId}_${m}`]) ||
      grupo.members.every(m=>m===user.username||newGrupo.historiaEscolhas[`cap${capId}_${m}`]);
    if(todosEscolheram||grupo.members.length===1) {
      newGrupo.aguardandoEscolha=false;
      newGrupo.historiaEscolhas[`cap${capId}_resultado`]=escolha.resultado;
      newGrupo.historiaCapitulo=capId+1;
      if(!capObj.proximoCapitulo) newGrupo.historiaCompleta=true;
    }
    await saveGroup(grupo.id,newGrupo);
    setGrupo(newGrupo);
  }

  async function confirmar() {
    if(!dado||!acao.trim()||submitting) return;
    setSubmitting(true);
    const sys=buildPrompt(user,acao,dado,dadoLabel);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content:acao}]})});
      const data=await res.json();
      const txt=data.content?.find(b=>b.type==="text")?.text||"{}";
      let result={};
      try{ result=JSON.parse(txt.replace(/```json|```/g,"").trim()); }catch(e){ result={narracao:txt}; }
      const narr=result.narracao||"O Mestre observa.";
      setNarracao(narr);
      let newH={...h};
      let newLog=[...(user.log||[])];
      if(result.danoHeroi>0){ newH={...newH,hp:Math.max(0,newH.hp-result.danoHeroi)}; newLog=[`💔 Tomou ${result.danoHeroi}❤️`,...newLog.slice(0,29)]; }
      if(result.curaHeroi>0) newH={...newH,hp:Math.min(newH.maxHp,newH.hp+result.curaHeroi)};
      if(result.custoEnergia>0) newH={...newH,en:Math.max(0,newH.en-result.custoEnergia)};
      if(result.ganhouOuro>0){ newH={...newH,ouro:(newH.ouro||0)+result.ganhouOuro}; newLog=[`💰 +${result.ganhouOuro} ouros`,...newLog.slice(0,29)]; }
      let rpts=(newH.rankPts||0)+(result.rankPts||0);
      let rank=newH.rank;
      if(rpts>=(RANK_PTS[rank]||5)&&RANKS.indexOf(rank)<RANKS.length-1){ rank=RANKS[RANKS.indexOf(rank)+1]; rpts=0; newLog=[`🎉 Subiu para ${RANK_EMOJI[rank]}!`,...newLog.slice(0,29)]; }
      newH={...newH,rank,rankPts:rpts,maestria:(newH.maestria||1)+(result.maestriaPts||0)};
      const newUser={...user,hero:newH,log:newLog,narracao:narr,lastSeen:Date.now()};
      await saveUser(user.username,newUser); onUpdate(newUser); setAcao(""); setDado(null);
    } catch(err){ setNarracao("O Mestre hesita. Tente novamente."); }
    setSubmitting(false);
  }

  const capAtual = grupo ? HISTORIA[grupo.historiaCapitulo] : null;
  const tabs=[{id:"mundo",label:"🌍 Mundo"},{id:"ficha",label:"📋 Ficha"},{id:"log",label:"📜 Log"}];

  return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Georgia,serif"}}>
    {showDice&&diceVal&&<DiceOverlay value={diceVal} onClose={closeDice}/>}
    {showMapa&&<MapaModal hero={h} onViajar={viajar} onFechar={()=>setShowMapa(false)}/>}
    {showGrupo&&<GrupoModal user={user} onFechar={()=>setShowGrupo(false)} onSave={u=>{onUpdate(u);setShowGrupo(false);}}/>}
    {showHistoria&&grupo&&<HistoriaModal grupo={grupo} user={user} membrosData={membrosData} onEscolha={handleEscolha} onFechar={()=>setShowHistoria(false)}/>}

    <div style={{borderBottom:`1px solid ${T.border}`,padding:"8px 13px",display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
      <div style={{fontSize:14,color:T.gold,fontWeight:700,letterSpacing:3}}>⚔️ ELARIS</div>
      <div style={{display:"flex",gap:3}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?"#1e1e28":"transparent",border:tab===t.id?`1px solid ${T.border}`:"1px solid transparent",color:tab===t.id?T.gold:T.muted,borderRadius:6,padding:"3px 8px",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{t.label}</button>)}
      </div>
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5}}>
        <span style={{fontSize:10,color:h.cor}}>{h.emoji} {user.username}</span>
        <button onClick={onLogout} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:5,padding:"2px 7px",fontSize:9,cursor:"pointer"}}>Sair</button>
      </div>
    </div>

    {tab==="mundo"&&<div style={{display:"flex",height:"calc(100vh - 46px)"}}>
      <div style={{width:175,borderRight:`1px solid ${T.border}`,padding:9,overflowY:"auto",flexShrink:0}}>
        <div style={{background:`${regiao.cor}10`,border:`1px solid ${regiao.cor}33`,borderRadius:9,padding:"8px 10px",marginBottom:9}}>
          <div style={{fontSize:11,color:regiao.cor,fontWeight:700}}>{regiao.emoji} {regiao.nome}</div>
          <div style={{fontSize:9,color:T.muted,marginTop:1}}>⚠️ {regiao.perigo}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:9}}>
          <button onClick={()=>setShowMapa(true)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,color:T.gold,fontSize:10,padding:"6px",cursor:"pointer",fontFamily:"inherit"}}>🗺️ Mapa</button>
          <button onClick={()=>setShowGrupo(true)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,color:T.blue,fontSize:10,padding:"6px",cursor:"pointer",fontFamily:"inherit"}}>👥 Grupo{user.grupo?" ✓":""}</button>
          {grupo&&<button onClick={()=>setShowHistoria(true)} style={{background:`${capAtual?.cor||T.purple}10`,border:`1px solid ${capAtual?.cor||T.purple}44`,borderRadius:7,color:capAtual?.cor||T.purple,fontSize:10,padding:"6px",cursor:"pointer",fontFamily:"inherit"}}>
            📖 História {grupo.historiaCompleta?"✅":`Cap.${grupo.historiaCapitulo+1}`}
          </button>}
          {emVarnok&&<button onClick={()=>setShowGuilda(true)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,color:T.gold,fontSize:10,padding:"6px",cursor:"pointer",fontFamily:"inherit"}}>⚔️ Guilda</button>}
        </div>

        {/* Hero mini */}
        <div style={{background:T.surface,border:`1px solid ${h.cor}22`,borderRadius:9,padding:"8px 9px",marginBottom:7}}>
          <div style={{fontSize:10,color:h.cor,fontWeight:600,marginBottom:5}}>{h.emoji} {h.nome}</div>
          <div style={{marginBottom:4}}><div style={{fontSize:7,color:T.muted,marginBottom:2}}>HP</div><PipRow val={h.hp} max={h.maxHp} color={T.red} size={6}/></div>
          <div style={{marginBottom:5}}><div style={{fontSize:7,color:T.muted,marginBottom:2}}>EN</div><PipRow val={h.en} max={h.maxEn} color={T.blue} size={6}/></div>
          <RankBar rank={h.rank} pts={h.rankPts||0}/>
          <div style={{fontSize:9,color:T.gold,marginTop:4}}>💰 {h.ouro}</div>
        </div>

        {/* Outros membros */}
        {grupo&&Object.entries(membrosData).filter(([m])=>m!==user.username).map(([m,md])=>{
          const mh=md.hero; const mr=REGIOES[mh.regiao];
          return <div key={m} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 9px",marginBottom:5}}>
            <div style={{fontSize:10,color:mh.cor,fontWeight:600}}>{mh.emoji} {m}</div>
            <div style={{fontSize:9,color:T.muted}}>{mr?.emoji} {mr?.nome}</div>
            <div style={{marginTop:3}}><PipRow val={mh.hp} max={mh.maxHp} color={T.red} size={5}/></div>
          </div>;
        })}

        {/* Aviso história */}
        {grupo&&capAtual&&(()=>{
          const aguardando=grupo.members.filter(m=>{const md=membrosData[m];return !md||md.hero.regiao!==capAtual.regiaoNecessaria;});
          if(aguardando.length>0) return <div style={{background:`${T.purple}10`,border:`1px solid ${T.purple}33`,borderRadius:8,padding:"7px 9px",marginTop:4}}>
            <div style={{fontSize:9,color:T.purple,fontWeight:600,marginBottom:3}}>📖 História bloqueada</div>
            <div style={{fontSize:8,color:T.muted}}>Todos precisam ir para {REGIOES[capAtual.regiaoNecessaria]?.emoji} {REGIOES[capAtual.regiaoNecessaria]?.nome}</div>
          </div>;
          return null;
        })()}
      </div>

      <div style={{flex:1,padding:"14px 17px",overflowY:"auto"}}>
        <div style={{fontSize:16,color:T.gold,fontWeight:700,marginBottom:2}}>{regiao.emoji} {regiao.nome}</div>
        <div style={{fontSize:10,color:T.muted,marginBottom:9}}>{regiao.desc}</div>
        {regiao.locais&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
          {regiao.locais.map(l=><span key={l} style={{fontSize:9,padding:"2px 7px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,color:T.muted}}>📍 {l}</span>)}
        </div>}
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${T.border},transparent)`,marginBottom:10}}/>
        <div style={{fontSize:11,color:h.cor,fontWeight:700,marginBottom:7}}>{h.emoji} {h.nome} — o que você faz?</div>
        <textarea value={acao} onChange={e=>setAcao(e.target.value)}
          placeholder={emVarnok?"Fale com NPCs, compre itens, descanse...":"Explore, combata, investigue..."}
          style={{width:"100%",minHeight:72,background:T.surface,border:`1px solid ${T.border}`,borderRadius:9,color:T.text,fontFamily:"Georgia,serif",fontSize:13,padding:10,resize:"vertical",outline:"none",boxSizing:"border-box",marginBottom:8}}/>
        <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:7,marginBottom:9}}>
          <button onClick={rollDice} disabled={submitting} style={{background:T.gold,border:"none",borderRadius:7,color:"#07070c",fontWeight:700,fontSize:12,padding:"8px 14px",cursor:"pointer",fontFamily:"inherit"}}>🎲 Rolar d20</button>
          <button onClick={confirmar} disabled={!dado||!acao.trim()||submitting}
            style={{background:dado&&acao.trim()&&!submitting?"#1a2e1a":"#111",border:`1px solid ${dado&&acao.trim()&&!submitting?T.green:"#222"}`,color:dado&&acao.trim()&&!submitting?T.green:"#333",borderRadius:7,fontWeight:700,fontSize:12,padding:"8px 14px",cursor:dado&&acao.trim()&&!submitting?"pointer":"default",fontFamily:"inherit"}}>
            {submitting?"⏳ Narrando...":"✅ Confirmar"}
          </button>
          {dado&&<div style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{fontSize:26,color:dadoColor,fontWeight:700,textShadow:`0 0 12px ${dadoColor}66`}}>{dado}</span>
            <span style={{fontSize:11,color:dadoColor,fontWeight:600}}>{dadoLabel}</span>
          </div>}
        </div>
        {narracao&&<div style={{background:"#0a0a12",border:`1px solid ${T.gold}33`,borderRadius:11,padding:"11px 13px"}}>
          <div style={{fontSize:9,color:T.goldDim,letterSpacing:3,marginBottom:6}}>⚔️ O MESTRE NARRA</div>
          {narracao.split("\n\n").map((p,i)=><p key={i} style={{color:T.text,lineHeight:1.85,fontSize:13,margin:"0 0 7px"}}>{p}</p>)}
        </div>}
        <div ref={bottomRef}/>
      </div>
    </div>}

    {tab==="ficha"&&<div style={{padding:14,maxWidth:380,margin:"0 auto"}}>
      <div style={{background:T.surface,border:`1px solid ${h.cor}33`,borderRadius:12,padding:14}}>
        <div style={{fontSize:15,color:h.cor,fontWeight:700,marginBottom:3}}>{h.emoji} {h.nome}</div>
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
            <div style={{flex:1,height:3,background:"#111",borderRadius:2}}><div style={{width:`${(v/10)*100}%`,height:"100%",background:h.cor}}/></div>
            <span style={{fontSize:9,color:T.muted,width:10,textAlign:"right"}}>{v}</span>
          </div>
        ))}
        <div style={{marginTop:10}}><RankBar rank={h.rank} pts={h.rankPts||0}/></div>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <div style={{flex:1,padding:"6px 9px",background:"#080f08",border:"1px solid #1a2a1a",borderRadius:7}}>
            <div style={{fontSize:8,color:"#4a8a4a"}}>✅ ESPEC.</div><div style={{fontSize:10,color:"#6aaa6a"}}>{h.espec}</div>
          </div>
          <div style={{flex:1,padding:"6px 9px",background:"#0f0808",border:"1px solid #2a1a1a",borderRadius:7}}>
            <div style={{fontSize:8,color:"#8a4a4a"}}>❌ FRAQ.</div><div style={{fontSize:10,color:"#aa6a6a"}}>{h.fraq}</div>
          </div>
        </div>
        <div style={{marginTop:8,fontSize:11,color:T.gold}}>💰 {h.ouro} ouros · ⭐ Maestria {h.maestria}</div>
      </div>
    </div>}

    {tab==="log"&&<div style={{padding:14,maxWidth:460,margin:"0 auto"}}>
      <div style={{fontSize:12,color:T.gold,fontWeight:700,letterSpacing:2,marginBottom:10}}>📜 LOG</div>
      {(!user.log||user.log.length===0)&&<div style={{color:T.muted,fontStyle:"italic",fontSize:12}}>Nenhuma ação registrada.</div>}
      {(user.log||[]).map((e,i)=><div key={i} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"7px 10px",marginBottom:5,color:T.text,fontSize:12}}>{e}</div>)}
    </div>}
  </div>;
}

// ── APP ───────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null);
  return !user
    ? <AuthScreen onLogin={setUser}/>
    : <GameScreen user={user} onUpdate={setUser} onLogout={()=>setUser(null)}/>;
}
