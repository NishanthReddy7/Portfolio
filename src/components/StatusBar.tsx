import { Terminal as TerminalIcon, Menu, Radio } from "lucide-react";
import { useUtcClock, useUptime } from "../hooks";
import { IDENTITY } from "../data";

/* Top command strip: link status, live UTC, session uptime, and the two
   controls that matter — open the terminal, or (on mobile) the nav. */
export default function StatusBar({
  onOpenTerminal,
  onOpenNav,
  sessionId,
}: {
  onOpenTerminal: () => void;
  onOpenNav: () => void;
  sessionId: string;
}) {
  const clock = useUtcClock();
  const uptime = useUptime();

  return (
    <header className="statusbar" role="banner">
      <div className="statusbar__left">
        <span className="statusbar__link">
          <Radio size={13} strokeWidth={2} />
          LINK<span className="statusbar__sep">:</span>
          <b className="statusbar__ok">SECURE</b>
          <span className="statusbar__pulse" aria-hidden="true" />
        </span>
        <span className="statusbar__cell statusbar__hide-sm">
          NODE <b>{IDENTITY.alias}@ops</b>
        </span>
      </div>

      <div className="statusbar__right">
        <span className="statusbar__cell statusbar__hide-md">
          SESSION <b>{sessionId}</b>
        </span>
        <span className="statusbar__cell statusbar__hide-sm">
          UP <b>{uptime}</b>
        </span>
        <span className="statusbar__cell statusbar__clock">
          <b>{clock}</b>
        </span>
        <button
          className="statusbar__term"
          onClick={onOpenTerminal}
          aria-label="Open interactive terminal"
        >
          <TerminalIcon size={14} strokeWidth={2} />
          <span className="statusbar__hide-sm">TERMINAL</span>
          <kbd className="statusbar__kbd statusbar__hide-md">~</kbd>
        </button>
        <button className="statusbar__menu" onClick={onOpenNav} aria-label="Open navigation">
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
}
