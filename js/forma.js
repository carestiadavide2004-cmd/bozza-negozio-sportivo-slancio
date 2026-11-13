/* =====================================================================
   SLANCIO – forma.js · Home: "Il tuo kit prende forma"
   Sezione a scorrimento: la scena resta ferma (position: sticky, niente pin e
   niente scroll-jacking) e GSAP ScrollTrigger collega allo scorrimento:
   maglia neutra che entra e ruota → colori → disegno → stemma → sponsor →
   giro sul retro con nome e numero → bottone "Crea il kit squadra".
   Solo transform e opacity. Con "riduci movimento" (o senza GSAP) restano
   le 6 immagini ferme in fila, già scritte nella pagina da build.mjs.
   ===================================================================== */
(function () {
  'use strict';
  var sez = document.querySelector('[data-forma]');
  if (!sez || !window.gsap || !window.ScrollTrigger) return;
  var gsap = window.gsap;
  var $$ = function (s) { return Array.prototype.slice.call(sez.querySelectorAll(s)); };
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
    sez.classList.add('is-anim');
    var pista = sez.querySelector('.forma__pista'), maglia = sez.querySelector('[data-forma-maglia]'), scena = sez.querySelector('[data-forma-scena]');
    var cta = sez.querySelector('[data-forma-cta]'), passi = $$('.forma__passo'), L = $$('.forma__l');
    var strato = function (n) { return L.filter(function (l) { return l.getAttribute('data-l') === String(n); })[0]; };
    var ora = 0;
    function attiva(t) {
      // un passo per ogni "tempo" della timeline; dal 5 in poi è il retro (nome e numero)
      var i = Math.max(0, Math.min(passi.length - 1, Math.floor(t)));
      if (i === ora) return;
      passi[ora].classList.remove('is-on'); passi[i].classList.add('is-on'); ora = i;
    }
    gsap.set([1, 2, 3, 4, 6].map(strato), { opacity: 0 });
    // 1) mentre la sezione arriva: la maglia neutra entra dal basso
    var entra = gsap.fromTo(maglia, { opacity: 0, y: 80 }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: pista, start: 'top 85%', end: 'top 15%', scrub: 0.6 } });
    // 2) a scena ferma: un passo per ogni unità di tempo
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: pista, start: 'top top', end: 'bottom bottom', scrub: 0.6,
        onUpdate: function (st) { attiva(st.progress * tl.duration()); }
      }
    });
    tl.fromTo(scena, { rotateY: -60 }, { rotateY: 0, duration: 0.9, ease: 'power2.out' }, 0)
      .to(strato(1), { opacity: 1, duration: 0.7 }, 1)
      .to(strato(2), { opacity: 1, duration: 0.7 }, 2)
      .to(strato(3), { opacity: 1, duration: 0.7 }, 3)
      .to(strato(4), { opacity: 1, duration: 0.7 }, 4)
      .to(scena, { rotateY: 180, duration: 1, ease: 'power1.inOut' }, 5)
      .to(strato(6), { opacity: 1, duration: 0.6 }, 5.9)
      .fromTo(cta, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 6.3)
      .to({}, { duration: 0.6 });
    return function () {
      sez.classList.remove('is-anim');
      entra.scrollTrigger && entra.scrollTrigger.kill();
      gsap.set([maglia, scena, cta].concat(L), { clearProps: 'all' });
      passi.forEach(function (p, i) { p.classList.toggle('is-on', !i); }); ora = 0;
    };
  });
})();
