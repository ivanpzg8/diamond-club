# Diamond Club — prototipo de bateo

Prototipo web autocontenido derivado de la especificación de Baseball Heroes inspirado. No usa recursos del juego original.

## Probar en PC

Abre `index.html` en Chrome, Edge o Firefox. Apunta con el mouse sobre el campo y usa el botón **SWING** o la barra espaciadora. Las flechas también mueven la mira.

## Probar e instalar en Android

Abre la versión publicada por HTTPS en Chrome. Para instalarla, toca **⋮ → Instalar app** o **Añadir a pantalla de inicio**. El progreso queda guardado en ese navegador y no se sincroniza con otros dispositivos.

Para probar únicamente desde una red local (sin instalación PWA), desde la carpeta del proyecto ejecuta:

```bash
python -m http.server 8000
```

Conecta el teléfono a la misma red Wi-Fi y visita `http://IP-DE-TU-PC:8000`. Arrastra el dedo por el campo para apuntar y toca **SWING**. El navegador debe permitir conexiones a la red local. HTTP local sirve para probar el juego, pero no para instalarlo como PWA.

## Qué funciona

- Tres entradas cortas contra lanzamientos simulados.
- Mira de zona, cuatro perfiles de lanzamiento, swings, fouls, strikes, bolas, outs y hits.
- Marcador, bases, objetivo de hits, recompensa demostrativa y guardado local mediante `localStorage`.
- Diseño adaptable a PC y pantallas móviles.

## Límites de esta primera versión

Es una demostración de mecánica y flujo, distribuida como PWA instalable. No contiene backend, autenticación, PvP, animación 3D ni economía real. La defensa, los lanzamientos y los premios son simulados en el navegador; borrar los datos del navegador reinicia el guardado. El salto a apps nativas puede hacerse después de validar el control, migrando la mecánica a Unity u otro motor elegido.

## Siguiente etapa del proyecto

Esta iteración mejora el tiempo visible del lanzamiento y el avance de corredores. El avance de corredores tiene pruebas de lógica básicas incluidas en `tests/game-logic.test.js`. El hito actual es validar la lectura de los lanzamientos y la comodidad de los controles en Android y PC. Los datos se guardan localmente; sincronización, cuentas y backend quedan para una etapa posterior.

## Actualización v0.2

El partido ahora alterna entre las mitades local y visitante de cada entrada. Al completar tres outs, se muestra el cambio de lado; la ofensiva visitante se resuelve como una simulación sencilla y el marcador se muestra junto al local. El control de PC y Android se indica en pantalla. Esto sigue siendo una simulación local: la IA rival todavía no juega turnos completos.


## Actualización v0.3 — variedad de lanzamientos

- Cinco perfiles: recta, curva, cambio, recta alta fuera de la zona y curva afuera.
- La ubicación cambia en cada lanzamiento; las curvas tienen trayectoria en dos tramos.
- El juego muestra la cuenta actual de bolas y strikes. Dejar pasar una bola añade una bola a la cuenta; dejar pasar un lanzamiento dentro cuenta como strike.
- Un swing a un lanzamiento marcado fuera falla y suma strike.

La selección, trayectoria y resultado son simulados localmente, no provienen de física ni de un servidor.

## Actualización v0.4 — velocidad y movimiento de lanzamientos

Los lanzamientos parten visualmente del montículo y llegan al plato con perfiles distintos. Las rectas rápidas duran menos; el cambio y la curva duran más. La curva cae, la recta cortada se mueve lateralmente y algunas bolas terminan fuera de la zona. La velocidad aparece en mph. Son velocidades y trayectorias arcade aproximadas para dar contraste; no constituyen una simulación biomecánica ni están calibradas con datos de lanzadores reales.

Verificación v0.4: JavaScript parseado y arranque/primer lanzamiento simulados en prueba de runtime; las pruebas de avance de corredores siguen pasando.

## Actualización v0.5 — trayectoria de lanzamientos

