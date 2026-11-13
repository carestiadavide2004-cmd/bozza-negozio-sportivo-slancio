# PROGRESSO – Slancio (demo negozio sportivo)

# ▶ LAVORO IN CORSO – Home: 4 modifiche (13/11/2026)
Per ripartire: leggi questa checklist e riprendi dalla prima voce non spuntata. Un commit per ogni modifica.

- [x] 1. Frase dell'hero: "Tutto lo sport, in un solo negozio." + sottotitolo nuovo (config.js `home.heroTitolo`, `home.heroSottotitolo`)
  - La frase vecchia era anche nel motto del footer di tutte le pagine e nei dati per Google (`attivita.payoff` → frase nuova) e in og.jpg (rifatta con la frase nuova). Title, og:title e og:description non la contenevano. Nessuna traccia nel PDF del kit e nei testi.
  - 3 righe a 360, 390, 768, 1024, 1440 e 1920 px. Da 768 px il titolo è largo almeno 6,3em (la prima riga sta intera) e un po' più piccolo (6,3vw); le foto degli altri sport partono al 33% invece del 30%: controllate le 12 diapositive, il titolo non tocca più i soggetti (pallavolo e basket erano al limite).
- [x] 2. Ordine delle sezioni: subito sotto l'hero "Scegli il tuo sport", poi il kit
  - Prima: hero → nastro sport → Il tuo kit prende forma → Scegli il tuo sport → Perché Slancio → Disegna la tua maglia → Crea il kit della squadra → Servizi e noleggio → Marchi → Il negozio → Chiedi.
  - Ora: hero → nastro con i nomi degli sport → **Scegli il tuo sport** → Il tuo kit prende forma → Disegna la tua maglia → Crea il kit della squadra → Marchi (dopo il kit, dove si sceglie la marca) → Servizi e noleggio → Perché Slancio → Il negozio → Chiedi.
  - Perché Slancio va prima del negozio: "Ti ascoltiamo, poi consigliamo" → "Vieni a provare" → "Dicci cosa cerchi". Le ancore (#sport, #perche, #maglia, #negozio, #chiedi) usano l'id, quindi menu e pulsanti funzionano. Animazione del kit provata nella nuova posizione (forma.mjs 390 e 1440: ok, nessun errore).
- [x] 3. Foto di sfondo al posto dei fondi blu e neri
  - Fatto: build.mjs `sfondo()` (foto decorativa + velo scuro, `<picture>` con ritaglio 9:16 per il telefono, srcset 960–2400, lazy), CSS `.sfondo`, parallax in main.js (`[data-sfondo]`, ±5%, solo transform, spento con "riduci movimento"). Tolti il pannello blu inclinato del kit, le celle blu dei passi e la parola "LAB". Servizi: la card del noleggio è diventata la fascia a sé; le 4 card dei servizi salgono sopra la foto.
  - Foto: `_sorgenti/prepara-sfondi.mjs` (originali in `_sorgenti/foto-nuove`, non pubblicati). Marchi coperti: loghi sulle maglie e la scritta sulla racchetta con delogo; i loghi bianchi su scarpe e pantaloncini neri scuriti solo nei pixel chiari e senza colore (niente macchie sull'erba). CREDITI.md aggiornato.
  - Leggibilità: veli da 0,5 a 0,92 dove sta il testo (testo bianco, AA anche sul punto più chiaro della foto); 390 e 1440 controllati, anche con "riduci movimento".
  - Sezioni della home con fondo decorativo blu/nero o da trasformare (elenco fatto prima di cambiarle):
    1. "Crea il kit della squadra" (Squadre e associazioni, `.fascia-sq`): fondo nero + pannello blu cobalto inclinato → foto di una squadra con le maglie blu sul campo (Pexels 262524).
    2. "Il tuo kit prende forma" (la sezione "Crea il tuo kit" con l'animazione, `#kit-forma`): fondo chiaro, ma è la sezione kit richiesta → foto di una squadra giovanile abbracciata in cerchio con le divise a strisce (Pexels 38116595). Animazioni invariate.
    3. "Servizi e noleggio" (`.fascia-srv`): parola gigante "LAB" in trasparenza e card scure → fascia alta con foto del laboratorio di incordatura (Pexels 38083829), card dei 4 servizi sopra.
    4. Noleggio (era la card 05 dentro i servizi) → fascia a sé con foto di piste innevate (Pexels 30114126). Stessa fascia anche nella pagina Sci e snowboard, che aveva lo stesso fondo nero.
    5. Mappa "Il negozio": disegno blu su nero → voce 4 (immagine satellitare).
    - Non cambiata: "Perché Slancio" (`#perche`): fondo nero pieno, non è una sezione promozionale; tiene il ritmo scuro della pagina. Nastro con i nomi degli sport: striscia nera sottile, non è uno sfondo.
- [x] 4. Mappa: immagine satellitare salvata nel sito
  - Screenshot riuscito con Playwright (`~/.carestia-qa/slancio/mappa.mjs`): Google Maps vista satellite, zoom 18, centro 42.47225, 14.20915 (Piazza della Rinascita / Corso Umberto), cookie rifiutati, pannelli nascosti, 1600×1000 in doppia densità. Salvata come `assets/img/mappa-satellite-800.webp` e `-1600.webp`.
  - build.mjs `mappaImmagine()`: tutto il riquadro è un link a Google Maps (nuova scheda, `contatti.mappaRicerca`), segnaposto blu con "SLANCIO" disegnato da noi al centro, etichetta "Posizione di esempio", scritta "Immagine © Google". Se il file manca compare un riquadro con il nome del file da aggiungere. Dati in `config.js` → `contatti.mappaImmagine`.
  - Tolti: disegno blu a righe, pulsante "Mostra la mappa", iframe e il suo codice in main.js. Nessuna richiesta a Google all'apertura.
  - privacy.html: Google riceve dati solo se si apre il link. ISTRUZIONI.md: "Mappa del negozio" (come rifarla sulla posizione vera).
- [ ] Controllo (art director 390/768/1440, Playwright 390/1440), build, commit, push, verifica online

# ✔ Kit squadra completo (Fasi 0–8, 13/11/2026)
Per ripartire: leggi questa checklist, poi la prima fase non spuntata. Ogni fase si controlla (schermate 390/1440 + prova automatica) prima di spuntarla.

## Checklist
- [x] Fase 0 – Verifica modifiche precedenti (hero loop, menu Noleggio/Kit Squadra, card servizi)
  - Hero loop, menu e card della pagina Servizi c'erano già. Mancava la fascia "Servizi e noleggio" della home (era solo testo): ora 5 card con foto come le tessere sport (4 servizi + noleggio), carosello sul telefono; il link apre servizi/index.html#srv-ID con il servizio già scelto.
  - js/listino.js creato (serve già alla fascia): i prezzi del noleggio ora stanno lì, non più in config.js.
- [x] Fase 1 – Configuratore kit a 8 passi + js/listino.js (prezzi) + totale stimato sempre visibile + salvataggio nel browser
  - squadre/index.html rifatta (build.mjs `paginaSquadre`), js/kit.js riscritto. config.js `kit`: tolti pacchetti/sport vecchi, aggiunti capi consigliati per sport, colori, stili, disegni, colli, condizioni, banner, ordine DEMO-001.
  - Totale stimato: colonna a destra da 1100 px, barra in basso sul telefono (figlia del body, nasconde la barra Chiama/WhatsApp mentre il configuratore è in vista).
  - Prova automatica `~/.carestia-qa/slancio/kitflow.mjs` (390 e 1440): errori sotto i campi, ripresa dopo ricarica, stemma → palette, sponsor con posizione, rosa incollata, numeri doppi, guida taglie, proposte, preventivo, link, PDF, pagamento demo. Tutto OK, nessun errore in console.
- [x] Fase 2 – Anteprima maglia SVG riutilizzabile (fronte/retro, rotazione, "Gira", pantaloncino e calzettoni) + 6 proposte automatiche
  - js/maglia-svg.js (`window.MagliaSVG`): svg(), pantaloncino(), calzettoni(), componente() con trascinamento e "Gira", png() per il PDF. Pagina di prova `_prove/maglia-svg.html` (non pubblicata).
- [x] Fase 3 – Preventivo: riepilogo prezzi, consegna, link condiviso, WhatsApp, PDF, pagamento DEMO, conferma ordine, condizioni
  - jsPDF 2.5.1 in assets/js/vendor (licenza MIT accanto), caricato solo al clic. Ordine salvato con DATI.ordini.salva (chiave slancio-dati).
  - Il link "Stato del tuo ordine" punta a ordine/index.html?n=… (pagina della Fase 6).
- [x] Fase 4 – Home: sezione a scorrimento "Il tuo kit prende forma" (dopo la hero)
  - build.mjs `fasciaForma()` (dopo il nastro marchi): le 7 maglie SVG sono scritte già nella pagina (MagliaSVG eseguito in fase di build), testi in config.js `kit.forma`. js/forma.js: scena sticky + ScrollTrigger scrub (niente pin), solo transform/opacity.
  - Riduci movimento / senza JS: 6 maglie ferme in fila (carosello sul telefono, griglia 3×2 da 700 px). Prova `~/.carestia-qa/slancio/forma.mjs`.
- [x] Fase 5 – Guida taglie interattiva (altezza, peso, vestibilità) dal passo Rosa e dal footer, "Usa questa taglia"
  - Nuova scheda "Divise squadra" (prima scheda) in main.js; dati da listino.js. Il footer apre la guida su questa scheda. `S.apriGuida(tab, da, { usa })`.
- [x] Fase 6 – Pagina "Stato del tuo ordine" (linea del tempo, DEMO-001)
  - build.mjs `paginaOrdine()` → ordine/index.html (anche nella sitemap quando il sito non è bozza). js/ordine.js: campo o `?n=`, fasi con date e note, fase attuale evidenziata, "Spedito" se la consegna è con spedizione, maglia fronte/retro, WhatsApp con il numero d'ordine. Si aggiorna da solo se l'admin cambia fase in un'altra scheda (DATI.ascolta).
- [x] Fase 7 – Calendario noleggio: giorni liberi/occupati dal pannello, prezzi da listino.js
  - js/prenota.js legge i giorni occupati da DATI.noleggio (partenza: config.js `noleggio.occupatiEsempio`, MM-GG). "Esaurito" → "Occupato". La simulazione dei pezzi resta solo per "Pochi pezzi". Si aggiorna da solo se l'admin cambia un giorno. Prova `~/.carestia-qa/slancio/nolcal.mjs`.
- [x] Fase 8 – admin.html DEMO (password, banner "Ordina entro…", ordini, noleggio) + banner sul sito
  - build.mjs `paginaAdmin()` → admin.html (pagina a sé, sempre noindex, fuori da menu e sitemap) + js/admin.js. Password demo: **slancio-demo** (in dati.js c'è solo l'impronta SHA-256; sessione in sessionStorage).
  - Schede: Ordini (cerca, filtro fase, dettaglio con maglia, contatti, capi, rosa, cambio fase con nota, link alla pagina cliente), Banner (acceso/spento, date, data limite, testo con {data}, anteprima e stato), Noleggio (calendario per articolo, tocca = occupato/libero, ripristina esempio).
  - Banner sul sito (main.js): conto alla rovescia, link a squadre/index.html#kit, X che lo ricorda finché non cambiano testo o data. Telefono: striscia sopra la barra in basso; computer: riquadro in basso a sinistra; compare solo dopo la prima schermata. In Kit Squadra sta dentro la pagina.
  - Prova `~/.carestia-qa/slancio/admin.mjs` (390 e 1440): 34 controlli OK, nessun errore.
- [x] Controllo finale (percorso completo del presidente, 390/768/1440, console, link) + privacy + istruzioni + pubblicazione
  - kitflow.mjs (390 e 1440): percorso del presidente dal passo 1 al pagamento demo, poi l'admin cambia la fase di quell'ordine e la pagina "Stato del tuo ordine" si aggiorna. 47/45 controlli OK, nessun errore, nessun alert.
  - admin.mjs (34 controlli), nolcal.mjs (11), forma.mjs: tutto OK. finale-kit.mjs: 8 pagine a 390/768/1440 senza errori né scorrimento laterale, richieste esterne solo cdnjs (GSAP), 0 cookie, 18 link di menu e footer → 200. Il vecchio finale.mjs (26 pagine) è OK dopo aver aggiornato 2 righe del test (la guida dal footer ora apre "Divise squadra").
  - Privacy: ordine del kit, rosa con minori, link condiviso con la rosa, PDF locale, pagamento simulato, nomi della memoria del browser, pannello. Data aggiornata al 13/11/2026.
  - ISTRUZIONI.md (Kit Squadra, home, stato ordine, pannello admin, passaggio a Firebase, noleggio) e CREDITI.md (jsPDF MIT, GSAP).
  - CSS: tolte 40 righe del vecchio configuratore non più usate (copia in scratchpad prima di toglierle).
  - Pubblicato (commit b9c9e1d, 13/11/2026). Online: ordine/index.html, admin.html e i nuovi file JS rispondono 200. Prova sul sito pubblicato a 390 px: sezione della home animata, banner presente, DEMO-001 "In produzione", accesso admin riuscito, nessun errore.

## Scelte di progetto (per chi riprende)
- File nuovi: `js/listino.js` (prezzi, marche, materiali, sconti, spedizione, acconto, tempi, taglie, prezzi noleggio), `js/dati.js` (UNICO file che legge e scrive: oggi localStorage, domani Firebase), `js/maglia-svg.js` (anteprima maglia riutilizzabile), `js/forma.js` (sezione a scorrimento), `js/ordine.js` + `ordine/index.html`, `js/admin.js` + `admin.html`, `assets/js/vendor/jspdf.umd.min.js` (PDF, caricato solo al clic).
- `js/kit.js` riscritto (8 passi). Stato nel browser: chiave `slancio-kit2` (+ `slancio-kit2-img` per le miniature delle grafiche).
- Ordini demo, banner e giorni occupati del noleggio: chiave `slancio-dati` (gestita solo da dati.js). DEMO-001 sempre presente.
- La maglia 3D "Disegna la maglia" resta in home; "Usala nel kit squadra" porta colori, disegno, stemma e nome/numero nel nuovo configuratore.

## Note di avanzamento
(si aggiornano a ogni fase)

---

# STORICO

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
- [x] Pubblicazione e verifica online (13/11/2026): 200 per sport/calcio/index.html, sport/calcio/scarpe-da-calcio/index.html, il modello .glb e model-viewer.
  - Peso online sul telefono (compresso da GitHub): Calcio 0,56 MB all'apertura, 0,71 MB scorrendo tutta la pagina; Scarpe da calcio 0,46 MB.
  - Non fatto: un solo modello 3D (nessun secondo modello CC0 adatto); il 3D non si vede aprendo i file dal Mac (il browser blocca il .glb); configuratore maglia, crea il tuo kit, servizi su prenotazione, noleggio sci e pannello admin rimandati come richiesto.

Non ancora (prossimi passi): pannello admin.

## Maglia 3D e Crea il tuo kit (in corso – 13/11/2026)
- [x] Modello 3D: nessun modello di maglia CC0 trovato (Poly Haven e ricerca web) → modello ORIGINALE generato da `_strumenti/maglia3d.mjs` (busto, maniche e colletto aperti, interno visibile, pieghe, trama del tessuto in normal map, UV per fronte/retro/maniche/colletto) → `assets/3d/maglia.glb` (967 KB). Nessuna licenza esterna.
- [x] Font Graduate (SIL OFL) in fonts/ con licenza `graduate-OFL.txt`: lettere accentate, apostrofo, + controllati.
- [x] 6 squadre inventate (Maestrale Sporting, Atletico Corallo, Polisportiva Vortice, Quarzo Atletica, Libeccio United, Sciame Arancio): ricerca veloce, nessuna squadra italiana reale con questi nomi. Stemmi SVG geometrici in config.
- [x] config.js: `maglia` (motivi, 14 colori, squadre) e `kit` (8 sport × Base/Completo/Pro, personalizzazioni, sconti quantità da 15 e 25 atleti). Tolto `home.maglia` vecchio.
- [x] js/maglia.js: texture canvas 2048, 6 motivi, 3 colori, stemma squadra o caricato (PNG/JPG/SVG ≤ 2 MB, resta nel browser), nome ≤ 14 e numero ≤ 5 che si rimpiccioliscono, model-viewer caricato vicino alla sezione, Fronte/Retro, 2,5D di riserva (senza WebGL, errore o file://), link WhatsApp, "Usala nel kit squadra".
- [x] js/kit.js + pagina squadre/index.html (4 passi, barra, localStorage, preventivo indicativo, codice KIT-XXXX, invio whatsapp/web3forms). Fascia in home, link in menu e footer. main.js espone gli strumenti comuni (window.SLANCIO).
- [x] Prime schermate 390/1440: il 3D si carica e mostra D'ANGELO e 1+8 sul retro.
- [x] Anteprima `assets/img/maglia-anteprima-480/960.webp` (10 e 22 KB) dalla schermata del 3D a 3/4.
- [x] privacy.html: richiesta "Crea il tuo kit" (dati del referente, niente dati dei singoli atleti), preventivo maglia via WhatsApp, maglia/kit/stemma salvati solo nel browser, stemma mai inviato. CREDITI.md (modello originale, font Graduate, squadre inventate) e ISTRUZIONI.md aggiornati.

### Revisione art director (schermate 390 / 768 / 1440: configuratore fronte e retro con D'Angelo e 1+8, pagina squadre a ogni passo, fascia in home)
1. [x] 3D: nome e numero troppo grandi, il nome finiva sulle curve dei fianchi → più piccoli e centrati, spaziatura lettere ridotta.
2. [x] 3D: la maglia toccava i pulsanti Fronte/Retro → camera più lontana e abbassata.
3. [x] Telefono: Fronte/Retro coprivano l'orlo → spostati in alto a sinistra, più compatti.
4. [x] Anteprima mancante (404) → creata dal 3D.
5. [x] 2,5D: spalle strette, maniche corte e un triangolo chiaro sulla spalla → sagoma più larga, maniche più lunghe e piene.
6. [x] 2,5D sul telefono: maglia sotto i pulsanti → abbassata e adattata all'altezza del riquadro.
7. [x] "Senza stemma" troppo grande rispetto al resto → testo più piccolo.
8. [x] Fascia in home (computer): la banda blu tagliava a metà etichette e prezzo → banda allargata, tutta la colonna destra sul blu.
9. [x] Riepilogo kit: "1459,77 €" senza punto delle migliaia → "1.459,77 €".
10. [x] Passo 3: l'errore "Scegli come vuoi la maglia" era sotto il link, lontano dalle scelte → subito sotto le due opzioni.
11. [x] Passo 1: numeri degli sport in ordine casuale (01, 02, 03, 04, 10, 12, 07) e ".." su "Altro sport" → tolti, restano filetto colore e linee di campo.
12. [x] Etichetta "Prezzi di esempio…" su due righe strette sul telefono → interlinea corretta.
13. [x] "Usala nel kit squadra" non selezionava la maglia nel kit (il segnale veniva scartato) → corretto.
- Secondo giro: rifatte le schermate di 2,5D, 3D sul telefono e fascia: ok. Conteggio pagine nel build: 80.

### Controllo veloce (Chromium, 390 e 1440, 45 s – ~/.carestia-qa/slancio/cfgcheck.mjs)
- 3D caricato; si aggiorna cambiando colore, motivo, nome e numero (4/4); nome "D'Angelo" e numero "1+8" sulla maglia e nel link WhatsApp ("1+8" codificato %2B); stemma caricato visibile; "Usala nel kit squadra" porta la maglia nel kit; kit in 4 passi con preventivo 3.190,05 € (20 adulti + 6 bambini, Basket Pro, nomi e numeri, −10%), codice KIT-XXXX, email sbagliata segnalata, link WhatsApp completo; 2,5D funziona senza WebGL; home, squadre e privacy senza errori, senza scorrimento laterale, richieste esterne solo cdnjs, 0 cookie.

- [x] A e B pubblicati (commit 0d14e0c): home, squadre/index.html e js/kit.js rispondono 200 online.

## Blocco C – Servizi su prenotazione e Noleggio sci (13/11/2026)

- [x] Dati in `config.js` → `servizi` (4 servizi con descrizione, durata, prezzo di esempio) e `noleggio` (stagione 1/12–15/4, 6 attrezzature con prezzo al giorno e pezzi, ritiro 15:30–19:30 il pomeriggio prima, riconsegna entro le 19:30, prenotazioni di esempio, periodi di punta).
- [x] `servizi/index.html`: schede (carosello sul telefono), modulo con servizio, giorno (rifiuta passati, chiusure, festivi, oltre 21 giorni), fascia mattina/pomeriggio presa dagli orari di quel giorno, nome, telefono, note. Codice SRV-XXXX, invio secondo config, "La prenotazione è confermata quando il negozio ti risponde."
- [x] `noleggio-sci/index.html`: attrezzatura, calendario della disponibilità (Disponibile / Pochi pezzi / Esaurito, "Disponibilità di esempio"), date dal–al anche toccando il calendario, persone (cosa noleggia, adulto/bambino, altezza, scarpa, livello, casco facoltativo; niente peso), blocco se un tipo è esaurito in un giorno scelto con proposta del giorno/periodo libero più vicino, ritiro e riconsegna calcolati sugli orari, riepilogo con totale di esempio e codice NOL-XXXX.
- [x] Fasce: "Servizi e noleggio" in home, "Noleggio sci e snowboard" nella pagina Sci e snowboard. Link in menu (Servizi), menu telefono e footer. Sitemap.
- [x] privacy.html (dati di servizi e noleggio; altezza, scarpa e livello solo per preparare l'attrezzatura) e ISTRUZIONI.md (Agendo per il cliente vero; disponibilità vera = database Firebase + pannello negozio).

### Revisione art director (390 / 768 / 1440)
1. [x] Noleggio: il menu "Cosa noleggia" finiva fuori dal riquadro della persona (scorrimento laterale sul telefono) → titolo persona e campi sistemati.
2. [x] Modulo servizi a 1440: titolo "Prenota il servizio" su tre righe enormi → titolo più contenuto.
3. [x] Errore "Scegli mattina o pomeriggio" mostrato anche senza giorno → ora basta l'errore sul giorno.
4. [x] Telefono: le 4 schede servizi una sotto l'altra allungavano troppo la pagina → carosello.
5. [x] "Prezzo di esempio" andava a capo in ogni scheda → "Prezzo" (l'etichetta "Prezzi e durate di esempio" è sopra).
6. [x] Fascia home: "Da 5,00 € al giorno" era il prezzo del casco → "Kit da 15,00 € al giorno".
7. [x] Hero noleggio: frase "…primo giorno di apertura dopo" troncata → "Riconsegna entro le 19:30 del primo giorno di apertura dopo l'ultimo".
8. [x] Noleggio: titolo e "1 · I giorni" attaccati → più spazio.
9. [x] Persone sul telefono: altezza e scarpa uno sotto l'altro e livello su due righe → affiancati, tre pulsanti in riga.
10. [x] Parola di sfondo della hero fissa "KIT" anche su servizi e noleggio → ora "SERVIZI" e "NEVE".
- Secondo giro di schermate: ok.
- Extra trovati nei controlli: avviso in console quando il browser salta la dissolvenza tra pagine (ora gestito in main.js); maglia 3D senza limite di attesa (ora dopo 25 s passa alla 2,5D).

### Controllo veloce C (Chromium, 390 e 1440, 19 s – ~/.carestia-qa/slancio/ccheck.mjs)
- Servizi: data passata, domenica e oltre 21 giorni rifiutati; 8 e 25 dicembre chiusi; lunedì solo pomeriggio; codice SRV-XXXX; WhatsApp con servizio, giorno, fascia, nome, telefono, note.
- Noleggio: data passata e fuori stagione rifiutate; giorno esaurito (6/12, kit sci adulto) bloccato con proposta del giorno libero più vicino (5/12) e pulsante che lo applica; codice NOL-XXXX; totale 30,00 €; WhatsApp con persone, misure, livello, ritiro e riconsegna; niente peso.
- 5 pagine senza errori in console e senza scorrimento laterale; richieste esterne solo cdnjs; 0 cookie. Controllo A+B rifatto: tutto ok (49 s).

## Blocco D – hero, menu, kit, servizi (13/11/2026)
1. [x] Hero: video del calcio + giro degli altri 11 sport (6,2 s ciascuno, dissolvenza 1,2 s), etichetta numero/nome/link in sincronia, barra di avanzamento, pulsante pausa. Foto con zoom lento; solo diapositiva attuale e successiva caricate; pausa con scheda nascosta o hero fuori schermo; movimento ridotto = foto fissa.
2. [x] Menu: "Noleggio" accanto a Servizi (computer e telefono); "Kit Squadra"; pulsante "Crea il kit squadra".
3. [x] Kit passo 3: area "trascina o clicca" (PNG/JPG/SVG/PDF, max 10 MB, più file), anteprima, nome, peso, elimina, posizione per file; "Scegli in negozio" come alternativa; riepilogo "I file verranno inviati con la richiesta".
4. [x] Kit passo 2: per ogni capo prima il tipo, poi il materiale (icona + una riga); "Prezzo su preventivo" dove serve; scelte nel riepilogo e in WhatsApp.
5. [x] Servizi: card con foto di sfondo, sfumatura, numero, icona, testo e "Scopri di più e prenota", stesso stile delle card sport.
- Difetti corretti nel controllo: titolo hero sopra i soggetti delle foto (foto spostate dopo il testo con sfumatura); riepilogo "rappresentan-za" spezzato; menu a 1024 px su due righe e logo schiacciato; avviso GSAP sulle card servizi (senza linee di campo).

### Controllo veloce D (Chromium, 390/768/1440, 60 s – ~/.carestia-qa/slancio/hcheck.mjs)
- Tutto ok: cambio sport e link, 3 foto su 12 caricate, un solo video della misura giusta, pausa, link del menu, file accettati/scartati, posizioni obbligatorie, riepilogo e WhatsApp, card servizi, nessuno scorrimento laterale, nessun errore in console, solo cdnjs, 0 cookie. A+B e C rifatti: ok.
