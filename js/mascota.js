// ════════════════════════════════════════════════════════════
//  Mascota — Las 4 gatitas de Jerónimo (SVG dibujadas)
// ════════════════════════════════════════════════════════════

// Las 4 gatas reales de Jerónimo
const GATAS = [
  {
    id: "negra",
    nombre: "Venus",
    cuerpo: "#2B2B30", cuerpo2:"#1A1A1E",
    panza: "#3A3A40",
    ojos: "#FFD700",
    nariz: "#E89AAE",
    oreja: "#4A4A50"
  },
  {
    id: "rusa",
    nombre: "Queen",
    cuerpo: "#8E9BA8", cuerpo2:"#6E7B88",
    panza: "#AEB9C4",
    ojos: "#3DDC84",
    nariz: "#C98A9E",
    oreja: "#7A8794"
  },
  {
    id: "atigrada",
    nombre: "Orión",
    cuerpo: "#9C7848", cuerpo2:"#5C4528",   // café/marrón como la imagen
    panza: "#D8C098",
    ojos: "#7BC85B",
    nariz: "#C98A7A",
    oreja: "#7A5C34",
    rayas: true
  },
  {
    id: "tricolor",
    nombre: "Gomita",
    cuerpo: "#F5F0E8", cuerpo2:"#E0D8C8",
    panza: "#FFFFFF",
    ojos: "#5BC85B",
    nariz: "#E89AAE",
    oreja: "#E8A85C",
    tricolor: true
  }
];

