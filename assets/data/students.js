/*
 * Zentrale Datenbasis aller Studierenden.
 *
 * MEDIEN-KONVENTION (keine Pfade eintragen – Dateien nur korrekt benennen):
 *   Portraitfoto : assets/images/students/{slug}.jpg   (Pflicht, mit Fallback)
 *   Showreel     : assets/videos/{slug}.mp4            (erscheint automatisch, sobald Datei da ist)
 *   Audio-Reel   : assets/audio/{slug}.mp3             (optional, erscheint nur wenn Datei da ist)
 *
 * SPRACHEN: Felder mit { de: ..., en: ... } werden vom Sprachumschalter aufgelöst.
 * Fehlende Übersetzungen mit "TODO: Übersetzung folgt" markieren – niemals leer lassen,
 * wenn das Feld auf Deutsch existiert.
 *
 * NEUE PERSON: Eintrag mit mindestens { slug, name, placeholder: true } anlegen.
 * Sobald Inhalte vorliegen: placeholder entfernen und Felder ergänzen.
 * Alle Array-Felder dürfen beliebig lang sein oder fehlen – das Rendering ist generisch.
 */
const STUDENTS = [
  {
    slug: "konstantin-kloppe",
    name: "Konstantin Dimitrios Kloppe",
    pronouns: "er/ihm, they/them",
    born: "08.01.2004",
    locations: ["München", "Regensburg", "Wien", "Berlin", "Stuttgart", "Düsseldorf"],
    playingAge: "16–27",
    height: "175 cm",
    hairColor: { de: "dunkelblond", en: "TODO: Übersetzung folgt" },
    eyeColor: { de: "blau", en: "TODO: Übersetzung folgt" },
    voiceType: { de: "Bariton", en: "TODO: Übersetzung folgt" },
    languages: {
      de: ["Deutsch (Muttersprache)", "Griechisch (Muttersprache)", "Englisch (fließend)", "Französisch (Grundkenntnisse)", "Spanisch (Grundkenntnisse)", "Polnisch (Grundkenntnisse)"],
      en: ["TODO: Übersetzung folgt"]
    },
    skills: {
      de: ["Tanz (u.a. Jazz, Contemporary, Show Dance, Ballett, griechische Volkstänze, Stepptanz)", "Stelzenlauf", "Luftakrobatik (Aerial Hoop & Lollipop)", "Yoga", "Bühnenkampf (Grundlagen)"],
      en: ["TODO: Übersetzung folgt"]
    },
    auditionRoles: [
      { role: "Mary", play: "Die kahle Sängerin", author: "Eugène Ionesco" },
      { role: "Beckmann", play: "Draußen vor der Tür", author: "Wolfgang Borchert" },
      { role: "Meerjungraun", play: "Die kleinen Meerjungraun", author: "Kim de l'Horizon" },
      { role: "Haimon", play: "Antigone", author: "Sophokles" },
      { role: "Antipholus von Ephesus", play: "Komödie der Irrungen", author: "William Shakespeare" },
      { role: "Scapin", play: "Scapinos Gaunerstreiche", author: "Jean-Baptiste Molière" }
    ],
    auditionSongs: [
      { title: "Wahrheit", from: "Tanz der Vampire" },
      { title: "Einsamer Mann", from: "Dracula – Das Musical" }
    ],
    bio: {
      de: "Geboren und aufgewachsen im Landkreis München, fand Konstantin früh seine Leidenschaft für das Bühnengeschehen. Sein Interesse an Tanz und Bewegung führte ihn durch eine Vielzahl von Stilrichtungen – von Ballett, Stepptanz und Show Dance über Contemporary und Jazz bis hin zu Heels Dance. Stationen seiner Ausbildung waren unter anderem Kornele Rzeszów, die Iwanson International School of Contemporary Dance sowie die Stonebite Studios.\n\nNeben dem Tanz entdeckte Konstantin die Zirkuskunst für sich, insbesondere das Stelzenlaufen und die Luftakrobatik (Aerial Hoop). Parallel dazu entwickelte er eine Faszination für das Sprechtheater und sammelte wertvolle Bühnenerfahrungen in der Pasinger Fabrik, den Münchner Kammerspielen und im Pathos Theater München.\n\nPrägende künstlerische Begegnungen ergaben sich in der Zusammenarbeit mit Verena Regensburger («These Teens will save the future») und Michiel Vandevelde («Joy 2022»). Als Mitglied des NON ESSENTIALS e.V. kreiert Konstantin regelmäßig Solo-Performances, die sich mit Fragen von Identität und Existenz auseinandersetzen.\n\nSeit 2023 studiert er Schauspiel mit Schwerpunkt Gesang an der Akademie für Darstellende Kunst Bayern und verbindet dort seine vielseitigen Erfahrungen aus Tanz, Artistik und Theater zu einem ganzheitlichen künstlerischen Ausdruck.",
      en: "TODO: Übersetzung folgt"
    },
    credits: {
      theater: [
        { years: "2026–2027", production: "Hamlet", author: "William Shakespeare", role: "Hamlet, Laertes", director: "Michael Blumenthal", venue: "Akademietheater Regensburg" },
        { years: "2026–2027", production: "Cabaret", author: "Joe Masteroff, John Kander, Fred Ebb", role: "Kit Kat Swing", director: "Claus Guth", venue: "Residenztheater München" },
        { years: "2026", production: "Lügen über meine Mutter (szenische Lesung)", author: "Daniela Dröscher", role: "", director: "Meike Fabian", venue: "Akademietheater Regensburg" },
        { years: "2025–2027", production: "Die Kleine Hexe", author: "Otfried Preußler", role: "Abraxas, Knusperhexe", director: "Oliver Severin", venue: "Akademietheater Regensburg" },
        { years: "2025", production: "Der Mann aus Podolsk", author: "Dmitri Danilow", role: "Polizist 1", director: "Senya Romin", venue: "Akademietheater Regensburg" },
        { years: "2024", production: "Sergej ist sehr dumm (szenische Lesung)", author: "Dmitri Danilow", role: "Kurier 1", director: "Senya Romin", venue: "Most Kunstkollektiv" },
        { years: "2024", production: "Leonce und Lena", author: "Georg Büchner", role: "Leonce von Popo", director: "Alexandra Caroline Herger", venue: "Akademietheater Regensburg" },
        { years: "2022–2023", production: "Joy 2022", author: "", role: "", director: "Michiel Vandevelde", venue: "Münchner Kammerspiele, Wiener Festwochen" },
        { years: "2021", production: "Sound of Seiersberg", author: "Pia Hierzegger", role: "Hans", director: "Christian Auras", venue: "Pasinger Fabrik" },
        { years: "2019", production: "These Teens Will Save The Future", author: "", role: "", director: "Verena Regensburger", venue: "Münchner Kammerspiele" }
      ],
      film: [
        { years: "2025", production: "Melpomene – Fragmente eines Fiebertraums (Kurzfilm)", role: "Lucian", director: "Kai Siberi", venue: "ImagoMota – Kai Sieber & Jared Fantaye GbR" },
        { years: "2023", production: "Welcome to the 70s (Social Spot, Tanz)", role: "", director: "Gretta Sammalniemi", venue: "WennDann Film GmbH, HFF München" },
        { years: "2022", production: "Nach uns der Rest der Welt (TV-Film, Tanz)", role: "", director: "Franziska Buch", venue: "SWR" }
      ],
      other: [
        { years: "2024", production: "Bo Burnham vs Jeff Bezos (performative Installation, Choreographie)", role: "", director: "Thalia Schöller, Melina Dressler", venue: "Pathos Theater München" }
      ]
    },
    social: { instagram: "konstantin_kloppe" },
    email: "konstantin.kloppe@gmail.com"
  },
  {
    slug: "salome-ridder",
    name: "Salome Ridder",
    pronouns: "sie/ihr",
    born: "26.05.2003",
    locations: ["Berlin", "Stuttgart", "München", "Allgäu", "Hamburg", "Niederlande"],
    playingAge: "17–27",
    height: "1,67 m",
    hairColor: { de: "Hellbraun", en: "TODO: Übersetzung folgt" },
    eyeColor: { de: "Hellbraun", en: "TODO: Übersetzung folgt" },
    voiceType: { de: "Alt-Sopran", en: "TODO: Übersetzung folgt" },
    languages: {
      de: ["Deutsch (Muttersprache)", "Englisch (Muttersprache)", "Holländisch (Muttersprache)", "Französisch (Grundkenntnisse)", "Berlinerisch"],
      en: ["TODO: Übersetzung folgt"]
    },
    skills: {
      de: ["Impro-Tanz", "Tennis", "Yoga", "Bühnenkampf & Fechten (Grundlagen)", "Standard Tanz (Grundlagen)", "Reiten (Grundlagen)"],
      en: ["TODO: Übersetzung folgt"]
    },
    auditionRoles: [
      { role: "Judith", play: "Je suis Fassbinder", author: "Falk Richter" },
      { role: "AmMedea", play: "AmMedea", author: "Ron Rosenberg" },
      { role: "Eve", play: "Der Zerbrochene Krug", author: "Heinrich von Kleist" },
      { role: "Die erste Liebe", play: "Der Auftrag", author: "Heiner Müller" },
      { role: "Doris", play: "Das Kunstseidene Mädchen", author: "Irmgard Keun" },
      { role: "Franz Moor", play: "Die Räuber", author: "Friedrich Schiller" },
      { role: "Die Biologin", play: "Annihilation", author: "Jeff Vandermeer" },
      { role: "Trini", play: "Die Ganze Wahrheiten", author: "Sathyan Ramesh" }
    ],
    auditionSongs: [
      { title: "Maybe This Time", from: "Cabaret" },
      { title: "Männer", from: "Herbert Grönemeyer" }
    ],
    bio: {
      de: "Salome Ridder wurde in Berlin geboren und wuchs in einer dreisprachigen Künstlerfamilie auf, zwischen Kostümkisten, Papier, Farbe, Büchern und Musik. So entwickelte sie eine Begeisterung für Sprache und Ausdruck, die sie bis heute begleitet: im Schauspiel ebenso wie im Schreiben und in der analogen Fotografie.\n\nBereits als Kind stand sie auf der Bühne und 2016 übernahm sie ihre erste Fernsehfilm-Hauptrolle in „Liebling, lass die Hühner frei“ (Regie: Oliver Schmitz). 2024 spielte sie die Titelfigur im Spielfilm „Linda lebt“ (Regie: Amon Bela Bachmann).\n\nSie wirkte zudem in szenischen Lesungen wie „Götter sterben“ und „Say hi to Abdo“ beim LUBIMOVKA Festival in Wien mit. Am Akademietheater Regensburg war sie unter anderem in „Woyzeck“ (auch eingeladen zum JULA-Festival München) sowie in „Die Frau von früher“ und „Die kleine Hexe“ zu sehen.",
      en: "TODO: Übersetzung folgt"
    },
    credits: {
      theater: [
        { years: "2026–2027", production: "Hamlet", author: "", role: "Polonius, Hamlet & Ophelia", director: "Michael Blumenthal", venue: "Akademietheater Regensburg" },
        { years: "2024–2027", production: "Die kleine Hexe", author: "", role: "Rumpumpel & weitere", director: "Oliver Severin", venue: "Akademietheater Regensburg" },
        { years: "2026", production: "John Proctor, is the Villain", author: "", role: "Shelby", director: "Guido Wachter", venue: "Akademietheater Regensburg" },
        { years: "2025", production: "Die Frau von Früher", author: "", role: "Claudia", director: "Ole Heimerdinger", venue: "Akademietheater Regensburg" },
        { years: "2024", production: "Woyzeck", author: "", role: "Ärztin", director: "Roman Senin", venue: "Einstein Kultur „JULA Festival“ & Akademietheater Regensburg" },
        { years: "2023", production: "Antigone ein Requiem", author: "", role: "Chor", director: "Mehdi Moinzadeh", venue: "Theater unterm Dach" }
      ],
      film: [
        { years: "2025", production: "Linda Lebt (Spielfilm)", role: "Linda", director: "Amon Bela Bachmann", venue: "" },
        { years: "2016", production: "Liebling lass die Hühner Frei (Fernsehfilm)", role: "Sophie Teuffel", director: "Oliver Schmitz", venue: "ARD/WDR" }
      ],
      other: [
        { years: "2026", production: "Lügen über meine Mutter (szenische Lesung)", role: "", director: "Meike Fabian", venue: "Akademietheater Regensburg" },
        { years: "2025", production: "Götter sterben (szenische Lesung)", role: "", director: "Greta Susceviciute", venue: "LUBIMOVKA Festival" }
      ]
    },
    social: { instagram: "salomeridder" },
    email: "salome.ridder@gmx.de"
  },
  { slug: "cedric-corazza", name: "Cedric Corazza", placeholder: true },
  { slug: "charlotte-friederich", name: "Charlotte Friederich", placeholder: true },
  { slug: "charlotte-gruenewald", name: "Charlotte Grünewald", placeholder: true },
  { slug: "linda-lehmann", name: "Linda Lehmann", placeholder: true },
  { slug: "bianca-pitschedell", name: "Bianca Pitschedell", placeholder: true },
  { slug: "karl-georg-roessler", name: "Karl Georg Rößler", placeholder: true },
  {
    slug: "michelle-thielsch",
    name: "Michelle Thielsch",
    pronouns: "sie/ihr",
    born: "21.11.1999",
    locations: ["Regensburg", "München", "Berlin", "Leipzig", "Kiel", "Görlitz", "Freiburg i. Br.", "Bern (CH)"],
    playingAge: "16–30",
    height: "157 cm",
    hairColor: { de: "braun", en: "brown" },
    eyeColor: { de: "graugrün", en: "grey-green" },
    voiceType: { de: "Mezzosopran (Range: e bis c''', Belt: e'')", en: "Mezzo-soprano (range: E to C''', belt: E'')" },
    languages: {
      de: ["Deutsch (Muttersprache)", "Englisch (fließend)", "Spanisch (gut)", "Französisch (Grundkenntnisse)", "Sächsisch (Heimatdialekt)"],
      en: ["German (native)", "English (fluent)", "Spanish (good)", "French (basic)", "Saxon (native dialect)"]
    },
    skills: {
      de: ["DJ", "Klavier", "Rap", "Jazz Dance", "Tanztheater", "Argentinischer Tango", "Bühnenkampf und Fechten", "Yoga", "Bouldern", "Schach"],
      en: ["DJing", "Piano", "Rap", "Jazz dance", "Dance theatre", "Argentine tango", "Stage combat and fencing", "Yoga", "Bouldering", "Chess"]
    },
    auditionRoles: [
      { role: "Johanna", play: "Die heilige Johanna der Schlachthöfe", author: "Bertolt Brecht" },
      { role: "Giraffe / Judy", play: "Traurig und fröhlich ist das Giraffenleben", author: "Tiago Rodrigues" },
      { role: "", play: "Blutbuch", author: "Kim de l'Horizon" },
      { role: "Medea", play: "Medea", author: "Euripides" },
      { role: "Lysistrate", play: "Lysistrate", author: "Aristophanes" },
      { role: "Sie", play: "Und jetzt: Die Welt", author: "Sibylle Berg" },
      { role: "Romeo", play: "Romeo und Julia", author: "William Shakespeare" }
    ],
    auditionSongs: [
      { title: "Lesbische Lovestory", from: "The Wild Party" },
      { title: "Burn", from: "Hamilton" }
    ],
    bio: {
      de: "1999 in der ostsächsischen Provinz geboren und aufgewachsen. Seit 2005 Teil der Kindertheatergruppe „Die Erlichthofgaukler e.V.“. Gesangs- und Klavierunterricht während der Schulzeit. Nach dem Abitur kurzer Abstecher nach Costa Rica für einen Freiwilligendienst, dann Umzug nach Freiburg im Breisgau. Abgetaucht in der studentischen Theaterszene und dort ein Zuhause gefunden. Studium der Medienkulturwissenschaften und Germanistik angefangen und erfolgreich abgebrochen. Was bleibt, ist die Begeisterung für Mittelhochdeutsch und Popkultur.\n\nSeit 2023 Schauspielstudium an der ADK Bayern. Nebenher als DJ h2oMichi aktiv. Ihr Herz schlägt für Queerfeminismus und Puppenspiel.\n\nIm Akademietheater Regensburg wirkte sie u. a. in „Die kleine Hexe“ nach Otfried Preußler, in „Leonce und Lena“ nach Georg Büchner und in „Die Frau von früher“ von Roland Schimmelpfennig mit. Im Mai 2026 spielte sie im Kammerspiel „Shadows of Sanity“ von Christine La Renarde im Rahmen des EKSTASIS Theaterfestivals in Regensburg. Sie ist 2024 im Kurzfilm „Die Einsiedlerinnen“ von Lya Spiegel und 2026 im Film „Rain Check“ (tbp) von Ivy Lißsack zu sehen.",
      en: "Born in 1999 and raised in the provinces of eastern Saxony. A member of the children's theatre group “Die Erlichthofgaukler e.V.” since 2005. Singing and piano lessons throughout her school years. After finishing school, a brief detour to Costa Rica for a volunteer service, then a move to Freiburg im Breisgau, where she dived into the student theatre scene and found a home. Began a degree in media culture studies and German philology — and successfully dropped out. What remains is her enthusiasm for Middle High German and pop culture.\n\nStudying acting at ADK Bavaria since 2023. Also active as DJ h2oMichi. Her heart beats for queer feminism and puppetry.\n\nAt the Akademietheater Regensburg she appeared in “Die kleine Hexe” after Otfried Preußler, “Leonce und Lena” after Georg Büchner and “Die Frau von früher” by Roland Schimmelpfennig, among others. In May 2026 she performed in the chamber play “Shadows of Sanity” by Christine La Renarde as part of the EKSTASIS theatre festival in Regensburg. She appears in the 2024 short film “Die Einsiedlerinnen” by Lya Spiegel and in the 2026 feature “Rain Check” (tbp) by Ivy Lißsack."
    },
    credits: {
      theater: [
        { years: "2026–2027", production: "Hamlet", author: "William Shakespeare", role: "Horatio, Chor", director: "Michael Blumenthal", venue: "Akademietheater Regensburg" },
        { years: "2026", production: "Shadows of Sanity", author: "Christine La Renarde", role: "Mira", director: "Christine La Renarde", venue: "EKSTASIS Theaterfestival, Regensburg" },
        { years: "2026", production: "Lügen über meine Mutter (szenische Lesung)", author: "Daniela Dröscher", role: "", director: "Meike Fabian", venue: "Akademietheater Regensburg" },
        { years: "2025–2027", production: "Die Kleine Hexe", author: "Otfried Preußler, John von Düffel", role: "Kleine Hexe", director: "Oliver Severin", venue: "Akademietheater Regensburg" },
        { years: "2025", production: "Die Frau von Früher", author: "Roland Schimmelpfennig", role: "Romy Vogtländer", director: "Ole Heimerdinger", venue: "Akademietheater Regensburg" },
        { years: "2024", production: "Leonce und Lena", author: "nach Georg Büchner", role: "Valerie", director: "Alexander Herger", venue: "Akademietheater Regensburg" },
        { years: "2021", production: "Frühlings Erwachen – Eine Adaption nach Ihrer Wahl", author: "nach Frank Wedekind", role: "Wendla", director: "Robin Haensse, Maya Rollberger, Bernhard Ruchti", venue: "FIST* Freiburg" }
      ],
      film: [
        { years: "2026", production: "Rain Check (Langfilm, tbp)", role: "Mau-Mau", director: "Ivy Lißsack", venue: "" },
        { years: "2024", production: "Die Einsiedlerinnen (Kurzfilm)", role: "Jewel", director: "Lya Spiegel", venue: "" }
      ],
      other: [
        { years: "2025–2026", production: "Mediensprechen", role: "", director: "", venue: "Benedikt Reidenbach" },
        { years: "2023–2027", production: "Schwerpunkt Gesang im Studium – Pop, Musical", role: "", director: "", venue: "Valentina Piegger" },
        { years: "2021–2023", production: "Studium der Medienkulturwissenschaft und Germanistik", role: "", director: "", venue: "Albert-Ludwigs-Universität Freiburg" },
        { years: "2014–2018", production: "Gesangsunterricht", role: "", director: "", venue: "Kreismusikschule Dreiländereck Niesky" }
      ]
    },
    /*
     * Mehrere beschriftete Hörproben (Dateien liegen in assets/audio/, nur
     * Dateiname eintragen). Zusätzlich zur Konvention {slug}.mp3 nutzbar.
     */
    audioReels: [
      { label: { de: "Sachtext: Der Nasenbär", en: "Narration: The coati" }, file: "michelle-thielsch-sachtext-nasenbaer.mp3" },
      { label: { de: "Voice Acting: Heldin", en: "Voice acting: Heroine" }, file: "michelle-thielsch-voiceacting-heldin.mp3" },
      { label: { de: "Voice Acting: Kind", en: "Voice acting: Child" }, file: "michelle-thielsch-voiceacting-kind.mp3" },
      { label: { de: "Voice Acting: Zeichentrick", en: "Voice acting: Cartoon" }, file: "michelle-thielsch-voiceacting-zeichentrick.mp3" }
    ],
    social: { instagram: "michelli.lie", filmmakers: "https://www.filmmakers.eu/de/actors/michelle-thielsch" },
    email: "michelle.thielsch@gmx.de"
  },
  { slug: "rosalie-zwenzner", name: "Rosalie Zwenzner", placeholder: true }
];
