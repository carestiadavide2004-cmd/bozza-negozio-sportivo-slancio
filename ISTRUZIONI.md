# Istruzioni – Slancio (sito vetrina)

Il sito è statico: le pagine HTML si generano da `config.js` con `node build.mjs`.
Non serve installare nulla oltre a Node.

## Cambiare i dati (per un cliente vero)

Tutto è in **config.js**:

- `attivita` – nome, payoff, città, descrizione.
- `contatti` – telefono, WhatsApp (solo cifre con prefisso, es. `393331234567`), email, indirizzo, social.
- `orari` – orari per giorno (anche con pausa pranzo), festivi (`MM-GG`), chiusure straordinarie (`AAAA-MM-GG`).
  Il badge "Aperto ora / Chiuso" si calcola da qui, in ora italiana.
- `legale` – ragione sociale, P.IVA, sede, email privacy, PEC, data aggiornamento informativa.
- `modulo` – `modalita: 'whatsapp'` (apre WhatsApp con il messaggio pronto) oppure `'web3forms'` + `web3formsAccessKey`.
- `marchi` – elenco dei marchi trattati (solo testo).
- `sport` – sport, categorie, tipologie, consigli, foto e colori di accento.
- `sito.bozza` – `true` = noindex e niente sitemap; `false` = sito pubblico (crea sitemap.xml e robots.txt).
  Con `false` aggiorna anche `sito.urlBase`.

Dopo ogni modifica:

```
node build.mjs
```

## Catalogo e prodotti

Ogni categoria ha una sua pagina (`sport/<sport>/<categoria>/index.html`) generata da `node build.mjs`.
I prodotti stanno nel campo `prodotti` della categoria in config.js:

```js
{ codice: 'CAL-SCA-01', nome: 'Scarpa da calcio per erba naturale (FG)', linea: 'adulto', prezzo: 69.9,
  taglia: 'scarpe-adulto', disponibilita: 'in negozio', illustrazione: 'scarpa-tacchetti', colore: '#1E46F0',
  descrizione: 'Testo breve.', foto: [], modello3d: '' }
```

