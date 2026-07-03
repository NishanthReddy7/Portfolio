/* Ambient operations-room atmosphere: a faint engineering grid, a slow
   phosphor vignette, and one drifting scan band. Pure CSS, GPU-cheap,
   and fully inert under prefers-reduced-motion (handled in the stylesheet). */
export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__grid" />
      <div className="backdrop__vignette" />
      <div className="backdrop__scan" />
      <div className="backdrop__noise" />
    </div>
  );
}
