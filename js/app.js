/* La Rufeta · comportamiento de la página */
(function () {
  var D = window.RUFETA || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var el = function (tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var euro = function (n) { return typeof n === 'number' ? (n % 1 ? n.toFixed(2).replace('.', ',') : String(n)) + ' €' : n; };
  var wa = function (texto) { return 'https://wa.me/' + D.whatsapp + '?text=' + encodeURIComponent(texto); };
  var hora = function (h) { return h.replace(/^0(\d)/, '$1'); };

  // Hora de Madrid, sea cual sea el huso del visitante
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
    var n = $('[data-estado]'); if (!n || !D.horario) return;
    var hoy = D.horario[A.dia], ayer = D.horario[(A.dia + 6) % 7];
    var abierto = null;
    if (hoy) {
      var a = aMin(hoy.abre), c = aMin(hoy.cierra); if (c <= a) c += 1440;
      if (A.min >= a && A.min < c) abierto = hoy.cierra;
    }
    if (!abierto && ayer) {
      var a2 = aMin(ayer.abre), c2 = aMin(ayer.cierra);
      if (c2 <= a2 && A.min < c2) abierto = ayer.cierra;
    }
    if (abierto) {
      n.textContent = 'Abierto ahora · hasta la' + (abierto === '01:00' ? '' : 's') + ' ' + hora(abierto);
      n.classList.add('estado-abierto');
      return;
    }
    for (var i = 0; i < 7; i++) {
      var d = (A.dia + i) % 7, h = D.horario[d];
      if (h && (i > 0 || A.min < aMin(h.abre))) {
        n.textContent = 'Cerrado · abrimos ' + (i === 0 ? 'hoy' : i === 1 ? 'mañana' : 'el ' + DIAS[d]) + ' a las ' + hora(h.abre);
        return;
      }
    }
  }

  // ---------- Horario ----------
  function pintarHorario() {
    var dl = $('[data-horario]'); if (!dl) return;
    var txt = function (h) { return h ? hora(h.abre) + ' a ' + hora(h.cierra) : 'Cerrado'; };
    var orden = [1, 2, 3, 4, 5, 6, 0];
    var vals = orden.map(function (d) { return txt(D.horario[d]); });
    var filas = vals.every(function (v) { return v === vals[0]; })
      ? [['Todos los días', vals[0]]]
      : orden.map(function (d, i) { return [DIAS[d].charAt(0).toUpperCase() + DIAS[d].slice(1), vals[i]]; });
    filas.forEach(function (f) { dl.appendChild(el('dt', null, f[0])); dl.appendChild(el('dd', null, f[1])); });
  }

  // ---------- Menú del día (TuMenú) ----------
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
    var vacio = function (msg, nota) {
      cuerpo.innerHTML = '';
      cuerpo.appendChild(el('p', 'menu-vacio', msg));
      if (nota) cuerpo.appendChild(el('p', 'menu-vacio-nota', nota));
    };
    fetch(url, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        var m = d && d.menu;
        if (!m) {
          vacio('El menú de hoy aún no está publicado.', 'Lo subimos cada mañana. Si tienes prisa, llámanos al 676 93 93 54 y te lo contamos.');
          return;
        }
        cuerpo.innerHTML = '';
        var grupos = [['Primeros', m.primeros], ['Segundos', m.segundos], ['Postre o café', m.postres], ['Bebida', m.bebidas || m.bebida]]
          .filter(function (g) { return g[1] && [].concat(g[1]).length; });
        grupos.forEach(function (g, gi) {
          var box = el('div', 'menu-grupo');
          box.appendChild(el('h3', null, g[0]));
          var ul = el('ul');
          [].concat(g[1]).forEach(function (x) { ul.appendChild(el('li', null, x)); });
          box.appendChild(ul); cuerpo.appendChild(box);
        });
        if (m.precio) {
          var precio = String(m.precio).replace('.', ',').replace(/\s*€$/, ' €');
          var pr = $('[data-hoy-precio]'); pr.textContent = precio; pr.hidden = false;
        }
        var piz = $('[data-pizarra]');
        piz.href = url + '/image.png?date=' + A.iso; piz.target = '_blank'; piz.rel = 'noopener'; piz.hidden = false;
      })
      .catch(function () { vacio('No hemos podido cargar el menú.', 'Llámanos al 676 93 93 54 y te lo contamos.'); });

    var rr = $('[data-reserva-rapida]');
    if (rr) { rr.href = wa('Hola, ¿me guardáis mesa hoy para el menú del día? Seríamos '); rr.target = '_blank'; rr.rel = 'noopener'; }
  }

  // ---------- Carta con pestañas ----------
  function carta() {
    var tabs = $('[data-carta-tabs]'), panel = $('[data-carta-panel]'), foto = $('[data-carta-foto]');
    if (!tabs || !D.carta) return;
    function mostrar(k, foco) {
      var g = D.carta[k];
      $$('button', tabs).forEach(function (b, i) { b.setAttribute('aria-selected', i === k ? 'true' : 'false'); b.tabIndex = i === k ? 0 : -1; if (i === k && foco) b.focus(); });
      panel.innerHTML = '';
      panel.setAttribute('aria-label', g.grupo);
      panel.appendChild(el('h3', null, g.grupo));
      if (g.nota) panel.appendChild(el('p', 'carta-nota', g.nota));
      var ul = el('ul', 'carta-lista');
      g.platos.forEach(function (p, i) {
        var li = el('li'); li.style.setProperty('--i', i);
        li.appendChild(el('span', 'plato', p[0]));
        li.appendChild(el('span', 'precio', p[1] != null ? euro(p[1]) : ''));
        ul.appendChild(li);
      });
      panel.appendChild(ul);
      if (g.foto && foto.getAttribute('src') !== g.foto) {
        foto.classList.add('cambiando');
        var pre = new Image();
        pre.onload = function () { foto.src = g.foto; foto.alt = g.grupo; requestAnimationFrame(function () { foto.classList.remove('cambiando'); }); };
        pre.src = g.foto;
      }
    }
    D.carta.forEach(function (g, i) {
      var b = el('button', null, g.grupo); b.type = 'button'; b.setAttribute('role', 'tab');
      b.addEventListener('click', function () { mostrar(i); });
      tabs.appendChild(b);
    });
    tabs.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var bs = $$('button', tabs), i = bs.indexOf(document.activeElement);
      mostrar((i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length, true);
    });
    mostrar(0);
  }

  // ---------- Celebraciones (promos con fechas) ----------
  function promos() {
    var box = $('[data-promos]'); if (!box) return;
    var activas = (D.promos || []).filter(function (p) { return A.iso >= p.desde && A.iso <= p.hasta; });
    if (!activas.length) { box.closest('section').hidden = true; return; }
    activas.forEach(function (p, i) {
      var art = el('article', 'evento r' + (p.imagen ? ' evento-cartel' : '')); art.style.setProperty('--i', i);
      var bis = el('div', 'bisel');
      var nuc = el('div', 'evento-nucleo');
      var img = el('img'); img.src = p.imagen || p.foto; img.alt = p.imagen ? 'Cartel: ' + p.titulo : ''; img.loading = 'lazy'; img.width = 1200; img.height = 1200;
      if (p.imagen) img.onerror = function () { art.classList.remove('evento-cartel'); img.src = p.foto; img.alt = ''; };
      nuc.appendChild(img);
      var t = el('div', 'evento-texto');
      if (p.fecha) t.appendChild(el('p', 'evento-fecha', p.fecha));
      t.appendChild(el('h3', null, p.titulo));
      if (p.texto) t.appendChild(el('p', null, p.texto));
      var a = el('a', 'pildora pildora-clara'); a.href = wa('Hola, me interesa: ' + p.titulo + (p.fecha ? ' (' + p.fecha + ')' : '') + '. '); a.target = '_blank'; a.rel = 'noopener';
      a.appendChild(document.createTextNode(p.accion || 'Reservar'));
      var ico = el('span', 'pildora-ico', '→'); ico.setAttribute('aria-hidden', 'true'); a.appendChild(ico);
      t.appendChild(a);
      nuc.appendChild(t); bis.appendChild(nuc); art.appendChild(bis); box.appendChild(art);
      observar(art);
    });
  }

  // ---------- Opiniones ----------
  function resenas() {
    var box = $('[data-resenas]'); if (!box) return;
    (D.resenasDestacadas || []).forEach(function (r, i) {
      var q = el('blockquote', 'r'); q.style.setProperty('--i', i);
      q.appendChild(el('p', null, '«' + r.texto + '»'));
      q.appendChild(el('cite', null, r.autor + ' · Google'));
      box.appendChild(q); observar(q);
    });
  }

  // ---------- Galería ----------
  function galeria() {
    var box = $('[data-galeria]'); if (!box) return;
    var orden = ['plato-croquetas', 'plato-huevos-rotos-gambas', 'plato-cachopo-pimientos', 'plato-huevos-rotos-jamon', 'postre-coulant-chocolate'];
    var fotos = orden.map(function (n) { return (D.fotos || []).filter(function (f) { return f.src.indexOf(n) >= 0; })[0]; }).filter(Boolean);
    fotos.forEach(function (f, i) {
      var b = el('div', 'bisel r g' + (i + 1)); b.style.setProperty('--i', i % 3);
      var im = el('img'); im.src = f.src; im.alt = f.alt || ''; im.loading = 'lazy'; im.width = 1200; im.height = 1200;
      b.appendChild(im); box.appendChild(b); observar(b);
    });
  }

  // ---------- Navegación ----------
  function navegacion() {
    var nav = $('[data-nav]'), btn = $('[data-abrir-menu]'), menu = $('[data-menu-movil]');
    var portada = $('.portada');
    if ('IntersectionObserver' in window && portada) {
      new IntersectionObserver(function (es) { nav.classList.toggle('solida', !es[0].isIntersecting); }, { rootMargin: '-80px 0px 0px 0px' }).observe(portada);
    }
    function cerrar() {
      btn.setAttribute('aria-expanded', 'false'); menu.classList.remove('abierto'); document.body.style.overflow = '';
      setTimeout(function () { if (btn.getAttribute('aria-expanded') === 'false') menu.hidden = true; }, 350);
    }
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-expanded') === 'true') { cerrar(); return; }
      menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.add('abierto'); }); });
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', cerrar); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') cerrar(); });
  }

  // ---------- Entradas al hacer scroll ----------
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('dentro'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px' }) : null;
  function observar(n) { if (io) io.observe(n); else n.classList.add('dentro'); }
  function entradas() {
    $$('section').forEach(function (s) {
      $$('.r', s).forEach(function (n, i) { if (!n.style.getPropertyValue('--i')) n.style.setProperty('--i', Math.min(i, 4)); observar(n); });
    });
  }

  $$('[data-wa]').forEach(function (a) { a.href = wa('Hola, quería reservar mesa para '); });
  var anio = $('[data-anio]'); if (anio) anio.textContent = A.iso.slice(0, 4);

  estadoAbierto(); pintarHorario(); menuHoy(); carta(); promos(); resenas(); galeria(); navegacion(); entradas();
})();