- `codice`: unico (il build si ferma se è ripetuto). È quello che arriva nel messaggio della borsa.
- `linea`: `'adulto'`, `'bambino'` oppure `'entrambe'` (filtri "Adulto / Bambino" e suggerimenti).
- `taglia`: uno dei tipi in `catalogo.taglie` (numeri scarpe, XS–XXL, età bambino, once, misure palloni…). Con `misure: [...]` si scelgono solo alcune misure.
- `disponibilita`: `'in negozio'`, `'su ordinazione'` oppure `'esaurito'` (esaurito = niente "Aggiungi", c'è "Chiedi quando arriva").
- `illustrazione` e `colore`: il disegno usato finché non ci sono foto (elenco in `_strumenti/illustrazioni.mjs`).
- `foto` e `modello3d`: vedi sotto.
- Il prezzo si vede solo se `catalogo.mostraPrezzi` è `true`. L'etichetta "di esempio" è `catalogo.etichettaEsempio`: per un cliente vero va tolta o cambiata.
- `insieme` (nella categoria): categorie da proporre in "Spesso comprati insieme", es. `['parastinchi-e-protezioni', 'fitness-e-palestra/borse-e-accessori']`.

## Borsa "Prenota e ritira" e guida taglie

- Testi, prefisso del codice (SL-XXXX) e giorni massimi per passare in negozio: `borsa` in config.js.
- La richiesta parte su WhatsApp oppure con Web3Forms, come il modulo (`modulo.modalita`).
- I giorni di chiusura si prendono da `orari` (settimana, festivi, chiusure straordinarie).
- Tabelle e testi della guida taglie: `guidaTaglie` in config.js.

## Foto e 3D dei prodotti (versione per il cliente)

**Foto.** Per ogni prodotto si possono mettere fino a 6 foto, quadrate (consigliato 1200 × 1200, sfondo chiaro e uguale per tutte), in WebP, nella cartella `assets/img/prodotti/`, con il codice del prodotto nel nome:

```
assets/img/prodotti/CAL-SCA-01-fronte.webp
assets/img/prodotti/CAL-SCA-01-lato.webp
assets/img/prodotti/CAL-SCA-01-retro.webp
assets/img/prodotti/CAL-SCA-01-sopra.webp
assets/img/prodotti/CAL-SCA-01-sotto.webp
assets/img/prodotti/CAL-SCA-01-dettaglio.webp
```

Poi si scrivono nel prodotto, la prima è quella della card:
`foto: ['assets/img/prodotti/CAL-SCA-01-fronte.webp', 'assets/img/prodotti/CAL-SCA-01-lato.webp']`.
Con più foto la scheda mostra scorrimento, miniature e zoom. Senza foto resta il disegno.

**3D.** Un modello `.glb` (massimo circa 5 MB, senza marchi se è una demo) va in `assets/3d/` e nel prodotto si scrive
`modello3d: 'assets/3d/nome-file.glb'`: compare il pulsante "Vedi in 3D". Il visore (`assets/js/vendor/model-viewer.min.js`) è nel sito e si scarica solo quando si tocca il pulsante. Aprendo il sito come file dal computer il 3D non si vede (il browser lo blocca): si vede online.

**In futuro (pannello admin, non ancora fatto).** Il flusso pensato:
1. il negoziante fotografa l'oggetto girandoci intorno con un'app per iPhone che fa la "cattura oggetti" (Object Capture);
2. l'app esporta il modello in `.glb` (per il sito) e `.usdz` (per vederlo in realtà aumentata su iPhone);
3. dal pannello admin si caricano foto e modelli, che vengono collegati al codice del prodotto.

Nota: per caricare i file su Firebase Storage serve il piano **Blaze** (a consumo, con carta di credito): Cloud Storage non è incluso nel piano gratuito Spark. Senza Blaze i file si possono mettere direttamente nel sito (cartelle sopra) e pubblicare con GitHub.

## Maglia personalizzata e "Crea il tuo kit"

- **Maglia** (home, sezione `#maglia`): dati in `config.js` → `maglia` (motivi, colori, squadre inventate con stemma SVG, limiti di nome e numero, peso massimo dello stemma). Codice in `js/maglia.js`.
  - Il modello 3D `assets/3d/maglia.glb` si rigenera con `node _strumenti/maglia3d.mjs` (forma, pieghe, trama). La texture è disegnata nel browser in un canvas 2048×2048.
  - Il 3D si carica solo quando la sezione sta per entrare nello schermo. Senza WebGL, se il modello non si carica o aprendo il sito dal Mac (file://) si vede la versione 2,5D disegnata.
  - Lo stemma caricato resta nel browser: non viene mai inviato.
  - L'anteprima `assets/img/maglia-anteprima-*.webp` è una schermata del 3D: se cambi la squadra iniziale, rifalla.
- **Kit squadre** (`squadre/index.html`): dati in `config.js` → `kit` (pacchetti e prezzi di esempio per sport, costo di nomi/numeri e stemma, sconti quantità, sconto bambini). Codice in `js/kit.js`. Il codice richiesta è KIT-XXXX. L'invio segue `modulo.modalita` (WhatsApp o Web3Forms).
- Per un cliente vero: cambiare prezzi e pacchetti in `config.js`, togliere le squadre inventate o sostituirle con esempi autorizzati.

## Servizi su prenotazione e noleggio sci

- **Servizi** (`servizi/index.html`): elenco, durate e prezzi di esempio in `config.js` → `servizi`. Le fasce mattina/pomeriggio arrivano dagli orari del negozio (`orari`): giorni chiusi, festivi e date passate sono rifiutati. Codice SRV-XXXX. Invio secondo `modulo.modalita`.
  - **Versione per un cliente vero:** al posto del modulo si può usare **Agendo**, l'app di prenotazione di Davide (calendario vero con posti e conferme). Il modulo del sito resta come alternativa semplice: la prenotazione è confermata solo quando il negozio risponde.
- **Noleggio sci** (`noleggio-sci/index.html`): attrezzatura, prezzi al giorno, pezzi, stagione (`stagione.da/a` in MM-GG), orari di ritiro e riconsegna in `config.js` → `noleggio`. Codice NOL-XXXX.
  - Ritiro: il pomeriggio di apertura più vicino prima del primo giorno. Riconsegna: entro l'ora fissata del primo giorno di apertura dopo l'ultimo.
  - **La disponibilità è simulata** (demo): pezzi totali meno prenotazioni di esempio (`noleggio.esempio`: feriali, venerdì, weekend/feste/periodi di punta) più una piccola variazione fissa per giorno. Se un tipo è esaurito in uno dei giorni scelti la richiesta è bloccata e il sito propone il giorno (o periodo) libero più vicino.
  - **Per una disponibilità vera e condivisa** servono un database (es. Firebase Firestore) con le prenotazioni confermate e un pannello per il negozio che le inserisce o le conferma. Senza database ogni visitatore vede solo la simulazione.

## Hero della home: giro di tutti gli sport

- Parte dal video del calcio, poi passa agli altri 11 sport nell'ordine di `config.js` → `sport`, con dissolvenza. Durata e dissolvenza in `home.heroLoop` (`durata: 6.2`, `dissolvenza: 1.2` secondi).
- Gli sport senza video usano la loro foto (`foto`) con uno zoom lento. Su computer la foto parte dopo la colonna del testo, sul telefono sotto il titolo, così il testo non copre il soggetto.
- **Per aggiungere un video a uno sport:** metti in `assets/video/` la versione orizzontale (1920×1080) e quella verticale (1080×1920), stessa durata (circa 6 s), frame rate costante, e aggiungi allo sport in `config.js` `video: { computer: 'assets/video/NOME-1920.mp4', telefono: 'assets/video/NOME-1080x1920.mp4' }`. Poi `node build.mjs`.
- Vengono caricati solo la diapositiva in corso e la successiva. Si ferma con la scheda nascosta, fuori schermo o col pulsante pausa. Con "riduci movimento" resta la foto fissa del calcio; con "risparmio dati" niente video.

## Kit squadra: materiali e grafiche

- **Capi e materiali** (`config.js` → `kit.capi`): per ogni gruppo di capi i `tipi` e i `materiali` (nome, una riga di descrizione, disegno `trama`). `preventivo: true` mostra "Prezzo su preventivo". `voci` collega il gruppo ai nomi dei capi dei pacchetti.
- **Stemma, sponsor e grafiche** (`kit.grafiche`): formati, peso massimo (10 MB), numero di file e posizioni. I file restano nel browser: nella richiesta vanno nomi e posizioni, il cliente li allega in WhatsApp.
  - **Versione per un cliente vero:** per ricevere davvero i file serve un servizio di caricamento (es. Firebase Storage o un modulo con allegati) da aggiungere anche nell'informativa privacy.

## Foto

- Le originali stanno in `_sorgenti/foto/` (non pubblicate). L'elenco nome → id Pexels è in `_sorgenti/scelte.txt`.
- `node _sorgenti/prepara-foto.mjs` rigenera tutti i WebP (servono `ffmpeg` e `cwebp`).
- Se una categoria non ha foto (`foto: null`) si vede un disegno con l'icona.

## Pubblicazione

GitHub Pages dal ramo `main`, cartella principale. Tutti i link sono relativi, quindi il sito funziona anche in una sottocartella.

## Privacy

`privacy.html` si genera da `modelli/privacy-modello.html` (copia locale del modello in "SITI REALI/_MODELLI/modello privacy", non pubblicata) con i dati di `config.js`.
Il sito non usa cookie, né Google Fonts, né statistiche. La mappa Google si carica solo dopo il clic.
La borsa è salvata solo nel browser di chi visita (memoria locale): l'informativa lo spiega già.
