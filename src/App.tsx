import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import emailjs from "emailjs-com";

// ========== CART TYPES ==========
type CartItem = { name: string; price: number; qty: number; category: string };
type OrderStep = "cart" | "form" | "payment" | "done";

// ========== IMAGES (from public/) ==========
const FOOD_IMAGES = {
  menuChops: "/images/menu1.jpg",
  menuPlates: "/images/menu2.png",
  menuSoups: "/images/menu3.png",
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
      { name: "Jollof Rice", desc: "Classic smoky Nigerian jollof, perfectly seasoned", price: "$25", popular: true },
      { name: "Fried Rice", desc: "Colorful and flavorful, loaded with vegetables", price: "$25" },
      { name: "Jollof Spaghetti", desc: "A Nigerian twist on pasta, rich and savory", price: "$25" },
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
      { name: "Ayamase", desc: "Spicy designer stew with locust beans", price: "$35", popular: true },
      { name: "Stew", desc: "Classic tomato stew, rich and vibrant", price: "$30" },
      { name: "Yam Porridge", desc: "Hearty yam cooked in savory sauce", price: "$30" },
    ],
  },
  {
    category: "Extras",
    items: [
      { name: "Gizdodo", desc: "Gizzard and fried plantain medley", price: "$22", popular: true },
      { name: "Asun", desc: "Spicy smoked goat meat, perfectly grilled", price: "$30" },
      { name: "Moi Moi", desc: "Steamed bean pudding, soft and savory", price: "$15" },
      { name: "Grilled Fish", desc: "Whole fish, seasoned and flame-grilled", price: "$30" },
      { name: "Grilled Pepper Turkey", desc: "Tender turkey with spicy pepper coating", price: "$35" },
    ],
  },
  {
    category: "Chops & Rolls",
    items: [
      { name: "Meat Pies", desc: "Flaky pastry filled with seasoned meat", price: "$18", popular: true },
      { name: "Puff Puff", desc: "Sweet, fluffy deep-fried dough balls", price: "$15" },
      { name: "Beef Kebabs", desc: "Juicy skewered beef, perfectly spiced", price: "$20" },
      { name: "Egg Roll", desc: "Boiled egg wrapped in dough and fried", price: "$18" },
      { name: "Spring Roll", desc: "Crispy rolls with savory vegetable filling", price: "$15" },
      { name: "Fish Roll", desc: "Flaky pastry with seasoned fish filling", price: "$18" },
    ],
  },
];

