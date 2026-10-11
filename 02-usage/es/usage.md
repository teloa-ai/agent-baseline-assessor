# 02 Instrucciones de uso

Este documento explica cómo realizar una evaluación contrastando con la línea base mediante la herramienta de autoevaluación, en sus tres modos de uso (en línea, sin conexión y despliegue privado), así como las reglas de puntuación y la forma en que se almacenan los datos. La estructura de directorios de la herramienta y su método de mantenimiento se describen en [03 Guía de la herramienta](../../03-tool/docs/es.md).

## Ejemplo de evaluación

Las capturas siguientes (en inglés) se generaron con los datos simulados incluidos. No evalúan Teloa ni una plataforma real.

![Informe simulado (en inglés): L1 alcanzado, objetivo L2, aproximadamente 79 %, 47 brechas](../assets/maturity-report.en.png)

Se cumplen los 90 requisitos L1. De los 137 adicionales de L2, se cumplen 90, se cumplen parcialmente 20, no se cumplen 17 y hay 10 sin evaluar. En el objetivo se cumplen 180 de 227, mostrado como 79 %; faltan 47 para L2. Los 13 requisitos L3 no están evaluados y se excluyen de la tasa del objetivo L2.

![Detalle de la matriz de cobertura simulada (en inglés)](../assets/coverage-matrix.en.png)

### Reproducir las capturas

1. Descargue el [JSON de evaluación de ejemplo](../examples/demo-assessment.json).
2. Importe el archivo en la página Datos de la herramienta. La importación reemplaza la evaluación actual; exporte primero los datos existentes como JSON.
3. Abra el informe para revisar la madurez y los gráficos, y la matriz de cobertura para localizar las brechas.

## 1. Tres modos de uso

### 1.1 En línea

Puede publicarse en GitHub Pages o en Cloudflare Pages; ambos ofrecen un plan gratuito. Los pasos se describen en la sección 4. Cloudflare Pages lee el archivo `_headers` situado en `03-tool/` y aplica las mismas cabeceras de respuesta de seguridad que la configuración de nginx; GitHub Pages no admite cabeceras de respuesta personalizadas.

### 1.2 Sin conexión

Existen dos formas.

- **Página sin conexión**: descargar el archivo zip del repositorio, descomprimirlo y hacer doble clic en `03-tool/index.html` para utilizarla. Su funcionalidad es idéntica a la de la versión en línea.
- **Excel sin conexión**: completar directamente `03-tool/offline/baseline-assessment.xlsx`. La hoja incluye listas desplegables, fórmulas de resumen y estadísticas de brechas. Una vez completada, puede volver a importarse en la página web para continuar la evaluación.

### 1.3 Despliegue privado

La página consiste en archivos estáticos puros, que cualquier servidor de archivos estáticos puede alojar. El repositorio incluye una configuración de imagen de nginx que se ejecuta con un usuario sin privilegios de root y cuya Política de seguridad de contenidos (CSP) impide que la página se conecte a ninguna dirección externa:

```bash
cd 03-tool && docker build -f deploy/Dockerfile -t agent-baseline-assessor .
docker run -d -p 8080:8080 --read-only --tmpfs /tmp agent-baseline-assessor
```

Si no se utiliza Docker, basta con copiar a la raíz web los elementos `index.html`, `assets/`, `data/`, `vendor/` y `offline/` que se encuentran en `03-tool/`. Se recomienda aplicar también las cabeceras de respuesta de seguridad de `deploy/nginx.conf`. Los tipos MIME se mantienen con el archivo `mime.types` que incluye nginx; no debe definirse un bloque `types {}` en el bloque server, porque sobrescribiría toda la tabla y la página se descargaría como archivo en lugar de mostrarse.

## 2. Funciones

| Página | Funciones |
| --- | --- |
| Matriz de cobertura | En la parte superior se muestra el nivel alcanzado actualmente y el grado de cumplimiento de los tres niveles L1, L2 y L3. Al consultar por capítulo, cada fila corresponde a un capítulo y cada celda a una sección; la barra de color segmentada en la parte inferior de cada celda muestra el estado de cada requisito. Al cambiar a «Componente × capítulo» se muestra un mapa de calor con la tasa de cumplimiento de cada componente de aplicación en cada capítulo. Al hacer clic en una celda se puede evaluar cada requisito por separado |
| Evaluación por requisito | Permite filtrar por capítulo, componente, nivel, estado y palabras clave, marcar el estado y registrar las evidencias, el responsable y la fecha prevista de finalización. Las secciones que no sean aplicables pueden marcarse completas |
| Informe de evaluación | Presenta primero las conclusiones: escalera de madurez, número de requisitos que faltan para alcanzar el siguiente nivel, tasa de cumplimiento dentro del nivel objetivo, entradas de brecha y avance de la evaluación; a continuación enumera los requisitos de atención prioritaria. Los gráficos incluyen el radar de tasa de cumplimiento (por capítulo o por componente), la madurez por capítulo y la distribución de brechas, y todos pueden descargarse en PNG o SVG. Además, se incluyen una tabla estadística por componente y la lista completa de brechas |
| Datos | Introducir la información de la evaluación; exportar a JSON o Excel; importar JSON o Excel sin conexión; cargar el resultado anterior para comparar; borrar la evaluación actual |

