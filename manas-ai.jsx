import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `आप "मानस AI" हैं — एक शास्त्र-प्रमाणित आध्यात्मिक सहायक।

आपका एकमात्र उद्देश्य है:
- सभी मंत्र, पूजा विधि, और स्तोत्र — शास्त्र-सम्मत और सटीक प्रदान करना
- हर मंत्र के साथ उसका स्रोत ग्रंथ बताना (जैसे: ऋग्वेद, अथर्ववेद, शिव पुराण, देवी भागवत, आगम शास्त्र आदि)
- उच्चारण संबंधी मार्गदर्शन देना
- पूजा की सम्पूर्ण विधि step-by-step देना

नियम:
1. केवल प्रामाणिक स्रोतों से मंत्र दें — अनिश्चित हों तो स्पष्ट कहें
2. हर मंत्र के साथ → [स्रोत: ग्रंथ का नाम] अवश्य लिखें
3. यदि किसी विधि में regional variation हो, तो उसे mention करें
4. आप गुरु नहीं, सहायक हैं — यह विनम्रता बनाए रखें
5. उत्तर Hindi और Sanskrit में दें, पर explanation सरल हिंदी में हो
6. Format इस प्रकार दें:
   - मंत्र: (देवनागरी में)
   - अर्थ: (सरल हिंदी में)
   - स्रोत: (ग्रंथ का नाम)
   - विधि: (यदि पूजा विधि पूछी हो)

यदि कोई गलत या अप्रामाणिक जानकारी मांगे — विनम्रता से सुधार करें।`;

const OM_SVG = () => (
  <svg viewBox="0 0 100 100" width="60" height="60" style={{filter: "drop-shadow(0 0 12px rgba(212,175,55,0.6))"}}>
    <text x="50" y="72" textAnchor="middle" fontSize="72" fill="#D4AF37" fontFamily="serif" opacity="0.95">ॐ</text>
  </svg>
);

const Lotus = () => (
  <div style={{display:"flex", justifyContent:"center", gap: 4, opacity: 0.4, marginBottom: 8}}>
    {["❋","✿","❋"].map((s,i)=>(
      <span key={i} style={{fontSize: 12, color: "#D4AF37"}}>{s}</span>
    ))}
  </div>
);

function TypingDots() {
  return (
    <div style={{display:"flex", gap:6, alignItems:"center", padding:"12px 16px"}}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:8, height:8, borderRadius:"50%", background:"#D4AF37",
          animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display:"flex", justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 20, animation: "fadeSlideIn 0.4s ease"
    }}>
      {!isUser && (
        <div style={{
          width:36, height:36, borderRadius:"50%",
          background:"linear-gradient(135deg, #2a1a00, #4a2e00)",
          border:"1.5px solid #D4AF37", display:"flex", alignItems:"center",
          justifyContent:"center", marginRight:10, flexShrink:0, marginTop:4,
          boxShadow:"0 0 10px rgba(212,175,55,0.3)"
        }}>
          <span style={{fontSize:16}}>ॐ</span>
        </div>
      )}
      <div style={{
        maxWidth:"78%",
        background: isUser
          ? "linear-gradient(135deg, #6b3a00, #4a2800)"
          : "linear-gradient(135deg, #1a0f00, #261500)",
        border: isUser ? "1px solid #8B5A00" : "1px solid #3d2800",
        borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
        padding:"14px 18px",
        boxShadow: isUser
          ? "0 2px 16px rgba(139,90,0,0.2)"
          : "0 2px 16px rgba(0,0,0,0.4)",
      }}>
        <div style={{
          color: isUser ? "#FFD580" : "#F5E6C0",
          fontSize: 14.5,
          lineHeight: 1.85,
          whiteSpace: "pre-wrap",
          fontFamily: "'Noto Serif Devanagari', 'Noto Serif', Georgia, serif",
          letterSpacing: 0.2,
        }}>
          {msg.content}
        </div>
        <div style={{
          fontSize:11, color: isUser ? "#A06020" : "#6b4f20",
          marginTop:6, textAlign:"right", fontFamily:"monospace"
        }}>
          {msg.time}
        </div>
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "गणेश पूजा की सम्पूर्ण विधि बताएं",
  "गायत्री मंत्र का स्रोत और अर्थ",
  "महामृत्युंजय मंत्र — शुद्ध रूप",
  "नवरात्रि में दुर्गा सप्तशती का पाठ कैसे करें",
  "शिवलिंग अभिषेक विधि",
  "सत्यनारायण पूजा की विधि",
];

