'use strict';
/* ==========================================================
   Capitán Sipi · Escuela Primaria Urbana Las Américas
   Todo el contenido está en este archivo para editarlo fácil.
   ========================================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const state = { nivel: 'alto', stars: 0, topic: 'inundacion', cur: 'inicio' };
try {
  state.stars = +localStorage.getItem('cp_stars') || 0;
} catch (e) {}

/* ---------- DATOS REALES DEL DIAGNÓSTICO (editar aquí) ---------- */
const CUMPLIMIENTO = { pct: 47.6, cumplen: 20, noCumplen: 22, nivel: 'Crítico' };
const GRUPOS = [['1.º', 30], ['2.º', 30], ['3.º', 33], ['4.º', 33], ['5.º', 29], ['6.º', 33]];
const TOTAL_ALUMNOS = GRUPOS.reduce((s, g) => s + g[1], 0);
const SECCIONES = [
  ['Señalética', 2, 10], ['Equipos preventivos', 3, 8], ['Rutas y evacuación', 3, 4],
  ['Instalaciones', 5, 6], ['Mobiliario y áreas', 6, 6], ['Prevención y emergencias', 1, 6]
];
const PRIORIDADES = [
  ['Protocolo formal ante inundaciones', 'Muy alta'], ['Definir responsables y funciones', 'Muy alta'],
  ['Criterios para suspender clases y restringir acceso', 'Muy alta'], ['Procedimiento de comunicación y aviso', 'Muy alta'],
  ['Verificar seguridad e higiene antes del retorno', 'Muy alta'], ['Gestionar atención ante JAPAMI y dar seguimiento', 'Muy alta'],
  ['Identificar y controlar riesgos del agua residual', 'Alta'], ['Definir punto o zona segura de resguardo', 'Alta'],
  ['Determinar la causa del reflujo y buscar solución permanente', 'Alta'], ['Documentar cada evento', 'Media-alta']
];

/* ---------- EL BÚHO: blanco con chaleco azul ---------- */
const owl = (cls = '') => `<svg class="owl ${cls}" viewBox="0 0 200 260" role="img" aria-label="Capitán Sipi, el búho blanco con chaleco azul">
<ellipse cx="100" cy="250" rx="52" ry="8" fill="#12306B" opacity=".12"/>
<polygon points="52,72 62,26 92,58" fill="#E4ECF7" stroke="#12306B" stroke-width="4" stroke-linejoin="round"/>
<polygon points="148,72 138,26 108,58" fill="#E4ECF7" stroke="#12306B" stroke-width="4" stroke-linejoin="round"/>
<ellipse cx="100" cy="150" rx="70" ry="88" fill="#fff" stroke="#12306B" stroke-width="4"/>
<g class="wing wing-l"><ellipse cx="34" cy="160" rx="20" ry="52" fill="#E4ECF7" stroke="#12306B" stroke-width="4"/></g>
<g class="wing wing-r"><ellipse cx="166" cy="160" rx="20" ry="52" fill="#E4ECF7" stroke="#12306B" stroke-width="4"/></g>
<ellipse cx="100" cy="176" rx="44" ry="58" fill="#F4F8FF"/>
<path d="M58,146 Q100,166 142,146 L150,216 Q100,236 50,216 Z" fill="#2F6FED" stroke="#12306B" stroke-width="4" stroke-linejoin="round"/>
<path d="M55,172 Q100,190 145,172" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
<path d="M52,196 Q100,214 148,196" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
<line x1="100" y1="160" x2="100" y2="228" stroke="#12306B" stroke-width="3"/>
<circle cx="78" cy="160" r="9" fill="#fff"/><path d="M78 154v12M72 160h12" stroke="#2F6FED" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="74" cy="104" r="29" fill="#fff" stroke="#12306B" stroke-width="4"/>
<circle cx="126" cy="104" r="29" fill="#fff" stroke="#12306B" stroke-width="4"/>
<circle cx="78" cy="108" r="13" fill="#12306B"/><circle cx="122" cy="108" r="13" fill="#12306B"/>
<circle cx="83" cy="102" r="4.5" fill="#fff"/><circle cx="127" cy="102" r="4.5" fill="#fff"/>
<ellipse class="lid" cx="74" cy="104" rx="29" ry="29" fill="#fff" stroke="#12306B" stroke-width="4"/>
<ellipse class="lid" cx="126" cy="104" rx="29" ry="29" fill="#fff" stroke="#12306B" stroke-width="4"/>
<ellipse cx="44" cy="132" rx="9" ry="5.5" fill="#FFB4C0" opacity=".85"/><ellipse cx="156" cy="132" rx="9" ry="5.5" fill="#FFB4C0" opacity=".85"/>
<path d="M90,126 L110,126 L100,146 Z" fill="#FFA726" stroke="#12306B" stroke-width="3" stroke-linejoin="round"/>
<path d="M72,240 q6,-8 12,0 q6,-8 12,0" fill="#FFA726" stroke="#12306B" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M104,240 q6,-8 12,0 q6,-8 12,0" fill="#FFA726" stroke="#12306B" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
</svg>`;

