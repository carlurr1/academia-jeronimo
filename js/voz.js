// ════════════════════════════════════════════════════════════
//  Sistema de Voz — Web Speech API (TTS + STT)
// ════════════════════════════════════════════════════════════

const Voz = {
  vozES: null,
  listo: false,
  _turno: 0,
  _cancelado: false,

  init() {
    if (!('speechSynthesis' in window)) return;
    const cargar = () => {
      const voces = speechSynthesis.getVoices();
      // Prioridad: español latino femenino → cualquier español latino → femenino español → cualquier español
      const latino = /es[-_](MX|US|CO|AR|CL|PE|419|LA)/i;
      const fem = /female|mujer|paulina|mónica|monica|sabina|google|helena|luciana|francisca|elena|catalina|sole/i;
      this.vozES =
           voces.find(v => latino.test(v.lang) && fem.test(v.name))
        || voces.find(v => /paulina|luciana|francisca|google español de estados/i.test(v.name))
        || voces.find(v => latino.test(v.lang))
        || voces.find(v => /es[-_]/i.test(v.lang) && fem.test(v.name))
        || voces.find(v => /es[-_]/i.test(v.lang))
        || voces.find(v => v.lang.startsWith('es'))
        || null;
      this.listo = true;
    };
    cargar();
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = cargar;
    }
  },

  // Lee un texto en voz alta. callback() se ejecuta al terminar.
  decir(texto, callback) {
    texto = (texto == null) ? '' : String(texto);
    this._cancelado = false;
    const miTurno = ++this._turno;
    if (!texto.trim() || !('speechSynthesis' in window)) { if (callback) callback(); return; }
    try { speechSynthesis.cancel(); } catch(e){}
    const u = new SpeechSynthesisUtterance(texto);
    if (this.vozES) u.voice = this.vozES;
    u.lang = this.vozES ? this.vozES.lang : 'es-MX';
    u.rate = 0.95;
    u.pitch = 1.1;
    u.volume = 1.0;
    let llamado = false;
    const disparar = () => {
      if (llamado) return;
      if (this._cancelado || miTurno !== this._turno) { llamado = true; return; }
      llamado = true;
      if (callback) callback();
    };
    u.onend = disparar;
    u.onerror = disparar;
    try { speechSynthesis.speak(u); } catch(e){ disparar(); return; }
    const estimado = Math.max(1500, texto.length * 80);
    setTimeout(disparar, estimado);
  },

  felicitar(nombre) {
    const frases = [
      `¡Muy bien, ${nombre}! ¡Eso es correcto!`,
      `¡Excelente, ${nombre}! ¡Eres muy inteligente!`,
      `¡Increíble, ${nombre}! ¡Lo lograste!`,
      `¡Súper, ${nombre}! ¡Eres un campeón!`
    ];
    this.decir(frases[Math.floor(Math.random()*frases.length)]);
  },

  animar(nombre, correcta) {
    this.decir(`¡Casi, ${nombre}! Era ${correcta}. ¡Vamos a seguir!`);
  },

  detener() {
    this._cancelado = true;
    if ('speechSynthesis' in window) {
      try { speechSynthesis.cancel(); } catch(e){}
    }
  }
};

// ──────── Reconocimiento de voz (micrófono) ────────
const Microfono = {
  rec: null,
  escuchando: false,
  disponible: false,

  init() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { this.disponible = false; return; }
    this.SR = SR;
    this.disponible = true;
  },

  escuchar(onResultado) {
    if (!this.disponible || this.escuchando) { onResultado('', false, 'ocupado'); return; }
    const rec = new this.SR();
    rec.lang = 'es-MX';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 5;
    this.rec = rec;
    this.escuchando = true;
    let resuelto = false;
    let mejor = '';
    let huboVoz = false;

    const finalizar = (txt, ok, motivo) => {
      if (resuelto) return;
      resuelto = true;
      this.escuchando = false;
      try { rec.stop(); } catch(e){}
      try { rec.abort(); } catch(e){}
      onResultado(txt, ok, motivo);
    };

    // Detecta que empezó a captar sonido/voz
    rec.onspeechstart = () => { huboVoz = true; };
    rec.onaudiostart = () => { huboVoz = true; };

    rec.onresult = (e) => {
      huboVoz = true;
      const alts = [];
      for (let r = 0; r < e.results.length; r++) {
        for (let i = 0; i < e.results[r].length; i++) {
          const t = e.results[r][i].transcript.toLowerCase().trim();
          if (t) alts.push(t);
        }
      }
      mejor = alts.join('|');
      if (e.results[e.results.length-1].isFinal && mejor) {
        finalizar(mejor, true, 'final');
      }
    };

    rec.onerror = (ev) => {
      // 'no-speech' o 'aborted' NO son fallos del niño: avisar como "no escuché"
      const m = ev && ev.error ? ev.error : 'error';
      if (mejor) finalizar(mejor, true, 'final');
      else finalizar('', false, m);   // motivo: no-speech, not-allowed, etc.
    };

    rec.onend = () => {
      // Si terminó sin captar nada, es "no escuché" (no un error del niño)
      if (mejor) finalizar(mejor, true, 'final');
      else finalizar('', false, huboVoz ? 'no-entendido' : 'no-speech');
    };

    // Timeout amplio: 10 segundos para que el niño tenga tiempo de hablar
    setTimeout(() => { if(!resuelto) finalizar(mejor, mejor!=='', mejor?'final':'timeout'); }, 10000);
    try { rec.start(); } catch(e) { finalizar('', false, 'no-start'); }
  },

  detener() {
    if (this.rec && this.escuchando) { try{ this.rec.abort(); }catch(e){} try{ this.rec.stop(); }catch(e){} }
    this.escuchando = false;
  }
};
