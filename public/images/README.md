# Imágenes para la pantalla de código

Sube estas imágenes **con exactamente estos nombres**:

- `plaid-background.webp`: fondo de cuadros rosados (ideal: 1920 × 1080 px o mayor; se usa con cover).
- `success-character.webp`: perrito/mascota feliz del popup correcto, preferiblemente WebP transparente.
- `error-character.webp`: perrito/mascota triste del popup incorrecto, preferiblemente WebP transparente.

La aplicación funciona sin estas imágenes gracias al fondo CSS y a los emojis de prueba. Una vez subidas, las rutas públicas serán `/digital-gifts/images/...` en GitHub Pages.

El código de demostración es **2410**, editable en `src/App.tsx`. No protege contenido confidencial.

## Secuencia de cumpleaños

- `birthday-cake.webp`: torta animada con velas para la cuenta regresiva y la pantalla de continuar.
- `character-letter.webp`: **un único WebP animado** donde aparece el personaje y luego saca la carta, tal como en la referencia. El archivo se reproduce al entrar en esa escena.

Guarda ambos archivos en `public/images/`. Si están originalmente en GIF, puedes usar GIF con esos mismos nombres cambiando la extensión de las referencias en `src/App.tsx`. Hasta que subas los archivos se muestran ilustraciones de respaldo hechas en CSS.
