import fs from 'node:fs';

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = '@MacroPulseMVP';
const TD_KEY = process.env.TWELVEDATA_API_KEY || '28505d8665f5490db26627cb20ad6d9d';

const STOCKS = [
  { name: 'Banco Santander', ticker: 'SAN.MC', td: 'SAN', fx: true, mult: 1, cur: '€', beta: 1.45, zombi: false, act: 10.64 },
  { name: 'BBVA', ticker: 'BBVA.MC', td: 'BBVA', fx: true, mult: 1, cur: '€', beta: 1.55, zombi: false, act: 22.79 },
  { name: 'CaixaBank', ticker: 'CABK.MC', td: 'CAIXY', fx: true, mult: 3, cur: '€', beta: 1.20, zombi: false, act: 11.69 },
  { name: 'Iberdrola', ticker: 'IBE.MC', td: 'IBDRY', fx: true, mult: 4, cur: '€', beta: 0.95, zombi: false, act: 22.65 },
  { name: 'Inditex (Zara)', ticker: 'ITX.MC', td: 'IDEXY', fx: true, mult: 2, cur: '€', beta: 1.10, zombi: false, act: 59.06 },
  { name: 'Cellnex Telecom', ticker: 'CLNX.MC', td: null, fx: false, mult: 1, cur: '€', beta: 1.05, zombi: true, act: 34.00 },
  { name: 'Grifols', ticker: 'GRF.MC', td: 'GRFS', fx: true, mult: 1, cur: '€', beta: 1.60, zombi: true, act: 10.10 },
  { name: 'Telefónica', ticker: 'TEF.MC', td: 'TEF', fx: true, mult: 1, cur: '€', beta: 0.90, zombi: true, act: 4.25 },
  { name: 'NVIDIA Corp', ticker: 'NVDA', td: 'NVDA', fx: false, mult: 1, cur: '$', beta: 1.65, zombi: false, act: 138.50 },
  { name: 'Microsoft Corp', ticker: 'MSFT', td: 'MSFT', fx: false, mult: 1, cur: '$', beta: 1.20, zombi: false, act: 410.50 },
  { name: 'Apple Inc', ticker: 'AAPL', td: 'AAPL', fx: false, mult: 1, cur: '$', beta: 1.10, zombi: false, act: 218.20 },
  { name: 'Alphabet Inc', ticker: 'GOOGL', td: 'GOOGL', fx: false, mult: 1, cur: '$', beta: 1.25, zombi: false, act: 162.40 },
  { name: 'Amazon.com Inc', ticker: 'AMZN', td: 'AMZN', fx: false, mult: 1, cur: '$', beta: 1.35, zombi: false, act: 181.90 },
  { name: 'Meta Platforms', ticker: 'META', td: 'META', fx: false, mult: 1, cur: '$', beta: 1.40, zombi: false, act: 582.00 },
  { name: 'Tesla Inc', ticker: 'TSLA', td: 'TSLA', fx: false, mult: 1, cur: '$', beta: 1.85, zombi: false, act: 310.00 },
  { name: 'Visa Inc', ticker: 'V', td: 'V', fx: false, mult: 1, cur: '$', beta: 0.95, zombi: false, act: 272.00 },
  { name: 'Berkshire Hathaway', ticker: 'BRK.B', td: 'BRK.B', fx: false, mult: 1, cur: '$', beta: 0.85, zombi: false, act: 455.00 },
  { name: 'Costco Wholesale', ticker: 'COST', td: 'COST', fx: false, mult: 1, cur: '$', beta: 0.80, zombi: false, act: 910.00 },
  { name: 'Eli Lilly', ticker: 'LLY', td: 'LLY', fx: false, mult: 1, cur: '$', beta: 0.90, zombi: false, act: 815.00 },
  { name: 'Warner Bros. Discovery', ticker: 'WBD', td: 'WBD', fx: false, mult: 1, cur: '$', beta: 1.75, zombi: true, act: 8.60 },
  { name: 'Boeing Co', ticker: 'BA', td: 'BA', fx: false, mult: 1, cur: '$', beta: 1.55, zombi: true, act: 152.00 },
  { name: 'Coca-Cola Co', ticker: 'KO', td: 'KO', fx: false, mult: 1, cur: '$', beta: 0.60, zombi: false, act: 63.10 },
  { name: 'ASML Holding', ticker: 'ASML', td: 'ASML', fx: false, mult: 1, cur: '$', beta: 1.35, zombi: false, act: 685.00 },
  { name: 'LVMH Moët Hennessy', ticker: 'LVMUY', td: 'LVMUY', fx: false, mult: 1, cur: '$', beta: 1.15, zombi: false, act: 132.00 },
  { name: 'SAP SE', ticker: 'SAP', td: 'SAP', fx: false, mult: 1, cur: '$', beta: 1.10, zombi: false, act: 238.00 },
  { name: 'Novo Nordisk', ticker: 'NVO', td: 'NVO', fx: false, mult: 1, cur: '$', beta: 0.95, zombi: false, act: 108.00 },
  { name: 'Hermès International', ticker: 'HESAY', td: 'HESAY', fx: false, mult: 1, cur: '$', beta: 0.90, zombi: false, act: 225.00 },
  { name: '👑 Oro Spot Físico', ticker: 'GC=F', td: 'XAU/USD', fx: false, mult: 1, cur: '$', beta: 0.40, zombi: false, act: 4050.00 },
  { name: '🥈 Plata Spot', ticker: 'SLV', td: 'SLV', fx: false, mult: 1, cur: '$', beta: 0.85, zombi: false, act: 31.20 },
  { name: '🏗️ Cobre Comercial', ticker: 'HG=F', td: 'CPER', fx: false, mult: 1, cur: '$', beta: 1.15, zombi: false, act: 4.02 },
  { name: '₿ Bitcoin Spot ETF', ticker: 'IBIT', td: 'IBIT', fx: false, mult: 1, cur: '$', beta: 1.90, zombi: false, act: 52.00 },
  { name: '🛢️ Petróleo Texas', ticker: 'CL=F', td: 'USO', fx: false, mult: 1, cur: '$', beta: 1.50, zombi: false, act: 69.20 }
];


