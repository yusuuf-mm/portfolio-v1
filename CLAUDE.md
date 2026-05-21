This file is the single source of truth for Claude Code when working in this repository.
Read this entire file before writing any code, creating any file, or running any command.

---

## WHO IS THIS PORTFOLIO FOR

**Yusuf** — AI Systems Engineer with the following progression:
Software Engineering → Machine Learning/Data Science → Data Engineering → AI Systems

Core strengths:

- Operations Research: optimization, statistics, mathematical modeling
- Builds intelligent systems that predict, optimize, AND decide — not just run AI models
- Integrates external AI (Claude API, Gemini, HuggingFace, Copilot) into full systems
- Can build ML models from scratch (PyTorch, scikit-learn)
- End-to-end: frontend → backend → data pipelines → ML → cloud infrastructure

**Positioning:** AI Systems Engineer × Optimization Core × Full Stack

**Hero line:** \"I architect intelligent systems — end to end, from model to decision.\"

**Design principle:** Everything looks computed, nothing looks decorated.

---

## TECH STACK (LOCKED — DO NOT CHANGE VERSIONS)

| Layer      | Technology                          | Version  |
| ---------- | ----------------------------------- | -------- |
| Framework  | Next.js                             | 16.2.6   |
| Language   | TypeScript                          | ^5       |
| Styling    | Tailwind CSS                        | ^3.4.19  |
| Animation  | Framer Motion                       | ^12      |
| 3D         | Three.js                            | ^0.184.0 |
| 3D React   | @react-three/fiber                  | ^9       |
| 3D Helpers | @react-three/drei                   | ^10      |
| Theme      | next-themes                         | ^0.4.6   |
| Icons      | lucide-react                        | ^1       |
| Fonts      | geist                               | latest   |
| Forms      | react-hook-form + zod               | latest   |
| Email      | @aws-sdk/client-ses                 | ^3       |
| Rate limit | @upstash/ratelimit + @upstash/redis | latest   |
| Utils      | clsx + tailwind-merge               | latest   |

---

## COMMANDS

| Command       | Purpose                           |
| ------------- | --------------------------------- |
| npm run dev   | Start dev server (localhost:3000) |
| npm run build | Production build check            |
| npm run start | Serve production build            |
| npm run lint  | ESLint (flat config)              |
| npx vitest    | Run all tests                     |

Pre-commit hook: lint-staged runs ESLint fix + Prettier on _.{ts,tsx}, Prettier on _.{json,md,css}.

---

## PROJECT STRUCTURE

