# Mi Educación — Centro Educativo Salomé Ureña

Página central de recursos interactivos de inglés y francés. Enlaza a cada recurso, alojado en su propio subdominio:

- **`libros.mieducacion.es`** — Libros Interactivos (repo `libros-interactivos`, Netlify)
- **`cuadernos.mieducacion.es`** — Cuadernos Interactivos (repo `cuadernos-interactivos`, Netlify)
- **`verbos.mieducacion.es`** — Verbos Interactivo (repo `verbos-interactivo`, Vercel)

Este repositorio (`mieducacion.es`, dominio raíz) solo contiene la página de inicio — cada recurso vive en su propio repositorio y se despliega por separado. Al agregar un recurso nuevo, se agrega su tarjeta aquí y se crea su propio subdominio.

Sitio 100% estático, sin build ni dependencias.

## Estadísticas (Google Analytics 4)

`analytics.js` lo cargan los 4 sitios (inicio, libros, cuadernos y verbos) con una sola línea en cada página:
`<script src="https://mieducacion.es/analytics.js" defer></script>`

- **Activarlo:** abrir `analytics.js` y poner el ID de medición (empieza con `G-`) en la constante `GA_ID`. Con el valor de ejemplo (`G-XXXXXXXXXX`) no hace nada: ni aviso ni contacto con Google. Después, publicar solo este sitio (inicio); los otros tres toman el cambio solos.
- **Cookies:** Google Analytics no se carga hasta que la persona pulsa "Aceptar" en el aviso. Si rechaza, o su navegador envía Global Privacy Control, no se contacta a Google. Se desactivan las señales de publicidad. La elección se guarda un año y vale para los 4 subdominios; hay un enlace "Cookies" para cambiarla.
- **Eventos propios:** `window.mieTrack(nombre, parametros)` (solo envía si hubo consentimiento). Los juegos de Verbos registran `game_start` y `game_end` (juego, idioma, contenido, equipos, tiempos).
- **Informes:** el nombre de host (inicio, libros, cuadernos, verbos) permite separar los sitios dentro de la misma propiedad.
