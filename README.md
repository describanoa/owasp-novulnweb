# 🔒 OWASP Top 10 - Secure Web Application

Una aplicación web que implementa correctamente las mitigaciones para **vulnerabilidades del OWASP Top 10 2021**.

# Astro Starter Kit: Basics

```sh
pnpm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Tech Stack

- [![Astro][astro-badge]][astro-url] - Framework moderno para crear sitios web rápidos y optimizados, enfocado en el contenido.

- [![TypeScript][typescript-badge]][typescript-url] - Superset de JavaScript que añade tipado estático y mejora la calidad del código.

- [![Tailwind CSS][tailwind-badge]][tailwind-url] - Framework CSS orientado a utilidades que permite construir interfaces personalizadas de forma ágil.

- [![Express][express-badge]][express-url] - Framework minimalista para Node.js que facilita la creación de APIs y aplicaciones web.

- [![MongoDB][mongodb-badge]][mongodb-url] - Base de datos NoSQL orientada a documentos, ideal para aplicaciones modernas y escalables.

[astro-badge]: https://img.shields.io/badge/Astro-BC52EE?logo=astro&logoColor=fff&style=flat

[astro-url]: https://astro.build//

[typescript-badge]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=flat

[typescript-url]: https://www.typescriptlang.org/

[tailwind-badge]: https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff&style=flat

[tailwind-url]: https://tailwindcss.com/

[express-badge]: https://img.shields.io/badge/Express-000000?logo=express&logoColor=fff&style=flat

[express-url]: https://expressjs.com/

[mongodb-badge]: https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff&style=flat

[mongodb-url]: https://www.mongodb.com/

## 📂 Project Structure

```text
/
├── backend/
│   ├── auth.ts
│   ├── db.ts
│   ├── server.ts
│   ├── utils.ts
│   └── vulnerabilities/
│       ├── data/
│       │   ├── A01-broken-access-control.ts
│       │   ├── A02-cryptographic-failures.ts
│       │   ├── A03-injection.ts
│       │   ├── A04-insecure-design.ts
│       │   ├── A05-security-misconfiguration.ts
│       │   ├── A06-vulnerable-components.ts
│       │   ├── A07-identification-failures.ts
│       │   ├── A08-integrity-failures.ts
│       │   ├── A09-logging-failures.ts
│       │   └── A10-ssrf.ts
│       ├── index.ts
│       ├── routes.ts
│       └── types.ts
├── logs/
├── public/
│   ├── A01.webp ... A10.webp
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── gl/
│   │   │   ├── index.tsx
│   │   │   ├── particles.tsx
│   │   │   └── shaders/
│   │   │       ├── pointMaterial.ts
│   │   │       ├── simulationMaterial.ts
│   │   │       ├── utils.ts
│   │   │       └── vignetteShader.ts
│   │   ├── AdminPanel.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── LoginForm.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── VulnerabilityGrid.tsx
│   │   └── Welcome.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── vulnerabilities/
│   │   │   ├── [id].astro
│   │   │   └── index.astro
│   │   ├── admin.astro
│   │   ├── index.astro
│   │   ├── login.astro
│   │   ├── profile.astro
│   │   ├── register.astro
│   │   └── scripts.astro
│   └── styles/
│       └── global.css
├── uploads/
├── .env.example
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── README.md
├── tailwind.config.mjs
└── tsconfig.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🛡️ OWASP Top 10 Mitigations

Este proyecto implementa mitigaciones para:

- ✅ **A01:2021** – Broken Access Control
- ✅ **A02:2021** – Cryptographic Failures
- ✅ **A03:2021** – Injection
- ✅ **A04:2021** – Insecure Design
- ✅ **A05:2021** – Security Misconfiguration
- ✅ **A06:2021** – Vulnerable and Outdated Components
- ✅ **A07:2021** – Identification and Authentication Failures
- ✅ **A08:2021** – Software and Data Integrity Failures
- ✅ **A09:2021** – Security Logging and Monitoring Failures

> 📄 Accede a `/scripts` para ver comandos curl que prueban cada mitigación.

## 🧑‍💻 Desarrollo Local

> [!IMPORTANT]
> Requerimientos: Tener instalados [Node.js][node-url] y [pnpm][pnpm-url].

[pnpm-url]: https://pnpm.io/
[node-url]: https://nodejs.org/

<details>
    <summary>Script automatizado...</summary>

- **Linux/MacOS:**
  ```bash
  git clone https://github.com/describanoa/owasp-novulnweb.git &&
  cd owasp-novulnweb &&
  cp .env.example .env &&
  pnpm install &&
  open "http://localhost:4321" &&
  pnpm run dev:all
  ```
- **Windows (PowerShell / VS Code Terminal):**
  ```powershell
  git clone https://github.com/describanoa/owasp-novulnweb.git;
  cd owasp-novulnweb;
  copy .env.example .env;
  pnpm install;
  Start-Process "http://localhost:4321";
  pnpm run dev:all
  ```

</details>

---

1. Clone el repositorio:

   ```bash
   git clone https://github.com/describanoa/owasp-novulnweb.git
   ```

2. Entre en el repositorio:

   ```bash
   cd owasp-novulnweb
   ```

3. Instale las dependencias:

   ```bash
   pnpm install
   ```

4. Configure el archivo `.env`:

   ```bash
   # Linux/MacOS:
   cp .env.example .env

   # Windows:
   copy .env.example .env
   ```

> [!NOTE]
> Recuerde establecer correctamente las credenciales correspondientes en el archivo **`.env`** (MongoDB URI, JWT_SECRET) para el correcto funcionamiento del backend.

5. Inicie ambos servidores:

   **Terminal 1 - Backend:**
   ```bash
   pnpm run dev:backend
   ```

   **Terminal 2 - Frontend:**
   ```bash
   pnpm run dev
   ```

6. Abra el navegador en la siguiente URL:

   - 🌐 **Frontend:** [http://localhost:4321](http://localhost:4321)

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Instala las dependencias                         |
| `pnpm run dev`         | Inicia el servidor frontend en `localhost:4321`  |
| `pnpm run dev:backend` | Inicia el servidor backend en `localhost:3001`   |
| `pnpm run dev:all`     | Inicia ambos servidores                          |
| `pnpm run build`       | Construye el sitio para producción en `./dist/`  |
| `pnpm run preview`     | Vista previa del build localmente                |

## 👨‍💻 Autor

**David** ([@describanoa](https://github.com/describanoa))

---

> 💡 Este proyecto fue creado como demostración educativa de implementación correcta de seguridad web según OWASP Top 10 2021.