/* ---------- SEÑALES ---------- */
const G = '#1FA463', R = '#E5484D', Y = '#FFC107', K = '#1B1B1B';
const arrowIn = r => `<g transform="rotate(${r} 50 50)"><path d="M50,14 V36 M43,29 L50,38 L57,29" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
const SIGNS = [
  { id: 'ruta', n: 'Ruta de evacuación', m: { bajo: 'Nos muestra el camino para salir sin peligro.', alto: 'Indica el camino que debemos seguir para salir del edificio de forma segura.' }, e: ['falta', 'Todavía no hay en la escuela.'],
    svg: `<rect x="6" y="6" width="88" height="88" rx="12" fill="${G}"/><circle cx="36" cy="28" r="8" fill="#fff"/><path d="M38,38 L46,56 L34,74 M46,56 L58,70 M40,44 L56,40 M40,44 L28,52" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M64,30 H84 M76,22 L85,30 L76,38" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` },
  { id: 'salida', n: 'Salida de emergencia', m: { bajo: 'Es la puerta por donde salimos si hay una emergencia.', alto: 'Marca la puerta que se usa para salir rápido y seguro cuando hay peligro.' }, e: ['falta', 'Todavía no hay en la escuela.'],
    svg: `<rect x="6" y="6" width="88" height="88" rx="12" fill="${G}"/><text x="50" y="46" text-anchor="middle" font-family="Baloo 2,Arial" font-weight="800" font-size="19" fill="#fff">SALIDA</text><path d="M22,68 H78 M66,57 L78,68 L66,79" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` },
  { id: 'reunion', n: 'Punto de reunión', m: { bajo: 'Es el lugar seguro donde nos juntamos y nos contamos.', alto: 'Es la zona segura donde llega todo el grupo para ser contado y esperar indicaciones.' }, e: ['ojo', 'Sí hay, pero está junto al asta bandera. Hay que revisar si es el mejor lugar.'],
    svg: `<rect x="6" y="6" width="88" height="88" rx="12" fill="${G}"/>${arrowIn(0)}${arrowIn(90)}${arrowIn(180)}${arrowIn(270)}<circle cx="50" cy="50" r="5" fill="#fff"/>` },
  { id: 'extintor', n: 'Extintor', m: { bajo: 'Sirve para apagar fuego. Solo lo usan los adultos.', alto: 'Indica dónde hay un extintor para apagar fuego. Solo adultos capacitados lo usan.' }, e: ['falta', 'La escuela no tiene extintores todavía.'],
    svg: `<rect x="6" y="6" width="88" height="88" rx="12" fill="${R}"/><rect x="38" y="38" width="26" height="44" rx="8" fill="#fff"/><rect x="45" y="28" width="12" height="12" fill="#fff"/><path d="M57,31 Q76,28 73,52" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M40,27 L58,22" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` },
  { id: 'botiquin', n: 'Botiquín', m: { bajo: 'Aquí están las vendas y cosas para curar heridas leves.', alto: 'Señala dónde están los materiales de primeros auxilios.' }, e: ['ok', '¡Sí! Hay un botiquín en la oficina de dirección.'],
    svg: `<rect x="6" y="6" width="88" height="88" rx="12" fill="${G}"/><rect x="40" y="20" width="20" height="60" rx="3" fill="#fff"/><rect x="20" y="40" width="60" height="20" rx="3" fill="#fff"/>` },
  { id: 'electrico', n: 'Riesgo eléctrico', m: { bajo: '¡Cuidado! Aquí hay electricidad. No se toca.', alto: 'Advierte que hay electricidad peligrosa, por ejemplo en los tableros. No se tocan.' }, e: ['falta', 'Los tableros todavía no tienen esta señal.'],
    svg: `<polygon points="50,8 94,86 6,86" fill="${Y}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><polygon points="55,34 38,62 50,62 44,80 64,50 52,50" fill="${K}"/>` },
  { id: 'fumar', n: 'Prohibido fumar', m: { bajo: 'Aquí no se puede fumar. Es dañino para todos.', alto: 'Indica un lugar donde no se permite fumar para cuidar la salud y evitar incendios.' }, e: ['falta', 'Todavía no está señalizado.'],
    svg: `<circle cx="50" cy="50" r="40" fill="#fff" stroke="${R}" stroke-width="9"/><rect x="24" y="52" width="38" height="9" rx="2" fill="${K}"/><rect x="62" y="52" width="9" height="9" rx="2" fill="${R}"/><path d="M40,44 q-6,-8 0,-14 q6,-6 0,-12" stroke="#7A8AA8" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M22,78 L78,22" stroke="${R}" stroke-width="9" stroke-linecap="round"/>` },
  { id: 'resbalon', n: 'Piso resbaloso', m: { bajo: '¡Piso mojado! Caminamos despacio para no resbalar.', alto: 'Advierte que el piso está mojado o resbaloso. Muy útil cuando hay encharcamientos por lluvia.' }, e: ['falta', 'No hay señales de advertencia. Son muy útiles cuando llueve.'],
    svg: `<polygon points="50,8 94,86 6,86" fill="${Y}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><rect x="46" y="32" width="8" height="26" rx="4" fill="${K}"/><circle cx="50" cy="66" r="4.5" fill="${K}"/><path d="M30,79 q5,-5 10,0 t10,0 t10,0 t10,0" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>` }
];
const signSvg = s => `<svg viewBox="0 0 100 100" role="img" aria-label="${s.n}">${s.svg}</svg>`;
const L = o => (typeof o === 'string' ? o : o[state.nivel]);

/* ---------- TEMAS PARA APRENDER ---------- */
const TOPICS = {
  inundacion: { nombre: 'Lluvias e inundaciones', emoji: '🌧️', color: '#2F6FED',
    intro: { bajo: 'Cuando llueve muy fuerte, el agua puede salir por las coladeras y llenar el patio. ¡Hay que cuidarse!', alto: 'Cuando llueve mucho, las coladeras pueden regresar el agua sucia (se llama reflujo). Esa agua puede traer gérmenes e insectos y deja el piso muy resbaloso.' },
    pasos: [
      ['👀', 'Observo y aviso', { bajo: 'Si veo agua subir, le aviso a mi maestra o maestro.', alto: 'Si veo que el agua sube o sale por las coladeras, aviso enseguida a mi docente.' }],
      ['🚫', 'No me meto al agua', { bajo: 'No juego en los charcos. ¡Puede estar sucia!', alto: 'No camino ni juego en agua estancada: puede tener gérmenes y esconder hoyos o escalones.' }],
      ['🦶', 'Camino con cuidado', { bajo: 'Camino despacio porque el piso resbala.', alto: 'Camino despacio en pasillos mojados para evitar resbalones, golpes y fracturas.' }],
      ['⚡', 'Lejos de la electricidad', { bajo: 'Con las manos mojadas no toco enchufes.', alto: 'No toco enchufes, apagadores ni cables con las manos mojadas o parado en el agua.' }],
      ['👩‍🏫', 'Sigo a mi docente', { bajo: 'Salimos en fila y en orden con mi grupo.', alto: 'Si hay que salir, vamos en fila con mi grupo, sin correr, y escuchamos las indicaciones del director.' }],
      ['🧼', 'Me lavo las manos', { bajo: 'Me lavo las manos con agua y jabón.', alto: 'Me lavo las manos con agua y jabón: así evito enfermedades que pueden transmitir el agua sucia y los insectos.' }]
    ],
    escuela: 'En nuestra escuela, quien ve la inundación avisa por WhatsApp al director. El director y el intendente llaman a JAPAMI para que limpie las coladeras. Hasta que todo esté limpio y seguro, se suspenden las clases o se restringe la entrada.',
    tip: '¡Un charco con agua del drenaje NO es para chapotear!' },
  sismo: { nombre: 'Sismo', emoji: '🌎', color: '#FF8A3D',
    intro: { bajo: 'Un sismo es cuando la tierra se mueve. Da miedo, pero si sabemos qué hacer, ¡estamos listos!', alto: 'Un sismo es un movimiento de la tierra. Aunque en nuestra zona no son tan comunes, es importante saber actuar porque pueden ocurrir en cualquier lugar.' },
    pasos: [
      ['🧘', 'Mantengo la calma', { bajo: 'No corro, no grito, no empujo.', alto: 'Regla de oro: no corro, no grito, no empujo.' }],
      ['🪟', 'Lejos de ventanas', { bajo: 'Me alejo de las ventanas y de cosas que se pueden caer.', alto: 'Me alejo de ventanas, vidrios, estantes y objetos que pueden caer.' }],
      ['🚶', 'Salgo en fila', { bajo: 'Salgo en fila con mi grupo.', alto: 'Evacuo en fila, por la ruta indicada y siguiendo a mi docente.' }],
      ['📍', 'Punto de reunión', { bajo: 'Llego al punto de reunión.', alto: 'Llego al punto de reunión, lejos de árboles, cables y construcciones.' }],
      ['🔢', 'Nos contamos', { bajo: 'Mi maestra o maestro cuenta a todos.', alto: 'Mi docente cuenta a su grupo para confirmar que todos estamos bien.' }],
      ['✅', 'Espero indicaciones', { bajo: 'Espero a que el director nos diga cuándo regresar.', alto: 'No regreso al salón hasta que el director indique que ya es seguro.' }]
    ],
    escuela: 'Nuestro punto de reunión está en la explanada, pero queda muy cerca del asta bandera. ¡Vale la pena revisar con los maestros si es el lugar más seguro!',
    tip: 'No corro, no grito, no empujo.' },
  incendio: { nombre: 'Incendio', emoji: '🔥', color: '#E5484D',
    intro: { bajo: 'El fuego es muy peligroso. Si vemos fuego o humo, ¡avisamos rápido a un adulto!', alto: 'Un incendio puede crecer muy rápido y el humo es peligroso. Lo más importante es avisar y salir en orden.' },
    pasos: [
      ['📢', 'Aviso', { bajo: 'Aviso a un adulto de inmediato.', alto: 'Aviso a un adulto de inmediato, sin tratar de apagar nada.' }],
      ['📞', 'Llaman al 911', { bajo: 'Un adulto da la alarma y llama al 911.', alto: 'Un adulto da la alarma y llama al 911, el número de emergencias en México.' }],
      ['🏃', 'Salgo sin correr', { bajo: 'Salgo en fila y no me llevo mis cosas.', alto: 'Salgo en fila, sin correr y sin regresar por mochilas ni juguetes.' }],
      ['🌫️', 'Cuidado con el humo', { bajo: 'Si hay humo, me agacho y me tapo nariz y boca.', alto: 'Si hay humo, avanzo agachado y me cubro nariz y boca con la ropa: el humo sube.' }],
      ['🧯', 'El extintor es de adultos', { bajo: 'El extintor solo lo usan los adultos.', alto: 'El extintor solo lo usan adultos capacitados. Nosotros salimos.' }],
      ['📍', 'Punto de reunión', { bajo: 'Llego al punto de reunión y nos contamos.', alto: 'Llego al punto de reunión y mi docente cuenta a su grupo.' }]
    ],
    escuela: 'Todavía faltan extintores y letreros de salida en la escuela. ¡Nuestro proyecto ayuda a que se pongan! Mientras tanto, practicar la ruta con tu docente ayuda mucho.',
    tip: 'Las cosas se pueden reponer; ¡las personas no!' },
  senales: { nombre: 'Señales', emoji: '🚸', color: '#1FA463',
    intro: { bajo: 'Las señales usan colores para decirnos qué hacer. ¡Hay que aprenderlos!', alto: 'Las señales de seguridad usan colores y dibujos que se entienden aunque no sepamos leer. Conocerlas ayuda a actuar rápido.' },
    pasos: [
      ['🟢', 'Verde', { bajo: 'Lugares seguros, salidas y botiquín.', alto: 'Condiciones seguras: salidas, rutas de evacuación, botiquín y punto de reunión.' }],
      ['🔴', 'Rojo', { bajo: 'Fuego, extintores y cosas prohibidas.', alto: 'Equipo contra incendio (extintores) y prohibiciones.' }],
      ['🟡', 'Amarillo', { bajo: '¡Cuidado! Hay un peligro cerca.', alto: 'Advertencia: peligro cerca, como electricidad o piso resbaloso.' }],
      ['🔵', 'Azul', { bajo: 'Algo que debemos hacer.', alto: 'Obligación: algo que debemos hacer para estar seguros.' }]
    ],
    escuela: 'De 10 señales que revisó nuestro equipo, la escuela solo tiene 2: el punto de reunión y el botiquín. ¡Conviértete en detective de señales!',
    tip: '¿Ya visitaste la sección «Señales»? ¡Ahí puedes descubrirlas todas!' }
};

