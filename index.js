// Orbite : Un petit vaisseau tourne autour d'un soleil sur trois orbites. Saute d'une orbite à l'autre pour éviter les astéroïdes, ramasse les cristaux, fuis les éruptions.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Orbite</span><span class="hint">↑ ou clic : dehors · ↓ ou clic droit : dedans · ← frein · → turbo · X : tir · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="obCanvas" width="288" height="288"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="obStats"></div></div>
      <div class="row"><button class="btn main" id="obNew">NOUVELLE PARTIE</button><button class="btn" id="obFs">PLEIN ÉCRAN</button></div>
      <div class="hint">Le soleil clignote : l'orbite intérieure va brûler. Plus tu tiens, plus le vaisseau et les astéroïdes vont vite.</div>
      <div class="hint">Toutes les 40 secondes, un nouveau système stellaire : naine rouge, pulsar, géante bleue… Les orbites s'étirent en ellipses, et certaines tournent. Maintiens → pour le turbo (il use l'énergie, mais les points comptent double) ou ← pour freiner. Les bonus sur les orbites : bouclier (un choc), aimant (les cristaux viennent à toi), ralenti (les astéroïdes traînent) et canon (5 tirs avec X, 5 points par astéroïde détruit).</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:1 1 360px;min-width:min(100%,320px);position:relative}
