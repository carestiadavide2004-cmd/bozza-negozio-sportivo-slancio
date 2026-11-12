# PROGRESSO – Slancio (demo negozio sportivo)

## Stato
- [x] Fase 1 – Direzione artistica (DESIGN.md, piano immagini, strumenti verificati)
- [x] Fase 2 – Blocco A: base comune (config.js, build.mjs, css, js, font, logo, favicon, og.jpg)
- [x] Fase 2 – Blocco B: home (video hero, tessere, perché, configuratore maglia, marchi, negozio, modulo, FAQ)
- [x] Fase 2 – Blocco C: pagina sport di prova (calcio) – controllata a 390 e 1440
- [x] Fase 2 – Blocco D: altre 11 pagine sport, privacy, 404 (stesso modello, generate da build.mjs)
- [x] Fase 3 – Revisione art director (16 difetti corretti, 2 giri)
- [x] Fase 4 – Controllo veloce e pubblicazione

## Strumenti verificati (Fase 1)
- node v26.10.0 ✔ · ffmpeg 9.0.2 con libx264 ✔ · cwebp 1.6.0 (WebP) ✔ · Playwright Chromium in ~/.carestia-qa ✔ · gh collegato a carestiadavide2004-cmd ✔
- Font scaricati da Fontsource (SIL OFL): Barlow Condensed 800 + 800 corsivo, Barlow 400 + 600 (90 KB in tutto).
- Metodo foto: elenco id dalle pagine di ricerca pexels.com (lette come testo), anteprime e download dell'ORIGINALE da images.pexels.com, video da pexels.com/download/video/ID.

## Piano immagini (ricerche Pexels)
Per ogni sport: 1 hero orizzontale (sorgente ≥2400px), 1 tessera verticale, 1 foto per categoria. Se non c'è una foto davvero bella → icona SVG sul colore sport.

| Sport | Hero (orizzontale) | Tessera (verticale) | Categorie (ricerca) |
|---|---|---|---|
| 01 Calcio | "soccer match stadium" | "soccer player ball portrait" | scarpe: "football boots grass" · maglie: "soccer team jerseys" · pantaloncini/calzettoni: "soccer socks shin" · tute: "athlete tracksuit" · portieri: "goalkeeper gloves" · parastinchi: "shin guards" · palloni: "soccer ball grass" · borse: "sports bag" |
| 02 Calcetto | "futsal indoor" | "five a side football night" | scarpe: "indoor soccer shoes" · maglie kit: "soccer team huddle" · pantaloncini: "soccer socks" · parastinchi/guanti: "goalkeeper gloves futsal" · palloni: "futsal ball" · borse: "gym bag bench" |
| 03 Basket | "basketball game court" | "basketball player dunk" | scarpe: "basketball shoes court" · canotte: "basketball jersey" · tute: "hoodie athlete" · palloni: "basketball close up" · protezioni: "basketball knee sleeve" |
| 04 Pallavolo | "volleyball match indoor" | "volleyball spike" | scarpe: "volleyball shoes" · divise: "volleyball team" · ginocchiere: "volleyball knee pads" · palloni: "volleyball ball" · borse: "volleyball bag" |
| 05 Tennis | "tennis court clay" | "tennis player serve" | racchette: "tennis racket" · scarpe: "tennis shoes court" · abbigliamento: "tennis outfit" · palline: "tennis balls" · borse: "tennis bag" · accessori: "tennis grip strings" |
| 06 Padel | "padel court" | "padel player" | racchette: "padel racket" · scarpe: "padel shoes" · abbigliamento: "padel outfit" · palline: "padel balls" · borse: "padel bag" · accessori: "padel accessories" |
| 07 Pugilato | "boxing ring" | "boxer training" | guantoni: "boxing gloves" · caschetti: "boxing headgear" · sacchi: "punching bag" · abbigliamento/scarpe: "boxing shoes" · bende/corde: "boxing hand wraps" |
| 08 Sci | "skiing mountain powder" | "snowboarder" | giacche: "ski jacket" · strati termici: "base layer" · caschi/maschere: "ski goggles helmet" · guanti: "ski gloves" · scarponi: "ski boots" |
| 09 Nuoto | "swimming pool lanes swimmer" | "swimmer butterfly" | costumi: "swimsuit pool" · occhialini/cuffie: "swimming goggles cap" · accappatoi/teli: "pool towel" · accessori: "kickboard pool" · zaini: "swim bag" |
| 10 Running | "runner road morning" | "running track athlete" | scarpe: "running shoes" · abbigliamento: "running apparel" · calze: "running socks" · accessori: "running watch" |
| 11 Fitness | "gym training" | "woman lifting weights" | abbigliamento: "gym outfit" · scarpe training: "training shoes gym" · pesi: "dumbbells rack" · yoga: "yoga mat" · borse: "gym bag" |
| 12 Ciclismo | "road cycling" | "cyclist mountain road" | abbigliamento: "cycling jersey" · caschi: "bike helmet" · scarpe: "cycling shoes" · accessori: "bike bottle gloves" |

