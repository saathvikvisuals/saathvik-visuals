import autoProjects from "./auto-projects.json";
import testimonialsData from "./testimonials.json";

export type ModeKey = "founder" | "creative" | "minimal" | "future";
export type LanguageKey = "en" | "hi" | "te" | "ta" | "kn" | "ml" | "bn" | "mr" | "gu" | "fr" | "es" | "de" | "ja" | "ko" | "ar";
export type ProjectInterest = "founders" | "visual" | "commerce" | "culture";
export type StoryLayout = "cinematic" | "dashboard" | "editorial" | "journey";
export type StoryStage = { label: string; title: string; copy: string; useVideo?: boolean };
export type Story = { layout: StoryLayout; hook: string; stages: StoryStage[] };
export type Project = {
  slug: string;
  name: string;
  tag: string;
  type: string;
  url: string;
  github: string;
  image: string;
  interests: ProjectInterest[];
  problem: string;
  solution: string;
  outcome: string;
  palette: string[];
  story?: Story;
};

export const modes = {
  founder: {
    label: "Founder",
    intent: "Business clarity",
    accent: "#1d4ed8",
    ink: "#0f172a",
    paper: "#eef3fc",
    glow: "rgba(29, 78, 216, 0.22)",
    font: "var(--font-libre-franklin)",
    description: "Results, decisions, client value, and product thinking move to the front."
  },
  creative: {
    label: "Creative",
    intent: "Cinematic craft",
    accent: "#7c3aed",
    ink: "#1f1333",
    paper: "#f3e8ff",
    glow: "rgba(124, 58, 237, 0.26)",
    font: "var(--font-raleway)",
    description: "Visual systems, atmosphere, motion, and brand memory become the main story."
  },
  minimal: {
    label: "Minimal",
    intent: "Editorial focus",
    accent: "#111827",
    ink: "#111827",
    paper: "#f4f2ec",
    glow: "rgba(17, 24, 39, 0.12)",
    font: "var(--font-libre)",
    description: "Sharp writing, quiet layouts, and case-study clarity lead the experience."
  },
  future: {
    label: "Future",
    intent: "Product launch",
    accent: "#0891b2",
    ink: "#082f49",
    paper: "#e0f6fa",
    glow: "rgba(8, 145, 178, 0.26)",
    font: "var(--font-raleway)",
    description: "Depth, particles, advanced interactions, and system-level presentation take over."
  }
} as const;

export const languageOptions: { key: LanguageKey; short: string; label: string; native: string }[] = [
  { key: "en", short: "EN", label: "English", native: "English" },
  { key: "hi", short: "HI", label: "Hindi", native: "हिन्दी" },
  { key: "te", short: "TE", label: "Telugu", native: "తెలుగు" },
  { key: "ta", short: "TA", label: "Tamil", native: "தமிழ்" },
  { key: "kn", short: "KN", label: "Kannada", native: "ಕನ್ನಡ" },
  { key: "ml", short: "ML", label: "Malayalam", native: "മലയാളം" },
  { key: "bn", short: "BN", label: "Bengali", native: "বাংলা" },
  { key: "mr", short: "MR", label: "Marathi", native: "मराठी" },
  { key: "gu", short: "GU", label: "Gujarati", native: "ગુજરાતી" },
  { key: "fr", short: "FR", label: "French", native: "Français" },
  { key: "es", short: "ES", label: "Spanish", native: "Español" },
  { key: "de", short: "DE", label: "German", native: "Deutsch" },
  { key: "ja", short: "JA", label: "Japanese", native: "日本語" },
  { key: "ko", short: "KO", label: "Korean", native: "한국어" },
  { key: "ar", short: "AR", label: "Arabic", native: "العربية" }
];

type Translation = {
  choose: string;
  headline: string;
  subhead: string;
  explore: string;
  contact: string;
  philosophy: string;
  selected: string;
  projectLine: string;
  process: string;
  satisfaction: string;
  contactTitle: string;
  navWork: string;
  navProcess: string;
  navContact: string;
  liveWork: string;
  source: string;
  mode: string;
  language: string;
  brief: string;
};

