import { useState, useRef, useEffect } from "react";

const COLORS = {
  primary: "#1a6b3c",
  primaryLight: "#2d9e5f",
  primaryDark: "#0f4526",
  accent: "#f4c430",
  accentLight: "#ffd966",
  bg: "#f0f7f2",
  card: "#ffffff",
  text: "#1a2e22",
  textLight: "#5a7a65",
  danger: "#e05555",
};

const SYSTEM_PROMPT = `You are Aarogya, a warm and knowledgeable Indian AI health coach. 
You speak in a friendly Hindi-English mix (Hinglish). 
You specialize in personalized Indian diet plans, healthy lifestyle habits, and wellness guidance.
You are empathetic, motivating, and culturally aware of Indian food habits.
Always recommend Indian foods (dal, roti, sabzi, chawal, dahi, etc.).
Keep responses concise (2-4 sentences max) and always end with an encouraging phrase.
When user asks for diet plan, provide a simple 3-meal Indian diet plan.
Never give medical diagnosis. Always suggest consulting a doctor for medical issues.
Address user by their name when you know it.`;

const QUICK_REPLIES = [
  "Mujhe diet plan chahiye 🥗",
  "Weight loss tips do 💪",
  "Healthy breakfast kya khaaun? 🌅",
  "Diabetes mein kya khaaun? 🩺",
  "Protein rich foods batao 🥚",
];

const GOALS = [
  { id: "weight_loss", label: "Weight Loss", icon: "⚖️" },
  { id: "muscle_gain", label: "Muscle Gain", icon: "💪" },
  { id: "diabetes", label: "Diabetes Control", icon: "🩺" },
  { id: "wellness", label: "General Wellness", icon: "🌿" },
  { id: "energy", label: "More Energy", icon: "⚡" },
];

