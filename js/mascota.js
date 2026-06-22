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
  },
  {
    id: "apolo",
    nombre: "Apolo",
    perro: true,
    cuerpo: "#E8B860", cuerpo2:"#C89540",   // dorado golden retriever
    panza: "#F5DDA8",
    ojos: "#5C3A1E",
    nariz: "#3A2A1E",
    oreja: "#D4A24C"
  }
];

// Genera el SVG de una mascota (gata o perro) con sombreado, volumen y vida
// estado: 'feliz', 'normal', 'hambre', 'comiendo', 'durmiendo'
// accesorio: null, 'gorro', 'gafas', 'capa', 'corona', 'mascara'...
function svgGata(gata, estado='feliz', size=200, accesorio=null){
  if(gata && gata.perro) return svgPerro(gata, estado, size, accesorio);
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

// Genera el SVG de un perrito Golden Retriever (Apolo)
function svgPerro(perro, estado='feliz', size=200, accesorio=null){
  const g = perro;
  const uid = g.id + Math.random().toString(36).slice(2,6);

  const ojoForma = (estado==='durmiendo')
    ? `<path d="M68 92 q11 7 22 0" stroke="#3A2A1E" stroke-width="3.5" fill="none" stroke-linecap="round"/>
       <path d="M110 92 q11 7 22 0" stroke="#3A2A1E" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="79" cy="92" rx="9" ry="${estado==='hambre'?7:11}" fill="white"/>
       <ellipse cx="121" cy="92" rx="9" ry="${estado==='hambre'?7:11}" fill="white"/>
       <circle cx="79" cy="94" r="6" fill="${g.ojos}"/>
       <circle cx="121" cy="94" r="6" fill="${g.ojos}"/>
       <circle cx="79" cy="94" r="3" fill="#1A1A1E"/>
       <circle cx="121" cy="94" r="3" fill="#1A1A1E"/>
       <circle cx="81" cy="91" r="1.8" fill="white"/>
       <circle cx="123" cy="91" r="1.8" fill="white"/>`;

  // Hocico claro + nariz + boca + lengua (feliz)
  const hocico = `<ellipse cx="100" cy="116" rx="26" ry="22" fill="${g.panza}"/>`;
  const nariz = `<ellipse cx="100" cy="108" rx="9" ry="6.5" fill="${g.nariz}"/>
                 <ellipse cx="97" cy="106" rx="2.5" ry="1.6" fill="#fff" opacity="0.4"/>`;
  const boca = (estado==='comiendo' || estado==='feliz')
    ? `<path d="M100 114 v10" stroke="#3A2A1E" stroke-width="2.5" stroke-linecap="round"/>
       <path d="M100 124 q-10 9 -20 2" stroke="#3A2A1E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
       <path d="M100 124 q10 9 20 2" stroke="#3A2A1E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
       <ellipse cx="100" cy="130" rx="7" ry="9" fill="#F06A8A"/>`  // lengua
    : (estado==='hambre')
    ? `<path d="M100 114 v8" stroke="#3A2A1E" stroke-width="2.5" stroke-linecap="round"/>
       <ellipse cx="100" cy="128" rx="6" ry="8" fill="#F06A8A"/>`
    : `<path d="M100 114 v9" stroke="#3A2A1E" stroke-width="2.5" stroke-linecap="round"/>
       <path d="M100 123 q-8 6 -16 1 M100 123 q8 6 16 1" stroke="#3A2A1E" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

  let acc='';
  if(accesorio==='gorro') acc=`<path d="M60 50 q40 -38 80 0 z" fill="#FF4B4B"/><circle cx="100" cy="14" r="9" fill="white"/><rect x="56" y="46" width="88" height="11" rx="5.5" fill="white"/>`;
  else if(accesorio==='gafas') acc=`<circle cx="79" cy="92" r="15" fill="#1CB0F6" opacity="0.35"/><circle cx="121" cy="92" r="15" fill="#1CB0F6" opacity="0.35"/><circle cx="79" cy="92" r="15" fill="none" stroke="#1A1A1E" stroke-width="4"/><circle cx="121" cy="92" r="15" fill="none" stroke="#1A1A1E" stroke-width="4"/><path d="M96 92 h8" stroke="#1A1A1E" stroke-width="4"/>`;
  else if(accesorio==='capa') acc=`<path d="M46 132 q54 42 108 0 l-10 54 q-44 22 -88 0 z" fill="#FF4B4B"/><path d="M58 136 l10 10 M142 136 l-10 10" stroke="#FFC800" stroke-width="4"/>`;
  else if(accesorio==='corona') acc=`<path d="M64 44 l8 -26 12 16 16 -22 16 22 12 -16 8 26 z" fill="#FFC800" stroke="#E6B400" stroke-width="2"/>`;
  else if(accesorio==='mascara') acc=`<path d="M56 86 q44 -16 88 0 l-4 16 q-40 -10 -80 0 z" fill="#1A1A2E"/><circle cx="79" cy="92" r="8" fill="white"/><circle cx="121" cy="92" r="8" fill="white"/>`;
  else if(accesorio==='monos') acc=`<path d="M88 146 l-14 -8 0 16 z" fill="#FF4B4B"/><path d="M112 146 l14 -8 0 16 z" fill="#FF4B4B"/><circle cx="100" cy="146" r="6" fill="#E23D3D"/>`;

  const corazones=(estado==='comiendo')?`<text x="148" y="48" font-size="24">❤️</text><text x="38" y="58" font-size="18">❤️</text>`:'';
  const zzz=(estado==='durmiendo')?`<text x="142" y="48" font-size="22" fill="#999">z</text><text x="158" y="34" font-size="15" fill="#bbb">z</text>`:'';
  const animClass=(estado==='durmiendo')?'gato-dormido':'gato-vivo';

  return `<svg viewBox="0 0 200 205" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" class="${animClass}">
    <defs>
      <radialGradient id="pc${uid}" cx="42%" cy="35%" r="72%">
        <stop offset="0%" stop-color="${aclararHex(g.cuerpo,28)}"/>
        <stop offset="100%" stop-color="${g.cuerpo}"/>
      </radialGradient>
    </defs>
    ${accesorio==='capa'?acc:''}
    <!-- sombra suelo -->
    <ellipse cx="100" cy="196" rx="50" ry="9" fill="#000" opacity="0.12"/>
    <!-- cola peluda que se mueve -->
    <path class="gato-cola" d="M150 168 q44 4 40 -34" stroke="${g.cuerpo}" stroke-width="17" fill="none" stroke-linecap="round"/>
    <!-- cuerpo -->
    <ellipse cx="100" cy="152" rx="55" ry="44" fill="url(#pc${uid})"/>
    <ellipse cx="100" cy="162" rx="34" ry="26" fill="${g.panza}" opacity="0.85"/>
    <!-- patas -->
    <ellipse cx="76" cy="188" rx="15" ry="10" fill="${g.cuerpo}"/>
    <ellipse cx="124" cy="188" rx="15" ry="10" fill="${g.cuerpo}"/>
    <!-- orejas largas caídas (golden) -->
    <ellipse cx="50" cy="92" rx="17" ry="32" fill="${g.oreja}" transform="rotate(-12 50 92)"/>
    <ellipse cx="150" cy="92" rx="17" ry="32" fill="${g.oreja}" transform="rotate(12 150 92)"/>
    <ellipse cx="52" cy="90" rx="10" ry="22" fill="${aclararHex(g.oreja,15)}" transform="rotate(-12 52 90)"/>
    <ellipse cx="148" cy="90" rx="10" ry="22" fill="${aclararHex(g.oreja,15)}" transform="rotate(12 148 90)"/>
    <!-- cabeza -->
    <circle cx="100" cy="90" r="50" fill="url(#pc${uid})"/>
    <!-- copete -->
    <path d="M100 40 q-10 6 -4 14 q4 -6 8 -6 q4 0 8 6 q6 -8 -4 -14 q-4 -3 -8 0z" fill="${aclararHex(g.cuerpo,18)}"/>
    ${hocico}
    ${ojoForma}
    ${nariz}
    ${boca}
    ${estado==='feliz'?`<ellipse cx="62" cy="104" rx="9" ry="6" fill="#FF9DB0" opacity="0.4"/><ellipse cx="138" cy="104" rx="9" ry="6" fill="#FF9DB0" opacity="0.4"/>`:''}
    ${accesorio && accesorio!=='capa'?acc:''}
    ${corazones}${zzz}
  </svg>`;
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
