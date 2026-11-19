import type { Verb } from "./types";

type Opts = Partial<Omit<Verb, "inf" | "es" | "partizip" | "aux" | "example">>;

function v(
  inf: string,
  es: string,
  partizip: string,
  aux: "haben" | "sein",
  example: [string, string],
  opts: Opts = {},
): Verb {
  const tags = [...(opts.tags ?? [])];
  if (opts.prefix && !tags.includes("trennbar")) tags.push("trennbar");
  if ((opts.present || opts.stemChange) && !tags.includes("unregelmäßig") && !tags.includes("modal"))
    tags.push("unregelmäßig");
  return { inf, es, partizip, aux, example: { de: example[0], es: example[1] }, ...opts, tags };
}

const modal = (
  inf: string,
  es: string,
  present: Verb["present"],
  praeteritum: Verb["praeteritum"],
  example: [string, string],
  partizip = "",
) => v(inf, es, partizip, "haben", example, { present, praeteritum, tags: ["modal"], imperativ: null });

export const VERBS: Verb[] = [
  // ——— Kapitel 1 ———
  v("sein", "ser / estar", "gewesen", "sein", ["Ich bin Lehrerin.", "Soy profesora."], {
    present: ["bin", "bist", "ist", "sind", "seid", "sind"],
    praeteritum: ["war", "warst", "war", "waren", "wart", "waren"],
    imperativ: { du: "Sei!", ihr: "Seid!", Sie: "Seien Sie!" },
  }),
  v("heißen", "llamarse", "geheißen", "haben", ["Wie heißt du?", "¿Cómo te llamas?"]),
  v("kommen", "venir", "gekommen", "sein", ["Ich komme aus Kolumbien.", "Vengo de Colombia."]),
  v("wohnen", "vivir (residir)", "gewohnt", "haben", ["Wir wohnen in Berlin.", "Vivimos en Berlín."]),
  v("sprechen", "hablar", "gesprochen", "haben", ["Sprichst du Englisch?", "¿Hablas inglés?"], {
    stemChange: "sprich",
  }),
  v("buchstabieren", "deletrear", "buchstabiert", "haben", [
    "Können Sie das bitte buchstabieren?",
    "¿Puede deletrearlo, por favor?",
  ]),
  v("lernen", "aprender / estudiar", "gelernt", "haben", ["Ich lerne Deutsch.", "Aprendo alemán."]),
  v("hören", "oír / escuchar", "gehört", "haben", ["Hör gut zu!", "¡Escucha bien!"]),
  v("schreiben", "escribir", "geschrieben", "haben", ["Sie schreibt eine E-Mail.", "Ella escribe un correo."]),
  v("lesen", "leer", "gelesen", "haben", ["Er liest die Zeitung.", "Él lee el periódico."], { stemChange: "lies" }),

  // ——— Kapitel 2 ———
  v("haben", "tener", "gehabt", "haben", ["Hast du Zeit?", "¿Tienes tiempo?"], {
    present: ["habe", "hast", "hat", "haben", "habt", "haben"],
    praeteritum: ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"],
    imperativ: { du: "Hab!", ihr: "Habt!", Sie: "Haben Sie!" },
  }),
  v("arbeiten", "trabajar", "gearbeitet", "haben", ["Sie arbeitet als Ärztin.", "Ella trabaja como médica."]),
  v("machen", "hacer", "gemacht", "haben", ["Was machst du am Wochenende?", "¿Qué haces el fin de semana?"]),
  v("spielen", "jugar / tocar (instrumento)", "gespielt", "haben", ["Wir spielen Fußball.", "Jugamos al fútbol."]),
  v("tanzen", "bailar", "getanzt", "haben", ["Tanzt ihr gern?", "¿Os gusta bailar?"]),
  v("schwimmen", "nadar", "geschwommen", "sein", ["Ich schwimme jeden Montag.", "Nado todos los lunes."]),
  v("kochen", "cocinar", "gekocht", "haben", ["Mein Bruder kocht sehr gut.", "Mi hermano cocina muy bien."]),
  v("reisen", "viajar", "gereist", "sein", ["Sie reisen gern nach Italien.", "Les gusta viajar a Italia."]),
  v("fotografieren", "fotografiar", "fotografiert", "haben", [
    "Er fotografiert die Stadt.",
    "Él fotografía la ciudad.",
  ]),
  v("wandern", "hacer senderismo", "gewandert", "sein", ["Am Sonntag wandern wir.", "El domingo hacemos senderismo."]),
  v("sammeln", "coleccionar", "gesammelt", "haben", ["Ich sammle Briefmarken.", "Colecciono sellos."]),
  v("studieren", "estudiar (en la universidad)", "studiert", "haben", [
    "Mia studiert Medizin.",
    "Mia estudia medicina.",
  ]),

  // ——— Kapitel 3 ———
  v("fahren", "ir (en vehículo) / conducir", "gefahren", "sein", ["Fährst du mit dem Bus?", "¿Vas en autobús?"], {
    stemChange: "fähr",
  }),
  v("gehen", "ir (a pie)", "gegangen", "sein", ["Wir gehen zum Hafen.", "Vamos al puerto."]),
  v("finden", "encontrar / opinar", "gefunden", "haben", ["Ich finde die Stadt schön.", "Me parece bonita la ciudad."]),
  v("suchen", "buscar", "gesucht", "haben", ["Ich suche den Bahnhof.", "Busco la estación."]),
  v("sehen", "ver", "gesehen", "haben", ["Siehst du das Schiff?", "¿Ves el barco?"], { stemChange: "sieh" }),
  v("fragen", "preguntar", "gefragt", "haben", ["Frag doch die Frau dort!", "¡Pregúntale a la señora de allí!"]),
  v("geben", "dar", "gegeben", "haben", ["Hier gibt es viele Museen.", "Aquí hay muchos museos."], {
    stemChange: "gib",
  }),
  v("besichtigen", "visitar (un lugar)", "besichtigt", "haben", [
    "Wir besichtigen die Kirche.",
    "Visitamos la iglesia.",
  ]),

  // ——— Kapitel 4 ———
  v("essen", "comer", "gegessen", "haben", ["Isst du gern Fisch?", "¿Te gusta comer pescado?"], {
    stemChange: "iss",
  }),
  v("trinken", "beber", "getrunken", "haben", ["Ich trinke einen Kaffee.", "Tomo un café."]),
  v("nehmen", "tomar / coger", "genommen", "haben", ["Ich nehme die Suppe.", "Tomo la sopa."], {
    stemChange: "nimm",
  }),
  modal(
    "mögen",
    "gustar",
    ["mag", "magst", "mag", "mögen", "mögt", "mögen"],
    ["mochte", "mochtest", "mochte", "mochten", "mochtet", "mochten"],
    ["Magst du Käse?", "¿Te gusta el queso?"],
    "gemocht",
  ),
  modal(
    "möchten",
    "querer (cortés) / desear",
    ["möchte", "möchtest", "möchte", "möchten", "möchtet", "möchten"],
    undefined,
    ["Ich möchte ein Wasser, bitte.", "Quisiera un agua, por favor."],
  ),
  v("kaufen", "comprar", "gekauft", "haben", ["Wir kaufen Brot und Butter.", "Compramos pan y mantequilla."]),
  v("einkaufen", "hacer la compra", "eingekauft", "haben", [
    "Am Samstag kaufe ich ein.",
    "El sábado hago la compra.",
  ], { prefix: "ein" }),
  v("kosten", "costar", "gekostet", "haben", ["Was kostet das Obst?", "¿Cuánto cuesta la fruta?"]),
  v("brauchen", "necesitar", "gebraucht", "haben", ["Wir brauchen noch Milch.", "Todavía necesitamos leche."]),
  v("bezahlen", "pagar", "bezahlt", "haben", ["Ich möchte bitte bezahlen.", "Quisiera pagar, por favor."]),
  v("frühstücken", "desayunar", "gefrühstückt", "haben", [
    "Wir frühstücken um sieben Uhr.",
    "Desayunamos a las siete.",
  ]),
  v("schmecken", "saber (sabor) / gustar (comida)", "geschmeckt", "haben", [
    "Die Pizza schmeckt super!",
    "¡La pizza está riquísima!",
  ]),

  // ——— Kapitel 5 ———
  v("aufstehen", "levantarse", "aufgestanden", "sein", ["Ich stehe um sechs Uhr auf.", "Me levanto a las seis."], {
    prefix: "auf",
  }),
  v("anfangen", "empezar", "angefangen", "haben", ["Der Kurs fängt um neun an.", "El curso empieza a las nueve."], {
    prefix: "an",
    stemChange: "fäng",
  }),
  v("aufräumen", "ordenar", "aufgeräumt", "haben", ["Räum bitte dein Zimmer auf!", "¡Ordena tu cuarto, por favor!"], {
    prefix: "auf",
  }),
  v("fernsehen", "ver la tele", "ferngesehen", "haben", ["Abends sehe ich fern.", "Por la noche veo la tele."], {
    prefix: "fern",
    stemChange: "sieh",
  }),
  v("anrufen", "llamar (por teléfono)", "angerufen", "haben", ["Ich rufe dich morgen an.", "Te llamo mañana."], {
    prefix: "an",
  }),
  v("schlafen", "dormir", "geschlafen", "haben", ["Das Baby schläft.", "El bebé duerme."], { stemChange: "schläf" }),
  v("duschen", "ducharse", "geduscht", "haben", ["Er duscht morgens.", "Él se ducha por la mañana."]),
  v("beginnen", "comenzar", "begonnen", "haben", ["Die Arbeit beginnt um acht.", "El trabajo comienza a las ocho."]),
  v("treffen", "encontrarse con / quedar", "getroffen", "haben", [
    "Ich treffe Anna im Café.",
    "Quedo con Anna en el café.",
  ], { stemChange: "triff" }),

  // ——— Kapitel 6 ———
  modal(
    "können",
    "poder / saber (hacer algo)",
    ["kann", "kannst", "kann", "können", "könnt", "können"],
    ["konnte", "konntest", "konnte", "konnten", "konntet", "konnten"],
    ["Kannst du schwimmen?", "¿Sabes nadar?"],
    "gekonnt",
  ),
  modal(
    "müssen",
    "tener que / deber",
    ["muss", "musst", "muss", "müssen", "müsst", "müssen"],
    ["musste", "musstest", "musste", "mussten", "musstet", "mussten"],
    ["Ich muss heute arbeiten.", "Hoy tengo que trabajar."],
    "gemusst",
  ),
  modal(
    "wollen",
    "querer",
    ["will", "willst", "will", "wollen", "wollt", "wollen"],
    ["wollte", "wolltest", "wollte", "wollten", "wolltet", "wollten"],
    ["Wir wollen ins Kino gehen.", "Queremos ir al cine."],
    "gewollt",
  ),
  v("einladen", "invitar", "eingeladen", "haben", ["Ich lade dich zum Essen ein.", "Te invito a comer."], {
    prefix: "ein",
    stemChange: "läd",
  }),
  v("feiern", "celebrar / festejar", "gefeiert", "haben", ["Wir feiern am Freitag.", "Celebramos el viernes."]),
  v("schenken", "regalar", "geschenkt", "haben", ["Was schenkst du ihr?", "¿Qué le regalas?"]),
  v("mitbringen", "traer (consigo)", "mitgebracht", "haben", ["Bringst du Kuchen mit?", "¿Traes pastel?"], {
    prefix: "mit",
  }),
  v("vorschlagen", "proponer", "vorgeschlagen", "haben", ["Ich schlage einen Ausflug vor.", "Propongo una excursión."], {
    prefix: "vor",
    stemChange: "schläg",
  }),

  // ——— Kapitel 7 ———
  v("kennen", "conocer", "gekannt", "haben", ["Kennst du meinen Bruder?", "¿Conoces a mi hermano?"]),
  v("kennenlernen", "conocer (por primera vez)", "kennengelernt", "haben", [
    "Wo hast du deine Frau kennengelernt?",
    "¿Dónde conociste a tu mujer?",
  ], { prefix: "kennen" }),
  v("telefonieren", "hablar por teléfono", "telefoniert", "haben", [
    "Sie telefoniert mit ihrer Mutter.",
    "Ella habla por teléfono con su madre.",
  ]),
  v("schicken", "enviar", "geschickt", "haben", ["Schick mir eine Nachricht!", "¡Mándame un mensaje!"]),
  v("antworten", "responder", "geantwortet", "haben", ["Er antwortet nicht.", "Él no responde."]),
  v("wissen", "saber", "gewusst", "haben", ["Weißt du die Adresse?", "¿Sabes la dirección?"], {
    present: ["weiß", "weißt", "weiß", "wissen", "wisst", "wissen"],
    imperativ: null,
  }),
  v("helfen", "ayudar", "geholfen", "haben", ["Kannst du mir helfen?", "¿Me puedes ayudar?"], { stemChange: "hilf" }),
  v("gefallen", "gustar", "gefallen", "haben", ["Das Foto gefällt mir.", "Me gusta la foto."], {
    stemChange: "gefäll",
    imperativ: null,
  }),

  // ——— Kapitel 8 ———
  v("mieten", "alquilar", "gemietet", "haben", ["Wir mieten eine Wohnung.", "Alquilamos un piso."]),
  v("umziehen", "mudarse", "umgezogen", "sein", ["Im Mai ziehe ich um.", "En mayo me mudo."], { prefix: "um" }),
  v("stellen", "poner (de pie)", "gestellt", "haben", ["Stell die Lampe auf den Tisch!", "¡Pon la lámpara en la mesa!"]),
  v("legen", "poner (tumbado)", "gelegt", "haben", ["Ich lege das Buch ins Regal.", "Pongo el libro en la estantería."]),
  v("hängen", "colgar / estar colgado", "gehängt", "haben", ["Das Bild hängt an der Wand.", "El cuadro cuelga en la pared."]),
  v("stehen", "estar (de pie)", "gestanden", "haben", ["Der Schrank steht im Flur.", "El armario está en el pasillo."]),
  v("liegen", "estar (tumbado)", "gelegen", "haben", ["Das Handy liegt auf dem Sofa.", "El móvil está en el sofá."]),
  v("putzen", "limpiar", "geputzt", "haben", ["Am Samstag putzen wir.", "El sábado limpiamos."]),

  // ——— Kapitel 9 ———
  v("verdienen", "ganar (dinero)", "verdient", "haben", ["Er verdient gut.", "Él gana bien."]),
  v("werden", "llegar a ser / volverse", "geworden", "sein", ["Sie wird Ingenieurin.", "Ella va a ser ingeniera."], {
    present: ["werde", "wirst", "wird", "werden", "werdet", "werden"],
    praeteritum: ["wurde", "wurdest", "wurde", "wurden", "wurdet", "wurden"],
    imperativ: { du: "Werde!", ihr: "Werdet!", Sie: "Werden Sie!" },
  }),
  v("bleiben", "quedarse", "geblieben", "sein", ["Ich bleibe heute zu Hause.", "Hoy me quedo en casa."]),
  v("passieren", "pasar / ocurrir", "passiert", "sein", ["Was ist passiert?", "¿Qué ha pasado?"], {
    imperativ: null,
  }),
  v("verkaufen", "vender", "verkauft", "haben", ["Sie verkauft Bücher.", "Ella vende libros."]),
  v("reparieren", "reparar", "repariert", "haben", ["Er repariert Autos.", "Él repara coches."]),

  // ——— Kapitel 10 ———
  v("tragen", "llevar (puesto) / cargar", "getragen", "haben", ["Sie trägt ein rotes Kleid.", "Lleva un vestido rojo."], {
    stemChange: "träg",
  }),
  v("anziehen", "ponerse (ropa)", "angezogen", "haben", ["Zieh eine Jacke an!", "¡Ponte una chaqueta!"], {
    prefix: "an",
  }),
  v("anprobieren", "probarse (ropa)", "anprobiert", "haben", [
    "Kann ich die Hose anprobieren?",
    "¿Puedo probarme el pantalón?",
  ], { prefix: "an" }),
  v("aussehen", "parecer / verse", "ausgesehen", "haben", ["Du siehst toll aus!", "¡Te ves genial!"], {
    prefix: "aus",
    stemChange: "sieh",
  }),
  v("passen", "quedar bien (talla)", "gepasst", "haben", ["Die Schuhe passen gut.", "Los zapatos quedan bien."]),

  // ——— Kapitel 11 ———
  modal(
    "dürfen",
    "poder (tener permiso)",
    ["darf", "darfst", "darf", "dürfen", "dürft", "dürfen"],
    ["durfte", "durftest", "durfte", "durften", "durftet", "durften"],
    ["Hier darf man nicht rauchen.", "Aquí no se puede fumar."],
    "gedurft",
  ),
  modal(
    "sollen",
    "deber (consejo / encargo)",
    ["soll", "sollst", "soll", "sollen", "sollt", "sollen"],
    ["sollte", "solltest", "sollte", "sollten", "solltet", "sollten"],
    ["Sie sollen viel trinken.", "Usted debe beber mucho."],
    "gesollt",
  ),
  v("wehtun", "doler", "wehgetan", "haben", ["Mein Kopf tut weh.", "Me duele la cabeza."], {
    prefix: "weh",
    imperativ: null,
  }),
  v("tun", "hacer", "getan", "haben", ["Was kann ich für Sie tun?", "¿Qué puedo hacer por usted?"], {
    imperativ: { du: "Tu!", ihr: "Tut!", Sie: "Tun Sie!" },
  }),
  v("rauchen", "fumar", "geraucht", "haben", ["Rauchen Sie?", "¿Fuma usted?"]),
  v("laufen", "correr / caminar", "gelaufen", "sein", ["Er läuft jeden Morgen.", "Él corre cada mañana."], {
    stemChange: "läuf",
  }),
  v("untersuchen", "examinar / revisar", "untersucht", "haben", [
    "Die Ärztin untersucht den Patienten.",
    "La médica examina al paciente.",
  ]),

  // ——— Kapitel 12 ———
  v("fliegen", "volar", "geflogen", "sein", ["Wir fliegen nach Wien.", "Volamos a Viena."]),
  v("buchen", "reservar", "gebucht", "haben", ["Ich habe ein Hotel gebucht.", "He reservado un hotel."]),
  v("packen", "hacer (la maleta)", "gepackt", "haben", ["Hast du den Koffer gepackt?", "¿Has hecho la maleta?"]),
  v("übernachten", "pasar la noche / alojarse", "übernachtet", "haben", [
    "Wir übernachten im Hostel.",
    "Nos alojamos en el albergue.",
  ]),
  v("besuchen", "visitar (a alguien)", "besucht", "haben", ["Ich besuche meine Oma.", "Visito a mi abuela."]),
  v("ankommen", "llegar", "angekommen", "sein", ["Der Zug kommt um zehn an.", "El tren llega a las diez."], {
    prefix: "an",
  }),
  v("abfahren", "salir (vehículo)", "abgefahren", "sein", ["Wann fährt der Bus ab?", "¿Cuándo sale el autobús?"], {
    prefix: "ab",
    stemChange: "fähr",
  }),
  v("erleben", "vivir (experimentar)", "erlebt", "haben", ["Wir haben viel erlebt.", "Hemos vivido muchas cosas."]),
];

export const VERB_MAP: Record<string, Verb> = Object.fromEntries(VERBS.map((verb) => [verb.inf, verb]));

export function getVerb(inf: string): Verb {
  const verb = VERB_MAP[inf];
  if (!verb) throw new Error(`Unknown verb: ${inf}`);
  return verb;
}
