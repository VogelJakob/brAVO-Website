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
    hairColor: { de: "dunkelblond", en: "dark blonde" },
    eyeColor: { de: "blau", en: "blue" },
    voiceType: { de: "Bariton", en: "Baritone" },
    languages: {
      de: ["Deutsch (Muttersprache)", "Griechisch (Muttersprache)", "Englisch (fließend)", "Französisch (Grundkenntnisse)", "Spanisch (Grundkenntnisse)", "Polnisch (Grundkenntnisse)"],
      en: ["German (native)", "Greek (native)", "English (fluent)", "French (basic)", "Spanish (basic)", "Polish (basic)"]
    },
    skills: {
      de: ["Tanz (u.a. Jazz, Contemporary, Show Dance, Ballett, griechische Volkstänze, Stepptanz)", "Stelzenlauf", "Luftakrobatik (Aerial Hoop & Lollipop)", "Yoga", "Bühnenkampf (Grundlagen)"],
      en: ["Dance (incl. jazz, contemporary, show dance, ballet, Greek folk dances, tap dance)", "Stilt walking", "Aerial acrobatics (aerial hoop & lollipop)", "Yoga", "Stage combat (basics)"]
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
      en: "Born and raised in the district of Munich, Konstantin found his passion for the stage early on. His interest in dance and movement led him through a wide variety of styles — from ballet, tap and show dance to contemporary, jazz and heels dance. Stations of his training included Kornele Rzeszów, the Iwanson International School of Contemporary Dance and the Stonebite Studios.\n\nAlongside dance, Konstantin discovered circus arts for himself, in particular stilt walking and aerial acrobatics (aerial hoop). At the same time he developed a fascination for spoken theatre and gained valuable stage experience at the Pasinger Fabrik, the Münchner Kammerspiele and the Pathos Theater in Munich.\n\nFormative artistic encounters arose from working with Verena Regensburger (“These Teens Will Save The Future”) and Michiel Vandevelde (“Joy 2022”). As a member of NON ESSENTIALS e.V., Konstantin regularly creates solo performances that explore questions of identity and existence.\n\nSince 2023 he has been studying acting with a focus on singing at the Academy of Performing Arts Bavaria, combining his diverse experience from dance, circus arts and theatre into a holistic artistic expression."
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
    hairColor: { de: "Hellbraun", en: "light brown" },
    eyeColor: { de: "Hellbraun", en: "light brown" },
    voiceType: { de: "Alt-Sopran", en: "Alto-soprano" },
    languages: {
      de: ["Deutsch (Muttersprache)", "Englisch (Muttersprache)", "Holländisch (Muttersprache)", "Französisch (Grundkenntnisse)", "Berlinerisch"],
      en: ["German (native)", "English (native)", "Dutch (native)", "French (basic)", "Berlin dialect"]
    },
    skills: {
      de: ["Impro-Tanz", "Tennis", "Yoga", "Bühnenkampf & Fechten (Grundlagen)", "Standard Tanz (Grundlagen)", "Reiten (Grundlagen)"],
      en: ["Improvisational dance", "Tennis", "Yoga", "Stage combat & fencing (basics)", "Ballroom dance (basics)", "Horse riding (basics)"]
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
      en: "Salome Ridder was born in Berlin and grew up in a trilingual family of artists, among costume chests, paper, paint, books and music. There she developed an enthusiasm for language and expression that has stayed with her to this day: in acting as well as in writing and analogue photography.\n\nShe stood on stage as a child, and in 2016 she took on her first leading role in a TV film in “Liebling, lass die Hühner frei” (directed by Oliver Schmitz). In 2024 she played the title role in the feature film “Linda lebt” (directed by Amon Bela Bachmann).\n\nShe has also taken part in staged readings such as “Götter sterben” and “Say hi to Abdo” at the LUBIMOVKA Festival in Vienna. At the Akademietheater Regensburg she has appeared in “Woyzeck” (also invited to the JULA Festival in Munich) as well as in “Die Frau von früher” and “Die kleine Hexe”."
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
  {
    slug: "charlotte-friederich",
    name: "Charlotte Friederich",
    pronouns: "sie/ihr",
    born: "08.10.2002",
    locations: ["Würzburg", "Berlin", "Regensburg", "Hamburg", "Köln", "München"],
    playingAge: "16–26",
    height: "167 cm",
    hairColor: { de: "braun", en: "brown" },
    eyeColor: { de: "blau-grün", en: "blue-green" },
    voiceType: { de: "Alt", en: "Alto" },
    languages: {
      de: ["Deutsch (Muttersprache)", "Englisch (fließend)", "Französisch (gut)"],
      en: ["German (native)", "English (fluent)", "French (good)"]
    },
    skills: {
      de: ["Tanztheater", "Capoeira", "Yoga", "Akrobatik", "Tango Argentino (Grundkenntnisse)", "Bühnenkampf (Grundkenntnisse)", "Fechten (Grundkenntnisse)"],
      en: ["Dance theatre", "Capoeira", "Yoga", "Acrobatics", "Argentine tango (basics)", "Stage combat (basics)", "Fencing (basics)"]
    },
    auditionRoles: [
      { role: "Ronald Pofalla", play: "Einige Nachrichten an das All", author: "Wolfram Lotz" },
      { role: "Ophelia", play: "Hamlet", author: "William Shakespeare" },
      { role: "Betty", play: "Bettys Sommerfrische", author: "Christopher Durang" },
      { role: "Elbe", play: "Draußen vor der Tür", author: "Wolfgang Borchert" },
      { role: "Elisabeth", play: "Maria Stuart", author: "Friedrich von Schiller" }
    ],
    auditionSongs: [
      { title: "Der Tod steht um die Ecke", from: "The Addams Family" },
      { title: "Mad World", from: "Roland Orzabal" }
    ],
    bio: {
      de: "Charlotte Friederich wuchs in Würzburg auf. Um mit zwei älteren Brüdern mithalten zu können, hat Charlotte früh gelernt, in Piraten- oder Räuber-Rollen zu schlüpfen, Bandenlager zu bauen und gemeinsam die unterschiedlichsten Geschichten entstehen zu lassen. Immer auf der Suche nach Magie. Auch eine gewisse Ensemblefähigkeit wurde hier trainiert.\n\nNach ihrem Abitur fand sie ihren Weg zu der Würzburger „Theaterwerkstatt“. Dort konnte sie sowohl als Schauspielerin, als auch als Regieassistentin ihre Leidenschaft ausleben.\n\nAn der ADK Bayern hat sich Charlotte mit Freude durchs Studium gespielt und war unter anderem in den Produktionen „Die Argonauten“ (Franz Grillparzer), „Kasimir und Karoline“ (Ödön von Horváth) und „Die kleine Hexe“ (Otfried Preußler) zu sehen.",
      en: "Charlotte Friederich grew up in Würzburg. To keep up with two older brothers, she learned early on to slip into pirate and robber roles, build gang hideouts and invent all kinds of stories together — always in search of magic. A certain sense of ensemble was trained there, too.\n\nAfter finishing school she found her way to the Würzburg “Theaterwerkstatt”, where she lived out her passion both as an actress and as an assistant director.\n\nAt ADK Bavaria, Charlotte has played her way through her studies with joy and has appeared in productions including “Die Argonauten” (Franz Grillparzer), “Kasimir und Karoline” (Ödön von Horváth) and “Die kleine Hexe” (Otfried Preußler)."
    },
    credits: {
      theater: [
        { years: "2026–2027", production: "Hamlet", author: "William Shakespeare", role: "Ophelia", director: "Michael Blumenthal", venue: "Akademietheater Regensburg" },
        { years: "2025–2027", production: "Die kleine Hexe", author: "Otfried Preußler", role: "Kräuterhexe, Holzsammlerin, Papierblumenmädchen, Vroni", director: "Oliver Severin", venue: "Akademietheater Regensburg" },
        { years: "2025", production: "Die Argonauten", author: "Franz Grillparzer", role: "Medea", director: "Sebastian Godditsch", venue: "Akademietheater Regensburg" },
        { years: "2024", production: "Kasimir und Karoline", author: "Ödön von Horváth", role: "Erna", director: "Selina Kretschman", venue: "Akademietheater Regensburg" }
      ]
    },
    social: { instagram: "liebercharlyalslina", filmmakers: "https://www.filmmakers.eu/de/actors/charlotte-friederich" },
    email: "linifr@t-online.de"
  },
  {
    slug: "charlotte-gruenewald",
    name: "Charlotte Grünewald",
    pronouns: "sie/ihr",
    born: "07.03.2000",
    locations: ["Berlin", "Leipzig", "Köln", "Mannheim", "Frankfurt", "München", "Hamburg", "Wien"],
    playingAge: "16–30",
    height: "1,68 m",
    hairColor: { de: "hellbraun", en: "light brown" },
    eyeColor: { de: "grün-braun", en: "green-brown" },
    voiceType: { de: "Mezzosopran", en: "Mezzo-soprano" },
    languages: {
      de: ["Deutsch (Muttersprache)", "Englisch (fließend)", "Russisch (Grundkenntnisse)"],
      en: ["German (native)", "English (fluent)", "Russian (basic)"]
    },
    skills: {
      de: ["Cello (gut)", "Klavier (Grundlagen)", "Rhönrad (Grundlagen)", "Hip-Hop", "Bühnenkampf & Fechten (Grundlagen)", "Reiten (Grundlagen)", "Führerschein (B, BE)"],
      en: ["Cello (good)", "Piano (basics)", "Wheel gymnastics (basics)", "Hip hop", "Stage combat & fencing (basics)", "Horse riding (basics)", "Driving licence (B, BE)"]
    },
    auditionRoles: [
      { role: "Die Exfreundin", play: "Global Wunschkonzert", author: "Laura Naumann" },
      { role: "Iphigenie", play: "Atropa", author: "Tom Lanoye" },
      { role: "Orlando", play: "Orlando der Roman", author: "Virginia Woolf" },
      { role: "Kim Jong Un", play: "Das Knurren der Milchstraße", author: "Bonn Park" },
      { role: "Abigail", play: "Hexenjagd", author: "Arthur Miller" },
      { role: "Die Studentin", play: "Die Unterrichtsstunde", author: "Eugène Ionesco" },
      { role: "Iason", play: "Medea", author: "Euripides" }
    ],
    auditionSongs: [
      { title: "Ballade von der Judenhure Marie Sanders", from: "Bertolt Brecht, Hanns Eisler" },
      { title: "Gar nichts", from: "A Chorus Line" }
    ],
    bio: {
      de: "Charlotte Grünewald wuchs in einer Musiker*innenfamilie in einem kleinen Dorf in der Nähe von Heidelberg auf. Umgeben von Musik, Kassetten und Büchern wird ihre Liebe fürs Geschichtenerzählen und -hören seit jeher gepflegt. Immer auf der Suche nach weiteren Ausdrucksformen kamen mit der Zeit Cello, Tanz und Schreiben hinzu. Charlottes Neu- und Wissbegierde führten sie über mehrere Auslandsaufenthalte in Hawaii, Ljubljana und einem B.A. in Musik- und Kulturwissenschaft (Thema Postfeministische Selbstermächtigung), hin zum Schauspiel.\n\nSchon als Kind stand sie im Schultheater in mehreren Produktionen in deutscher und englischer Sprache auf der Bühne. Zuletzt war sie Teil der Monologlesung „Wanja ist am Leben“ (Natalia Lizorkina) des Kunstkollektivs MOST (2025) und des Stückes „Shadows of Sanity“ (Christine la Renarde) im Rahmen des EKSTASIS Theaterfestivals (2026). Am Akademietheater Regensburg war sie unter anderem in Inszenierungen von „Woyzeck“ (Georg Büchner), „Die kleine Hexe“ (Otfried Preußler) und „Medea“ (Franz Grillparzer) zu sehen.",
      en: "Charlotte Grünewald grew up in a family of musicians in a small village near Heidelberg. Surrounded by music, cassette tapes and books, her love of telling and listening to stories has been nurtured ever since. Always in search of further forms of expression, cello, dance and writing were added over time. Charlotte's curiosity and thirst for knowledge led her to acting — via several stays abroad in Hawaii and Ljubljana and a B.A. in musicology and cultural studies (thesis on post-feminist self-empowerment).\n\nAs a child she already stood on stage in several school theatre productions in German and English. Most recently she was part of the monologue reading “Wanja ist am Leben” (Natalia Lizorkina) by the art collective MOST (2025) and the play “Shadows of Sanity” (Christine la Renarde) as part of the EKSTASIS theatre festival (2026). At the Akademietheater Regensburg she has appeared in productions of “Woyzeck” (Georg Büchner), “Die kleine Hexe” (Otfried Preußler) and “Medea” (Franz Grillparzer), among others."
    },
    credits: {
      theater: [
        { years: "2026–2027", production: "Hamlet", author: "William Shakespeare", role: "Hamlet, Güldenstern", director: "Michael Blumenthal", venue: "Akademietheater Regensburg" },
        { years: "2026", production: "Shadows of Sanity", author: "Christine La Renarde", role: "Mira, Er/Ihm", director: "Christine La Renarde", venue: "EKSTASIS Theaterfestival, Regensburg" },
        { years: "2025", production: "ME (DEA)", author: "Franz Grillparzer", role: "Kreusa", director: "Meike Groeneveld", venue: "Akademietheater Regensburg" },
        { years: "2025", production: "Die kleine Hexe", author: "Otfried Preußler, John von Düffel", role: "Vroni, Kräuterhexe u. a.", director: "Oliver Severin", venue: "Akademietheater Regensburg" },
        { years: "2024", production: "Woyzeck", author: "Georg Büchner", role: "Marie", director: "Senya Romin", venue: "Akademietheater Regensburg" }
      ],
      other: [
        { years: "2026", production: "Lügen über meine Mutter (szenische Lesung)", author: "Daniela Dröscher", role: "", director: "Meike Fabian", venue: "Akademietheater Regensburg" },
        { years: "2025", production: "Götter sterben (szenische Lesung)", author: "Marius Ivaškevičius", role: "Kri", director: "Greta Susceviciute", venue: "LUBIMOWKA Festival Wien" },
        { years: "2025", production: "Say Hi to Abdo (szenische Lesung)", author: "M. Iljintschik", role: "Laborantin", director: "Senya Romin", venue: "LUBIMOWKA Festival Wien" },
        { years: "2024", production: "Wanja ist am Leben (szenische Lesung)", author: "Natalia Lizorkina", role: "Alle", director: "Senya Romin", venue: "W1, Kunstkollektiv MOST" }
      ]
    },
    social: { instagram: "charlotte.gruenewald" },
    email: "lotti.gruenewald@web.de"
  },
  {
    slug: "linda-lehmann",
    name: "Linda Lehmann",
    pronouns: "sie/ihr",
    born: "16.02.2000",
    locations: ["Berlin", "München", "Stuttgart", "Hamburg", "Schweiz", "Dresden", "Leipzig"],
    playingAge: "15–28",
    height: "1,60 m",
    hairColor: { de: "dunkelbraun", en: "dark brown" },
    eyeColor: { de: "blau", en: "blue" },
    voiceType: { de: "Mezzosopran – Sopran", en: "Mezzo-soprano – soprano" },
    languages: {
      de: ["Deutsch (Muttersprache)", "Englisch (gute Kenntnisse)", "Spanisch (Grundkenntnisse)", "Vogtländisch (Heimatdialekt)", "Sächsisch"],
      en: ["German (native)", "English (good)", "Spanish (basic)", "Vogtlandian (native dialect)", "Saxon"]
    },
    skills: {
      de: ["Ski Alpin", "Bühnenkampf & Fechten (Grundlagen)", "Standardtanz (Grundlagen)", "Reiten", "Zeitgenössischer Tanz", "Tanztheater", "Capoeira", "Eislaufen", "Inlineskaten", "Gitarre (Grundkenntnisse)", "Führerschein (B)"],
      en: ["Alpine skiing", "Stage combat & fencing (basics)", "Ballroom dance (basics)", "Horse riding", "Contemporary dance", "Dance theatre", "Capoeira", "Ice skating", "Inline skating", "Guitar (basics)", "Driving licence (B)"]
    },
    bio: {
      de: "Linda Lehmann wurde in Reichenbach im Vogtland geboren und wuchs dort auf. Als Kind war ihre größte Leidenschaft, Geschichten zu erzählen und diese zu leben. Schon in der Schule war sie stets Teil der Theatergruppe, des Chors und sang Soli vor Publikum. Schauspielen und Gesang zeigten sich früh als wichtiger und erfüllender Teil ihres Lebens. Bis heute begeistert sie sich für Theater, Musicals und Filme und integriert diese Leidenschaft kreativ in ihren Alltag.\n\n2020 wurde sie durch ein Casting Teil der UFA Talentbase. Sie war Teil der Komparserie verschiedener Filmproduktionen, wie „Make me feel“, und spielte Rollen in kleineren Filmproduktionen wie „Glitzer & Atem“. 2021 bis 2023 war sie in verschiedenen Produktionen des TEATR Studio am Salzufer zu sehen.\n\nSeit September 2023 studiert sie Schauspiel an der Akademie für Darstellende Kunst Bayern in Regensburg. Dort wirkte sie unter anderem in Inszenierungen wie „Kasimir und Karoline“ von Ödön von Horváth, „Die kleine Hexe“ nach Otfried Preußler, „Der Mann aus Podolsk“ von Dmitry Danilov und aktuell in der Abschlussproduktion „Hamlet“ nach William Shakespeare mit.",
      en: "Linda Lehmann was born and raised in Reichenbach in the Vogtland region. As a child, her greatest passion was telling stories and living them. At school she was always part of the theatre group and the choir, and sang solos in front of an audience. Acting and singing proved early on to be an important and fulfilling part of her life. To this day she is passionate about theatre, musicals and films, and creatively weaves this passion into her everyday life.\n\nIn 2020 she became part of the UFA Talentbase through a casting. She appeared as an extra in various film productions such as “Make me feel” and played roles in smaller film productions such as “Glitzer & Atem”. From 2021 to 2023 she was seen in various productions of the TEATR Studio am Salzufer in Berlin.\n\nSince September 2023 she has been studying acting at the Academy of Performing Arts Bavaria in Regensburg, where she has appeared in productions such as “Kasimir und Karoline” by Ödön von Horváth, “Die kleine Hexe” after Otfried Preußler, “The Man from Podolsk” by Dmitry Danilov and currently the graduation production of “Hamlet” after William Shakespeare."
    },
    social: { instagram: "lindajustiinee", filmmakers: "https://www.filmmakers.eu/de/actors/linda-lehmann" },
    email: "linda.lehmann.acting@gmail.com"
  },
  {
    slug: "bianca-pitschedell",
    name: "Bianca Pitschedell",
    pronouns: "sie/ihr",
    born: "13.09.2002",
    locations: ["Innsbruck", "München", "Regensburg", "Wien", "Berlin", "Köln"],
    playingAge: "17–28",
    height: "1,69 m",
    hairColor: { de: "blond", en: "blonde" },
    eyeColor: { de: "blau", en: "blue" },
    voiceType: { de: "Mezzosopran", en: "Mezzo-soprano" },
    languages: {
      de: ["Deutsch (Muttersprache)", "Italienisch (fließend)", "Englisch (fließend)", "Tirolerisch (Heimatdialekt)"],
      en: ["German (native)", "Italian (fluent)", "English (fluent)", "Tyrolean (native dialect)"]
    },
    skills: {
      de: ["Ballett", "Jazzdance", "Contemporary", "Gesang", "Trompete", "Gitarre", "Klavier", "Fußball", "Bühnenkampf & Fechten", "Führerschein (B, AM)"],
      en: ["Ballet", "Jazz dance", "Contemporary", "Singing", "Trumpet", "Guitar", "Piano", "Football", "Stage combat & fencing", "Driving licence (B, AM)"]
    },
    auditionRoles: [
      { role: "Krassiwaja", play: "Wir haben Raketen geangelt", author: "Karen Köhler" },
      { role: "Dorine", play: "Tartuffe", author: "Molière" },
      { role: "Tanya", play: "White Lotus", author: "Mike White" },
      { role: "Mephisto", play: "Faust", author: "Johann Wolfgang von Goethe" },
      { role: "Andromache", play: "Atropa", author: "Tom Lanoye" }
    ],
    auditionSongs: [
      { title: "Nur ein Schritt", from: "Songs for a New World" },
      { title: "She Used to Be Mine", from: "Waitress" }
    ],
    bio: {
      de: "Bianca Pitschedell ist in Innsbruck geboren und aufgewachsen. Schon seit der Grundschule steht Bianca regelmäßig auf der Bühne und war immer schon fasziniert von der Welt des Theaters.\n\nIhre Leidenschaft brachte sie auf diverse Bühnen in Tirol: Im Landesjugendtheater Innsbruck durfte sie über 10 Jahre regelmäßig in verschiedenen Produktionen auf der Bühne stehen. Professionelle Bühnenluft durfte sie vor allem am Landestheater Innsbruck schnuppern, wo sie ebenfalls über ca. 10 Jahre in vielen Stücken mitwirkte. Ein einschneidendes Theatererlebnis war für sie vor allem ihr selbstgeschriebenes Stück „Als wir zum ersten Mal...“. Damit durfte sie durch Tirol touren und es in verschiedenen Klassen und am Tiroler Landestheater präsentieren.\n\nIn Regensburg konnte man Bianca im Akademietheater der ADK Bayern als Else in „Else (Someone)“ und als Gora und Kreon in „Medea“ erleben. Außerdem organisierte sie dort im Oktober 2024 ein Benefizkonzert für den VKKK Ostbayern. Am Staatstheater Regensburg gestaltete Bianca das Velospezial „Abgewogen“ mit. Die Freunde der ADK Bayern haben Bianca 2025 den Förderpreis für außerordentliche künstlerische und soziale Leistungen verliehen.\n\nNeben der Schauspielerei nimmt Bianca seit ihrem 14. Lebensjahr Gesangsunterricht, tanzt seit 7 Jahren Ballett, Jazz und Lyrical Dance und spielt Flügelhorn.",
      en: "Bianca Pitschedell was born and raised in Innsbruck. She has been on stage regularly since primary school and has always been fascinated by the world of theatre.\n\nHer passion took her to various stages across Tyrol: at the Landesjugendtheater Innsbruck she performed regularly in a wide range of productions for more than ten years, and she got her first taste of professional theatre above all at the Landestheater Innsbruck, where she likewise appeared in many plays over a period of about ten years. A formative theatre experience was her self-written play “Als wir zum ersten Mal...”, with which she toured Tyrol, presenting it in schools and at the Tiroler Landestheater.\n\nIn Regensburg, Bianca could be seen at the Akademietheater of ADK Bavaria as Else in “Else (Someone)” and as Gora and Creon in “Medea”. In October 2024 she also organised a benefit concert there for the VKKK Ostbayern. At the Staatstheater Regensburg she co-created the cycling special “Abgewogen”. In 2025 the Friends of ADK Bavaria awarded Bianca their prize for exceptional artistic and social achievement.\n\nAlongside acting, Bianca has been taking singing lessons since the age of 14, has been dancing ballet, jazz and lyrical dance for seven years, and plays the flugelhorn."
    },
    credits: {
      theater: [
        { years: "2026", production: "Hamlet", author: "William Shakespeare", role: "Gertrud", director: "Michael Blumenthal", venue: "Akademietheater Regensburg" },
        { years: "2026", production: "The Rocky Horror Show", author: "Richard O'Brien", role: "Phantom", director: "Paul Spittler", venue: "Tiroler Landestheater" },
        { years: "2026", production: "Lügen über meine Mutter (szenische Lesung)", author: "Daniela Dröscher", role: "", director: "Meike Fabian", venue: "Akademietheater Regensburg" },
        { years: "2025", production: "Die kleine Hexe", author: "Otfried Preußler", role: "Muhme Rumpumpel, Schützin, Schneemann, Holzsammlerin, Marktfrau", director: "Oliver Severin", venue: "Akademietheater Regensburg" },
        { years: "2025", production: "Medea", author: "Franz Grillparzer", role: "Kreon, Gora", director: "Meike Groeneveld", venue: "Akademietheater Regensburg" },
        { years: "2024", production: "Else (Someone)", author: "", role: "Else", director: "Melvin Vignano", venue: "Akademietheater Regensburg" },
        { years: "2024", production: "Abgewogen (Velospezial)", author: "", role: "", director: "Natascha Weigang", venue: "Staatstheater Regensburg" },
        { years: "2022", production: "Als wir zum ersten Mal…", author: "Bianca Pitschedell, Alexandra Leonie Kronberger", role: "Ella", director: "Alexandra Leonie Kronberger", venue: "Haus der Musik Innsbruck" },
        { years: "2021", production: "Blues Brothers. Im Auftrag des Herrn", author: "", role: "", director: "Susi Weber", venue: "Tiroler Landestheater" },
        { years: "2014–2022", production: "Diverse Musicalproduktionen", author: "", role: "", director: "", venue: "Landesjugendtheater Innsbruck" }
      ],
      film: [
        { years: "2024", production: "Elfi (Spielfilm)", role: "Marianne", director: "Anita Lackenberger", venue: "" },
        { years: "2023", production: "Getting Hit by Maturity in the Age of #whatthefuckshallwedowithourlives (Kurzfilm)", role: "Mutter", director: "Alexandra Leonie Kronberger", venue: "" }
      ]
    },
    social: { instagram: "bianca_.p" },
    email: "b.pitschedell@gmail.com"
  },
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
  {
    slug: "rosalie-zwenzner",
    name: "Rosalie Zwenzner",
    bio: {
      de: "Rosalie Daria Zwenzner wurde am 23.12.1999 in München geboren und ist dort aufgewachsen. Seit ihrer Kindheit hat sie eine große Verbundenheit zu Musik, Tanz und Theater. Sie spielte im Orchester, sang im Chor, nahm zehn Jahre Stepptanzunterricht und begann mit 14 in einer Musical-Gruppe zu spielen und zu singen.\n\nNach Erfahrungen auf verschiedenen Bühnen, wie 2023 in den Münchner Kammerspielen bei „A scheene Leich“ (R: Ruedi Häusermann) und dem Theater Grenzenlos, sowie einigen Inszenierungen auf der Studiobühne München begann sie ihr Schauspielstudium an der ADK Bayern. Nach einem Gastengagement an der Staatsoper Stuttgart in der Produktion „hässlich as fuck“ verbringt sie ihr viertes Studienjahr nun im Schauspielstudio am Theater Chemnitz, wo sie unter anderem in der Studioproduktion „Die Reise von der Erde zum Mond“ nach Jules Verne (R: Tilo Krügel) zu sehen ist.\n\nNeben dem Studium ist sie ehrenamtlich im jungen ensemble-netzwerk und bei Theapolis aktiv. Sie singt, tanzt und liest gerne, liebt die Natur und Tiere.",
      en: "Rosalie Daria Zwenzner was born in Munich on 23 December 1999 and grew up there. Since childhood she has felt a deep connection to music, dance and theatre. She played in an orchestra, sang in a choir, took tap dance lessons for ten years and began performing and singing in a musical theatre group at the age of 14.\n\nAfter experiences on various stages — such as “A scheene Leich” at the Münchner Kammerspiele in 2023 (directed by Ruedi Häusermann) and Theater Grenzenlos, as well as several productions at the Studiobühne München — she began her acting studies at ADK Bavaria. Following a guest engagement at the Staatsoper Stuttgart in the production “hässlich as fuck”, she is now spending her fourth year of study at the drama studio of Theater Chemnitz, where she can be seen in the studio production “The Journey from the Earth to the Moon” after Jules Verne (directed by Tilo Krügel), among others.\n\nAlongside her studies she volunteers with junges ensemble-netzwerk and Theapolis. She loves singing, dancing and reading, as well as nature and animals."
    }
  }
];
