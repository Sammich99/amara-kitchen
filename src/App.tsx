import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import LottieRaw from "lottie-react";
// Handle CJS/ESM interop — lottie-react may double-wrap its default export
const Lottie = (typeof (LottieRaw as unknown as { default: unknown }).default === "function"
  ? (LottieRaw as unknown as { default: typeof LottieRaw }).default
  : LottieRaw) as typeof LottieRaw;

// ========== IMAGES (from public/) ==========
const FOOD_IMAGES = {
  menuChops: "/images/menu-flyer-chops.jpg",
  menuPlates: "/images/menu-flyer-plates.jpg",
  menuSoups: "/images/menu-flyer-soups.jpg",
  logo: "/images/logo.png",
  review1: "/images/review-1.jpg",
  review2: "/images/review-2.jpg",
  review3: "/images/review-3.jpg",
  review4: "/images/review-4.jpg",
  review5: "/images/review-5.jpg",
  review6: "/images/review-6.jpg",
  review7: "/images/review-7.jpg",
};

const VIDEOS = {
  food: "/videos/food-video.mp4",
  promo: "/videos/promo-video.mp4",
};

// ========== MENU DATA ==========
const MENU_DATA = [
  {
    category: "Plates",
    items: [
      { name: "Jollof Rice", desc: "Classic smoky Nigerian jollof, perfectly seasoned", price: "$20", popular: true },
      { name: "Fried Rice", desc: "Colorful and flavorful, loaded with vegetables", price: "$25" },
      { name: "Jollof Spaghetti", desc: "A Nigerian twist on pasta, rich and savory", price: "$20" },
      { name: "Stir Fry Pasta", desc: "Wok-tossed pasta with bold seasonings", price: "$25", popular: true },
    ],
  },
  {
    category: "Soups",
    sized: true,
    items: [
      { name: "Ogbono", desc: "Rich, thick draw soup with deep umami flavor", price: "$95 / $120" },
      { name: "Okra", desc: "Fresh okra soup, slimy and delicious", price: "$95 / $120" },
      { name: "Egusi", desc: "Ground melon seed soup, creamy and hearty", price: "$95 / $120", popular: true },
      { name: "Oha Soup", desc: "Traditional Igbo soup with oha leaves", price: "$95 / $120" },
      { name: "White Soup", desc: "Light, peppery soup with a clean finish", price: "$95 / $120" },
      { name: "Pepper Soup", desc: "Spicy, aromatic broth that warms the soul", price: "$95 / $120" },
    ],
  },
  {
    category: "Stew & Sauce",
    items: [
      { name: "Ayamase", desc: "Spicy designer stew with locust beans", price: "$25", popular: true },
      { name: "Stew", desc: "Classic tomato stew, rich and vibrant", price: "$22" },
      { name: "Yam Porridge", desc: "Hearty yam cooked in savory sauce", price: "$20" },
    ],
  },
  {
    category: "Extras",
    items: [
      { name: "Gizdodo", desc: "Gizzard and fried plantain medley", price: "$15", popular: true },
      { name: "Asun", desc: "Spicy smoked goat meat, perfectly grilled", price: "$20" },
      { name: "Moi Moi", desc: "Steamed bean pudding, soft and savory", price: "$12" },
      { name: "Grilled Fish", desc: "Whole fish, seasoned and flame-grilled", price: "$20" },
      { name: "Grilled Pepper Turkey", desc: "Tender turkey with spicy pepper coating", price: "$35" },
    ],
  },
  {
    category: "Chops & Rolls",
    items: [
      { name: "Meat Pies", desc: "Flaky pastry filled with seasoned meat", price: "$18", popular: true },
      { name: "Puff Puff", desc: "Sweet, fluffy deep-fried dough balls", price: "$15" },
      { name: "Shawarma", desc: "Loaded with spiced meat and fresh veggies", price: "$25" },
      { name: "Beef Kebabs", desc: "Juicy skewered beef, perfectly spiced", price: "$20" },
      { name: "Egg Roll", desc: "Boiled egg wrapped in dough and fried", price: "$18" },
      { name: "Spring Roll", desc: "Crispy rolls with savory vegetable filling", price: "$15" },
      { name: "Fish Roll", desc: "Flaky pastry with seasoned fish filling", price: "$18" },
    ],
  },
];

const BULK_CHOPS = [
  { name: "Meatpies", price: "$60 / $80" },
  { name: "Puff Puff", price: "$50 / $70" },
  { name: "Shawarma", price: "$85 / $105" },
  { name: "Beef Kebabs", price: "$80 / $100" },
  { name: "Egg Roll", price: "$60 / $80" },
];

// ========== REAL CUSTOMER TESTIMONIALS ==========
const TESTIMONIALS = [
  {
    name: "Happy Customer",
    text: "I just finished the rice, couldn\u2019t leave a single grain of rice lol. I ate half of the Gizdodo, it\u2019s very nice. Excellent job and very good quality food.",
    rating: 5,
    image: FOOD_IMAGES.review6,
  },
  {
    name: "Party Host",
    text: "My guests and I absolutely enjoyed it. They were delicious.. Thank youu!",
    rating: 5,
    image: FOOD_IMAGES.review2,
  },
  {
    name: "Returning Customer",
    text: "Amara thank you so much for being reliable. There\u2019s no one who didn\u2019t appreciate and enjoy the puff puff. It was perfect!",
    rating: 5,
    image: FOOD_IMAGES.review4,
  },
  {
    name: "First Timer",
    text: "The food was great. This the first time I\u2019ve had jollof rice. I hope you loved it!",
    rating: 5,
    image: FOOD_IMAGES.review7,
  },
  {
    name: "Repeat Customer",
    text: "So now you will tell me what crack you put in this food! As soon as I opened it the smell reminded me of all the times you cooked.",
    rating: 5,
    image: FOOD_IMAGES.review3,
  },
  {
    name: "Chops Lover",
    text: "The chops were really great. You did great job o. And it was filling. No further food tonight!",
    rating: 5,
    image: FOOD_IMAGES.review5,
  },
];

