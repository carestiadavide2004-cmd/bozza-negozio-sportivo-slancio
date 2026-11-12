# SLANCIO – Direzione artistica

## Concetto visivo (3 righe)
Un tabellone sportivo stampato su carta gesso: cifre condensate giganti, numeri di maglia 01–12, linee di campo tracciate a mano libera ma geometriche.
Tutto pende leggermente in avanti (il corsivo del marchio, le barre del logo, i tagli a 8°): è lo "slancio" che dà il nome.
Ordine da grande brand sportivo: molto bianco caldo, nero inchiostro pieno, un solo blu cobalto elettrico; ogni sport porta il suo colore solo nei dettagli.

## Palette (contrasti WCAG calcolati con script, AA = 4.5:1 testo normale)
| Token | Hex | Ruolo | Contrasto |
|---|---|---|---|
| `--c-gesso` | #F4F2ED | sfondo principale caldo | inchiostro sopra 17.1:1 |
| `--c-carta` | #FBFAF7 | card, campi modulo | inchiostro sopra 18.4:1 |
| `--c-ink` | #0E0F12 | testo, sezioni scure, barra mobile | gesso sopra 17.1:1 |
| `--c-asfalto-900` | #17191D | superfici scure secondarie (footer, menu) | bianco sopra 17.6:1 |
| `--c-asfalto-700` | #2B2F36 | testo secondario forte, bordi su scuro | su gesso 12.0:1 |
| `--c-asfalto-500` | #5C626C | testo secondario, didascalie su chiaro | su gesso 5.5:1 ✔ AA |
| `--c-asfalto-300` | #A3A7AE | testo secondario SOLO su scuro | su inchiostro 7.9:1 ✔ AA |
| `--c-linea` | #DDD9D0 | filetti, bordi card, griglie | decorativo |
| `--c-cobalto` | #1E46F0 | accento globale: pulsante primario, link, focus | bianco sopra 6.6:1, su gesso 5.9:1 ✔ AA |
| `--c-cobalto-chiaro` | #6E8BFF | link e dettagli su sfondo scuro | su inchiostro 6.2:1 ✔ AA |

WhatsApp: si usa il cobalto (il pulsante più luminoso della barra mobile è cobalto pieno). Niente verde neon in tutto il sito.

### Colori accento per sport (solo dettagli: etichette, linee, numeri, pulsanti della propria pagina)
Testo sopra il colore: inchiostro (≥4.5:1) tranne pugilato (bianco 4.6:1). Mai usati come colore del testo su sfondo chiaro (contrasto insufficiente): su chiaro diventano filetto, punto o riempimento.
| N. | Sport | Hex | Testo sopra | Contrasto |
|---|---|---|---|---|
| 01 | Calcio | #22A45D | inchiostro | 5.97 |
| 02 | Calcetto | #14B8C8 | inchiostro | 7.96 |
| 03 | Basket | #F47B20 | inchiostro | 7.03 |
| 04 | Pallavolo | #FFC21A | inchiostro | 11.85 |
| 05 | Tennis | #C65B3A | inchiostro | 4.53 |
| 06 | Padel | #8C6CF7 | inchiostro | 5.11 |
| 07 | Pugilato e combattimento | #E0283E | bianco | 4.62 |
| 08 | Sci e snowboard | #9ED0F5 | inchiostro | 11.68 |
| 09 | Nuoto | #1F9BDB | inchiostro | 6.18 |
| 10 | Running | #FF6B4A | inchiostro | 6.80 |
| 11 | Fitness e palestra | #B9C0CC | inchiostro | 10.47 |
| 12 | Ciclismo | #F45BA4 | inchiostro | 6.28 |

## Tipografia (2 famiglie, 4 file woff2 in fonts/, licenza SIL OFL, da Fontsource)
- Titoli: **Barlow Condensed 800** normale + **800 corsivo** (parole chiave, marchio). Sempre MAIUSCOLO, interlinea 0.88–0.95, spaziatura lettere -0.01em. Hero: clamp(3.4rem, 11vw, 10rem).
- Testo: **Barlow 400 e 600**. Base 17px (1.0625rem), interlinea 1.55, righe max 62 caratteri.
- Numeri: `font-variant-numeric: tabular-nums` su orari, contatori, numeri sport.
- Etichette: Barlow 600, 0.75rem, maiuscolo, spaziatura +0.14em.
- `font-display: swap`, preload solo di Barlow Condensed 800 e Barlow 400.

