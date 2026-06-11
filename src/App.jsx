import { useState, useEffect, useRef } from "react";

const T = {
  bg:"#07070c", surface:"#0e0e18", border:"#1e1e2c",
  gold:"#c9a96e", goldDim:"#7a5e30", text:"#cec6b4",
  muted:"#5a5448", red:"#d94f4f", blue:"#4a80d4", green:"#4aaa6a",
  purple:"#a78bfa", orange:"#d97c30",
};

// Troque por sua chave no GitHub/Vercel
const API_KEY = "";

const INIMIGOS_POR_AREA = {
  lunaris: [
    { id:"lobo_cinza", nome:"Lobo Cinza", emoji:"🐺", tipo:"comum", hp:3, maxHp:3, dano:0.5, exp:10, ouro:5, drops:[{id:"pele_lobo",chance:0.6},{id:"garra_lobo",chance:0.4}] },
    { id:"lobo_negro", nome:"Lobo Negro", emoji:"🐺", tipo:"elite", hp:5, maxHp:5, dano:1, exp:25, ouro:12, drops:[{id:"garra_lobo",chance:0.7},{id:"fang_negro",chance:0.3}] },
    { id:"espirito_nevoa", nome:"Espírito da Névoa", emoji:"👻", tipo:"comum", hp:2, maxHp:2, dano:0.5, exp:12, ouro:8, drops:[{id:"essencia_nevoa",chance:0.5}] },
    { id:"aranha_sombra", nome:"Aranha das Sombras", emoji:"🕷️", tipo:"comum", hp:2, maxHp:2, dano:1, exp:15, ouro:6, drops:[{id:"veneno_aranha",chance:0.5},{id:"seda_sombra",chance:0.3}] },
    { id:"cervo_corrompido", nome:"Cervo Corrompido", emoji:"🦌", tipo:"elite", hp:6, maxHp:6, dano:1.5, exp:30, ouro:15, drops:[{id:"chifre_corrompido",chance:0.4},{id:"carne_corrompida",chance:0.6}] },
    { id:"alpha_lunaris", nome:"Lobo Alfa de Lunaris", emoji:"🐺", tipo:"boss", hp:20, maxHp:20, dano:2, exp:150, ouro:80, drops:[{id:"essencia_alfa",chance:1},{id:"pelagem_alfa",chance:0.8},{id:"coracao_alfa",chance:0.4}] },
  ],
  vale: [
    { id:"guerreiro_ferro", nome:"Guerreiro de Ferro", emoji:"⚔️", tipo:"comum", hp:5, maxHp:5, dano:1, exp:20, ouro:10, drops:[{id:"fragmento_ferro",chance:0.6},{id:"emblema_ordem",chance:0.2}] },
    { id:"arqueiro_carmesim", nome:"Arqueiro Carmesim", emoji:"🏹", tipo:"comum", hp:3, maxHp:3, dano:1.5, exp:22, ouro:12, drops:[{id:"flecha_carmesim",chance:0.7}] },
    { id:"cavaleiro_ordem", nome:"Cavaleiro da Ordem", emoji:"🗡️", tipo:"elite", hp:8, maxHp:8, dano:1.5, exp:45, ouro:25, drops:[{id:"espada_ordem",chance:0.3},{id:"armadura_ferro",chance:0.2}] },
    { id:"berserker_vale", nome:"Berserker do Vale", emoji:"💢", tipo:"elite", hp:7, maxHp:7, dano:2, exp:50, ouro:20, drops:[{id:"machado_sangue",chance:0.35}] },
    { id:"golem_pedra", nome:"Golem de Pedra", emoji:"🪨", tipo:"elite", hp:12, maxHp:12, dano:1.5, exp:60, ouro:30, drops:[{id:"nucleo_pedra",chance:0.5},{id:"runa_antiga",chance:0.2}] },
    { id:"comandante_revan", nome:"Comandante Revan", emoji:"👑", tipo:"boss", hp:25, maxHp:25, dano:2.5, exp:200, ouro:120, drops:[{id:"espada_revan",chance:1},{id:"manto_ordem",chance:0.6},{id:"sinete_ordem",chance:0.3}] },
  ],
  cordilheira: [
    { id:"grifo_jovem", nome:"Grifo Jovem", emoji:"🦅", tipo:"comum", hp:4, maxHp:4, dano:1, exp:18, ouro:8, drops:[{id:"pena_grifo",chance:0.7},{id:"garra_grifo",chance:0.4}] },
    { id:"serpente_raio", nome:"Serpente do Raio", emoji:"🐍", tipo:"comum", hp:3, maxHp:3, dano:1.5, exp:20, ouro:10, drops:[{id:"escama_raio",chance:0.6},{id:"veneno_raio",chance:0.3}] },
    { id:"yeti_montanha", nome:"Yeti da Montanha", emoji:"🏔️", tipo:"elite", hp:10, maxHp:10, dano:2, exp:55, ouro:28, drops:[{id:"pelo_yeti",chance:0.6},{id:"gelo_eterno",chance:0.3}] },
    { id:"golem_trovao", nome:"Golem do Trovão", emoji:"⛈️", tipo:"elite", hp:9, maxHp:9, dano:1.5, exp:50, ouro:25, drops:[{id:"nucleo_trovao",chance:0.4}] },
    { id:"roc_anciao", nome:"Roc Ancião", emoji:"🦅", tipo:"boss", hp:28, maxHp:28, dano:3, exp:220, ouro:100, drops:[{id:"pena_roc",chance:1},{id:"olho_roc",chance:0.5},{id:"garras_roc",chance:0.4}] },
  ],
  deserto: [
    { id:"escorpiao_cinza", nome:"Escorpião Cinzento", emoji:"🦂", tipo:"comum", hp:4, maxHp:4, dano:1, exp:18, ouro:9, drops:[{id:"ferrao_escorpiao",chance:0.6},{id:"veneno_escorpiao",chance:0.4}] },
    { id:"serpente_areia", nome:"Serpente da Areia", emoji:"🐍", tipo:"comum", hp:3, maxHp:3, dano:1.5, exp:22, ouro:11, drops:[{id:"escama_areia",chance:0.6},{id:"dente_serpente",chance:0.35}] },
    { id:"djinn_chamas", nome:"Djinn das Chamas", emoji:"🔥", tipo:"elite", hp:8, maxHp:8, dano:2, exp:55, ouro:30, drops:[{id:"essencia_fogo",chance:0.5},{id:"cristal_calor",chance:0.3}] },
    { id:"titan_areia", nome:"Titã da Areia", emoji:"🏜️", tipo:"elite", hp:14, maxHp:14, dano:2, exp:70, ouro:35, drops:[{id:"pedra_deserto",chance:0.5},{id:"cristal_essencia",chance:0.2}] },
    { id:"serpente_ancia", nome:"Serpente Anciã", emoji:"🐍", tipo:"boss", hp:30, maxHp:30, dano:2.5, exp:250, ouro:130, drops:[{id:"escama_ancia",chance:1},{id:"veneno_ancestral",chance:0.6},{id:"cristal_essencia",chance:0.4}] },
  ],
  ruinas: [
    { id:"corrompido_menor", nome:"Corrompido Menor", emoji:"👤", tipo:"comum", hp:6, maxHp:6, dano:1.5, exp:35, ouro:15, drops:[{id:"essencia_corrompida",chance:0.6},{id:"fragmento_fratura",chance:0.3}] },
    { id:"aberracao_menor", nome:"Aberração Menor", emoji:"👾", tipo:"elite", hp:10, maxHp:10, dano:2, exp:65, ouro:35, drops:[{id:"nucleo_aberracao",chance:0.4},{id:"fragmento_fratura",chance:0.5}] },
    { id:"espectro_antigo", nome:"Espectro Antigo", emoji:"👻", tipo:"elite", hp:8, maxHp:8, dano:2.5, exp:70, ouro:30, drops:[{id:"alma_espectro",chance:0.5},{id:"essencia_corrompida",chance:0.4}] },
    { id:"vael_fragmento", nome:"Fragmento de Vael", emoji:"🌀", tipo:"boss", hp:40, maxHp:40, dano:3.5, exp:500, ouro:250, drops:[{id:"essencia_vael",chance:1},{id:"fragmento_fratura",chance:1},{id:"reliquia_vael",chance:0.5}] },
  ],
  varnok: [],
};

