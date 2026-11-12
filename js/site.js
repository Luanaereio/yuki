/* Yuki Design de Interiores: script unico das paginas, gerado por yuki-paginas.cjs */
(function () {
  document.documentElement.classList.add('js');
  // Canais de contato: preencher quando a cliente passar (WhatsApp com DDI e DDD, so numeros; Instagram so o usuario).
  var CONTATO = { whatsapp: '', email: '', instagram: '' };
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Aparecer ao rolar: cada .revela ganha .visto quando entra na tela (uma vez so)
  var revelas = Array.prototype.slice.call(document.querySelectorAll('.revela'));
  if (revelas.length) {
    if (semMovimento || !('IntersectionObserver' in window)) { revelas.forEach(function (el) { el.classList.add('visto'); }); }
    else {
      var obsRevela = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); obsRevela.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      revelas.forEach(function (el) { obsRevela.observe(el); });
    }
  }

  // Parallax leve: cada [data-paralaxe] recebe --s de -1 (abaixo da tela) a 1 (acima), e o CSS decide o que mexer
  var paralaxes = Array.prototype.slice.call(document.querySelectorAll('[data-paralaxe]'));
  if (paralaxes.length && !semMovimento) {
    var pedido = false;
    var medirParalaxe = function () {
      pedido = false;
      var alt = window.innerHeight;
      paralaxes.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -alt || r.top > 2 * alt) return;
        var s = ((r.top + r.height / 2) - alt / 2) / (alt / 2 + r.height / 2);
        el.style.setProperty('--s', Math.max(-1, Math.min(1, s)).toFixed(3));
      });
    };
    var agendarParalaxe = function () { if (!pedido) { pedido = true; requestAnimationFrame(medirParalaxe); } };
    window.addEventListener('scroll', agendarParalaxe, { passive: true });
    window.addEventListener('resize', agendarParalaxe);
    medirParalaxe();
  }

  // Fotos que seguem o mouse: [data-mouse] recebe --mx e --my de -1 a 1 (so com mouse de verdade)
  Array.prototype.forEach.call(document.querySelectorAll('[data-mouse]'), function (area) {
    if (semMovimento || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    area.addEventListener('mousemove', function (e) {
      var r = area.getBoundingClientRect();
      area.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      area.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    area.addEventListener('mouseleave', function () { area.style.setProperty('--mx', '0'); area.style.setProperty('--my', '0'); });
  });

  // Palavra que gira no titulo (.gira): a atual sobe e some, a proxima entra por baixo
  Array.prototype.forEach.call(document.querySelectorAll('.gira'), function (g) {
    var palavras = Array.prototype.slice.call(g.children);
    if (palavras.length < 2 || semMovimento) return;
    var k = Math.max(0, palavras.findIndex(function (p) { return p.classList.contains('ativa'); }));
    setInterval(function () {
      if (document.hidden) return;
      var sai = palavras[k];
      sai.classList.remove('ativa'); sai.classList.add('saiu');
      setTimeout(function () { sai.classList.remove('saiu'); }, 700);
      k = (k + 1) % palavras.length;
      palavras[k].classList.add('ativa');
    }, 2800);
  });

  // Vitrine de depoimentos: um por vez, troca sozinha a cada 7 s (para no mouse e fora da tela); setas, pontos e arraste
  var vitrine = document.querySelector('.vitrine-caixa');
  if (vitrine) {
    var figs = Array.prototype.slice.call(vitrine.querySelectorAll('.vitrine-slides figure'));
    var pontos = Array.prototype.slice.call(vitrine.querySelectorAll('.pontos button'));
    var kv = 0, timerV = null, DURV = 7000, naTela = true, pausado = false;
    vitrine.style.setProperty('--dur', DURV + 'ms');
    var irPara = function (i) {
      kv = (i + figs.length) % figs.length;
      figs.forEach(function (f, j) { f.classList.toggle('ativa', j === kv); });
      pontos.forEach(function (b, j) {
        b.classList.remove('enchendo');
        if (j === kv) { b.setAttribute('aria-current', 'true'); if (timerV) { void b.offsetWidth; b.classList.add('enchendo'); } }
        else b.removeAttribute('aria-current');
      });
    };
    var desligarV = function () { if (timerV) { clearInterval(timerV); timerV = null; } pontos.forEach(function (b) { b.classList.remove('enchendo'); }); };
    var ligarV = function () { if (semMovimento || timerV || !naTela || pausado || document.hidden) return; timerV = setInterval(function () { irPara(kv + 1); }, DURV); irPara(kv); };
    var reiniciarV = function (i) { desligarV(); irPara(i); ligarV(); };
    vitrine.querySelector('.ant').addEventListener('click', function () { reiniciarV(kv - 1); });
    vitrine.querySelector('.prox').addEventListener('click', function () { reiniciarV(kv + 1); });
    pontos.forEach(function (b, j) { b.addEventListener('click', function () { reiniciarV(j); }); });
    vitrine.addEventListener('mouseenter', function () { pausado = true; desligarV(); });
    vitrine.addEventListener('mouseleave', function () { pausado = false; ligarV(); });
    var xv = null;
    vitrine.addEventListener('touchstart', function (e) { xv = e.touches[0].clientX; }, { passive: true });
    vitrine.addEventListener('touchend', function (e) { if (xv === null) return; var dx = e.changedTouches[0].clientX - xv; xv = null; if (Math.abs(dx) > 40) reiniciarV(dx < 0 ? kv + 1 : kv - 1); }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { naTela = e.isIntersecting; if (naTela) ligarV(); else desligarV(); }); }, { threshold: 0.3 }).observe(vitrine);
    } else { ligarV(); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) desligarV(); else ligarV(); });
    irPara(0);
  }

  // Linha do tempo das etapas: a barra avanca conforme a secao atravessa a tela
  var linhas = Array.prototype.slice.call(document.querySelectorAll('.linha-do-tempo'));
  if (linhas.length && !semMovimento) {
    var medirLinha = function () {
      linhas.forEach(function (l) {
        var r = l.getBoundingClientRect(), alt = window.innerHeight;
        var p = (alt * 0.85 - r.top) / (r.height + alt * 0.35);
        l.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
      });
    };
    window.addEventListener('scroll', medirLinha, { passive: true });
    window.addEventListener('resize', medirLinha);
    medirLinha();
  }

  // Servicos: a foto fixa troca conforme o servico em foco (rolagem ou mouse)
  var quadro = document.querySelector('.quadro');
  var servicos = Array.prototype.slice.call(document.querySelectorAll('.servicos-editorial > li[data-servico]'));
  if (quadro && servicos.length) {
    var fotos = Array.prototype.slice.call(quadro.querySelectorAll('img[data-servico]'));
    var focar = function (k) {
      fotos.forEach(function (f) { f.classList.toggle('ativo', f.getAttribute('data-servico') === String(k)); });
      servicos.forEach(function (s) { s.classList.toggle('foco', s.getAttribute('data-servico') === String(k)); });
    };
    focar(0);
    servicos.forEach(function (s) { s.addEventListener('mouseenter', function () { focar(s.getAttribute('data-servico')); }); });
    if ('IntersectionObserver' in window) {
      var obsServ = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) focar(e.target.getAttribute('data-servico')); });
      }, { rootMargin: '-40% 0px -45% 0px', threshold: 0 });
      servicos.forEach(function (s) { obsServ.observe(s); });
    }
  }

  // Menu do celular
  var topo = document.getElementById('topo');
  var botao = topo ? topo.querySelector('.abrir-menu') : null;
  var menu = document.getElementById('menu');
  if (topo && botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = topo.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.setAttribute('aria-label', aberto ? 'Fechar o menu' : 'Abrir o menu');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { topo.classList.remove('aberto'); botao.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Links de contato (rodape e pagina de contato)
  function ligacao(tipo) {
    if (tipo === 'whatsapp' && CONTATO.whatsapp) return 'https://wa.me/' + CONTATO.whatsapp;
    if (tipo === 'email' && CONTATO.email) return 'mailto:' + CONTATO.email;
    if (tipo === 'instagram' && CONTATO.instagram) return 'https://www.instagram.com/' + CONTATO.instagram.replace(/^@/, '') + '/';
    return '';
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-contato]'), function (a) {
    var href = ligacao(a.getAttribute('data-contato'));
    if (href) { a.href = href; if (href.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener'; } }
    else { a.addEventListener('click', function (e) { e.preventDefault(); }); a.title = 'Em breve'; }
  });

  // Slide de videos do heroi: um clipe por vez, troca com fusao a cada 8 s; carrega so o atual e o proximo;
  // para quando sai da tela ou a aba fica escondida; nao roda com "menos movimento" nem com economia de dados.
  var slides = Array.prototype.slice.call(document.querySelectorAll('.heroi video.fundo'));
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var economia = navigator.connection && navigator.connection.saveData;
  if (slides.length && !reduzido && !economia) {
    var cel = window.matchMedia('(max-width: 700px)').matches;
    var atual = -1, timer = null, DURACAO = 8000;
    var fonte = function (v) { if (!v.getAttribute('src')) { v.src = v.getAttribute(cel ? 'data-cel' : 'data-pc'); v.load(); } };
    var acender = function (v) { v.classList.add('ativo'); };
    var mostrar = function (i) {
      var v = slides[i];
      fonte(v);
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
      if (v.readyState >= 2) acender(v); else v.addEventListener('playing', function uma() { v.removeEventListener('playing', uma); acender(v); });
      if (atual >= 0 && atual !== i) { var ant = slides[atual]; ant.classList.remove('ativo'); setTimeout(function () { if (!ant.classList.contains('ativo')) ant.pause(); }, 1800); }
      atual = i;
      fonte(slides[(i + 1) % slides.length]);
    };
    var proximo = function () { mostrar((atual + 1) % slides.length); };
    var ligar = function () { if (timer) return; mostrar(atual < 0 ? 0 : atual); timer = setInterval(proximo, DURACAO); };
    var desligar = function () { if (!timer) return; clearInterval(timer); timer = null; slides.forEach(function (v) { v.pause(); }); };
    var heroi = document.getElementById('inicio');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !document.hidden) ligar(); else desligar(); }); }, { threshold: 0.15 }).observe(heroi);
    } else { ligar(); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) desligar(); else ligar(); });
  }

  // Galeria de projetos: filtro por categoria (tambem pelo #categoria do endereco) e foto ampliada
  var filtros = Array.prototype.slice.call(document.querySelectorAll('.filtros button'));
  var itens = Array.prototype.slice.call(document.querySelectorAll('.galeria li'));
  if (filtros.length && itens.length) {
    var filtrar = function (cat) {
      filtros.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filtro') === cat ? 'true' : 'false'); });
      itens.forEach(function (li) { li.classList.toggle('oculto', cat !== 'todos' && li.getAttribute('data-categoria') !== cat); });
    };
    filtros.forEach(function (b) { b.addEventListener('click', function () { var c = b.getAttribute('data-filtro'); filtrar(c); if (history.replaceState) history.replaceState(null, '', c === 'todos' ? location.pathname : '#' + c); }); });
    var inicial = location.hash.replace('#', '');
    if (inicial && filtros.some(function (b) { return b.getAttribute('data-filtro') === inicial; })) filtrar(inicial);
    // Foto ampliada: navega entre as fotos visiveis no filtro atual (setas, teclado e arraste), com contador
    var dialogo = document.getElementById('ampliada');
    if (dialogo && typeof dialogo.showModal === 'function') {
      var img = dialogo.querySelector('img'), forte = dialogo.querySelector('strong'), desc = dialogo.querySelector('.desc'), contador = dialogo.querySelector('.contador');
      var lista = [], pos = 0;
      var mostrarFoto = function (i) {
        pos = (i + lista.length) % lista.length;
        var b = lista[pos];
        img.src = b.getAttribute('data-foto'); img.alt = b.getAttribute('data-titulo') + ': ' + b.getAttribute('data-texto');
        forte.textContent = b.getAttribute('data-titulo'); desc.textContent = b.getAttribute('data-texto');
        contador.textContent = (pos + 1) + ' / ' + lista.length;
      };
      var abrirFoto = function (b) {
        lista = itens.filter(function (li) { return !li.classList.contains('oculto'); }).map(function (li) { return li.querySelector('button'); });
        if (lista.indexOf(b) < 0) lista = itens.map(function (li) { return li.querySelector('button'); });
        mostrarFoto(lista.indexOf(b));
        dialogo.showModal();
      };
      itens.forEach(function (li) { var b = li.querySelector('button'); b.addEventListener('click', function () { abrirFoto(b); }); });
      Array.prototype.forEach.call(document.querySelectorAll('[data-abrir]'), function (d) {
        d.addEventListener('click', function () { var li = itens[parseInt(d.getAttribute('data-abrir'), 10)]; if (li) abrirFoto(li.querySelector('button')); });
      });
      dialogo.querySelector('.ant').addEventListener('click', function () { mostrarFoto(pos - 1); });
      dialogo.querySelector('.prox').addEventListener('click', function () { mostrarFoto(pos + 1); });
      dialogo.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { e.preventDefault(); mostrarFoto(pos - 1); } if (e.key === 'ArrowRight') { e.preventDefault(); mostrarFoto(pos + 1); } });
      var x0 = null;
      dialogo.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      dialogo.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 40) mostrarFoto(dx < 0 ? pos + 1 : pos - 1); }, { passive: true });
      dialogo.querySelector('.fechar').addEventListener('click', function () { dialogo.close(); });
      dialogo.addEventListener('click', function (e) { if (e.target === dialogo) dialogo.close(); });
      dialogo.addEventListener('close', function () { img.removeAttribute('src'); });
    }
  }

  // Formulario de contato: monta a mensagem e abre o WhatsApp (ou o e-mail) quando o canal estiver configurado
  var form = document.getElementById('form-contato');
  if (form) {
    var aviso = document.getElementById('aviso-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = {};
      Array.prototype.forEach.call(form.elements, function (el) { if (el.name) d[el.name] = el.value.trim(); });
      aviso.hidden = false;
      if (!d.nome || !d.email) { aviso.textContent = 'Preencha pelo menos o nome e o e-mail.'; return; }
      var texto = 'Olá, Yuki! Sou ' + d.nome + ' (' + d.email + (d.whatsapp ? ', WhatsApp ' + d.whatsapp : '') + '). Projeto: ' + d.tipo + '. ' + (d.mensagem || '');
      if (CONTATO.whatsapp) { window.open('https://wa.me/' + CONTATO.whatsapp + '?text=' + encodeURIComponent(texto), '_blank', 'noopener'); aviso.textContent = 'Abrimos o WhatsApp com a sua mensagem pronta para enviar.'; return; }
      if (CONTATO.email) { location.href = 'mailto:' + CONTATO.email + '?subject=' + encodeURIComponent('Orçamento: ' + d.tipo) + '&body=' + encodeURIComponent(texto); aviso.textContent = 'Abrimos o seu e-mail com a mensagem pronta para enviar.'; return; }
      aviso.textContent = 'O canal de envio ainda está sendo configurado. Em breve você poderá enviar por aqui.';
    });
  }
})();