/* ---------- PREGUNTAS (la primera opción es la correcta) ---------- */
const QUIZ = [
  { t: 'inundacion', q: 'Veo agua sucia saliendo de las coladeras del patio. ¿Qué hago?', o: ['Me alejo y aviso a mi docente', 'Chapoteo en el agua', 'Meto la mano para ver qué hay'], why: 'El agua que sale del drenaje puede traer gérmenes. Lo mejor es alejarse y avisar a un adulto.' },
  { t: 'inundacion', q: '¿A quién avisa la escuela cuando las coladeras regresan el agua?', o: ['A JAPAMI', 'A la tienda', 'Al cine'], why: 'JAPAMI llega con equipo de bombeo y desazolve para limpiar las coladeras.' },
  { t: 'inundacion', q: '¿Por qué NO debemos caminar por el agua estancada?', o: ['Puede tener gérmenes y hacernos resbalar', 'Porque se moja el uniforme y ya', 'Porque a los patos no les gusta'], why: 'El agua estancada puede estar sucia, esconder hoyos y hacer que resbalemos.' },
  { t: 'inundacion', q: 'Cuando el piso está mojado, debemos caminar...', o: ['Despacio y con cuidado', 'Corriendo', 'Patinando'], why: 'Los pisos mojados resbalan. Caminar despacio evita caídas y golpes.', n: 'bajo' },
  { t: 'inundacion', q: 'Con las manos mojadas, los enchufes...', o: ['No se tocan', 'Se tocan rápido', 'Se limpian'], why: 'El agua y la electricidad son una mezcla muy peligrosa.' },
  { t: 'inundacion', q: 'Después de una inundación, ¿cuándo regresamos a clases?', o: ['Cuando la escuela esté limpia y segura', 'Al día siguiente, sin revisar nada', 'Cuando salga el sol'], why: 'Primero se limpia, se sanea y se revisa que todo esté seguro.' },
  { t: 'inundacion', q: 'Además de resbalones, ¿qué otro riesgo traen las inundaciones por drenaje?', o: ['Enfermedades por gérmenes e insectos', 'Que llueva chocolate', 'Que crezcan alas'], why: 'El agua sucia y los insectos pueden transmitir enfermedades. Por eso nos lavamos las manos.', n: 'alto' },
  { t: 'sismo', q: 'Durante un sismo, la regla es:', o: ['No corro, no grito, no empujo', 'Correr y gritar', 'Empujar para salir primero'], why: 'Mantener la calma nos ayuda a salir ordenados y a salvo.' },
  { t: 'sismo', q: 'Si tiembla, me alejo de...', o: ['Las ventanas y las cosas que pueden caer', 'Mi lonchera', 'Mi maestra o maestro'], why: 'Los vidrios y los objetos que caen pueden lastimarnos.' },
  { t: 'sismo', q: 'Al salir del salón en un sismo, ¿cómo vamos?', o: ['En fila con mi grupo', 'Cada quien por su lado', 'Corriendo a la calle'], why: 'En fila y con mi docente nadie se pierde ni se lastima.' },
  { t: 'sismo', q: '¿Para qué contamos a todos en el punto de reunión?', o: ['Para saber que todos estamos a salvo', 'Para ver quién llegó primero', 'Para jugar a las escondidas'], why: 'Si alguien falta, los adultos lo saben de inmediato.', n: 'alto' },
  { t: 'sismo', q: '¿A dónde vamos al terminar de salir del salón?', o: ['Al punto de reunión', 'De regreso al salón', 'A la tienda'], why: 'El punto de reunión es la zona segura donde nos juntamos y nos contamos.', n: 'bajo' },
  { t: 'incendio', q: 'Si huelo humo o veo fuego, lo primero es...', o: ['Avisar a un adulto', 'Buscar el fuego', 'Esconderme'], why: 'Un adulto sabe cómo dar la alarma y pedir ayuda.' },
  { t: 'incendio', q: 'Si hay mucho humo, me muevo...', o: ['Agachado y cubriéndome nariz y boca', 'Parado y corriendo', 'Saltando'], why: 'El humo sube, así que cerca del suelo hay aire más limpio.' },
  { t: 'incendio', q: '¿Quién puede usar un extintor?', o: ['Solo personas adultas capacitadas', 'Cualquier niño', 'Las mascotas'], why: 'Usar mal un extintor es peligroso. Nosotros salimos y avisamos.' },
  { t: 'incendio', q: '¿Cuál es el número de emergencias en México?', o: ['911', '123', '000'], why: 'El 911 funciona en todo el país.' },
  { t: 'incendio', q: 'Si hay fuego, ¿regreso por mi mochila?', o: ['No, salgo de inmediato', 'Sí, es muy importante', 'Solo si es nueva'], why: 'Las cosas se reponen; las personas no. Salimos sin regresar por nada.' },
  { t: 'senales', q: 'Una señal verde con una cruz blanca indica...', o: ['Botiquín de primeros auxilios', 'Tienda de dulces', 'Peligro eléctrico'], why: 'La cruz blanca sobre verde marca dónde están los primeros auxilios.' },
  { t: 'senales', q: 'Un triángulo amarillo con un rayo significa...', o: ['Peligro de electricidad', 'Zona de juegos', 'Salida'], why: 'Amarillo es advertencia y el rayo habla de electricidad.' },
  { t: 'senales', q: 'Cuatro flechas verdes que apuntan al centro marcan...', o: ['El punto de reunión', 'El comedor', 'Un baño'], why: 'Todas las flechas llegan al mismo lugar seguro: ¡el punto de reunión!' },
  { t: 'senales', q: 'Un círculo rojo con una raya cruzada significa...', o: ['Prohibido', 'Permitido', 'Hora de comer'], why: 'El rojo con una raya nos dice «no se hace».' },
  { t: 'senales', q: 'Las señales verdes nos ayudan a encontrar...', o: ['Salidas y lugares seguros', 'Dulces', 'Tareas'], why: 'El verde es el color de la seguridad.' },
  { t: 'escuela', q: '¿Dónde está el botiquín de nuestra escuela?', o: ['En la dirección', 'En el baño', 'En la cancha'], why: 'Hoy hay un botiquín de primeros auxilios en la oficina de dirección.' },
  { t: 'escuela', q: '¿Cómo se avisa en nuestra escuela cuando hay una emergencia?', o: ['Por los grupos de WhatsApp', 'Con un cohete', 'Por palomas'], why: 'Las vocales y el director se avisan por los grupos de WhatsApp.', n: 'alto' },
  { t: 'escuela', q: '¿Quién coordina la respuesta general en una emergencia?', o: ['El director', 'Un visitante', 'Nadie'], why: 'El director coordina, decide y comunica. Las y los docentes cuidan a sus grupos.' }
];