Video hero home: orizzontale "athlete sprint slow motion" / verticale "soccer slow motion vertical" (azione spettacolare, niente loghi).

## Categorie con icona al posto della foto (27)
Nessuna foto davvero bella e senza loghi leggibili → disegno SVG sul colore dello sport.
- Calcio: Pantaloncini e calzettoni · Parastinchi e protezioni · Borse e zaini
- Calcetto: Scarpe da calcetto · Pantaloncini e calze · Parastinchi e guanti · Borse e zaini
- Basket: Tute e felpe · Protezioni e accessori
- Pallavolo: Borse e accessori
- Tennis: Borse e sacche · Accessori
- Padel: Scarpe · Palline · Borse e paletteros · Accessori
- Pugilato: Caschetti e protezioni · Abbigliamento e scarpe
- Sci: Strati termici · Guanti e accessori
- Nuoto: Costumi · Accappatoi e teli · Accessori e attrezzi · Zaini e borse
- Running: Calze e protezioni · Accessori
- Ciclismo: Accessori

## Comandi utili
- `node build.mjs` rigenera tutte le pagine da config.js.
- Server locale: `python3 -m http.server 8765` nella cartella del sito.
- Script di controllo (fuori dal sito): ~/.carestia-qa/slancio/shot.mjs, strisce.sh, og.mjs.

## Difetti Fase 3 (giro 1 – screenshot 390/768/1440 di home, calcio, padel, sci)
1. ✅ Briciole di pane con numeri "1. 2. 3." del browser → lista senza numeri.
2. ✅ Telefono: i pulsanti della hero sport finivano sotto la barra fissa → hero alta 100svh meno la barra.
3. ✅ Striscia chiara sotto il footer sul telefono (padding del body) → spazio della barra dentro il footer scuro.
4. ✅ Orari nel footer spezzati a metà ("15:30–" / "19:30") → fasce che non si spezzano e giorni uguali raggruppati ("Mar–Sab").
5. ✅ Computer: le linee di campo nella hero sport coprivano il soggetto → più trasparenti e spostate.
6. ✅ "Pugilato e combattimento" nella hero computer andava a capo col trattino → titolo più piccolo per i nomi lunghi.
7. ✅ Reset delle liste (`ul[class]`) più forte delle classi → annullava il margine del carosello "Altri sport" e della barra categorie. Ora `:where()`.
8. ✅ Carosello "Altri sport" attaccato al bordo sinistro → allineato alla griglia del sito (conseguenza del punto 7).
9. ✅ Mega menu: celle di altezza diversa con buchi grigi → celle che si allungano tutte uguali.
10. ✅ Nomi lunghi a capo in mega menu, menu telefono e footer → nome breve ("Pugilato", "Fitness") dove serve.
11. ✅ Barra categorie su due righe a 768 e 1440 → una riga che scorre fino a 1200px, chip più compatti.
12. ✅ Telefono: testo dei pulsanti hero spezzato su due righe → home a colonna, pagina sport con WhatsApp largo + "Dove siamo".
13. ✅ og.jpg generata senza i font del sito → rigenerata con Barlow Condensed.
14. ✅ Alt del video non corrispondente (diceva "tramonto") → "Calciatore che colpisce il pallone di sera su erba sintetica".


