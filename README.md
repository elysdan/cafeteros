# Colombia 2026 (Road to World Cup)

Plataforma interactiva para la base de seguidores (Fan Engagement) de la Selección de Fútbol de Colombia, enfocada en la Copa Mundial de la FIFA 2026. Desarrollada con capacidades SSR modernas y construida bajo el ecosistema de **Next.js (App Router)**.

## Stack Tecnológico

El proyecto sigue una arquitectura Fullstack moderna optimizada para Vercel o similares edge-runtimes:

*   **Framework:** Next.js 15 (React 19) con paradigma de **App Router** (`app/`).
*   **Lenguaje:** TypeScript estricto en el 100% del código base para seguridad de tipos end-to-end.
*   **Base de Datos & ORM:** PostgreSQL consumido a través de **Drizzle ORM** (Tipado seguro, migraciones ágiles basadas en código y esquemas relacionales).
*   **Autenticación:** Auth.js v5 (NextAuth) con `@auth/drizzle-adapter`. Gestión por Credentials utilizando `bcryptjs` para el hashing asíncrono de contraseñas.
*   **Estilos:** Tailwind CSS con variables nativas en `globals.css` para implementar una estética estandarizada **Dark Glassmorphism** (fondos translúcidos con `backdrop-filter` e intensos acentos).
*   **Iconografía y Utilidades:** `lucide-react` para iconos semánticos y SVG ligeros y `clsx`/`tailwind-merge` (`cn` util) para resoluciones algorítmicas de clases CSS en componentes cliente/servidor.

## Arquitectura del Proyecto

El código fuente utiliza directivas estrictas (`'use client'`, `'use server'`) para delimitar las fronteras de red e inferir la seguridad de los componentes SSR vs CSR:

```text
colombia-2026/
├── public/                 # Assets estáticos (jugadores WebP pre-cacheados)
├── scripts/                # Scripts Node independientes
│   ├── seed.ts             # Volcado inicial de DB (plantilla, roles 'ENT'/'POR'...)
│   └── setup-db.mjs        # Rutinas tempranas de la capa base de datos provisional
├── src/
│   ├── app/                # Enrutador Físico (App Router)
│   │   ├── (auth)          # Rutas agrupadas para `/login` y `/register`
│   │   ├── api/auth/       # Edge API routes requeridos por NextAuth Auth.js
│   │   ├── comunidad/      # Plataforma X-Like de muro de soporte. Lógica SSR con Server Actions.
│   │   ├── jugadores/      # Feed CSR/SSR de Plantilla.
│   │   │   └── [id]/       # Dynamic Route / Templates para ficha automatizada.
│   │   ├── globals.css     # Design System Core: Variables de paleta de Colombia y utilities.
│   │   ├── layout.tsx      # RootLayout con providers, tipografías Inters/Oswald.
│   │   └── page.tsx        # Homepage (Hero, Carruseles, Countdown)
│   ├── components/
│   │   ├── landing/        # Chunk-Components para Homepage (Carousel, NewsPreview, Hero)
│   │   └── layout/         # Componentes Shell, como Navbar y Footer.
│   ├── db/
│   │   ├── index.ts        # Fichero central que instancia Drizzle
│   │   └── schema.ts       # Single Source Of Truth de PostgreSQL (Tablas y Relaciones PG)
│   └── lib/
│       ├── auth.ts         # Wrapper de configuración NextAuth + Callbacks JWT
│       ├── players-data.ts # Modelos crudos para seeding (Sincronizado)
│       └── utils.ts        # Utils puras de formateo o TailwindMerge
├── .env.local              # Fichero de Secrets locales (Git ignored)
├── drizzle.config.ts       # Directiva interna para el CLI de Drizzle
└── package.json
```

## Patrones de Diseño Implementados

1. **Server Actions First:** En lugar de crear rutas artificiales en `/api` para acciones transaccionales (Ej: Insertar un comentario), utilizamos la directriz `'use server'` dentro de funciones aisladas que se encargan de comunicarse con Drizzle ORM de manera segura. Esto reduce la latencia en saltos de red.
2. **Revalidación en Vivo (`revalidatePath`):** Usada extensamente en las mutaciones (Hypes, Nuevos comentarios en el muro general o perfiles de jugadores) para borrar la caché temporal del CDN en el App Router y causar que la UI se actualice sin recargar estados pesados en el cliente.
3. **Left Joins Optimizados:** Las consultas al muro `/comunidad` y al detalle de `/jugadores/[id]` combinan tablas sin cascadas de N+1 ejecutando query builder queries directas: (`SELECT ... FROM comments LEFT JOIN users ON comments.authorId = users.id WHERE playerId IS NULL`).

## Configuración para Semi-Seniors (Quick Start)

### Requisitos previos
- Node.js LTS (v24 recomendado para entorno local)
- Gestor `pnpm` o `npm`. (Preferentemente pnpm)
- Instancia local de PostgreSQL corriendo o String de base de datos Vercel/Neon/Supabase.

### 1. Variables de Entorno (.env.local)

Necesitas replicar un archivo `.env.local` con las variables núcleo.

```env
# Ejemplo de .env.local
DATABASE_URL="postgresql://postgres:user@localhost:5432/nomberedb"
AUTH_SECRET="cualquier-string-fuerte-generada-con-[openssl rand -base64 32]"
AUTH_URL="http://localhost:3000"
```

### 2. Instalar Dependencias
```bash
pnpm install
```

### 3. Setup de la Base de Datos (Drizzle ORM)
Drizzle se encarga de modelar nuestra BD basándose en el esquema estricto TypeScript:

```bash
# Push el schema actual a tu PostgreSQL en tiempo real (Migración Implícita)
pnpm run db:push

# Vaciar e insertar la plantilla base "Colombia" (incluyendo a Néstor Lorenzo)
npx tsx scripts/seed.ts  # o `pnpm run seed` dependiendo del script configurado
```

### 4. Lanzar el Servidor y Compilar
```bash
# Lanzar el servidor de desarrollo con Hot Reload (Turbopack opcional)
pnpm run dev
```

El proyecto correrá en [http://localhost:3000](http://localhost:3000).

## Decisiones y Contextos a futuro
- **Extensibilidad de Comentarios:** El campo `playerId` y `newsId` en la tabla de `comments` está diseñado para delegar. Si ambos están en `NULL` (como en `/comunidad`), es el canal general. Si `playerId` está asignado como `String`, el front-end empuja renderiza dentro en `/jugadores/[id]`. Altamente escalable.
- **Rendimiento UI:** Casi todos los assets (`public/players`) y los gradientes del UI (`glass-card`) se procesan directamente como clases CSS compuestas en el Server-Side para no penalizar los Web Vitals del LCP (Largest Contentful Paint).