// ========== ITINERARY ==========
const ITINERARY = [
  {
    time: "Morning",
    title: "Fresh Flowers",
    desc: "Starting our special day the right way",
    icon: "\uD83C\uDF3A",
  },
  {
    time: "4:30 PM",
    title: "A Special Dinner",
    desc: "Dress nice \u2014 a place we\u2019ve never been",
    icon: "\uD83C\uDF7D\uFE0F",
  },
  {
   // time: "Evening",
    title: "A Special Gift",
    desc: "Something I made just for you\u2026",
    icon: "\uD83C\uDF81",
    isGift: true,
  },
  {
    time: "Night",
    title: "Evening Adventure",
    desc: "Something fun, just the two of us",
    icon: "\u2728",
  },
];

// ========== HOOKS ==========
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

// ========== COMPONENTS ==========
function FadeIn({ children, delay = 0, style = {} }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ color: "#C45D2C", fontSize: "0.9rem" }}>
          {"\u2605"}
        </span>
      ))}
    </div>
  );
}

// ========== COOKING ANIMATION ==========
const LOTTIE_SEQUENCE = [
  { src: "/animations/preloader.json", duration: 3000, message: "Prepping the ingredients\u2026" },
  { src: "/animations/cooking-character.json", duration: 4000, message: "Stirring with love\u2026" },
  { src: "/animations/cooking-kitchen.json", duration: 3000, message: "Almost ready\u2026" },
];

function CookingLoader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const [animData, setAnimData] = useState<Record<string, unknown>[]>([]);
  const messages = LOTTIE_SEQUENCE.map((s) => s.message);

  const [loaded, setLoaded] = useState(false);

  // Load all lottie JSON files with error handling
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      LOTTIE_SEQUENCE.map((s) =>
        fetch(s.src)
          .then((r) => r.json())
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      const valid = results.filter(Boolean);
      if (valid.length > 0) {
        setAnimData(valid as Record<string, unknown>[]);
      }
      setLoaded(true);
    });
    // Failsafe: if loading takes too long, proceed anyway
    const failsafe = setTimeout(() => {
      if (!cancelled) setLoaded(true);
    }, 3000);
    return () => { cancelled = true; clearTimeout(failsafe); };
  }, []);

  // Phase transitions: cycle through animations then call onDone
  useEffect(() => {
    if (!loaded) return;
    if (animData.length === 0) {
      // No lottie loaded — just run through messages on a timer
      const t1 = setTimeout(() => setPhase(1), 3000);
      const t2 = setTimeout(() => setPhase(2), 6000);
      const t3 = setTimeout(() => onDone(), 9000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    for (let i = 1; i < animData.length; i++) {
      elapsed += LOTTIE_SEQUENCE[i - 1]?.duration ?? 3000;
      const idx = i;
      timers.push(setTimeout(() => setPhase(idx), elapsed));
    }
    elapsed += LOTTIE_SEQUENCE[animData.length - 1]?.duration ?? 3000;
    timers.push(setTimeout(() => onDone(), elapsed));
    return () => timers.forEach(clearTimeout);
  }, [loaded, animData, onDone]);

  // Total duration for progress bar
  const totalDuration = animData.length > 0
    ? LOTTIE_SEQUENCE.slice(0, animData.length).reduce((sum, s) => sum + s.duration, 0)
    : 9000;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg,#0a0a0a,#1a1a1a 40%,#111 100%)",
      }}
    >
      <style>{`
        @keyframes cook-fade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lottie-in { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        .cook-msg{animation:cook-fade .6s ease both}
        .lottie-anim{animation:lottie-in .5s ease both}
      `}</style>

      <div className="lottie-anim lottie-box" key={phase} style={{ width: 280, height: 280, marginBottom: 24 }}>
        {animData[phase] ? (
          <Lottie animationData={animData[phase]} loop autoplay style={{ width: "100%", height: "100%" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>
            {["\uD83C\uDF73", "\uD83C\uDF72", "\uD83C\uDF7D\uFE0F"][phase % 3]}
          </div>
        )}
      </div>

      <p
        className="cook-msg"
        key={`msg-${phase}`}
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "1.2rem",
          fontStyle: "italic",
          color: "rgba(255,255,255,.7)",
          textAlign: "center",
        }}
      >
        {messages[phase]}
      </p>

      <div className="progress-bar" style={{ marginTop: 24, width: 200, height: 4, background: "rgba(255,255,255,.1)", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            background: "linear-gradient(90deg,#C45D2C,#E8975B)",
            borderRadius: 2,
            transition: `width ${totalDuration / 1000}s linear`,
            width: animData.length > 0 ? "100%" : "0%",
          }}
        />
      </div>
    </div>
  );
}

