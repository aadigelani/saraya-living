import { type ReactNode } from "react";

interface RoomHotspotProps {
  label: string;
  hint?: string;
  /** Position as percentage of the room image (mobile-first) */
  style: { left: string; top: string; width: string; height: string };
  onClick: () => void;
  children?: ReactNode;
}

export function RoomHotspot({ label, hint, style, onClick, children }: RoomHotspotProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group absolute z-10 flex items-end justify-center rounded-2xl transition-all duration-500 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={style}
    >
      {/* Glow halo */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--brass) 35%, transparent), transparent 70%)",
        }}
      />
      {/* Pulse dot */}
      <span
        aria-hidden
        className="hotspot-pulse pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[var(--brass)]"
      />
      {/* Label */}
      <span className="pointer-events-none relative mb-[-1.75rem] translate-y-1 whitespace-nowrap rounded-full bg-background/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur-md opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
        <span className="text-[var(--brass)]">·</span> {label}
        {hint && <span className="ml-1 text-muted-foreground normal-case tracking-normal">— {hint}</span>}
      </span>
      {children}
    </button>
  );
}
