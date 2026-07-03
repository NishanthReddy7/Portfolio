/* ============================================================================
   Terminal command engine — pure logic, no React. Takes a raw input string,
   returns lines to print plus optional side effects (navigate / clear / close).
   Reads from the same content register as the rest of the site.
   ========================================================================= */
import {
  IDENTITY,
  SECTIONS,
  OPERATIONS,
  ARSENAL,
  CHANNELS,
  CERTS,
} from "./data";

export type LineKind = "in" | "out" | "sys" | "err" | "amber" | "dim";
export type Line = { kind: LineKind; text: string };
export type Effect = "matrix" | "decrypt";

export type CommandResult = {
  lines: Line[];
  clear?: boolean;
  navigate?: string;
  close?: boolean;
  effect?: Effect;
};

const out = (text: string): Line => ({ kind: "out", text });
const dim = (text: string): Line => ({ kind: "dim", text });
const amber = (text: string): Line => ({ kind: "amber", text });
const err = (text: string): Line => ({ kind: "err", text });

const SECTION_IDS = SECTIONS.map((s) => s.id);

export const COMMAND_NAMES = [
  "help", "whoami", "ls", "cat", "projects", "skills", "contact",
  "open", "clear", "banner", "decrypt", "sudo", "matrix", "date", "echo", "exit",
];

const HELP: [string, string][] = [
  ["help", "list every command"],
  ["whoami", "print the subject dossier"],
  ["ls", "list sections of this file"],
  ["cat <section>", "read a section (e.g. cat recon)"],
  ["projects", "list operations on record"],
  ["skills", "print the capability matrix"],
  ["contact", "show open channels"],
  ["open <section>", "jump to a section"],
  ["decrypt", "run the decryption routine"],
  ["banner", "reprint the header"],
  ["clear", "wipe the screen"],
  ["exit", "close the terminal"],
];

export const BANNER: Line[] = [
  amber("  ███╗   ██╗██████╗     ██████╗ ██████╗ ███████╗"),
  amber("  ████╗  ██║██╔══██╗   ██╔═══██╗██╔══██╗██╔════╝"),
  amber("  ██╔██╗ ██║██████╔╝   ██║   ██║██████╔╝███████╗"),
  amber("  ██║╚██╗██║██╔══██╗   ██║   ██║██╔═══╝ ╚════██║"),
  amber("  ██║ ╚████║██║  ██║   ╚██████╔╝██║     ███████║"),
  dim("  secure shell · dossier console · v1.0"),
  dim(`  type 'help' for commands · 'exit' to close`),
];

/* Narrow-screen banner — the ASCII art above overflows a phone, so mobile
   gets this compact header instead. */
export const BANNER_COMPACT: Line[] = [
  amber("╺━━ NR // OPS ━━╸"),
  dim("secure shell · dossier console · v1.0"),
  dim("type 'help' for commands · 'exit' to close"),
];

function whoami(): Line[] {
  return [
    amber(`${IDENTITY.handle}  —  ${IDENTITY.alias}@ops`),
    out(IDENTITY.role),
    dim("────────────────────────────────────────────"),
    out(IDENTITY.summary),
    dim(""),
    out(`clearance : ${IDENTITY.clearance}`),
    out(`location  : ${IDENTITY.location}`),
    out(`status    : ${IDENTITY.status}`),
    out(`focus     : ${IDENTITY.focus.join(" · ")}`),
  ];
}

function lsSections(): Line[] {
  return [
    dim("5 sections // hover the rail or 'open <name>'"),
    ...SECTIONS.map((s) => out(`${s.hex}  ${s.label.toLowerCase().padEnd(14)} ${s.sub}`)),
  ];
}

function listProjects(): Line[] {
  return [
    dim(`${OPERATIONS.length} operations on record:`),
    ...OPERATIONS.flatMap((op) => [
      amber(`${op.code}  ${op.name}  [${op.severity.toUpperCase()}]`),
      out(`      ${op.classification} · ${op.status}`),
      dim(`      ${op.summary}`),
    ]),
    dim("→ 'open operations' for the full files"),
  ];
}

function listSkills(): Line[] {
  return ARSENAL.flatMap((g) => [
    amber(`# ${g.title}`),
    ...g.caps.map((c) => {
      const bar = "▮".repeat(c.level) + "▯".repeat(5 - c.level);
      return out(`  ${bar}  ${c.name}`);
    }),
    dim(""),
  ]);
}

