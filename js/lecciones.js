// ════════════════════════════════════════════════════════════
//  LECCIONES — "Repite conmigo" (con reconocimiento de voz)
// ════════════════════════════════════════════════════════════

const Leccion = {
  pasos: [], idx: 0, tipo: '', intentos: 0,
  _sesion: 0,        // id de sesión; al salir se invalida todo callback pendiente
  _avanzando: false,

  menu(){
    return [
      {id:'numeros',   titulo:'Contar 1 al 5',  color:'#FF4B4B'},
      {id:'numeros10', titulo:'Contar 1 al 10', color:'#FF9600'},
      {id:'vocales',   titulo:'Las vocales',    color:'#1CB0F6'},
      {id:'colores',   titulo:'Los colores',    color:'#FFC800'},
      {id:'figuras',   titulo:'Las figuras',    color:'#CE82FF'},
      {id:'animales',  titulo:'Los animales',   color:'#58CC02'},
    ];
  },

  // Genera MUCHAS variantes aceptadas para que el reconocimiento sea tolerante
  _aceptaNumero(n){
    const base = {
      1:['uno','un','1'], 2:['dos','2'], 3:['tres','3'], 4:['cuatro','4'],
      5:['cinco','5'], 6:['seis','6'], 7:['siete','7'], 8:['ocho','8'],
      9:['nueve','9'], 10:['diez','10']
    };
    return base[n] || [String(n)];
  },
  _aceptaVocal(v){
    const m = {
      'A':['a','ah','á','la a'], 'E':['e','eh','é','la e'],
      'I':['i','y','ih','la i'], 'O':['o','oh','ó','la o'],
      'U':['u','uh','ú','la u']
    };
    return m[v] || [v.toLowerCase()];
  },

  construirPasos(id){
    if(id==='numeros')   return [1,2,3,4,5].map(n=>({decir:NUMEROS[n].es, acepta:this._aceptaNumero(n), render:{tipo:'numero',valor:n}}));
    if(id==='numeros10') return [1,2,3,4,5,6,7,8,9,10].map(n=>({decir:NUMEROS[n].es, acepta:this._aceptaNumero(n), render:{tipo:'numero',valor:n}}));
    if(id==='vocales')   return VOCALES.map(v=>({decir:'la '+v.nombre, acepta:this._aceptaVocal(v.letra), render:{tipo:'letra',valor:v.letra.toLowerCase(),color:v.color}}));
    if(id==='colores')   return COLORES_CURR.slice(0,6).map(c=>({decir:c.es, acepta:[c.es, c.es+'o', c.es+'a'], render:{tipo:'color',color:c.hex}}));
    if(id==='figuras')   return FIGURAS.map(f=>({decir:f.es, acepta:[f.es, f.es.replace('á','a').replace('í','i').replace('ó','o')], render:{tipo:'figura',figura:f.es,color:FIG_HEX[f.es]}}));
    if(id==='animales')  return ANIMALES.slice(0,8).map(a=>({decir:a.es, acepta:[a.es, a.es.replace('ó','o').replace('á','a')], render:{tipo:'img',img:a.img}}));
    return [];
  },

  iniciar(id){
    this.tipo=id;
    this.pasos=this.construirPasos(id);
    this.idx=0;
    this.intentos=0;
    this._avanzando=false;
    this._sesion++;                       // nueva sesión
    const miSesion=this._sesion;
    const lec=this.menu().find(l=>l.id===id);
    document.getElementById('leccion-header').style.background=lec.color;
    document.getElementById('leccion-titulo').textContent=lec.titulo;
    // Restaurar la zona del micrófono (por si quedó del 'fin')
    document.getElementById('leccion-mic').innerHTML=
      '<button id="leccion-hablar" class="btn-hablar btn-grande">🎤 Hablar</button>';
    mostrarPantalla('pantalla-leccion');
    Voz.decir(`Vamos a aprender. Escucha y repite conmigo, ${NOMBRE}.`, ()=>{
      if(this._vigente(miSesion)) setTimeout(()=>{ if(this._vigente(miSesion)) this.paso(); },300);
    });
  },

  // ¿sigue siendo la misma sesión Y estamos en la pantalla de lección?
  _vigente(miSesion){
    return miSesion===this._sesion &&
           document.getElementById('pantalla-leccion').classList.contains('activa');
  },

  salir(){
    this._sesion++;            // invalida TODO callback pendiente
    this._avanzando=false;
    Voz.detener();
    Microfono.detener();
  },

  paso(){
    const miSesion=this._sesion;
    if(this.idx>=this.pasos.length){ this.fin(); return; }
    this.intentos=0;
    const p=this.pasos[this.idx];
    document.getElementById('leccion-progreso').textContent=`${this.idx+1}/${this.pasos.length}`;
    renderImagenEn('leccion-imagen', p.render);
    document.getElementById('leccion-instruccion').textContent=`Di: "${p.decir}"`;
    document.getElementById('leccion-feedback').textContent='Toca 🎤 y repite';
    document.getElementById('leccion-feedback').style.color='#1CB0F6';
    this._prepararBoton();
    // La voz dice la palabra; al terminar, espera a que el niño toque "Hablar"
    Voz.decir(`Repite conmigo. ${p.decir}`, ()=>{
      if(!this._vigente(miSesion)) return;
      const btn=document.getElementById('leccion-hablar');
      if(btn){ btn.classList.add('pulso'); }
    });
  },

  _prepararBoton(){
    const btn=document.getElementById('leccion-hablar');
    btn.classList.remove('escuchando');
    btn.textContent='🎤 Hablar';
    btn.onclick=()=>{ if(!Microfono.escuchando) this.escuchar(); };
    let mic=document.getElementById('leccion-mic');
    let sig=document.getElementById('leccion-siguiente');
    if(!sig){
      sig=document.createElement('button');
      sig.id='leccion-siguiente';
      sig.className='btn-mediano btn-azul';
      sig.style.marginLeft='10px';
      sig.textContent='Siguiente →';
      mic.appendChild(sig);
    }
    sig.onclick=()=>{ Voz.detener(); Microfono.detener(); this.avanzar(); };
  },

  escuchar(){
    const miSesion=this._sesion;
    if(!this._vigente(miSesion)) return;
    const btn=document.getElementById('leccion-hablar');
    const fb=document.getElementById('leccion-feedback');
    if(!Microfono.disponible){
      fb.textContent='Toca "Siguiente" para continuar 👉';
      fb.style.color='#1CB0F6';
      return;
    }
    btn.textContent='🔴 Te escucho... ¡habla!';
    btn.classList.add('escuchando');
    btn.classList.remove('pulso');
    fb.textContent='';
    Microfono.escuchar((txt,ok,motivo)=>{
      if(!this._vigente(miSesion)) return;
      btn.classList.remove('escuchando');
      btn.textContent='🎤 Hablar';
      const p=this.pasos[this.idx];

      // CASO 1: no se captó voz → NO es error, deja reintentar sin penalizar
      if(!ok && (motivo==='no-speech' || motivo==='timeout' || motivo==='aborted' || motivo==='no-start')){
        fb.textContent='No te escuché. Toca 🎤 y habla fuerte'; fb.style.color='#1CB0F6';
        // no incrementa intentos, no avanza, espera al botón
        return;
      }
      // CASO 2: permiso denegado
      if(!ok && motivo==='not-allowed'){
        fb.textContent='Activa el micrófono o toca "Siguiente"'; fb.style.color='#FF4B4B';
        return;
      }

      const dichos=(txt||'').toLowerCase().split('|').map(s=>s.trim());
      const acerto = ok && txt && dichos.some(d =>
        p.acepta.some(a => d===a || d.includes(a) || a.includes(d)));

      if(acerto){
        fb.textContent='¡Muy bien! 🎉'; fb.style.color='#58CC02';
        Sonido.correcto();
        Voz.decir(`¡Muy bien! Es ${p.decir}.`, ()=>{ if(this._vigente(miSesion)) this.avanzar(); });
      } else {
        // Sí habló pero se equivocó → ahí sí "era ..."
        this.intentos++;
        if(this.intentos>=2){
          fb.textContent=`Era "${p.decir}". ¡Sigamos!`; fb.style.color='#FF9600';
          Voz.decir(`Era ${p.decir}. Sigamos.`, ()=>{ if(this._vigente(miSesion)) this.avanzar(); });
        } else {
          fb.textContent=`Casi. Era "${p.decir}". Inténtalo 🎤`; fb.style.color='#FF9600';
          Voz.decir(`Casi. Era ${p.decir}. Inténtalo otra vez.`);
        }
      }
    });
  },

  avanzar(){
    if(this._avanzando) return;
    this._avanzando=true;
    const miSesion=this._sesion;
    this.idx++;
    setTimeout(()=>{ this._avanzando=false; if(this._vigente(miSesion)) this.paso(); },400);
  },

  fin(){
    Estado.datos.monedas+=5;
    Estado.datos.estrellas+=2;
    Estado.guardar();
    document.getElementById('leccion-imagen').innerHTML='<div style="font-size:90px">🏆</div>';
    document.getElementById('leccion-instruccion').textContent='¡Terminaste la lección!';
    document.getElementById('leccion-feedback').textContent='Ganaste ⭐2 y 🪙5';
    document.getElementById('leccion-feedback').style.color='#58CC02';
    document.getElementById('leccion-mic').innerHTML=
      '<button class="btn-grande btn-verde" id="lec-fin-menu">🏠 Menú</button>';
    document.getElementById('lec-fin-menu').onclick=()=>{ this.salir(); pintarMenu(); mostrarPantalla('pantalla-menu'); };
    Voz.decir(`¡Felicidades ${NOMBRE}! Terminaste la lección.`);
    lanzarConfeti();
  }
};

