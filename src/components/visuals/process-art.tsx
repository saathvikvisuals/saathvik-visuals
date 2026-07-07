"use client";

import { motion } from "framer-motion";

type ProcessArtProps = {
  accent: string;
  variant: number;
  project: string;
  palette: readonly string[];
};

export function ProcessArt({ accent, variant, project, palette }: ProcessArtProps) {
  const colors = [palette[0] ?? accent, palette[1] ?? "#ffffff", palette[2] ?? "#111827"];

  if (project === "linkedin-creator") return <LinkedInWorld variant={variant} colors={colors} />;
  if (project === "airbnb-nomad") return <NomadWorld variant={variant} colors={colors} />;
  if (project === "netflix-altitude") return <AltitudeWorld variant={variant} colors={colors} />;
  if (project === "spotify-drive") return <DriveWorld variant={variant} colors={colors} />;
  if (project === "aryav") return <AryavWorld variant={variant} colors={colors} />;
  if (project === "aarna-salon") return <SalonWorld variant={variant} colors={colors} />;
  if (project === "jaabili") return <JaabiliWorld variant={variant} colors={colors} />;
  if (project === "naad") return <NaadWorld variant={variant} colors={colors} />;
  if (project === "pawly") return <PawlyWorld variant={variant} colors={colors} />;

  return <AbstractWorld variant={variant} colors={colors} />;
}

// These illustrations sit on the site's dark theatrical glass panels (and the
// light theme when toggled), so every surface color routes through the same
// CSS custom properties the rest of the UI uses (--card/--void/--line/--ink)
// instead of hardcoded hex — a project's own brand hex (colors[0]) is the one
// color that stays fixed, since that's the point: its real identity color.
function Frame({ children, fill = "var(--card)" }: { children: React.ReactNode; fill?: string }) {
  return (
    <svg viewBox="0 0 320 210" className="h-full w-full">
      <rect width="320" height="210" rx="28" fill={fill} />
      {children}
    </svg>
  );
}

