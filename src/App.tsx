import { useCallback, useEffect, useState } from "react";
import Backdrop from "./components/Backdrop";
import StatusBar from "./components/StatusBar";
import SideRail from "./components/SideRail";
import Hero from "./components/Hero";
import Recon from "./components/Recon";
import Arsenal from "./components/Arsenal";
import Operations from "./components/Operations";
import KillChain from "./components/KillChain";
import Transmission from "./components/Transmission";
import Footer from "./components/Footer";
import Terminal from "./components/Terminal";
import { SECTIONS } from "./data";
import { useActiveSection } from "./hooks";

const SECTION_IDS = SECTIONS.map((s) => s.id);

/* stable-per-session identifier for the status strip, e.g. 7F2A-C4 */
function makeSessionId(): string {
  const buf = new Uint8Array(3);
  (globalThis.crypto ?? { getRandomValues: (b: Uint8Array) => b }).getRandomValues(buf);
  const hex = Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `${hex.slice(0, 4)}-${hex.slice(4)}`;
}

export default function App() {
  const [termOpen, setTermOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [sessionId] = useState(makeSessionId);
  const active = useActiveSection(SECTION_IDS);

  const openTerm = useCallback(() => setTermOpen(true), []);
  const closeTerm = useCallback(() => setTermOpen(false), []);

  const navigate = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // global `~` toggles the terminal, unless the user is typing somewhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "~" && e.key !== "`") return;
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el as HTMLElement)?.isContentEditable;
      if (typing) return;
      e.preventDefault();
      setTermOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a href="#recon" className="skip-link">Skip to content</a>
      <Backdrop />

      <StatusBar
        onOpenTerminal={openTerm}
        onOpenNav={() => setNavOpen(true)}
        sessionId={sessionId}
      />
      <SideRail active={active} open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="shell">
        <main className="shell__main" id="top">
          <Hero onOpenTerminal={openTerm} />
          <Recon />
          <Arsenal />
          <Operations />
          <KillChain />
          <Transmission />
          <Footer />
        </main>
      </div>

      <Terminal open={termOpen} onClose={closeTerm} onNavigate={navigate} />
    </>
  );
}