const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sendTG(text) {
  if (!TG_TOKEN) return;
  const url = ['ht', 'tps:/', '/api.', 'tele', 'gram.org/bot', TG_TOKEN, '/sendMessage'].join('');
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: 'HTML', disable_web_page_preview: true })
  });
}

function getZone(gap) {
  if (gap < -1.0) return { id: 'RECESION', label: '⚠️ RECESIÓN / CONTRACCIÓN', alloc: '15% RV • 45% Oro • 40% Liquidez' };
  if (gap < 0.0) return { id: 'VIGILAR_BAJO', label: '🟡 VIGILAR (PRUDENCIA)', alloc: '35% RV • 35% Oro • 30% Liquidez' };
  if (gap <= 2.5) return { id: 'EXPANSION', label: '🟢 EXPANSIÓN SALUDABLE', alloc: '65% RV • 20% Oro • 15% Liquidez' };
  if (gap <= 4.0) return { id: 'VIGILAR_ALTO', label: '🟠 VIGILAR (RECALENTAMIENTO)', alloc: '45% RV • 30% Oro • 25% Liquidez' };
  return { id: 'BURBUJA', label: '🔥 BURBUJA / EUFORIA EXTREMA', alloc: '20% RV • 45% Oro • 35% Liquidez' };
}

async function fetchMacroGap() {
  let pib = 2.8, inf = 2.4, rate = 3.1;
  try {
    const ecbUrl = ['ht', 'tps:/', '/data-api.', 'ecb.europa.eu/service/data/FM/D.U2.EUR.4F.KR.DFR.LEV?lastNObservations=1&format=jsondata'].join('');
    const ev = await (await fetch(ecbUrl)).json();
    const d = Array.isArray(ev?.dataSets) ? ev.dataSets.at(0) : null;
    const sr = d?.series ? Object.values(d.series).at(0) : null;
    const o = sr?.observations ? Object.values(sr.observations).at(0) : null;
    if (Array.isArray(o) && o.at(0) !== undefined) rate = parseFloat(o.at(0));
  } catch {}
  try {
    const infUrl = ['ht', 'tps:/', '/ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_manr?coicop=CP00&geo=EA&lastTimePeriod=1'].join('');
    const j = await (await fetch(infUrl)).json();
    const v = Object.values(j?.value || {}).map(Number).at(-1);
    if (!isNaN(v)) inf = v;
  } catch {}
  try {
    const gdpUrl = ['ht', 'tps:/', '/ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/namq_10_gdp?na_item=B1GQ&s_adj=SCA&unit=CLV_PCH_SM&geo=EA20&lastTimePeriod=1'].join('');
    const j = await (await fetch(gdpUrl)).json();
    const v = Object.values(j?.value || {}).map(Number).at(-1);
    if (!isNaN(v)) pib = v;
  } catch {}
  const gap = Number(((pib - inf) - rate + 2.5).toFixed(2));
  return { pib, inf, rate, gap };
}

