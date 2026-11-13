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
      payoff: 'Tutto lo sport, in un solo negozio.',   // motto: footer e dati per Google
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
      mappaRicerca: 'Piazza della Rinascita, 65121 Pescara',   // link "Apri in Google Maps" (cliente vero: indirizzo del negozio)
      // immagine dal satellite salvata nel sito (niente richieste a Google all'apertura). Come rifarla: ISTRUZIONI.md
      mappaImmagine: { file: 'assets/img/mappa-satellite', larghezze: [800, 1600], esempio: true,
        alt: 'Vista dal satellite del centro di Pescara intorno a Piazza della Rinascita e Corso Umberto, con il segnaposto del negozio al centro' },
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
      dataAggiornamento: '13 novembre 2026'
    },

    /* ---------- Modulo "Chiedi disponibilità" ----------
       modalita: 'whatsapp' (apre WhatsApp con il messaggio pronto)
                 'web3forms' (invia via email: serve accessKey da web3forms.com) */
    modulo: {
      modalita: 'whatsapp',
      web3formsAccessKey: '',
      oggettoEmail: 'Nuova richiesta dal sito Slancio'
    },

    /* ---------- Catalogo di esempio ----------
       Ogni prodotto sta nella sua categoria (sport → categorie → prodotti) con questi campi:
         codice         es. 'CAL-SCA-01' (sport-categoria-numero): compare nella borsa e nei messaggi
         nome           nome generico, SENZA marchi
         linea          'adulto' | 'bambino' | 'entrambe'
         prezzo         in euro (di esempio)
         taglia         uno dei tipi qui sotto in "taglie" (es. 'scarpe-adulto')
         misure         (facoltativo) solo alcune misure del tipo, es. ['Misura 5']
         disponibilita  'in negozio' | 'su ordinazione' | 'esaurito'
         illustrazione  disegno di assets/img/prodotti.svg, usato finché mancano le foto
         colore         colore del prodotto nel disegno
         descrizione    2-3 righe di informazioni generali
         foto           [] oppure foto da più angolazioni: ['assets/img/prodotti/CAL-SCA-01-fronte.webp', ...-lato, -retro, -sopra, -sotto, -dettaglio]
         modello3d      '' oppure 'assets/3d/nome.glb' (mostra il pulsante "Vedi in 3D")
       Ogni categoria ha anche "insieme": le categorie da suggerire in "Spesso comprati insieme"
       ('slug' di una categoria dello stesso sport, oppure 'sport/slug'). */
    catalogo: {
      mostraPrezzi: true,
      etichettaEsempio: 'Prodotti, prezzi e disponibilità di esempio',
      disponibilita: { 'in negozio': 'Disponibile in negozio', 'su ordinazione': 'Su ordinazione', 'esaurito': 'Esaurito' },
      linee: { adulto: 'Adulto', bambino: 'Bambino', entrambe: 'Adulto e bambino' },
      // tipi di taglia: valori in ordine; "linea" dice se le misure sono da adulto o da bambino;
      // "gruppi" unisce più tipi (es. bambino + adulto); "guida" = scheda della Guida taglie da aprire
      taglie: {
        'scarpe-adulto': { nome: 'Numero', linea: 'adulto', guida: 'scarpe', valori: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'] },
        'scarpe-bambino': { nome: 'Numero', linea: 'bambino', guida: 'scarpe', valori: ['24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'] },
        'scarpe-tutte': { nome: 'Numero', guida: 'scarpe', gruppi: ['scarpe-bambino', 'scarpe-adulto'] },
        'abb-adulto': { nome: 'Taglia', linea: 'adulto', guida: 'abb-adulto', valori: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
        'abb-bambino': { nome: 'Taglia', linea: 'bambino', guida: 'abb-bambino', valori: ['4 anni (104 cm)', '6 anni (116 cm)', '8 anni (128 cm)', '10 anni (140 cm)', '12 anni (152 cm)', '14 anni (164 cm)'] },
        'abb-tutte': { nome: 'Taglia', guida: 'abb-bambino', gruppi: ['abb-bambino', 'abb-adulto'] },
        'calze': { nome: 'Misura', linea: 'adulto', valori: ['35–38', '39–42', '43–46'] },
        'calze-bambino': { nome: 'Misura', linea: 'bambino', valori: ['27–30', '31–34'] },
        'calze-compressione': { nome: 'Taglia', linea: 'adulto', valori: ['S', 'M', 'L'], nota: 'In base alla circonferenza del polpaccio' },
        'guantoni': { nome: 'Peso', guida: 'guantoni', valori: ['6 oz', '8 oz', '10 oz', '12 oz', '14 oz', '16 oz'] },
        'guanti-portiere': { nome: 'Misura', valori: ['4', '5', '6', '7', '8', '9', '10', '11'] },
        'guanti': { nome: 'Taglia', linea: 'adulto', valori: ['S', 'M', 'L', 'XL'] },
        'guanti-bambino': { nome: 'Taglia', linea: 'bambino', valori: ['4–6 anni', '6–8 anni', '8–10 anni', '10–12 anni'] },
        'parastinchi': { nome: 'Misura', valori: ['XS (fino a 140 cm)', 'S (140–160 cm)', 'M (160–170 cm)', 'L (170–185 cm)'], nota: 'In base all\'altezza' },
        'protezioni': { nome: 'Taglia', valori: ['XS', 'S', 'M', 'L', 'XL'] },
        'pallone-calcio': { nome: 'Misura', guida: 'palloni', valori: ['Misura 3', 'Misura 4', 'Misura 5'] },
        'pallone-basket': { nome: 'Misura', guida: 'palloni', valori: ['Misura 5', 'Misura 6', 'Misura 7'] },
        'pallone-volley': { nome: 'Misura', guida: 'palloni', valori: ['Misura 5'] },
        'casco': { nome: 'Taglia', linea: 'adulto', guida: 'caschi', valori: ['S (52–55 cm)', 'M (55–58 cm)', 'L (58–61 cm)'] },
        'casco-bambino': { nome: 'Taglia', linea: 'bambino', guida: 'caschi', valori: ['XS (48–52 cm)', 'S (52–55 cm)'] },
        'impugnatura': { nome: 'Impugnatura', linea: 'adulto', valori: ['L1 (4 1/8")', 'L2 (4 1/4")', 'L3 (4 3/8")', 'L4 (4 1/2")'] },
        'racchetta-junior': { nome: 'Lunghezza', linea: 'bambino', valori: ['21" (4–6 anni)', '23" (6–8 anni)', '25" (8–10 anni)', '26" (10–12 anni)'] },
        'bende': { nome: 'Lunghezza', valori: ['2,5 m', '3,5 m', '4,5 m'] },
        'paradenti': { nome: 'Misura', gruppi: [{ linea: 'bambino', valori: ['Junior'] }, { linea: 'adulto', valori: ['Adulto'] }] },
        'casacche': { nome: 'Taglia', gruppi: [{ linea: 'bambino', valori: ['Bambino'] }, { linea: 'adulto', valori: ['Adulto'] }] },
        'mondopoint': { nome: 'Mondopoint', linea: 'adulto', valori: ['24.5', '25.5', '26.5', '27.5', '28.5', '29.5'], nota: 'Lunghezza del piede in cm' },
        'sci': { nome: 'Lunghezza', linea: 'adulto', valori: ['150 cm', '160 cm', '170 cm', '180 cm'] },
        'pinne': { nome: 'Misura', valori: ['35–36', '37–38', '39–40', '41–42', '43–44', '45–46'] },
        'palette': { nome: 'Misura', valori: ['S', 'M', 'L'] },
        'manubri': { nome: 'Peso', valori: ['2 × 2 kg', '2 × 4 kg', '2 × 6 kg', '2 × 8 kg'] },
        'kettlebell': { nome: 'Peso', valori: ['8 kg', '12 kg', '16 kg'] },
        'palla-pilates': { nome: 'Diametro', valori: ['55 cm (fino a 165 cm di altezza)', '65 cm (165–180 cm)', '75 cm (oltre 180 cm)'] },
        'unica': { nome: 'Taglia', valori: ['Taglia unica'] },
        'nessuna': { nome: '', valori: [] }
      }
    },

    /* ---------- Borsa "Prenota e ritira" (nessun pagamento online) ---------- */
    borsa: {
      nome: 'Prenota e ritira',
      prefissoCodice: 'SL',                       // codice borsa: SL-XXXX
      giorniMassimi: 7,                           // "quando passi": al massimo tra 7 giorni
      testoBorsa: 'Non è un acquisto online: ci mandi la borsa, controlliamo la disponibilità e paghi in negozio quando ritiri.',
      testoConferma: 'Ti rispondiamo con la disponibilità. Dopo la conferma teniamo da parte i prodotti per 48 ore. Paghi in negozio dicendo il codice.'
    },

    /* ---------- Maglia personalizzata (configuratore 3D in home) ----------
       modello: file .glb (modello originale del sito, generato da _strumenti/maglia3d.mjs)
       colori: tavolozza unica per principale, secondario e dettagli (colletto e polsini)
       squadre: INVENTATE (nomi controllati: nessuna squadra italiana reale con questi nomi);
                stemma = disegno SVG (viewBox 0 0 100 120), solo forme geometriche */
    maglia: {
      modello: 'assets/3d/maglia.glb',
      anteprima: 'assets/img/maglia-anteprima',    // senza misura: -480.webp e -960.webp
      maxNome: 14,
      maxNumero: 5,
      stemmaMaxMB: 2,
      quantitaIniziale: 15,
      iniziale: { squadra: 'maestrale', nome: 'Rossi', numero: '10' },
      motivi: [
        { id: 'tinta', nome: 'Tinta unita' },
        { id: 'strisce', nome: 'Strisce verticali' },
        { id: 'bande', nome: 'Bande orizzontali' },
        { id: 'diagonale', nome: 'Fascia diagonale' },
        { id: 'quarti', nome: 'Quarti' },
        { id: 'sfumato', nome: 'Sfumato' }
      ],
      colori: [
        { nome: 'Bianco', hex: '#F6F5F1' },
        { nome: 'Nero', hex: '#15161B' },
        { nome: 'Cobalto', hex: '#1E46F0' },
        { nome: 'Blu notte', hex: '#1B2A5B' },
        { nome: 'Azzurro', hex: '#4FA3E0' },
        { nome: 'Verde', hex: '#1B7F49' },
        { nome: 'Giallo', hex: '#FFC21A' },
        { nome: 'Oro', hex: '#C9A04A' },
        { nome: 'Arancio', hex: '#F47B20' },
        { nome: 'Corallo', hex: '#F2603D' },
        { nome: 'Rosso', hex: '#D62839' },
        { nome: 'Granata', hex: '#7A1F2B' },
        { nome: 'Viola', hex: '#5B3FD1' },
        { nome: 'Ardesia', hex: '#3A4250' }
      ],
      squadre: [
        { id: 'maestrale', nome: 'Maestrale Sporting', sport: 'Calcio', motivo: 'strisce', colori: ['#1B2A5B', '#F6F5F1', '#C9A04A'],
          stemma: '<path d="M50 5 93 17v42c0 29-19 47-43 56C26 106 7 88 7 59V17Z" fill="#1B2A5B"/><path d="M50 12 86 22v37c0 25-16 40-36 48C30 99 14 84 14 59V22Z" fill="none" stroke="#C9A04A" stroke-width="3"/><path d="M27 46h40M33 60h40M27 74h40" stroke="#F6F5F1" stroke-width="7" stroke-linecap="round"/><path d="M50 20 56 32H44Z" fill="#C9A04A"/>' },
        { id: 'corallo', nome: 'Atletico Corallo', sport: 'Calcetto', motivo: 'bande', colori: ['#F2603D', '#15161B', '#F6F5F1'],
          stemma: '<circle cx="50" cy="60" r="45" fill="#15161B"/><circle cx="50" cy="60" r="38" fill="none" stroke="#F2603D" stroke-width="4"/><path d="M50 92V38M50 70 34 54M50 60l16-16M34 54V42M66 44V34M50 80l13-11" stroke="#F2603D" stroke-width="6" stroke-linecap="round" fill="none"/>' },
        { id: 'vortice', nome: 'Polisportiva Vortice', sport: 'Pallavolo', motivo: 'diagonale', colori: ['#5B3FD1', '#FFC21A', '#15161B'],
          stemma: '<path d="M50 8 94 33v50L50 110 6 83V33Z" fill="#5B3FD1"/><path d="M50 58 50 24 72 46Z" fill="#FFC21A"/><path d="M50 58 79 75 51 83Z" fill="#FFC21A"/><path d="M50 58 21 75 28 47Z" fill="#FFC21A"/><circle cx="50" cy="59" r="6" fill="#15161B"/>' },
        { id: 'quarzo', nome: 'Quarzo Atletica', sport: 'Running', motivo: 'quarti', colori: ['#F6F5F1', '#3A4250', '#1E46F0'],
          stemma: '<path d="M14 8h72v58c0 24-17 38-36 46-19-8-36-22-36-46Z" fill="#3A4250"/><path d="M50 22 70 46 50 96 30 46Z" fill="#F6F5F1"/><path d="M50 22 58 46 50 96Z" fill="#1E46F0"/><path d="M30 46h40" stroke="#3A4250" stroke-width="3"/>' },
        { id: 'libeccio', nome: 'Libeccio United', sport: 'Basket', motivo: 'tinta', colori: ['#1B7F49', '#F6F5F1', '#F6F5F1'],
          stemma: '<path d="M10 40a40 40 0 0 1 80 0v26c0 22-18 38-40 47-22-9-40-25-40-47Z" fill="#1B7F49"/><path d="M50 20 57 53 90 60 57 67 50 100 43 67 10 60 43 53Z" fill="#F6F5F1"/><circle cx="50" cy="60" r="7" fill="#1B7F49"/>' },
        { id: 'sciame', nome: 'Sciame Arancio', sport: 'Ciclismo', motivo: 'sfumato', colori: ['#F47B20', '#15161B', '#15161B'],
          stemma: '<path d="M50 6 95 32v56L50 114 5 88V32Z" fill="#15161B"/><path d="M50 30 63 38v15L50 61 37 53V38Z" fill="#F47B20"/><path d="M35 56 48 64v15L35 87 22 79V64Z" fill="#F47B20"/><path d="M65 56 78 64v15L65 87 52 79V64Z" fill="#F47B20"/>' }
      ]
    },

    /* ---------- Kit Squadra: configuratore a 8 passi ----------
       PREZZI, MARCHE, MATERIALI, SCONTI, SPEDIZIONE, ACCONTO, TEMPI E TAGLIE: in js/listino.js
       Qui solo testi e regole del configuratore. */
    kit: {
      prefissoCodice: 'KIT',                      // numero preventivo / ordine: KIT-XXXX
      quantitaIniziale: 15,                       // pezzi proposti quando si sceglie un capo
      maxPezzi: 300,                              // massimo per capo
      maxRosa: 60,                                // giocatori nella rosa
      maxNome: 14, maxNumero: 3,                  // nome e numero sul retro
      // capi proposti quando si sceglie lo sport (id dei capi in listino.js); si possono togliere o aggiungere
      consigliati: {
        calcio: ['maglia', 'pantaloncini', 'calzettoni', 'rappresentanza'],
        calcetto: ['maglia', 'pantaloncini', 'calzettoni'],
        basket: ['maglia', 'pantaloncini', 'rappresentanza'],
        pallavolo: ['maglia', 'pantaloncini', 'allenamento'],
        tennis: ['maglia', 'pantaloncini', 'borsa'],
        padel: ['maglia', 'pantaloncini', 'borsa'],
        'pugilato-e-combattimento': ['maglia', 'pantaloncini', 'rappresentanza'],
        'sci-e-snowboard': ['giubbino', 'tecnica'],
        nuoto: ['rappresentanza', 'borsa'],
        running: ['maglia', 'pantaloncini', 'giubbino'],
        'fitness-e-palestra': ['maglia', 'allenamento'],
        ciclismo: ['maglia', 'pantaloncini', 'giubbino']
      },
      canotta: ['basket', 'pugilato-e-combattimento', 'running'],   // sport con la canotta già scelta come tipo di maglia
      // home: sezione a scorrimento "Il tuo kit prende forma" (maglia di esempio: prima squadra di "maglia.squadre")
      forma: {
        occhiello: 'Kit Squadra · dal bozzetto alla divisa',
        titolo: ['Il tuo kit', 'prende forma'],
        nome: 'Rossi', numero: '10', sponsor: 'Sponsor',
        passi: [
          { tit: 'La base', testo: 'Si parte da una maglia pulita, con il taglio giusto per il vostro sport.' },
          { tit: 'I vostri colori', testo: 'Carichi lo stemma: i colori della squadra li prendiamo da lì.' },
          { tit: 'Il disegno', testo: 'Strisce, banda, sfumato: 6 proposte pronte, scegli la vostra.' },
          { tit: 'Lo stemma', testo: 'Sul cuore, nitido come l\'originale.' },
          { tit: 'Gli sponsor', testo: 'Petto, schiena, manica o pantaloncino: ognuno al suo posto.' },
          { tit: 'Nome e numero', testo: 'La rosa con nomi, numeri e taglie, contata in automatico.' }
        ]
      },
      // stemma, sponsor e altre grafiche (demo: i file restano nel browser)
      grafiche: {
        formati: ['png', 'jpg', 'jpeg', 'svg', 'pdf'], maxMB: 10, maxFile: 12,
        posizioni: ['Petto sinistro', 'Centro petto', 'Schiena', 'Manica', 'Pantaloncino']
      },
      // colori proposti per la palette della squadra
      colori: [
        { nome: 'Bianco', hex: '#F6F5F1' }, { nome: 'Nero', hex: '#15161B' }, { nome: 'Cobalto', hex: '#1E46F0' },
        { nome: 'Blu notte', hex: '#1B2A5B' }, { nome: 'Azzurro', hex: '#4FA3E0' }, { nome: 'Verde', hex: '#1B7F49' },
        { nome: 'Giallo', hex: '#FFC21A' }, { nome: 'Oro', hex: '#C9A04A' }, { nome: 'Arancio', hex: '#F47B20' },
        { nome: 'Rosso', hex: '#D62839' }, { nome: 'Granata', hex: '#7A1F2B' }, { nome: 'Viola', hex: '#5B3FD1' }
      ],
      stili: [
        { id: 'classico', nome: 'Classico', testo: 'Colletto e polsini a contrasto, linee pulite.' },
        { id: 'moderno', nome: 'Moderno', testo: 'Fianchi a contrasto e cuciture in vista.' },
        { id: 'geometrico', nome: 'Geometrico', testo: 'Trama a triangoli e un chevron sul petto.' },
        { id: 'vintage', nome: 'Vintage', testo: 'Colori caldi, colletto doppio, effetto lana.' }
      ],
      disegni: [
        { id: 'tinta', nome: 'Tinta unita' }, { id: 'strisce', nome: 'Strisce verticali' }, { id: 'diagonale', nome: 'Banda diagonale' },
        { id: 'sfumato', nome: 'Sfumato' }, { id: 'maniche', nome: 'Maniche a contrasto' }
      ],
      colli: [ { id: 'girocollo', nome: 'Girocollo' }, { id: 'v', nome: 'A V' }, { id: 'polo', nome: 'Polo' } ],
      testoTaglie: 'Nel dubbio sulla taglia proviamo tutto in negozio prima della stampa.',
      // condizioni da accettare prima di pagare l'acconto (DEMO: testi di esempio da far verificare)
      condizioni: [
        'Il preventivo è indicativo: lo confermiamo dopo aver controllato grafiche, taglie e disponibilità.',
        'Con l\'acconto confermi l\'ordine. Prima della produzione ti mandiamo la grafica da approvare.',
        'I tempi di produzione partono dall\'approvazione della grafica.',
        'Il saldo si paga al ritiro in negozio o alla consegna.',
        'I prodotti personalizzati con nomi, numeri, stemmi o sponsor non sono soggetti a reso.'
      ],
      // banner "Ordina entro…" (si cambia dal pannello admin). Date vuote = periodo di prova calcolato da oggi.
      // {data} nel testo diventa la data limite.
      banner: { attivo: true, dal: '', al: '', scadenza: '', testo: 'Ordina entro il {data} per avere il kit alla prima di campionato.' },
      // ordine di esempio sempre presente (pagina "Stato del tuo ordine" e pannello admin)
      ordineDemo: {
        numero: 'DEMO-001', squadra: 'ASD Maestrale Sporting', sport: 'calcio', marca: 'media', consegna: 'ritiro',
        referente: 'Giulia Di Marco', telefono: '333 000 0000', fase: 'produzione', giorni: { ricevuto: -21, grafica: -14, produzione: -6 },
        note: { ricevuto: 'Acconto ricevuto. Grazie!', grafica: 'Grafica approvata dal presidente.', produzione: 'Stampa nomi e numeri in corso.' },
        capi: [ { id: 'maglia', q: 18, tipo: 'Maniche corte', mat: 'mesh' }, { id: 'pantaloncini', q: 18, tipo: 'Classico', mat: 'tecnico' }, { id: 'calzettoni', q: 18, tipo: 'Calzettoni lunghi', mat: 'tecnico' }, { id: 'rappresentanza', q: 18, tipo: 'Felpa full-zip con pantalone', mat: 'strutturato' } ],
        design: { c1: '#1B2A5B', c2: '#F6F5F1', c3: '#C9A04A', disegno: 'strisce', collo: 'girocollo', stile: 'classico', sigla: 'MS', nome: 'Rossi', numero: '10' },
        rosa: [ ['Rossi', '10', 'M'], ['Bianchi', '1', 'L'], ['Esposito', '4', 'M'], ['Colombo', '5', 'L'], ['Ricci', '7', 'S'], ['Marino', '8', 'M'], ['Greco', '9', 'L'], ['Bruno', '11', 'M'], ['Gallo', '6', 'XL'], ['Conti', '3', 'M'], ['De Luca', '2', 'L'], ['Mancini', '13', 'S'], ['Costa', '14', 'M'], ['Giordano', '15', 'M'], ['Rizzo', '16', 'L'], ['Lombardi', '17', 'M'], ['Moretti', '12', 'XL'], ['Barbieri', '18', 'S'] ]
      }
    },

    /* ---------- Guida taglie (informazioni generali) ---------- */
    guidaTaglie: {
      avviso: 'Misure indicative: cambiano da marca a marca. In negozio puoi provare tutto prima di decidere.',
      scarpe: {
        comeMisurare: [
          'Misura il piede la sera, quando è un po\' più gonfio, con le calze che userai.',
          'Appoggia il tallone contro il muro, in piedi, su un foglio di carta.',
          'Segna con una matita il punto più lungo, di solito l\'alluce, tenendola dritta.',
          'Misura in centimetri dal muro al segno. Misura tutti e due i piedi e usa il più lungo.'
        ],
        nota: 'Per le scarpe da corsa di solito serve circa mezzo numero in più. Per i bambini lascia circa 1 cm di spazio davanti all\'alluce.'
      },
      abbAdulto: { colonne: ['Taglia', 'Torace (cm)', 'Vita (cm)'], righe:[['XS', '82–88', '66–72'], ['S', '88–96', '72–80'], ['M', '96–104', '80–88'], ['L', '104–112', '88–96'], ['XL', '112–120', '96–104'], ['XXL', '120–128', '104–112']], nota: 'Torace: nel punto più largo, sotto le ascelle. Vita: all\'altezza dell\'ombelico, senza stringere.' },
      abbBambino: { colonne: ['Età indicativa', 'Altezza'], righe:[['4 anni', '104 cm'], ['6 anni', '116 cm'], ['8 anni', '128 cm'], ['10 anni', '140 cm'], ['12 anni', '152 cm'], ['14 anni', '164 cm']], nota: 'Conta più l\'altezza dell\'età: se il bambino è tra due misure, scegli la più grande.' },
      guantoni: { colonne: ['Peso', 'Per chi'], righe:[['6–8 oz', 'Bambini e ragazzi'], ['10 oz', 'Sacco e colpitori, fino a circa 55 kg'], ['12 oz', 'Allenamento, circa 55–70 kg'], ['14 oz', 'Allenamento e sparring, circa 70–85 kg'], ['16 oz', 'Sparring, oltre 85 kg o per più protezione']], nota: 'Indicazioni generali: segui sempre le regole della tua palestra e del tuo maestro.' },
      palloni: { colonne: ['Sport', 'Misura', 'Per chi'], righe:[['Calcio', 'Misura 3', 'Fino a 8 anni'], ['Calcio', 'Misura 4', 'Da 8 a 12 anni'], ['Calcio', 'Misura 5', 'Dai 12 anni e adulti'], ['Calcio a 5', 'Misura 4 a rimbalzo controllato', 'Ragazzi e adulti'], ['Basket', 'Misura 5', 'Minibasket'], ['Basket', 'Misura 6', 'Femminile e molte giovanili'], ['Basket', 'Misura 7', 'Maschile'], ['Pallavolo', 'Misura 5 (65–67 cm)', 'Palestra, ragazzi e adulti'], ['Minivolley', 'Pallone più leggero', 'Bambini']], nota: 'Le misure ufficiali possono cambiare: controlla il regolamento del tuo campionato.' },
      caschi: { colonne: ['Taglia', 'Giro testa'], righe:[['XS (bambino)', '48–52 cm'], ['S', '52–55 cm'], ['M', '55–58 cm'], ['L', '58–61 cm']], nota: 'Misura la testa con un metro da sarta, circa un dito sopra le sopracciglia, nel punto più largo. Il casco deve stare fermo senza stringere.' }
    },

    /* ---------- Servizi su prenotazione (prezzi e durate DI ESEMPIO) ----------
       la fascia oraria (mattina / pomeriggio) arriva dagli orari del negozio di quel giorno */
    servizi: {
      prefissoCodice: 'SRV',                      // codice richiesta: SRV-XXXX
      giorniMassimi: 21,                          // si prenota al massimo 3 settimane avanti
      testoConferma: 'La prenotazione è confermata quando il negozio ti risponde.',
      elenco: [
        // foto = immagine di sfondo della card (dalle foto del sito), icona = icona piccola (vedi ICO in build.mjs)
        { id: 'incordatura', nome: 'Incordatura racchette da tennis', sport: 'tennis', durata: 'Pronta in 24 ore', prezzo: 15, notaPrezzo: 'corda esclusa',
          foto: { file: 'tennis-racchette', alt: 'Due racchette da tennis e una pallina sul campo verde' }, icona: 'racchetta',
          descrizione: 'Porti la racchetta, scegli corda e tensione con noi. La ritiri il giorno dopo, già pronta per giocare.' },
        { id: 'prova-racchette', nome: 'Prova racchette da padel e tennis', sport: 'padel', durata: '45 minuti', prezzo: 10, notaPrezzo: 'scalati se poi acquisti',
          foto: { file: 'padel-racchette', alt: 'Racchetta da padel e pallina sul campo blu' }, icona: 'padel',
          descrizione: 'Provi due o tre racchette scelte per il tuo gioco, con consigli su peso, bilanciamento e forma.' },
        { id: 'analisi-passo', nome: 'Analisi del passo per la corsa', sport: 'running', durata: '30 minuti', prezzo: 25, notaPrezzo: 'gratis con l\'acquisto delle scarpe',
          foto: { file: 'running-scarpe-da-corsa', alt: 'Runner che si allaccia la scarpa sulla pista' }, icona: 'scarpa',
          descrizione: 'Corri qualche minuto sul tapis roulant: guardiamo l\'appoggio del piede e ti consigliamo le scarpe giuste.' },
        { id: 'sciolinatura', nome: 'Sciolinatura e affilatura di sci e snowboard', sport: 'sci-e-snowboard', durata: 'Pronti in 48 ore', prezzo: 30, notaPrezzo: 'a paio di sci o tavola',
          foto: { file: 'sci-e-snowboard-scarponi-e-attrezzi', alt: 'Sci e bastoncini piantati nella neve' }, icona: 'scarpone',
          descrizione: 'Lamine affilate e soletta sciolinata a caldo: la tavola o gli sci tornano a scorrere come nuovi.' }
      ]
    },

    /* ---------- Noleggio sci e snowboard ----------
       DISPONIBILITÀ SIMULATA (demo): pezzi totali meno prenotazioni di esempio, più alte nei weekend e nelle feste.
       Per una disponibilità vera e condivisa servono un database (Firebase) e un pannello per il negozio. */
    noleggio: {
      prefissoCodice: 'NOL',                      // codice richiesta: NOL-XXXX
      stagione: { da: '12-01', a: '04-15' },      // MM-GG: dal 1 dicembre al 15 aprile
      giorniMassimi: 14,                          // al massimo 14 giorni di noleggio
      personeMassime: 8,
      pochiPezzi: 2,                              // "Pochi pezzi" se ne restano 2 o meno
      ritiro: { dalle: '15:30', alle: '19:30' },  // il pomeriggio prima del primo giorno
      restituzione: { entro: '19:30' },           // il primo giorno di apertura dopo l'ultimo
      testoConferma: 'La prenotazione è confermata quando il negozio ti risponde.',
      attrezzatura: [
        // gruppo = cosa sceglie la persona; eta = adulto / bambino (null = vale per tutti)
        // prezzi al giorno: in js/listino.js (noleggio)
        { id: 'sci-adulto', gruppo: 'Sci', eta: 'adulto', nome: 'Kit sci adulto', include: 'sci, scarponi e bastoncini', pezzi: 14 },
        { id: 'sci-bambino', gruppo: 'Sci', eta: 'bambino', nome: 'Kit sci bambino', include: 'sci, scarponi e bastoncini', pezzi: 10 },
        { id: 'snow-adulto', gruppo: 'Snowboard', eta: 'adulto', nome: 'Kit snowboard adulto', include: 'tavola con attacchi e scarponi', pezzi: 8 },
        { id: 'snow-bambino', gruppo: 'Snowboard', eta: 'bambino', nome: 'Kit snowboard bambino', include: 'tavola con attacchi e scarponi', pezzi: 5 },
        { id: 'scarponi', gruppo: 'Solo scarponi', eta: null, nome: 'Solo scarponi', include: 'da sci o da snowboard', pezzi: 12 },
        { id: 'casco', gruppo: 'Solo casco', eta: null, nome: 'Casco', include: 'adulto o bambino', pezzi: 20 }
      ],
      cascoAggiuntivo: 'casco',                   // id del casco che si può aggiungere a ogni kit
      // giorni OCCUPATI di partenza (MM-GG, diventano date della stagione): poi li cambia il negozio dal pannello admin.html
      occupatiEsempio: {
        'sci-adulto': ['12-26', '12-27', '12-28', '12-29', '12-30', '02-14', '02-15'],
        'sci-bambino': ['12-27', '12-28', '12-29', '01-02', '01-03'],
        'snow-adulto': ['12-19', '12-20', '12-30', '12-31', '01-01'],
        'snow-bambino': ['12-05', '12-06', '12-12', '12-13', '12-26', '12-27', '12-28', '01-02', '01-03'],
        'scarponi': ['12-28', '12-29'],
        'casco': []
      },
      // prenotazioni DI ESEMPIO per giorno (solo per l'avviso "Pochi pezzi"): [lun–gio, venerdì, sabato e domenica] (+ variazione casuale fissa da 0 a 2)
      esempio: {
        'sci-adulto': [3, 7, 12], 'sci-bambino': [2, 5, 8], 'snow-adulto': [2, 5, 8],
        'snow-bambino': [1, 2, 4], 'scarponi': [2, 4, 9], 'casco': [4, 8, 15]
      },
      // periodi di punta (MM-GG): si usano i numeri del weekend anche nei giorni feriali
      punte: [['12-24', '01-06'], ['02-14', '02-22']]
    },

    /* ---------- Marchi trattati (ESEMPIO, solo testo) ---------- */
    marchi: ['Leone 1947', 'Champion', 'Adidas', 'Nike', 'Puma', 'Joma', 'Kappa', 'Diadora', 'Macron', 'Mizuno', 'Asics', 'Wilson', 'Head', 'Babolat', 'Bullpadel', 'Everlast', 'Rossignol', 'Salomon', 'Speedo', 'Arena'],

    /* ---------- Home ---------- */
    home: {
      heroTitolo: ['Tutto lo sport,', 'in un solo', 'negozio.'],   // righe del titolo (entrano una per una; l'ultima è in corsivo)
      heroSottotitolo: 'Dal calcio allo sci, dal bambino al tesserato: ti consigliamo la cosa giusta. A Pescara.',
      video: {
        computer: 'assets/video/hero-1920.mp4',
        telefono: 'assets/video/hero-1080x1920.mp4',
        poster: 'assets/video/hero-poster',     // senza estensione: -1280.webp e -1920.webp, -mobile.webp
        alt: 'Calciatore che colpisce il pallone di sera su un campo in erba sintetica'
      },
      // loop della hero: il video qui sopra (sport 01) e poi tutti gli sport, nello stesso ordine di "Scegli il tuo sport".
      // Uno sport con "video: { computer, telefono }" nella sua scheda usa il video; gli altri la foto hero con zoom lento.
      heroLoop: { durata: 6.2, dissolvenza: 1.2 },   // secondi per sport (come il video attuale) e durata della dissolvenza
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
      ]
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
            tipologie: ['FG – erba naturale', 'AG – erba sintetica', 'SG – terreno morbido', 'TF – sintetico corto', 'MG – multiterreno'], insieme: ['parastinchi-e-protezioni', 'pantaloncini-e-calzettoni'],
            prodotti: [
              { codice: 'CAL-SCA-01', nome: 'Scarpa da calcio per erba naturale (FG)', linea: 'adulto', prezzo: 69.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-tacchetti', colore: '#1E46F0',
                descrizione: 'Tacchetti conici e lamellari per l\'erba naturale asciutta. La tomaia sintetica è morbida e si adatta al piede dopo pochi allenamenti.', foto: [], modello3d: '' },
              { codice: 'CAL-SCA-02', nome: 'Scarpa da calcio per erba sintetica (AG)', linea: 'adulto', prezzo: 89.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-tacchetti', colore: '#0E0F12',
                descrizione: 'Tacchetti più corti e numerosi che distribuiscono il peso sul sintetico di ultima generazione. Sul sintetico è da preferire a una suola FG.', foto: [], modello3d: '' },
              { codice: 'CAL-SCA-03', nome: 'Scarpa da calcio per terreni morbidi (SG)', linea: 'adulto', prezzo: 149.9, taglia: 'scarpe-adulto', disponibilita: 'su ordinazione', illustrazione: 'scarpa-tacchetti', colore: '#D62839',
                descrizione: 'Tacchetti avvitabili in metallo per l\'erba pesante e bagnata. Da usare solo sull\'erba naturale: su sintetico e terra non sono adatti.', foto: [], modello3d: '' },
              { codice: 'CAL-SCA-04', nome: 'Scarpa da calcio bambino multiterreno (MG)', linea: 'bambino', prezzo: 34.9, taglia: 'scarpe-bambino', disponibilita: 'in negozio', illustrazione: 'scarpa-tacchetti', colore: '#1F9BDB',
                descrizione: 'Tacchetti misti che vanno bene sia sull\'erba sia sul sintetico: una sola scarpa per i campi della scuola calcio. Linguetta imbottita.', foto: [], modello3d: '' },
              { codice: 'CAL-SCA-05', nome: 'Scarpa da calcio bambino a strappo (TF)', linea: 'bambino', prezzo: 29.9, taglia: 'scarpe-bambino', disponibilita: 'esaurito', illustrazione: 'scarpa-calcetto', colore: '#22A45D',
                descrizione: 'Chiusura a strappo per allacciarle da soli e suola in gomma con piccoli tacchetti, per il sintetico corto e i campetti in terra.', foto: [], modello3d: '' }
            ] },
          { slug: 'maglie-e-divise', titolo: 'Maglie e divise', icona: 'maglia', foto: { file: 'calcio-maglie-e-divise', alt: 'Maglie da calcio appese con il numero sul retro' },
            descrizione: 'Maglie da gara e da allenamento, per un giocatore o per tutta la rosa, con nome e numero stampati.',
            tipologie: ['Maniche corte', 'Maniche lunghe', 'Kit gara completi', 'Divise da allenamento', 'Stampa nome e numero'], insieme: ['pantaloncini-e-calzettoni', 'borse-e-zaini'],
            prodotti: [
              { codice: 'CAL-MAG-01', nome: 'Maglia da gara a maniche corte', linea: 'entrambe', prezzo: 19.9, taglia: 'abb-tutte', disponibilita: 'in negozio', illustrazione: 'maglia', colore: '#1E46F0',
                descrizione: 'Tessuto tecnico leggero che asciuga in fretta. Tanti colori sociali, personalizzabile con nome, numero e stemma della squadra.', foto: [], modello3d: '' },
              { codice: 'CAL-MAG-02', nome: 'Maglia da gara a maniche lunghe', linea: 'adulto', prezzo: 24.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'maglia-lunga', colore: '#0E0F12',
                descrizione: 'Per le partite d\'inverno: stessa vestibilità della maglia a maniche corte, con polsini elastici. Si abbina ai kit della stessa linea.', foto: [], modello3d: '' },
              { codice: 'CAL-MAG-03', nome: 'Kit gara bambino (maglia e pantaloncino)', linea: 'bambino', prezzo: 29.9, taglia: 'abb-bambino', disponibilita: 'in negozio', illustrazione: 'maglia', colore: '#D62839',
                descrizione: 'Maglia e pantaloncino coordinati per la scuola calcio. Taglie per età con altezza indicativa: in negozio proviamo la misura giusta.', foto: [], modello3d: '' },
              { codice: 'CAL-MAG-04', nome: 'Maglia da allenamento', linea: 'entrambe', prezzo: 14.9, taglia: 'abb-tutte', disponibilita: 'su ordinazione', illustrazione: 'maglia', colore: '#FFC21A',
                descrizione: 'Maglia semplice e resistente ai lavaggi frequenti, per gli allenamenti in settimana. Prezzi dedicati per gli ordini di squadra.', foto: [], modello3d: '' }
            ] },
          { slug: 'pantaloncini-e-calzettoni', titolo: 'Pantaloncini e calzettoni', icona: 'calza', foto: null,
            descrizione: 'Pantaloncini da gara, calzettoni nei colori sociali e calze con inserti antiscivolo.',
            tipologie: ['Pantaloncini da gara', 'Calzettoni', 'Calze antiscivolo', 'Sottopantaloncini'], insieme: ['maglie-e-divise', 'parastinchi-e-protezioni'],
            prodotti: [
              { codice: 'CAL-PAN-01', nome: 'Pantaloncino da gara', linea: 'entrambe', prezzo: 12.9, taglia: 'abb-tutte', disponibilita: 'in negozio', illustrazione: 'pantaloncino', colore: '#0E0F12',
                descrizione: 'Taglio comodo con elastico in vita e cordino interno. Tessuto leggero che non trattiene il sudore.', foto: [], modello3d: '' },
              { codice: 'CAL-PAN-02', nome: 'Calzettoni da calcio', linea: 'adulto', prezzo: 8.9, taglia: 'calze', disponibilita: 'in negozio', illustrazione: 'calzettone', colore: '#1E46F0',
                descrizione: 'Calzettoni lunghi che coprono il parastinco, con piede rinforzato. Tanti colori per abbinarli alla divisa.', foto: [], modello3d: '' },
              { codice: 'CAL-PAN-03', nome: 'Calzettoni da calcio bambino', linea: 'bambino', prezzo: 6.9, taglia: 'calze-bambino', disponibilita: 'in negozio', illustrazione: 'calzettone', colore: '#D62839',
                descrizione: 'Stessa struttura dei calzettoni per adulti, in misure per bambini. Il bordo elastico tiene il parastinco senza stringere.', foto: [], modello3d: '' },
              { codice: 'CAL-PAN-04', nome: 'Calze antiscivolo', linea: 'adulto', prezzo: 14.9, taglia: 'calze', disponibilita: 'su ordinazione', illustrazione: 'calza', colore: '#F4F2ED',
                descrizione: 'Calze corte con inserti in gomma sotto la pianta, che riducono lo scivolamento del piede nella scarpa. Si indossano sotto il calzettone.', foto: [], modello3d: '' }
            ] },
          { slug: 'tute-e-felpe', titolo: 'Tute e felpe', icona: 'felpa', foto: { file: 'calcio-tute-e-felpe', alt: 'Allenatore in tuta sportiva a bordo campo' },
            descrizione: 'Tute di rappresentanza e da allenamento, felpe e giacche per le serate fredde a bordo campo.',
            tipologie: ['Tute di rappresentanza', 'Tute da allenamento', 'Felpe con zip', 'Giacche antipioggia'], insieme: ['borse-e-zaini', 'maglie-e-divise'],
            prodotti: [
              { codice: 'CAL-TUT-01', nome: 'Tuta di rappresentanza', linea: 'entrambe', prezzo: 49.9, taglia: 'abb-tutte', disponibilita: 'in negozio', illustrazione: 'giacca-tuta', colore: '#1B2A4A',
                descrizione: 'Giacca con zip intera e pantalone affusolato, per trasferte e panchina. Personalizzabile con lo stemma della società.', foto: [], modello3d: '' },
              { codice: 'CAL-TUT-02', nome: 'Felpa con cappuccio da allenamento', linea: 'adulto', prezzo: 34.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'felpa', colore: '#0E0F12',
                descrizione: 'Felpa morbida con tasca frontale, da indossare nel riscaldamento e a fine allenamento.', foto: [], modello3d: '' },
              { codice: 'CAL-TUT-03', nome: 'Giacca antipioggia', linea: 'adulto', prezzo: 39.9, taglia: 'abb-adulto', disponibilita: 'su ordinazione', illustrazione: 'giacca-tuta', colore: '#D62839',
                descrizione: 'Giacca leggera, antivento e idrorepellente, con cappuccio nel colletto. Si piega in poco spazio dentro la borsa.', foto: [], modello3d: '' },
              { codice: 'CAL-TUT-04', nome: 'Tuta da allenamento bambino', linea: 'bambino', prezzo: 34.9, taglia: 'abb-bambino', disponibilita: 'in negozio', illustrazione: 'giacca-tuta', colore: '#1F9BDB',
                descrizione: 'Giacca e pantalone in tessuto morbido e resistente, con polsini e fondo elastici. Le misure seguono età e altezza.', foto: [], modello3d: '' }
            ] },
          { slug: 'portieri', titolo: 'Portieri', icona: 'guanto', foto: { file: 'calcio-portieri', alt: 'Portiere in tuffo con i guanti verso il pallone' },
            descrizione: 'Guanti con tagli diversi e divise imbottite. La presa cambia molto da un taglio all\'altro: provali.',
            tipologie: ['Taglio negativo', 'Taglio piatto', 'Taglio roll finger', 'Divise imbottite'], insieme: ['palloni', 'borse-e-zaini'],
            prodotti: [
              { codice: 'CAL-POR-01', nome: 'Guanti da portiere taglio negativo', linea: 'adulto', prezzo: 49.9, taglia: 'guanti-portiere', misure: ['7', '8', '9', '10', '11'], disponibilita: 'in negozio', illustrazione: 'guanto-portiere', colore: '#FFC21A',
                descrizione: 'Cuciture interne che fanno aderire il lattice alle dita: presa precisa e più sensibilità sul pallone. Chiusura a strappo al polso.', foto: [], modello3d: '' },
              { codice: 'CAL-POR-02', nome: 'Guanti da portiere taglio piatto', linea: 'adulto', prezzo: 29.9, taglia: 'guanti-portiere', misure: ['7', '8', '9', '10', '11'], disponibilita: 'in negozio', illustrazione: 'guanto-portiere', colore: '#0E0F12',
                descrizione: 'Palmo largo con cuciture esterne: tanta superficie di presa e una calzata più comoda. Buoni anche per il sintetico.', foto: [], modello3d: '' },
              { codice: 'CAL-POR-03', nome: 'Guanti da portiere bambino con stecche', linea: 'bambino', prezzo: 24.9, taglia: 'guanti-portiere', misure: ['4', '5', '6', '7'], disponibilita: 'in negozio', illustrazione: 'guanto-portiere', colore: '#22A45D',
                descrizione: 'Stecche flessibili sul dorso che sostengono le dita nelle parate. Lattice morbido e misure piccole per le mani dei più giovani.', foto: [], modello3d: '' },
              { codice: 'CAL-POR-04', nome: 'Maglia da portiere imbottita', linea: 'entrambe', prezzo: 34.9, taglia: 'abb-tutte', disponibilita: 'su ordinazione', illustrazione: 'maglia-lunga', colore: '#8C6CF7',
                descrizione: 'Maniche lunghe con imbottiture leggere su gomiti e spalle. Colore diverso da quello dei compagni, come chiede il regolamento.', foto: [], modello3d: '' }
            ] },
          { slug: 'parastinchi-e-protezioni', titolo: 'Parastinchi e protezioni', icona: 'parastinchi', foto: null,
            descrizione: 'Parastinchi in più misure, con o senza protezione per la caviglia, e i fermaparastinchi.',
            tipologie: ['Parastinchi a fodero', 'Con cavigliera', 'Fermaparastinchi', 'Misure junior'], insieme: ['pantaloncini-e-calzettoni', 'scarpe-da-calcio'],
            prodotti: [
              { codice: 'CAL-PAR-01', nome: 'Parastinchi a fodero', linea: 'adulto', prezzo: 14.9, taglia: 'parastinchi', disponibilita: 'in negozio', illustrazione: 'parastinchi', colore: '#F4F2ED',
                descrizione: 'Guscio leggero da infilare nel fodero elastico o sotto il calzettone. La misura si sceglie in base all\'altezza.', foto: [], modello3d: '' },
              { codice: 'CAL-PAR-02', nome: 'Parastinchi bambino con cavigliera', linea: 'bambino', prezzo: 12.9, taglia: 'parastinchi', misure: ['XS (fino a 140 cm)', 'S (140–160 cm)'], disponibilita: 'in negozio', illustrazione: 'parastinchi', colore: '#1F9BDB',
                descrizione: 'Parastinco con cavigliera imbottita incorporata: si infila come una calza, comodo per i più piccoli.', foto: [], modello3d: '' },
              { codice: 'CAL-PAR-03', nome: 'Parastinchi in carbonio', linea: 'adulto', prezzo: 39.9, taglia: 'parastinchi', disponibilita: 'su ordinazione', illustrazione: 'parastinchi', colore: '#0E0F12',
                descrizione: 'Guscio rigido e molto sottile, per chi vuole sentire il meno possibile la protezione. Si fissa con fermaparastinchi o calza a compressione.', foto: [], modello3d: '' },
              { codice: 'CAL-PAR-04', nome: 'Fermaparastinchi elastici (coppia)', linea: 'entrambe', prezzo: 4.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'fascia', colore: '#1E46F0',
                descrizione: 'Fasce elastiche da mettere sopra il calzettone per tenere fermo il parastinco durante la partita.', foto: [], modello3d: '' }
            ] },
          { slug: 'palloni', titolo: 'Palloni', icona: 'pallone', foto: { file: 'calcio-palloni', alt: 'Palloni da calcio sull\'erba davanti a una porta' },
            descrizione: 'Palloni da gara e da allenamento nelle misure per bambini, ragazzi e adulti.',
            tipologie: ['Misura 3', 'Misura 4', 'Misura 5', 'Da gara', 'Da allenamento'], insieme: ['borse-e-zaini'],
            prodotti: [
              { codice: 'CAL-PAL-01', nome: 'Pallone da calcio da allenamento', linea: 'entrambe', prezzo: 19.9, taglia: 'pallone-calcio', disponibilita: 'in negozio', illustrazione: 'pallone-calcio', colore: '#F4F2ED',
                descrizione: 'Pallone cucito a macchina, resistente all\'uso di tutti i giorni su erba e sintetico. Misura 3 fino a 8 anni, 4 tra 8 e 12 anni, 5 dai 12 anni.', foto: [], modello3d: '' },
              { codice: 'CAL-PAL-02', nome: 'Pallone da calcio da gara', linea: 'adulto', prezzo: 39.9, taglia: 'pallone-calcio', misure: ['Misura 5'], disponibilita: 'in negozio', illustrazione: 'pallone-calcio', colore: '#FFC21A',
                descrizione: 'Pannelli termosaldati e camera in lattice: rimbalzo regolare e traiettorie precise. Misura 5, per le partite di ragazzi e adulti.', foto: [], modello3d: '' },
              { codice: 'CAL-PAL-03', nome: 'Pallone in cuoio cucito a mano', linea: 'adulto', prezzo: 59.9, taglia: 'pallone-calcio', misure: ['Misura 5'], disponibilita: 'su ordinazione', illustrazione: 'pallone-calcio', colore: '#B98A5E',
                descrizione: 'Pallone in stile classico con pannelli in cuoio cuciti a mano: più un oggetto da regalo o da collezione che da partita.', foto: [], modello3d: 'assets/3d/pallone-cuoio.glb' },
              { codice: 'CAL-PAL-04', nome: 'Pallone da calcio bambino', linea: 'bambino', prezzo: 14.9, taglia: 'pallone-calcio', misure: ['Misura 3'], disponibilita: 'in negozio', illustrazione: 'pallone-calcio', colore: '#22A45D',
                descrizione: 'Più piccolo e leggero, per i primi calci fino a 8 anni. Superficie morbida e colori vivaci, facili da seguire.', foto: [], modello3d: '' }
            ] },
          { slug: 'borse-e-zaini', titolo: 'Borse e zaini', icona: 'borsa', foto: null,
            descrizione: 'Borsoni, zaini con scomparto per le scarpe e sacche leggere per l\'allenamento.',
            tipologie: ['Borsoni', 'Zaini con scomparto scarpe', 'Sacche', 'Borracce'], insieme: ['palloni'],
            prodotti: [
              { codice: 'CAL-BOR-01', nome: 'Borsone da squadra 60 litri', linea: 'entrambe', prezzo: 34.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'borsa', colore: '#0E0F12',
                descrizione: 'Scomparto principale ampio, tasca separata per le scarpe e tracolla regolabile. Tessuto resistente e fondo rinforzato.', foto: [], modello3d: '' },
              { codice: 'CAL-BOR-02', nome: 'Zaino con scomparto scarpe', linea: 'entrambe', prezzo: 29.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'zaino', colore: '#1E46F0',
                descrizione: 'Zaino da 30 litri con vano in basso per le scarpe sporche, separato dal resto. Spallacci imbottiti.', foto: [], modello3d: '' },
              { codice: 'CAL-BOR-03', nome: 'Sacca leggera con coulisse', linea: 'entrambe', prezzo: 9.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'sacca', colore: '#D62839',
                descrizione: 'Sacca da allenamento che si chiude tirando i cordini, che fanno anche da spallacci. Leggera e lavabile.', foto: [], modello3d: '' },
              { codice: 'CAL-BOR-04', nome: 'Borraccia 750 ml', linea: 'entrambe', prezzo: 9.9, taglia: 'unica', disponibilita: 'esaurito', illustrazione: 'borraccia', colore: '#22A45D',
                descrizione: 'Borraccia in plastica per alimenti con tappo a beccuccio, facile da aprire con una mano durante le pause.', foto: [], modello3d: '' }
            ] }
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
            tipologie: ['IC – indoor e parquet', 'TF – sintetico', 'Suola in gomma', 'Calcio a 5'], insieme: ['parastinchi-e-guanti', 'pantaloncini-e-calze'],
            prodotti: [
              { codice: 'CTT-SCA-01', nome: 'Scarpa da calcetto indoor (IC)', linea: 'adulto', prezzo: 49.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-calcetto', colore: '#F4F2ED',
                descrizione: 'Suola piatta in gomma che non lascia segni, per parquet e palestre. Punta rinforzata per i tocchi tipici del calcio a 5.', foto: [], modello3d: '' },
              { codice: 'CTT-SCA-02', nome: 'Scarpa da calcetto per sintetico (TF)', linea: 'adulto', prezzo: 54.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-calcetto', colore: '#0E0F12',
                descrizione: 'Tanti piccoli tacchetti in gomma per l\'erba sintetica corta: buona presa senza affondare nel tappeto.', foto: [], modello3d: '' },
              { codice: 'CTT-SCA-03', nome: 'Scarpa da calcetto indoor bambino', linea: 'bambino', prezzo: 32.9, taglia: 'scarpe-bambino', disponibilita: 'in negozio', illustrazione: 'scarpa-calcetto', colore: '#1F9BDB',
                descrizione: 'Suola in gomma chiara e chiusura a strappo. Leggera e flessibile, per le scuole di calcio a 5 in palestra.', foto: [], modello3d: '' },
              { codice: 'CTT-SCA-04', nome: 'Scarpa da calcio a 5 in pelle', linea: 'adulto', prezzo: 109.9, taglia: 'scarpe-adulto', disponibilita: 'su ordinazione', illustrazione: 'scarpa-calcetto', colore: '#D62839',
                descrizione: 'Tomaia in pelle morbida e suola con zone di flessione per i cambi di direzione rapidi. Per chi gioca un campionato.', foto: [], modello3d: '' }
            ] },
          { slug: 'maglie-e-kit-squadra', titolo: 'Maglie e kit squadra', icona: 'maglia', foto: { file: 'calcetto-maglie-e-kit-squadra', alt: 'Giocatore in maglia gialla numero 13 che calcia verso la porta' },
            descrizione: 'Kit completi per la squadra del torneo, casacche da allenamento e maglie da portiere.',
            tipologie: ['Kit completi', 'Nome e numero', 'Casacche', 'Maglie portiere'], insieme: ['pantaloncini-e-calze', 'palloni'],
            prodotti: [
              { codice: 'CTT-MAG-01', nome: 'Kit squadra calcio a 5 (maglia e pantaloncino)', linea: 'entrambe', prezzo: 24.9, taglia: 'abb-tutte', disponibilita: 'in negozio', illustrazione: 'maglia', colore: '#FFC21A',
                descrizione: 'Maglia e pantaloncino coordinati, prezzo per giocatore. Stampa di nome e numero su richiesta, con qualche giorno di anticipo.', foto: [], modello3d: '' },
              { codice: 'CTT-MAG-02', nome: 'Casacche da allenamento (5 pezzi)', linea: 'entrambe', prezzo: 29.9, taglia: 'casacche', disponibilita: 'in negozio', illustrazione: 'canotta', colore: '#FF6B4A',
                descrizione: 'Casacche in rete leggera per dividere le squadre in allenamento. Confezione da 5 dello stesso colore.', foto: [], modello3d: '' },
              { codice: 'CTT-MAG-03', nome: 'Maglia da portiere calcio a 5', linea: 'adulto', prezzo: 27.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'maglia-lunga', colore: '#8C6CF7',
                descrizione: 'Maniche lunghe con imbottiture leggere sui gomiti, per le parate sul parquet. Colore diverso dai compagni.', foto: [], modello3d: '' },
              { codice: 'CTT-MAG-04', nome: 'Maglia squadra bambino', linea: 'bambino', prezzo: 14.9, taglia: 'abb-bambino', disponibilita: 'esaurito', illustrazione: 'maglia', colore: '#1E46F0',
                descrizione: 'Maglia da gara in tessuto leggero per i tornei dei più piccoli. Personalizzabile con nome e numero.', foto: [], modello3d: '' }
            ] },
          { slug: 'pantaloncini-e-calze', titolo: 'Pantaloncini e calze', icona: 'calza', foto: null,
            descrizione: 'Pantaloncini leggeri, calze corte o lunghe e calze con inserti antiscivolo.',
            tipologie: ['Pantaloncini', 'Calze corte', 'Calzettoni', 'Calze antiscivolo'], insieme: ['maglie-e-kit-squadra', 'parastinchi-e-guanti'],
            prodotti: [
              { codice: 'CTT-PAN-01', nome: 'Pantaloncino leggero', linea: 'entrambe', prezzo: 11.9, taglia: 'abb-tutte', disponibilita: 'in negozio', illustrazione: 'pantaloncino', colore: '#0E0F12',
                descrizione: 'Pantaloncino corto e leggero con elastico in vita, che non intralcia nei movimenti rapidi.', foto: [], modello3d: '' },
              { codice: 'CTT-PAN-02', nome: 'Calze corte tecniche', linea: 'adulto', prezzo: 7.9, taglia: 'calze', disponibilita: 'in negozio', illustrazione: 'calza', colore: '#F4F2ED',
                descrizione: 'Calze corte con zone più spesse su tallone e punta. Da usare con i parastinchi leggeri o senza.', foto: [], modello3d: '' },
              { codice: 'CTT-PAN-03', nome: 'Calzettoni da calcetto bambino', linea: 'bambino', prezzo: 6.9, taglia: 'calze-bambino', disponibilita: 'in negozio', illustrazione: 'calzettone', colore: '#FFC21A',
                descrizione: 'Calzettoni lunghi in misure per bambini, per tenere fermi i parastinchi.', foto: [], modello3d: '' },
              { codice: 'CTT-PAN-04', nome: 'Calze antiscivolo', linea: 'adulto', prezzo: 14.9, taglia: 'calze', disponibilita: 'su ordinazione', illustrazione: 'calza', colore: '#0E0F12',
                descrizione: 'Inserti in gomma sotto la pianta che riducono lo scivolamento del piede nella scarpa da indoor.', foto: [], modello3d: '' }
            ] },
          { slug: 'parastinchi-e-guanti', titolo: 'Parastinchi e guanti', icona: 'guanto', foto: null,
            descrizione: 'Parastinchi leggeri e compatti e guanti da portiere pensati per il calcio a 5.',
            tipologie: ['Parastinchi leggeri', 'Parastinchi a fodero', 'Guanti da portiere', 'Misure junior'], insieme: ['scarpe-da-calcetto', 'pantaloncini-e-calze'],
            prodotti: [
              { codice: 'CTT-PAR-01', nome: 'Parastinchi leggeri da calcetto', linea: 'adulto', prezzo: 9.9, taglia: 'parastinchi', disponibilita: 'in negozio', illustrazione: 'parastinchi', colore: '#F4F2ED',
                descrizione: 'Parastinchi piccoli e leggeri, da tenere sotto le calze o i calzettoni. Si scelgono in base all\'altezza.', foto: [], modello3d: '' },
              { codice: 'CTT-PAR-02', nome: 'Parastinchi bambino', linea: 'bambino', prezzo: 8.9, taglia: 'parastinchi', misure: ['XS (fino a 140 cm)', 'S (140–160 cm)'], disponibilita: 'in negozio', illustrazione: 'parastinchi', colore: '#1F9BDB',
                descrizione: 'Guscio leggero con imbottitura morbida, nelle misure per bambini.', foto: [], modello3d: '' },
              { codice: 'CTT-PAR-03', nome: 'Guanti da portiere calcio a 5', linea: 'adulto', prezzo: 24.9, taglia: 'guanti-portiere', misure: ['7', '8', '9', '10', '11'], disponibilita: 'in negozio', illustrazione: 'guanto-portiere', colore: '#0E0F12',
                descrizione: 'Lattice sottile sul palmo e dorso traspirante: più sensibilità per le parate ravvicinate e le rimesse con le mani.', foto: [], modello3d: '' },
              { codice: 'CTT-PAR-04', nome: 'Guanti da portiere bambino', linea: 'bambino', prezzo: 16.9, taglia: 'guanti-portiere', misure: ['4', '5', '6', '7'], disponibilita: 'su ordinazione', illustrazione: 'guanto-portiere', colore: '#22A45D',
                descrizione: 'Guanti morbidi nelle misure piccole, per i portieri delle scuole calcio.', foto: [], modello3d: '' }
            ] },
          { slug: 'palloni', titolo: 'Palloni', icona: 'pallone', foto: { file: 'calcetto-palloni', alt: 'Palloni da calcio a 5 sul parquet scuro' },
            descrizione: 'Palloni a rimbalzo controllato per il calcio a 5 e palloni per il sintetico all\'aperto.',
            tipologie: ['Misura 4 a rimbalzo controllato', 'Per sintetico', 'Da allenamento'], insieme: ['borse-e-zaini'],
            prodotti: [
              { codice: 'CTT-PAL-01', nome: 'Pallone da calcio a 5 a rimbalzo controllato', linea: 'adulto', prezzo: 29.9, taglia: 'pallone-calcio', misure: ['Misura 4'], disponibilita: 'in negozio', illustrazione: 'pallone-calcio', colore: '#FFC21A',
                descrizione: 'Misura 4 a rimbalzo ridotto, come chiede il regolamento del calcio a 5: resta più a terra e si controlla meglio con la suola.', foto: [], modello3d: '' },
              { codice: 'CTT-PAL-02', nome: 'Pallone da calcio a 5 da allenamento', linea: 'entrambe', prezzo: 19.9, taglia: 'pallone-calcio', misure: ['Misura 4'], disponibilita: 'in negozio', illustrazione: 'pallone-calcio', colore: '#F4F2ED',
                descrizione: 'Stesso rimbalzo controllato del pallone da gara, con una copertura più robusta per gli allenamenti.', foto: [], modello3d: '' },
              { codice: 'CTT-PAL-03', nome: 'Pallone per sintetico all\'aperto', linea: 'entrambe', prezzo: 17.9, taglia: 'pallone-calcio', disponibilita: 'in negozio', illustrazione: 'pallone-calcio', colore: '#1E46F0',
                descrizione: 'Copertura che resiste all\'abrasione del sintetico e del cemento. Rimbalzo normale, per il calcetto all\'aperto.', foto: [], modello3d: '' },
              { codice: 'CTT-PAL-04', nome: 'Pallone da calcio a 5 bambino', linea: 'bambino', prezzo: 19.9, taglia: 'pallone-calcio', misure: ['Misura 3'], disponibilita: 'esaurito', illustrazione: 'pallone-calcio', colore: '#22A45D',
                descrizione: 'Misura 3 a rimbalzo controllato, più leggero, per le scuole di calcio a 5.', foto: [], modello3d: '' }
            ] },
          { slug: 'borse-e-zaini', titolo: 'Borse e zaini', icona: 'borsa', foto: null,
            descrizione: 'Zaini compatti e borse con scomparto separato per scarpe e indumenti bagnati.',
            tipologie: ['Zaini', 'Borse a tracolla', 'Sacche scarpe', 'Borracce'], insieme: ['palloni'],
            prodotti: [
              { codice: 'CTT-BOR-01', nome: 'Zaino compatto 25 litri', linea: 'entrambe', prezzo: 24.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'zaino', colore: '#0E0F12',
                descrizione: 'Zaino piccolo con tasca separata per scarpe e indumenti bagnati. Ci sta tutto per la partita della sera.', foto: [], modello3d: '' },
              { codice: 'CTT-BOR-02', nome: 'Borsa a tracolla da calcetto', linea: 'adulto', prezzo: 29.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'borsa', colore: '#5C626C',
                descrizione: 'Borsa media con tracolla imbottita e tasca laterale per le scarpe.', foto: [], modello3d: '' },
              { codice: 'CTT-BOR-03', nome: 'Sacca porta scarpe', linea: 'entrambe', prezzo: 7.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'sacca', colore: '#1E46F0',
                descrizione: 'Sacca leggera con coulisse, per tenere le scarpe separate dal resto nella borsa.', foto: [], modello3d: '' },
              { codice: 'CTT-BOR-04', nome: 'Borraccia termica 500 ml', linea: 'entrambe', prezzo: 19.9, taglia: 'unica', disponibilita: 'su ordinazione', illustrazione: 'borraccia', colore: '#F4F2ED',
                descrizione: 'Doppia parete in acciaio: mantiene la bevanda fresca per ore. Tappo a vite con laccio.', foto: [], modello3d: '' }
            ] }
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
            tipologie: ['Taglio alto', 'Taglio medio', 'Taglio basso', 'Indoor', 'Outdoor'], insieme: ['protezioni-e-accessori', 'canotte-e-pantaloncini'],
            prodotti: [
              { codice: 'BAS-SCA-01', nome: 'Scarpa da basket a taglio alto', linea: 'adulto', prezzo: 99.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-alta', colore: '#0E0F12',
                descrizione: 'Collare alto e imbottito che avvolge la caviglia, intersuola ammortizzata per i salti. Suola a spina di pesce per il parquet.', foto: [], modello3d: '' },
              { codice: 'BAS-SCA-02', nome: 'Scarpa da basket a taglio basso', linea: 'adulto', prezzo: 79.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-campo', colore: '#F4F2ED',
                descrizione: 'Più leggera e libera alla caviglia, per chi gioca veloce e cambia spesso direzione.', foto: [], modello3d: '' },
              { codice: 'BAS-SCA-03', nome: 'Scarpa da basket bambino', linea: 'bambino', prezzo: 44.9, taglia: 'scarpe-bambino', disponibilita: 'in negozio', illustrazione: 'scarpa-alta', colore: '#FF6B4A',
                descrizione: 'Taglio medio, suola in gomma con buona presa e lacci con strappo sulla caviglia: pensata per il minibasket.', foto: [], modello3d: '' },
              { codice: 'BAS-SCA-04', nome: 'Scarpa da basket per l\'aperto', linea: 'adulto', prezzo: 69.9, taglia: 'scarpe-adulto', disponibilita: 'su ordinazione', illustrazione: 'scarpa-alta', colore: '#D62839',
                descrizione: 'Suola in gomma più spessa e resistente per il campetto in cemento o asfalto, dove una suola da palestra si consuma presto.', foto: [], modello3d: '' }
            ] },
          { slug: 'canotte-e-pantaloncini', titolo: 'Canotte e pantaloncini', icona: 'canotta', foto: { file: 'basket-canotte-e-pantaloncini', alt: 'Giocatore di basket in canotta blu numero 13' },
            descrizione: 'Divise da gara anche reversibili, pantaloncini lunghi e maglie da riscaldamento.',
            tipologie: ['Canotte reversibili', 'Divise da squadra', 'Pantaloncini', 'Maglie da riscaldamento'], insieme: ['tute-e-felpe', 'protezioni-e-accessori'],
            prodotti: [
              { codice: 'BAS-CAN-01', nome: 'Canotta reversibile', linea: 'entrambe', prezzo: 17.9, taglia: 'abb-tutte', disponibilita: 'in negozio', illustrazione: 'canotta', colore: '#1E46F0',
                descrizione: 'Due colori in una canotta: si gira per allenamenti e partitelle. Tessuto in rete traspirante.', foto: [], modello3d: '' },
              { codice: 'BAS-CAN-02', nome: 'Pantaloncino da basket', linea: 'entrambe', prezzo: 19.9, taglia: 'abb-tutte', disponibilita: 'in negozio', illustrazione: 'pantaloncino', colore: '#0E0F12',
                descrizione: 'Taglio lungo sopra il ginocchio, elastico in vita con cordino. Ampio e leggero per muoversi liberi.', foto: [], modello3d: '' },
              { codice: 'BAS-CAN-03', nome: 'Canotta minibasket', linea: 'bambino', prezzo: 12.9, taglia: 'abb-bambino', disponibilita: 'in negozio', illustrazione: 'canotta', colore: '#FFC21A',
                descrizione: 'Canotta leggera nelle taglie per bambini, personalizzabile con il numero.', foto: [], modello3d: '' },
              { codice: 'BAS-CAN-04', nome: 'Divisa da squadra (canotta e pantaloncino)', linea: 'adulto', prezzo: 39.9, taglia: 'abb-adulto', disponibilita: 'su ordinazione', illustrazione: 'canotta', colore: '#D62839',
                descrizione: 'Kit da gara personalizzabile con nome, numero e stemma. Per le squadre conviene ordinare con anticipo.', foto: [], modello3d: '' },
              { codice: 'BAS-CAN-05', nome: 'Maglia da riscaldamento', linea: 'adulto', prezzo: 24.9, taglia: 'abb-adulto', disponibilita: 'esaurito', illustrazione: 'maglia', colore: '#5C626C',
                descrizione: 'Maglia a maniche corte da indossare sopra la canotta nel riscaldamento prima della partita.', foto: [], modello3d: '' }
            ] },
          { slug: 'tute-e-felpe', titolo: 'Tute e felpe', icona: 'felpa', foto: null,
            descrizione: 'Tute di squadra, felpe con cappuccio e pantaloni per il riscaldamento prima della partita.',
            tipologie: ['Tute di squadra', 'Felpe con cappuccio', 'Pantaloni da riscaldamento'], insieme: ['canotte-e-pantaloncini', 'scarpe'],
            prodotti: [
              { codice: 'BAS-TUT-01', nome: 'Felpa con cappuccio', linea: 'entrambe', prezzo: 34.9, taglia: 'abb-tutte', disponibilita: 'in negozio', illustrazione: 'felpa', colore: '#0E0F12',
                descrizione: 'Felpa morbida con cappuccio e tasca frontale, per il riscaldamento e il dopo partita.', foto: [], modello3d: '' },
              { codice: 'BAS-TUT-02', nome: 'Pantalone da riscaldamento', linea: 'adulto', prezzo: 29.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'pantalone', colore: '#5C626C',
                descrizione: 'Bottoni a pressione lungo i lati: si toglie in un attimo, senza sfilare le scarpe, prima di entrare in campo.', foto: [], modello3d: '' },
              { codice: 'BAS-TUT-03', nome: 'Tuta di squadra', linea: 'adulto', prezzo: 54.9, taglia: 'abb-adulto', disponibilita: 'su ordinazione', illustrazione: 'giacca-tuta', colore: '#1B2A4A',
                descrizione: 'Giacca e pantalone coordinati per la squadra, personalizzabili con lo stemma della società.', foto: [], modello3d: '' },
              { codice: 'BAS-TUT-04', nome: 'Tuta bambino', linea: 'bambino', prezzo: 32.9, taglia: 'abb-bambino', disponibilita: 'in negozio', illustrazione: 'giacca-tuta', colore: '#FF6B4A',
                descrizione: 'Tuta in tessuto morbido e resistente per il minibasket, con polsini e fondo elastici.', foto: [], modello3d: '' }
            ] },
          { slug: 'palloni', titolo: 'Palloni', icona: 'basket', foto: { file: 'basket-palloni', alt: 'Due palloni da basket sul parquet' },
            descrizione: 'La misura dipende dall\'età e dalla categoria. Per il campetto all\'aperto serve un pallone più resistente.',
            tipologie: ['Misura 5 – minibasket', 'Misura 6 – femminile e giovanili', 'Misura 7 – maschile', 'Indoor', 'Outdoor'], insieme: ['protezioni-e-accessori', 'fitness-e-palestra/borse-e-accessori'],
            prodotti: [
              { codice: 'BAS-PAL-01', nome: 'Pallone da basket misura 7', linea: 'adulto', prezzo: 29.9, taglia: 'pallone-basket', misure: ['Misura 7'], disponibilita: 'in negozio', illustrazione: 'pallone-basket', colore: '#FF6B4A',
                descrizione: 'La misura del basket maschile, circa 75 cm di circonferenza. Copertura in materiale composito con buona presa in palestra.', foto: [], modello3d: '' },
              { codice: 'BAS-PAL-02', nome: 'Pallone da basket misura 6', linea: 'entrambe', prezzo: 27.9, taglia: 'pallone-basket', misure: ['Misura 6'], disponibilita: 'in negozio', illustrazione: 'pallone-basket', colore: '#FF6B4A',
                descrizione: 'La misura del basket femminile e di molte categorie giovanili. Controlla sempre il regolamento del tuo campionato.', foto: [], modello3d: '' },
              { codice: 'BAS-PAL-03', nome: 'Pallone da minibasket misura 5', linea: 'bambino', prezzo: 19.9, taglia: 'pallone-basket', misure: ['Misura 5'], disponibilita: 'in negozio', illustrazione: 'pallone-basket', colore: '#1F9BDB',
                descrizione: 'Più piccolo e leggero, la misura del minibasket. Superficie morbida, facile da palleggiare.', foto: [], modello3d: '' },
              { codice: 'BAS-PAL-04', nome: 'Pallone da basket per l\'aperto', linea: 'entrambe', prezzo: 22.9, taglia: 'pallone-basket', disponibilita: 'in negozio', illustrazione: 'pallone-basket', colore: '#D62839',
                descrizione: 'Copertura in gomma resistente per il cemento e l\'asfalto del campetto.', foto: [], modello3d: '' }
            ] },
          { slug: 'protezioni-e-accessori', titolo: 'Protezioni e accessori', icona: 'protezione', foto: null,
            descrizione: 'Ginocchiere, cavigliere, calze tecniche e fasce per allenamenti e partite.',
            tipologie: ['Ginocchiere', 'Cavigliere', 'Calze tecniche', 'Fasce'], insieme: ['scarpe', 'canotte-e-pantaloncini'],
            prodotti: [
              { codice: 'BAS-PRO-01', nome: 'Ginocchiere imbottite', linea: 'adulto', prezzo: 24.9, taglia: 'protezioni', disponibilita: 'in negozio', illustrazione: 'ginocchiera', colore: '#0E0F12',
                descrizione: 'Manicotto elastico con imbottitura sul ginocchio, per i contatti e le cadute sul parquet.', foto: [], modello3d: '' },
              { codice: 'BAS-PRO-02', nome: 'Ginocchiere bambino', linea: 'bambino', prezzo: 16.9, taglia: 'protezioni', misure: ['XS', 'S'], disponibilita: 'in negozio', illustrazione: 'ginocchiera', colore: '#1E46F0',
                descrizione: 'Ginocchiere leggere nelle misure piccole, per il minibasket.', foto: [], modello3d: '' },
              { codice: 'BAS-PRO-03', nome: 'Cavigliera elastica', linea: 'entrambe', prezzo: 14.9, taglia: 'protezioni', disponibilita: 'in negozio', illustrazione: 'calza', colore: '#5C626C',
                descrizione: 'Tessuto elastico che avvolge la caviglia. Non sostituisce un tutore consigliato dal medico.', foto: [], modello3d: '' },
              { codice: 'BAS-PRO-04', nome: 'Calze tecniche da basket', linea: 'adulto', prezzo: 9.9, taglia: 'calze', disponibilita: 'in negozio', illustrazione: 'calza', colore: '#F4F2ED',
                descrizione: 'Calze di media altezza con imbottitura sotto il piede, per assorbire i salti.', foto: [], modello3d: '' },
              { codice: 'BAS-PRO-05', nome: 'Fascia per capelli e polsini', linea: 'entrambe', prezzo: 8.9, taglia: 'unica', disponibilita: 'esaurito', illustrazione: 'fascia', colore: '#D62839',
                descrizione: 'Set in spugna: fascia per la fronte e due polsini che fermano il sudore.', foto: [], modello3d: '' }
            ] }
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
            tipologie: ['Indoor', 'Taglio basso', 'Taglio medio', 'Suola in gomma'], insieme: ['ginocchiere-e-protezioni', 'divise'],
            prodotti: [
              { codice: 'PAL-SCA-01', nome: 'Scarpa da pallavolo indoor', linea: 'adulto', prezzo: 74.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-campo', colore: '#F4F2ED',
                descrizione: 'Suola in gomma che fa presa sul parquet e intersuola ammortizzata per gli atterraggi dopo il salto.', foto: [], modello3d: '' },
              { codice: 'PAL-SCA-02', nome: 'Scarpa da pallavolo a taglio medio', linea: 'adulto', prezzo: 99.9, taglia: 'scarpe-adulto', disponibilita: 'su ordinazione', illustrazione: 'scarpa-alta', colore: '#1E46F0',
                descrizione: 'Collare più alto che avvolge la caviglia, per chi salta molto a muro e in attacco.', foto: [], modello3d: '' },
              { codice: 'PAL-SCA-03', nome: 'Scarpa da pallavolo bambino', linea: 'bambino', prezzo: 39.9, taglia: 'scarpe-bambino', disponibilita: 'in negozio', illustrazione: 'scarpa-campo', colore: '#F45BA4',
                descrizione: 'Suola chiara che non segna il parquet e chiusura a strappo, per il minivolley.', foto: [], modello3d: '' },
              { codice: 'PAL-SCA-04', nome: 'Scarpa da palestra multisport', linea: 'entrambe', prezzo: 44.9, taglia: 'scarpe-tutte', disponibilita: 'in negozio', illustrazione: 'scarpa-campo', colore: '#0E0F12',
                descrizione: 'Suola in gomma che non segna il parquet: va bene per pallavolo, ginnastica e minivolley.', foto: [], modello3d: '' }
            ] },
          { slug: 'divise', titolo: 'Divise', icona: 'maglia', foto: { file: 'pallavolo-divise', alt: 'Pallavolista di spalle con la maglia numero 9' },
            descrizione: 'Maglie e pantaloncini da gara per la squadra, con la maglia del libero di colore diverso.',
            tipologie: ['Maglie da gara', 'Pantaloncini', 'Maglia libero', 'Nome e numero'], insieme: ['ginocchiere-e-protezioni', 'borse-e-accessori'],
            prodotti: [
              { codice: 'PAL-DIV-01', nome: 'Maglia da gara pallavolo', linea: 'entrambe', prezzo: 19.9, taglia: 'abb-tutte', disponibilita: 'in negozio', illustrazione: 'maglia', colore: '#FFC21A',
                descrizione: 'Maglia aderente in tessuto elastico che non intralcia i movimenti a rete. Personalizzabile con nome e numero.', foto: [], modello3d: '' },
              { codice: 'PAL-DIV-02', nome: 'Pantaloncino da pallavolo', linea: 'adulto', prezzo: 14.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'pantaloncino', colore: '#0E0F12',
                descrizione: 'Pantaloncino corto ed elastico, che resta fermo nei tuffi e nelle cadute.', foto: [], modello3d: '' },
              { codice: 'PAL-DIV-03', nome: 'Maglia del libero', linea: 'adulto', prezzo: 21.9, taglia: 'abb-adulto', disponibilita: 'su ordinazione', illustrazione: 'maglia', colore: '#8C6CF7',
                descrizione: 'Il libero gioca con una maglia di colore diverso dai compagni: la prepariamo abbinata alla vostra divisa.', foto: [], modello3d: '' },
              { codice: 'PAL-DIV-04', nome: 'Divisa minivolley', linea: 'bambino', prezzo: 24.9, taglia: 'abb-bambino', disponibilita: 'in negozio', illustrazione: 'maglia', colore: '#1F9BDB',
                descrizione: 'Maglia e pantaloncino nelle taglie per bambini, per i primi tornei.', foto: [], modello3d: '' }
            ] },
          { slug: 'ginocchiere-e-protezioni', titolo: 'Ginocchiere e protezioni', icona: 'protezione', foto: { file: 'pallavolo-ginocchiere-e-protezioni', alt: 'Pallavolista con le ginocchiere in posizione di ricezione' },
            descrizione: 'Ginocchiere imbottite in più spessori, gomitiere e cavigliere. Si provano: la taglia conta.',
            tipologie: ['Ginocchiere', 'Gomitiere', 'Cavigliere', 'Calze tecniche'], insieme: ['scarpe', 'divise'],
            prodotti: [
              { codice: 'PAL-GIN-01', nome: 'Ginocchiere da pallavolo', linea: 'adulto', prezzo: 19.9, taglia: 'protezioni', disponibilita: 'in negozio', illustrazione: 'ginocchiera', colore: '#0E0F12',
                descrizione: 'Imbottitura morbida sul ginocchio e tessuto elastico. Devono restare ferme senza stringere: si provano piegando le gambe.', foto: [], modello3d: '' },
              { codice: 'PAL-GIN-02', nome: 'Ginocchiere bambino', linea: 'bambino', prezzo: 14.9, taglia: 'protezioni', misure: ['XS', 'S'], disponibilita: 'in negozio', illustrazione: 'ginocchiera', colore: '#F4F2ED',
                descrizione: 'Ginocchiere leggere nelle misure piccole, per il minivolley.', foto: [], modello3d: '' },
              { codice: 'PAL-GIN-03', nome: 'Ginocchiere a spessore alto', linea: 'adulto', prezzo: 29.9, taglia: 'protezioni', disponibilita: 'su ordinazione', illustrazione: 'ginocchiera', colore: '#5C626C',
                descrizione: 'Imbottitura più spessa per i ruoli di difesa, che finiscono spesso a terra.', foto: [], modello3d: '' },
              { codice: 'PAL-GIN-04', nome: 'Gomitiere', linea: 'entrambe', prezzo: 16.9, taglia: 'protezioni', disponibilita: 'esaurito', illustrazione: 'ginocchiera', colore: '#0E0F12',
                descrizione: 'Manicotti imbottiti per i gomiti, utili negli allenamenti di difesa.', foto: [], modello3d: '' }
            ] },
          { slug: 'palloni', titolo: 'Palloni', icona: 'volley', foto: { file: 'pallavolo-palloni', alt: 'Pallone da pallavolo sul parquet tra due giocatrici' },
            descrizione: 'Palloni da indoor per gara e allenamento, palloni da beach volley e per il minivolley.',
            tipologie: ['Indoor', 'Beach volley', 'Minivolley', 'Allenamento'], insieme: ['borse-e-accessori'],
            prodotti: [
              { codice: 'PAL-PAL-01', nome: 'Pallone da pallavolo da gara', linea: 'adulto', prezzo: 49.9, taglia: 'pallone-volley', disponibilita: 'in negozio', illustrazione: 'pallone-volley', colore: '#FFC21A',
                descrizione: 'Misura 5 regolamentare, superficie in microfibra morbida al tocco. Per le partite ufficiali in palestra.', foto: [], modello3d: '' },
              { codice: 'PAL-PAL-02', nome: 'Pallone da pallavolo da allenamento', linea: 'entrambe', prezzo: 24.9, taglia: 'pallone-volley', disponibilita: 'in negozio', illustrazione: 'pallone-volley', colore: '#1E46F0',
                descrizione: 'Stessa misura del pallone da gara, con una copertura più robusta per l\'uso di tutti i giorni.', foto: [], modello3d: '' },
              { codice: 'PAL-PAL-03', nome: 'Pallone da minivolley', linea: 'bambino', prezzo: 16.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'pallone-volley', colore: '#F45BA4',
                descrizione: 'Più leggero e morbido del normale, pensato per il minivolley: i primi palleggi fanno meno male alle braccia.', foto: [], modello3d: '' },
              { codice: 'PAL-PAL-04', nome: 'Pallone da beach volley', linea: 'adulto', prezzo: 29.9, taglia: 'pallone-volley', disponibilita: 'su ordinazione', illustrazione: 'pallone-volley', colore: '#F4F2ED',
                descrizione: 'Più morbido e un po\' più grande del pallone da palestra, con cuciture che resistono a sabbia e acqua. Non è adatto alla palestra.', foto: [], modello3d: '' }
            ] },
          { slug: 'borse-e-accessori', titolo: 'Borse e accessori', icona: 'borsa', foto: null,
            descrizione: 'Zaini, borse porta palloni per le società, borracce e fasce.',
            tipologie: ['Zaini', 'Borse porta palloni', 'Borracce', 'Fasce'], insieme: ['palloni'],
            prodotti: [
              { codice: 'PAL-BOR-01', nome: 'Zaino con porta pallone', linea: 'entrambe', prezzo: 34.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'zaino', colore: '#0E0F12',
                descrizione: 'Zaino con rete esterna per il pallone e tasca separata per le scarpe da palestra.', foto: [], modello3d: '' },
              { codice: 'PAL-BOR-02', nome: 'Sacca porta palloni (12 palloni)', linea: 'adulto', prezzo: 39.9, taglia: 'unica', disponibilita: 'su ordinazione', illustrazione: 'sacca', colore: '#5C626C',
                descrizione: 'Sacca in rete con chiusura a coulisse e tracolla, per portare fino a 12 palloni in palestra.', foto: [], modello3d: '' },
              { codice: 'PAL-BOR-03', nome: 'Borraccia 750 ml', linea: 'entrambe', prezzo: 9.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'borraccia', colore: '#FFC21A',
                descrizione: 'Borraccia in plastica per alimenti con tappo a beccuccio, da tenere a bordo campo.', foto: [], modello3d: '' },
              { codice: 'PAL-BOR-04', nome: 'Fascia per capelli', linea: 'entrambe', prezzo: 5.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'fascia', colore: '#1E46F0',
                descrizione: 'Fascia elastica sottile che tiene fermi i capelli durante la partita.', foto: [], modello3d: '' }
            ] }
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
            tipologie: ['Ovale grande', 'Peso leggero', 'Peso medio', 'Junior per altezza', 'Misure del manico'], insieme: ['palline', 'accessori'],
            prodotti: [
              { codice: 'TEN-RAC-01', nome: 'Racchetta da tennis a ovale grande', linea: 'adulto', prezzo: 89.9, taglia: 'impugnatura', disponibilita: 'in negozio', illustrazione: 'racchetta-tennis', colore: '#1E46F0',
                descrizione: 'Peso contenuto e piatto corde ampio: perdona i colpi non centrati. Indicata per chi inizia o torna a giocare.', foto: [], modello3d: '' },
              { codice: 'TEN-RAC-02', nome: 'Racchetta da tennis peso medio', linea: 'adulto', prezzo: 149.9, taglia: 'impugnatura', disponibilita: 'in negozio', illustrazione: 'racchetta-tennis', colore: '#0E0F12',
                descrizione: 'Intorno ai 285–300 grammi: più stabilità e controllo per chi ha già una buona tecnica.', foto: [], modello3d: '' },
              { codice: 'TEN-RAC-03', nome: 'Racchetta da tennis junior', linea: 'bambino', prezzo: 39.9, taglia: 'racchetta-junior', disponibilita: 'in negozio', illustrazione: 'racchetta-tennis', colore: '#FF6B4A',
                descrizione: 'La lunghezza si sceglie in base all\'altezza: con il braccio disteso lungo il fianco, la punta della racchetta deve sfiorare il terreno.', foto: [], modello3d: '' },
              { codice: 'TEN-RAC-04', nome: 'Racchetta da tennis agonistica', linea: 'adulto', prezzo: 219.9, taglia: 'impugnatura', disponibilita: 'su ordinazione', illustrazione: 'racchetta-tennis', colore: '#D62839',
                descrizione: 'Telaio più pesante e piatto corde più piccolo, per giocatori esperti. Si ordina nella misura del manico che serve.', foto: [], modello3d: '' }
            ] },
          { slug: 'scarpe', titolo: 'Scarpe', icona: 'scarpa', foto: { file: 'tennis-scarpe', alt: 'Scarpe da tennis sulla terra rossa' },
            descrizione: 'Scarpe con suola a spina di pesce per la terra rossa, suole più resistenti per il cemento.',
            tipologie: ['Terra rossa', 'Cemento', 'Erba sintetica', 'Tutti i campi'], insieme: ['abbigliamento', 'palline'],
            prodotti: [
              { codice: 'TEN-SCA-01', nome: 'Scarpa da tennis per terra rossa', linea: 'adulto', prezzo: 79.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-campo', colore: '#F4F2ED',
                descrizione: 'Suola a spina di pesce che scivola il giusto e non trattiene la terra.', foto: [], modello3d: '' },
              { codice: 'TEN-SCA-02', nome: 'Scarpa da tennis per cemento', linea: 'adulto', prezzo: 89.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-campo', colore: '#1E46F0',
                descrizione: 'Mescola più dura e puntale rinforzato, per resistere all\'usura dei campi in cemento.', foto: [], modello3d: '' },
              { codice: 'TEN-SCA-03', nome: 'Scarpa da tennis bambino', linea: 'bambino', prezzo: 39.9, taglia: 'scarpe-bambino', disponibilita: 'in negozio', illustrazione: 'scarpa-campo', colore: '#FF6B4A',
                descrizione: 'Suola per tutti i campi e chiusura a strappo, per i corsi di minitennis.', foto: [], modello3d: '' },
              { codice: 'TEN-SCA-04', nome: 'Scarpa da tennis per tutti i campi', linea: 'adulto', prezzo: 64.9, taglia: 'scarpe-adulto', disponibilita: 'su ordinazione', illustrazione: 'scarpa-campo', colore: '#0E0F12',
                descrizione: 'Suola con disegno misto, per chi gioca su superfici diverse durante la settimana.', foto: [], modello3d: '' }
            ] },
          { slug: 'abbigliamento', titolo: 'Abbigliamento', icona: 'maglia', foto: { file: 'tennis-abbigliamento', alt: 'Tennista in completo bianco su un campo in cemento' },
            descrizione: 'Polo, t-shirt traspiranti, shorts e gonne, tute e cappellini per le giornate di sole.',
            tipologie: ['Polo e t-shirt', 'Shorts e gonne', 'Tute', 'Cappellini e fasce'], insieme: ['scarpe', 'accessori'],
            prodotti: [
              { codice: 'TEN-ABB-01', nome: 'Polo da tennis', linea: 'adulto', prezzo: 34.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'maglia', colore: '#F4F2ED',
                descrizione: 'Polo in tessuto tecnico traspirante, con colletto morbido che non irrita.', foto: [], modello3d: '' },
              { codice: 'TEN-ABB-02', nome: 'Shorts da tennis con tasche', linea: 'adulto', prezzo: 32.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'pantaloncino', colore: '#1B2A4A',
                descrizione: 'Tasche profonde per tenere la seconda pallina durante il servizio.', foto: [], modello3d: '' },
              { codice: 'TEN-ABB-03', nome: 'Gonna con pantaloncino interno', linea: 'adulto', prezzo: 34.9, taglia: 'abb-adulto', disponibilita: 'su ordinazione', illustrazione: 'gonna', colore: '#F45BA4',
                descrizione: 'Gonna leggera con pantaloncino interno e tasca per la pallina.', foto: [], modello3d: '' },
              { codice: 'TEN-ABB-04', nome: 'T-shirt tecnica bambino', linea: 'bambino', prezzo: 17.9, taglia: 'abb-bambino', disponibilita: 'in negozio', illustrazione: 'maglia', colore: '#FFC21A',
                descrizione: 'Maglietta leggera che asciuga in fretta, per i corsi e i primi tornei.', foto: [], modello3d: '' },
              { codice: 'TEN-ABB-05', nome: 'Cappellino con visiera', linea: 'entrambe', prezzo: 16.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'cappellino', colore: '#F4F2ED',
                descrizione: 'Cappellino leggero con chiusura regolabile, per le giornate di sole in campo.', foto: [], modello3d: '' }
            ] },
          { slug: 'palline', titolo: 'Palline', icona: 'pallina', foto: { file: 'tennis-palline', alt: 'Pallina da tennis sulla terra rossa' },
            descrizione: 'Palline pressurizzate in tubo, depressurizzate per il cesto e palline più lente per i bambini.',
            tipologie: ['Pressurizzate', 'Depressurizzate', 'Bambini: rossa, arancione, verde'], insieme: ['accessori', 'borse-e-sacche'],
            prodotti: [
              { codice: 'TEN-PAL-01', nome: 'Palline pressurizzate (tubo da 4)', linea: 'adulto', prezzo: 7.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'palline', colore: '#D9DD4E',
                descrizione: 'Palline da partita con pressione interna: rimbalzo vivace, che cala dopo qualche partita.', foto: [], modello3d: '' },
              { codice: 'TEN-PAL-02', nome: 'Palline depressurizzate (sacco da 72)', linea: 'adulto', prezzo: 89.9, taglia: 'nessuna', disponibilita: 'su ordinazione', illustrazione: 'palline', colore: '#D9DD4E',
                descrizione: 'Senza pressione interna, non si sgonfiano col tempo: adatte al cesto delle lezioni e alla macchina lanciapalle.', foto: [], modello3d: '' },
              { codice: 'TEN-PAL-03', nome: 'Palline per bambini, livello rosso (3 pezzi)', linea: 'bambino', prezzo: 5.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'palline', colore: '#E2543E',
                descrizione: 'Palline più grandi e lente, circa il 75% più lente di una pallina normale, per il minitennis su campo piccolo.', foto: [], modello3d: '' },
              { codice: 'TEN-PAL-04', nome: 'Palline per bambini, livello arancione (3 pezzi)', linea: 'bambino', prezzo: 5.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'palline', colore: '#F2913D',
                descrizione: 'Il passo dopo la rossa: circa il 50% più lente di una pallina normale, per il campo da 18 metri.', foto: [], modello3d: '' },
              { codice: 'TEN-PAL-05', nome: 'Palline per bambini, livello verde (3 pezzi)', linea: 'bambino', prezzo: 7.9, taglia: 'nessuna', disponibilita: 'esaurito', illustrazione: 'palline', colore: '#8CC152',
                descrizione: 'Circa il 25% più lente di una pallina normale, per passare al campo regolare.', foto: [], modello3d: '' }
            ] },
          { slug: 'borse-e-sacche', titolo: 'Borse e sacche', icona: 'borsa', foto: null,
            descrizione: 'Borse da 3 a 12 racchette, anche con scomparto termico, e zaini con porta racchetta.',
            tipologie: ['Da 3 racchette', 'Da 6 a 12 racchette', 'Scomparto termico', 'Zaini'], insieme: ['palline', 'accessori'],
            prodotti: [
              { codice: 'TEN-BOR-01', nome: 'Borsa da 6 racchette con scomparto termico', linea: 'adulto', prezzo: 69.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'borsa-racchette', colore: '#0E0F12',
                descrizione: 'Due vani per le racchette, uno isolato che le ripara dal caldo, e tasca per le scarpe.', foto: [], modello3d: '' },
              { codice: 'TEN-BOR-02', nome: 'Borsa da 3 racchette', linea: 'entrambe', prezzo: 39.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'borsa-racchette', colore: '#1E46F0',
                descrizione: 'Compatta, con tracolla e una tasca esterna per palline e accessori.', foto: [], modello3d: '' },
              { codice: 'TEN-BOR-03', nome: 'Zaino con porta racchetta', linea: 'entrambe', prezzo: 44.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'zaino', colore: '#5C626C',
                descrizione: 'Zaino con vano esterno per una o due racchette e tasca imbottita per il computer.', foto: [], modello3d: '' },
              { codice: 'TEN-BOR-04', nome: 'Borsa da 12 racchette', linea: 'adulto', prezzo: 99.9, taglia: 'unica', disponibilita: 'su ordinazione', illustrazione: 'borsa-racchette', colore: '#D62839',
                descrizione: 'Tre scomparti e spallacci da zaino, per chi gioca tornei e porta tutta l\'attrezzatura.', foto: [], modello3d: '' }
            ] },
          { slug: 'accessori', titolo: 'Accessori (corde, overgrip, polsini)', icona: 'grip', foto: null,
            descrizione: 'Corde in matassa, overgrip, antivibrazione e polsini. Incordatura su richiesta.',
            tipologie: ['Corde monofilamento', 'Corde multifilamento', 'Overgrip', 'Antivibrazione', 'Polsini'], insieme: ['palline', 'borse-e-sacche'],
            prodotti: [
              { codice: 'TEN-ACC-01', nome: 'Overgrip (confezione da 3)', linea: 'entrambe', prezzo: 8.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'grip', colore: '#F4F2ED',
                descrizione: 'Nastro sottile da avvolgere sopra il grip originale: assorbe il sudore e migliora la presa. Va cambiato spesso.', foto: [], modello3d: '' },
              { codice: 'TEN-ACC-02', nome: 'Corda monofilamento (matassa da 12 m)', linea: 'adulto', prezzo: 14.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'matassa', colore: '#D9DD4E',
                descrizione: 'Corda rigida in poliestere: dà controllo e dura di più. Adatta a chi ha un braccio veloce.', foto: [], modello3d: '' },
              { codice: 'TEN-ACC-03', nome: 'Corda multifilamento (matassa da 12 m)', linea: 'adulto', prezzo: 19.9, taglia: 'nessuna', disponibilita: 'su ordinazione', illustrazione: 'matassa', colore: '#F4F2ED',
                descrizione: 'Più morbida ed elastica, trattiene meglio la tensione ed è più comoda per il braccio.', foto: [], modello3d: '' },
              { codice: 'TEN-ACC-04', nome: 'Polsini in spugna (coppia)', linea: 'entrambe', prezzo: 6.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'fascia', colore: '#F4F2ED',
                descrizione: 'Polsini in spugna che fermano il sudore prima che arrivi alla mano.', foto: [], modello3d: '' }
            ] }
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
            tipologie: ['Rotonda – controllo', 'Goccia – equilibrio', 'Diamante – potenza', 'Junior'], insieme: ['palline', 'accessori', 'borse-e-paletteros'],
            prodotti: [
              { codice: 'PAD-RAC-01', nome: 'Racchetta da padel rotonda (controllo)', linea: 'adulto', prezzo: 79.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'racchetta-padel', colore: '#1E46F0',
                descrizione: 'Punto d\'impatto ampio e vicino al manico: perdona di più ed è la scelta più semplice per iniziare.', foto: [], modello3d: '' },
              { codice: 'PAD-RAC-02', nome: 'Racchetta da padel a goccia (equilibrio)', linea: 'adulto', prezzo: 129.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'racchetta-padel', colore: '#0E0F12',
                descrizione: 'Via di mezzo tra controllo e potenza, con bilanciamento neutro. Per chi gioca con continuità.', foto: [], modello3d: '' },
              { codice: 'PAD-RAC-03', nome: 'Racchetta da padel a diamante (potenza)', linea: 'adulto', prezzo: 199.9, taglia: 'nessuna', disponibilita: 'su ordinazione', illustrazione: 'racchetta-padel', colore: '#D62839',
                descrizione: 'Bilanciamento verso la testa e punto dolce in alto: tanta spinta negli smash, ma serve tecnica.', foto: [], modello3d: '' },
              { codice: 'PAD-RAC-04', nome: 'Racchetta da padel junior', linea: 'bambino', prezzo: 49.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'racchetta-padel', colore: '#FF6B4A',
                descrizione: 'Più leggera e corta di una racchetta per adulti, con manico sottile per le mani piccole.', foto: [], modello3d: '' }
            ] },
          { slug: 'scarpe', titolo: 'Scarpe', icona: 'scarpa', foto: null,
            descrizione: 'Suole pensate per l\'erba sintetica con sabbia, per spostamenti laterali rapidi.',
            tipologie: ['Suola a spina di pesce', 'Suola mista', 'Rinforzo laterale'], insieme: ['abbigliamento', 'palline'],
            prodotti: [
              { codice: 'PAD-SCA-01', nome: 'Scarpa da padel con suola a spina di pesce', linea: 'adulto', prezzo: 69.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-campo', colore: '#F4F2ED',
                descrizione: 'La suola a spina di pesce fa presa sull\'erba sintetica con sabbia; tomaia rinforzata ai lati per gli spostamenti laterali.', foto: [], modello3d: '' },
              { codice: 'PAD-SCA-02', nome: 'Scarpa da padel con suola mista', linea: 'adulto', prezzo: 89.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-campo', colore: '#0E0F12',
                descrizione: 'Spina di pesce al centro e tasselli ai bordi: buona presa e più stabilità nelle frenate.', foto: [], modello3d: '' },
              { codice: 'PAD-SCA-03', nome: 'Scarpa da padel bambino', linea: 'bambino', prezzo: 39.9, taglia: 'scarpe-bambino', disponibilita: 'in negozio', illustrazione: 'scarpa-campo', colore: '#1E46F0',
                descrizione: 'Suola da campo e chiusura a strappo, per i primi corsi di padel.', foto: [], modello3d: '' },
              { codice: 'PAD-SCA-04', nome: 'Scarpa da padel alta gamma', linea: 'adulto', prezzo: 129.9, taglia: 'scarpe-adulto', disponibilita: 'su ordinazione', illustrazione: 'scarpa-campo', colore: '#D62839',
                descrizione: 'Intersuola più reattiva e tomaia leggera ma rinforzata, per chi gioca più volte alla settimana.', foto: [], modello3d: '' }
            ] },
          { slug: 'abbigliamento', titolo: 'Abbigliamento', icona: 'maglia', foto: { file: 'padel-abbigliamento', alt: 'Giocatrice di padel in un campo coperto' },
            descrizione: 'T-shirt e polo traspiranti, shorts, gonne e felpe leggere per le partite serali.',
            tipologie: ['T-shirt e polo', 'Shorts e gonne', 'Felpe leggere'], insieme: ['scarpe', 'accessori'],
            prodotti: [
              { codice: 'PAD-ABB-01', nome: 'T-shirt tecnica', linea: 'entrambe', prezzo: 24.9, taglia: 'abb-tutte', disponibilita: 'in negozio', illustrazione: 'maglia', colore: '#8C6CF7',
                descrizione: 'Maglietta in tessuto traspirante che asciuga in fretta, anche nelle partite estive.', foto: [], modello3d: '' },
              { codice: 'PAD-ABB-02', nome: 'Shorts da padel', linea: 'adulto', prezzo: 29.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'pantaloncino', colore: '#0E0F12',
                descrizione: 'Shorts leggeri con tasche per tenere la pallina durante il servizio.', foto: [], modello3d: '' },
              { codice: 'PAD-ABB-03', nome: 'Gonna da padel con pantaloncino', linea: 'adulto', prezzo: 32.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'gonna', colore: '#F4F2ED',
                descrizione: 'Gonna con pantaloncino interno e tasche laterali per le palline.', foto: [], modello3d: '' },
              { codice: 'PAD-ABB-04', nome: 'Felpa leggera con zip', linea: 'adulto', prezzo: 44.9, taglia: 'abb-adulto', disponibilita: 'esaurito', illustrazione: 'giacca-tuta', colore: '#1B2A4A',
                descrizione: 'Strato leggero per il riscaldamento e le partite serali all\'aperto.', foto: [], modello3d: '' }
            ] },
          { slug: 'palline', titolo: 'Palline', icona: 'pallina', foto: null,
            descrizione: 'Palline specifiche per il padel, con pressione leggermente più bassa di quelle da tennis.',
            tipologie: ['Tubi da 3', 'Confezioni multiple', 'Per allenamento'], insieme: ['accessori', 'borse-e-paletteros'],
            prodotti: [
              { codice: 'PAD-PAL-01', nome: 'Palline da padel (tubo da 3)', linea: 'entrambe', prezzo: 6.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'palline', colore: '#D9DD4E',
                descrizione: 'Pressione un po\' più bassa delle palline da tennis, come chiede il regolamento del padel.', foto: [], modello3d: '' },
              { codice: 'PAD-PAL-02', nome: 'Palline da padel di fascia alta (tubo da 3)', linea: 'adulto', prezzo: 8.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'palline', colore: '#D9DD4E',
                descrizione: 'Feltro più resistente, per mantenere il rimbalzo più a lungo nelle partite.', foto: [], modello3d: '' },
              { codice: 'PAD-PAL-03', nome: 'Palline da padel per allenamento (sacco da 60)', linea: 'adulto', prezzo: 79.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'palline', colore: '#D9DD4E',
                descrizione: 'Senza pressione interna: il rimbalzo resta costante nel tempo. Per lezioni e cesto.', foto: [], modello3d: '' },
              { codice: 'PAD-PAL-04', nome: 'Palline da padel (scatola da 24 tubi)', linea: 'adulto', prezzo: 149.9, taglia: 'nessuna', disponibilita: 'su ordinazione', illustrazione: 'palline', colore: '#D9DD4E',
                descrizione: 'Per circoli e gruppi che giocano spesso: si risparmia rispetto ai tubi singoli.', foto: [], modello3d: '' }
            ] },
          { slug: 'borse-e-paletteros', titolo: 'Borse e paletteros', icona: 'borsa', foto: null,
            descrizione: 'Paletteros con scomparto per due racchette, zaini e borse termiche per le giornate calde.',
            tipologie: ['Paletteros', 'Zaini porta racchetta', 'Borse termiche'], insieme: ['palline', 'accessori'],
            prodotti: [
              { codice: 'PAD-BOR-01', nome: 'Paletero con scomparto termico', linea: 'adulto', prezzo: 59.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'borsa-racchette', colore: '#0E0F12',
                descrizione: 'Due vani per le racchette, isolati dal caldo dell\'auto, e tasca separata per scarpe e vestiti.', foto: [], modello3d: '' },
              { codice: 'PAD-BOR-02', nome: 'Zaino porta racchetta', linea: 'entrambe', prezzo: 39.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'zaino', colore: '#8C6CF7',
                descrizione: 'Zaino con vano esterno per la racchetta e tasca per le palline.', foto: [], modello3d: '' },
              { codice: 'PAD-BOR-03', nome: 'Borsa termica da padel', linea: 'adulto', prezzo: 49.9, taglia: 'unica', disponibilita: 'su ordinazione', illustrazione: 'borsa', colore: '#F4F2ED',
                descrizione: 'Borsa media con interno isolato, per proteggere racchette e bevande nelle giornate calde.', foto: [], modello3d: '' },
              { codice: 'PAD-BOR-04', nome: 'Custodia singola per racchetta', linea: 'entrambe', prezzo: 14.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'borsa-racchette', colore: '#1E46F0',
                descrizione: 'Custodia imbottita per una racchetta, da mettere in qualsiasi borsa.', foto: [], modello3d: '' }
            ] },
          { slug: 'accessori', titolo: 'Accessori', icona: 'grip', foto: null,
            descrizione: 'Overgrip, protezioni per il telaio, polsini e lacci da polso.',
            tipologie: ['Overgrip', 'Protezioni telaio', 'Polsini', 'Lacci da polso'], insieme: ['palline', 'borse-e-paletteros'],
            prodotti: [
              { codice: 'PAD-ACC-01', nome: 'Overgrip (confezione da 3)', linea: 'entrambe', prezzo: 8.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'grip', colore: '#F4F2ED',
                descrizione: 'Nastro sottile da avvolgere sul manico: assorbe il sudore e migliora la presa.', foto: [], modello3d: '' },
              { codice: 'PAD-ACC-02', nome: 'Nastro protezione telaio', linea: 'entrambe', prezzo: 7.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'grip', colore: '#0E0F12',
                descrizione: 'Nastro adesivo trasparente o colorato che protegge il bordo della racchetta dagli urti contro vetri e pavimento.', foto: [], modello3d: '' },
              { codice: 'PAD-ACC-03', nome: 'Polsini in spugna (coppia)', linea: 'entrambe', prezzo: 6.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'fascia', colore: '#0E0F12',
                descrizione: 'Polsini che fermano il sudore prima che arrivi alla mano.', foto: [], modello3d: '' },
              { codice: 'PAD-ACC-04', nome: 'Laccio da polso di ricambio', linea: 'entrambe', prezzo: 3.9, taglia: 'nessuna', disponibilita: 'esaurito', illustrazione: 'corda', colore: '#D62839',
                descrizione: 'Il laccio della racchetta si consuma: tenerlo integro evita che la racchetta scivoli via dalla mano.', foto: [], modello3d: '' }
            ] }
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
            tipologie: ['Da sacco', 'Da sparring', 'Da 8 a 16 once', 'Guanti MMA'], insieme: ['bende-corde-e-accessori', 'caschetti-e-protezioni'],
            prodotti: [
              { codice: 'PUG-GUA-01', nome: 'Guantoni da sacco', linea: 'adulto', prezzo: 39.9, taglia: 'guantoni', misure: ['10 oz', '12 oz', '14 oz'], disponibilita: 'in negozio', illustrazione: 'guantone', colore: '#D62839',
                descrizione: 'Imbottitura compatta per i colpi al sacco e ai colpitori. Chiusura a strappo, comoda da mettere da soli.', foto: [], modello3d: '' },
              { codice: 'PUG-GUA-02', nome: 'Guantoni da sparring', linea: 'adulto', prezzo: 69.9, taglia: 'guantoni', misure: ['14 oz', '16 oz'], disponibilita: 'in negozio', illustrazione: 'guantone', colore: '#0E0F12',
                descrizione: 'Imbottitura più morbida e peso alto per allenarsi con un compagno. Molte palestre chiedono 14 o 16 once.', foto: [], modello3d: '' },
              { codice: 'PUG-GUA-03', nome: 'Guantoni bambino', linea: 'bambino', prezzo: 24.9, taglia: 'guantoni', misure: ['6 oz', '8 oz'], disponibilita: 'in negozio', illustrazione: 'guantone', colore: '#1E46F0',
                descrizione: 'Guantoni leggeri per bambini e ragazzi, con chiusura a strappo.', foto: [], modello3d: '' },
              { codice: 'PUG-GUA-04', nome: 'Guanti da MMA', linea: 'adulto', prezzo: 44.9, taglia: 'guanti', disponibilita: 'su ordinazione', illustrazione: 'guanti', colore: '#0E0F12',
                descrizione: 'Dita libere per le prese e imbottitura sulle nocche, per gli allenamenti di MMA.', foto: [], modello3d: '' },
              { codice: 'PUG-GUA-05', nome: 'Guantoni in pelle', linea: 'adulto', prezzo: 119.9, taglia: 'guantoni', disponibilita: 'esaurito', illustrazione: 'guantone', colore: '#F4F2ED',
                descrizione: 'Pelle che dura nel tempo e si adatta alla mano. Chiusura a strappo o con lacci su richiesta.', foto: [], modello3d: '' }
            ] },
          { slug: 'caschetti-e-protezioni', titolo: 'Caschetti e protezioni', icona: 'casco', foto: null,
            descrizione: 'Caschetti, paradenti, conchiglie e paratibie. Verifica sempre cosa chiede la tua federazione.',
            tipologie: ['Caschetti', 'Paradenti', 'Conchiglia', 'Paratibie', 'Paraseno'], insieme: ['guantoni', 'bende-corde-e-accessori'],
            prodotti: [
              { codice: 'PUG-CAS-01', nome: 'Caschetto con paraguance', linea: 'adulto', prezzo: 54.9, taglia: 'casco', disponibilita: 'in negozio', illustrazione: 'caschetto-boxe', colore: '#D62839',
                descrizione: 'Imbottitura su fronte, guance e nuca, regolabile con lacci o strappo. Controlla cosa chiede la tua federazione.', foto: [], modello3d: '' },
              { codice: 'PUG-CAS-02', nome: 'Caschetto bambino', linea: 'bambino', prezzo: 39.9, taglia: 'casco-bambino', disponibilita: 'su ordinazione', illustrazione: 'caschetto-boxe', colore: '#1E46F0',
                descrizione: 'Caschetto leggero nelle misure piccole, per i corsi dei ragazzi.', foto: [], modello3d: '' },
              { codice: 'PUG-CAS-03', nome: 'Paradenti termoformabile', linea: 'entrambe', prezzo: 9.9, taglia: 'paradenti', disponibilita: 'in negozio', illustrazione: 'paradenti', colore: '#1E46F0',
                descrizione: 'Si ammorbidisce in acqua calda e si modella sui denti seguendo le istruzioni. Per un paradenti su misura rivolgiti al dentista.', foto: [], modello3d: '' },
              { codice: 'PUG-CAS-04', nome: 'Paratibie con collo del piede', linea: 'adulto', prezzo: 34.9, taglia: 'protezioni', disponibilita: 'in negozio', illustrazione: 'parastinchi', colore: '#0E0F12',
                descrizione: 'Imbottitura su tibia e collo del piede, per kickboxing e muay thai.', foto: [], modello3d: '' }
            ] },
          { slug: 'sacchi-e-colpitori', titolo: 'Sacchi e colpitori', icona: 'sacco', foto: { file: 'pugilato-e-combattimento-sacchi-e-colpitori', alt: 'Sacchi da boxe appesi in una palestra' },
            descrizione: 'Sacchi pesanti, sacchi a pera, colpitori e paracolpi per palestre e allenamento a casa.',
            tipologie: ['Sacchi pesanti', 'Sacchi a pera', 'Colpitori', 'Paracolpi'], insieme: ['guantoni', 'bende-corde-e-accessori'],
            prodotti: [
              { codice: 'PUG-SAC-01', nome: 'Sacco pesante 120 cm', linea: 'adulto', prezzo: 129.9, taglia: 'unica', disponibilita: 'su ordinazione', illustrazione: 'sacco', colore: '#D62839',
                descrizione: 'Già riempito e con catene. Serve un gancio a soffitto o una staffa a muro adatti al peso.', foto: [], modello3d: '' },
              { codice: 'PUG-SAC-02', nome: 'Sacco 80 cm', linea: 'entrambe', prezzo: 79.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'sacco', colore: '#0E0F12',
                descrizione: 'Più corto e leggero, adatto anche ai ragazzi e agli spazi di casa.', foto: [], modello3d: '' },
              { codice: 'PUG-SAC-03', nome: 'Colpitori curvi (coppia)', linea: 'adulto', prezzo: 39.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'colpitore', colore: '#0E0F12',
                descrizione: 'Da indossare sulle mani dell\'allenatore per lavorare su precisione e combinazioni.', foto: [], modello3d: '' },
              { codice: 'PUG-SAC-04', nome: 'Paracolpi da braccio', linea: 'adulto', prezzo: 49.9, taglia: 'unica', disponibilita: 'su ordinazione', illustrazione: 'colpitore', colore: '#D62839',
                descrizione: 'Cuscino rettangolare da tenere sull\'avambraccio, per i calci e le ginocchiate nella kickboxing.', foto: [], modello3d: '' }
            ] },
          { slug: 'abbigliamento-e-scarpe', titolo: 'Abbigliamento e scarpe', icona: 'scarpa', foto: null,
            descrizione: 'Scarpe da boxe leggere con suola sottile, pantaloncini, canotte e tute.',
            tipologie: ['Scarpe da boxe', 'Pantaloncini', 'Canotte', 'Tute'], insieme: ['bende-corde-e-accessori', 'guantoni'],
            prodotti: [
              { codice: 'PUG-ABB-01', nome: 'Scarpe da boxe', linea: 'adulto', prezzo: 69.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-boxe', colore: '#0E0F12',
                descrizione: 'Suola sottile e tomaia alta sulla caviglia: senti bene il ring e ti muovi sulle punte. Da usare solo in palestra.', foto: [], modello3d: '' },
              { codice: 'PUG-ABB-02', nome: 'Pantaloncino da boxe', linea: 'entrambe', prezzo: 24.9, taglia: 'abb-tutte', disponibilita: 'in negozio', illustrazione: 'pantaloncino', colore: '#D62839',
                descrizione: 'Vita alta con fascia elastica larga e tessuto leggero che lascia libere le gambe.', foto: [], modello3d: '' },
              { codice: 'PUG-ABB-03', nome: 'Canotta da allenamento', linea: 'adulto', prezzo: 17.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'canotta', colore: '#0E0F12',
                descrizione: 'Canotta traspirante per gli allenamenti più intensi.', foto: [], modello3d: '' },
              { codice: 'PUG-ABB-04', nome: 'Scarpe da boxe ragazzo', linea: 'bambino', prezzo: 49.9, taglia: 'scarpe-bambino', misure: ['30', '31', '32', '33', '34', '35'], disponibilita: 'su ordinazione', illustrazione: 'scarpa-boxe', colore: '#1E46F0',
                descrizione: 'Stessa struttura delle scarpe per adulti, nelle misure per ragazzi.', foto: [], modello3d: '' }
            ] },
          { slug: 'bende-corde-e-accessori', titolo: 'Bende, corde e accessori', icona: 'corda', foto: { file: 'pugilato-e-combattimento-bende-corde-e-accessori', alt: 'Allenatore che aiuta un atleta a infilare i guantoni' },
            descrizione: 'Bende elastiche in più lunghezze, corde per saltare e borse per l\'attrezzatura.',
            tipologie: ['Bende elastiche', 'Corde da salto', 'Borse', 'Asciugamani'], insieme: ['guantoni', 'caschetti-e-protezioni'],
            prodotti: [
              { codice: 'PUG-BEN-01', nome: 'Bende elastiche (coppia)', linea: 'entrambe', prezzo: 7.9, taglia: 'bende', disponibilita: 'in negozio', illustrazione: 'bende', colore: '#D62839',
                descrizione: 'Bende semielastiche con passante per il pollice e chiusura a strappo. Le più corte per i bambini, 4,5 m per chi fa più giri.', foto: [], modello3d: '' },
              { codice: 'PUG-BEN-02', nome: 'Corda per saltare regolabile', linea: 'entrambe', prezzo: 12.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'corda', colore: '#0E0F12',
                descrizione: 'Cavo regolabile e manopole con cuscinetti. Per la lunghezza: salici sopra al centro, le manopole devono arrivare sotto le ascelle.', foto: [], modello3d: '' },
              { codice: 'PUG-BEN-03', nome: 'Borsa per l\'attrezzatura', linea: 'adulto', prezzo: 34.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'borsa', colore: '#0E0F12',
                descrizione: 'Borsone con tasca areata per guantoni e bende, così si asciugano anche in borsa.', foto: [], modello3d: '' },
              { codice: 'PUG-BEN-04', nome: 'Asciugamano in microfibra', linea: 'entrambe', prezzo: 12.9, taglia: 'unica', disponibilita: 'esaurito', illustrazione: 'telo', colore: '#5C626C',
                descrizione: 'Leggero, assorbe molto e si asciuga in fretta. Occupa poco spazio in borsa.', foto: [], modello3d: '' }
            ] }
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
            tipologie: ['Giacche imbottite', 'Gusci', 'Pantaloni', 'Tute intere bambino'], insieme: ['strati-termici', 'guanti-e-accessori'],
            prodotti: [
              { codice: 'SCI-GIA-01', nome: 'Giacca da sci imbottita', linea: 'adulto', prezzo: 129.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'giacca-sci', colore: '#D62839',
                descrizione: 'Imbottitura sintetica che scalda anche se umida, cappuccio staccabile e ghetta antineve in vita. Tessuto impermeabile e traspirante.', foto: [], modello3d: '' },
              { codice: 'SCI-GIA-02', nome: 'Pantalone da sci', linea: 'adulto', prezzo: 89.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'pantalone', colore: '#0E0F12',
                descrizione: 'Ghetta interna che si chiude sopra lo scarpone e rinforzi sul bordo interno contro i tagli delle lamine.', foto: [], modello3d: '' },
              { codice: 'SCI-GIA-03', nome: 'Giacca da sci bambino', linea: 'bambino', prezzo: 74.9, taglia: 'abb-bambino', disponibilita: 'in negozio', illustrazione: 'giacca-sci', colore: '#FFC21A',
                descrizione: 'Colori ben visibili sulla pista, polsini regolabili e tasca per lo skipass sulla manica.', foto: [], modello3d: '' },
              { codice: 'SCI-GIA-04', nome: 'Salopette da sci bambino', linea: 'bambino', prezzo: 59.9, taglia: 'abb-bambino', disponibilita: 'in negozio', illustrazione: 'pantalone', colore: '#1F9BDB',
                descrizione: 'Pantalone con bretelle regolabili: copre anche la schiena e resta su durante le cadute.', foto: [], modello3d: '' },
              { codice: 'SCI-GIA-05', nome: 'Guscio impermeabile', linea: 'adulto', prezzo: 179.9, taglia: 'abb-adulto', disponibilita: 'su ordinazione', illustrazione: 'giacca-tuta', colore: '#1E46F0',
                descrizione: 'Giacca senza imbottitura, molto impermeabile: si usa sopra gli strati termici e va bene anche per lo scialpinismo.', foto: [], modello3d: '' }
            ] },
          { slug: 'strati-termici', titolo: 'Strati termici', icona: 'strati', foto: null,
            descrizione: 'Primo strato a contatto con la pelle e secondo strato in pile: la base del vestirsi a strati.',
            tipologie: ['Primo strato', 'Pile', 'Lana merino', 'Sintetico'], insieme: ['giacche-e-pantaloni', 'guanti-e-accessori'],
            prodotti: [
              { codice: 'SCI-STR-01', nome: 'Maglia termica primo strato', linea: 'adulto', prezzo: 34.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'maglia-lunga', colore: '#0E0F12',
                descrizione: 'Aderente, allontana il sudore dalla pelle. Si indossa a contatto con il corpo, sotto il pile.', foto: [], modello3d: '' },
              { codice: 'SCI-STR-02', nome: 'Maglia in lana merino', linea: 'adulto', prezzo: 69.9, taglia: 'abb-adulto', disponibilita: 'su ordinazione', illustrazione: 'maglia-lunga', colore: '#5C626C',
                descrizione: 'La lana merino scalda anche quando è umida e trattiene meno gli odori. Va lavata con più cura.', foto: [], modello3d: '' },
              { codice: 'SCI-STR-03', nome: 'Pile secondo strato', linea: 'adulto', prezzo: 39.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'giacca-tuta', colore: '#FF6B4A',
                descrizione: 'Pile con zip intera, caldo e leggero, da mettere tra la maglia termica e la giacca.', foto: [], modello3d: '' },
              { codice: 'SCI-STR-04', nome: 'Completo termico bambino', linea: 'bambino', prezzo: 29.9, taglia: 'abb-bambino', disponibilita: 'in negozio', illustrazione: 'maglia-lunga', colore: '#1E46F0',
                descrizione: 'Maglia e calzamaglia aderenti, da indossare sotto la tuta da sci.', foto: [], modello3d: '' }
            ] },
          { slug: 'caschi-e-maschere', titolo: 'Caschi e maschere', icona: 'maschera', foto: { file: 'sci-e-snowboard-caschi-e-maschere', alt: 'Sciatore con casco e maschera a specchio' },
            descrizione: 'Caschi regolabili e maschere con lenti per sole o poca luce, anche da indossare sopra gli occhiali.',
            tipologie: ['Caschi', 'Maschere', 'Lenti per poca luce', 'Sopra gli occhiali (OTG)'], insieme: ['caschi-e-maschere', 'guanti-e-accessori'],
            prodotti: [
              { codice: 'SCI-CAS-01', nome: 'Casco da sci regolabile', linea: 'adulto', prezzo: 79.9, taglia: 'casco', disponibilita: 'in negozio', illustrazione: 'casco-sci', colore: '#F4F2ED',
                descrizione: 'Rotella posteriore per regolare la calzata, prese d\'aria apribili e clip per la maschera.', foto: [], modello3d: '' },
              { codice: 'SCI-CAS-02', nome: 'Casco da sci bambino', linea: 'bambino', prezzo: 44.9, taglia: 'casco-bambino', disponibilita: 'in negozio', illustrazione: 'casco-sci', colore: '#FFC21A',
                descrizione: 'In Italia il casco è obbligatorio sulle piste per chi ha meno di 18 anni. Regolazione con rotella e mentoniera imbottita.', foto: [], modello3d: '' },
              { codice: 'SCI-CAS-03', nome: 'Maschera da sci con lente a specchio', linea: 'adulto', prezzo: 69.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'maschera-sci', colore: '#1E46F0',
                descrizione: 'Lente scura per le giornate di sole, doppia lente contro l\'appannamento e schiuma morbida sul viso.', foto: [], modello3d: '' },
              { codice: 'SCI-CAS-04', nome: 'Maschera da sci per poca luce', linea: 'adulto', prezzo: 59.9, taglia: 'unica', disponibilita: 'su ordinazione', illustrazione: 'maschera-sci', colore: '#FFC21A',
                descrizione: 'Lente chiara che aumenta i contrasti con nebbia, nuvole e neve fresca.', foto: [], modello3d: '' },
              { codice: 'SCI-CAS-05', nome: 'Maschera da sci bambino', linea: 'bambino', prezzo: 29.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'maschera-sci', colore: '#F45BA4',
                descrizione: 'Montatura piccola e morbida, compatibile con i caschi per bambini.', foto: [], modello3d: '' }
            ] },
          { slug: 'guanti-e-accessori', titolo: 'Guanti e accessori', icona: 'guanto', foto: null,
            descrizione: 'Guanti e moffole, scaldacollo, sottocasco e calze da sci alte.',
            tipologie: ['Guanti', 'Moffole', 'Scaldacollo', 'Calze da sci'], insieme: ['giacche-e-pantaloni', 'strati-termici'],
            prodotti: [
              { codice: 'SCI-GUA-01', nome: 'Guanti da sci', linea: 'adulto', prezzo: 34.9, taglia: 'guanti', disponibilita: 'in negozio', illustrazione: 'guanti', colore: '#0E0F12',
                descrizione: 'Imbottiti e impermeabili, con polsino lungo che si chiude sopra la manica della giacca.', foto: [], modello3d: '' },
              { codice: 'SCI-GUA-02', nome: 'Moffole bambino', linea: 'bambino', prezzo: 19.9, taglia: 'guanti-bambino', disponibilita: 'in negozio', illustrazione: 'guanti', colore: '#D62839',
                descrizione: 'Le moffole tengono le dita insieme e scaldano di più: le preferite per i più piccoli.', foto: [], modello3d: '' },
              { codice: 'SCI-GUA-03', nome: 'Scaldacollo in pile', linea: 'entrambe', prezzo: 12.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'fascia', colore: '#1B2A4A',
                descrizione: 'Tubolare in pile che protegge collo e mento dal vento, si porta anche sotto il casco.', foto: [], modello3d: '' },
              { codice: 'SCI-GUA-04', nome: 'Calze da sci (coppia)', linea: 'adulto', prezzo: 16.9, taglia: 'calze', disponibilita: 'in negozio', illustrazione: 'calzettone', colore: '#1E46F0',
                descrizione: 'Calza alta e sottile, con imbottiture su tibia e malleoli. Ne basta una: due calze stringono il piede.', foto: [], modello3d: '' },
              { codice: 'SCI-GUA-05', nome: 'Calze da sci bambino', linea: 'bambino', prezzo: 11.9, taglia: 'calze-bambino', disponibilita: 'in negozio', illustrazione: 'calzettone', colore: '#F45BA4',
                descrizione: 'Calze alte nelle misure per bambini, con imbottitura sulla tibia.', foto: [], modello3d: '' }
            ] },
          { slug: 'scarponi-e-attrezzi', titolo: 'Scarponi e attrezzi (su richiesta)', icona: 'scarpone', foto: { file: 'sci-e-snowboard-scarponi-e-attrezzi', alt: 'Sci e bastoncini piantati nella neve' },
            descrizione: 'Scarponi, sci, tavole e attacchi li ordiniamo su richiesta. Passa in negozio per la misura del piede.',
            tipologie: ['Scarponi', 'Sci', 'Tavole snowboard', 'Attacchi', 'Bastoncini'], insieme: ['guanti-e-accessori', 'strati-termici'],
            prodotti: [
              { codice: 'SCI-SCA-01', nome: 'Scarponi da sci su ordinazione', linea: 'adulto', prezzo: 249.9, taglia: 'mondopoint', disponibilita: 'su ordinazione', illustrazione: 'scarpone-sci', colore: '#0E0F12',
                descrizione: 'Gli scarponi si misurano in mondopoint, cioè la lunghezza del piede in centimetri. Passa in negozio: misuriamo il piede e scegliamo insieme la rigidità.', foto: [], modello3d: '' },
              { codice: 'SCI-SCA-02', nome: 'Sci da pista con attacchi su ordinazione', linea: 'adulto', prezzo: 399.9, taglia: 'sci', disponibilita: 'su ordinazione', illustrazione: 'sci', colore: '#D62839',
                descrizione: 'Gli sci si scelgono in base ad altezza, peso e livello. Te li ordiniamo con gli attacchi regolati da un tecnico.', foto: [], modello3d: '' }
            ] }
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
            tipologie: ['Da allenamento', 'Resistenti al cloro', 'Da gara', 'Bambini'], insieme: ['occhialini-e-cuffie', 'accappatoi-e-teli'],
            prodotti: [
              { codice: 'NUO-COS-01', nome: 'Costume intero da allenamento', linea: 'adulto', prezzo: 34.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'costume', colore: '#1E46F0',
                descrizione: 'Tessuto resistente al cloro che mantiene forma e colore più a lungo. Spalline incrociate che non intralciano la bracciata.', foto: [], modello3d: '' },
              { codice: 'NUO-COS-02', nome: 'Costume a boxer da allenamento', linea: 'adulto', prezzo: 24.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'pantaloncino', colore: '#0E0F12',
                descrizione: 'Boxer aderente in tessuto resistente al cloro, con cordino interno in vita.', foto: [], modello3d: '' },
              { codice: 'NUO-COS-03', nome: 'Costume intero bambina', linea: 'bambino', prezzo: 19.9, taglia: 'abb-bambino', disponibilita: 'in negozio', illustrazione: 'costume', colore: '#F45BA4',
                descrizione: 'Costume in tessuto resistente al cloro, nelle taglie per età, per i corsi di nuoto.', foto: [], modello3d: '' },
              { codice: 'NUO-COS-04', nome: 'Boxer da nuoto bambino', linea: 'bambino', prezzo: 16.9, taglia: 'abb-bambino', disponibilita: 'in negozio', illustrazione: 'pantaloncino', colore: '#FFC21A',
                descrizione: 'Boxer aderente con cordino in vita, per i corsi in piscina.', foto: [], modello3d: '' },
              { codice: 'NUO-COS-05', nome: 'Costume da gara', linea: 'adulto', prezzo: 89.9, taglia: 'abb-adulto', disponibilita: 'su ordinazione', illustrazione: 'costume', colore: '#0E0F12',
                descrizione: 'Tessuto molto aderente e idrorepellente, pensato per le gare. Va provato con calma e usato solo in gara.', foto: [], modello3d: '' }
            ] },
          { slug: 'occhialini-e-cuffie', titolo: 'Occhialini e cuffie', icona: 'occhialini', foto: { file: 'nuoto-occhialini-e-cuffie', alt: 'Nuotatore con cuffia e occhialini a bordo vasca' },
            descrizione: 'Occhialini con lenti chiare, fumé o a specchio, cuffie in silicone e in tessuto.',
            tipologie: ['Lenti chiare', 'Lenti fumé', 'Lenti a specchio', 'Cuffie in silicone', 'Cuffie in tessuto'], insieme: ['costumi', 'accessori-e-attrezzi'],
            prodotti: [
              { codice: 'NUO-OCC-01', nome: 'Occhialini con lenti chiare', linea: 'entrambe', prezzo: 14.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'occhialini', colore: '#1F9BDB',
                descrizione: 'Per la piscina coperta. Ponte nasale intercambiabile e trattamento contro l\'appannamento.', foto: [], modello3d: '' },
              { codice: 'NUO-OCC-02', nome: 'Occhialini con lenti a specchio', linea: 'adulto', prezzo: 24.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'occhialini', colore: '#1E46F0',
                descrizione: 'Riducono il riverbero nelle piscine all\'aperto e nelle vasche molto illuminate.', foto: [], modello3d: '' },
              { codice: 'NUO-OCC-03', nome: 'Occhialini bambino', linea: 'bambino', prezzo: 9.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'occhialini', colore: '#F45BA4',
                descrizione: 'Montatura piccola e morbida, elastico facile da regolare.', foto: [], modello3d: '' },
              { codice: 'NUO-OCC-04', nome: 'Cuffia in silicone', linea: 'entrambe', prezzo: 9.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'cuffia', colore: '#0E0F12',
                descrizione: 'Resistente e impermeabile, protegge i capelli dal cloro meglio della cuffia in tessuto.', foto: [], modello3d: '' },
              { codice: 'NUO-OCC-05', nome: 'Cuffia in tessuto bambino', linea: 'bambino', prezzo: 6.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'cuffia', colore: '#1F9BDB',
                descrizione: 'Morbida e facile da mettere, non tira i capelli.', foto: [], modello3d: '' }
            ] },
          { slug: 'accappatoi-e-teli', titolo: 'Accappatoi e teli', icona: 'telo', foto: null,
            descrizione: 'Accappatoi in microfibra leggeri e veloci da asciugare, in spugna, teli e ponchi per bambini.',
            tipologie: ['Microfibra', 'Spugna', 'Teli', 'Ponchi bambino'], insieme: ['zaini-e-borse', 'costumi'],
            prodotti: [
              { codice: 'NUO-ACP-01', nome: 'Accappatoio in microfibra', linea: 'adulto', prezzo: 34.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'accappatoio', colore: '#1E46F0',
                descrizione: 'Leggero e veloce ad asciugare, occupa poco spazio nello zaino.', foto: [], modello3d: '' },
              { codice: 'NUO-ACP-02', nome: 'Accappatoio in spugna', linea: 'adulto', prezzo: 39.9, taglia: 'abb-adulto', disponibilita: 'su ordinazione', illustrazione: 'accappatoio', colore: '#F4F2ED',
                descrizione: 'Più morbido e caldo della microfibra, ma più ingombrante.', foto: [], modello3d: '' },
              { codice: 'NUO-ACP-03', nome: 'Poncho con cappuccio bambino', linea: 'bambino', prezzo: 24.9, taglia: 'abb-bambino', disponibilita: 'in negozio', illustrazione: 'accappatoio', colore: '#FFC21A',
                descrizione: 'Si infila dalla testa, così i bambini si asciugano e si cambiano da soli.', foto: [], modello3d: '' },
              { codice: 'NUO-ACP-04', nome: 'Telo in microfibra 80 × 160 cm', linea: 'entrambe', prezzo: 19.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'telo', colore: '#1F9BDB',
                descrizione: 'Telo grande e sottile, per la piscina e per il mare.', foto: [], modello3d: '' }
            ] },
          { slug: 'accessori-e-attrezzi', titolo: 'Accessori e attrezzi', icona: 'tavoletta', foto: null,
            descrizione: 'Tavolette, pull buoy, pinne corte, palette e tappanaso per allenamenti più vari.',
            tipologie: ['Tavolette', 'Pull buoy', 'Pinne corte', 'Palette', 'Tappanaso'], insieme: ['occhialini-e-cuffie', 'zaini-e-borse'],
            prodotti: [
              { codice: 'NUO-ATT-01', nome: 'Tavoletta', linea: 'entrambe', prezzo: 9.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'tavoletta', colore: '#1E46F0',
                descrizione: 'Per allenare le gambe tenendo le braccia ferme. Utile anche nei corsi per bambini.', foto: [], modello3d: '' },
              { codice: 'NUO-ATT-02', nome: 'Pull buoy', linea: 'entrambe', prezzo: 9.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'pullbuoy', colore: '#FFC21A',
                descrizione: 'Si stringe tra le cosce per far galleggiare le gambe e allenare solo le braccia.', foto: [], modello3d: '' },
              { codice: 'NUO-ATT-03', nome: 'Pinne corte da allenamento', linea: 'entrambe', prezzo: 29.9, taglia: 'pinne', disponibilita: 'in negozio', illustrazione: 'pinne', colore: '#FFC21A',
                descrizione: 'Pala corta per allenare la gambata senza affaticare troppo le caviglie.', foto: [], modello3d: '' },
              { codice: 'NUO-ATT-04', nome: 'Palette per le mani', linea: 'adulto', prezzo: 14.9, taglia: 'palette', disponibilita: 'su ordinazione', illustrazione: 'palette', colore: '#1F9BDB',
                descrizione: 'Aumentano la resistenza in acqua per allenare la bracciata. Si inizia dalla misura più piccola.', foto: [], modello3d: '' }
            ] },
          { slug: 'zaini-e-borse', titolo: 'Zaini e borse', icona: 'borsa', foto: null,
            descrizione: 'Zaini con tasca separata per il bagnato, sacche a rete per gli attrezzi.',
            tipologie: ['Zaini con tasca bagnato', 'Sacche a rete', 'Borse impermeabili'], insieme: ['accappatoi-e-teli', 'occhialini-e-cuffie'],
            prodotti: [
              { codice: 'NUO-ZAI-01', nome: 'Zaino da piscina con tasca per il bagnato', linea: 'entrambe', prezzo: 29.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'zaino', colore: '#1E46F0',
                descrizione: 'Tasca impermeabile separata per costume e accappatoio bagnati.', foto: [], modello3d: '' },
              { codice: 'NUO-ZAI-02', nome: 'Sacca in rete per attrezzi', linea: 'entrambe', prezzo: 12.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'sacca', colore: '#0E0F12',
                descrizione: 'Rete che fa asciugare pinne, tavoletta e palette, con chiusura a coulisse.', foto: [], modello3d: '' },
              { codice: 'NUO-ZAI-03', nome: 'Borsa impermeabile', linea: 'adulto', prezzo: 24.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'borsa', colore: '#1F9BDB',
                descrizione: 'Tessuto spalmato che non lascia passare l\'acqua, si pulisce con un panno.', foto: [], modello3d: '' },
              { codice: 'NUO-ZAI-04', nome: 'Zainetto bambino', linea: 'bambino', prezzo: 19.9, taglia: 'unica', disponibilita: 'esaurito', illustrazione: 'zaino', colore: '#F45BA4',
                descrizione: 'Piccolo e leggero, con tasca per il bagnato e il posto per il nome.', foto: [], modello3d: '' }
            ] }
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
            tipologie: ['Strada', 'Trail', 'Ammortizzate', 'Leggere', 'Neutre o con stabilità'], insieme: ['calze-e-protezioni', 'abbigliamento-tecnico'],
            prodotti: [
              { codice: 'RUN-SCA-01', nome: 'Scarpa da running ammortizzata', linea: 'adulto', prezzo: 129.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-running', colore: '#1E46F0',
                descrizione: 'Intersuola alta e morbida per le uscite lunghe e per chi inizia. Tomaia in rete traspirante.', foto: [], modello3d: '' },
              { codice: 'RUN-SCA-02', nome: 'Scarpa da running leggera', linea: 'adulto', prezzo: 109.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-running', colore: '#FF6B4A',
                descrizione: 'Meno ammortizzazione e più reattività, per ritmi veloci e gare brevi.', foto: [], modello3d: '' },
              { codice: 'RUN-SCA-03', nome: 'Scarpa da trail', linea: 'adulto', prezzo: 119.9, taglia: 'scarpe-adulto', disponibilita: 'su ordinazione', illustrazione: 'scarpa-running', colore: '#0E0F12',
                descrizione: 'Suola con tasselli profondi per sterrato e fango, puntale rinforzato contro sassi e radici.', foto: [], modello3d: '' },
              { codice: 'RUN-SCA-04', nome: 'Scarpa da running bambino', linea: 'bambino', prezzo: 44.9, taglia: 'scarpe-bambino', disponibilita: 'in negozio', illustrazione: 'scarpa-running', colore: '#F45BA4',
                descrizione: 'Leggera e flessibile, per l\'atletica a scuola e il tempo libero. Lacci elastici facili da chiudere.', foto: [], modello3d: '' },
              { codice: 'RUN-SCA-05', nome: 'Scarpa da running con stabilità', linea: 'adulto', prezzo: 139.9, taglia: 'scarpe-adulto', disponibilita: 'esaurito', illustrazione: 'scarpa-running', colore: '#5C626C',
                descrizione: 'Supporto più rigido sul lato interno, per chi tende a far cedere il piede verso l\'interno. Meglio provarla in negozio.', foto: [], modello3d: '' }
            ] },
          { slug: 'abbigliamento-tecnico', titolo: 'Abbigliamento tecnico', icona: 'canotta', foto: { file: 'running-abbigliamento-tecnico', alt: 'Runner in giacca tecnica sulla pista' },
            descrizione: 'Maglie traspiranti, shorts e tight, giacche antivento e capi con inserti riflettenti.',
            tipologie: ['Maglie traspiranti', 'Shorts e tight', 'Antivento', 'Riflettenti'], insieme: ['calze-e-protezioni', 'accessori'],
            prodotti: [
              { codice: 'RUN-ABB-01', nome: 'Maglia da running traspirante', linea: 'entrambe', prezzo: 24.9, taglia: 'abb-tutte', disponibilita: 'in negozio', illustrazione: 'maglia', colore: '#FF6B4A',
                descrizione: 'Tessuto leggero che allontana il sudore, cuciture piatte che non sfregano.', foto: [], modello3d: '' },
              { codice: 'RUN-ABB-02', nome: 'Shorts con slip interno', linea: 'adulto', prezzo: 29.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'pantaloncino', colore: '#0E0F12',
                descrizione: 'Shorts leggeri con slip interno e taschino per le chiavi.', foto: [], modello3d: '' },
              { codice: 'RUN-ABB-03', nome: 'Tight lunghi', linea: 'adulto', prezzo: 39.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'pantalone', colore: '#0E0F12',
                descrizione: 'Aderenti e caldi per le uscite d\'inverno, con inserti riflettenti sulle caviglie.', foto: [], modello3d: '' },
              { codice: 'RUN-ABB-04', nome: 'Giacca antivento riflettente', linea: 'adulto', prezzo: 64.9, taglia: 'abb-adulto', disponibilita: 'su ordinazione', illustrazione: 'giacca-tuta', colore: '#FFC21A',
                descrizione: 'Leggerissima, si piega in tasca. Inserti riflettenti per farsi vedere all\'alba e la sera.', foto: [], modello3d: '' }
            ] },
          { slug: 'calze-e-protezioni', titolo: 'Calze e protezioni', icona: 'calza', foto: null,
            descrizione: 'Calze tecniche senza cuciture fastidiose, calze a compressione, cappellini e fasce.',
            tipologie: ['Calze tecniche', 'Calze a compressione', 'Cappellini', 'Fasce'], insieme: ['scarpe-da-corsa', 'accessori'],
            prodotti: [
              { codice: 'RUN-CAL-01', nome: 'Calze da running (coppia)', linea: 'adulto', prezzo: 12.9, taglia: 'calze', disponibilita: 'in negozio', illustrazione: 'calza', colore: '#F4F2ED',
                descrizione: 'Calze tecniche senza cuciture sulla punta, con zone più spesse dove il piede appoggia.', foto: [], modello3d: '' },
              { codice: 'RUN-CAL-02', nome: 'Calze a compressione', linea: 'adulto', prezzo: 34.9, taglia: 'calze-compressione', disponibilita: 'su ordinazione', illustrazione: 'calzettone', colore: '#0E0F12',
                descrizione: 'Calze alte che stringono in modo graduale il polpaccio. Molti runner le usano nelle uscite lunghe.', foto: [], modello3d: '' },
              { codice: 'RUN-CAL-03', nome: 'Calze da running bambino', linea: 'bambino', prezzo: 7.9, taglia: 'calze-bambino', disponibilita: 'in negozio', illustrazione: 'calza', colore: '#F45BA4',
                descrizione: 'Calze leggere e morbide nelle misure per bambini.', foto: [], modello3d: '' },
              { codice: 'RUN-CAL-04', nome: 'Cappellino da running', linea: 'entrambe', prezzo: 19.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'cappellino', colore: '#F4F2ED',
                descrizione: 'Leggero e traspirante, con visiera morbida e chiusura regolabile.', foto: [], modello3d: '' }
            ] },
          { slug: 'accessori', titolo: 'Accessori', icona: 'orologio', foto: null,
            descrizione: 'Cinture porta telefono, borracce morbide, luci frontali e gilet per correre con il buio.',
            tipologie: ['Cinture e marsupi', 'Borracce', 'Luci frontali', 'Gilet idrici'], insieme: ['calze-e-protezioni', 'abbigliamento-tecnico'],
            prodotti: [
              { codice: 'RUN-ACC-01', nome: 'Cintura porta telefono', linea: 'entrambe', prezzo: 19.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'marsupio', colore: '#0E0F12',
                descrizione: 'Fascia elastica in vita che tiene fermi telefono e chiavi mentre corri.', foto: [], modello3d: '' },
              { codice: 'RUN-ACC-02', nome: 'Borraccia morbida 500 ml', linea: 'adulto', prezzo: 14.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'borraccia', colore: '#1E46F0',
                descrizione: 'Si schiaccia mentre bevi e, vuota, si arrotola in tasca.', foto: [], modello3d: '' },
              { codice: 'RUN-ACC-03', nome: 'Luce frontale', linea: 'entrambe', prezzo: 29.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'frontale', colore: '#0E0F12',
                descrizione: 'Luce da testa con fascia elastica, per correre con il buio e farsi vedere.', foto: [], modello3d: '' },
              { codice: 'RUN-ACC-04', nome: 'Gilet idrico', linea: 'adulto', prezzo: 69.9, taglia: 'abb-adulto', misure: ['S', 'M', 'L'], disponibilita: 'su ordinazione', illustrazione: 'zaino', colore: '#FF6B4A',
                descrizione: 'Gilet aderente con tasche per borracce morbide, per le uscite lunghe e il trail.', foto: [], modello3d: '' }
            ] }
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
            tipologie: ['Leggings', 'Top sportivi', 'T-shirt', 'Shorts'], insieme: ['scarpe-da-training', 'borse-e-accessori'],
            prodotti: [
              { codice: 'FIT-ABB-01', nome: 'Leggings a vita alta', linea: 'adulto', prezzo: 34.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'pantalone', colore: '#0E0F12',
                descrizione: 'Tessuto elastico e coprente, vita alta che resta ferma negli esercizi a terra.', foto: [], modello3d: '' },
              { codice: 'FIT-ABB-02', nome: 'Top sportivo', linea: 'adulto', prezzo: 24.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'canotta', colore: '#F45BA4',
                descrizione: 'Sostegno medio per i corsi e i pesi. Spalline larghe e fascia morbida sotto il seno.', foto: [], modello3d: '' },
              { codice: 'FIT-ABB-03', nome: 'T-shirt tecnica', linea: 'entrambe', prezzo: 17.9, taglia: 'abb-tutte', disponibilita: 'in negozio', illustrazione: 'maglia', colore: '#5C626C',
                descrizione: 'Maglietta leggera che asciuga in fretta, per la palestra e i corsi.', foto: [], modello3d: '' },
              { codice: 'FIT-ABB-04', nome: 'Shorts da allenamento', linea: 'adulto', prezzo: 22.9, taglia: 'abb-adulto', disponibilita: 'esaurito', illustrazione: 'pantaloncino', colore: '#1B2A4A',
                descrizione: 'Shorts leggeri ed elastici, con tasca laterale.', foto: [], modello3d: '' }
            ] },
          { slug: 'scarpe-da-training', titolo: 'Scarpe da training', icona: 'scarpa', foto: { file: 'fitness-e-palestra-scarpe-da-training', alt: 'Mani che allacciano una scarpa da training' },
            descrizione: 'Suola piatta e stabile per i pesi, più ammortizzata per i corsi a corpo libero.',
            tipologie: ['Suola piatta', 'Cross training', 'Corsi a corpo libero'], insieme: ['abbigliamento', 'borse-e-accessori'],
            prodotti: [
              { codice: 'FIT-SCA-01', nome: 'Scarpa da cross training', linea: 'adulto', prezzo: 89.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-campo', colore: '#0E0F12',
                descrizione: 'Suola piatta e stabile per i pesi, con un po\' di ammortizzazione per salti e corse brevi.', foto: [], modello3d: '' },
              { codice: 'FIT-SCA-02', nome: 'Scarpa per pesistica', linea: 'adulto', prezzo: 139.9, taglia: 'scarpe-adulto', disponibilita: 'su ordinazione', illustrazione: 'scarpa-campo', colore: '#D62839',
                descrizione: 'Tacco rialzato e rigido che aiuta a tenere la posizione nello squat. Solo per i pesi.', foto: [], modello3d: '' },
              { codice: 'FIT-SCA-03', nome: 'Scarpa per corsi a corpo libero', linea: 'adulto', prezzo: 64.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-running', colore: '#F4F2ED',
                descrizione: 'Leggera e ammortizzata, per corsi aerobici e tapis roulant.', foto: [], modello3d: '' },
              { codice: 'FIT-SCA-04', nome: 'Scarpa da palestra bambino', linea: 'bambino', prezzo: 34.9, taglia: 'scarpe-bambino', disponibilita: 'in negozio', illustrazione: 'scarpa-campo', colore: '#1E46F0',
                descrizione: 'Suola chiara che non segna e chiusura a strappo, per l\'educazione fisica a scuola.', foto: [], modello3d: '' }
            ] },
          { slug: 'pesi-e-attrezzi', titolo: 'Pesi e attrezzi', icona: 'manubrio', foto: { file: 'fitness-e-palestra-pesi-e-attrezzi', alt: 'Manubri esagonali sul pavimento' },
            descrizione: 'Manubri, kettlebell, elastici e corde per allenarti anche a casa.',
            tipologie: ['Manubri', 'Kettlebell', 'Elastici', 'Corde', 'Tappetini'], insieme: ['yoga-e-pilates', 'borse-e-accessori'],
            prodotti: [
              { codice: 'FIT-PES-01', nome: 'Manubri esagonali (coppia)', linea: 'adulto', prezzo: 29.9, taglia: 'manubri', disponibilita: 'in negozio', illustrazione: 'manubrio', colore: '#0E0F12',
                descrizione: 'Testa esagonale in gomma: non rotolano via. Il prezzo è per la coppia da 2 kg, le misure più pesanti costano di più.', foto: [], modello3d: '' },
              { codice: 'FIT-PES-02', nome: 'Kettlebell', linea: 'adulto', prezzo: 34.9, taglia: 'kettlebell', disponibilita: 'in negozio', illustrazione: 'kettlebell', colore: '#0E0F12',
                descrizione: 'Ghisa rivestita, maniglia larga per due mani. Il prezzo è per 8 kg.', foto: [], modello3d: '' },
              { codice: 'FIT-PES-03', nome: 'Elastici di resistenza (set da 3)', linea: 'entrambe', prezzo: 19.9, taglia: 'nessuna', disponibilita: 'in negozio', illustrazione: 'elastico', colore: '#8C6CF7',
                descrizione: 'Tre elastici ad anello con resistenza leggera, media e forte, per allenarsi anche a casa.', foto: [], modello3d: '' },
              { codice: 'FIT-PES-04', nome: 'Corda per saltare veloce', linea: 'entrambe', prezzo: 14.9, taglia: 'unica', disponibilita: 'esaurito', illustrazione: 'corda', colore: '#0E0F12',
                descrizione: 'Cavo sottile regolabile e manopole leggere, per il salto della corda veloce.', foto: [], modello3d: '' }
            ] },
          { slug: 'yoga-e-pilates', titolo: 'Yoga e pilates', icona: 'tappetino', foto: { file: 'fitness-e-palestra-yoga-e-pilates', alt: 'Tappetini da yoga arrotolati e manubri' },
            descrizione: 'Tappetini in più spessori, blocchi, cinghie e palle per pilates.',
            tipologie: ['Tappetini', 'Blocchi', 'Cinghie', 'Palle pilates', 'Calze antiscivolo'], insieme: ['pesi-e-attrezzi', 'abbigliamento'],
            prodotti: [
              { codice: 'FIT-YOG-01', nome: 'Tappetino yoga 4 mm', linea: 'entrambe', prezzo: 24.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'tappetino', colore: '#8C6CF7',
                descrizione: 'Sottile, per sentire bene il pavimento nelle posizioni in piedi. Superficie antiscivolo.', foto: [], modello3d: '' },
              { codice: 'FIT-YOG-02', nome: 'Tappetino pilates 10 mm', linea: 'adulto', prezzo: 29.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'tappetino', colore: '#1F9BDB',
                descrizione: 'Più spesso e morbido, per gli esercizi a terra su schiena e ginocchia.', foto: [], modello3d: '' },
              { codice: 'FIT-YOG-03', nome: 'Blocchi in sughero (coppia)', linea: 'adulto', prezzo: 24.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'blocco', colore: '#B98A5E',
                descrizione: 'Aiutano a raggiungere le posizioni senza forzare. Il sughero è stabile e non scivola.', foto: [], modello3d: '' },
              { codice: 'FIT-YOG-04', nome: 'Palla da pilates', linea: 'adulto', prezzo: 19.9, taglia: 'palla-pilates', disponibilita: 'su ordinazione', illustrazione: 'palla', colore: '#1F9BDB',
                descrizione: 'Si sceglie in base all\'altezza: seduti sopra, le ginocchia devono essere più o meno all\'altezza dei fianchi.', foto: [], modello3d: '' }
            ] },
          { slug: 'borse-e-accessori', titolo: 'Borse e accessori', icona: 'borsa', foto: { file: 'fitness-e-palestra-borse-e-accessori', alt: 'Sportiva che prepara la borsa da palestra' },
            descrizione: 'Borsoni, guanti da palestra, borracce e asciugamani in microfibra.',
            tipologie: ['Borsoni', 'Guanti', 'Borracce', 'Asciugamani'], insieme: ['abbigliamento', 'pesi-e-attrezzi'],
            prodotti: [
              { codice: 'FIT-BOR-01', nome: 'Borsone da palestra', linea: 'entrambe', prezzo: 34.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'borsa', colore: '#0E0F12',
                descrizione: 'Scomparto principale ampio e tasca separata per scarpe e asciugamano.', foto: [], modello3d: '' },
              { codice: 'FIT-BOR-02', nome: 'Guanti da palestra', linea: 'adulto', prezzo: 16.9, taglia: 'guanti', disponibilita: 'in negozio', illustrazione: 'guanti', colore: '#0E0F12',
                descrizione: 'Guanti senza dita con palmo imbottito, per una presa più comoda sui pesi.', foto: [], modello3d: '' },
              { codice: 'FIT-BOR-03', nome: 'Borraccia termica 750 ml', linea: 'entrambe', prezzo: 22.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'borraccia', colore: '#5C626C',
                descrizione: 'Doppia parete in acciaio: l\'acqua resta fresca per tutto l\'allenamento.', foto: [], modello3d: '' },
              { codice: 'FIT-BOR-04', nome: 'Asciugamano in microfibra', linea: 'entrambe', prezzo: 12.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'telo', colore: '#1E46F0',
                descrizione: 'Leggero, assorbe molto e si asciuga in fretta. Da tenere sulla panca.', foto: [], modello3d: '' }
            ] }
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
            tipologie: ['Maglie', 'Pantaloncini con fondello', 'Antivento', 'Invernale'], insieme: ['accessori', 'caschi'],
            prodotti: [
              { codice: 'CIC-ABB-01', nome: 'Maglia da ciclismo a maniche corte', linea: 'adulto', prezzo: 49.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'maglia', colore: '#F45BA4',
                descrizione: 'Taglio aderente, zip lunga e tre tasche sulla schiena per borraccia, barrette e telefono.', foto: [], modello3d: '' },
              { codice: 'CIC-ABB-02', nome: 'Pantaloncino con fondello', linea: 'adulto', prezzo: 59.9, taglia: 'abb-adulto', disponibilita: 'in negozio', illustrazione: 'pantaloncino', colore: '#0E0F12',
                descrizione: 'Fondello imbottito per le ore in sella. Si indossa senza biancheria, così niente cuciture che sfregano.', foto: [], modello3d: '' },
              { codice: 'CIC-ABB-03', nome: 'Giacca antivento', linea: 'adulto', prezzo: 69.9, taglia: 'abb-adulto', disponibilita: 'su ordinazione', illustrazione: 'giacca-tuta', colore: '#FFC21A',
                descrizione: 'Leggera e ripiegabile, per le discese e le mattine fresche. Colore ben visibile.', foto: [], modello3d: '' },
              { codice: 'CIC-ABB-04', nome: 'Maglia da ciclismo bambino', linea: 'bambino', prezzo: 29.9, taglia: 'abb-bambino', disponibilita: 'in negozio', illustrazione: 'maglia', colore: '#1E46F0',
                descrizione: 'Maglia leggera con zip corta e tasca posteriore, nelle taglie per età.', foto: [], modello3d: '' }
            ] },
          { slug: 'caschi', titolo: 'Caschi', icona: 'casco', foto: { file: 'ciclismo-caschi', alt: 'Caschi da bici appesi al manubrio' },
            descrizione: 'Caschi da strada, da mountain bike, urbani e per bambini, con regolazione posteriore.',
            tipologie: ['Strada', 'Mountain bike', 'Urbani', 'Bambini'], insieme: ['accessori'],
            prodotti: [
              { codice: 'CIC-CAS-01', nome: 'Casco da bici da strada', linea: 'adulto', prezzo: 89.9, taglia: 'casco', disponibilita: 'in negozio', illustrazione: 'casco-bici', colore: '#F4F2ED',
                descrizione: 'Leggero e con molte prese d\'aria. Va regolato: deve stare dritto, due dita sopra le sopracciglia.', foto: [], modello3d: '' },
              { codice: 'CIC-CAS-02', nome: 'Casco da mountain bike', linea: 'adulto', prezzo: 79.9, taglia: 'casco', disponibilita: 'in negozio', illustrazione: 'casco-bici', colore: '#0E0F12',
                descrizione: 'Visiera e protezione più bassa sulla nuca, per i sentieri.', foto: [], modello3d: '' },
              { codice: 'CIC-CAS-03', nome: 'Casco urbano', linea: 'adulto', prezzo: 54.9, taglia: 'casco', disponibilita: 'su ordinazione', illustrazione: 'casco-bici', colore: '#5C626C',
                descrizione: 'Forma più chiusa e luce posteriore integrata, per la città.', foto: [], modello3d: '' },
              { codice: 'CIC-CAS-04', nome: 'Casco da bici bambino', linea: 'bambino', prezzo: 34.9, taglia: 'casco-bambino', disponibilita: 'in negozio', illustrazione: 'casco-bici', colore: '#F45BA4',
                descrizione: 'Regolazione con rotella e fibbia facile da aprire. Colori ben visibili.', foto: [], modello3d: '' }
            ] },
          { slug: 'scarpe', titolo: 'Scarpe', icona: 'scarpa', foto: { file: 'ciclismo-scarpe', alt: 'Scarpa da ciclismo con attacco sul pedale' },
            descrizione: 'Scarpe da strada con attacco a 3 fori, da mountain bike a 2 fori e per pedali piatti.',
            tipologie: ['Strada – 3 fori', 'Mountain bike – 2 fori', 'Pedale piatto'], insieme: ['abbigliamento', 'accessori'],
            prodotti: [
              { codice: 'CIC-SCA-01', nome: 'Scarpa da bici da strada (3 fori)', linea: 'adulto', prezzo: 119.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-bici', colore: '#F4F2ED',
                descrizione: 'Suola rigida per trasmettere la spinta al pedale, attacco a 3 fori per le tacchette da strada (vendute a parte).', foto: [], modello3d: '' },
              { codice: 'CIC-SCA-02', nome: 'Scarpa da mountain bike (2 fori)', linea: 'adulto', prezzo: 99.9, taglia: 'scarpe-adulto', disponibilita: 'su ordinazione', illustrazione: 'scarpa-bici', colore: '#0E0F12',
                descrizione: 'Tacchetta incassata nella suola: si cammina meglio quando serve scendere dalla bici.', foto: [], modello3d: '' },
              { codice: 'CIC-SCA-03', nome: 'Scarpa per pedale piatto', linea: 'adulto', prezzo: 79.9, taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-campo', colore: '#5C626C',
                descrizione: 'Suola in gomma morbida che fa presa sui perni del pedale. Per mountain bike e città.', foto: [], modello3d: '' },
              { codice: 'CIC-SCA-04', nome: 'Scarpa da bici bambino per pedale piatto', linea: 'bambino', prezzo: 44.9, taglia: 'scarpe-bambino', misure: ['30', '31', '32', '33', '34', '35'], disponibilita: 'su ordinazione', illustrazione: 'scarpa-campo', colore: '#1E46F0',
                descrizione: 'Suola in gomma con buona presa e chiusura a strappo.', foto: [], modello3d: '' }
            ] },
          { slug: 'accessori', titolo: 'Accessori', icona: 'borraccia', foto: null,
            descrizione: 'Guanti, borracce e portaborracce, luci, occhiali e kit per le riparazioni veloci.',
            tipologie: ['Guanti', 'Borracce', 'Luci', 'Occhiali', 'Kit riparazione'], insieme: ['caschi', 'abbigliamento'],
            prodotti: [
              { codice: 'CIC-ACC-01', nome: 'Guanti da ciclismo estivi', linea: 'adulto', prezzo: 19.9, taglia: 'guanti', disponibilita: 'in negozio', illustrazione: 'guanti', colore: '#0E0F12',
                descrizione: 'Senza dita, con imbottitura sul palmo che riduce la pressione sul manubrio.', foto: [], modello3d: '' },
              { codice: 'CIC-ACC-02', nome: 'Guanti da ciclismo bambino', linea: 'bambino', prezzo: 14.9, taglia: 'guanti-bambino', disponibilita: 'in negozio', illustrazione: 'guanti', colore: '#F45BA4',
                descrizione: 'Senza dita e con chiusura a strappo, nelle misure per età.', foto: [], modello3d: '' },
              { codice: 'CIC-ACC-03', nome: 'Borraccia 750 ml', linea: 'entrambe', prezzo: 8.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'borraccia', colore: '#F4F2ED',
                descrizione: 'Si schiaccia con una mano mentre pedali e si incastra in tutti i portaborracce standard.', foto: [], modello3d: '' },
              { codice: 'CIC-ACC-04', nome: 'Occhiali sportivi', linea: 'adulto', prezzo: 39.9, taglia: 'unica', disponibilita: 'in negozio', illustrazione: 'occhiali', colore: '#0E0F12',
                descrizione: 'Lente avvolgente che ripara da sole, vento e insetti.', foto: [], modello3d: '' },
              { codice: 'CIC-ACC-05', nome: 'Borsello sottosella con kit riparazione', linea: 'adulto', prezzo: 24.9, taglia: 'unica', disponibilita: 'esaurito', illustrazione: 'marsupio', colore: '#0E0F12',
                descrizione: 'Borsello con leve, toppe e camera d\'aria di scorta, da fissare sotto la sella.', foto: [], modello3d: '' }
            ] }
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