const en: Translation = {
  choose: "Choose Your Experience",
  headline: "Visual Casebook",
  subhead: "A quiet gallery of product stories, interface craft, and visual systems.",
  explore: "Explore Work",
  contact: "Start a Project",
  philosophy:
    "Most products don't fail because of bad code. They fail because users do not understand them. Saathvik Visuals designs the bridge between business intent and user clarity.",
  selected: "Selected Work",
  projectLine: "The room changes around what the viewer came to see.",
  process: "Design Process",
  satisfaction: "Client Experience",
  contactTitle: "Premium UI/UX design for brands ready to launch with clarity.",
  navWork: "Work",
  navProcess: "Process",
  navContact: "Contact",
  liveWork: "View",
  source: "Source",
  mode: "Mode",
  language: "Language",
  brief: "Send Project Brief"
};

export const translations: Record<LanguageKey, Translation> = {
  en: {
    ...en
  },
  hi: {
    ...en,
    choose: "अपना अनुभव चुनें",
    headline: "मैं स्क्रीन नहीं बनाता. मैं समझ बनाता हूं.",
    subhead:
      "प्रीमियम डिजिटल उत्पाद, सिनेमैटिक वेबसाइट और ऐसे इंटरफेस जो ब्रांड को समझने, भरोसा करने और याद रखने में मदद करते हैं.",
    explore: "काम देखें",
    contact: "साथ बनाएं",
    philosophy:
      "अधिकतर उत्पाद खराब कोड से नहीं, खराब समझ से असफल होते हैं. Saathvik Visuals व्यवसाय और उपयोगकर्ता के बीच स्पष्टता बनाता है.",
    selected: "चुने हुए काम",
    process: "डिजाइन प्रक्रिया",
    satisfaction: "क्लाइंट अनुभव",
    contactTitle: "Premium UI/UX design un brands ke liye jo clarity ke saath launch karna chahte hain.",
    navWork: "काम",
    navProcess: "प्रक्रिया",
    navContact: "संपर्क",
    liveWork: "देखें",
    brief: "ब्रिफ भेजें"
  },
  te: {
    ...en,
    choose: "మీ అనుభవాన్ని ఎంచుకోండి",
    headline: "నేను స్క్రీన్లను కాదు. అర్థాన్ని డిజైన్ చేస్తాను.",
    subhead:
      "ప్రజలు బ్రాండ్ ను అర్థం చేసుకోవడానికి, నమ్మడానికి, గుర్తుంచుకోవడానికి సహాయపడే ప్రీమియం డిజిటల్ ప్రొడక్ట్స్ మరియు ఇంటర్ఫేసులు.",
    explore: "పనిని చూడండి",
    contact: "కలిసి నిర్మిద్దాం",
    philosophy:
      "చాలా ఉత్పత్తులు చెడు కోడ్ వల్ల కాదు, వినియోగదారులు అర్థం చేసుకోలేకపోవడం వల్ల విఫలమవుతాయి. Saathvik Visuals ఆ స్పష్టతను నిర్మిస్తుంది.",
    selected: "ఎంచుకున్న పనులు",
    process: "డిజైన్ ప్రక్రియ",
    satisfaction: "క్లయింట్ అనుభవం",
    contactTitle: "Clarity tho launch avvalanukune brands kosam premium UI/UX design.",
    navWork: "పని",
    navProcess: "ప్రక్రియ",
    navContact: "సంప్రదించండి",
    liveWork: "చూడండి",
    brief: "బ్రీఫ్ పంపండి"
  },
  ta: {
    ...en,
    choose: "உங்கள் அனுபவத்தை தேர்வு செய்யுங்கள்",
    headline: "நான் திரைகளை அல்ல. புரிதலை வடிவமைக்கிறேன்.",
    subhead: "பிரீமியம் டிஜிட்டல் தயாரிப்புகள், சினிமாட்டிக் இணையதளங்கள், நினைவில் நிற்கும் இடைமுகங்கள்.",
    explore: "வேலைகளை பார்க்க",
    contact: "சேர்ந்து உருவாக்கலாம்",
    selected: "தேர்ந்தெடுத்த வேலை",
    process: "வடிவமைப்பு நடைமுறை",
    satisfaction: "கிளையன்ட் அனுபவம்",
    contactTitle: "Clarity-oda launch panna ready-a irukkum brands-kku premium UI/UX design.",
    navWork: "வேலை",
    navProcess: "நடைமுறை",
    navContact: "தொடர்பு"
  },
  kn: {
    ...en,
    choose: "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    headline: "ನಾನು ಸ್ಕ್ರೀನ್‌ಗಳನ್ನು ಅಲ್ಲ. ಅರ್ಥವನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸುತ್ತೇನೆ.",
    subhead: "ಬ್ರ್ಯಾಂಡ್ ಅನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು, ನಂಬಲು, ನೆನಪಿಡಲು ಸಹಾಯ ಮಾಡುವ ಪ್ರೀಮಿಯಂ ಡಿಜಿಟಲ್ ಅನುಭವಗಳು.",
    explore: "ಕೆಲಸ ನೋಡಿ",
    contact: "ಒಟ್ಟಿಗೆ ನಿರ್ಮಿಸೋಣ",
    selected: "ಆಯ್ದ ಕೆಲಸ",
    process: "ವಿನ್ಯಾಸ ಪ್ರಕ್ರಿಯೆ",
    satisfaction: "ಕ್ಲೈಂಟ್ ಅನುಭವ",
    contactTitle: "Clarity jothe launch madalu ready iruva brands-ge premium UI/UX design."
  },
  ml: {
    ...en,
    choose: "നിങ്ങളുടെ അനുഭവം തിരഞ്ഞെടുക്കുക",
    headline: "ഞാൻ സ്ക്രീനുകൾ അല്ല. മനസ്സിലാക്കൽ ഡിസൈൻ ചെയ്യുന്നു.",
    subhead: "ബ്രാൻഡിനെ മനസ്സിലാക്കാനും വിശ്വസിക്കാനും ഓർക്കാനും സഹായിക്കുന്ന പ്രീമിയം ഡിജിറ്റൽ അനുഭവങ്ങൾ.",
    explore: "പ്രവർത്തനം കാണുക",
    contact: "ഒരുമിച്ച് നിർമ്മിക്കാം",
    selected: "തിരഞ്ഞെടുത്ത പ്രവർത്തനം",
    process: "ഡിസൈൻ പ്രക്രിയ",
    satisfaction: "ക്ലയന്റ് അനുഭവം",
    contactTitle: "Clarity-ode launch cheyyan ready aaya brands-inu premium UI/UX design."
  },
  bn: {
    ...en,
    choose: "আপনার অভিজ্ঞতা বেছে নিন",
    headline: "আমি স্ক্রিন ডিজাইন করি না. আমি বোঝাপড়া ডিজাইন করি.",
    subhead: "ব্র্যান্ডকে বোঝা, বিশ্বাস করা এবং মনে রাখার জন্য প্রিমিয়াম ডিজিটাল অভিজ্ঞতা.",
    explore: "কাজ দেখুন",
    contact: "একসাথে তৈরি করি",
    selected: "নির্বাচিত কাজ",
    process: "ডিজাইন প্রক্রিয়া",
    satisfaction: "ক্লায়েন্ট অভিজ্ঞতা",
    contactTitle: "Clarity niye launch korte ready brands-er jonno premium UI/UX design."
  },
  mr: {
    ...en,
    choose: "तुमचा अनुभव निवडा",
    headline: "मी स्क्रीन डिझाइन करत नाही. मी समज डिझाइन करतो.",
    subhead: "ब्रँड समजण्यासाठी, विश्वास ठेवण्यासाठी आणि लक्षात ठेवण्यासाठी प्रीमियम डिजिटल अनुभव.",
    explore: "काम पहा",
    contact: "एकत्र बनवूया",
    selected: "निवडक काम",
    process: "डिझाइन प्रक्रिया",
    satisfaction: "क्लायंट अनुभव",
    contactTitle: "Clarity sobat launch karayla ready brands sathi premium UI/UX design."
  },
  gu: {
    ...en,
    choose: "તમારો અનુભવ પસંદ કરો",
    headline: "હું સ્ક્રીન નહીં. સમજ ડિઝાઇન કરું છું.",
    subhead: "બ્રાન્ડને સમજવા, વિશ્વાસ કરવા અને યાદ રાખવા માટે પ્રીમિયમ ડિજિટલ અનુભવ.",
    explore: "કામ જુઓ",
    contact: "સાથે બનાવીએ",
    selected: "પસંદ કરેલું કામ",
    process: "ડિઝાઇન પ્રક્રિયા",
    satisfaction: "ક્લાયન્ટ અનુભવ",
    contactTitle: "Clarity sathe launch karva ready brands mate premium UI/UX design."
  },
  fr: {
    ...en,
    choose: "Choisissez Votre Experience",
    headline: "Je ne dessine pas des ecrans. Je dessine de la comprehension.",
    subhead: "Designer UI/UX creant des produits premium, des sites cinematographiques et des interfaces memorables.",
    explore: "Voir le Travail",
    contact: "Construire Ensemble",
    selected: "Travail Selectionne",
    process: "Processus",
    satisfaction: "Experience Client",
    contactTitle: "Design UI/UX premium pour les marques pretes a lancer avec clarte.",
    navWork: "Travail",
    navProcess: "Processus",
    navContact: "Contact"
  },
  es: {
    ...en,
    choose: "Elige Tu Experiencia",
    headline: "No diseno pantallas. Diseno entendimiento.",
    subhead:
      "Disenador UI/UX creando productos digitales premium, sitios cinematicos e interfaces que hacen que una marca se entienda, se confie y se recuerde.",
    explore: "Ver Trabajo",
    contact: "Crear Juntos",
    philosophy:
      "La mayoria de productos no fallan por mal codigo. Fallan porque los usuarios no los entienden. Saathvik Visuals conecta intencion de negocio con claridad de usuario.",
    selected: "Trabajo Seleccionado",
    process: "Proceso",
    satisfaction: "Experiencia Cliente",
    contactTitle: "Diseno UI/UX premium para marcas listas para lanzar con claridad.",
    navWork: "Trabajo",
    navProcess: "Proceso",
    navContact: "Contacto",
    liveWork: "Ver",
    brief: "Enviar Brief"
  },
  de: {
    ...en,
    choose: "Wahle Dein Erlebnis",
    headline: "Ich gestalte keine Screens. Ich gestalte Verstandnis.",
    subhead: "UI/UX Designer fur hochwertige digitale Produkte, filmische Websites und einpragsame Interfaces.",
    explore: "Arbeiten ansehen",
    contact: "Gemeinsam bauen",
    selected: "Ausgewahlte Arbeiten",
    process: "Designprozess",
    satisfaction: "Kundenerlebnis",
    contactTitle: "Premium UI/UX Design fuer Marken, die mit Klarheit launchen wollen.",
    navWork: "Arbeit",
    navProcess: "Prozess",
    navContact: "Kontakt"
  },
  ja: {
    ...en,
    choose: "体験を選ぶ",
    headline: "画面ではなく、理解をデザインする。",
    subhead: "記憶に残るプレミアムなデジタル体験、シネマティックなWeb、信頼されるUIを設計します。",
    explore: "作品を見る",
    contact: "一緒に作る",
    selected: "主な作品",
    process: "デザインプロセス",
    satisfaction: "クライアント体験",
    contactTitle: "Premium UI/UX design for brands ready to launch with clarity.",
    navWork: "作品",
    navProcess: "プロセス",
    navContact: "連絡"
  },
  ko: {
    ...en,
    choose: "경험 선택",
    headline: "저는 화면이 아니라 이해를 디자인합니다.",
    subhead: "기억에 남는 프리미엄 디지털 제품, 시네마틱 웹사이트, 신뢰를 만드는 UI/UX.",
    explore: "작업 보기",
    contact: "함께 만들기",
    selected: "선정 작업",
    process: "디자인 프로세스",
    satisfaction: "클라이언트 경험",
    contactTitle: "Premium UI/UX design for brands ready to launch with clarity.",
    navWork: "작업",
    navProcess: "프로세스",
    navContact: "연락"
  },
  ar: {
    ...en,
    choose: "اختر التجربة",
    headline: "لا أصمم الشاشات. أصمم الفهم.",
    subhead: "مصمم UI/UX يصنع منتجات رقمية فاخرة ومواقع سينمائية وواجهات تبقى في الذاكرة.",
    explore: "استكشف الأعمال",
    contact: "لنبن معا",
    selected: "أعمال مختارة",
    process: "عملية التصميم",
    satisfaction: "تجربة العميل",
    contactTitle: "Premium UI/UX design for brands ready to launch with clarity.",
    navWork: "الأعمال",
    navProcess: "العملية",
    navContact: "تواصل",
    liveWork: "عرض",
    brief: "إرسال الملخص"
  }
};

