# Regla de Desarrollo: Web & Servidor Local (Next.js)

Esta regla aplica cada vez que se trabaje en la interfaz o archivos de la página web (`web/`) o cuando el usuario indique frases como **"abre local host"**, **"prende local host"**, **"localhost"** o solicitudes afines.

---

## 1. Acción Inmediata: Apertura y Encendido de Localhost (Ultra Rápido)
- Ante comandos como *"abre local host"*, *"prende local host"* o similares:
  1. **Cero investigación previa:** Prohibido terminantemente leer READMEs, listar directorios (`dir`, `Get-ChildItem`), chequear puertos o buscar procesos. Asumir directamente que el proyecto web está en `d:\Proyectos\llantita-bot\web` y corre en el puerto 3000.
  2. **Levantar servidor (si no está activo):** Lanzar de inmediato `cmd.exe /c "cd /d d:\Proyectos\llantita-bot\web && npm run dev"` como daemon (`IsDaemon=true`).
  3. **Abrir navegador al instante:** Ejecutar `cmd.exe /c start http://localhost:3000` de forma no bloqueante.
  4. **Respuesta quirúrgica:** Responder de inmediato con el enlace directo [http://localhost:3000](http://localhost:3000) sin preámbulos ni explicaciones.

## 2. Iteración sin Commits Intermedios
- Durante el desarrollo y pruebas:
  - Realizar las modificaciones necesarias en el código directamente.
  - **No realizar commits intermedios** mientras se esté iterando o modificando componentes.

## 3. Cierre y Entrega del Trabajo
- Una vez finalizada la actividad o requerimiento:
  1. **Commit detallado:** Generar un commit con mensaje descriptivo bajo estándar Conventional Commits en español, a nombre de Alfredo Lopez (`soysidarg@gmail.com`).
  2. **Push a remoto:** Ejecutar `git push`.
  3. **Cierre de Localhost (por defecto):** Detener/cerrar el proceso del servidor local (`manage_task` kill), **a menos que** el usuario especifique explícitamente mantenerlo encendido (ej. *"haz commit y push sin apagar el local host"*).
