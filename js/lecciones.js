// ════════════════════════════════════════════════════════════
//  LECCIONES — "Repite conmigo" (con reconocimiento de voz)
// ════════════════════════════════════════════════════════════

const Leccion = {
  pasos: [], idx: 0, tipo: '',

  // Construye las lecciones disponibles
  menu(){
    return [
      {id:'numeros', titulo:'Contar 1 al 5', color:'#FF4B4B'},
      {id:'numeros10', titulo:'Contar 1 al 10', color:'#FF9600'},
      {id:'vocales', titulo:'Las vocales', color:'#1CB0F6'},
      {id:'colores', titulo:'Los colores', color:'#FFC800'},
      {id:'figuras', titulo:'Las figuras', color:'#CE82FF'},
      {id:'animales', titulo:'Los animales', color:'#58CC02'},
    ];
  },

  construirPasos(id){
    if(id==='numeros') return [1,2,3,4,5].map(n=>({texto:NUMEROS[n].es, decir:String(n), acepta:[NUMEROS[n].es,String(n)], render:{tipo:'numero',valor:n}}));
    if(id==='numeros10') return [1,2,3,4,5,6,7,8,9,10].map(n=>({texto:NUMEROS[n].es, decir:String(n), acepta:[NUMEROS[n].es,String(n)], render:{tipo:'numero',valor:n}}));
    if(id==='vocales') return VOCALES.map(v=>({texto:v.letra, decir:v.nombre, acepta:[v.nombre,v.letra.toLowerCase()], render:{tipo:'letra',valor:v.letra.toLowerCase(),color:v.color}}));
    if(id==='colores') return COLORES_CURR.slice(0,6).map(c=>({texto:c.es, decir:c.es, acepta:[c.es], render:{tipo:'color',color:c.hex}}));
    if(id==='figuras') return FIGURAS.map(f=>({texto:f.es, decir:f.es, acepta:[f.es], render:{tipo:'figura',figura:f.es,color:FIG_HEX[f.es]}}));
    if(id==='animales') return ANIMALES.slice(0,8).map(a=>({texto:a.es, decir:a.es, acepta:[a.es], render:{tipo:'img',img:a.img}}));
    return [];
  },

  iniciar(id){
    this.tipo=id;
    this.pasos=this.construirPasos(id);
    this.idx=0;
    const lec=this.menu().find(l=>l.id===id);
    document.getElementById('leccion-header').style.background=lec.color;
    document.getElementById('leccion-titulo').textContent=lec.titulo;
    mostrarPantalla('pantalla-leccion');
    Voz.decir(`Vamos a aprender. Escucha y repite conmigo, ${NOMBRE}.`, ()=>{
      setTimeout(()=>this.paso(),400);
    });
  },

  paso(){
    if(this.idx>=this.pasos.length){ this.fin(); return; }
    const p=this.pasos[this.idx];
    document.getElementById('leccion-progreso').textContent=`${this.idx+1}/${this.pasos.length}`;
    renderImagenEn('leccion-imagen', p.render);
    document.getElementById('leccion-instruccion').textContent=`Repite conmigo: "${p.decir}"`;
    document.getElementById('leccion-feedback').textContent='';
    // La voz dice el elemento, luego invita a repetir
    Voz.decir(`Repite conmigo: ${p.decir}`, ()=>{
      this.escuchar();
    });
  },

  escuchar(){
    const btn=document.getElementById('leccion-hablar');
    const fb=document.getElementById('leccion-feedback');
    if(!Microfono.disponible){
      fb.textContent='Toca el botón verde para continuar 👇';
      btn.textContent='✓ Siguiente';
      btn.classList.remove('escuchando');
      btn.onclick=()=>this.avanzar(true);
      return;
    }
    btn.textContent='🔴 Te escucho...';
    btn.classList.add('escuchando');
    fb.textContent='';
    Microfono.escuchar((txt,ok)=>{
      btn.classList.remove('escuchando');
      btn.textContent='🎤 ¡Repite!';
      const p=this.pasos[this.idx];
      const dichos=(txt||'').split('|');
      const acerto = ok && dichos.some(d => p.acepta.some(a => d.includes(a.toLowerCase())));
      if(acerto){
        fb.textContent='¡Muy bien! 🎉'; fb.style.color='#58CC02';
        Sonido.correcto();
        Voz.decir(`¡Muy bien, ${NOMBRE}! Es ${p.decir}.`, ()=>this.avanzar(true));
      } else {
        fb.textContent=`Casi... era "${p.decir}" 💪`; fb.style.color='#FF9600';
        Sonido.error();
        // La corrige: "No, sigue, es 4 y no 8"
        Voz.decir(`Casi. Escucha otra vez: ${p.decir}. ¡Inténtalo!`, ()=>{
          this.escuchar();   // vuelve a intentar el mismo
        });
      }
      // Botón manual para no trabar
      btn.onclick=()=>this.escuchar();
    });
    btn.onclick=()=>this.escuchar();
  },

  avanzar(){
    this.idx++;
    setTimeout(()=>this.paso(),600);
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
      '<button class="btn-grande btn-verde" onclick="pintarMenu();mostrarPantalla(\'pantalla-menu\')">🏠 Menú</button>';
    Voz.decir(`¡Felicidades ${NOMBRE}! Terminaste la lección. ¡Eres muy inteligente!`);
    lanzarConfeti();
  }
};

// Pinta el menú de lecciones (reusa la pantalla de juego como selector simple)
function abrirLecciones(){
  // Mostrar selector dentro de la pantalla de menú de lecciones
  const grid=document.getElementById('grid-modulos');
  // Reusamos: creamos un overlay de selección
  let html='<div style="grid-column:1/-1;text-align:center;margin-bottom:10px;">'+
    '<h2 style="color:#4B4B4B;">Elige una lección para repetir 🗣️</h2></div>';
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
  // Botón volver
  const volver=document.createElement('button');
  volver.className='card-modulo';
  volver.style.background='#B0B0B0';
  volver.style.boxShadow='0 6px 0 #909090';
  volver.innerHTML=`<div class="card-circulo"><span style="font-size:44px">🏠</span></div>
    <div class="card-nombre" style="font-size:18px">Volver</div>`;
  volver.onclick=()=>{ pintarMenu(); };
  grid.appendChild(volver);
}

// Helper: renderiza imagen en un contenedor dado
function renderImagenEn(contId, render){
  renderImagenGenerico(document.getElementById(contId), render);
}
