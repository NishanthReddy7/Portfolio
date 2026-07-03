import { ArrowUpRight, CircleDot } from "lucide-react";
import { SectionHead, Reveal } from "./common";
import { OPERATIONS } from "../data";
import type { Operation, Severity } from "../data";

const SEV_LABEL: Record<Severity, string> = {
  critical: "CRITICAL",
  high: "HIGH",
  medium: "MEDIUM",
  research: "RESEARCH",
};

function OpCard({ op, i }: { op: Operation; i: number }) {
  return (
    <Reveal className={`op op--${op.severity} panel bracket`} delay={(i % 2) * 70}>
      <div className="op__scanline" aria-hidden="true" />
      <header className="op__head">
        <span className="op__code">{op.code}</span>
        <span className={`op__sev op__sev--${op.severity}`}>
          <span className="op__sev-dot" />
          {SEV_LABEL[op.severity]}
        </span>
      </header>

      <h3 className="op__name">{op.name}</h3>
      <span className="op__class">{op.classification}</span>

      <p className="op__summary">{op.summary}</p>

      <div className="op__impact">
        <span className="op__impact-tag">IMPACT</span>
        <span className="op__impact-text">{op.impact}</span>
      </div>

      <div className="op__stack">
        {op.stack.map((s) => (
          <span className="op__chip" key={s}>
            {s}
          </span>
        ))}
      </div>

      <footer className="op__foot">
        <span className="op__status">
          <CircleDot size={12} />
          {op.status}
        </span>
        <div className="op__links">
          {op.links?.map((l) => (
            <a className="op__link" href={l.href} key={l.label}>
              {l.label}
              <ArrowUpRight size={13} />
            </a>
          ))}
        </div>
      </footer>
    </Reveal>
  );
}

/* 0x02 — the field record. Each project is an operation file, rated by the
   severity of the problem it took on, not by how shiny it looks. */
export default function Operations() {
  return (
    <section id="operations" className="section">
      <SectionHead hex="0x02" title="OPERATIONS" meta={`${OPERATIONS.length} FILES ON RECORD`} />
      <div className="ops">
        {OPERATIONS.map((op, i) => (
          <OpCard op={op} i={i} key={op.code} />
        ))}
      </div>
    </section>
  );
}
