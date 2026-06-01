import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import roomImage from "@/assets/haveli-room.jpg";
import { RoomHotspot } from "@/components/saraya/RoomHotspot";
import { RoomDialog } from "@/components/saraya/RoomDialog";
import { movies, sofaWhispers, memories, playlist } from "@/components/saraya/content";
import { Play, ExternalLink, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saraya — Home" },
      {
        name: "description",
        content:
          "Saraya is not a website. It is a private digital home — a candlelit Rajasthani haveli where every object is a doorway.",
      },
      { property: "og:title", content: "Saraya — Home" },
      {
        property: "og:description",
        content: "A private digital haveli. Lanterns lit. Tea on. Come in.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: SarayaRoom,
});

type Modal = "tv" | "music" | "sofa" | "frame" | null;

function SarayaRoom() {
  const navigate = useNavigate();
  const [modal, setModal] = useState<Modal>(null);
  const [whisperIndex, setWhisperIndex] = useState(() =>
    Math.floor(Math.random() * sofaWhispers.length),
  );

  // Gate: if the user hasn't passed through the entrance this session, send them there.
  useEffect(() => {
    try {
      if (sessionStorage.getItem("saraya_entered") !== "1") {
        navigate({ to: "/entrance" });
      }
    } catch {}
  }, [navigate]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "It's late. The house kept the lanterns on.";
    if (h < 12) return "Good morning. The courtyard is quiet.";
    if (h < 17) return "Afternoon light. Tea is warm.";
    if (h < 21) return "Evening. Come in, the lanterns are lit.";
    return "Late again. Saraya saved you a seat.";
  }, []);

  const openSofa = () => {
    setWhisperIndex((i) => (i + 1 + Math.floor(Math.random() * (sofaWhispers.length - 1))) % sofaWhispers.length);
    setModal("sofa");
  };

  const navigate = (to: string) => {
    // Placeholder soft transition for archways/staircase
    const el = document.getElementById("room-stage");
    if (el) {
      el.style.transition = "filter 600ms ease, opacity 600ms ease";
      el.style.filter = "brightness(0.4) blur(6px)";
      el.style.opacity = "0.6";
      setTimeout(() => {
        el.style.filter = "";
        el.style.opacity = "";
      }, 900);
    }
    console.log("[Saraya] travel to", to);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Ambient vignette layers */}
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
            "radial-gradient(circle at 20% 30%, color-mix(in oklab, var(--brass) 35%, transparent), transparent 40%), radial-gradient(circle at 80% 60%, color-mix(in oklab, var(--crimson) 25%, transparent), transparent 45%)",
        }}
      />

      {/* Top whisper */}
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-40 flex justify-center pt-6">
        <div className="pointer-events-auto rounded-full border border-[var(--brass)]/30 bg-background/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.32em] text-[var(--brass)] backdrop-blur-md">
          Saraya · {greeting}
        </div>
      </header>

      {/* Room stage */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-[520px] items-center justify-center">
        <div
          id="room-stage"
          className="relative w-full"
          style={{ aspectRatio: "1024 / 1536" }}
        >
          <img
            src={roomImage}
            alt="The central room of Saraya — a candlelit Rajasthani haveli at evening"
            width={1024}
            height={1536}
            className="absolute inset-0 h-full w-full select-none object-cover"
            draggable={false}
          />

          {/* Subtle warm overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 lantern-flicker"
            style={{
              background:
                "radial-gradient(ellipse at 18% 22%, color-mix(in oklab, var(--brass) 30%, transparent), transparent 35%), radial-gradient(ellipse at 60% 40%, color-mix(in oklab, var(--saffron) 18%, transparent), transparent 40%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Hotspots — positions tuned to the image */}
          {/* Television (left cabinet) */}
          <RoomHotspot
            label="Television"
            hint="tonight's screen"
            style={{ left: "2%", top: "47%", width: "20%", height: "14%" }}
            onClick={() => setModal("tv")}
          />

          {/* Photo frame (above sofa, center-left) */}
          <RoomHotspot
            label="Photo frame"
            hint="memories"
            style={{ left: "33%", top: "33%", width: "18%", height: "13%" }}
            onClick={() => setModal("frame")}
          />

          {/* Music system / gramophone (bottom right) */}
          <RoomHotspot
            label="Music"
            hint="evening playlist"
            style={{ left: "78%", top: "58%", width: "20%", height: "16%" }}
            onClick={() => setModal("music")}
          />

          {/* Sofa (center) */}
          <RoomHotspot
            label="Sofa"
            hint="sit a moment"
            style={{ left: "22%", top: "57%", width: "50%", height: "22%" }}
            onClick={openSofa}
          />

          {/* Kitchen archway (back-left, upper niches with lanterns) */}
          <RoomHotspot
            label="Kitchen"
            hint="archway"
            style={{ left: "14%", top: "39%", width: "20%", height: "12%" }}
            onClick={() => navigate("/kitchen")}
          />

          {/* Bedroom archway (center, glowing bed) */}
          <RoomHotspot
            label="Bedroom"
            hint="archway"
            style={{ left: "50%", top: "43%", width: "13%", height: "26%" }}
            onClick={() => navigate("/bedroom")}
          />

          {/* Garden archway (right, moon + fountain) */}
          <RoomHotspot
            label="Garden"
            hint="archway"
            style={{ left: "64%", top: "37%", width: "16%", height: "32%" }}
            onClick={() => navigate("/garden")}
          />

          {/* Staircase to terrace (far right) */}
          <RoomHotspot
            label="Terrace"
            hint="staircase"
            style={{ left: "82%", top: "20%", width: "16%", height: "30%" }}
            onClick={() => navigate("/terrace")}
          />
        </div>
      </div>

      {/* Bottom signature */}
      <footer className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-5">
        <p className="font-display text-xs italic tracking-wide text-muted-foreground">
          tap an object — every thing here is a door
        </p>
      </footer>

      {/* TV — recommendations */}
      <RoomDialog
        open={modal === "tv"}
        onOpenChange={(o) => !o && setModal(null)}
        eyebrow="On the television tonight"
        title="What we're watching"
        description="A small handful, chosen for the mood of the room."
      >
        <ul className="space-y-3">
          {movies.map((m) => (
            <li
              key={m.title}
              className="flex items-start gap-3 rounded-xl border border-[var(--brass)]/15 bg-background/40 p-3 transition-colors hover:border-[var(--brass)]/40"
            >
              <span className="mt-1 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[var(--brass)]/10 text-[var(--brass)]">
                <Play className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-lg leading-tight text-foreground">
                  {m.title}{" "}
                  <span className="text-xs text-muted-foreground">· {m.year}</span>
                </p>
                <p className="text-sm text-muted-foreground">{m.note}</p>
                <span className="mt-1 inline-block text-[10px] uppercase tracking-[0.22em] text-[var(--brass)]">
                  {m.tag}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </RoomDialog>

      {/* Music */}
      <RoomDialog
        open={modal === "music"}
        onOpenChange={(o) => !o && setModal(null)}
        eyebrow="The gramophone is warm"
        title={playlist.name}
        description={playlist.curator}
      >
        <ul className="mb-4 space-y-1.5">
          {playlist.tracks.map((t, i) => (
            <li key={t.title} className="flex items-baseline gap-3 text-sm">
              <span className="w-5 text-right text-[var(--brass)]/70 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-foreground">{t.title}</span>
              <span className="truncate text-muted-foreground">— {t.artist}</span>
            </li>
          ))}
        </ul>
        <a
          href={playlist.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brass)] px-4 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Open on Spotify <ExternalLink className="h-4 w-4" />
        </a>
      </RoomDialog>

      {/* Sofa whisper */}
      <RoomDialog
        open={modal === "sofa"}
        onOpenChange={(o) => !o && setModal(null)}
        eyebrow="The sofa says"
        title="—"
      >
        <p className="font-display text-2xl leading-snug text-foreground text-glow">
          “{sofaWhispers[whisperIndex]}”
        </p>
        <button
          onClick={() =>
            setWhisperIndex(
              (i) =>
                (i + 1 + Math.floor(Math.random() * (sofaWhispers.length - 1))) %
                sofaWhispers.length,
            )
          }
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--brass)]/30 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--brass)] transition-colors hover:bg-[var(--brass)]/10"
        >
          <Sparkles className="h-3.5 w-3.5" /> Another whisper
        </button>
      </RoomDialog>

      {/* Photo frame */}
      <RoomDialog
        open={modal === "frame"}
        onOpenChange={(o) => !o && setModal(null)}
        eyebrow="In the carved gold frame"
        title="Memory gallery"
        description="Small moments the house keeps for you."
      >
        <div className="grid grid-cols-2 gap-3">
          {memories.map((m, i) => (
            <div
              key={m.title}
              className="group relative overflow-hidden rounded-xl border border-[var(--brass)]/20 bg-background/40 p-3"
            >
              <div
                className="mb-2 aspect-[4/3] w-full rounded-md"
                style={{
                  background: `linear-gradient(${135 + i * 25}deg, color-mix(in oklab, var(--crimson) 60%, transparent), color-mix(in oklab, var(--brass) 70%, transparent))`,
                  boxShadow: "inset 0 0 30px color-mix(in oklab, #000 40%, transparent)",
                }}
              />
              <p className="font-display text-base leading-tight text-foreground">{m.title}</p>
              <p className="text-xs text-muted-foreground">{m.caption}</p>
            </div>
          ))}
        </div>
      </RoomDialog>
    </main>
  );
}