const ITENS_DB = {
  pele_lobo:{ id:"pele_lobo", nome:"Pele de Lobo", emoji:"🟫", tipo:"material", desc:"Pele resistente.", valor:8 },
  garra_lobo:{ id:"garra_lobo", nome:"Garra de Lobo", emoji:"🦴", tipo:"material", desc:"Garra afiada.", valor:12 },
  fang_negro:{ id:"fang_negro", nome:"Presa Negra", emoji:"🖤", tipo:"material", desc:"Presa rara.", valor:25 },
  essencia_nevoa:{ id:"essencia_nevoa", nome:"Essência de Névoa", emoji:"🌫️", tipo:"material", desc:"Capturada de espíritos.", valor:20 },
  veneno_aranha:{ id:"veneno_aranha", nome:"Veneno de Aranha", emoji:"☠️", tipo:"material", desc:"Tóxico.", valor:18 },
  seda_sombra:{ id:"seda_sombra", nome:"Seda das Sombras", emoji:"🕸️", tipo:"material", desc:"Tecida pela escuridão.", valor:22 },
  chifre_corrompido:{ id:"chifre_corrompido", nome:"Chifre Corrompido", emoji:"🟣", tipo:"material", desc:"Repleto de Essência.", valor:30 },
  carne_corrompida:{ id:"carne_corrompida", nome:"Carne Corrompida", emoji:"🩸", tipo:"material", desc:"Não comer.", valor:5 },
  essencia_alfa:{ id:"essencia_alfa", nome:"Essência do Alfa", emoji:"⭐", tipo:"artefato", desc:"+1 FOR.", valor:80, efeito:{FOR:1} },
  pelagem_alfa:{ id:"pelagem_alfa", nome:"Pelagem do Alfa", emoji:"🟤", tipo:"armadura", desc:"+1 RES.", valor:60, efeito:{RES:1,defesa:0.5} },
  coracao_alfa:{ id:"coracao_alfa", nome:"Coração do Alfa", emoji:"❤️", tipo:"artefato", desc:"Regen ½❤️/turno.", valor:100, efeito:{regen:0.5} },
  fragmento_ferro:{ id:"fragmento_ferro", nome:"Fragmento de Ferro", emoji:"🔩", tipo:"material", desc:"Metal resistente.", valor:10 },
  emblema_ordem:{ id:"emblema_ordem", nome:"Emblema da Ordem", emoji:"🛡️", tipo:"material", desc:"Passaporte.", valor:35 },
  flecha_carmesim:{ id:"flecha_carmesim", nome:"Flecha Carmesim", emoji:"🏹", tipo:"material", desc:"Tingida de sangue.", valor:8 },
  espada_ordem:{ id:"espada_ordem", nome:"Espada da Ordem", emoji:"⚔️", tipo:"arma", desc:"+1 dano.", valor:90, efeito:{dano:1} },
  armadura_ferro:{ id:"armadura_ferro", nome:"Armadura de Ferro", emoji:"🛡️", tipo:"armadura", desc:"+2 RES.", valor:80, efeito:{RES:2,defesa:1} },
  machado_sangue:{ id:"machado_sangue", nome:"Machado de Sangue", emoji:"🪓", tipo:"arma", desc:"+1.5 dano.", valor:100, efeito:{dano:1.5} },
  nucleo_pedra:{ id:"nucleo_pedra", nome:"Núcleo de Pedra", emoji:"🪨", tipo:"material", desc:"Energia cristalizada.", valor:40 },
  runa_antiga:{ id:"runa_antiga", nome:"Runa Antiga", emoji:"🔮", tipo:"artefato", desc:"+1 CTR.", valor:70, efeito:{CTR:1} },
  espada_revan:{ id:"espada_revan", nome:"Espada de Revan", emoji:"⚔️", tipo:"arma", desc:"+2 dano.", valor:150, efeito:{dano:2} },
  manto_ordem:{ id:"manto_ordem", nome:"Manto da Ordem", emoji:"🟥", tipo:"armadura", desc:"+1 RES +1 AGI.", valor:120, efeito:{RES:1,AGI:1,defesa:0.5} },
  sinete_ordem:{ id:"sinete_ordem", nome:"Sinete da Ordem", emoji:"💍", tipo:"artefato", desc:"Acesso restrito.", valor:60 },
  pena_grifo:{ id:"pena_grifo", nome:"Pena de Grifo", emoji:"🪶", tipo:"material", desc:"Levíssima.", valor:15 },
  garra_grifo:{ id:"garra_grifo", nome:"Garra de Grifo", emoji:"🦅", tipo:"material", desc:"Cortante.", valor:20 },
  escama_raio:{ id:"escama_raio", nome:"Escama do Raio", emoji:"⚡", tipo:"material", desc:"Conduz eletricidade.", valor:25 },
  veneno_raio:{ id:"veneno_raio", nome:"Veneno do Raio", emoji:"💛", tipo:"material", desc:"Paralisia.", valor:30 },
  pelo_yeti:{ id:"pelo_yeti", nome:"Pelo de Yeti", emoji:"🤍", tipo:"material", desc:"Muito quente.", valor:20 },
  gelo_eterno:{ id:"gelo_eterno", nome:"Gelo Eterno", emoji:"❄️", tipo:"material", desc:"Nunca derrete.", valor:45 },
  nucleo_trovao:{ id:"nucleo_trovao", nome:"Núcleo do Trovão", emoji:"⚡", tipo:"artefato", desc:"+1 dano elemental.", valor:85, efeito:{danoElemental:1} },
  pena_roc:{ id:"pena_roc", nome:"Pena do Roc", emoji:"🪶", tipo:"arma", desc:"+2 AGI.", valor:130, efeito:{AGI:2} },
  olho_roc:{ id:"olho_roc", nome:"Olho do Roc", emoji:"👁️", tipo:"artefato", desc:"+2 CTR.", valor:110, efeito:{CTR:2} },
  garras_roc:{ id:"garras_roc", nome:"Garras do Roc", emoji:"🦅", tipo:"arma", desc:"+1.5 dano +1 AGI.", valor:120, efeito:{dano:1.5,AGI:1} },
  ferrao_escorpiao:{ id:"ferrao_escorpiao", nome:"Ferrão de Escorpião", emoji:"🦂", tipo:"material", desc:"Venenoso.", valor:18 },
  veneno_escorpiao:{ id:"veneno_escorpiao", nome:"Veneno de Escorpião", emoji:"💜", tipo:"material", desc:"Potente.", valor:28 },
  escama_areia:{ id:"escama_areia", nome:"Escama da Areia", emoji:"🟡", tipo:"material", desc:"Resistente ao calor.", valor:15 },
  dente_serpente:{ id:"dente_serpente", nome:"Dente de Serpente", emoji:"🦷", tipo:"material", desc:"Afiado.", valor:12 },
  essencia_fogo:{ id:"essencia_fogo", nome:"Essência de Fogo", emoji:"🔥", tipo:"material", desc:"Quente ao toque.", valor:35 },
  cristal_calor:{ id:"cristal_calor", nome:"Cristal do Calor", emoji:"🟠", tipo:"artefato", desc:"+1 dano fogo.", valor:75, efeito:{danoFogo:1} },
  pedra_deserto:{ id:"pedra_deserto", nome:"Pedra do Deserto", emoji:"🟤", tipo:"material", desc:"Polida pelo vento.", valor:10 },
  cristal_essencia:{ id:"cristal_essencia", nome:"Cristal de Essência Pura", emoji:"💎", tipo:"artefato", desc:"+2 EN máximo.", valor:150, efeito:{ENE:2,maxEn:2} },
  escama_ancia:{ id:"escama_ancia", nome:"Escama Anciã", emoji:"🟡", tipo:"armadura", desc:"+2 RES +1 FOR.", valor:160, efeito:{RES:2,FOR:1,defesa:1} },
  veneno_ancestral:{ id:"veneno_ancestral", nome:"Veneno Ancestral", emoji:"☠️", tipo:"material", desc:"O mais potente.", valor:80 },
  essencia_corrompida:{ id:"essencia_corrompida", nome:"Essência Corrompida", emoji:"⚫", tipo:"material", desc:"Perigosa.", valor:25 },
  fragmento_fratura:{ id:"fragmento_fratura", nome:"Fragmento da Fratura", emoji:"🌑", tipo:"artefato", desc:"+1 todos attrs.", valor:200, efeito:{FOR:1,AGI:1,RES:1,ENE:1,CTR:1} },
  nucleo_aberracao:{ id:"nucleo_aberracao", nome:"Núcleo de Aberração", emoji:"🟣", tipo:"material", desc:"Instável.", valor:50 },
  alma_espectro:{ id:"alma_espectro", nome:"Alma do Espectro", emoji:"✨", tipo:"artefato", desc:"+1 CTR +1 ENE.", valor:120, efeito:{CTR:1,ENE:1} },
  essencia_vael:{ id:"essencia_vael", nome:"Essência de Vael", emoji:"🌀", tipo:"artefato", desc:"+2 todos.", valor:500, efeito:{FOR:2,AGI:2,RES:2,ENE:2,CTR:2} },
  reliquia_vael:{ id:"reliquia_vael", nome:"Relíquia de Vael", emoji:"💠", tipo:"artefato", desc:"Poder lendário.", valor:999 },
};

const RECEITAS = [
  { id:"adaga_sombria", nome:"Adaga Sombria", emoji:"🗡️", tipo:"arma", desc:"+1.5 dano +1 AGI.", materiais:{garra_lobo:2,seda_sombra:1}, ouro:20,
    item:{id:"adaga_sombria",nome:"Adaga Sombria",emoji:"🗡️",tipo:"arma",desc:"+1.5 dano, +1 AGI.",valor:120,efeito:{dano:1.5,AGI:1}} },
  { id:"armadura_lobo", nome:"Armadura do Lobo", emoji:"🟤", tipo:"armadura", desc:"+2 RES.", materiais:{pele_lobo:3,garra_lobo:1}, ouro:30,
    item:{id:"armadura_lobo",nome:"Armadura do Lobo",emoji:"🟤",tipo:"armadura",desc:"+2 RES.",valor:100,efeito:{RES:2,defesa:0.5}} },
  { id:"lanca_grifo", nome:"Lança do Grifo", emoji:"🪶", tipo:"arma", desc:"+2 dano +1 AGI.", materiais:{pena_grifo:3,garra_grifo:2}, ouro:40,
    item:{id:"lanca_grifo",nome:"Lança do Grifo",emoji:"🪶",tipo:"arma",desc:"+2 dano +1 AGI.",valor:150,efeito:{dano:2,AGI:1}} },
  { id:"escudo_golem", nome:"Escudo do Golem", emoji:"🪨", tipo:"armadura", desc:"+3 RES.", materiais:{nucleo_pedra:2,fragmento_ferro:3}, ouro:50,
    item:{id:"escudo_golem",nome:"Escudo do Golem",emoji:"🪨",tipo:"armadura",desc:"+3 RES +1 defesa.",valor:180,efeito:{RES:3,defesa:1}} },
  { id:"espada_chamas", nome:"Espada das Chamas", emoji:"🔥", tipo:"arma", desc:"+2 dano de fogo.", materiais:{essencia_fogo:2,cristal_calor:1,fragmento_ferro:2}, ouro:60,
    item:{id:"espada_chamas",nome:"Espada das Chamas",emoji:"🔥",tipo:"arma",desc:"+2 dano fogo.",valor:200,efeito:{dano:2,danoFogo:1}} },
  { id:"manto_nevoa", nome:"Manto da Névoa", emoji:"🌫️", tipo:"armadura", desc:"+1 RES +2 AGI.", materiais:{essencia_nevoa:3,seda_sombra:2}, ouro:45,
    item:{id:"manto_nevoa",nome:"Manto da Névoa",emoji:"🌫️",tipo:"armadura",desc:"+1 RES +2 AGI.",valor:160,efeito:{RES:1,AGI:2,defesa:0.5}} },
  { id:"garras_escorpiao", nome:"Garras do Escorpião", emoji:"🦂", tipo:"arma", desc:"+1.5 dano + veneno.", materiais:{ferrao_escorpiao:2,veneno_escorpiao:1}, ouro:35,
    item:{id:"garras_escorpiao",nome:"Garras do Escorpião",emoji:"🦂",tipo:"arma",desc:"+1.5 dano veneno.",valor:140,efeito:{dano:1.5}} },
  { id:"armadura_serpente", nome:"Armadura da Serpente", emoji:"🟡", tipo:"armadura", desc:"+2 RES +1 FOR.", materiais:{escama_areia:3,escama_ancia:1}, ouro:80,
    item:{id:"armadura_serpente",nome:"Armadura da Serpente",emoji:"🟡",tipo:"armadura",desc:"+2 RES +1 FOR.",valor:220,efeito:{RES:2,FOR:1,defesa:1}} },
  { id:"espada_raio", nome:"Espada do Raio", emoji:"⚡", tipo:"arma", desc:"+2 dano elétrico.", materiais:{escama_raio:3,nucleo_trovao:1}, ouro:70,
    item:{id:"espada_raio",nome:"Espada do Raio",emoji:"⚡",tipo:"arma",desc:"+2 dano elétrico.",valor:190,efeito:{dano:2,danoElemental:1}} },
  { id:"armadura_yeti", nome:"Armadura do Yeti", emoji:"🤍", tipo:"armadura", desc:"+2 RES +1 FOR.", materiais:{pelo_yeti:3,gelo_eterno:1}, ouro:55,
    item:{id:"armadura_yeti",nome:"Armadura do Yeti",emoji:"🤍",tipo:"armadura",desc:"+2 RES +1 FOR.",valor:170,efeito:{RES:2,FOR:1,defesa:0.5}} },
];