/* ---------- SECUENCIAS PARA ORDENAR ---------- */
const ORDEN = {
  inundacion: { nombre: 'Inundación', emoji: '🌧️', pasos: {
    bajo: ['Veo que sube el agua y aviso a un adulto', 'El director avisa a JAPAMI', 'Mi docente cuenta al grupo y salimos en fila', 'JAPAMI limpia las coladeras', 'Regresamos cuando la escuela está limpia y segura'],
    alto: ['Las vocales de padres ven la inundación y avisan', 'El director recibe el aviso por WhatsApp', 'El director y el intendente reportan a JAPAMI', 'Se evacúa en orden o se suspende el acceso, y se avisa a las familias', 'JAPAMI hace el bombeo y desazolve de las coladeras', 'Se limpia y se revisa que la escuela sea segura', 'Se documenta el reporte', 'Se avisa a las familias cuándo regresan las clases'] } },
  sismo: { nombre: 'Sismo', emoji: '🌎', pasos: {
    bajo: ['Mantengo la calma', 'Me alejo de las ventanas', 'Salgo en fila con mi grupo', 'Llego al punto de reunión', 'Mi docente nos cuenta'],
    alto: ['Mantengo la calma: no corro, no grito, no empujo', 'Me alejo de ventanas y objetos que pueden caer', 'Salgo en fila con mi docente por la ruta indicada', 'Llego al punto de reunión', 'Mi docente cuenta al grupo y esperamos indicaciones'] } },
  incendio: { nombre: 'Incendio', emoji: '🔥', pasos: {
    bajo: ['Aviso a un adulto', 'Un adulto llama al 911', 'Salgo en fila sin llevarme mis cosas', 'Llego al punto de reunión', 'Mi docente nos cuenta'],
    alto: ['Aviso a un adulto', 'Suena la alarma y un adulto llama al 911', 'Salgo en fila, agachado si hay humo, sin llevarme mis cosas', 'Llego al punto de reunión', 'Mi docente cuenta al grupo'] } }
};

/* ---------- MAPA (posiciones aproximadas, editar aquí) ---------- */
const PINES = [
  { id: 1, x: 150, y: 153, nivel: 'bajo', n: 'Piso levantado por raíces', d: 'Una raíz de árbol levantó y rompió el piso junto al salón. Puedes tropezar o golpearte.', k: 'Caminamos con cuidado y avisamos a la dirección.' },
  { id: 2, x: 300, y: 455, nivel: 'bajo', n: 'Malla de la orilla', d: 'La reja o malla del límite de la escuela puede caerse con lluvia y viento.', k: 'No nos recargamos ni jugamos junto a la malla.' },
  { id: 3, x: 640, y: 420, nivel: 'moderado', n: 'Parte sin barda', d: 'Una parte de la escuela (cerca del 40 %) no tiene barda. Quienes están ahí quedan expuestos a la lluvia y al viento.', k: 'Nos quedamos en zonas techadas cuando llueve.' },
  { id: 4, x: 640, y: 300, nivel: 'importante', n: 'Registro del drenaje', d: 'Aquí hay registros y terreno desnivelado. Cuando llueve mucho, el agua sucia puede regresar y traer gérmenes e insectos.', k: 'Si hay agua, no la pisamos y avisamos a un adulto.' },
  { id: 5, x: 425, y: 100, nivel: 'importante', n: 'Banqueta rota', d: 'Las losas están rotas y desniveladas. Con lluvia se encharcan y se vuelven muy resbalosas.', k: 'Caminamos despacio y evitamos los charcos.' },
  { id: 'bot', x: 300, y: 98, nivel: 'recurso', n: 'Botiquín', d: 'El botiquín de primeros auxilios está en la oficina de dirección.', k: 'Si alguien se lastima, avisamos a un adulto.' },
  { id: 'reu', x: 335, y: 195, nivel: 'recurso', n: 'Punto de reunión', d: 'Es nuestra zona segura en la explanada. Está cerca del asta bandera, así que hay que revisar si es el mejor lugar.', k: 'Aquí nos juntamos y nos contamos.' }
];
const NIVEL = { importante: ['#FFC93C', '#12306B', 'Atención alta'], moderado: ['#2F6FED', '#fff', 'Atención media'], bajo: ['#1FA463', '#fff', 'Atención baja'], recurso: ['#1FA463', '#fff', 'Recurso que sí tenemos'] };

