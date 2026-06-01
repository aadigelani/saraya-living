// ─────────────────────────────────────────────────────────────
// Fridge notes — the emotional heart of the kitchen.
// 60+ handwritten-feeling notes. Mix of caring, reassuring,
// playful, encouraging, funny, soft-romantic.
// ─────────────────────────────────────────────────────────────

export type NoteColor = "saffron" | "crimson" | "brass";

export const fridgeNotes: { text: string; color: NoteColor }[] = [
  // — caring
  { text: "In case nobody told you today, I'm proud of you.", color: "crimson" },
  { text: "Please eat something before conquering the world.", color: "saffron" },
  { text: "I hope today was kinder to you than yesterday.", color: "brass" },
  { text: "You don't always have to be strong.", color: "crimson" },
  { text: "Drink water. Then read this again.", color: "saffron" },
  { text: "If you skipped breakfast — the fridge knows. The fridge forgives.", color: "brass" },
  { text: "Rest is also progress. Saraya said so.", color: "saffron" },
  { text: "Whatever you are carrying today, you can put a little down here.", color: "crimson" },
  { text: "The biryani in the back is for you. Don't ration your own happiness.", color: "brass" },
  { text: "Eat warm food. Cold food is for cold days.", color: "saffron" },

  // — reassuring
  { text: "You're not behind. You're on your own clock.", color: "saffron" },
  { text: "Whatever you decided today was probably the right thing.", color: "crimson" },
  { text: "You're allowed to change your mind. About anything.", color: "brass" },
  { text: "The thing you're worried about — it usually shrinks by morning.", color: "saffron" },
  { text: "Not every day needs to be productive. Some days are just Tuesdays.", color: "crimson" },
  { text: "You're not too much. They just had a small cup.", color: "brass" },
  { text: "Soft days are not wasted days.", color: "saffron" },
  { text: "It's okay if you cried. Salt is a flavour.", color: "crimson" },
  { text: "You don't owe anyone an explanation for being tired.", color: "brass" },
  { text: "Breathe out. Longer than you breathed in.", color: "saffron" },

  // — playful
  { text: "The fridge has officially noticed you're amazing.", color: "brass" },
  { text: "Snack first. Existential crisis after.", color: "saffron" },
  { text: "Warning: contents of this house are emotionally attached to you.", color: "crimson" },
  { text: "The mangoes are flirting with the curd. Mediate gently.", color: "brass" },
  { text: "We do NOT ration ghee in this household.", color: "saffron" },
  { text: "The leftovers held a small ceremony. They miss you.", color: "crimson" },
  { text: "If a samosa falls in the kitchen and nobody sees, you still get the calories. Sorry.", color: "brass" },
  { text: "The kettle has been gossiping about you. All good things.", color: "saffron" },
  { text: "There is a 100% chance the pickle jar wants attention.", color: "crimson" },
  { text: "Important: the dahi expires Friday. Your worries can expire too.", color: "brass" },

  // — encouraging
  { text: "You make ordinary days feel important.", color: "crimson" },
  { text: "Whatever you're building, keep going. Saraya is rooting for it.", color: "saffron" },
  { text: "Small steps are still steps. And steps are still movement.", color: "brass" },
  { text: "You're better at this than you give yourself credit for.", color: "crimson" },
  { text: "One brave email today. That's all.", color: "saffron" },
  { text: "The person you used to be would be impressed by who you are now.", color: "brass" },
  { text: "Your taste, your timing, your way. All correct.", color: "crimson" },
  { text: "You are not the storm. You are the house that is still standing.", color: "saffron" },
  { text: "Whatever you choose tonight is the right choice. The fridge votes yes.", color: "brass" },

  // — funny
  { text: "I'm a fridge, not a therapist. But also — how are you?", color: "saffron" },
  { text: "The leftover dal has filed a complaint. It misses you.", color: "crimson" },
  { text: "Today's forecast: 100% chance of you doing fine.", color: "brass" },
  { text: "If you eat standing up, the calories don't count. Approved by no one.", color: "saffron" },
  { text: "Reminder: you cannot pour from an empty thali.", color: "crimson" },
  { text: "The onion did not make you cry. You're just allowed to feel things.", color: "brass" },
  { text: "Stop reading the news on an empty stomach. Read a paratha first.", color: "saffron" },
  { text: "If anyone asks — yes, you DID water the tulsi. We have a deal.", color: "crimson" },

  // — soft romantic / tender
  { text: "Somewhere, someone is hoping you slept well last night.", color: "crimson" },
  { text: "You are easy to love on a Tuesday. Pass it on.", color: "brass" },
  { text: "If I could pack a small sun into your tiffin, I would.", color: "saffron" },
  { text: "The lanterns wait up for you. Always have.", color: "crimson" },
  { text: "Your name sounds nice in this kitchen. The walls remember.", color: "brass" },
  { text: "If the day was loud, come back here. It's quiet on purpose.", color: "saffron" },
  { text: "You being here makes the rooms warmer. Verified by the lamps.", color: "crimson" },
  { text: "Saraya keeps a little light on for you. Even at 3 a.m.", color: "brass" },
  { text: "Some part of this house is always thinking about you.", color: "saffron" },
  { text: "If you forget everything else today, remember: you are deeply, quietly loved.", color: "crimson" },

  // — soft / small
  { text: "Stretch. Just shoulders. Just once.", color: "saffron" },
  { text: "Wash your face. The day comes off.", color: "brass" },
  { text: "Light a diya if the day was heavy.", color: "crimson" },
  { text: "Two minutes outside. The sky misses you.", color: "saffron" },
  { text: "Call somebody who would smile to hear from you.", color: "brass" },
  { text: "Sleep early. The internet will be there tomorrow.", color: "crimson" },
];