// Genera el SVG de una gata con sombreado, volumen y vida
// estado: 'feliz', 'normal', 'hambre', 'comiendo', 'durmiendo'
// accesorio: null, 'gorro', 'gafas', 'capa', 'corona', 'mascara'...
function svgGata(gata, estado='feliz', size=200, accesorio=null){
  const g = gata;
  const uid = g.id + Math.random().toString(36).slice(2,6); // ids únicos para gradientes
  const ojoForma = (estado==='durmiendo')
    ? `<path d="M68 95 q12 8 24 0" stroke="#1A1A1E" stroke-width="3.5" fill="none" stroke-linecap="round"/>
       <path d="M108 95 q12 8 24 0" stroke="#1A1A1E" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="80" cy="96" rx="12" ry="${estado==='hambre'?9:14}" fill="white"/>
       <ellipse cx="120" cy="96" rx="12" ry="${estado==='hambre'?9:14}" fill="white"/>
       <ellipse cx="80" cy="98" rx="8" ry="${estado==='hambre'?7:10}" fill="${g.ojos}"/>
       <ellipse cx="120" cy="98" rx="8" ry="${estado==='hambre'?7:10}" fill="${g.ojos}"/>
       <ellipse cx="80" cy="98" rx="3.5" ry="6" fill="#1A1A1E"/>
       <ellipse cx="120" cy="98" rx="3.5" ry="6" fill="#1A1A1E"/>
       <circle cx="83" cy="94" r="2.2" fill="white"/>
       <circle cx="123" cy="94" r="2.2" fill="white"/>
       <ellipse class="gato-parpado" cx="80" cy="96" rx="12.5" ry="14" fill="${g.cuerpo}"/>
       <ellipse class="gato-parpado" cx="120" cy="96" rx="12.5" ry="14" fill="${g.cuerpo}"/>`;

  const boca = (estado==='feliz' || estado==='comiendo')
    ? `<path d="M86 116 q14 14 28 0" stroke="#1A1A1E" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : (estado==='hambre')
    ? `<ellipse cx="100" cy="120" rx="7" ry="9" fill="#C0506A"/><ellipse cx="100" cy="123" rx="4" ry="5" fill="#E88"/>`
    : `<path d="M92 117 q8 6 16 0" stroke="#1A1A1E" stroke-width="3" fill="none" stroke-linecap="round"/>`;

  const rayas = g.rayas ? `
    <path d="M100 44 v24" stroke="${g.cuerpo2}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
    <path d="M82 48 v18" stroke="${g.cuerpo2}" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
    <path d="M118 48 v18" stroke="${g.cuerpo2}" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
    <path d="M66 56 v14" stroke="${g.cuerpo2}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
    <path d="M134 56 v14" stroke="${g.cuerpo2}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
    <path d="M52 106 h20" stroke="${g.cuerpo2}" stroke-width="5" stroke-linecap="round" opacity="0.65"/>
    <path d="M128 106 h20" stroke="${g.cuerpo2}" stroke-width="5" stroke-linecap="round" opacity="0.65"/>
    <path d="M50 124 h18" stroke="${g.cuerpo2}" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
    <path d="M132 124 h18" stroke="${g.cuerpo2}" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
    <path d="M70 150 h22" stroke="${g.cuerpo2}" stroke-width="5" stroke-linecap="round" opacity="0.55"/>
    <path d="M108 150 h22" stroke="${g.cuerpo2}" stroke-width="5" stroke-linecap="round" opacity="0.55"/>
    <path d="M85 100 q15 -4 30 0" stroke="${g.cuerpo2}" stroke-width="3" fill="none" opacity="0.5"/>` : '';

  const tricolor = g.tricolor ? `
    <path d="M60 58 q-14 20 -2 48 q16 6 24 -6 q-10 -30 -22 -42z" fill="#E8A85C" opacity="0.9"/>
    <path d="M140 62 q16 18 6 44 q-14 8 -24 -4 q10 -26 18 -40z" fill="#2B2B30" opacity="0.85"/>
    <ellipse cx="100" cy="155" rx="24" ry="15" fill="#E8A85C" opacity="0.75"/>` : '';

  let acc = '';
  if(accesorio==='gorro'){
    acc = `<path d="M60 54 q40 -38 80 0 z" fill="#FF4B4B"/><circle cx="100" cy="18" r="9" fill="white"/><rect x="56" y="50" width="88" height="11" rx="5.5" fill="white"/>`;
  } else if(accesorio==='gafas'){
    acc = `<circle cx="80" cy="96" r="17" fill="#1CB0F6" opacity="0.35"/><circle cx="120" cy="96" r="17" fill="#1CB0F6" opacity="0.35"/><circle cx="80" cy="96" r="17" fill="none" stroke="#1A1A1E" stroke-width="4"/><circle cx="120" cy="96" r="17" fill="none" stroke="#1A1A1E" stroke-width="4"/><path d="M97 96 h6" stroke="#1A1A1E" stroke-width="4"/>`;
  } else if(accesorio==='capa'){
    acc = `<path d="M46 130 q54 42 108 0 l-10 54 q-44 22 -88 0 z" fill="#FF4B4B"/><path d="M58 134 l10 10 M142 134 l-10 10" stroke="#FFC800" stroke-width="4"/>`;
  } else if(accesorio==='corona'){
    acc = `<path d="M64 50 l8 -26 12 16 16 -22 16 22 12 -16 8 26 z" fill="#FFC800" stroke="#E6B400" stroke-width="2"/><circle cx="100" cy="34" r="4" fill="#FF4B4B"/>`;
  } else if(accesorio==='mascara'){
    acc = `<path d="M58 90 q42 -16 84 0 l-4 16 q-38 -10 -76 0 z" fill="#1A1A2E"/><circle cx="80" cy="96" r="8" fill="white"/><circle cx="120" cy="96" r="8" fill="white"/>`;
  } else if(accesorio==='monos'){
    acc = `<path d="M88 150 l-14 -8 0 16 z" fill="#FF4B4B"/><path d="M112 150 l14 -8 0 16 z" fill="#FF4B4B"/><circle cx="100" cy="150" r="6" fill="#E23D3D"/>`;
  }

  const corazones = (estado==='comiendo')
    ? `<text x="148" y="48" font-size="24">❤️</text><text x="38" y="58" font-size="18">❤️</text>` : '';
  const zzz = (estado==='durmiendo')
    ? `<text x="142" y="48" font-size="22" fill="#999">z</text><text x="158" y="34" font-size="15" fill="#bbb">z</text>` : '';

  // clase de animación
  const animClass = (estado==='durmiendo') ? 'gato-dormido' : 'gato-vivo';

  return `<svg viewBox="0 0 200 205" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" class="${animClass}">
    <defs>
      <radialGradient id="cuerpo${uid}" cx="40%" cy="35%" r="75%">
        <stop offset="0%" stop-color="${aclararHex(g.cuerpo,25)}"/>
        <stop offset="100%" stop-color="${g.cuerpo}"/>
      </radialGradient>
      <radialGradient id="cabeza${uid}" cx="42%" cy="35%" r="70%">
        <stop offset="0%" stop-color="${aclararHex(g.cuerpo,30)}"/>
        <stop offset="100%" stop-color="${g.cuerpo}"/>
      </radialGradient>
    </defs>
    ${accesorio==='capa'?acc:''}
    <!-- sombra suelo -->
    <ellipse cx="100" cy="196" rx="48" ry="9" fill="#000" opacity="0.12"/>
    <!-- cola animada -->
    <path class="gato-cola" d="M150 168 q42 12 38 -30" stroke="${g.cuerpo}" stroke-width="15" fill="none" stroke-linecap="round"/>
    <!-- cuerpo -->
    <ellipse cx="100" cy="152" rx="54" ry="44" fill="url(#cuerpo${uid})"/>
    <ellipse cx="100" cy="162" rx="35" ry="27" fill="${g.panza}" opacity="0.9"/>
    <!-- patas -->
    <ellipse cx="77" cy="188" rx="14" ry="10" fill="${g.cuerpo}"/>
    <ellipse cx="123" cy="188" rx="14" ry="10" fill="${g.cuerpo}"/>
    <ellipse cx="77" cy="190" rx="7" ry="4" fill="${g.panza}" opacity="0.7"/>
    <ellipse cx="123" cy="190" rx="7" ry="4" fill="${g.panza}" opacity="0.7"/>
    <!-- orejas -->
    <path d="M56 66 L46 26 L88 54 z" fill="${g.cuerpo}"/>
    <path d="M144 66 L154 26 L112 54 z" fill="${g.cuerpo}"/>
    <path d="M59 60 L54 38 L80 54 z" fill="${g.oreja}"/>
    <path d="M141 60 L146 38 L120 54 z" fill="${g.oreja}"/>
    <!-- cabeza -->
    <circle cx="100" cy="94" r="52" fill="url(#cabeza${uid})"/>
    ${rayas}
    ${tricolor}
    ${ojoForma}
    <!-- nariz con brillo -->
    <path d="M95 107 l10 0 l-5 6 z" fill="${g.nariz}"/>
    <ellipse cx="98" cy="108" rx="1.5" ry="1" fill="white" opacity="0.6"/>
    ${boca}
    <!-- bigotes -->
    <path d="M48 104 h28 M50 112 h26" stroke="${g.cuerpo2}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    <path d="M152 104 h-28 M150 112 h-26" stroke="${g.cuerpo2}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    ${estado==='feliz'?`<ellipse cx="60" cy="112" rx="9" ry="6" fill="#FF9DB0" opacity="0.45"/><ellipse cx="140" cy="112" rx="9" ry="6" fill="#FF9DB0" opacity="0.45"/>`:''}
    ${accesorio && accesorio!=='capa'?acc:''}
    ${corazones}${zzz}
  </svg>`;
}

function aclararHex(h,amt=25){
  try{let r=Math.min(255,parseInt(h.slice(1,3),16)+amt),gg=Math.min(255,parseInt(h.slice(3,5),16)+amt),b=Math.min(255,parseInt(h.slice(5,7),16)+amt);
    return `#${r.toString(16).padStart(2,'0')}${gg.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;}catch(e){return h;}
}