// A signature connecting line drawn on scroll, instead of appearing instantly
// — the one recurring interactive beat across every project's story.
function DrawnPath({ d, color, width = 5 }: { d: string; color: string; width?: number }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

function LinkedInWorld({ variant, colors }: SceneProps) {
  const tint = `color-mix(in srgb, ${colors[0]} 20%, var(--card))`;
  if (variant === 0) {
    return (
      <Frame>
        <rect x="42" y="42" width="236" height="126" rx="28" fill="var(--void)" stroke="var(--line)" />
        <circle cx="88" cy="88" r="28" fill={colors[0]} />
        <rect x="126" y="66" width="112" height="14" rx="7" fill="var(--ink)" opacity=".86" />
        <rect x="126" y="92" width="78" height="10" rx="5" fill={colors[0]} opacity=".38" />
        <rect x="66" y="126" width="188" height="14" rx="7" fill={tint} />
        <text x="66" y="154" fill={colors[0]} fontSize="11" fontWeight="800" letterSpacing="3">RESUME-FIRST PROBLEM</text>
      </Frame>
    );
  }
  if (variant === 1) {
    return (
      <Frame>
        <rect x="34" y="30" width="252" height="154" rx="24" fill="var(--void)" stroke="var(--line)" />
        {[0, 1, 2, 3, 4].map((item) => (
          <motion.circle key={item} cx={68 + item * 48} cy={item % 2 ? 126 : 76} r={item === 2 ? 18 : 12} fill={item === 2 ? colors[0] : tint} stroke={colors[0]} strokeWidth="3" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: item * 0.06 }} />
        ))}
        <DrawnPath d="M68 76 L116 126 L164 76 L212 126 L260 76" color={colors[0]} width={4} />
        <text x="62" y="166" fill="var(--ink)" fontSize="11" fontWeight="800" letterSpacing="3">NETWORK SIGNAL MAP</text>
      </Frame>
    );
  }
  if (variant === 2) {
    return (
      <Frame>
        <rect x="46" y="34" width="232" height="42" rx="18" fill={colors[0]} opacity=".92" />
        <rect x="70" y="94" width="184" height="34" rx="16" fill="var(--void)" stroke="var(--line)" />
        <rect x="96" y="146" width="132" height="28" rx="14" fill={tint} stroke="var(--line)" />
        <path d="M162 76v18M162 128v18" stroke={colors[0]} strokeWidth="5" strokeLinecap="round" />
        <text x="76" y="60" fill="#fff" fontSize="13" fontWeight="800">REPUTATION</text>
        <text x="104" y="116" fill="var(--ink)" fontSize="12" fontWeight="800">CONTENT + SIGNALS</text>
        <text x="124" y="166" fill={colors[0]} fontSize="12" fontWeight="800">OPPORTUNITY</text>
      </Frame>
    );
  }
  if (variant === 3) {
    return (
      <Frame>
        <rect x="28" y="26" width="264" height="158" rx="22" fill="var(--void)" stroke="var(--line)" />
        <rect x="52" y="50" width="88" height="18" rx="9" fill="var(--ink)" opacity=".85" />
        <rect x="52" y="88" width="74" height="62" rx="18" fill={colors[0]} opacity=".2" />
        <rect x="146" y="88" width="66" height="62" rx="18" fill={tint} />
        <rect x="222" y="88" width="40" height="62" rx="18" fill={colors[0]} opacity=".4" />
        <circle cx="250" cy="58" r="18" fill={colors[0]} />
        <text x="56" y="170" fill="var(--ink)" fontSize="11" fontWeight="800" letterSpacing="3">CREATOR DASHBOARD UI</text>
      </Frame>
    );
  }
  if (variant === 4) {
    return (
      <Frame>
        {[0, 1, 2].map((item) => (
          <rect key={item} x={46 + item * 78} y={50 + item * 14} width="58" height="96" rx="18" fill="var(--void)" stroke="var(--line)" strokeWidth="3" />
        ))}
        <path d="M108 98h34M186 112h34" stroke={colors[0]} strokeWidth="5" strokeLinecap="round" />
        <path d="m134 88 10 10-10 10M212 102l10 10-10 10" fill="none" stroke={colors[0]} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <motion.circle cx="76" cy="132" r="9" fill={colors[0]} animate={{ x: [0, 78, 156, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        <text x="64" y="180" fill="var(--ink)" fontSize="11" fontWeight="800" letterSpacing="3">PROTOTYPE BEHAVIOR</text>
      </Frame>
    );
  }
  return (
    <Frame>
      <rect x="28" y="26" width="264" height="158" rx="22" fill="var(--void)" stroke="var(--line)" />
      {[0, 1, 2].map((item) => (
        <motion.rect key={item} x={62 + item * 70} y={116 - item * 18} width="46" height={42 + item * 20} rx="14" fill={item === 2 ? colors[0] : tint} initial={{ scaleY: 0.5, opacity: 0 }} whileInView={{ scaleY: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: item * 0.08 }} />
      ))}
      <DrawnPath d="M66 138 C112 94, 164 156, 244 88" color={colors[0]} />
      <text x="74" y="62" fill="var(--ink)" fontSize="13" fontWeight="800">REACH 2.8M</text>
      <text x="74" y="180" fill={colors[0]} fontSize="11" fontWeight="800" letterSpacing="3">OUTCOME SIGNALS</text>
    </Frame>
  );
}

function NomadWorld({ variant, colors }: SceneProps) {
  const tint = `color-mix(in srgb, ${colors[0]} 20%, var(--card))`;
  if (variant === 0) {
    return (
      <Frame>
        <rect x="38" y="38" width="244" height="134" rx="24" fill="var(--void)" stroke="var(--line)" />
        <rect x="58" y="62" width="82" height="86" rx="18" fill={tint} />
        <rect x="154" y="62" width="86" height="18" rx="9" fill="var(--ink)" opacity=".85" />
        <rect x="154" y="94" width="58" height="12" rx="6" fill={colors[0]} opacity=".85" />
        <rect x="154" y="120" width="74" height="12" rx="6" fill="var(--line)" />
        <text x="60" y="166" fill={colors[0]} fontSize="11" fontWeight="800" letterSpacing="3">BOOKING TRUST GAP</text>
      </Frame>
    );
  }
  if (variant === 1) {
    return (
      <Frame>
        <DrawnPath d="M34 160 C82 92, 128 138, 172 82 S246 60, 286 122" color={colors[0]} />
        {[
          ["WI-FI", 58, 62],
          ["WORK", 136, 96],
          ["LOCAL", 210, 54],
          ["STAY", 230, 132]
        ].map(([label, x, y], index) => (
          <motion.g key={label} initial={{ scale: 0.86, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
            <rect x={Number(x)} y={Number(y)} width="58" height="42" rx="15" fill="var(--void)" stroke="var(--line)" />
            <text x={Number(x) + 13} y={Number(y) + 26} fill="var(--ink)" fontSize="10" fontWeight="800">{label}</text>
          </motion.g>
        ))}
        <text x="56" y="184" fill="var(--ink)" fontSize="11" fontWeight="800" letterSpacing="3">REMOTE-WORK FEARS</text>
      </Frame>
    );
  }
  if (variant === 2) {
    return (
      <Frame>
        <path d="M28 88 C82 20, 138 44, 190 28 C240 12, 284 46, 292 98 L292 184 L28 184Z" fill={tint} />
        <DrawnPath d="M54 156 C96 118, 126 136, 164 96 S244 66, 276 122" color={colors[0]} />
        {[0, 1, 2, 3].map((item) => (
          <motion.g key={item} initial={{ y: 12, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: item * 0.08 }}>
            <rect x={50 + item * 58} y={56 + (item % 2) * 32} width="44" height="36" rx="12" fill="var(--void)" stroke="var(--line)" />
            <circle cx={72 + item * 58} cy={108 + (item % 2) * 18} r="8" fill={colors[0]} />
          </motion.g>
        ))}
        <rect x="110" y="142" width="100" height="16" rx="8" fill="var(--ink)" opacity=".85" />
      </Frame>
    );
  }
  if (variant === 3) {
    return (
      <Frame>
        <rect x="36" y="32" width="252" height="156" rx="24" fill="var(--void)" stroke="var(--line)" />
        <rect x="58" y="54" width="96" height="112" rx="20" fill={tint} />
        <rect x="172" y="54" width="82" height="34" rx="16" fill="var(--ink)" opacity=".85" />
        <rect x="172" y="104" width="42" height="42" rx="14" fill="var(--card)" stroke="var(--line)" />
        <rect x="222" y="104" width="42" height="42" rx="14" fill={colors[0]} opacity=".24" stroke="var(--line)" />
        <circle cx="92" cy="94" r="18" fill="var(--card)" />
        <text x="70" y="180" fill={colors[0]} fontSize="11" fontWeight="800" letterSpacing="3">STAY DETAIL UI</text>
      </Frame>
    );
  }
  if (variant === 4) {
    return (
      <Frame>
        {[0, 1, 2].map((item) => (
          <rect key={item} x={54 + item * 72} y={52 + item * 12} width="58" height="102" rx="18" fill="var(--void)" stroke="var(--line)" strokeWidth="3" />
        ))}
        <path d="M112 104h32M184 116h32" stroke={colors[0]} strokeWidth="5" strokeLinecap="round" />
        <motion.circle cx="84" cy="132" r="9" fill={colors[0]} animate={{ x: [0, 72, 144, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        <text x="62" y="184" fill="var(--ink)" fontSize="11" fontWeight="800" letterSpacing="3">PLANNING BOARD MOTION</text>
      </Frame>
    );
  }
  return (
    <Frame>
      <rect x="42" y="38" width="236" height="132" rx="24" fill="var(--void)" stroke="var(--line)" />
      {[0, 1, 2].map((item) => (
        <motion.rect key={item} x={70 + item * 66} y={116 - item * 18} width="42" height={42 + item * 18} rx="13" fill={item === 2 ? colors[0] : tint} initial={{ scaleY: 0.5, opacity: 0 }} whileInView={{ scaleY: 1, opacity: 1 }} viewport={{ once: true }} />
      ))}
      <DrawnPath d="M62 134 C104 88, 168 150, 246 76" color={colors[0]} />
      <text x="76" y="70" fill="var(--ink)" fontSize="13" fontWeight="800">LONG-STAY CONFIDENCE</text>
      <text x="76" y="186" fill={colors[0]} fontSize="11" fontWeight="800" letterSpacing="3">OUTCOME PATH</text>
    </Frame>
  );
}

function AltitudeWorld({ variant, colors }: SceneProps) {
  return <StoryScene variant={variant} colors={colors} motif="plane" labels={["CONTEXT GAP", "TRAVEL SIGNALS", "BOARDING FLOW", "TITLE UI", "ROUTE MOTION", "WATCH CONFIDENCE"]} />;
}

function DriveWorld({ variant, colors }: SceneProps) {
  return <StoryScene variant={variant} colors={colors} motif="road" labels={["DRIVE CONTEXT", "ROUTE RESEARCH", "SOUNDTRACK FLOW", "GLANCEABLE UI", "MOTION STATES", "MOOD OUTCOME"]} />;
}

function AryavWorld({ variant, colors }: SceneProps) {
  return <StoryScene variant={variant} colors={colors} motif="villa" labels={["LISTING FATIGUE", "LUXURY CUES", "PROPERTY FILM", "VILLA UI", "SCROLL REVEALS", "ENQUIRY TRUST"]} />;
}

function SalonWorld({ variant, colors }: SceneProps) {
  return <StoryScene variant={variant} colors={colors} motif="salon" labels={["TRUST GAP", "RITUAL RESEARCH", "BOOKING PATH", "BEAUTY UI", "SOFT MOTION", "BRIEF READY"]} />;
}

function JaabiliWorld({ variant, colors }: SceneProps) {
  return <StoryScene variant={variant} colors={colors} motif="mountain" labels={["STATIC TOURISM", "PLACE SIGNALS", "JOURNEY MAP", "DESTINATION UI", "TRAIL MOTION", "TRAVEL INTENT"]} />;
}

function NaadWorld({ variant, colors }: SceneProps) {
  return <StoryScene variant={variant} colors={colors} motif="music" labels={["DENSE HERITAGE", "RAGA RESEARCH", "CULTURE FLOW", "INSTRUMENT UI", "TAAL MOTION", "DISCOVERY VALUE"]} />;
}

function StoryScene({ variant, colors, motif, labels }: StorySceneProps) {
  const label = labels[variant] ?? labels[0];
  const soft = `color-mix(in srgb, ${colors[0]} 22%, var(--card))`;

  if (variant === 0) {
    return (
      <Frame>
        <rect x="38" y="38" width="244" height="134" rx="24" fill="var(--void)" stroke="var(--line)" />
        <Motif motif={motif} colors={colors} x={66} y={62} />
        <rect x="154" y="58" width="92" height="18" rx="9" fill="var(--ink)" opacity=".82" />
        <rect x="154" y="92" width="64" height="12" rx="6" fill={colors[0]} opacity=".9" />
        <rect x="154" y="118" width="78" height="12" rx="6" fill={soft} />
        <DrawnPath d="M54 152 C94 118, 128 150, 158 112 S222 82, 264 126" color={colors[0]} width={4} />
        <text x="58" y="184" fill="var(--ink)" fontSize="11" fontWeight="800" letterSpacing="3">{label}</text>
      </Frame>
    );
  }
  if (variant === 1) {
    return (
      <Frame>
        <DrawnPath d="M42 154 C82 96, 124 132, 162 86 S236 66, 278 124" color={colors[0]} />
        {["USER", "TRUST", "MOOD", "ACTION"].map((item, index) => (
          <motion.g key={item} initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
            <rect x={48 + index * 66} y={index % 2 ? 92 : 54} width="58" height="40" rx="14" fill="var(--void)" stroke="var(--line)" />
            <text x={58 + index * 66} y={(index % 2 ? 92 : 54) + 25} fill={index === 1 ? colors[0] : "var(--ink)"} fontSize="9" fontWeight="800">{item}</text>
          </motion.g>
        ))}
        <Motif motif={motif} colors={colors} x={130} y={114} small />
        <text x="56" y="184" fill="var(--ink)" fontSize="11" fontWeight="800" letterSpacing="3">{label}</text>
      </Frame>
    );
  }
  if (variant === 2) {
    return (
      <Frame>
        <rect x="36" y="34" width="248" height="148" rx="24" fill="var(--void)" stroke="var(--line)" />
        <rect x="58" y="58" width="72" height="94" rx="18" fill={soft} stroke="var(--line)" />
        <rect x="150" y="58" width="112" height="20" rx="10" fill="var(--ink)" opacity=".82" />
        {[0, 1, 2].map((item) => (
          <motion.rect key={item} x="150" y={94 + item * 24} width={92 - item * 12} height="12" rx="6" fill={item === 1 ? colors[0] : soft} initial={{ width: 18 }} whileInView={{ width: 92 - item * 12 }} viewport={{ once: true }} />
        ))}
        <Motif motif={motif} colors={colors} x={72} y={82} small />
        <text x="62" y="172" fill={colors[0]} fontSize="11" fontWeight="800" letterSpacing="3">{label}</text>
      </Frame>
    );
  }
  if (variant === 3) {
    return (
      <Frame>
        <rect x="42" y="32" width="236" height="150" rx="26" fill="var(--void)" stroke="var(--line)" />
        <rect x="60" y="54" width="78" height="98" rx="20" fill={soft} />
        <rect x="154" y="54" width="96" height="28" rx="14" fill={colors[0]} opacity=".9" />
        <rect x="154" y="98" width="42" height="42" rx="14" fill="var(--card)" stroke="var(--line)" />
        <rect x="208" y="98" width="42" height="42" rx="14" fill="var(--card)" stroke="var(--line)" />
        <Motif motif={motif} colors={colors} x={82} y={82} small />
        <rect x="154" y="154" width="86" height="12" rx="6" fill="var(--ink)" opacity=".82" />
        <text x="62" y="174" fill="var(--ink)" fontSize="10" fontWeight="800" letterSpacing="3">{label}</text>
      </Frame>
    );
  }
  if (variant === 4) {
    return (
      <Frame>
        {[0, 1, 2].map((item) => (
          <rect key={item} x={50 + item * 76} y={52 + item * 10} width="58" height="104" rx="18" fill="var(--void)" stroke="var(--line)" strokeWidth="3" />
        ))}
        <path d="M108 104h32M184 116h32" stroke={colors[0]} strokeWidth="5" strokeLinecap="round" />
        <path d="m130 94 10 10-10 10M206 106l10 10-10 10" fill="none" stroke={colors[0]} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <motion.circle cx="78" cy="132" r="9" fill={colors[0]} animate={{ x: [0, 76, 152, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        <text x="58" y="184" fill="var(--ink)" fontSize="11" fontWeight="800" letterSpacing="3">{label}</text>
      </Frame>
    );
  }
  return (
    <Frame>
      <rect x="38" y="34" width="244" height="144" rx="24" fill="var(--void)" stroke="var(--line)" />
      {[0, 1, 2].map((item) => (
        <motion.rect key={item} x={72 + item * 62} y={122 - item * 20} width="42" height={38 + item * 20} rx="14" fill={item === 2 ? colors[0] : soft} stroke="var(--line)" initial={{ scaleY: 0.45, opacity: 0 }} whileInView={{ scaleY: 1, opacity: 1 }} viewport={{ once: true }} />
      ))}
      <DrawnPath d="M58 138 C106 96, 154 150, 246 74" color={colors[0]} />
      <Motif motif={motif} colors={colors} x={216} y={46} small />
      <text x="72" y="68" fill="var(--ink)" fontSize="13" fontWeight="800">OUTCOME</text>
      <text x="72" y="188" fill={colors[0]} fontSize="11" fontWeight="800" letterSpacing="3">{label}</text>
    </Frame>
  );
}

function Motif({ motif, colors, x, y, small = false }: MotifProps) {
  const scale = small ? 0.72 : 1;
  if (motif === "plane") {
    return <motion.path d={`M${x} ${y + 18 * scale} l${70 * scale} ${22 * scale} l${-70 * scale} ${22 * scale} l${14 * scale} ${-22 * scale}z`} fill={colors[0]} opacity=".88" animate={{ x: [0, 8, 0] }} transition={{ duration: 2.6, repeat: Infinity }} />;
  }
  if (motif === "road") {
    return <path d={`M${x} ${y + 64 * scale} C${x + 30 * scale} ${y}, ${x + 62 * scale} ${y + 86 * scale}, ${x + 104 * scale} ${y + 28 * scale}`} fill="none" stroke="var(--ink)" strokeWidth={18 * scale} strokeLinecap="round" opacity=".9" />;
  }
  if (motif === "villa") {
    return <path d={`M${x} ${y + 72 * scale} V${y + 18 * scale} h${34 * scale} v${24 * scale} h${28 * scale} V${y + 18 * scale} h${34 * scale} v${54 * scale}z`} fill="none" stroke="var(--ink)" strokeWidth={5 * scale} strokeLinejoin="round" />;
  }
  if (motif === "salon") {
    return <path d={`M${x} ${y + 64 * scale} C${x + 22 * scale} ${y}, ${x + 58 * scale} ${y + 96 * scale}, ${x + 102 * scale} ${y + 8 * scale}`} fill="none" stroke={colors[0]} strokeWidth={5 * scale} strokeLinecap="round" />;
  }
  if (motif === "mountain") {
    return <path d={`M${x} ${y + 74 * scale} L${x + 34 * scale} ${y + 22 * scale} L${x + 56 * scale} ${y + 58 * scale} L${x + 90 * scale} ${y + 12 * scale} L${x + 128 * scale} ${y + 74 * scale}Z`} fill={colors[0]} opacity=".26" stroke={colors[0]} />;
  }
  return (
    <>
      <circle cx={x + 42 * scale} cy={y + 42 * scale} r={36 * scale} fill={colors[0]} opacity=".2" />
      <path d={`M${x + 18 * scale} ${y + 42 * scale} C${x + 46 * scale} ${y + 4 * scale}, ${x + 68 * scale} ${y + 84 * scale}, ${x + 102 * scale} ${y + 30 * scale}`} fill="none" stroke={colors[0]} strokeWidth={5 * scale} strokeLinecap="round" />
      <rect x={x + 54 * scale} y={y + 58 * scale} width={52 * scale} height={12 * scale} rx={6 * scale} fill="var(--ink)" opacity=".75" />
    </>
  );
}

function PawlyWorld({ variant, colors }: SceneProps) {
  const tint = `color-mix(in srgb, ${colors[0]} 20%, var(--card))`;
  if (variant === 0) {
    return (
      <Frame>
        <DrawnPath d="M32 158 C66 86, 112 128, 152 76 S238 46, 286 112" color={colors[0]} />
        <rect x="48" y="48" width="86" height="106" rx="24" fill="var(--void)" stroke="var(--line)" strokeWidth="3" />
        <rect x="154" y="48" width="118" height="34" rx="15" fill="var(--void)" stroke="var(--line)" />
        <rect x="154" y="98" width="82" height="20" rx="10" fill={tint} stroke="var(--line)" />
        <rect x="154" y="132" width="104" height="16" rx="8" fill="var(--ink)" opacity=".82" />
        <circle cx="84" cy="84" r="7" fill={colors[0]} />
        <circle cx="108" cy="82" r="7" fill={colors[0]} />
        <circle cx="96" cy="104" r="12" fill={colors[0]} />
        <text x="54" y="184" fill="var(--ink)" fontSize="11" fontWeight="800" letterSpacing="3">CARE TRUST GAP</text>
      </Frame>
    );
  }
  if (variant === 1) {
    return (
      <Frame>
        <DrawnPath d="M44 156 C86 104, 126 132, 164 90 S238 72, 278 126" color={colors[0]} />
        {[
          ["SAFETY", 54, 58],
          ["FOOD", 132, 92],
          ["CARE", 208, 54],
          ["SHOP", 218, 132]
        ].map(([label, x, y], index) => (
          <motion.g key={label} initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
            <rect x={Number(x)} y={Number(y)} width="64" height="42" rx="15" fill="var(--void)" stroke="var(--line)" />
            <text x={Number(x) + 11} y={Number(y) + 27} fill={index === 1 ? colors[0] : "var(--ink)"} fontSize="10" fontWeight="800">{label}</text>
          </motion.g>
        ))}
        <circle cx="164" cy="90" r="8" fill={colors[0]} />
        <text x="56" y="184" fill="var(--ink)" fontSize="11" fontWeight="800" letterSpacing="3">CARE DECISION MAP</text>
      </Frame>
    );
  }
  if (variant === 2) {
    return (
      <Frame>
        <rect x="36" y="34" width="248" height="148" rx="24" fill="var(--void)" stroke="var(--line)" />
        <rect x="58" y="58" width="72" height="94" rx="18" fill={tint} stroke="var(--line)" />
        <rect x="150" y="58" width="112" height="20" rx="10" fill="var(--ink)" opacity=".82" />
        {[0, 1, 2].map((item) => (
          <motion.rect key={item} x={150} y={94 + item * 24} width={92 - item * 12} height="12" rx="6" fill={item === 1 ? colors[0] : "var(--line)"} opacity={item === 1 ? ".9" : ".7"} initial={{ width: 20 }} whileInView={{ width: 92 - item * 12 }} viewport={{ once: true }} />
        ))}
        <path d="M86 82 C104 66, 126 86, 106 106 C94 118, 74 118, 66 100 C58 82, 74 76, 86 82Z" fill={colors[0]} opacity=".24" stroke={colors[0]} />
        <text x="64" y="172" fill={colors[0]} fontSize="11" fontWeight="800" letterSpacing="3">SHOP + CARE STRUCTURE</text>
      </Frame>
    );
  }
  if (variant === 3) {
    return (
      <Frame>
        <rect x="42" y="32" width="236" height="150" rx="26" fill="var(--void)" stroke="var(--line)" />
        <rect x="60" y="54" width="76" height="96" rx="20" fill={tint} />
        <rect x="154" y="54" width="94" height="28" rx="14" fill={colors[0]} opacity=".9" />
        <rect x="154" y="98" width="42" height="42" rx="14" fill="var(--card)" stroke="var(--line)" />
        <rect x="206" y="98" width="42" height="42" rx="14" fill="var(--card)" stroke="var(--line)" />
        <path d="M72 118 C92 92, 114 108, 124 86" fill="none" stroke={colors[0]} strokeWidth="4" strokeLinecap="round" />
        <circle cx="92" cy="96" r="8" fill={colors[0]} />
        <rect x="154" y="154" width="86" height="12" rx="6" fill="var(--ink)" opacity=".82" />
        <text x="62" y="174" fill="var(--ink)" fontSize="10" fontWeight="800" letterSpacing="3">MOBILE PRODUCT UI</text>
      </Frame>
    );
  }
  if (variant === 4) {
    return (
      <Frame>
        {[0, 1, 2].map((item) => (
          <rect key={item} x={50 + item * 76} y={52 + item * 10} width="58" height="104" rx="18" fill="var(--void)" stroke="var(--line)" strokeWidth="3" />
        ))}
        <path d="M108 104h32M184 116h32" stroke={colors[0]} strokeWidth="5" strokeLinecap="round" />
        <motion.circle cx="78" cy="132" r="9" fill={colors[0]} animate={{ x: [0, 76, 152, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        <path d="m130 94 10 10-10 10M206 106l10 10-10 10" fill="none" stroke={colors[0]} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="58" y="184" fill="var(--ink)" fontSize="11" fontWeight="800" letterSpacing="3">CART FLOW PROTOTYPE</text>
      </Frame>
    );
  }
  return (
    <Frame>
      <rect x="38" y="34" width="244" height="144" rx="24" fill="var(--void)" stroke="var(--line)" />
      {[0, 1, 2].map((item) => (
        <motion.rect key={item} x={72 + item * 62} y={122 - item * 20} width="42" height={38 + item * 20} rx="14" fill={item === 2 ? colors[0] : tint} stroke="var(--line)" initial={{ scaleY: 0.45, opacity: 0 }} whileInView={{ scaleY: 1, opacity: 1 }} viewport={{ once: true }} />
      ))}
      <DrawnPath d="M58 138 C106 96, 154 150, 246 74" color={colors[0]} />
      <circle cx="238" cy="72" r="14" fill={colors[0]} opacity=".2" />
      <text x="72" y="68" fill="var(--ink)" fontSize="13" fontWeight="800">REPEAT CARE</text>
      <text x="72" y="188" fill={colors[0]} fontSize="11" fontWeight="800" letterSpacing="3">OUTCOME SIGNALS</text>
    </Frame>
  );
}

function AbstractWorld({ variant, colors }: SceneProps) {
  return (
    <Frame>
      <DrawnPath d="M42 148 C88 56, 146 172, 198 82 S256 64, 286 126" color={colors[0]} />
      <rect x="62" y="48" width="80" height="54" rx="18" fill="var(--void)" stroke="var(--line)" />
      <rect x="168" y="86" width="88" height="58" rx="20" fill={colors[0]} opacity=".2" />
      <circle cx={76 + variant * 24} cy="134" r="12" fill={colors[0]} />
    </Frame>
  );
}

type SceneProps = {
  variant: number;
  colors: string[];
};

type StorySceneProps = SceneProps & {
  motif: "plane" | "road" | "villa" | "salon" | "mountain" | "music";
  labels: string[];
};

type MotifProps = {
  motif: StorySceneProps["motif"];
  colors: string[];
  x: number;
  y: number;
  small?: boolean;
};
