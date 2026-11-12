# PROGRESSO – Slancio (demo negozio sportivo)

## Stato
- [x] Fase 1 – Direzione artistica (DESIGN.md, piano immagini, strumenti verificati)
- [x] Fase 2 – Blocco A: base comune (config.js, build.mjs, css, js, font, logo, favicon, og.jpg)
- [x] Fase 2 – Blocco B: home (video hero, tessere, perché, configuratore maglia, marchi, negozio, modulo, FAQ)
- [x] Fase 2 – Blocco C: pagina sport di prova (calcio) – controllata a 390 e 1440
- [x] Fase 2 – Blocco D: altre 11 pagine sport, privacy, 404 (stesso modello, generate da build.mjs)
- [ ] Fase 3 – Revisione art director (12+ difetti, 2 giri)
- [ ] Fase 4 – Controllo veloce e pubblicazione

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

## Difetti Fase 3
(da compilare)
