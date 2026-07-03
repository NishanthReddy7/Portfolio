import { useEffect, useRef, useState, useCallback } from "react";
import { X, ChevronRight } from "lucide-react";
import { runCommand, BANNER, type Line } from "../terminal-engine";
import { IDENTITY } from "../data";
import { useKey, useScrollLock } from "../hooks";
import MatrixRain from "./MatrixRain";

const PROMPT_USER = `${IDENTITY.alias}@ops`;

/* The signature element: a real shell over the dossier. Everything else on the
   page stays quiet so this can be the one loud, playful moment. */
export default function Terminal({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [rain, setRain] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useScrollLock(open);
  useKey("Escape", onClose, open && !rain);

  // focus the input whenever the terminal opens
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  // keep the view pinned to the newest output
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  const submit = useCallback(
    (raw: string) => {
      const echo: Line = { kind: "in", text: raw };
      const nextHistory = raw.trim() ? [...history, raw.trim()] : history;
      const res = runCommand(raw, history);

      if (res.clear) {
        setLines([]);
      } else {
        setLines((prev) => [...prev, echo, ...res.lines]);
      }
      if (raw.trim()) setHistory(nextHistory);
      setHistIdx(-1);
      if (res.effect === "matrix") setRain(true);
      if (res.navigate) onNavigate(res.navigate);
      if (res.close) window.setTimeout(onClose, res.navigate ? 240 : 120);
    },
    [history, onNavigate, onClose]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setValue(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const idx = histIdx + 1;
      if (idx >= history.length) {
        setHistIdx(-1);
        setValue("");
      } else {
        setHistIdx(idx);
        setValue(history[idx]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  if (!open) return null;

  return (
    <div className="term-overlay" role="dialog" aria-modal="true" aria-label="Interactive terminal">
      <div className="term-scrim" onClick={onClose} />
      <div className="term">
        <header className="term__bar">
          <span className="term__dots" aria-hidden="true">
            <i /> <i /> <i />
          </span>
          <span className="term__title">
            {PROMPT_USER}: ~/dossier — secure shell
          </span>
          <button className="term__close" onClick={onClose} aria-label="Close terminal">
            <X size={15} />
          </button>
        </header>

        <div
          className="term__body"
          ref={bodyRef}
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((ln, i) => (
            <div key={i} className={`term__line term__line--${ln.kind}`}>
              {ln.kind === "in" ? (
                <>
                  <span className="term__prompt">
                    <span className="term__prompt-user">{PROMPT_USER}</span>
                    <span className="term__prompt-path">~/dossier</span>
                    <ChevronRight size={12} />
                  </span>
                  <span>{ln.text}</span>
                </>
              ) : (
                <span className="term__pre">{ln.text || " "}</span>
              )}
            </div>
          ))}

          <div className="term__input-row">
            <span className="term__prompt">
              <span className="term__prompt-user">{PROMPT_USER}</span>
              <span className="term__prompt-path">~/dossier</span>
              <ChevronRight size={12} />
            </span>
            <input
              ref={inputRef}
              className="term__input"
              value={value}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Terminal input"
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <span className="term__caret" aria-hidden="true" />
          </div>
        </div>

        {rain && <MatrixRain onStop={() => setRain(false)} />}
      </div>
    </div>
  );
}
