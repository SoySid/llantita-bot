# 👟 Llantita Bot - Monitor de Precios

Bot de Telegram público (**[@llantita_bot](https://t.me/llantita_bot)**) para rastrear el catálogo de **zapatillas de hombre** en [Sporting Argentina](https://www.sporting.com.ar). Revisa la tienda cada media hora y manda una alerta automática a cualquier usuario suscrito al bot en Telegram cada vez que un precio baja.

## ¿Cómo funciona?

1. Consulta la API interna de la tienda en un barrido secuencial página por página para extraer todo el catálogo de calzado masculino.
2. Cruza los precios obtenidos contra la base de datos directamente en RAM. Solo registra cambios si un precio bajó o si entró una zapatilla nueva, evitando escrituras innecesarias en la base de datos.
3. Si detecta una oferta, le manda un mensaje formateado en HTML a todos los usuarios suscritos con el precio viejo, el precio nuevo y el enlace directo al producto.
4. Maneja reintentos automáticos si la tienda tira errores intermitentes (como rate limits `429` o caídas del servidor `500`), salteando páginas rotas para no frenar la ejecución.

## Stack utilizado

- **Python 3.11** (`requests`, `psycopg2`)
- **PostgreSQL** alojado en Neon (Serverless)
- **Telegram Bot API** (`@llantita_bot`)
- **GitHub Actions** para la ejecución programada en la nube

## Comandos de Telegram

Cualquier persona puede buscar a **@llantita_bot** en Telegram y usar los siguientes comandos:

- `/start` - Suscribirse a las alertas de ofertas.
- `/stop` o `/desuscribir` - Pausar las notificaciones.