const HEROES_TEMPLATE = {
  balo:{id:"balo",nome:"Balo Balesco",emoji:"🗡️",classe:"Lutador",arma:"Adaga",poder:"Sombra",
    cor:"#c9a96e",corDim:"#7a5e30",hp:5,maxHp:5,en:5,maxEn:5,
    exp:0,expProxLevel:100,nivel:1,pontosStatus:0,
    rank:"bronze",rankPts:0,ouro:50,
    attrs:{FOR:3,AGI:7,RES:3,ENE:5,CTR:2},
    espec:"Parry",fraq:"Pouca força",parryChance:0.20,
    status:null,regiao:"varnok",missaoAtiva:null,
    inventario:[],equipamentos:{arma:null,armadura:null,artefatos:[null,null,null]}},
  fuboka:{id:"fuboka",nome:"Fuboka",emoji:"🌑",classe:"Especialista",arma:"Cavaleiro das Almas",poder:"Invocação",
    cor:"#8888e8",corDim:"#404080",hp:5,maxHp:5,en:6,maxEn:6,
    exp:0,expProxLevel:100,nivel:1,pontosStatus:0,
    rank:"bronze",rankPts:0,ouro:50,
    attrs:{FOR:2,AGI:2,RES:3,ENE:6,CTR:7},
    espec:"Domar",fraq:"Toma mais dano direto",parryChance:0.05,
    status:null,regiao:"varnok",missaoAtiva:null,
    inventario:[],equipamentos:{arma:null,armadura:null,artefatos:[null,null,null]}},
  patosauro:{id:"patosauro",nome:"Patosauro",emoji:"🦖",classe:"Especialista",arma:"T-Rex",poder:"Invocação",
    cor:"#5ab870",corDim:"#2a5a38",hp:5,maxHp:5,en:7,maxEn:7,
    exp:0,expProxLevel:100,nivel:1,pontosStatus:0,
    rank:"bronze",rankPts:0,ouro:50,
    attrs:{FOR:2,AGI:3,RES:2,ENE:7,CTR:6},
    espec:"Controle",fraq:"Força física",parryChance:0.05,
    status:null,regiao:"varnok",missaoAtiva:null,
    inventario:[],equipamentos:{arma:null,armadura:null,artefatos:[null,null,null]}},
};

const REGIOES = {
  varnok:{id:"varnok",nome:"Varnok",emoji:"🏙️",perigo:"Seguro",cor:"#c9a96e",desc:"A cidade dos mercenários."},
  lunaris:{id:"lunaris",nome:"Floresta de Lunaris",emoji:"🌲",perigo:"Médio",cor:"#5ab870",desc:"Névoa permanente. Lobos. Espíritos."},
  vale:{id:"vale",nome:"Vale Carmesim",emoji:"⚔️",perigo:"Alto",cor:"#d94f4f",desc:"Terra vermelha. Ordem de Ferro."},
  cordilheira:{id:"cordilheira",nome:"Cordilheira Tempestade",emoji:"⛰️",perigo:"Alto",cor:"#4a80d4",desc:"Ventos. Raios. Grifos."},
  deserto:{id:"deserto",nome:"Deserto Cinzento",emoji:"🏜️",perigo:"Alto",cor:"#d97c30",desc:"Calor extremo. Criaturas enormes."},
  ruinas:{id:"ruinas",nome:"Ruínas da Fratura",emoji:"💀",perigo:"Extremo",cor:"#a78bfa",desc:"O epicentro. Aberrações.",rankMinimo:"ouro"},
};

const RANKS=["bronze","prata","ouro","platina","lendario"];
const RANK_EMOJI={bronze:"🥉",prata:"🥈",ouro:"🥇",platina:"💎",lendario:"👑"};
const RANK_PTS={bronze:5,prata:10,ouro:15,platina:20,lendario:999};
const ATTR_NOMES={FOR:"💪 FOR",AGI:"⚡ AGI",RES:"🛡️ RES",ENE:"🔋 ENE",CTR:"🎯 CTR"};

async function saveUser(u,d){try{await window.storage.set(`e4:${u}`,JSON.stringify(d));}catch(e){}}
async function loadUser(u){try{const r=await window.storage.get(`e4:${u}`);return r?JSON.parse(r.value):null;}catch(e){return null;}}
async function saveGroup(id,d){try{await window.storage.set(`e4g:${id}`,JSON.stringify(d),true);}catch(e){}}
async function loadGroup(id){try{const r=await window.storage.get(`e4g:${id}`,true);return r?JSON.parse(r.value):null;}catch(e){return null;}}

function makeUser(username,password,heroId){
  return{username,password,heroId,hero:JSON.parse(JSON.stringify(HEROES_TEMPLATE[heroId])),grupo:null,narracao:"",log:[],lastSeen:Date.now()};
}

function getAttrTotal(hero,attr){
  let base=hero.attrs[attr]||0;
  const eq=hero.equipamentos;
  if(eq.arma&&ITENS_DB[eq.arma]?.efeito?.[attr]) base+=ITENS_DB[eq.arma].efeito[attr];
  if(eq.armadura&&ITENS_DB[eq.armadura]?.efeito?.[attr]) base+=ITENS_DB[eq.armadura].efeito[attr];
  (eq.artefatos||[]).forEach(a=>{if(a&&ITENS_DB[a]?.efeito?.[attr]) base+=ITENS_DB[a].efeito[attr];});
  return base;
}
function getDefesaBonus(hero){
  let d=0; const eq=hero.equipamentos;
  if(eq.armadura&&ITENS_DB[eq.armadura]?.efeito?.defesa) d+=ITENS_DB[eq.armadura].efeito.defesa;
  return d;
}
function getDanoBonus(hero){
  let d=0; const eq=hero.equipamentos;
  if(eq.arma&&ITENS_DB[eq.arma]?.efeito?.dano) d+=ITENS_DB[eq.arma].efeito.dano;
  return d;
}
function calcExpProxLevel(nivel){return Math.floor(100*Math.pow(1.4,nivel-1));}
function rollParry(hero){return Math.random()<(hero.parryChance||0.05);}
function rollDrop(drops){return drops.filter(d=>Math.random()<d.chance).map(d=>d.id);}
function sortearInimigo(regiao,isBoss=false){
  const pool=(INIMIGOS_POR_AREA[regiao]||[]).filter(e=>isBoss?e.tipo==="boss":e.tipo!=="boss");
  if(!pool.length) return null;
  return JSON.parse(JSON.stringify(pool[Math.floor(Math.random()*pool.length)]));
}

async function chamarIA(system, userMsg, maxTokens=1000){
  const headers={"Content-Type":"application/json"};
  if(API_KEY){
    headers["x-api-key"]=API_KEY;
    headers["anthropic-version"]="2023-06-01";
    headers["anthropic-dangerous-direct-browser-access"]="true";
  }
  const res=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers,
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,system,messages:[{role:"user",content:userMsg}]}),
  });
  const data=await res.json();
  return data.content?.find(b=>b.type==="text")?.text||"{}";
}

