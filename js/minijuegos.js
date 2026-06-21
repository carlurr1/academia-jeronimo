// ════════════════════════════════════════════════════════════
//  10 MINI-JUEGOS — fáciles, táctiles, para PC y tablet
// ════════════════════════════════════════════════════════════
// Todos usan #mj-area como lienzo y terminan dando monedas.

const MiniJuegos = {
  lista: [
    {id:'atrapar',   nombre:'Atrapa comida',   emoji:'🧺', color:'#58CC02'},
    {id:'globos',    nombre:'Revienta globos', emoji:'🎈', color:'#FF4B4B'},
    {id:'memoria',   nombre:'Encuentra parejas',emoji:'🃏', color:'#CE82FF'},
    {id:'topo',      nombre:'Toca al gatito',  emoji:'🐱', color:'#FF9600'},
    {id:'contar',    nombre:'Cuenta y toca',   emoji:'🔢', color:'#1CB0F6'},
    {id:'colorcorrecto',nombre:'Toca el color',emoji:'🎨', color:'#FFC800'},
    {id:'burbujas',  nombre:'Pincha burbujas', emoji:'🫧', color:'#1CB0F6'},
    {id:'estrellas', nombre:'Junta estrellas', emoji:'⭐', color:'#FFC800'},
    {id:'rapido',    nombre:'Toca rápido',     emoji:'⚡', color:'#FF4B4B'},
    {id:'frutas',    nombre:'Atrapa frutas',   emoji:'🍎', color:'#58CC02'},
  ],

  abrirSelector(){
    const grid=document.getElementById('grid-modulos');
    mostrarPantalla('pantalla-menu');
    document.querySelector('.menu-saludo h2').textContent='¡Elige un juego, '+NOMBRE+'! 🎮';
    grid.innerHTML='';
    this.lista.forEach(j=>{
      const card=document.createElement('button');
      card.className='card-modulo';
      card.style.background=j.color;
      card.style.boxShadow=`0 6px 0 ${oscurecer(j.color,35)}`;
      card.innerHTML=`<div class="card-circulo"><span style="font-size:46px">${j.emoji}</span></div>
        <div class="card-nombre" style="font-size:17px">${j.nombre}</div>`;
      card.onclick=()=>{ Sonido.click(); this.iniciar(j.id); };
      grid.appendChild(card);
    });
    const volver=document.createElement('button');
    volver.className='card-modulo'; volver.style.background='#B0B0B0';
    volver.style.boxShadow='0 6px 0 #909090';
    volver.innerHTML=`<div class="card-circulo"><span style="font-size:44px">🏠</span></div>
      <div class="card-nombre" style="font-size:17px">Volver</div>`;
    volver.onclick=()=>pintarMenu();
    grid.appendChild(volver);
  },

  iniciar(id){
    this.actual=id;
    this.puntos=0; this.tiempo=25; this.activo=true;
    document.getElementById('mj-puntos').textContent='0';
    document.getElementById('mj-tiempo').textContent='25';
    const area=document.getElementById('mj-area');
    area.innerHTML=''; area.onclick=null; area.onmousemove=null; area.ontouchmove=null;
    mostrarPantalla('pantalla-minijuego');
    const j=this.lista.find(x=>x.id===id);
    document.querySelector('#pantalla-minijuego .menu-titulo span').textContent=`🎮 ${j.nombre}`;
    document.getElementById('pantalla-minijuego').querySelector('.menu-header').style.background=j.color;

    Voz.decir(this._instruccion(id));

    // Timer común
    if(this.timer) clearInterval(this.timer);
    if(this.spawn) clearInterval(this.spawn);
    this.timer=setInterval(()=>{
      this.tiempo--;
      document.getElementById('mj-tiempo').textContent=this.tiempo;
      if(this.tiempo<=0) this.fin();
    },1000);

    // Lanzar el juego específico
    this['_'+id](area);
  },

  _instruccion(id){
    const m={atrapar:'¡Atrapa la comida con la cesta!', globos:'¡Toca los globos para reventarlos!',
      memoria:'¡Encuentra las parejas iguales!', topo:'¡Toca al gatito cuando aparezca!',
      contar:'¡Toca la cantidad correcta!', colorcorrecto:'¡Toca el color que te digo!',
      burbujas:'¡Pincha todas las burbujas!', estrellas:'¡Junta las estrellas!',
      rapido:'¡Toca los botones rápido!', frutas:'¡Atrapa las frutas que caen!'};
    return `${NOMBRE}, ${m[id]||'¡A jugar!'}`;
  },

  sumar(n=1){
    this.puntos+=n;
    document.getElementById('mj-puntos').textContent=this.puntos;
    Sonido.tono(700,0.1,0);
  },

  // ─── 1. Atrapar comida (cesta que sigue el dedo) ───
  _atrapar(area){
    this.cestaX=50;
    const cesta=document.createElement('div');
    cesta.className='mj-gato-cesta'; cesta.id='mj-cesta'; cesta.textContent='🧺'; cesta.style.left='50%';
    area.appendChild(cesta);
    const mover=(x)=>{const r=area.getBoundingClientRect();let p=((x-r.left)/r.width)*100;
      p=Math.max(5,Math.min(95,p));this.cestaX=p;cesta.style.left=p+'%';};
    area.onmousemove=(e)=>mover(e.clientX);
    area.ontouchmove=(e)=>{e.preventDefault();mover(e.touches[0].clientX);};
    this.spawn=setInterval(()=>this._caer(area,['🍎','🍪','🐟','🥛','🍌'],true),900);
  },
  _frutas(area){ this._atrapar(area); }, // variante con frutas, misma mecánica

  _caer(area, emojis, conCesta){
    if(!this.activo) return;
    const o=document.createElement('div');
    o.className='mj-objeto mj-cae'; o.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    const x=5+Math.random()*85; o.style.left=x+'%';
    o.style.animationDuration=(2.6+Math.random()*1.4)+'s';
    area.appendChild(o);
    const chk=setInterval(()=>{
      if(!this.activo){clearInterval(chk);o.remove();return;}
      const or=o.getBoundingClientRect(),ar=area.getBoundingClientRect();
      const oy=((or.top-ar.top)/ar.height)*100, ox=((or.left-ar.left)/ar.width)*100;
      if(oy>80){
        if(!conCesta || Math.abs(ox-this.cestaX)<13) this.sumar();
        clearInterval(chk);o.remove();
      }
    },100);
    setTimeout(()=>{try{o.remove();clearInterval(chk);}catch(e){}},5500);
  },

  // ─── 2. Globos / 7. Burbujas / 8. Estrellas (tocar objetos) ───
  _globos(area){ this._floten(area,['🎈'],'subir'); },
  _burbujas(area){ this._floten(area,['🫧','🔵','🟢'],'subir'); },
  _estrellas(area){ this._floten(area,['⭐','🌟','✨'],'flotar'); },
  _floten(area, emojis, modo){
    this.spawn=setInterval(()=>{
      if(!this.activo) return;
      const o=document.createElement('div');
      o.className='mj-objeto'; o.textContent=emojis[Math.floor(Math.random()*emojis.length)];
      o.style.left=(8+Math.random()*80)+'%';
      o.style.top=(modo==='subir'?100:20+Math.random()*60)+'%';
      o.style.fontSize=(40+Math.random()*20)+'px';
      o.style.transition='top 3s linear';
      area.appendChild(o);
      const tocar=()=>{ if(o._tocado)return; o._tocado=true; this.sumar(); o.style.transform='scale(1.6)';
        o.style.opacity='0'; setTimeout(()=>o.remove(),200); };
      o.onclick=tocar; o.ontouchstart=(e)=>{e.preventDefault();tocar();};
      if(modo==='subir') requestAnimationFrame(()=>{o.style.top='-10%';});
      setTimeout(()=>{try{o.remove();}catch(e){}},3200);
    },800);
  },

  // ─── 3. Memoria (parejas) ───
  _memoria(area){
    clearInterval(this.spawn);
    this.tiempo=60; document.getElementById('mj-tiempo').textContent='60';
    const emojis=['🐶','🐱','🦁','🐸','🍎','🌟'];
    let cartas=[...emojis,...emojis].sort(()=>Math.random()-0.5);
    const cont=document.createElement('div');
    cont.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:20px;max-width:500px;margin:20px auto;';
    area.appendChild(cont);
    let volteadas=[], bloqueado=false;
    cartas.forEach((em,i)=>{
      const c=document.createElement('div');
      c.style.cssText='aspect-ratio:1;background:#1CB0F6;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:36px;cursor:pointer;box-shadow:0 4px 0 #1899D6;';
      c.textContent='❓'; c._em=em; c._abierta=false;
      const abrir=()=>{
        if(bloqueado||c._abierta) return;
        c.textContent=em; c._abierta=true; c.style.background='#58CC02'; volteadas.push(c);
        Sonido.tono(600,0.08,0);
        if(volteadas.length===2){
          bloqueado=true;
          if(volteadas[0]._em===volteadas[1]._em){
            this.sumar(); volteadas=[]; bloqueado=false;
            if(area.querySelectorAll('div[style*="aspect"]').length && this.puntos>=6) setTimeout(()=>this.fin(),500);
          } else {
            setTimeout(()=>{volteadas.forEach(v=>{v.textContent='❓';v._abierta=false;v.style.background='#1CB0F6';});volteadas=[];bloqueado=false;},800);
          }
        }
      };
      c.onclick=abrir; c.ontouchstart=(e)=>{e.preventDefault();abrir();};
      cont.appendChild(c);
    });
  },

  // ─── 4. Topo (gatito que aparece) ───
  _topo(area){
    const grid=document.createElement('div');
    grid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:20px;max-width:480px;margin:20px auto;';
    area.appendChild(grid);
    const huecos=[];
    for(let i=0;i<9;i++){
      const h=document.createElement('div');
      h.style.cssText='aspect-ratio:1;background:#A2845E;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;cursor:pointer;box-shadow:inset 0 4px 8px rgba(0,0,0,.3);';
      grid.appendChild(h); huecos.push(h);
    }
    this.spawn=setInterval(()=>{
      if(!this.activo)return;
      huecos.forEach(h=>{h.textContent='';h._activo=false;});
      const h=huecos[Math.floor(Math.random()*9)];
      h.textContent='🐱'; h._activo=true;
      h.onclick=()=>{if(h._activo){this.sumar();h.textContent='⭐';h._activo=false;}};
      h.ontouchstart=(e)=>{e.preventDefault();if(h._activo){this.sumar();h.textContent='⭐';h._activo=false;}};
    },1000);
  },

  // ─── 5. Contar (cuántos hay → tocar número) ───
  _contar(area){
    clearInterval(this.spawn);
    const ronda=()=>{
      if(!this.activo)return;
      area.innerHTML='';
      const n=1+Math.floor(Math.random()*5);
      const disp=document.createElement('div');
      disp.style.cssText='display:flex;flex-wrap:wrap;gap:12px;justify-content:center;padding:20px;max-width:400px;margin:10px auto;';
      for(let i=0;i<n;i++){const e=document.createElement('div');e.textContent='🍎';e.style.fontSize='44px';disp.appendChild(e);}
      area.appendChild(disp);
      const pregunta=document.createElement('div');
      pregunta.style.cssText='text-align:center;font-size:24px;font-weight:800;color:#4B4B4B;margin:10px;';
      pregunta.textContent='¿Cuántas manzanas hay?';
      area.appendChild(pregunta);
      const ops=document.createElement('div');
      ops.style.cssText='display:flex;gap:12px;justify-content:center;flex-wrap:wrap;';
      let nums=new Set([n]); while(nums.size<4){nums.add(1+Math.floor(Math.random()*5));}
      [...nums].sort(()=>Math.random()-0.5).forEach(num=>{
        const b=document.createElement('button');
        b.textContent=num; b.style.cssText='font-size:30px;font-weight:800;width:70px;height:70px;border:none;border-radius:16px;background:#1CB0F6;color:white;cursor:pointer;box-shadow:0 4px 0 #1899D6;';
        const tocar=()=>{if(num===n){this.sumar();Voz.decir(`¡Sí! Son ${n}.`);setTimeout(ronda,800);}else{Sonido.error();}};
        b.onclick=tocar; b.ontouchstart=(e)=>{e.preventDefault();tocar();};
        ops.appendChild(b);
      });
      area.appendChild(ops);
      Voz.decir('¿Cuántas manzanas hay?');
    };
    ronda();
  },

  // ─── 6. Color correcto ───
  _colorcorrecto(area){
    clearInterval(this.spawn);
    const ronda=()=>{
      if(!this.activo)return;
      area.innerHTML='';
      const objetivo=COLORES_CURR[Math.floor(Math.random()*6)];
      const pregunta=document.createElement('div');
      pregunta.style.cssText='text-align:center;font-size:26px;font-weight:800;color:#4B4B4B;margin:20px;';
      pregunta.textContent=`Toca el color ${objetivo.es.toUpperCase()}`;
      area.appendChild(pregunta);
      Voz.decir(`Toca el color ${objetivo.es}`);
      const ops=document.createElement('div');
      ops.style.cssText='display:flex;gap:16px;justify-content:center;flex-wrap:wrap;padding:20px;';
      let cols=new Set([objetivo]); while(cols.size<4){cols.add(COLORES_CURR[Math.floor(Math.random()*6)]);}
      [...cols].sort(()=>Math.random()-0.5).forEach(c=>{
        const b=document.createElement('button');
        b.style.cssText=`width:90px;height:90px;border-radius:20px;border:3px solid #ddd;background:${c.hex};cursor:pointer;box-shadow:0 5px 0 ${oscurecer(c.hex,35)};`;
        const tocar=()=>{if(c.es===objetivo.es){this.sumar();Voz.decir('¡Correcto!');setTimeout(ronda,700);}else{Sonido.error();}};
        b.onclick=tocar; b.ontouchstart=(e)=>{e.preventDefault();tocar();};
        ops.appendChild(b);
      });
      area.appendChild(ops);
    };
    ronda();
  },

  // ─── 9. Toca rápido ───
  _rapido(area){
    const ronda=()=>{
      if(!this.activo)return;
      area.innerHTML='';
      const b=document.createElement('button');
      b.textContent='👆'; 
      b.style.cssText='position:absolute;font-size:50px;width:100px;height:100px;border-radius:50%;border:none;background:#FF4B4B;cursor:pointer;box-shadow:0 5px 0 #E23D3D;';
      b.style.left=(10+Math.random()*70)+'%';
      b.style.top=(15+Math.random()*65)+'%';
      const tocar=()=>{this.sumar();Sonido.tono(800,0.08,0);ronda();};
      b.onclick=tocar; b.ontouchstart=(e)=>{e.preventDefault();tocar();};
      area.appendChild(b);
    };
    ronda();
  },

  fin(){
    this.activo=false;
    if(this.timer)clearInterval(this.timer);
    if(this.spawn)clearInterval(this.spawn);
    const area=document.getElementById('mj-area');
    area.onmousemove=null; area.ontouchmove=null;
    Estado.datos.monedas+=this.puntos;
    Estado.datos.felicidad=Math.min(100,Estado.datos.felicidad+15);
    Estado.guardar();
    area.innerHTML=`<div style="text-align:center;padding-top:60px;">
      <div style="font-size:80px;">🏆</div>
      <div style="font-size:32px;font-weight:800;color:#4B4B4B;margin:10px;">¡Ganaste ${this.puntos} monedas!</div>
      <button class="btn-grande btn-verde" id="mj-otra">🎮 Otro juego</button>
      <button class="btn-grande btn-azul" id="mj-volver-masc" style="margin-left:10px;">🐱 Mi gatita</button>
    </div>`;
    Voz.decir(`¡Muy bien ${NOMBRE}! Ganaste ${this.puntos} monedas.`);
    document.getElementById('mj-otra').onclick=()=>this.abrirSelector();
    document.getElementById('mj-volver-masc').onclick=()=>{pintarMascota();mostrarPantalla('pantalla-mascota');};
  },

  salir(){
    this.activo=false;
    if(this.timer)clearInterval(this.timer);
    if(this.spawn)clearInterval(this.spawn);
    pintarMascota(); mostrarPantalla('pantalla-mascota');
  }
};
