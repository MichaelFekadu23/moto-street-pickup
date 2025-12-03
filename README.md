# moto-street-pickup Documentation & Handover

---

## Handover Summary

### What’s Done

- **Core structure scaffolded:** React + TypeScript project bootstrapped with Vite.
- **Base configuration:** ESLint, Tailwind CSS, TypeScript configs all set up.
- **Routing:** React Router DOM integrated.
- **State management:** Zustand added for app-wide state handling.
- **Forms:** react-hook-form installed and ready for form management.
- **Internationalization:** i18next and react-i18next configured (`src/i18n.ts`, `src/locales/`).
- **Animation/Icons:** framer-motion and lucide-react integrated.
- **Component structure established:** See `src/components/`, `src/features/`, etc.

### What’s Pending

- **Tests:** No test framework/config present; add unit/integration tests.
- **Docs:** Expand `README.md` with usage, contribution, deployment instructions.
- **Production optimization:** Double-check build, deployment configs (`vercel.json`, `vite.config.ts`).
- **Design polish:** Placeholder CSS; audit for production styles and responsiveness.

### File/Folder Structure

```
.
├── .env
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── public/
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── i18n.ts
│   ├── index.css
│   ├── lib/
│   ├── locales/
│   ├── main.tsx
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```

### Known Issues / Areas Needing Attention

- **Potential unused dependencies:** Review package.json if anything is unneeded.

---

## All Dependencies/Libraries (With Explanations)

**Production Dependencies:**

| Name                    | Why Used                                                            |
|-------------------------|---------------------------------------------------------------------|
| react, react-dom        | Building UI with React; core SPA framework                          |
| react-router-dom        | Managing routes/pages in SPA                                        |
| zustand                 | Simplified, robust global state management                         |
| react-hook-form         | Easy, performant React forms/validation                             |
| tailwindcss             | Utility-first CSS framework for rapid styling                       |
| @tailwindcss/vite       | Tailwind integration for Vite                                       |
| framer-motion           | Declarative, physics-based animations for UI                        |
| lucide-react            | Icon library for scalable vector graphics                           |
| i18next                 | Internationalization framework                                      |
| react-i18next           | React bindings for i18next (using translation in JSX)               |

**Development Dependencies:**

| Name                        | Why Used                                              |
|-----------------------------|------------------------------------------------------|
| vite                        | Fast dev/build tooling for React/TS projects         |
| typescript                  | Type safety and better dev experience                |
| @vitejs/plugin-react        | React fast refresh and extra support in Vite         |
| @types/react / @types/react-dom | Type definitions for React/DOM in TypeScript      |
| @types/node                 | Node.js type definitions (may be used by tooling)    |
| eslint, @eslint/js          | Ensures code quality and consistency                 |
| eslint-plugin-react-hooks   | Specialized linting for React hooks best practices   |
| eslint-plugin-react-refresh | Ensures React fast refresh safety                    |
| globals                     | ESLint global variables                              |
| typescript-eslint           | TypeScript-aware lint rules                          |

---

## How to Run Locally

### Prerequisites

- **Node.js** (v18+ recommended)
- **Package Manager:** pnpm (preferred), npm or yarn

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MichaelFekadu23/moto-street-pickup.git
   cd moto-street-pickup
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**  
   Create/edit a `.env` file as needed.

4. **Start the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. **Visit [http://localhost:5173](http://localhost:5173) to view the app.**

---

## Summary

The project is well structured for further development but will benefit from testing setup, extended documentation, and increased completeness of current feature modules. The tech stack choices position it for efficient development and strong DX (developer experience).
