import { ShieldHalf, Fingerprint } from "lucide-react";
import { SectionHead, Reveal } from "./common";
import { IDENTITY, DOSSIER_FACTS } from "../data";

/* 0x00 — the subject briefing. Prose on the left, a redacted "known facts"
   dossier on the right that unredacts on hover/focus. */
export default function Recon() {
  return (
    <section id="recon" className="section">
      <SectionHead hex="0x00" title="RECON" meta="SUBJECT BRIEFING" />

      <div className="recon">
        <Reveal className="recon__brief">
          <p className="recon__lead">
            <ShieldHalf size={18} className="recon__lead-icon" />
            <span>
              I&apos;m a security engineer who works both ends of the wire.
            </span>
          </p>
          <p className="recon__body">{IDENTITY.summary}</p>
          <p className="recon__body">
            The best defense is written by someone who knows exactly how the
            attack works — so I spend my time on both sides of it. On the
            offensive side I run full-scope assessments and build the tooling
            that finds the gap. On the defensive side I turn that same tradecraft
            into detections, runbooks, and architecture that actually holds up at
            3am.
          </p>
          <div className="recon__focus">
            {IDENTITY.focus.map((f) => (
              <span className="tag tag--amber" key={f}>
                {f}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal className="recon__dossier panel bracket" delay={120}>
          <div className="recon__dossier-head">
            <Fingerprint size={15} />
            <span>KNOWN FACTS</span>
            <span className="recon__dossier-hint">hover to declassify</span>
          </div>
          <ul className="recon__facts">
            {DOSSIER_FACTS.map((fact) => (
              <li className="recon__fact" key={fact.label} tabIndex={0}>
                <span className="recon__fact-label">{fact.label}</span>
                <span className="recon__fact-value" data-value={fact.value}>
                  <span className="recon__fact-real">{fact.value}</span>
                  <span className="recon__fact-redact" aria-hidden="true" />
                </span>
              </li>
            ))}
          </ul>
          <div className="recon__stamp" aria-hidden="true">
            <span>REVIEWED</span>
            <span>CLR — {IDENTITY.clearance.split("—")[0].trim()}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
