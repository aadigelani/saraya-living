import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import kitchenImage from "@/assets/haveli-kitchen.jpg";
import { RoomHotspot } from "@/components/saraya/RoomHotspot";
import { RoomDialog } from "@/components/saraya/RoomDialog";
import {
  fridgeNotes,
  secretNotes,
  type SecretNote,
  stoveDishes,
  tableMessages,
  waterReminders,
  spiceJars,
  windowView,
} from "@/components/saraya/kitchen-content";
import { ArrowLeft, Flame, Droplets, Sparkles } from "lucide-react";

export const Route = createFileRoute("/kitchen")({
  head: () => ({
    meta: [
      { title: "Saraya — The Kitchen" },
      {
        name: "description",
        content:
          "The kitchen of Saraya. Sticky notes on the fridge, a kettle on the stove, someone has been thinking about you.",
      },
      { property: "og:title", content: "Saraya — The Kitchen" },
      {
        property: "og:description",
        content: "Come in. Eat something. The house has been keeping things warm.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: KitchenRoom,
});

type Modal =
  | "fridge"
  | "stove"
  | "table"
  | "water"
  | "window"
  | "pantry"
  | null;

const NOTE_TINTS: Record<string, { bg: string; ink: string; tape: string }> = {
  saffron: {
    bg: "linear-gradient(135deg, #f6c454, #e89a3a)",
    ink: "#3a1d05",
    tape: "rgba(255,255,255,0.55)",
  },
  crimson: {
    bg: "linear-gradient(135deg, #c64f5a, #8a2330)",
    ink: "#fdeede",
    tape: "rgba(255,220,180,0.5)",
  },
  brass: {
    bg: "linear-gradient(135deg, #d9b06a, #8a6126)",
    ink: "#2a1602",
    tape: "rgba(255,255,255,0.45)",
  },
};

function pickRandom<T>(arr: T[], not?: number) {
  if (arr.length <= 1) return 0;
  let i = Math.floor(Math.random() * arr.length);
  if (not !== undefined && i === not) i = (i + 1) % arr.length;
  return i;
}

function KitchenRoom() {
  const router = useNavigate();
  const [modal, setModal] = useState<Modal>(null);

  // Session-entry gate
  useEffect(() => {
    try {
      if (sessionStorage.getItem("saraya_entered") !== "1") {
        router({ to: "/entrance" });
      }
    } catch {}
  }, [router]);

  // ── Fridge state ────────────────────────────────────
  // openCount persists across the session — used to unlock the "frequent" secret
  const [openCount, setOpenCount] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(sessionStorage.getItem("saraya_fridge_opens") ?? "0");
  });
  const [fridgeSeed, setFridgeSeed] = useState(0);
  const visibleNotes = useMemo(() => {
    const pool = [...fridgeNotes.keys()];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(((Math.sin(fridgeSeed * 999 + i) + 1) / 2) * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 8);
  }, [fridgeSeed]);

  const [foundSecrets, setFoundSecrets] = useState<Set<string>>(() => new Set());
  const [openSecret, setOpenSecret] = useState<SecretNote | null>(null);
  // A special tile shown in the grid when a non-hidden secret is available this open.
  const [offeredSecret, setOfferedSecret] = useState<SecretNote | null>(null);

  // Stove
  const [dishIdx, setDishIdx] = useState<number | null>(null);
  const [cookStep, setCookStep] = useState(0);
  const [cooked, setCooked] = useState(false);
  useEffect(() => {
    if (modal !== "stove" || dishIdx === null || cooked) return;
    const dish = stoveDishes[dishIdx];
    if (cookStep >= dish.steps.length) {
      const t = setTimeout(() => setCooked(true), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCookStep((s) => s + 1), 1100);
    return () => clearTimeout(t);
  }, [modal, dishIdx, cookStep, cooked]);
  const startDish = (i: number) => {
    setDishIdx(i);
    setCookStep(0);
    setCooked(false);
  };

  // Table & water rotating
  const [tableIdx, setTableIdx] = useState(() => pickRandom(tableMessages));
  const [waterIdx, setWaterIdx] = useState(() => pickRandom(waterReminders));

  const openFridge = () => {
    setFridgeSeed((s) => s + 1);
    setOpenSecret(null);

    const nextCount = openCount + 1;
    setOpenCount(nextCount);
    try {
      sessionStorage.setItem("saraya_fridge_opens", String(nextCount));
    } catch {}

    // Pick which non-hidden secret (if any) to offer this open.
    const hour = new Date().getHours();
    const candidates: SecretNote[] = [];
    for (const s of secretNotes) {
      if (s.trigger === "hidden") continue;
      if (foundSecrets.has(s.id)) continue;
      if (s.trigger === "frequent" && nextCount >= 4) candidates.push(s);
      if (s.trigger === "latenight" && (hour < 5 || hour >= 23)) candidates.push(s);
      if (s.trigger === "rare" && Math.random() < 0.18) candidates.push(s);
    }
    setOfferedSecret(candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null);

    setModal("fridge");
  };
  const openStove = () => {
    setDishIdx(null);
    setCookStep(0);
    setCooked(false);
    setModal("stove");
  };
  const openTable = () => {
    setTableIdx((i) => pickRandom(tableMessages, i));
    setModal("table");
  };
  const openWater = () => {
    setWaterIdx((i) => pickRandom(waterReminders, i));
    setModal("water");
  };

  const dimAndReturn = () => {
    const el = document.getElementById("kitchen-stage");
    if (el) {
      el.style.transition = "filter 600ms ease, opacity 600ms ease";
      el.style.filter = "brightness(0.4) blur(6px)";
      el.style.opacity = "0.6";
    }
    setTimeout(() => router({ to: "/" }), 550);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Ambient vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 110%, transparent 40%, color-mix(in oklab, var(--background) 85%, transparent) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-30 mix-blend-soft-light opacity-60"
        style={{
          background:
            "radial-gradient(circle at 22% 28%, color-mix(in oklab, var(--brass) 35%, transparent), transparent 40%), radial-gradient(circle at 78% 55%, color-mix(in oklab, var(--saffron) 22%, transparent), transparent 45%)",
        }}
      />

      {/* Top whisper */}
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-40 flex justify-center pt-6">
        <div className="pointer-events-auto rounded-full border border-[var(--brass)]/30 bg-background/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.32em] text-[var(--brass)] backdrop-blur-md">
          Saraya · the kitchen has been waiting
        </div>
      </header>

      {/* Back to living room */}
      <button
        type="button"
        onClick={dimAndReturn}
        className="fixed left-4 top-20 z-40 inline-flex items-center gap-2 rounded-full border border-[var(--brass)]/30 bg-background/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[var(--brass)] backdrop-blur-md transition-colors hover:bg-[var(--brass)]/10"
      >
        <ArrowLeft className="h-3 w-3" /> living room
      </button>

      {/* Stage */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-[520px] items-center justify-center">
        <div
          id="kitchen-stage"
          className="relative w-full"
          style={{ aspectRatio: "1080 / 1920" }}
        >
          <img
            src={kitchenImage}
            alt="The kitchen of Saraya — a Rajasthani haveli kitchen at evening, lanterns lit, kettle on"
            width={1080}
            height={1920}
            className="absolute inset-0 h-full w-full select-none object-cover"
            draggable={false}
          />

          {/* Warm overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 lantern-flicker"
            style={{
              background:
                "radial-gradient(ellipse at 18% 18%, color-mix(in oklab, var(--brass) 32%, transparent), transparent 35%), radial-gradient(ellipse at 70% 38%, color-mix(in oklab, var(--saffron) 18%, transparent), transparent 40%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Refrigerator (left, sticky-note covered) */}
          <RoomHotspot
            label="Refrigerator"
            hint="sticky notes"
            style={{ left: "2%", top: "38%", width: "24%", height: "44%" }}
            onClick={openFridge}
          />

          {/* Pantry shelf (spice jars above stove) */}
          <RoomHotspot
            label="Pantry"
            hint="jars & spices"
            style={{ left: "23%", top: "27%", width: "22%", height: "20%" }}
            onClick={() => setModal("pantry")}
          />

          {/* Stove (kettle + flame) */}
          <RoomHotspot
            label="Stove"
            hint="put something on"
            style={{ left: "26%", top: "48%", width: "22%", height: "22%" }}
            onClick={openStove}
          />

          {/* Water bottle (copper bottle near stove) */}
          <RoomHotspot
            label="Water"
            hint="a small sip"
            style={{ left: "30%", top: "44%", width: "8%", height: "10%" }}
            onClick={openWater}
          />

          {/* Window — garden glimpse */}
          <RoomHotspot
            label="Window"
            hint="the garden is awake"
            style={{ left: "52%", top: "12%", width: "44%", height: "44%" }}
            onClick={() => setModal("window")}
          />

          {/* Dining table */}
          <RoomHotspot
            label="Table"
            hint="sit for a while"
            style={{ left: "55%", top: "68%", width: "40%", height: "24%" }}
            onClick={openTable}
          />
        </div>
      </div>

      {/* Bottom whisper */}
      <footer className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-5">
        <p className="font-display text-xs italic tracking-wide text-muted-foreground">
          tap an object — somebody left this room warm for you
        </p>
      </footer>

      {/* ───────── Fridge ───────── */}
      <RoomDialog
        open={modal === "fridge"}
        onOpenChange={(o) => !o && setModal(null)}
        eyebrow="On the fridge"
        title="Little notes, in your favour"
        description="The magnets are crooked. The handwriting is fond."
      >
        <div className="relative">
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {visibleNotes.map((idx, i) => {
              const n = fridgeNotes[idx];
              const tint = NOTE_TINTS[n.color] ?? NOTE_TINTS.saffron;
              const rot = ((idx * 53) % 11) - 5; // stable, varied
              const isSecretHost = i === 4 && !secretFound; // a particular spot hides the note
              return (
                <button
                  key={`${fridgeSeed}-${idx}`}
                  onClick={() => {
                    if (isSecretHost) {
                      setSecretFound(true);
                      setSecretOpen(true);
                    }
                  }}
                  className="group relative aspect-square w-full rounded-sm p-2 text-left shadow-md transition-transform hover:scale-[1.04] focus:outline-none"
                  style={{
                    background: tint.bg,
                    color: tint.ink,
                    transform: `rotate(${rot}deg)`,
                    boxShadow:
                      "0 6px 14px -6px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                  aria-label={isSecretHost ? "A folded note peeks out" : n.text}
                >
                  {/* tape */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-[-6px] h-3 w-8 -translate-x-1/2 rounded-[2px]"
                    style={{ background: tint.tape }}
                  />
                  <p
                    style={{ fontFamily: "Caveat, cursive" }}
                    className="text-[13px] leading-tight"
                  >
                    {n.text}
                  </p>
                  {isSecretHost && (
                    <span
                      aria-hidden
                      className="hotspot-pulse pointer-events-none absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-white"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-[11px] italic text-muted-foreground">
              {secretFound
                ? "you found the folded one. it's yours to keep."
                : "look closely — one of them is hiding something."}
            </p>
            <button
              onClick={() => setFridgeSeed((s) => s + 1)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brass)]/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[var(--brass)] transition-colors hover:bg-[var(--brass)]/10"
            >
              <Sparkles className="h-3 w-3" /> shuffle
            </button>
          </div>
        </div>

        {secretOpen && (
          <div
            className="mt-5 rounded-xl border border-[var(--brass)]/30 p-4"
            style={{
              background:
                "linear-gradient(160deg, color-mix(in oklab, var(--brass) 18%, transparent), color-mix(in oklab, var(--crimson) 22%, transparent))",
              boxShadow:
                "inset 0 0 30px color-mix(in oklab, var(--brass) 30%, transparent)",
            }}
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--brass)]">
              {secretNote.preview}
            </p>
            <p
              style={{ fontFamily: "Caveat, cursive" }}
              className="mt-2 whitespace-pre-line text-xl leading-snug text-foreground text-glow"
            >
              {secretNote.message}
            </p>
            <p className="mt-3 text-right font-display text-sm italic text-[var(--brass)]">
              {secretNote.signed}
            </p>
          </div>
        )}
      </RoomDialog>

      {/* ───────── Stove ───────── */}
      <RoomDialog
        open={modal === "stove"}
        onOpenChange={(o) => !o && setModal(null)}
        eyebrow="On the stove"
        title={dishIdx === null ? "What shall we put on?" : stoveDishes[dishIdx].name}
        description={
          dishIdx === null
            ? "Pick one. The kettle is already warm."
            : stoveDishes[dishIdx].eyebrow
        }
      >
        {dishIdx === null ? (
          <ul className="space-y-2.5">
            {stoveDishes.map((d, i) => (
              <li key={d.id}>
                <button
                  onClick={() => startDish(i)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-[var(--brass)]/20 bg-background/40 p-3 text-left transition-colors hover:border-[var(--brass)]/50"
                >
                  <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[var(--brass)]/10 text-[var(--brass)]">
                    <Flame className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-lg leading-tight text-foreground">
                      {d.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{d.eyebrow}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            {/* Flame + pot */}
            <div className="relative mx-auto mb-4 flex h-32 w-full items-end justify-center overflow-hidden rounded-xl border border-[var(--brass)]/20 bg-background/40">
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-20"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 100%, color-mix(in oklab, var(--saffron) 75%, transparent), transparent 60%)",
                  filter: "blur(2px)",
                }}
              />
              {/* steam */}
              {[0, 1, 2].map((k) => (
                <span
                  key={k}
                  aria-hidden
                  className="absolute bottom-14 h-10 w-10 rounded-full opacity-0"
                  style={{
                    left: `${44 + k * 4}%`,
                    background:
                      "radial-gradient(circle, color-mix(in oklab, #fff 55%, transparent), transparent 70%)",
                    animation: `steam 2.4s ${k * 0.4}s ease-out infinite`,
                  }}
                />
              ))}
              <div className="relative z-10 mb-4 h-10 w-20 rounded-b-full rounded-t-md bg-gradient-to-b from-[#d4a05a] to-[#7a4a18] shadow-[inset_0_2px_0_rgba(255,255,255,0.25)]" />
              <Flame className="absolute bottom-2 left-1/2 h-6 w-6 -translate-x-1/2 text-[var(--saffron)] lantern-flicker" />
              <style>{`@keyframes steam{0%{transform:translateY(0) scale(0.6);opacity:0}30%{opacity:.55}100%{transform:translateY(-60px) scale(1.6);opacity:0}}`}</style>
            </div>

            <ol className="space-y-2">
              {stoveDishes[dishIdx].steps.slice(0, Math.min(cookStep + 1, stoveDishes[dishIdx].steps.length)).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/90 animate-fade-in">
                  <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[var(--brass)]" />
                  <span>{s}</span>
                </li>
              ))}
            </ol>

            {cooked && (
              <div className="mt-5 animate-fade-in rounded-xl border border-[var(--brass)]/30 bg-[var(--brass)]/10 p-4">
                <p className="font-display text-xl leading-snug text-foreground text-glow">
                  {stoveDishes[dishIdx].result}
                </p>
                <button
                  onClick={() => {
                    setDishIdx(null);
                    setCookStep(0);
                    setCooked(false);
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--brass)]/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[var(--brass)] transition-colors hover:bg-[var(--brass)]/10"
                >
                  cook something else
                </button>
              </div>
            )}
          </div>
        )}
      </RoomDialog>

      {/* ───────── Table ───────── */}
      <RoomDialog
        open={modal === "table"}
        onOpenChange={(o) => !o && setModal(null)}
        eyebrow="The table says"
        title="—"
      >
        <p className="font-display text-2xl leading-snug text-foreground text-glow">
          “{tableMessages[tableIdx]}”
        </p>
        <button
          onClick={() => setTableIdx((i) => pickRandom(tableMessages, i))}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--brass)]/30 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--brass)] transition-colors hover:bg-[var(--brass)]/10"
        >
          <Sparkles className="h-3.5 w-3.5" /> another seat, another whisper
        </button>
      </RoomDialog>

      {/* ───────── Water ───────── */}
      <RoomDialog
        open={modal === "water"}
        onOpenChange={(o) => !o && setModal(null)}
        eyebrow="The copper bottle"
        title="A small sip"
      >
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[var(--brass)]/10 text-[var(--brass)]">
            <Droplets className="h-4 w-4" />
          </span>
          <p className="font-display text-xl leading-snug text-foreground">
            {waterReminders[waterIdx]}
          </p>
        </div>
        <button
          onClick={() => setWaterIdx((i) => pickRandom(waterReminders, i))}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--brass)]/30 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--brass)] transition-colors hover:bg-[var(--brass)]/10"
        >
          one more reminder
        </button>
      </RoomDialog>

      {/* ───────── Window ───────── */}
      <RoomDialog
        open={modal === "window"}
        onOpenChange={(o) => !o && setModal(null)}
        eyebrow={windowView.eyebrow}
        title={windowView.title}
        description="A small window into the garden, kept open for you."
      >
        <div
          className="mb-4 h-40 w-full overflow-hidden rounded-xl border border-[var(--brass)]/20"
          style={{
            background:
              "radial-gradient(ellipse at 78% 22%, #f4e2a8 0 6%, transparent 7%), linear-gradient(180deg, #0b1a36 0%, #14305a 45%, #1c4a3a 70%, #0e2a1b 100%)",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.55)",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(circle at 50% 90%, color-mix(in oklab, var(--saffron) 55%, transparent) 0 8%, transparent 9%), radial-gradient(circle at 30% 95%, color-mix(in oklab, var(--crimson) 60%, transparent) 0 4%, transparent 5%), radial-gradient(circle at 68% 92%, color-mix(in oklab, var(--saffron) 50%, transparent) 0 5%, transparent 6%)",
            }}
          />
        </div>
        <ul className="space-y-1.5 text-sm text-foreground/90">
          {windowView.lines.map((l) => (
            <li key={l} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[var(--brass)]" />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </RoomDialog>

      {/* ───────── Pantry ───────── */}
      <RoomDialog
        open={modal === "pantry"}
        onOpenChange={(o) => !o && setModal(null)}
        eyebrow="On the wooden shelf"
        title="Jars, in good company"
        description="Glass, label fading, smell intact."
      >
        <ul className="space-y-2.5">
          {pantryFinds.map((p) => (
            <li
              key={p.jar}
              className="flex items-start gap-3 rounded-xl border border-[var(--brass)]/15 bg-background/40 p-3"
            >
              <span className="mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[var(--brass)]/10 text-[10px] font-semibold uppercase tracking-wider text-[var(--brass)]">
                {p.jar[0]}
              </span>
              <div className="min-w-0">
                <p className="font-display text-base leading-tight text-foreground">
                  {p.jar}
                </p>
                <p className="text-xs text-muted-foreground">{p.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </RoomDialog>
    </main>
  );
}
