// ════════════════════════════════════════════════════════════
//  Sistema de Voz — Web Speech API (TTS + STT)
// ════════════════════════════════════════════════════════════

const Voz = {
  vozES: null,
  listo: false,

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
    if (!('speechSynthesis' in window)) { if (callback) callback(); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    if (this.vozES) u.voice = this.vozES;
    u.lang = this.vozES ? this.vozES.lang : 'es-MX';
    u.rate = 0.90;   // lento para niños
    u.pitch = 1.2;   // tono cálido y dulce
    u.volume = 1.0;
    let llamado = false;
    u.onend = () => { if (!llamado && callback) { llamado = true; callback(); } };
    u.onerror = () => { if (!llamado && callback) { llamado = true; callback(); } };
    speechSynthesis.speak(u);
    // Respaldo por si onend no dispara (algunos Android)
    const estimado = Math.max(1500, texto.length * 90);
    setTimeout(() => { if (!llamado && callback) { llamado = true; callback(); } }, estimado);
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
    if ('speechSynthesis' in window) speechSynthesis.cancel();
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
    this.rec = new SR();
    this.rec.lang = 'es-ES';
    this.rec.continuous = false;
    this.rec.interimResults = false;
    this.rec.maxAlternatives = 3;
    this.disponible = true;
  },

  escuchar(onResultado) {
    if (!this.disponible || this.escuchando) { onResultado('', false); return; }
    this.escuchando = true;
    let resuelto = false;
    const finalizar = (txt, ok) => {
      if (resuelto) return;
      resuelto = true;
      this.escuchando = false;
      onResultado(txt, ok);
    };
    this.rec.onresult = (e) => {
      const alts = [];
      for (let i=0; i<e.results[0].length; i++) alts.push(e.results[0][i].transcript.toLowerCase().trim());
      finalizar(alts.join('|'), true);
    };
    this.rec.onerror = () => finalizar('', false);
    this.rec.onend = () => finalizar('', false);
    try { this.rec.start(); } catch(e) { finalizar('', false); }
  },

  detener() {
    if (this.rec && this.escuchando) { try{ this.rec.stop(); }catch(e){} }
    this.escuchando = false;
  }
};
