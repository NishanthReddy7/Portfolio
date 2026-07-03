import { useCallback, useEffect, useRef, useState } from "react";

/* --------------------------------------------------- reduced-motion gate -- */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/* --------------------------------------------- reveal element on scroll -- */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  opts: { threshold?: number; once?: boolean } = {}
) {
  const { threshold = 0.18, once = true } = opts;
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold, once]);

  return { ref, shown };
}

/* ------------------------------------ which section is currently in view -- */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.intersectionRatio));
        let best = active;
        let bestRatio = -1;
        seen.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        if (bestRatio > 0) setActive(best);
      },
      { threshold: [0.15, 0.4, 0.7], rootMargin: "-20% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);
  return active;
}

/* ------------------------------------------------------- live UTC clock -- */
export function useUtcClock(): string {
  const [t, setT] = useState(() => fmt(new Date()));
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);
  return t;
}
function fmt(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}Z`;
}

/* --------------------- session uptime, from first render, as HH:MM:SS ---- */
export function useUptime(): string {
  const start = useRef(Date.now());
  const [s, setS] = useState("00:00:00");
  useEffect(() => {
    const id = window.setInterval(() => {
      const secs = Math.floor((Date.now() - start.current) / 1000);
      const p = (n: number) => String(n).padStart(2, "0");
      setS(`${p(Math.floor(secs / 3600))}:${p(Math.floor((secs % 3600) / 60))}:${p(secs % 60)}`);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);
  return s;
}

/* ------------------------------------ scramble/decrypt a string into view -- */
const GLYPHS = "!<>-_\\/[]{}=+*^?#01ABCDEF§%&";
export function useScramble(target: string, opts: { play: boolean; speed?: number }) {
  const { play, speed = 1 } = opts;
  const [out, setOut] = useState(play ? "" : target);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!play) {
      setOut(target);
      return;
    }
    let frame = 0;
    const total = 28 / speed;
    const settleAt = target.split("").map(() => Math.floor(Math.random() * total * 0.7) + total * 0.2);

    const tick = () => {
      frame += 1;
      let done = 0;
      const next = target
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (frame >= settleAt[i]) {
            done += 1;
            return ch;
          }
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      setOut(next);
      if (done < target.replace(/ /g, "").length) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setOut(target);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, play, speed]);

  return out;
}

/* ----------------------------------- run a callback once, after a delay --- */
export function useDelayedFlag(delay: number): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setOn(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);
  return on;
}

/* --------------------------------- lock body scroll while overlay is open -- */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

/* small helper so components can trigger a callback on Escape */
export function useKey(key: string, handler: () => void, active = true) {
  const cb = useCallback(handler, [handler]);
  useEffect(() => {
    if (!active) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === key) cb();
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [key, cb, active]);
}
