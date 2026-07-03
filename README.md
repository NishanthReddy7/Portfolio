# NR // DOSSIER — cybersecurity portfolio

A personal portfolio built as a **declassified intelligence dossier rendered in
a live operations console**. Dark "ops-room" aesthetic — amber phosphor on
void, angular mil-spec type, a radar sweep, and a fully working terminal you can
type real commands into.

Not a template. Hand-built design system, no UI kit, no Tailwind.

## Stack

- **Vite + React 19 + TypeScript**
- Hand-rolled CSS design system (CSS custom properties)
- Canvas for the radar sweep + terminal easter egg — no animation library
- `lucide-react` for icons, `@fontsource` for self-hosted fonts
- Fonts: **Chakra Petch** (display) · **IBM Plex Sans** (body) · **IBM Plex Mono** (data)

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build
```

## Make it yours — everything lives in one file

All content is centralized in **`src/data.ts`**. Search it for `// TODO` — those
mark the spots to personalize. You do **not** need to touch any component to
change the content.

| What | Where in `src/data.ts` |
|------|------------------------|
| Name, role, summary, location | `IDENTITY` |
| Hero stat rows | `INTEL` |
| "Known facts" (the redacted dossier) | `DOSSIER_FACTS` |
| Skills + proficiency meters | `ARSENAL` |
| Tool ticker strip | `TOOL_TICKER` |
| **Projects** (as "operations") | `OPERATIONS` |
| Career timeline (the "kill chain") | `KILL_CHAIN` |
| Certifications | `CERTS` |
| Contact channels + PGP | `CHANNELS`, `PGP_FINGERPRINT` |

### Adding a project

Each project is an `Operation`. Add an object to the `OPERATIONS` array:

```ts
{
  code: "OP-07",
  name: "YOUR PROJECT",
  severity: "high",          // critical | high | medium | research (sets the color)
  classification: "Web Security",
  status: "COMPLETE",        // ACTIVE | COMPLETE | ONGOING
  summary: "One or two sentences on what it does.",
  impact: "The result — the 'so what'.",
  stack: ["Python", "Docker"],
  links: [{ label: "SOURCE", href: "https://github.com/..." }],
}
```

The projects grid, the terminal's `projects` command, and the file count in the
section header all read from this array automatically.

## The terminal

Press **`~`** anywhere (or the TERMINAL button) to open it. Try:
`help`, `whoami`, `ls`, `cat operations`, `skills`, `open operations`,
`decrypt`, `sudo`, `matrix`. Arrow keys scroll command history.

Commands are defined in `src/terminal-engine.ts`.

## Accessibility & performance

Semantic landmarks, a skip link, keyboard-navigable, `focus-visible` rings,
AA+ contrast, and all motion is disabled under `prefers-reduced-motion`.
Responsive down to 360px.

## Deploy

Static output in `dist/` — drop it on Netlify, Vercel, GitHub Pages, or any
static host. `base` is set to `./` so it works from any sub-path.
