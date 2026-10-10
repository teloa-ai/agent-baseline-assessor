# 03 Guía de la herramienta

Este documento va dirigido a los responsables del mantenimiento y describe la estructura del repositorio, la función de cada script, cómo actualizar los datos tras una revisión de la línea base y los componentes de terceros utilizados. Para el uso de la herramienta, véase [02 Instrucciones de uso](../../02-使用方法/es/使用方法.md).

## 1. Estructura de directorios

El directorio en el que se encuentra este archivo es la raíz de la herramienta; todas las rutas y comandos de este documento parten de `03-工具/`.

```
index.html               页面入口
assets/
  app.js                 界面与交互
  score.js               评分规则（网页与 Node 共用）
  charts.js              雷达图、差距图、分布图（纯 SVG）
  workbook.js            Excel 生成与读取（网页与 Node 共用）
  styles.css
data/
  baseline.json          基线数据：章、小节、要求、等级、落点组件、检查点
  baseline.js            同一份数据，供离线双击打开时使用
vendor/exceljs.min.js    ExcelJS 4.4.0（MIT），仅在导入导出 Excel 时加载
vendor/fonts/            IBM Plex 拉丁字符子集（OFL），本地加载，不连外网
offline/                 离线 Excel 评估表
tools/                   数据与模板生成脚本、自检、Excel 公式交叉核对
deploy/                  nginx 配置与 Dockerfile
_headers                 Cloudflare Pages 的安全响应头
.github/workflows/       GitHub Pages 自动发布
```

## 2. Comandos habituales

| Comando | Función |
| --- | --- |
| `npm install` | Instala las dependencias (ExcelJS, utilizado únicamente para generar y validar los Excel) |
| `npm run build:xlsx` | Regenera la hoja de evaluación sin conexión de `offline/` |
| `npm test` | Verifica la lectura y escritura de ida y vuelta entre los datos y el Excel |
| `npm run check:xlsx` | Recalcula de forma independiente, con LibreOffice, las fórmulas del Excel exportado y las compara celda por celda con la puntuación de la página web (requiere tener LibreOffice instalado en el equipo) |

## 3. Actualización de la línea base

Cuando se revise el documento de la línea base, actualice la herramienta en tres pasos:

1. Exporte a Markdown el documento de la línea base y ejecute `python3 tools/build_data.py <导出文件> --version 1.1 --date 2026-12-01` para regenerar `data/baseline.json` y `data/baseline.js`. El script comprueba, entre otros aspectos, la duplicidad y el orden de los identificadores, los niveles sin marcar, la falta de acumulación entre niveles y la ausencia de componentes de aplicación. De acuerdo con el apartado 6.4 de la línea base, los identificadores eliminados no se reutilizan, por lo que se admiten saltos en la numeración. Además, compara con las secciones 4.2 y 4.3 del documento las suposiciones de confianza de los componentes y los puntos de control redactados manualmente, y avisa si hay discrepancias.
2. Si se han añadido o modificado requisitos, actualice en paralelo los componentes de aplicación de cada sección en `tools/component_map.py`, correspondiéndolos uno a uno según el orden dentro de cada sección.
3. Ejecute `npm install` y `npm run build:xlsx` para regenerar la hoja de evaluación sin conexión, y a continuación `npm test` para la autocomprobación.

Los JSON de evaluación existentes se asocian a la nueva versión según sus identificadores; los identificadores que no existan en la línea base se ignoran al importar y se muestra un aviso.

Asimismo, sustituya el texto de `01-标准/` del repositorio por la nueva versión y actualice el número de versión en el README.

## 4. Componentes de terceros

- [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0, con licencia MIT; el texto de la licencia se encuentra en `vendor/exceljs.LICENSE`.
- Subconjunto de caracteres latinos de [IBM Plex Sans / Mono](https://github.com/IBM/plex), con licencia SIL Open Font License 1.1; el texto de la licencia se encuentra en `vendor/fonts/OFL.txt`. Para el texto en chino se utilizan las fuentes del sistema (PingFang, Microsoft YaHei o Source Han Sans).