Se redujo el movimiento lateral y vertical a un desplazamiento gradual durante el vuelo, sin quiebres repentinos. La mezcla alterna con más frecuencia rectas y lentos (curva/cambio) y evita repetir el mismo grupo tres veces seguidas. La bola puede quedar ligeramente fuera por la ubicación del lanzamiento, en vez de usar lanzamientos extremos dedicados. Sigue siendo una aproximación arcade; no modela aerodinámica real ni la biomecánica del lanzador.

## Actualización v0.6 — timing del swing

El resultado del swing ahora combina la distancia de la mira con el momento en que el jugador pulsa. El punto ideal ocurre cerca del plato; equivocarse por poco reduce la calidad y equivocarse mucho produce foul o swing fallido. Como la ventana se calcula sobre el tiempo de vuelo, una recta más rápida deja menos milisegundos reales para reaccionar que una curva/cambio. Validación: sintaxis, inicio de lanzamiento y resolución de swing simulados en prueba runtime; las reglas de corredores siguen pasando.

## Actualización v0.6 — timing del swing

El resultado del swing combina la distancia de la mira con el momento en que se pulsa. El punto ideal ocurre cuando la pelota se acerca al plato. Como la ventana se calcula sobre el tiempo de vuelo, una recta rápida deja menos milisegundos reales para reaccionar que una curva o un cambio. Validación: sintaxis, inicio del lanzamiento y resolución de swing simulados en runtime; reglas de corredores pasan sus pruebas.

## Actualización v0.7 — turno visitante jugable

La ofensiva visitante ya no agrega carreras al azar al terminar el turno local. Cada lanzamiento se resuelve según la decisión de la IA: dejar pasar, swing y fallo, foul, out, hit o base por bolas. Las bolas fuera se marcan como bola y los lanzamientos dentro como strike cuando no hay swing. La puntuación de hits y jonrones se acredita al lado que batea; los controles manuales se desactivan en el turno de la IA.

Pruebas: `node tests/visitor-ai.test.js` verifica un turno visitante, control desactivado y asignación de carreras por lado. `node tests/game-logic.test.js` revisa la inicialización y casos básicos de avance de corredores.


## Actualización v0.8 — defensa local interactiva

Durante la mitad visitante, el usuario ahora puede escoger recta, curva o cambio, apuntar con la mira y pulsar LANZAR. La ubicación define si la pelota cae dentro o fuera de la zona; la IA batea y el turno se resuelve con las reglas de bola, strike, foul, out, hit o base por bolas. En la mitad local se conserva el bateo con lanzamientos del rival.

Para jugar: deja que terminen tus tres outs. En el cambio de lado, elige el lanzamiento, arrastra la mira al campo y toca LANZAR (o usa espacio). La prueba `node tests/visitor-ai.test.js` valida la selección de curva, el turno de IA, el bloqueo del botón durante el vuelo y el marcador por equipo.


## Actualización v0.9 — fildeo interactivo

Cuando la IA visitante conecta una pelota en juego, el lanzamiento deja de resolverse como hit automático. La pelota viaja a una ubicación en el campo. Mueve la mira hacia el punto de caída y pulsa ATRAPAR (espacio o botón); si llegas dentro de la ventana de tiempo, consigues el out. Si fallas o se acaba el tiempo, se resuelve como sencillo, doble o jonrón según el contacto. En pantallas táctiles, arrastra la mira hacia el destino y suelta el dedo para intentar la atrapada; también puedes usar el botón ATRAPAR.

Pruebas: `node tests/visitor-ai.test.js` valida turno defensivo, selección del lanzamiento, atrapada, hit cuando se falla y puntos al marcador correcto. `node tests/game-logic.test.js` verifica el inicio y avance de corredores.

## Actualización v1.0 — guardado y resumen de partido

- El partido activo guarda entrada, mitad, cuenta, outs, corredores, marcador, hits y carreras por entrada en el navegador.
- Monedas, progreso de hits y misión de base por bolas se guardan por separado del partido en curso.
- Al volver a abrir la página, el partido retoma desde el último estado guardado y continúa con el siguiente lanzamiento/acción.
- La base por bolas sólo mueve corredores cuando están forzados.
- El cierre muestra ganador/empate, carreras por entrada, hits y recompensa; “Jugar revancha” inicia una partida limpia. El pago final se ejecuta una sola vez.

