/* =====================================================================
   SLANCIO – config.js
   UNICA fonte dei dati del sito. Funziona nel browser (window.SITO)
   e in Node (require / import) per build.mjs.
   Dopo ogni modifica lancia:  node build.mjs
   ===================================================================== */
(function (root, factory) {
  var cfg = factory();
  if (typeof module === 'object' && module.exports) module.exports = cfg;
  else root.SITO = cfg;
})(typeof self !== 'undefined' ? self : this, function () {
  return {

    /* ---------- Attività ---------- */
    attivita: {
      nome: 'Slancio',                         // cambia qui: logo, titoli e testi si aggiornano
      payoff: 'Ogni sport parte da uno slancio.',
      tipo: 'Negozio di articoli sportivi',
      citta: 'Pescara',
      descrizione: 'Tutto lo sport in un solo negozio a Pescara: calcio, padel, tennis, running, nuoto, sci e altri 6 sport, con persone che ti consigliano la cosa giusta.',
      annoApertura: null                       // es. 1998 (lascia null se non lo usi)
    },

    /* ---------- Sito ---------- */
    sito: {
      bozza: true,                             // true = noindex,nofollow e niente sitemap
      // indirizzo pubblico (con / finale): serve per sitemap, canonical, og:image e dati strutturati
      urlBase: 'https://carestiadavide2004-cmd.github.io/bozza-negozio-sportivo-slancio/',
      dominio: 'slancio.example',              // per la privacy (per un cliente: es. nomenegozio.it)
      lingua: 'it',
      realizzatoDa: 'Davide Carestia',
      notaDemo: 'Progetto dimostrativo – marchi, prodotti e orari sono di esempio',
      ogImmagine: 'assets/img/og.jpg'
    },

    /* ---------- Contatti (DATI DI ESEMPIO) ---------- */
    contatti: {
      telefono: '085 000 0000',
      telefonoLink: '+390850000000',
      whatsapp: '390000000000',                // solo cifre, con prefisso internazionale
      whatsappMessaggio: 'Ciao Slancio, vorrei un\'informazione.',
      email: 'info@slancio.example',
      indirizzo: 'Via dell\'Esempio 1',
      cap: '65121',
      citta: 'Pescara',
      provincia: 'PE',
      mappaRicerca: 'Pescara centro',          // testo usato per Google Maps
      social: [
        { nome: 'Instagram', url: 'https://www.instagram.com/' },
        { nome: 'Facebook', url: 'https://www.facebook.com/' }
      ]
    },

    /* ---------- Orari (ora italiana, Europe/Rome) ----------
       0 = domenica … 6 = sabato. Ogni giorno: elenco di fasce [apre, chiude]. [] = chiuso. */
    orari: {
      fusoOrario: 'Europe/Rome',
      settimana: {
        1: [['15:30', '19:30']],
        2: [['09:00', '13:00'], ['15:30', '19:30']],
        3: [['09:00', '13:00'], ['15:30', '19:30']],
        4: [['09:00', '13:00'], ['15:30', '19:30']],
        5: [['09:00', '13:00'], ['15:30', '19:30']],
        6: [['09:00', '13:00'], ['15:30', '19:30']],
        0: []
      },
      // festività fisse (MM-GG) e chiusure straordinarie (AAAA-MM-GG)
      festivi: ['01-01', '01-06', '04-25', '05-01', '06-02', '08-15', '10-10', '11-01', '12-08', '12-25', '12-26'],
      chiusureStraordinarie: ['2027-03-29'],
      nota: 'A dicembre aperti anche la domenica pomeriggio (esempio).'
    },

    /* ---------- Dati legali (DATI DI ESEMPIO: per un cliente vero cambia solo qui) ---------- */
    legale: {
      ragioneSociale: 'Slancio S.r.l. (dati di esempio)',
      partitaIva: '00000000000',
      codiceFiscale: '00000000000',
      sedeLegale: 'Via dell\'Esempio 1, 65121 Pescara (PE)',
      emailPrivacy: 'privacy@slancio.example',
      pec: '',
      dataAggiornamento: '12 novembre 2026'
    },

    /* ---------- Modulo "Chiedi disponibilità" ----------
       modalita: 'whatsapp' (apre WhatsApp con il messaggio pronto)
                 'web3forms' (invia via email: serve accessKey da web3forms.com) */
    modulo: {
      modalita: 'whatsapp',
      web3formsAccessKey: '',
      oggettoEmail: 'Nuova richiesta dal sito Slancio'
    },

    /* ---------- Catalogo ---------- */
    catalogo: {
      mostraPrezzi: false,
      // Per aggiungere prodotti veri: nella categoria giusta riempi "prodotti" con oggetti così:
      // { nome: 'Nome prodotto', marchio: 'Marchio', prezzo: 89.9, immagine: 'assets/img/prodotti/nome.webp', disponibilita: 'disponibile' }
      // disponibilita: 'disponibile' | 'su ordinazione' | 'esaurito'
      testoDisponibilita: { 'disponibile': 'Disponibile', 'su ordinazione': 'Su ordinazione', 'esaurito': 'Esaurito' }
    },

    /* ---------- Marchi trattati (ESEMPIO, solo testo) ---------- */
    marchi: ['Leone 1947', 'Champion', 'Adidas', 'Nike', 'Puma', 'Joma', 'Kappa', 'Diadora', 'Macron', 'Mizuno', 'Asics', 'Wilson', 'Head', 'Babolat', 'Bullpadel', 'Everlast', 'Rossignol', 'Salomon', 'Speedo', 'Arena'],

    /* ---------- Home ---------- */
    home: {
      heroTitolo: ['Ogni sport', 'parte da uno', 'slancio.'],   // righe del titolo (entrano una per una)
      heroSottotitolo: '12 sport, un solo negozio a Pescara. Dal primo paio di scarpe alla divisa della tua squadra.',
      video: {
        computer: 'assets/video/hero-1920.mp4',
        telefono: 'assets/video/hero-1080x1920.mp4',
        poster: 'assets/video/hero-poster',     // senza estensione: -1280.webp e -1920.webp, -mobile.webp
        alt: 'Calciatore che colpisce il pallone di sera su un campo in erba sintetica'
      },
      numeriEsempio: [
        { valore: 12, suffisso: '', etichetta: 'sport in un solo negozio' },
        { valore: 40, suffisso: '+', etichetta: 'squadre e società seguite' },
        { valore: 6, suffisso: ' giorni', etichetta: 'aperti ogni settimana' }
      ],
      punti: [
        { icona: 'consiglio', titolo: 'Consigli competenti', testo: 'Ti chiediamo dove giochi, quanto spesso e a che livello. Poi ti mostriamo due o tre opzioni, non trenta.' },
        { icona: 'taglia', titolo: 'Prova e cambio taglia', testo: 'Scarpe e abbigliamento si provano in negozio. Se la taglia non va, la cambi con lo scontrino.' },
        { icona: 'squadra', titolo: 'Squadre e società', testo: 'Divise, tute di rappresentanza e borse per tutta la rosa, con nome e numero stampati.' },
        { icona: 'ritiro', titolo: 'Ritiro in negozio', testo: 'Scrivici cosa cerchi: se non è disponibile lo ordiniamo e ti avvisiamo quando è pronto.' }
      ],
      maglia: {
        colori: [
          { nome: 'Cobalto', hex: '#1E46F0', testo: '#FFFFFF' },
          { nome: 'Nero', hex: '#121318', testo: '#FFFFFF' },
          { nome: 'Bianco', hex: '#F6F5F1', testo: '#0E0F12' },
          { nome: 'Rosso', hex: '#D62839', testo: '#FFFFFF' },
          { nome: 'Giallo', hex: '#FFC21A', testo: '#0E0F12' },
          { nome: 'Verde', hex: '#1B7F49', testo: '#FFFFFF' }
        ],
        nomeIniziale: 'SLANCIO',
        numeroIniziale: 10
      }
    },

    /* ---------- Domande frequenti ---------- */
    faq: [
      { d: 'Vendete online?', r: 'No: il sito è una vetrina. Scrivici su WhatsApp cosa cerchi e ti diciamo subito se è disponibile e quando puoi passare.' },
      { d: 'Posso prenotare un articolo?', r: 'Sì. Lo teniamo da parte per qualche giorno, oppure lo ordiniamo e ti avvisiamo quando arriva.' },
      { d: 'Fate preventivi per squadre e società?', r: 'Sì, per divise, tute, borse e kit completi, con stampa di nomi, numeri e stemma.' },
      { d: 'Posso cambiare la taglia?', r: 'Sì, con lo scontrino e l\'articolo integro, entro i tempi indicati in negozio.' }
    ],

    /* ---------- SPORT ----------
       slug: nome della cartella (sport/slug/)
       accento: colore dello sport · testoAccento: colore del testo sopra l'accento
       campo: disegno delle linee (calcio, calcetto, basket, pallavolo, tennis, padel, ring, sci, piscina, pista, fitness, ciclismo)
       hero / tessera / foto categoria: { file, alt } (file = nome base in assets/img, senza misura) oppure null
       icona categoria: usata se la foto è null */
    sport: [
      {
        slug: 'calcio', numero: '01', nome: 'Calcio', accento: '#22A45D', testoAccento: '#0E0F12', campo: 'calcio',
        frase: 'Dal pulcino alla prima squadra: scarpe, divise e tutto quello che va in borsa.',
        hero: { file: 'calcio-hero', alt: 'Due calciatrici si contendono il pallone su un campo in erba', posizione: '45% 50%' },
        tessera: { file: 'calcio-tessera', alt: 'Calciatore con il numero 5 di spalle su un campo coperto' },
        categorie: [
          { slug: 'scarpe-da-calcio', titolo: 'Scarpe da calcio', icona: 'scarpa', foto: { file: 'calcio-scarpe-da-calcio', alt: 'Scarpe da calcio con tacchetti sull\'erba sintetica' },
            descrizione: 'La suola si sceglie in base al terreno su cui giochi. Ti aiutiamo a capire quale fondo frequenti di più.',
            tipologie: ['FG – erba naturale', 'AG – erba sintetica', 'SG – terreno morbido', 'TF – sintetico corto', 'MG – multiterreno'], prodotti: [] },
          { slug: 'maglie-e-divise', titolo: 'Maglie e divise', icona: 'maglia', foto: { file: 'calcio-maglie-e-divise', alt: 'Maglie da calcio appese con il numero sul retro' },
            descrizione: 'Maglie da gara e da allenamento, per un giocatore o per tutta la rosa, con nome e numero stampati.',
            tipologie: ['Maniche corte', 'Maniche lunghe', 'Kit gara completi', 'Divise da allenamento', 'Stampa nome e numero'], prodotti: [] },
          { slug: 'pantaloncini-e-calzettoni', titolo: 'Pantaloncini e calzettoni', icona: 'calza', foto: null,
            descrizione: 'Pantaloncini da gara, calzettoni nei colori sociali e calze con inserti antiscivolo.',
            tipologie: ['Pantaloncini da gara', 'Calzettoni', 'Calze antiscivolo', 'Sottopantaloncini'], prodotti: [] },
          { slug: 'tute-e-felpe', titolo: 'Tute e felpe', icona: 'felpa', foto: { file: 'calcio-tute-e-felpe', alt: 'Allenatore in tuta sportiva a bordo campo' },
            descrizione: 'Tute di rappresentanza e da allenamento, felpe e giacche per le serate fredde a bordo campo.',
            tipologie: ['Tute di rappresentanza', 'Tute da allenamento', 'Felpe con zip', 'Giacche antipioggia'], prodotti: [] },
          { slug: 'portieri', titolo: 'Portieri', icona: 'guanto', foto: { file: 'calcio-portieri', alt: 'Portiere in tuffo con i guanti verso il pallone' },
            descrizione: 'Guanti con tagli diversi e divise imbottite. La presa cambia molto da un taglio all\'altro: provali.',
            tipologie: ['Taglio negativo', 'Taglio piatto', 'Taglio roll finger', 'Divise imbottite'], prodotti: [] },
          { slug: 'parastinchi-e-protezioni', titolo: 'Parastinchi e protezioni', icona: 'parastinchi', foto: null,
            descrizione: 'Parastinchi in più misure, con o senza protezione per la caviglia, e i fermaparastinchi.',
            tipologie: ['Parastinchi a fodero', 'Con cavigliera', 'Fermaparastinchi', 'Misure junior'], prodotti: [] },
          { slug: 'palloni', titolo: 'Palloni', icona: 'pallone', foto: { file: 'calcio-palloni', alt: 'Palloni da calcio sull\'erba davanti a una porta' },
            descrizione: 'Palloni da gara e da allenamento nelle misure per bambini, ragazzi e adulti.',
            tipologie: ['Misura 3', 'Misura 4', 'Misura 5', 'Da gara', 'Da allenamento'], prodotti: [] },
          { slug: 'borse-e-zaini', titolo: 'Borse e zaini', icona: 'borsa', foto: null,
            descrizione: 'Borsoni, zaini con scomparto per le scarpe e sacche leggere per l\'allenamento.',
            tipologie: ['Borsoni', 'Zaini con scomparto scarpe', 'Sacche', 'Borracce'], prodotti: [] }
        ],
        consigli: [
          { titolo: 'Parti dal terreno', testo: 'Prima di guardare il modello, pensa a dove giochi più spesso: erba naturale, sintetico o terra. Ogni fondo ha la sua suola.' },
          { titolo: 'Prova le scarpe con i calzettoni', testo: 'Porta i calzettoni da gara quando provi le scarpe: lo spessore cambia la calzata. Tra punta e alluce lascia mezzo dito.' },
          { titolo: 'Parastinchi della misura giusta', testo: 'Il parastinco deve coprire la tibia da poco sopra la caviglia a poco sotto il ginocchio. Le misure seguono l\'altezza.' }
        ]
      },
      {
        slug: 'calcetto', numero: '02', nome: 'Calcetto', accento: '#14B8C8', testoAccento: '#0E0F12', campo: 'calcetto',
        frase: 'Calcio a 5 e a 7: scarpe per il sintetico e il parquet, kit per la squadra del giovedì.',
        hero: { file: 'calcetto-hero', alt: 'Partita di calcio a 5 in un palazzetto', posizione: '50% 50%' },
        tessera: { file: 'calcetto-tessera', alt: 'Giocatore di calcetto con la maglia numero 24 in palestra' },
        categorie: [
          { slug: 'scarpe-da-calcetto', titolo: 'Scarpe da calcetto', icona: 'scarpa', foto: null,
            descrizione: 'Suola in gomma piatta per il parquet, con piccoli tacchetti per il sintetico. Ti consigliamo in base al campo.',
            tipologie: ['IC – indoor e parquet', 'TF – sintetico', 'Suola in gomma', 'Calcio a 5'], prodotti: [] },
          { slug: 'maglie-e-kit-squadra', titolo: 'Maglie e kit squadra', icona: 'maglia', foto: { file: 'calcetto-maglie-e-kit-squadra', alt: 'Giocatore in maglia gialla numero 13 che calcia verso la porta' },
            descrizione: 'Kit completi per la squadra del torneo, casacche da allenamento e maglie da portiere.',
            tipologie: ['Kit completi', 'Nome e numero', 'Casacche', 'Maglie portiere'], prodotti: [] },
          { slug: 'pantaloncini-e-calze', titolo: 'Pantaloncini e calze', icona: 'calza', foto: null,
            descrizione: 'Pantaloncini leggeri, calze corte o lunghe e calze con inserti antiscivolo.',
            tipologie: ['Pantaloncini', 'Calze corte', 'Calzettoni', 'Calze antiscivolo'], prodotti: [] },
          { slug: 'parastinchi-e-guanti', titolo: 'Parastinchi e guanti', icona: 'guanto', foto: null,
            descrizione: 'Parastinchi leggeri e compatti e guanti da portiere pensati per il calcio a 5.',
            tipologie: ['Parastinchi leggeri', 'Parastinchi a fodero', 'Guanti da portiere', 'Misure junior'], prodotti: [] },
          { slug: 'palloni', titolo: 'Palloni', icona: 'pallone', foto: { file: 'calcetto-palloni', alt: 'Palloni da calcio a 5 sul parquet scuro' },
            descrizione: 'Palloni a rimbalzo controllato per il calcio a 5 e palloni per il sintetico all\'aperto.',
            tipologie: ['Misura 4 a rimbalzo controllato', 'Per sintetico', 'Da allenamento'], prodotti: [] },
          { slug: 'borse-e-zaini', titolo: 'Borse e zaini', icona: 'borsa', foto: null,
            descrizione: 'Zaini compatti e borse con scomparto separato per scarpe e indumenti bagnati.',
            tipologie: ['Zaini', 'Borse a tracolla', 'Sacche scarpe', 'Borracce'], prodotti: [] }
        ],
        consigli: [
          { titolo: 'Parquet o sintetico?', testo: 'Sul parquet serve una suola liscia in gomma che non lascia segni; sul sintetico vanno meglio i tacchetti corti in gomma.' },
          { titolo: 'Il pallone giusto', testo: 'Nel calcio a 5 si usa un pallone di misura 4 che rimbalza meno: si controlla meglio a terra.' },
          { titolo: 'Kit per tutta la squadra', testo: 'Per un torneo conviene ordinare con qualche settimana di anticipo, così c\'è tempo per la stampa di nomi e numeri.' }
        ]
      },
      {
        slug: 'basket', numero: '03', nome: 'Basket', accento: '#F47B20', testoAccento: '#0E0F12', campo: 'basket',
        frase: 'Dal minibasket al campionato: scarpe, divise e palloni per ogni categoria.',
        hero: { file: 'basket-hero', alt: 'Pallone da basket che scende dal canestro', posizione: '30% 50%' },
        tessera: { file: 'basket-tessera', alt: 'Giocatore che schiaccia a canestro sotto un cielo azzurro' },
        categorie: [
          { slug: 'scarpe', titolo: 'Scarpe', icona: 'scarpa', foto: { file: 'basket-scarpe', alt: 'Scarpa da basket su un campo all\'aperto' },
            descrizione: 'Scarpe a taglio alto, medio o basso, per il parquet o per il campetto all\'aperto.',
            tipologie: ['Taglio alto', 'Taglio medio', 'Taglio basso', 'Indoor', 'Outdoor'], prodotti: [] },
          { slug: 'canotte-e-pantaloncini', titolo: 'Canotte e pantaloncini', icona: 'canotta', foto: { file: 'basket-canotte-e-pantaloncini', alt: 'Giocatore di basket in canotta blu numero 13' },
            descrizione: 'Divise da gara anche reversibili, pantaloncini lunghi e maglie da riscaldamento.',
            tipologie: ['Canotte reversibili', 'Divise da squadra', 'Pantaloncini', 'Maglie da riscaldamento'], prodotti: [] },
          { slug: 'tute-e-felpe', titolo: 'Tute e felpe', icona: 'felpa', foto: null,
            descrizione: 'Tute di squadra, felpe con cappuccio e pantaloni per il riscaldamento prima della partita.',
            tipologie: ['Tute di squadra', 'Felpe con cappuccio', 'Pantaloni da riscaldamento'], prodotti: [] },
          { slug: 'palloni', titolo: 'Palloni', icona: 'basket', foto: { file: 'basket-palloni', alt: 'Due palloni da basket sul parquet' },
            descrizione: 'La misura dipende dall\'età e dalla categoria. Per il campetto all\'aperto serve un pallone più resistente.',
            tipologie: ['Misura 5 – minibasket', 'Misura 6 – femminile e giovanili', 'Misura 7 – maschile', 'Indoor', 'Outdoor'], prodotti: [] },
          { slug: 'protezioni-e-accessori', titolo: 'Protezioni e accessori', icona: 'protezione', foto: null,
            descrizione: 'Ginocchiere, cavigliere, calze tecniche e fasce per allenamenti e partite.',
            tipologie: ['Ginocchiere', 'Cavigliere', 'Calze tecniche', 'Fasce'], prodotti: [] }
        ],
        consigli: [
          { titolo: 'Taglio alto o basso?', testo: 'È soprattutto una questione di sensazione: il taglio alto avvolge di più la caviglia, quello basso lascia più libertà. Provali entrambi.' },
          { titolo: 'Indoor o outdoor', testo: 'Sul cemento suola e pallone si consumano più in fretta: per il campetto scegli prodotti pensati per l\'esterno.' },
          { titolo: 'La misura del pallone', testo: 'In genere: misura 5 per il minibasket, 6 per le giovanili e il femminile, 7 per il maschile. Controlla il regolamento del tuo campionato.' }
        ]
      },
      {
        slug: 'pallavolo', numero: '04', nome: 'Pallavolo', accento: '#FFC21A', testoAccento: '#0E0F12', campo: 'pallavolo',
        frase: 'Per chi salta a muro e per chi si tuffa in difesa: scarpe, divise e ginocchiere.',
        hero: { file: 'pallavolo-hero', alt: 'Schiacciata contro il muro durante un allenamento di pallavolo', posizione: '45% 40%' },
        tessera: { file: 'pallavolo-tessera', alt: 'Pallavolista in salto per la battuta' },
        categorie: [
          { slug: 'scarpe', titolo: 'Scarpe', icona: 'scarpa', foto: { file: 'pallavolo-scarpe', alt: 'Pallavoliste che si allacciano le scarpe sul parquet' },
            descrizione: 'Scarpe da indoor con suola in gomma che fa presa sul parquet e intersuola ammortizzata.',
            tipologie: ['Indoor', 'Taglio basso', 'Taglio medio', 'Suola in gomma'], prodotti: [] },
          { slug: 'divise', titolo: 'Divise', icona: 'maglia', foto: { file: 'pallavolo-divise', alt: 'Pallavolista di spalle con la maglia numero 9' },
            descrizione: 'Maglie e pantaloncini da gara per la squadra, con la maglia del libero di colore diverso.',
            tipologie: ['Maglie da gara', 'Pantaloncini', 'Maglia libero', 'Nome e numero'], prodotti: [] },
          { slug: 'ginocchiere-e-protezioni', titolo: 'Ginocchiere e protezioni', icona: 'protezione', foto: { file: 'pallavolo-ginocchiere-e-protezioni', alt: 'Pallavolista con le ginocchiere in posizione di ricezione' },
            descrizione: 'Ginocchiere imbottite in più spessori, gomitiere e cavigliere. Si provano: la taglia conta.',
            tipologie: ['Ginocchiere', 'Gomitiere', 'Cavigliere', 'Calze tecniche'], prodotti: [] },
          { slug: 'palloni', titolo: 'Palloni', icona: 'volley', foto: { file: 'pallavolo-palloni', alt: 'Pallone da pallavolo sul parquet tra due giocatrici' },
            descrizione: 'Palloni da indoor per gara e allenamento, palloni da beach volley e per il minivolley.',
            tipologie: ['Indoor', 'Beach volley', 'Minivolley', 'Allenamento'], prodotti: [] },
          { slug: 'borse-e-accessori', titolo: 'Borse e accessori', icona: 'borsa', foto: null,
            descrizione: 'Zaini, borse porta palloni per le società, borracce e fasce.',
            tipologie: ['Zaini', 'Borse porta palloni', 'Borracce', 'Fasce'], prodotti: [] }
        ],
        consigli: [
          { titolo: 'Scarpe solo per la palestra', testo: 'Usa le scarpe da pallavolo solo in palestra: fuori la suola si sporca e perde presa sul parquet.' },
          { titolo: 'Ginocchiere della taglia giusta', testo: 'Devono restare ferme sul ginocchio senza stringere. Provale piegando le gambe come in difesa.' },
          { titolo: 'Indoor o beach', testo: 'Il pallone da beach volley è più morbido e leggermente più grande: non usarlo in palestra e viceversa.' }
        ]
      },
      {
        slug: 'tennis', numero: '05', nome: 'Tennis', accento: '#C65B3A', testoAccento: '#0E0F12', campo: 'tennis',
        frase: 'Racchette, corde e scarpe per la terra rossa e il cemento. Ti aiutiamo a scegliere.',
        hero: { file: 'tennis-hero', alt: 'Pallina da tennis sulla terra rossa vicino alla linea di fondo', posizione: '55% 50%' },
        tessera: { file: 'tennis-tessera', alt: 'Tennista che colpisce di rovescio su un campo blu' },
        categorie: [
          { slug: 'racchette', titolo: 'Racchette', icona: 'racchetta', foto: { file: 'tennis-racchette', alt: 'Due racchette da tennis e una pallina sul campo verde' },
            descrizione: 'Racchette per adulti e junior. Peso, ovale e bilanciamento cambiano molto la sensazione in campo.',
            tipologie: ['Ovale grande', 'Peso leggero', 'Peso medio', 'Junior per altezza', 'Misure del manico'], prodotti: [] },
          { slug: 'scarpe', titolo: 'Scarpe', icona: 'scarpa', foto: { file: 'tennis-scarpe', alt: 'Scarpe da tennis sulla terra rossa' },
            descrizione: 'Scarpe con suola a spina di pesce per la terra rossa, suole più resistenti per il cemento.',
            tipologie: ['Terra rossa', 'Cemento', 'Erba sintetica', 'Tutti i campi'], prodotti: [] },
          { slug: 'abbigliamento', titolo: 'Abbigliamento', icona: 'maglia', foto: { file: 'tennis-abbigliamento', alt: 'Tennista in completo bianco su un campo in cemento' },
            descrizione: 'Polo, t-shirt traspiranti, shorts e gonne, tute e cappellini per le giornate di sole.',
            tipologie: ['Polo e t-shirt', 'Shorts e gonne', 'Tute', 'Cappellini e fasce'], prodotti: [] },
          { slug: 'palline', titolo: 'Palline', icona: 'pallina', foto: { file: 'tennis-palline', alt: 'Pallina da tennis sulla terra rossa' },
            descrizione: 'Palline pressurizzate in tubo, depressurizzate per il cesto e palline più lente per i bambini.',
            tipologie: ['Pressurizzate', 'Depressurizzate', 'Bambini: rossa, arancione, verde'], prodotti: [] },
          { slug: 'borse-e-sacche', titolo: 'Borse e sacche', icona: 'borsa', foto: null,
            descrizione: 'Borse da 3 a 12 racchette, anche con scomparto termico, e zaini con porta racchetta.',
            tipologie: ['Da 3 racchette', 'Da 6 a 12 racchette', 'Scomparto termico', 'Zaini'], prodotti: [] },
          { slug: 'accessori', titolo: 'Accessori (corde, overgrip, polsini)', icona: 'grip', foto: null,
            descrizione: 'Corde in matassa, overgrip, antivibrazione e polsini. Incordatura su richiesta.',
            tipologie: ['Corde monofilamento', 'Corde multifilamento', 'Overgrip', 'Antivibrazione', 'Polsini'], prodotti: [] }
        ],
        consigli: [
          { titolo: 'Peso e ovale', testo: 'Una racchetta più leggera e con ovale grande perdona di più; una più pesante dà stabilità ma chiede tecnica. Provane due prima di scegliere.' },
          { titolo: 'La misura del manico', testo: 'Impugnando la racchetta deve restare circa un dito di spazio tra la punta delle dita e il palmo. In negozio la misuriamo insieme.' },
          { titolo: 'Scarpe per il tuo campo', testo: 'Sulla terra rossa la suola a spina di pesce fa scivolare il giusto e non trattiene la terra; sul cemento serve una suola più resistente.' }
        ]
      },
      {
        slug: 'padel', numero: '06', nome: 'Padel', accento: '#8C6CF7', testoAccento: '#0E0F12', campo: 'padel',
        frase: 'Il gioco che tutti stanno provando: racchette, scarpe e palline per iniziare bene.',
        hero: { file: 'padel-hero', alt: 'Campi da padel coperti con la superficie blu', posizione: '50% 50%' },
        tessera: { file: 'padel-tessera', alt: 'Giocatrice di padel in maglia arancione durante una partita' },
        categorie: [
          { slug: 'racchette', titolo: 'Racchette', icona: 'padel', foto: { file: 'padel-racchette', alt: 'Racchetta da padel e pallina sul campo blu' },
            descrizione: 'La forma della racchetta cambia il gioco: più controllo, più equilibrio o più potenza.',
            tipologie: ['Rotonda – controllo', 'Goccia – equilibrio', 'Diamante – potenza', 'Junior'], prodotti: [] },
          { slug: 'scarpe', titolo: 'Scarpe', icona: 'scarpa', foto: null,
            descrizione: 'Suole pensate per l\'erba sintetica con sabbia, per spostamenti laterali rapidi.',
            tipologie: ['Suola a spina di pesce', 'Suola mista', 'Rinforzo laterale'], prodotti: [] },
          { slug: 'abbigliamento', titolo: 'Abbigliamento', icona: 'maglia', foto: { file: 'padel-abbigliamento', alt: 'Giocatrice di padel in un campo coperto' },
            descrizione: 'T-shirt e polo traspiranti, shorts, gonne e felpe leggere per le partite serali.',
            tipologie: ['T-shirt e polo', 'Shorts e gonne', 'Felpe leggere'], prodotti: [] },
          { slug: 'palline', titolo: 'Palline', icona: 'pallina', foto: null,
            descrizione: 'Palline specifiche per il padel, con pressione leggermente più bassa di quelle da tennis.',
            tipologie: ['Tubi da 3', 'Confezioni multiple', 'Per allenamento'], prodotti: [] },
          { slug: 'borse-e-paletteros', titolo: 'Borse e paletteros', icona: 'borsa', foto: null,
            descrizione: 'Paletteros con scomparto per due racchette, zaini e borse termiche per le giornate calde.',
            tipologie: ['Paletteros', 'Zaini porta racchetta', 'Borse termiche'], prodotti: [] },
          { slug: 'accessori', titolo: 'Accessori', icona: 'grip', foto: null,
            descrizione: 'Overgrip, protezioni per il telaio, polsini e lacci da polso.',
            tipologie: ['Overgrip', 'Protezioni telaio', 'Polsini', 'Lacci da polso'], prodotti: [] }
        ],
        consigli: [
          { titolo: 'Se inizi, scegli il controllo', testo: 'Una racchetta rotonda ha il punto di impatto più ampio e vicino al manico: per chi comincia è la scelta più semplice.' },
          { titolo: 'Non usare le scarpe da running', testo: 'Nel padel ci si muove di lato: servono scarpe con suola da campo e tomaia rinforzata, non scarpe da corsa.' },
          { titolo: 'Palline da padel, non da tennis', testo: 'Le palline da padel hanno meno pressione: con quelle da tennis il rimbalzo cambia e il gioco diventa diverso.' }
        ]
      },
      {
        slug: 'pugilato-e-combattimento', numero: '07', nome: 'Pugilato e combattimento', nomeBreve: 'Pugilato', accento: '#E0283E', testoAccento: '#FFFFFF', campo: 'ring',
        frase: 'Guantoni, protezioni e attrezzi per boxe, kickboxing e sport da combattimento.',
        hero: { file: 'pugilato-e-combattimento-hero', alt: 'Due pugili con il caschetto durante lo sparring, in bianco e nero', posizione: '50% 40%' },
        tessera: { file: 'pugilato-e-combattimento-tessera', alt: 'Pugile appoggiato alle corde del ring, in bianco e nero' },
        categorie: [
          { slug: 'guantoni', titolo: 'Guantoni', icona: 'guantone', foto: { file: 'pugilato-e-combattimento-guantoni', alt: 'Guantone da boxe bianco su sfondo scuro' },
            descrizione: 'Guantoni da sacco e da sparring in diversi pesi, misurati in once. Il peso giusto dipende dall\'uso.',
            tipologie: ['Da sacco', 'Da sparring', 'Da 8 a 16 once', 'Guanti MMA'], prodotti: [] },
          { slug: 'caschetti-e-protezioni', titolo: 'Caschetti e protezioni', icona: 'casco', foto: null,
            descrizione: 'Caschetti, paradenti, conchiglie e paratibie. Verifica sempre cosa chiede la tua federazione.',
            tipologie: ['Caschetti', 'Paradenti', 'Conchiglia', 'Paratibie', 'Paraseno'], prodotti: [] },
          { slug: 'sacchi-e-colpitori', titolo: 'Sacchi e colpitori', icona: 'sacco', foto: { file: 'pugilato-e-combattimento-sacchi-e-colpitori', alt: 'Sacchi da boxe appesi in una palestra' },
            descrizione: 'Sacchi pesanti, sacchi a pera, colpitori e paracolpi per palestre e allenamento a casa.',
            tipologie: ['Sacchi pesanti', 'Sacchi a pera', 'Colpitori', 'Paracolpi'], prodotti: [] },
          { slug: 'abbigliamento-e-scarpe', titolo: 'Abbigliamento e scarpe', icona: 'scarpa', foto: null,
            descrizione: 'Scarpe da boxe leggere con suola sottile, pantaloncini, canotte e tute.',
            tipologie: ['Scarpe da boxe', 'Pantaloncini', 'Canotte', 'Tute'], prodotti: [] },
          { slug: 'bende-corde-e-accessori', titolo: 'Bende, corde e accessori', icona: 'corda', foto: { file: 'pugilato-e-combattimento-bende-corde-e-accessori', alt: 'Allenatore che aiuta un atleta a infilare i guantoni' },
            descrizione: 'Bende elastiche in più lunghezze, corde per saltare e borse per l\'attrezzatura.',
            tipologie: ['Bende elastiche', 'Corde da salto', 'Borse', 'Asciugamani'], prodotti: [] }
        ],
        consigli: [
          { titolo: 'Il peso dei guantoni', testo: 'Per lo sparring si usano guantoni più pesanti, in genere da 14 a 16 once; per il sacco ne bastano di più leggeri. Chiedi al tuo maestro.' },
          { titolo: 'Sotto i guantoni, le bende', testo: 'Le bende tengono ferme le articolazioni della mano e assorbono il sudore. Imparare a metterle è il primo allenamento.' },
          { titolo: 'Protezioni da regolamento', testo: 'Ogni disciplina e ogni federazione ha le sue regole sulle protezioni: controllale prima di comprare per gare o esami.' }
        ]
      },
      {
        slug: 'sci-e-snowboard', numero: '08', nome: 'Sci e snowboard', nomeBreve: 'Sci', accento: '#9ED0F5', testoAccento: '#0E0F12', campo: 'sci',
        frase: 'Il Gran Sasso e la Majella sono a un\'ora: vestiti a strati e parti preparato.',
        hero: { file: 'sci-e-snowboard-hero', alt: 'Sciatore in curva su una pista innevata', posizione: '50% 50%' },
        tessera: { file: 'sci-e-snowboard-tessera', alt: 'Snowboarder in salto contro il cielo' },
        categorie: [
          { slug: 'giacche-e-pantaloni', titolo: 'Giacche e pantaloni', icona: 'giacca', foto: { file: 'sci-e-snowboard-giacche-e-pantaloni', alt: 'Sciatore con giacca e casco davanti alle montagne' },
            descrizione: 'Giacche imbottite o a guscio e pantaloni impermeabili, anche con bretelle per i bambini.',
            tipologie: ['Giacche imbottite', 'Gusci', 'Pantaloni', 'Tute intere bambino'], prodotti: [] },
          { slug: 'strati-termici', titolo: 'Strati termici', icona: 'strati', foto: null,
            descrizione: 'Primo strato a contatto con la pelle e secondo strato in pile: la base del vestirsi a strati.',
            tipologie: ['Primo strato', 'Pile', 'Lana merino', 'Sintetico'], prodotti: [] },
          { slug: 'caschi-e-maschere', titolo: 'Caschi e maschere', icona: 'maschera', foto: { file: 'sci-e-snowboard-caschi-e-maschere', alt: 'Sciatore con casco e maschera a specchio' },
            descrizione: 'Caschi regolabili e maschere con lenti per sole o poca luce, anche da indossare sopra gli occhiali.',
            tipologie: ['Caschi', 'Maschere', 'Lenti per poca luce', 'Sopra gli occhiali (OTG)'], prodotti: [] },
          { slug: 'guanti-e-accessori', titolo: 'Guanti e accessori', icona: 'guanto', foto: null,
            descrizione: 'Guanti e moffole, scaldacollo, sottocasco e calze da sci alte.',
            tipologie: ['Guanti', 'Moffole', 'Scaldacollo', 'Calze da sci'], prodotti: [] },
          { slug: 'scarponi-e-attrezzi', titolo: 'Scarponi e attrezzi (su richiesta)', icona: 'scarpone', foto: { file: 'sci-e-snowboard-scarponi-e-attrezzi', alt: 'Sci e bastoncini piantati nella neve' },
            descrizione: 'Scarponi, sci, tavole e attacchi li ordiniamo su richiesta. Passa in negozio per la misura del piede.',
            tipologie: ['Scarponi', 'Sci', 'Tavole snowboard', 'Attacchi', 'Bastoncini'], prodotti: [] }
        ],
        consigli: [
          { titolo: 'Vestiti a strati', testo: 'Primo strato che allontana il sudore, uno strato caldo in pile e sopra una giacca impermeabile. Togli o aggiungi a seconda del meteo.' },
          { titolo: 'Casco e maschera insieme', testo: 'Prova casco e maschera insieme: non deve restare spazio scoperto sulla fronte e la maschera non deve premere sul naso.' },
          { titolo: 'Calze sottili, non doppie', testo: 'Negli scarponi va una calza da sci sola: due calze stringono il piede e fanno sentire più freddo.' }
        ]
      },
      {
        slug: 'nuoto', numero: '09', nome: 'Nuoto', accento: '#1F9BDB', testoAccento: '#0E0F12', campo: 'piscina',
        frase: 'Per il corso dei bambini, per l\'agonismo e per chi nuota la mattina presto.',
        hero: { file: 'nuoto-hero', alt: 'Nuotatore a farfalla in piscina', posizione: '50% 50%' },
        tessera: { file: 'nuoto-tessera', alt: 'Nuotatrice con cuffia e occhialini che prende aria' },
        categorie: [
          { slug: 'costumi', titolo: 'Costumi', icona: 'costume', foto: null,
            descrizione: 'Costumi da allenamento in tessuti resistenti al cloro, costumi da gara e modelli per bambini.',
            tipologie: ['Da allenamento', 'Resistenti al cloro', 'Da gara', 'Bambini'], prodotti: [] },
          { slug: 'occhialini-e-cuffie', titolo: 'Occhialini e cuffie', icona: 'occhialini', foto: { file: 'nuoto-occhialini-e-cuffie', alt: 'Nuotatore con cuffia e occhialini a bordo vasca' },
            descrizione: 'Occhialini con lenti chiare, fumé o a specchio, cuffie in silicone e in tessuto.',
            tipologie: ['Lenti chiare', 'Lenti fumé', 'Lenti a specchio', 'Cuffie in silicone', 'Cuffie in tessuto'], prodotti: [] },
          { slug: 'accappatoi-e-teli', titolo: 'Accappatoi e teli', icona: 'telo', foto: null,
            descrizione: 'Accappatoi in microfibra leggeri e veloci da asciugare, in spugna, teli e ponchi per bambini.',
            tipologie: ['Microfibra', 'Spugna', 'Teli', 'Ponchi bambino'], prodotti: [] },
          { slug: 'accessori-e-attrezzi', titolo: 'Accessori e attrezzi', icona: 'tavoletta', foto: null,
            descrizione: 'Tavolette, pull buoy, pinne corte, palette e tappanaso per allenamenti più vari.',
            tipologie: ['Tavolette', 'Pull buoy', 'Pinne corte', 'Palette', 'Tappanaso'], prodotti: [] },
          { slug: 'zaini-e-borse', titolo: 'Zaini e borse', icona: 'borsa', foto: null,
            descrizione: 'Zaini con tasca separata per il bagnato, sacche a rete per gli attrezzi.',
            tipologie: ['Zaini con tasca bagnato', 'Sacche a rete', 'Borse impermeabili'], prodotti: [] }
        ],
        consigli: [
          { titolo: 'Occhialini che tengono', testo: 'Appoggiali sugli occhi senza elastico: se restano attaccati per un attimo, la forma è quella giusta per il tuo viso.' },
          { titolo: 'Costume per il cloro', testo: 'Per chi nuota spesso conviene un tessuto resistente al cloro: dura di più e mantiene la forma.' },
          { titolo: 'Sciacqua tutto dopo l\'uso', testo: 'Costume, cuffia e occhialini vanno sciacquati in acqua dolce e fatti asciugare all\'ombra, non sul termosifone.' }
        ]
      },
      {
        slug: 'running', numero: '10', nome: 'Running', accento: '#FF6B4A', testoAccento: '#0E0F12', campo: 'pista',
        frase: 'Dalla riviera al trail in montagna: scarpe e abbigliamento per ogni uscita.',
        hero: { file: 'running-hero', alt: 'Runner su una pista vista dall\'alto', posizione: '45% 50%' },
        tessera: { file: 'running-tessera', alt: 'Ombra lunga di un runner sulla pista rossa al tramonto' },
        categorie: [
          { slug: 'scarpe-da-corsa', titolo: 'Scarpe da corsa', icona: 'scarpa', foto: { file: 'running-scarpe-da-corsa', alt: 'Runner che si allaccia la scarpa sulla pista' },
            descrizione: 'Scarpe da strada e da trail, più ammortizzate o più leggere. Le scegliamo insieme in base alle tue uscite.',
            tipologie: ['Strada', 'Trail', 'Ammortizzate', 'Leggere', 'Neutre o con stabilità'], prodotti: [] },
          { slug: 'abbigliamento-tecnico', titolo: 'Abbigliamento tecnico', icona: 'canotta', foto: { file: 'running-abbigliamento-tecnico', alt: 'Runner in giacca tecnica sulla pista' },
            descrizione: 'Maglie traspiranti, shorts e tight, giacche antivento e capi con inserti riflettenti.',
            tipologie: ['Maglie traspiranti', 'Shorts e tight', 'Antivento', 'Riflettenti'], prodotti: [] },
          { slug: 'calze-e-protezioni', titolo: 'Calze e protezioni', icona: 'calza', foto: null,
            descrizione: 'Calze tecniche senza cuciture fastidiose, calze a compressione, cappellini e fasce.',
            tipologie: ['Calze tecniche', 'Calze a compressione', 'Cappellini', 'Fasce'], prodotti: [] },
          { slug: 'accessori', titolo: 'Accessori', icona: 'orologio', foto: null,
            descrizione: 'Cinture porta telefono, borracce morbide, luci frontali e gilet per correre con il buio.',
            tipologie: ['Cinture e marsupi', 'Borracce', 'Luci frontali', 'Gilet idrici'], prodotti: [] }
        ],
        consigli: [
          { titolo: 'Scarpe mezza misura in più', testo: 'Quando corri il piede si allarga: di solito serve circa mezzo numero in più rispetto alle scarpe di tutti i giorni.' },
          { titolo: 'Prova le scarpe la sera', testo: 'A fine giornata il piede è più gonfio, come dopo qualche chilometro. Porta le calze che usi per correre.' },
          { titolo: 'Fatti vedere', testo: 'Se corri all\'alba o la sera, scegli capi con inserti riflettenti e una luce: sulla strada fanno la differenza.' }
        ]
      },
      {
        slug: 'fitness-e-palestra', numero: '11', nome: 'Fitness e palestra', nomeBreve: 'Fitness', accento: '#B9C0CC', testoAccento: '#0E0F12', campo: 'fitness',
        frase: 'Per la palestra, i corsi e l\'allenamento a casa: abbigliamento, scarpe e attrezzi.',
        hero: { file: 'fitness-e-palestra-hero', alt: 'Atleta che si prepara a sollevare un bilanciere', posizione: '50% 50%' },
        tessera: { file: 'fitness-e-palestra-tessera', alt: 'Atleta che si allena con le corde in palestra' },
        categorie: [
          { slug: 'abbigliamento', titolo: 'Abbigliamento', icona: 'canotta', foto: { file: 'fitness-e-palestra-abbigliamento', alt: 'Ragazza in abbigliamento sportivo seduta in palestra' },
            descrizione: 'Leggings, top, t-shirt traspiranti e shorts che seguono i movimenti senza stringere.',
            tipologie: ['Leggings', 'Top sportivi', 'T-shirt', 'Shorts'], prodotti: [] },
          { slug: 'scarpe-da-training', titolo: 'Scarpe da training', icona: 'scarpa', foto: { file: 'fitness-e-palestra-scarpe-da-training', alt: 'Mani che allacciano una scarpa da training' },
            descrizione: 'Suola piatta e stabile per i pesi, più ammortizzata per i corsi a corpo libero.',
            tipologie: ['Suola piatta', 'Cross training', 'Corsi a corpo libero'], prodotti: [] },
          { slug: 'pesi-e-attrezzi', titolo: 'Pesi e attrezzi', icona: 'manubrio', foto: { file: 'fitness-e-palestra-pesi-e-attrezzi', alt: 'Manubri esagonali sul pavimento' },
            descrizione: 'Manubri, kettlebell, elastici e corde per allenarti anche a casa.',
            tipologie: ['Manubri', 'Kettlebell', 'Elastici', 'Corde', 'Tappetini'], prodotti: [] },
          { slug: 'yoga-e-pilates', titolo: 'Yoga e pilates', icona: 'tappetino', foto: { file: 'fitness-e-palestra-yoga-e-pilates', alt: 'Tappetini da yoga arrotolati e manubri' },
            descrizione: 'Tappetini in più spessori, blocchi, cinghie e palle per pilates.',
            tipologie: ['Tappetini', 'Blocchi', 'Cinghie', 'Palle pilates', 'Calze antiscivolo'], prodotti: [] },
          { slug: 'borse-e-accessori', titolo: 'Borse e accessori', icona: 'borsa', foto: { file: 'fitness-e-palestra-borse-e-accessori', alt: 'Sportiva che prepara la borsa da palestra' },
            descrizione: 'Borsoni, guanti da palestra, borracce e asciugamani in microfibra.',
            tipologie: ['Borsoni', 'Guanti', 'Borracce', 'Asciugamani'], prodotti: [] }
        ],
        consigli: [
          { titolo: 'Scarpe diverse per pesi e corsa', testo: 'Per i pesi serve una suola piatta e stabile; per correre sul tapis roulant una scarpa ammortizzata. Se fai entrambi, chiedici un compromesso.' },
          { titolo: 'Il tappetino giusto', testo: 'Più sottile per lo yoga, dove serve stabilità; più spesso per pilates ed esercizi a terra.' },
          { titolo: 'Inizia con poco', testo: 'Per allenarti a casa bastano un paio di manubri regolabili, un elastico e un tappetino. Il resto si aggiunge dopo.' }
        ]
      },
      {
        slug: 'ciclismo', numero: '12', nome: 'Ciclismo', accento: '#F45BA4', testoAccento: '#0E0F12', campo: 'ciclismo',
        frase: 'Dalla ciclabile della riviera alle salite della Majella: vestiti per pedalare.',
        hero: { file: 'ciclismo-hero', alt: 'Ciclisti su strada in mezzo a una pineta', posizione: '60% 50%' },
        tessera: { file: 'ciclismo-tessera', alt: 'Ciclista in salita su una strada di montagna' },
        categorie: [
          { slug: 'abbigliamento', titolo: 'Abbigliamento', icona: 'maglia', foto: { file: 'ciclismo-abbigliamento', alt: 'Ragazzo in maglia da ciclismo rossa con il casco' },
            descrizione: 'Maglie, pantaloncini con fondello, giacche antivento e capi invernali.',
            tipologie: ['Maglie', 'Pantaloncini con fondello', 'Antivento', 'Invernale'], prodotti: [] },
          { slug: 'caschi', titolo: 'Caschi', icona: 'casco', foto: { file: 'ciclismo-caschi', alt: 'Caschi da bici appesi al manubrio' },
            descrizione: 'Caschi da strada, da mountain bike, urbani e per bambini, con regolazione posteriore.',
            tipologie: ['Strada', 'Mountain bike', 'Urbani', 'Bambini'], prodotti: [] },
          { slug: 'scarpe', titolo: 'Scarpe', icona: 'scarpa', foto: { file: 'ciclismo-scarpe', alt: 'Scarpa da ciclismo con attacco sul pedale' },
            descrizione: 'Scarpe da strada con attacco a 3 fori, da mountain bike a 2 fori e per pedali piatti.',
            tipologie: ['Strada – 3 fori', 'Mountain bike – 2 fori', 'Pedale piatto'], prodotti: [] },
          { slug: 'accessori', titolo: 'Accessori', icona: 'borraccia', foto: null,
            descrizione: 'Guanti, borracce e portaborracce, luci, occhiali e kit per le riparazioni veloci.',
            tipologie: ['Guanti', 'Borracce', 'Luci', 'Occhiali', 'Kit riparazione'], prodotti: [] }
        ],
        consigli: [
          { titolo: 'Il casco va regolato', testo: 'Deve stare dritto sulla fronte, due dita sopra le sopracciglia, e non muoversi scuotendo la testa con il cinturino chiuso.' },
          { titolo: 'Fondello e niente sotto', testo: 'I pantaloncini con fondello si indossano senza biancheria: così evitano le cuciture che sfregano.' },
          { titolo: 'Luci anche di giorno', testo: 'Una luce posteriore accesa ti rende visibile anche in pieno giorno, soprattutto nelle gallerie e con la pioggia.' }
        ]
      }
    ]
  };
});
