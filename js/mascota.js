// ════════════════════════════════════════════════════════════
//  Mascota — Las 4 gatitas de Jerónimo (SVG dibujadas)
// ════════════════════════════════════════════════════════════

// Las 4 gatas reales de Jerónimo
const GATAS = [
  {
    id: "negra",
    nombre: "Gata Negra",
    cuerpo: "#2B2B30", cuerpo2:"#1A1A1E",
    panza: "#3A3A40",
    ojos: "#FFD700",   // ojos amarillos sobre negro
    nariz: "#E89AAE",
    oreja: "#4A4A50"
  },
  {
    id: "rusa",
    nombre: "Gata Gris",
    cuerpo: "#8E9BA8", cuerpo2:"#6E7B88",
    panza: "#AEB9C4",
    ojos: "#3DDC84",   // ojos verdes (azul ruso)
    nariz: "#C98A9E",
    oreja: "#7A8794"
  },
  {
    id: "atigrada",
    nombre: "Gato Atigrado",
    cuerpo: "#E8A85C", cuerpo2:"#C98A3E",
    panza: "#F5D9A8",
    ojos: "#5BC85B",
    nariz: "#E89AAE",
    oreja: "#D4943E",
    rayas: true
  },
  {
    id: "tricolor",
    nombre: "Gata Tricolor",
    cuerpo: "#F5F0E8", cuerpo2:"#E0D8C8",  // base blanca
    panza: "#FFFFFF",
    ojos: "#5BC85B",
    nariz: "#E89AAE",
    oreja: "#E8A85C",
    tricolor: true
  }
];

