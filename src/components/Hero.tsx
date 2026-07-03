import { ArrowRight, TerminalSquare, Crosshair } from "lucide-react";
import Radar from "./Radar";
import { IDENTITY, INTEL } from "../data";
import { useScramble, useDelayedFlag, usePrefersReducedMotion } from "../hooks";

export default function Hero({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const reduced = usePrefersReducedMotion();
  // load choreography: name decrypts shortly after mount
  const decrypt = useDelayedFlag(reduced ? 0 : 260);
  const name = useScramble(IDENTITY.handle.toUpperCase(), { play: decrypt && !reduced, speed: 0.9 });

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__inner">
        <div className="hero__main">
          <p className="hero__eyebrow">
            <span className="hero__eyebrow-b">CLASSIFIED</span>
            <span className="hero__eyebrow-slash">//</span>
            PERSONNEL FILE · SUBJECT 0x00
          </p>

          <h1 className="hero__name" aria-label={IDENTITY.handle}>
            <span aria-hidden="true">{name}</span>
          </h1>

          <p className="hero__role">
            <Crosshair size={15} className="hero__role-icon" />
            {IDENTITY.role}
          </p>

          <p className="hero__summary">{IDENTITY.summary}</p>

          <dl className="hero__meta">
            {INTEL.map((row) => (
              <div className="hero__meta-row" key={row.k}>
                <dt>{row.k}</dt>
                <dd>{row.v}</dd>
              </div>
            ))}
          </dl>

          <div className="hero__cta">
            <button className="btn btn--primary" onClick={() => scrollTo("operations")}>
              VIEW OPERATIONS <ArrowRight size={16} />
            </button>
            <button className="btn" onClick={onOpenTerminal}>
              <TerminalSquare size={16} /> OPEN TERMINAL
            </button>
          </div>
        </div>

        <aside className="hero__scope" aria-hidden="true">
          <div className="hero__scope-frame bracket">
            <div className="hero__scope-head">
              <span>SECTOR SWEEP</span>
              <span className="hero__scope-live">● LIVE</span>
            </div>
            <Radar size={300} />
            <div className="hero__scope-read">
              <span>AZ 047°</span>
              <span>RNG 12.4km</span>
              <span>6 CONTACTS</span>
            </div>
          </div>
          <div className="hero__coords mono">
            {IDENTITY.location.toUpperCase()} · LAT 17.3850 · LON 78.4867
          </div>
        </aside>
      </div>

      <button
        className="hero__scroll"
        onClick={() => scrollTo("recon")}
        aria-label="Scroll to dossier"
      >
        <span>SCROLL TO DECRYPT</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </button>
    </section>
  );
}