// ──────── Tienda ────────
const TIENDA = [
  // Comida
  {id:"manzana_food", nombre:"Manzana", emoji:"🍎", precio:5,  tipo:"comida", felicidad:15},
  {id:"leche_food",   nombre:"Leche",   emoji:"🥛", precio:5,  tipo:"comida", felicidad:15},
  {id:"galleta_food", nombre:"Galleta", emoji:"🍪", precio:8,  tipo:"comida", felicidad:20},
  {id:"pescado_food", nombre:"Pescado", emoji:"🐟", precio:10, tipo:"comida", felicidad:25},
  // Accesorios de SUPERHÉROE y ropa
  {id:"capa",    nombre:"Capa de héroe", emoji:"🦸", precio:30, tipo:"accesorio"},
  {id:"mascara", nombre:"Antifaz héroe", emoji:"🦹", precio:35, tipo:"accesorio"},
  {id:"corona",  nombre:"Corona",        emoji:"👑", precio:50, tipo:"accesorio"},
  {id:"gorro",   nombre:"Gorrito",       emoji:"🎩", precio:20, tipo:"accesorio"},
  {id:"gafas",   nombre:"Gafas cool",    emoji:"🕶️", precio:25, tipo:"accesorio"},
  {id:"monos",   nombre:"Corbatín",      emoji:"🎀", precio:15, tipo:"accesorio"},
  // Juguetes
  {id:"pelota", nombre:"Pelota", emoji:"⚽", precio:15, tipo:"juguete", felicidad:10},
  {id:"raton",  nombre:"Ratón",  emoji:"🐭", precio:12, tipo:"juguete", felicidad:10},
];