// ── UI ATOMS ──────────────────────────────────────────────
function Pip({filled,half,color,size=9}){
  return <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,background:filled?color:half?`linear-gradient(90deg,${color} 50%,#111 50%)`:"#111",border:`1px solid ${filled||half?color+"99":"#222"}`,boxShadow:filled?`0 0 5px ${color}66`:"none",transition:"all 0.3s"}}/>;
}
function PipRow({val,max,color,size=9}){
  return <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{Array.from({length:Math.min(max,10)},(_,i)=><Pip key={i} filled={i<Math.floor(val)} half={!(i<Math.floor(val))&&i<val} color={color} size={size}/>)}</div>;
}
function RankBar({rank,pts}){
  const needed=RANK_PTS[rank]||5;
  return <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:9,color:T.gold}}>{RANK_EMOJI[rank]} {rank.toUpperCase()}</span><span style={{fontSize:9,color:T.muted}}>{pts}/{needed}</span></div><div style={{height:2,background:"#111",borderRadius:1}}><div style={{width:`${Math.min(100,(pts/needed)*100)}%`,height:"100%",background:T.gold,transition:"width 0.5s",borderRadius:1}}/></div></div>;
}
function ExpBar({exp,proxLevel}){
  return <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:9,color:T.purple}}>✨ EXP</span><span style={{fontSize:9,color:T.muted}}>{exp}/{proxLevel}</span></div><div style={{height:2,background:"#111",borderRadius:1}}><div style={{width:`${Math.min(100,(exp/proxLevel)*100)}%`,height:"100%",background:T.purple,transition:"width 0.5s",borderRadius:1}}/></div></div>;
}
function DiceOverlay({value,onClose}){
  const [cur,setCur]=useState(1);const [done,setDone]=useState(false);
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

// ── BATALHA ───────────────────────────────────────────────
function BatalhaScreen({user,inimigo,onFim,onUpdate}){
  const [h,setH]=useState({...user.hero});
  const [mob,setMob]=useState({...inimigo});
  const [log,setLog]=useState([]);
  const [fase,setFase]=useState("player");
  const [dado,setDado]=useState(null);
  const [diceVal,setDiceVal]=useState(null);
  const [showDice,setShowDice]=useState(false);
  const [acao,setAcao]=useState("");
  const [resultado,setResultado]=useState(null);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[log]);

  const dadoColor=!dado?"#666":dado<=5?T.red:dado<=10?T.orange:dado<=15?T.gold:dado<20?T.green:T.purple;
  const dadoLabel=!dado?"":dado<=5?"Falha crítica!":dado<=10?"Ruim":dado<=15?"Normal":dado<20?"Muito bom!":"CRÍTICO! 🔥";

  function rollDice(){const v=Math.ceil(Math.random()*20);setDiceVal(v);setShowDice(true);}
  function closeDice(){if(diceVal)setDado(diceVal);setShowDice(false);}
  function addLog(txt,cor=T.text){setLog(l=>[...l,{txt,cor}]);}

  async function confirmarAtaque(){
    if(!dado||!acao.trim()) return;
    let newH={...h};let newMob={...mob};
    let danoBase=dado>=20?2:dado>=16?1.5:dado>=11?1:dado>=6?0.5:0;
    danoBase+=getDanoBonus(h);
    if(dado<=5){addLog(`❌ ${h.nome} falhou! Dano em si mesmo!`,T.red);newH={...newH,hp:Math.max(0,newH.hp-0.5)};}
    else if(danoBase>0){newMob={...newMob,hp:Math.max(0,newMob.hp-danoBase)};addLog(`⚔️ ${h.nome} causou ${danoBase}❤️ em ${mob.nome}! (${dadoLabel})`,T.green);}
    if(newMob.hp>0){
      await new Promise(r=>setTimeout(r,600));
      const parried=rollParry(h);
      const danoInimigo=Math.max(0,mob.dano-getDefesaBonus(h));
      if(parried){addLog(`🛡️ ${h.nome} aparou o ataque! (${Math.round(h.parryChance*100)}% chance)`,T.gold);}
      else{newH={...newH,hp:Math.max(0,newH.hp-danoInimigo)};addLog(`💢 ${mob.nome} atacou! ${h.nome} recebeu ${danoInimigo}❤️`,T.red);}
    }
    setH(newH);setMob(newMob);setDado(null);setAcao("");
    if(newMob.hp<=0){
      const drops=rollDrop(mob.drops||[]);
      const expGanha=mob.exp;const ouroGanho=mob.ouro+Math.floor(Math.random()*5);
      addLog(`🏆 ${mob.nome} foi derrotado!`,T.gold);
      if(drops.length>0)addLog(`📦 Drops: ${drops.map(d=>ITENS_DB[d]?.emoji+(ITENS_DB[d]?.nome||d)).join(", ")}`,T.purple);
      addLog(`✨ +${expGanha} EXP | 💰 +${ouroGanho} ouros`,T.green);
      setResultado({vitoria:true,drops,exp:expGanha,ouro:ouroGanho});
      let finalH={...newH};
      finalH.exp=(finalH.exp||0)+expGanha;
      finalH.ouro=(finalH.ouro||0)+ouroGanho;
      while(finalH.exp>=(finalH.expProxLevel||100)){
        finalH.exp-=(finalH.expProxLevel||100);
        finalH.nivel=(finalH.nivel||1)+1;
        finalH.expProxLevel=calcExpProxLevel(finalH.nivel);
        finalH.pontosStatus=(finalH.pontosStatus||0)+3;
        finalH.maxHp+=0.5;finalH.hp=Math.min(finalH.hp+0.5,finalH.maxHp);
        addLog(`🎉 NÍVEL ${finalH.nivel}! +3 pontos de status!`,T.gold);
      }
      finalH.inventario=[...(finalH.inventario||[]),...drops];
      const newUser={...user,hero:finalH};
      await saveUser(user.username,newUser);onUpdate(newUser);setFase("fim");return;
    }
    if(newH.hp<=0){
      addLog(`💀 ${h.nome} foi derrotado...`,T.red);setResultado({vitoria:false,drops:[],exp:0,ouro:0});
      let finalH={...newH,hp:1};const newUser={...user,hero:finalH};
      await saveUser(user.username,newUser);onUpdate(newUser);setFase("fim");return;
    }
  }

  const pctMob=(mob.hp/mob.maxHp)*100;const pctH=(h.hp/h.maxHp)*100;
  const mobCor=mob.tipo==="boss"?T.purple:mob.tipo==="elite"?T.orange:T.red;
  return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Georgia,serif",display:"flex",flexDirection:"column"}}>
    {showDice&&diceVal&&<DiceOverlay value={diceVal} onClose={closeDice}/>}
    <div style={{background:"#0a0006",borderBottom:`1px solid ${T.red}44`,padding:"10px 14px"}}>
      <div style={{fontSize:11,color:T.red,letterSpacing:3,marginBottom:8}}>⚔️ BATALHA</div>
      <div style={{marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <span style={{fontSize:14,color:mobCor,fontWeight:700}}>{mob.emoji} {mob.nome}</span>
          <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:`${mobCor}22`,color:mobCor}}>{mob.tipo.toUpperCase()}</span>
        </div>
        <div style={{height:6,background:"#1a0a0a",borderRadius:3}}><div style={{width:`${pctMob}%`,height:"100%",background:mobCor,borderRadius:3,transition:"width 0.5s",boxShadow:`0 0 8px ${mobCor}66`}}/></div>
        <div style={{fontSize:9,color:T.muted,marginTop:2}}>{mob.hp}/{mob.maxHp} HP · Dano: {mob.dano}❤️</div>
      </div>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <span style={{fontSize:12,color:T.gold}}>{h.emoji} {h.nome}</span>
          <span style={{fontSize:9,color:T.muted}}>Parry: {Math.round((h.parryChance||0.05)*100)}%</span>
        </div>
        <div style={{height:5,background:"#1a0a0a",borderRadius:3}}><div style={{width:`${pctH}%`,height:"100%",background:T.red,borderRadius:3,transition:"width 0.5s"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:T.muted,marginTop:2}}><span>{h.hp}/{h.maxHp} HP</span><span>{h.en}/{h.maxEn} EN</span></div>
      </div>
    </div>
    <div style={{flex:1,padding:"10px 14px",overflowY:"auto",maxHeight:"35vh"}}>
      {log.map((l,i)=><div key={i} style={{fontSize:12,color:l.cor,marginBottom:4,lineHeight:1.5}}>{l.txt}</div>)}
      <div ref={bottomRef}/>
    </div>
    {fase!=="fim"&&<div style={{borderTop:`1px solid ${T.border}`,padding:"10px 14px"}}>
      <textarea value={acao} onChange={e=>setAcao(e.target.value)} placeholder="Descreva seu ataque ou estratégia..."
        style={{width:"100%",minHeight:60,background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontFamily:"Georgia,serif",fontSize:12,padding:9,resize:"none",outline:"none",boxSizing:"border-box",marginBottom:8}}/>
      <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
        <button onClick={rollDice} style={{background:T.gold,border:"none",borderRadius:7,color:"#07070c",fontWeight:700,fontSize:12,padding:"8px 14px",cursor:"pointer",fontFamily:"inherit"}}>🎲 Rolar d20</button>
        <button onClick={confirmarAtaque} disabled={!dado||!acao.trim()}
          style={{background:dado&&acao.trim()?"#1a2e1a":"#111",border:`1px solid ${dado&&acao.trim()?T.green:"#222"}`,color:dado&&acao.trim()?T.green:"#333",borderRadius:7,fontWeight:700,fontSize:12,padding:"8px 14px",cursor:dado&&acao.trim()?"pointer":"default",fontFamily:"inherit"}}>
          ⚔️ Atacar
        </button>
        {dado&&<div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:24,color:dadoColor,fontWeight:700}}>{dado}</span><span style={{fontSize:10,color:dadoColor}}>{dadoLabel}</span></div>}
      </div>
    </div>}
    {fase==="fim"&&resultado&&<div style={{borderTop:`1px solid ${T.border}`,padding:14}}>
      <div style={{fontSize:15,color:resultado.vitoria?T.gold:T.red,fontWeight:700,marginBottom:10,textAlign:"center"}}>{resultado.vitoria?"🏆 VITÓRIA!":"💀 DERROTA"}</div>
      {resultado.vitoria&&<>
        <div style={{fontSize:12,color:T.green,marginBottom:4}}>✨ +{resultado.exp} EXP</div>
        <div style={{fontSize:12,color:T.gold,marginBottom:4}}>💰 +{resultado.ouro} ouros</div>
        {resultado.drops.length>0&&<div style={{fontSize:12,color:T.purple,marginBottom:8}}>📦 {resultado.drops.map(d=>`${ITENS_DB[d]?.emoji}${ITENS_DB[d]?.nome||d}`).join(", ")}</div>}
      </>}
      {!resultado.vitoria&&<div style={{fontSize:11,color:T.muted,marginBottom:8}}>Você ressurgiu com 1 HP em Varnok.</div>}
      <button onClick={()=>onFim(resultado.vitoria)} style={{width:"100%",padding:"11px",background:T.surface,border:`1px solid ${T.gold}`,borderRadius:9,color:T.gold,fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif"}}>Continuar →</button>
    </div>}
  </div>;
}

// ── INVENTÁRIO ────────────────────────────────────────────
function InventarioModal({user,onFechar,onUpdate}){
  const h=user.hero;const [selecionado,setSelecionado]=useState(null);
  async function equipar(itemId,slot){
    let eq=JSON.parse(JSON.stringify(h.equipamentos));
    if(slot==="arma") eq.arma=eq.arma===itemId?null:itemId;
    else if(slot==="armadura") eq.armadura=eq.armadura===itemId?null:itemId;
    else if(slot.startsWith("artefato")){const idx=parseInt(slot.split("_")[1]);const a=[...eq.artefatos];a[idx]=a[idx]===itemId?null:itemId;eq.artefatos=a;}
    const newUser={...user,hero:{...h,equipamentos:eq}};
    await saveUser(user.username,newUser);onUpdate(newUser);
  }
  async function gastarPonto(attr){
    if((h.pontosStatus||0)<=0) return;
    const newH={...h,attrs:{...h.attrs,[attr]:(h.attrs[attr]||0)+1},pontosStatus:(h.pontosStatus||0)-1};
    const newUser={...user,hero:newH};await saveUser(user.username,newUser);onUpdate(newUser);
  }
  const inv=h.inventario||[];const eq=h.equipamentos;
  const slotSt=(oc,cor="#c9a96e")=>({border:`1px dashed ${oc?cor+"88":T.border}`,background:oc?`${cor}08`:"transparent",borderRadius:8,padding:"8px 10px",marginBottom:6,cursor:"pointer",transition:"all 0.2s"});
  return <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(4,4,8,0.97)",overflowY:"auto",padding:14}}>
    <div style={{maxWidth:460,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:15,color:T.gold,fontWeight:700}}>🎒 INVENTÁRIO</div>
        <button onClick={onFechar} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>✕</button>
      </div>
      {(h.pontosStatus||0)>0&&<div style={{background:`${T.purple}15`,border:`1px solid ${T.purple}44`,borderRadius:10,padding:"10px 14px",marginBottom:12}}>
        <div style={{fontSize:11,color:T.purple,fontWeight:700,marginBottom:8}}>✨ {h.pontosStatus} PONTOS DE STATUS</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {Object.keys(h.attrs).map(attr=>(
            <button key={attr} onClick={()=>gastarPonto(attr)} style={{padding:"5px 10px",background:`${T.purple}15`,border:`1px solid ${T.purple}44`,borderRadius:6,color:T.purple,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
              +1 {ATTR_NOMES[attr]} ({getAttrTotal(h,attr)})
            </button>
          ))}
        </div>
      </div>}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:14,marginBottom:14}}>
        <div style={{fontSize:11,color:T.gold,fontWeight:700,marginBottom:10}}>⚔️ EQUIPAMENTOS</div>
        <div style={slotSt(!!eq.arma,T.orange)} onClick={()=>setSelecionado(s=>s==="arma"?null:"arma")}>
          <div style={{fontSize:9,color:T.muted,marginBottom:3}}>🗡️ ARMA</div>
          {eq.arma?<div style={{fontSize:12,color:T.orange}}>{ITENS_DB[eq.arma]?.emoji} {ITENS_DB[eq.arma]?.nome} — {ITENS_DB[eq.arma]?.desc}</div>:<div style={{fontSize:11,color:T.muted,fontStyle:"italic"}}>Nenhuma</div>}
        </div>
        <div style={slotSt(!!eq.armadura,T.blue)} onClick={()=>setSelecionado(s=>s==="armadura"?null:"armadura")}>
          <div style={{fontSize:9,color:T.muted,marginBottom:3}}>🛡️ ARMADURA</div>
          {eq.armadura?<div style={{fontSize:12,color:T.blue}}>{ITENS_DB[eq.armadura]?.emoji} {ITENS_DB[eq.armadura]?.nome}</div>:<div style={{fontSize:11,color:T.muted,fontStyle:"italic"}}>Nenhuma</div>}
        </div>
        {[0,1,2].map(i=>(
          <div key={i} style={slotSt(!!(eq.artefatos||[])[i],T.purple)} onClick={()=>setSelecionado(s=>s===`artefato_${i}`?null:`artefato_${i}`)}>
            <div style={{fontSize:9,color:T.muted,marginBottom:3}}>💠 ARTEFATO {i+1}</div>
            {(eq.artefatos||[])[i]?<div style={{fontSize:12,color:T.purple}}>{ITENS_DB[(eq.artefatos||[])[i]]?.emoji} {ITENS_DB[(eq.artefatos||[])[i]]?.nome}</div>:<div style={{fontSize:11,color:T.muted,fontStyle:"italic"}}>Vazio</div>}
          </div>
        ))}
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:14}}>
        <div style={{fontSize:11,color:T.gold,fontWeight:700,marginBottom:10}}>🎒 ITENS ({inv.length})</div>
        {inv.length===0&&<div style={{fontSize:11,color:T.muted,fontStyle:"italic"}}>Inventário vazio.</div>}
        {inv.map((itemId,idx)=>{
          const item=ITENS_DB[itemId];if(!item)return null;
          const isEq=["arma","armadura","artefato"].includes(item.tipo);
          return <div key={idx} style={{background:"#0a0a14",border:`1px solid ${T.border}`,borderRadius:9,padding:"9px 12px",marginBottom:7,display:"flex",alignItems:"flex-start",gap:10}}>
            <span style={{fontSize:20}}>{item.emoji}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:T.text,fontWeight:600}}>{item.nome}<span style={{fontSize:9,color:T.muted,marginLeft:6,padding:"1px 5px",background:T.surface,borderRadius:4}}>{item.tipo}</span></div>
              <div style={{fontSize:10,color:T.muted,marginTop:1}}>{item.desc}</div>
              <div style={{fontSize:9,color:T.gold,marginTop:1}}>💰 {item.valor}</div>
            </div>
            {isEq&&selecionado&&<button onClick={()=>equipar(itemId,selecionado)} style={{padding:"4px 9px",background:`${T.gold}15`,border:`1px solid ${T.gold}44`,borderRadius:6,color:T.gold,fontSize:10,cursor:"pointer",flexShrink:0}}>Equipar</button>}
          </div>;
        })}
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:14,marginTop:10}}>
        <div style={{fontSize:11,color:T.gold,fontWeight:700,marginBottom:8}}>📊 ATRIBUTOS TOTAIS</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {Object.keys(h.attrs).map(attr=>(
            <div key={attr} style={{display:"flex",justifyContent:"space-between",padding:"4px 8px",background:"#0a0a14",borderRadius:6}}>
              <span style={{fontSize:10,color:T.muted}}>{ATTR_NOMES[attr]}</span>
              <span style={{fontSize:11,color:T.gold,fontWeight:700}}>{getAttrTotal(h,attr)}</span>
            </div>
          ))}
        </div>
        <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap",fontSize:10}}>
          <span style={{color:T.orange}}>⚔️ +{getDanoBonus(h)} dano</span>
          <span style={{color:T.blue}}>🛡️ +{getDefesaBonus(h)} def</span>
          <span style={{color:T.purple}}>🌀 Parry {Math.round((h.parryChance||0.05)*100)}%</span>
        </div>
      </div>
    </div>
  </div>;
}