/* ---------- PROCESO DE RESPUESTA (diagrama del diagnóstico) ---------- */
const PROCESO = [
  { e: '👀', t: 'Detectar la inundación', q: 'Vocales de padres', d: { bajo: 'Las mamás y papás que viven cerca ven que hay agua en la escuela.', alto: 'Las vocales de padres de familia cercanas a la escuela se dan cuenta de la inundación.' } },
  { e: '📱', t: 'Avisar al director', q: 'Vocales → Director', d: { bajo: 'Mandan un mensaje al director por WhatsApp.', alto: 'Se informa al director mediante los grupos de WhatsApp.' } },
  { e: '📞', t: 'Reportar a JAPAMI', q: 'Director e intendente', d: { bajo: 'El director y el intendente llaman a JAPAMI para pedir ayuda.', alto: 'El director y el intendente toman conocimiento y hacen el reporte a JAPAMI.' } },
  { e: '🔀', t: '¿Hay alumnos o personal en la escuela?', q: 'Director y docentes', d: { bajo: 'Depende de si ya estamos en la escuela o no.', alto: 'La respuesta depende de si ya hay personas dentro de la escuela.' },
    si: { bajo: 'SÍ: salimos en orden y avisan a las familias.', alto: 'SÍ: evacuación ordenada de alumnos y personal, y aviso a las familias por los grupos.' },
    no: { bajo: 'NO: no entramos y avisan a las familias.', alto: 'NO: suspensión preventiva; no se permite el ingreso y se avisa por los grupos.' } },
  { e: '⏳', t: 'Esperar a JAPAMI', q: 'Personal a cargo', d: { bajo: 'Un adulto espera a que llegue el camión de JAPAMI.', alto: 'El personal a cargo espera la llegada de la unidad de JAPAMI.' } },
  { e: '🔧', t: 'JAPAMI limpia las coladeras', q: 'JAPAMI', d: { bajo: 'Sacan el agua y destapan las coladeras.', alto: 'JAPAMI acude, realiza el bombeo y el desazolve de las coladeras.' } },
  { e: '🔀', t: '¿La escuela es segura para regresar?', q: 'Director', d: { bajo: 'Se revisa que todo esté limpio y seguro.', alto: 'Se verifica que las condiciones de la escuela permitan regresar.' },
    si: { bajo: 'SÍ: seguimos al siguiente paso.', alto: 'SÍ: se continúa con el registro y el aviso de regreso.' },
    no: { bajo: 'NO: seguimos sin clases hasta limpiar.', alto: 'NO: se mantiene la suspensión hasta terminar la limpieza y el saneamiento.' } },
  { e: '📝', t: 'Anotar lo que pasó', q: 'Dirección escolar', d: { bajo: 'Se guarda el reporte para recordar qué se hizo.', alto: 'Se documenta el reporte y las acciones tomadas por JAPAMI para tener antecedentes.' } },
  { e: '📣', t: 'Avisar a las familias', q: 'Director', d: { bajo: 'Les dicen cuándo volvemos a clases. ¡Regresamos!', alto: 'Se avisa a madres, padres y tutores sobre la reanudación de clases, según la hora en que se termine.' } }
];
const ROLES = [
  ['👨‍💼', 'Director', 'Coordina la respuesta general, toma decisiones, comunica la situación y supervisa la evacuación o el resguardo.', '#12306B'],
  ['🧹', 'Intendente', 'Apoya a identificar condiciones inseguras, verifica áreas de paso y ayuda durante la contingencia, sin sustituir al director ni a docentes.', '#1FA463'],
  ['👩‍🏫', 'Docentes de 1.º a 6.º', 'Cada docente cuida a su grupo, hace el conteo y lo lleva a la zona segura.', '#2F6FED']
];

