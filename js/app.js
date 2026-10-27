/* La Rufeta · comportamiento de la página */
(function () {
  var D = window.RUFETA || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var euro = function (n) { return typeof n === 'number' ? n.toFixed(2).replace('.', ',').replace(',00', '') + ' €' : n; };
  var wa = function (texto) { return 'https://wa.me/' + D.whatsapp + '?text=' + encodeURIComponent(texto); };

  // Hora de Madrid, independiente del huso del visitante
  function ahoraMadrid() {
    var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short' }).formatToParts(new Date());
    var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
    var wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday];
    return { iso: o.year + '-' + o.month + '-' + o.day, dia: wd, min: (+o.hour % 24) * 60 + (+o.minute) };
  }
  var aMin = function (h) { var a = h.split(':'); return (+a[0]) * 60 + (+a[1]); };
  var A = ahoraMadrid();

  // ---------- Abierto ahora ----------
  function estadoAbierto() {
    var el = $('[data-estado]'); if (!el || !D.horario) return;
    var hoy = D.horario[A.dia], ayer = D.horario[(A.dia + 6) % 7];
    var abierto = false, cierra = '';
    if (hoy) {
      var a = aMin(hoy.abre), c = aMin(hoy.cierra); if (c <= a) c += 1440;
      if (A.min >= a && A.min < c) { abierto = true; cierra = hoy.cierra; }
    }
    if (!abierto && ayer) {
      var a2 = aMin(ayer.abre), c2 = aMin(ayer.cierra);
      if (c2 <= a2 && A.min < c2) { abierto = true; cierra = ayer.cierra; }
    }
    if (abierto) {
      el.textContent = 'Abierto ahora · cierra ' + (cierra === '00:00' ? 'a medianoche' : 'a la' + (cierra === '01:00' ? '' : 's') + ' ' + cierra.replace(/^0(\d)/, '$1'));
      el.classList.add('abierto');
    } else {
      // próxima apertura
      for (var i = 0; i < 7; i++) {
        var d = (A.dia + i) % 7, h = D.horario[d];
        if (h && (i > 0 || A.min < aMin(h.abre))) {
          el.textContent = 'Cerrado ahora · abrimos ' + (i === 0 ? 'hoy' : i === 1 ? 'mañana' : 'el ' + DIAS[d]) + ' a las ' + h.abre;
          break;
        }
      }
    }
  }

  // ---------- Horario ----------
  function pintarHorario() {
    var dl = $('[data-horario]'); if (!dl) return;
    var h12 = function (h) { return h.replace(/^0(\d)/, '$1'); };
    var txt = function (h) { return h ? h12(h.abre) + ' a ' + h12(h.cierra) : 'Cerrado'; };
    var vals = [1, 2, 3, 4, 5, 6, 0].map(function (d) { return txt(D.horario[d]); });
    var filas = vals.every(function (v) { return v === vals[0]; })
      ? [['Todos los días', vals[0]]]
      : [1, 2, 3, 4, 5, 6, 0].map(function (d, i) { return [DIAS[d].charAt(0).toUpperCase() + DIAS[d].slice(1), vals[i], d === A.dia]; });
    filas.forEach(function (f) {
      var dt = document.createElement('dt'); dt.textContent = f[0];
      var dd = document.createElement('dd'); dd.textContent = f[1];
      if (f[2]) { dt.className = dd.className = 'hoy-dia'; }
      dl.appendChild(dt); dl.appendChild(dd);
    });
  }

  // ---------- Menú de hoy (TuMenú) ----------
  function fechaLarga(iso) {
    try {
      var s = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Madrid' }).format(new Date(iso + 'T12:00:00Z'));
      return s.charAt(0).toUpperCase() + s.slice(1);
    } catch (e) { return iso; }
  }
  function menuHoy() {
    var cuerpo = $('[data-hoy]'); if (!cuerpo) return;
    $('[data-hoy-fecha]').textContent = fechaLarga(A.iso);
    var url = D.tumenu.api + encodeURIComponent(D.tumenu.slug);
    var sinMenu = function (msg) {
      cuerpo.innerHTML = '';
      var p = document.createElement('p'); p.className = 'hoy-aviso'; p.textContent = msg;
      cuerpo.appendChild(p);
    };
    fetch(url, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        var m = d && d.menu;
        if (!m) {
          var f = D.menuFranja;
          sinMenu(f.dias.indexOf(A.dia) < 0
            ? 'Hoy no hay menú del día. Ven a por raciones, vermut o un buen desayuno.'
            : 'Estamos escribiendo el menú de hoy. Llámanos y te lo cantamos.');
          return;
        }
        cuerpo.innerHTML = '';
        [['Primeros', m.primeros], ['Segundos', m.segundos], ['Postre o café', m.postres], ['Bebida', m.bebidas || m.bebida]].forEach(function (g, gi) {
          if (!g[1] || !g[1].length) return;
          var box = document.createElement('div'); box.className = 'hoy-grupo r'; box.style.setProperty('--i', gi);
          var h = document.createElement('h3'); h.textContent = g[0]; box.appendChild(h);
          var ul = document.createElement('ul');
          [].concat(g[1]).forEach(function (x) { var li = document.createElement('li'); li.textContent = x; ul.appendChild(li); });
          box.appendChild(ul); cuerpo.appendChild(box);
          observar(box);
        });
        if (m.precio) {
          var precio = String(m.precio).replace('.', ',').replace(/\s*€$/, ' €');
          var pr = $('[data-hoy-precio]'); pr.textContent = precio; pr.hidden = false;
          $('#titular').textContent = 'Menú del día a ' + precio;
        }
        var piz = $('[data-pizarra]');
        piz.href = url + '/image.png?date=' + A.iso; piz.target = '_blank'; piz.rel = 'noopener'; piz.hidden = false;
      })
      .catch(function () { sinMenu('No hemos podido cargar el menú. Llámanos al 676 93 93 54 y te lo contamos.'); });

    var rr = $('[data-reserva-rapida]');
    if (rr) rr.href = wa('Hola, ¿me guardáis mesa hoy para el menú del día? Somos ');
  }

  // ---------- Tarjeta de sellos (lo que se puede tocar) ----------
  function sellos() {
    var box = $('[data-sellos]'); if (!box) return;
    var txt = $('[data-sellos-texto]');
    var n = 0;
    for (var i = 0; i < 10; i++) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'sello'; b.dataset.i = i;
      b.setAttribute('aria-label', 'Sello ' + (i + 1)); b.textContent = i + 1;
      box.appendChild(b);
    }
    var gratis = document.createElement('span'); gratis.className = 'sello gratis'; gratis.setAttribute('aria-hidden', 'true');
    function pintar() {
      $$('.sello[data-i]', box).forEach(function (b, i) {
        b.classList.toggle('puesto', i < n);
        b.setAttribute('aria-pressed', i < n ? 'true' : 'false');
      });
      var f = 10 - n;
      txt.textContent = n === 0 ? 'Toca los sellos para ver cuánto te falta.' : f === 0 ? 'Tarjeta completa: tu próximo menú o desayuno es gratis.' : 'Llevas ' + n + (n === 1 ? ' sello' : ' sellos') + '. Te ' + (f === 1 ? 'falta 1' : 'faltan ' + f) + ' para el gratis.';
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.sello[data-i]'); if (!b) return;
      var i = +b.dataset.i; n = (i + 1 === n) ? i : i + 1; pintar();
    });
    pintar();
  }

  // ---------- Promociones ----------
  function promos() {
    var activas = (D.promos || []).filter(function (p) { return A.iso >= p.desde && A.iso <= p.hasta; });
    var sec = $('#promos');
    var tabs = $('[data-promo-tabs]');
    if (!activas.length) { tabs.hidden = true; return; }
    var img = $('[data-promo-img]');
    function mostrar(k) {
      var p = activas[k];
      $$('button', tabs).forEach(function (b, i) { b.setAttribute('aria-selected', i === k ? 'true' : 'false'); b.tabIndex = i === k ? 0 : -1; });
      $('[data-promo-titulo]').textContent = p.titulo;
      $('[data-promo-fecha]').textContent = p.fecha || '';
      $('[data-promo-texto]').textContent = p.texto;
      var a = $('[data-promo-accion]'); a.textContent = p.accion || 'Reservar';
      a.href = wa('Hola, me interesa: ' + p.titulo + (p.fecha ? ' (' + p.fecha + ')' : '') + '. ');
      var foto = p.foto || (D.fotos[k % (D.fotos.length || 1)] || {}).src;
      var src = p.imagen || foto;
      if (src) {
        img.style.opacity = 0;
        var pre = new Image();
        pre.onload = function () { img.src = src; img.alt = p.imagen ? 'Cartel: ' + p.titulo : ''; img.style.opacity = 1; };
        pre.onerror = function () { if (foto) img.src = foto; img.alt = ''; img.style.opacity = 1; };
        pre.src = src;
      }
    }
    activas.forEach(function (p, i) {
      var b = document.createElement('button'); b.type = 'button'; b.role = 'tab'; b.textContent = p.titulo;
      b.addEventListener('click', function () { mostrar(i); });
      tabs.appendChild(b);
    });
    tabs.addEventListener('keydown', function (e) {
      var bs = $$('button', tabs), i = bs.indexOf(document.activeElement);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var j = (i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length; mostrar(j); bs[j].focus(); }
    });
    if (activas.length === 1) tabs.hidden = true;
    mostrar(0);
  }

  // ---------- Carta ----------
  function carta() {
    var box = $('[data-carta]'); if (!box) return;
    (D.carta || []).forEach(function (g, gi) {
      var b = document.createElement('div'); b.className = 'carta-bloque';
      var h = document.createElement('h3'); h.className = 'r'; h.textContent = g.grupo; b.appendChild(h);
      if (g.nota) { var n = document.createElement('p'); n.className = 'carta-nota r'; n.textContent = g.nota; b.appendChild(n); }
      var fila = document.createElement('div'); fila.className = 'carta-fila';
      var foto = g.foto || (D.fotos.filter(function (f) { return f.plato; })[gi] || D.fotos[gi + 1] || {}).src;
      if (foto) {
        var fig = document.createElement('figure'); fig.className = 'r'; fig.style.setProperty('--i', 1);
        var im = document.createElement('img'); im.src = foto; im.alt = ''; im.loading = 'lazy'; im.width = 600; im.height = 800;
        fig.appendChild(im); fila.appendChild(fig);
      }
      var col = document.createElement('div'); col.className = 'r'; col.style.setProperty('--i', 2);
      var ul = document.createElement('ul'); ul.className = 'carta-lista';
      g.platos.forEach(function (p) {
        var li = document.createElement('li');
        var a = document.createElement('span'); a.textContent = p[0];
        var c = document.createElement('span'); c.textContent = p[1] != null ? euro(p[1]) : '';
        li.appendChild(a); li.appendChild(c); ul.appendChild(li);
      });
      col.appendChild(ul);
      fila.appendChild(col); b.appendChild(fila); box.appendChild(b);
    });
  }

  // ---------- Fotos: escena, galería, tira, pie ----------
  function fotos() {
    var F = D.fotos || [];
    if (!F.length) return;
    // Escena con fundido lento
    var escena = $('.escena');
    var esc = F.filter(function (f) { return f.escena; });
    if (!esc.length) esc = F.slice(0, 4);
    escena.innerHTML = '';
    esc.forEach(function (f, i) {
      var im = document.createElement('img'); im.className = 'escena-foto' + (i === 0 ? ' activa' : '');
      im.src = f.src; im.alt = ''; im.width = 1200; im.height = 1500; if (i) im.loading = 'lazy';
      im.style.objectPosition = f.pos || 'center';
      escena.appendChild(im);
    });
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (esc.length > 1 && !reduce) {
      var k = 0, imgs = $$('.escena-foto', escena), t;
      var paso = function () { imgs[k].classList.remove('activa'); k = (k + 1) % imgs.length; imgs[k].classList.add('activa'); };
      var arrancar = function () { clearInterval(t); t = setInterval(paso, 6000); };
      document.addEventListener('visibilitychange', function () { document.hidden ? clearInterval(t) : arrancar(); });
      arrancar();
    }
    // Galería: alto, par, ancho, par, alto, ancho…
    var fila = $('[data-galeria]');
    var gal = F.filter(function (f) { return !f.soloEscena; });
    var patron = ['alto', 'par', 'ancho', 'par', 'alto', 'ancho'];
    var i = 0, m = 0;
    while (i < gal.length) {
      var tipo = patron[m % patron.length]; m++;
      var mod = document.createElement('div'); mod.className = 'modulo modulo-' + tipo;
      var cuantas = tipo === 'par' ? 2 : 1;
      if (tipo === 'par' && i + 1 >= gal.length) { mod.className = 'modulo modulo-alto'; cuantas = 1; }
      for (var j = 0; j < cuantas; j++) {
        var f = gal[i++];
        var fig = document.createElement('figure');
        var im = document.createElement('img'); im.src = f.src; im.alt = f.alt || ''; im.loading = 'lazy'; im.width = 900; im.height = 1200;
        fig.appendChild(im); mod.appendChild(fig);
      }
      fila.appendChild(mod);
    }
    $('[data-galeria-cuenta]').textContent = gal.length + ' fotos';
    arrastrar(fila);
    // Tira de la visita (duplicada para bucle)
    var tira = $('[data-tira]');
    var lote = gal.concat(gal).slice(0, Math.max(10, gal.length));
    lote.concat(lote).forEach(function (f) { var im = document.createElement('img'); im.src = f.src; im.alt = ''; im.loading = 'lazy'; im.width = 200; im.height = 150; tira.appendChild(im); });
    // Promos y pie
    var pie = F.filter(function (f) { return f.pie; })[0] || F[F.length - 1];
    $('[data-pie-img]').src = pie.src;
    var pimg = $('[data-promo-img]'); if (/madera/.test(pimg.getAttribute('src'))) pimg.src = F[0].src;
  }

  function arrastrar(el) {
    var x0, s0, mov = false;
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      x0 = e.clientX; s0 = el.scrollLeft; mov = true; el.classList.add('arrastrando');
    });
    window.addEventListener('pointermove', function (e) { if (mov) el.scrollLeft = s0 - (e.clientX - x0); });
    window.addEventListener('pointerup', function () { mov = false; el.classList.remove('arrastrando'); });
  }

  // ---------- Reserva por WhatsApp ----------
  function reserva() {
    var form = $('[data-reserva-form]'); if (!form) return;
    var sel = $('[data-cuando]');
    var opciones = [];
    for (var i = 0; i < 7; i++) {
      var d = (A.dia + i) % 7; if (!D.horario[d]) continue;
      var nombre = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : DIAS[d].charAt(0).toUpperCase() + DIAS[d].slice(1);
      if (i > 0 || A.min < aMin('14:30')) opciones.push(nombre + ', comida');
      opciones.push(nombre + ', cena');
      if (opciones.length > 8) break;
    }
    opciones.forEach(function (o) { var op = document.createElement('option'); op.textContent = o; sel.appendChild(op); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = form.personas.value;
      var msg = 'Hola, quería reservar mesa para ' + (p === '10' ? '10 o más personas' : p + (p === '1' ? ' persona' : ' personas')) + ' · ' + sel.value.toLowerCase() + '. ¿Tenéis sitio?';
      window.open(wa(msg), '_blank', 'noopener');
    });
  }

  // ---------- Entradas al hacer scroll ----------
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('dentro'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function observar(el) { if (io) io.observe(el); else el.classList.add('dentro'); }

  function marcarEntradas() {
    var grupos = [
      ['.tarjeta', ['.tarjeta-marca', 'h1', '.entrada', '.estado', '.tarjeta .boton', '.tarjeta-enlaces']],
      ['.hoy', ['.hoy-cabeza', '.hoy-pie', '.hoy > .nota']],
      ['.sellos', ['h2', 'p', '.sellos-tarjeta', '.nota']],
      ['.promos', ['.promos-foto', '.promos-pestanas', '.promos-centro', '.promos-celdas']],
      ['.carta', ['.carta-fija']],
      ['.galeria', ['.galeria-cabeza', '.galeria-fila']],
      ['.visita', ['.visita-info h2', '.visita-dir', '.horario', '.reserva']],
      ['.pie', ['.pie-menu nav', '.pie-datos']]
    ];
    grupos.forEach(function (g) {
      var raiz = $(g[0]); if (!raiz) return;
      g[1].forEach(function (s, i) {
        $$(s, raiz).forEach(function (el) { if (el.classList.contains('r')) return; el.classList.add('r'); el.style.setProperty('--i', i); observar(el); });
      });
    });
    $$('.carta .r').forEach(observar);
  }

  // Barra superior: aparece al pasar la primera pantalla
  function barra() {
    var b = $('.barra'), t = $('.tarjeta');
    if (!b || !t || !io) { if (b) b.classList.add('visible'); return; }
    new IntersectionObserver(function (es) { b.classList.toggle('visible', !es[0].isIntersecting); }, { threshold: 0.15 }).observe($('.tarjeta-marca'));
  }

  // WhatsApp genérico con saludo
  $$('[data-wa]').forEach(function (a) { a.href = wa('Hola, '); });
  var anio = $('[data-anio]'); if (anio) anio.textContent = A.iso.slice(0, 4);

  estadoAbierto(); pintarHorario(); menuHoy(); sellos(); promos(); carta(); fotos(); reserva(); marcarEntradas(); barra();
})();
