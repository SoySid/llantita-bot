# Llantita

Monitor de precios, alertas por Telegram y catálogo web para calzado en Sporting Argentina.

El sistema consulta el catálogo de zapatillas de la tienda cada 30 minutos, almacena el historial de precios y los talles en una base de datos PostgreSQL, notifica bajas de precio por Telegram y ofrece un catálogo web para revisar ofertas y evolución histórica.

## Componentes

### Scraper y notificaciones (`llantita_bot.py`)
- Consulta la API VTEX de Sporting Argentina y recorre el catálogo de calzado.
- Guarda productos, talles con stock, imágenes del CDN oficial y precios históricos.
- Detecta bajas de precio en talle 43 con stock y envía mensajes a los usuarios suscritos en `@llantita_bot`.
- Corre de forma programada en GitHub Actions cada media hora.

### Catálogo web (`web/`)
- Desarrollado con Next.js 15 (App Router), React 19 y Tailwind CSS.
- Consulta Neon PostgreSQL mediante `@neondatabase/serverless` para listar productos y variaciones de precio.
- Incluye búsqueda por texto y filtros por marcas (Nike, Adidas, Puma, Under Armour, Jordan, New Balance, Asics, Topper, entre otras).
- Filtra por rango de precio y permite ordenar por precio o porcentaje de descuento.
- Presenta carrusel de ofertas, grilla con talles disponibles y modal con gráfico SVG del historial de precios.

## Tecnologías

- Python 3.11 con `requests` y `psycopg2-binary` para el scraper
- Next.js 15, TypeScript y Tailwind CSS para la interfaz web
- Neon PostgreSQL como base de datos compartida
- GitHub Actions para la ejecución periódica
- Telegram Bot API para el canal de alertas

## Estructura del proyecto

```text
llantita-bot/
├── .github/
│   └── workflows/
│       └── scraper.yml
├── web/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   └── tailwind.config.ts
├── llantita_bot.py
├── requirements.txt
└── README.md
```

## Configuración local

### Requisitos
- Python 3.11 o superior
- Node.js 18 o superior con npm
- Base de datos PostgreSQL en Neon o local
- Token de Telegram obtenido en `@BotFather`

### Variables de entorno

Crear un archivo `.env` en la raíz para el script de Python y `.env.local` dentro de `web/` para la app:

```env
DATABASE_URL=postgres://usuario:password@host/database?sslmode=require
TELEGRAM_BOT_TOKEN=tu_token_aqui
```

### Ejecución del scraper

```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python llantita_bot.py
```

### Ejecución de la aplicación web

```bash
cd web
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

## Comandos del bot

El bot `@llantita_bot` en Telegram responde a:

- `/start`: activa la suscripción para recibir alertas cuando baja un precio.
- `/stop` o `/desuscribir`: pausa el envío de alertas.

## Créditos

Desarrollado por [Sid](https://github.com/SoySid).  
Repositorio: [https://github.com/SoySid/llantita-bot](https://github.com/SoySid/llantita-bot)
