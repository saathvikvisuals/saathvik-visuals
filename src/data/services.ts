export type ServiceKey = "web-development" | "ui-ux-design" | "web3-products" | "dashboards" | "seo-growth" | "brand-systems";

export type Service = {
  key: ServiceKey;
  title: string;
  short: string;
  intro: string;
  deliverables: string[];
  stack: string[];
  pricing: { from: string; advance: string; note: string };
};

export const services: Service[] = [
  {
    key: "web-development",
    title: "Web Development",
    short: "Next.js websites built to convert and scale.",
    intro: "Fast marketing sites, business websites, and product frontends with strong structure, SEO-ready markup, and conversion-focused sections.",
    deliverables: ["Landing pages", "Multi-page business websites", "Custom contact and quotation flows", "CMS-ready builds", "Launch and handoff support"],
    stack: ["Next.js", "React", "Tailwind CSS", "Node.js", "Web APIs"],
    pricing: { from: "from INR 18,000", advance: "40% upfront", note: "Best for service businesses, agencies, and founders who need a clear launch path." }
  },
  {
    key: "ui-ux-design",
    title: "UI/UX Design",
    short: "Premium interfaces and product journeys.",
    intro: "Strategy-first user flows, wireframes, interaction systems, and polished visual design for web and mobile.",
    deliverables: ["Information architecture", "Wireframes", "High-fidelity screens", "Design systems", "Prototype guidance"],
    stack: ["Figma", "Design tokens", "Motion direction", "Responsive systems", "Accessibility"],
    pricing: { from: "from INR 15,000", advance: "40% upfront", note: "Ideal for redesigns, product launches, and brands needing a sharper interface." }
  },
  {
    key: "web3-products",
    title: "Web3 Products",
    short: "Wallet-ready product experiences and token flows.",
    intro: "Web3 interfaces with clear onboarding, wallet connection states, dashboards, and trust-building flows without the usual clutter.",
    deliverables: ["Wallet onboarding", "Token/NFT dashboards", "Web3 landing pages", "Transaction states", "Protocol storytelling"],
    stack: ["Next.js", "Wallet integrations", "Blockchain APIs", "Smart contract UI", "Analytics"],
    pricing: { from: "from INR 35,000", advance: "50% upfront", note: "Useful for founders building on-chain products or tokenized experiences." }
  },
  {
    key: "dashboards",
    title: "Dashboards",
    short: "Operational panels for internal and client visibility.",
    intro: "Decision-ready dashboards for operations, analytics, subscriptions, and internal workflows.",
    deliverables: ["Admin panels", "Analytics dashboards", "Client portals", "Filters and tables", "Role-based views"],
    stack: ["React", "Next.js", "Charts", "Tables", "Auth flows"],
    pricing: { from: "from INR 45,000", advance: "50% upfront", note: "Good for teams that need measurable systems, not just a pretty front page." }
  },
  {
    key: "seo-growth",
    title: "SEO and Growth",
    short: "Search-friendly pages and conversion improvements.",
    intro: "Technical SEO, structured pages, and content strategy that support discovery and conversion together.",
    deliverables: ["Metadata setup", "Schema markup", "Keyword page planning", "Content structure", "Performance tuning"],
    stack: ["SEO audits", "Structured data", "Core Web Vitals", "Analytics", "Conversion copy"],
    pricing: { from: "from INR 12,000", advance: "40% upfront", note: "Useful as a companion package for launch-ready sites." }
  },
  {
    key: "brand-systems",
    title: "Brand Systems",
    short: "Visual identity and design direction for the whole studio stack.",
    intro: "Colors, type, motion, tone, and layout rules that make a product or service feel coherent and premium.",
    deliverables: ["Brand direction", "Type and color systems", "UI style guides", "Social templates", "Launch visuals"],
    stack: ["Visual identity", "Design systems", "Editorial layouts", "Motion language", "Style tokens"],
    pricing: { from: "from INR 20,000", advance: "40% upfront", note: "For brands that need consistency across site, social, and product." }
  }
];

export function getService(key: string) {
  return services.find((service) => service.key === key);
}
