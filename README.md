# 🚂 Portal Web Gremial — Gremio Ferroviario

Portal web completo para el gremio ferroviario, construido con **Next.js 14**, **Supabase** y **Tailwind CSS**, listo para deployar en **Vercel**.

---

## Stack tecnológico

| Tecnología | Rol |
|---|---|
| Next.js 14 (App Router) | Frontend + SSR |
| Supabase | Base de datos (PostgreSQL), Auth, Storage, Realtime |
| Tailwind CSS | Estilos |
| Vercel | Deploy y hosting |
| TypeScript | Tipado estático |

---

## Estructura de perfiles

| Perfil | Acceso |
|---|---|
| **Público** (sin login) | Home, Institucional, Noticias, Acuerdos, Registro |
| **Afiliado** (con login) | Todo lo público + Comunicados exclusivos, Calendario, Consultas, Perfil |
| **Admin** | Todo + Panel de administración completo |

---

## Setup paso a paso

### 1. Clonar y configurar

```bash
git clone <repo-url>
cd gremio-web
npm install
cp .env.local.example .env.local
```

### 2. Configurar Supabase

1. Ir a [supabase.com](https://supabase.com) → crear nuevo proyecto
2. Ir a **SQL Editor** → **New query**
3. Pegar el contenido de `supabase_setup.sql` y ejecutar
4. Verificar que aparezcan las **10 tablas** en la consola
5. Ir a **Settings → API** y copiar:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configurar variables de entorno

Editar `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Gremio Ferroviario
```

### 4. Ejecutar en local

```bash
npm run dev
# Abre http://localhost:3000
```

### 5. Crear el primer admin

1. Ir a Supabase → **Authentication → Users → Add user**
2. Crear con email y contraseña del administrador
3. Ir a **SQL Editor** y ejecutar:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'tu-email-admin@gremio.org.ar';
```

4. Ingresar al portal con ese email → será redirigido a `/admin/dashboard`

---

## Deploy en Vercel

### Opción A — Desde Vercel Dashboard (recomendado)

1. Subir el proyecto a GitHub
2. Ir a [vercel.com](https://vercel.com) → **New Project** → importar el repo
3. En **Environment Variables**, cargar las mismas variables de `.env.local`
4. Click en **Deploy** → ¡listo!

### Opción B — CLI

```bash
npm i -g vercel
vercel --prod
```

### Configurar dominio

En Vercel → **Settings → Domains** → agregar tu dominio personalizado.

---

## Estructura de carpetas

```
gremio-web/
├── app/
│   ├── (public)/          # Rutas sin login
│   ├── (afiliado)/        # Rutas para afiliados logueados
│   └── admin/             # Panel de administración
├── components/
│   ├── ui/                # Componentes reutilizables
│   └── layout/            # Header y Footer
├── lib/
│   ├── supabase/          # Clientes Supabase
│   └── utils/             # Helpers
├── types/
│   └── database.ts        # Tipos TypeScript
└── middleware.ts           # Protección de rutas por rol
```

---

## Páginas implementadas

### Públicas
- `/` — Home / Landing
- `/noticias` — Comunicados públicos
- `/acuerdos` — Convenios y acuerdos salariales
- `/institucional` — Historia, autoridades, estatuto, contacto
- `/login` — Login + recuperar contraseña
- `/registro` — Formulario de registro de afiliados

### Afiliados (requieren login)
- `/comunicados-exclusivos` — Todos los comunicados
- `/calendario` — Calendario de eventos
- `/mis-consultas` — Consultas y sugerencias
- `/perfil` — Datos del afiliado

### Admin
- `/admin/dashboard` — Panel principal con métricas
- `/admin/usuarios` — Gestión de usuarios (rol, activar, eliminar)
- `/admin/comunicados` — ABM de comunicados con uploads
- `/admin/calendario` — Gestión de eventos
- `/admin/bandeja` — Consultas con respuesta inline + Realtime
- `/admin/acuerdos` — Subir acuerdos y convenios
- `/admin/institucional` — Editor de contenido

---

## Comandos útiles

```bash
npm run dev       # Desarrollo en localhost:3000
npm run build     # Compilar para producción
npm run lint      # Verificar código
```

---

## Variables de entorno para Vercel

Cargar estas en Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL          (URL de producción, ej: https://gremio.org.ar)
NEXT_PUBLIC_APP_NAME
```

---

## Notas de seguridad

- `SUPABASE_SERVICE_ROLE_KEY` **nunca** debe usarse en componentes del cliente
- La protección real de datos está implementada en **Row Level Security (RLS)** en Supabase
- El middleware de Next.js agrega una capa adicional de redirección en el frontend
- Los documentos privados se sirven con **signed URLs** con expiración

---

*Versión 1.0 — Marzo 2026*
