export type ApproachStep = {
  id: string;
  index: string;
  title: string;
  description: string;
};

/** "Approach" section — how the work gets made (impl §3). */
export const approach: ApproachStep[] = [
  {
    id: "clinical-rigor",
    index: "01",
    title: "Clinical rigor",
    description:
      "Start with vulnerable states: post-care confusion, small touch targets, cognitive load, and screens that need to reduce stress.",
  },
  {
    id: "endurance-science",
    index: "02",
    title: "Endurance science",
    description:
      "Translate complex performance signals into visuals that stay readable under fatigue, glare, motion, and time pressure.",
  },
  {
    id: "tokenized-systems",
    index: "03",
    title: "Tokenized systems",
    description:
      "Use semantic tokens, reusable components, accessibility checks, and responsive behavior so design and code stay aligned.",
  },
];

export const aboutCopy = {
  name: "Edgar Bonilla G.",
  positioning:
    "UI/UX designer for accessible health, wellness, fitness, sports, and lifestyle products.",
  body: "I take product interfaces from structure to shipped responsive screens, with visual systems that stay readable as products grow.",
  about:
    "I specialize in health, wellness, lifestyle, and fitness products where clear interaction design supports trust, safety, and momentum.",
  evidence:
    "My approach uses WCAG 2.2 AA as a baseline, plain-language decisions, and product stories that make the problem, tradeoffs, and interface logic easy to understand.",
  email: "erbonilla@outlook.com",
};