export default function ManasAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getTime = () => new Date().toLocaleTimeString("hi-IN", {hour:"2-digit", minute:"2-digit"});

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setError(null);

    const userMsg = { role: "user", content: userText, time: getTime() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({
        role: m.role, content: m.content
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      const reply = data.content?.find(b => b.type === "text")?.text || "कोई उत्तर नहीं मिला।";
      setMessages(prev => [...prev, { role: "assistant", content: reply, time: getTime() }]);
    } catch (e) {
      setError("संपर्क में समस्या आई। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{
      minHeight:"100vh", background:"#0a0600",
      backgroundImage:`
        radial-gradient(ellipse at 20% 20%, rgba(80,40,0,0.3) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(60,30,0,0.25) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.025'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
      `,
      display:"flex", flexDirection:"column", alignItems:"center",
      fontFamily:"'Noto Serif Devanagari','Noto Serif',Georgia,serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;600;700&family=Noto+Serif:ital,wght@0,400;0,600;1,400&display=swap');
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#0a0600}
        ::-webkit-scrollbar-thumb{background:#4a2e00;border-radius:4px}
        textarea:focus{outline:none!important}
      `}</style>

      {/* Header */}
      <div style={{
        width:"100%", maxWidth:700,
        borderBottom:"1px solid rgba(212,175,55,0.2)",
        background:"linear-gradient(180deg, rgba(20,10,0,0.98) 0%, rgba(10,6,0,0.95) 100%)",
        backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:100,
        padding:"20px 24px 16px",
      }}>
        <div style={{display:"flex", alignItems:"center", gap:14}}>
          <OM_SVG />
          <div>
            <div style={{
              fontSize:26, fontWeight:700, letterSpacing:2,
              background:"linear-gradient(90deg, #D4AF37, #FFD580, #C8960C, #D4AF37)",
              backgroundSize:"200% auto",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              animation:"shimmer 4s linear infinite",
            }}>
              मानस AI
            </div>
            <div style={{
              fontSize:12, color:"#8B6914", letterSpacing:1.5,
              textTransform:"uppercase", marginTop:2
            }}>
              शास्त्र-प्रमाणित • मंत्र • पूजा विधि
            </div>
          </div>
          <div style={{marginLeft:"auto", textAlign:"right"}}>
            <div style={{
              fontSize:11, color:"#4a3010", border:"1px solid #3d2800",
              borderRadius:20, padding:"4px 12px", background:"rgba(30,15,0,0.8)"
            }}>
              🔱 सत्यम् शिवम् सुन्दरम्
            </div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{
        width:"100%", maxWidth:700, flex:1,
        padding:"24px 20px", minHeight:"calc(100vh - 200px)",
        paddingBottom: 160,
      }}>

        {messages.length === 0 && (
          <div style={{animation:"fadeSlideIn 0.6s ease"}}>
            {/* Welcome */}
            <div style={{textAlign:"center", padding:"32px 16px 40px"}}>
              <div style={{fontSize:56, marginBottom:8, animation:"glow 3s ease infinite"}}>🪔</div>
              <Lotus />
              <div style={{
                fontSize:20, color:"#D4AF37", fontWeight:600, marginBottom:8, letterSpacing:1
              }}>
                नमस्ते 🙏
              </div>
              <div style={{fontSize:14, color:"#6b4f20", lineHeight:1.8, maxWidth:420, margin:"0 auto"}}>
                मैं मानस AI हूँ — आपकी पूजा विधि और मंत्रों के लिए<br/>
                एक <span style={{color:"#D4AF37"}}>शास्त्र-प्रमाणित</span> सहायक।<br/>
                प्रत्येक मंत्र का <span style={{color:"#D4AF37"}}>स्रोत ग्रंथ</span> के साथ उत्तर मिलेगा।
              </div>
              <div style={{
                marginTop:20, padding:"10px 20px", display:"inline-block",
                border:"1px solid rgba(212,175,55,0.15)", borderRadius:8,
                fontSize:12, color:"#4a3010", background:"rgba(20,10,0,0.6)"
              }}>
                ॐ तत्सत् — यह केवल मार्गदर्शन है, अंतिम आस्था आपकी है।
              </div>
            </div>

            {/* Suggestions */}
            <div style={{marginBottom:8}}>
              <div style={{
                fontSize:12, color:"#4a3010", textAlign:"center",
                letterSpacing:1, textTransform:"uppercase", marginBottom:14
              }}>
                — आप पूछ सकते हैं —
              </div>
              <div style={{display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center"}}>
                {SUGGESTIONS.map((s,i) => (
                  <button key={i} onClick={() => sendMessage(s)} style={{
                    background:"linear-gradient(135deg, rgba(30,15,0,0.9), rgba(20,10,0,0.9))",
                    border:"1px solid rgba(212,175,55,0.25)",
                    borderRadius:20, padding:"8px 16px",
                    color:"#C8960C", fontSize:13, cursor:"pointer",
                    transition:"all 0.2s", fontFamily:"inherit",
                    boxShadow:"0 2px 8px rgba(0,0,0,0.3)",
                  }}
                  onMouseEnter={e=>{e.target.style.borderColor="#D4AF37";e.target.style.color="#FFD580";}}
                  onMouseLeave={e=>{e.target.style.borderColor="rgba(212,175,55,0.25)";e.target.style.color="#C8960C";}}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        {loading && (
          <div style={{display:"flex", justifyContent:"flex-start", marginBottom:16}}>
            <div style={{
              background:"linear-gradient(135deg,#1a0f00,#261500)",
              border:"1px solid #3d2800", borderRadius:"4px 18px 18px 18px",
            }}>
              <TypingDots />
            </div>
          </div>
        )}
        {error && (
          <div style={{
            textAlign:"center", color:"#c0392b", fontSize:13,
            padding:"10px", background:"rgba(192,57,43,0.1)",
            border:"1px solid rgba(192,57,43,0.3)", borderRadius:8, marginBottom:12
          }}>{error}</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{
        position:"fixed", bottom:0, width:"100%", maxWidth:700,
        background:"linear-gradient(0deg, rgba(10,6,0,1) 60%, transparent 100%)",
        padding:"16px 20px 24px",
      }}>
        <div style={{
          display:"flex", gap:10, alignItems:"flex-end",
          background:"linear-gradient(135deg, #1a0f00, #120a00)",
          border:"1.5px solid rgba(212,175,55,0.3)",
          borderRadius:16, padding:"10px 12px",
          boxShadow:"0 -2px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.05)",
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="मंत्र, पूजा विधि, स्तोत्र — कुछ भी पूछें..."
            rows={1}
            style={{
              flex:1, background:"transparent", border:"none", resize:"none",
              color:"#F5E6C0", fontSize:14.5, lineHeight:1.6,
              fontFamily:"'Noto Serif Devanagari','Noto Serif',Georgia,serif",
              maxHeight:120, overflowY:"auto",
              caretColor:"#D4AF37",
            }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
            width:42, height:42, borderRadius:"50%", border:"none",
            background: input.trim() && !loading
              ? "linear-gradient(135deg, #D4AF37, #8B6914)"
              : "rgba(212,175,55,0.1)",
            cursor: input.trim() && !loading ? "pointer" : "default",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.2s", flexShrink:0,
            boxShadow: input.trim() ? "0 0 16px rgba(212,175,55,0.4)" : "none",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke={input.trim() && !loading ? "#0a0600" : "#4a3010"} strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={input.trim() && !loading ? "#0a0600" : "#4a3010"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div style={{
          textAlign:"center", fontSize:11, color:"#2a1a00",
          marginTop:8, letterSpacing:0.5
        }}>
          मानस AI • शास्त्र-सम्मत उत्तर • Enter से भेजें
        </div>
      </div>
    </div>
  );
}
