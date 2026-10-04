# Llantita

Monitor de precios, alertas por Telegram y catálogo web para calzado en Sporting Argentina.

El proyecto rastrea periódicamente el catálogo de zapatillas de la tienda, registra variaciones de precios y disponibilidad de talles en una base de datos PostgreSQL, envía notificaciones automáticas ante bajas de precio y expone una plataforma web para explorar las ofertas y el historial de precios.

## Componentes del sistema

### 1. Scraper y Bot de Telegram (`llantita_bot.py`)
- Consulta la API VTEX de Sporting Argentina recorriendo el catálogo de calzado.
- Guarda y actualiza productos, talles en stock, enlaces a imágenes del CDN oficial y registro histórico de precios.
- Evalúa bajas de precio con stock disponible y envía alertas por Telegram a los usuarios suscritos en `@llantita_bot`.
- Ejecución periódica automatizada mediante GitHub Actions cada 30 minutos.

### 2. Plataforma Web (`web/`)
- Construida con Next.js 15 (App Router), React 19 y Tailwind CSS.
- Conexión serverless a Neon PostgreSQL para consultas directas del catálogo y variaciones de precio.
- Búsqueda en tiempo real y filtrado por marcas (Nike, Adidas, Puma, Under Armour, Jordan, New Balance, Asics, Topper, entre otras).
- Filtros por rango de precio, ordenamiento por precio o porcentaje de descuento.
- Carrusel de ofertas destacadas y grilla responsive de productos con talles disponibles.
- Modal con historial de precios por talle y gráfico de evolución temporal en SVG.

## Stack tecnológico

- **Backend / Scraper:** Python 3.11, `requests`, `psycopg2-binary`.
- **Base de datos:** PostgreSQL en Neon (Serverless).
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, `@neondatabase/serverless`, Lucide Icons.
- **Automatización:** GitHub Actions.
- **Notificaciones:** Telegram Bot API.

## Estructura del proyecto

```text
llantita-bot/
├── .github/
│   └── workflows/
│       └── scraper.yml       # Tarea programada en GitHub Actions
├── web/                      # Aplicación web Next.js
│   ├── src/
│   │   ├── app/              # Rutas y páginas (App Router)
│   │   ├── components/       # Componentes de UI (filtros, cards, modal, footer)
│   │   └── lib/              # Cliente de base de datos y consultas
│   ├── package.json
│   └── tailwind.config.ts
├── llantita_bot.py           # Scraper del catálogo y notificador de Telegram
├── requirements.txt          # Dependencias de Python
└── README.md
```

## Configuración y ejecución local

### Requisitos previos
- Python 3.11+
- Node.js 18+ y npm
- Instancia de PostgreSQL (Neon o local)
- Token de bot de Telegram (mediante `@BotFather`)

### Variables de entorno

Crea un archivo `.env` en la raíz (para el script en Python) y `.env.local` dentro de `web/` (para la app web):

```env
DATABASE_URL=postgres://usuario:password@host/database?sslmode=require
TELEGRAM_BOT_TOKEN=tu_token_aqui
```

### Ejecutar el scraper / bot

```bash
# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar el scraper
python llantita_bot.py
```

### Ejecutar la aplicación web

```bash
cd web
npm install
npm run dev
```

La aplicación quedará disponible en `http://localhost:3000`.

## Comandos de Telegram

El bot público `@llantita_bot` admite los siguientes comandos:

- `/start`: Activa la suscripción para recibir alertas de bajas de precio.
- `/stop` o `/desuscribir`: Pausa las notificaciones para el usuario.

## Créditos

Desarrollado por [Sid](https://github.com/SoySid).  
Repositorio: [https://github.com/SoySid/llantita-bot](https://github.com/SoySid/llantita-bot)