\\\`\\\`\\\`
portfolio-v1/
├── src/
│ ├── app/
│ │ ├── layout.tsx # Root layout, fonts, ThemeProvider
│ │ ├── page.tsx # Homepage — composes all sections
│ │ ├── globals.css # CSS variables, base styles
│ │ └── api/
│ │ └── contact/
│ │ └── route.ts # Contact form → AWS SES (Phase 5)
│ ├── components/
│ │ ├── layout/
│ │ │ ├── Navbar.tsx # Fixed navbar, scroll-aware, theme toggle
│ │ │ └── Footer.tsx # Simple footer
│ │ ├── sections/ # One file per page section
│ │ │ ├── Hero.tsx # Phase 2
│ │ │ ├── About.tsx # Phase 3
│ │ │ ├── WhatIBuild.tsx # Phase 3
│ │ │ ├── Projects.tsx # Phase 4
│ │ │ ├── Stack.tsx # Phase 5
│ │ │ └── Contact.tsx # Phase 5
│ │ ├── three/ # ALL 3D components — always lazy loaded
│ │ │ ├── TerminalCube.tsx # Phase 2 — Hero
│ │ │ ├── NeuralGraph.tsx # Phase 3 — About/ML section
│ │ │ ├── SystemTopology.tsx # Phase 3 — What I Build
│ │ │ └── OrchestrationNodes.tsx # Phase 4 — Projects
│ │ └── ui/ # Reusable primitives
│ │ ├── GlassCard.tsx # Glass surface card
│ │ ├── Badge.tsx # Monospace tag/label
│ │ ├── TerminalPrompt.tsx # > prompt with cursor
│ │ └── ThemeToggle.tsx # Sun/Moon toggle button
│ ├── content/ # All copy/data — never hardcode in components
│ │ ├── projects.ts # Phase 4
│ │ ├── stack.ts # Phase 5
│ │ └── about.ts # Phase 3
│ ├── lib/
│ │ ├── utils.ts # cn() utility
│ │ ├── ses.ts # AWS SES client (Phase 5)
│ │ └── redis.ts # Upstash rate limiter (Phase 5)
│ ├── hooks/
│ │ ├── useScrollProgress.ts # Phase 2+
│ │ └── useTheme.ts # Phase 2+
│ └── styles/
│ └── design-tokens.ts # TS constants mirroring CSS vars
├── terraform/ # AWS infrastructure as code (Phase 6)
│ ├── main.tf
│ ├── s3.tf
│ ├── cloudfront.tf
│ ├── ses.tf
│ └── variables.tf
├── .github/
│ └── workflows/
│ ├── ci.yml # Lint + type-check on PR
│ └── deploy.yml # Deploy on merge to main
├── next.config.js
├── tailwind.config.ts
├── postcss.config.mjs
└── CLAUDE.md # This file
\\\`\\\`\\\`

## SKILLS

Before building any frontend component, read and follow:

- ~/.claude/skills

## These contain design constraints and patterns that override defaults.

## DESIGN SYSTEM (LOCKED — NEVER HARDCODE HEX VALUES IN COMPONENTS)

Always use CSS custom properties via var(). Never use hardcoded hex in components.

### Light Mode — Precision Linen (DEFAULT)

\\\`\\\`\\\`css
--background: #F4F2EE
--surface: rgba(255,255,255,0.75)
--border: rgba(0,0,0,0.07)
--text-primary: #1A1A1A
--text-muted: #6B7280
--accent: #1C2B3A /_ deep ink navy _/
--accent-warm: #B8935A /_ warm bronze _/
\\\`\\\`\\\`

### Dark Mode — Smoked Glass

\\\`\\\`\\\`css
--background: #08090C
--surface: rgba(255,255,255,0.04)
--border: rgba(255,255,255,0.07)
--text-primary: #EAEAEA
--text-muted: #6B7280
--accent: #B8935A /_ warm bronze _/
--accent-warm: #1C2B3A /_ deep ink navy _/
\\\`\\\`\\\`

### Typography

- Display/headings: Instrument Serif (editorial weight)
- Code/labels/nav: Geist Mono (var(--font-geist-mono))
- Body: Geist Sans (var(--font-geist-sans))

### Tailwind color tokens

- void: #08090C
- linen: #F4F2EE
- bronze: #B8935A
- navy: #1C2B3A

---

## BUILD PHASES

### Phase 0 — Repo + Scaffold ✅ DONE

- Next.js 16 + TypeScript + Tailwind v3 + all deps installed
- Vercel connected, auto-deploys on push to main
- .gitignore, .prettierrc, husky, lint-staged configured

### Phase 1 — Design System ✅ DONE

- globals.css with CSS variables for both themes
- tailwind.config.ts with custom tokens
- ThemeProvider (next-themes, light default)
- Geist fonts wired via layout.tsx
- UI primitives: GlassCard, Badge, TerminalPrompt, ThemeToggle
- Navbar (scroll-aware, fixed, theme toggle)
- Footer

### Phase 2 — Hero Section 🔄 CURRENT

Files to create:

- src/components/sections/Hero.tsx
- src/components/three/TerminalCube.tsx
- Update src/app/page.tsx

Hero layout:

- Full viewport height (min-h-screen)
- Left: label + name + title + hero line + 2 CTAs + tech badges
- Right: 3D TerminalCube (lazy loaded, ssr:false)
- Bottom center: scroll indicator
- Mobile: stacked vertically (text top, cube below)
- Framer Motion: staggered fade+slide up on load
- TerminalCube: wireframe/glass cube, slow rotation, bronze accent

### Phase 3 — About + What I Build

- About.tsx: journey narrative, scroll reveal
- WhatIBuild.tsx: 3 pillars with GlassCards
- SystemTopology.tsx: 3D node graph draws on scroll
- src/content/about.ts

### Phase 4 — Projects

- Projects.tsx: card grid
- OrchestrationNodes.tsx: floating 3D nodes background
- src/content/projects.ts: 3-5 projects with stack + outcome

### Phase 5 — Stack + Contact

- Stack.tsx: grouped tools grid
- Contact.tsx: terminal-style form
- src/app/api/contact/route.ts: AWS SES integration
- src/lib/ses.ts + redis.ts
- src/content/stack.ts

### Phase 6 — AWS Infrastructure

- Terraform: S3, CloudFront, SES, Route 53, ACM
- Custom domain setup
- Resume PDF on S3 + CloudFront URL

### Phase 7 — Performance + Polish

- Lighthouse 90+ target
- OG image, meta tags, sitemap, robots.txt
- Mobile testing (iOS Safari, Android Chrome)
- All 3D lazy loaded check

### Phase 8 — CI/CD + Launch

- GitHub Actions ci.yml + deploy.yml
- Env vars on Vercel dashboard
- Launch

---

## CRITICAL RULES — READ BEFORE WRITING ANY CODE

### 1. File Writing on Windows

NEVER use: cat > file << 'EOF' (Windows shell eats < characters)
ALWAYS use Node.js to write files:
\\\`\\\`\\\`bash
node -e "const fs = require('fs'); fs.writeFileSync('path/to/file.tsx', content)"
\\\`\\\`\\\`

### 2. No Template Literals in JSX Attributes

Turbopack parser chokes on backticks inside JSX props.
WRONG: href={\\\`#\\\${link.toLowerCase()}\\\`}
CORRECT: href={'#' + link.toLowerCase()}

### 3. All 3D Must Be Lazy Loaded

\\\`\\\`\\\`tsx
const TerminalCube = dynamic(() => import('@/components/three/TerminalCube'), { ssr: false })
\\\`\\\`\\\`
Never import Three.js components directly — always dynamic with ssr: false.

### 4. Content Lives in /content/ Only

Never hardcode project names, bio text, or stack items in components.
All copy goes in src/content/\*.ts and gets imported.

### 5. One 3D Element Per Section

Never have two Three.js canvases competing in the same viewport.

### 6. Mobile First

Build every component mobile-up. Test vertical stack before horizontal layout.

### 7. Both Themes From Day One

Every component must look correct in light AND dark mode before moving on.

### 8. CSS Variables Only

Never use hardcoded colors in components. Always: className=\"text-[var(--accent)]\".

### 9. Use cn() for All classNames

Import from @/lib/utils. Never raw string concat for classNames.

### 10. Path Aliases

Always use @/\* aliases. Never use relative paths like ../../components.

---

## ENVIRONMENT VARIABLES

\\\`\\\`\\\`bash

# AWS (Phase 5+)

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
SES_FROM_EMAIL=
SES_TO_EMAIL=

# Upstash Redis (Phase 5+)

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App

NEXT_PUBLIC_SITE_URL=
\\\`\\\`\\\`

---

## KNOWN ISSUES + SOLUTIONS

| Issue                                        | Solution                                                                                |
| -------------------------------------------- | --------------------------------------------------------------------------------------- |
| SWC binary on Windows                        | Add @next/swc-win32-x64-msvc to optionalDependencies                                    |
| Tailwind v4 installed by default             | Must use v3.4.x, downgrade if v4 detected                                               |
| Turbopack + Tailwind v3 conflict             | Fixed via postcss.config.mjs + globals.css @tailwind directives                         |
| Template literals in JSX                     | Use string concatenation instead                                                        |
| cat EOF on Windows                           | Use node -e fs.writeFileSync instead                                                    |
| useEffect(() => setState()) ESLint error     | Wrap in function body: useEffect(() => { setState() }, []) or remove useEffect entirely |
| Duplicate components at src/components/ root | Canonical versions are in src/components/ui/ — delete root duplicates                   |

---

## SECTIONS MAP

| Section      | ID       | 3D Element         | Phase |
| ------------ | -------- | ------------------ | ----- |
| Hero         | hero     | TerminalCube       | 2     |
| About        | about    | None               | 3     |
| What I Build | build    | SystemTopology     | 3     |
| Projects     | projects | OrchestrationNodes | 4     |
| Stack        | stack    | None               | 5     |
| Contact      | contact  | None               | 5     |

---

## DEPLOYMENT

- **Platform:** Vercel (auto-deploy on push to main)
- **Repo:** github.com/yusuuf-mm/portfolio-v1 (private)
- **Branch strategy:** main is protected, all changes via PR
- **Domain:** Vercel subdomain for now, custom domain in Phase 6
- **AWS:** CDN + email layer behind Vercel (Phase 6)
