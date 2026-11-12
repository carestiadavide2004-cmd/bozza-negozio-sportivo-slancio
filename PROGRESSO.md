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