const BULK_CHOPS = [
  { name: "Meatpies", price: "$65 / $140" },
  { name: "Puff Puff", price: "$55 / $110" },
  { name: "Beef Kebabs", price: "$95 / $190" },
  { name: "Egg Roll", price: "$80 / $150" },
  { name: "Fish Roll", price: "$65 / $140" },
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


// ========== MAIN APP ==========
export default function App() {
  // Kitchen state
  const [activeCategory, setActiveCategory] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderStep, setOrderStep] = useState<OrderStep>("cart");
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", email: "", type: "pickup", address: "", notes: "" });
  const [paymentMethod, setPaymentMethod] = useState<"zelle" | "cashapp" | "paypal" | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const addToCart = (name: string, priceStr: string, category: string) => {
    const price = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
    if (isNaN(price)) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing) return prev.map((i) => i.name === name ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { name, price, qty: 1, category }];
    });
    setAddedItem(name);
    setTimeout(() => setAddedItem(null), 1800);
  };

  const updateQty = (name: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.name === name ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
        .filter((i) => i.qty > 0)
    );
  };

  const placeOrder = async () => {
    if (!paymentMethod) return;
    setSubmitting(true);
    const itemsList = cart.map((i) => `${i.name} x${i.qty} — $${(i.price * i.qty).toFixed(2)}`).join("\n");
    const templateParams = {
      customer_name: orderForm.name,
      customer_phone: orderForm.phone,
      customer_email: orderForm.email,
      to_email: orderForm.email,
      order_type: orderForm.type,
      address: orderForm.type === "delivery" ? orderForm.address : "Pickup",
      notes: orderForm.notes || "None",
      items: itemsList,
      total: `$${cartTotal.toFixed(2)}`,
      payment_method: paymentMethod.toUpperCase(),
    };
    try {
      await emailjs.send("service_dwjsco3", "template_gv3zm3q", templateParams, "pt06Sr7QUm3gPoyig");
      if (orderForm.email) {
        await emailjs.send("service_dwjsco3", "template_hvxotu8", templateParams, "pt06Sr7QUm3gPoyig");
      }
    } catch (_) { /* order still shows confirmation even if email fails */ }
    setOrderStep("done");
    setSubmitting(false);
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const mapped: Record<string, string> = { contact: "order" };
    document.getElementById(mapped[id] ?? id)?.scrollIntoView({ behavior: "smooth" });
  };

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
        @keyframes cart-in{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
        @keyframes sheet-in{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
        @keyframes added-pop{0%{transform:scale(1)}50%{transform:scale(1.18)}100%{transform:scale(1)}}
        @keyframes toast-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .cart-drawer{animation:cart-in .3s cubic-bezier(.22,1,.36,1) both}
        .cart-sheet{animation:sheet-in .3s cubic-bezier(.22,1,.36,1) both}
        .add-btn{transition:all .2s ease;cursor:pointer;border:none;outline:none}
        .add-btn:hover{transform:scale(1.05)}
        .add-btn.added{animation:added-pop .3s ease}
        .qty-btn{cursor:pointer;border:none;outline:none;background:rgba(21,71,52,.08);color:#154734;width:28px;height:28px;border-radius:50%;font-size:1rem;font-weight:700;transition:background .2s}
        .qty-btn:hover{background:rgba(21,71,52,.2)}
        .pay-opt{cursor:pointer;border:2px solid rgba(21,71,52,.12);border-radius:14px;padding:16px 20px;transition:all .2s;background:white}
        .pay-opt:hover{border-color:#C45D2C;background:#fff8f4}
        .pay-opt.selected{border-color:#C45D2C;background:#fff3eb}
        .cart-fab{position:fixed;bottom:28px;right:24px;z-index:150;cursor:pointer;border:none;outline:none;background:#154734;color:white;border-radius:50px;padding:14px 22px;font-size:.9rem;font-weight:700;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:8px;box-shadow:0 6px 24px rgba(21,71,52,.35);transition:all .3s ease}
        .cart-fab:hover{background:#1b5e45;transform:translateY(-2px);box-shadow:0 10px 32px rgba(21,71,52,.4)}
        .form-input{width:100%;padding:12px 14px;border-radius:10px;border:1.5px solid rgba(21,71,52,.15);font-size:.9rem;font-family:'DM Sans',sans-serif;color:#1a1a1a;background:white;outline:none;transition:border .2s;box-sizing:border-box}
        .form-input:focus{border-color:#C45D2C}
        @media(max-width:768px){.cart-drawer{display:none!important}.cart-sheet{display:flex!important}}
        @media(min-width:769px){.cart-drawer{display:flex!important}.cart-sheet{display:none!important}}
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

      {/* ADDED TOAST */}
      {addedItem && (
        <div style={{ position:"fixed", bottom:90, right:24, zIndex:300, background:"#154734", color:"white", padding:"10px 18px", borderRadius:50, fontSize:".85rem", fontWeight:600, animation:"toast-in .3s ease both", boxShadow:"0 4px 16px rgba(21,71,52,.3)" }}>
          ✓ {addedItem} added
        </div>
      )}

      {/* FLOATING CART BUTTON */}
      {cartCount > 0 && (
        <button className="cart-fab" onClick={() => { setCartOpen(true); setOrderStep("cart"); }}>
          <span>🛒</span>
          <span>{cartCount} item{cartCount !== 1 ? "s" : ""}</span>
          <span style={{ background:"#C45D2C", borderRadius:50, padding:"2px 10px", fontSize:".8rem" }}>${cartTotal.toFixed(2)}</span>
        </button>
      )}

      {/* CART OVERLAY BACKDROP */}
      {cartOpen && (
        <div onClick={() => setCartOpen(false)} style={{ position:"fixed", inset:0, zIndex:199, background:"rgba(0,0,0,.4)", backdropFilter:"blur(4px)" }} />
      )}

      {/* CART DRAWER — desktop */}
      {cartOpen && (
        <div className="cart-drawer" style={{ position:"fixed", top:0, right:0, bottom:0, width:420, zIndex:200, background:"white", boxShadow:"-8px 0 40px rgba(0,0,0,.12)", flexDirection:"column", overflowY:"auto" }}>
          {orderStep === "cart" && (
            <>
              <div style={{ padding:"24px 24px 16px", borderBottom:"1px solid rgba(21,71,52,.08)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.3rem", fontWeight:700, color:"#154734" }}>Your Order</div>
                <button onClick={() => setCartOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"1.4rem", color:"#888" }}>✕</button>
              </div>
              {cart.length === 0 ? (
                <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40, color:"#aaa" }}>
                  <div style={{ fontSize:"3rem", marginBottom:12 }}>🛒</div>
                  <div style={{ fontWeight:600 }}>Your cart is empty</div>
                  <div style={{ fontSize:".85rem", marginTop:6 }}>Add items from the menu</div>
                </div>
              ) : (
                <div style={{ flex:1, padding:"16px 24px", display:"flex", flexDirection:"column", gap:12 }}>
                  {cart.map((item) => (
                    <div key={item.name} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid rgba(21,71,52,.06)" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:".9rem", color:"#154734" }}>{item.name}</div>
                        <div style={{ fontSize:".78rem", color:"#aaa" }}>${item.price.toFixed(2)} each</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <button className="qty-btn" onClick={() => updateQty(item.name, -1)}>−</button>
                        <span style={{ fontWeight:700, fontSize:".95rem", minWidth:20, textAlign:"center" }}>{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.name, 1)}>+</button>
                      </div>
                      <div style={{ fontWeight:700, color:"#C45D2C", minWidth:54, textAlign:"right" }}>${(item.price * item.qty).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
              {cart.length > 0 && (
                <div style={{ padding:"16px 24px 28px", borderTop:"1px solid rgba(21,71,52,.08)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16, fontSize:"1rem", fontWeight:700 }}>
                    <span>Total</span><span style={{ color:"#C45D2C" }}>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="cta-btn" onClick={() => setOrderStep("form")} style={{ width:"100%", background:"#C45D2C", color:"white", padding:"14px", borderRadius:50, fontSize:".95rem", fontWeight:700 }}>
                    Continue to Order →
                  </button>
                </div>
              )}
            </>
          )}

          {orderStep === "form" && (
            <>
              <div style={{ padding:"24px 24px 16px", borderBottom:"1px solid rgba(21,71,52,.08)", display:"flex", alignItems:"center", gap:12 }}>
                <button onClick={() => setOrderStep("cart")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"1.2rem", color:"#888" }}>←</button>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", fontWeight:700, color:"#154734" }}>Your Details</div>
              </div>
              <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14, flex:1, overflowY:"auto" }}>
                <div>
                  <label style={{ fontSize:".78rem", fontWeight:700, color:"#154734", letterSpacing:".06em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Full Name *</label>
                  <input className="form-input" placeholder="Your name" value={orderForm.name} onChange={e => setOrderForm(f => ({...f, name: e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize:".78rem", fontWeight:700, color:"#154734", letterSpacing:".06em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Phone Number *</label>
                  <input className="form-input" placeholder="Your phone number" value={orderForm.phone} onChange={e => setOrderForm(f => ({...f, phone: e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize:".78rem", fontWeight:700, color:"#154734", letterSpacing:".06em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Email <span style={{ color:"#aaa", fontWeight:400, textTransform:"none", letterSpacing:0 }}>(for order confirmation)</span></label>
                  <input className="form-input" placeholder="your@email.com" type="email" value={orderForm.email} onChange={e => setOrderForm(f => ({...f, email: e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize:".78rem", fontWeight:700, color:"#154734", letterSpacing:".06em", textTransform:"uppercase", display:"block", marginBottom:8 }}>Order Type *</label>
                  <div style={{ display:"flex", gap:10 }}>
                    {["pickup","delivery"].map(t => (
                      <button key={t} onClick={() => setOrderForm(f => ({...f, type: t}))} style={{ flex:1, padding:"10px", borderRadius:10, border:`2px solid ${orderForm.type===t?"#C45D2C":"rgba(21,71,52,.15)"}`, background:orderForm.type===t?"#fff3eb":"white", fontWeight:600, fontSize:".88rem", color:orderForm.type===t?"#C45D2C":"#555", cursor:"pointer", textTransform:"capitalize" }}>
                        {t === "pickup" ? "🏠 Pickup" : "🚗 Delivery"}
                      </button>
                    ))}
                  </div>
                </div>
                {orderForm.type === "delivery" && (
                  <div>
                    <label style={{ fontSize:".78rem", fontWeight:700, color:"#154734", letterSpacing:".06em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Delivery Address *</label>
                    <input className="form-input" placeholder="Full address" value={orderForm.address} onChange={e => setOrderForm(f => ({...f, address: e.target.value}))} />
                  </div>
                )}
                <div>
                  <label style={{ fontSize:".78rem", fontWeight:700, color:"#154734", letterSpacing:".06em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Notes (optional)</label>
                  <textarea className="form-input" placeholder="Allergies, special requests..." rows={3} value={orderForm.notes} onChange={e => setOrderForm(f => ({...f, notes: e.target.value}))} style={{ resize:"none" }} />
                </div>
              </div>
              <div style={{ padding:"16px 24px 28px", borderTop:"1px solid rgba(21,71,52,.08)" }}>
                <button
                  className="cta-btn"
                  onClick={() => { if (orderForm.name && orderForm.phone && (orderForm.type==="pickup" || orderForm.address)) setOrderStep("payment"); }}
                  style={{ width:"100%", background: orderForm.name && orderForm.phone ? "#C45D2C" : "#ccc", color:"white", padding:"14px", borderRadius:50, fontSize:".95rem", fontWeight:700, cursor: orderForm.name && orderForm.phone ? "pointer" : "not-allowed" }}
                >
                  Choose Payment →
                </button>
              </div>
            </>
          )}

          {orderStep === "payment" && (
            <>
              <div style={{ padding:"24px 24px 16px", borderBottom:"1px solid rgba(21,71,52,.08)", display:"flex", alignItems:"center", gap:12 }}>
                <button onClick={() => setOrderStep("form")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"1.2rem", color:"#888" }}>←</button>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", fontWeight:700, color:"#154734" }}>Payment</div>
              </div>
              <div style={{ padding:"20px 24px", flex:1, overflowY:"auto" }}>
                <div style={{ background:"rgba(21,71,52,.04)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
                  <div style={{ fontSize:".78rem", color:"#888", fontWeight:600, marginBottom:4 }}>ORDER TOTAL</div>
                  <div style={{ fontSize:"1.5rem", fontWeight:800, color:"#C45D2C" }}>${cartTotal.toFixed(2)}</div>
                </div>
                <div style={{ fontSize:".82rem", color:"#666", marginBottom:16, lineHeight:1.6 }}>
                  Select your payment method below. After placing your order, you'll receive the exact payment details and handle to send the money to. Your order is confirmed once payment is received.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {([
                    { id:"zelle", label:"Zelle", icon:"💚", desc:"Send to phone number" },
                    { id:"cashapp", label:"CashApp", icon:"💵", desc:"$ArrmarrsKitchen1" },
                    { id:"paypal", label:"PayPal", icon:"🔵", desc:"Send to PayPal email" },
                  ] as const).map(opt => (
                    <div key={opt.id} className={`pay-opt ${paymentMethod===opt.id?"selected":""}`} onClick={() => setPaymentMethod(opt.id)} style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <span style={{ fontSize:"1.5rem" }}>{opt.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:".95rem", color:"#154734" }}>{opt.label}</div>
                        <div style={{ fontSize:".78rem", color:"#888" }}>{opt.desc}</div>
                      </div>
                      <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${paymentMethod===opt.id?"#C45D2C":"rgba(21,71,52,.2)"}`, background:paymentMethod===opt.id?"#C45D2C":"white", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {paymentMethod===opt.id && <div style={{ width:8, height:8, borderRadius:"50%", background:"white" }} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding:"16px 24px 28px", borderTop:"1px solid rgba(21,71,52,.08)" }}>
                <button
                  className="cta-btn"
                  onClick={placeOrder}
                  disabled={!paymentMethod || submitting}
                  style={{ width:"100%", background: paymentMethod ? "#C45D2C" : "#ccc", color:"white", padding:"14px", borderRadius:50, fontSize:".95rem", fontWeight:700, cursor: paymentMethod ? "pointer" : "not-allowed" }}
                >
                  {submitting ? "Placing Order…" : "Place Order ✓"}
                </button>
              </div>
            </>
          )}

          {orderStep === "done" && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 28px", textAlign:"center" }}>
              <div style={{ fontSize:"3.5rem", marginBottom:16 }}>🎉</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", fontWeight:700, color:"#154734", marginBottom:10 }}>Order Placed!</div>
              <div style={{ fontSize:".9rem", color:"#666", lineHeight:1.7, marginBottom:24 }}>
                Thank you, <strong>{orderForm.name}</strong>! Your order is pending payment.
              </div>
              <div style={{ background:"#fff3eb", borderRadius:14, padding:"18px 20px", width:"100%", marginBottom:20, textAlign:"left" }}>
                <div style={{ fontSize:".75rem", fontWeight:700, letterSpacing:".1em", color:"#C45D2C", textTransform:"uppercase", marginBottom:10 }}>Send ${cartTotal.toFixed(2)} via {paymentMethod?.toUpperCase()}</div>
                {paymentMethod === "zelle" && <div style={{ fontWeight:700, color:"#154734", fontSize:".95rem" }}>📱 9803332822</div>}
                {paymentMethod === "cashapp" && (
                  <div>
                    <a href="https://cash.app/$ArrmarrsKitchen1" target="_blank" rel="noopener noreferrer" style={{ fontWeight:700, color:"#154734", fontSize:".95rem", textDecoration:"none", display:"block", marginBottom:10 }}>💵 $ArrmarrsKitchen1 →</a>
                    <img src="/images/cashapp.jpg" alt="CashApp QR" style={{ width:120, height:120, borderRadius:10, objectFit:"cover", display:"block" }} />
                  </div>
                )}
                {paymentMethod === "paypal" && <div style={{ fontWeight:700, color:"#154734", fontSize:".95rem" }}>🔵 arrmarrskitchen@gmail.com</div>}
                <div style={{ fontSize:".78rem", color:"#888", marginTop:8 }}>Include your name in the payment note. We'll confirm once received!</div>
              </div>
              <div style={{ background:"rgba(21,71,52,.06)", borderRadius:10, padding:"10px 14px", width:"100%", marginBottom:8 }}>
                <div style={{ fontSize:".75rem", color:"#666", lineHeight:1.6 }}>📧 <strong>Confirmation email sent!</strong> If you don't see it, check your <strong>spam/junk folder</strong> and mark it as "Not Spam".</div>
              </div>
              <button className="cta-btn" onClick={() => { setCart([]); setCartOpen(false); setOrderStep("cart"); setOrderForm({ name:"", phone:"", email:"", type:"pickup", address:"", notes:"" }); setPaymentMethod(""); }} style={{ background:"#154734", color:"white", padding:"12px 28px", borderRadius:50, fontSize:".9rem", fontWeight:600, cursor:"pointer" }}>
                Done
              </button>
            </div>
          )}
        </div>
      )}

      {/* CART BOTTOM SHEET — mobile */}
      {cartOpen && (
        <div className="cart-sheet" style={{ position:"fixed", left:0, right:0, bottom:0, zIndex:200, background:"white", borderRadius:"20px 20px 0 0", boxShadow:"0 -8px 40px rgba(0,0,0,.15)", flexDirection:"column", maxHeight:"90vh", overflowY:"auto" }}>
          {orderStep === "cart" && (
            <>
              <div style={{ padding:"16px 20px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid rgba(21,71,52,.08)" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", fontWeight:700, color:"#154734" }}>Your Order</div>
                <button onClick={() => setCartOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"1.3rem", color:"#888" }}>✕</button>
              </div>
              {cart.length === 0 ? (
                <div style={{ padding:40, textAlign:"center", color:"#aaa" }}>
                  <div style={{ fontSize:"2.5rem", marginBottom:8 }}>🛒</div>
                  <div style={{ fontWeight:600 }}>Your cart is empty</div>
                </div>
              ) : (
                <>
                  <div style={{ padding:"12px 20px", display:"flex", flexDirection:"column", gap:10 }}>
                    {cart.map((item) => (
                      <div key={item.name} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:"1px solid rgba(21,71,52,.06)" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:".88rem", color:"#154734" }}>{item.name}</div>
                          <div style={{ fontSize:".75rem", color:"#aaa" }}>${item.price.toFixed(2)} each</div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <button className="qty-btn" onClick={() => updateQty(item.name, -1)}>−</button>
                          <span style={{ fontWeight:700, minWidth:18, textAlign:"center" }}>{item.qty}</span>
                          <button className="qty-btn" onClick={() => updateQty(item.name, 1)}>+</button>
                        </div>
                        <div style={{ fontWeight:700, color:"#C45D2C", minWidth:50, textAlign:"right", fontSize:".9rem" }}>${(item.price * item.qty).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding:"12px 20px 28px", borderTop:"1px solid rgba(21,71,52,.08)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, fontWeight:700, fontSize:"1rem" }}>
                      <span>Total</span><span style={{ color:"#C45D2C" }}>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="cta-btn" onClick={() => setOrderStep("form")} style={{ width:"100%", background:"#C45D2C", color:"white", padding:"14px", borderRadius:50, fontSize:".95rem", fontWeight:700 }}>
                      Continue →
                    </button>
                  </div>
                </>
              )}
            </>
          )}
          {orderStep === "form" && (
            <>
              <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid rgba(21,71,52,.08)", display:"flex", alignItems:"center", gap:10 }}>
                <button onClick={() => setOrderStep("cart")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"1.1rem", color:"#888" }}>←</button>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:700, color:"#154734" }}>Your Details</div>
              </div>
              <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
                <input className="form-input" placeholder="Full Name *" value={orderForm.name} onChange={e => setOrderForm(f => ({...f, name: e.target.value}))} />
                <input className="form-input" placeholder="Phone Number *" value={orderForm.phone} onChange={e => setOrderForm(f => ({...f, phone: e.target.value}))} />
                <input className="form-input" placeholder="Email (for order confirmation)" type="email" value={orderForm.email} onChange={e => setOrderForm(f => ({...f, email: e.target.value}))} />
                <div style={{ display:"flex", gap:8 }}>
                  {["pickup","delivery"].map(t => (
                    <button key={t} onClick={() => setOrderForm(f => ({...f, type: t}))} style={{ flex:1, padding:"10px", borderRadius:10, border:`2px solid ${orderForm.type===t?"#C45D2C":"rgba(21,71,52,.15)"}`, background:orderForm.type===t?"#fff3eb":"white", fontWeight:600, fontSize:".85rem", color:orderForm.type===t?"#C45D2C":"#555", cursor:"pointer", textTransform:"capitalize" }}>
                      {t === "pickup" ? "🏠 Pickup" : "🚗 Delivery"}
                    </button>
                  ))}
                </div>
                {orderForm.type === "delivery" && (
                  <input className="form-input" placeholder="Delivery Address *" value={orderForm.address} onChange={e => setOrderForm(f => ({...f, address: e.target.value}))} />
                )}
                <textarea className="form-input" placeholder="Notes (optional)" rows={2} value={orderForm.notes} onChange={e => setOrderForm(f => ({...f, notes: e.target.value}))} style={{ resize:"none" }} />
                <button className="cta-btn" onClick={() => { if (orderForm.name && orderForm.phone) setOrderStep("payment"); }} style={{ width:"100%", background: orderForm.name && orderForm.phone ? "#C45D2C" : "#ccc", color:"white", padding:"14px", borderRadius:50, fontSize:".95rem", fontWeight:700, marginBottom:12 }}>
                  Choose Payment →
                </button>
              </div>
            </>
          )}
          {orderStep === "payment" && (
            <>
              <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid rgba(21,71,52,.08)", display:"flex", alignItems:"center", gap:10 }}>
                <button onClick={() => setOrderStep("form")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"1.1rem", color:"#888" }}>←</button>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:700, color:"#154734" }}>Payment — ${cartTotal.toFixed(2)}</div>
              </div>
              <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ fontSize:".82rem", color:"#666", lineHeight:1.6, marginBottom:4 }}>Choose how you'll pay. You'll send the money after placing your order.</div>
                {([
                  { id:"zelle", label:"Zelle", icon:"💚", desc:"Send to phone number" },
                  { id:"cashapp", label:"CashApp", icon:"💵", desc:"Send to $cashtag" },
                  { id:"paypal", label:"PayPal", icon:"🔵", desc:"Send to PayPal email" },
                ] as const).map(opt => (
                  <div key={opt.id} className={`pay-opt ${paymentMethod===opt.id?"selected":""}`} onClick={() => setPaymentMethod(opt.id)} style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:"1.3rem" }}>{opt.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:".9rem", color:"#154734" }}>{opt.label}</div>
                      <div style={{ fontSize:".75rem", color:"#888" }}>{opt.desc}</div>
                    </div>
                    <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${paymentMethod===opt.id?"#C45D2C":"rgba(21,71,52,.2)"}`, background:paymentMethod===opt.id?"#C45D2C":"white" }} />
                  </div>
                ))}
                <button className="cta-btn" disabled={!paymentMethod || submitting} onClick={placeOrder} style={{ width:"100%", background: paymentMethod ? "#C45D2C" : "#ccc", color:"white", padding:"14px", borderRadius:50, fontSize:".95rem", fontWeight:700, marginTop:8, marginBottom:12 }}>
                  {submitting ? "Placing Order…" : "Place Order ✓"}
                </button>
              </div>
            </>
          )}
          {orderStep === "done" && (
            <div style={{ padding:"32px 24px", textAlign:"center" }}>
              <div style={{ fontSize:"3rem", marginBottom:12 }}>🎉</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.3rem", fontWeight:700, color:"#154734", marginBottom:8 }}>Order Placed!</div>
              <div style={{ fontSize:".88rem", color:"#666", lineHeight:1.7, marginBottom:20 }}>Thank you, <strong>{orderForm.name}</strong>! Send your payment to confirm.</div>
              <div style={{ background:"#fff3eb", borderRadius:14, padding:"16px", marginBottom:20, textAlign:"left" }}>
                <div style={{ fontSize:".72rem", fontWeight:700, color:"#C45D2C", textTransform:"uppercase", marginBottom:8 }}>Send ${cartTotal.toFixed(2)} via {paymentMethod?.toUpperCase()}</div>
                {paymentMethod === "zelle" && <div style={{ fontWeight:700, color:"#154734" }}>📱 9803332822</div>}
                {paymentMethod === "cashapp" && <div style={{ fontWeight:700, color:"#154734" }}>💵 $arrmarrskitchen</div>}
                {paymentMethod === "paypal" && <div style={{ fontWeight:700, color:"#154734" }}>🔵 arrmarrskitchen@gmail.com</div>}
                <div style={{ fontSize:".75rem", color:"#888", marginTop:6 }}>Include your name in the note!</div>
                <div style={{ background:"rgba(21,71,52,.06)", borderRadius:10, padding:"10px 12px", marginTop:10 }}>
                  <div style={{ fontSize:".75rem", color:"#666", lineHeight:1.6 }}>📧 <strong>Check your email!</strong> Confirmation may be in your <strong>spam folder</strong> — mark it "Not Spam".</div>
                </div>
              </div>
              <button className="cta-btn" onClick={() => { setCart([]); setCartOpen(false); setOrderStep("cart"); setOrderForm({ name:"", phone:"", email:"", type:"pickup", address:"", notes:"" }); setPaymentMethod(""); }} style={{ background:"#154734", color:"white", padding:"12px 28px", borderRadius:50, fontSize:".9rem", fontWeight:600, cursor:"pointer" }}>
                Done
              </button>
            </div>
          )}
        </div>
      )}

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
            {["Menu", "Bulk Orders", "Catering", "Reviews", "Gallery", "Contact"].map((item) => (
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
            {["Menu", "Bulk Orders", "Catering", "Reviews", "Gallery", "Contact"].map((item) => (
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
              <img src={FOOD_IMAGES.menuChops} alt="Menu 1" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <div style={{ borderRadius: 18, overflow: "hidden", background: "#1a1a1a" }}>
              <img src={FOOD_IMAGES.menuPlates} alt="Menu 2" style={{ width: "100%", height: "auto", display: "block" }} />
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
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#C45D2C" }}>{item.price}</div>
                  {item.price.includes("/") ? (
                    <div style={{ display:"flex", gap:6 }}>
                      {["Small","Large"].map((size, si) => {
                        const sizePrice = item.price.split("/")[si]?.trim() ?? item.price;
                        return (
                          <button
                            key={size}
                            className={`add-btn ${addedItem === item.name + size ? "added" : ""}`}
                            onClick={() => { addToCart(`${item.name} (${size})`, sizePrice, MENU_DATA[activeCategory].category); setAddedItem(item.name + size); setTimeout(() => setAddedItem(null), 1800); }}
                            style={{ background: addedItem===item.name+size ? "#154734" : si===0 ? "rgba(196,93,44,.15)" : "#C45D2C", color: si===0 && addedItem!==item.name+size ? "#C45D2C" : "white", padding:"6px 12px", borderRadius:50, fontSize:".72rem", fontWeight:700, border: si===0 ? "1px solid rgba(196,93,44,.3)" : "none" }}
                          >
                            {addedItem===item.name+size ? "✓" : `+ ${size}`}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <button
                      className={`add-btn ${addedItem === item.name ? "added" : ""}`}
                      onClick={() => addToCart(item.name, item.price, MENU_DATA[activeCategory].category)}
                      style={{ background: addedItem===item.name ? "#154734" : "#C45D2C", color:"white", padding:"7px 16px", borderRadius:50, fontSize:".78rem", fontWeight:700 }}
                    >
                      {addedItem === item.name ? "✓ Added" : "+ Add"}
                    </button>
                  )}
                </div>
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
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontWeight: 700, color: "#C45D2C", fontSize: ".95rem" }}>{item.price}</span>
                  <div style={{ display:"flex", gap:6 }}>
                    {["Small","Large"].map((size, si) => {
                      const sizePrice = item.price.split("/")[si]?.trim() ?? item.price;
                      const key = item.name + size;
                      return (
                        <button
                          key={size}
                          className={`add-btn ${addedItem === key ? "added" : ""}`}
                          onClick={() => { addToCart(`${item.name} (${size})`, sizePrice, "Bulk"); setAddedItem(key); setTimeout(() => setAddedItem(null), 1800); }}
                          style={{ background: addedItem===key ? "#154734" : si===0 ? "rgba(21,71,52,.1)" : "#C45D2C", color: si===0 && addedItem!==key ? "#154734" : "white", padding:"6px 12px", borderRadius:50, fontSize:".72rem", fontWeight:700, border:"none", cursor:"pointer" }}
                        >
                          {addedItem===key ? "✓" : `+ ${size}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>
      <div className="divider" />

      {/* CATERING */}
      <section id="catering" style={{ padding: "84px 24px", background: "linear-gradient(135deg,#154734,#1b5e45)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(196,93,44,.08)" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(232,151,91,.06)" }} />
        <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#E8975B", marginBottom: 10 }}>
                Catering & Bulk Orders
              </div>
              <h2 className="section-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.8rem", fontWeight: 700, color: "white", lineHeight: 1.1 }}>
                Feeding a Crowd? <span style={{ fontStyle: "italic", color: "#E8975B" }}>We've Got You.</span>
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,.65)", maxWidth: 520, margin: "16px auto 0", lineHeight: 1.8 }}>
                From intimate gatherings to large events, we cater with the same love and quality you expect. Enquire today and let us take care of the food.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 48 }}>
              {["Jollof Rice", "Fried Rice", "Pepper Soup", "Jambala Pasta", "Jollof Spaghetti", "Egusi Soup", "Puff Puff", "And Many More…"].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 50,
                    background: item === "And Many More…" ? "rgba(196,93,44,.2)" : "rgba(255,255,255,.08)",
                    border: item === "And Many More…" ? "1px solid rgba(196,93,44,.4)" : "1px solid rgba(255,255,255,.12)",
                    color: item === "And Many More…" ? "#E8975B" : "rgba(255,255,255,.85)",
                    fontSize: ".85rem",
                    fontWeight: 600,
                    fontStyle: item === "And Many More…" ? "italic" : "normal",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ textAlign: "center" }}>
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
                  padding: "15px 36px",
                  borderRadius: 50,
                  fontSize: ".95rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  marginBottom: 20,
                }}
              >
                Enquire on Instagram
              </a>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", fontSize: ".9rem", color: "rgba(255,255,255,.6)", fontWeight: 600 }}>
                <span>&#128222; 9803332822</span>
                <span>&#9993;&#65039; arrmarrskitchen@gmail.com</span>
              </div>
            </div>
          </FadeIn>
        </div>
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
            {[FOOD_IMAGES.menuChops, FOOD_IMAGES.menuPlates, FOOD_IMAGES.menuSoups].map((src, i) => (
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
              <div style={{ fontSize: ".75rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,151,91,.7)", marginBottom: 14 }}>
                Get in Touch
              </div>
              <h2 className="order-heading" style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.5rem", fontWeight: 700, color: "white", marginBottom: 12 }}>
                Questions or <span style={{ fontStyle: "italic", color: "#E8975B" }}>Custom Orders?</span>
              </h2>
              <p style={{ fontSize: ".98rem", color: "rgba(255,255,255,.65)", maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.8 }}>
                For catering, special requests, or anything that needs a conversation — reach out directly. For regular orders, use the cart on the menu above.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
                {[
                  { label: "🎉 Catering & Events", desc: "Large party orders & custom menus" },
                  { label: "❓ Pre-order Questions", desc: "Delivery area, ingredients & more" },
                  { label: "📦 Order Support", desc: "Changes, cancellations & confirmations" },
                ].map(item => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "12px 18px", textAlign: "left", minWidth: 180, flex: "1 1 180px", maxWidth: 220 }}>
                    <div style={{ fontWeight: 700, fontSize: ".85rem", color: "white", marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
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
              <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", fontSize: ".9rem", color: "rgba(255,255,255,.75)", fontWeight: 600, marginTop: 20 }}>
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
