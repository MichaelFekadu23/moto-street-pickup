# moto-street-pickup Documentation

## Overview

`moto-street-pickup` is a modern web application repository leveraging a robust React + TypeScript stack with support for internationalization, advanced state management, component-based architecture, and rapid prototyping with Vite and Tailwind CSS. This documentation outlines its structure, technology stack, dependencies, and their roles.

---

## Project Structure

**Root Directory:**
- `.env` : Environment variable definitions
- `.gitignore` : Specifies files/folders Git should ignore
- `README.md` : Project documentation starter (minimal content)
- `eslint.config.js` : ESLint configuration for code linting
- `index.html` : Root HTML page for the app
- `package.json` : Project manifest, dependencies, and scripts
- `pnpm-lock.yaml` : Lockfile if using pnpm for package installation
- `tsconfig.*.json` : TypeScript configs (`app`, `node`, main types)
- `vercel.json` : Deployment config for Vercel
- `vite.config.ts` : ViteJS build tool configuration

**Key Source Directories inside `src/`:**
- `App.tsx`, `main.tsx` : Main entrypoint and root component
- `App.css`, `index.css`: Styling at application and global level
- `i18n.ts` : Internationalization setup
- `vite-env.d.ts` : Vite-specific global declarations
- `assets/` : Images or static resources
- `components/` : Reusable UI components
- `features/` : Feature modules (may follow a feature-sliced design)
- `hooks/` : Custom React hooks
- `lib/` : Utility libraries/helpers for the app
- `locales/` : Translation files
- `routes/` : App routing definitions/views
- `services/` : API integrations or external services
- `types/` : Shared TypeScript types/interfaces
- `utils/` : General utility/helper functions

---

## Tech Stack

- **Framework/Library:** 
  - React (v19.x)
  - React DOM (v19.x)
  - TypeScript (v5.x, strict typing)
- **Build Tool:** 
  - Vite (v7.x) for fast dev/build cycles
- **Styling:**
  - Tailwind CSS (v4.x)
  - @tailwindcss/vite plugin for seamless integration
- **State Management:**
  - Zustand (v5.x): Modern, minimal state management
- **Routing:**
  - React Router DOM (v7.x): Handles page routing
- **Forms:**
  - react-hook-form (v7.x): Declarative, performant forms in React
- **Internationalization:**
  - i18next (v25.x) & react-i18next (v16.x): Translation & localization
- **UI/Icons:**
  - lucide-react (v0.54x): Icon library for React
  - framer-motion (v12.x): Animations and transitions
- **Linting & Code Quality:**
  - ESLint and relevant plugins/configs

---

## Major Dependencies and Their Role

| Dependency                | Purpose                                                                 |
|---------------------------|-------------------------------------------------------------------------|
| `react`, `react-dom`      | Core React library for building UI                                      |
| `react-router-dom`        | Declarative routing/navigation for SPA                                  |
| `zustand`                 | State management solution                                               |
| `react-hook-form`         | Managing form state with validation                                     |
| `tailwindcss`             | Utility-first CSS framework                                             |
| `@tailwindcss/vite`       | Vite plugin, integrates Tailwind CSS                                    |
| `framer-motion`           | Adds animations and transition effects                                  |
| `lucide-react`            | Icon set for UI                                                         |
| `i18next`, `react-i18next`| Internationalization support                                            |

**Dev Dependencies** include TypeScript, ESLint with React plugins, Vite tooling, and type definitions to ensure type safety, code quality, and robust developer experience.

---

## NPM Scripts

- `dev` : Runs Vite development server
- `build` : Build project with TypeScript and Vite
- `lint` : Runs ESLint for linting codebase
- `preview` : Preview the production build locally

---

## How to Run Locally

### Prerequisites

- **Node.js** (v18+ recommended)
- **Package Manager:** You may use **npm**, **yarn**, or **pnpm** (pnpm is likely preferred due to the presence of `pnpm-lock.yaml`).

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MichaelFekadu23/moto-street-pickup.git
   cd moto-street-pickup
   ```

2. **Install dependencies:**

   Using **pnpm** (recommended if available):

   ```bash
   pnpm install
   ```

   Or using **npm**:

   ```bash
   npm install
   ```

   Or with **yarn**:

   ```bash
   yarn install
   ```

3. **Set up environment variables (if any are required):**

   Review or create a `.env` file at the root as needed.

4. **Start the development server:**

   ```bash
   pnpm dev
   ```
   or
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

5. **Open the app in your browser:**

   By default, Vite runs at [http://localhost:5173](http://localhost:5173) (check the terminal output).

---

## Summary

`moto-street-pickup` is architecturally designed for scalability (feature directories), maintainability (typed code, custom hooks, modular organization), and modern UI/UX needs (animations, i18n, Tailwind). All essential configuration, build, and deployment files are present at the root level, ensuring compatibility with CI, deployment platforms like Vercel, and local development.
