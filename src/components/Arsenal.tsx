import { SectionHead, Reveal } from "./common";
import { ARSENAL, TOOL_TICKER } from "../data";
import type { Cap } from "../data";

/* 5-segment signal meter — reads like a comms strength gauge, not a % bar. */
function Meter({ level }: { level: number }) {
  return (
    <span className="meter" role="img" aria-label={`proficiency ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`meter__seg ${n <= level ? "is-on" : ""}`} />
      ))}
    </span>
  );
}

function CapRow({ cap, i }: { cap: Cap; i: number }) {
  return (
    <Reveal className="cap" delay={i * 55}>
      <div className="cap__top">
        <span className="cap__name">{cap.name}</span>
        <Meter level={cap.level} />
      </div>
      <span className="cap__note">{cap.note}</span>
    </Reveal>
  );
}

/* 0x01 — capability matrix + a running inventory of daily-driver tools. */
export default function Arsenal() {
  return (
    <section id="arsenal" className="section">
      <SectionHead hex="0x01" title="ARSENAL" meta="CAPABILITY MATRIX" />

      <div className="arsenal">
        {ARSENAL.map((group, gi) => (
          <Reveal className="arsenal__col panel bracket" delay={gi * 90} key={group.id}>
            <header className="arsenal__col-head">
              <span className="arsenal__col-idx">{String(gi + 1).padStart(2, "0")}</span>
              <h3 className="arsenal__col-title">{group.title}</h3>
            </header>
            <div className="arsenal__caps">
              {group.caps.map((cap, i) => (
                <CapRow cap={cap} i={i} key={cap.name} />
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[...TOOL_TICKER, ...TOOL_TICKER].map((t, i) => (
            <span className="ticker__item" key={i}>
              <span className="ticker__dot" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