// ── FERREIRO ──────────────────────────────────────────────
function FerreiroModal({user,onFechar,onUpdate}){
  const [aba,setAba]=useState("receitas");
  const [matLivres,setMatLivres]=useState([]);
  const [forjando,setForjando]=useState(false);
  const [resultadoLivre,setResultadoLivre]=useState(null);
  const [msg,setMsg]=useState("");
  const h=user.hero;const inv=h.inventario||[];
  const contarMat=(id)=>inv.filter(x=>x===id).length;
  const temReceita=(r)=>Object.entries(r.materiais).every(([id,qty])=>contarMat(id)>=qty)&&(h.ouro||0)>=r.ouro;

  async function forjarReceita(r){
    if(!temReceita(r)) return;
    let newInv=[...inv];
    Object.entries(r.materiais).forEach(([id,qty])=>{let rm=0;newInv=newInv.filter(x=>{if(x===id&&rm<qty){rm++;return false;}return true;});});
    newInv.push(r.item.id);ITENS_DB[r.item.id]=r.item;
    const newH={...h,inventario:newInv,ouro:(h.ouro||0)-r.ouro};
    const newUser={...user,hero:newH};await saveUser(user.username,newUser);onUpdate(newUser);
    setMsg(`✅ ${r.item.emoji} ${r.item.nome} forjada!`);setTimeout(()=>setMsg(""),3000);
  }

  function toggleMat(id){setMatLivres(p=>p.includes(id)?p.filter(x=>x!==id):p.length<6?[...p,id]:p);}

  async function forjarLivre(){
    if(!matLivres.length||forjando) return;
    setForjando(true);setResultadoLivre(null);
    const lista=matLivres.map(id=>ITENS_DB[id]?.nome||id).join(", ");
    try{
      const txt=await chamarIA(
        `Você é Durk, o ferreiro ranzinza de Varnok no RPG ELARIS. Crie um item único baseado nos materiais. Responda SOMENTE com JSON: {"nome":"","emoji":"","tipo":"arma|armadura|artefato","desc":"","efeito":{"dano":0,"RES":0,"AGI":0,"FOR":0,"ENE":0,"CTR":0,"defesa":0},"fala":"frase ranzinza do Durk","valor":50}`,
        `Materiais: ${lista}`, 600
      );
      let item={};try{item=JSON.parse(txt.replace(/```json|```/g,"").trim());}catch(e){}
      if(item.nome){
        const itemId=`forjado_${Date.now()}`;const novoItem={...item,id:itemId};
        ITENS_DB[itemId]=novoItem;
        let newInv=[...inv];matLivres.forEach(id=>{const idx=newInv.indexOf(id);if(idx>=0)newInv.splice(idx,1);});
        newInv.push(itemId);
        const newUser={...user,hero:{...h,inventario:newInv}};
        await saveUser(user.username,newUser);onUpdate(newUser);
        setResultadoLivre({...novoItem,id:itemId});setMatLivres([]);
      }
    }catch(e){setMsg("Durk não conseguiu. Tente outros materiais.");}
    setForjando(false);
  }

  const matsNoInv=[...new Set(inv.filter(id=>ITENS_DB[id]?.tipo==="material"))];
  return <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(4,4,8,0.97)",overflowY:"auto",padding:14}}>
    <div style={{maxWidth:460,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div><div style={{fontSize:15,color:T.gold,fontWeight:700}}>⚒️ FERREIRO DURK</div><div style={{fontSize:10,color:T.muted,fontStyle:"italic"}}>"Traga materiais. Eu faço o resto. Ou não."</div></div>
        <button onClick={onFechar} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>✕</button>
      </div>
      {msg&&<div style={{background:`${T.green}15`,border:`1px solid ${T.green}44`,borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:T.green}}>{msg}</div>}
      <div style={{display:"flex",gap:4,marginBottom:14,background:T.surface,borderRadius:9,padding:4,border:`1px solid ${T.border}`}}>
        {[["receitas","📋 Receitas"],["livre","🔥 Forja Livre"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setAba(id)} style={{flex:1,padding:"7px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:12,background:aba===id?T.gold:"transparent",color:aba===id?"#07070c":T.muted,fontWeight:aba===id?700:400}}>{lbl}</button>
        ))}
      </div>
      {aba==="receitas"&&<>
        <div style={{fontSize:10,color:T.muted,marginBottom:10}}>💰 {h.ouro} ouros disponíveis</div>
        {RECEITAS.map(r=>{
          const pode=temReceita(r);
          return <div key={r.id} style={{background:T.surface,border:`1px solid ${pode?T.gold+"44":T.border}`,borderRadius:12,padding:14,marginBottom:10,opacity:pode?1:0.7}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <div style={{fontSize:13,color:pode?T.gold:T.muted,fontWeight:700}}>{r.emoji} {r.nome}</div>
              <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:r.tipo==="arma"?`${T.orange}22`:`${T.blue}22`,color:r.tipo==="arma"?T.orange:T.blue}}>{r.tipo}</span>
            </div>
            <div style={{fontSize:11,color:T.muted,marginBottom:8,fontStyle:"italic"}}>{r.desc}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
              {Object.entries(r.materiais).map(([id,qty])=>{
                const tem=contarMat(id);const ok=tem>=qty;
                return <span key={id} style={{fontSize:9,padding:"2px 7px",borderRadius:5,background:ok?`${T.green}15`:`${T.red}15`,border:`1px solid ${ok?T.green:T.red}44`,color:ok?T.green:T.red}}>{ITENS_DB[id]?.emoji||"📦"} {ITENS_DB[id]?.nome||id} {tem}/{qty}</span>;
              })}
              <span style={{fontSize:9,padding:"2px 7px",borderRadius:5,background:`${T.gold}15`,border:`1px solid ${T.gold}44`,color:T.gold}}>💰 {r.ouro}</span>
            </div>
            <button onClick={()=>forjarReceita(r)} disabled={!pode} style={{width:"100%",padding:"9px",background:pode?"#1a1a0a":"#111",border:`1px solid ${pode?T.gold:"#222"}`,borderRadius:9,color:pode?T.gold:"#333",fontSize:12,cursor:pode?"pointer":"default",fontFamily:"Georgia,serif",fontWeight:700}}>
              {pode?"⚒️ Forjar":"❌ Materiais insuficientes"}
            </button>
          </div>;
        })}
      </>}
      {aba==="livre"&&<>
        <div style={{background:"#0a0a0e",border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",marginBottom:12}}>
          <div style={{fontSize:11,color:T.gold,marginBottom:4}}>Como funciona</div>
          <div style={{fontSize:10,color:T.muted,lineHeight:1.6}}>Selecione até 6 materiais. Durk cria algo único baseado neles. Resultado imprevisível.</div>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:7}}>SELECIONADOS ({matLivres.length}/6)</div>
          {matLivres.length===0?<div style={{fontSize:11,color:T.muted,fontStyle:"italic",textAlign:"center",padding:10}}>Selecione materiais abaixo</div>
            :<div style={{display:"flex",flexWrap:"wrap",gap:5}}>{matLivres.map((id,i)=><span key={i} onClick={()=>toggleMat(id)} style={{fontSize:10,padding:"3px 9px",borderRadius:6,background:`${T.gold}15`,border:`1px solid ${T.gold}44`,color:T.gold,cursor:"pointer"}}>{ITENS_DB[id]?.emoji} {ITENS_DB[id]?.nome} ✕</span>)}</div>}
        </div>
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:12,marginBottom:12}}>
          <div style={{fontSize:10,color:T.muted,letterSpacing:2,marginBottom:8}}>SEUS MATERIAIS</div>
          {matsNoInv.length===0?<div style={{fontSize:11,color:T.muted,fontStyle:"italic"}}>Nenhum material. Derrote inimigos!</div>
            :<div style={{display:"flex",flexDirection:"column",gap:5}}>
              {matsNoInv.map(id=>{
                const item=ITENS_DB[id];if(!item)return null;
                const qtd=contarMat(id);const sel=matLivres.includes(id);
                return <div key={id} onClick={()=>toggleMat(id)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:sel?`${T.gold}10`:"#0a0a14",border:`1px solid ${sel?T.gold+"44":T.border}`,borderRadius:8,cursor:"pointer",transition:"all 0.2s"}}>
                  <span style={{fontSize:18}}>{item.emoji}</span>
                  <div style={{flex:1}}><div style={{fontSize:11,color:sel?T.gold:T.text,fontWeight:sel?600:400}}>{item.nome}</div><div style={{fontSize:9,color:T.muted}}>{item.desc}</div></div>
                  <span style={{fontSize:10,color:T.muted}}>x{qtd}</span>
                  {sel&&<span style={{fontSize:10,color:T.gold}}>✓</span>}
                </div>;
              })}
            </div>}
        </div>
        <button onClick={forjarLivre} disabled={!matLivres.length||forjando}
          style={{width:"100%",padding:"12px",background:matLivres.length&&!forjando?"#1a1205":"#111",border:`1px solid ${matLivres.length&&!forjando?T.gold:"#222"}`,borderRadius:10,color:matLivres.length&&!forjando?T.gold:"#333",fontSize:13,cursor:matLivres.length&&!forjando?"pointer":"default",fontFamily:"Georgia,serif",fontWeight:700}}>
          {forjando?"⏳ Durk está forjando...":"⚒️ FORJAR"}
        </button>
        {resultadoLivre&&<div style={{marginTop:12,background:`${T.gold}10`,border:`1px solid ${T.gold}44`,borderRadius:12,padding:14}}>
          <div style={{fontSize:10,color:T.goldDim,letterSpacing:2,marginBottom:6}}>✨ ITEM CRIADO</div>
          <div style={{fontSize:16,color:T.gold,fontWeight:700,marginBottom:4}}>{resultadoLivre.emoji} {resultadoLivre.nome}</div>
          <div style={{fontSize:11,color:T.text,marginBottom:6,fontStyle:"italic"}}>{resultadoLivre.desc}</div>
          {resultadoLivre.fala&&<div style={{fontSize:10,color:T.muted,fontStyle:"italic",borderLeft:`2px solid ${T.goldDim}`,paddingLeft:8}}>Durk: "{resultadoLivre.fala}"</div>}
          <div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}>
            {Object.entries(resultadoLivre.efeito||{}).filter(([,v])=>v>0).map(([k,v])=>(
              <span key={k} style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:`${T.green}15`,border:`1px solid ${T.green}44`,color:T.green}}>+{v} {k}</span>
            ))}
          </div>
        </div>}
      </>}
    </div>
  </div>;
}

