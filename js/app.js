// ════════════════════════════════════════════════════════════
//  Academia de Jerónimo — Lógica Principal
// ════════════════════════════════════════════════════════════

const NOMBRE = "Jerónimo";
const PREGUNTAS_POR_SESION = 10;

// ──────── Estado persistente (localStorage) ────────
const Estado = {
  datos: { nivel:1, xp:0, estrellas:0, monedas:10, progreso:{},
           gata:null, felicidad:80, hambre:50, comprados:[], accesorio:null,
           ultimaVisita:Date.now() },
  cargar() {
    try {
      const g = localStorage.getItem('academia_jeronimo');
      if (g) this.datos = JSON.parse(g);
    } catch(e){}
    if (!this.datos.progreso) this.datos.progreso = {};
    if (this.datos.gata===undefined) this.datos.gata=null;
    if (this.datos.felicidad===undefined) this.datos.felicidad=80;
    if (this.datos.hambre===undefined) this.datos.hambre=50;
    if (!this.datos.comprados) this.datos.comprados=[];
    if (this.datos.accesorio===undefined) this.datos.accesorio=null;
    // Bajar felicidad/subir hambre con el tiempo
    const horas = (Date.now()-(this.datos.ultimaVisita||Date.now()))/3600000;
    if(horas>0){
      this.datos.felicidad = Math.max(0, this.datos.felicidad - Math.floor(horas*5));
      this.datos.hambre = Math.min(100, this.datos.hambre + Math.floor(horas*8));
    }
    this.datos.ultimaVisita = Date.now();
  },
  guardar() {
    this.datos.ultimaVisita = Date.now();
    try { localStorage.setItem('academia_jeronimo', JSON.stringify(this.datos)); } catch(e){}
  },
  reiniciar() {
    const gata = this.datos.gata; // conservar la gata elegida
    this.datos = { nivel:1, xp:0, estrellas:0, monedas:10, progreso:{},
                   gata:gata, felicidad:80, hambre:50, comprados:[], accesorio:null,
                   ultimaVisita:Date.now() };
    this.guardar();
  },
  registrarModulo(clave, aciertos, total) {
    const p = this.datos.progreso[clave] || {aciertos:0, intentos:0};
    p.aciertos += aciertos;
    p.intentos += total;
    p.pct = Math.round((p.aciertos / p.intentos) * 100);
    this.datos.progreso[clave] = p;
  }
};

// ──────── Navegación entre pantallas ────────
function mostrarPantalla(id) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  document.getElementById(id).classList.add('activa');
}

// ──────── Utilidades de color ────────
function oscurecer(hex, amt=35){
  let r=Math.max(0,parseInt(hex.slice(1,3),16)-amt);
  let g=Math.max(0,parseInt(hex.slice(3,5),16)-amt);
  let b=Math.max(0,parseInt(hex.slice(5,7),16)-amt);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}