## Motivi grafici
- **Numeri maglia**: ogni sport è 01–12; il numero compare grande in corsivo sulle tessere e sugli hero.
- **Cifre da tabellone**: orari, contatori e badge Aperto/Chiuso in cifre tabulari dentro caselle rettangolari.
- **Linee di campo SVG** (originali, geometriche, tratto 1.5px, senza riempimenti), una per sport: campo da calcio, calcetto (più corto, area semicircolare), basket (lunetta + area), pallavolo (rete + linea dei 3 m), tennis (corridoi doppio), padel (box con linee di servizio e pareti), ring (quadrato + corde), pista di sci (porte da slalom su pendio), corsie piscina, pista di atletica (curve), fitness (manubrio stilizzato), ciclismo (due ruote + telaio). Si rivelano con clip-path, mai con stroke-dashoffset.
- **Taglio a 8°**: barre del logo, bordo inferiore degli hero sport, sottolineature.
- **Parole giganti in trasparenza** (contorno 1px, 6% di opacità) dietro alle sezioni.

## Spaziature, angoli, ombre, griglia
- Scala spazi (rem): 0.25 · 0.5 · 0.75 · 1 · 1.5 · 2 · 3 · 4 · 6 · 8. Sezioni: clamp(4rem, 10vw, 8rem) verticale.
- Margine laterale: 16px telefono, 24px tablet, clamp fino a 48px; contenitore max 1320px.
- Griglia 12 colonne su computer, 4 colonne su telefono; gutter 16 → 24px.
- Angoli: 2px (pulsanti, chip, campi), 4px (card e foto). Niente angoli grandi: è un tabellone, non un'app.
- Ombre: quasi nulle. Una sola ombra per card sollevate all'hover: `0 18px 40px -24px rgba(14,15,18,.45)`.

## Componenti
- **Pulsante primario**: cobalto pieno, testo bianco 600 maiuscolo spaziato, altezza 52px, angolo 2px, freccia →. Hover: sfondo inchiostro. Tocco: scale(0.97).
- **Pulsante secondario**: contorno 1.5px inchiostro (o gesso su scuro), stesso formato.
- **Pulsante sport**: riempimento colore sport + testo come da tabella.
- **Card categoria**: foto 4:3 in alto, numero categoria (01, 02…) a sinistra del titolo, descrizione 2 righe, chip tipologie, pulsante "Chiedi disponibilità". Bordo 1px linea, sfondo carta.
- **Etichetta (chip)**: bordo 1px, 0.8125rem, altezza 30px, angolo 2px, puntino colore sport.
- **Accordion**: `<button aria-expanded>` con + che ruota a ×, filetto in basso, apertura con grid-template-rows (contenuto) + opacity.
- **Barra filtri categorie**: appiccicata sotto l'header, chip in riga con scorrimento orizzontale nativo sul telefono; chip attiva = riempimento colore sport.
- **Badge orario**: casella stile tabellone, puntino verde-scuro/rosso animato solo se movimento consentito.

## Movimento (GSAP + ScrollTrigger da cdnjs)
- Solo transform, opacity, clip-path. Ingressi 0.7–1.1 s, ease `expo.out` / `power3.out`. Niente rimbalzi.
- Titoli: maschera riga per riga (yPercent 110 → 0). Foto: clip-path inset dal basso + zoom 1.12 → 1. Tessere a cascata (stagger 0.06).
- Parallax hero max 40px; parole giganti con scrub lento. Niente pin sul telefono, mai scroll-jacking, niente smooth-scroll.
- Ricalcolo solo quando cambia la larghezza (tastiera iPhone esclusa).
- `prefers-reduced-motion`: tutto visibile subito, fasce scorrevoli ferme, video sostituito dal poster, View Transitions spente.

## Direzione foto
- Azione reale, luce naturale o di impianto, colori pieni ma non saturi, grana pulita, nessun logo o scritta di marchio leggibile, nessun atleta famoso.
- Correzione uniforme: contrasto +6%, saturazione -6%, leggero tono caldo nelle luci. Mai blur.
- Hero 16:9 (sorgente ≥2400px), tessere 3:4 verticali, categorie 4:3.
- Se manca una foto davvero bella: icona SVG pulita su campo colore sport (mai foto mediocri).

## Fare / evitare
- FARE: molto spazio, titoli enormi, numeri come elementi grafici, un solo accento per schermata, foto grandi e nitide.
- EVITARE: verde neon, gradienti viola/blu, glassmorphism, ombre pesanti, angoli tondi grandi, emoji, testi tipo "qualità e passione", loghi di marchi, ®/™, prezzi inventati, promesse di risultati o salute.
