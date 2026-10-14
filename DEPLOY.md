# Publicar Diamond Club por HTTPS

El proyecto es un sitio estático: no necesita compilarse ni instalar dependencias. Para habilitar la instalación PWA en PC y Android, publícalo en un proveedor que entregue HTTPS automáticamente (por ejemplo, GitHub Pages, Netlify o Cloudflare Pages).

## Archivos que deben publicarse

Sube el contenido completo de esta carpeta conservando la estructura:

- `index.html`
- `manifest.webmanifest`
- `sw.js`
- `icon.svg`, `icon-192.png` y `icon-512.png`

Los archivos de `tests/` sirven para validar el prototipo y no son necesarios para jugar.

## Pasos generales

1. Crea un sitio estático en el proveedor de hosting elegido.
2. Publica los archivos anteriores desde la raíz del sitio. No configures un comando de compilación; el directorio publicado es la carpeta que contiene `index.html`.
3. Espera a que el proveedor asigne una URL `https://...` y abre esa URL en Chrome o Edge.
4. Comprueba que el juego carga, que el navegador ofrece “Instalar app” y que la aplicación vuelve a abrir al desconectar la red después de su primera carga.
5. En Android, abre la misma URL HTTPS con Chrome y usa “Instalar app” o “Añadir a pantalla de inicio”. El nombre y los iconos vienen del manifiesto.

Si se publica dentro de un subdirectorio, conserva todos los archivos juntos dentro de ese subdirectorio. El manifiesto y el service worker usan rutas relativas al proyecto.

## Antes de cada publicación

Ejecuta desde la raíz del proyecto:

```bash
node --check sw.js
node tests/pwa.test.js
node tests/lobby.test.js
node tests/save-resume.test.js
node tests/visitor-ai.test.js
node tests/game-logic.test.js
```

Tras desplegar una versión nueva, cierra y vuelve a abrir la app para que el navegador active el service worker actualizado. El progreso se guarda localmente en el navegador y no se sincroniza entre dispositivos.