function mezclar(arr){ return arr.map(x=>[Math.random(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }
function elegir(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// ════════════════════════════════════════════════════════════
//  GENERADOR DE EJERCICIOS
// ════════════════════════════════════════════════════════════

function generarEjercicio(clave) {
  switch(clave){
    case 'numeros':    return ejNumeros();
    case 'vocales':    return ejVocales();
    case 'abecedario': return ejAbecedario();
    case 'colores':    return ejColores();
    case 'figuras':    return ejFiguras();
    case 'cuerpo':     return ejCuerpo();
    case 'animales':   return ejAnimales();
    case 'frutas':     return ejFrutas();
    case 'ingles':     return ejIngles();
    case 'transporte': return ejTransporte();
  }
}

const NUM_COLORS=["#FF4B4B","#FF9600","#FFC800","#58CC02","#1CB0F6","#CE82FF","#FF86D0","#1CB0F6","#58CC02","#FF4B4B","#1CB0F6","#CE82FF","#FFC800","#FF9600","#FF86D0","#58CC02","#1CB0F6","#FF4B4B","#CE82FF","#FF9600"];

function ejNumeros(){
  const tipo = Math.random();
  if (tipo < 0.5) {
    // Identificar número
    const n = 1 + Math.floor(Math.random()*9); // 1-9 para niños
    const opciones = generarOpcionesNum(n);
    return {
      pregunta: `${NOMBRE}, ¿qué número es este?`,
      respuesta: NUMEROS[n].es,
      respuestaNum: String(n),
      render: {tipo:'numero', valor:n, color:NUM_COLORS[n-1]},
      opciones: opciones.map(x => ({txt:String(x), correcta:x===n}))
    };
  } else {
    // Contar objetos
    const n = 1 + Math.floor(Math.random()*5);
    const opciones = generarOpcionesNum(n);
    return {
      pregunta: `${NOMBRE}, ¿cuántos hay?`,
      respuesta: NUMEROS[n].es,
      respuestaNum: String(n),
      render: {tipo:'conteo', valor:n},
      opciones: opciones.map(x => ({txt:String(x), correcta:x===n}))
    };
  }
}
function generarOpcionesNum(n){
  const set = new Set([n]);
  while(set.size<4){ let r=Math.max(1,n+Math.floor(Math.random()*7)-3); if(r>=1&&r<=20) set.add(r); }
  return mezclar([...set]);
}

function ejVocales(){
  const v = elegir(VOCALES);
  const otras = mezclar(VOCALES.filter(x=>x.letra!==v.letra)).slice(0,3);
  const ops = mezclar([v,...otras]);
  return {
    pregunta:`${NOMBRE}, ¿qué vocal es esta?`,
    respuesta:v.nombre, respuestaNum:v.letra.toLowerCase(),
    render:{tipo:'letra', valor:v.letra.toLowerCase(), color:v.color},
    opciones:ops.map(x=>({txt:x.letra.toLowerCase(), correcta:x.letra===v.letra}))
  };
}

function ejAbecedario(){
  const idx = Math.floor(Math.random()*ABECEDARIO.length);
  const l = ABECEDARIO[idx];
  const otras = mezclar(ABECEDARIO.filter(x=>x.letra!==l.letra)).slice(0,3);
  const ops = mezclar([l,...otras]);
  return {
    pregunta:`${NOMBRE}, ¿qué letra es esta?`,
    respuesta:l.letra.toLowerCase(), respuestaNum:l.letra.toLowerCase(),
    render:{tipo:'letra', valor:l.letra.toLowerCase(), color:ABC_COLORES[idx%ABC_COLORES.length]},
    opciones:ops.map(x=>({txt:x.letra.toLowerCase(), correcta:x.letra===l.letra}))
  };
}

function ejColores(){
  const c = elegir(COLORES_CURR);
  const otras = mezclar(COLORES_CURR.filter(x=>x.es!==c.es)).slice(0,3);
  const ops = mezclar([c,...otras]);
  return {
    pregunta:`${NOMBRE}, ¿de qué color es?`,
    respuesta:c.es, respuestaNum:c.es,
    render:{tipo:'color', color:c.hex},
    opciones:ops.map(x=>({txt:x.es, correcta:x.es===c.es}))
  };
}

function ejFiguras(){
  const f = elegir(FIGURAS);
  const otras = mezclar(FIGURAS.filter(x=>x.es!==f.es)).slice(0,3);
  const ops = mezclar([f,...otras]);
  return {
    pregunta:`${NOMBRE}, ¿qué figura es esta?`,
    respuesta:f.es, respuestaNum:f.es,
    render:{tipo:'figura', figura:f.es, color:FIG_HEX[f.es]},
    opciones:ops.map(x=>({txt:x.es, correcta:x.es===f.es}))
  };
}

function ejCuerpo(){
  const c = elegir(CUERPO);
  const otras = mezclar(CUERPO.filter(x=>x.es!==c.es)).slice(0,3);
  const ops = mezclar([c,...otras]);
  return {
    pregunta:`${NOMBRE}, ¿qué parte del cuerpo es?`,
    respuesta:c.es, respuestaNum:c.es,
    render:{tipo:'img', img:c.img},
    opciones:ops.map(x=>({txt:x.es, correcta:x.es===c.es}))
  };
}

function ejAnimales(){
  const a = elegir(ANIMALES);
  if (Math.random() < 0.8) {
    const otras = mezclar(ANIMALES.filter(x=>x.es!==a.es)).slice(0,3);
    const ops = mezclar([a,...otras]);
    return {
      pregunta:`${NOMBRE}, ¿qué animal es este?`,
      respuesta:a.es, respuestaNum:a.es,
      render:{tipo:'img', img:a.img},
      opciones:ops.map(x=>({txt:x.es, correcta:x.es===a.es}))
    };
  } else {
    const otras = mezclar(ANIMALES.filter(x=>x.es!==a.es)).slice(0,3);
    const ops = mezclar([a,...otras]);
    return {
      pregunta:`${NOMBRE}, ¿cómo se dice ${a.es} en inglés?`,
      respuesta:a.en, respuestaNum:a.en,
      render:{tipo:'img', img:a.img},
      opciones:ops.map(x=>({txt:x.en, correcta:x.es===a.es}))
    };
  }
}

function ejFrutas(){
  const f = elegir(FRUTAS);
  if (Math.random() < 0.8) {
    const otras = mezclar(FRUTAS.filter(x=>x.es!==f.es)).slice(0,3);
    const ops = mezclar([f,...otras]);
    return {
      pregunta:`${NOMBRE}, ¿qué fruta es esta?`,
      respuesta:f.es, respuestaNum:f.es,
      render:{tipo:'img', img:f.img},
      opciones:ops.map(x=>({txt:x.es, correcta:x.es===f.es}))
    };
  } else {
    const otras = mezclar(FRUTAS.filter(x=>x.es!==f.es)).slice(0,3);
    const ops = mezclar([f,...otras]);
    return {
      pregunta:`${NOMBRE}, ¿cómo se dice ${f.es} en inglés?`,
      respuesta:f.en, respuestaNum:f.en,
      render:{tipo:'img', img:f.img},
      opciones:ops.map(x=>({txt:x.en, correcta:x.es===f.es}))
    };
  }
}

function ejIngles(){
  const p = elegir(INGLES);
  const otras = mezclar(INGLES.filter(x=>x.es!==p.es)).slice(0,3);
  const ops = mezclar([p,...otras]);
  return {
    pregunta:`${NOMBRE}, ¿cómo se dice ${p.es} en inglés?`,
    respuesta:p.en, respuestaNum:p.en,
    render:{tipo:'img', img:p.img},
    opciones:ops.map(x=>({txt:x.en, correcta:x.es===p.es}))
  };
}

function ejTransporte(){
  const t = elegir(TRANSPORTE);
  const otras = mezclar(TRANSPORTE.filter(x=>x.es!==t.es)).slice(0,3);
  const ops = mezclar([t,...otras]);
  return {
    pregunta:`${NOMBRE}, ¿qué transporte es este?`,
    respuesta:t.es, respuestaNum:t.es,
    render:{tipo:'img', img:t.img},
    opciones:ops.map(x=>({txt:x.es, correcta:x.es===t.es}))
  };
}

// ════════════════════════════════════════════════════════════
//  RENDER DE IMÁGENES
// ════════════════════════════════════════════════════════════

function renderImagen(render){
  const cont = document.getElementById('imagen-cont');
  cont.innerHTML = '';
  const r = render;
  if (r.tipo==='img'){
    const im=document.createElement('img'); im.src=`img/${r.img}.png`; im.alt='';
    cont.appendChild(im);
  } else if (r.tipo==='numero'){
    const d=document.createElement('div'); d.className='imagen-num';
    d.style.background=r.color; d.textContent=r.valor;
    d.style.boxShadow='inset 0 -6px 10px rgba(0,0,0,.2)'; cont.appendChild(d);
  } else if (r.tipo==='letra'){
    const d=document.createElement('div'); d.className='imagen-letra';
    d.style.background=r.color; d.textContent=r.valor;
    d.style.boxShadow='inset 0 -6px 10px rgba(0,0,0,.2)'; cont.appendChild(d);
  } else if (r.tipo==='color'){
    const d=document.createElement('div'); d.className='imagen-color';
    d.style.background=r.color;
    if(r.color==='#FFFFFF') d.style.border='3px solid #E8DCC8';
    cont.appendChild(d);
  } else if (r.tipo==='figura'){
    cont.appendChild(svgFigura(r.figura, r.color));
  } else if (r.tipo==='conteo'){
    const wrap=document.createElement('div'); wrap.className='imagen-conteo';
    const cols=["#FF4B4B","#1CB0F6","#58CC02","#FFC800","#CE82FF"];
    for(let i=0;i<r.valor;i++){
      const p=document.createElement('div'); p.className='punto-conteo';
      p.style.background=cols[i%cols.length]; wrap.appendChild(p);
    }
    cont.appendChild(wrap);
  }
}

function svgFigura(figura, color){
  const oc=oscurecer(color,30);
  const ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 180 180'); svg.setAttribute('class','imagen-figura');
  let el;
  const set=(e,a)=>{for(let k in a)e.setAttribute(k,a[k]);};
  if(figura==='círculo'){el=document.createElementNS(ns,'circle');set(el,{cx:90,cy:90,r:75,fill:color,stroke:oc,'stroke-width':6});}
  else if(figura==='cuadrado'){el=document.createElementNS(ns,'rect');set(el,{x:18,y:18,width:144,height:144,rx:16,fill:color,stroke:oc,'stroke-width':6});}
  else if(figura==='triángulo'){el=document.createElementNS(ns,'polygon');set(el,{points:'90,15 165,160 15,160',fill:color,stroke:oc,'stroke-width':6});}
  else if(figura==='rectángulo'){el=document.createElementNS(ns,'rect');set(el,{x:15,y:50,width:150,height:80,rx:14,fill:color,stroke:oc,'stroke-width':6});}
  else if(figura==='óvalo'){el=document.createElementNS(ns,'ellipse');set(el,{cx:90,cy:90,rx:78,ry:52,fill:color,stroke:oc,'stroke-width':6});}
  else if(figura==='estrella'){el=document.createElementNS(ns,'polygon');set(el,{points:estrellaPts(90,90,75,32,5),fill:color,stroke:oc,'stroke-width':6});}
  else if(figura==='diamante'){el=document.createElementNS(ns,'polygon');set(el,{points:'90,15 150,90 90,165 30,90',fill:color,stroke:oc,'stroke-width':6});}
  svg.appendChild(el);
  return svg;
}
function estrellaPts(cx,cy,re,ri,n){
  let p=[];
  for(let i=0;i<n*2;i++){const a=Math.PI/n*i-Math.PI/2;const r=i%2===0?re:ri;p.push(`${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`);}
  return p.join(' ');
}

// ════════════════════════════════════════════════════════════
//  JUEGO
// ════════════════════════════════════════════════════════════

const Juego = {
  clave:null, modulo:null, n:0, aciertos:0, errores:0, ej:null, respondido:false, timer:null,

  iniciar(clave){
    this.clave=clave;
    this.modulo=MODULOS.find(m=>m.clave===clave);
    this.n=0; this.aciertos=0; this.errores=0; this.respondido=false;

    // Pintar header con color del módulo
    const col=this.modulo.color;
    document.getElementById('juego-header').style.background=col;
    document.getElementById('pregunta-banda').style.background=col;
    document.getElementById('barra-progreso-fill').style.background=col;
    document.getElementById('juego-titulo').textContent=this.modulo.nombre;
    document.getElementById('juego-estrellas').textContent='⭐ 0';

    mostrarPantalla('pantalla-juego');
    // Gata acompañante
    const ga=document.getElementById('gata-acompanante');
    if(ga && Estado.datos.gata){
      const g=GATAS.find(x=>x.id===Estado.datos.gata);
      if(g) ga.innerHTML=svgGata(g,'feliz',80,Estado.datos.accesorio);
    }
    Voz.decir(`¡Hola ${NOMBRE}! ¡Vamos a practicar ${this.modulo.nombre}!`, ()=>{
      setTimeout(()=>this.siguiente(), 300);
    });
  },

  siguiente(){
    if(this.timer){clearTimeout(this.timer); this.timer=null;}
    Microfono.detener();
    this.ocultarOverlay();
    if(this.n >= PREGUNTAS_POR_SESION){ this.finalizar(); return; }
    this.n++;
    this.respondido=false;
    document.getElementById('juego-progreso').textContent=`${this.n}/${PREGUNTAS_POR_SESION}`;
    document.getElementById('barra-progreso-fill').style.width=`${(this.n/PREGUNTAS_POR_SESION)*100}%`;

    this.ej = generarEjercicio(this.clave);
    renderImagen(this.ej.render);
    document.getElementById('pregunta-texto').textContent=this.ej.pregunta;

    // Mostrar opciones vacías mientras habla
    document.getElementById('opciones-grid').innerHTML='';
    document.getElementById('mic-texto').textContent='🔊 Escucha...';
    document.getElementById('btn-hablar').classList.remove('escuchando');
    document.getElementById('btn-hablar').textContent='🎤 Hablar';

    // Voz lee la pregunta → luego muestra opciones
    Voz.decir(this.ej.pregunta, ()=>{
      if(this.respondido) return;
      this.mostrarOpciones();
      this.timer=setTimeout(()=>this.activarMic(), 4500);
    });
  },

  mostrarOpciones(){
    const grid=document.getElementById('opciones-grid');
    grid.innerHTML='';
    document.getElementById('mic-texto').textContent='';
    this.ej.opciones.forEach((op,i)=>{
      const b=document.createElement('button');
      b.className='btn-opcion';
      b.style.background=COLORES_BTN[i%4];
      b.style.boxShadow=`0 5px 0 ${oscurecer(COLORES_BTN[i%4],35)}`;
      b.textContent=op.txt;
      b.onclick=()=>this.responder(op, b);
      grid.appendChild(b);
    });
  },

  activarMic(){
    if(this.respondido || !Microfono.disponible) {
      if(!Microfono.disponible) document.getElementById('mic-texto').textContent='Toca una respuesta 👆';
      return;
    }
    const btn=document.getElementById('btn-hablar');
    btn.classList.add('escuchando'); btn.textContent='🔴 Escuchando';
    document.getElementById('mic-texto').textContent=`¡Habla, ${NOMBRE}!`;
    Microfono.escuchar((txt, ok)=>{
      btn.classList.remove('escuchando'); btn.textContent='🎤 Hablar';
      document.getElementById('mic-texto').textContent='';
      if(this.respondido) return;
      if(ok && txt){
        const dichos = txt.split('|');
        const acerto = this.ej.opciones.find(o=>o.correcta &&
          dichos.some(d => d.includes(o.txt.toLowerCase()) ||
                           (this.ej.respuestaNum && d.includes(this.ej.respuestaNum.toLowerCase()))));
        if(acerto){
          const btns=[...document.querySelectorAll('.btn-opcion')];
          const bc=btns.find(b=>b.textContent===acerto.txt);
          this.responder(acerto, bc);
        } else {
          document.getElementById('mic-texto').textContent='No te entendí, ¡toca la respuesta!';
        }
      } else {
        document.getElementById('mic-texto').textContent='¡Toca la respuesta! 👆';
      }
    });
  },

  responder(op, btn){
    if(this.respondido) return;
    this.respondido=true;
    if(this.timer){clearTimeout(this.timer); this.timer=null;}
    Microfono.detener();

    if(op.correcta){
      this.aciertos++;
      if(btn) btn.classList.add('correcta');
      document.getElementById('juego-estrellas').textContent=`⭐ ${this.aciertos}`;
      this.mostrarOverlay(true, '¡Muy bien!');
      Sonido.correcto();
      Voz.felicitar(NOMBRE);
      const ga=document.getElementById('gata-acompanante');
      if(ga && Estado.datos.gata){
        const g=GATAS.find(x=>x.id===Estado.datos.gata);
        if(g){ ga.innerHTML=svgGata(g,'comiendo',80,Estado.datos.accesorio);
          setTimeout(()=>{ if(g) ga.innerHTML=svgGata(g,'feliz',80,Estado.datos.accesorio);},700); }
      }
    } else {
      this.errores++;
      if(btn) btn.classList.add('incorrecta');
      this.mostrarOverlay(false, `Era: ${this.ej.respuesta}`);
      Sonido.error();
      Voz.animar(NOMBRE, this.ej.respuesta);
    }
    this.timer=setTimeout(()=>this.siguiente(), 2300);
  },

  mostrarOverlay(ok, txt){
    const ov=document.getElementById('overlay-feedback');
    ov.textContent=(ok?'✓ ':'✗ ')+txt;
    ov.className='overlay-feedback mostrar '+(ok?'ok':'mal');
  },
  ocultarOverlay(){
    document.getElementById('overlay-feedback').className='overlay-feedback';
  },

  finalizar(){
    Estado.registrarModulo(this.clave, this.aciertos, PREGUNTAS_POR_SESION);
    const estrellasGanadas = this.aciertos>=8?3 : this.aciertos>=5?2 : 1;
    Estado.datos.estrellas += estrellasGanadas;
    Estado.datos.monedas += this.aciertos*2;
    Estado.datos.xp += this.aciertos*10;
    while(Estado.datos.xp >= 100){ Estado.datos.xp-=100; Estado.datos.nivel++; }
    Estado.guardar();

    const pct=Math.round((this.aciertos/PREGUNTAS_POR_SESION)*100);
    let emoji,titulo;
    if(pct>=80){emoji='🏆'; titulo='¡Eres un genio!';}
    else if(pct>=50){emoji='⭐'; titulo='¡Muy bien!';}
    else {emoji='💪'; titulo='¡Sigue practicando!';}

    document.getElementById('resultado-emoji').textContent=emoji;
    document.getElementById('resultado-titulo').textContent=titulo;
    document.getElementById('resultado-stats').innerHTML=
      `<div>✅ ${this.aciertos}/${PREGUNTAS_POR_SESION}</div>`+
      `<div>⭐ +${estrellasGanadas}</div>`+
      `<div>🪙 +${this.aciertos*2}</div>`;
    mostrarPantalla('pantalla-resultado');
    lanzarConfeti();
    Voz.decir(`${titulo} Conseguiste ${this.aciertos} de ${PREGUNTAS_POR_SESION}.`);
  }
};

// ════════════════════════════════════════════════════════════
//  SONIDOS (Web Audio API)
// ════════════════════════════════════════════════════════════
const Sonido = {
  ctx:null,
  init(){ try{ this.ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} },
  tono(freq,dur,delay=0,tipo='sine'){
    if(!this.ctx) return;
    const o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=tipo; o.frequency.value=freq;
    o.connect(g); g.connect(this.ctx.destination);
    const t=this.ctx.currentTime+delay;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(0.3,t+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.start(t); o.stop(t+dur);
  },
  correcto(){ this.tono(523,0.15,0); this.tono(659,0.15,0.12); this.tono(784,0.25,0.24); },
  error(){ this.tono(300,0.2,0,'square'); this.tono(200,0.3,0.18,'square'); },
  click(){ this.tono(600,0.08,0); }
};

// ════════════════════════════════════════════════════════════
//  CONFETI
// ════════════════════════════════════════════════════════════
function lanzarConfeti(){
  const cont=document.getElementById('confeti-cont');
  cont.innerHTML='';
  const cols=['#FF4B4B','#1CB0F6','#58CC02','#FFC800','#CE82FF','#FF86D0'];
  for(let i=0;i<60;i++){
    const c=document.createElement('div'); c.className='confeti';
    c.style.left=Math.random()*100+'%';
    c.style.background=cols[i%cols.length];
    c.style.animationDuration=(2+Math.random()*2)+'s';
    c.style.animationDelay=Math.random()*0.5+'s';
    if(Math.random()>0.5) c.style.borderRadius='50%';
    cont.appendChild(c);
  }
}

// ════════════════════════════════════════════════════════════
//  MASCOTA — selección, escena, tienda
// ════════════════════════════════════════════════════════════
function pintarElegirGata(){
  const grid=document.getElementById('gatas-grid');
  grid.innerHTML='';
  GATAS.forEach(g=>{
    const card=document.createElement('button');
    card.className='gata-card';
    card.innerHTML=svgGata(g,'feliz',150)+`<div class="gn">${g.nombre}</div>`;
    card.onclick=()=>{
      Estado.datos.gata=g.id; Estado.guardar();
      Sonido.click();
      Voz.decir(`¡Qué linda gatita! Ahora vamos a aprender, ${NOMBRE}.`);
      pintarMenu(); mostrarPantalla('pantalla-menu');
    };
    grid.appendChild(card);
  });
}

function estadoGata(){
  const d=Estado.datos;
  if(d.hambre>=70) return 'hambre';
  if(d.felicidad>=70) return 'feliz';
  return 'normal';
}

function pintarMascota(){
  const d=Estado.datos;
  const g=GATAS.find(x=>x.id===d.gata)||GATAS[0];
  document.getElementById('mascota-nombre').textContent=g.nombre;
  document.getElementById('mascota-monedas').textContent=d.monedas;
  document.getElementById('mascota-escena').innerHTML=svgGata(g,estadoGata(),200,d.accesorio);
  document.getElementById('felicidad-fill').style.width=d.felicidad+'%';
  document.getElementById('hambre-fill').style.width=d.hambre+'%';
  document.getElementById('tienda-grid').innerHTML='';
}

function pintarTienda(){
  const d=Estado.datos;
  const grid=document.getElementById('tienda-grid');
  grid.innerHTML='';
  TIENDA.forEach(item=>{
    const div=document.createElement('div');
    const esAccesorio=item.tipo==='accesorio';
    const comprado=esAccesorio && d.comprados.includes(item.id);
    const puede=d.monedas>=item.precio;
    div.className='tienda-item'+(comprado?' comprado':'')+(!puede&&!comprado?' bloqueado':'');
    div.innerHTML=`<div class="ti-emoji">${item.emoji}</div>
      <div class="ti-nombre">${item.nombre}</div>
      <div class="ti-precio">${comprado?'✓ Tuyo':'🪙 '+item.precio}</div>`;
    div.onclick=()=>comprarItem(item);
    grid.appendChild(div);
  });
}

function comprarItem(item){
  const d=Estado.datos;
  const esAccesorio=item.tipo==='accesorio';
  if(esAccesorio && d.comprados.includes(item.id)){
    // Ya comprado → ponérselo / quitárselo
    d.accesorio = (d.accesorio===item.id)? null : item.id;
    Estado.guardar(); pintarMascota(); pintarTienda(); Sonido.click();
    return;
  }
  if(d.monedas<item.precio){
    Voz.decir(`Necesitas más monedas, ${NOMBRE}. ¡Juega para ganar!`);
    return;
  }
  d.monedas-=item.precio;
  Sonido.correcto();
  if(item.tipo==='comida' || item.tipo==='juguete'){
    d.felicidad=Math.min(100,d.felicidad+(item.felicidad||10));
    if(item.tipo==='comida') d.hambre=Math.max(0,d.hambre-30);
    // Animación de comer
    const g=GATAS.find(x=>x.id===d.gata)||GATAS[0];
    document.getElementById('mascota-escena').innerHTML=svgGata(g,'comiendo',200,d.accesorio);
    Voz.decir(item.tipo==='comida'?`¡Ñam ñam! Gracias ${NOMBRE}.`:`¡Qué divertido!`);
    setTimeout(()=>pintarMascota(),1200);
  } else if(esAccesorio){
    d.comprados.push(item.id);
    d.accesorio=item.id;
    Voz.decir(`¡Qué elegante se ve!`);
    pintarMascota();
  }
  Estado.guardar();
  document.getElementById('mascota-monedas').textContent=d.monedas;
  pintarTienda();
}

// ════════════════════════════════════════════════════════════
//  MINI-JUEGO — Atrapa la comida (pausa activa)
// ════════════════════════════════════════════════════════════
const MiniJuego = {
  puntos:0, tiempo:20, timer:null, spawnTimer:null, cestaX:50, activo:false,

  iniciar(){
    this.puntos=0; this.tiempo=20; this.cestaX=50; this.activo=true;
    document.getElementById('mj-puntos').textContent='0';
    document.getElementById('mj-tiempo').textContent='20';
    const area=document.getElementById('mj-area');
    area.innerHTML='';
    // Gato con cesta abajo
    const g=GATAS.find(x=>x.id===Estado.datos.gata)||GATAS[0];
    const cesta=document.createElement('div');
    cesta.className='mj-gato-cesta'; cesta.id='mj-cesta';
    cesta.innerHTML='🧺'; cesta.style.left='50%';
    area.appendChild(cesta);
    mostrarPantalla('pantalla-minijuego');
    Voz.decir(`¡Atrapa la comida con la cesta, ${NOMBRE}! Mueve el dedo.`);

    // Mover cesta con mouse/touch
    area.onmousemove=(e)=>this.mover(e.clientX, area);
    area.ontouchmove=(e)=>{e.preventDefault(); this.mover(e.touches[0].clientX, area);};

    this.timer=setInterval(()=>{
      this.tiempo--;
      document.getElementById('mj-tiempo').textContent=this.tiempo;
      if(this.tiempo<=0) this.fin();
    },1000);
    this.spawnTimer=setInterval(()=>this.soltar(area),900);
  },

  mover(clientX, area){
    const r=area.getBoundingClientRect();
    let x=((clientX-r.left)/r.width)*100;
    x=Math.max(5,Math.min(95,x));
    this.cestaX=x;
    document.getElementById('mj-cesta').style.left=x+'%';
  },

  soltar(area){
    if(!this.activo) return;
    const comidas=['🍎','🍪','🐟','🥛','⭐','🍌'];
    const o=document.createElement('div');
    o.className='mj-objeto mj-cae';
    o.textContent=comidas[Math.floor(Math.random()*comidas.length)];
    const x=5+Math.random()*85;
    o.style.left=x+'%';
    o.style.animationDuration=(2.5+Math.random()*1.5)+'s';
    area.appendChild(o);
    // Detectar si llega abajo cerca de la cesta
    const check=setInterval(()=>{
      if(!this.activo){clearInterval(check);o.remove();return;}
      const or=o.getBoundingClientRect(), ar=area.getBoundingClientRect();
      const oy=((or.top-ar.top)/ar.height)*100;
      const ox=((or.left-ar.left)/ar.width)*100;
      if(oy>82){
        if(Math.abs(ox-this.cestaX)<12){
          this.puntos++;
          document.getElementById('mj-puntos').textContent=this.puntos;
          Sonido.tono(700,0.1,0);
        }
        clearInterval(check); o.remove();
      }
    },100);
    setTimeout(()=>{try{o.remove();clearInterval(check);}catch(e){}},5000);
  },

  fin(){
    this.activo=false;
    clearInterval(this.timer); clearInterval(this.spawnTimer);
    // Recompensa: monedas = puntos
    Estado.datos.monedas+=this.puntos;
    Estado.datos.felicidad=Math.min(100,Estado.datos.felicidad+20);
    Estado.guardar();
    Voz.decir(`¡Genial ${NOMBRE}! Atrapaste ${this.puntos} y ganaste ${this.puntos} monedas.`);
    setTimeout(()=>{ pintarMascota(); mostrarPantalla('pantalla-mascota'); },800);
  },

  salir(){
    this.activo=false;
    clearInterval(this.timer); clearInterval(this.spawnTimer);
    pintarMascota(); mostrarPantalla('pantalla-mascota');
  }
};

// ════════════════════════════════════════════════════════════
//  MENÚ
// ════════════════════════════════════════════════════════════
function pintarMenu(){
  document.getElementById('stat-estrellas').textContent=Estado.datos.estrellas;
  document.getElementById('stat-monedas').textContent=Estado.datos.monedas;
  document.getElementById('stat-nivel').textContent=Estado.datos.nivel;
  document.getElementById('xp-fill').style.width=Estado.datos.xp+'%';
  document.getElementById('xp-texto').textContent=`${Estado.datos.xp}/100 XP`;

  const grid=document.getElementById('grid-modulos');
  grid.innerHTML='';
  MODULOS.forEach(m=>{
    const prog=Estado.datos.progreso[m.clave];
    const card=document.createElement('button');
    card.className='card-modulo';
    card.style.background=m.color;
    card.style.boxShadow=`0 6px 0 ${oscurecer(m.color,35)}`;
    const estado = prog ? `${prog.pct}%` : '¡Jugar!';
    card.innerHTML=`
      <div class="card-circulo"><img src="img/${m.img}.png" alt=""></div>
      <div class="card-nombre">${m.nombre}</div>
      <div class="card-estado">${estado}</div>`;
    card.onclick=()=>{ Sonido.click(); Juego.iniciar(m.clave); };
    grid.appendChild(card);
  });
}

// ════════════════════════════════════════════════════════════
//  PANEL PADRES
// ════════════════════════════════════════════════════════════
function pintarPadres(){
  const cuerpo=document.getElementById('padres-cuerpo');
  const d=Estado.datos;
  let totalAciertos=0, totalIntentos=0;
  Object.values(d.progreso).forEach(p=>{totalAciertos+=p.aciertos; totalIntentos+=p.intentos;});
  const pctGral = totalIntentos? Math.round(totalAciertos/totalIntentos*100):0;

  let html=`<div class="padres-stats-grid">
    <div class="padres-stat"><div class="num">${d.nivel}</div><div class="lbl">Nivel</div></div>
    <div class="padres-stat"><div class="num">${d.estrellas}</div><div class="lbl">⭐ Estrellas</div></div>
    <div class="padres-stat"><div class="num">${d.monedas}</div><div class="lbl">🪙 Monedas</div></div>
    <div class="padres-stat"><div class="num">${pctGral}%</div><div class="lbl">Precisión</div></div>
  </div>
  <h3 style="text-align:center; margin:10px 0 16px; color:var(--texto);">Progreso por módulo</h3>`;

  MODULOS.forEach(m=>{
    const p=d.progreso[m.clave];
    const pct=p?p.pct:0;
    html+=`<div class="padres-modulo">
      <span class="pm-nombre">${m.nombre}</span>
      <div class="pm-barra"><div class="pm-fill" style="width:${pct}%; background:${m.color}"></div></div>
      <span class="pm-pct">${pct}%</span>
    </div>`;
  });
  cuerpo.innerHTML=html;
}

// ════════════════════════════════════════════════════════════
//  ESTRELLAS DE FONDO (bienvenida)
// ════════════════════════════════════════════════════════════
function pintarEstrellasFondo(){
  const cont=document.getElementById('estrellas-fondo');
  for(let i=0;i<20;i++){
    const e=document.createElement('div');
    e.className='estrella-deco';
    e.textContent=elegir(['⭐','✨','🌟','💫']);
    e.style.left=Math.random()*100+'%';
    e.style.top=Math.random()*100+'%';
    e.style.fontSize=(16+Math.random()*24)+'px';
    e.style.animationDuration=(3+Math.random()*4)+'s';
    cont.appendChild(e);
  }
}

// ════════════════════════════════════════════════════════════
//  INICIALIZACIÓN
// ════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', ()=>{
  Estado.cargar();
  Voz.init();
  Microfono.init();
  Sonido.init();
  pintarEstrellasFondo();

  document.getElementById('btn-empezar').onclick=()=>{
    Sonido.init();
    if(Sonido.ctx && Sonido.ctx.state==='suspended') Sonido.ctx.resume();
    // Si no ha elegido gata, mostrar selección primero
    if(!Estado.datos.gata){
      pintarElegirGata();
      mostrarPantalla('pantalla-elegir-gata');
      Voz.decir(`¡Hola ${NOMBRE}! Elige tu gatita favorita.`);
    } else {
      pintarMenu();
      mostrarPantalla('pantalla-menu');
      Voz.decir(`¡Hola ${NOMBRE}! ¿Qué quieres aprender hoy?`);
    }
  };

  // Mascota
  document.getElementById('btn-mimascota').onclick=()=>{
    if(!Estado.datos.gata){ pintarElegirGata(); mostrarPantalla('pantalla-elegir-gata'); return; }
    pintarMascota(); mostrarPantalla('pantalla-mascota');
    Voz.decir(`¡Hola! Esta es tu gatita, ${NOMBRE}.`);
  };
  document.getElementById('mascota-volver').onclick=()=>{ pintarMenu(); mostrarPantalla('pantalla-menu'); };
  document.getElementById('btn-tienda').onclick=()=>{ Sonido.click(); pintarTienda(); };
  document.getElementById('btn-jugar-gato').onclick=()=>{ Sonido.click(); MiniJuego.iniciar(); };
  document.getElementById('mj-salir').onclick=()=>MiniJuego.salir();

  document.getElementById('btn-salir').onclick=()=>{
    Voz.detener(); Microfono.detener();
    if(Juego.timer) clearTimeout(Juego.timer);
    pintarMenu(); mostrarPantalla('pantalla-menu');
  };
  document.getElementById('btn-otra-vez').onclick=()=>Juego.iniciar(Juego.clave);
  document.getElementById('btn-volver-menu').onclick=()=>{ pintarMenu(); mostrarPantalla('pantalla-menu'); };

  // Padres
  document.getElementById('btn-padres').onclick=()=>{
    document.getElementById('pin-input').value='';
    document.getElementById('pin-error').textContent='';
    document.getElementById('modal-padres').classList.add('activo');
  };
  document.getElementById('pin-cancelar').onclick=()=>document.getElementById('modal-padres').classList.remove('activo');
  document.getElementById('pin-entrar').onclick=()=>{
    const pin=document.getElementById('pin-input').value;
    if(pin==='1234'){
      document.getElementById('modal-padres').classList.remove('activo');
      pintarPadres(); mostrarPantalla('pantalla-padres');
    } else {
      document.getElementById('pin-error').textContent='PIN incorrecto';
    }
  };
  document.getElementById('padres-volver').onclick=()=>{ pintarMenu(); mostrarPantalla('pantalla-menu'); };
  document.getElementById('padres-reiniciar').onclick=()=>{
    if(confirm('¿Seguro que quieres borrar TODO el progreso de Jerónimo?')){
      Estado.reiniciar(); pintarPadres(); pintarMenu();
      alert('✅ Progreso reiniciado');
    }
  };
});
