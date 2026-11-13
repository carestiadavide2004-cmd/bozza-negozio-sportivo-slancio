/* =====================================================================
   SLANCIO – listino.js · LISTINO PREZZI (PREZZI DI ESEMPIO – DEMO)

   Qui ci sono TUTTI i prezzi del kit squadra e del noleggio sci.
   Per cambiare un prezzo si cambia solo questo file: il configuratore,
   il preventivo, il PDF, la guida taglie e il noleggio lo leggono da qui.

   - Tutti i prezzi sono in euro e COMPRENDONO l'IVA.
   - "piu" = maggiorazione in euro PER CAPO (0 = compreso nel prezzo).
   - Dopo una modifica lancia  node build.mjs  (aggiorna i prezzi "da …"
     scritti nelle pagine).

   Funziona nel browser (window.LISTINO) e in Node (build.mjs).
   ===================================================================== */
(function (root, factory) {
  var L = factory();
  if (typeof module === 'object' && module.exports) module.exports = L;
  else root.LISTINO = L;
})(typeof self !== 'undefined' ? self : this, function () {
  return {

    /* ---------- Avviso mostrato vicino ai prezzi ---------- */
    avviso: 'Prezzi indicativi – demo',

    /* ---------- Regole generali ---------- */
    iva: 22,                 // % di IVA già compresa nei prezzi (nel preventivo: "di cui IVA")
    acconto: 50,             // % da pagare all'ordine; il saldo si paga al ritiro o alla consegna
    spedizione: {
      costo: 15,             // € a ordine. Il ritiro in negozio è gratis
      testo: 'Corriere espresso, 2–3 giorni lavorativi dopo la produzione'
    },

    /* ---------- Sconti quantità a scaglioni ----------
       "kit" = numero di maglie gara (se non ci sono maglie: il capo con più pezzi).
       oltre: 15  → lo sconto parte da 16 kit. Vale lo scaglione più alto raggiunto. */
    sconti: [
      { oltre: 15, percento: 5 },
      { oltre: 30, percento: 10 }
    ],

    /* ---------- Marche (segnaposto: cambia nome e testo con le marche vere, SENZA loghi) ----------
       produzione = tempi indicativi in giorni lavorativi [minimo, massimo] dall'approvazione della grafica */
    marche: [
      { id: 'base', nome: 'Marca Base', fascia: 'Base', produzione: [15, 20],
        testo: 'Tessuti robusti e prezzo contenuto: ideale per scuole sport e settori giovanili.' },
      { id: 'media', nome: 'Marca Media', fascia: 'Media', produzione: [15, 25],
        testo: 'Il giusto equilibrio: tessuti più leggeri, tagli moderni, tanti colori.' },
      { id: 'premium', nome: 'Marca Premium', fascia: 'Premium', produzione: [20, 30],
        testo: 'Tessuti da prima squadra, finiture curate e vestibilità da gara.' }
    ],

    /* ---------- Personalizzazioni (€ per capo) ---------- */
    personalizzazioni: {
      nomeNumero: 6,         // nome e numero sul retro, per ogni giocatore della rosa che li ha
      stemma: 3,             // stemma sul petto, per ogni maglia gara
      sponsor: 2.5           // per ogni sponsor, per ogni capo su cui va (maglia o pantaloncino)
    },

    /* ---------- Capi del kit ----------
       prezzi  = prezzo di un capo per marca (id delle marche qui sopra)
       tipi    = si sceglie per primo; "piu" = maggiorazione del tipo
       materiali = si sceglie dopo il tipo; "piu" = maggiorazione del materiale
       trama   = disegno dell'icona (vedi kit.js) */
    capi: [
      { id: 'maglia', nome: 'Maglia gara', icona: 'maglia', prezzi: { base: 18, media: 26, premium: 38 },
        tipi: [ { nome: 'Maniche corte', piu: 0 }, { nome: 'Maniche lunghe', piu: 3 }, { nome: 'Canotta', piu: 0 } ],
        materiali: [
          { id: 'tecnico', nome: 'Poliestere tecnico traspirante', trama: 'tecnico', piu: 0, testo: 'Leggero, asciuga in fretta: va bene per quasi tutti gli sport.' },
          { id: 'mesh', nome: 'Micro-rete (mesh)', trama: 'rete', piu: 2, testo: 'Piccoli fori su tutta la maglia: la più fresca per le gare d\'estate.' },
          { id: 'interlock', nome: 'Interlock', trama: 'interlock', piu: 3, testo: 'Più compatto e morbido, resiste a tanti lavaggi e ai mesi freddi.' },
          { id: 'sublimato', nome: 'Sublimato totale', trama: 'sublimato', piu: 6, testo: 'Grafica stampata dentro il tessuto: colori e disegni senza limiti.' }
        ] },
      { id: 'pantaloncini', nome: 'Pantaloncini', icona: 'pantaloncino', prezzi: { base: 12, media: 17, premium: 25 },
        tipi: [ { nome: 'Classico', piu: 0 }, { nome: 'Aderente', piu: 2 } ],
        materiali: [
          { id: 'tecnico', nome: 'Poliestere tecnico', trama: 'tecnico', piu: 0, testo: 'Leggero ed elastico in vita, non si appesantisce con il sudore.' },
          { id: 'rinforzi', nome: 'Poliestere tecnico con rinforzi', trama: 'rinforzo', piu: 2, testo: 'Cuciture e zone di contatto rinforzate: dura di più su sintetico e campi duri.' }
        ] },
      { id: 'calzettoni', nome: 'Calzettoni', icona: 'calza', prezzi: { base: 5, media: 8, premium: 12 },
        tipi: [ { nome: 'Calzettoni lunghi', piu: 0 }, { nome: 'Calze corte', piu: 0 } ],
        materiali: [
          { id: 'tecnico', nome: 'Poliestere tecnico', trama: 'tecnico', piu: 0, testo: 'Sottile e traspirante, tiene il piede asciutto.' },
          { id: 'rinforzi', nome: 'Con rinforzi su tallone e punta', trama: 'rinforzo', piu: 1.5, testo: 'Spugna nei punti di attrito: meno vesciche e più durata.' }
        ] },
      { id: 'rappresentanza', nome: 'Tuta di rappresentanza', icona: 'felpa', prezzi: { base: 45, media: 62, premium: 89 },
        tipi: [ { nome: 'Felpa full-zip con pantalone', piu: 0 } ],
        materiali: [
          { id: 'strutturato', nome: 'Tessuto strutturato ed elegante', trama: 'strutturato', piu: 0, testo: 'Più corposo, cade bene: per trasferte, premiazioni e foto di squadra.' }
        ] },
      { id: 'allenamento', nome: 'Tuta da allenamento', icona: 'felpa', prezzi: { base: 32, media: 44, premium: 62 },
        tipi: [ { nome: 'Felpa con zip e pantalone affusolato', piu: 0 }, { nome: 'Felpa girocollo e pantalone affusolato', piu: 0 } ],
        materiali: [
          { id: 'felpa', nome: 'Felpa leggera', trama: 'felpa', piu: 0, testo: 'Morbida e calda, interno garzato.' },
          { id: 'poliestere', nome: 'Poliestere', trama: 'tecnico', piu: 0, testo: 'Più leggero, asciuga in fretta dopo l\'allenamento.' }
        ] },
      { id: 'tecnica', nome: 'Tuta tecnica', icona: 'giacca', prezzi: { base: 38, media: 52, premium: 74 },
        tipi: [ { nome: 'Giacca e pantalone', piu: 0 } ],
        materiali: [
          { id: 'elastico', nome: 'Poliestere tecnico elasticizzato', trama: 'elastico', piu: 0, testo: 'Segue i movimenti: per allenamento e riscaldamento.' }
        ] },
      { id: 'giubbino', nome: 'Giubbino', icona: 'giacca', prezzi: { base: 28, media: 39, premium: 55 },
        tipi: [ { nome: 'Giubbino', piu: 0 }, { nome: 'Gilet', piu: 0 }, { nome: 'Giaccone lungo da panchina', piu: 35 } ],
        materiali: [
          { id: 'antipioggia', nome: 'Antipioggia leggero', trama: 'pioggia', piu: 0, testo: 'Si piega in tasca, ferma pioggia e vento negli allenamenti.' },
          { id: 'softshell', nome: 'Softshell', trama: 'softshell', piu: 12, testo: 'Esterno antivento e interno felpato: caldo ma traspirante.' },
          { id: 'piumino', nome: 'Piumino imbottito', trama: 'piumino', piu: 22, testo: 'Imbottitura trapuntata per la panchina d\'inverno.' }
        ] },
      { id: 'borsa', nome: 'Borsa', icona: 'borsa', prezzi: { base: 16, media: 24, premium: 35 },
        tipi: [ { nome: 'Borsa', piu: 0 }, { nome: 'Borsone', piu: 0 }, { nome: 'Zaino', piu: 0 } ],
        materiali: [
          { id: 'tela', nome: 'Tela spalmata · 25 litri', trama: 'borsa', piu: 0, testo: 'Compatta e impermeabile, per l\'allenamento di tutti i giorni.' },
          { id: 'p600', nome: 'Poliestere 600D · 40 litri', trama: 'borsa', piu: 4, testo: 'Resistente e lavabile: entra tutto il kit della partita.' },
          { id: 'p600-rigido', nome: 'Poliestere 600D con fondo rigido · 70 litri', trama: 'borsa', piu: 12, testo: 'Per le trasferte: fondo impermeabile e tasca per le scarpe.' }
        ] }
    ],

    /* ---------- Tabella taglie (guida taglie e rosa) ----------
       altezza e peso: [da, a]. La guida sceglie la taglia che va bene per tutte e due le misure;
       "comoda" = una taglia in più, "aderente" = la più piccola tra quella dell'altezza e quella del peso.
       Sotto i 155 cm di altezza la guida usa le taglie bambino. */
    taglie: {
      bambiniSotto: 155,
      adulti: [
        { taglia: 'XS', altezza: [150, 163], peso: [45, 57], torace: '82–88' },
        { taglia: 'S', altezza: [160, 170], peso: [55, 66], torace: '88–96' },
        { taglia: 'M', altezza: [168, 178], peso: [64, 76], torace: '96–104' },
        { taglia: 'L', altezza: [176, 185], peso: [74, 86], torace: '104–112' },
        { taglia: 'XL', altezza: [183, 192], peso: [84, 98], torace: '112–120' },
        { taglia: 'XXL', altezza: [190, 200], peso: [96, 115], torace: '120–128' },
        { taglia: '3XL', altezza: [195, 210], peso: [110, 135], torace: '128–136' }
      ],
      bambini: [
        { taglia: '6 anni', altezza: [110, 122], peso: [18, 24], torace: '58–62' },
        { taglia: '8 anni', altezza: [122, 134], peso: [23, 30], torace: '62–68' },
        { taglia: '10 anni', altezza: [134, 146], peso: [29, 38], torace: '68–74' },
        { taglia: '12 anni', altezza: [146, 158], peso: [37, 47], torace: '74–80' },
        { taglia: '14 anni', altezza: [158, 170], peso: [45, 56], torace: '80–86' }
      ],
      nota: 'Misure indicative: cambiano un po\' da marca a marca. Nel dubbio, prima del ritiro proviamo le taglie in negozio.'
    },

    /* ---------- Noleggio sci e snowboard: € al giorno (id = attrezzatura in config.js) ---------- */
    noleggio: {
      'sci-adulto': 25,
      'sci-bambino': 15,
      'snow-adulto': 28,
      'snow-bambino': 18,
      'scarponi': 9,
      'casco': 5
    }
  };
});
