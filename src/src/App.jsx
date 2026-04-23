import { useState } from "react";

const PLANS = {
  free:     { name: "Gratuit",  limit: 3,        price: 0  },
  pro:      { name: "Pro",      limit: Infinity,  price: 9  },
  business: { name: "Business", limit: Infinity,  price: 29 },
};

const TEMPLATES = [
  { id: "linkedin", label: "📌 Post LinkedIn",   icon: "💼", description: "Engage ta communauté pro" },
  { id: "blog",     label: "📝 Article de blog",  icon: "✍️", description: "SEO & storytelling"       },
  { id: "email",    label: "📧 Email marketing",  icon: "📨", description: "Convertis tes leads"       },
  { id: "youtube",  label: "🎬 Script vidéo",     icon: "🎥", description: "YouTube & Reels"           },
  { id: "tweet",    label: "🐦 Thread Twitter/X", icon: "⚡", description: "Viralité maximale"         },
  { id: "ads",      label: "💰 Pub Facebook/IG",  icon: "🎯", description: "ROI garanti"               },
];

const TONES = ["Professionnel", "Inspirant", "Humoristique", "Urgent", "Éducatif", "Storytelling"];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a26;
    --border: rgba(255,255,255,0.07);
    --accent: #7c6dfa;
    --accent2: #fa6d9a;
    --accent3: #6dfacc;
    --text: #f0f0f8;
    --muted: rgba(240,240,248,0.45);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; overflow-x: hidden; }

  .app { min-height: 100vh; display: flex; flex-direction: column; position: relative; }

  .bg-mesh { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .bg-mesh::before {
    content: ''; position: absolute; width: 800px; height: 800px;
    background: radial-gradient(circle, rgba(124,109,250,0.12) 0%, transparent 70%);
    top: -200px; left: -200px; animation: drift1 12s ease-in-out infinite alternate;
  }
  .bg-mesh::after {
    content: ''; position: absolute; width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(250,109,154,0.10) 0%, transparent 70%);
    bottom: -100px; right: -100px; animation: drift2 15s ease-in-out infinite alternate;
  }
  @keyframes drift1 { to { transform: translate(80px, 60px); } }
  @keyframes drift2 { to { transform: translate(-60px, -80px); } }

  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 40px; border-bottom: 1px solid var(--border);
    backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 100;
    background: rgba(10,10,15,0.8);
  }
  .logo {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .logo span {
    background: linear-gradient(135deg, var(--accent3), #4dffd4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .plan-badge { display: flex; align-items: center; gap: 10px; }
  .badge { padding: 5px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
  .badge-free     { background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }
  .badge-pro      { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff; }
  .badge-business { background: linear-gradient(135deg, #facc6d, var(--accent3)); color: #111; }
  .btn-upgrade {
    padding: 8px 20px; border-radius: 8px; border: 1px solid var(--accent);
    background: transparent; color: var(--accent); font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  }
  .btn-upgrade:hover { background: var(--accent); color: #fff; }

  .hero { text-align: center; padding: 60px 40px 40px; position: relative; z-index: 1; }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 6px; padding: 5px 16px;
    border-radius: 20px; border: 1px solid rgba(124,109,250,0.3);
    background: rgba(124,109,250,0.08); font-size: 0.78rem; color: var(--accent);
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 24px;
  }
  .hero-eyebrow::before { content: '◆'; font-size: 0.5rem; }
  .hero h1 {
    font-family: 'Syne', sans-serif; font-size: clamp(2.2rem, 5vw, 3.8rem);
    font-weight: 800; line-height: 1.05; letter-spacing: -0.04em; margin-bottom: 16px;
  }
  .hero h1 .gradient {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 50%, var(--accent3) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero p { color: var(--muted); font-size: 1.05rem; max-width: 500px; margin: 0 auto; line-height: 1.6; }

  .usage-bar-wrap { max-width: 500px; margin: 20px auto 0; }
  .usage-label { display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--muted); margin-bottom: 6px; }
  .usage-bar { height: 4px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
  .usage-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 0.5s cubic-bezier(.4,0,.2,1); }

  .main { flex: 1; display: flex; gap: 24px; padding: 32px 40px; max-width: 1300px; margin: 0 auto; width: 100%; position: relative; z-index: 1; }
  .panel-left { flex: 0 0 340px; display: flex; flex-direction: column; gap: 20px; }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: border-color 0.2s; }
  .card:hover { border-color: rgba(124,109,250,0.2); }
  .card-title { font-family: 'Syne', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }

  .templates-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .template-btn {
    padding: 12px 10px; border-radius: 10px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--text); cursor: pointer;
    text-align: left; transition: all 0.18s; display: flex; flex-direction: column; gap: 4px;
  }
  .template-btn:hover { border-color: var(--accent); background: rgba(124,109,250,0.08); }
  .template-btn.active { border-color: var(--accent); background: rgba(124,109,250,0.15); }
  .template-icon { font-size: 1.2rem; }
  .template-name { font-size: 0.78rem; font-weight: 500; line-height: 1.2; }
  .template-desc { font-size: 0.68rem; color: var(--muted); }

  .tones-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
  .tone-btn {
    padding: 5px 12px; border-radius: 20px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--muted); font-size: 0.78rem;
    cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
  }
  .tone-btn:hover { border-color: var(--accent2); color: var(--text); }
  .tone-btn.active { border-color: var(--accent2); background: rgba(250,109,154,0.15); color: var(--accent2); }

  .topic-input {
    width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--text); font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; resize: vertical; min-height: 90px; outline: none; transition: border-color 0.2s;
  }
  .topic-input:focus { border-color: var(--accent); }
  .topic-input::placeholder { color: var(--muted); }

  .btn-generate {
    width: 100%; padding: 14px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff; font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
    cursor: pointer; position: relative; overflow: hidden; transition: opacity 0.2s, transform 0.15s;
  }
  .btn-generate:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
  .btn-generate:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-generate .shimmer {
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
    animation: shimmer 2s infinite;
  }
  @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }

  .panel-right { flex: 1; display: flex; flex-direction: column; gap: 16px; }
  .output-card { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; min-height: 500px; }
  .output-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .output-title { font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .output-actions { display: flex; gap: 8px; }
  .btn-action {
    padding: 5px 14px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--muted); font-size: 0.78rem;
    cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
  }
  .btn-action:hover:not(:disabled) { border-color: var(--accent3); color: var(--accent3); }
  .btn-action:disabled { opacity: 0.4; cursor: not-allowed; }
  .output-body { flex: 1; padding: 28px; overflow-y: auto; }

  .placeholder-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--muted); }
  .placeholder-icon { font-size: 3rem; opacity: 0.3; animation: float 3s ease-in-out infinite; }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

  .loading-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
  .loading-ring { width: 48px; height: 48px; border: 3px solid var(--border); border-top-color: var(--accent); border-right-color: var(--accent2); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { color: var(--muted); font-size: 0.9rem; }
  .loading-dots span { animation: blink 1.2s ease-in-out infinite; opacity: 0; }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%,80%,100% { opacity: 0; } 40% { opacity: 1; } }

  .result-text { font-size: 0.95rem; line-height: 1.75; color: var(--text); white-space: pre-wrap; animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .history-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 16px 20px; max-height: 180px; overflow-y: auto; }
  .history-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border); cursor: pointer; }
  .history-item:last-child { border-bottom: none; }
  .history-item:hover .history-snippet { color: var(--accent); }
  .history-tag { font-size: 0.68rem; padding: 2px 8px; border-radius: 6px; background: var(--surface2); color: var(--muted); white-space: nowrap; }
  .history-snippet { font-size: 0.82rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.15s; }

  .stats-bar { display: flex; gap: 16px; padding: 16px 40px; border-top: 1px solid var(--border); position: relative; z-index: 1; }
  .stat { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--muted); }
  .stat-dot { width: 6px; height: 6px; border-radius: 50%; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease; }
  .modal { background: var(--surface); border: 1px solid rgba(124,109,250,0.3); border-radius: 24px; padding: 40px; max-width: 620px; width: 90%; position: relative; box-shadow: 0 0 80px rgba(124,109,250,0.2); }
  .modal h2 { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 8px; }
  .modal > p { color: var(--muted); margin-bottom: 28px; font-size: 0.9rem; }

  .email-input {
    width: 100%; padding: 11px 16px; border-radius: 10px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--text); font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; outline: none; margin-bottom: 20px; transition: border-color 0.2s;
  }
  .email-input:focus { border-color: var(--accent); }
  .email-input::placeholder { color: var(--muted); }

  .plans-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
  .plan-card { padding: 20px; border-radius: 14px; border: 1px solid var(--border); background: var(--surface2); cursor: pointer; transition: all 0.2s; position: relative; }
  .plan-card:hover { border-color: var(--accent); }
  .plan-card.recommended { border-color: var(--accent); background: rgba(124,109,250,0.1); }
  .recommended-tag { position: absolute; top: -10px; right: 14px; padding: 2px 10px; background: var(--accent); border-radius: 10px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
  .plan-price { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; margin: 4px 0; }
  .plan-price span { font-size: 0.9rem; font-weight: 400; color: var(--muted); }
  .plan-features { font-size: 0.8rem; color: var(--muted); line-height: 1.7; }
  .btn-close { position: absolute; top: 16px; right: 16px; background: none; border: none; color: var(--muted); font-size: 1.2rem; cursor: pointer; padding: 8px; border-radius: 8px; }
  .btn-close:hover { color: var(--text); background: var(--surface2); }
  .btn-select-plan { width: 100%; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; cursor: pointer; margin-top: 12px; transition: opacity 0.2s; }
  .btn-select-plan:hover:not(:disabled) { opacity: 0.88; }
  .btn-select-plan:disabled { opacity: 0.5; cursor: not-allowed; }

  .toast { position: fixed; bottom: 24px; right: 24px; padding: 10px 18px; border-radius: 10px; background: var(--surface); border: 1px solid var(--accent3); color: var(--accent3); font-size: 0.85rem; z-index: 2000; animation: slideUp 0.3s ease; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  @media (max-width: 900px) {
    .main { flex-direction: column; padding: 20px; }
    .panel-left { flex: none; }
    .header { padding: 16px 20px; }
    .hero { padding: 40px 20px 24px; }
    .stats-bar { padding: 12px 20px; flex-wrap: wrap; }
    .plans-grid { grid-template-columns: 1fr; }
  }
`;

export default function App() {
  const [plan, setPlan]                   = useState("free");
  const [usageCount, setUsageCount]       = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("linkedin");
  const [selectedTone, setSelectedTone]   = useState("Professionnel");
  const [topic, setTopic]                 = useState("");
  const [result, setResult]               = useState("");
  const [loading, setLoading]             = useState(false);
  const [showModal, setShowModal]         = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState("");
  const [email, setEmail]                 = useState("");
  const [history, setHistory]             = useState([]);
  const [toast, setToast]                 = useState("");
  const [copied, setCopied]               = useState(false);

  const isUnlimited = PLANS[plan].limit === Infinity;
  const limit       = PLANS[plan].limit;
  const remaining   = isUnlimited ? Infinity : Math.max(0, limit - usageCount);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ✅ Appel au backend sécurisé (pas directement à Claude)
  const generate = async () => {
    if (!topic.trim()) return showToast("⚠️ Entre un sujet !");
    if (!isUnlimited && remaining === 0) { setShowModal(true); return; }

    setLoading(true);
    setResult("");

    const tmpl = TEMPLATES.find(t => t.id === selectedTemplate);
    const prompt = `Tu es un expert en copywriting et marketing de contenu.
Génère un ${tmpl.label} percutant sur le sujet suivant : "${topic}".
Ton/style : ${selectedTone}.
Le contenu doit être immédiatement utilisable, accrocheur, et optimisé pour l'engagement.
Ajoute des emojis pertinents si approprié. Ne donne pas d'explication, seulement le contenu final prêt à publier.`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, plan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");

      setResult(data.text);
      setUsageCount(c => c + 1);
      setHistory(h => [{ template: tmpl.label, topic, text: data.text, id: Date.now() }, ...h].slice(0, 10));
    } catch (e) {
      setResult(`❌ ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Redirige vers Stripe Checkout
  const handleUpgrade = async (selectedPlan) => {
    if (!email.trim()) return showToast("⚠️ Entre ton email pour continuer");
    setCheckoutLoading(selectedPlan);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // → Redirige vers Stripe
      } else {
        showToast("❌ Erreur Stripe : " + (data.error || "inconnue"));
      }
    } catch (e) {
      showToast("❌ Erreur réseau");
    } finally {
      setCheckoutLoading("");
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      showToast("✅ Copié dans le presse-papier !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("❌ Impossible de copier. Sélectionne le texte manuellement.");
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="bg-mesh" />

        <header className="header">
          <div className="logo">Content<span>AI</span></div>
          <div className="plan-badge">
            <span className={`badge badge-${plan}`}>{PLANS[plan].name}</span>
            {plan === "free" && (
              <button className="btn-upgrade" onClick={() => setShowModal(true)}>✦ Passer Pro</button>
            )}
          </div>
        </header>

        <div className="hero">
          <div className="hero-eyebrow">Propulsé par Claude AI</div>
          <h1>Génère du contenu<br /><span className="gradient">qui convertit</span></h1>
          <p>Posts LinkedIn, blogs, emails, scripts vidéo — en quelques secondes.</p>
          {plan === "free" && (
            <div className="usage-bar-wrap">
              <div className="usage-label">
                <span>Générations utilisées</span>
                <span>{usageCount} / {limit}</span>
              </div>
              <div className="usage-bar">
                <div className="usage-fill" style={{ width: `${Math.min((usageCount / limit) * 100, 100)}%` }} />
              </div>
            </div>
          )}
        </div>

        <main className="main">
          <div className="panel-left">
            <div clas
