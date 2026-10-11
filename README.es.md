# Línea base de seguridad de identidad y autorización para agentes empresariales · Herramienta de autoevaluación

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · **Español**

Este proyecto contiene dos partes: un estándar de seguridad sobre identidad y autorización de agentes empresariales y una herramienta estática de autoevaluación que permite contrastar el cumplimiento con dicho estándar. La herramienta no requiere backend, y los datos de evaluación se almacenan únicamente en el navegador del usuario.

## Índice

```
01-standard/   Texto de la línea base (Markdown)
02-usage/      Pasos de autoevaluación, despliegue, reglas de puntuación
03-tool/       Página estática de autoevaluación, datos, plantilla Excel, scripts y configuración de despliegue
.github/       Flujo de publicación automática en GitHub Pages
```

## Orden de lectura

1. **[01 Estándar](01-standard/es/baseline-v1.0.md)**: «Línea base de seguridad de identidad y autorización para agentes empresariales», versión 1.0. Contiene 240 requisitos, organizados en 10 capítulos y 62 secciones, que se clasifican en tres niveles acumulativos: L1 (base), con 90 requisitos; L2 (estándar), que añade 137 requisitos más sobre los anteriores; y L3 (reforzado), que añade otros 13. La terminología, la arquitectura de referencia, el modelo de amenazas y las correspondencias del anexo se incluyen en este mismo documento. La versión en chino de la línea base es la de referencia; las demás versiones son traducciones.
2. **[02 Instrucciones de uso](02-usage/es/usage.md)**: cómo realizar la autoevaluación, los tres modos de uso (en línea, sin conexión y despliegue privado), las reglas de puntuación, la publicación en GitHub Pages o Cloudflare Pages y la forma de almacenar los datos.
3. **[03 Guía de la herramienta](03-tool/docs/es.md)**: estructura de directorios de la herramienta, comandos habituales, cómo actualizarla tras una revisión de la línea base y componentes de terceros.

## Inicio rápido

- Para realizar la autoevaluación directamente: abra la dirección en línea o, tras descomprimir el zip, haga doble clic en `03-tool/index.html`.
- Para completar la evaluación en Excel: utilice `03-tool/offline/baseline-assessment.xlsx`.
- Para desplegar la herramienta: consulte la sección de publicación de [02 Instrucciones de uso](02-usage/es/usage.md).

## Licencia

La licencia de este repositorio deberá definirse antes de su publicación pública.
