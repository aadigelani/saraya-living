import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import entranceImage from "@/assets/haveli-entrance.jpg";

export const Route = createFileRoute("/entrance")({
  head: () => ({
    meta: [
      { title: "Saraya — At the gate" },
      {
        name: "description",
        content:
          "You're standing outside Saraya. The lanterns are lit. Knock, and the haveli will let you in.",
      },
      { property: "og:title", content: "Saraya — At the gate" },
      {
        property: "og:description",
        content: "A candlelit haveli at night. Step inside.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: SarayaEntrance,
});

const PASSCODE = "2109";

type Phase = "approach" | "knocking" | "panel" | "opening";

function SarayaEntrance() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("approach");
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Auto-prompt the gesture after a beat
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "Late traveler. The lanterns are still lit.";
    if (h < 12) return "Morning at the gate.";
    if (h < 17) return "The afternoon is warm. Come in.";
    if (h < 21) return "Evening. The haveli is waiting.";
    return "The house kept the lanterns on for you.";
  }, []);

  const knock = () => {
    if (phase !== "approach") return;
    setPhase("knocking");
    // small delay for the door to crack, then reveal the panel
    setTimeout(() => setPhase("panel"), 650);
    setTimeout(() => inputsRef.current[0]?.focus(), 900);
  };

  const setDigit = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, "").slice(-1);
    setError(false);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (v && i < 3) inputsRef.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  useEffect(() => {
    if (digits.join("").length === 4) {
      if (digits.join("") === PASSCODE) {
        setPhase("opening");
        try {
          sessionStorage.setItem("saraya_entered", "1");
        } catch {}
        setTimeout(() => navigate({ to: "/" }), 1700);
      } else {
        setError(true);
        setTimeout(() => {
          setDigits(["", "", "", ""]);
          inputsRef.current[0]?.focus();
        }, 600);
      }
    }
  }, [digits, navigate]);

  const doorCracked = phase !== "approach";
  const doorOpen = phase === "opening";

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* night vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 110%, transparent 35%, color-mix(in oklab, var(--background) 90%, transparent) 100%)",
        }}
      />

      {/* whisper */}
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-40 flex justify-center pt-6">
        <div className="pointer-events-auto rounded-full border border-[var(--brass)]/30 bg-background/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.32em] text-[var(--brass)] backdrop-blur-md">
          Saraya · {greeting}
        </div>
      </header>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[520px] items-center justify-center">
        <div
          className="relative w-full"
          style={{ aspectRatio: "1024 / 1536" }}
        >
          {/* The night scene */}
          <img
            src={entranceImage}
            alt="The carved wooden gate of Saraya at night, lit by hanging brass lanterns"
            width={1024}
            height={1536}
            className="absolute inset-0 h-full w-full select-none object-cover transition-[filter,transform] duration-[1400ms] ease-out"
            style={{
              filter: doorOpen
                ? "brightness(1.35) saturate(1.1)"
                : doorCracked
                ? "brightness(1.05)"
                : "brightness(0.92)",
              transform: doorOpen ? "scale(1.06)" : "scale(1)",
            }}
            draggable={false}
          />

          {/* lantern flicker overlay (matches living room) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 lantern-flicker"
            style={{
              background:
                "radial-gradient(ellipse at 22% 45%, color-mix(in oklab, var(--saffron) 35%, transparent), transparent 30%), radial-gradient(ellipse at 78% 45%, color-mix(in oklab, var(--saffron) 35%, transparent), transparent 30%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Warm light leaking from the door crack */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[44%] top-[28%] h-[58%] w-[12%] -translate-x-1/2 transition-all duration-[1400ms] ease-out"
            style={{
              background:
                "radial-gradient(ellipse at center, color-mix(in oklab, var(--saffron) 90%, white 10%) 0%, color-mix(in oklab, var(--brass) 70%, transparent) 35%, transparent 75%)",
              mixBlendMode: "screen",
              opacity: doorOpen ? 1 : doorCracked ? 0.55 : 0,
              filter: `blur(${doorOpen ? 28 : 14}px)`,
              transform: doorOpen ? "scaleX(3.5) scaleY(1.4)" : "scaleX(1)",
            }}
          />

          {/* Final white bloom on success */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-[1500ms]"
            style={{
              background:
                "radial-gradient(circle at 48% 55%, color-mix(in oklab, var(--saffron) 80%, white 20%), transparent 60%)",
              opacity: doorOpen ? 0.9 : 0,
              mixBlendMode: "screen",
            }}
          />

          {/* APPROACH gesture — invisible tap target over the door */}
          {phase === "approach" && (
            <button
              type="button"
              onClick={knock}
              aria-label="Knock on the door"
              className="group absolute left-[28%] top-[28%] z-20 h-[58%] w-[44%] rounded-3xl focus-visible:outline-none"
            >
              <span
                aria-hidden
                className="hotspot-pulse pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brass)]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
                style={{
                  background:
                    "radial-gradient(ellipse at center, color-mix(in oklab, var(--brass) 30%, transparent), transparent 70%)",
                }}
              />
              <span className="pointer-events-none absolute left-1/2 top-[88%] -translate-x-1/2 whitespace-nowrap rounded-full bg-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[var(--brass)] backdrop-blur-md">
                · knock ·
              </span>
            </button>
          )}
        </div>
      </div>

      {/* PASSWORD PANEL — slides up like a carved wood drawer from the threshold */}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center transition-all duration-700 ease-out ${
          phase === "panel" ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div
          className={`pointer-events-auto mx-3 mb-4 w-full max-w-[460px] rounded-[28px] border border-[var(--brass)]/40 px-6 py-6 backdrop-blur-xl ${
            error ? "animate-[shake_0.5s_ease-in-out]" : ""
          }`}
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--card) 88%, transparent), color-mix(in oklab, var(--background) 92%, transparent))",
            boxShadow:
              "0 30px 80px -20px color-mix(in oklab, #000 70%, transparent), inset 0 1px 0 color-mix(in oklab, var(--brass) 35%, transparent), inset 0 0 60px color-mix(in oklab, var(--brass) 8%, transparent)",
          }}
        >
          {/* Carved brass header */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--brass)]/60" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--brass)]">
              the house asks
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--brass)]/60" />
          </div>

          <p className="mb-5 text-center font-display text-xl leading-snug text-foreground/90">
            {error ? (
              <span className="text-[var(--crimson)]">
                The door doesn't recognize that. Try again.
              </span>
            ) : (
              <>Whisper the word that opens this door.</>
            )}
          </p>

          {/* 4 brass slots */}
          <div className="mb-4 flex items-center justify-center gap-3">
            {digits.map((d, i) => (
              <div key={i} className="relative">
                <input
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  value={d}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => onKey(i, e)}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  aria-label={`digit ${i + 1}`}
                  className="h-14 w-12 rounded-xl border border-[var(--brass)]/40 bg-background/60 text-center font-display text-2xl text-foreground caret-[var(--brass)] outline-none transition-all focus:border-[var(--brass)] focus:ring-2 focus:ring-[var(--brass)]/40"
                  style={{
                    boxShadow: d
                      ? "inset 0 0 18px color-mix(in oklab, var(--brass) 25%, transparent)"
                      : "inset 0 1px 6px color-mix(in oklab, #000 50%, transparent)",
                  }}
                />
                {/* brass nail accents */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--brass)]/70"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--brass)]/70"
                />
              </div>
            ))}
          </div>

          <p className="text-center text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            tap a digit · the door knows the rest
          </p>
        </div>
      </div>

      {/* shake keyframes (scoped) */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </main>
  );
}
