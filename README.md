# digital-gifts

Sorpresa de cumpleaños interactiva hecha con React, TypeScript y Vite. Animaciones con GSAP y efectos de corazones con canvas-confetti.

## Flujo

Broma de inicio (cargando → susto falso → "era broma") → contraseña (la fecha de su cumpleaños, día y mes) → pastel (aparece solo en la oscuridad, alumbrado por la vela; al soplarla se prenden las luces y se revela la casa) → pedir un deseo → personaje → tres sobres (Pum, Lynkii, Giank) → cada carta → galería de recuerdos y secciones finales → botón del avión «¿Cuánto falta para vernos?» → cuenta regresiva del viaje a Perú (con transición de avión de ida y vuelta).

Para saltarte la broma al probar, abre la página con `?skip` al final de la dirección (por ejemplo `http://localhost:5173/digital-gifts/?skip`).

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173/digital-gifts/
npm run lint
npm run build
```

## Personalizar

- **Fecha de cumpleaños (el código):** constantes `PASSCODE` (día y mes, por ejemplo `2410`) y `DIGITS` al inicio de `src/App.tsx`. Es una sorpresa visual, no un sistema de autenticación seguro: el código viaja en el JavaScript público.
- **Broma de inicio:** `src/components/IntroPrank.tsx` (textos y tiempos, arriba del archivo). El "reporte" muestra datos que ya conoce el navegador de quien la ve (sistema, navegador, pantalla, idioma, zona horaria); se leen y se muestran en pantalla, no se guardan ni se envían. IP, ubicación, contraseñas y archivos son inventados o van tachados.
- **La casa del pastel:** `src/components/RoomBackground.tsx` y `src/room.css` (pared, ventana, luces de hadas, cuadros, Kuromi y My Melody con tus imágenes `List-kuromi.webp` y `mymelody.webp` de `public/images/personaje/`). Los cuadros usan `public/images/room/hettocumple.webp` y `hetto-peruana.webp` (versiones livianas de tus PNG de `images/personaje/`).
- **Deseo:** lo que escribe en el pastel solo existe en la pantalla; no se guarda ni se envía a ningún lado.
- **Cartas, nombres, colores y textos de las secciones finales:** `src/content.ts` (paleta pastel de cada amigo en `THEMES`, texto de cada carta en `LETTERS`). Los textos marcados como EJEMPLO son de relleno.
- **Stickers de las cartas:** guarda PNG con fondo transparente en `public/images/stickers/` con los nombres `pum-1.png` … `pum-6.png`, `lynki-1.png` … y `giank-1.png` … (6 por carta; los 2 últimos solo se ven en escritorio). Mientras falten, se muestra la mascota de relleno (gatito para Pum y Giank, pingüino para Lynki; se cambia con `critter` en `THEMES`). Posiciones y tamaños en `stickersFor` de `src/content.ts`.
- **Fotos:** `public/images/memories/recuerdo-1.jpeg` … `recuerdo-6.jpeg`.
- **Personajes y GIFs:** `public/images/`.

## Despliegue

Cada push a `main` ejecuta `.github/workflows/deploy.yml` (lint, build y publicación en GitHub Pages). Para no publicar cambios a medias, trabaja en una rama y haz merge a `main` cuando esté lista.

El `base` de Vite es `/digital-gifts/` (ver `vite.config.ts`); si renombras el repositorio, cámbialo también ahí y en las rutas `url('/digital-gifts/...')` de `src/App.css`.

- **Viaje a Perú:** la fecha de llegada, el origen, el mensaje y el texto de «ya llegó» están en PERU_TRIP de src/content.ts. Para mover la cuenta regresiva solo cambia rrival (formato 2027-03-01T12:00:00-05:00, hora de Perú) y pon isEstimated: false cuando la fecha sea la definitiva. La transición del avión está en src/components/PlaneTransition.tsx y la pantalla en src/components/PeruSection.tsx.
- **Imágenes de la sección de Perú** (en public/images/personaje/): peru.png (bandera; el recorte peru-flag.png es el que se muestra), t21.png (el grupito sentado entre las nubes), j.png y rmy.png (los muñequitos pegados al pasaporte y a la carta) y, como foto del pasaporte, images/room/hetto-peruana.webp (PERU_TRIP.photo).
