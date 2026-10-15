# Especificación técnica: juego de béisbol arcade social inspirado en Baseball Heroes

**Versión:** 0.1 · **Fecha:** 12 de octubre de 2026  
**Plataformas:** PC (Windows primero) y Android  
**Estado:** propuesta para validar; no describe el código original.

## 1. Objetivo

Crear un juego original de béisbol arcade con personajes caricaturescos, partidos breves centrados en el bateo, gestión ligera de un equipo, progresión por ligas, colección de jugadores y personalización del estadio. La meta es recuperar el tipo de ciclo social y accesible del juego de Facebook, con controles actuales, progreso compartido y una operación sostenible.

No se plantea reproducir el software, sus servidores, interfaz exacta ni activos. No se encontró código fuente ni especificación exhaustiva. A continuación se separan los datos públicos de época de las propuestas que deben probarse.

## 2. Confirmado vs. por reconstruir

### Confirmado por fuentes públicas

- Baseball Heroes fue un juego social de béisbol desarrollado por Syntasia para Facebook. La beta cerrada comenzó en diciembre de 2011 y el lanzamiento público fue alrededor de abril de 2012. El anuncio describe creación y gestión de equipo, scouting de amigos, entrenamiento, competición en ligas, modo arcade de bateo y construcción del estadio. ([Anuncio de beta](https://www.prlog.org/11752744-baseball-heroes-free-to-play-baseball-game-on-facebook-commencing-its-closed-beta-test.html); [conferencia GameTech 2013](https://www.inven.co.kr/webzine/news/?news=60130))
- El folleto promocional menciona 30 equipos regionales estadounidenses, cinco categorías de personalización del personaje, estadio personalizable, cartas de bateadores especiales, scouting de amistades, desarrollo de habilidades, misiones y cinco niveles: Rookie, Single-A, Double-A, Triple-A y Major. Subir de liga desbloqueaba equipamiento, decoración, transporte, cartas y tipos de lanzamiento. ([Folleto promocional PDF](https://d21buns5ku92am.cloudfront.net/26496/documents/16099-1324368348-BaseballHeroes_%EA%B2%8C%EC%9E%84%EC%86%8C%EA%B0%9C%EC%84%9C_ENG.pdf))
- Una reseña contemporánea describe partidos acelerados donde la interacción principal era batear: observar el lanzamiento y pulsar una zona de una cuadrícula. El resultado dependía en parte de atributos/progreso y aleatoriedad. También refiere cartas con habilidades y energía, amistades asignadas a la alineación, misiones, entrenamiento, equipo y estadio. Es una fuente secundaria, así que estos detalles quedan por verificar. ([Reseña de 2015](https://facebookgamesreviews.blogspot.com/2015/06/baseball-heroes-mlbp-heroic-facebook.html))
- En una conferencia de 2013 el desarrollador reportó 16 idiomas, más de 136 países y 16 millones de usuarios acumulados; cifras históricas reportadas por la empresa, no métricas actuales ni auditoría independiente. ([Inven](https://www.inven.co.kr/webzine/news/?news=60130))

### No confirmado; necesita reconstrucción

- Fórmula de lanzamiento, timing, cuadrícula, contacto, tipos de hits, errores, corrido de bases, duración y estructura exacta de entradas.
- Reglas completas de la defensa y lanzamiento, duración de turnos y condiciones de desempate.
- Atributos, curvas de progreso, energía, rarezas, precios, economía y balance de cartas.
- Matchmaking, temporadas, clasificación, juego asíncrono o en tiempo real.
- Catálogo de pantallas, navegación, tutoriales y condiciones de desbloqueo.
- Tecnología, arquitectura, protocolos, base de datos, código y operación de servidores originales.
- Fecha exacta de cierre y situación de posibles clientes móviles posteriores.

Las mecánicas siguientes son decisiones de diseño propuestas, no afirmaciones sobre cada regla del juego original.

## 3. Pilares del producto

1. Un turno divertido en segundos: leer el lanzamiento, apuntar, sincronizar el swing y entender el resultado.
2. Progreso con decisiones: entrenar atributos, armar alineación y elegir habilidades de energía limitada.
3. Expresión visual mediante avatar, uniforme, estadio y celebraciones.
4. Competencia justa: resultados validados en servidor y compras sin victorias garantizadas.
5. Experiencia coherente en PC y Android: progreso compartido, controles cómodos y sesiones cortas.

## 4. Alcance

### MVP

- Acceso como invitado y vinculación opcional de cuenta para guardar en nube.
- Crear club ficticio y avatar inicial.
- Tutorial interactivo de menos de cinco minutos.
- Partido arcade de tres entradas contra IA; bateo interactivo para el usuario y simulación simplificada del resto del roster.
- Lanzamiento con zona y ventana de timing; swing por clic, toque o tecla.
- Resultados: strike, foul, out, hit sencillo/doble/triple o home run. Corrido de bases automático en el primer corte.
- Roster pequeño, atributos básicos, entrenamiento y equipo con impacto moderado.
- Misiones, XP, moneda ganada y desbloqueos.
- Personalización básica de personaje y estadio.
- Cliente Unity para Windows y Android, UI adaptable y entrada multiplataforma.
- Telemetría del tutorial, duración, resultados y errores, con consentimiento y minimización de datos.

### Posterior al MVP

- PvP asíncrono con equipos fantasma y temporadas cortas.
- PvP en vivo sólo tras validar latencia, población y costo de operación.
- Clubes, amistades dentro del juego, desafíos y tablas.
- Más estadios, cartas, animaciones, eventos e idiomas.

## 5. Bucle principal propuesto

1. Entrar, revisar misiones y reclamar recompensas.
2. Revisar alineación y elegir una habilidad de bateador.
3. Iniciar partido recomendado por división.
4. Leer tipo/ubicación aproximada del lanzamiento, apuntar y hacer swing.
5. El servidor valida la entrada y calcula el resultado con estado reproducible. Contacto combina timing, ubicación, atributos, dificultad y variación limitada.
6. Animación corta comunica la jugada; marcador actualiza outs, bases y carreras.
7. Al terminar, otorgar XP, moneda y progreso de misión/liga.
8. Gastar recursos en entrenamiento, roster, equipo o cosméticos.

La habilidad del usuario debe influir claramente; los atributos aumentan consistencia y opciones sin reemplazar el control.

## 6. Sistemas iniciales a probar

### Bateo

- Zona de contacto 2D; ratón o dedo posiciona la mira. Teclado ofrece controles discretos como opción accesible.
- Empezar probando una ventana de swing ajustable entre 150 y 350 ms; es un parámetro de prototipo, no un dato histórico.
- Resolver por separado contacto (fallo/foul/en juego), calidad (débil/normal/perfecto) y trayectoria (rodado/línea/elevado).
- Aleatoriedad pequeña con semilla para auditar resultados; evitar que el resultado importante sea puramente azar.
- Probar recta, cambio y curva como lanzamientos iniciales.

### Partido

- Tres entradas y límite configurable de lanzamientos para apuntar a partidas de 3–5 minutos.
- Reglas básicas de 3 strikes/4 bolas/3 outs; corrido automático simplificado.
- El bateador del usuario aparece con frecuencia previsible; otros turnos se simulan con atributos.
- La IA elige lanzamientos según perfil de dificultad y nunca reacciona a información futura.

### Atributos, colección y economía

- Atributos candidatos: Contacto, Potencia, Disciplina y Consistencia; probar si conviene reducir a tres.
- Cartas/jugadores con rol y habilidad; no exigir copias aleatorias para progresar.
- Energía limita habilidades activas, no el acceso a jugar.
- Usar recompensas directas y transparentes en el MVP. Si se agregan probabilidades, publicarlas claramente.
- XP de club, moneda blanda y materiales de entrenamiento. Sin venta de ventaja competitiva en el prototipo.
- Misiones para enseñar sistemas; no exigir invitar contactos ni publicar contenido.
- Estadio principalmente cosmético; efectos competitivos pequeños y acotados.

## 7. Inventario de pantallas

| ID | Pantalla | Elementos y acciones | MVP |
|---|---|---|---|
| S01 | Inicio/carga | Sesión, descarga, red, versión | Sí |
| S02 | Acceso/recuperación | Invitado, vincular cuenta, términos y privacidad | Sí |
| S03 | Selección de club | Clubes ficticios, tema, nombre | Sí |
| S04 | Creador de avatar | Rostro, cabello, uniforme, accesorios; las cinco categorías históricas no están detalladas | Sí |
| S05 | Tutorial | Mira, timing, resultado y recompensa | Sí |
| S06 | Lobby/club | Nivel, moneda, misiones, jugar, roster | Sí |
| S07 | Emparejamiento | Rival, liga, estado, cancelar | Sí, contra IA |
| S08 | Partido | Campo, marcador, bateador, lanzamiento, controles y habilidad | Sí |
| S09 | Resolución de jugada | Animación, hit/out, avance de bases | Sí |
| S10 | Resultado | Marcador, XP, moneda, objetivos, revancha | Sí |
| S11 | Roster/alineación | Lista, rol, orden, atributos y habilidad | Sí |
| S12 | Ficha de jugador | Estadísticas, habilidad e historial | Sí |
| S13 | Entrenamiento | Costo, efecto y confirmación | Sí |
| S14 | Colección de cartas | Lista, filtros y detalles | Básico |
| S15 | Vestuario | Avatar/equipo y vista previa | Sí |
| S16 | Estadio | Cambiar piezas decorativas | Sí, básico |
| S17 | Misiones | Diarias, hitos, progreso y reclamo | Sí |
| S18 | Liga/clasificación | División, tabla y temporada | Ranking simple |
| S19 | Perfil | Historial, estadísticas, insignias, privacidad | Sí |
| S20 | Social | Buscar por código, amistades, clubes | Posterior |
| S21 | Tienda | Cosméticos, precios y confirmación | Posterior |
| S22 | Ajustes | Audio, gráficos, idioma, controles, accesibilidad | Sí |
| S23 | Bandeja | Recompensas y novedades internas | Básico |
| S24 | Ayuda/soporte | FAQ, reporte, versión y diagnóstico | Sí |
| S25 | Privacidad | Consentimiento, exportación y eliminación de cuenta | Sí |

## 8. Arquitectura propuesta

### Cliente

- Unity LTS con C#; mismo proyecto y perfiles de compilación para Windows y Android.
- Capas: presentación (UI Toolkit o UGUI), dominio puro, adaptadores de plataforma, red, Addressables y analítica.
- Input System para ratón, teclado, mando opcional y multitáctil.
- Escenas: Bootstrap, Auth, ClubHub, Match y Results; gestión como vistas para reducir cargas.
- Arte 3D estilizado o 2.5D, por decidir con prototipo de costo; cámara fija, animaciones breves y VFX ligeros.

### Backend

Usar inicialmente un servicio gestionado (candidato: PlayFab) para identidad, inventario, progresión, economía y telemetría. Evaluar costo, regiones, exportación de datos y soporte antes de fijarlo. Toda moneda, XP y resultado competitivo debe validarse en servidor.

Servicios lógicos:

- Auth/Profile: ID interno, invitado, vinculación y recuperación.
- Player State: avatar, atributos, roster y equipo.
- Match: estado, validación de entradas y resolución.
- Progression: XP, misiones, ligas y temporadas.
- Inventory/Economy: cambios atómicos y ledger de transacciones.
- Social (etapa posterior): amistades propias, clubes y reportes.
- Live Ops: configuración remota, contenido, eventos y mantenimiento.
- Analytics/Crash: eventos mínimos, consentimiento y estabilidad.

### Flujo de partido borrador

`POST /match/start` recibe modo y versión de reglas; responde `matchId`, rival, estado inicial y configuración firmada. `POST /match/input` recibe secuencia, acción, posición normalizada 0..1, tiempo monotónico y nonce. El servidor valida secuencia/rango/tiempo y devuelve estado, evento y hash. `POST /match/finish` liquida recompensas idempotentemente para evitar duplicados en reintentos.

### Datos principales

- `Account`: id, proveedores vinculados, fecha, preferencias y privacidad.
- `PlayerProfile`: avatar, club, nivel, XP y rating de liga.
- `RosterEntry`: jugador, orden, atributos, experiencia y equipo.
- `InventoryItem`: item, cantidad y fuente; ledger separado.
- `Match`: modo, rival, reglas/versionado, resultado, duración y estado.
- `MissionProgress`: misión, avance, periodo y reclamo idempotente.
- `CosmeticLoadout`: avatar, uniforme y estadio.
- `SeasonStanding`: temporada, puntos, rating y división.

No depender de Facebook ni cargar contactos sin autorización explícita. El nuevo juego debe contar con identidad propia.

### Seguridad y operación

TLS, tokens renovables, validación en servidor, límites de frecuencia, idempotencia, registro de transacciones y protección contra replay/automatización. Versionar configuración y contenido. Usar CDN, caché local, backups y flujo de exportación/eliminación de cuenta. No recopilar datos sensibles en crash logs; indicar claramente cuándo se requiere conexión.

## 9. Recursos necesarios

### Arte y audio

- Un personaje base riggeado y piezas modulares; 6–10 opciones iniciales de cabeza/cabello/accesorios.
- Dos clubes ficticios, un estadio modular, campo, dugouts, público de baja densidad e interfaz.
- 8–12 animaciones base: idle, preparación, swing, fallo, contacto, correr, celebrar, reaccionar y home run.
- VFX de contacto, trayectoria, polvo y marcador; iconografía de atributos, misiones y cartas.
- Sonidos de ambiente, público en capas, bate/bola/guante, UI, música de lobby y stingers.
- Guía visual original. No reutilizar logos, personajes, música, capturas ni archivos originales sin licencia.

### Equipo mínimo orientativo

- 1 diseñador de producto/juego.
- 1–2 programadores Unity (gameplay/UI y plataformas).
- 1 artista técnico/3D y 1 animador (combinables para prototipo).
- 1 diseñador UI/UX.
- 1 ingeniero backend parcial en prototipo, dedicado antes de PvP.
- QA de dispositivos Android/PC y pruebas de juego.

### Herramientas

Unity, Git LFS para binarios, gestor de tareas, Figma o equivalente, Blender, audio, CI para builds Windows/Android, Google Play Console y distribución privada de PC para pruebas. Confirmar proveedores luego del prototipo y la estimación de usuarios.

## 10. Controles y requisitos

- Android: arrastre para apuntar y botón swing grande; vibración opcional y objetivos táctiles amplios.
- PC: ratón para apuntar y clic/espacio para swing; alternativa de teclas reasignables.
- Ajuste de sensibilidad, zona muerta, tamaño UI y mapeo de teclas.
- Misma lectura de jugada en ambas plataformas, sin ventajas de timing por dispositivo.
- Meta de sesión: 3–5 minutos. Carga inicial corta y descarga incremental de cosméticos.
- Objetivo: 60 FPS en PC medio; Android a 30 FPS estables en dispositivos acordados y 60 en gama compatible.
- Validar proporciones 16:9 y teléfonos Android comunes, safe areas y escalado.
- Restaurar sesión tras reinicio; conservar progreso en actualizaciones.
- Medir tutorial completado, tiempo al primer partido, abandono por pantalla, duración, repetición, crashes y rendimiento.

## 11. Plan inicial

### Etapa 0 — Preproducción (1–2 semanas)

Definir público, estilo visual, juego individual/social, conexión requerida y presupuesto. Crear mapa de pantallas, controles y matriz de hipótesis. Resolver riesgos de propiedad intelectual, backend, animación y alcance multiplataforma.

**Entregables:** brief, guía visual, matriz confirmado/hipótesis y plan de prueba.

### Etapa 1 — Prototipo de bateo (2–4 semanas)

Una escena con bateador, lanzador, tres lanzamientos, zona/timing y resultados. Entrada de mouse/teclado/touch, cámara y animaciones placeholder. Probar con 5–10 personas y calibrar legibilidad, control y duración.

**Salida:** jugadores entienden el objetivo en menos de un minuto y quieren repetir varios swings.

### Etapa 2 — Vertical slice local (3–5 semanas)

Partido corto contra IA, marcador, outs/bases, resultados y recompensa local. Lobby, avatar modular, roster reducido y misión. Build en Windows y Android, probado en teléfono físico.

**Salida:** partido de 3–5 minutos y bucle de recompensa comprensible.

### Etapa 3 — Progresión y backend (4–8 semanas)

Cuenta, guardado nube, perfil, inventario, XP/moneda autoritativos, entrenamiento y misiones idempotentes. Versionado de datos y configuración remota. Probar reconexión y abuso de solicitudes.

### Etapa 4 — Contenido y alfa cerrada (4–8 semanas)

Pulir personajes, animaciones, estadio, audio, misiones y economía. Agregar PvP asíncrono o ranking sólo si el juego base funciona bien. Hacer pruebas de usabilidad, balance y estabilidad.

### Etapa 5 — Beta y lanzamiento

QA de dispositivos, tiendas, privacidad, soporte, localización, accesibilidad y operación. Lanzamiento gradual, monitorización y rollback de contenido.

Los rangos suponen un equipo pequeño y cambian según la calidad visual, experiencia y alcance online. No incluyen acuerdos de licencias.

## 12. Riesgos y decisiones pendientes

- **Propiedad intelectual:** título, marca, arte, interfaz, texto, personajes y música requieren revisión de derechos. Usar identidad visual y contenido propios; no incluir MLB, equipos o jugadores reales sin licencia.
- **Claridad de béisbol:** comenzar con reglas simplificadas y validar el control antes de construir una simulación completa.
- **Pay-to-win:** limitar ventaja de compras; preferir cosméticos y progreso transparente.
- **Costo online:** empezar con IA y resolución autoritativa; validar retención antes de PvP en vivo.
- **Multiplataforma:** probar Android físico desde el primer prototipo para evitar retrabajo de UI/input.

### Recomendación para iniciar

Título temporal original, arte caricaturesco propio, Unity LTS, una escena de bateo, partido de tres entradas contra IA, sin pagos ni PvP en el prototipo y pruebas en Windows y Android desde etapa 1. Mantener lógica de partido separada de la presentación para poder pasarla a servidor después.

## 13. Fuentes consultadas

1. Syntasia/PRLog, anuncio de beta cerrada, 19 dic. 2011: https://www.prlog.org/11752744-baseball-heroes-free-to-play-baseball-game-on-facebook-commencing-its-closed-beta-test.html
2. Inven, conferencia GameTech 2013: https://www.inven.co.kr/webzine/news/?news=60130
3. Folleto promocional de Baseball Heroes (PDF): https://d21buns5ku92am.cloudfront.net/26496/documents/16099-1324368348-BaseballHeroes_%EA%B2%8C%EC%9E%84%EC%86%8C%EA%B0%9C%EC%84%9C_ENG.pdf
4. Reseña secundaria de 2015: https://facebookgamesreviews.blogspot.com/2015/06/baseball-heroes-mlbp-heroic-facebook.html
5. Registro de metadatos/capturas enlazadas: https://browsercraft.com/game/baseball-heroes--1

**Siguiente paso recomendado:** construir el prototipo de bateo en Unity con una hoja de balance inicial y probarlo en un teléfono Android y una PC.