export default function AarogyaAI() {
  const [screen, setScreen] = useState("splash"); // splash, onboarding, home, chat, plans, profile
  const [step, setStep] = useState(0);
  const [user, setUser] = useState({ name: "", age: "", weight: "", height: "", goal: "", diet: "veg" });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (screen === "splash") {
      setTimeout(() => setScreen("onboarding"), 2200);
    }
  }, [screen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOnboardingComplete = () => {
    const greeting = {
      role: "assistant",
      content: `Namaste ${user.name}! 🙏 Main hoon Aarogya, aapka personal AI health coach! Aapka swagat hai is swasthya yatra mein. Aapka goal "${GOALS.find(g => g.id === user.goal)?.label}" hai — hum milkar isko achieve karenge! Kaise help kar sakta hoon aaj? 🌿`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([greeting]);
    setScreen("main");
    setActiveTab("chat");
  };

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput("");

    const newMessages = [
      ...messages,
      {
        role: "user",
        content: userMsg,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));
      const userContext = `User info: Name=${user.name}, Age=${user.age}, Weight=${user.weight}kg, Height=${user.height}cm, Goal=${user.goal}, Diet=${user.diet}. `;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT + "\n" + userContext,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "Kuch problem aa gayi, dobara try karein!";

      const assistantMsg = {
        role: "assistant",
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages([...newMessages, assistantMsg]);

      if (userMsg.toLowerCase().includes("diet plan") || userMsg.toLowerCase().includes("plan chahiye")) {
        setPlans((prev) => [
          {
            id: Date.now(),
            date: new Date().toLocaleDateString("en-IN"),
            title: `Diet Plan — ${user.name}`,
            goal: user.goal,
            content: reply,
          },
          ...prev,
        ]);
      }
    } catch (e) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Network error aa gayi! Please dobara try karein. 🙏",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
    setLoading(false);
  };

  // ─── SPLASH ───────────────────────────────────────────────────────
  if (screen === "splash") {
    return (
      <div style={{
        height: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: `linear-gradient(160deg, ${COLORS.primaryDark} 0%, ${COLORS.primary} 60%, ${COLORS.primaryLight} 100%)`,
        fontFamily: "'Segoe UI', sans-serif",
      }}>
        <div style={{ animation: "pulse 1.5s ease-in-out infinite", fontSize: 80 }}>🌿</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginTop: 16, letterSpacing: 1 }}>
          Aarogya AI
        </div>
        <div style={{ color: COLORS.accentLight, fontSize: 15, marginTop: 8, fontStyle: "italic" }}>
          Aapka Personal Health Coach
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.4)",
              animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
        <style>{`
          @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
          @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-8px);opacity:1} }
        `}</style>
      </div>
    );
  }

  // ─── ONBOARDING ────────────────────────────────────────────────────
  if (screen === "onboarding") {
    const steps = [
      {
        title: "Aapka naam kya hai?",
        subtitle: "Hum aapko personally address karenge 😊",
        content: (
          <input
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            placeholder="Jaise: Rahul, Priya..."
            style={inputStyle}
          />
        ),
        valid: user.name.trim().length > 1,
      },
      {
        title: "Aapki details bataaiye",
        subtitle: "Personalised plan ke liye zaroori hai",
        content: (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { key: "age", label: "Aayu (years)", placeholder: "Jaise: 28", type: "number" },
              { key: "weight", label: "Vajan (kg)", placeholder: "Jaise: 72", type: "number" },
              { key: "height", label: "Lambai (cm)", placeholder: "Jaise: 168", type: "number" },
            ].map((f) => (
              <div key={f.key}>
                <div style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 4 }}>{f.label}</div>
                <input
                  type={f.type}
                  value={user[f.key]}
                  onChange={(e) => setUser({ ...user, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        ),
        valid: user.age && user.weight && user.height,
      },
      {
        title: "Aapka lakshya kya hai?",
        subtitle: "Hum iske hisaab se plan banayenge",
        content: (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {GOALS.map((g) => (
              <button
                key={g.id}
                onClick={() => setUser({ ...user, goal: g.id })}
                style={{
                  ...goalBtnStyle,
                  background: user.goal === g.id ? COLORS.primary : "#fff",
                  color: user.goal === g.id ? "#fff" : COLORS.text,
                  border: `2px solid ${user.goal === g.id ? COLORS.primary : "#e0ede5"}`,
                }}
              >
                <span style={{ fontSize: 22 }}>{g.icon}</span>
                <span style={{ fontWeight: 600 }}>{g.label}</span>
              </button>
            ))}
          </div>
        ),
        valid: user.goal,
      },
      {
        title: "Aap kya khaate hain?",
        subtitle: "Aapki food preference",
        content: (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { id: "veg", label: "Vegetarian 🥦", desc: "Sirf shakahari bhojan" },
              { id: "nonveg", label: "Non-Vegetarian 🍗", desc: "Maans-matsya bhi khate hain" },
              { id: "vegan", label: "Vegan 🌱", desc: "Dairy bhi nahi lete" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setUser({ ...user, diet: d.id })}
                style={{
                  ...goalBtnStyle,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  background: user.diet === d.id ? COLORS.primary : "#fff",
                  color: user.diet === d.id ? "#fff" : COLORS.text,
                  border: `2px solid ${user.diet === d.id ? COLORS.primary : "#e0ede5"}`,
                }}
              >
                <span style={{ fontWeight: 700 }}>{d.label}</span>
                <span style={{ fontSize: 12, opacity: 0.8 }}>{d.desc}</span>
              </button>
            ))}
          </div>
        ),
        valid: user.diet,
      },
    ];

    const currentStep = steps[step];

    return (
      <div style={appShell}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primary})`,
          padding: "28px 24px 20px",
          color: "#fff",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>🌿 Aarogya AI</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>{step + 1} / {steps.length}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                height: 4, flex: 1, borderRadius: 4,
                background: i <= step ? COLORS.accent : "rgba(255,255,255,0.25)",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 20px", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>
            {currentStep.title}
          </div>
          <div style={{ fontSize: 14, color: COLORS.textLight, marginBottom: 24 }}>
            {currentStep.subtitle}
          </div>
          {currentStep.content}
        </div>

        <div style={{ padding: "16px 20px 24px" }}>
          <button
            onClick={() => step < steps.length - 1 ? setStep(step + 1) : handleOnboardingComplete()}
            disabled={!currentStep.valid}
            style={{
              width: "100%", padding: "16px", borderRadius: 14, border: "none",
              background: currentStep.valid
                ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`
                : "#ccc",
              color: "#fff", fontSize: 16, fontWeight: 700, cursor: currentStep.valid ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            {step < steps.length - 1 ? "Aage Badhein →" : "Shuru Karein! 🚀"}
          </button>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                width: "100%", marginTop: 10, padding: "12px",
                background: "transparent", border: "none", color: COLORS.textLight,
                fontSize: 14, cursor: "pointer",
              }}
            >
              ← Wapas Jaayein
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── MAIN APP ──────────────────────────────────────────────────────
  const userGoal = GOALS.find((g) => g.id === user.goal);

  const HomeTab = () => (
    <div style={{ padding: "0 0 20px" }}>
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primary})`,
        padding: "28px 20px 36px",
        borderRadius: "0 0 28px 28px",
        color: "#fff",
      }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Namaste 🙏</div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>{user.name}!</div>
        <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
          Aaj ka din swasth banaaiye ✨
        </div>
        <div style={{
          display: "flex", gap: 10, marginTop: 16,
          background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "12px 14px",
        }}>
          {[
            { label: "Vajan", value: `${user.weight} kg` },
            { label: "Lambai", value: `${user.height} cm` },
            { label: "Lakshya", value: userGoal?.icon },
          ].map((stat) => (
            <div key={stat.label} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        <div style={{
          background: COLORS.accent, borderRadius: 16, padding: "16px 18px",
          marginBottom: 20, display: "flex", alignItems: "center", gap: 12,
          cursor: "pointer",
        }} onClick={() => setActiveTab("chat")}>
          <div style={{ fontSize: 36 }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, color: COLORS.primaryDark, fontSize: 15 }}>
              Aarogya se baat karein
            </div>
            <div style={{ fontSize: 12, color: COLORS.primary }}>
              Personalised advice abhi paayein →
            </div>
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
          ⚡ Quick Actions
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { icon: "🥗", title: "Diet Plan", sub: "7-din ka plan", action: () => { setActiveTab("chat"); setTimeout(() => sendMessage("Mujhe 7 din ka diet plan do"), 500); } },
            { icon: "💧", title: "Paani Tracker", sub: "Aaj: 4/8 glass", action: () => {} },
            { icon: "📊", title: "Progress", sub: "Track karein", action: () => setActiveTab("plans") },
            { icon: "🧘", title: "Yoga Tips", sub: "Beginner tips", action: () => { setActiveTab("chat"); setTimeout(() => sendMessage("Mujhe beginner yoga tips do"), 500); } },
          ].map((item) => (
            <button
              key={item.title}
              onClick={item.action}
              style={{
                background: "#fff", border: "1.5px solid #e0ede5", borderRadius: 14,
                padding: "14px 12px", textAlign: "left", cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,100,50,0.06)",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{item.title}</div>
              <div style={{ fontSize: 11, color: COLORS.textLight }}>{item.sub}</div>
            </button>
          ))}
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
          💡 Aaj ki Salaah
        </div>
        {[
          { tip: "Subah khali pet 1 glass garm paani piyein", icon: "🌅" },
          { tip: "Raat ka khaana sone se 2 ghante pehle khaayein", icon: "🌙" },
        ].map((t, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 12, padding: "12px 14px",
            marginBottom: 8, display: "flex", gap: 10, alignItems: "center",
            border: "1px solid #e8f5ee",
          }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 13, color: COLORS.text }}>{t.tip}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const ChatTab = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primary})`,
        padding: "20px 16px 14px", color: "#fff",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24,
        }}>🌿</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Aarogya</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>● Online — Health Coach AI</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", background: COLORS.bg }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 12,
          }}>
            {msg.role === "assistant" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginRight: 8, flexShrink: 0 }}>🌿</div>
            )}
            <div style={{ maxWidth: "75%" }}>
              <div style={{
                padding: "10px 14px", borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                background: msg.role === "user" ? COLORS.primary : "#fff",
                color: msg.role === "user" ? "#fff" : COLORS.text,
                fontSize: 14, lineHeight: 1.5,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}>
                {msg.content}
              </div>
              <div style={{ fontSize: 10, color: COLORS.textLight, marginTop: 3, textAlign: msg.role === "user" ? "right" : "left" }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌿</div>
            <div style={{ background: "#fff", padding: "10px 14px", borderRadius: "4px 18px 18px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.primaryLight, animation: `bounce 0.8s ${i * 0.15}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: "8px 12px", background: "#fff", borderTop: "1px solid #e8f5ee" }}>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8 }}>
          {QUICK_REPLIES.map((r) => (
            <button
              key={r}
              onClick={() => sendMessage(r)}
              style={{
                whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 20,
                border: `1.5px solid ${COLORS.primary}`, background: "transparent",
                color: COLORS.primary, fontSize: 12, cursor: "pointer", fontWeight: 500,
              }}
            >
              {r}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Kuch poochna hai? Yahan likhein..."
            style={{
              flex: 1, padding: "12px 14px", borderRadius: 24,
              border: `1.5px solid #d0e8da`, outline: "none",
              fontSize: 14, background: COLORS.bg,
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              width: 44, height: 44, borderRadius: "50%", border: "none",
              background: input.trim() ? COLORS.primary : "#ccc",
              color: "#fff", fontSize: 20, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );

  const PlansTab = () => (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, marginBottom: 4 }}>
        📋 Aapke Plans
      </div>
      <div style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 20 }}>
        AI se generate hue aapke diet plans
      </div>
      {plans.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          background: "#fff", borderRadius: 16, border: "1.5px dashed #c5ddd0",
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🥗</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>Abhi koi plan nahi hai</div>
          <div style={{ fontSize: 13, color: COLORS.textLight, marginTop: 6 }}>
            Chat mein "Diet plan chahiye" likhein
          </div>
          <button
            onClick={() => { setActiveTab("chat"); setTimeout(() => sendMessage("Mujhe 7 din ka personalised diet plan do"), 500); }}
            style={{
              marginTop: 16, padding: "12px 24px", borderRadius: 12, border: "none",
              background: COLORS.primary, color: "#fff", fontWeight: 700, cursor: "pointer",
            }}
          >
            Plan Banaaiye 🚀
          </button>
        </div>
      ) : (
        plans.map((p) => (
          <div key={p.id} style={{
            background: "#fff", borderRadius: 16, padding: "16px",
            marginBottom: 14, border: "1px solid #e0ede5",
            boxShadow: "0 2px 10px rgba(0,100,50,0.06)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, color: COLORS.text, fontSize: 15 }}>{p.title}</div>
              <div style={{
                background: COLORS.bg, borderRadius: 8, padding: "3px 8px",
                fontSize: 11, color: COLORS.primary,
              }}>{p.date}</div>
            </div>
            <div style={{ fontSize: 13, color: COLORS.textLight, lineHeight: 1.6 }}>
              {p.content.substring(0, 200)}...
            </div>
          </div>
        ))
      )}
    </div>
  );

  const ProfileTab = () => (
    <div style={{ padding: "0 0 20px" }}>
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primary})`,
        padding: "32px 20px 40px", textAlign: "center", color: "#fff",
        borderRadius: "0 0 28px 28px",
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: COLORS.accent,
          margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 38,
        }}>
          {user.diet === "veg" ? "🥦" : user.diet === "vegan" ? "🌱" : "🍗"}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{user.name}</div>
        <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
          {userGoal?.icon} {userGoal?.label}
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
          📊 Aapki Details
        </div>
        <div style={{
          background: "#fff", borderRadius: 16, overflow: "hidden",
          border: "1px solid #e0ede5",
        }}>
          {[
            { label: "Aayu", value: `${user.age} saal`, icon: "🎂" },
            { label: "Vajan", value: `${user.weight} kg`, icon: "⚖️" },
            { label: "Lambai", value: `${user.height} cm`, icon: "📏" },
            { label: "Aahar", value: user.diet === "veg" ? "Vegetarian" : user.diet === "vegan" ? "Vegan" : "Non-Vegetarian", icon: "🥗" },
            { label: "Lakshya", value: userGoal?.label, icon: userGoal?.icon },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", padding: "14px 16px",
              borderBottom: i < arr.length - 1 ? "1px solid #f0f7f2" : "none",
            }}>
              <span style={{ fontSize: 20, marginRight: 12 }}>{item.icon}</span>
              <span style={{ flex: 1, color: COLORS.textLight, fontSize: 14 }}>{item.label}</span>
              <span style={{ fontWeight: 600, color: COLORS.text, fontSize: 14 }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: "20px 0 12px" }}>
          📱 Social & Support
        </div>
        {[
          { icon: "📸", label: "@aarogya.health", sub: "Instagram" },
          { icon: "💬", label: "Aarogya Support", sub: "WhatsApp" },
          { icon: "🌐", label: "aarogyaai.in", sub: "Website" },
        ].map((s) => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 12, padding: "12px 16px", marginBottom: 8,
            display: "flex", alignItems: "center", gap: 12,
            border: "1px solid #e8f5ee", cursor: "pointer",
          }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <div>
              <div style={{ fontWeight: 600, color: COLORS.text, fontSize: 14 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: COLORS.textLight }}>{s.sub}</div>
            </div>
            <span style={{ marginLeft: "auto", color: COLORS.textLight }}>›</span>
          </div>
        ))}

        <button
          onClick={() => { setScreen("onboarding"); setStep(0); setMessages([]); setPlans([]); }}
          style={{
            width: "100%", marginTop: 16, padding: "14px", borderRadius: 12,
            border: `1.5px solid ${COLORS.danger}`, background: "transparent",
            color: COLORS.danger, fontWeight: 600, cursor: "pointer", fontSize: 14,
          }}
        >
          🔄 Naya Account Banaaiye
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "chat", icon: "💬", label: "Coach" },
    { id: "plans", icon: "📋", label: "Plans" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div style={appShell}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "home" && <HomeTab />}
        {activeTab === "chat" && <ChatTab />}
        {activeTab === "plans" && <PlansTab />}
        {activeTab === "profile" && <ProfileTab />}
      </div>

      <div style={{
        display: "flex", background: "#fff", borderTop: "1px solid #e8f5ee",
        padding: "8px 0 10px",
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, border: "none", background: "transparent",
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 2, cursor: "pointer", padding: "4px 0",
              color: activeTab === tab.id ? COLORS.primary : COLORS.textLight,
            }}
          >
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: activeTab === tab.id ? 700 : 400 }}>{tab.label}</span>
            {activeTab === tab.id && (
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.primary }} />
            )}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-5px);opacity:1} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

const appShell = {
  height: "100vh", display: "flex", flexDirection: "column",
  background: "#f0f7f2", fontFamily: "'Segoe UI', system-ui, sans-serif",
  maxWidth: 430, margin: "0 auto", position: "relative",
  boxShadow: "0 0 40px rgba(0,100,50,0.12)",
};

const inputStyle = {
  width: "100%", padding: "14px 16px", borderRadius: 12,
  border: "1.5px solid #d0e8da", outline: "none",
  fontSize: 15, background: "#fff", color: "#1a2e22",
};

const goalBtnStyle = {
  display: "flex", alignItems: "center", gap: 12,
  padding: "14px 16px", borderRadius: 12, cursor: "pointer",
  transition: "all 0.2s", textAlign: "left", fontSize: 14,
};
