/* ============================================================================
   CONTENT REGISTER
   Single source of truth. Swap real projects into OPERATIONS when ready —
   every section and the terminal read from here, so nothing else needs edits.
   Placeholder copy is marked  // TODO: replace  where you'll want your own.
   ========================================================================= */

export const IDENTITY = {
  handle: "Nishanth Reddy Kuraku",
  alias: "n1sh", // shell user / callsign
  role: "Security Operations & Offensive Engineering",
  clearance: "TS//SCI — PORTFOLIO",
  location: "Hyderabad, IN", // TODO: replace
  status: "AVAILABLE FOR ENGAGEMENT",
  summary:
    "I break systems to understand them, then rebuild them so they hold. My work spans offensive assessment, detection engineering, and secure architecture — turning adversary tradecraft into defensible controls.", // TODO: tune to your voice
  focus: ["Red Teaming", "Threat Detection", "Cloud Security", "Reverse Engineering"],
};

export const INTEL = [
  { k: "PRIMARY VECTOR", v: "Offensive Security / Red Team" },
  { k: "SECONDARY", v: "Detection Engineering & DFIR" },
  { k: "DEPTH", v: "App · Network · Cloud · Hardware" },
  { k: "DISCLOSURE", v: "Coordinated · Ethics-first" },
];

/* Redacted-until-hover facts — reads as declassified intel bars. */
export const DOSSIER_FACTS = [
  { label: "Origin", value: "Self-taught, CTF-forged" }, // TODO
  { label: "Method", value: "Assume breach. Verify everything." },
  { label: "Weakness", value: "Cannot leave an open port alone" },
  { label: "Off-grid", value: "Lock-picking, chess, black coffee" }, // TODO
];

/* -------------------------------------------------- ARSENAL / capability -- */
export type Cap = { name: string; level: number; note: string };
export type CapGroup = { id: string; title: string; caps: Cap[] };

export const ARSENAL: CapGroup[] = [
  {
    id: "offense",
    title: "Offensive",
    caps: [
      { name: "Web & API Exploitation", level: 5, note: "OWASP • authz • SSRF • deserialization" },
      { name: "Network Penetration", level: 4, note: "AD • lateral movement • pivoting" },
      { name: "Red Team Ops", level: 4, note: "C2 • evasion • adversary emulation" },
      { name: "Binary Exploitation", level: 3, note: "ROP • heap • fuzzing" },
    ],
  },
  {
    id: "defense",
    title: "Defensive",
    caps: [
      { name: "Detection Engineering", level: 5, note: "Sigma • YARA • behavioral analytics" },
      { name: "DFIR & Threat Hunting", level: 4, note: "memory • timeline • IOC pivoting" },
      { name: "Cloud Security", level: 4, note: "AWS • IAM • CSPM • container hardening" },
      { name: "Malware Analysis", level: 3, note: "static • dynamic • unpacking" },
    ],
  },
  {
    id: "toolkit",
    title: "Toolkit",
    caps: [
      { name: "Python / Go / Rust", level: 5, note: "tooling • automation • implants" },
      { name: "Burp • Ghidra • Wireshark", level: 5, note: "daily drivers" },
      { name: "Metasploit • Cobalt Strike", level: 4, note: "operator-level" },
      { name: "Splunk • ELK • Zeek", level: 4, note: "telemetry at scale" },
    ],
  },
];

/* Marquee of tools for the ticker strip. */
export const TOOL_TICKER = [
  "burp suite", "ghidra", "nmap", "metasploit", "wireshark", "bloodhound",
  "cobalt strike", "mimikatz", "sigma", "yara", "volatility", "zeek",
  "splunk", "terraform", "docker", "frida", "radare2", "impacket",
];

/* ---------------------------------------------------- OPERATIONS / work -- */
export type Severity = "critical" | "high" | "medium" | "research";
export type Operation = {
  code: string;           // OP-01
  name: string;
  severity: Severity;
  classification: string; // short kind label
  status: "ACTIVE" | "COMPLETE" | "ONGOING";
  summary: string;
  impact: string;         // the "so what"
  stack: string[];
  links?: { label: string; href: string }[];
};

