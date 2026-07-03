import { X } from "lucide-react";
import { SECTIONS, IDENTITY } from "../data";
import { useKey } from "../hooks";
import { goToSection } from "../nav";

/* Left index rail. Fixed on desktop; slides in as an overlay on mobile.
   Highlights the section currently in the viewport. */
export default function SideRail({
  active,
  open,
  onClose,
}: {
  active: string;
  open: boolean;
  onClose: () => void;
}) {
  useKey("Escape", onClose, open);

  const go = (id: string) => {
    goToSection(id);
    onClose();
  };

  return (
    <>
      <div
        className={`rail-scrim ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        className={`rail ${open ? "is-open" : ""}`}
        aria-label="Section navigation"
      >
        <div className="rail__top">
          <a href="#recon" className="rail__brand" onClick={(e) => { e.preventDefault(); go("recon"); }}>
            <span className="rail__brand-mark">NR</span>
            <span className="rail__brand-meta">
              <b>{IDENTITY.handle}</b>
              <small>{IDENTITY.clearance}</small>
            </span>
          </a>
          <button className="rail__close" onClick={onClose} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <ol className="rail__list">
          {SECTIONS.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`rail__item ${on ? "is-active" : ""}`}
                  aria-current={on ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    go(s.id);
                  }}
                >
                  <span className="rail__hex">{s.hex}</span>
                  <span className="rail__labels">
                    <span className="rail__label">{s.label}</span>
                    <span className="rail__sub">{s.sub}</span>
                  </span>
                  <span className="rail__bar" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ol>

        <div className="rail__foot">
          <span className="rail__foot-dot" aria-hidden="true" />
          <span>{IDENTITY.status}</span>
        </div>
      </nav>
    </>
  );
}