// ─────────────────────────────────────────────────────────────
// Secret notes — rare discoveries, more personal than the rest.
// trigger:
//   - "hidden":   tucked behind a normal note on the fridge
//   - "frequent": appears after the fridge has been opened a few times
//   - "rare":     small chance on any open
//   - "latenight": appears between midnight and 5am
// ─────────────────────────────────────────────────────────────

export type SecretNote = {
  id: string;
  trigger: "hidden" | "frequent" | "rare" | "latenight";
  preview: string;
  message: string;
  signed: string;
};

export const secretNotes: SecretNote[] = [
  {
    id: "marigold",
    trigger: "hidden",
    preview: "(folded small, behind the marigold magnet)",
    message:
      "I know nobody asked today.\n\nSo — how are you, really? Whatever the answer is, this house is on your side. Always was.",
    signed: "— Saraya",
  },
  {
    id: "kept-for-you",
    trigger: "frequent",
    preview: "(tucked under the brass clip — opened only by people who keep coming back)",
    message:
      "You keep opening this fridge. I love that about you.\n\nIt means somewhere in your day, you remembered there's a place that's gentle with you. That place is here. It's also you.",
    signed: "— the house, quietly",
  },
  {
    id: "rare-bloom",
    trigger: "rare",
    preview: "(a note that wasn't here a minute ago)",
    message:
      "Just so you know — if today was a small day, it still counted.\n\nIf today was a big day, you can put it down now. The kitchen will hold the rest.",
    signed: "— with you",
  },
  {
    id: "midnight",
    trigger: "latenight",
    preview: "(slipped between the pickles — you weren't supposed to find this until late)",
    message:
      "It's late. You're still up.\n\nThat's allowed. Eat something small. Drink some water. Then — promise me — close the laptop. The sentence you're stuck on will be there in the morning, and you'll be kinder to it.",
    signed: "— the kitchen, at this hour",
  },
  {
    id: "first-love",
    trigger: "rare",
    preview: "(in handwriting you almost recognise)",
    message:
      "If I had to choose one thing to leave in this fridge for you, it would be this:\n\nYou are not a project to be optimised. You are a person to be loved. The difference matters.",
    signed: "— yours",
  },
];

// ─────────────────────────────────────────────────────────────
// Stove (unchanged — kept the cooking ritual)
// ─────────────────────────────────────────────────────────────

export const stoveDishes = [
  {
    id: "tea",
    name: "Masala chai",
    eyebrow: "kettle on, flame low",
    steps: [
      "Water in the brass kettle…",
      "Crushed cardamom, a sliver of ginger…",
      "Milk, slow swirl…",
      "Two sugars. Don't tell anyone.",
    ],
    result: "This tea passed quality inspection. Pour for two — just in case.",
  },
  {
    id: "maggi",
    name: "Midnight Maggi",
    eyebrow: "two minutes is a lie. we know.",
    steps: [
      "Water bubbling in the steel pot…",
      "Noodles in, tastemaker after…",
      "One green chilli, because we're brave…",
      "Stir. Smell the kitchen change.",
    ],
    result: "Cooked with 100% love and 0% judgment. Eat it straight from the pot.",
  },
  {
    id: "biryani",
    name: "Sunday biryani",
    eyebrow: "the long, slow one",
    steps: [
      "Basmati soaking, saffron in warm milk…",
      "Onions browning into a sigh…",
      "Layers — rice, masala, rice, mint…",
      "Dum. Seal the pot. Wait. Trust.",
    ],
    result: "The whole house smells like a celebration. Save a plate for tomorrow you.",
  },
];

export const tableMessages = [
  "Sit for a while. The chair was waiting.",
  "You've done enough for today.",
  "Eat slowly. Nothing here is in a hurry.",
  "Put the phone face down. Just for this meal.",
  "There's room at this table for whoever you are tonight.",
  "Even the thali looks happier when you're here.",
  "Salt's on the left. Kindness is on every side.",
  "Stay for one more cup.",
];