const baseProjects: Project[] = [
  {
    slug: "linkedin-creator",
    name: "LinkedIn Creator",
    tag: "Creator-first professional network",
    type: "Concept system",
    url: "https://linkedin-creator-concept.vercel.app",
    github: "https://github.com/saathvikvisuals/linkedin-creator-concept",
    image: "/project-screenshots/linkedin-creator.png",
    interests: ["founders", "visual"],
    problem: "Professional networks feel resume-first, while modern creators need reputation, content, opportunity, and audience signals in one system.",
    solution: "Reframed LinkedIn as a career operating system with creator analytics, reputation layers, and clearer opportunity surfaces.",
    outcome: "Shows product strategy, dashboard hierarchy, creator monetization thinking, and modern professional UX.",
    palette: ["#0a66c2", "#f4f8ff", "#111827"],
    story: {
      layout: "dashboard",
      hook: "Reputation shouldn't have to live in a PDF.",
      stages: [
        { label: "01", title: "The Resume Problem", copy: "Professional networks feel resume-first, while modern creators need reputation, content, opportunity, and audience signals in one system.", useVideo: true },
        { label: "02", title: "Mapping Reputation", copy: "Studied creator profiles, credibility signals, audience growth, and how opportunities should appear before a professional commits attention.", useVideo: true },
        { label: "03", title: "Career as a System", copy: "Built the story around reputation first, then creator proof, network strength, analytics, and opportunity discovery.", useVideo: true },
        { label: "04", title: "Inside the Dashboard", copy: "Reframed LinkedIn as a career operating system with creator analytics, reputation layers, and clearer opportunity surfaces.", useVideo: true },
        { label: "05", title: "Built to Feel Alive", copy: "The motion system behaves like a career dashboard: score changes, network paths, and content signals respond as one living interface.", useVideo: true },
        { label: "06", title: "What It Proves", copy: "Shows product strategy, dashboard hierarchy, creator monetization thinking, and modern professional UX.", useVideo: true }
      ]
    }
  },
  {
    slug: "airbnb-nomad",
    name: "Airbnb Nomad",
    tag: "Homes for digital nomads",
    type: "Immersive product concept",
    url: "https://airbnb-nomad-concept.vercel.app",
    github: "https://github.com/saathvikvisuals/airbnb-nomad-concept",
    image: "/project-screenshots/airbnb-nomad.png",
    interests: ["founders", "visual"],
    problem: "Remote workers do not only book stays. They choose internet reliability, work rhythm, neighborhood energy, and long-stay confidence.",
    solution: "Built a nomad-first stay experience with motion, 3D atmosphere, long-stay context, and lifestyle-led decision making.",
    outcome: "Demonstrates travel UX, filtering strategy, motion direction, and premium product storytelling.",
    palette: ["#ff5a5f", "#fff7f4", "#172554"],
    story: {
      layout: "journey",
      hook: "Nobody books a home. They book three weeks of their life.",
      stages: [
        { label: "01", title: "Booking Isn't the Real Decision", copy: "Remote workers do not only book stays. They choose internet reliability, work rhythm, neighborhood energy, and long-stay confidence.", useVideo: true },
        { label: "02", title: "What Remote Workers Actually Fear", copy: "Mapped remote-work fears: Wi-Fi reliability, neighborhood rhythm, stay length, local comfort, and the feeling of belonging before booking.", useVideo: true },
        { label: "03", title: "From City Mood to Confidence", copy: "Turned booking into a journey from city mood to work confidence, home detail, lifestyle proof, and long-stay decision.", useVideo: true },
        { label: "04", title: "Inside the Stay", copy: "Built a nomad-first stay experience with motion, 3D atmosphere, long-stay context, and lifestyle-led decision making.", useVideo: true },
        { label: "05", title: "A Planning Board, Not a Listing", copy: "Scroll movement follows a travel board: maps, cards, and stay details drift like a planning wall instead of a static listing.", useVideo: true },
        { label: "06", title: "What It Proves", copy: "Demonstrates travel UX, filtering strategy, motion direction, and premium product storytelling.", useVideo: true }
      ]
    }
  },
  {
    slug: "netflix-altitude",
    name: "Netflix Altitude",
    tag: "Travel-first streaming",
    type: "Entertainment concept",
    url: "https://netflix-pilot-concept.vercel.app",
    github: "https://github.com/saathvikvisuals/netflix-pilot-concept",
    image: "/project-screenshots/netflix-altitude.png",
    interests: ["visual"],
    problem: "Streaming interfaces often ignore context. Travel creates a perfect moment for mood, route, language, and destination-aware discovery.",
    solution: "Designed a cinematic altitude experience where entertainment follows the journey and feels like a title sequence.",
    outcome: "Highlights cinematic composition, entertainment UX, and interface mood systems.",
    palette: ["#e50914", "#fff5f5", "#111111"],
    story: {
      layout: "cinematic",
      hook: "Entertainment should know where you're going.",
      stages: [
        { label: "01", title: "Context-Blind Streaming", copy: "Streaming interfaces often ignore context. Travel creates a perfect moment for mood, route, language, and destination-aware discovery.", useVideo: true },
        { label: "02", title: "What Changes at Altitude", copy: "Explored how travel changes entertainment intent: route, language, flight mood, destination, and time remaining shape discovery.", useVideo: true },
        { label: "03", title: "A Boarding Sequence", copy: "Designed a cinematic altitude experience where entertainment follows the journey and feels like a title sequence.", useVideo: true },
        { label: "04", title: "Titles That Feel Like Flight", copy: "Transitions borrow from title sequences and flight UI, making every content choice feel attached to the journey.", useVideo: true },
        { label: "05", title: "What It Proves", copy: "Highlights cinematic composition, entertainment UX, and interface mood systems.", useVideo: true }
      ]
    }
  },
  {
    slug: "spotify-drive",
    name: "Spotify Drive",
    tag: "Route-aware music experience",
    type: "Mobility concept",
    url: "https://spotify-drive-concept.vercel.app",
    github: "https://github.com/saathvikvisuals/spotify-drive-concept",
    image: "/project-screenshots/spotify-drive.png",
    interests: ["visual", "founders"],
    problem: "Music apps are built for listening, not driving context. Routes, pace, weather, and stops can shape a more memorable soundtrack.",
    solution: "Created a cinematic driving music concept with motion-led UI, route mood, and contextual playlists.",
    outcome: "Shows interaction design, emotional UX, and visual systems for mobility products.",
    palette: ["#1db954", "#f1fff6", "#082c1c"],
    story: {
      layout: "dashboard",
      hook: "The best soundtrack knows the road ahead.",
      stages: [
        { label: "01", title: "Built for Listening, Not Driving", copy: "Music apps are built for listening, not driving context. Routes, pace, weather, and stops can shape a more memorable soundtrack.", useVideo: true },
        { label: "02", title: "Mapping the Road", copy: "Mapped driving contexts: pace, weather, route length, stops, focus, and the emotional shift between city roads and open highways.", useVideo: true },
        { label: "03", title: "Mood Before Playlist", copy: "The flow starts with route mood, then generates soundtrack layers, weather-aware playlists, and safe glanceable controls.", useVideo: true },
        { label: "04", title: "Glanceable by Design", copy: "Created a cinematic driving music concept with motion-led UI, route mood, and contextual playlists.", useVideo: true },
        { label: "05", title: "Controls Built for Motion", copy: "Interactions are built for motion: large controls, route pulses, playlist transitions, and low-distraction changes.", useVideo: true },
        { label: "06", title: "What It Proves", copy: "Shows interaction design, emotional UX, and visual systems for mobility products.", useVideo: true }
      ]
    }
  },
  {
    slug: "aryav",
    name: "ARYAV",
    tag: "Cinematic real estate",
    type: "Client-style luxury website",
    url: "https://aryav-cinematic-real-estate-api-ser.vercel.app",
    github: "https://github.com/saathvikvisuals/aryav-cinematic-real-estate",
    image: "/project-screenshots/aryav.png",
    interests: ["founders", "visual"],
    problem: "Luxury property pages often reduce expensive spaces into listing cards, losing atmosphere, trust, and architectural emotion.",
    solution: "Built a luxury architectural-film style experience with immersive scenes, editorial storytelling, and villa exploration.",
    outcome: "Positions real estate as a premium product launch instead of a property catalogue.",
    palette: ["#b8860b", "#fbf8ef", "#1f2937"],
    story: {
      layout: "cinematic",
      hook: "Expensive spaces deserve a slower scroll.",
      stages: [
        { label: "01", title: "Listings Flatten Expensive Spaces", copy: "Luxury property pages often reduce expensive spaces into listing cards, losing atmosphere, trust, and architectural emotion.", useVideo: true },
        { label: "02", title: "What Luxury Buyers Actually Read", copy: "Studied luxury real-estate decision cues: material quality, privacy, scale, neighborhood confidence, and architectural storytelling.", useVideo: true },
        { label: "03", title: "A Property Film, Not a Page", copy: "The page unfolds like a property film: arrival, atmosphere, spaces, proof, enquiry, and a quiet close.", useVideo: true },
        { label: "04", title: "Spaces That Breathe", copy: "Scroll pacing is cinematic, with restrained reveals that let the property feel expensive without overwhelming the buyer.", useVideo: true },
        { label: "05", title: "A Quiet Close", copy: "Positions real estate as a premium product launch instead of a property catalogue.", useVideo: true }
      ]
    }
  },
  {
    slug: "aarna-salon",
    name: "AARNA Salon",
    tag: "Luxury salon and beauty rituals",
    type: "Client-style service brand",
    url: "https://aarna-salon.vercel.app",
    github: "https://github.com/saathvikvisuals/aarna-salon",
    image: "/project-screenshots/aarna-salon.png",
    interests: ["commerce", "founders"],
    problem: "Beauty websites often look generic and fail to communicate trust, taste, packages, artists, and booking confidence.",
    solution: "Designed a polished salon experience with rituals, bridal styling, artist profiles, gallery editorials, and a booking flow.",
    outcome: "Shows premium service positioning, conversion clarity, and visual brand direction.",
    palette: ["#be185d", "#fff7fb", "#3f172f"],
    story: {
      layout: "editorial",
      hook: "Trust gets built before the first appointment.",
      stages: [
        { label: "01", title: "Generic Beauty Sites Lose Trust", copy: "Beauty websites often look generic and fail to communicate trust, taste, packages, artists, and booking confidence.", useVideo: true },
        { label: "02", title: "What Builds Booking Confidence", copy: "Mapped salon trust signals: artist confidence, bridal detail, hygiene, service packages, transformations, and booking comfort.", useVideo: true },
        { label: "03", title: "From Ritual to Reservation", copy: "The experience moves from ritual mood to services, artists, gallery proof, packages, and booking intent.", useVideo: true },
        { label: "04", title: "Artists, Not Just Services", copy: "Designed a polished salon experience with rituals, bridal styling, artist profiles, gallery editorials, and a booking flow.", useVideo: true },
        { label: "05", title: "Soft Motion, Editorial Polish", copy: "Motion stays soft and editorial: image reveals, service cards, and booking steps feel polished rather than loud.", useVideo: true },
        { label: "06", title: "What It Proves", copy: "Shows premium service positioning, conversion clarity, and visual brand direction.", useVideo: true }
      ]
    }
  },
  {
    slug: "jaabili",
    name: "Jaabili",
    tag: "Cinematic tourism",
    type: "Destination experience",
    url: "https://jaabili-tourism.vercel.app",
    github: "https://github.com/saathvikvisuals/jaabili-tourism",
    image: "/project-screenshots/jaabili.png",
    interests: ["visual", "culture"],
    problem: "Tourism pages can become static galleries instead of helping visitors feel a destination and plan a journey.",
    solution: "Created a cinematic travel interface with destination filters, story cards, gallery flow, video feel, and journey planning.",
    outcome: "Demonstrates immersive content design, mobile polish, and tourism UX.",
    palette: ["#0f766e", "#f0fffb", "#164e63"],
    story: {
      layout: "cinematic",
      hook: "People don't plan trips. They plan feelings.",
      stages: [
        { label: "01", title: "Static Galleries Don't Sell a Feeling", copy: "Tourism pages can become static galleries instead of helping visitors feel a destination and plan a journey.", useVideo: true },
        { label: "02", title: "Planning Starts With Emotion", copy: "Explored destination planning as emotion first: landscape, culture, routes, travel effort, stay rhythm, and confidence to go.", useVideo: true },
        { label: "03", title: "A Travel Story, Not a Brochure", copy: "The travel story moves through place, discovery, curated routes, gallery depth, planning, and journal-style memory.", useVideo: true },
        { label: "04", title: "Routes You Can Almost Walk", copy: "The interface behaves like a moving travel scrapbook with destination cards, route trails, and soft cinematic reveals.", useVideo: true },
        { label: "05", title: "What It Proves", copy: "Demonstrates immersive content design, mobile polish, and tourism UX.", useVideo: true }
      ]
    }
  },
  {
    slug: "naad",
    name: "NAAD",
    tag: "Indian classical music",
    type: "Cultural commerce",
    url: "https://naad-music-label.vercel.app",
    github: "https://github.com/saathvikvisuals/naad-music-label",
    image: "/project-screenshots/naad.png",
    interests: ["culture", "commerce"],
    problem: "Classical music interfaces need cultural depth without becoming dense, old-fashioned, or difficult for new learners.",
    solution: "Built a modern cultural experience around instruments, ragas, taal, multilingual navigation, and discovery-led commerce.",
    outcome: "Balances heritage, education, visual richness, and lightweight product flow.",
    palette: ["#c2410c", "#fff7ed", "#431407"],
    story: {
      layout: "editorial",
      hook: "Some traditions deserve a modern stage.",
      stages: [
        { label: "01", title: "Heritage Without the Density", copy: "Classical music interfaces need cultural depth without becoming dense, old-fashioned, or difficult for new learners.", useVideo: true },
        { label: "02", title: "Depth for Experts, Clarity for Beginners", copy: "Balanced classical depth with beginner clarity: instruments, ragas, learning paths, heritage, purchase intent, and multilingual comfort.", useVideo: true },
        { label: "03", title: "Sound Identity First", copy: "The system begins with sound identity, then instrument discovery, raga education, cultural proof, and commerce.", useVideo: true },
        { label: "04", title: "Instruments, Ragas, Discovery", copy: "Built a modern cultural experience around instruments, ragas, taal, multilingual navigation, and discovery-led commerce.", useVideo: true },
        { label: "05", title: "Visual Rhythm, Like Music", copy: "Visual rhythm follows music: waveforms, taal-like repetition, warm transitions, and focused product moments.", useVideo: true },
        { label: "06", title: "What It Proves", copy: "Balances heritage, education, visual richness, and lightweight product flow.", useVideo: true }
      ]
    }
  },
  {
    slug: "pawly",
    name: "Pawly",
    tag: "Pet care commerce",
    type: "Commerce and community",
    url: "https://pawly-pet-store.vercel.app",
    github: "https://github.com/saathvikvisuals/pawly-pet-store",
    image: "/project-screenshots/pawly.png",
    interests: ["commerce"],
    problem: "Pet commerce needs warmth, trust, care guidance, and shopping flow without feeling cluttered.",
    solution: "Designed a responsive pet care storefront with shop, resources, community pages, and cart flow.",
    outcome: "Shows practical product UX, approachable brand design, and responsive commerce.",
    palette: ["#f97316", "#fff8f1", "#1f2937"],
    story: {
      layout: "journey",
      hook: "Care should feel as warm online as it does in person.",
      stages: [
        { label: "01", title: "Pet Commerce Feels Cluttered", copy: "Pet commerce needs warmth, trust, care guidance, and shopping flow without feeling cluttered.", useVideo: true },
        { label: "02", title: "What Builds Care Trust", copy: "Mapped pet-care trust: product safety, nutrition guidance, quick shopping, care education, community warmth, and responsive purchase flow.", useVideo: true },
        { label: "03", title: "Shop, Guide, Community", copy: "The journey blends shop, care guide, category confidence, community proof, cart flow, and repeat purchase logic.", useVideo: true },
        { label: "04", title: "Warm by Default", copy: "Designed a responsive pet care storefront with shop, resources, community pages, and cart flow.", useVideo: true },
        { label: "05", title: "Mobile-First Shopping", copy: "Interactions stay warm and useful: category taps, product guidance, cart motion, and mobile-first shopping behavior.", useVideo: true },
        { label: "06", title: "What It Proves", copy: "Shows practical product UX, approachable brand design, and responsive commerce.", useVideo: true }
      ]
    }
  }
];

