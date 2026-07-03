import { forceReveal } from "./reveal-bus";

/* The single way to jump to a section. Settle the destination's reveal/scramble
   animations first so it's fully visible on arrival, then scroll — honoring
   reduced-motion (an explicit scrollIntoView "smooth" otherwise overrides the
   user's OS preference). Every nav path routes through here so behavior is
   identical from the rail, the hero buttons, and the terminal. */
export function goToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;

  forceReveal(id);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