Pruebas: `node tests/save-resume.test.js`, `node tests/visitor-ai.test.js` y `node tests/game-logic.test.js`.

## Actualización v1.1 — club, roster y estadio

- Se añadió una pantalla de club para iniciar un partido o continuar el guardado activo.
- El roster permite elegir a Alex Rivera, Maya Cruz o Leo Torres como bateador. El jugador activo afecta la asistencia de contacto y la probabilidad de jonrón.
- El entrenamiento cuesta 50 monedas, aumenta contacto y potencia en 2 puntos y sube un nivel, hasta nivel 10.
- Se puede elegir entre Diamond Park, Atardecer y Noche estrellada; la selección se guarda localmente.
- El roster, las mejoras, el estadio y el partido se conservan en el navegador. Se bloquea la navegación a gestión mientras se juega; desde la pantalla del club se puede gestionar antes de reanudar.

Pruebas: `node tests/lobby.test.js`, `node tests/save-resume.test.js`, `node tests/visitor-ai.test.js` y `node tests/game-logic.test.js`.


## Actualización v1.2 — lectura del turno

El marcador mantiene las etiquetas LOCAL y VISITA junto a sus carreras durante todo el partido. Se añadió una indicación explícita de quién batea y quién defiende, también después de reanudar un guardado. La prueba de guardado valida los dos rótulos de turno.

Pruebas: `node tests/lobby.test.js`, `node tests/save-resume.test.js`, `node tests/visitor-ai.test.js` y `node tests/game-logic.test.js`.


## Actualización v1.3 — lectura rápida del turno y controles móviles

El marcador ahora acompaña bolas, strikes y outs con indicadores visuales, además del texto accesible. El botón principal y el selector del lanzamiento tienen una disposición adaptada a pantallas pequeñas y un área táctil mínima más cómoda. Los mensajes de jugada se anuncian como estados para lectores de pantalla.

Pruebas: `node tests/lobby.test.js`, `node tests/save-resume.test.js`, `node tests/visitor-ai.test.js` y `node tests/game-logic.test.js`.

## Actualización v1.4 — punto de fildeo y resultado de la jugada

En una pelota conectada por la IA visitante, el jardín ahora marca el punto de caída y muestra un reloj de 1.8 segundos con barra de tiempo. El jugador puede mover la mira y pulsar ATRAPAR; al terminar, se ocultan los indicadores. Si la defensa falla, el resultado distingue sencillo, doble y jonrón visitante, e informa las carreras anotadas. La duración y la ventana de captura son valores de prototipo para probar el control, no una simulación de distancias reales del campo.

Pruebas: `node tests/lobby.test.js`, `node tests/save-resume.test.js`, `node tests/visitor-ai.test.js` y `node tests/game-logic.test.js`.


## Actualización v1.5 — fildeo táctil

En Android, tocar y mantener el campo ya no dispara inmediatamente el intento de captura. Ahora puedes arrastrar la mira mientras mantienes el dedo y soltar para confirmar; el botón ATRAPAR sigue disponible. La prueba de defensa comprueba el gesto de tocar, arrastrar y soltar.

Pruebas: `node tests/lobby.test.js`, `node tests/save-resume.test.js`, `node tests/visitor-ai.test.js` y `node tests/game-logic.test.js`.

## Actualización v1.6 — llamadas según la zona visible

La detección de bola o strike ahora usa los límites reales del rectángulo de strike en pantalla, tanto para los lanzamientos del rival como para los del jugador. Los lanzamientos marcados como bolas se generan fuera de ese rectángulo; se eliminaron ubicaciones que podían verse dentro de la zona aunque estuvieran etiquetadas como bola. La prueba de IA cubre puntos centrales, puntos exteriores y destinos generados.

