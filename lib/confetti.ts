const colors = ["#5c3825", "#75482d", "#8b5e3c", "#a8754f", "#c08a5d", "#d4a373"];

/** A short shower of coffee toned confetti falling across the screen. */
export function fireConfetti(_origin?: HTMLElement | null) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  Object.assign(layer.style, {
    position: "fixed",
    inset: "0",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: "9999",
  });
  document.body.appendChild(layer);

  for (let i = 0; i < 48; i += 1) {
    const piece = document.createElement("span");
    const size = 5 + Math.random() * 6;
    const startX = Math.random() * window.innerWidth;
    const driftX = (Math.random() - 0.5) * 180;
    const rotation = Math.random() * 900 - 450;
    Object.assign(piece.style, {
      position: "absolute",
      left: `${startX}px`,
      top: `-${10 + Math.random() * 100}px`,
      width: `${size}px`,
      height: `${size * (1.2 + Math.random())}px`,
      borderRadius: Math.random() > 0.55 ? "50%" : "2px",
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      willChange: "transform, opacity",
    });
    layer.appendChild(piece);
    piece.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${driftX}px, ${window.innerHeight + 80}px) rotate(${rotation}deg)`,
          opacity: 0.15,
        },
      ],
      {
        duration: 1300 + Math.random() * 900,
        delay: Math.random() * 350,
        easing: "cubic-bezier(.2,.65,.4,1)",
        fill: "forwards",
      }
    );
  }

  window.setTimeout(() => layer.remove(), 2800);
}