/* ==================== UTILIDADES ==================== */
function speak(t) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t.replace(/\s+/g, ' '));
  u.lang = 'es-MX'; u.rate = .9; speechSynthesis.speak(u);
}
function confetti() {
  const box = $('#confetti'); const em = ['⭐', '🎉', '✨', '🦉', '🎈'];
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span'); s.textContent = em[i % em.length];
    s.style.left = Math.random() * 100 + 'vw'; s.style.animationDelay = Math.random() * .6 + 's';
    box.appendChild(s); setTimeout(() => s.remove(), 3400);
  }
}
function addStars(n) {
  state.stars += n; updateStars();
  try { localStorage.setItem('cp_stars', state.stars); } catch (e) {}
  const b = $('.starbox'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');
}
function updateStars() { $('#starCount').textContent = state.stars; }
function hydrateOwls(root = document) { $$('[data-owl]', root).forEach(e => { if (!e.firstChild) e.innerHTML = owl(e.dataset.owl === 'mini' ? '' : e.dataset.owl); }); }

/* ==================== NAVEGACIÓN ==================== */
const RENDER = { inicio: renderInicio, aprender: renderAprender, senales: renderSenales, juegos: renderJuegos, mapa: renderMapa, respuesta: renderRespuesta, maestros: renderMaestros };
function go(id) {
  if (!RENDER[id]) id = 'inicio';
  state.cur = id;
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  $$('#nav [data-go]').forEach(b => b.classList.toggle('on', b.dataset.go === id));
  RENDER[id]();
  hydrateOwls();
  try { history.replaceState(null, '', '#' + id); } catch (e) {}
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
function setNivel(n) {
  state.nivel = n; document.body.dataset.nivel = n;
  try { localStorage.setItem('cp_nivel', n); } catch (e) {}
  $$('.seg [data-nivel]').forEach(b => b.classList.toggle('on', b.dataset.nivel === n));
  if (state.cur !== 'juegos') RENDER[state.cur](); hydrateOwls();
}

/* ==================== INICIO ==================== */
const TIPS = ['¡Hola! Soy el Capitán Sipi. ¡Vamos a cuidar nuestra escuela!', 'En México, el número de emergencias es el 911.', 'Regla de oro en un sismo: no corro, no grito, no empujo.', 'Si el agua sale de las coladeras, no la pises y avisa a tu docente.', 'Los búhos vemos de noche, ¡pero en la escuela cuidamos de día!', 'El punto de reunión es nuestro lugar seguro para contarnos.', 'Con las manos mojadas, ¡no toques enchufes!'];
let tipI = 0;
function renderInicio() {
  const b = $('#bubble'); b.textContent = TIPS[tipI];
  $('#missions').innerHTML = [
    ['aprender', '📚', 'Aprender', 'Lluvias, sismo, incendio y señales', '#2F6FED'],
    ['senales', '🚸', 'Detective de señales', 'Descubre qué significa cada una', '#1FA463'],
    ['juegos', '🎮', 'Juegos', 'Quiz, ordenar pasos y memorama', '#FF8A3D'],
    ['mapa', '🗺️', 'Mapa de la escuela', 'Encuentra los lugares con riesgo', '#8E6BBF'],
    ['respuesta', '🌧️', 'Si se inunda', 'El plan paso a paso', '#E5484D']
  ].map(m => `<button class="mission" style="--c:${m[4]}" data-go="${m[0]}"><span class="em">${m[1]}</span><b>${m[2]}</b><span class="d">${m[3]}</span></button>`).join('');
  $('#facts').innerHTML = [[TOTAL_ALUMNOS, 'alumnas y alumnos'], [6, 'grupos'], [5, 'zonas para cuidar en el mapa'], [1, 'botiquín en dirección'], [1, 'punto de reunión']]
    .map(f => `<div class="fact"><b>${f[0]}</b><span>${f[1]}</span></div>`).join('');
}

/* ==================== APRENDER ==================== */
function renderAprender() {
  $('#topicTabs').innerHTML = Object.entries(TOPICS).map(([k, t]) => `<button class="tab ${k === state.topic ? 'on' : ''}" role="tab" data-t="${k}" style="--c:${t.color}"><span>${t.emoji}</span>${t.nombre}</button>`).join('');
  const t = TOPICS[state.topic];
  $('#topicBody').innerHTML = `<div style="--c:${t.color}" data-speakable>
    <div class="topic-head"><div class="big">${t.emoji}</div><div><h3>${t.nombre}</h3><p>${L(t.intro)}</p><button class="say" data-speak>🔊 Escuchar</button></div></div>
    <div class="steps">${t.pasos.map(p => `<div class="step"><span class="e">${p[0]}</span><h4>${p[1]}</h4><p>${L(p[2])}</p></div>`).join('')}</div>
    <div class="callout school"><span class="mini" data-owl="mini"></span><div><h4>En nuestra escuela</h4><p>${t.escuela}</p></div></div>
    <div class="callout"><span class="mini" data-owl="mini"></span><div><h4>El Capitán dice</h4><p>${t.tip}</p></div></div>
    <p><button class="btn alt" data-quiz="${state.topic}">🎮 ¡Pon a prueba lo que aprendiste!</button></p></div>`;
}

/* ==================== SEÑALES ==================== */
function renderSenales() {
  const lab = { ok: '✔ Sí la tenemos', falta: '✘ Nos falta', ojo: '⚠ Hay que revisar' };
  $('#signGrid').innerHTML = SIGNS.map((s, i) => `<button class="sign" data-sign="${i}" aria-label="${s.n}. Toca para ver su significado">
    <div class="in"><div class="face">${signSvg(s)}<b>${s.n}</b><small>Toca para voltear</small></div>
    <div class="face back"><b>${s.n}</b><p>${L(s.m)}</p><span class="chip ${s.e[0]}">${lab[s.e[0]]}</span><p><small>${s.e[1]}</small></p></div></div></button>`).join('');
}

/* ==================== JUEGOS ==================== */
function renderJuegos() { $('#juegosArea').innerHTML = menuJuegos(); }
function menuJuegos() {
  return `<div class="menu-games">
    <button class="gcard" style="--c:#2F6FED" data-game="quizmenu"><span class="em">❓</span><b>Quiz del Capitán</b><p>Responde preguntas y gana estrellas.</p></button>
    <button class="gcard" style="--c:#FF8A3D" data-game="ordenmenu"><span class="em">🔢</span><b>Ordena los pasos</b><p>¿Qué se hace primero? Pon todo en orden.</p></button>
    <button class="gcard" style="--c:#1FA463" data-game="memo"><span class="em">🧠</span><b>Memorama de señales</b><p>Encuentra cada señal con su nombre.</p></button></div>`;
}
const backBtn = `<button class="btn ghost back-btn" data-game="menu">← Volver a juegos</button>`;

function quizMenu() {
  $('#juegosArea').innerHTML = `${backBtn}<div class="card"><h3>❓ Quiz del Capitán</h3><p>¿De qué quieres que sea?</p><div class="pick">
    <button class="pill" data-quiz="mixto">🎲 Todo mezclado</button>
    <button class="pill" data-quiz="inundacion">🌧️ Lluvias e inundaciones</button>
    <button class="pill" data-quiz="sismo">🌎 Sismo</button>
    <button class="pill" data-quiz="incendio">🔥 Incendio</button>
    <button class="pill" data-quiz="senales">🚸 Señales</button>
    <button class="pill" data-quiz="escuela">🏫 Mi escuela</button></div></div>`;
}
function startQuiz(tema) {
  let pool = QUIZ.filter(q => (!q.n || q.n === state.nivel) && (tema === 'mixto' || q.t === tema));
  pool = shuffle(pool).slice(0, 8);
  const area = $('#juegosArea'); let i = 0, score = 0;
  const show = () => {
    const q = pool[i]; const opts = shuffle(q.o.map((t, k) => ({ t, ok: k === 0 })));
    area.innerHTML = `${backBtn}<div class="card"><div>Pregunta ${i + 1} de ${pool.length} · ⭐ ${score}</div>
      <div class="progress"><i style="width:${(i / pool.length) * 100}%"></i></div>
      <div class="qbody"><span class="mini" data-owl="mini"></span><h3>${q.q}</h3></div>
      <div class="opts">${opts.map((o, k) => `<button class="opt" data-k="${k}">${o.t}</button>`).join('')}</div>
      <div id="fb"></div></div>`;
    hydrateOwls(area);
    $$('.opt', area).forEach(b => b.onclick = () => {
      const o = opts[+b.dataset.k]; $$('.opt', area).forEach(x => { x.disabled = true; if (opts[+x.dataset.k].ok) x.classList.add('good'); });
      if (o.ok) score++; else b.classList.add('bad');
      $('#fb').innerHTML = `<div class="fb ${o.ok ? 'good' : 'bad'}">${o.ok ? '¡Muy bien! 🎉' : 'Casi. '} ${q.why}</div><button class="btn" id="nx">${i + 1 < pool.length ? 'Siguiente →' : 'Ver mi resultado'}</button>`;
      $('#nx').onclick = () => { i++; i < pool.length ? show() : end(); };
    });
  };
  const end = () => {
    const pct = score / pool.length; const st = pct >= .8 ? 3 : pct >= .5 ? 2 : 1;
    addStars(st); if (st >= 2) confetti();
    area.innerHTML = `${backBtn}<div class="card result"><div class="mini" data-owl="hero wave" style="width:150px;margin:auto"></div>
      <h3>${st === 3 ? '¡Eres un súper protector!' : st === 2 ? '¡Muy bien hecho!' : '¡Buen intento, sigue practicando!'}</h3>
      <div class="stars">${'⭐'.repeat(st)}</div><p>Acertaste ${score} de ${pool.length}. Ganaste ${st} estrella${st > 1 ? 's' : ''}.</p>
      <button class="btn" data-quiz="${tema}">Jugar otra vez</button> <button class="btn alt" data-go="aprender">📚 Repasar</button></div>`;
    hydrateOwls(area);
  };
  show();
}

function ordenMenu() {
  $('#juegosArea').innerHTML = `${backBtn}<div class="card"><h3>🔢 Ordena los pasos</h3><p>¿Qué emergencia quieres practicar?</p><div class="pick">${Object.entries(ORDEN).map(([k, o]) => `<button class="pill" data-orden="${k}">${o.emoji} ${o.nombre}</button>`).join('')}</div></div>`;
}
function startOrden(k) {
  const o = ORDEN[k]; const correct = o.pasos[state.nivel]; let next = 0;
  const pool = shuffle(correct.map((t, i) => ({ t, i })));
  const area = $('#juegosArea');
  area.innerHTML = `${backBtn}<div class="card"><h3>${o.emoji} ${o.nombre}: ¿qué va primero?</h3><p>Toca los pasos en el orden correcto.</p>
    <div class="order-slots" id="slots">${correct.map((_, i) => `<div class="slot"><span class="n">${i + 1}</span><span class="txt"></span></div>`).join('')}</div>
    <div class="hint" id="hint"></div><div class="order-pool" id="pool">${pool.map(p => `<button class="ocard" data-i="${p.i}">${p.t}</button>`).join('')}</div></div>`;
  $$('#pool .ocard').forEach(b => b.onclick = () => {
    if (+b.dataset.i === next) {
      const s = $$('#slots .slot')[next]; s.classList.add('full'); $('.txt', s).textContent = b.textContent; b.remove(); next++; $('#hint').textContent = '';
      if (next === correct.length) { addStars(3); confetti(); $('#hint').innerHTML = '🎉 ¡Perfecto! Ganaste 3 estrellas. <button class="btn" data-orden="' + k + '">Otra vez</button>'; }
    } else { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); $('#hint').textContent = 'Mmm, ese paso viene después. ¡Inténtalo otra vez!'; }
  });
}

function startMemo() {
  const n = state.nivel === 'bajo' ? 6 : 8; const sel = shuffle(SIGNS).slice(0, n);
  const cards = shuffle(sel.flatMap(s => [{ id: s.id, t: 'svg', s }, { id: s.id, t: 'txt', s }]));
  const area = $('#juegosArea'); let open = [], lock = false, found = 0;
  area.innerHTML = `${backBtn}<div class="card"><h3>🧠 Memorama de señales</h3><p>Une cada señal con su nombre.</p><div class="memo" id="memo">${cards.map((c, i) => `<button class="mcard" data-i="${i}" aria-label="Carta ${i + 1}">🦉</button>`).join('')}</div><div class="hint" id="hint"></div></div>`;
  const face = c => c.t === 'svg' ? signSvg(c.s) : `<span>${c.s.n}</span>`;
  $$('#memo .mcard').forEach(b => b.onclick = () => {
    const i = +b.dataset.i; if (lock || b.classList.contains('up') || b.classList.contains('done')) return;
    b.classList.add('up'); b.innerHTML = face(cards[i]); open.push(i);
    if (open.length === 2) {
      const [a, c] = open; lock = true;
      if (cards[a].id === cards[c].id && cards[a].t !== cards[c].t) {
        setTimeout(() => { [a, c].forEach(x => { const e = $$('#memo .mcard')[x]; e.classList.remove('up'); e.classList.add('done'); }); found++; open = []; lock = false; $('#hint').textContent = '¡Pareja encontrada! ' + cards[a].s.n;
          if (found === n) { addStars(3); confetti(); $('#hint').innerHTML = '🎉 ¡Lo lograste! Ganaste 3 estrellas. <button class="btn" data-game="memo">Otra vez</button>'; } }, 450);
      } else setTimeout(() => { [a, c].forEach(x => { const e = $$('#memo .mcard')[x]; e.classList.remove('up'); e.textContent = '🦉'; }); open = []; lock = false; }, 900);
    }
  });
}

/* ==================== MAPA ==================== */
function renderMapa() {
  const pin = p => {
    const [bg, fg] = NIVEL[p.nivel]; const rec = p.nivel === 'recurso';
    const glyph = p.id === 'bot' ? `<path d="M0 -8v16M-8 0h16" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` : p.id === 'reu' ? `<path d="M0 -9v18M-9 0h18" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle r="4" fill="#fff"/>` : `<text y="6" text-anchor="middle" font-family="Baloo 2,Arial" font-weight="800" font-size="17" fill="${fg}">${p.id}</text>`;
    return `<g class="pin" tabindex="0" role="button" data-pin="${p.id}" aria-label="${p.n}" transform="translate(${p.x} ${p.y})">${p.nivel === 'importante' ? `<circle class="ring" r="17" fill="${bg}"/>` : ''}<circle class="pc" r="${rec ? 15 : 17}" fill="${bg}" stroke="#fff" stroke-width="3"/>${glyph}</g>`;
  };
  const trees = [[50, 160], [50, 195], [50, 230], [410, 255], [410, 285], [410, 315], [410, 345], [410, 375], [410, 405], [400, 150], [100, 60]].map(t => `<circle cx="${t[0]}" cy="${t[1]}" r="12" fill="#3BA55D"/><circle cx="${t[0] - 4}" cy="${t[1] - 4}" r="6" fill="#58C277"/>`).join('');
  $('#mapSvgBox').innerHTML = `<svg viewBox="0 0 720 480" role="img" aria-label="Mapa esquemático de la escuela con zonas de riesgo y recursos">
    <rect width="720" height="480" rx="18" fill="#E7F5E1"/>
    <path d="M30,30 H690 V200" stroke="#2F6FED" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30,30 V300" stroke="#2F6FED" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M30,300 V455 H560" stroke="#1FA463" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M560,455 H690 V200" stroke="#12306B" stroke-width="4" stroke-dasharray="12 8" fill="none"/>
    <rect x="70" y="70" width="160" height="70" rx="10" fill="#4C7CF0"/><text x="150" y="112" text-anchor="middle" font-family="Baloo 2,Arial" font-weight="800" font-size="17" fill="#fff">Aulas</text>
    <rect x="240" y="70" width="140" height="70" rx="10" fill="#2F6FED"/><text x="310" y="130" text-anchor="middle" font-family="Baloo 2,Arial" font-weight="800" font-size="17" fill="#fff">Dirección</text>
    <rect x="70" y="165" width="310" height="60" rx="14" fill="#F3E7C9"/><text x="225" y="200" text-anchor="middle" font-family="Baloo 2,Arial" font-weight="800" font-size="15" fill="#6B5A2E">Explanada</text>
    <rect x="70" y="240" width="190" height="60" rx="10" fill="#4C7CF0"/><text x="165" y="276" text-anchor="middle" font-family="Baloo 2,Arial" font-weight="800" font-size="17" fill="#fff">Aulas</text>
    <rect x="268" y="240" width="112" height="60" rx="10" fill="#6D8FF5"/><text x="324" y="276" text-anchor="middle" font-family="Baloo 2,Arial" font-weight="800" font-size="15" fill="#fff">Sanitarios</text>
    <rect x="70" y="325" width="310" height="115" rx="6" fill="#E9B872" stroke="#fff" stroke-width="3"/><line x1="225" y1="325" x2="225" y2="440" stroke="#fff" stroke-width="3"/><circle cx="225" cy="382" r="21" fill="none" stroke="#fff" stroke-width="3"/><rect x="70" y="355" width="44" height="54" fill="none" stroke="#fff" stroke-width="3"/><rect x="336" y="355" width="44" height="54" fill="none" stroke="#fff" stroke-width="3"/>
    <text x="225" y="318" text-anchor="middle" font-family="Baloo 2,Arial" font-weight="800" font-size="14" fill="#6B5A2E">Cancha</text>
    ${trees}
    <rect x="530" y="272" width="80" height="150" rx="8" fill="#C9D3E6" stroke="#fff" stroke-width="3"/><text transform="translate(578 347) rotate(-90)" text-anchor="middle" font-family="Baloo 2,Arial" font-weight="800" font-size="15" fill="#12306B">Estacionamiento</text>
    <rect x="590" y="100" width="30" height="16" rx="6" fill="#9AA5B8"/><rect x="630" y="100" width="30" height="16" rx="6" fill="#B03A48"/>
    <text x="45" y="474" font-family="Nunito,Arial" font-weight="800" font-size="13" fill="#12306B">Acceso principal</text>
    <text x="610" y="256" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="12" fill="#12306B">Entrada estacionamiento</text>
    ${PINES.map(pin).join('')}</svg>`;
  $('#mapLegend').innerHTML = [['importante', 'Atención alta'], ['moderado', 'Atención media'], ['bajo', 'Atención baja'], ['recurso', 'Lo que sí tenemos']].map(l => `<span><i style="background:${NIVEL[l[0]][0]}"></i>${l[1]}</span>`).join('') + `<span>Mapa esquemático: no está a escala</span>`;
  showPin(null);
}
function showPin(id) {
  const p = PINES.find(x => String(x.id) === String(id)); const box = $('#mapInfo');
  if (!p) { box.innerHTML = `<h3>¡Explora el mapa!</h3><p>Toca un número para ver qué peligro hay en ese lugar, o la cruz verde para encontrar el botiquín.</p><div class="map-owl" data-owl="wave"></div>`; hydrateOwls(box); return; }
  box.innerHTML = `<span class="nivel ${p.nivel}">${NIVEL[p.nivel][2]}</span><h3>${p.nivel === 'recurso' ? '' : 'Zona ' + p.id + ': '}${p.n}</h3><p>${p.d}</p><div class="callout"><div><h4>¿Qué hacemos?</h4><p>${p.k}</p></div></div><button class="say" data-speak-text="${p.n}. ${p.d} ${p.k}">🔊 Escuchar</button>`;
}

/* ==================== PROCESO ==================== */
let pasoI = 0;
function renderRespuesta() {
  const p = PROCESO[pasoI]; const n = PROCESO.length;
  $('#stepper').innerHTML = `<div class="stepper"><div class="dots">${PROCESO.map((_, i) => `<i class="${i < pasoI ? 'on' : i === pasoI ? 'cur' : ''}"></i>`).join('')}</div>
    <div data-speakable><div class="sbody"><div class="icon">${p.e}</div><div><span class="who">${p.q}</span><h3>Paso ${pasoI + 1}: ${p.t}</h3><p>${L(p.d)}</p>
    ${p.si ? `<div class="branch"><div class="si">${L(p.si)}</div><div class="no">${L(p.no)}</div></div>` : ''}</div></div>
    <button class="say" data-speak>🔊 Escuchar</button></div>
    <div class="snav"><button class="btn ghost" id="prevP" ${pasoI === 0 ? 'disabled' : ''}>← Anterior</button>
    ${pasoI < n - 1 ? '<button class="btn" id="nextP">Siguiente →</button>' : '<button class="btn ok" id="doneP">🎉 ¡Terminé!</button>'}</div></div>`;
  $('#prevP').onclick = () => { pasoI = Math.max(0, pasoI - 1); renderRespuesta(); };
  const nx = $('#nextP'); if (nx) nx.onclick = () => { pasoI++; renderRespuesta(); };
  const dn = $('#doneP'); if (dn) dn.onclick = () => { addStars(2); confetti(); pasoI = 0; renderRespuesta(); };
  $('#roles').innerHTML = ROLES.map(r => `<div class="role" style="--c:${r[3]}"><span style="font-size:2.4rem">${r[0]}</span><h4>${r[1]}</h4><p>${r[2]}</p>${r[1].startsWith('Docentes') ? `<div class="grades">${GRUPOS.map(g => `<div>${g[0]}<b>${g[1]}</b>alumnos</div>`).join('')}</div>` : ''}</div>`).join('');
}

/* ==================== DOCENTES ==================== */
function renderMaestros() {
  const color = pct => pct >= 75 ? '#1FA463' : pct >= 50 ? '#FFC93C' : '#E5484D';
  $('#teacher').innerHTML = `
  <p class="note">Esta guía resume el diagnóstico de campo (checklist, entrevista, recorrido y registro de riesgos). La página apoya el aprendizaje y no sustituye los protocolos oficiales de Protección Civil.</p>
  <div class="t-grid">
    <div class="card t-card"><h3>Cumplimiento general de seguridad</h3>
      <div class="gauge"><i style="width:${CUMPLIMIENTO.pct}%"></i></div>
      <p><b>${CUMPLIMIENTO.pct} %</b> · ${CUMPLIMIENTO.cumplen} elementos cumplen y ${CUMPLIMIENTO.noCumplen} no cumplen. Nivel: <b>${CUMPLIMIENTO.nivel}</b>.</p>
      <div class="bars">${SECCIONES.map(s => { const pct = Math.round(s[1] / s[2] * 100); return `<div class="row"><span>${s[0]}</span><div class="bar"><i style="width:${pct}%;background:${color(pct)}"></i></div><span>${s[1]}/${s[2]}</span></div>`; }).join('')}</div></div>
    <div class="card t-card"><h3>Lo que ya tenemos</h3><ul><li>Botiquín en dirección con materiales básicos</li><li>Aviso por grupos de WhatsApp</li><li>Punto de reunión señalizado</li><li>Pasillos libres y puertas que abren fácil</li><li>Mobiliario, instalaciones eléctricas y áreas de juego en buen estado</li></ul>
      <h3 style="margin-top:14px">Lo que falta</h3><ul><li>Señalética, extintores y lámparas de emergencia</li><li>Protocolo escrito de Protección Civil</li><li>Brigadas y simulacros</li><li>Capacitación y números de emergencia visibles</li><li>Mejor ubicación del punto de reunión</li></ul></div>
  </div>
  <div class="card t-card"><h3>Necesidades prioritarias del diagnóstico</h3>
    <table class="prio"><thead><tr><th>#</th><th>Necesidad</th><th>Prioridad</th></tr></thead><tbody>${PRIORIDADES.map((p, i) => `<tr><td>${i + 1}</td><td>${p[0]}</td><td><span class="p ${p[1] === 'Muy alta' ? 'mu' : p[1] === 'Alta' ? 'al' : 'ma'}">${p[1]}</span></td></tr>`).join('')}</tbody></table></div>
  <div class="t-grid" style="margin-top:16px">
    <div class="card t-card"><h3>Cómo usar la página en clase</h3><ul><li><b>Para todos los grados:</b> use el botón 🔊 para escuchar los textos, el memorama, el quiz mixto y «Ordena los pasos». En 1.º a 3.º guíe la lectura en voz alta.</li><li>Proyecte el <b>Mapa</b> y pida a cada grupo que encuentre las zonas de atención alta.</li><li>Recorra la escuela como «detectives de señales» con la lista de la sección Señales.</li></ul></div>
    <div class="card t-card"><h3>Preguntas para dialogar</h3><ul><li>¿Qué hacemos si vemos agua saliendo de las coladeras?</li><li>¿Por qué no se debe pisar el agua del drenaje?</li><li>¿Es el mejor lugar el punto de reunión actual, tan cerca del asta bandera?</li><li>¿Qué señal nos gustaría ver primero en la escuela y por qué?</li><li>¿Quién avisa a quién en nuestra escuela?</li></ul></div>
  </div>`;
}

/* ==================== EVENTOS ==================== */
document.addEventListener('click', e => {
  const t = e.target;
  let el;
  if ((el = t.closest('[data-go]'))) return go(el.dataset.go);
  if ((el = t.closest('.seg [data-nivel]'))) return setNivel(el.dataset.nivel);
  if ((el = t.closest('[data-t]'))) { state.topic = el.dataset.t; renderAprender(); hydrateOwls(); return; }
  if ((el = t.closest('[data-sign]'))) return el.classList.toggle('flipped');
  if ((el = t.closest('[data-quiz]'))) { if (state.cur !== 'juegos') { go('juegos'); } return startQuiz(el.dataset.quiz); }
  if ((el = t.closest('[data-orden]'))) return startOrden(el.dataset.orden);
  if ((el = t.closest('[data-game]'))) {
    const g = el.dataset.game;
    return g === 'menu' ? renderJuegos() : g === 'quizmenu' ? quizMenu() : g === 'ordenmenu' ? ordenMenu() : g === 'memo' ? startMemo() : null;
  }
  if ((el = t.closest('[data-pin]'))) return showPin(el.dataset.pin);
  if ((el = t.closest('[data-speak-text]'))) return speak(el.dataset.speakText);
  if ((el = t.closest('[data-speak]'))) { const s = el.closest('[data-speakable]'); return s && speak(s.innerText.replace('🔊 Escuchar', '')); }
  if (t.closest('#owlBtn')) { tipI = (tipI + 1) % TIPS.length; $('#bubble').textContent = TIPS[tipI]; speak(TIPS[tipI]); }
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.pin')) { e.preventDefault(); showPin(e.target.dataset.pin); }
});

/* ==================== INICIO DE LA APP ==================== */
document.body.dataset.nivel = state.nivel;
$$('.seg [data-nivel]').forEach(b => b.classList.toggle('on', b.dataset.nivel === state.nivel));
updateStars(); hydrateOwls();
go((location.hash || '#inicio').slice(1));