// ── MAPA ──────────────────────────────────────────────────
function MapaModal({hero,onViajar,onFechar}){
  const [hover,setHover]=useState(null);
  return <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(4,4,8,0.96)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:14}}>
    <div style={{width:"100%",maxWidth:480}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:15,color:T.gold,fontWeight:700}}>🗺️ MAPA DE ELARIS</div>
        <button onClick={onFechar} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>✕</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {Object.values(REGIOES).map(r=>{
          const aqui=hero.regiao===r.id;
          const bloqueada=r.rankMinimo&&RANKS.indexOf(hero.rank)<RANKS.indexOf(r.rankMinimo);
          const boss=(INIMIGOS_POR_AREA[r.id]||[]).find(e=>e.tipo==="boss");
          return <div key={r.id} onClick={()=>!bloqueada&&!aqui&&onViajar(r.id)}
            onMouseEnter={()=>setHover(r.id)} onMouseLeave={()=>setHover(null)}
            style={{borderRadius:11,padding:11,cursor:bloqueada||aqui?"default":"pointer",border:`1px solid ${aqui?r.cor+"88":hover===r.id&&!bloqueada?r.cor+"44":T.border}`,background:aqui?`${r.cor}15`:T.surface,opacity:bloqueada?0.4:1,transition:"all 0.2s"}}>
            <div style={{fontSize:18,marginBottom:3}}>{r.emoji}</div>
            <div style={{fontSize:11,color:aqui?r.cor:T.text,fontWeight:700}}>{r.nome}</div>
            <div style={{fontSize:9,color:T.muted,marginTop:2}}>{r.desc}</div>
            <div style={{marginTop:5,display:"flex",gap:4,flexWrap:"wrap"}}>
              <span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:r.perigo==="Seguro"?T.green+"22":r.perigo==="Médio"?T.orange+"22":r.perigo==="Alto"?T.red+"22":"#a78bfa22",color:r.perigo==="Seguro"?T.green:r.perigo==="Médio"?T.orange:r.perigo==="Alto"?T.red:T.purple}}>{r.perigo}</span>
              {boss&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:`${T.purple}22`,color:T.purple}}>👑 Boss</span>}
            </div>
            {aqui&&<div style={{fontSize:9,color:r.cor,marginTop:3}}>📍 Você está aqui</div>}
            {bloqueada&&<div style={{fontSize:9,color:T.muted,marginTop:3}}>🔒 {r.rankMinimo}</div>}
          </div>;
        })}
      </div>
    </div>
  </div>;
}

