# Odontología Edith (versión estática para GitHub Pages)

Este paquete es un *clone* 1:1 del cascarón original en Flask, pero 100% HTML/JS estático.
- Tailwind vía CDN
- Páginas: `index.html`, `servicios.html`, `promos.html`, `clinicas.html`, `equipo.html`, `testimonios.html`
- El formulario de contacto emula el *flash* (mensaje verde) con `localStorage` (no envía datos a un servidor).

## Despliegue rápido (GitHub Pages)
1) Crea un repo nuevo y sube estos archivos al *root* (no en subcarpetas).
2) En GitHub: **Settings → Pages →** Source = `Deploy from a branch`, Branch = `main`, Folder = `/root`.
3) Tu sitio quedará en `https://<tu-usuario>.github.io/<tu-repo>/`.

> Si quieres que el formulario envíe datos reales sin backend propio, podrás integrar servicios como Formspree/Formsubmit más adelante cambiando el `action` del `<form>`.

## Estructura
```
/
├─ index.html
├─ servicios.html
├─ promos.html
├─ clinicas.html
├─ equipo.html
├─ testimonios.html
├─ 404.html            # redirige a index
├─ assets/
│  └─ app.js
└─ data/
   ├─ services.csv
   ├─ sedes.csv
   └─ doctores.csv
```