## Fase 3 – giro 2 (rifinitura dopo i nuovi screenshot)
15. ✅ Schede con icona come blocchi pieni di colore (troppo piatti, l'azzurro sci sembrava slavato) → fondo asfalto scuro, icona e linee di campo nel colore dello sport, filo colorato in basso: coerenti con le foto.
16. ✅ "Mar–Sab" andava a capo nel footer del telefono → giorno su una riga.
17. Accettato: la hero padel è un campo vuoto (nessuna foto di gioco senza loghi leggibili in alta risoluzione); funziona come ambiente, il giocatore è nella tessera.

## Fase 4 – controllo veloce (Chromium, 390 e 1440, ~31 s)
- 15 pagine aperte senza errori JS, senza immagini rotte, senza scorrimento laterale; noindex ovunque; nessun "{{".
- 28 link interni: tutti 200 (la 404 usa l'indirizzo base del sito online: verificata dopo la pubblicazione).
- Badge orari: lunedì solo pomeriggio, pausa pranzo, sabato sera → "riapre lunedì", domenica, festivo 8 dicembre, ora legale: tutti corretti.
- Menu telefono, ricerca (tastiera, porta alla categoria), accordion, configuratore maglia, modulo (4 errori se vuoto, link WhatsApp giusto), mappa solo al clic, barra fissa: ok.
- Richieste esterne al caricamento: solo cdnjs (GSAP). Nessun cookie. Nessun nome di negozio reale.
- Pesi al caricamento (video escluso): home telefono 0,83 MB · calcio telefono 0,86 MB · home computer 0,78 MB · calcio computer 0,91 MB.
- Video: hero-1920.mp4 2,9 MB · hero-1080x1920.mp4 2,4 MB.

---

# CATALOGO DI ESEMPIO (secondo passo)

## Stato
- [x] Blocco 0 – Controllo link: tutti i link interni puntano al file (`.../index.html`), anche quelli creati da JS; verificato da file:// e da server (passo precedente, ricontrollato con grep dopo `node build.mjs`). Le pagine nuove usano gli stessi helper (`sportUrl`, `vaiHome`, `catUrl`).
- [x] Blocco 1 – Catalogo di esempio in config.js + illustrazioni (assets/img/prodotti.svg)
  - 267 prodotti in 64 categorie (12 sport), codici tipo CAL-SCA-01, nessun marchio, prezzi di esempio in 3 fasce, linea adulto/bambino/entrambe, 35 tipi di taglia in catalogo.taglie (con gruppi bambino+adulto), disponibilità "in negozio" / "su ordinazione" / "esaurito", campi pronti foto: [] e modello3d: ''.
  - Categoria "su richiesta" (Scarponi e attrezzi) con 2 prodotti; almeno 1 prodotto bambino in scarpe, abbigliamento, palloni, protezioni, caschi, costumi.
  - Regole "insieme" per ogni categoria; testi della borsa e guida taglie in config.
  - Sprite di 66 illustrazioni originali (50 KB) generato da _strumenti/illustrazioni.mjs; colore = currentColor. Da file:// i browser bloccano <use> verso file esterni → copia js/prodotti-svg.js caricata solo in quel caso.
- [x] Blocco 2 – Pagine categoria, anteprime nella pagina sport, scheda prodotto
  - 64 pagine `sport/<sport>/<categoria>/index.html` (build.mjs → paginaCategoria): testata compatta con foto (o icona), briciole, tipologie, "Chiedi disponibilità" e "Guida taglie"; barra filtri sticky (Tutti/Adulto/Bambino, solo disponibili in negozio, fasce di prezzo calcolate per categoria, ordinamento); sul telefono i filtri sono un foglio dal basso con "Mostra N prodotti".
  - Card prodotto già nell'HTML (codice, nome, prezzo, disponibilità, taglia in <select>, "Aggiungi" disattivato finché non scegli la taglia con messaggio chiaro; esaurito → "Chiedi quando arriva" su WhatsApp). Griglia 2 colonne telefono, 3 tablet, 4 computer.
  - Pagina sport: ogni categoria porta alla sua pagina + carosello nativo (scroll-snap) di 4 prodotti e "Vedi tutti (N)".
  - Scheda prodotto (pannello a destra / foglio dal basso): galleria con scorrimento, miniature e zoom se ci sono più foto, taglie a pulsanti, guida taglie, "Vedi in 3D" se c'è modello3d, hash #prodotto-CODICE condivisibile (anche da altre pagine e dalla ricerca), Esc, focus intrappolato e restituito.
  - Ricerca: ora trova anche i prodotti (nome o codice) e porta alle pagine categoria.
  - Corretti durante il blocco: overflow:hidden sul body rompeva la barra sticky (ora solo su html); il foglio filtri finiva sotto la barra in basso (z-index della barra sticky); "1 prodotti"; avvisi GSAP su pagine senza hero sport.
- [x] Blocco 3 – Borsa "Prenota e ritira" con codice, modulo, condivisione, privacy
  - Icona borsa con contatore nell'header di ogni pagina. Pannello (destra su computer, dal basso su telefono): righe con taglia, quantità − / +, Rimuovi, totale di esempio; "Condividi la borsa", "Svuota".
  - Salvata in localStorage dentro try/catch (se non disponibile resta in memoria nella pagina); si aggiorna anche tra schede diverse.
  - Modulo "Verifica disponibilità in negozio": nome, telefono, quando passi (campo data + pulsanti rapidi dei prossimi 8 giorni, i giorni chiusi sono disattivati), note facoltative; errori accanto al campo; rifiuta date passate, giorni di chiusura (orari e festivi di config), oltre 7 giorni, e oggi se il negozio sta chiudendo. Riga privacy con link.
  - Invio: codice SL-XXXX (lettere/numeri senza 0, O, 1, I) mostrato grande con "Copia"; messaggio WhatsApp (o Web3Forms se in config) con codice, articoli, codici prodotto, taglie, quantità, nome, telefono e giorno.
  - Link condiviso #borsa=…: ricrea la borsa; se ce n'è già una chiede "Sostituisci / Aggiungi alla mia / Tieni la mia".
  - Privacy: aggiunti i dati della richiesta "Prenota e ritira" e la nota sulla borsa salvata solo nel browser (memoria locale, non profilazione). Nient'altro cambiato.
  - Pannelli: aria-modal, focus intrappolato e restituito, Esc, scorrimento bloccato solo su html (niente salti), velo che non fa scorrere la pagina su iPhone, niente backdrop-filter.
  - Prova automatica (borsa.mjs, 390 e 1440): 18/18 ok.
- [x] Blocco 4 – "Spesso comprati insieme"
  - Regole nel campo `insieme` di ogni categoria (config.js), anche verso un altro sport ("sport/categoria").
  - Scheda: 2–3 prodotti presi a turno dalle categorie collegate; borsa: "Ti potrebbe servire anche" partendo dagli ultimi prodotti aggiunti.
  - Esclusi: prodotti già nella borsa, esauriti, lo stesso prodotto e lo stesso tipo (es. dal casco propone la maschera). Prodotto bambino (o taglia bambino scelta) → solo prodotti bambino / adulto e bambino, con le sole taglie bambino nel menu; prodotto adulto → niente prodotti solo bambino.
  - Aggiunta con un tocco dopo aver scelto la taglia; il suggerimento sparisce appena è nella borsa.
  - Prova automatica (insieme.mjs): 5/5 ok.
- [x] Blocco 5 – Guida taglie con calcolatore scarpe
  - Pannello "Guida taglie" apribile dalla scheda prodotto, dalle pagine categoria (si apre già sulla scheda giusta: scarpe, guantoni, caschi…) e dalla voce "Guida taglie" nel footer di ogni pagina; anche con #guida-taglie nell'indirizzo.
  - Schede accessibili (frecce, Home, Fine): Scarpe (adulto + bambino), Abbigliamento adulto, Abbigliamento bambino, Guantoni, Palloni, Caschi. Tabelle e intestazioni da config.js (guidaTaglie).
  - Calcolatore: lunghezza del piede in cm → numero EU = arrotondamento di 1,5 × (cm + 1,5): 15 cm → 25, 27 cm → 43; fuori da 10–33 cm messaggio d'errore. Istruzioni per misurare, nota per corsa e bambini, tabelle numero/piede 24–35 e 36–47.
  - Avviso in alto: le misure cambiano da marca a marca e in negozio si prova tutto. Link WhatsApp per i dubbi.
  - Il pulsante "Guida taglie" compare solo nelle categorie dove serve (non per racchette, palline…).
- [x] Blocco 6 – "Vedi in 3D" (model-viewer ospitato nel sito)
  - Un solo modello adatto trovato con licenza libera: "Dirty Football" (Poly Haven, CC0), pallone in cuoio cucito, 2 MB, nessun marchio → prodotto CAL-PAL-03 "Pallone in cuoio cucito a mano". Un secondo modello sportivo CC0 senza marchi e di qualità non c'era: non forzato.
  - model-viewer 4.4.0 in assets/js/vendor/ (licenza inclusa), caricato solo al clic su "Vedi in 3D": prima del clic 0 byte, dopo solo file del sito (nessuna richiesta esterna).
  - Visore: rotazione con dito e mouse, zoom (con limiti), doppio tocco per tornare all'inizio, rotazione automatica lenta che si ferma al primo tocco, assente con movimento ridotto; sfondo scuro con riga del colore dello sport, "Anteprima 3D di esempio", chiusura con X o Esc; chiudendo il visore viene liberato.
  - Da file:// il browser blocca il .glb: messaggio chiaro invece del visore.
  - CREDITI.md: modello, illustrazioni, model-viewer. ISTRUZIONI.md: catalogo aggiornato, borsa e guida, nuova sezione "Foto e 3D dei prodotti (versione per il cliente)" con nomi file, flusso admin futuro e nota Firebase Blaze.
  - Prova automatica (v3d.mjs): 7/7 ok.
- [x] Revisione art director (2 giri) e controllo veloce
  - Controllo veloce (Chromium, 390 e 1440, 49 secondi in tutto): 64 pagine categoria; Basket → Scarpe funziona da file:// e da server; filtri e ordinamento cambiano davvero i risultati; borsa 18/18 (3 prodotti di cui 1 bambino da 2 sport, resta cambiando pagina, esaurito non aggiungibile, data passata e domenica rifiutate, codice SL-XXXX, link WhatsApp completo, borsa condivisa ricreata in una pagina nuova); suggerimenti 5/5; calcolatore 15 cm → 25, 27 cm → 43; 3D 7/7 (solo dopo il clic, nessuna richiesta esterna); 26 pagine senza errori in console, senza scorrimento laterale, richieste esterne solo cdnjs, 0 cookie.
  - Script in ~/.carestia-qa/slancio: finale.mjs, borsa.mjs, insieme.mjs, v3d.mjs, rev.mjs (schermate), peso2.mjs.

## Revisione art director – primo giro (schermate 390 / 768 / 1440)
1. [x] Card esaurita sul telefono: "Chiedi quando arriva" tagliato a metà → testo su due righe, icona nascosta sotto 480 px.
2. [x] Pagina sport, computer: la scheda categoria è molto più alta della fila di prodotti e lascia un buco sotto le card → scheda più compatta (foto 16:10, descrizione 3 righe) e card prodotto alte uguali, con l'area immagine che cresce.
3. [x] Pagina Calcio, computer: la barra delle categorie va su due righe → chip più compatti, una riga sola.
4. [x] Scheda prodotto con misura unica: "Misura: Misura 5" ripetuto → solo "Misura 5" in un riquadro.
5. [x] Modulo borsa: l'errore della data compare sotto i pulsanti dei giorni → subito sotto il campo.
6. [x] Visore 3D: il pallone riempie tutto il riquadro → camera più lontana (135%), stesso punto con doppio tocco.
7. [x] Suggerimenti su schermo largo: il pulsante "Aggiungi" da solo resta a metà riga → allineato a destra.
8. [x] Card sul telefono: nomi lunghi tagliati a 2 righe → 3 righe.
9. [x] Borsa: "Svuota" usava la finestra di conferma del browser → conferma nel pannello ("Sicuro? Tocca di nuovo").
10. [x] Testata della pagina categoria senza descrizione → aggiunta sotto il titolo.
11. [x] Scheda prodotto su computer: il disegno occupava 420 px → riquadro 16:10, prezzo e taglie visibili subito.
12. [x] Visore 3D sul telefono: il codice andava a capo → su una riga.
13. [x] Pagina sport sul telefono: "Scegli il numero" ripetuto sotto ogni card del carosello → nascosto lì, compare solo come errore.

## Revisione – secondo giro (rifinitura)
- [x] Anteprime su computer: nomi a 3 righe fissi, così immagini e prezzi sono allineati tra le card.
- [x] Controllate di nuovo: pagina categoria con icona (Pantaloncini, 1440), home 390 con icona borsa, Padel 390, modulo con errori, visore 3D, scheda: niente da correggere.
- Note: nelle schermate il campo data appare mm/dd/yyyy solo perché il browser di prova è in inglese; su un telefono italiano è gg/mm/aaaa.
- [ ] Pubblicazione e verifica online

Non ancora (prossimi passi): configuratore maglia nuovo, crea il tuo kit, servizi su prenotazione, noleggio sci, pannello admin.
