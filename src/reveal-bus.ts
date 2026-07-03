/* Bridges navigation and the scroll-reveal animations.

   Sections fade/scramble in as they enter the viewport, which looks great while
   scrolling — but jumping straight to a section via the nav would land on
   content that's still invisible (opacity:0) or mid-scramble, so it looked like
   the click "went nowhere" or to the wrong place.

   On nav, we signal the destination section to reveal immediately. Subscribers
   (the useReveal hook) settle themselves when the signalled id matches their
   section, or when null is passed (reveal everything). */
type RevealListener = (sectionId: string | null) => void;

const listeners = new Set<RevealListener>();

export function subscribeReveal(fn: RevealListener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function forceReveal(sectionId: string | null = null): void {
  listeners.forEach((fn) => fn(sectionId));
}
