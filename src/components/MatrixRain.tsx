import { useEffect, useRef } from "react";

/* Amber "rain" easter egg for the terminal. Deliberately amber, not green —
   keeps it on-brand instead of the usual cliché. Click/keypress dismisses. */
export default function MatrixRain({ onStop }: { onStop: () => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const glyphs = "01<>[]{}#$%&*ABCDEF!?/\\=+".split("");
    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: cols }, () => Math.random() * -40);

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(5, 6, 6, 0.16)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle = Math.random() > 0.96 ? "#fff3d6" : "rgba(255, 179, 0, 0.85)";
        ctx.fillText(ch, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const stop = () => onStop();
    window.addEventListener("keydown", stop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", stop);
    };
  }, [onStop]);

  return <canvas ref={ref} className="term__matrix" onClick={onStop} aria-hidden="true" />;
}
