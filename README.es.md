# Línea base de seguridad de identidad y autorización para agentes empresariales · Herramienta de autoevaluación

Este proyecto contiene dos partes: un estándar de seguridad sobre identidad y autorización de agentes empresariales y una herramienta estática de autoevaluación que permite contrastar el cumplimiento con dicho estándar. La herramienta no requiere backend, y los datos de evaluación se almacenan únicamente en el navegador del usuario.

## Índice

```
01-标准/        基线正文（Markdown）
02-使用方法/    自评步骤、部署方式、评分规则
03-工具/        静态自评页面、数据、Excel 模板、脚本和部署配置
.github/       GitHub Pages 自动发布工作流
```

## Orden de lectura

1. **[01 Estándar](01-标准/es/企业智能体身份与授权安全基线_v1.0.md)**: «Línea base de seguridad de identidad y autorización para agentes empresariales», versión 1.0. Contiene 240 requisitos, organizados en 10 capítulos y 62 secciones, que se clasifican en tres niveles acumulativos: L1 (base), con 90 requisitos; L2 (estándar), que añade 137 requisitos más sobre los anteriores; y L3 (reforzado), que añade otros 13. La terminología, la arquitectura de referencia, el modelo de amenazas y las correspondencias del anexo se incluyen en este mismo documento.
2. **[02 Instrucciones de uso](02-使用方法/es/使用方法.md)**: cómo realizar la autoevaluación, los tres modos de uso (en línea, sin conexión y despliegue privado), las reglas de puntuación, la publicación en GitHub Pages o Cloudflare Pages y la forma de almacenar los datos.
3. **[03 Guía de la herramienta](03-工具/工具说明/es.md)**: estructura de directorios de la herramienta, comandos habituales, cómo actualizarla tras una revisión de la línea base y componentes de terceros.

## Inicio rápido

- Para realizar la autoevaluación directamente: abra la dirección en línea o, tras descomprimir el zip, haga doble clic en `03-工具/index.html`.
- Para completar la evaluación en Excel: utilice `03-工具/offline/企业智能体身份与授权安全基线_评估表.xlsx`.
- Para desplegar la herramienta: consulte la sección de publicación de [02 Instrucciones de uso](02-使用方法/es/使用方法.md).

## Licencia

La licencia de este repositorio deberá definirse antes de su publicación pública.
