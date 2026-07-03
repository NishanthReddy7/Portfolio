import { IDENTITY } from "../data";

/* End-of-file marker. Quiet, technical, signs off in the same voice. */
export default function Footer() {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="eof">
      <div className="eof__rule" aria-hidden="true">
        <span>EOF</span>
        <span className="eof__hex">0xFFFF</span>
      </div>
      <div className="eof__grid">
        <div className="eof__cell">
          <span className="eof__k">FILE</span>
          <span className="eof__v">{IDENTITY.handle} · dossier.v1</span>
        </div>
        <div className="eof__cell">
          <span className="eof__k">BUILT WITH</span>
          <span className="eof__v">React · TypeScript · Canvas · caffeine</span>
        </div>
        <div className="eof__cell">
          <span className="eof__k">INTEGRITY</span>
          <span className="eof__v eof__v--ok">SHA-256 VERIFIED</span>
        </div>
      </div>
      <p className="eof__sign">
        © {year} {IDENTITY.handle}. No trackers. No cookies. Nothing exfiltrated
        but ideas.
      </p>
    </footer>
  );
}