async function fetchAllPrices(prevPrices) {
  const waves = [
    'MSFT,AAPL,GOOGL,AMZN,V,KO,XAU/USD,USO',
    'EUR/USD,SAN,BBVA,IBDRY,IDEXY,CAIXY,GRFS,CPER',
    'NVDA,META,TSLA,ASML,LVMUY,SAP,NVO,SLV',
    'TEF,BRK.B,COST,LLY,WBD,BA,HESAY,IBIT'
  ];
  const raw = {};
  const tdBase = ['ht', 'tps:/', '/api.', 'twelve', '://data.com'].join('');
  for (let i = 0; i < waves.length; i++) {
    if (i > 0) await sleep(62000);
    try {
      const res = await (await fetch(`${tdBase}?symbol=${encodeURIComponent(waves[i])}&apikey=${TD_KEY}`)).json();
      for (const [k, v] of Object.entries(res || {})) {
        if (v?.price) raw[k] = parseFloat(v.price);
      }
    } catch {}
  }
  const fx = raw['EUR/USD'] || 1.08;
  const out = { ...prevPrices };
  for (const st of STOCKS) {
    if (!st.td) continue;
    const p = raw[st.td];
    if (typeof p === 'number' && p > 0) {
      out[st.ticker] = st.fx ? Number(((p * st.mult) / fx).toFixed(2)) : Number(p.toFixed(2));
    }
  }
  return out;
}

