import { createElement, type ReactNode, type ElementType } from "react";
import { useReveal, useScramble, usePrefersReducedMotion } from "../hooks";

/* Fade + rise a block into view. Optional stagger delay and element tag. */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const { ref, shown } = useReveal<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      className: `reveal ${shown ? "is-in" : ""} ${className}`.trim(),
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children
  );
}

/* Text that scrambles into place the first time it enters the viewport. */
export function DecodeText({ text, className = "" }: { text: string; className?: string }) {
  const { ref, shown } = useReveal<HTMLSpanElement>();
  const reduced = usePrefersReducedMotion();
  const outText = useScramble(text, { play: shown && !reduced });
  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{outText}</span>
    </span>
  );
}

/* Standard section header: hex index, decoding title, rule, right-side meta. */
export function SectionHead({
  hex,
  title,
  meta,
}: {
  hex: string;
  title: string;
  meta?: string;
}) {
  return (
    <div className="sec-head">
      <span className="sec-head__idx">{hex}</span>
      <h2 className="sec-head__title">
        <DecodeText text={title} />
      </h2>
      <span className="sec-head__rule" aria-hidden="true" />
      {meta && <span className="sec-head__meta">{meta}</span>}
    </div>
  );
}
