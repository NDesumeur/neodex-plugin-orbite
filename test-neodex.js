// lancé par le test « local » de NeoDex : une partie (sauts d'orbite, éruption), le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const cv = document.getElementById('obCanvas'), T = cv.__ob, ob = T.st(); ${code} })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('obCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'orbite-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  await sleep(500); await shot('0-pret');
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  await key(' '); await sleep(300); await key('ArrowUp'); await sleep(900);
  if (await C('return ob.mode + ob.ring;') !== 'play2') throw new Error('la partie ne démarre pas : ' + await C('return ob.mode + ob.ring;'));
  await C('ob.flare = 60; return 0;'); await sleep(400); await shot('1-alerte');
  await C('ob.rocks = []; ob.spawn = 1e9; return 0;'); await sleep(1200); await shot('2-eruption');
  const bad = await pj('document.getElementById("obCanvas").__obBad'); if (bad && bad.length) throw new Error('vérification : ' + bad.join(', '));
  // un système en ellipse qui tourne (le pulsar), avec un bouclier, un bonus posé, le turbo et des tirs
  await C('ob.burn = 0; ob.flare = 5000; ob.sys = 2; ob.e = .17; ob.rot = .6; ob.shield = 1; ob.ammo = 3; ob.mag = 300; ob.items = [{ring: 0, a: ob.a + 2, kind: "slow", life: 900}]; ob.banner = 100; return 0;');
  await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true})), 0`); await key('x'); await sleep(250); await shot('3-pulsar');
  await pj(`document.dispatchEvent(new KeyboardEvent('keyup', {key: 'ArrowRight', bubbles: true})), 0`);
  const st = await C('return [ob.shots.length + ob.kills, Math.round(ob.energy), ob.ammo];'); if (st[0] < 1 || st[1] >= 100 || st[2] !== 2) throw new Error('tir et turbo : ' + st);
  await C('ob.sys = 3; ob.e = .21; ob.banner = 0; return 0;'); await sleep(500); await shot('4-geante');
  const R = await C('return [T.OB.RINGS[2], T.OB.W];'); if (R[0] < 110) throw new Error('système trop petit : ' + R);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  await pj(`document.getElementById('obFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('obCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('obCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('obCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  return 'partie et éruption · pulsar en ellipse, tir et turbo · orbite extérieure ' + R[0] + ' px · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
