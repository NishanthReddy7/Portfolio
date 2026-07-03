import { Mail, MessageSquareLock, ArrowUpRight, KeyRound } from "lucide-react";
import type { ComponentType } from "react";
import { SectionHead, Reveal } from "./common";
import { GithubMark, LinkedinMark } from "./BrandIcons";
import { CHANNELS, PGP_FINGERPRINT, IDENTITY } from "../data";

const ICONS: Record<string, ComponentType<{ size?: number }>> = {
  MAIL: Mail,
  GITHUB: GithubMark,
  LINKEDIN: LinkedinMark,
  SIGNAL: MessageSquareLock,
};

/* 0x04 — open a channel. Contact framed as secure comms, with a (cosmetic)
   public-key block to complete the picture. */
export default function Transmission() {
  return (
    <section id="transmission" className="section">
      <SectionHead hex="0x04" title="TRANSMISSION" meta="OPEN A CHANNEL" />

      <div className="tx">
        <Reveal className="tx__intro">
          <p className="tx__headline">
            Got a system that needs breaking — or defending?
          </p>
          <p className="tx__sub">
            I&apos;m {IDENTITY.status.toLowerCase()}. Reach out on any channel
            below; encrypted is always welcome.
          </p>

          <ul className="tx__channels">
            {CHANNELS.map((c) => {
              const Icon = ICONS[c.proto] ?? Mail;
              return (
                <li key={c.proto}>
                  <a
                    className="tx__channel bracket"
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    <span className="tx__channel-icon">
                      <Icon size={17} />
                    </span>
                    <span className="tx__channel-meta">
                      <span className="tx__channel-proto">{c.proto}</span>
                      <span className="tx__channel-label">{c.label}</span>
                    </span>
                    <ArrowUpRight size={15} className="tx__channel-go" />
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal className="tx__key panel bracket" delay={120}>
          <div className="tx__key-head">
            <KeyRound size={14} />
            <span>PUBLIC KEY · ED25519</span>
          </div>
          <pre className="tx__key-block">{`-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEZ ${IDENTITY.alias}·ops  4a7f  keyid  1c9f77b0e4a1
sekurely  yours,  transmit  freely  ·  verify  fingerprint
below  before  trusting  any  message  attributed  to  me.

-----END PGP PUBLIC KEY BLOCK-----`}</pre>
          <div className="tx__fp">
            <span className="tx__fp-label">FINGERPRINT</span>
            <code className="tx__fp-code">{PGP_FINGERPRINT}</code>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
