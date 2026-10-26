// Progressivo, e só isso: destaca no sumário a seção que está na tela. Sem
// este script a página continua completa — o sumário é feito de âncoras HTML,
// que funcionam sozinhas.
(function () {
  var alvos = document.querySelectorAll('main.texto section[id]');
  var elos = {};
  document.querySelectorAll('.sumario a[href^="#"]').forEach(function (a) {
    elos[a.getAttribute('href').slice(1)] = a;
  });
  var sumario = document.getElementById('sumario');
  if (!sumario) return;

  // No celular o sumário nasce fechado para não empurrar o texto; no desktop
  // ele é uma coluna fixa e tem que estar sempre aberto.
  var largo = window.matchMedia('(min-width: 1000px)');
  function ajusta() { sumario.open = largo.matches; }
  ajusta();
  largo.addEventListener('change', ajusta);

  if (!alvos.length || !('IntersectionObserver' in window)) return;
  var visiveis = new Set();
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) visiveis.add(e.target.id);
      else visiveis.delete(e.target.id);
    });
    // A primeira da ordem do documento, não a última que entrou: rolar para
    // cima e para baixo tem que acender a mesma linha.
    var atual = null;
    alvos.forEach(function (s) { if (!atual && visiveis.has(s.id)) atual = s.id; });
    Object.keys(elos).forEach(function (id) {
      elos[id].classList.toggle('ativo', id === atual);
      if (id === atual) elos[id].setAttribute('aria-current', 'true');
      else elos[id].removeAttribute('aria-current');
    });
  }, { rootMargin: '-10% 0px -70% 0px', threshold: 0 });
  alvos.forEach(function (s) { observador.observe(s); });
})();
