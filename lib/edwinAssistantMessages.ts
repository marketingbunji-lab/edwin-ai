export const edwinAssistantMessages = {
  idle: [
    "¡Estoy en superposición para ayudarte!",
    "Flotando entre posibilidades...",
    "Observando el universo de tus ideas.",
    "Listo para colapsar en una gran solución.",
    "Explorando infinitas alternativas.",
    "Tu asistente cuántico está aquí.",
    "Vibrando en la frecuencia de tus proyectos.",
    "Conectando partículas de creatividad.",
  ],
  welcome: [
    "¡Hola! ¿Qué universo vamos a construir hoy?",
    "Bienvenido al laboratorio de ideas.",
    "¿Listo para materializar algo increíble?",
    "Cada gran proyecto comienza con una pregunta.",
    "Estoy aquí para ayudarte a dar el siguiente paso.",
    "Activando modo creatividad.",
    "Descubramos nuevas posibilidades juntos.",
  ],
  thinking: [
    "Analizando múltiples realidades...",
    "Calculando la mejor trayectoria...",
    "Colapsando posibilidades...",
    "Buscando la solución más brillante...",
    "Conectando partículas de información...",
    "Afinando los detalles del universo...",
    "Explorando dimensiones de creatividad...",
  ],
  loading: [
    "Cargando energía cuántica...",
    "Organizando átomos de información...",
    "Sincronizando órbitas...",
    "Preparando una respuesta estelar...",
    "Ajustando el campo de posibilidades...",
    "Generando algo especial...",
  ],
  processing: [
    "Transformando ideas en realidad...",
    "Tejiendo partículas de conocimiento...",
    "Dando forma a una nueva solución...",
    "Combinando creatividad y estrategia...",
    "Ordenando el caos con precisión cuántica...",
  ],
  success: [
    "¡Proceso completado con éxito!",
    "¡La energía se ha estabilizado!",
    "¡Tu idea ya tomó forma!",
    "¡Todo está en equilibrio!",
    "¡Misión cumplida!",
  ],
  error: [
    "Ups... una partícula se salió de órbita.",
    "El universo encontró una anomalía.",
    "Algo interrumpió el flujo cuántico.",
    "No pude estabilizar esta realidad.",
    "Intentemos una nueva trayectoria.",
  ],
  retry: [
    "Recalculando posibilidades...",
    "Probando otra dimensión...",
    "Intentémoslo de nuevo.",
    "Ajustando la trayectoria...",
  ],
  waiting: [
    "Esperando tu próxima instrucción...",
    "Suspendido en un estado cuántico...",
    "Flotando hasta tu siguiente idea...",
    "Aquí estaré cuando me necesites.",
  ],
  invitation: [
    "Cuéntame tu idea y la haremos realidad.",
    "Describe lo que imaginas.",
    "¿Qué te gustaría crear hoy?",
    "Explora nuevas posibilidades conmigo.",
    "Comencemos con una simple pregunta.",
  ],
  encouragement: [
    "Toda gran idea comienza con una chispa.",
    "Las mejores soluciones nacen de la curiosidad.",
    "El universo favorece a quienes experimentan.",
    "Cada intento abre nuevas posibilidades.",
    "Tu creatividad no tiene límites.",
  ],
  saving: [
    "Guardando en la memoria del universo...",
    "Conservando esta nueva realidad...",
    "Estabilizando tus avances...",
  ],
  uploading: [
    "Recibiendo nuevas partículas...",
    "Integrando información al sistema...",
    "Procesando tus archivos...",
  ],
  downloading: [
    "Empaquetando energía para ti...",
    "Preparando tu creación...",
    "Materializando el resultado...",
  ],
  searching: [
    "Explorando la galaxia de datos...",
    "Buscando entre infinitas posibilidades...",
    "Rastreando la mejor respuesta...",
  ],
  generating: [
    "Generando una nueva realidad...",
    "Dando vida a tu idea...",
    "Creando algo extraordinario...",
    "Moldeando partículas de innovación...",
  ],
  typing: [
    "Traduciendo pensamientos en palabras...",
    "Escribiendo desde otra dimensión...",
    "Organizando ideas para ti...",
  ],
  goodbye: [
    "Seguiré orbitando cerca de tus ideas.",
    "Hasta la próxima aventura cuántica.",
    "Que tus ideas sigan expandiéndose.",
    "Nos vemos en la siguiente dimensión.",
  ],
} as const;

export function getRandomEdwinAssistantMessage(
  state: keyof typeof edwinAssistantMessages,
) {
  const messages = edwinAssistantMessages[state];
  return messages[Math.floor(Math.random() * messages.length)];
}