// Genera el SVG de una gata con su estado de ánimo
// estado: 'feliz', 'normal', 'hambre', 'comiendo', 'durmiendo'
// accesorio: null, 'gorro', 'gafas', 'capa'
function svgGata(gata, estado='feliz', size=200, accesorio=null){
  const g = gata;
  const ojoForma = (estado==='durmiendo')
    ? `<path d="M68 95 q12 8 24 0" stroke="#1A1A1E" stroke-width="3" fill="none" stroke-linecap="round"/>
       <path d="M108 95 q12 8 24 0" stroke="#1A1A1E" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="80" cy="96" rx="11" ry="${estado==='hambre'?9:13}" fill="white"/>
       <ellipse cx="120" cy="96" rx="11" ry="${estado==='hambre'?9:13}" fill="white"/>
       <circle cx="80" cy="98" r="7" fill="${g.ojos}"/>
       <circle cx="120" cy="98" r="7" fill="${g.ojos}"/>
       <circle cx="80" cy="98" r="3.5" fill="#1A1A1E"/>
       <circle cx="120" cy="98" r="3.5" fill="#1A1A1E"/>
       <circle cx="82" cy="95" r="1.6" fill="white"/>
       <circle cx="122" cy="95" r="1.6" fill="white"/>`;

  const boca = (estado==='feliz' || estado==='comiendo')
    ? `<path d="M88 118 q12 12 24 0" stroke="#1A1A1E" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    : (estado==='hambre')
    ? `<ellipse cx="100" cy="120" rx="6" ry="8" fill="#C0506A"/>`
    : `<path d="M92 118 q8 6 16 0" stroke="#1A1A1E" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

  // Rayas del atigrado
  const rayas = g.rayas ? `
    <path d="M100 48 v20" stroke="${g.cuerpo2}" stroke-width="5" stroke-linecap="round"/>
    <path d="M84 52 v14" stroke="${g.cuerpo2}" stroke-width="4" stroke-linecap="round"/>
    <path d="M116 52 v14" stroke="${g.cuerpo2}" stroke-width="4" stroke-linecap="round"/>
    <path d="M55 110 h16" stroke="${g.cuerpo2}" stroke-width="4" stroke-linecap="round"/>
    <path d="M129 110 h16" stroke="${g.cuerpo2}" stroke-width="4" stroke-linecap="round"/>
    <path d="M52 128 h14" stroke="${g.cuerpo2}" stroke-width="4" stroke-linecap="round"/>
    <path d="M134 128 h14" stroke="${g.cuerpo2}" stroke-width="4" stroke-linecap="round"/>` : '';

  // Manchas del tricolor (naranja y negro sobre blanco)
  const tricolor = g.tricolor ? `
    <path d="M62 60 q-12 18 -2 44 q14 6 22 -4 q-10 -28 -20 -40z" fill="#E8A85C"/>
    <path d="M138 64 q14 16 6 40 q-12 8 -22 -2 q8 -24 16 -38z" fill="#2B2B30"/>
    <ellipse cx="100" cy="150" rx="22" ry="14" fill="#E8A85C" opacity="0.85"/>` : '';

  // Accesorios
  let acc = '';
  if(accesorio==='gorro'){
    acc = `<path d="M62 56 q38 -34 76 0 z" fill="#FF4B4B"/>
           <circle cx="100" cy="22" r="8" fill="white"/>
           <rect x="58" y="52" width="84" height="10" rx="5" fill="white"/>`;
  } else if(accesorio==='gafas'){
    acc = `<circle cx="80" cy="96" r="16" fill="none" stroke="#1A1A1E" stroke-width="4"/>
           <circle cx="120" cy="96" r="16" fill="none" stroke="#1A1A1E" stroke-width="4"/>
           <path d="M96 96 h8" stroke="#1A1A1E" stroke-width="4"/>
           <circle cx="80" cy="96" r="13" fill="#1CB0F6" opacity="0.4"/>
           <circle cx="120" cy="96" r="13" fill="#1CB0F6" opacity="0.4"/>`;
  } else if(accesorio==='capa'){
    acc = `<path d="M48 130 q52 40 104 0 l-8 50 q-44 22 -88 0 z" fill="#FF4B4B" opacity="0.92"/>
           <path d="M60 132 l8 8 M140 132 l-8 8" stroke="#FFC800" stroke-width="3"/>`;
  }

  const corazones = (estado==='comiendo')
    ? `<text x="150" y="50" font-size="22">❤️</text><text x="40" y="60" font-size="16">❤️</text>` : '';
  const zzz = (estado==='durmiendo')
    ? `<text x="140" y="50" font-size="20" fill="#888">z</text><text x="155" y="38" font-size="14" fill="#aaa">z</text>` : '';

  return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    ${accesorio==='capa'?acc:''}
    <!-- cola -->
    <path d="M150 165 q40 10 36 -30" stroke="${g.cuerpo}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <!-- cuerpo -->
    <ellipse cx="100" cy="150" rx="52" ry="42" fill="${g.cuerpo}"/>
    <ellipse cx="100" cy="160" rx="34" ry="26" fill="${g.panza}"/>
    <!-- patas -->
    <ellipse cx="78" cy="185" rx="13" ry="9" fill="${g.cuerpo}"/>
    <ellipse cx="122" cy="185" rx="13" ry="9" fill="${g.cuerpo}"/>
    <!-- orejas -->
    <path d="M58 68 L48 30 L86 56 z" fill="${g.cuerpo}"/>
    <path d="M142 68 L152 30 L114 56 z" fill="${g.cuerpo}"/>
    <path d="M60 62 L54 40 L78 56 z" fill="${g.oreja}"/>
    <path d="M140 62 L146 40 L122 56 z" fill="${g.oreja}"/>
    <!-- cabeza -->
    <circle cx="100" cy="95" r="50" fill="${g.cuerpo}"/>
    ${rayas}
    ${tricolor}
    <!-- ojos -->
    ${ojoForma}
    <!-- nariz -->
    <path d="M96 108 l8 0 l-4 5 z" fill="${g.nariz}"/>
    ${boca}
    <!-- bigotes -->
    <path d="M50 105 h26 M52 113 h24" stroke="${g.cuerpo2}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <path d="M150 105 h-26 M148 113 h-24" stroke="${g.cuerpo2}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <!-- mejillas -->
    ${estado==='feliz'?`<circle cx="62" cy="112" r="8" fill="#FF9DB0" opacity="0.4"/><circle cx="138" cy="112" r="8" fill="#FF9DB0" opacity="0.4"/>`:''}
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
  // Accesorios (de héroe)
  {id:"gorro", nombre:"Gorrito",       emoji:"🎩", precio:25, tipo:"accesorio"},
  {id:"gafas", nombre:"Gafas cool",    emoji:"🕶️", precio:30, tipo:"accesorio"},
  {id:"capa",  nombre:"Capa de héroe", emoji:"🦸", precio:50, tipo:"accesorio"},
  // Juguetes
  {id:"pelota", nombre:"Pelota", emoji:"⚽", precio:15, tipo:"juguete", felicidad:10},
  {id:"raton",  nombre:"Ratón",  emoji:"🐭", precio:15, tipo:"juguete", felicidad:10},
];