function listContact(): Line[] {
  return [
    dim("open channels:"),
    ...CHANNELS.map((c) => out(`  ${c.proto.padEnd(9)} ${c.label}`)),
    dim(`certs: ${CERTS.join(" · ")}`),
  ];
}

function catSection(arg: string): Line[] {
  const key = arg.toLowerCase();
  if (key === "recon" || key === "about" || key === "whoami") return whoami();
  if (key === "arsenal" || key === "skills") return listSkills();
  if (key === "operations" || key === "projects" || key === "ops") return listProjects();
  if (key === "transmission" || key === "contact") return listContact();
  if (key === "killchain" || key === "chain" || key === "cv") {
    return [dim("→ trajectory trace — run 'open killchain' to view it in full")];
  }
  return [err(`cat: ${arg}: no such section`), dim(`try: ${SECTION_IDS.join(", ")}`)];
}

/** Execute one line of input. `history` is prior raw commands (newest last).
 *  `compact` picks the narrow banner for the `banner` command on small screens. */
export function runCommand(raw: string, history: string[], compact = false): CommandResult {
  const input = raw.trim();
  if (!input) return { lines: [] };

  const [cmd, ...rest] = input.split(/\s+/);
  const arg = rest.join(" ");
  const c = cmd.toLowerCase();

  switch (c) {
    case "help":
    case "?":
      return {
        lines: [
          amber("AVAILABLE COMMANDS"),
          ...HELP.map(([name, desc]) => out(`  ${name.padEnd(18)} ${desc}`)),
        ],
      };

    case "whoami":
      return { lines: whoami() };

    case "ls":
    case "dir":
      return { lines: lsSections() };

    case "cat":
    case "less":
    case "more":
      if (!arg) return { lines: [err("cat: missing operand"), dim("usage: cat <section>")] };
      return { lines: catSection(arg) };

    case "projects":
    case "ops":
      return { lines: listProjects() };

    case "skills":
    case "arsenal":
      return { lines: listSkills() };

    case "contact":
    case "transmission":
      return { lines: listContact() };

    case "open":
    case "cd":
    case "goto": {
      const target = arg.toLowerCase().replace(/^\/+|\/+$/g, "");
      const match = SECTIONS.find(
        (s) => s.id === target || s.label.toLowerCase() === target
      );
      if (!match) {
        return {
          lines: [err(`open: ${arg || "(nothing)"}: section not found`), dim(`sections: ${SECTION_IDS.join(", ")}`)],
        };
      }
      return {
        lines: [amber(`→ routing to ${match.hex} ${match.label}…`)],
        navigate: match.id,
        close: true,
      };
    }

    case "clear":
    case "cls":
      return { lines: [], clear: true };

    case "banner":
      return { lines: compact ? BANNER_COMPACT : BANNER };

    case "decrypt":
      return {
        lines: [
          dim("initializing decryption routine…"),
          amber("subject dossier already declassified for your session."),
          out("clearance granted — read freely."),
        ],
        effect: "decrypt",
      };

    case "sudo":
      return {
        lines: [
          err(`[sudo] password for guest:`),
          err("Sorry, user 'guest' is not in the sudoers file."),
          dim("This incident will be reported. (it won't. relax.)"),
        ],
      };

    case "rm":
      return { lines: [err("rm: permission denied — this dossier is write-protected.")] };

    case "matrix":
      return {
        lines: [amber("engaging rain… (press any key or 'clear' to stop)")],
        effect: "matrix",
      };

    case "date":
      return { lines: [out(new Date().toUTCString())] };

    case "echo":
      return { lines: [out(arg)] };

    case "history":
      return { lines: history.length ? history.map((h, i) => dim(`  ${i + 1}  ${h}`)) : [dim("(empty)")] };

    case "hello":
    case "hi":
      return { lines: [out("hey. type 'help' if you're looking for something specific.")] };

    case "exit":
    case "quit":
    case "q":
      return { lines: [dim("closing secure channel…")], close: true };

    default:
      return {
        lines: [
          err(`${c}: command not found`),
          dim("type 'help' for the list of commands"),
        ],
      };
  }
}
