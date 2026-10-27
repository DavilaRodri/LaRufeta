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
    var corto = $('[data-hoy-corto]'); if (corto) corto.textContent = 'Hoy, ' + fechaLarga(A.iso).toLowerCase();
    var ticket = $('[data-ticket]');
    var ticketVacio = function (msg) { if (!ticket) return; ticket.innerHTML = ''; ticket.appendChild(el('p', 'ticket-vacio', msg)); };
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
        // ?muestra en la dirección: enseña el diseño con un menú de ejemplo de TuMenú
        var muestra = /[?&]muestra\b/.test(location.search);
        if (muestra) m = { precio: '12,50€', primeros: ['Ensalada de la huerta', 'Sopa de marisco', 'Croquetas caseras'], segundos: ['Solomillo a la pimienta', 'Merluza en salsa verde', 'Pollo de corral'], postres: ['Tarta de queso', 'Flan casero', 'Café'] };
        if (!m) {
          vacio('El menú de hoy aún no está publicado.', 'Lo subimos cada mañana. Si tienes prisa, llámanos al 676 93 93 54 y te lo contamos.');
          ticketVacio('El menú de hoy aún no está publicado. Lo subimos cada mañana; si tienes prisa, llámanos al 676 93 93 54.');
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
        var precio = m.precio ? String(m.precio).replace('.', ',').replace(/\s*€$/, ' €') : '';
        if (precio) { var pr = $('[data-hoy-precio]'); pr.textContent = precio; pr.hidden = false; }
        if (ticket) {
          ticket.innerHTML = '';
          if (precio) ticket.appendChild(el('p', 'ticket-precio', precio));
          grupos.slice(0, 3).forEach(function (g) {
            var b = el('div', 'ticket-grupo');
            b.appendChild(el('h3', null, g[0]));
            b.appendChild(el('p', null, [].concat(g[1]).join(', ')));
            ticket.appendChild(b);
          });
        }
        // La imagen del menú con el diseño del bar (la misma que se manda por WhatsApp).
        // La versión en texto queda debajo para lectores de pantalla y buscadores.
        var firma = 0, sj = JSON.stringify(m);
        for (var k = 0; k < sj.length; k++) firma = ((firma << 5) - firma + sj.charCodeAt(k)) | 0;
        var src = muestra ? url + '/image.png?sample=1' : url + '/image.png?date=' + A.iso + '&v=' + (firma >>> 0).toString(36);
        var img = new Image();
        img.onload = function () {
          var hoja = $('.menu-hoja');
          img.className = 'menu-imagen'; img.width = 1080; img.height = 1584;
          img.alt = 'Menú del día de La Rufeta, ' + fechaLarga(A.iso).toLowerCase();
          cuerpo.classList.add('sr');
          hoja.classList.add('con-imagen');
          hoja.insertBefore(img, hoja.firstChild);
        };
        img.src = src;
      })
      .catch(function () { vacio('No hemos podido cargar el menú.', 'Llámanos al 676 93 93 54 y te lo contamos.'); ticketVacio('Llámanos al 676 93 93 54 y te contamos el menú de hoy.'); });

    var rr = $('[data-reserva-rapida]');
    if (rr) { rr.href = wa('Hola, ¿me guardáis mesa hoy para el menú del día? Seríamos '); rr.target = '_blank'; rr.rel = 'noopener'; }
  }

  // ---------- Carta impresa: todo a la vista, con la foto de cada sección ----------
  function carta() {
    var hoja = $('[data-carta]'), indice = $('[data-carta-indice]'), foto = $('[data-carta-foto]');
    if (!hoja || !D.carta) return;
    var id = function (t) { return 'carta-' + t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]+/g, '-').replace(/-$/, ''); };
    var grupos = D.carta.map(function (g, gi) {
      var sec = el('section', 'carta-grupo r'); sec.id = id(g.grupo); sec.setAttribute('aria-label', g.grupo);
      sec.appendChild(el('h3', null, g.grupo));
      if (g.nota) sec.appendChild(el('p', 'carta-nota', g.nota));
      if (g.foto) {
        var fm = el('figure', 'carta-foto-movil'); var im = el('img'); im.src = g.foto; im.alt = ''; im.loading = 'lazy'; im.width = 1600; im.height = 900;
        fm.appendChild(im); sec.appendChild(fm);
      }
      var ul = el('ul', 'carta-lista');
      g.platos.forEach(function (p) {
        var li = el('li');
        li.appendChild(el('span', 'plato', p[0]));
        var pu = el('span', 'puntos'); pu.setAttribute('aria-hidden', 'true'); li.appendChild(pu);
        li.appendChild(el('span', 'precio', p[1] != null ? euro(p[1]) : ''));
        ul.appendChild(li);
      });
      sec.appendChild(ul); hoja.appendChild(sec);
      var a = el('a', null, g.grupo); a.href = '#' + sec.id; indice.appendChild(a);
      return { sec: sec, a: a, foto: g.foto, nombre: g.grupo };
    });
    function poner(g) {
      grupos.forEach(function (x) { x.a.classList.toggle('activo', x === g); });
      if (!g.foto || !foto || foto.getAttribute('src') === g.foto) return;
      foto.classList.add('cambiando');
      var pre = new Image();
      pre.onload = function () { setTimeout(function () { foto.src = g.foto; requestAnimationFrame(function () { foto.classList.remove('cambiando'); }); }, 250); };
      pre.src = g.foto;
    }
    if ('IntersectionObserver' in window) {
      var ob = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) poner(grupos.filter(function (x) { return x.sec === e.target; })[0]); });
      }, { rootMargin: '-45% 0px -50% 0px' });
      grupos.forEach(function (g) { ob.observe(g.sec); });
    }
  }

  // ---------- Celebraciones (promos con fechas) ----------
  function promos() {
    var box = $('[data-promos]'); if (!box) return;
    var activas = (D.promos || []).filter(function (p) { return A.iso >= p.desde && A.iso <= p.hasta; });
    if (!activas.length) { box.closest('section').hidden = true; return; }
    activas.forEach(function (p, i) {
      var art = el('article', 'evento r' + (p.imagen ? ' evento-cartel' : '')); art.style.setProperty('--i', i);
      var fig = el('figure', 'evento-foto');
      var img = el('img'); img.src = p.imagen || p.foto; img.alt = p.imagen ? 'Cartel: ' + p.titulo : ''; img.loading = 'lazy'; img.width = 1200; img.height = 900;
      if (p.imagen) img.onerror = function () { art.classList.remove('evento-cartel'); img.src = p.foto; img.alt = ''; };
      fig.appendChild(img); art.appendChild(fig);
      var t = el('div', 'evento-texto');
      if (p.fecha) t.appendChild(el('p', 'evento-fecha', p.fecha));
      t.appendChild(el('h3', null, p.titulo));
      if (p.texto) t.appendChild(el('p', null, p.texto));
      var a = el('a', 'boton boton-oscuro', p.accion || 'Reservar'); a.href = wa('Hola, me interesa: ' + p.titulo + (p.fecha ? ' (' + p.fecha + ')' : '') + '. '); a.target = '_blank'; a.rel = 'noopener';
      t.appendChild(a);
      art.appendChild(t); box.appendChild(art);
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

  // ---------- Galería: tira a sangre ----------
  function galeria() {
    var box = $('[data-galeria]'); if (!box) return;
    var orden = ['plato-huevos-rotos-jamon', 'plato-croquetas', 'plato-cachopo-pimientos', 'plato-huevos-rotos-gambas', 'postre-coulant-chocolate'];
    orden.map(function (n) { return (D.fotos || []).filter(function (f) { return f.src.indexOf(n) >= 0; })[0]; }).filter(Boolean).forEach(function (f) {
      var fig = el('figure');
      var im = el('img'); im.src = f.src; im.alt = f.alt || ''; im.loading = 'lazy'; im.width = 1200; im.height = 1200;
      fig.appendChild(im); box.appendChild(fig);
    });
  }

  // ---------- Navegación ----------
  function navegacion() {
    var nav = $('[data-nav]'), btn = $('[data-abrir-menu]'), menu = $('[data-menu-movil]');
    var portada = $('.portada-foto');
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
