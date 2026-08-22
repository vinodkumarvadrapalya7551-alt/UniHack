import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

/* ── Early Access Modal ─────────────────────────────────── */
function EarlyAccessModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", place: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.send(
        "service_unihack",
        "template_unihack",
        {
          from_name: form.name,
          place: form.place,
          reply_to: form.email,
          phone: form.phone,
          to_email: "vinodkumarvadrapalya7551@gmail.com",
        },
        "YOUR_EMAILJS_PUBLIC_KEY"
      );
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative glass rounded-3xl p-8 w-full max-w-md glow-blue"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold gradient-text mb-2">Request Sent!</h3>
            <p className="text-slate-400 text-sm">
              We&apos;ll reach out to you at <span className="text-sky-400">{form.email}</span> shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
            >
              Close
            </button>
          </motion.div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 glass-bright px-4 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="mono text-xs text-sky-400 tracking-widest uppercase">Early Access</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">Request Early Access</h3>
              <p className="text-slate-400 text-sm">Fill in your details and we&apos;ll get back to you.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {([
                { name: "name",  label: "Full Name",    placeholder: "John Doe",          type: "text" },
                { name: "place", label: "State / Place", placeholder: "e.g. Karnataka",   type: "text" },
                { name: "email", label: "Email Address", placeholder: "you@company.com",  type: "email" },
                { name: "phone", label: "Phone Number",  placeholder: "+91 98765 43210",  type: "tel" },
              ] as { name: keyof typeof form; label: string; placeholder: string; type: string }[]).map((f) => (
                <div key={f.name}>
                  <label className="mono text-xs text-slate-500 tracking-wider block mb-1.5">{f.label}</label>
                  <input
                    required
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    className="w-full bg-slate-900/60 border border-sky-900/40 focus:border-sky-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
                  />
                </div>
              ))}

              {status === "error" && (
                <p className="mono text-xs text-red-400">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
              >
                {status === "sending" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : "Submit Request"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

function ScaleCounter({ inView }: { inView: boolean }) {
  const [count, setCount] = useState(1);
  const targets = [1, 100, 10000, 1000000];
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let currentPhase = 0;
    const advance = () => {
      if (currentPhase >= targets.length - 1) return;
      currentPhase++;
      setPhase(currentPhase);
      const target = targets[currentPhase];
      const prev = targets[currentPhase - 1];
      const steps = 40;
      let i = 0;
      const iv = setInterval(() => {
        i++;
        const val = Math.round(prev + (target - prev) * (i / steps));
        setCount(val);
        if (i >= steps) { clearInterval(iv); setTimeout(advance, 600); }
      }, 20);
    };
    const t = setTimeout(advance, 400);
    return () => clearTimeout(t);
  }, [inView]);

  const formatCount = (n: number) => {
    if (n >= 1000000) return "1,000,000+";
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toLocaleString();
  };

  return (
    <div className="glass-bright rounded-3xl p-12 text-center glow-blue relative overflow-hidden">
      <div className="animate-shimmer absolute inset-0" />
      <div className="relative z-10">
        <div className="mono text-xs text-sky-400 tracking-widest mb-4">PRODUCTS PROCESSED</div>
        <div className="text-7xl lg:text-9xl font-bold gradient-text mb-4 transition-all duration-200">
          {formatCount(count)}
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {targets.map((_, i) => (
            <div key={i} className="h-1 rounded-full transition-all duration-500" style={{
              width: i <= phase ? "32px" : "8px",
              background: i <= phase ? "#0ea5e9" : "rgba(255,255,255,0.1)",
            }} />
          ))}
        </div>
        <div className="text-slate-400 text-lg">products enriched, validated, and published</div>

        {/* Processing nodes visualization */}
        <div className="mt-8 flex justify-center flex-wrap gap-2">
          {Array.from({ length: Math.min(phase * 8 + 1, 24) }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="w-3 h-3 rounded-full node-pulse"
              style={{
                background: i % 3 === 0 ? "#0ea5e9" : i % 3 === 1 ? "#06b6d4" : "#818cf8",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const techStack = [
  {
    category: "Frontend",
    color: "#0ea5e9",
    items: ["React 18", "Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Backend",
    color: "#06b6d4",
    items: ["FastAPI", "Python 3.11", "Celery", "Redis Queue", "PostgreSQL"],
  },
  {
    category: "AI / ML",
    color: "#818cf8",
    items: ["GPT-4 Turbo", "Claude 3 Opus", "LangChain", "LlamaIndex", "Hugging Face"],
  },
  {
    category: "Data",
    color: "#4ade80",
    items: ["Neo4j Graph DB", "Pinecone Vector", "PostgreSQL", "ElasticSearch", "S3"],
  },
  {
    category: "Infrastructure",
    color: "#fbbf24",
    items: ["AWS EKS", "Kubernetes", "Docker", "Terraform", "CloudFront"],
  },
];

const metrics = [
  { label: "Products/Hour", val: "50,000+", icon: "⚡" },
  { label: "Avg Latency", val: "< 2.3s", icon: "⏱" },
  { label: "Uptime SLA", val: "99.99%", icon: "🛡" },
  { label: "API Calls/Day", val: "10M+", icon: "📡" },
];

export default function ScaleSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="relative py-32 overflow-hidden" id="scale" ref={ref}>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 100%, rgba(14,165,233,0.06) 0%, transparent 60%)"
      }} />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass-bright px-4 py-2 rounded-full mb-6">
            <span className="mono text-xs text-emerald-400 tracking-widest uppercase">Scale & Infrastructure</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            From One Product{" "}
            <span className="gradient-text">to Millions.</span>
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            UniHack scales from startup catalogs to enterprise-wide product intelligence
            without changing a single integration.
          </p>
        </motion.div>

        {/* Scale counter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-16"
        >
          <ScaleCounter inView={inView} />
        </motion.div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass rounded-2xl p-6 text-center hover:border-sky-500/30 transition-all group hover:scale-105"
            >
              <div className="text-2xl mb-2">{m.icon}</div>
              <div className="mono text-2xl font-bold gradient-text mb-1">{m.val}</div>
              <div className="text-xs text-slate-500">{m.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <div className="mono text-xs text-sky-400 tracking-wider mb-6 text-center">TECHNOLOGY STACK</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {techStack.map((cat, i) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.08 }}
                onMouseEnter={() => setHoveredCat(cat.category)}
                onMouseLeave={() => setHoveredCat(null)}
                className="glass rounded-2xl p-5 cursor-default transition-all duration-300"
                style={{
                  borderColor: hoveredCat === cat.category ? cat.color + "50" : "rgba(14,165,233,0.08)",
                  transform: hoveredCat === cat.category ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: hoveredCat === cat.category ? `0 8px 32px ${cat.color}20` : "none",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                  <div className="text-sm font-semibold" style={{ color: cat.color }}>{cat.category}</div>
                </div>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <div key={item} className="mono text-xs text-slate-400 py-1.5 px-2 rounded-lg bg-slate-900/50 border border-slate-800/50">
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.7 }}
          className="mt-20 text-center"
        >
          <div className="glass rounded-3xl p-12 max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Product Data?</h3>
            <p className="text-slate-400 mb-8">
              Join leading industrial distributors already using UniHack to power their product intelligence at scale.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setShowModal(true)}
                className="px-10 py-4 rounded-xl font-semibold text-white relative overflow-hidden group transition-all duration-300 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
              >
                <span className="relative z-10">Request Early Access</span>
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-10 py-4 rounded-xl font-semibold text-slate-300 glass hover:text-white transition-all"
              >
                Schedule a Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && <EarlyAccessModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </section>
  );
}
