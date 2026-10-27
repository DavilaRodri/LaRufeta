# La Rufeta · web

Web de La Rufeta, bar restaurante en Las Tablas (Av. del Camino de Santiago, 21, 28050 Madrid).
Página estática (HTML, CSS y JS sin dependencias), publicada con GitHub Pages.

## Qué se actualiza solo

- **Menú del día**: llega de TuMenú (`https://tumenu.bar/api/menu/la-rufeta`). Cuando el bar manda el menú por WhatsApp y pulsa Publicar, la web lo muestra al momento. Si ese día no hay menú, la web lo dice y ofrece llamar.
- **Abierto ahora / cerrado**: se calcula con el horario y la hora de Madrid.
- **Promociones**: cada una tiene fechas `desde` y `hasta`; fuera de ellas desaparece sola.

## Qué se edita a mano: `js/datos.js`

- `horario`: apertura y cierre por día.
- `promos`: título, fecha, texto, fechas de visibilidad y cartel. Los carteles van en `img/promos/` (cuadrados o verticales, JPG de unos 1200 px). Si el cartel no existe, se usa la foto indicada en `foto`.
- `carta`: grupos y platos con precio.
- `fotos`: fotos del local y de los platos (en `img/`).

Después de cambiar CSS o JS, sube el número `?v=` en `index.html` para que los navegadores no usen la versión antigua.

## Probar en local

```
python3 -m http.server 8000
```
y abrir http://localhost:8000.

La versión anterior (Next.js, febrero de 2026) está en la rama `nextjs-2026-02`.
