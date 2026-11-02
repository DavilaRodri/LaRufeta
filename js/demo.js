/* La Rufeta · lógica común de las propuestas /1, /2 y /3.
   Lee los datos de js/datos.js y el menú del día de TuMenú. */
(function () {
  var D = window.RUFETA || {};
  var BASE = document.documentElement.getAttribute('data-base') || '../';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var el = function (tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  var euro = function (n) { return typeof n === 'number' ? (n % 1 ? n.toFixed(2).replace('.', ',') : String(n)) + ' €' : n; };
  var wa = function (t) { return 'https://wa.me/' + D.whatsapp + '?text=' + encodeURIComponent(t); };
  var hora = function (h) { return h.replace(/^0(\d)/, '$1'); };
  var src = function (p) { return /^https?:/.test(p) ? p : BASE + p; };

  function ahora() {
    var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short' }).formatToParts(new Date());
    var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
    return { iso: o.year + '-' + o.month + '-' + o.day, dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: (+o.hour % 24) * 60 + (+o.minute) };
  }
  var A = ahora();
  var aMin = function (h) { var a = h.split(':'); return (+a[0]) * 60 + (+a[1]); };
  function fecha(iso, opts) {
    try { var s = new Intl.DateTimeFormat('es-ES', Object.assign({ timeZone: 'Europe/Madrid' }, opts)).format(new Date(iso + 'T12:00:00Z')); return s.charAt(0).toUpperCase() + s.slice(1); } catch (e) { return iso; }
  }

  // Fechas
  $$('[data-hoy-fecha]').forEach(function (n) { n.textContent = fecha(A.iso, { weekday: 'long', day: 'numeric', month: 'long' }); });
  $$('[data-hoy-corto]').forEach(function (n) { n.textContent = fecha(A.iso, { weekday: 'long', day: 'numeric' }); });

  // Abierto ahora
  (function () {
    var h = D.horario || {}, hoy = h[A.dia], ayer = h[(A.dia + 6) % 7], txt = null, abierto = false;
    if (hoy) { var a = aMin(hoy.abre), c = aMin(hoy.cierra); if (c <= a) c += 1440; if (A.min >= a && A.min < c) { abierto = true; txt = 'Abierto hasta la' + (hoy.cierra === '01:00' ? '' : 's') + ' ' + hora(hoy.cierra); } }
    if (!abierto && ayer) { var a2 = aMin(ayer.abre), c2 = aMin(ayer.cierra); if (c2 <= a2 && A.min < c2) { abierto = true; txt = 'Abierto hasta la' + (ayer.cierra === '01:00' ? '' : 's') + ' ' + hora(ayer.cierra); } }
    if (!abierto && hoy) txt = 'Abrimos a las ' + hora(hoy.abre);
    $$('[data-estado]').forEach(function (n) { if (txt) n.textContent = txt; n.classList.toggle('abierto', abierto); });
  })();

  // Horario
  $$('[data-horario]').forEach(function (n) {
    var h = D.horario || {}, v = [1, 2, 3, 4, 5, 6, 0].map(function (d) { return h[d] ? hora(h[d].abre) + ' a ' + hora(h[d].cierra) : 'Cerrado'; });
    n.textContent = v.every(function (x) { return x === v[0]; }) ? 'Todos los días, de ' + v[0] : v.join(' · ');
  });

  // Menú del día (TuMenú)
  (function () {
    var cajas = $$('[data-hoy-img]'); if (!cajas.length && !$('[data-hoy-lista]')) return;
    var url = D.tumenu.api + encodeURIComponent(D.tumenu.slug);
    var muestra = /[?&]muestra\b/.test(location.search);
    function sinMenu(msg) {
      cajas.forEach(function (c) { c.innerHTML = ''; c.classList.add('sin-menu'); c.appendChild(el('p', 'hoy-vacio', msg)); });
      $$("[data-hoy-lista]").forEach(function (l) { l.innerHTML = ""; l.hidden = true; });
      $$('[data-hoy-precio]').forEach(function (p) { p.hidden = true; });
    }
    fetch(url, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) {
      var m = d && d.menu;
      if (muestra) m = { precio: '12.50€', primeros: ['Ensalada de la huerta', 'Sopa de marisco', 'Croquetas caseras'], segundos: ['Solomillo a la pimienta', 'Merluza en salsa verde', 'Pollo de corral'], postres: ['Tarta de queso', 'Flan casero', 'Café'] };
      if (!m) { sinMenu('El menú de hoy aún no está publicado. Lo subimos cada mañana; si tienes prisa, llámanos al 676\u00a093\u00a093\u00a054.'); return; }
      var precio = m.precio ? String(m.precio).replace('.', ',').replace(/\s*€$/, ' €') : '';
      $$('[data-hoy-precio]').forEach(function (p) { if (precio) { p.textContent = precio; p.hidden = false; } });
      var grupos = [['Primeros', m.primeros], ['Segundos', m.segundos], ['Postre o café', m.postres]].filter(function (g) { return g[1] && [].concat(g[1]).length; });
      $$('[data-hoy-lista]').forEach(function (l) {
        l.innerHTML = '';
        grupos.forEach(function (g) { var b = el('div', 'hoy-grupo'); b.appendChild(el('h3', null, g[0])); var ul = el('ul'); [].concat(g[1]).forEach(function (x) { ul.appendChild(el('li', null, x)); }); b.appendChild(ul); l.appendChild(b); });
      });
      var firma = 0, sj = JSON.stringify(m); for (var k = 0; k < sj.length; k++) firma = ((firma << 5) - firma + sj.charCodeAt(k)) | 0;
      var s = muestra ? url + '/image.png?sample=1' : url + '/image.png?date=' + A.iso + '&v=' + (firma >>> 0).toString(36);
      cajas.forEach(function (c) {
        var img = new Image(); img.width = 1080; img.height = 1584; img.alt = 'Menú del día de La Rufeta, ' + fecha(A.iso, { weekday: 'long', day: 'numeric', month: 'long' }).toLowerCase();
        img.onload = function () { c.innerHTML = ''; c.appendChild(img); c.classList.add('con-imagen'); };
        img.src = s;
      });
    }).catch(function () { sinMenu('No hemos podido cargar el menú. Llámanos al 676\u00a093\u00a093\u00a054 y te lo contamos.'); });
  })();

  // Carta: con pestañas si hay [data-carta-tabs]; si no, entera
  $$('[data-carta]').forEach(function (box) {
    var tabs = $('[data-carta-tabs]'), foto = $('[data-carta-foto]');
    var secciones = (D.carta || []).map(function (g, i) {
      var s = el('section', 'carta-grupo'); s.setAttribute('aria-label', g.grupo);
      s.appendChild(el('h3', null, g.grupo));
      if (g.nota) s.appendChild(el('p', 'carta-nota', g.nota));
      var ul = el('ul', 'carta-lista');
      g.platos.forEach(function (p) {
        var li = el('li'); li.appendChild(el('span', 'plato', p[0]));
        var pu = el('span', 'puntos'); pu.setAttribute('aria-hidden', 'true'); li.appendChild(pu);
        li.appendChild(el('span', 'precio', p[1] != null ? euro(p[1]) : '')); ul.appendChild(li);
      });
      s.appendChild(ul); box.appendChild(s); return s;
    });
    if (!tabs) return;
    function mostrar(k) {
      secciones.forEach(function (s, i) { s.hidden = i !== k; });
      $$('button', tabs).forEach(function (b, i) { b.setAttribute('aria-selected', i === k ? 'true' : 'false'); });
      var b = $$('button', tabs)[k]; if (b && tabs.scrollWidth > tabs.clientWidth) tabs.scrollTo({ left: b.offsetLeft - 20, behavior: 'smooth' });
      var g = D.carta[k];
      if (foto && g.foto) { foto.classList.add('cambia'); var pre = new Image(); pre.onload = function () { foto.src = pre.src; foto.classList.remove('cambia'); }; pre.src = src(g.foto); }
    }
    D.carta.forEach(function (g, i) { var b = el('button', null, g.grupo); b.type = 'button'; b.setAttribute('role', 'tab'); b.addEventListener('click', function () { mostrar(i); }); tabs.appendChild(b); });
    mostrar(0);
  });

  // Celebraciones
  $$('[data-promos]').forEach(function (box) {
    var act = (D.promos || []).filter(function (p) { return A.iso >= p.desde && A.iso <= p.hasta; });
    if (!act.length) { var s = box.closest('section'); if (s) s.hidden = true; return; }
    act.forEach(function (p) {
      var a = el('article', 'promo r' + (p.imagen ? ' promo-cartel' : ''));
      var f = el('figure', 'promo-foto'); var im = el('img'); im.src = src(p.imagen || p.foto); im.alt = p.imagen ? 'Cartel: ' + p.titulo : ''; im.loading = 'lazy';
      f.appendChild(im); a.appendChild(f);
      var t = el('div', 'promo-texto');
      if (p.fecha) t.appendChild(el('p', 'promo-fecha', p.fecha));
      t.appendChild(el('h3', null, p.titulo));
      if (p.texto) t.appendChild(el('p', 'promo-desc', p.texto));
      var b = el('a', 'btn btn-promo', p.accion || 'Reservar'); b.href = wa('Hola, me interesa: ' + p.titulo + (p.fecha ? ' (' + p.fecha + ')' : '') + '. '); b.target = '_blank'; b.rel = 'noopener';
      t.appendChild(b); a.appendChild(t); box.appendChild(a);
    });
  });

  // Opiniones
  $$('[data-resenas]').forEach(function (box) {
    (D.resenasDestacadas || []).forEach(function (r) {
      var q = el('blockquote', 'r'); q.appendChild(el('p', null, '«' + r.texto + '»')); q.appendChild(el('cite', null, r.autor + ' · Google')); box.appendChild(q);
    });
  });

  // WhatsApp con mensaje
  $$('[data-wa]').forEach(function (a) { a.href = wa(a.getAttribute('data-wa') || 'Hola, quería reservar mesa para '); });

  // Cabecera sólida al bajar
  var nav = $('[data-nav]');
  if (nav && 'IntersectionObserver' in window) {
    var m = el('div'); m.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:48px;pointer-events:none'; document.body.prepend(m);
    new IntersectionObserver(function (e) { nav.classList.toggle('solida', !e[0].isIntersecting); }).observe(m);
  }
  // Menú móvil
  var bt = $('[data-abrir-menu]'), mm = $('[data-menu-movil]');
  if (bt && mm) {
    var cerrar = function () { bt.setAttribute('aria-expanded', 'false'); mm.classList.remove('abierto'); document.body.style.overflow = ''; };
    bt.addEventListener('click', function () { var ab = bt.getAttribute('aria-expanded') === 'true'; if (ab) return cerrar(); bt.setAttribute('aria-expanded', 'true'); mm.classList.add('abierto'); document.body.style.overflow = 'hidden'; });
    $$('a', mm).forEach(function (a) { a.addEventListener('click', cerrar); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
  }
  // Entradas al hacer scroll
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('dentro'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' }) : null;
  $$('.r').forEach(function (n, i) { if (io) io.observe(n); else n.classList.add('dentro'); });
  $$('[data-anio]').forEach(function (n) { n.textContent = A.iso.slice(0, 4); });
})();
