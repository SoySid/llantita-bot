<div align="center">

  <img src="logo.jpg" alt="Michi Llantita" width="130" height="130" style="border-radius: 50%;" />

  # 🐾 Llantita

  **Monitor de precios, alertas por Telegram y catálogo web en vivo**

  [![Sitio Web](https://img.shields.io/badge/🌐_Web_en_Producción-llantita--bot.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://llantita-bot.vercel.app/)
  [![Telegram Bot](https://img.shields.io/badge/📱_Bot_Telegram-@llantita__bot-229ED9?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/llantita_bot)
  [![GitHub Repo](https://img.shields.io/badge/Código-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SoySid/llantita-bot)

  <br />

  ```text
       /\_/\  
      ( o.o )  👟 🐾 "¡Che, mirá que bajó de precio!"
       > ^ <
  ```

</div>

---

## 🌐 Plataforma web

Puedes consultar el catálogo en tiempo real, filtrar marcas y ver las variaciones históricas de precio directamente en la web:

👉 **[https://llantita-bot.vercel.app/](https://llantita-bot.vercel.app/)**

---

## 🔄 Flujo del sistema

<p align="center">
  <img src="assets/michi-banner.svg" alt="Diagrama de flujo del sistema Llantita" width="100%" />
</p>

1. **Scraper VTEX (`llantita_bot.py`):** consulta periódicamente el catálogo de zapatillas en Sporting Argentina cada 30 minutos a través de GitHub Actions.
2. **Base de datos (Neon PostgreSQL):** guarda productos, talles con stock, fotos oficiales del CDN y el historial de precios.
3. **Alertas automáticas en Telegram:** si detecta una baja de precio con stock en talle 43, envía una notificación inmediata a los usuarios de [@llantita_bot](https://t.me/llantita_bot).
4. **Catálogo web en Vercel:** interfaz interactiva construida con Next.js 15 para explorar todo el calzado registrado.

---

## 👟 Características de la web

- **Filtros por marca:** selector rápido para Nike, Adidas, Jordan, Puma, Under Armour, New Balance, Asics, Topper, Vans, Fila, entre otras.
- **Buscador en tiempo real:** filtrado por modelo o palabra clave sin recargar la página.
- **Rango de precios y ordenamiento:** permite ordenar por menor/mayor precio y por porcentaje de descuento.
- **Historial de precios:** modal interactivo con gráfico SVG temporal para ver la evolución del precio de cada zapatilla según su talle.
- **Enlaces directos:** acceso a la publicación oficial de Sporting para comprar al precio de oferta.

---

## 🤖 Comandos en Telegram

Cualquier persona puede interactuar con el bot público [@llantita_bot](https://t.me/llantita_bot):

- `/start` — Activar la suscripción para recibir alertas de bajas de precio.
- `/stop` o `/desuscribir` — Pausar las alertas de ofertas.

---

## 🛠️ Tecnologías

- **Scraper & Bot:** Python 3.11, `requests`, `psycopg2-binary`
- **Frontend Web:** Next.js 15, React 19, TypeScript, Tailwind CSS, `@neondatabase/serverless`
- **Base de datos:** Neon PostgreSQL
- **Infraestructura:** Vercel (Web) + GitHub Actions (Automatización periódica)

---

<div align="center">
  Desarrollado por <strong><a href="https://github.com/SoySid">Sid</a></strong> · <a href="https://github.com/SoySid/llantita-bot">github.com/SoySid/llantita-bot</a>
</div>
