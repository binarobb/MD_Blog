// italian-data.js — A1 Italian: 30 verbs + vocabulary by topic
// All conjugations are presente indicativo

const VERBS = [
  {
    infinitive: 'essere', translation: 'to be', group: 'irregular',
    conjugation: { io: 'sono', tu: 'sei', 'lui/lei': 'è', noi: 'siamo', voi: 'siete', loro: 'sono' },
    example: { it: 'Io sono italiano.', en: 'I am Italian.' },
    examples: [
      { it: 'Lei è molto gentile.', en: 'She is very kind.' },
      { it: 'Siamo amici da molti anni.', en: 'We have been friends for many years.' },
      { it: 'Sono le tre del pomeriggio.', en: 'It is three in the afternoon.' }
    ]
  },
  {
    infinitive: 'avere', translation: 'to have', group: 'irregular',
    conjugation: { io: 'ho', tu: 'hai', 'lui/lei': 'ha', noi: 'abbiamo', voi: 'avete', loro: 'hanno' },
    example: { it: 'Tu hai un cane.', en: 'You have a dog.' },
    examples: [
      { it: 'Ho fame.', en: 'I am hungry. (lit. I have hunger)' },
      { it: 'Quanti anni hai?', en: 'How old are you? (lit. How many years do you have?)' },
      { it: 'Abbiamo una casa grande.', en: 'We have a big house.' }
    ]
  },
  {
    infinitive: 'fare', translation: 'to do / to make', group: 'irregular',
    conjugation: { io: 'faccio', tu: 'fai', 'lui/lei': 'fa', noi: 'facciamo', voi: 'fate', loro: 'fanno' },
    example: { it: 'Che cosa fai?', en: 'What are you doing?' },
    examples: [
      { it: 'Fa caldo oggi.', en: 'It is hot today. (lit. It makes hot)' },
      { it: 'Faccio colazione alle otto.', en: 'I have breakfast at eight.' },
      { it: 'Facciamo una passeggiata?', en: 'Shall we take a walk?' }
    ]
  },
  {
    infinitive: 'dire', translation: 'to say / to tell', group: 'irregular',
    conjugation: { io: 'dico', tu: 'dici', 'lui/lei': 'dice', noi: 'diciamo', voi: 'dite', loro: 'dicono' },
    example: { it: 'Lui dice la verità.', en: 'He tells the truth.' },
    examples: [
      { it: 'Come si dice in italiano?', en: 'How do you say it in Italian?' },
      { it: 'Diciamo sempre la verità.', en: 'We always tell the truth.' },
      { it: 'Mi dici il tuo nome?', en: 'Will you tell me your name?' }
    ]
  },
  {
    infinitive: 'andare', translation: 'to go', group: 'irregular',
    conjugation: { io: 'vado', tu: 'vai', 'lui/lei': 'va', noi: 'andiamo', voi: 'andate', loro: 'vanno' },
    example: { it: 'Andiamo al cinema.', en: 'We go to the cinema.' },
    examples: [
      { it: 'Vado a scuola ogni giorno.', en: 'I go to school every day.' },
      { it: 'Come va?', en: 'How is it going?' },
      { it: 'Vanno in vacanza in agosto.', en: 'They go on vacation in August.' }
    ]
  },
  {
    infinitive: 'venire', translation: 'to come', group: 'irregular',
    conjugation: { io: 'vengo', tu: 'vieni', 'lui/lei': 'viene', noi: 'veniamo', voi: 'venite', loro: 'vengono' },
    example: { it: 'Vieni con me?', en: 'Are you coming with me?' },
    examples: [
      { it: 'Da dove vieni?', en: 'Where do you come from?' },
      { it: 'Vengono alla festa stasera.', en: 'They are coming to the party tonight.' },
      { it: 'Vengo subito!', en: 'I am coming right away!' }
    ]
  },
  {
    infinitive: 'vedere', translation: 'to see', group: '-ere',
    conjugation: { io: 'vedo', tu: 'vedi', 'lui/lei': 'vede', noi: 'vediamo', voi: 'vedete', loro: 'vedono' },
    example: { it: 'Vedo il mare.', en: 'I see the sea.' },
    examples: [
      { it: 'Ci vediamo domani.', en: 'See you tomorrow.' },
      { it: 'Non vedo bene senza occhiali.', en: "I can't see well without glasses." },
      { it: 'Vedi quella stella?', en: 'Do you see that star?' }
    ]
  },
  {
    infinitive: 'dare', translation: 'to give', group: 'irregular',
    conjugation: { io: 'do', tu: 'dai', 'lui/lei': 'dà', noi: 'diamo', voi: 'date', loro: 'danno' },
    example: { it: 'Ti do un libro.', en: 'I give you a book.' },
    examples: [
      { it: 'Mi dai una mano?', en: 'Can you give me a hand?' },
      { it: 'La finestra dà sul giardino.', en: 'The window overlooks the garden.' },
      { it: 'Diamo un esame domani.', en: 'We are taking an exam tomorrow.' }
    ]
  },
  {
    infinitive: 'stare', translation: 'to stay / to be (state)', group: 'irregular',
    conjugation: { io: 'sto', tu: 'stai', 'lui/lei': 'sta', noi: 'stiamo', voi: 'state', loro: 'stanno' },
    example: { it: 'Come stai?', en: 'How are you?' },
    examples: [
      { it: 'Sto bene, grazie.', en: 'I am fine, thanks.' },
      { it: 'Stiamo a casa stasera.', en: 'We are staying home tonight.' },
      { it: 'Sta piovendo.', en: 'It is raining. (stare + gerund = continuous)' }
    ]
  },
  {
    infinitive: 'sapere', translation: 'to know (a fact)', group: 'irregular',
    conjugation: { io: 'so', tu: 'sai', 'lui/lei': 'sa', noi: 'sappiamo', voi: 'sapete', loro: 'sanno' },
    example: { it: 'Non lo so.', en: "I don't know." },
    examples: [
      { it: 'Sai dove è la stazione?', en: 'Do you know where the station is?' },
      { it: 'Sa nuotare molto bene.', en: 'He/she can swim very well.' },
      { it: 'Non sappiamo niente.', en: "We don't know anything." }
    ]
  },
  {
    infinitive: 'potere', translation: 'can / to be able to', group: 'irregular',
    conjugation: { io: 'posso', tu: 'puoi', 'lui/lei': 'può', noi: 'possiamo', voi: 'potete', loro: 'possono' },
    example: { it: 'Posso aiutarti?', en: 'Can I help you?' },
    examples: [
      { it: 'Non posso venire domani.', en: "I can't come tomorrow." },
      { it: 'Puoi parlare più piano?', en: 'Can you speak more slowly?' },
      { it: 'Possiamo sederci qui?', en: 'Can we sit here?' }
    ]
  },
  {
    infinitive: 'volere', translation: 'to want', group: 'irregular',
    conjugation: { io: 'voglio', tu: 'vuoi', 'lui/lei': 'vuole', noi: 'vogliamo', voi: 'volete', loro: 'vogliono' },
    example: { it: 'Voglio un caffè.', en: 'I want a coffee.' },
    examples: [
      { it: 'Vuoi venire con noi?', en: 'Do you want to come with us?' },
      { it: 'Vogliamo imparare l\'italiano.', en: 'We want to learn Italian.' },
      { it: 'Ci vuole pazienza.', en: 'It takes patience. (impersonal)' }
    ]
  },
  {
    infinitive: 'dovere', translation: 'must / to have to', group: 'irregular',
    conjugation: { io: 'devo', tu: 'devi', 'lui/lei': 'deve', noi: 'dobbiamo', voi: 'dovete', loro: 'devono' },
    example: { it: 'Devo studiare.', en: 'I have to study.' },
    examples: [
      { it: 'Devi andare dal dottore.', en: 'You have to go to the doctor.' },
      { it: 'Dobbiamo partire presto.', en: 'We must leave early.' },
      { it: 'Quanto ti devo?', en: 'How much do I owe you?' }
    ]
  },
  {
    infinitive: 'parlare', translation: 'to speak', group: '-are',
    conjugation: { io: 'parlo', tu: 'parli', 'lui/lei': 'parla', noi: 'parliamo', voi: 'parlate', loro: 'parlano' },
    example: { it: 'Parlo italiano.', en: 'I speak Italian.' },
    examples: [
      { it: 'Parli inglese?', en: 'Do you speak English?' },
      { it: 'Parliamo di qualcosa di bello.', en: "Let's talk about something nice." },
      { it: 'Non parlare così forte!', en: "Don't speak so loud!" }
    ]
  },
  {
    infinitive: 'mangiare', translation: 'to eat', group: '-are',
    conjugation: { io: 'mangio', tu: 'mangi', 'lui/lei': 'mangia', noi: 'mangiamo', voi: 'mangiate', loro: 'mangiano' },
    example: { it: 'Mangiamo la pizza.', en: 'We eat pizza.' },
    examples: [
      { it: 'A che ora mangi?', en: 'What time do you eat?' },
      { it: 'Mangio sempre troppo a Natale.', en: 'I always eat too much at Christmas.' },
      { it: 'Mangiate fuori stasera?', en: 'Are you eating out tonight?' }
    ]
  },
  {
    infinitive: 'bere', translation: 'to drink', group: 'irregular',
    conjugation: { io: 'bevo', tu: 'bevi', 'lui/lei': 'beve', noi: 'beviamo', voi: 'bevete', loro: 'bevono' },
    example: { it: 'Bevo acqua.', en: 'I drink water.' },
    examples: [
      { it: 'Cosa bevi?', en: 'What are you drinking?' },
      { it: 'Beviamo un bicchiere di vino.', en: "Let's drink a glass of wine." },
      { it: 'Non bevo caffè la sera.', en: "I don't drink coffee in the evening." }
    ]
  },
  {
    infinitive: 'dormire', translation: 'to sleep', group: '-ire',
    conjugation: { io: 'dormo', tu: 'dormi', 'lui/lei': 'dorme', noi: 'dormiamo', voi: 'dormite', loro: 'dormono' },
    example: { it: 'Dormite bene?', en: 'Do you sleep well?' },
    examples: [
      { it: 'Dormo otto ore ogni notte.', en: 'I sleep eight hours every night.' },
      { it: 'Il bambino dorme ancora.', en: 'The baby is still sleeping.' },
      { it: 'Non riesco a dormire.', en: "I can't fall asleep." }
    ]
  },
  {
    infinitive: 'leggere', translation: 'to read', group: '-ere',
    conjugation: { io: 'leggo', tu: 'leggi', 'lui/lei': 'legge', noi: 'leggiamo', voi: 'leggete', loro: 'leggono' },
    example: { it: 'Leggo un libro.', en: 'I read a book.' },
    examples: [
      { it: 'Cosa stai leggendo?', en: 'What are you reading?' },
      { it: 'Leggiamo il giornale la mattina.', en: 'We read the newspaper in the morning.' },
      { it: 'Mi piace leggere prima di dormire.', en: 'I like to read before sleeping.' }
    ]
  },
  {
    infinitive: 'scrivere', translation: 'to write', group: '-ere',
    conjugation: { io: 'scrivo', tu: 'scrivi', 'lui/lei': 'scrive', noi: 'scriviamo', voi: 'scrivete', loro: 'scrivono' },
    example: { it: 'Scrivo una lettera.', en: 'I write a letter.' },
    examples: [
      { it: 'Come si scrive il tuo nome?', en: 'How do you spell your name?' },
      { it: 'Scrivi un messaggio a Marco.', en: 'Write a message to Marco.' },
      { it: 'Scriviamo ogni giorno in classe.', en: 'We write every day in class.' }
    ]
  },
  {
    infinitive: 'capire', translation: 'to understand', group: '-ire (isc)',
    conjugation: { io: 'capisco', tu: 'capisci', 'lui/lei': 'capisce', noi: 'capiamo', voi: 'capite', loro: 'capiscono' },
    example: { it: 'Non capisco.', en: "I don't understand." },
    examples: [
      { it: 'Capisci l\'italiano?', en: 'Do you understand Italian?' },
      { it: 'Non capisco questa parola.', en: "I don't understand this word." },
      { it: 'Capiscono tutto ma non parlano.', en: 'They understand everything but don\'t speak.' }
    ]
  },
  {
    infinitive: 'prendere', translation: 'to take', group: '-ere',
    conjugation: { io: 'prendo', tu: 'prendi', 'lui/lei': 'prende', noi: 'prendiamo', voi: 'prendete', loro: 'prendono' },
    example: { it: 'Prendo il treno.', en: 'I take the train.' },
    examples: [
      { it: 'Cosa prendi da bere?', en: 'What will you have to drink?' },
      { it: 'Prendiamo un taxi?', en: 'Shall we take a taxi?' },
      { it: 'Prende sempre il caffè amaro.', en: 'He/she always takes coffee without sugar.' }
    ]
  },
  {
    infinitive: 'mettere', translation: 'to put', group: '-ere',
    conjugation: { io: 'metto', tu: 'metti', 'lui/lei': 'mette', noi: 'mettiamo', voi: 'mettete', loro: 'mettono' },
    example: { it: 'Metto il libro sul tavolo.', en: 'I put the book on the table.' },
    examples: [
      { it: 'Cosa ti metti stasera?', en: 'What are you wearing tonight?' },
      { it: 'Metti la giacca, fa freddo.', en: 'Put on your jacket, it is cold.' },
      { it: 'Ci mettiamo un\'ora per arrivare.', en: 'It takes us an hour to get there.' }
    ]
  },
  {
    infinitive: 'lavorare', translation: 'to work', group: '-are',
    conjugation: { io: 'lavoro', tu: 'lavori', 'lui/lei': 'lavora', noi: 'lavoriamo', voi: 'lavorate', loro: 'lavorano' },
    example: { it: 'Lavoro in ufficio.', en: 'I work in the office.' },
    examples: [
      { it: 'Dove lavori?', en: 'Where do you work?' },
      { it: 'Lavoriamo dal lunedì al venerdì.', en: 'We work from Monday to Friday.' },
      { it: 'Lavora troppo.', en: 'He/she works too much.' }
    ]
  },
  {
    infinitive: 'giocare', translation: 'to play', group: '-are',
    conjugation: { io: 'gioco', tu: 'giochi', 'lui/lei': 'gioca', noi: 'giochiamo', voi: 'giocate', loro: 'giocano' },
    example: { it: 'I bambini giocano.', en: 'The children play.' },
    examples: [
      { it: 'Giochi a calcio?', en: 'Do you play football?' },
      { it: 'Giochiamo a carte stasera.', en: "Let's play cards tonight." },
      { it: 'Gioco con il mio cane al parco.', en: 'I play with my dog at the park.' }
    ]
  },
  {
    infinitive: 'comprare', translation: 'to buy', group: '-are',
    conjugation: { io: 'compro', tu: 'compri', 'lui/lei': 'compra', noi: 'compriamo', voi: 'comprate', loro: 'comprano' },
    example: { it: 'Compro il pane.', en: 'I buy bread.' },
    examples: [
      { it: 'Dove compri la frutta?', en: 'Where do you buy fruit?' },
      { it: 'Compriamo un regalo per Maria.', en: "Let's buy a gift for Maria." },
      { it: 'Compra sempre al mercato.', en: 'He/she always buys at the market.' }
    ]
  },
  {
    infinitive: 'aprire', translation: 'to open', group: '-ire',
    conjugation: { io: 'apro', tu: 'apri', 'lui/lei': 'apre', noi: 'apriamo', voi: 'aprite', loro: 'aprono' },
    example: { it: 'Apro la porta.', en: 'I open the door.' },
    examples: [
      { it: 'A che ora apre il negozio?', en: 'What time does the shop open?' },
      { it: 'Apri il libro a pagina dieci.', en: 'Open the book to page ten.' },
      { it: 'Non aprire quella scatola!', en: "Don't open that box!" }
    ]
  },
  {
    infinitive: 'chiudere', translation: 'to close', group: '-ere',
    conjugation: { io: 'chiudo', tu: 'chiudi', 'lui/lei': 'chiude', noi: 'chiudiamo', voi: 'chiudete', loro: 'chiudono' },
    example: { it: 'Chiudi la finestra!', en: 'Close the window!' },
    examples: [
      { it: 'Il negozio chiude alle otto.', en: 'The shop closes at eight.' },
      { it: 'Chiudiamo gli occhi e ascoltiamo.', en: "Let's close our eyes and listen." },
      { it: 'Hai chiuso la porta a chiave?', en: 'Did you lock the door?' }
    ]
  },
  {
    infinitive: 'vivere', translation: 'to live', group: '-ere',
    conjugation: { io: 'vivo', tu: 'vivi', 'lui/lei': 'vive', noi: 'viviamo', voi: 'vivete', loro: 'vivono' },
    example: { it: 'Vivo a Roma.', en: 'I live in Rome.' },
    examples: [
      { it: 'Dove vivi?', en: 'Where do you live?' },
      { it: 'Viviamo in Italia da due anni.', en: 'We have been living in Italy for two years.' },
      { it: 'Vivono vicino al mare.', en: 'They live near the sea.' }
    ]
  },
  {
    infinitive: 'sentire', translation: 'to hear / to feel', group: '-ire',
    conjugation: { io: 'sento', tu: 'senti', 'lui/lei': 'sente', noi: 'sentiamo', voi: 'sentite', loro: 'sentono' },
    example: { it: 'Sento la musica.', en: 'I hear the music.' },
    examples: [
      { it: 'Non mi sento bene.', en: "I don't feel well." },
      { it: 'Senti questo profumo!', en: 'Smell this fragrance!' },
      { it: 'Ci sentiamo domani.', en: "We'll talk (hear each other) tomorrow." }
    ]
  },
  {
    infinitive: 'pensare', translation: 'to think', group: '-are',
    conjugation: { io: 'penso', tu: 'pensi', 'lui/lei': 'pensa', noi: 'pensiamo', voi: 'pensate', loro: 'pensano' },
    example: { it: 'Penso a te.', en: 'I think about you.' },
    examples: [
      { it: 'Cosa pensi di questo libro?', en: 'What do you think of this book?' },
      { it: 'Penso di sì.', en: 'I think so.' },
      { it: 'Ci penso io.', en: "I'll take care of it." }
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