// TODO: replace all of these with your real projects when ready.
export const OPERATIONS: Operation[] = [
  {
    code: "OP-01",
    name: "SENTINEL GRID",
    severity: "critical",
    classification: "Detection Platform",
    status: "ACTIVE",
    summary:
      "A real-time detection pipeline correlating endpoint, network, and cloud telemetry into ranked, analyst-ready alerts with automated triage.",
    impact: "Cut mean-time-to-detect from hours to under 90 seconds across a simulated enterprise range.",
    stack: ["Go", "Sigma", "Kafka", "ClickHouse", "eBPF"],
    links: [
      { label: "SOURCE", href: "#" },
      { label: "WRITE-UP", href: "#" },
    ],
  },
  {
    code: "OP-02",
    name: "GLASSCUTTER",
    severity: "high",
    classification: "Offensive Tooling",
    status: "COMPLETE",
    summary:
      "A modular C2-adjacent post-exploitation framework with pluggable transports, in-memory execution, and OPSEC-aware logging.",
    impact: "Used to validate detection coverage; every capability shipped with a matching Sigma rule.",
    stack: ["Rust", "gRPC", "Windows API", "AES-GCM"],
    links: [{ label: "SOURCE", href: "#" }],
  },
  {
    code: "OP-03",
    name: "DEADBOLT",
    severity: "high",
    classification: "Cloud Security",
    status: "COMPLETE",
    summary:
      "An IAM misconfiguration scanner that maps AWS privilege-escalation paths as an attack graph and proposes least-privilege fixes.",
    impact: "Surfaced 12 escalation chains in a single account that native tooling missed.",
    stack: ["Python", "Neo4j", "boto3", "Terraform"],
    links: [
      { label: "SOURCE", href: "#" },
      { label: "DEMO", href: "#" },
    ],
  },
  {
    code: "OP-04",
    name: "NIGHTJAR",
    severity: "medium",
    classification: "Reverse Engineering",
    status: "ONGOING",
    summary:
      "Automated malware-family classifier that clusters samples by control-flow similarity and extracts network IOCs headlessly.",
    impact: "Triaged 4k samples/day; clustering agreed with analyst labels 94% of the time.",
    stack: ["Python", "Ghidra API", "scikit-learn", "YARA"],
    links: [{ label: "WRITE-UP", href: "#" }],
  },
  {
    code: "OP-05",
    name: "FARADAY",
    severity: "research",
    classification: "Hardware / RF",
    status: "ONGOING",
    summary:
      "SDR-based research into automotive keyfob rolling-code weaknesses, with a safe, disclosure-first capture-and-replay lab rig.",
    impact: "Turned into a workshop teaching RF fundamentals to 40+ students.",
    stack: ["GNU Radio", "HackRF", "C", "Python"],
    links: [{ label: "SLIDES", href: "#" }],
  },
  {
    code: "OP-06",
    name: "ROSETTA",
    severity: "medium",
    classification: "CTF / Research",
    status: "COMPLETE",
    summary:
      "A collection of original CTF challenges and writeups spanning pwn, crypto, and web — designed to teach one sharp idea each.",
    impact: "Played by 1,200+ competitors; several used in university security courses.",
    stack: ["C", "Python", "Docker", "nginx"],
    links: [
      { label: "CHALLENGES", href: "#" },
      { label: "WRITE-UPS", href: "#" },
    ],
  },
];

/* ------------------------------------------------------ KILL CHAIN / cv -- */
export type TraceNode = {
  phase: string;   // reconnaissance style label
  time: string;    // year range
  title: string;
  org: string;
  detail: string;
};

// TODO: replace with your real timeline.
export const KILL_CHAIN: TraceNode[] = [
  {
    phase: "RECON",
    time: "2019",
    title: "First Blood",
    org: "Self-directed",
    detail:
      "Fell down the CTF rabbit hole. Learned that every abstraction leaks and that reading source beats reading docs.",
  },
  {
    phase: "WEAPONIZE",
    time: "2020 — 2022",
    title: "B.Tech, Computer Science",
    org: "University", // TODO
    detail:
      "Built the fundamentals — OS, networks, cryptography — and ran the campus security club's weekly wargames.",
  },
  {
    phase: "EXPLOIT",
    time: "2022 — 2023",
    title: "Security Analyst, Intern",
    org: "SOC Team", // TODO
    detail:
      "Lived in the SIEM. Wrote detections, chased alerts to ground, and learned what defenders actually need at 3am.",
  },
  {
    phase: "ESCALATE",
    time: "2023 — 2024",
    title: "Penetration Tester",
    org: "Consultancy", // TODO
    detail:
      "Full-scope engagements across web, cloud, and internal networks. Reports that developers thanked me for.",
  },
  {
    phase: "PERSIST",
    time: "2024 — NOW",
    title: "Offensive Security Engineer",
    org: "Present role", // TODO
    detail:
      "Bridging red and blue: building the tooling that finds the gap and the detection that closes it.",
  },
];

export const CERTS = ["OSCP", "CRTO", "GXPN", "AWS Security"]; // TODO

/* --------------------------------------------------- TRANSMISSION / hail -- */
export const CHANNELS = [
  { proto: "MAIL", label: "nishanthreddy7904@gmail.com", href: "mailto:nishanthreddy7904@gmail.com" },
  { proto: "GITHUB", label: "github.com/your-handle", href: "https://github.com" }, // TODO
  { proto: "LINKEDIN", label: "linkedin.com/in/your-handle", href: "https://linkedin.com" }, // TODO
  { proto: "SIGNAL", label: "on request", href: "#" },
];

/* Cosmetic PGP block for the contact section. */
export const PGP_FINGERPRINT = "9F3C  2E71  A4D8  0B62  55AE   1C9F  77B0  E4A1  6D2F  8C34";

/* -------------------------------------------------- NAV / section index -- */
export type SectionDef = { id: string; hex: string; label: string; sub: string };
export const SECTIONS: SectionDef[] = [
  { id: "recon", hex: "0x00", label: "RECON", sub: "identity" },
  { id: "arsenal", hex: "0x01", label: "ARSENAL", sub: "capability" },
  { id: "operations", hex: "0x02", label: "OPERATIONS", sub: "field work" },
  { id: "killchain", hex: "0x03", label: "KILL CHAIN", sub: "trajectory" },
  { id: "transmission", hex: "0x04", label: "TRANSMISSION", sub: "contact" },
];
