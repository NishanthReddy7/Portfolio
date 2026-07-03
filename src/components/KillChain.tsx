import { BadgeCheck } from "lucide-react";
import { SectionHead, Reveal } from "./common";
import { KILL_CHAIN, CERTS } from "../data";

/* 0x03 — the trajectory, drawn as a kill chain. Each stage is a phase in the
   path from curious beginner to operator, borrowing the attacker's own
   vocabulary for progression. */
export default function KillChain() {
  return (
    <section id="killchain" className="section">
      <SectionHead hex="0x03" title="KILL CHAIN" meta="TRAJECTORY TRACE" />

      <ol className="chain">
        {KILL_CHAIN.map((node, i) => (
          <Reveal className="chain__node" delay={i * 60} as="li" key={node.title}>
            <div className="chain__spine" aria-hidden="true">
              <span className="chain__node-dot" />
              {i < KILL_CHAIN.length - 1 && <span className="chain__line" />}
            </div>
            <div className="chain__body">
              <div className="chain__meta">
                <span className="chain__phase">{node.phase}</span>
                <span className="chain__time">{node.time}</span>
              </div>
              <h3 className="chain__title">{node.title}</h3>
              <span className="chain__org">{node.org}</span>
              <p className="chain__detail">{node.detail}</p>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal className="certs">
        <span className="certs__label">
          <BadgeCheck size={15} /> CREDENTIALS
        </span>
        <div className="certs__list">
          {CERTS.map((c) => (
            <span className="certs__item" key={c}>
              {c}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