.gameBox:fullscreen{padding:0}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(280px,calc(100vh - 170px)));height:auto;aspect-ratio:1}
.gameBox:fullscreen canvas{width:min(100vw,100vh)}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: 'ORBITE', T: { k: '#05020f', k2: '#0e0820', fill: '#160e30', fillOn: '#221646', hl: '#2e1e5a', line: '#4a3a8a', acc: '#ffa030', accL: '#ffe0a0', accS: '#c86a10', accD: '#4a2406',
  rivet: '#fff4a0', btn: '#2e1e5a', btnHi: '#5a46a0', btnLo: '#0e0820', btnHov: '#3e2a78', btnHovHi: '#7a64c0', text: '#f4f0ff', muted: '#b0a8d8', acc2: '#5ec8ff', gold: '#ffd84a',
  orange: '#ffa030', red: '#ff4a5a', green: '#5aff9a', green2: '#1a8a5a', bg: '#07031a', bgDot: '#1e1448', bgDot2: '#140c34', spark: '#4a3a8a', spark2: '#ffd84a',
  tile: ['................', '..........:.....', '................', '...+............', '................', '................', '.............:..', '................',
    '................', '.....:..........', '................', '................', '..........+.....', '................', '..:.............', '................'] },
  emblem: ['....kkkkk....', '..kkyyyyykk..', '.kyyyoooyyyk.', '.kyoorrrooyk.', 'kyyorrrrroyyk', 'kyorrwwrrroyk', 'kyorrwrrrroyk', 'kyyorrrrroyyk', '.kyoorrrooyk.', '.kyyyoooyyyk.', '..kkyyyyykk..', '....kkkkk....'],
  icons: [[/^NOUVELLE/, 'play'], [/^PLEIN/, 'full'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

/* ---------- Orbite : le vaisseau tourne seul, le joueur ne choisit que l'orbite ---------- */
const OB = {W: 288, H: 288, CX: 144, CY: 154, RINGS: [50, 86, 122]};
const obs = gstore('orbite', {games: 0, gems: 0, flares: 0}); obs.rocks ??= 0; obs.systems ??= 0;
const OB_SYS = [{name: 'Soleil jaune', e: 0, spin: 0, sun: ['#ff6a2a', '#ffa030', '#ffd84a', '#fff4a0']}, {name: 'Naine rouge', e: .12, spin: 0, sun: ['#a01a2a', '#e03a3a', '#ff6a4a', '#ffb090']},
  {name: 'Pulsar', e: .17, spin: .0025, sun: ['#6a5aff', '#a8a0ff', '#e0dcff', '#ffffff']}, {name: 'Géante bleue', e: .21, spin: -.0035, sun: ['#1a5ab0', '#3a9aff', '#8ad0ff', '#e8f8ff']}];
const OB_BONUS = {shield: {name: 'Bouclier', c: '#5ec8ff'}, mag: {name: 'Aimant', c: '#ff5a8a'}, slow: {name: 'Ralenti', c: '#b070ff'}, gun: {name: 'Canon', c: '#ffd84a'}};
const OB_SYSLEN = 2400;
let ob = null;
const obCanvas = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; fn(c.getContext('2d')); return c; };
const OB_SHIP = obCanvas(9, 9, g => sprite(g, ['....k....', '...kck...', '...kck...', '..kcwck..', '..kcccck.', '.kcckcck.', 'kccckccck', 'kooko.kok', '.o.....o.'].map(r => r.padEnd(9, '.')), 0, 0, {k: '#05020f', c: '#5ec8ff', w: '#e8f8ff', o: '#ffa030'}));
const OB_ROCKS = [5, 7, 10].map((r, i) => obCanvas(r * 2 + 2, r * 2 + 2, g => {  // astéroïdes bosselés, dessinés pixel par pixel
  const rnd = seeded(31 + i), bump = Array.from({length: 8}, () => .78 + rnd() * .22), o = r + 1;
  for (let y = 0; y < r * 2 + 2; y++) for (let x = 0; x < r * 2 + 2; x++) {
    const dx = x - o + .5, dy = y - o + .5, a = (Math.atan2(dy, dx) + Math.PI) / (Math.PI * 2) * 8, k = bump[Math.floor(a) % 8], d = Math.hypot(dx, dy) / r;
    if (d > k) continue; px(g, d > k - .2 ? '#05020f' : dx + dy > r * .3 ? '#5a4a6a' : '#8a7a9a', x, y);
    if (d < k - .3 && rnd() < .08) px(g, '#3a2e4a', x, y);
  }
}));
const OB_GEM = obCanvas(7, 9, g => sprite(g, ['...k...', '..kwk..', '.kwgck.', 'kwggcck', 'kgggcck', '.kggck.', '..kgk..', '...k...', '.......'], 0, 0, {k: '#05020f', w: '#ffffff', g: '#5aff9a', c: '#1a8a5a'}));
function obNew() {
  ob = Object.assign(ob || {tick: 0, raf: 0}, {seen: ob ? ob.tick : 0, mode: 'ready', ring: 1, r: OB.RINGS[1], a: -Math.PI / 2, rocks: [], gems: [], t: 0, got: 0, combo: 1, flare: 600, burn: 0, spawn: 60, record: false, dead: 0, boom: 0, trail: [], e: 0, rot: 0, sys: 0, banner: 0, energy: 100, boost: false, brake: false, dist: 0, items: [], nItem: 600, shield: 0, mag: 0, slow: 0, ammo: 0, shots: [], inv: 0, kills: 0, bits: []});
  for (let i = 0; i < 3; i++) obGem();
}
const obSpeed = () => .014 + Math.min(.017, ob.t / 15500);
function obGem() { ob.gems.push({ring: Math.floor(Math.random() * 3), a: Math.random() * Math.PI * 2}); }
let obac = null;
function obBeep(f, d, type = 'square', slide = 0) { try { obac ??= new AudioContext(); const o = obac.createOscillator(), g = obac.createGain(), t = obac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(.045, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(obac.destination); o.start(t); o.stop(t + d + .02); } catch {} }
function obMove(dir) {
  if (ob.mode === 'ready') { ob.mode = 'play'; obs.games++; saveGames(); return; }
  if (ob.mode === 'pause') { ob.mode = 'play'; return; }
  if (ob.mode === 'over') { if (ob.dead > 40) obNew(); return; }
  ob.ring = (ob.ring + dir + 3) % 3; obBeep(dir > 0 ? 520 : 390, .06, 'square', dir > 0 ? 780 : 260);
}
const obPos = (ring, a, r = OB.RINGS[ring]) => {  // une orbite en ellipse (grand axe = le rayon, petit axe aplati par e), tournée de rot
  const e = ob ? ob.e : 0, t = ob ? ob.rot : 0, X = Math.cos(a) * r, Y = Math.sin(a) * r * (1 - 2 * e);
  return [OB.CX + X * Math.cos(t) - Y * Math.sin(t), OB.CY + X * Math.sin(t) + Y * Math.cos(t)];
};
const obMult = () => ob.boost && ob.energy > 0 ? 1.8 : ob.brake ? .5 : 1;
function obDie() { ob.mode = 'over'; ob.dead = 0; ob.boom = 20; obBeep(150, .5, 'sawtooth', 40); ob.record = best('orbite', obScore()); obs.gems += ob.got; saveGames(); obInfo(); }
const obScore = () => Math.floor(ob.dist / 30) + ob.got * 10 + ob.kills * 5;
function obFire() {
  if (ob.mode !== 'play' || ob.ammo <= 0) return; ob.ammo--; const [x0, y0] = obPos(0, ob.a, ob.r), [x1, y1] = obPos(0, ob.a + .01, ob.r), d = Math.hypot(x1 - x0, y1 - y0) || 1;
  ob.shots.push({x: x0, y: y0, vx: (x1 - x0) / d * 4, vy: (y1 - y0) / d * 4, life: 70}); obBeep(1200, .08, 'square', 500);
}
function obUpdate() {
  if (ob.boom) ob.boom--;
  if (ob.mode === 'over') { ob.dead++; return; }
  if (ob.mode !== 'play') { ob.a += .01; return; }
  ob.t++; const m = obMult(); ob.a += obSpeed() * m; ob.dist += m > 1 ? 2 : m; ob.r += (OB.RINGS[ob.ring] - ob.r) * .3;
  if (ob.boost && ob.energy > 0) ob.energy = Math.max(0, ob.energy - .8); else if (!ob.boost) ob.energy = Math.min(100, ob.energy + .3);
  // le système stellaire change toutes les 40 s : les orbites s'étirent doucement et peuvent tourner
  const S = OB_SYS[ob.sys % OB_SYS.length]; ob.e += (S.e - ob.e) * .01; ob.rot += S.spin;
  if (ob.t % OB_SYSLEN === 0) { ob.sys++; obs.systems++; ob.banner = 150; obBeep(330, .5, 'triangle', 990); }
  if (ob.banner) ob.banner--; for (const k of ['shield', 'mag', 'slow', 'inv']) if (ob[k] > 0 && k !== 'shield') ob[k]--;
  const [sx, sy] = obPos(0, ob.a, ob.r); ob.trail.unshift([sx, sy]); ob.trail.length = Math.min(ob.trail.length, 10);
  // astéroïdes : ils entrent par un bord et traversent en visant près du soleil
  if (--ob.spawn <= 0) {
    const side = Math.random() * Math.PI * 2, ex = OB.CX + Math.cos(side) * 235, ey = OB.CY + Math.sin(side) * 235, tx = OB.CX + (Math.random() - .5) * 160, ty = OB.CY + (Math.random() - .5) * 160, d = Math.hypot(tx - ex, ty - ey), v = .7 + Math.random() * .5 + Math.min(1, ob.t / 5000);
    const s = Math.floor(Math.random() * 3); ob.rocks.push({x: ex, y: ey, vx: (tx - ex) / d * v, vy: (ty - ey) / d * v, s, r: [5, 7, 10][s], life: 600});
    ob.spawn = Math.max(22, 80 - ob.t / 90) * (.6 + Math.random() * .8);
  }
  const rs = ob.slow ? .4 : 1;
  for (const k of ob.rocks) { k.x += k.vx * rs; k.y += k.vy * rs; k.life -= rs; if (!ob.inv && Math.hypot(k.x - sx, k.y - sy) < k.r + 2.5) { if (ob.shield) { ob.shield = 0; ob.inv = 60; k.life = 0; obBits(k.x, k.y, '#5ec8ff'); obBeep(500, .25, 'sawtooth', 200); } else return obDie(); } }
  for (const s of ob.shots) { s.x += s.vx; s.y += s.vy; s.life--; for (const k of ob.rocks) if (k.life > 0 && Math.hypot(k.x - s.x, k.y - s.y) < k.r + 2) { k.life = 0; s.life = 0; ob.kills++; obs.rocks++; obBits(k.x, k.y, '#8a7a9a'); obBeep(220, .2, 'square', 80); } }
  ob.shots = ob.shots.filter(s => s.life > 0); ob.rocks = ob.rocks.filter(k => k.life > 0);
  for (const b of ob.bits) { b.x += b.vx; b.y += b.vy; b.t--; } ob.bits = ob.bits.filter(b => b.t > 0);
  // les bonus : un à la fois, posé sur une orbite
  if (!ob.items.length && --ob.nItem <= 0) { const ks = Object.keys(OB_BONUS); ob.items.push({ring: Math.floor(Math.random() * 3), a: ob.a + 2 + Math.random() * 3, kind: ks[Math.floor(Math.random() * ks.length)], life: 900}); ob.nItem = 600 + Math.floor(Math.random() * 400); }
  for (const it of ob.items) { it.life--; const [ix, iy] = obPos(it.ring, it.a); if (Math.hypot(ix - sx, iy - sy) < 8) { it.got = true; if (it.kind === 'shield') ob.shield = 1; else if (it.kind === 'gun') ob.ammo += 5; else ob[it.kind] = 480; obBeep(880, .3, 'triangle', 1760); } }
  ob.items = ob.items.filter(it => !it.got && it.life > 0);
  if (ob.mag) for (const gm of ob.gems) { const [gx, gy] = obPos(gm.ring, gm.a); if (Math.hypot(gx - sx, gy - sy) < 70) { gm.ring = ob.ring; gm.a += Math.sign(((ob.a - gm.a) % 6.283 + 9.425) % 6.283 - 3.1416) * .04; } }
  // éruption : 2 s d'alerte, puis l'orbite intérieure brûle 2 s
  if (--ob.flare === 0) { ob.burn = 120; obBeep(90, 1.2, 'sawtooth', 60); }
  if (ob.flare < 0 && ob.burn > 0) { ob.burn--; if (ob.ring === 0 && Math.abs(ob.r - OB.RINGS[0]) < 6) return obDie(); if (!ob.burn) { ob.flare = 900 + Math.floor(Math.random() * 600); obs.flares++; } }
  if (ob.flare === 120) obBeep(880, .1);
  for (const gm of ob.gems) { const [gx, gy] = obPos(gm.ring, gm.a); if (Math.hypot(gx - sx, gy - sy) < (ob.mag ? 10 : 7)) { gm.got = true; ob.got += ob.combo; ob.combo = Math.min(5, ob.combo + 1); obBeep(1046 + ob.combo * 100, .08, 'square', 1568); } }
  if (ob.gems.some(g => g.got)) { ob.gems = ob.gems.filter(g => !g.got); obGem(); }
  if (ob.t % 600 === 0) ob.combo = 1;  // le multiplicateur retombe toutes les 10 s
}
function obBits(x, y, c) { for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; ob.bits.push({x, y, vx: Math.cos(a) * 1.2, vy: Math.sin(a) * 1.2, t: 22, c}); } }
function obDraw() {
  const g = ob.g, {W, H, CX, CY, RINGS} = OB;
  for (; ob.seen < ob.tick; ob.seen++) if (ob.mode !== 'play') obUpdate();
  g.imageSmoothingEnabled = false;
  px(g, '#07031a', 0, 0, W, H);
  for (let i = 0; i < 60; i++) { const x = (i * 73 + 11) % W, y = (i * 41 + Math.floor(ob.tick / (8 + i % 3 * 4))) % H; px(g, i % 7 ? '#3a2e6a' : '#b0a8d8', x, y, 1, 1); }
  // les orbites en pointillés ; l'intérieure rougit pendant une éruption
  const warn = ob.flare > 0 && ob.flare < 120, burn = ob.flare <= 0 && ob.burn > 0;
  RINGS.forEach((R, i) => { const hot = i === 0 && (burn || warn && Math.floor(ob.tick / 6) % 2), n = Math.round(R * 1.3);
    for (let k = 0; k < n; k++) { if (k % 2 && !hot) continue; const a = k / n * Math.PI * 2, [x, y] = obPos(i, a); px(g, hot ? (burn ? '#ff6a2a' : '#ff4a5a') : i === ob.ring ? '#5ec8ff' : '#3e3878', x, y, burn && i === 0 ? 2 : 1, burn && i === 0 ? 2 : 1); } });
  // le soleil : disque en anneaux, flammes qui ondulent
  const sr = 22 + (burn ? 5 : 0) + Math.round(Math.sin(ob.tick / 10));
  for (let y = -sr - 3; y <= sr + 3; y++) for (let x = -sr - 3; x <= sr + 3; x++) {
    const d = Math.hypot(x, y), a = Math.atan2(y, x), edge = sr + Math.sin(a * 7 + ob.tick / 6) * 1.6;
    const SC = OB_SYS[ob.sys % OB_SYS.length].sun; if (d > edge + 1) continue; px(g, d > edge ? '#1a0a2a' : d > edge - 3 ? SC[0] : d > sr * .55 ? SC[1] : d > sr * .3 ? SC[2] : SC[3], CX + x, CY + y);
  }
  const eye = warn || burn ? '#1a0a2a' : null; if (eye) { px(g, eye, CX - 8, CY - 4, 4, 4); px(g, eye, CX + 4, CY - 4, 4, 4); px(g, eye, CX - 4, CY + 5, 8, 3); }
  for (const gm of ob.gems) { const [x, y] = obPos(gm.ring, gm.a); g.drawImage(OB_GEM, Math.round(x - 3), Math.round(y - 4 + Math.sin(ob.tick / 8 + gm.a * 3))); }
  for (const it of ob.items) { const [x, y] = obPos(it.ring, it.a), c = OB_BONUS[it.kind].c, b = Math.round(Math.sin(ob.tick / 8) * 1.5); if (it.life < 180 && (ob.tick >> 3) % 2) continue;
    px(g, '#05020f', x - 5, y - 5 + b, 11, 11); px(g, c, x - 4, y - 4 + b, 9, 9); px(g, '#05020f', x - 2, y - 2 + b, 5, 5); px(g, c, x - 1, y - 1 + b, 3, 3); }
  for (const s of ob.shots) { px(g, '#fff4a0', s.x - 1, s.y - 1, 2, 2); px(g, '#ffd84a', s.x - s.vx / 2, s.y - s.vy / 2, 1, 1); }
  for (const b of ob.bits) px(g, b.c, b.x, b.y, 1, 1);
  for (const k of ob.rocks) g.drawImage(OB_ROCKS[k.s], Math.round(k.x - k.r - 1), Math.round(k.y - k.r - 1));
  // la traînée puis le vaisseau, orienté selon sa course (pas de 1/16 de tour)
  ob.trail.forEach(([x, y], i) => { if (i % 2) px(g, i < 4 ? '#ffa030' : '#5a3a20', x, y, 1, 1); });
  const [sx, sy] = obPos(0, ob.a, ob.r);
  if (ob.mode !== 'over' && !(ob.inv && (ob.tick >> 2) % 2)) { const [tx, ty] = obPos(0, ob.a + .01, ob.r), head = Math.atan2(ty - sy, tx - sx) + Math.PI / 2;
    g.save(); g.translate(Math.round(sx), Math.round(sy)); g.rotate(Math.round(head / (Math.PI / 8)) * (Math.PI / 8)); g.drawImage(OB_SHIP, -4, -4); if (ob.boost && ob.energy > 0) { px(g, '#ffd84a', -2, 5, 1, 3 + (ob.tick % 3)); px(g, '#ffd84a', 1, 5, 1, 3 + (ob.tick % 3)); } g.restore();
    if (ob.shield) { g.strokeStyle = (ob.tick >> 3) % 2 ? '#5ec8ff' : '#c8f0ff'; g.lineWidth = 1; g.beginPath(); g.arc(Math.round(sx), Math.round(sy), 8, 0, 6.283); g.stroke(); } }
  else for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, d = (20 - ob.boom) * 1.3 + 2; px(g, i % 2 ? '#ffa030' : '#fff4a0', sx + Math.cos(a) * d, sy + Math.sin(a) * d, 2, 2); }
  pxFont(g, String(obScore()), 6, 14, '#ffffff', 12);
  if (ob.combo > 1) pxFont(g, 'x' + ob.combo, W - 6, 14, '#5aff9a', 12, 'right');
  if (ob.mode === 'play' || ob.mode === 'pause') { px(g, '#05020f', 6, H - 10, 52, 6); px(g, ob.energy < 20 ? '#ff4a5a' : '#ffd84a', 7, H - 9, Math.round(ob.energy / 2), 4);
    let bx = 64; if (ob.ammo) { pxFont(g, 'TIRS ' + ob.ammo, bx, H - 4, '#ffd84a', 8); bx += 52; } for (const k of ['mag', 'slow']) if (ob[k]) { pxFont(g, OB_BONUS[k].name, bx, H - 4, OB_BONUS[k].c, 8); bx += 52; } }
  if (ob.banner && ob.mode === 'play') { px(g, 'rgba(7,3,26,.8)', 0, 40, W, 30); pxFont(g, 'SYSTÈME ' + (ob.sys + 1), W / 2, 52, '#b0a8d8', 8, 'center'); pxFont(g, OB_SYS[ob.sys % OB_SYS.length].name, W / 2, 65, OB_SYS[ob.sys % OB_SYS.length].sun[2], 8, 'center'); }
  if (warn) PXK.fill(g, 'ÉRUPTION !', W / 2, 22, Math.floor(ob.tick / 6) % 2 ? '#ff4a5a' : '#ffd84a', PXK.scale(8), 'center');
  if (ob.mode === 'ready') gameText(g, W, [['ORBITE', '#ffa030', 16], ['Espace ou clic pour partir', '#ffffff'], ['↑ dehors · ↓ dedans', '#b0a8d8'], ['Record ' + (games.best.orbite || 0), '#ffd84a']], 236);
  if (ob.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Espace pour reprendre', '#b0a8d8']], 240);
  if (ob.mode === 'over' && ob.dead > 20) gameText(g, W, [['PERDU DANS L\'ESPACE', '#ff4a5a', 12], ['Score ' + obScore(), '#ffffff'], ['Cristaux ' + ob.got + ' · ' + Math.floor(ob.t / 60) + ' s', '#5aff9a'], [ob.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.orbite || 0), '#ffd84a'], [ob.dead > 40 ? 'Espace pour rejouer' : '', '#b0a8d8']], 216);
}
function obInfo() {
  $('obStats').replaceChildren(...[['Meilleur score', games.best.orbite || 0], ['Parties', obs.games], ['Cristaux au total', obs.gems], ['Éruptions évitées', obs.flares], ['Astéroïdes détruits', obs.rocks], ['Systèmes visités', obs.systems]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !ob || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || e.repeat) return;
  if ([' ', 'ArrowUp', 'Enter', 'z', 'w'].includes(e.key)) { e.preventDefault(); obMove(1); }
  if (['ArrowDown', 's'].includes(e.key)) { e.preventDefault(); obMove(-1); }
  if (['ArrowRight', 'd'].includes(e.key)) { e.preventDefault(); ob.boost = true; }
  if (['ArrowLeft', 'q', 'a'].includes(e.key)) { e.preventDefault(); ob.brake = true; }
  if (e.key.toLowerCase() === 'x' || e.key === 'Shift') { e.preventDefault(); obFire(); }
  if (e.key.toLowerCase() === 'p' && ob.mode === 'play') ob.mode = 'pause';
});
document.addEventListener('keyup', e => { if (!ob) return; if (['ArrowRight', 'd'].includes(e.key)) ob.boost = false; if (['ArrowLeft', 'q', 'a'].includes(e.key)) ob.brake = false; });
$('obCanvas').onpointerdown = e => { e.preventDefault(); if (ob) obMove(e.button === 2 ? -1 : 1); };
$('obCanvas').oncontextmenu = e => e.preventDefault();
$('obNew').onclick = () => { obNew(); $('obNew').blur(); };
$('obFs').onclick = () => { $('obFs').blur(); try { document.fullscreenElement ? document.exitFullscreen() : $('obCanvas').parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
$('obCanvas').__ob = {st: () => ob, OB, fire: () => obFire(), pos: obPos};
{  // vérification : un astéroïde sur le vaisseau le détruit ; l'éruption brûle l'orbite intérieure seulement
  const keep = ob, realBest = games.best.orbite, realStats = {...obs}; ob = null;
  obNew(); ob.mode = 'play'; ob.spawn = 1e9; const [x, y] = obPos(1, ob.a + obSpeed()); ob.rocks = [{x, y, vx: 0, vy: 0, s: 0, r: 5, life: 99}]; obUpdate(); const hit = ob.mode === 'over';
  obNew(); ob.mode = 'play'; ob.spawn = 1e9; ob.ring = 0; ob.r = OB.RINGS[0]; ob.flare = 1; obUpdate(); obUpdate(); const burnt = ob.mode === 'over';
  obNew(); ob.mode = 'play'; ob.spawn = 1e9; ob.ring = 2; ob.r = OB.RINGS[2]; ob.gems = []; ob.flare = 1; for (let i = 0; i < 130; i++) obUpdate(); const safe = ob.mode === 'play' && ob.flare > 0;
  const bad = [];
  for (let s = 0; s < OB_SYS.length; s++) for (let rot = 0; rot < 6.3; rot += .5) { ob.e = OB_SYS[s].e; ob.rot = rot; for (let a = 0; a < 6.3; a += .2) { const [x, y] = obPos(2, a); if (x < 8 || x > OB.W - 8 || y < 14 || y > OB.H - 4) { bad.push('orbite hors champ ' + s); break; } } }
  obNew(); ob.mode = 'play'; ob.spawn = ob.nItem = 1e9; ob.shield = 1; const [hx, hy] = obPos(1, ob.a + obSpeed()); ob.rocks = [{x: hx, y: hy, vx: 0, vy: 0, s: 0, r: 5, life: 99}]; obUpdate(); if (ob.mode !== 'play' || ob.shield || ob.rocks.length) bad.push('bouclier');
  obNew(); ob.mode = 'play'; ob.spawn = ob.nItem = 1e9; ob.ammo = 1; const [ax, ay] = obPos(1, ob.a + .25); ob.rocks = [{x: ax, y: ay, vx: 0, vy: 0, s: 1, r: 7, life: 99}]; obFire(); for (let i = 0; i < 20; i++) obUpdate(); if (ob.kills !== 1 || ob.ammo || ob.mode !== 'play') bad.push('canon ' + ob.kills);
  obNew(); ob.mode = 'play'; ob.spawn = ob.nItem = 1e9; ob.boost = true; const a0 = ob.a; obUpdate(); const fast = ob.a - a0; ob.boost = false; ob.brake = true; const a1 = ob.a; obUpdate(); const slow = ob.a - a1;
  if (!(fast > slow * 3) || ob.energy >= 100) bad.push('turbo et frein');
  obNew(); ob.mode = 'play'; ob.spawn = ob.nItem = 1e9; ob.flare = 1e9; ob.t = OB_SYSLEN - 1; obUpdate(); if (ob.sys !== 1 || !ob.banner) bad.push('système suivant'); for (let i = 0; i < 600; i++) obUpdate(); if (ob.e < .1) bad.push('ellipse ' + ob.e.toFixed(2));
  obNew(); ob.mode = 'play'; ob.spawn = 1e9; ob.items = [{ring: 1, a: ob.a + obSpeed(), kind: 'mag', life: 99}]; obUpdate(); if (!ob.mag) bad.push('bonus aimant');
  console.assert(hit && burnt && safe && !bad.length, 'orbite', {hit, burnt, safe, bad});
  if (realBest === undefined) delete games.best.orbite; else games.best.orbite = realBest; Object.assign(obs, realStats);
  ob = keep; $('obCanvas').__obBad = bad;
}
ctx.onOpen(() => {
  if (!ob || !ob.g) { obNew(); ob.g = $('obCanvas').getContext('2d'); }
  gameLoop(ob, 'orbite', obUpdate, obDraw); obInfo();
});
}
