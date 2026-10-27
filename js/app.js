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
      n.classList.add('abierto');
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

  // ---------- Horario (fila de la dirección) ----------
  function pintarHorario() {
    var n = $('[data-horario-linea]'); if (!n || !D.horario) return;
    var txt = function (h) { return h ? hora(h.abre) + ' a ' + hora(h.cierra) : 'cerrado'; };
    var vals = [1, 2, 3, 4, 5, 6, 0].map(function (d) { return txt(D.horario[d]); });
    if (vals.every(function (v) { return v === vals[0]; })) n.textContent = 'Todos los días, ' + vals[0];
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
      cuerpo.appendChild(el('p', 'hoy-vacio', msg));
      if (nota) cuerpo.appendChild(el('p', 'hoy-vacio-nota', nota));
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
        // La imagen del menú con el diseño del bar (la misma que se manda por WhatsApp).
        // La versión en texto queda debajo para lectores de pantalla y buscadores.
        var firma = 0, sj = JSON.stringify(m);
        for (var k = 0; k < sj.length; k++) firma = ((firma << 5) - firma + sj.charCodeAt(k)) | 0;
        var src = muestra ? url + '/image.png?sample=1' : url + '/image.png?date=' + A.iso + '&v=' + (firma >>> 0).toString(36);
        var img = new Image();
        img.onload = function () {
          var hoja = $('[data-hoja]');
          img.className = 'menu-imagen'; img.width = 1080; img.height = 1584;
          img.alt = 'Menú del día de La Rufeta, ' + fechaLarga(A.iso).toLowerCase();
          hoja.classList.add('con-imagen');
          hoja.insertBefore(img, hoja.firstChild);
        };
        img.src = src;
      })
      .catch(function () { vacio('No hemos podido cargar el menú.', 'Llámanos al 676 93 93 54 y te lo contamos.'); });

  }

  // ---------- Carta con pestañas ----------
  function carta() {
    var tabs = $('[data-carta-tabs]'), panel = $('[data-carta-panel]'), foto = $('[data-carta-foto]');
    if (!tabs || !D.carta) return;
    function mostrar(k, foco) {
      var g = D.carta[k];
      $$('button', tabs).forEach(function (b, i) { b.setAttribute('aria-selected', i === k ? 'true' : 'false'); b.tabIndex = i === k ? 0 : -1; if (i === k && foco) b.focus(); });
      var activa = $$('button', tabs)[k];
      if (activa && tabs.scrollWidth > tabs.clientWidth) tabs.scrollTo({ left: activa.offsetLeft - (tabs.clientWidth - activa.offsetWidth) / 2, behavior: 'smooth' });
      panel.innerHTML = '';
      panel.setAttribute('aria-label', g.grupo);
      panel.appendChild(el('h3', 'sr', g.grupo));
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
        pre.onload = function () { setTimeout(function () { foto.src = g.foto; foto.alt = g.grupo; requestAnimationFrame(function () { foto.classList.remove('cambiando'); }); }, 250); };
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
      var art = el('article', 'evento');
      var fig = el('figure', 'evento-foto r');
      var img = el('img'); img.src = p.imagen || p.foto; img.alt = p.imagen ? 'Cartel: ' + p.titulo : ''; img.loading = 'lazy'; img.width = 1600; img.height = 1000;
      if (p.imagen) { art.classList.add('cartel'); img.onerror = function () { art.classList.remove('cartel'); img.src = p.foto; img.alt = ''; }; }
      fig.appendChild(img);
      var t = el('div', 'evento-texto');
      if (p.fecha) t.appendChild(el('p', 'evento-fecha r', p.fecha));
      t.appendChild(el('h3', 'r', p.titulo));
      if (p.texto) t.appendChild(el('p', 'r', p.texto));
      var a = el('a', 'boton boton-vino r', p.accion || 'Reservar');
      a.href = wa('Hola, me interesa: ' + p.titulo + (p.fecha ? ' (' + p.fecha + ')' : '') + '. '); a.target = '_blank'; a.rel = 'noopener';
      t.appendChild(a);
      art.appendChild(fig); art.appendChild(t); box.appendChild(art);
      $$('.r', art).forEach(function (n, k) { n.style.setProperty('--i', k); observar(n); });
    });
  }

  // ---------- Opiniones: una grande y dos en las esquinas ----------
  function resenas() {
    var box = $('[data-resenas]'); if (!box) return;
    var rs = D.resenasDestacadas || []; if (!rs.length) return;
    var g = D.google || {};
    var lead = el('div', 'opinion-principal r');
    var q = el('blockquote'); q.appendChild(el('p', null, '«' + rs[0].texto + '»')); q.appendChild(el('cite', null, rs[0].autor + ' · Google'));
    lead.appendChild(q);
    if (g.nota) {
      var nota = el('p', 'opinion-nota', g.nota + ' de 5 en Google, ' + g.opiniones + ' opiniones. ');
      var a = el('a', null, 'Leerlas'); a.href = $('.pie-enlaces a[href*="maps/place"]').href; a.target = '_blank'; a.rel = 'noopener';
      nota.appendChild(a); lead.appendChild(nota);
    }
    box.appendChild(lead);
    rs.slice(1, 3).forEach(function (r, i) {
      var b = el('blockquote', 'opinion-esquina r'); b.style.setProperty('--i', i + 1);
      b.appendChild(el('p', null, '«' + r.texto + '»')); b.appendChild(el('cite', null, r.autor + ' · Google'));
      box.appendChild(b);
    });
    $$('.r', box).forEach(observar);
  }

  // ---------- Fotos: fila que se arrastra ----------
  function galeria() {
    var box = $('[data-fotos]'); if (!box) return;
    var fotos = D.fotos || [];
    var n = $('[data-fotos-n]'); if (n) n.textContent = fotos.length + ' fotos';
    fotos.forEach(function (f) {
      var fig = el('figure', 'fotos-marco');
      var im = el('img'); im.src = f.src; im.alt = f.alt || ''; im.loading = 'lazy'; im.width = 800; im.height = 1200; im.draggable = false;
      if (f.pos) im.style.objectPosition = f.pos;
      fig.appendChild(im); box.appendChild(fig);
    });
    // arrastrar con el ratón; en táctil el desplazamiento es nativo
    var x0 = 0, s0 = 0, abajo = false;
    box.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; abajo = true; x0 = e.clientX; s0 = box.scrollLeft; box.classList.add('arrastrando'); });
    window.addEventListener('pointermove', function (e) { if (abajo) box.scrollLeft = s0 - (e.clientX - x0); });
    window.addEventListener('pointerup', function () { abajo = false; box.classList.remove('arrastrando'); });
  }

  // ---------- Barra y portada ----------
  function navegacion() {
    var barra = $('[data-barra]'), portada = $('[data-portada]');
    if (!barra || !portada) return;
    function mirar() { barra.classList.toggle('solida', portada.getBoundingClientRect().bottom < 64); }
    window.addEventListener('scroll', mirar, { passive: true }); mirar();
    // el escaparate: al bajar, cada foto de la casa sustituye a la anterior y trae su fondo
    var fotos = $$('[data-ventana] img'), actual = 0;
    function escaparate() {
      var r = portada.getBoundingClientRect(), recorrido = r.height - innerHeight;
      var k = recorrido > 0 ? Math.min(fotos.length - 1, Math.max(0, Math.floor((-r.top / recorrido) * fotos.length))) : 0;
      if (k === actual) return;
      fotos[actual].classList.remove('activa'); fotos[k].classList.add('activa'); actual = k;
      if (fotos[k].loading === 'lazy') fotos[k].loading = 'eager';
      portada.style.backgroundColor = fotos[k].dataset.fondo || '';
    }
    window.addEventListener('scroll', escaparate, { passive: true });
    fotos.slice(1).forEach(function (f) { f.loading = 'eager'; });
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
  var rr = $('[data-reserva-rapida]');
  if (rr) { rr.href = wa('Hola, ¿me guardáis mesa hoy para el menú del día? Seríamos '); rr.target = '_blank'; rr.rel = 'noopener'; }
  var anio = $('[data-anio]'); if (anio) anio.textContent = A.iso.slice(0, 4);

  estadoAbierto(); pintarHorario(); menuHoy(); carta(); promos(); resenas(); galeria(); navegacion(); entradas();
})();
