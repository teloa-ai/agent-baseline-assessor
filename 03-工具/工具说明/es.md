# 03 Guía de la herramienta

Este documento va dirigido a los responsables del mantenimiento y describe la estructura del repositorio, la función de cada script, cómo actualizar los datos tras una revisión de la línea base y los componentes de terceros utilizados. Para el uso de la herramienta, véase [02 Instrucciones de uso](../../02-使用方法/es/使用方法.md).

## 1. Estructura de directorios

El directorio en el que se encuentra este archivo es la raíz de la herramienta; todas las rutas y comandos de este documento parten de `03-工具/`.

```
index.html               Punto de entrada de la página
assets/
  app.js                 Interfaz e interacción
  i18n.js                Multilingüe: detección, cambio de idioma y traducciones (página y Node)
  score.js               Reglas de puntuación (página y Node)
  charts.js              Gráficos de radar, de brechas y de distribución (SVG puro)
  workbook.js            Generación y lectura de Excel (página y Node)
  styles.css
data/
  baseline.json          Datos de la línea base: capítulos, secciones, requisitos, niveles, componentes de aplicación, puntos de control
  baseline.js            Los mismos datos, para abrir la página sin conexión con doble clic
  i18n.<idioma>.js       Diccionarios generados a partir de i18n/<idioma>.json y cargados por la página
i18n/
  <idioma>.json          Diccionario por idioma: texto original en chino → traducción
  glossary.md            Tabla terminológica de los siete idiomas
  source-baseline.json   Cadenas en chino de los datos de la línea base que requieren traducción
vendor/exceljs.min.js    ExcelJS 4.4.0 (MIT), se carga solo al importar o exportar Excel
vendor/fonts/            Subconjunto latino de IBM Plex (OFL), cargado localmente, sin conexiones externas
offline/                 Hoja de evaluación Excel sin conexión (chino)
tools/                   Scripts de generación (datos, diccionarios, plantilla), autoprueba, verificación cruzada de fórmulas de Excel
deploy/                  Configuración de nginx y Dockerfile
工具说明/                 Esta guía en cada idioma
_headers                 Encabezados de seguridad para Cloudflare Pages
```

## 2. Comandos habituales

| Comando | Función |
| --- | --- |
| `npm install` | Instala las dependencias (ExcelJS, utilizado únicamente para generar y validar los Excel) |
| `npm run build:xlsx` | Regenera la hoja de evaluación sin conexión de `offline/` |
| `npm run build:i18n` | Regenera `data/i18n.*.js` a partir de `i18n/*.json`; ejecutar tras modificar un diccionario |
| `npm test` | Comprueba las reglas de puntuación y la ida y vuelta con Excel, y que cada diccionario cubra todos los textos de la interfaz y de la línea base |
| `npm run check:xlsx` | Recalcula de forma independiente, con LibreOffice, las fórmulas del Excel exportado y las compara celda por celda con la puntuación de la página web (requiere tener LibreOffice instalado en el equipo) |

## 3. Actualización de la línea base

Cuando se revise el documento de la línea base, actualice la herramienta en tres pasos:

1. Exporte a Markdown el documento de la línea base y ejecute `python3 tools/build_data.py <archivo-exportado> --version 1.1 --date 2026-12-01` para regenerar `data/baseline.json` y `data/baseline.js`. El script comprueba, entre otros aspectos, la duplicidad y el orden de los identificadores, los niveles sin marcar, la falta de acumulación entre niveles y la ausencia de componentes de aplicación. De acuerdo con el apartado 6.4 de la línea base, los identificadores eliminados no se reutilizan, por lo que se admiten saltos en la numeración. Además, compara con las secciones 4.2 y 4.3 del documento las suposiciones de confianza de los componentes y los puntos de control redactados manualmente, y avisa si hay discrepancias.
2. Si se han añadido o modificado requisitos, actualice en paralelo los componentes de aplicación de cada sección en `tools/component_map.py`, correspondiéndolos uno a uno según el orden dentro de cada sección.
3. Ejecute `npm install` y `npm run build:xlsx` para regenerar la hoja de evaluación sin conexión, y a continuación `npm test` para la autocomprobación.

Los JSON de evaluación existentes se asocian a la nueva versión según sus identificadores; los identificadores que no existan en la línea base se ignoran al importar y se muestra un aviso.

Asimismo, sustituya el texto de `01-标准/` del repositorio por la nueva versión y actualice el número de versión en el README.

## 4. Multilingüe

Los textos de la interfaz usan el texto original en chino como clave. Las traducciones de cada idioma están en `i18n/<idioma>.json`; si falta una traducción, se muestra el texto en chino. Idiomas admitidos: zh-CN, en, ja, ko, de, fr, es.

- **Modificar una traducción**: editar `i18n/<idioma>.json`, regenerar `data/i18n.<idioma>.js` con `npm run build:i18n` y ejecutar `npm test`.
- **Cuando cambian textos de la interfaz o requisitos de la línea base**: ejecutar `npm test`, que enumera por idioma las cadenas en chino que faltan; completarlas y regenerar los diccionarios. La terminología sigue `i18n/glossary.md`. Tras una revisión de la línea base, actualizar también las traducciones de `01-标准/`.
- **Añadir un idioma**: registrar el código y el nombre del idioma en `LOCALES` (`assets/i18n.js`), crear `i18n/<idioma>.json`, añadir `data/i18n.<idioma>.js` en `index.html` y completar las traducciones como se indica arriba. Las traducciones de la línea base, de las instrucciones de uso y de esta guía van en `01-标准/<idioma>/`, `02-使用方法/<idioma>/` y `工具说明/<idioma>.md`.

## 5. Componentes de terceros

- [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0, con licencia MIT; el texto de la licencia se encuentra en `vendor/exceljs.LICENSE`.
- Subconjunto de caracteres latinos de [IBM Plex Sans / Mono](https://github.com/IBM/plex), con licencia SIL Open Font License 1.1; el texto de la licencia se encuentra en `vendor/fonts/OFL.txt`. Para el texto en chino se utilizan las fuentes del sistema (PingFang, Microsoft YaHei o Source Han Sans).