Pruebas: `node tests/lobby.test.js`, `node tests/save-resume.test.js`, `node tests/visitor-ai.test.js` y `node tests/game-logic.test.js`.

## Actualización v1.7 — estrategia según la cuenta

Los lanzamientos del rival alternan entre ubicaciones dentro de distintas partes de la zona. Con tres bolas, la IA reduce los lanzamientos fuera y favorece rectas para buscar un strike; con dos strikes, acepta más lanzamientos fuera y aumenta el peso de curvas y cambios. La trayectoria conserva el desplazamiento moderado ya calibrado. Las probabilidades son una regla arcade inicial, no datos de un lanzador real.

Pruebas: `node tests/lobby.test.js`, `node tests/save-resume.test.js`, `node tests/visitor-ai.test.js` y `node tests/game-logic.test.js`.


## Actualización v1.8 — revisión general

- La base por bolas visitante ya no completa la misión de la alineación local. La misión se guarda por partido, se reinicia en una revancha y paga su bono al finalizar junto al bono de 3 hits.
- Una revancha inicia con un lanzamiento nuevo y sin estado residual del partido anterior.
- Un elevado que produce el tercer out ya no programa un lanzamiento duplicado.
- El nombre del estadio seleccionado se muestra en el campo.
- Las partidas guardadas usan el esquema 3. Al cargarlas se validan estadísticas, marcador, cuenta, bases, entradas, jugadores y estadio; datos inválidos vuelven a valores seguros.
- Las flechas del teclado pueden mover la mira por toda la zona de fildeo.

Pruebas: `node tests/lobby.test.js`, `node tests/save-resume.test.js`, `node tests/visitor-ai.test.js` y `node tests/game-logic.test.js`.


## Actualización v1.9 — instalación y uso sin conexión

El proyecto ahora incluye un manifiesto de aplicación, iconos de 192 y 512 px, un botón de instalación cuando el navegador lo admite y un service worker que guarda el prototipo para volver a abrirlo sin conexión. También se permite el zoom del navegador en móviles y el reloj de fildeo no repite anuncios accesibles a cada cuadro. En PC puedes probarlo desde `http://localhost`; para instalarlo en Android desde un sitio alojado, ese sitio debe servirse por HTTPS. Abrir el archivo directamente o acceder desde una IP local por HTTP permite probar el juego, pero no habilita la instalación PWA ni el service worker.

Prueba PWA: `node tests/pwa.test.js`. Pruebas de juego: `node tests/lobby.test.js`, `node tests/save-resume.test.js`, `node tests/visitor-ai.test.js` y `node tests/game-logic.test.js`.

## Actualización v2.0 — lectura del lanzamiento y control táctil

- La zona de strike ahora tiene borde, relleno verde y etiqueta visible.
- Durante el vuelo, una estela corta sigue la trayectoria real: verde para lanzamiento en zona y coral para lanzamiento fuera. El aviso superior también distingue entre prepararse para batear y dejar pasar la bola.
- En Android, la mira se coloca desplazada respecto al dedo para que la mano no la cubra. Al lanzar desde la defensa, un aviso explica si el destino está dentro o fuera de la zona.
- La caché PWA cambia a v2.0 para que instalaciones existentes descarguen esta actualización.

Pruebas: `node tests/pwa.test.js`, `node tests/lobby.test.js`, `node tests/save-resume.test.js`, `node tests/visitor-ai.test.js` y `node tests/game-logic.test.js`.


## Actualización v2.1 — llamada coherente con la trayectoria

La bola o el strike ahora se determina por el punto final de la trayectoria, después del movimiento del lanzamiento. La guía de puntería defensiva también toma en cuenta la caída de la curva, para que el aviso y la llamada no se contradigan. La prueba de defensa comprueba 500 trayectorias generadas y valida que el resultado coincida con su destino visible. La caché PWA cambia a v2.1 para actualizar instalaciones existentes.

Pruebas: `node tests/pwa.test.js`, `node tests/lobby.test.js`, `node tests/save-resume.test.js`, `node tests/visitor-ai.test.js` y `node tests/game-logic.test.js`.