async function main() {
  let state = { zone: null, signals: {}, entryPrices: {}, prices: {}, tpAlerted: {}, lastDigest: '' };
  try {
    if (fs.existsSync('state.json')) state = { ...state, ...JSON.parse(fs.readFileSync('state.json', 'utf8')) };
  } catch {}

  const isFirstBoot = !state.zone;
  const macro = await fetchMacroGap();
  const zoneObj = getZone(macro.gap);
  const prices = await fetchAllPrices(state.prices);
  const messages = [];

  if (isFirstBoot) {
    const top3 = STOCKS
      .filter((s) => !s.zombi && prices[s.ticker])
      .map((s) => ({ ...s, pot: Number((Math.max(1.5, macro.gap * 2.8) * s.beta).toFixed(1)) }))
      .sort((a, b) => b.pot - a.pot)
      .slice(0, 3)
      .map((s, idx) => `${idx + 1}. <b>${s.name}</b> (${prices[s.ticker]} ${s.cur}) • Pot. +${s.pot}%`)
      .join('\n');

    messages.push(
      `🚀 <b>VIGILANTE MACROPULSE 24/7 ACTIVADO</b>\n` +
      `🧭 Régimen Actual: <b>${zoneObj.label}</b> (GAP ${macro.gap >= 0 ? '+' : ''}${macro.gap.toFixed(2)}%)\n` +
      `🛡️ Distribución Táctica: <b>${zoneObj.alloc}</b>\n\n` +
      `🏆 <b>TOP 3 MAYOR RECORRIDO AHORA:</b>\n${top3}`
    );
  } else if (state.zone !== zoneObj.id) {
    messages.push(
      `🧭 <b>CAMBIO DE RÉGIMEN MACRO F2</b>\n` +
      `Nuevo Ciclo: <b>${zoneObj.label}</b>\n` +
      `📊 GAP Liquidez F2: <b>${macro.gap >= 0 ? '+' : ''}${macro.gap.toFixed(2)}%</b>\n` +
      `🛡️ Distribución Táctica: <b>${zoneObj.alloc}</b>`
    );
  }
  state.zone = zoneObj.id;

  for (const st of STOCKS) {
    const pr = prices[st.ticker];
    if (!pr) continue;
    const sig = (macro.gap >= 0 && !st.zombi) ? 'COMPRA' : 'VENTA';
    const prevSig = state.signals[st.ticker];

    if (prevSig && prevSig !== sig) {
      if (prevSig === 'COMPRA' && sig === 'VENTA') {
        const entry = state.entryPrices[st.ticker] || st.act;
        const pnlEur = 3000 * ((pr - entry) / entry);
        const pnlPct = ((pr - entry) / entry) * 100;
        messages.push(`🚨 <b>CIERRE / VENTA MACROPULSE</b>\n📌 <b>${st.name}</b> (${st.ticker})\n💰 Salida: <b>${pr} ${st.cur}</b> (Entrada: ${entry} ${st.cur})\n📊 P&L Simulado (3.000 €): <b>${pnlEur >= 0 ? '+' : ''}${pnlEur.toFixed(2)} € (${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%)</b>\n🧭 GAP F2: <b>${macro.gap.toFixed(2)}%</b>`);
        delete state.entryPrices[st.ticker];
        delete state.tpAlerted[st.ticker];
      } else {
        state.entryPrices[st.ticker] = pr;
        state.tpAlerted[st.ticker] = false;
        messages.push(`${sig === 'COMPRA' ? '🟢 COMPRA' : '🚨 VENTA'} <b>SEÑAL MACROPULSE</b>\n📌 <b>${st.name}</b> (${st.ticker})\n💵 Cotización: <b>${pr} ${st.cur}</b>\n📦 Asignación Táctica: <b>3.000 €</b>\n🧭 GAP F2: <b>${macro.gap.toFixed(2)}%</b>`);
      }
    } else if (!prevSig && sig === 'COMPRA') {
      state.entryPrices[st.ticker] = pr;
    }

    if (sig === 'COMPRA' && state.entryPrices[st.ticker] && !state.tpAlerted[st.ticker]) {
      const entry = state.entryPrices[st.ticker];
      const varPct = ((pr - entry) / entry) * 100;
      if (varPct >= 15) {
        state.tpAlerted[st.ticker] = 'TP';
        messages.push(`🎯 <b>OBJETIVO +15% ALCANZADO (TOMA PARCIAL)</b>\n📌 <b>${st.name}</b> (${st.ticker})\n📈 Recorrido: <b>+${varPct.toFixed(2)}%</b> (${entry} → ${pr} ${st.cur})`);
      } else if (varPct <= -8) {
        state.tpAlerted[st.ticker] = 'SL';
        messages.push(`🛡️ <b>ALERTA STOP VOLATILIDAD (-8%)</b>\n📌 <b>${st.name}</b> (${st.ticker})\n📉 Desviación: <b>${varPct.toFixed(2)}%</b> (${entry} → ${pr} ${st.cur})`);
      }
    }
    state.signals[st.ticker] = sig;
  }

  const madridStr = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Madrid' });
  const [datePart, timePart] = madridStr.split(', ');
  const hour = Number(timePart.split(':').at(0));
  const slot = hour === 9 ? `${datePart}-OPEN` : hour === 22 ? `${datePart}-CLOSE` : null;

  if (slot && state.lastDigest !== slot) {
    state.lastDigest = slot;
    const top3 = STOCKS
      .filter((s) => !s.zombi && prices[s.ticker])
      .map((s) => ({ ...s, pot: Number((Math.max(1.5, macro.gap * 2.8) * s.beta).toFixed(1)) }))
      .sort((a, b) => b.pot - a.pot)
      .slice(0, 3)
      .map((s, idx) => `${idx + 1}. <b>${s.name}</b> (${prices[s.ticker]} ${s.cur}) • Pot. +${s.pot}%`)
      .join('\n');

    messages.push(`🗞️ <b>BOLETÍN ${hour === 9 ? 'APERTURA EUROPA' : 'CIERRE WALL STREET'}</b>\n🧭 Ciclo Actual: <b>${zoneObj.label}</b> (GAP ${macro.gap >= 0 ? '+' : ''}${macro.gap.toFixed(2)}%)\n🛡️ Cartera Modelo: <b>${zoneObj.alloc}</b>\n\n🏆 <b>TOP 3 MAYOR RECORRIDO HOY:</b>\n${top3}`);
  }

  if (messages.length > 0) await sendTG(messages.join('\n\n━━━━━━━━━━━━━━\n\n'));
  state.prices = prices;
  fs.writeFileSync('state.json', JSON.stringify(state, null, 2));
  console.log('VIGILANTE_24_7_OK', { gap: macro.gap, alertsSent: messages.length });
}

main();
