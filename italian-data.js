// italian-data.js — Italian A1/A2/B1: verbs (presente · passato prossimo · imperfetto), vocabulary, reading passages, idioms
// difficulty: 1=A1  2=A2  3=B1

const VERBS = [
  {
    infinitive: 'essere', translation: 'to be', group: 'irregular', difficulty: 1,
    conjugation: { io: 'sono', tu: 'sei', 'lui/lei': 'è', noi: 'siamo', voi: 'siete', loro: 'sono' },
    tenses: {
      presenteIndicativo: { io: 'sono', tu: 'sei', 'lui/lei': 'è', noi: 'siamo', voi: 'siete', loro: 'sono' },
      passatoProssimo:    { io: 'sono stato', tu: 'sei stato', 'lui/lei': 'è stato', noi: 'siamo stati', voi: 'siete stati', loro: 'sono stati' },
      imperfetto:         { io: 'ero', tu: 'eri', 'lui/lei': 'era', noi: 'eravamo', voi: 'eravate', loro: 'erano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'stato',
    example: { it: 'Io sono italiano.', en: 'I am Italian.' },
    examples: [
      { it: 'Lei è molto gentile.', en: 'She is very kind.' },
      { it: 'Siamo amici da molti anni.', en: 'We have been friends for many years.' },
      { it: 'Sono le tre del pomeriggio.', en: 'It is three in the afternoon.' }
    ]
  },
  {
    infinitive: 'avere', translation: 'to have', group: 'irregular', difficulty: 1,
    conjugation: { io: 'ho', tu: 'hai', 'lui/lei': 'ha', noi: 'abbiamo', voi: 'avete', loro: 'hanno' },
    tenses: {
      presenteIndicativo: { io: 'ho', tu: 'hai', 'lui/lei': 'ha', noi: 'abbiamo', voi: 'avete', loro: 'hanno' },
      passatoProssimo:    { io: 'ho avuto', tu: 'hai avuto', 'lui/lei': 'ha avuto', noi: 'abbiamo avuto', voi: 'avete avuto', loro: 'hanno avuto' },
      imperfetto:         { io: 'avevo', tu: 'avevi', 'lui/lei': 'aveva', noi: 'avevamo', voi: 'avevate', loro: 'avevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'avuto',
    example: { it: 'Tu hai un cane.', en: 'You have a dog.' },
    examples: [
      { it: 'Ho fame.', en: 'I am hungry. (lit. I have hunger)' },
      { it: 'Quanti anni hai?', en: 'How old are you? (lit. How many years do you have?)' },
      { it: 'Abbiamo una casa grande.', en: 'We have a big house.' }
    ]
  },
  {
    infinitive: 'fare', translation: 'to do / to make', group: 'irregular', difficulty: 1,
    conjugation: { io: 'faccio', tu: 'fai', 'lui/lei': 'fa', noi: 'facciamo', voi: 'fate', loro: 'fanno' },
    tenses: {
      presenteIndicativo: { io: 'faccio', tu: 'fai', 'lui/lei': 'fa', noi: 'facciamo', voi: 'fate', loro: 'fanno' },
      passatoProssimo:    { io: 'ho fatto', tu: 'hai fatto', 'lui/lei': 'ha fatto', noi: 'abbiamo fatto', voi: 'avete fatto', loro: 'hanno fatto' },
      imperfetto:         { io: 'facevo', tu: 'facevi', 'lui/lei': 'faceva', noi: 'facevamo', voi: 'facevate', loro: 'facevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'fatto',
    example: { it: 'Che cosa fai?', en: 'What are you doing?' },
    examples: [
      { it: 'Fa caldo oggi.', en: 'It is hot today. (lit. It makes hot)' },
      { it: 'Faccio colazione alle otto.', en: 'I have breakfast at eight.' },
      { it: 'Facciamo una passeggiata?', en: 'Shall we take a walk?' }
    ]
  },
  {
    infinitive: 'dire', translation: 'to say / to tell', group: 'irregular', difficulty: 1,
    conjugation: { io: 'dico', tu: 'dici', 'lui/lei': 'dice', noi: 'diciamo', voi: 'dite', loro: 'dicono' },
    tenses: {
      presenteIndicativo: { io: 'dico', tu: 'dici', 'lui/lei': 'dice', noi: 'diciamo', voi: 'dite', loro: 'dicono' },
      passatoProssimo:    { io: 'ho detto', tu: 'hai detto', 'lui/lei': 'ha detto', noi: 'abbiamo detto', voi: 'avete detto', loro: 'hanno detto' },
      imperfetto:         { io: 'dicevo', tu: 'dicevi', 'lui/lei': 'diceva', noi: 'dicevamo', voi: 'dicevate', loro: 'dicevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'detto',
    example: { it: 'Lui dice la verità.', en: 'He tells the truth.' },
    examples: [
      { it: 'Come si dice in italiano?', en: 'How do you say it in Italian?' },
      { it: 'Diciamo sempre la verità.', en: 'We always tell the truth.' },
      { it: 'Mi dici il tuo nome?', en: 'Will you tell me your name?' }
    ]
  },
  {
    infinitive: 'andare', translation: 'to go', group: 'irregular', difficulty: 1,
    conjugation: { io: 'vado', tu: 'vai', 'lui/lei': 'va', noi: 'andiamo', voi: 'andate', loro: 'vanno' },
    tenses: {
      presenteIndicativo: { io: 'vado', tu: 'vai', 'lui/lei': 'va', noi: 'andiamo', voi: 'andate', loro: 'vanno' },
      passatoProssimo:    { io: 'sono andato', tu: 'sei andato', 'lui/lei': 'è andato', noi: 'siamo andati', voi: 'siete andati', loro: 'sono andati' },
      imperfetto:         { io: 'andavo', tu: 'andavi', 'lui/lei': 'andava', noi: 'andavamo', voi: 'andavate', loro: 'andavano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'andato',
    example: { it: 'Andiamo al cinema.', en: 'We go to the cinema.' },
    examples: [
      { it: 'Vado a scuola ogni giorno.', en: 'I go to school every day.' },
      { it: 'Come va?', en: 'How is it going?' },
      { it: 'Vanno in vacanza in agosto.', en: 'They go on vacation in August.' }
    ]
  },
  {
    infinitive: 'venire', translation: 'to come', group: 'irregular', difficulty: 1,
    conjugation: { io: 'vengo', tu: 'vieni', 'lui/lei': 'viene', noi: 'veniamo', voi: 'venite', loro: 'vengono' },
    tenses: {
      presenteIndicativo: { io: 'vengo', tu: 'vieni', 'lui/lei': 'viene', noi: 'veniamo', voi: 'venite', loro: 'vengono' },
      passatoProssimo:    { io: 'sono venuto', tu: 'sei venuto', 'lui/lei': 'è venuto', noi: 'siamo venuti', voi: 'siete venuti', loro: 'sono venuti' },
      imperfetto:         { io: 'venivo', tu: 'venivi', 'lui/lei': 'veniva', noi: 'venivamo', voi: 'venivate', loro: 'venivano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'venuto',
    example: { it: 'Vieni con me?', en: 'Are you coming with me?' },
    examples: [
      { it: 'Da dove vieni?', en: 'Where do you come from?' },
      { it: 'Vengono alla festa stasera.', en: 'They are coming to the party tonight.' },
      { it: 'Vengo subito!', en: 'I am coming right away!' }
    ]
  },
  {
    infinitive: 'vedere', translation: 'to see', group: '-ere', difficulty: 1,
    conjugation: { io: 'vedo', tu: 'vedi', 'lui/lei': 'vede', noi: 'vediamo', voi: 'vedete', loro: 'vedono' },
    tenses: {
      presenteIndicativo: { io: 'vedo', tu: 'vedi', 'lui/lei': 'vede', noi: 'vediamo', voi: 'vedete', loro: 'vedono' },
      passatoProssimo:    { io: 'ho visto', tu: 'hai visto', 'lui/lei': 'ha visto', noi: 'abbiamo visto', voi: 'avete visto', loro: 'hanno visto' },
      imperfetto:         { io: 'vedevo', tu: 'vedevi', 'lui/lei': 'vedeva', noi: 'vedevamo', voi: 'vedevate', loro: 'vedevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'visto',
    example: { it: 'Vedo il mare.', en: 'I see the sea.' },
    examples: [
      { it: 'Ci vediamo domani.', en: 'See you tomorrow.' },
      { it: 'Non vedo bene senza occhiali.', en: "I can't see well without glasses." },
      { it: 'Vedi quella stella?', en: 'Do you see that star?' }
    ]
  },
  {
    infinitive: 'dare', translation: 'to give', group: 'irregular', difficulty: 1,
    conjugation: { io: 'do', tu: 'dai', 'lui/lei': 'dà', noi: 'diamo', voi: 'date', loro: 'danno' },
    tenses: {
      presenteIndicativo: { io: 'do', tu: 'dai', 'lui/lei': 'dà', noi: 'diamo', voi: 'date', loro: 'danno' },
      passatoProssimo:    { io: 'ho dato', tu: 'hai dato', 'lui/lei': 'ha dato', noi: 'abbiamo dato', voi: 'avete dato', loro: 'hanno dato' },
      imperfetto:         { io: 'davo', tu: 'davi', 'lui/lei': 'dava', noi: 'davamo', voi: 'davate', loro: 'davano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'dato',
    example: { it: 'Ti do un libro.', en: 'I give you a book.' },
    examples: [
      { it: 'Mi dai una mano?', en: 'Can you give me a hand?' },
      { it: 'La finestra dà sul giardino.', en: 'The window overlooks the garden.' },
      { it: 'Diamo un esame domani.', en: 'We are taking an exam tomorrow.' }
    ]
  },
  {
    infinitive: 'stare', translation: 'to stay / to be (state)', group: 'irregular', difficulty: 1,
    conjugation: { io: 'sto', tu: 'stai', 'lui/lei': 'sta', noi: 'stiamo', voi: 'state', loro: 'stanno' },
    tenses: {
      presenteIndicativo: { io: 'sto', tu: 'stai', 'lui/lei': 'sta', noi: 'stiamo', voi: 'state', loro: 'stanno' },
      passatoProssimo:    { io: 'sono stato', tu: 'sei stato', 'lui/lei': 'è stato', noi: 'siamo stati', voi: 'siete stati', loro: 'sono stati' },
      imperfetto:         { io: 'stavo', tu: 'stavi', 'lui/lei': 'stava', noi: 'stavamo', voi: 'stavate', loro: 'stavano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'stato',
    example: { it: 'Come stai?', en: 'How are you?' },
    examples: [
      { it: 'Sto bene, grazie.', en: 'I am fine, thanks.' },
      { it: 'Stiamo a casa stasera.', en: 'We are staying home tonight.' },
      { it: 'Sta piovendo.', en: 'It is raining. (stare + gerund = continuous)' }
    ]
  },
  {
    infinitive: 'sapere', translation: 'to know (a fact)', group: 'irregular', difficulty: 1,
    conjugation: { io: 'so', tu: 'sai', 'lui/lei': 'sa', noi: 'sappiamo', voi: 'sapete', loro: 'sanno' },
    tenses: {
      presenteIndicativo: { io: 'so', tu: 'sai', 'lui/lei': 'sa', noi: 'sappiamo', voi: 'sapete', loro: 'sanno' },
      passatoProssimo:    { io: 'ho saputo', tu: 'hai saputo', 'lui/lei': 'ha saputo', noi: 'abbiamo saputo', voi: 'avete saputo', loro: 'hanno saputo' },
      imperfetto:         { io: 'sapevo', tu: 'sapevi', 'lui/lei': 'sapeva', noi: 'sapevamo', voi: 'sapevate', loro: 'sapevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'saputo',
    example: { it: 'Non lo so.', en: "I don't know." },
    examples: [
      { it: 'Sai dove è la stazione?', en: 'Do you know where the station is?' },
      { it: 'Sa nuotare molto bene.', en: 'He/she can swim very well.' },
      { it: 'Non sappiamo niente.', en: "We don't know anything." }
    ]
  },
  {
    infinitive: 'potere', translation: 'can / to be able to', group: 'irregular', difficulty: 1,
    conjugation: { io: 'posso', tu: 'puoi', 'lui/lei': 'può', noi: 'possiamo', voi: 'potete', loro: 'possono' },
    tenses: {
      presenteIndicativo: { io: 'posso', tu: 'puoi', 'lui/lei': 'può', noi: 'possiamo', voi: 'potete', loro: 'possono' },
      passatoProssimo:    { io: 'ho potuto', tu: 'hai potuto', 'lui/lei': 'ha potuto', noi: 'abbiamo potuto', voi: 'avete potuto', loro: 'hanno potuto' },
      imperfetto:         { io: 'potevo', tu: 'potevi', 'lui/lei': 'poteva', noi: 'potevamo', voi: 'potevate', loro: 'potevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'potuto',
    example: { it: 'Posso aiutarti?', en: 'Can I help you?' },
    examples: [
      { it: 'Non posso venire domani.', en: "I can't come tomorrow." },
      { it: 'Puoi parlare più piano?', en: 'Can you speak more slowly?' },
      { it: 'Possiamo sederci qui?', en: 'Can we sit here?' }
    ]
  },
  {
    infinitive: 'volere', translation: 'to want', group: 'irregular', difficulty: 1,
    conjugation: { io: 'voglio', tu: 'vuoi', 'lui/lei': 'vuole', noi: 'vogliamo', voi: 'volete', loro: 'vogliono' },
    tenses: {
      presenteIndicativo: { io: 'voglio', tu: 'vuoi', 'lui/lei': 'vuole', noi: 'vogliamo', voi: 'volete', loro: 'vogliono' },
      passatoProssimo:    { io: 'ho voluto', tu: 'hai voluto', 'lui/lei': 'ha voluto', noi: 'abbiamo voluto', voi: 'avete voluto', loro: 'hanno voluto' },
      imperfetto:         { io: 'volevo', tu: 'volevi', 'lui/lei': 'voleva', noi: 'volevamo', voi: 'volevate', loro: 'volevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'voluto',
    example: { it: 'Voglio un caffè.', en: 'I want a coffee.' },
    examples: [
      { it: 'Vuoi venire con noi?', en: 'Do you want to come with us?' },
      { it: 'Vogliamo imparare l\'italiano.', en: 'We want to learn Italian.' },
      { it: 'Ci vuole pazienza.', en: 'It takes patience. (impersonal)' }
    ]
  },
  {
    infinitive: 'dovere', translation: 'must / to have to', group: 'irregular', difficulty: 1,
    conjugation: { io: 'devo', tu: 'devi', 'lui/lei': 'deve', noi: 'dobbiamo', voi: 'dovete', loro: 'devono' },
    tenses: {
      presenteIndicativo: { io: 'devo', tu: 'devi', 'lui/lei': 'deve', noi: 'dobbiamo', voi: 'dovete', loro: 'devono' },
      passatoProssimo:    { io: 'ho dovuto', tu: 'hai dovuto', 'lui/lei': 'ha dovuto', noi: 'abbiamo dovuto', voi: 'avete dovuto', loro: 'hanno dovuto' },
      imperfetto:         { io: 'dovevo', tu: 'dovevi', 'lui/lei': 'doveva', noi: 'dovevamo', voi: 'dovevate', loro: 'dovevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'dovuto',
    example: { it: 'Devo studiare.', en: 'I have to study.' },
    examples: [
      { it: 'Devi andare dal dottore.', en: 'You have to go to the doctor.' },
      { it: 'Dobbiamo partire presto.', en: 'We must leave early.' },
      { it: 'Quanto ti devo?', en: 'How much do I owe you?' }
    ]
  },
  {
    infinitive: 'parlare', translation: 'to speak', group: '-are', difficulty: 1,
    conjugation: { io: 'parlo', tu: 'parli', 'lui/lei': 'parla', noi: 'parliamo', voi: 'parlate', loro: 'parlano' },
    tenses: {
      presenteIndicativo: { io: 'parlo', tu: 'parli', 'lui/lei': 'parla', noi: 'parliamo', voi: 'parlate', loro: 'parlano' },
      passatoProssimo:    { io: 'ho parlato', tu: 'hai parlato', 'lui/lei': 'ha parlato', noi: 'abbiamo parlato', voi: 'avete parlato', loro: 'hanno parlato' },
      imperfetto:         { io: 'parlavo', tu: 'parlavi', 'lui/lei': 'parlava', noi: 'parlavamo', voi: 'parlavate', loro: 'parlavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'parlato',
    example: { it: 'Parlo italiano.', en: 'I speak Italian.' },
    examples: [
      { it: 'Parli inglese?', en: 'Do you speak English?' },
      { it: 'Parliamo di qualcosa di bello.', en: "Let's talk about something nice." },
      { it: 'Non parlare così forte!', en: "Don't speak so loud!" }
    ]
  },
  {
    infinitive: 'mangiare', translation: 'to eat', group: '-are', difficulty: 1,
    conjugation: { io: 'mangio', tu: 'mangi', 'lui/lei': 'mangia', noi: 'mangiamo', voi: 'mangiate', loro: 'mangiano' },
    tenses: {
      presenteIndicativo: { io: 'mangio', tu: 'mangi', 'lui/lei': 'mangia', noi: 'mangiamo', voi: 'mangiate', loro: 'mangiano' },
      passatoProssimo:    { io: 'ho mangiato', tu: 'hai mangiato', 'lui/lei': 'ha mangiato', noi: 'abbiamo mangiato', voi: 'avete mangiato', loro: 'hanno mangiato' },
      imperfetto:         { io: 'mangiavo', tu: 'mangiavi', 'lui/lei': 'mangiava', noi: 'mangiavamo', voi: 'mangiavate', loro: 'mangiavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'mangiato',
    example: { it: 'Mangiamo la pizza.', en: 'We eat pizza.' },
    examples: [
      { it: 'A che ora mangi?', en: 'What time do you eat?' },
      { it: 'Mangio sempre troppo a Natale.', en: 'I always eat too much at Christmas.' },
      { it: 'Mangiate fuori stasera?', en: 'Are you eating out tonight?' }
    ]
  },
  {
    infinitive: 'bere', translation: 'to drink', group: 'irregular', difficulty: 1,
    conjugation: { io: 'bevo', tu: 'bevi', 'lui/lei': 'beve', noi: 'beviamo', voi: 'bevete', loro: 'bevono' },
    tenses: {
      presenteIndicativo: { io: 'bevo', tu: 'bevi', 'lui/lei': 'beve', noi: 'beviamo', voi: 'bevete', loro: 'bevono' },
      passatoProssimo:    { io: 'ho bevuto', tu: 'hai bevuto', 'lui/lei': 'ha bevuto', noi: 'abbiamo bevuto', voi: 'avete bevuto', loro: 'hanno bevuto' },
      imperfetto:         { io: 'bevevo', tu: 'bevevi', 'lui/lei': 'beveva', noi: 'bevevamo', voi: 'bevevate', loro: 'bevevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'bevuto',
    example: { it: 'Bevo acqua.', en: 'I drink water.' },
    examples: [
      { it: 'Cosa bevi?', en: 'What are you drinking?' },
      { it: 'Beviamo un bicchiere di vino.', en: "Let's drink a glass of wine." },
      { it: 'Non bevo caffè la sera.', en: "I don't drink coffee in the evening." }
    ]
  },
  {
    infinitive: 'dormire', translation: 'to sleep', group: '-ire', difficulty: 1,
    conjugation: { io: 'dormo', tu: 'dormi', 'lui/lei': 'dorme', noi: 'dormiamo', voi: 'dormite', loro: 'dormono' },
    tenses: {
      presenteIndicativo: { io: 'dormo', tu: 'dormi', 'lui/lei': 'dorme', noi: 'dormiamo', voi: 'dormite', loro: 'dormono' },
      passatoProssimo:    { io: 'ho dormito', tu: 'hai dormito', 'lui/lei': 'ha dormito', noi: 'abbiamo dormito', voi: 'avete dormito', loro: 'hanno dormito' },
      imperfetto:         { io: 'dormivo', tu: 'dormivi', 'lui/lei': 'dormiva', noi: 'dormivamo', voi: 'dormivate', loro: 'dormivano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'dormito',
    example: { it: 'Dormite bene?', en: 'Do you sleep well?' },
    examples: [
      { it: 'Dormo otto ore ogni notte.', en: 'I sleep eight hours every night.' },
      { it: 'Il bambino dorme ancora.', en: 'The baby is still sleeping.' },
      { it: 'Non riesco a dormire.', en: "I can't fall asleep." }
    ]
  },
  {
    infinitive: 'leggere', translation: 'to read', group: '-ere', difficulty: 1,
    conjugation: { io: 'leggo', tu: 'leggi', 'lui/lei': 'legge', noi: 'leggiamo', voi: 'leggete', loro: 'leggono' },
    tenses: {
      presenteIndicativo: { io: 'leggo', tu: 'leggi', 'lui/lei': 'legge', noi: 'leggiamo', voi: 'leggete', loro: 'leggono' },
      passatoProssimo:    { io: 'ho letto', tu: 'hai letto', 'lui/lei': 'ha letto', noi: 'abbiamo letto', voi: 'avete letto', loro: 'hanno letto' },
      imperfetto:         { io: 'leggevo', tu: 'leggevi', 'lui/lei': 'leggeva', noi: 'leggevamo', voi: 'leggevate', loro: 'leggevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'letto',
    example: { it: 'Leggo un libro.', en: 'I read a book.' },
    examples: [
      { it: 'Cosa stai leggendo?', en: 'What are you reading?' },
      { it: 'Leggiamo il giornale la mattina.', en: 'We read the newspaper in the morning.' },
      { it: 'Mi piace leggere prima di dormire.', en: 'I like to read before sleeping.' }
    ]
  },
  {
    infinitive: 'scrivere', translation: 'to write', group: '-ere', difficulty: 1,
    conjugation: { io: 'scrivo', tu: 'scrivi', 'lui/lei': 'scrive', noi: 'scriviamo', voi: 'scrivete', loro: 'scrivono' },
    tenses: {
      presenteIndicativo: { io: 'scrivo', tu: 'scrivi', 'lui/lei': 'scrive', noi: 'scriviamo', voi: 'scrivete', loro: 'scrivono' },
      passatoProssimo:    { io: 'ho scritto', tu: 'hai scritto', 'lui/lei': 'ha scritto', noi: 'abbiamo scritto', voi: 'avete scritto', loro: 'hanno scritto' },
      imperfetto:         { io: 'scrivevo', tu: 'scrivevi', 'lui/lei': 'scriveva', noi: 'scrivevamo', voi: 'scrivevate', loro: 'scrivevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'scritto',
    example: { it: 'Scrivo una lettera.', en: 'I write a letter.' },
    examples: [
      { it: 'Come si scrive il tuo nome?', en: 'How do you spell your name?' },
      { it: 'Scrivi un messaggio a Marco.', en: 'Write a message to Marco.' },
      { it: 'Scriviamo ogni giorno in classe.', en: 'We write every day in class.' }
    ]
  },
  {
    infinitive: 'capire', translation: 'to understand', group: '-ire (isc)', difficulty: 1,
    conjugation: { io: 'capisco', tu: 'capisci', 'lui/lei': 'capisce', noi: 'capiamo', voi: 'capite', loro: 'capiscono' },
    tenses: {
      presenteIndicativo: { io: 'capisco', tu: 'capisci', 'lui/lei': 'capisce', noi: 'capiamo', voi: 'capite', loro: 'capiscono' },
      passatoProssimo:    { io: 'ho capito', tu: 'hai capito', 'lui/lei': 'ha capito', noi: 'abbiamo capito', voi: 'avete capito', loro: 'hanno capito' },
      imperfetto:         { io: 'capivo', tu: 'capivi', 'lui/lei': 'capiva', noi: 'capivamo', voi: 'capivate', loro: 'capivano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'capito',
    example: { it: 'Non capisco.', en: "I don't understand." },
    examples: [
      { it: 'Capisci l\'italiano?', en: 'Do you understand Italian?' },
      { it: 'Non capisco questa parola.', en: "I don't understand this word." },
      { it: 'Capiscono tutto ma non parlano.', en: 'They understand everything but don\'t speak.' }
    ]
  },
  {
    infinitive: 'prendere', translation: 'to take', group: '-ere', difficulty: 1,
    conjugation: { io: 'prendo', tu: 'prendi', 'lui/lei': 'prende', noi: 'prendiamo', voi: 'prendete', loro: 'prendono' },
    tenses: {
      presenteIndicativo: { io: 'prendo', tu: 'prendi', 'lui/lei': 'prende', noi: 'prendiamo', voi: 'prendete', loro: 'prendono' },
      passatoProssimo:    { io: 'ho preso', tu: 'hai preso', 'lui/lei': 'ha preso', noi: 'abbiamo preso', voi: 'avete preso', loro: 'hanno preso' },
      imperfetto:         { io: 'prendevo', tu: 'prendevi', 'lui/lei': 'prendeva', noi: 'prendevamo', voi: 'prendevate', loro: 'prendevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'preso',
    example: { it: 'Prendo il treno.', en: 'I take the train.' },
    examples: [
      { it: 'Cosa prendi da bere?', en: 'What will you have to drink?' },
      { it: 'Prendiamo un taxi?', en: 'Shall we take a taxi?' },
      { it: 'Prende sempre il caffè amaro.', en: 'He/she always takes coffee without sugar.' }
    ]
  },
  {
    infinitive: 'mettere', translation: 'to put', group: '-ere', difficulty: 1,
    conjugation: { io: 'metto', tu: 'metti', 'lui/lei': 'mette', noi: 'mettiamo', voi: 'mettete', loro: 'mettono' },
    tenses: {
      presenteIndicativo: { io: 'metto', tu: 'metti', 'lui/lei': 'mette', noi: 'mettiamo', voi: 'mettete', loro: 'mettono' },
      passatoProssimo:    { io: 'ho messo', tu: 'hai messo', 'lui/lei': 'ha messo', noi: 'abbiamo messo', voi: 'avete messo', loro: 'hanno messo' },
      imperfetto:         { io: 'mettevo', tu: 'mettevi', 'lui/lei': 'metteva', noi: 'mettevamo', voi: 'mettevate', loro: 'mettevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'messo',
    example: { it: 'Metto il libro sul tavolo.', en: 'I put the book on the table.' },
    examples: [
      { it: 'Cosa ti metti stasera?', en: 'What are you wearing tonight?' },
      { it: 'Metti la giacca, fa freddo.', en: 'Put on your jacket, it is cold.' },
      { it: 'Ci mettiamo un\'ora per arrivare.', en: 'It takes us an hour to get there.' }
    ]
  },
  {
    infinitive: 'lavorare', translation: 'to work', group: '-are', difficulty: 1,
    conjugation: { io: 'lavoro', tu: 'lavori', 'lui/lei': 'lavora', noi: 'lavoriamo', voi: 'lavorate', loro: 'lavorano' },
    tenses: {
      presenteIndicativo: { io: 'lavoro', tu: 'lavori', 'lui/lei': 'lavora', noi: 'lavoriamo', voi: 'lavorate', loro: 'lavorano' },
      passatoProssimo:    { io: 'ho lavorato', tu: 'hai lavorato', 'lui/lei': 'ha lavorato', noi: 'abbiamo lavorato', voi: 'avete lavorato', loro: 'hanno lavorato' },
      imperfetto:         { io: 'lavoravo', tu: 'lavoravi', 'lui/lei': 'lavorava', noi: 'lavoravamo', voi: 'lavoravate', loro: 'lavoravano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'lavorato',
    example: { it: 'Lavoro in ufficio.', en: 'I work in the office.' },
    examples: [
      { it: 'Dove lavori?', en: 'Where do you work?' },
      { it: 'Lavoriamo dal lunedì al venerdì.', en: 'We work from Monday to Friday.' },
      { it: 'Lavora troppo.', en: 'He/she works too much.' }
    ]
  },
  {
    infinitive: 'giocare', translation: 'to play', group: '-are', difficulty: 1,
    conjugation: { io: 'gioco', tu: 'giochi', 'lui/lei': 'gioca', noi: 'giochiamo', voi: 'giocate', loro: 'giocano' },
    tenses: {
      presenteIndicativo: { io: 'gioco', tu: 'giochi', 'lui/lei': 'gioca', noi: 'giochiamo', voi: 'giocate', loro: 'giocano' },
      passatoProssimo:    { io: 'ho giocato', tu: 'hai giocato', 'lui/lei': 'ha giocato', noi: 'abbiamo giocato', voi: 'avete giocato', loro: 'hanno giocato' },
      imperfetto:         { io: 'giocavo', tu: 'giocavi', 'lui/lei': 'giocava', noi: 'giocavamo', voi: 'giocavate', loro: 'giocavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'giocato',
    example: { it: 'I bambini giocano.', en: 'The children play.' },
    examples: [
      { it: 'Giochi a calcio?', en: 'Do you play football?' },
      { it: 'Giochiamo a carte stasera.', en: "Let's play cards tonight." },
      { it: 'Gioco con il mio cane al parco.', en: 'I play with my dog at the park.' }
    ]
  },
  {
    infinitive: 'comprare', translation: 'to buy', group: '-are', difficulty: 1,
    conjugation: { io: 'compro', tu: 'compri', 'lui/lei': 'compra', noi: 'compriamo', voi: 'comprate', loro: 'comprano' },
    tenses: {
      presenteIndicativo: { io: 'compro', tu: 'compri', 'lui/lei': 'compra', noi: 'compriamo', voi: 'comprate', loro: 'comprano' },
      passatoProssimo:    { io: 'ho comprato', tu: 'hai comprato', 'lui/lei': 'ha comprato', noi: 'abbiamo comprato', voi: 'avete comprato', loro: 'hanno comprato' },
      imperfetto:         { io: 'compravo', tu: 'compravi', 'lui/lei': 'comprava', noi: 'compravamo', voi: 'compravate', loro: 'compravano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'comprato',
    example: { it: 'Compro il pane.', en: 'I buy bread.' },
    examples: [
      { it: 'Dove compri la frutta?', en: 'Where do you buy fruit?' },
      { it: 'Compriamo un regalo per Maria.', en: "Let's buy a gift for Maria." },
      { it: 'Compra sempre al mercato.', en: 'He/she always buys at the market.' }
    ]
  },
  {
    infinitive: 'aprire', translation: 'to open', group: '-ire', difficulty: 1,
    conjugation: { io: 'apro', tu: 'apri', 'lui/lei': 'apre', noi: 'apriamo', voi: 'aprite', loro: 'aprono' },
    tenses: {
      presenteIndicativo: { io: 'apro', tu: 'apri', 'lui/lei': 'apre', noi: 'apriamo', voi: 'aprite', loro: 'aprono' },
      passatoProssimo:    { io: 'ho aperto', tu: 'hai aperto', 'lui/lei': 'ha aperto', noi: 'abbiamo aperto', voi: 'avete aperto', loro: 'hanno aperto' },
      imperfetto:         { io: 'aprivo', tu: 'aprivi', 'lui/lei': 'apriva', noi: 'aprivamo', voi: 'aprivate', loro: 'aprivano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'aperto',
    example: { it: 'Apro la porta.', en: 'I open the door.' },
    examples: [
      { it: 'A che ora apre il negozio?', en: 'What time does the shop open?' },
      { it: 'Apri il libro a pagina dieci.', en: 'Open the book to page ten.' },
      { it: 'Non aprire quella scatola!', en: "Don't open that box!" }
    ]
  },
  {
    infinitive: 'chiudere', translation: 'to close', group: '-ere', difficulty: 1,
    conjugation: { io: 'chiudo', tu: 'chiudi', 'lui/lei': 'chiude', noi: 'chiudiamo', voi: 'chiudete', loro: 'chiudono' },
    tenses: {
      presenteIndicativo: { io: 'chiudo', tu: 'chiudi', 'lui/lei': 'chiude', noi: 'chiudiamo', voi: 'chiudete', loro: 'chiudono' },
      passatoProssimo:    { io: 'ho chiuso', tu: 'hai chiuso', 'lui/lei': 'ha chiuso', noi: 'abbiamo chiuso', voi: 'avete chiuso', loro: 'hanno chiuso' },
      imperfetto:         { io: 'chiudevo', tu: 'chiudevi', 'lui/lei': 'chiudeva', noi: 'chiudevamo', voi: 'chiudevate', loro: 'chiudevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'chiuso',
    example: { it: 'Chiudi la finestra!', en: 'Close the window!' },
    examples: [
      { it: 'Il negozio chiude alle otto.', en: 'The shop closes at eight.' },
      { it: 'Chiudiamo gli occhi e ascoltiamo.', en: "Let's close our eyes and listen." },
      { it: 'Hai chiuso la porta a chiave?', en: 'Did you lock the door?' }
    ]
  },
  {
    infinitive: 'vivere', translation: 'to live', group: '-ere', difficulty: 1,
    conjugation: { io: 'vivo', tu: 'vivi', 'lui/lei': 'vive', noi: 'viviamo', voi: 'vivete', loro: 'vivono' },
    tenses: {
      presenteIndicativo: { io: 'vivo', tu: 'vivi', 'lui/lei': 'vive', noi: 'viviamo', voi: 'vivete', loro: 'vivono' },
      passatoProssimo:    { io: 'ho vissuto', tu: 'hai vissuto', 'lui/lei': 'ha vissuto', noi: 'abbiamo vissuto', voi: 'avete vissuto', loro: 'hanno vissuto' },
      imperfetto:         { io: 'vivevo', tu: 'vivevi', 'lui/lei': 'viveva', noi: 'vivevamo', voi: 'vivevate', loro: 'vivevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'vissuto',
    example: { it: 'Vivo a Roma.', en: 'I live in Rome.' },
    examples: [
      { it: 'Dove vivi?', en: 'Where do you live?' },
      { it: 'Viviamo in Italia da due anni.', en: 'We have been living in Italy for two years.' },
      { it: 'Vivono vicino al mare.', en: 'They live near the sea.' }
    ]
  },
  {
    infinitive: 'sentire', translation: 'to hear / to feel', group: '-ire', difficulty: 1,
    conjugation: { io: 'sento', tu: 'senti', 'lui/lei': 'sente', noi: 'sentiamo', voi: 'sentite', loro: 'sentono' },
    tenses: {
      presenteIndicativo: { io: 'sento', tu: 'senti', 'lui/lei': 'sente', noi: 'sentiamo', voi: 'sentite', loro: 'sentono' },
      passatoProssimo:    { io: 'ho sentito', tu: 'hai sentito', 'lui/lei': 'ha sentito', noi: 'abbiamo sentito', voi: 'avete sentito', loro: 'hanno sentito' },
      imperfetto:         { io: 'sentivo', tu: 'sentivi', 'lui/lei': 'sentiva', noi: 'sentivamo', voi: 'sentivate', loro: 'sentivano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'sentito',
    example: { it: 'Sento la musica.', en: 'I hear the music.' },
    examples: [
      { it: 'Non mi sento bene.', en: "I don't feel well." },
      { it: 'Senti questo profumo!', en: 'Smell this fragrance!' },
      { it: 'Ci sentiamo domani.', en: "We'll talk (hear each other) tomorrow." }
    ]
  },
  {
    infinitive: 'pensare', translation: 'to think', group: '-are', difficulty: 1,
    conjugation: { io: 'penso', tu: 'pensi', 'lui/lei': 'pensa', noi: 'pensiamo', voi: 'pensate', loro: 'pensano' },
    tenses: {
      presenteIndicativo: { io: 'penso', tu: 'pensi', 'lui/lei': 'pensa', noi: 'pensiamo', voi: 'pensate', loro: 'pensano' },
      passatoProssimo:    { io: 'ho pensato', tu: 'hai pensato', 'lui/lei': 'ha pensato', noi: 'abbiamo pensato', voi: 'avete pensato', loro: 'hanno pensato' },
      imperfetto:         { io: 'pensavo', tu: 'pensavi', 'lui/lei': 'pensava', noi: 'pensavamo', voi: 'pensavate', loro: 'pensavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'pensato',
    example: { it: 'Penso a te.', en: 'I think about you.' },
    examples: [
      { it: 'Cosa pensi di questo libro?', en: 'What do you think of this book?' },
      { it: 'Penso di sì.', en: 'I think so.' },
      { it: 'Ci penso io.', en: "I'll take care of it." }
    ]
  },

  // ── A2 Verbs (difficulty: 2) ─────────────────────────────────────
  {
    infinitive: 'alzarsi', translation: 'to get up', group: 'reflexive', difficulty: 2,
    conjugation: { io: 'mi alzo', tu: 'ti alzi', 'lui/lei': 'si alza', noi: 'ci alziamo', voi: 'vi alzate', loro: 'si alzano' },
    tenses: {
      presenteIndicativo: { io: 'mi alzo', tu: 'ti alzi', 'lui/lei': 'si alza', noi: 'ci alziamo', voi: 'vi alzate', loro: 'si alzano' },
      passatoProssimo:    { io: 'mi sono alzato', tu: 'ti sei alzato', 'lui/lei': 'si è alzato', noi: 'ci siamo alzati', voi: 'vi siete alzati', loro: 'si sono alzati' },
      imperfetto:         { io: 'mi alzavo', tu: 'ti alzavi', 'lui/lei': 'si alzava', noi: 'ci alzavamo', voi: 'vi alzavate', loro: 'si alzavano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'alzato',
    example: { it: 'Mi alzo alle sette.', en: 'I get up at seven.' },
    examples: [
      { it: 'A che ora ti alzi?', en: 'What time do you get up?' },
      { it: 'Ieri mi sono alzato tardi.', en: 'Yesterday I got up late.' },
      { it: 'Da bambino mi alzavo sempre presto.', en: 'As a child I always got up early.' }
    ]
  },
  {
    infinitive: 'svegliarsi', translation: 'to wake up', group: 'reflexive', difficulty: 2,
    conjugation: { io: 'mi sveglio', tu: 'ti svegli', 'lui/lei': 'si sveglia', noi: 'ci svegliamo', voi: 'vi svegliate', loro: 'si svegliano' },
    tenses: {
      presenteIndicativo: { io: 'mi sveglio', tu: 'ti svegli', 'lui/lei': 'si sveglia', noi: 'ci svegliamo', voi: 'vi svegliate', loro: 'si svegliano' },
      passatoProssimo:    { io: 'mi sono svegliato', tu: 'ti sei svegliato', 'lui/lei': 'si è svegliato', noi: 'ci siamo svegliati', voi: 'vi siete svegliati', loro: 'si sono svegliati' },
      imperfetto:         { io: 'mi svegliavo', tu: 'ti svegliavi', 'lui/lei': 'si svegliava', noi: 'ci svegliavamo', voi: 'vi svegliavate', loro: 'si svegliavano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'svegliato',
    example: { it: 'Mi sveglio senza sveglia.', en: 'I wake up without an alarm.' },
    examples: [
      { it: 'Ti sei svegliato tardi?', en: 'Did you wake up late?' },
      { it: 'Si sveglia sempre di buon umore.', en: 'She always wakes up in a good mood.' },
      { it: 'Da piccolo mi svegliavo all\'alba.', en: 'As a child I used to wake up at dawn.' }
    ]
  },
  {
    infinitive: 'vestirsi', translation: 'to get dressed', group: 'reflexive', difficulty: 2,
    conjugation: { io: 'mi vesto', tu: 'ti vesti', 'lui/lei': 'si veste', noi: 'ci vestiamo', voi: 'vi vestite', loro: 'si vestono' },
    tenses: {
      presenteIndicativo: { io: 'mi vesto', tu: 'ti vesti', 'lui/lei': 'si veste', noi: 'ci vestiamo', voi: 'vi vestite', loro: 'si vestono' },
      passatoProssimo:    { io: 'mi sono vestito', tu: 'ti sei vestito', 'lui/lei': 'si è vestito', noi: 'ci siamo vestiti', voi: 'vi siete vestiti', loro: 'si sono vestiti' },
      imperfetto:         { io: 'mi vestivo', tu: 'ti vestivi', 'lui/lei': 'si vestiva', noi: 'ci vestivamo', voi: 'vi vestivate', loro: 'si vestivano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'vestito',
    example: { it: 'Mi vesto in fretta.', en: 'I get dressed quickly.' },
    examples: [
      { it: 'Come ti sei vestito stasera?', en: 'How did you get dressed tonight?' },
      { it: 'Si veste sempre con eleganza.', en: 'She always dresses elegantly.' },
      { it: 'Da bambina mi vestivo da sola.', en: 'As a child I used to dress myself.' }
    ]
  },
  {
    infinitive: 'lavarsi', translation: 'to wash oneself', group: 'reflexive', difficulty: 2,
    conjugation: { io: 'mi lavo', tu: 'ti lavi', 'lui/lei': 'si lava', noi: 'ci laviamo', voi: 'vi lavate', loro: 'si lavano' },
    tenses: {
      presenteIndicativo: { io: 'mi lavo', tu: 'ti lavi', 'lui/lei': 'si lava', noi: 'ci laviamo', voi: 'vi lavate', loro: 'si lavano' },
      passatoProssimo:    { io: 'mi sono lavato', tu: 'ti sei lavato', 'lui/lei': 'si è lavato', noi: 'ci siamo lavati', voi: 'vi siete lavati', loro: 'si sono lavati' },
      imperfetto:         { io: 'mi lavavo', tu: 'ti lavavi', 'lui/lei': 'si lavava', noi: 'ci lavavamo', voi: 'vi lavavate', loro: 'si lavavano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'lavato',
    example: { it: 'Mi lavo le mani prima di mangiare.', en: 'I wash my hands before eating.' },
    examples: [
      { it: 'Ti sei lavato i denti?', en: 'Did you brush your teeth?' },
      { it: 'Si lava ogni mattina sotto la doccia.', en: 'He showers every morning.' },
      { it: 'Da piccola mi lavavo sempre i capelli la sera.', en: 'As a child I always washed my hair in the evening.' }
    ]
  },
  {
    infinitive: 'chiedere', translation: 'to ask', group: '-ere', difficulty: 2,
    conjugation: { io: 'chiedo', tu: 'chiedi', 'lui/lei': 'chiede', noi: 'chiediamo', voi: 'chiedete', loro: 'chiedono' },
    tenses: {
      presenteIndicativo: { io: 'chiedo', tu: 'chiedi', 'lui/lei': 'chiede', noi: 'chiediamo', voi: 'chiedete', loro: 'chiedono' },
      passatoProssimo:    { io: 'ho chiesto', tu: 'hai chiesto', 'lui/lei': 'ha chiesto', noi: 'abbiamo chiesto', voi: 'avete chiesto', loro: 'hanno chiesto' },
      imperfetto:         { io: 'chiedevo', tu: 'chiedevi', 'lui/lei': 'chiedeva', noi: 'chiedevamo', voi: 'chiedevate', loro: 'chiedevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'chiesto',
    example: { it: 'Posso chiederti una cosa?', en: 'Can I ask you something?' },
    examples: [
      { it: 'Ho chiesto informazioni alla stazione.', en: 'I asked for information at the station.' },
      { it: 'Chiede sempre scusa quando sbaglia.', en: 'She always apologises when she makes a mistake.' },
      { it: 'Da studente chiedevo molte domande.', en: 'As a student I used to ask many questions.' }
    ]
  },
  {
    infinitive: 'rispondere', translation: 'to answer / to reply', group: '-ere', difficulty: 2,
    conjugation: { io: 'rispondo', tu: 'rispondi', 'lui/lei': 'risponde', noi: 'rispondiamo', voi: 'rispondete', loro: 'rispondono' },
    tenses: {
      presenteIndicativo: { io: 'rispondo', tu: 'rispondi', 'lui/lei': 'risponde', noi: 'rispondiamo', voi: 'rispondete', loro: 'rispondono' },
      passatoProssimo:    { io: 'ho risposto', tu: 'hai risposto', 'lui/lei': 'ha risposto', noi: 'abbiamo risposto', voi: 'avete risposto', loro: 'hanno risposto' },
      imperfetto:         { io: 'rispondevo', tu: 'rispondevi', 'lui/lei': 'rispondeva', noi: 'rispondevamo', voi: 'rispondevate', loro: 'rispondevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'risposto',
    example: { it: 'Non ha risposto al mio messaggio.', en: 'He did not reply to my message.' },
    examples: [
      { it: 'Rispondi al telefono!', en: 'Answer the phone!' },
      { it: 'Ho risposto a tutte le domande.', en: 'I answered all the questions.' },
      { it: 'Non rispondeva mai alle email.', en: 'He never used to reply to emails.' }
    ]
  },
  {
    infinitive: 'partire', translation: 'to leave / to depart', group: '-ire', difficulty: 2,
    conjugation: { io: 'parto', tu: 'parti', 'lui/lei': 'parte', noi: 'partiamo', voi: 'partite', loro: 'partono' },
    tenses: {
      presenteIndicativo: { io: 'parto', tu: 'parti', 'lui/lei': 'parte', noi: 'partiamo', voi: 'partite', loro: 'partono' },
      passatoProssimo:    { io: 'sono partito', tu: 'sei partito', 'lui/lei': 'è partito', noi: 'siamo partiti', voi: 'siete partiti', loro: 'sono partiti' },
      imperfetto:         { io: 'partivo', tu: 'partivi', 'lui/lei': 'partiva', noi: 'partivamo', voi: 'partivate', loro: 'partivano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'partito',
    example: { it: 'Partiamo domani mattina.', en: 'We leave tomorrow morning.' },
    examples: [
      { it: 'A che ora parte il treno?', en: 'What time does the train leave?' },
      { it: 'Sono partito senza salutare nessuno.', en: 'I left without saying goodbye to anyone.' },
      { it: 'Da giovane partiva spesso per l\'estero.', en: 'When she was young she often went abroad.' }
    ]
  },
  {
    infinitive: 'tornare', translation: 'to return / to come back', group: '-are', difficulty: 2,
    conjugation: { io: 'torno', tu: 'torni', 'lui/lei': 'torna', noi: 'torniamo', voi: 'tornate', loro: 'tornano' },
    tenses: {
      presenteIndicativo: { io: 'torno', tu: 'torni', 'lui/lei': 'torna', noi: 'torniamo', voi: 'tornate', loro: 'tornano' },
      passatoProssimo:    { io: 'sono tornato', tu: 'sei tornato', 'lui/lei': 'è tornato', noi: 'siamo tornati', voi: 'siete tornati', loro: 'sono tornati' },
      imperfetto:         { io: 'tornavo', tu: 'tornavi', 'lui/lei': 'tornava', noi: 'tornavamo', voi: 'tornavate', loro: 'tornavano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'tornato',
    example: { it: 'Torno a casa alle sei.', en: 'I come back home at six.' },
    examples: [
      { it: 'Quando torni dalle vacanze?', en: 'When do you come back from holiday?' },
      { it: 'Sono tornato ieri sera da Milano.', en: 'I came back from Milan yesterday evening.' },
      { it: 'Tornava sempre con un regalo.', en: 'He always used to come back with a gift.' }
    ]
  },
  {
    infinitive: 'uscire', translation: 'to go out', group: 'irregular', difficulty: 2,
    conjugation: { io: 'esco', tu: 'esci', 'lui/lei': 'esce', noi: 'usciamo', voi: 'uscite', loro: 'escono' },
    tenses: {
      presenteIndicativo: { io: 'esco', tu: 'esci', 'lui/lei': 'esce', noi: 'usciamo', voi: 'uscite', loro: 'escono' },
      passatoProssimo:    { io: 'sono uscito', tu: 'sei uscito', 'lui/lei': 'è uscito', noi: 'siamo usciti', voi: 'siete usciti', loro: 'sono usciti' },
      imperfetto:         { io: 'uscivo', tu: 'uscivi', 'lui/lei': 'usciva', noi: 'uscivamo', voi: 'uscivate', loro: 'uscivano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'uscito',
    example: { it: 'Esco con gli amici stasera.', en: 'I am going out with friends tonight.' },
    examples: [
      { it: 'A che ora esci dal lavoro?', en: 'What time do you finish work? (lit. go out from work)' },
      { it: 'Siamo usciti tardi ieri sera.', en: 'We went out late last night.' },
      { it: 'Usciva ogni venerdì con i colleghi.', en: 'She used to go out every Friday with colleagues.' }
    ]
  },
  {
    infinitive: 'conoscere', translation: 'to know (a person / place)', group: '-ere', difficulty: 2,
    conjugation: { io: 'conosco', tu: 'conosci', 'lui/lei': 'conosce', noi: 'conosciamo', voi: 'conoscete', loro: 'conoscono' },
    tenses: {
      presenteIndicativo: { io: 'conosco', tu: 'conosci', 'lui/lei': 'conosce', noi: 'conosciamo', voi: 'conoscete', loro: 'conoscono' },
      passatoProssimo:    { io: 'ho conosciuto', tu: 'hai conosciuto', 'lui/lei': 'ha conosciuto', noi: 'abbiamo conosciuto', voi: 'avete conosciuto', loro: 'hanno conosciuto' },
      imperfetto:         { io: 'conoscevo', tu: 'conoscevi', 'lui/lei': 'conosceva', noi: 'conoscevamo', voi: 'conoscevate', loro: 'conoscevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'conosciuto',
    example: { it: 'Conosci Marco?', en: 'Do you know Marco?' },
    examples: [
      { it: 'Ho conosciuto mia moglie all\'università.', en: 'I met my wife at university.' },
      { it: 'Conosce bene Roma — ci ha vissuto dieci anni.', en: 'She knows Rome well — she lived there ten years.' },
      { it: 'Non conoscevo nessuno alla festa.', en: 'I didn\'t know anyone at the party.' }
    ]
  },

  // ── Additional A1 verbs ───────────────────────────────────────────
  {
    infinitive: 'abitare', translation: 'to live / to reside', group: '-are', difficulty: 1,
    conjugation: { io: 'abito', tu: 'abiti', 'lui/lei': 'abita', noi: 'abitiamo', voi: 'abitate', loro: 'abitano' },
    tenses: {
      presenteIndicativo: { io: 'abito', tu: 'abiti', 'lui/lei': 'abita', noi: 'abitiamo', voi: 'abitate', loro: 'abitano' },
      passatoProssimo:    { io: 'ho abitato', tu: 'hai abitato', 'lui/lei': 'ha abitato', noi: 'abbiamo abitato', voi: 'avete abitato', loro: 'hanno abitato' },
      imperfetto:         { io: 'abitavo', tu: 'abitavi', 'lui/lei': 'abitava', noi: 'abitavamo', voi: 'abitavate', loro: 'abitavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'abitato',
    example: { it: 'Abito a Milano.', en: 'I live in Milan.' },
    examples: [
      { it: 'Dove abiti?', en: 'Where do you live?' },
      { it: 'Ho abitato a Roma per tre anni.', en: 'I lived in Rome for three years.' },
      { it: 'Abitavamo vicino al mare.', en: 'We used to live near the sea.' }
    ]
  },
  {
    infinitive: 'lavorare', translation: 'to work', group: '-are', difficulty: 1,
    conjugation: { io: 'lavoro', tu: 'lavori', 'lui/lei': 'lavora', noi: 'lavoriamo', voi: 'lavorate', loro: 'lavorano' },
    tenses: {
      presenteIndicativo: { io: 'lavoro', tu: 'lavori', 'lui/lei': 'lavora', noi: 'lavoriamo', voi: 'lavorate', loro: 'lavorano' },
      passatoProssimo:    { io: 'ho lavorato', tu: 'hai lavorato', 'lui/lei': 'ha lavorato', noi: 'abbiamo lavorato', voi: 'avete lavorato', loro: 'hanno lavorato' },
      imperfetto:         { io: 'lavoravo', tu: 'lavoravi', 'lui/lei': 'lavorava', noi: 'lavoravamo', voi: 'lavoravate', loro: 'lavoravano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'lavorato',
    example: { it: 'Lavoro in un ufficio.', en: 'I work in an office.' },
    examples: [
      { it: 'Lavori molto oggi?', en: 'Are you working a lot today?' },
      { it: 'Ha lavorato tutta la notte.', en: 'He worked all night.' },
      { it: 'Lavoravano insieme da anni.', en: 'They used to work together for years.' }
    ]
  },
  {
    infinitive: 'studiare', translation: 'to study', group: '-are', difficulty: 1,
    conjugation: { io: 'studio', tu: 'studi', 'lui/lei': 'studia', noi: 'studiamo', voi: 'studiate', loro: 'studiano' },
    tenses: {
      presenteIndicativo: { io: 'studio', tu: 'studi', 'lui/lei': 'studia', noi: 'studiamo', voi: 'studiate', loro: 'studiano' },
      passatoProssimo:    { io: 'ho studiato', tu: 'hai studiato', 'lui/lei': 'ha studiato', noi: 'abbiamo studiato', voi: 'avete studiato', loro: 'hanno studiato' },
      imperfetto:         { io: 'studiavo', tu: 'studiavi', 'lui/lei': 'studiava', noi: 'studiavamo', voi: 'studiavate', loro: 'studiavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'studiato',
    example: { it: 'Studio italiano ogni giorno.', en: 'I study Italian every day.' },
    examples: [
      { it: 'Studi medicina all\'università?', en: 'Are you studying medicine at university?' },
      { it: 'Abbiamo studiato tutta la notte.', en: 'We studied all night.' },
      { it: 'Studiava piano da bambina.', en: 'She used to study piano as a child.' }
    ]
  },
  {
    infinitive: 'giocare', translation: 'to play (a game / sport)', group: '-are', difficulty: 1,
    conjugation: { io: 'gioco', tu: 'giochi', 'lui/lei': 'gioca', noi: 'giochiamo', voi: 'giocate', loro: 'giocano' },
    tenses: {
      presenteIndicativo: { io: 'gioco', tu: 'giochi', 'lui/lei': 'gioca', noi: 'giochiamo', voi: 'giocate', loro: 'giocano' },
      passatoProssimo:    { io: 'ho giocato', tu: 'hai giocato', 'lui/lei': 'ha giocato', noi: 'abbiamo giocato', voi: 'avete giocato', loro: 'hanno giocato' },
      imperfetto:         { io: 'giocavo', tu: 'giocavi', 'lui/lei': 'giocava', noi: 'giocavamo', voi: 'giocavate', loro: 'giocavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'giocato',
    example: { it: 'Gioco a calcio il sabato.', en: 'I play football on Saturdays.' },
    examples: [
      { it: 'I bambini giocano in giardino.', en: 'The children are playing in the garden.' },
      { it: 'Abbiamo giocato a carte tutta la sera.', en: 'We played cards all evening.' },
      { it: 'Da piccolo giocava sempre fuori.', en: 'When he was little he always used to play outside.' }
    ]
  },
  {
    infinitive: 'cucinare', translation: 'to cook', group: '-are', difficulty: 1,
    conjugation: { io: 'cucino', tu: 'cucini', 'lui/lei': 'cucina', noi: 'cuciniamo', voi: 'cucinate', loro: 'cucinano' },
    tenses: {
      presenteIndicativo: { io: 'cucino', tu: 'cucini', 'lui/lei': 'cucina', noi: 'cuciniamo', voi: 'cucinate', loro: 'cucinano' },
      passatoProssimo:    { io: 'ho cucinato', tu: 'hai cucinato', 'lui/lei': 'ha cucinato', noi: 'abbiamo cucinato', voi: 'avete cucinato', loro: 'hanno cucinato' },
      imperfetto:         { io: 'cucinavo', tu: 'cucinavi', 'lui/lei': 'cucinava', noi: 'cucinavamo', voi: 'cucinavate', loro: 'cucinavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'cucinato',
    example: { it: 'Cucino la pasta stasera.', en: 'I am cooking pasta tonight.' },
    examples: [
      { it: 'Sa cucinare molto bene.', en: 'She can cook very well.' },
      { it: 'Ho cucinato per dieci persone.', en: 'I cooked for ten people.' },
      { it: 'Cucinava sempre piatti tradizionali.', en: 'He always used to cook traditional dishes.' }
    ]
  },
  {
    infinitive: 'comprare', translation: 'to buy', group: '-are', difficulty: 1,
    conjugation: { io: 'compro', tu: 'compri', 'lui/lei': 'compra', noi: 'compriamo', voi: 'comprate', loro: 'comprano' },
    tenses: {
      presenteIndicativo: { io: 'compro', tu: 'compri', 'lui/lei': 'compra', noi: 'compriamo', voi: 'comprate', loro: 'comprano' },
      passatoProssimo:    { io: 'ho comprato', tu: 'hai comprato', 'lui/lei': 'ha comprato', noi: 'abbiamo comprato', voi: 'avete comprato', loro: 'hanno comprato' },
      imperfetto:         { io: 'compravo', tu: 'compravi', 'lui/lei': 'comprava', noi: 'compravamo', voi: 'compravate', loro: 'compravano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'comprato',
    example: { it: 'Compro il pane ogni mattina.', en: 'I buy bread every morning.' },
    examples: [
      { it: 'Dove hai comprato quella borsa?', en: 'Where did you buy that bag?' },
      { it: 'Compravamo sempre frutta fresca al mercato.', en: 'We always used to buy fresh fruit at the market.' },
      { it: 'Compriamo i biglietti online.', en: 'We buy the tickets online.' }
    ]
  },
  {
    infinitive: 'guardare', translation: 'to watch / to look at', group: '-are', difficulty: 1,
    conjugation: { io: 'guardo', tu: 'guardi', 'lui/lei': 'guarda', noi: 'guardiamo', voi: 'guardate', loro: 'guardano' },
    tenses: {
      presenteIndicativo: { io: 'guardo', tu: 'guardi', 'lui/lei': 'guarda', noi: 'guardiamo', voi: 'guardate', loro: 'guardano' },
      passatoProssimo:    { io: 'ho guardato', tu: 'hai guardato', 'lui/lei': 'ha guardato', noi: 'abbiamo guardato', voi: 'avete guardato', loro: 'hanno guardato' },
      imperfetto:         { io: 'guardavo', tu: 'guardavi', 'lui/lei': 'guardava', noi: 'guardavamo', voi: 'guardavate', loro: 'guardavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'guardato',
    example: { it: 'Guardo la televisione la sera.', en: 'I watch television in the evening.' },
    examples: [
      { it: 'Hai guardato quel film?', en: 'Did you watch that film?' },
      { it: 'Guardano le stelle dal balcone.', en: 'They are watching the stars from the balcony.' },
      { it: 'Da bambino guardava i cartoni animati.', en: 'As a child he used to watch cartoons.' }
    ]
  },
  {
    infinitive: 'aspettare', translation: 'to wait (for)', group: '-are', difficulty: 1,
    conjugation: { io: 'aspetto', tu: 'aspetti', 'lui/lei': 'aspetta', noi: 'aspettiamo', voi: 'aspettate', loro: 'aspettano' },
    tenses: {
      presenteIndicativo: { io: 'aspetto', tu: 'aspetti', 'lui/lei': 'aspetta', noi: 'aspettiamo', voi: 'aspettate', loro: 'aspettano' },
      passatoProssimo:    { io: 'ho aspettato', tu: 'hai aspettato', 'lui/lei': 'ha aspettato', noi: 'abbiamo aspettato', voi: 'avete aspettato', loro: 'hanno aspettato' },
      imperfetto:         { io: 'aspettavo', tu: 'aspettavi', 'lui/lei': 'aspettava', noi: 'aspettavamo', voi: 'aspettavate', loro: 'aspettavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'aspettato',
    example: { it: 'Aspetto l\'autobus.', en: 'I am waiting for the bus.' },
    examples: [
      { it: 'Ho aspettato un\'ora!', en: 'I waited for an hour!' },
      { it: 'Aspettiamo notizie da ieri.', en: 'We have been waiting for news since yesterday.' },
      { it: 'Aspettava sempre fuori dalla scuola.', en: 'She always used to wait outside the school.' }
    ]
  },
  {
    infinitive: 'chiamare', translation: 'to call', group: '-are', difficulty: 1,
    conjugation: { io: 'chiamo', tu: 'chiami', 'lui/lei': 'chiama', noi: 'chiamiamo', voi: 'chiamate', loro: 'chiamano' },
    tenses: {
      presenteIndicativo: { io: 'chiamo', tu: 'chiami', 'lui/lei': 'chiama', noi: 'chiamiamo', voi: 'chiamate', loro: 'chiamano' },
      passatoProssimo:    { io: 'ho chiamato', tu: 'hai chiamato', 'lui/lei': 'ha chiamato', noi: 'abbiamo chiamato', voi: 'avete chiamato', loro: 'hanno chiamato' },
      imperfetto:         { io: 'chiamavo', tu: 'chiamavi', 'lui/lei': 'chiamava', noi: 'chiamavamo', voi: 'chiamavate', loro: 'chiamavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'chiamato',
    example: { it: 'Ti chiamo più tardi.', en: 'I will call you later.' },
    examples: [
      { it: 'Ha chiamato tre volte senza risposta.', en: 'He called three times with no answer.' },
      { it: 'Come ti chiami?', en: 'What is your name? (lit. What do you call yourself?)' },
      { it: 'Chiamava ogni domenica.', en: 'She used to call every Sunday.' }
    ]
  },
  {
    infinitive: 'trovare', translation: 'to find', group: '-are', difficulty: 1,
    conjugation: { io: 'trovo', tu: 'trovi', 'lui/lei': 'trova', noi: 'troviamo', voi: 'trovate', loro: 'trovano' },
    tenses: {
      presenteIndicativo: { io: 'trovo', tu: 'trovi', 'lui/lei': 'trova', noi: 'troviamo', voi: 'trovate', loro: 'trovano' },
      passatoProssimo:    { io: 'ho trovato', tu: 'hai trovato', 'lui/lei': 'ha trovato', noi: 'abbiamo trovato', voi: 'avete trovato', loro: 'hanno trovato' },
      imperfetto:         { io: 'trovavo', tu: 'trovavi', 'lui/lei': 'trovava', noi: 'trovavamo', voi: 'trovavate', loro: 'trovavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'trovato',
    example: { it: 'Non trovo le chiavi.', en: 'I cannot find the keys.' },
    examples: [
      { it: 'Hai trovato un lavoro?', en: 'Have you found a job?' },
      { it: 'Trovo questa città molto bella.', en: 'I find this city very beautiful.' },
      { it: 'Non trovava mai un parcheggio.', en: 'He could never find a parking space.' }
    ]
  },
  {
    infinitive: 'portare', translation: 'to bring / to carry / to wear', group: '-are', difficulty: 1,
    conjugation: { io: 'porto', tu: 'porti', 'lui/lei': 'porta', noi: 'portiamo', voi: 'portate', loro: 'portano' },
    tenses: {
      presenteIndicativo: { io: 'porto', tu: 'porti', 'lui/lei': 'porta', noi: 'portiamo', voi: 'portate', loro: 'portano' },
      passatoProssimo:    { io: 'ho portato', tu: 'hai portato', 'lui/lei': 'ha portato', noi: 'abbiamo portato', voi: 'avete portato', loro: 'hanno portato' },
      imperfetto:         { io: 'portavo', tu: 'portavi', 'lui/lei': 'portava', noi: 'portavamo', voi: 'portavate', loro: 'portavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'portato',
    example: { it: 'Porto sempre un ombrello.', en: 'I always carry an umbrella.' },
    examples: [
      { it: 'Puoi portare il vino stasera?', en: 'Can you bring the wine tonight?' },
      { it: 'Ho portato i bambini a scuola.', en: 'I took the children to school.' },
      { it: 'Portava sempre cappello.', en: 'He always used to wear a hat.' }
    ]
  },
  {
    infinitive: 'usare', translation: 'to use', group: '-are', difficulty: 1,
    conjugation: { io: 'uso', tu: 'usi', 'lui/lei': 'usa', noi: 'usiamo', voi: 'usate', loro: 'usano' },
    tenses: {
      presenteIndicativo: { io: 'uso', tu: 'usi', 'lui/lei': 'usa', noi: 'usiamo', voi: 'usate', loro: 'usano' },
      passatoProssimo:    { io: 'ho usato', tu: 'hai usato', 'lui/lei': 'ha usato', noi: 'abbiamo usato', voi: 'avete usato', loro: 'hanno usato' },
      imperfetto:         { io: 'usavo', tu: 'usavi', 'lui/lei': 'usava', noi: 'usavamo', voi: 'usavate', loro: 'usavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'usato',
    example: { it: 'Uso il telefono per tutto.', en: 'I use my phone for everything.' },
    examples: [
      { it: 'Usi spesso la bicicletta?', en: 'Do you often use your bicycle?' },
      { it: 'Non ho usato questa parola prima.', en: 'I have not used this word before.' },
      { it: 'Usavano la macchina ogni giorno.', en: 'They used to use the car every day.' }
    ]
  },
  {
    infinitive: 'entrare', translation: 'to enter / to come in', group: '-are', difficulty: 1,
    conjugation: { io: 'entro', tu: 'entri', 'lui/lei': 'entra', noi: 'entriamo', voi: 'entrate', loro: 'entrano' },
    tenses: {
      presenteIndicativo: { io: 'entro', tu: 'entri', 'lui/lei': 'entra', noi: 'entriamo', voi: 'entrate', loro: 'entrano' },
      passatoProssimo:    { io: 'sono entrato', tu: 'sei entrato', 'lui/lei': 'è entrato', noi: 'siamo entrati', voi: 'siete entrati', loro: 'sono entrati' },
      imperfetto:         { io: 'entravo', tu: 'entravi', 'lui/lei': 'entrava', noi: 'entravamo', voi: 'entravate', loro: 'entravano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'entrato',
    example: { it: 'Entrate pure!', en: 'Do come in!' },
    examples: [
      { it: 'È entrata senza bussare.', en: 'She came in without knocking.' },
      { it: 'Non entro mai in quel negozio.', en: 'I never go into that shop.' },
      { it: 'Entrava sempre dalla porta sul retro.', en: 'He always used to come in through the back door.' }
    ]
  },
  {
    infinitive: 'incontrare', translation: 'to meet / to run into', group: '-are', difficulty: 1,
    conjugation: { io: 'incontro', tu: 'incontri', 'lui/lei': 'incontra', noi: 'incontriamo', voi: 'incontrate', loro: 'incontrano' },
    tenses: {
      presenteIndicativo: { io: 'incontro', tu: 'incontri', 'lui/lei': 'incontra', noi: 'incontriamo', voi: 'incontrate', loro: 'incontrano' },
      passatoProssimo:    { io: 'ho incontrato', tu: 'hai incontrato', 'lui/lei': 'ha incontrato', noi: 'abbiamo incontrato', voi: 'avete incontrato', loro: 'hanno incontrato' },
      imperfetto:         { io: 'incontravo', tu: 'incontravi', 'lui/lei': 'incontrava', noi: 'incontravamo', voi: 'incontravate', loro: 'incontravano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'incontrato',
    example: { it: 'Incontro Marco al bar.', en: 'I am meeting Marco at the café.' },
    examples: [
      { it: 'Ho incontrato un vecchio amico per strada.', en: 'I ran into an old friend in the street.' },
      { it: 'Ci incontriamo ogni settimana.', en: 'We meet every week.' },
      { it: 'La incontravo spesso al supermercato.', en: 'I used to run into her often at the supermarket.' }
    ]
  },
  {
    infinitive: 'ricordare', translation: 'to remember', group: '-are', difficulty: 1,
    conjugation: { io: 'ricordo', tu: 'ricordi', 'lui/lei': 'ricorda', noi: 'ricordiamo', voi: 'ricordate', loro: 'ricordano' },
    tenses: {
      presenteIndicativo: { io: 'ricordo', tu: 'ricordi', 'lui/lei': 'ricorda', noi: 'ricordiamo', voi: 'ricordate', loro: 'ricordano' },
      passatoProssimo:    { io: 'ho ricordato', tu: 'hai ricordato', 'lui/lei': 'ha ricordato', noi: 'abbiamo ricordato', voi: 'avete ricordato', loro: 'hanno ricordato' },
      imperfetto:         { io: 'ricordavo', tu: 'ricordavi', 'lui/lei': 'ricordava', noi: 'ricordavamo', voi: 'ricordavate', loro: 'ricordavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'ricordato',
    example: { it: 'Ricordo bene quel giorno.', en: 'I remember that day well.' },
    examples: [
      { it: 'Non ricordi il mio nome?', en: 'Don\'t you remember my name?' },
      { it: 'Ho ricordato all\'ultimo momento.', en: 'I remembered at the last moment.' },
      { it: 'Ricordava tutto nei minimi dettagli.', en: 'She used to remember everything in minute detail.' }
    ]
  },
  {
    infinitive: 'pensare', translation: 'to think', group: '-are', difficulty: 1,
    conjugation: { io: 'penso', tu: 'pensi', 'lui/lei': 'pensa', noi: 'pensiamo', voi: 'pensate', loro: 'pensano' },
    tenses: {
      presenteIndicativo: { io: 'penso', tu: 'pensi', 'lui/lei': 'pensa', noi: 'pensiamo', voi: 'pensate', loro: 'pensano' },
      passatoProssimo:    { io: 'ho pensato', tu: 'hai pensato', 'lui/lei': 'ha pensato', noi: 'abbiamo pensato', voi: 'avete pensato', loro: 'hanno pensato' },
      imperfetto:         { io: 'pensavo', tu: 'pensavi', 'lui/lei': 'pensava', noi: 'pensavamo', voi: 'pensavate', loro: 'pensavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'pensato',
    example: { it: 'Penso che sia tardi.', en: 'I think it is late.' },
    examples: [
      { it: 'Ci penso su.', en: 'I will think about it.' },
      { it: 'Ho pensato tanto a quella conversazione.', en: 'I thought a lot about that conversation.' },
      { it: 'Pensava sempre agli altri prima di sé.', en: 'She always used to think of others before herself.' }
    ]
  },
  {
    infinitive: 'camminare', translation: 'to walk', group: '-are', difficulty: 1,
    conjugation: { io: 'cammino', tu: 'cammini', 'lui/lei': 'cammina', noi: 'camminiamo', voi: 'camminate', loro: 'camminano' },
    tenses: {
      presenteIndicativo: { io: 'cammino', tu: 'cammini', 'lui/lei': 'cammina', noi: 'camminiamo', voi: 'camminate', loro: 'camminano' },
      passatoProssimo:    { io: 'ho camminato', tu: 'hai camminato', 'lui/lei': 'ha camminato', noi: 'abbiamo camminato', voi: 'avete camminato', loro: 'hanno camminato' },
      imperfetto:         { io: 'camminavo', tu: 'camminavi', 'lui/lei': 'camminava', noi: 'camminavamo', voi: 'camminavate', loro: 'camminavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'camminato',
    example: { it: 'Cammino un\'ora ogni giorno.', en: 'I walk for an hour every day.' },
    examples: [
      { it: 'Camminiamo fino al parco?', en: 'Shall we walk to the park?' },
      { it: 'Ho camminato per tutta la città.', en: 'I walked all over the city.' },
      { it: 'Camminava sempre a passo lento.', en: 'He always used to walk at a slow pace.' }
    ]
  },
  {
    infinitive: 'dormire', translation: 'to sleep', group: '-ire', difficulty: 1,
    conjugation: { io: 'dormo', tu: 'dormi', 'lui/lei': 'dorme', noi: 'dormiamo', voi: 'dormite', loro: 'dormono' },
    tenses: {
      presenteIndicativo: { io: 'dormo', tu: 'dormi', 'lui/lei': 'dorme', noi: 'dormiamo', voi: 'dormite', loro: 'dormono' },
      passatoProssimo:    { io: 'ho dormito', tu: 'hai dormito', 'lui/lei': 'ha dormito', noi: 'abbiamo dormito', voi: 'avete dormito', loro: 'hanno dormito' },
      imperfetto:         { io: 'dormivo', tu: 'dormivi', 'lui/lei': 'dormiva', noi: 'dormivamo', voi: 'dormivate', loro: 'dormivano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'dormito',
    example: { it: 'Dormo otto ore ogni notte.', en: 'I sleep eight hours every night.' },
    examples: [
      { it: 'Hai dormito bene?', en: 'Did you sleep well?' },
      { it: 'Ho dormito male per via del caldo.', en: 'I slept badly because of the heat.' },
      { it: 'Da bambino dormiva con la luce accesa.', en: 'As a child he used to sleep with the light on.' }
    ]
  },
  {
    infinitive: 'aprire', translation: 'to open', group: '-ire', difficulty: 1,
    conjugation: { io: 'apro', tu: 'apri', 'lui/lei': 'apre', noi: 'apriamo', voi: 'aprite', loro: 'aprono' },
    tenses: {
      presenteIndicativo: { io: 'apro', tu: 'apri', 'lui/lei': 'apre', noi: 'apriamo', voi: 'aprite', loro: 'aprono' },
      passatoProssimo:    { io: 'ho aperto', tu: 'hai aperto', 'lui/lei': 'ha aperto', noi: 'abbiamo aperto', voi: 'avete aperto', loro: 'hanno aperto' },
      imperfetto:         { io: 'aprivo', tu: 'aprivi', 'lui/lei': 'apriva', noi: 'aprivamo', voi: 'aprivate', loro: 'aprivano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'aperto',
    example: { it: 'Apri la finestra, per favore.', en: 'Please open the window.' },
    examples: [
      { it: 'Ho aperto la porta e sono entrato.', en: 'I opened the door and went in.' },
      { it: 'Il negozio apre alle nove.', en: 'The shop opens at nine.' },
      { it: 'Apriva sempre le finestre la mattina.', en: 'She always used to open the windows in the morning.' }
    ]
  },
  {
    infinitive: 'sentire', translation: 'to hear / to feel / to smell', group: '-ire', difficulty: 1,
    conjugation: { io: 'sento', tu: 'senti', 'lui/lei': 'sente', noi: 'sentiamo', voi: 'sentite', loro: 'sentono' },
    tenses: {
      presenteIndicativo: { io: 'sento', tu: 'senti', 'lui/lei': 'sente', noi: 'sentiamo', voi: 'sentite', loro: 'sentono' },
      passatoProssimo:    { io: 'ho sentito', tu: 'hai sentito', 'lui/lei': 'ha sentito', noi: 'abbiamo sentito', voi: 'avete sentito', loro: 'hanno sentito' },
      imperfetto:         { io: 'sentivo', tu: 'sentivi', 'lui/lei': 'sentiva', noi: 'sentivamo', voi: 'sentivate', loro: 'sentivano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'sentito',
    example: { it: 'Sento musica dal piano di sopra.', en: 'I can hear music from upstairs.' },
    examples: [
      { it: 'Hai sentito le notizie?', en: 'Have you heard the news?' },
      { it: 'Sento freddo — puoi chiudere la finestra?', en: 'I feel cold — can you close the window?' },
      { it: 'Sentiva la mancanza della famiglia.', en: 'She used to miss her family.' }
    ]
  },

  // ── Additional A2 verbs ───────────────────────────────────────────
  {
    infinitive: 'decidere', translation: 'to decide', group: '-ere', difficulty: 2,
    conjugation: { io: 'decido', tu: 'decidi', 'lui/lei': 'decide', noi: 'decidiamo', voi: 'decidete', loro: 'decidono' },
    tenses: {
      presenteIndicativo: { io: 'decido', tu: 'decidi', 'lui/lei': 'decide', noi: 'decidiamo', voi: 'decidete', loro: 'decidono' },
      passatoProssimo:    { io: 'ho deciso', tu: 'hai deciso', 'lui/lei': 'ha deciso', noi: 'abbiamo deciso', voi: 'avete deciso', loro: 'hanno deciso' },
      imperfetto:         { io: 'decidevo', tu: 'decidevi', 'lui/lei': 'decideva', noi: 'decidevamo', voi: 'decidevate', loro: 'decidevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'deciso',
    example: { it: 'Decido io.', en: 'I will decide.' },
    examples: [
      { it: 'Abbiamo deciso di partire domani.', en: 'We have decided to leave tomorrow.' },
      { it: 'Non riesce mai a decidere.', en: 'She can never decide.' },
      { it: 'Decideva sempre all\'ultimo momento.', en: 'He always used to decide at the last moment.' }
    ]
  },
  {
    infinitive: 'spiegare', translation: 'to explain', group: '-are', difficulty: 2,
    conjugation: { io: 'spiego', tu: 'spieghi', 'lui/lei': 'spiega', noi: 'spieghiamo', voi: 'spiegate', loro: 'spiegano' },
    tenses: {
      presenteIndicativo: { io: 'spiego', tu: 'spieghi', 'lui/lei': 'spiega', noi: 'spieghiamo', voi: 'spiegate', loro: 'spiegano' },
      passatoProssimo:    { io: 'ho spiegato', tu: 'hai spiegato', 'lui/lei': 'ha spiegato', noi: 'abbiamo spiegato', voi: 'avete spiegato', loro: 'hanno spiegato' },
      imperfetto:         { io: 'spiegavo', tu: 'spiegavi', 'lui/lei': 'spiegava', noi: 'spiegavamo', voi: 'spiegavate', loro: 'spiegavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'spiegato',
    example: { it: 'Puoi spiegare ancora?', en: 'Can you explain again?' },
    examples: [
      { it: 'L\'insegnante ha spiegato la grammatica.', en: 'The teacher explained the grammar.' },
      { it: 'Spiego sempre con degli esempi.', en: 'I always explain with examples.' },
      { it: 'Spiegava le regole con molta pazienza.', en: 'She used to explain the rules with great patience.' }
    ]
  },
  {
    infinitive: 'cambiare', translation: 'to change', group: '-are', difficulty: 2,
    conjugation: { io: 'cambio', tu: 'cambi', 'lui/lei': 'cambia', noi: 'cambiamo', voi: 'cambiate', loro: 'cambiano' },
    tenses: {
      presenteIndicativo: { io: 'cambio', tu: 'cambi', 'lui/lei': 'cambia', noi: 'cambiamo', voi: 'cambiate', loro: 'cambiano' },
      passatoProssimo:    { io: 'ho cambiato', tu: 'hai cambiato', 'lui/lei': 'ha cambiato', noi: 'abbiamo cambiato', voi: 'avete cambiato', loro: 'hanno cambiato' },
      imperfetto:         { io: 'cambiavo', tu: 'cambiavi', 'lui/lei': 'cambiava', noi: 'cambiavamo', voi: 'cambiavate', loro: 'cambiavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'cambiato',
    example: { it: 'Devo cambiare treno a Milano.', en: 'I have to change trains in Milan.' },
    examples: [
      { it: 'Hai cambiato lavoro di recente?', en: 'Have you changed jobs recently?' },
      { it: 'Il tempo è cambiato all\'improvviso.', en: 'The weather changed suddenly.' },
      { it: 'Cambiava idea ogni giorno.', en: 'He used to change his mind every day.' }
    ]
  },
  {
    infinitive: 'aiutare', translation: 'to help', group: '-are', difficulty: 2,
    conjugation: { io: 'aiuto', tu: 'aiuti', 'lui/lei': 'aiuta', noi: 'aiutiamo', voi: 'aiutate', loro: 'aiutano' },
    tenses: {
      presenteIndicativo: { io: 'aiuto', tu: 'aiuti', 'lui/lei': 'aiuta', noi: 'aiutiamo', voi: 'aiutate', loro: 'aiutano' },
      passatoProssimo:    { io: 'ho aiutato', tu: 'hai aiutato', 'lui/lei': 'ha aiutato', noi: 'abbiamo aiutato', voi: 'avete aiutato', loro: 'hanno aiutato' },
      imperfetto:         { io: 'aiutavo', tu: 'aiutavi', 'lui/lei': 'aiutava', noi: 'aiutavamo', voi: 'aiutavate', loro: 'aiutavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'aiutato',
    example: { it: 'Ti aiuto con i bagagli.', en: 'I will help you with the luggage.' },
    examples: [
      { it: 'Mi hai aiutato tantissimo.', en: 'You helped me so much.' },
      { it: 'Aiutate sempre i colleghi?', en: 'Do you always help your colleagues?' },
      { it: 'Aiutava i vicini quando ne avevano bisogno.', en: 'She used to help the neighbours when they needed it.' }
    ]
  },
  {
    infinitive: 'smettere', translation: 'to stop (doing something)', group: '-ere', difficulty: 2,
    conjugation: { io: 'smetto', tu: 'smetti', 'lui/lei': 'smette', noi: 'smettiamo', voi: 'smettete', loro: 'smettono' },
    tenses: {
      presenteIndicativo: { io: 'smetto', tu: 'smetti', 'lui/lei': 'smette', noi: 'smettiamo', voi: 'smettete', loro: 'smettono' },
      passatoProssimo:    { io: 'ho smesso', tu: 'hai smesso', 'lui/lei': 'ha smesso', noi: 'abbiamo smesso', voi: 'avete smesso', loro: 'hanno smesso' },
      imperfetto:         { io: 'smettevo', tu: 'smettevi', 'lui/lei': 'smetteva', noi: 'smettevamo', voi: 'smettevate', loro: 'smettevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'smesso',
    example: { it: 'Smettila di ridere!', en: 'Stop laughing!' },
    examples: [
      { it: 'Ha smesso di fumare l\'anno scorso.', en: 'He stopped smoking last year.' },
      { it: 'Quando smetti di lavorare?', en: 'When do you stop working?' },
      { it: 'Non smetteva mai di parlare.', en: 'She never used to stop talking.' }
    ]
  },
  {
    infinitive: 'continuare', translation: 'to continue / to keep on', group: '-are', difficulty: 2,
    conjugation: { io: 'continuo', tu: 'continui', 'lui/lei': 'continua', noi: 'continuiamo', voi: 'continuate', loro: 'continuano' },
    tenses: {
      presenteIndicativo: { io: 'continuo', tu: 'continui', 'lui/lei': 'continua', noi: 'continuiamo', voi: 'continuate', loro: 'continuano' },
      passatoProssimo:    { io: 'ho continuato', tu: 'hai continuato', 'lui/lei': 'ha continuato', noi: 'abbiamo continuato', voi: 'avete continuato', loro: 'hanno continuato' },
      imperfetto:         { io: 'continuavo', tu: 'continuavi', 'lui/lei': 'continuava', noi: 'continuavamo', voi: 'continuavate', loro: 'continuavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'continuato',
    example: { it: 'Continua a studiare!', en: 'Keep studying!' },
    examples: [
      { it: 'Abbiamo continuato a camminare nonostante la pioggia.', en: 'We kept walking despite the rain.' },
      { it: 'Continua il mal di testa?', en: 'Does the headache continue?' },
      { it: 'Continuava a telefonare anche di notte.', en: 'He used to keep calling even at night.' }
    ]
  },
  {
    infinitive: 'sperare', translation: 'to hope', group: '-are', difficulty: 2,
    conjugation: { io: 'spero', tu: 'speri', 'lui/lei': 'spera', noi: 'speriamo', voi: 'sperate', loro: 'sperano' },
    tenses: {
      presenteIndicativo: { io: 'spero', tu: 'speri', 'lui/lei': 'spera', noi: 'speriamo', voi: 'sperate', loro: 'sperano' },
      passatoProssimo:    { io: 'ho sperato', tu: 'hai sperato', 'lui/lei': 'ha sperato', noi: 'abbiamo sperato', voi: 'avete sperato', loro: 'hanno sperato' },
      imperfetto:         { io: 'speravo', tu: 'speravi', 'lui/lei': 'sperava', noi: 'speravamo', voi: 'speravate', loro: 'speravano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'sperato',
    example: { it: 'Spero che tu stia bene.', en: 'I hope you are well.' },
    examples: [
      { it: 'Speravamo in una risposta positiva.', en: 'We were hoping for a positive response.' },
      { it: 'Ho sperato fino all\'ultimo.', en: 'I hoped until the very end.' },
      { it: 'Sperava di tornare presto.', en: 'She used to hope to come back soon.' }
    ]
  },
  {
    infinitive: 'provare', translation: 'to try / to test / to feel', group: '-are', difficulty: 2,
    conjugation: { io: 'provo', tu: 'provi', 'lui/lei': 'prova', noi: 'proviamo', voi: 'provate', loro: 'provano' },
    tenses: {
      presenteIndicativo: { io: 'provo', tu: 'provi', 'lui/lei': 'prova', noi: 'proviamo', voi: 'provate', loro: 'provano' },
      passatoProssimo:    { io: 'ho provato', tu: 'hai provato', 'lui/lei': 'ha provato', noi: 'abbiamo provato', voi: 'avete provato', loro: 'hanno provato' },
      imperfetto:         { io: 'provavo', tu: 'provavi', 'lui/lei': 'provava', noi: 'provavamo', voi: 'provavate', loro: 'provavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'provato',
    example: { it: 'Prova questo piatto!', en: 'Try this dish!' },
    examples: [
      { it: 'Ho provato a chiamare ma non rispondeva.', en: 'I tried to call but there was no answer.' },
      { it: 'Provi pure la giacca.', en: 'Do try the jacket on.' },
      { it: 'Provava nuove ricette ogni weekend.', en: 'She used to try new recipes every weekend.' }
    ]
  },
  {
    infinitive: 'dimenticare', translation: 'to forget', group: '-are', difficulty: 2,
    conjugation: { io: 'dimentico', tu: 'dimentichi', 'lui/lei': 'dimentica', noi: 'dimentichiamo', voi: 'dimenticate', loro: 'dimenticano' },
    tenses: {
      presenteIndicativo: { io: 'dimentico', tu: 'dimentichi', 'lui/lei': 'dimentica', noi: 'dimentichiamo', voi: 'dimenticate', loro: 'dimenticano' },
      passatoProssimo:    { io: 'ho dimenticato', tu: 'hai dimenticato', 'lui/lei': 'ha dimenticato', noi: 'abbiamo dimenticato', voi: 'avete dimenticato', loro: 'hanno dimenticato' },
      imperfetto:         { io: 'dimenticavo', tu: 'dimenticavi', 'lui/lei': 'dimenticava', noi: 'dimenticavamo', voi: 'dimenticavate', loro: 'dimenticavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'dimenticato',
    example: { it: 'Ho dimenticato le chiavi a casa.', en: 'I forgot my keys at home.' },
    examples: [
      { it: 'Non dimentico mai un volto.', en: 'I never forget a face.' },
      { it: 'Ti sei dimenticato dell\'appuntamento?', en: 'Did you forget about the appointment?' },
      { it: 'Dimenticava sempre di portare l\'ombrello.', en: 'He always used to forget to bring his umbrella.' }
    ]
  },
  {
    infinitive: 'diventare', translation: 'to become', group: '-are', difficulty: 2,
    conjugation: { io: 'divento', tu: 'diventi', 'lui/lei': 'diventa', noi: 'diventiamo', voi: 'diventate', loro: 'diventano' },
    tenses: {
      presenteIndicativo: { io: 'divento', tu: 'diventi', 'lui/lei': 'diventa', noi: 'diventiamo', voi: 'diventate', loro: 'diventano' },
      passatoProssimo:    { io: 'sono diventato', tu: 'sei diventato', 'lui/lei': 'è diventato', noi: 'siamo diventati', voi: 'siete diventati', loro: 'sono diventati' },
      imperfetto:         { io: 'diventavo', tu: 'diventavi', 'lui/lei': 'diventava', noi: 'diventavamo', voi: 'diventavate', loro: 'diventavano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'diventato',
    example: { it: 'Vuole diventare medico.', en: 'He wants to become a doctor.' },
    examples: [
      { it: 'È diventata insegnante dopo l\'università.', en: 'She became a teacher after university.' },
      { it: 'Il tempo sta diventando brutto.', en: 'The weather is becoming bad.' },
      { it: 'Diventava sempre più bravo con la chitarra.', en: 'He kept getting better at guitar.' }
    ]
  },
  {
    infinitive: 'lasciare', translation: 'to leave (behind) / to let', group: '-are', difficulty: 2,
    conjugation: { io: 'lascio', tu: 'lasci', 'lui/lei': 'lascia', noi: 'lasciamo', voi: 'lasciate', loro: 'lasciano' },
    tenses: {
      presenteIndicativo: { io: 'lascio', tu: 'lasci', 'lui/lei': 'lascia', noi: 'lasciamo', voi: 'lasciate', loro: 'lasciano' },
      passatoProssimo:    { io: 'ho lasciato', tu: 'hai lasciato', 'lui/lei': 'ha lasciato', noi: 'abbiamo lasciato', voi: 'avete lasciato', loro: 'hanno lasciato' },
      imperfetto:         { io: 'lasciavo', tu: 'lasciavi', 'lui/lei': 'lasciava', noi: 'lasciavamo', voi: 'lasciavate', loro: 'lasciavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'lasciato',
    example: { it: 'Lascia un messaggio.', en: 'Leave a message.' },
    examples: [
      { it: 'Ho lasciato la borsa in ufficio.', en: 'I left my bag at the office.' },
      { it: 'Lasciami spiegare.', en: 'Let me explain.' },
      { it: 'Lasciava sempre tutto in disordine.', en: 'She always used to leave everything in a mess.' }
    ]
  },
  {
    infinitive: 'vivere', translation: 'to live / to be alive', group: '-ere', difficulty: 2,
    conjugation: { io: 'vivo', tu: 'vivi', 'lui/lei': 'vive', noi: 'viviamo', voi: 'vivete', loro: 'vivono' },
    tenses: {
      presenteIndicativo: { io: 'vivo', tu: 'vivi', 'lui/lei': 'vive', noi: 'viviamo', voi: 'vivete', loro: 'vivono' },
      passatoProssimo:    { io: 'ho vissuto', tu: 'hai vissuto', 'lui/lei': 'ha vissuto', noi: 'abbiamo vissuto', voi: 'avete vissuto', loro: 'hanno vissuto' },
      imperfetto:         { io: 'vivevo', tu: 'vivevi', 'lui/lei': 'viveva', noi: 'vivevamo', voi: 'vivevate', loro: 'vivevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'vissuto',
    example: { it: 'Vivo in Italia da due anni.', en: 'I have been living in Italy for two years.' },
    examples: [
      { it: 'Ha vissuto a Parigi per dieci anni.', en: 'She lived in Paris for ten years.' },
      { it: 'Vivono in campagna.', en: 'They live in the countryside.' },
      { it: 'Viveva da solo dopo il divorzio.', en: 'He used to live alone after the divorce.' }
    ]
  },
  {
    infinitive: 'perdere', translation: 'to lose / to miss (a train)', group: '-ere', difficulty: 2,
    conjugation: { io: 'perdo', tu: 'perdi', 'lui/lei': 'perde', noi: 'perdiamo', voi: 'perdete', loro: 'perdono' },
    tenses: {
      presenteIndicativo: { io: 'perdo', tu: 'perdi', 'lui/lei': 'perde', noi: 'perdiamo', voi: 'perdete', loro: 'perdono' },
      passatoProssimo:    { io: 'ho perso', tu: 'hai perso', 'lui/lei': 'ha perso', noi: 'abbiamo perso', voi: 'avete perso', loro: 'hanno perso' },
      imperfetto:         { io: 'perdevo', tu: 'perdevi', 'lui/lei': 'perdeva', noi: 'perdevamo', voi: 'perdevate', loro: 'perdevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'perso',
    example: { it: 'Ho perso il treno.', en: 'I missed the train.' },
    examples: [
      { it: 'Non perdere il portafoglio!', en: 'Don\'t lose your wallet!' },
      { it: 'La squadra ha perso la partita.', en: 'The team lost the match.' },
      { it: 'Perdeva sempre le chiavi.', en: 'She always used to lose her keys.' }
    ]
  },
  {
    infinitive: 'scegliere', translation: 'to choose', group: 'irregular', difficulty: 2,
    conjugation: { io: 'scelgo', tu: 'scegli', 'lui/lei': 'sceglie', noi: 'scegliamo', voi: 'scegliete', loro: 'scelgono' },
    tenses: {
      presenteIndicativo: { io: 'scelgo', tu: 'scegli', 'lui/lei': 'sceglie', noi: 'scegliamo', voi: 'scegliete', loro: 'scelgono' },
      passatoProssimo:    { io: 'ho scelto', tu: 'hai scelto', 'lui/lei': 'ha scelto', noi: 'abbiamo scelto', voi: 'avete scelto', loro: 'hanno scelto' },
      imperfetto:         { io: 'sceglievo', tu: 'sceglievi', 'lui/lei': 'sceglieva', noi: 'scegliavamo', voi: 'scegliavate', loro: 'sceglievano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'scelto',
    example: { it: 'Scelgo sempre il posto vicino al finestrino.', en: 'I always choose the window seat.' },
    examples: [
      { it: 'Hai scelto cosa mangiare?', en: 'Have you chosen what to eat?' },
      { it: 'Scegliamo insieme il film.', en: 'Let\'s choose the film together.' },
      { it: 'Sceglieva sempre i vestiti con cura.', en: 'She always used to choose her clothes carefully.' }
    ]
  },

  // ── Additional B1 verbs ───────────────────────────────────────────
  {
    infinitive: 'raggiungere', translation: 'to reach / to catch up with', group: 'irregular', difficulty: 3,
    conjugation: { io: 'raggiungo', tu: 'raggiungi', 'lui/lei': 'raggiunge', noi: 'raggiungiamo', voi: 'raggiungete', loro: 'raggiungono' },
    tenses: {
      presenteIndicativo: { io: 'raggiungo', tu: 'raggiungi', 'lui/lei': 'raggiunge', noi: 'raggiungiamo', voi: 'raggiungete', loro: 'raggiungono' },
      passatoProssimo:    { io: 'ho raggiunto', tu: 'hai raggiunto', 'lui/lei': 'ha raggiunto', noi: 'abbiamo raggiunto', voi: 'avete raggiunto', loro: 'hanno raggiunto' },
      imperfetto:         { io: 'raggiungevo', tu: 'raggiungevi', 'lui/lei': 'raggiungeva', noi: 'raggiungevamo', voi: 'raggiungevate', loro: 'raggiungevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'raggiunto',
    example: { it: 'Vi raggiungo tra un\'ora.', en: 'I will join you in an hour.' },
    examples: [
      { it: 'Abbiamo raggiunto l\'accordo dopo ore di discussione.', en: 'We reached an agreement after hours of discussion.' },
      { it: 'Riesce a raggiungere qualsiasi obiettivo.', en: 'She manages to reach any goal.' },
      { it: 'Raggiungeva sempre il traguardo per primo.', en: 'He always used to reach the finish line first.' }
    ]
  },
  {
    infinitive: 'permettere', translation: 'to allow / to permit', group: '-ere', difficulty: 3,
    conjugation: { io: 'permetto', tu: 'permetti', 'lui/lei': 'permette', noi: 'permettiamo', voi: 'permettete', loro: 'permettono' },
    tenses: {
      presenteIndicativo: { io: 'permetto', tu: 'permetti', 'lui/lei': 'permette', noi: 'permettiamo', voi: 'permettete', loro: 'permettono' },
      passatoProssimo:    { io: 'ho permesso', tu: 'hai permesso', 'lui/lei': 'ha permesso', noi: 'abbiamo permesso', voi: 'avete permesso', loro: 'hanno permesso' },
      imperfetto:         { io: 'permettevo', tu: 'permettevi', 'lui/lei': 'permetteva', noi: 'permettevamo', voi: 'permettevate', loro: 'permettevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'permesso',
    example: { it: 'Non mi permettono di uscire tardi.', en: 'They don\'t allow me to go out late.' },
    examples: [
      { it: 'Mi permette di passare?', en: 'Would you allow me to pass?' },
      { it: 'Il budget non ci ha permesso di viaggiare.', en: 'The budget didn\'t allow us to travel.' },
      { it: 'Non permetteva mai ritardi.', en: 'He never used to allow delays.' }
    ]
  },
  {
    infinitive: 'riuscire', translation: 'to manage / to succeed', group: 'irregular', difficulty: 3,
    conjugation: { io: 'riesco', tu: 'riesci', 'lui/lei': 'riesce', noi: 'riusciamo', voi: 'riuscite', loro: 'riescono' },
    tenses: {
      presenteIndicativo: { io: 'riesco', tu: 'riesci', 'lui/lei': 'riesce', noi: 'riusciamo', voi: 'riuscite', loro: 'riescono' },
      passatoProssimo:    { io: 'sono riuscito', tu: 'sei riuscito', 'lui/lei': 'è riuscito', noi: 'siamo riusciti', voi: 'siete riusciti', loro: 'sono riusciti' },
      imperfetto:         { io: 'riuscivo', tu: 'riuscivi', 'lui/lei': 'riusciva', noi: 'riuscivamo', voi: 'riuscivate', loro: 'riuscivano' }
    },
    auxiliaryVerb: 'essere', pastParticiple: 'riuscito',
    example: { it: 'Non riesco a dormire.', en: 'I can\'t manage to sleep.' },
    examples: [
      { it: 'Sei riuscito a prenotare il tavolo?', en: 'Did you manage to book the table?' },
      { it: 'Riesce sempre a trovare una soluzione.', en: 'She always manages to find a solution.' },
      { it: 'Non riusciva a concentrarsi con quel rumore.', en: 'He couldn\'t concentrate with that noise.' }
    ]
  },
  {
    infinitive: 'tradurre', translation: 'to translate', group: 'irregular', difficulty: 3,
    conjugation: { io: 'traduco', tu: 'traduci', 'lui/lei': 'traduce', noi: 'traduciamo', voi: 'traducete', loro: 'traducono' },
    tenses: {
      presenteIndicativo: { io: 'traduco', tu: 'traduci', 'lui/lei': 'traduce', noi: 'traduciamo', voi: 'traducete', loro: 'traducono' },
      passatoProssimo:    { io: 'ho tradotto', tu: 'hai tradotto', 'lui/lei': 'ha tradotto', noi: 'abbiamo tradotto', voi: 'avete tradotto', loro: 'hanno tradotto' },
      imperfetto:         { io: 'traducevo', tu: 'traducevi', 'lui/lei': 'traduceva', noi: 'traducevamo', voi: 'traducevate', loro: 'traducevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'tradotto',
    example: { it: 'Puoi tradurre questa frase?', en: 'Can you translate this sentence?' },
    examples: [
      { it: 'Ha tradotto il romanzo dall\'italiano all\'inglese.', en: 'She translated the novel from Italian to English.' },
      { it: 'Traduco documenti legali per lavoro.', en: 'I translate legal documents for work.' },
      { it: 'Traduceva sempre con molta cura.', en: 'He always used to translate with great care.' }
    ]
  },
  {
    infinitive: 'discutere', translation: 'to discuss / to argue', group: '-ere', difficulty: 3,
    conjugation: { io: 'discuto', tu: 'discuti', 'lui/lei': 'discute', noi: 'discutiamo', voi: 'discutete', loro: 'discutono' },
    tenses: {
      presenteIndicativo: { io: 'discuto', tu: 'discuti', 'lui/lei': 'discute', noi: 'discutiamo', voi: 'discutete', loro: 'discutono' },
      passatoProssimo:    { io: 'ho discusso', tu: 'hai discusso', 'lui/lei': 'ha discusso', noi: 'abbiamo discusso', voi: 'avete discusso', loro: 'hanno discusso' },
      imperfetto:         { io: 'discutevo', tu: 'discutevi', 'lui/lei': 'discuteva', noi: 'discutevamo', voi: 'discutevate', loro: 'discutevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'discusso',
    example: { it: 'Discutiamo del problema insieme.', en: 'Let\'s discuss the problem together.' },
    examples: [
      { it: 'Hanno discusso per ore senza trovare un accordo.', en: 'They argued for hours without reaching an agreement.' },
      { it: 'Discuto spesso di politica con mio padre.', en: 'I often discuss politics with my father.' },
      { it: 'Discuteva sempre con il capo.', en: 'He always used to argue with the boss.' }
    ]
  },
  {
    infinitive: 'stabilire', translation: 'to establish / to settle', group: '-ire (isc)', difficulty: 3,
    conjugation: { io: 'stabilisco', tu: 'stabilisci', 'lui/lei': 'stabilisce', noi: 'stabiliamo', voi: 'stabilite', loro: 'stabiliscono' },
    tenses: {
      presenteIndicativo: { io: 'stabilisco', tu: 'stabilisci', 'lui/lei': 'stabilisce', noi: 'stabiliamo', voi: 'stabilite', loro: 'stabiliscono' },
      passatoProssimo:    { io: 'ho stabilito', tu: 'hai stabilito', 'lui/lei': 'ha stabilito', noi: 'abbiamo stabilito', voi: 'avete stabilito', loro: 'hanno stabilito' },
      imperfetto:         { io: 'stabilivo', tu: 'stabilivi', 'lui/lei': 'stabiliva', noi: 'stabiliamo', voi: 'stabilivate', loro: 'stabilivano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'stabilito',
    example: { it: 'Dobbiamo stabilire le regole.', en: 'We need to establish the rules.' },
    examples: [
      { it: 'La legge stabilisce chiaramente i diritti dei lavoratori.', en: 'The law clearly establishes workers\' rights.' },
      { it: 'Hanno stabilito la data della riunione.', en: 'They have set the date of the meeting.' },
      { it: 'Stabiliva sempre le priorità all\'inizio della settimana.', en: 'She always used to set priorities at the start of the week.' }
    ]
  },
  {
    infinitive: 'pretendere', translation: 'to demand / to expect / to claim', group: '-ere', difficulty: 3,
    conjugation: { io: 'pretendo', tu: 'pretendi', 'lui/lei': 'pretende', noi: 'pretendiamo', voi: 'pretendete', loro: 'pretendono' },
    tenses: {
      presenteIndicativo: { io: 'pretendo', tu: 'pretendi', 'lui/lei': 'pretende', noi: 'pretendiamo', voi: 'pretendete', loro: 'pretendono' },
      passatoProssimo:    { io: 'ho preteso', tu: 'hai preteso', 'lui/lei': 'ha preteso', noi: 'abbiamo preteso', voi: 'avete preteso', loro: 'hanno preteso' },
      imperfetto:         { io: 'pretendevo', tu: 'pretendevi', 'lui/lei': 'pretendeva', noi: 'pretendevamo', voi: 'pretendevate', loro: 'pretendevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'preteso',
    example: { it: 'Non pretendo la perfezione.', en: 'I don\'t demand perfection.' },
    examples: [
      { it: 'Pretende troppo dai suoi studenti.', en: 'She demands too much from her students.' },
      { it: 'Ha preteso una spiegazione.', en: 'He demanded an explanation.' },
      { it: 'Pretendeva sempre di aver ragione.', en: 'She always used to claim she was right.' }
    ]
  },
  {
    infinitive: 'sostenere', translation: 'to support / to maintain / to uphold', group: 'irregular', difficulty: 3,
    conjugation: { io: 'sostengo', tu: 'sostieni', 'lui/lei': 'sostiene', noi: 'sosteniamo', voi: 'sostenete', loro: 'sostengono' },
    tenses: {
      presenteIndicativo: { io: 'sostengo', tu: 'sostieni', 'lui/lei': 'sostiene', noi: 'sosteniamo', voi: 'sostenete', loro: 'sostengono' },
      passatoProssimo:    { io: 'ho sostenuto', tu: 'hai sostenuto', 'lui/lei': 'ha sostenuto', noi: 'abbiamo sostenuto', voi: 'avete sostenuto', loro: 'hanno sostenuto' },
      imperfetto:         { io: 'sostenevo', tu: 'sostenevi', 'lui/lei': 'sosteneva', noi: 'sostenevamo', voi: 'sostenevate', loro: 'sostenevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'sostenuto',
    example: { it: 'Sostengo la tua decisione.', en: 'I support your decision.' },
    examples: [
      { it: 'Ha sostenuto l\'esame con ottimi voti.', en: 'She passed the exam with excellent marks.' },
      { it: 'Sosteniamo i giovani artisti con borse di studio.', en: 'We support young artists with scholarships.' },
      { it: 'Sosteneva sempre le cause più deboli.', en: 'He always used to support the underdog.' }
    ]
  },
  {
    infinitive: 'affrontare', translation: 'to face / to tackle / to deal with', group: '-are', difficulty: 3,
    conjugation: { io: 'affronto', tu: 'affronti', 'lui/lei': 'affronta', noi: 'affrontiamo', voi: 'affrontate', loro: 'affrontano' },
    tenses: {
      presenteIndicativo: { io: 'affronto', tu: 'affronti', 'lui/lei': 'affronta', noi: 'affrontiamo', voi: 'affrontate', loro: 'affrontano' },
      passatoProssimo:    { io: 'ho affrontato', tu: 'hai affrontato', 'lui/lei': 'ha affrontato', noi: 'abbiamo affrontato', voi: 'avete affrontato', loro: 'hanno affrontato' },
      imperfetto:         { io: 'affrontavo', tu: 'affrontavi', 'lui/lei': 'affrontava', noi: 'affrontavamo', voi: 'affrontavate', loro: 'affrontavano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'affrontato',
    example: { it: 'Dobbiamo affrontare il problema.', en: 'We need to tackle the problem.' },
    examples: [
      { it: 'Ha affrontato la situazione con grande calma.', en: 'She faced the situation with great calm.' },
      { it: 'Affrontiamo le difficoltà una alla volta.', en: 'We tackle difficulties one at a time.' },
      { it: 'Affrontava ogni sfida con coraggio.', en: 'He used to face every challenge with courage.' }
    ]
  },
  {
    infinitive: 'rendere', translation: 'to make / to render / to give back', group: '-ere', difficulty: 3,
    conjugation: { io: 'rendo', tu: 'rendi', 'lui/lei': 'rende', noi: 'rendiamo', voi: 'rendete', loro: 'rendono' },
    tenses: {
      presenteIndicativo: { io: 'rendo', tu: 'rendi', 'lui/lei': 'rende', noi: 'rendiamo', voi: 'rendete', loro: 'rendono' },
      passatoProssimo:    { io: 'ho reso', tu: 'hai reso', 'lui/lei': 'ha reso', noi: 'abbiamo reso', voi: 'avete reso', loro: 'hanno reso' },
      imperfetto:         { io: 'rendevo', tu: 'rendevi', 'lui/lei': 'rendeva', noi: 'rendevamo', voi: 'rendevate', loro: 'rendevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'reso',
    example: { it: 'Questo rende tutto più difficile.', en: 'This makes everything harder.' },
    examples: [
      { it: 'Ha reso la situation più complicata.', en: 'She made the situation more complicated.' },
      { it: 'Mi rendi felice.', en: 'You make me happy.' },
      { it: 'Rendeva ogni riunione produttiva.', en: 'He used to make every meeting productive.' }
    ]
  },
  {
    infinitive: 'riferire', translation: 'to report / to refer / to relate', group: '-ire', difficulty: 3,
    conjugation: { io: 'riferisco', tu: 'riferisci', 'lui/lei': 'riferisce', noi: 'riferiamo', voi: 'riferite', loro: 'riferiscono' },
    tenses: {
      presenteIndicativo: { io: 'riferisco', tu: 'riferisci', 'lui/lei': 'riferisce', noi: 'riferiamo', voi: 'riferite', loro: 'riferiscono' },
      passatoProssimo:    { io: 'ho riferito', tu: 'hai riferito', 'lui/lei': 'ha riferito', noi: 'abbiamo riferito', voi: 'avete riferito', loro: 'hanno riferito' },
      imperfetto:         { io: 'riferivo', tu: 'riferivi', 'lui/lei': 'riferiva', noi: 'referivamo', voi: 'riferivate', loro: 'riferivano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'riferito',
    example: { it: 'Ti riferisco tutto domani.', en: 'I will report everything to you tomorrow.' },
    examples: [
      { it: 'Ha riferito l\'accaduto alla polizia.', en: 'She reported what happened to the police.' },
      { it: 'A chi si riferisce questo commento?', en: 'Who does this comment refer to?' },
      { it: 'Riferiva sempre puntualmente al direttore.', en: 'He always used to report promptly to the director.' }
    ]
  },
  {
    infinitive: 'svolgere', translation: 'to carry out / to develop / to unfold', group: 'irregular', difficulty: 3,
    conjugation: { io: 'svolgo', tu: 'svolgi', 'lui/lei': 'svolge', noi: 'svolgiamo', voi: 'svolgete', loro: 'svolgono' },
    tenses: {
      presenteIndicativo: { io: 'svolgo', tu: 'svolgi', 'lui/lei': 'svolge', noi: 'svolgiamo', voi: 'svolgete', loro: 'svolgono' },
      passatoProssimo:    { io: 'ho svolto', tu: 'hai svolto', 'lui/lei': 'ha svolto', noi: 'abbiamo svolto', voi: 'avete svolto', loro: 'hanno svolto' },
      imperfetto:         { io: 'svolgevo', tu: 'svolgevi', 'lui/lei': 'svolgeva', noi: 'svolgevamo', voi: 'svolgevate', loro: 'svolgevano' }
    },
    auxiliaryVerb: 'avere', pastParticiple: 'svolto',
    example: { it: 'Svolgo un lavoro molto vario.', en: 'I carry out very varied work.' },
    examples: [
      { it: 'La storia si svolge a Venezia nel Settecento.', en: 'The story unfolds in Venice in the 18th century.' },
      { it: 'Abbiamo svolto tutte le attività previste.', en: 'We carried out all the planned activities.' },
      { it: 'Svolgeva le sue mansioni con precisione.', en: 'He used to carry out his duties with precision.' }
    ]
  }
]

const PRONOUNS = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro']

// ── A1 Vocabulary by topic ──────────────────────────────────────────
const VOCAB = {
  'Greetings': [
    { it: 'ciao', en: 'hi / bye' },
    { it: 'buongiorno', en: 'good morning' },
    { it: 'buonasera', en: 'good evening' },
    { it: 'buonanotte', en: 'good night' },
    { it: 'arrivederci', en: 'goodbye' },
    { it: 'per favore', en: 'please' },
    { it: 'grazie', en: 'thank you' },
    { it: 'prego', en: "you're welcome" },
    { it: 'scusa', en: 'excuse me (informal)' },
    { it: 'mi scusi', en: 'excuse me (formal)' },
    { it: 'sì', en: 'yes' },
    { it: 'no', en: 'no' },
    { it: 'come stai?', en: 'how are you? (informal)' },
    { it: 'bene', en: 'well / fine' },
    { it: 'male', en: 'bad' }
  ],
  'Numbers': [
    { it: 'uno', en: 'one (1)' },
    { it: 'due', en: 'two (2)' },
    { it: 'tre', en: 'three (3)' },
    { it: 'quattro', en: 'four (4)' },
    { it: 'cinque', en: 'five (5)' },
    { it: 'sei', en: 'six (6)' },
    { it: 'sette', en: 'seven (7)' },
    { it: 'otto', en: 'eight (8)' },
    { it: 'nove', en: 'nine (9)' },
    { it: 'dieci', en: 'ten (10)' },
    { it: 'venti', en: 'twenty (20)' },
    { it: 'trenta', en: 'thirty (30)' },
    { it: 'cento', en: 'one hundred (100)' },
    { it: 'mille', en: 'one thousand (1000)' }
  ],
  'Colors': [
    { it: 'rosso', en: 'red' },
    { it: 'blu', en: 'blue' },
    { it: 'verde', en: 'green' },
    { it: 'giallo', en: 'yellow' },
    { it: 'bianco', en: 'white' },
    { it: 'nero', en: 'black' },
    { it: 'arancione', en: 'orange' },
    { it: 'viola', en: 'purple' },
    { it: 'marrone', en: 'brown' },
    { it: 'grigio', en: 'grey' },
    { it: 'rosa', en: 'pink' }
  ],
  'Family': [
    { it: 'la famiglia', en: 'the family' },
    { it: 'la madre / la mamma', en: 'the mother / mom' },
    { it: 'il padre / il papà', en: 'the father / dad' },
    { it: 'il fratello', en: 'the brother' },
    { it: 'la sorella', en: 'the sister' },
    { it: 'il figlio', en: 'the son' },
    { it: 'la figlia', en: 'the daughter' },
    { it: 'il nonno', en: 'the grandfather' },
    { it: 'la nonna', en: 'the grandmother' },
    { it: 'lo zio', en: 'the uncle' },
    { it: 'la zia', en: 'the aunt' },
    { it: 'il marito', en: 'the husband' },
    { it: 'la moglie', en: 'the wife' }
  ],
  'Food & Drink': [
    { it: 'il pane', en: 'bread' },
    { it: 'il formaggio', en: 'cheese' },
    { it: 'la pasta', en: 'pasta' },
    { it: 'la pizza', en: 'pizza' },
    { it: 'la carne', en: 'meat' },
    { it: 'il pesce', en: 'fish' },
    { it: 'la frutta', en: 'fruit' },
    { it: 'la verdura', en: 'vegetables' },
    { it: "l'acqua", en: 'water' },
    { it: 'il caffè', en: 'coffee' },
    { it: 'il latte', en: 'milk' },
    { it: 'il vino', en: 'wine' },
    { it: 'la birra', en: 'beer' },
    { it: 'il tè', en: 'tea' },
    { it: 'lo zucchero', en: 'sugar' },
    { it: 'il sale', en: 'salt' }
  ],
  'Days & Time': [
    { it: 'lunedì', en: 'Monday' },
    { it: 'martedì', en: 'Tuesday' },
    { it: 'mercoledì', en: 'Wednesday' },
    { it: 'giovedì', en: 'Thursday' },
    { it: 'venerdì', en: 'Friday' },
    { it: 'sabato', en: 'Saturday' },
    { it: 'domenica', en: 'Sunday' },
    { it: 'oggi', en: 'today' },
    { it: 'domani', en: 'tomorrow' },
    { it: 'ieri', en: 'yesterday' },
    { it: 'adesso / ora', en: 'now' },
    { it: 'sempre', en: 'always' },
    { it: 'mai', en: 'never' },
    { it: 'spesso', en: 'often' },
    { it: 'a volte', en: 'sometimes' }
  ],
  'Common Adjectives': [
    { it: 'grande', en: 'big / great' },
    { it: 'piccolo', en: 'small' },
    { it: 'buono', en: 'good' },
    { it: 'cattivo', en: 'bad' },
    { it: 'bello', en: 'beautiful' },
    { it: 'brutto', en: 'ugly' },
    { it: 'nuovo', en: 'new' },
    { it: 'vecchio', en: 'old' },
    { it: 'facile', en: 'easy' },
    { it: 'difficile', en: 'difficult' },
    { it: 'caldo', en: 'hot / warm' },
    { it: 'freddo', en: 'cold' },
    { it: 'lungo', en: 'long' },
    { it: 'corto', en: 'short (length)' },
    { it: 'felice', en: 'happy' },
    { it: 'triste', en: 'sad' }
  ],
  'Around the House': [
    { it: 'la casa', en: 'the house' },
    { it: 'la porta', en: 'the door' },
    { it: 'la finestra', en: 'the window' },
    { it: 'il tavolo', en: 'the table' },
    { it: 'la sedia', en: 'the chair' },
    { it: 'il letto', en: 'the bed' },
    { it: 'la cucina', en: 'the kitchen' },
    { it: 'il bagno', en: 'the bathroom' },
    { it: 'la camera da letto', en: 'the bedroom' },
    { it: 'il salotto', en: 'the living room' },
    { it: 'il giardino', en: 'the garden' },
    { it: 'la chiave', en: 'the key' }
  ],
  'In the City': [
    { it: 'la città', en: 'the city' },
    { it: 'la strada', en: 'the street' },
    { it: 'il negozio', en: 'the shop' },
    { it: 'il ristorante', en: 'the restaurant' },
    { it: 'la stazione', en: 'the station' },
    { it: 'la piazza', en: 'the square' },
    { it: "l'ospedale", en: 'the hospital' },
    { it: 'la chiesa', en: 'the church' },
    { it: 'la scuola', en: 'the school' },
    { it: 'il supermercato', en: 'the supermarket' },
    { it: 'la farmacia', en: 'the pharmacy' },
    { it: "l'aeroporto", en: 'the airport' },
    { it: 'la banca', en: 'the bank' }
  ],
  'Common Phrases': [
    { it: 'Mi chiamo…', en: 'My name is…' },
    { it: 'Quanti anni hai?', en: 'How old are you?' },
    { it: 'Ho … anni.', en: 'I am … years old.' },
    { it: 'Di dove sei?', en: 'Where are you from?' },
    { it: 'Quanto costa?', en: 'How much does it cost?' },
    { it: "Dov'è…?", en: 'Where is…?' },
    { it: 'Non parlo bene italiano.', en: "I don't speak Italian well." },
    { it: 'Puoi ripetere?', en: 'Can you repeat?' },
    { it: 'Va bene.', en: "It's okay. / All right." },
    { it: 'Ho fame.', en: "I'm hungry." },
    { it: 'Ho sete.', en: "I'm thirsty." },
    { it: 'Ho bisogno di…', en: 'I need…' }
  ],

  // ── A2 Vocabulary (difficulty: 2) ──────────────────────────────
  'Travel': [
    { it: 'il viaggio', en: 'the trip / journey', difficulty: 2 },
    { it: 'il passaporto', en: 'the passport', difficulty: 2 },
    { it: 'il biglietto', en: 'the ticket', difficulty: 2 },
    { it: 'la valigia', en: 'the suitcase', difficulty: 2 },
    { it: "l'albergo", en: 'the hotel', difficulty: 2 },
    { it: 'la camera', en: 'the room', difficulty: 2 },
    { it: 'il volo', en: 'the flight', difficulty: 2 },
    { it: "l'aereo", en: 'the plane', difficulty: 2 },
    { it: 'la prenotazione', en: 'the reservation / booking', difficulty: 2 },
    { it: 'il noleggio', en: 'the rental', difficulty: 2 },
    { it: 'la destinazione', en: 'the destination', difficulty: 2 },
    { it: 'il turista', en: 'the tourist', difficulty: 2 },
    { it: 'il museo', en: 'the museum', difficulty: 2 },
    { it: "l'autostrada", en: 'the motorway / highway', difficulty: 2 },
    { it: 'il confine', en: 'the border', difficulty: 2 }
  ],
  'Emotions': [
    { it: 'la gioia', en: 'joy', difficulty: 2 },
    { it: 'la tristezza', en: 'sadness', difficulty: 2 },
    { it: 'la rabbia', en: 'anger', difficulty: 2 },
    { it: 'la paura', en: 'fear', difficulty: 2 },
    { it: 'lo stupore', en: 'surprise / amazement', difficulty: 2 },
    { it: "l'amore", en: 'love', difficulty: 2 },
    { it: "l'odio", en: 'hate', difficulty: 2 },
    { it: 'la gelosia', en: 'jealousy', difficulty: 2 },
    { it: "l'ansia", en: 'anxiety', difficulty: 2 },
    { it: 'la noia', en: 'boredom', difficulty: 2 },
    { it: "l'orgoglio", en: 'pride', difficulty: 2 },
    { it: 'la vergogna', en: 'shame / embarrassment', difficulty: 2 },
    { it: 'la fiducia', en: 'trust / confidence', difficulty: 2 },
    { it: 'la speranza', en: 'hope', difficulty: 2 },
    { it: 'la solitudine', en: 'loneliness', difficulty: 2 }
  ],
  'Health': [
    { it: 'la salute', en: 'health', difficulty: 2 },
    { it: 'il medico / il dottore', en: 'the doctor', difficulty: 2 },
    { it: 'la medicina', en: 'medicine', difficulty: 2 },
    { it: 'la ricetta', en: 'the prescription', difficulty: 2 },
    { it: 'il mal di testa', en: 'headache', difficulty: 2 },
    { it: 'la febbre', en: 'fever', difficulty: 2 },
    { it: 'il raffreddore', en: 'cold (illness)', difficulty: 2 },
    { it: 'la tosse', en: 'cough', difficulty: 2 },
    { it: 'il dolore', en: 'pain / ache', difficulty: 2 },
    { it: "l'allergia", en: 'allergy', difficulty: 2 },
    { it: 'la visita medica', en: 'medical check-up', difficulty: 2 },
    { it: 'il pronto soccorso', en: 'emergency room / A&E', difficulty: 2 }
  ],
  'Weather': [
    { it: 'il tempo', en: 'the weather', difficulty: 2 },
    { it: 'la pioggia', en: 'rain', difficulty: 2 },
    { it: 'il sole', en: 'the sun', difficulty: 2 },
    { it: 'la neve', en: 'snow', difficulty: 2 },
    { it: 'il vento', en: 'wind', difficulty: 2 },
    { it: 'la nuvola', en: 'cloud', difficulty: 2 },
    { it: 'il temporale', en: 'thunderstorm', difficulty: 2 },
    { it: 'la nebbia', en: 'fog', difficulty: 2 },
    { it: "l'estate", en: 'summer', difficulty: 2 },
    { it: "l'inverno", en: 'winter', difficulty: 2 },
    { it: 'la primavera', en: 'spring', difficulty: 2 },
    { it: "l'autunno", en: 'autumn / fall', difficulty: 2 },
    { it: 'fresco', en: 'cool / fresh', difficulty: 2 },
    { it: 'umido', en: 'humid / damp', difficulty: 2 },
    { it: 'il grado', en: 'degree (temperature)', difficulty: 2 }
  ]
}

// ── A1 Grammar Reference ────────────────────────────────────────────
const GRAMMAR = [
  {
    title: 'Noun Gender',
    body: `In Italian every noun is either <strong>masculine</strong> or <strong>feminine</strong>.<br><br>
<strong>General rules:</strong><br>
• Most nouns ending in <strong>-o</strong> are masculine: <em>il libro</em> (the book)<br>
• Most nouns ending in <strong>-a</strong> are feminine: <em>la casa</em> (the house)<br>
• Nouns ending in <strong>-e</strong> can be either: <em>il ristorante</em> (m), <em>la notte</em> (f)<br><br>
<strong>Plurals:</strong><br>
• -o → -i : <em>libro → libri</em><br>
• -a → -e : <em>casa → case</em><br>
• -e → -i : <em>notte → notti</em>`
  },
  {
    title: 'Definite Articles (the)',
    body: `<table class="grammar-table">
<tr><th></th><th>Singular</th><th>Plural</th></tr>
<tr><td><strong>Masculine</strong></td><td>il / lo / l'</td><td>i / gli</td></tr>
<tr><td><strong>Feminine</strong></td><td>la / l'</td><td>le</td></tr>
</table><br>
<strong>il</strong> — before most consonants: <em>il gatto</em><br>
<strong>lo</strong> — before s+consonant, z, gn, ps: <em>lo studente</em><br>
<strong>l'</strong> — before a vowel (m or f): <em>l'amico, l'amica</em><br>
<strong>la</strong> — before consonants (f): <em>la donna</em>`
  },
  {
    title: 'Indefinite Articles (a / an)',
    body: `<table class="grammar-table">
<tr><th></th><th>Article</th><th>When</th></tr>
<tr><td><strong>un</strong></td><td>masculine</td><td>most consonants & vowels</td></tr>
<tr><td><strong>uno</strong></td><td>masculine</td><td>s+consonant, z, gn, ps</td></tr>
<tr><td><strong>una</strong></td><td>feminine</td><td>consonants</td></tr>
<tr><td><strong>un'</strong></td><td>feminine</td><td>vowels</td></tr>
</table><br>
<em>un libro, uno studente, una casa, un'amica</em>`
  },
  {
    title: 'Present Tense — Regular Verbs',
    body: `Italian has three verb groups based on their infinitive ending.<br><br>
<table class="grammar-table">
<tr><th></th><th>-are (parlare)</th><th>-ere (scrivere)</th><th>-ire (dormire)</th><th>-ire isc (capire)</th></tr>
<tr><td><strong>io</strong></td><td>parl<strong>o</strong></td><td>scriv<strong>o</strong></td><td>dorm<strong>o</strong></td><td>cap<strong>isco</strong></td></tr>
<tr><td><strong>tu</strong></td><td>parl<strong>i</strong></td><td>scriv<strong>i</strong></td><td>dorm<strong>i</strong></td><td>cap<strong>isci</strong></td></tr>
<tr><td><strong>lui/lei</strong></td><td>parl<strong>a</strong></td><td>scriv<strong>e</strong></td><td>dorm<strong>e</strong></td><td>cap<strong>isce</strong></td></tr>
<tr><td><strong>noi</strong></td><td>parl<strong>iamo</strong></td><td>scriv<strong>iamo</strong></td><td>dorm<strong>iamo</strong></td><td>cap<strong>iamo</strong></td></tr>
<tr><td><strong>voi</strong></td><td>parl<strong>ate</strong></td><td>scriv<strong>ete</strong></td><td>dorm<strong>ite</strong></td><td>cap<strong>ite</strong></td></tr>
<tr><td><strong>loro</strong></td><td>parl<strong>ano</strong></td><td>scriv<strong>ono</strong></td><td>dorm<strong>ono</strong></td><td>cap<strong>iscono</strong></td></tr>
</table><br>
<strong>Tip:</strong> The <em>noi</em> form always ends in <em>-iamo</em> for all three groups!`
  },
  {
    title: 'Common Prepositions',
    body: `<strong>di</strong> — of, from<br>
<strong>a</strong> — to, at, in (cities)<br>
<strong>da</strong> — from, by, at someone's place<br>
<strong>in</strong> — in, to (countries, regions)<br>
<strong>con</strong> — with<br>
<strong>su</strong> — on, about<br>
<strong>per</strong> — for, through<br>
<strong>tra / fra</strong> — between, among, in (time)<br><br>
<strong>Examples:</strong><br>
<em>Vado <strong>a</strong> Roma.</em> — I go to Rome.<br>
<em>Vengo <strong>da</strong> Milano.</em> — I come from Milan.<br>
<em>Lavoro <strong>in</strong> Italia.</em> — I work in Italy.`
  },
  {
    title: 'Negation',
    body: `To make a sentence negative, put <strong>non</strong> before the verb.<br><br>
<em>Parlo italiano.</em> → <em><strong>Non</strong> parlo italiano.</em><br>
<em>Ho un cane.</em> → <em><strong>Non</strong> ho un cane.</em><br>
<em>Capisco.</em> → <em><strong>Non</strong> capisco.</em><br><br>
It's that simple — just add <strong>non</strong> right before the conjugated verb.`
  },
  {
    title: 'Subject Pronouns',
    body: `<table class="grammar-table">
<tr><th>Italian</th><th>English</th></tr>
<tr><td><strong>io</strong></td><td>I</td></tr>
<tr><td><strong>tu</strong></td><td>you (informal)</td></tr>
<tr><td><strong>lui / lei</strong></td><td>he / she</td></tr>
<tr><td><strong>Lei</strong></td><td>you (formal)</td></tr>
<tr><td><strong>noi</strong></td><td>we</td></tr>
<tr><td><strong>voi</strong></td><td>you (plural)</td></tr>
<tr><td><strong>loro</strong></td><td>they</td></tr>
</table><br>
<strong>Tip:</strong> In Italian, the verb ending tells you the subject, so pronouns are often dropped:<br>
<em>"Parlo italiano"</em> already means "I speak Italian" — no <em>io</em> needed.`
  },
  {
    title: 'Asking Questions',
    body: `Italian questions often look just like statements — only the intonation changes (voice rises at the end).<br><br>
<em>Parli italiano.</em> (You speak Italian.)<br>
<em>Parli italiano?</em> (Do you speak Italian?)<br><br>
<strong>Common question words:</strong><br>
<strong>che / che cosa / cosa</strong> — what<br>
<strong>chi</strong> — who<br>
<strong>dove</strong> — where<br>
<strong>quando</strong> — when<br>
<strong>perché</strong> — why / because<br>
<strong>come</strong> — how<br>
<strong>quanto/a/i/e</strong> — how much / how many`
  }
]

// ── A1 Grammar Quiz Questions ───────────────────────────────────────
const GRAMMAR_QUIZ = [
  // Articles & gender
  { q: '___ libro è interessante.', a: 'Il', opts: ['Il', 'La', 'Lo', 'Le'], topic: 'Articles' },
  { q: '___ studentessa è brava.', a: 'La', opts: ['Il', 'La', 'Lo', 'I'], topic: 'Articles' },
  { q: '___ studente studia molto.', a: 'Lo', opts: ['Il', 'Lo', 'La', 'Un'], topic: 'Articles' },
  { q: '___ amico di Marco è simpatico.', a: "L'", opts: ["L'", 'Il', 'Lo', 'Un'], topic: 'Articles' },
  { q: '___ ragazze sono italiane.', a: 'Le', opts: ['Le', 'I', 'Gli', 'La'], topic: 'Articles' },
  { q: '___ zaino è pesante.', a: 'Lo', opts: ['Il', 'Lo', 'La', 'Le'], topic: 'Articles' },
  { q: '___ gatti dormono sul divano.', a: 'I', opts: ['I', 'Gli', 'Le', 'Il'], topic: 'Articles' },
  { q: '___ amici di Luca sono qui.', a: 'Gli', opts: ['I', 'Gli', 'Le', 'Lo'], topic: 'Articles' },
  { q: 'Ho ___ cane molto bello.', a: 'un', opts: ['un', 'uno', 'una', 'il'], topic: 'Articles' },
  { q: 'C\'è ___ studente nuovo in classe.', a: 'uno', opts: ['un', 'uno', 'una', 'il'], topic: 'Articles' },
  { q: 'Cerco ___ amica per studiare.', a: "un'", opts: ["un'", 'una', 'un', 'la'], topic: 'Articles' },
  { q: 'Voglio ___ pizza margherita.', a: 'una', opts: ['una', "un'", 'un', 'la'], topic: 'Articles' },

  // Noun gender
  { q: '"La notte" (the night) is...', a: 'feminine', opts: ['feminine', 'masculine'], topic: 'Gender' },
  { q: '"Il ristorante" (the restaurant) is...', a: 'masculine', opts: ['masculine', 'feminine'], topic: 'Gender' },
  { q: '"La mano" (the hand) is...', a: 'feminine', opts: ['feminine', 'masculine'], topic: 'Gender' },
  { q: 'Nouns ending in -o are usually...', a: 'masculine', opts: ['masculine', 'feminine'], topic: 'Gender' },
  { q: 'The plural of "libro" is...', a: 'libri', opts: ['libri', 'libre', 'libra', 'libroni'], topic: 'Gender' },
  { q: 'The plural of "casa" is...', a: 'case', opts: ['case', 'casi', 'casa', 'casse'], topic: 'Gender' },

  // Prepositions
  { q: 'Vado ___ Roma domani.', a: 'a', opts: ['a', 'in', 'di', 'da'], topic: 'Prepositions' },
  { q: 'Vengo ___ Milano.', a: 'da', opts: ['da', 'di', 'a', 'in'], topic: 'Prepositions' },
  { q: 'Lavoro ___ Italia.', a: 'in', opts: ['in', 'a', 'di', 'su'], topic: 'Prepositions' },
  { q: 'Il libro è ___ tavolo.', a: 'sul', opts: ['sul', 'nel', 'al', 'dal'], topic: 'Prepositions' },
  { q: 'Parlo ___ mia famiglia.', a: 'con', opts: ['con', 'da', 'per', 'a'], topic: 'Prepositions' },
  { q: 'Questo regalo è ___ te.', a: 'per', opts: ['per', 'con', 'da', 'a'], topic: 'Prepositions' },
  { q: 'La lezione finisce ___ dieci minuti.', a: 'tra', opts: ['tra', 'in', 'per', 'da'], topic: 'Prepositions' },

  // Negation
  { q: 'Make negative: "Parlo italiano."', a: 'Non parlo italiano.', opts: ['Non parlo italiano.', 'Parlo non italiano.', 'No parlo italiano.', 'Parlo italiano non.'], topic: 'Negation' },
  { q: 'Make negative: "Ho fame."', a: 'Non ho fame.', opts: ['Non ho fame.', 'Ho non fame.', 'No ho fame.', 'Ho fame non.'], topic: 'Negation' },
  { q: 'Make negative: "Capisce tutto."', a: 'Non capisce tutto.', opts: ['Non capisce tutto.', 'Capisce non tutto.', 'No capisce tutto.', 'Capisce tutto non.'], topic: 'Negation' },

  // Pronouns
  { q: '"___ parliamo italiano." (We speak Italian.)', a: 'Noi', opts: ['Noi', 'Voi', 'Loro', 'Io'], topic: 'Pronouns' },
  { q: 'The formal "you" in Italian is...', a: 'Lei', opts: ['Lei', 'Tu', 'Voi', 'Lui'], topic: 'Pronouns' },
  { q: '"___ sono studenti." (They are students.)', a: 'Loro', opts: ['Loro', 'Noi', 'Voi', 'Lei'], topic: 'Pronouns' },
  { q: 'In Italian, subject pronouns are often...', a: 'dropped', opts: ['dropped', 'required', 'placed after the verb', 'doubled'], topic: 'Pronouns' },

  // Question words
  { q: '___ stai? — How are you?', a: 'Come', opts: ['Come', 'Dove', 'Quando', 'Che'], topic: 'Questions' },
  { q: '___ abiti? — Where do you live?', a: 'Dove', opts: ['Dove', 'Come', 'Chi', 'Quando'], topic: 'Questions' },
  { q: '___ viene alla festa? — Who is coming?', a: 'Chi', opts: ['Chi', 'Che', 'Come', 'Dove'], topic: 'Questions' },
  { q: '___ costa? — How much does it cost?', a: 'Quanto', opts: ['Quanto', 'Come', 'Che', 'Dove'], topic: 'Questions' },
  { q: '___ studi italiano? — Why do you study Italian?', a: 'Perché', opts: ['Perché', 'Come', 'Quando', 'Dove'], topic: 'Questions' }
]

// ── A1 Sentence Builder ─────────────────────────────────────────────
const SENTENCES = [
  { en: 'I speak Italian.', words: ['Parlo', 'italiano.'] },
  { en: 'We eat pizza.', words: ['Mangiamo', 'la', 'pizza.'] },
  { en: 'She is very kind.', words: ['Lei', 'è', 'molto', 'gentile.'] },
  { en: 'I go to school every day.', words: ['Vado', 'a', 'scuola', 'ogni', 'giorno.'] },
  { en: 'Where do you live?', words: ['Dove', 'vivi?'] },
  { en: 'I have a big house.', words: ['Ho', 'una', 'casa', 'grande.'] },
  { en: 'The children play at the park.', words: ['I', 'bambini', 'giocano', 'al', 'parco.'] },
  { en: 'I don\'t understand this word.', words: ['Non', 'capisco', 'questa', 'parola.'] },
  { en: 'Do you want a coffee?', words: ['Vuoi', 'un', 'caffè?'] },
  { en: 'We must leave early.', words: ['Dobbiamo', 'partire', 'presto.'] },
  { en: 'How old are you?', words: ['Quanti', 'anni', 'hai?'] },
  { en: 'I work in an office.', words: ['Lavoro', 'in', 'ufficio.'] },
  { en: 'He always tells the truth.', words: ['Lui', 'dice', 'sempre', 'la', 'verità.'] },
  { en: 'I read a book before sleeping.', words: ['Leggo', 'un', 'libro', 'prima', 'di', 'dormire.'] },
  { en: 'The shop closes at eight.', words: ['Il', 'negozio', 'chiude', 'alle', 'otto.'] },
  { en: 'Can you speak more slowly?', words: ['Puoi', 'parlare', 'più', 'piano?'] },
  { en: 'I am fine, thanks.', words: ['Sto', 'bene,', 'grazie.'] },
  { en: 'They live near the sea.', words: ['Vivono', 'vicino', 'al', 'mare.'] },
  { en: 'We have been friends for many years.', words: ['Siamo', 'amici', 'da', 'molti', 'anni.'] },
  { en: 'What are you drinking?', words: ['Cosa', 'bevi?'] },
  { en: 'I put the book on the table.', words: ['Metto', 'il', 'libro', 'sul', 'tavolo.'] },
  { en: 'It is hot today.', words: ['Fa', 'caldo', 'oggi.'] },
  { en: 'I don\'t feel well.', words: ['Non', 'mi', 'sento', 'bene.'] },
  { en: 'How do you say it in Italian?', words: ['Come', 'si', 'dice', 'in', 'italiano?'] },
  { en: 'I sleep eight hours every night.', words: ['Dormo', 'otto', 'ore', 'ogni', 'notte.'] },
  { en: 'We write every day in class.', words: ['Scriviamo', 'ogni', 'giorno', 'in', 'classe.'] },
  { en: 'She buys fruit at the market.', words: ['Compra', 'la', 'frutta', 'al', 'mercato.'] },
  { en: 'I think so.', words: ['Penso', 'di', 'sì.'] },
  { en: 'I can\'t come tomorrow.', words: ['Non', 'posso', 'venire', 'domani.'] },
  { en: 'What time do you eat?', words: ['A', 'che', 'ora', 'mangi?'] }
]

// ── A2/B1 Reading Passages ──────────────────────────────────────────
const READING_PASSAGES = [
  // ── A1 Passages ─────────────────────────────────────────────────
  {
    title: 'Ciao! Mi chiamo Marco',
    level: 1,
    tags: ['greetings', 'introductions', 'numbers'],
    body: `<p>Ciao! Mi <mark data-word="chiamo">chiamo</mark> Marco. Ho <mark data-word="ventidue anni">ventidue anni</mark>. Sono italiano. Abito a Roma con la mia <mark data-word="famiglia">famiglia</mark>.</p>
<p>La mia famiglia è piccola: c'è mia <mark data-word="madre">madre</mark>, mio <mark data-word="padre">padre</mark> e mia <mark data-word="sorella">sorella</mark>. Mia sorella si chiama Sofia. Ha <mark data-word="diciotto anni">diciotto anni</mark>.</p>
<p>Parlo <mark data-word="italiano">italiano</mark> e un po' di inglese. Sono <mark data-word="studente">studente</mark>. Vado all'università il lunedì e il mercoledì.</p>`,
    vocabGlossary: [
      { italian: 'chiamo', english: 'my name is (I call myself)' },
      { italian: 'ventidue anni', english: 'twenty-two years old' },
      { italian: 'famiglia', english: 'family' },
      { italian: 'madre', english: 'mother' },
      { italian: 'padre', english: 'father' },
      { italian: 'sorella', english: 'sister' },
      { italian: 'diciotto anni', english: 'eighteen years old' },
      { italian: 'italiano', english: 'Italian (language)' },
      { italian: 'studente', english: 'student' }
    ],
    questions: [
      {
        text: 'How old is Marco?',
        options: ['Eighteen', 'Twenty', 'Twenty-two', 'Twenty-five'],
        correctIndex: 2
      },
      {
        text: 'Where does Marco live?',
        options: ['Milan', 'Naples', 'Florence', 'Rome'],
        correctIndex: 3
      },
      {
        text: 'What is the name of Marco\'s sister?',
        options: ['Maria', 'Sofia', 'Laura', 'Anna'],
        correctIndex: 1
      },
      {
        text: 'Which days does Marco go to university?',
        options: ['Tuesday and Thursday', 'Monday and Wednesday', 'Friday and Saturday', 'Every day'],
        correctIndex: 1
      }
    ],
    audioUrl: null
  },
  {
    title: 'La mia casa',
    level: 1,
    tags: ['home', 'rooms', 'numbers', 'colors'],
    body: `<p>La mia <mark data-word="casa">casa</mark> è grande. Ci sono cinque <mark data-word="stanze">stanze</mark>: il salotto, la cucina, due <mark data-word="camere da letto">camere da letto</mark> e un bagno.</p>
<p>Il salotto è grande e <mark data-word="luminoso">luminoso</mark>. Le pareti sono <mark data-word="bianche">bianche</mark> e il divano è <mark data-word="blu">blu</mark>. C'è anche una grande <mark data-word="finestra">finestra</mark> con vista sul giardino.</p>
<p>La mia camera da letto è piccola ma <mark data-word="accogliente">accogliente</mark>. Ho un letto, un armadio e una scrivania. Studio sempre alla scrivania la sera.</p>`,
    vocabGlossary: [
      { italian: 'casa', english: 'house / home' },
      { italian: 'stanze', english: 'rooms' },
      { italian: 'camere da letto', english: 'bedrooms' },
      { italian: 'luminoso', english: 'bright / full of light' },
      { italian: 'bianche', english: 'white (plural)' },
      { italian: 'blu', english: 'blue' },
      { italian: 'finestra', english: 'window' },
      { italian: 'accogliente', english: 'cosy / welcoming' }
    ],
    questions: [
      {
        text: 'How many rooms does the house have?',
        options: ['Three', 'Four', 'Five', 'Six'],
        correctIndex: 2
      },
      {
        text: 'What colour is the sofa?',
        options: ['White', 'Red', 'Green', 'Blue'],
        correctIndex: 3
      },
      {
        text: 'What does the living room window look out onto?',
        options: ['The street', 'The garden', 'The sea', 'Another building'],
        correctIndex: 1
      },
      {
        text: 'Where does the person study in the evening?',
        options: ['On the sofa', 'In the kitchen', 'At the desk', 'In the garden'],
        correctIndex: 2
      }
    ],
    audioUrl: null
  },
  {
    title: 'Al bar — Una colazione italiana',
    level: 1,
    tags: ['food & drink', 'cafe', 'dialogue', 'greetings'],
    body: `<p>È mattina. Luigi va al <mark data-word="bar">bar</mark> vicino a casa sua.</p>
<p><strong>Barista:</strong> "Buongiorno! Cosa <mark data-word="desidera">desidera</mark>?"</p>
<p><strong>Luigi:</strong> "Buongiorno! Un <mark data-word="caffè">caffè</mark> e un <mark data-word="cornetto">cornetto</mark>, per favore."</p>
<p><strong>Barista:</strong> "Subito! Vuole il cornetto <mark data-word="vuoto">vuoto</mark> o con la <mark data-word="marmellata">marmellata</mark>?"</p>
<p><strong>Luigi:</strong> "Con la marmellata, grazie."</p>
<p><strong>Barista:</strong> "Ecco a lei. Sono <mark data-word="due euro">due euro</mark> e cinquanta."</p>
<p><strong>Luigi:</strong> "Prego." Luigi paga e beve il caffè al <mark data-word="bancone">bancone</mark>. È buono!</p>`,
    vocabGlossary: [
      { italian: 'bar', english: 'Italian café (coffee bar)' },
      { italian: 'desidera', english: 'would you like? (formal)' },
      { italian: 'caffè', english: 'espresso coffee' },
      { italian: 'cornetto', english: 'croissant' },
      { italian: 'vuoto', english: 'plain / empty' },
      { italian: 'marmellata', english: 'jam' },
      { italian: 'due euro', english: 'two euros' },
      { italian: 'bancone', english: 'counter / bar' }
    ],
    questions: [
      {
        text: 'What does Luigi order to drink?',
        options: ['Tea', 'Orange juice', 'Espresso', 'Cappuccino'],
        correctIndex: 2
      },
      {
        text: 'What filling does Luigi choose for his cornetto?',
        options: ['Cream', 'Chocolate', 'Plain', 'Jam'],
        correctIndex: 3
      },
      {
        text: 'How much does Luigi pay?',
        options: ['€1.50', '€2.00', '€2.50', '€3.00'],
        correctIndex: 2
      },
      {
        text: 'Where does Luigi drink his coffee?',
        options: ['At a table outside', 'At home', 'At the counter', 'On the street'],
        correctIndex: 2
      }
    ],
    audioUrl: null
  },
  {
    title: 'I colori e il tempo',
    level: 1,
    tags: ['colors', 'weather', 'days', 'numbers'],
    body: `<p>Oggi è <mark data-word="lunedì">lunedì</mark>. Il <mark data-word="tempo">tempo</mark> è bello. Il sole è <mark data-word="giallo">giallo</mark> e il cielo è <mark data-word="azzurro">azzurro</mark>. Non ci sono <mark data-word="nuvole">nuvole</mark>.</p>
<p>Domani è martedì. Forse piove. Il cielo diventa <mark data-word="grigio">grigio</mark> e fa <mark data-word="freddo">freddo</mark>. Ho bisogno di un <mark data-word="ombrello">ombrello</mark> e di un cappotto <mark data-word="verde">verde</mark>.</p>
<p>Il mio giorno preferito è il <mark data-word="sabato">sabato</mark>. Di sabato non lavoro. Vado al parco con il mio cane. Il cane si chiama Fido ed è <mark data-word="marrone">marrone</mark> e bianco.</p>`,
    vocabGlossary: [
      { italian: 'lunedì', english: 'Monday' },
      { italian: 'tempo', english: 'weather' },
      { italian: 'giallo', english: 'yellow' },
      { italian: 'azzurro', english: 'sky blue' },
      { italian: 'nuvole', english: 'clouds' },
      { italian: 'grigio', english: 'grey' },
      { italian: 'freddo', english: 'cold' },
      { italian: 'ombrello', english: 'umbrella' },
      { italian: 'verde', english: 'green' },
      { italian: 'sabato', english: 'Saturday' },
      { italian: 'marrone', english: 'brown' }
    ],
    questions: [
      {
        text: 'What is the weather like on Monday?',
        options: ['Rainy and cold', 'Cloudy and grey', 'Sunny and clear', 'Windy and warm'],
        correctIndex: 2
      },
      {
        text: 'What colour is the sky on Monday?',
        options: ['Grey', 'White', 'Sky blue', 'Yellow'],
        correctIndex: 2
      },
      {
        text: 'What colour coat does the person mention?',
        options: ['Blue', 'Red', 'Black', 'Green'],
        correctIndex: 3
      },
      {
        text: 'What is the dog\'s name?',
        options: ['Ciccio', 'Rex', 'Fido', 'Bruno'],
        correctIndex: 2
      }
    ],
    audioUrl: null
  },
  // ── A2 Passages ─────────────────────────────────────────────────
  {
    title: 'La mia routine mattutina',
    level: 2,
    tags: ['daily life', 'reflexive verbs'],
    body: `<p>Ogni mattina <mark data-word="mi sveglio">mi sveglio</mark> alle sette. Prima di alzarmi, guardo il telefono per qualche minuto. Poi vado in bagno, <mark data-word="mi lavo">mi lavo</mark> la faccia e <mark data-word="mi vesto">mi vesto</mark>. Di solito scelgo vestiti comodi per andare in ufficio.</p>
<p>Faccio <mark data-word="colazione">colazione</mark> in cucina: bevo un caffè e mangio un cornetto o dei biscotti. Non ho molto <mark data-word="tempo">tempo</mark> la mattina, quindi mangio in fretta. Poi prendo la borsa, metto le chiavi in tasca e <mark data-word="esco">esco</mark> di casa.</p>
<p>Di solito <mark data-word="arrivo">arrivo</mark> al lavoro alle otto e mezza. A volte prendo l'autobus, a volte vado a piedi se il tempo è bello.</p>`,
    vocabGlossary: [
      { italian: 'mi sveglio', english: 'I wake up (reflexive)' },
      { italian: 'mi lavo', english: 'I wash (reflexive)' },
      { italian: 'mi vesto', english: 'I get dressed (reflexive)' },
      { italian: 'colazione', english: 'breakfast' },
      { italian: 'tempo', english: 'time / weather' },
      { italian: 'esco', english: 'I go out (uscire)' },
      { italian: 'arrivo', english: 'I arrive (arrivare)' }
    ],
    questions: [
      {
        text: 'A che ora si sveglia questa persona?',
        options: ['Alle sei.', 'Alle sette.', 'Alle otto.', 'Alle sette e mezza.'],
        correctIndex: 1
      },
      {
        text: 'Cosa beve a colazione?',
        options: ['Tè.', 'Succo di frutta.', 'Un caffè.', 'Latte.'],
        correctIndex: 2
      },
      {
        text: 'Come va al lavoro a volte?',
        options: ['In macchina.', 'In bicicletta.', 'A piedi o in autobus.', 'In treno.'],
        correctIndex: 2
      },
      {
        text: 'Quando va a piedi al lavoro?',
        options: ['Sempre.', 'Mai.', 'Quando fa tardi.', 'Quando il tempo è bello.'],
        correctIndex: 3
      }
    ],
    audioUrl: null
  },
  {
    title: 'Un caffè al bar',
    level: 2,
    tags: ['daily life', 'food', 'dialogue'],
    body: `<p>In Italia il bar è un posto speciale. Si va al bar la mattina per fare <mark data-word="colazione">colazione</mark>, durante la pausa per bere un <mark data-word="caffè">caffè</mark>, e la sera per un <mark data-word="aperitivo">aperitivo</mark> con gli amici.</p>
<p>Ordinare al bar è semplice. Si va al <mark data-word="bancone">bancone</mark> e si chiede quello che si vuole. Il <mark data-word="barista">barista</mark> prepara la bevanda in pochi secondi. Di solito si <mark data-word="paga">paga</mark> prima di bere — si chiama pagare alla cassa.</p>
<p>I prezzi al bar sono bassi se si beve in piedi al bancone. Se si siede a un <mark data-word="tavolo">tavolo</mark>, il prezzo è più alto. Un caffè espresso costa di solito un euro o un euro e venti.</p>`,
    vocabGlossary: [
      { italian: 'colazione', english: 'breakfast' },
      { italian: 'caffè', english: 'coffee / espresso' },
      { italian: 'aperitivo', english: 'aperitif (pre-dinner drink with snacks)' },
      { italian: 'bancone', english: 'counter / bar' },
      { italian: 'barista', english: 'barista / bartender' },
      { italian: 'paga', english: 'pays (pagare)' },
      { italian: 'tavolo', english: 'table' }
    ],
    questions: [
      {
        text: 'Quando si va al bar la sera?',
        options: ['Per fare colazione.', 'Per un aperitivo.', 'Per studiare.', 'Per lavorare.'],
        correctIndex: 1
      },
      {
        text: 'Dove si ordina al bar?',
        options: ['Al tavolo.', 'Alla porta.', 'Al bancone.', 'Alla cassa.'],
        correctIndex: 2
      },
      {
        text: 'Quando è più caro bere al bar?',
        options: ['La mattina.', 'Se si beve in piedi.', 'Se si siede a un tavolo.', 'La domenica.'],
        correctIndex: 2
      },
      {
        text: 'Quanto costa circa un caffè espresso?',
        options: ['Cinque euro.', 'Due euro.', 'Trenta centesimi.', 'Un euro circa.'],
        correctIndex: 3
      }
    ],
    audioUrl: null
  },
  {
    title: 'Il fine settimana scorso',
    level: 2,
    tags: ['past tense', 'weekend', 'passato prossimo'],
    body: `<p>Il fine settimana scorso ho fatto molte cose. Sabato mattina mi sono <mark data-word="svegliato">svegliato</mark> tardi — alle dieci! Ho fatto colazione con calma e poi sono <mark data-word="uscito">uscito</mark> a fare una passeggiata nel parco.</p>
<p>Nel pomeriggio ho <mark data-word="incontrato">incontrato</mark> i miei amici in centro. Abbiamo preso un aperitivo e poi siamo andati al cinema. Il film era molto divertente.</p>
<p>Domenica ho <mark data-word="cucinato">cucinato</mark> il pranzo per la mia famiglia. Ho fatto la pasta al pomodoro — la mia ricetta preferita. Dopo pranzo abbiamo guardato la partita in televisione. È stata una bella giornata.</p>`,
    vocabGlossary: [
      { italian: 'svegliato', english: 'woken up (pp of svegliarsi)' },
      { italian: 'uscito', english: 'gone out (pp of uscire)' },
      { italian: 'incontrato', english: 'met / encountered (pp of incontrare)' },
      { italian: 'cucinato', english: 'cooked (pp of cucinare)' }
    ],
    questions: [
      {
        text: 'A che ora si è svegliato sabato mattina?',
        options: ['Alle sette.', 'Alle otto.', 'Alle dieci.', 'A mezzogiorno.'],
        correctIndex: 2
      },
      {
        text: 'Dove è andato nel pomeriggio?',
        options: ['Al parco.', 'In centro con gli amici.', 'A casa di un amico.', 'Al ristorante.'],
        correctIndex: 1
      },
      {
        text: 'Cosa ha fatto domenica?',
        options: ['Ha guardato solo la TV.', 'È uscito con gli amici.', 'Ha cucinato per la famiglia.', 'Ha studiato.'],
        correctIndex: 2
      },
      {
        text: 'Qual è la ricetta preferita della persona?',
        options: ['Pizza.', 'Risotto.', 'Lasagne.', 'Pasta al pomodoro.'],
        correctIndex: 3
      }
    ],
    audioUrl: null
  },
  {
    title: 'Fare la spesa',
    level: 2,
    tags: ['shopping', 'food', 'daily life'],
    body: `<p>Ogni settimana vado al supermercato a fare la <mark data-word="spesa">spesa</mark>. Prima di uscire scrivo sempre una <mark data-word="lista">lista</mark> della spesa per non dimenticare niente. Di solito compro frutta, verdura, pane, pasta e qualche cosa per cena.</p>
<p>Al supermercato guardo i <mark data-word="prezzi">prezzi</mark> e cerco le <mark data-word="offerte">offerte</mark>. Se un prodotto è in offerta, ne compro di più. Alla fine vado alla <mark data-word="cassa">cassa</mark>, pago con la carta e torno a casa.</p>
<p>A volte vado anche al <mark data-word="mercato">mercato</mark> all'aperto, dove si trova frutta e verdura più fresca e a buon prezzo. Mi piace parlare con i commercianti — sono sempre molto simpatici.</p>`,
    vocabGlossary: [
      { italian: 'spesa', english: 'grocery shopping / the shopping' },
      { italian: 'lista', english: 'list' },
      { italian: 'prezzi', english: 'prices' },
      { italian: 'offerte', english: 'offers / deals / special prices' },
      { italian: 'cassa', english: 'checkout / cash register' },
      { italian: 'mercato', english: 'market' }
    ],
    questions: [
      {
        text: 'Perché questa persona scrive una lista prima di uscire?',
        options: ['Per risparmiare denaro.', 'Per non dimenticare niente.', 'Per trovare le offerte.', 'Per arrivare prima.'],
        correctIndex: 1
      },
      {
        text: 'Come paga al supermercato?',
        options: ['In contanti.', 'Con la carta.', 'Con il telefono.', 'Non lo sappiamo.'],
        correctIndex: 1
      },
      {
        text: 'Dove si trova frutta più fresca secondo il testo?',
        options: ['Al supermercato.', 'In negozio.', 'Al mercato all\'aperto.', 'Online.'],
        correctIndex: 2
      },
      {
        text: 'Cosa fa se un prodotto è in offerta?',
        options: ['Lo ignora.', 'Ne compra di più.', 'Chiede uno sconto.', 'Lo fotografa.'],
        correctIndex: 1
      }
    ],
    audioUrl: null
  },

  // ── B1 Passages ──────────────────────────────────────────────────
  {
    title: 'Da bambino',
    level: 3,
    tags: ['imperfetto', 'childhood', 'memories'],
    body: `<p>Quando <mark data-word="ero">ero</mark> bambino, la vita era molto diversa. <mark data-word="Abitavamo">Abitavamo</mark> in un piccolo paese di montagna, lontano dalla città. Non c'erano molti negozi, non c'era internet, e la televisione <mark data-word="trasmetteva">trasmetteva</mark> solo due canali.</p>
<p>Ogni estate <mark data-word="andavamo">andavamo</mark> al mare con tutta la famiglia — i nonni, gli zii, i cugini. <mark data-word="Giocavamo">Giocavamo</mark> sulla spiaggia tutto il giorno e la sera mangiavamo tutti insieme. Quei momenti mi <mark data-word="mancano">mancano</mark> molto.</p>
<p>A scuola ero abbastanza bravo in matematica, ma non mi <mark data-word="piaceva">piaceva</mark> la storia. Il mio insegnante preferito <mark data-word="si chiamava">si chiamava</mark> il professor Ricci — era severo ma giusto, e spiegava sempre con molta pazienza.</p>`,
    vocabGlossary: [
      { italian: 'ero', english: 'I was (essere, imperfetto)' },
      { italian: 'Abitavamo', english: 'We lived / used to live (abitare, imperfetto)' },
      { italian: 'trasmetteva', english: 'broadcast / transmitted (trasmettere, imperfetto)' },
      { italian: 'andavamo', english: 'we went / used to go (andare, imperfetto)' },
      { italian: 'Giocavamo', english: 'we played / used to play (giocare, imperfetto)' },
      { italian: 'mancano', english: 'are missed — "mi mancano" = I miss them' },
      { italian: 'piaceva', english: 'was liked — "non mi piaceva" = I didn\'t like' },
      { italian: 'si chiamava', english: 'was called (chiamarsi, imperfetto)' }
    ],
    questions: [
      {
        text: 'Dove abitava da bambino questa persona?',
        options: ['In una grande città.', 'In un paese di montagna.', 'Vicino al mare.', 'All\'estero.'],
        correctIndex: 1
      },
      {
        text: 'Quanti canali trasmetteva la televisione?',
        options: ['Nessuno.', 'Uno.', 'Due.', 'Molti.'],
        correctIndex: 2
      },
      {
        text: 'Dove passava le estati da bambino?',
        options: ['In montagna.', 'All\'estero.', 'In città.', 'Al mare con la famiglia.'],
        correctIndex: 3
      },
      {
        text: 'Come era il professor Ricci?',
        options: ['Simpatico ma pigro.', 'Severo ma giusto e paziente.', 'Molto divertente.', 'Poco preparato.'],
        correctIndex: 1
      }
    ],
    audioUrl: null
  },
  {
    title: 'Un viaggio indimenticabile',
    level: 3,
    tags: ['travel', 'passato prossimo', 'imperfetto', 'B1'],
    body: `<p>L'anno scorso ho fatto un viaggio in Sicilia che non dimenticherò mai. <mark data-word="Partivo">Partivo</mark> sempre con un po' di nervosismo quando <mark data-word="viaggiavo">viaggiavo</mark> da solo, ma questa volta mi sono sentito subito a mio agio.</p>
<p>Ho <mark data-word="noleggiato">noleggiato</mark> una macchina all'aeroporto di Palermo e ho guidato lungo la costa. Ogni giorno mi <mark data-word="fermavo">fermavo</mark> in un paese diverso. Mangiavo nei ristoranti locali, <mark data-word="assaggiavo">assaggiavo</mark> piatti tipici e parlavo con la gente del posto.</p>
<p>Un pomeriggio ho <mark data-word="visitato">visitato</mark> un tempio greco che risaliva al quinto secolo avanti Cristo. <mark data-word="Mentre">Mentre</mark> camminavo tra le colonne antiche, pensavo a quante persone avevano visto quegli stessi luoghi secoli prima. È stato un momento magico.</p>`,
    vocabGlossary: [
      { italian: 'Partivo', english: 'I used to leave / I would leave (partire, imperfetto)' },
      { italian: 'viaggiavo', english: 'I was travelling / used to travel (viaggiare, imperfetto)' },
      { italian: 'noleggiato', english: 'rented (noleggiare, pp)' },
      { italian: 'fermavo', english: 'I used to stop / stopped (fermarsi, imperfetto)' },
      { italian: 'assaggiavo', english: 'I used to taste / was tasting (assaggiare, imperfetto)' },
      { italian: 'visitato', english: 'visited (visitare, pp)' },
      { italian: 'Mentre', english: 'while / whilst — used with imperfetto for background action' }
    ],
    questions: [
      {
        text: 'Come si sentiva di solito quando viaggiava da solo?',
        options: ['Entusiasta.', 'Un po\' nervoso.', 'Annoiato.', 'Stanco.'],
        correctIndex: 1
      },
      {
        text: 'Come si è spostato in Sicilia?',
        options: ['In treno.', 'In autobus.', 'Con una macchina a noleggio.', 'A piedi.'],
        correctIndex: 2
      },
      {
        text: 'Cosa faceva ogni giorno durante il viaggio?',
        options: ['Stava in albergo tutto il giorno.', 'Si fermava in un paese diverso.', 'Tornava sempre a Palermo.', 'Faceva escursioni organizzate.'],
        correctIndex: 1
      },
      {
        text: 'Perché è stato un momento magico al tempio?',
        options: ['Perché c\'era musica live.', 'Perché ha incontrato degli amici.', 'Perché pensava alla storia e a tutte le persone passate prima.', 'Perché il tramonto era bellissimo.'],
        correctIndex: 2
      }
    ],
    audioUrl: null
  }
]

// ── A2/B1 Idiomatic Expressions ─────────────────────────────────────
const IDIOMS = [
  // ── A2 Idioms (difficulty: 2) ────────────────────────────────────
  {
    idiom: 'In bocca al lupo!',
    meaning: 'Good luck!',
    literalTranslation: 'Into the wolf\'s mouth!',
    example: { it: '— Domani ho l\'esame. — In bocca al lupo!', en: '— I have the exam tomorrow. — Good luck!' },
    difficulty: 2, tags: ['encouragement'], audioUrl: null
  },
  {
    idiom: 'Costa un occhio della testa',
    meaning: 'It costs an arm and a leg',
    literalTranslation: 'It costs an eye from the head',
    example: { it: 'Quella borsa è bellissima, ma costa un occhio della testa.', en: 'That bag is beautiful, but it costs an arm and a leg.' },
    difficulty: 2, tags: ['money'], audioUrl: null
  },
  {
    idiom: 'Non vedere l\'ora',
    meaning: 'Can\'t wait / to be dying to',
    literalTranslation: 'Not to see the hour',
    example: { it: 'Non vedo l\'ora di andare in vacanza!', en: 'I can\'t wait to go on holiday!' },
    difficulty: 2, tags: ['excitement', 'time'], audioUrl: null
  },
  {
    idiom: 'Fare due passi',
    meaning: 'To go for a short walk',
    literalTranslation: 'To take two steps',
    example: { it: 'Facciamo due passi dopo cena?', en: 'Shall we go for a short walk after dinner?' },
    difficulty: 2, tags: ['daily life'], audioUrl: null
  },
  {
    idiom: 'Essere in gamba',
    meaning: 'To be capable / sharp / on the ball',
    literalTranslation: 'To be in a leg',
    example: { it: 'La nuova collega è molto in gamba.', en: 'The new colleague is very capable.' },
    difficulty: 2, tags: ['personality'], audioUrl: null
  },
  {
    idiom: 'Dormire come un ghiro',
    meaning: 'To sleep like a log',
    literalTranslation: 'To sleep like a dormouse',
    example: { it: 'Ero così stanco che ho dormito come un ghiro.', en: 'I was so tired that I slept like a log.' },
    difficulty: 2, tags: ['sleep', 'tired'], audioUrl: null
  },
  {
    idiom: 'Avere la testa fra le nuvole',
    meaning: 'To have one\'s head in the clouds / to be daydreaming',
    literalTranslation: 'To have the head among the clouds',
    example: { it: 'Non ha sentito niente — aveva la testa fra le nuvole.', en: 'He didn\'t hear anything — he had his head in the clouds.' },
    difficulty: 2, tags: ['personality', 'attention'], audioUrl: null
  },
  {
    idiom: 'Essere al verde',
    meaning: 'To be broke / to have no money',
    literalTranslation: 'To be at the green',
    example: { it: 'Non posso venire — sono al verde questo mese.', en: 'I can\'t come — I\'m broke this month.' },
    difficulty: 2, tags: ['money'], audioUrl: null
  },
  {
    idiom: 'Fare bella figura',
    meaning: 'To make a good impression',
    literalTranslation: 'To make a beautiful figure',
    example: { it: 'Si è vestita bene per fare bella figura con i colleghi.', en: 'She dressed nicely to make a good impression on her colleagues.' },
    difficulty: 2, tags: ['social', 'appearance'], audioUrl: null
  },
  {
    idiom: 'Non c\'è due senza tre',
    meaning: 'Things come in threes / bad luck comes in threes',
    literalTranslation: 'There is no two without three',
    example: { it: 'Prima il treno, poi la pioggia... non c\'è due senza tre.', en: 'First the train, then the rain... things come in threes.' },
    difficulty: 2, tags: ['luck', 'fate'], audioUrl: null
  },
  {
    idiom: 'Avere la luna storta',
    meaning: 'To be in a bad mood',
    literalTranslation: 'To have the moon crooked',
    example: { it: 'Non parlargli adesso — ha la luna storta.', en: 'Don\'t talk to him now — he\'s in a bad mood.' },
    difficulty: 2, tags: ['mood', 'personality'], audioUrl: null
  },
  {
    idiom: 'Prendere due piccioni con una fava',
    meaning: 'To kill two birds with one stone',
    literalTranslation: 'To catch two pigeons with one bean',
    example: { it: 'Faccio la spesa e passo dalla nonna — così prendo due piccioni con una fava.', en: 'I\'ll do the shopping and visit grandma — that way I kill two birds with one stone.' },
    difficulty: 2, tags: ['efficiency', 'planning'], audioUrl: null
  },
  {
    idiom: 'Avere il pollice verde',
    meaning: 'To have a green thumb / to be good with plants',
    literalTranslation: 'To have a green thumb',
    example: { it: 'Mia madre ha il pollice verde — in casa sua ci sono piante dappertutto.', en: 'My mother has a green thumb — there are plants everywhere in her house.' },
    difficulty: 2, tags: ['nature', 'hobbies'], audioUrl: null
  },
  {
    idiom: 'Fare il furbo',
    meaning: 'To try to get away with something / to be clever at others\' expense',
    literalTranslation: 'To play the clever/smart one',
    example: { it: 'Ha fatto il furbo per non pagare il biglietto.', en: 'He tried to be clever and avoid buying a ticket.' },
    difficulty: 2, tags: ['personality', 'cheating'], audioUrl: null
  },
  {
    idiom: 'Avere le mani in pasta',
    meaning: 'To have a hand in something / to be involved in something',
    literalTranslation: 'To have one\'s hands in the dough',
    example: { it: 'In quella faccenda ha le mani in pasta — so che è coinvolto.', en: 'He has a hand in that matter — I know he\'s involved.' },
    difficulty: 2, tags: ['involvement', 'business'], audioUrl: null
  },

  // ── B1 Idioms (difficulty: 3) ────────────────────────────────────
  {
    idiom: 'Fare finta di niente',
    meaning: 'To pretend nothing happened / to play dumb',
    literalTranslation: 'To pretend nothing',
    example: { it: 'Anche se sapeva tutto, ha fatto finta di niente.', en: 'Even though she knew everything, she pretended nothing had happened.' },
    difficulty: 3, tags: ['behaviour', 'deception'], audioUrl: null
  },
  {
    idiom: 'Perdere il filo',
    meaning: 'To lose track / to lose the thread of thought',
    literalTranslation: 'To lose the thread',
    example: { it: 'Ho perso il filo del discorso — puoi ricominciare?', en: 'I\'ve lost the thread — can you start again?' },
    difficulty: 3, tags: ['communication', 'thinking'], audioUrl: null
  },
  {
    idiom: 'Non stare né in cielo né in terra',
    meaning: 'To make no sense / to not hold water',
    literalTranslation: 'To be neither in the sky nor on earth',
    example: { it: 'La sua spiegazione non sta né in cielo né in terra.', en: 'His explanation makes absolutely no sense.' },
    difficulty: 3, tags: ['logic', 'communication'], audioUrl: null
  },
  {
    idiom: 'Avere il coltello dalla parte del manico',
    meaning: 'To hold all the cards / to have the upper hand',
    literalTranslation: 'To have the knife on the handle side',
    example: { it: 'In questa trattativa sono loro ad avere il coltello dalla parte del manico.', en: 'In this negotiation, they hold all the cards.' },
    difficulty: 3, tags: ['power', 'negotiation'], audioUrl: null
  },
  {
    idiom: 'Fare orecchie da mercante',
    meaning: 'To turn a deaf ear / to ignore deliberately',
    literalTranslation: 'To have merchant\'s ears',
    example: { it: 'Gli ho detto mille volte di sistemare quel rubinetto, ma fa orecchie da mercante.', en: 'I\'ve told him a thousand times to fix that tap, but he turns a deaf ear.' },
    difficulty: 3, tags: ['communication', 'ignoring'], audioUrl: null
  },
  {
    idiom: 'Cavare sangue da una rapa',
    meaning: 'To get blood from a stone / to try to get something from someone who has nothing',
    literalTranslation: 'To extract blood from a turnip',
    example: { it: 'Chiedere uno sconto a quel negoziante è come cavare sangue da una rapa.', en: 'Asking that shopkeeper for a discount is like getting blood from a stone.' },
    difficulty: 3, tags: ['effort', 'impossibility'], audioUrl: null
  },
  {
    idiom: 'Avere scheletri nell\'armadio',
    meaning: 'To have skeletons in the closet / to have hidden secrets from the past',
    literalTranslation: 'To have skeletons in the wardrobe',
    example: { it: 'Tutti hanno qualche scheletro nell\'armadio.', en: 'Everyone has some skeletons in the closet.' },
    difficulty: 3, tags: ['secrets', 'past'], audioUrl: null
  },
  {
    idiom: 'Essere due gocce d\'acqua',
    meaning: 'To be two peas in a pod / to be identical',
    literalTranslation: 'To be two drops of water',
    example: { it: 'Lui e suo fratello sono due gocce d\'acqua — impossibile distinguerli.', en: 'He and his brother are two peas in a pod — impossible to tell them apart.' },
    difficulty: 3, tags: ['similarity', 'people'], audioUrl: null
  },
  {
    idiom: 'Chi dorme non piglia pesci',
    meaning: 'The early bird gets the worm',
    literalTranslation: 'He who sleeps doesn\'t catch any fish',
    example: { it: 'Alzati! I biglietti finiscono subito — chi dorme non piglia pesci.', en: 'Get up! The tickets sell out fast — the early bird gets the worm.' },
    difficulty: 3, tags: ['motivation', 'time'], audioUrl: null
  },
  {
    idiom: 'Rompere le scatole',
    meaning: 'To annoy / to pester / to be a pain',
    literalTranslation: 'To break the boxes',
    example: { it: 'Smettila di rompermi le scatole con quella musica!', en: 'Stop annoying me with that music!' },
    difficulty: 3, tags: ['annoyance', 'colloquial'], audioUrl: null
  }
]

// Allow Node.js (seed script) to require this file while keeping browser globals intact
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VERBS, VOCAB, GRAMMAR, GRAMMAR_QUIZ, SENTENCES, READING_PASSAGES, IDIOMS }
}