El Excel exportado y la plantilla sin conexión tienen la misma estructura y contienen cinco hojas: evaluación, resumen (las fórmulas se recalculan en tiempo real según el estado, y el nivel objetivo puede cambiarse mediante una lista desplegable), lista de brechas, perspectiva de arquitectura y notas.

## 3. Reglas de puntuación

- **Tasa de cumplimiento** = requisitos satisfechos ÷ requisitos aplicables, contabilizando únicamente los requisitos dentro del nivel objetivo. Los requisitos parcialmente satisfechos y los no evaluados se contabilizan como no satisfechos.
- **Alcance de un nivel**: un nivel se considera alcanzado únicamente cuando todos los requisitos aplicables de ese nivel y de los inferiores están satisfechos; basta con que falte uno para quedarse por debajo de ese nivel.
- **Entradas de brecha**: requisitos aplicables dentro del nivel objetivo que todavía no están satisfechos.
- **No aplicable**: cuando la plataforma no dispone de una capacidad (por ejemplo, si no admite MCP), la sección correspondiente se marca completa como no aplicable y no se incluye en la tasa de cumplimiento.

La página web y el Excel aplican las mismas reglas. En Excel, si el estado se deja vacío o se introduce un valor distinto de los de la lista desplegable, se considera no evaluado.

## 4. Publicación

### 4.1 Publicación en GitHub Pages

1. Crear un repositorio y enviar todo el proyecto a la rama `main`. El flujo de trabajo accede automáticamente a `03-tool/` para la compilación.
2. En el repositorio, en Settings → Pages → Build and deployment, seleccionar **GitHub Actions** como Source.
3. A partir de entonces, cada envío a `main` ejecuta `.github/workflows/pages.yml`, que regenera la hoja de evaluación sin conexión, ejecuta la autocomprobación y publica únicamente los archivos necesarios para la página. El trabajo de compilación solo tiene permisos de lectura y, al instalar dependencias, no ejecuta los scripts de instalación; el trabajo de publicación no ejecuta código de terceros.

Las cuentas gratuitas de GitHub solo pueden activar Pages en repositorios públicos. Si la línea base todavía no es pública, puede optarse por el despliegue privado o por GitHub Enterprise, que admite Pages en repositorios privados.

### 4.2 Publicación en Cloudflare Pages

Elija una de las dos opciones.

- **Conectar un repositorio de GitHub**: en el panel de Cloudflare, Workers & Pages → Crear → Pages → Conectar Git, y seleccionar este repositorio. En Root directory (directorio raíz) introducir `03-tool`, en el comando de compilación `mkdir -p _site && cp -r index.html _headers assets data vendor offline _site/` y en el directorio de salida `_site`. A partir de entonces, cada envío se publica automáticamente.
- **Carga directa desde la línea de comandos**, sin conectar Git: ejecutar el comando de compilación anterior en el directorio `03-tool/` y, a continuación, `npx wrangler pages deploy _site --project-name agent-baseline-assessor`.

La dirección publicada es `https://<nombre-del-proyecto>.pages.dev`, aunque también puede vincularse a un dominio propio. Si solo se desea el acceso interno de la empresa, puede añadirse una capa de Cloudflare Access que exija autenticarse previamente con el correo corporativo o con un IdP.

## 5. Datos y privacidad

- Los datos de evaluación permanecen en el localStorage del navegador y no se suben. La versión en línea solo carga recursos estáticos, como páginas, imágenes y fuentes, sin código de análisis ni telemetría.
- El almacenamiento local se aísla por origen, no por directorio. Los proyectos bajo `security.teloa.ai` comparten un origen, al igual que los proyectos de GitHub Pages bajo `<cuenta>.github.io`; otras páginas del mismo origen pueden leer estos datos. Las páginas file:// de Chrome también pueden compartir almacenamiento. Para evaluaciones sensibles, usar un dominio dedicado o un despliegue privado.
- Cambiar de la antigua dirección de GitHub Pages al nuevo dominio no migra automáticamente los datos de evaluación. Exportar el JSON en la dirección antigua e importarlo en la nueva.
- Antes de cambiar de equipo, borrar los datos del navegador o encargar a otra persona la revisión, conviene exportar el JSON desde la página «Datos».
- Al importar un archivo, solo se aceptan los identificadores de requisito existentes en la línea base y los valores de estado conocidos; el resto del contenido se ignora. Todo el texto mostrado se escapa antes de renderizarse.

## 6. Idiomas

La página está disponible en 简体中文, English, 日本語, 한국어, Deutsch, Français y Español. El idioma se cambia en la esquina superior derecha, sin afectar a la evaluación ya introducida. La primera visita usa chino simplificado de forma predeterminada; se recuerda el idioma seleccionado manualmente; añadir `?lang=es` (o `zh-CN`, `en`, `ja`, `ko`, `de`, `fr`) a la dirección abre directamente un idioma concreto. Los archivos Excel exportados usan el idioma actual, y se pueden importar archivos exportados en cualquier idioma. La hoja sin conexión de `offline/` está en chino; para los demás idiomas, usar **Descargar la hoja de evaluación en blanco** en la página **Datos**.