// ========== MAIN APP ==========
export default function App() {
  // Flow: "splash" -> "itinerary" -> "cooking" -> "kitchen"
  const [page, setPage] = useState<"splash" | "itinerary" | "cooking" | "kitchen">("splash");
  const [splashPhase, setSplashPhase] = useState(0);
  const [itRevealed, setItRevealed] = useState(false);

  // Kitchen state
  const [activeCategory, setActiveCategory] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Show welcome toast when kitchen page loads
  useEffect(() => {
    if (page !== "kitchen") return;
    setShowWelcome(true);
    const t = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(t);
  }, [page]);

  useEffect(() => {
    if (page !== "splash") return;
    const timers = [
      setTimeout(() => setSplashPhase(1), 600),
      setTimeout(() => setSplashPhase(2), 2200),
      setTimeout(() => setSplashPhase(3), 3800),
      setTimeout(() => setSplashPhase(4), 5400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [page]);

  useEffect(() => {
    if (page !== "kitchen") return;
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [page]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // ========== SPLASH ==========
  if (page === "splash")
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: "linear-gradient(135deg,#0a0a0a,#1a1a1a 40%,#111 100%)",
          overflow: "hidden",
        }}
      >
        <style>{`
          @keyframes sg{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-20px)}}
          .sl{opacity:0;transform:translateY(30px);transition:all 1.2s cubic-bezier(.22,1,.36,1)}
          .sl.v{opacity:1;transform:translateY(0)}
          .sb{opacity:0;transform:translateY(20px);transition:all .8s ease;cursor:pointer;border:none;outline:none;
            background:rgba(196,93,44,.15);color:#E8975B;padding:14px 40px;border-radius:50px;font-size:.9rem;
            font-weight:600;letter-spacing:.1em;font-family:'DM Sans',sans-serif;border:1px solid rgba(196,93,44,.3)}
          .sb.v{opacity:1;transform:translateY(0)}
          .sb:hover{background:rgba(196,93,44,.3);transform:translateY(-2px)!important;box-shadow:0 8px 30px rgba(196,93,44,.2)}
          @keyframes cfall{
            0%{transform:translateY(-10vh) rotate(0deg);opacity:1}
            80%{opacity:0.8}
            100%{transform:translateY(105vh) rotate(720deg);opacity:0}
          }
          @keyframes brise{
            0%{transform:translateY(0) scale(0.3);opacity:0}
            10%{opacity:1;transform:translateY(-20vh) scale(1)}
            90%{opacity:0.8}
            100%{transform:translateY(-120vh) scale(1);opacity:0}
          }
        `}</style>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 30% 40%,rgba(196,93,44,.08),transparent 50%),radial-gradient(circle at 70% 70%,rgba(232,151,91,.06),transparent 50%)",
            animation: "sg 8s ease infinite",
          }}
        />
        {/* Confetti */}
        {[...Array(60)].map((_, i) => {
          const colors = ["#E8975B", "#C45D2C", "#FFD700", "#FF6B6B", "#4ECDC4", "#FFE66D", "#FF8C94", "#A8E6CF", "#fff"];
          const color = colors[i % colors.length];
          const left = Math.random() * 100;
          const delay = Math.random() * 5;
          const duration = 3 + Math.random() * 4;
          const size = 6 + Math.random() * 8;
          const isCircle = i % 3 === 0;
          return (
            <div
              key={`c-${i}`}
              style={{
                position: "absolute",
                top: -20,
                left: `${left}%`,
                width: isCircle ? size : size * 0.5,
                height: isCircle ? size : size * 1.3,
                borderRadius: isCircle ? "50%" : 2,
                background: color,
                animation: `cfall ${duration}s ${delay}s linear infinite`,
              }}
            />
          );
        })}
        {/* Balloons */}
        {[...Array(10)].map((_, i) => {
          const balloons = ["\uD83C\uDF88", "\uD83C\uDF89", "\uD83C\uDF8A"];
          const left = 5 + (i / 10) * 90;
          const delay = i * 0.5;
          const duration = 5 + Math.random() * 4;
          return (
            <div
              key={`b-${i}`}
              style={{
                position: "absolute",
                bottom: -60,
                left: `${left}%`,
                fontSize: `${2.2 + Math.random() * 1.5}rem`,
                animation: `brise ${duration}s ${delay}s linear infinite`,
              }}
            >
              {balloons[i % balloons.length]}
            </div>
          );
        })}
        <div className="splash-inner" style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 32px", maxWidth: 600 }}>
          <div
            className={`sl ${splashPhase >= 1 ? "v" : ""}`}
            style={{
              fontSize: ".75rem",
              fontWeight: 700,
              letterSpacing: ".25em",
              textTransform: "uppercase",
              color: "rgba(196,93,44,.8)",
              marginBottom: 24,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            February 12, 2025 &mdash; April 5, 2026
          </div>
          <h1
            className={`sl splash-title ${splashPhase >= 1 ? "v" : ""}`}
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "3.2rem",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              marginBottom: 8,
              transitionDelay: splashPhase >= 1 ? ".3s" : "0s",
            }}
          >
            Happy 1 Year,
          </h1>
          <h1
            className={`sl splash-name ${splashPhase >= 2 ? "v" : ""}`}
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "4rem",
              fontWeight: 800,
              color: "#E8975B",
              lineHeight: 1.1,
              fontStyle: "italic",
            }}
          >
            Steph
          </h1>
          <div
            style={{
              width: splashPhase >= 2 ? 200 : 0,
              height: 1,
              background: "linear-gradient(90deg,transparent,rgba(196,93,44,.6),transparent)",
              transition: "width 1.5s cubic-bezier(.22,1,.36,1)",
              margin: "24px auto",
            }}
          />
          <p
            className={`sl splash-text ${splashPhase >= 3 ? "v" : ""}`}
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "1.1rem",
              fontStyle: "italic",
              color: "rgba(255,255,255,.7)",
              lineHeight: 1.8,
              maxWidth: 440,
              margin: "0 auto",
            }}
          >
            One year of love, laughter, and unforgettable moments.
            <br />I planned something special for us today.
          </p>
          <div style={{ marginTop: 40 }}>
            <button className={`sb splash-btn ${splashPhase >= 4 ? "v" : ""}`} onClick={() => setPage("itinerary")}>
              See What&rsquo;s In Store &#10024;
            </button>
          </div>
        </div>
      </div>
    );

  // ========== ITINERARY ==========
  if (page === "itinerary")
    return (
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          minHeight: "100vh",
          background: "linear-gradient(135deg,#0a0a0a,#1a1a1a 40%,#111 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <style>{`
          @keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          @keyframes pu{0%,100%{opacity:.3}50%{opacity:.6}}
          .ii{animation:fu .6s ease both;opacity:0;cursor:default}
          .ii:nth-child(1){animation-delay:.2s}.ii:nth-child(2){animation-delay:.4s}
          .ii:nth-child(3){animation-delay:.6s}.ii:nth-child(4){animation-delay:.8s}
          .ii.clickable{cursor:pointer;transition:transform .2s,box-shadow .2s}
          .ii.clickable:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(196,93,44,.2)}
          .rb{cursor:pointer;border:none;outline:none;background:rgba(196,93,44,.2);color:#E8975B;
            padding:16px 44px;border-radius:50px;font-size:1rem;font-weight:600;letter-spacing:.08em;
            font-family:'DM Sans',sans-serif;border:1px solid rgba(196,93,44,.4);transition:all .3s ease}
          .rb:hover{background:rgba(196,93,44,.4);transform:translateY(-2px);box-shadow:0 8px 30px rgba(196,93,44,.2)}
        `}</style>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              background: "rgba(232,151,91,.3)",
              animation: `pu 3s ease infinite ${Math.random() * 3}s`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 480, width: "100%", textAlign: "center" }}>
          {!itRevealed ? (
            <div>
              <div
                style={{
                  fontSize: ".75rem",
                  fontWeight: 700,
                  letterSpacing: ".25em",
                  textTransform: "uppercase",
                  color: "rgba(196,93,44,.8)",
                  marginBottom: 20,
                }}
              >
                April 5, 2026
              </div>
              <h1 className="it-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.8rem", fontWeight: 800, lineHeight: 1.1, marginBottom: 8 }}>
                Our Day,
              </h1>
              <h1
                className="it-name"
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "3.2rem",
                  fontWeight: 800,
                  color: "#E8975B",
                  fontStyle: "italic",
                  lineHeight: 1.1,
                  marginBottom: 24,
                }}
              >
                Steph
              </h1>
              <div
                style={{
                  width: 120,
                  height: 1,
                  background: "linear-gradient(90deg,transparent,rgba(196,93,44,.5),transparent)",
                  margin: "0 auto 24px",
                }}
              />
              <p
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "1rem",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,.6)",
                  lineHeight: 1.7,
                  marginBottom: 40,
                }}
              >
                I planned something special for us today.
                <br />
                Tap below to see what&rsquo;s in store.
              </p>
              <button className="rb" onClick={() => setItRevealed(true)}>
                Reveal Our Day &#10024;
              </button>
            </div>
          ) : (
            <div>
              <div
                style={{
                  fontSize: ".75rem",
                  fontWeight: 700,
                  letterSpacing: ".25em",
                  textTransform: "uppercase",
                  color: "rgba(196,93,44,.8)",
                  marginBottom: 16,
                }}
              >
                April 5, 2026
              </div>
              <h2 className="it-subtitle" style={{ fontFamily: "'Playfair Display',serif", fontSize: "2rem", fontWeight: 700, marginBottom: 32 }}>
                Our <span style={{ color: "#E8975B", fontStyle: "italic" }}>Itinerary</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left" }}>
                {ITINERARY.map((item, i) => (
                  <div
                    key={i}
                    className={`ii it-item ${item.isGift ? "clickable" : ""}`}
                    onClick={item.isGift ? () => setPage("cooking") : undefined}
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      background: item.isGift ? "rgba(196,93,44,.12)" : "rgba(255,255,255,.05)",
                      borderRadius: 16,
                      padding: "20px",
                      border: item.isGift ? "1px solid rgba(196,93,44,.3)" : "1px solid rgba(255,255,255,.06)",
                    }}
                  >
                    <div style={{ fontSize: "1.6rem", lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: ".7rem",
                          fontWeight: 700,
                          letterSpacing: ".12em",
                          color: "#E8975B",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        {item.time}
                      </div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: 2 }}>
                        {item.title}{" "}
                        {item.isGift && (
                          <span
                            style={{
                              fontSize: ".7rem",
                              color: "rgba(255,255,255,.4)",
                              fontFamily: "'DM Sans',sans-serif",
                              fontWeight: 400,
                              fontStyle: "italic",
                            }}
                          >
                            &mdash; tap to open
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: ".85rem", color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 32 }}>
                <div
                  style={{
                    width: 80,
                    height: 1,
                    background: "linear-gradient(90deg,transparent,rgba(196,93,44,.4),transparent)",
                    margin: "0 auto 16px",
                  }}
                />
                <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,.4)", fontStyle: "italic" }}>Happy anniversary, my love &#128155;</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );

  // ========== COOKING ANIMATION ==========
  if (page === "cooking")
    return (
      <CookingLoader
        onDone={() => {
          window.scrollTo(0, 0);
          setPage("kitchen");
        }}
      />
    );

  // ========== KITCHEN SITE ==========
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#FDF6EC", color: "#1a1a1a", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @keyframes welcome-in{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes welcome-out{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(-20px) scale(.95)}}
        .nav-glass{backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
        .menu-card{transition:transform .3s ease,box-shadow .3s ease}.menu-card:hover{transform:translateY(-3px);box-shadow:0 10px 32px rgba(0,0,0,.08)}
        .cat-btn{transition:all .25s ease;cursor:pointer;white-space:nowrap;border:none;outline:none}
        .cat-btn:hover{background:rgba(21,71,52,.08)!important}
        .cat-btn.active{background:#154734!important;color:white!important;box-shadow:0 4px 14px rgba(21,71,52,.25)}
        .cta-btn{transition:all .3s ease;cursor:pointer;border:none;outline:none;text-decoration:none}
        .cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(196,93,44,.3)}
        .cta-outline:hover{background:#154734!important;color:white!important;border-color:#154734!important}
        .bulk-row{transition:background .2s ease}.bulk-row:hover{background:rgba(21,71,52,.03)}
        .test-card{transition:transform .3s ease}.test-card:hover{transform:translateY(-3px)}
        .gallery-img{transition:transform .4s ease,filter .4s ease;cursor:pointer}.gallery-img:hover{transform:scale(1.03);filter:brightness(1.05)}
        @keyframes float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-10px) rotate(1.5deg)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.3}100%{transform:scale(1.4);opacity:0}}
        .popular-badge{position:relative;z-index:1}
        .popular-badge::before{content:'';position:absolute;inset:-2px;background:#C45D2C;border-radius:999px;animation:pulse-ring 2s infinite;z-index:-1}
        .divider{height:2px;max-width:600px;margin:0 auto;background:linear-gradient(90deg,transparent,rgba(196,93,44,.35),transparent)}
        @media(max-width:768px){
          .hero-title{font-size:2.5rem!important}.section-title{font-size:2rem!important}
          .menu-grid{grid-template-columns:1fr!important}.about-grid{grid-template-columns:1fr!important;gap:28px!important}
          .test-grid{grid-template-columns:1fr!important}
          .gallery-grid{grid-template-columns:1fr 1fr!important}
          .review-grid{grid-template-columns:1fr 1fr!important}
          .hero-content{grid-template-columns:1fr!important;text-align:center}.hero-imgs{display:none!important}
          .cat-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;justify-content:flex-start!important;padding-bottom:8px}
          .cta-box-inner{padding:44px 22px!important}
          .about-quote{padding:36px 24px!important}
          .about-stats{gap:20px!important}
          .order-heading{font-size:2rem!important}
          .hidden-mobile{display:none!important}.show-mobile{display:flex!important}
        }
        @media(min-width:769px){.show-mobile{display:none!important}}
        @media(max-width:480px){
          .hero-title{font-size:2rem!important}
          .section-title{font-size:1.6rem!important}
          .order-heading{font-size:1.6rem!important}
          .gallery-grid{grid-template-columns:1fr!important}
          .review-grid{grid-template-columns:1fr 1fr!important}
          .about-quote{padding:28px 18px!important}
          .test-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* NAV */}
      <nav
        className="nav-glass"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(253,246,236,.94)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(21,71,52,.07)" : "none",
          transition: "all .4s ease",
          padding: scrolled ? "10px 24px" : "18px 24px",
        }}
      >
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 9 }}>
            <img src={FOOD_IMAGES.logo} alt="Arrmarr's Kitchen" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, color: "#154734" }}>
              ArrmarrsKitchen<span style={{ color: "#C45D2C" }}>.</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 26, alignItems: "center" }} className="hidden-mobile">
            {["Menu", "Bulk Orders", "Reviews", "Gallery", "Order"].map((item) => (
              <span
                key={item}
                onClick={() => scrollTo(item.toLowerCase().replace(/ /g, "-"))}
                style={{
                  fontSize: ".8rem",
                  fontWeight: 600,
                  color: "#154734",
                  cursor: "pointer",
                  letterSpacing: ".05em",
                  textTransform: "uppercase",
                  transition: "color .3s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#C45D2C")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#154734")}
              >
                {item}
              </span>
            ))}
          </div>
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ cursor: "pointer", flexDirection: "column", gap: 5, display: "none" }}
            className="show-mobile"
          >
            <div
              style={{
                width: 22,
                height: 2,
                background: "#154734",
                borderRadius: 2,
                transition: "all .3s",
                transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none",
              }}
            />
            <div style={{ width: 22, height: 2, background: "#154734", borderRadius: 2, transition: "all .3s", opacity: menuOpen ? 0 : 1 }} />
            <div
              style={{
                width: 22,
                height: 2,
                background: "#154734",
                borderRadius: 2,
                transition: "all .3s",
                transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none",
              }}
            />
          </div>
        </div>
        {menuOpen && (
          <div style={{ padding: "18px 0 8px", display: "flex", flexDirection: "column", gap: 14 }}>
            {["Menu", "Bulk Orders", "Reviews", "Gallery", "Order"].map((item) => (
              <span
                key={item}
                onClick={() => scrollTo(item.toLowerCase().replace(/ /g, "-"))}
                style={{ fontSize: ".95rem", fontWeight: 600, color: "#154734", cursor: "pointer", letterSpacing: ".04em", textTransform: "uppercase" }}
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </nav>

      {/* WELCOME POPUP OVERLAY */}
      {showWelcome && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,.5)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            animation: "welcome-in .6s ease both",
          }}
        >
          <div
            className="welcome-card"
            style={{
              background: "linear-gradient(135deg,#154734,#1b5e45)",
              borderRadius: 20,
              padding: "40px 48px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,.4)",
              border: "1px solid rgba(232,151,91,.2)",
              maxWidth: 420,
              width: "90%",
            }}
          >
            <img src={FOOD_IMAGES.logo} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", marginBottom: 16 }} />
            <div className="welcome-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 700, color: "white", marginBottom: 10 }}>
              Welcome to ArrmarrsKitchen
            </div>
            <div style={{ width: 50, height: 2, background: "linear-gradient(90deg,#C45D2C,#E8975B)", borderRadius: 1, margin: "0 auto 14px" }} />
            <div style={{ fontSize: ".95rem", color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}>
              Her official website &mdash; made with love.
              <br />Explore the menu, place an order, and taste the warmth!
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "100px 24px 60px",
          position: "relative",
          background: "radial-gradient(ellipse at 18% 45%,rgba(196,93,44,.06) 0%,transparent 50%),radial-gradient(ellipse at 82% 20%,rgba(21,71,52,.05) 0%,transparent 50%)",
        }}
      >
        {/* Decorative floating element removed */}
        <div className="hero-content" style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <FadeIn>
              <div style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: "#C45D2C", marginBottom: 18 }}>
                Authentic Nigerian Cuisine
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1
                className="hero-title"
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "3.8rem",
                  fontWeight: 800,
                  color: "#154734",
                  lineHeight: 1.06,
                  marginBottom: 18,
                }}
              >
                Warmth in{" "}
                <span style={{ color: "#C45D2C", fontStyle: "italic", fontWeight: 600 }}>Every</span>
                <br />
                Taste
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p style={{ fontSize: "1.05rem", color: "#666", maxWidth: 440, lineHeight: 1.7, marginBottom: 30 }}>
                From smoky jollof to rich egusi, every dish is made with love and rooted in Nigerian tradition.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  className="cta-btn"
                  onClick={() => scrollTo("menu")}
                  style={{ background: "#C45D2C", color: "white", padding: "14px 32px", borderRadius: 50, fontSize: ".93rem", fontWeight: 600 }}
                >
                  View Menu
                </button>
                <button
                  className="cta-btn cta-outline"
                  onClick={() => scrollTo("order")}
                  style={{
                    background: "transparent",
                    color: "#154734",
                    border: "2px solid #154734",
                    padding: "14px 32px",
                    borderRadius: 50,
                    fontSize: ".93rem",
                    fontWeight: 600,
                  }}
                >
                  Place an Order
                </button>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div style={{ marginTop: 36, display: "flex", gap: 24, fontSize: ".88rem", color: "#555", fontWeight: 600 }}>
                <span>&#128222; 9803332822</span>
                <span>&#9993;&#65039; arrmarrskitchen@gmail.com</span>
              </div>
            </FadeIn>
          </div>
          <div className="hero-imgs" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridRow: "1/3", borderRadius: 18, overflow: "hidden", position: "relative" }}>
              <video
                src={VIDEOS.food}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(21,71,52,.3),transparent 50%)" }} />
            </div>
            <div style={{ borderRadius: 18, overflow: "hidden", background: "#1a1a1a" }}>
              <img src={FOOD_IMAGES.menuChops} alt="Chops and rolls" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <div style={{ borderRadius: 18, overflow: "hidden", background: "#1a1a1a" }}>
              <img src={FOOD_IMAGES.menuSoups} alt="Nigerian soups" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* MENU */}
      <section id="menu" style={{ padding: "84px 24px", maxWidth: 1060, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#C45D2C", marginBottom: 10 }}>
              Our Menu
            </div>
            <h2 className="section-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.8rem", fontWeight: 700, color: "#154734" }}>
              Flavors That Speak <span style={{ fontStyle: "italic", color: "#C45D2C" }}>Soul</span>
            </h2>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="cat-scroll" style={{ display: "flex", gap: 7, justifyContent: "center", marginBottom: 36, flexWrap: "wrap" }}>
            {MENU_DATA.map((cat, i) => (
              <button
                key={cat.category}
                className={`cat-btn ${activeCategory === i ? "active" : ""}`}
                onClick={() => setActiveCategory(i)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 50,
                  background: activeCategory === i ? "#154734" : "rgba(21,71,52,.04)",
                  color: activeCategory === i ? "white" : "#154734",
                  fontSize: ".78rem",
                  fontWeight: 600,
                }}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </FadeIn>
        {MENU_DATA[activeCategory].sized && (
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(21,71,52,.05)",
                  padding: "5px 16px",
                  borderRadius: 50,
                  fontSize: ".72rem",
                  fontWeight: 600,
                  color: "#154734",
                }}
              >
                Prices: Small | Large
              </span>
            </div>
          </FadeIn>
        )}
        <div className="menu-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
          {MENU_DATA[activeCategory].items.map((item, i) => (
            <FadeIn key={item.name + activeCategory} delay={i * 0.05}>
              <div
                className="menu-card"
                style={{
                  background: "white",
                  borderRadius: 13,
                  padding: "22px 22px 18px",
                  border: "1px solid rgba(21,71,52,.05)",
                  position: "relative",
                }}
              >
                {item.popular && (
                  <div
                    className="popular-badge"
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "#C45D2C",
                      color: "white",
                      fontSize: ".58rem",
                      fontWeight: 700,
                      padding: "3px 9px",
                      borderRadius: 50,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Popular
                  </div>
                )}
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", fontWeight: 700, color: "#154734", marginBottom: 3 }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: ".83rem", color: "#888", lineHeight: 1.5, marginBottom: 12 }}>{item.desc}</p>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#C45D2C" }}>{item.price}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
      <div className="divider" />

      {/* BULK ORDERS */}
      <section id="bulk-orders" style={{ padding: "84px 24px", maxWidth: 1060, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#C45D2C", marginBottom: 10 }}>
              Bulk Orders
            </div>
            <h2 className="section-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.8rem", fontWeight: 700, color: "#154734" }}>
              Chops & Rolls <span style={{ fontStyle: "italic", color: "#C45D2C" }}>by the Pan</span>
            </h2>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div
            style={{
              maxWidth: 540,
              margin: "0 auto",
              background: "white",
              borderRadius: 16,
              border: "1px solid rgba(21,71,52,.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px 26px",
                background: "#154734",
                color: "white",
                fontSize: ".75rem",
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}
            >
              <span>Item</span>
              <span>Small | Large</span>
            </div>
            {BULK_CHOPS.map((item, i) => (
              <div
                key={item.name}
                className="bulk-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px 26px",
                  borderBottom: i < BULK_CHOPS.length - 1 ? "1px solid rgba(21,71,52,.05)" : "none",
                }}
              >
                <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: "1rem", color: "#154734" }}>{item.name}</span>
                <span style={{ fontWeight: 700, color: "#C45D2C", fontSize: ".95rem" }}>{item.price}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>
      <div className="divider" />

      {/* REVIEWS */}
      <section id="reviews" style={{ padding: "84px 24px", maxWidth: 1060, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#C45D2C", marginBottom: 10 }}>
              Reviews
            </div>
            <h2 className="section-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.8rem", fontWeight: 700, color: "#154734" }}>
              What Our <span style={{ fontStyle: "italic", color: "#C45D2C" }}>Customers</span> Say
            </h2>
          </div>
        </FadeIn>
        <div className="test-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {TESTIMONIALS.slice(0, 6).map((t, i) => (
            <FadeIn key={t.name + i} delay={i * 0.1}>
              <div
                className="test-card"
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: "28px 24px",
                  border: "1px solid rgba(21,71,52,.05)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stars count={t.rating} />
                <p style={{ fontSize: ".92rem", color: "#555", lineHeight: 1.7, marginTop: 14, flex: 1, fontStyle: "italic" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#154734,#1b5e45)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: ".8rem",
                      fontWeight: 700,
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: ".88rem", color: "#154734" }}>{t.name}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
      <div className="divider" />

      {/* GALLERY */}
      <section id="gallery" style={{ padding: "84px 24px", maxWidth: 1060, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#C45D2C", marginBottom: 10 }}>
              Gallery
            </div>
            <h2 className="section-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.8rem", fontWeight: 700, color: "#154734" }}>
              Straight From <span style={{ fontStyle: "italic", color: "#C45D2C" }}>Our Kitchen</span>
            </h2>
            <p style={{ fontSize: ".95rem", color: "#888", marginTop: 8 }}>
              Follow us on Instagram &#128073;{" "}
              <a
                href="https://www.instagram.com/arrmarrskitchen"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#C45D2C", fontWeight: 600, textDecoration: "none" }}
              >
                @arrmarrskitchen
              </a>
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[FOOD_IMAGES.menuPlates, FOOD_IMAGES.menuChops, FOOD_IMAGES.menuSoups].map((src, i) => (
              <div key={i} className="gallery-img" style={{ borderRadius: 16, overflow: "hidden", background: "#1a1a1a" }}>
                <img src={src} alt={`Food ${i + 1}`} style={{ width: "100%", display: "block" }} />
              </div>
            ))}
          </div>
        </FadeIn>
        {/* Video Section */}
        <FadeIn delay={0.15}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }} className="gallery-grid">
            <div className="gallery-img" style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "9/16", background: "#1a1a1a" }}>
              <video src={VIDEOS.food} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="gallery-img" style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "9/16", background: "#1a1a1a" }}>
              <video src={VIDEOS.promo} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </FadeIn>
        {/* Review Screenshots Gallery */}
        <FadeIn delay={0.2}>
          <h3
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#154734",
              textAlign: "center",
              marginTop: 48,
              marginBottom: 20,
            }}
          >
            Real Customer <span style={{ color: "#C45D2C", fontStyle: "italic" }}>Love</span>
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }} className="review-grid">
            {[FOOD_IMAGES.review1, FOOD_IMAGES.review4, FOOD_IMAGES.review6, FOOD_IMAGES.review7].map((src, i) => (
              <div key={i} className="gallery-img" style={{ borderRadius: 12, overflow: "hidden", background: "#1a1a1a" }}>
                <img src={src} alt={`Customer review ${i + 1}`} style={{ width: "100%", display: "block" }} />
              </div>
            ))}
          </div>
        </FadeIn>
      </section>
      <div className="divider" />

      {/* ABOUT */}
      <section id="about" style={{ padding: "84px 24px", maxWidth: 1060, margin: "0 auto" }}>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <FadeIn>
            <div
              className="about-quote"
              style={{
                background: "linear-gradient(135deg,#154734,#1b5e45)",
                borderRadius: 20,
                padding: "52px 40px",
                color: "white",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(196,93,44,.08)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "4rem",
                    color: "rgba(196,93,44,.22)",
                    fontWeight: 800,
                    lineHeight: 0.8,
                    marginBottom: 10,
                  }}
                >
                  &ldquo;
                </div>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", fontStyle: "italic", lineHeight: 1.7, color: "rgba(255,255,255,.9)" }}>
                  Food is more than nourishment &mdash; it&rsquo;s how we celebrate, how we connect, and how we carry our culture wherever we go.
                </p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div>
              <div style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#C45D2C", marginBottom: 10 }}>
                Our Story
              </div>
              <h2
                className="section-title"
                style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.4rem", fontWeight: 700, color: "#154734", lineHeight: 1.1 }}
              >
                From Our Kitchen
                <br />
                to Your <span style={{ fontStyle: "italic", color: "#C45D2C" }}>Table</span>
              </h2>
              <p style={{ fontSize: ".93rem", color: "#666", lineHeight: 1.8, marginTop: 18, marginBottom: 12 }}>
                ArrmarrsKitchen was born from a deep love for Nigerian food and the joy of sharing it with others. Every recipe has been perfected
                over years of cooking for family, friends, and community.
              </p>
              <p style={{ fontSize: ".93rem", color: "#666", lineHeight: 1.8, marginBottom: 26 }}>
                We use fresh, quality ingredients and authentic techniques to bring you the bold, rich flavors of home.
              </p>
              <div className="about-stats" style={{ display: "flex", gap: 32 }}>
                {[
                  { n: "100%", l: "Authentic" },
                  { n: "Fresh", l: "Always" },
                  { n: "Made", l: "With Love" },
                ].map((s) => (
                  <div key={s.l}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, color: "#C45D2C" }}>{s.n}</div>
                    <div style={{ fontSize: ".75rem", color: "#aaa", fontWeight: 500, marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      <div className="divider" />

      {/* ORDER */}
      <section id="order" style={{ padding: "84px 24px" }}>
        <FadeIn>
          <div
            className="cta-box-inner"
            style={{
              maxWidth: 820,
              margin: "0 auto",
              background: "linear-gradient(135deg,#154734,#1b5e45)",
              borderRadius: 26,
              padding: "64px 44px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 28% 38%,rgba(196,93,44,.1),transparent 60%)" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 className="order-heading" style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.5rem", fontWeight: 700, color: "white", marginBottom: 12 }}>
                Ready to <span style={{ fontStyle: "italic", color: "#E8975B" }}>Order?</span>
              </h2>
              <p style={{ fontSize: ".98rem", color: "rgba(255,255,255,.65)", maxWidth: 420, margin: "0 auto 26px", lineHeight: 1.7 }}>
                DM us on Instagram or reach out directly.
              </p>
              <a
                href="https://www.instagram.com/arrmarrskitchen"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  background: "#C45D2C",
                  color: "white",
                  padding: "15px 34px",
                  borderRadius: 50,
                  fontSize: ".93rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                DM on Instagram
              </a>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", fontSize: ".9rem", color: "rgba(255,255,255,.75)", fontWeight: 600, marginTop: 24 }}>
                <span>&#128222; 9803332822</span>
                <span>&#9993;&#65039; arrmarrskitchen@gmail.com</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px 28px", textAlign: "center", borderTop: "1px solid rgba(21,71,52,.05)" }}>
        <img src={FOOD_IMAGES.logo} alt="Arrmarr's Kitchen" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", marginBottom: 8 }} />
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", fontWeight: 700, color: "#154734", marginBottom: 5 }}>
          ArrmarrsKitchen<span style={{ color: "#C45D2C" }}>.</span>
        </div>
        <p style={{ fontSize: ".8rem", color: "#aaa", marginBottom: 10 }}>Warmth in Every Taste</p>
        <a
          href="https://www.instagram.com/arrmarrskitchen"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#C45D2C", fontSize: ".8rem", fontWeight: 500, textDecoration: "none" }}
        >
          @arrmarrskitchen
        </a>
        <p style={{ fontSize: ".7rem", color: "#ccc", marginTop: 18 }}>&copy; 2026 ArrmarrsKitchen. All rights reserved.</p>
      </footer>
    </div>
  );
}