// Selector de lecciones
function abrirLecciones(){
  Leccion.salir();   // por si venía de otra
  const grid=document.getElementById('grid-modulos');
  mostrarPantalla('pantalla-menu');
  document.querySelector('.menu-saludo h2').textContent='¡Vamos a repetir juntos, '+NOMBRE+'!';
  grid.innerHTML='';
  Leccion.menu().forEach(l=>{
    const card=document.createElement('button');
    card.className='card-modulo';
    card.style.background=l.color;
    card.style.boxShadow=`0 6px 0 ${oscurecer(l.color,35)}`;
    card.innerHTML=`<div class="card-circulo"><span style="font-size:44px">🗣️</span></div>
      <div class="card-nombre" style="font-size:18px">${l.titulo}</div>`;
    card.onclick=()=>{ Sonido.click(); Leccion.iniciar(l.id); };
    grid.appendChild(card);
  });
  const volver=document.createElement('button');
  volver.className='card-modulo'; volver.style.background='#B0B0B0';
  volver.style.boxShadow='0 6px 0 #909090';
  volver.innerHTML=`<div class="card-circulo"><span style="font-size:44px">🏠</span></div>
    <div class="card-nombre" style="font-size:18px">Volver</div>`;
  volver.onclick=()=>pintarMenu();
  grid.appendChild(volver);
}

function renderImagenEn(contId, render){
  renderImagenGenerico(document.getElementById(contId), render);
}