// ── GRUPO ─────────────────────────────────────────────────
function GrupoModal({user,onFechar,onSave}){
  const [busca,setBusca]=useState("");const [resultado,setResultado]=useState(null);
  const [buscando,setBuscando]=useState(false);const [erro,setErro]=useState("");const [grupo,setGrupo]=useState(null);
  useEffect(()=>{if(user.grupo)loadGroup(user.grupo).then(g=>{if(g)setGrupo(g);});},[user.grupo]);
  async function buscar(){if(!busca.trim())return;setBuscando(true);setErro("");setResultado(null);const u=await loadUser(busca.trim());if(!u)setErro("Não encontrado.");else if(u.username===user.username)setErro("Você não pode se adicionar.");else setResultado(u);setBuscando(false);}
  async function convidar(){if(!resultado)return;const gid=`${[user.username,resultado.username].sort().join("-")}`.toLowerCase();const g={id:gid,members:[user.username,resultado.username],historiaCapitulo:0,historiaEscolhas:{},updatedAt:Date.now()};await saveGroup(gid,g);const u1={...user,grupo:gid};await saveUser(user.username,u1);const u2={...resultado,grupo:gid};await saveUser(resultado.username,u2);setGrupo(g);onSave(u1);setResultado(null);setBusca("");}
  async function sair(){const u={...user,grupo:null};await saveUser(user.username,u);setGrupo(null);onSave(u);}
  return <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(4,4,8,0.96)",display:"flex",alignItems:"center",justifyContent:"center",padding:14}}>
    <div style={{width:"100%",maxWidth:380,background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:14,color:T.gold,fontWeight:700}}>👥 GRUPO</div><button onClick={onFechar} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,padding:"3px 9px",cursor:"pointer"}}>✕</button></div>
      {grupo?<>
        {grupo.members.map(m=><div key={m} style={{background:"#0a0a14",border:`1px solid ${m===user.username?T.gold+"44":T.border}`,borderRadius:8,padding:"8px 11px",marginBottom:6,fontSize:12,color:m===user.username?T.gold:T.text,fontWeight:600}}>⚔️ {m}{m===user.username&&" (você)"}</div>)}
        <button onClick={sair} style={{width:"100%",marginTop:8,padding:"8px",background:"#1a0808",border:`1px solid ${T.red}44`,borderRadius:8,color:T.red,fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif"}}>Sair do Grupo</button>
      </>:<>
        <div style={{display:"flex",gap:6,marginBottom:9}}><input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Nome do jogador..." onKeyDown={e=>e.key==="Enter"&&buscar()} style={{flex:1,background:"#0a0a14",border:`1px solid ${T.border}`,borderRadius:7,color:T.text,fontFamily:"Georgia,serif",fontSize:13,padding:"8px 10px",outline:"none"}}/><button onClick={buscar} disabled={buscando} style={{background:T.gold,border:"none",borderRadius:7,color:"#07070c",fontWeight:700,fontSize:12,padding:"8px 11px",cursor:"pointer"}}>🔍</button></div>
        {erro&&<div style={{fontSize:11,color:T.red,marginBottom:7}}>{erro}</div>}
        {resultado&&<div style={{background:"#0a0a14",border:`1px solid ${T.green}44`,borderRadius:8,padding:"10px 12px",marginBottom:8}}>
          <div style={{fontSize:12,color:T.green,fontWeight:600}}>✅ {resultado.username}</div>
          <button onClick={convidar} style={{marginTop:6,width:"100%",padding:"6px",background:"#0a1a0a",border:`1px solid ${T.green}`,borderRadius:7,color:T.green,fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif"}}>Convidar</button>
        </div>}
      </>}
    </div>
  </div>;
}

// ── AUTH ──────────────────────────────────────────────────
function AuthScreen({onLogin}){
  const [modo,setModo]=useState("login");const [username,setUsername]=useState("");const [password,setPassword]=useState("");
  const [heroId,setHeroId]=useState(null);const [erro,setErro]=useState("");const [loading,setLoading]=useState(false);const [hover,setHover]=useState(null);
  async function handleLogin(){if(!username.trim()||!password.trim())return setErro("Preencha tudo.");setLoading(true);setErro("");const u=await loadUser(username.trim());if(!u){setErro("Usuário não encontrado.");setLoading(false);return;}if(u.password!==password){setErro("Senha incorreta.");setLoading(false);return;}u.lastSeen=Date.now();await saveUser(username.trim(),u);onLogin(u);setLoading(false);}
  async function handleRegistro(){if(!username.trim()||!password.trim()||!heroId)return setErro("Preencha tudo e escolha personagem.");if(username.trim().length<3)return setErro("Nome muito curto.");setLoading(true);setErro("");const existe=await loadUser(username.trim());if(existe){setErro("Nome já em uso.");setLoading(false);return;}const u=makeUser(username.trim(),password,heroId);await saveUser(username.trim(),u);onLogin(u);setLoading(false);}
  return <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 16px"}}>
    <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:36,color:T.gold,fontWeight:700,letterSpacing:6,textShadow:`0 0 40px ${T.gold}44`}}>ELARIS</div><div style={{fontSize:11,color:T.goldDim,letterSpacing:4,marginTop:6}}>MUNDO ABERTO · MULTIPLAYER</div></div>
    <div style={{display:"flex",gap:4,marginBottom:16,background:T.surface,borderRadius:10,padding:4,border:`1px solid ${T.border}`}}>
      {["login","registro"].map(m=><button key={m} onClick={()=>{setModo(m);setErro("");setHeroId(null);}} style={{padding:"7px 16px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:12,background:modo===m?T.gold:"transparent",color:modo===m?"#07070c":T.muted,fontWeight:modo===m?700:400}}>{m==="login"?"ENTRAR":"CRIAR CONTA"}</button>)}
    </div>
    <div style={{width:"100%",maxWidth:340,display:"flex",flexDirection:"column",gap:8}}>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Nome de aventureiro" maxLength={20} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontFamily:"Georgia,serif",fontSize:14,padding:"10px 12px",outline:"none",boxSizing:"border-box",width:"100%"}}/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" type="password" style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontFamily:"Georgia,serif",fontSize:14,padding:"10px 12px",outline:"none",boxSizing:"border-box",width:"100%"}}/>
      {modo==="registro"&&Object.values(HEROES_TEMPLATE).map(p=><div key={p.id} onClick={()=>setHeroId(p.id)} onMouseEnter={()=>setHover(p.id)} onMouseLeave={()=>setHover(null)} style={{borderRadius:11,overflow:"hidden",cursor:"pointer",border:`1px solid ${heroId===p.id?p.cor+"88":hover===p.id?p.cor+"44":T.border}`,background:heroId===p.id?`${p.cor}15`:T.surface,transition:"all 0.2s"}}><div style={{display:"flex"}}><div style={{width:4,background:`linear-gradient(180deg,${p.cor},${p.corDim})`,flexShrink:0}}/><div style={{padding:"10px 12px",flex:1}}><div style={{fontSize:13,color:heroId===p.id?p.cor:T.text,fontWeight:700}}>{p.emoji} {p.nome}</div><div style={{fontSize:10,color:T.muted,marginTop:1}}>{p.classe} · Parry {Math.round(p.parryChance*100)}%</div></div></div></div>)}
      {erro&&<div style={{fontSize:11,color:T.red,textAlign:"center"}}>{erro}</div>}
      <button onClick={modo==="login"?handleLogin:handleRegistro} disabled={loading} style={{background:`linear-gradient(135deg,${T.gold},${T.goldDim})`,border:"none",borderRadius:10,color:"#07070c",fontWeight:700,fontSize:14,padding:"12px",cursor:"pointer",fontFamily:"Georgia,serif"}}>{loading?"⏳...":modo==="login"?"⚔️ ENTRAR":"⚔️ CRIAR CONTA"}</button>
    </div>
  </div>;
}

// ── GAME SCREEN ───────────────────────────────────────────
function GameScreen({user,onUpdate,onLogout}){
  const [batalhaAtiva,setBatalhaAtiva]=useState(null);
  const [tab,setTab]=useState("mundo");
  const [showMapa,setShowMapa]=useState(false);const [showGrupo,setShowGrupo]=useState(false);
  const [showInv,setShowInv]=useState(false);const [showFerreiro,setShowFerreiro]=useState(false);
  const [narracao,setNarracao]=useState(user.narracao||"");
  const [acao,setAcao]=useState("");const [dado,setDado]=useState(null);
  const [diceVal,setDiceVal]=useState(null);const [showDice,setShowDice]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[narracao]);

  useEffect(()=>{
    const regiao=user.hero.regiao;
    if(regiao==="varnok"||batalhaAtiva) return;
    const chance=regiao==="ruinas"?0.7:regiao==="deserto"||regiao==="vale"||regiao==="cordilheira"?0.55:0.4;
    if(Math.random()<chance){const mob=sortearInimigo(regiao,false);if(mob)setTimeout(()=>setBatalhaAtiva(mob),1200);}
  },[user.hero.regiao]);

  const h=user.hero;const regiao=REGIOES[h.regiao]||REGIOES.varnok;const emVarnok=h.regiao==="varnok";
  const dadoColor=!dado?"#666":dado<=5?T.red:dado<=10?T.orange:dado<=15?T.gold:dado<20?T.green:T.purple;
  const dadoLabel=!dado?"":dado<=5?"Falha crítica!":dado<=10?"Ruim":dado<=15?"Normal":dado<20?"Muito bom!":"CRÍTICO! 🔥";

  function rollDice(){const v=Math.ceil(Math.random()*20);setDiceVal(v);setShowDice(true);}
  function closeDice(){if(diceVal)setDado(diceVal);setShowDice(false);}

  async function viajar(rId){
    const newH={...h,regiao:rId};const newUser={...user,hero:newH,narracao:`Você chegou em ${REGIOES[rId].emoji} ${REGIOES[rId].nome}.`};
    await saveUser(user.username,newUser);onUpdate(newUser);setNarracao(newUser.narracao);setShowMapa(false);setBatalhaAtiva(null);
  }

  function iniciarBoss(){const boss=sortearInimigo(h.regiao,true);if(boss)setBatalhaAtiva(boss);else setNarracao("Nenhum boss nesta região.");}

  async function confirmar(){
    if(!acao.trim()||submitting) return;
    setSubmitting(true);
    const sys=`Você é o Mestre do RPG ELARIS. Interprete QUALQUER ação em português — combate, conversa, exploração, compra, descanso, besteira. NUNCA recuse. Sempre narre algo interessante.

MUNDO: Elaris pós-Fratura. Monstros, Essência, poderes, facções (Ordem de Ferro, Filhos da Fratura, Guilda).
REGIÃO: ${regiao.emoji} ${regiao.nome} — ${regiao.desc}
PERSONAGEM: ${h.nome} (${h.classe} Nv.${h.nivel||1}) HP:${h.hp}/${h.maxHp} EN:${h.en}/${h.maxEn} Ouro:${h.ouro} Rank:${RANK_EMOJI[h.rank]}
${emVarnok?`VARNOK — NPCs: Maren(Guilda,sabe tudo,cobra por info), Durk(Ferreiro,ranzinza), Taverna do Osso(rumores,bebidas), Templo Abandonado(mistério,deuses)`:``}
${dado?`DADO d20: ${dado} (${dadoLabel})`:""} 
EQUIPAMENTOS: Arma:${h.equipamentos?.arma?ITENS_DB[h.equipamentos.arma]?.nome||"nenhuma":"nenhuma"}
HISTÓRICO: ${(user.log||[]).slice(0,3).join(" | ")||"início da aventura"}

Responda SOMENTE com JSON:
{"narracao":"2-4 parágrafos imersivos","ganhouOuro":0,"perdeuOuro":0,"curaHeroi":0,"danoHeroi":0,"custoEnergia":0,"rankPts":0,"iniciouCombate":false}`;
    try{
      const txt=await chamarIA(sys,acao,1000);
      let result={};try{result=JSON.parse(txt.replace(/```json|```/g,"").trim());}catch(e){result={narracao:txt};}
      const narr=result.narracao||"O Mestre observa.";
      setNarracao(narr);
      let newH={...h};let newLog=[...(user.log||[])];
      if(result.ganhouOuro>0){newH={...newH,ouro:(newH.ouro||0)+result.ganhouOuro};newLog=[`💰 +${result.ganhouOuro} ouros`,...newLog.slice(0,29)];}
      if(result.perdeuOuro>0){newH={...newH,ouro:Math.max(0,(newH.ouro||0)-result.perdeuOuro)};newLog=[`💸 -${result.perdeuOuro} ouros`,...newLog.slice(0,29)];}
      if(result.curaHeroi>0){newH={...newH,hp:Math.min(newH.maxHp,newH.hp+result.curaHeroi)};newLog=[`💚 +${result.curaHeroi}❤️ curado`,...newLog.slice(0,29)];}
      if(result.danoHeroi>0){newH={...newH,hp:Math.max(0,newH.hp-result.danoHeroi)};newLog=[`💔 -${result.danoHeroi}❤️`,...newLog.slice(0,29)];}
      if(result.custoEnergia>0) newH={...newH,en:Math.max(0,newH.en-result.custoEnergia)};
      if(result.rankPts>0){let rpts=(newH.rankPts||0)+result.rankPts;let rank=newH.rank;if(rpts>=(RANK_PTS[rank]||5)&&RANKS.indexOf(rank)<RANKS.length-1){rank=RANKS[RANKS.indexOf(rank)+1];rpts=0;newLog=[`🎉 Subiu para ${RANK_EMOJI[rank]}!`,...newLog.slice(0,29)];}newH={...newH,rank,rankPts:rpts};}
      if(result.iniciouCombate&&!emVarnok){const mob=sortearInimigo(h.regiao,false);if(mob)setTimeout(()=>setBatalhaAtiva(mob),1500);}
      const newUser={...user,hero:newH,log:newLog,narracao:narr,lastSeen:Date.now()};
      await saveUser(user.username,newUser);onUpdate(newUser);setAcao("");setDado(null);
    }catch(e){setNarracao("O Mestre hesita. Tente novamente.");}
    setSubmitting(false);
  }

  if(batalhaAtiva) return <BatalhaScreen user={user} inimigo={batalhaAtiva} onUpdate={u=>{onUpdate(u);}} onFim={(vitoria)=>{setBatalhaAtiva(null);if(!vitoria){const newH={...user.hero,regiao:"varnok"};const u={...user,hero:newH};onUpdate(u);saveUser(user.username,u);}}}/>;

  const tabs=[{id:"mundo",label:"🌍"},{id:"ficha",label:"📋"},{id:"log",label:"📜"}];
  return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Georgia,serif"}}>
    {showDice&&diceVal&&<DiceOverlay value={diceVal} onClose={closeDice}/>}
    {showMapa&&<MapaModal hero={h} onViajar={viajar} onFechar={()=>setShowMapa(false)}/>}
    {showGrupo&&<GrupoModal user={user} onFechar={()=>setShowGrupo(false)} onSave={u=>{onUpdate(u);setShowGrupo(false);}}/>}
    {showInv&&<InventarioModal user={user} onFechar={()=>setShowInv(false)} onUpdate={u=>{onUpdate(u);}}/>}
    {showFerreiro&&<FerreiroModal user={user} onFechar={()=>setShowFerreiro(false)} onUpdate={u=>{onUpdate(u);}}/>}

    <div style={{borderBottom:`1px solid ${T.border}`,padding:"8px 12px",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
      <div style={{fontSize:14,color:T.gold,fontWeight:700,letterSpacing:3}}>⚔️ ELARIS</div>
      <div style={{display:"flex",gap:3}}>{tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?"#1e1e28":"transparent",border:tab===t.id?`1px solid ${T.border}`:"1px solid transparent",color:tab===t.id?T.gold:T.muted,borderRadius:6,padding:"4px 9px",fontSize:14,cursor:"pointer"}}>{t.label}</button>)}</div>
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5}}>
        <span style={{fontSize:9,color:h.cor}}>{h.emoji} Nv.{h.nivel||1}</span>
        <span style={{fontSize:9,color:T.gold}}>💰{h.ouro}</span>
        <button onClick={onLogout} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:5,padding:"2px 7px",fontSize:9,cursor:"pointer"}}>Sair</button>
      </div>
    </div>

    {tab==="mundo"&&<div style={{display:"flex",height:"calc(100vh - 46px)"}}>
      <div style={{width:165,borderRight:`1px solid ${T.border}`,padding:8,overflowY:"auto",flexShrink:0}}>
        <div style={{background:`${regiao.cor}10`,border:`1px solid ${regiao.cor}33`,borderRadius:8,padding:"7px 9px",marginBottom:8}}>
          <div style={{fontSize:10,color:regiao.cor,fontWeight:700}}>{regiao.emoji} {regiao.nome}</div>
          <div style={{fontSize:8,color:T.muted}}>⚠️ {regiao.perigo}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:8}}>
          <button onClick={()=>setShowMapa(true)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,color:T.gold,fontSize:10,padding:"5px",cursor:"pointer",fontFamily:"inherit"}}>🗺️ Mapa</button>
          <button onClick={()=>setShowGrupo(true)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,color:T.blue,fontSize:10,padding:"5px",cursor:"pointer",fontFamily:"inherit"}}>👥 Grupo{user.grupo?" ✓":""}</button>
          <button onClick={()=>setShowInv(true)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,color:T.purple,fontSize:10,padding:"5px",cursor:"pointer",fontFamily:"inherit"}}>🎒 Inventário{(h.pontosStatus||0)>0?" 🔴":""}</button>
          {emVarnok&&<button onClick={()=>setShowFerreiro(true)} style={{background:T.surface,border:`1px solid ${T.orange}44`,borderRadius:6,color:T.orange,fontSize:10,padding:"5px",cursor:"pointer",fontFamily:"inherit"}}>⚒️ Ferreiro</button>}
          {!emVarnok&&<button onClick={iniciarBoss} style={{background:"#0f0606",border:`1px solid ${T.red}44`,borderRadius:6,color:T.red,fontSize:10,padding:"5px",cursor:"pointer",fontFamily:"inherit"}}>👑 Enfrentar Boss</button>}
        </div>
        <div style={{background:T.surface,border:`1px solid ${h.cor}22`,borderRadius:8,padding:"8px 9px"}}>
          <div style={{fontSize:10,color:h.cor,fontWeight:600,marginBottom:5}}>{h.emoji} Nv.{h.nivel||1}</div>
          <div style={{marginBottom:4}}><div style={{fontSize:7,color:T.muted,marginBottom:1}}>HP</div><PipRow val={h.hp} max={Math.min(h.maxHp,10)} color={T.red} size={6}/></div>
          <div style={{marginBottom:4}}><div style={{fontSize:7,color:T.muted,marginBottom:1}}>EN</div><PipRow val={h.en} max={Math.min(h.maxEn,10)} color={T.blue} size={6}/></div>
          <RankBar rank={h.rank} pts={h.rankPts||0}/>
          <div style={{marginTop:4}}><ExpBar exp={h.exp||0} proxLevel={h.expProxLevel||100}/></div>
          {(h.pontosStatus||0)>0&&<div style={{fontSize:8,color:T.purple,marginTop:4}}>✨ {h.pontosStatus} pontos!</div>}
        </div>
        {!emVarnok&&<div style={{marginTop:8}}>
          <div style={{fontSize:8,color:T.muted,letterSpacing:2,marginBottom:5}}>INIMIGOS DA ÁREA</div>
          {(INIMIGOS_POR_AREA[h.regiao]||[]).slice(0,4).map(e=><div key={e.id} style={{fontSize:9,color:e.tipo==="boss"?T.purple:e.tipo==="elite"?T.orange:T.muted,marginBottom:2}}>{e.emoji} {e.nome}</div>)}
        </div>}
      </div>

      <div style={{flex:1,padding:"14px 16px",overflowY:"auto"}}>
        <div style={{fontSize:16,color:T.gold,fontWeight:700,marginBottom:2}}>{regiao.emoji} {regiao.nome}</div>
        <div style={{fontSize:10,color:T.muted,marginBottom:10}}>{regiao.desc}</div>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${T.border},transparent)`,marginBottom:10}}/>
        <div style={{fontSize:11,color:h.cor,fontWeight:700,marginBottom:7}}>{h.emoji} {h.nome} — o que você faz?</div>
        <textarea value={acao} onChange={e=>setAcao(e.target.value)}
          placeholder={emVarnok?"Fale com Maren, Durk, vá à taverna, compre, descanse...":"Explore, ataque, fale, observe, faça qualquer coisa..."}
          style={{width:"100%",minHeight:70,background:T.surface,border:`1px solid ${T.border}`,borderRadius:9,color:T.text,fontFamily:"Georgia,serif",fontSize:12,padding:9,resize:"vertical",outline:"none",boxSizing:"border-box",marginBottom:7}}/>
        <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:7,marginBottom:8}}>
          <button onClick={rollDice} disabled={submitting} style={{background:T.gold,border:"none",borderRadius:7,color:"#07070c",fontWeight:700,fontSize:12,padding:"7px 13px",cursor:"pointer",fontFamily:"inherit"}}>🎲 d20</button>
          <button onClick={confirmar} disabled={!acao.trim()||submitting}
            style={{background:acao.trim()&&!submitting?"#1a2e1a":"#111",border:`1px solid ${acao.trim()&&!submitting?T.green:"#222"}`,color:acao.trim()&&!submitting?T.green:"#333",borderRadius:7,fontWeight:700,fontSize:12,padding:"7px 13px",cursor:acao.trim()&&!submitting?"pointer":"default",fontFamily:"inherit"}}>
            {submitting?"⏳":"✅ Confirmar"}
          </button>
          {dado&&<div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:24,color:dadoColor,fontWeight:700}}>{dado}</span><span style={{fontSize:10,color:dadoColor}}>{dadoLabel}</span></div>}
        </div>
        {narracao&&<div style={{background:"#0a0a12",border:`1px solid ${T.gold}33`,borderRadius:10,padding:"10px 13px"}}>
          <div style={{fontSize:8,color:T.goldDim,letterSpacing:3,marginBottom:6}}>⚔️ O MESTRE NARRA</div>
          {narracao.split("\n\n").map((p,i)=><p key={i} style={{color:T.text,lineHeight:1.85,fontSize:12,margin:"0 0 6px"}}>{p}</p>)}
        </div>}
        <div ref={bottomRef}/>
      </div>
    </div>}

    {tab==="ficha"&&<div style={{padding:12,maxWidth:360,margin:"0 auto"}}>
      <div style={{background:T.surface,border:`1px solid ${h.cor}33`,borderRadius:12,padding:14}}>
        <div style={{fontSize:15,color:h.cor,fontWeight:700,marginBottom:2}}>{h.emoji} {h.nome}</div>
        <div style={{fontSize:10,color:T.muted,marginBottom:10}}>{h.classe} · Nível {h.nivel||1} · Parry {Math.round((h.parryChance||0.05)*100)}%</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
          {[["❤️ HP",h.hp,h.maxHp,T.red],["🔵 EN",h.en,h.maxEn,T.blue]].map(([lbl,v,mx,col])=>(
            <div key={lbl} style={{padding:"7px",background:"#0a0a14",borderRadius:7,border:`1px solid ${col}22`}}>
              <div style={{fontSize:9,color:T.muted,marginBottom:3}}>{lbl} {v}/{mx}</div>
              <PipRow val={Math.min(v,10)} max={Math.min(mx,10)} color={col} size={7}/>
            </div>
          ))}
        </div>
        {Object.keys(h.attrs).map(attr=>(
          <div key={attr} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
            <span style={{fontSize:9,color:T.muted,width:54,flexShrink:0}}>{ATTR_NOMES[attr]}</span>
            <div style={{flex:1,height:3,background:"#111",borderRadius:2}}><div style={{width:`${Math.min(100,getAttrTotal(h,attr)*10)}%`,height:"100%",background:h.cor}}/></div>
            <span style={{fontSize:10,color:T.gold,width:18,textAlign:"right"}}>{getAttrTotal(h,attr)}</span>
          </div>
        ))}
        <div style={{marginTop:8}}><RankBar rank={h.rank} pts={h.rankPts||0}/></div>
        <div style={{marginTop:6}}><ExpBar exp={h.exp||0} proxLevel={h.expProxLevel||100}/></div>
        <div style={{marginTop:8,display:"flex",gap:10,flexWrap:"wrap",fontSize:10}}>
          <span style={{color:T.gold}}>💰 {h.ouro}</span>
          <span style={{color:T.orange}}>⚔️ +{getDanoBonus(h)} dano</span>
          <span style={{color:T.blue}}>🛡️ +{getDefesaBonus(h)} def</span>
          {(h.pontosStatus||0)>0&&<span style={{color:T.purple}}>✨ {h.pontosStatus} pts</span>}
        </div>
      </div>
    </div>}

    {tab==="log"&&<div style={{padding:12,maxWidth:440,margin:"0 auto"}}>
      <div style={{fontSize:11,color:T.gold,fontWeight:700,letterSpacing:2,marginBottom:9}}>📜 LOG</div>
      {(!user.log||user.log.length===0)&&<div style={{color:T.muted,fontStyle:"italic",fontSize:12}}>Nenhuma ação registrada.</div>}
      {(user.log||[]).map((e,i)=><div key={i} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"6px 10px",marginBottom:5,color:T.text,fontSize:11}}>{e}</div>)}
    </div>}
  </div>;
}

export default function App(){
  const [user,setUser]=useState(null);
  return !user?<AuthScreen onLogin={setUser}/>:<GameScreen user={user} onUpdate={setUser} onLogout={()=>setUser(null)}/>;
}