export const waterReminders = [
  "A small sip. That's all.",
  "Your body has been carrying you. Thank it with water.",
  "Eight glasses is a myth. Drink when you remember. Remember now.",
  "Cold copper water. Old trick. Still works.",
  "Hydration is a love language.",
  "One glass, then back to whatever you were doing.",
];

// ─────────────────────────────────────────────────────────────
// Spice Discovery — each jar reveals something.
// blurb = one-line tease (always shown)
// story = the longer reveal (shown when the jar is opened)
// hue   = jar tint
// ─────────────────────────────────────────────────────────────

export type SpiceJar = {
  jar: string;
  blurb: string;
  story: string;
  hue: string; // css colour for the jar contents
};

export const spiceJars: SpiceJar[] = [
  {
    jar: "Cardamom",
    blurb: "The quiet overachiever of chai.",
    story:
      "Three pods can change a whole pot. Grandmothers know to crack them with the back of a spoon — never crush. The smell is the spice's way of saying hello before it arrives.",
    hue: "#8aa66a",
  },
  {
    jar: "Saffron",
    blurb: "Proof that small things can be precious.",
    story:
      "It takes 150 crocus flowers to make a single gram. Three threads, warmed in milk, will perfume an entire pot of rice. Anything that small and that powerful deserves a little reverence.",
    hue: "#e08a2a",
  },
  {
    jar: "Cinnamon",
    blurb: "Smells like someone trying to make a bad day better.",
    story:
      "Once worth more than gold. Traders would invent monsters and sea serpents to keep its source a secret. Today it costs less than a samosa — which feels like a small, daily miracle.",
    hue: "#9a5224",
  },
  {
    jar: "Turmeric",
    blurb: "Half medicine, half mood lighting.",
    story:
      "Stains everything it touches — counters, curtains, conscience. Grandmothers will tell you sun fades the marks. They are right about the marks. They are right about most things, eventually.",
    hue: "#e3a52a",
  },
  {
    jar: "Cumin",
    blurb: "The smell of dinner starting.",
    story:
      "Toss it into hot oil and the whole house knows food is on the way. There is no Indian kitchen that does not begin some recipe with this small, brown, completely unassuming seed.",
    hue: "#7a4a22",
  },
  {
    jar: "Cloves",
    blurb: "Tiny nails for a toothache, and for a biryani.",
    story:
      "Used as a breath freshener in Chinese courts 2,000 years ago. Anyone wishing to address the emperor had to chew one first. The biryani version of this rule is: chew carefully, or regret quietly.",
    hue: "#5a3018",
  },
  {
    jar: "Black pepper",
    blurb: "The original world traveller.",
    story:
      "This jar started entire trade routes. Rome paid in gold for it. Empires rearranged themselves around it. And now it lives next to the salt, completely unbothered.",
    hue: "#2a2018",
  },
  {
    jar: "Jaggery",
    blurb: "For the chai. And for the days that taste a little flat.",
    story:
      "Unrefined, golden-brown, sticky. Made by slow-boiling cane juice in huge iron pans until the world smells like caramel. A single piece dissolved in warm water is grandmother's first cure for everything.",
    hue: "#a0651e",
  },
  {
    jar: "Ajwain",
    blurb: "Grandmother's cure for everything. Mostly correct.",
    story:
      "Stomach upset? Ajwain. Cold? Ajwain. Existential dread? Ajwain in warm water with a pinch of salt. Modern science quietly agrees with most of this.",
    hue: "#6e5a2a",
  },
  {
    jar: "Mustard seeds",
    blurb: "Small. Loud. Should not be underestimated.",
    story:
      "Drop them in hot oil and they pop like tiny applause. South Indian kitchens believe a dish without that sound is technically not finished. Northern kitchens are starting to agree.",
    hue: "#a87a2a",
  },
  {
    jar: "Hing (asafoetida)",
    blurb: "Frightening to smell. Magical to eat.",
    story:
      "On its own — alarming. A pinch in hot ghee — transformative. It's the secret reason your aunt's dal tastes better than yours. She will never tell you. The jar will.",
    hue: "#bca25a",
  },
  {
    jar: "Red chilli",
    blurb: "A small disagreement, in powder form.",
    story:
      "Did not exist in Indian cooking until the 1500s. Portuguese ships brought it from the Americas. India looked at it once and said: yes, this. The rest is — well — the entire flavour of half the country.",
    hue: "#b8362a",
  },
];

export const windowView = {
  eyebrow: "through the carved jharokha",
  title: "The garden is awake",
  lines: [
    "Marigolds, full and unembarrassed.",
    "The fountain is talking to itself.",
    "The moon is doing its slow lap.",
    "Somewhere, a koel. Probably showing off.",
  ],
};

// Kept for backwards compatibility with the previous import shape.
export const pantryFinds = spiceJars.map((s) => ({ jar: s.jar, note: s.blurb }));
export const secretNote = secretNotes[0];
