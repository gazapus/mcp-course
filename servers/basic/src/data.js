export const quotes = [
  {
    sentence: "El café no resuelve los problemas, pero hace que los problemas parezcan más despiertos.",
    character: {
      name: "Barista Anónimo",
      slug: "barista-anonimo",
      house: { name: "Cafetería Universal", slug: "cafeteria-universal" },
    },
  },
  {
    sentence: "Si la vida te da limones, pregunta por el azúcar antes de hacer limonada.",
    character: {
      name: "Optimista Práctico",
      slug: "optimista-practico",
      house: { name: "Club del Vaso Medio Lleno", slug: "vaso-medio-lleno" },
    },
  },
  {
    sentence: "No pospongas para mañana lo que puedes olvidar para siempre.",
    character: {
      name: "Maestro de la Procrastinación",
      slug: "maestro-procrastinacion",
      house: { name: "Orden del Snooze", slug: "orden-del-snooze" },
    },
  },
  {
    sentence: "Un bug en producción es solo una feature que nadie documentó.",
    character: {
      name: "Desarrollador Senior",
      slug: "desarrollador-senior",
      house: { name: "Legión del Deploy Viernes", slug: "deploy-viernes" },
    },
  },
  {
    sentence: "La gravedad no es una ley, es una sugerencia muy persistente.",
    character: {
      name: "Físico Rebelde",
      slug: "fisico-rebelde",
      house: { name: "Academia de la Caída Libre", slug: "caida-libre" },
    },
  },
  {
    sentence: "Correr no es escapar de tus problemas, pero al menos llegas más lejos que ellos.",
    character: {
      name: "Maratonista Filosófico",
      slug: "maratonista-filosofico",
      house: { name: "Gremio de las Zapatillas Gastadas", slug: "zapatillas-gastadas" },
    },
  },
  {
    sentence: "La mejor receta tiene dos ingredientes: hambre y paciencia.",
    character: {
      name: "Chef de Emergencia",
      slug: "chef-emergencia",
      house: { name: "Cocina del Último Minuto", slug: "ultimo-minuto" },
    },
  },
  {
    sentence: "El silencio es oro, pero el ruido de notificaciones es cobre oxidado.",
    character: {
      name: "Monje Digital",
      slug: "monje-digital",
      house: { name: "Templo del Modo Avión", slug: "modo-avion" },
    },
  },
  {
    sentence: "No todos los que vagan están perdidos; algunos solo siguen el GPS equivocado.",
    character: {
      name: "Viajero Incierto",
      slug: "viajero-incierto",
      house: { name: "Camino Sin Señal", slug: "camino-sin-senal" },
    },
  },
  {
    sentence: "La creatividad empieza cuando el plan original deja de funcionar.",
    character: {
      name: "Inventor Improvisado",
      slug: "inventor-improvisado",
      house: { name: "Taller del Plan B", slug: "plan-b" },
    },
  },
];

/**
 * @param {number} count
 */
export function getRandomQuotes(count) {
  if (count <= 0) {
    throw new Error("count must be a positive number");
  }
  if (count > quotes.length) {
    throw new Error(`maximum number of quotes is ${quotes.length}`);
  }

  const shuffled = [...quotes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