export const projects: Project[] = [...baseProjects, ...(autoProjects as Project[])];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const process = [
  ["Discover", "Business goals, audience, constraints, and emotional direction."],
  ["Research", "Competitors, user expectations, product gaps, and clarity problems."],
  ["Structure", "Information architecture, user journeys, and conversion path."],
  ["Design", "Visual system, typography, layout, interface states, and motion."],
  ["Prototype", "Interaction logic, scroll rhythm, microinteractions, and presentation."],
  ["Launch", "Responsive polish, performance checks, handoff, and iteration."]
];

export const metrics = [
  ["9", "Public product experiences"],
  ["4", "Experience modes"],
  ["100%", "Responsive build target"],
  ["2026", "Modern design stack"]
];

export type Testimonial = {
  name: string;
  quote: string;
  project?: string;
  projectUrl?: string;
  language?: string;
};

// Real client reviews only — synced from a Google Form response sheet via
// `npm run testimonials:sync` (see scripts/sync-testimonials.js). Empty until
// real responses come in; the UI shows an honest "not yet" state rather than
// placeholder quotes.
export const testimonials = testimonialsData as Testimonial[];

export const socialLinks = {
  email: "mailto:saathvikk202@gmail.com",
  github: "https://github.com/saathvikvisuals",
  linkedin: "https://www.linkedin.com/in/saathvik-kalepu-17041228b/",
  instagram: "https://www.instagram.com/sunny__fr18/"
};
