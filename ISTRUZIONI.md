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

## Aggiungere prodotti veri

In ogni categoria c'è `prodotti: []`. Esempio:

```js
prodotti: [
  { nome: 'Scarpa da calcio FG', marchio: 'Marca', prezzo: 89.9,
    immagine: 'assets/img/prodotti/scarpa-fg.webp', disponibilita: 'disponibile' }
]
```

- `disponibilita`: `'disponibile'`, `'su ordinazione'` oppure `'esaurito'`.
- La foto va in `assets/img/prodotti/`, in WebP quadrato da 480px.
- Il prezzo si vede solo se `catalogo.mostraPrezzi` è `true`.
- Se una categoria ha prodotti, la pagina mostra la griglia sotto la scheda.

## Foto

- Le originali stanno in `_sorgenti/foto/` (non pubblicate). L'elenco nome → id Pexels è in `_sorgenti/scelte.txt`.
- `node _sorgenti/prepara-foto.mjs` rigenera tutti i WebP (servono `ffmpeg` e `cwebp`).
- Se una categoria non ha foto (`foto: null`) si vede un disegno con l'icona.

## Pubblicazione

GitHub Pages dal ramo `main`, cartella principale. Tutti i link sono relativi, quindi il sito funziona anche in una sottocartella.

## Privacy

`privacy.html` si genera da `modelli/privacy-modello.html` (copia locale del modello in "SITI REALI/_MODELLI/modello privacy", non pubblicata) con i dati di `config.js`.
Il sito non usa cookie, né Google Fonts, né statistiche. La mappa Google si carica solo dopo il clic.
