import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks";

/* A phosphor radar sweep. Concentric range rings, a rotating sweep with a
   fading afterglow, and a handful of contacts that ping as the beam passes.
   Drawn on canvas so it stays crisp and cheap. Static frame if reduced-motion. */
export default function Radar({ size = 320 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const R = size / 2 - 6;
    const AMBER = "255, 179, 0";

    // fixed set of contacts (angle in rad, radius fraction, is-threat)
    const contacts = [
      { a: 0.7, r: 0.42, threat: false },
      { a: 2.1, r: 0.72, threat: true },
      { a: 3.5, r: 0.3, threat: false },
      { a: 4.4, r: 0.6, threat: false },
      { a: 5.6, r: 0.85, threat: true },
      { a: 1.4, r: 0.55, threat: false },
    ];

    const drawStatic = (sweep: number) => {
      ctx.clearRect(0, 0, size, size);

      // range rings
      ctx.strokeStyle = `rgba(${AMBER}, 0.16)`;
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (R * i) / 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      // crosshair
      ctx.strokeStyle = `rgba(${AMBER}, 0.1)`;
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.moveTo(cx, cy - R);
      ctx.lineTo(cx, cy + R);
      ctx.stroke();

      // diagonal ticks
      ctx.strokeStyle = `rgba(${AMBER}, 0.06)`;
      for (let k = 0; k < 12; k++) {
        const ang = (k / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * (R - 10), cy + Math.sin(ang) * (R - 10));
        ctx.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R);
        ctx.stroke();
      }

      // sweep afterglow wedge
      const grad = ctx.createConicGradient
        ? ctx.createConicGradient(sweep, cx, cy)
        : null;
      if (grad) {
        grad.addColorStop(0, `rgba(${AMBER}, 0.28)`);
        grad.addColorStop(0.08, `rgba(${AMBER}, 0.0)`);
        grad.addColorStop(1, `rgba(${AMBER}, 0.0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();
      }

      // sweep leading line
      ctx.strokeStyle = `rgba(${AMBER}, 0.7)`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R);
      ctx.stroke();

      // contacts — brightness depends on how recently the beam passed
      contacts.forEach((c) => {
        let delta = sweep - c.a;
        while (delta < 0) delta += Math.PI * 2;
        while (delta > Math.PI * 2) delta -= Math.PI * 2;
        const fade = Math.max(0, 1 - delta / (Math.PI * 1.4));
        const px = cx + Math.cos(c.a) * R * c.r;
        const py = cy + Math.sin(c.a) * R * c.r;
        const rgb = c.threat ? "255, 74, 58" : AMBER;
        ctx.fillStyle = `rgba(${rgb}, ${0.25 + fade * 0.75})`;
        ctx.beginPath();
        ctx.arc(px, py, 2 + fade * 2.5, 0, Math.PI * 2);
        ctx.fill();
        if (fade > 0.1) {
          ctx.strokeStyle = `rgba(${rgb}, ${fade * 0.4})`;
          ctx.beginPath();
          ctx.arc(px, py, 4 + (1 - fade) * 12, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // hub
      ctx.fillStyle = `rgba(${AMBER}, 0.9)`;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    };

    if (reduced) {
      drawStatic(-Math.PI / 3);
      return;
    }

    let raf = 0;
    let sweep = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      sweep = (sweep + dt * 1.15) % (Math.PI * 2);
      drawStatic(sweep);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [size, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="radar"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
