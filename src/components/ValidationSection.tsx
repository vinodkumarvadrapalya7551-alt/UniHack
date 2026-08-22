import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ── Arc confidence meter ───────────────────────────────── */
function ArcMeter({ label, target, delay, color, unit = "%" }: {
  label: string; target: number; delay: number; color: string; unit?: string;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      let v = 0;
      const iv = setInterval(() => {
        v = Math.min(v + 1.5, target);
        setVal(Math.round(v));
        if (v >= target) clearInterval(iv);
      }, 18);
      return () => clearInterval(iv);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [inView, target, delay]);

  // Arc params (half-circle)
  const R = 44, CX = 60, CY = 64;
  const arcLen = Math.PI * R; // half circumference
  const offset = arcLen - (val / 100) * arcLen;
  const theta = Math.PI + (val / 100) * Math.PI;
  const nx = CX + R * Math.cos(theta);
  const ny = CY + R * Math.sin(theta);

  return (
    <div ref={ref} className="glass rounded-2xl p-5 flex flex-col items-center group hover:scale-105 transition-transform duration-300 cursor-default">
      <svg viewBox="0 0 120 80" className="w-full max-w-[140px] mb-2">
        {/* Track */}
        <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" strokeLinecap="round" />
        {/* Progress */}
        <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={arcLen} strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 5px ${color}90)`, transition: "stroke-dashoffset 0.05s linear" }} />
        {/* Glow dot */}
        <circle cx={nx} cy={ny} r="5" fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
        {/* Center value */}
        <text x={CX} y={CY - 4} textAnchor="middle" fontSize="18" fontWeight="700"
          fill="white" fontFamily="JetBrains Mono, monospace">{val}{unit}</text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)"
          fontFamily="JetBrains Mono, monospace">confidence</text>
      </svg>

      <div className="text-center">
        <div className="font-semibold text-sm text-slate-200 mb-1">{label}</div>
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
          <span className="mono text-xs text-slate-500">
            {target >= 95 ? "High Confidence" : target >= 85 ? "Good Confidence" : "Review Required"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Source conflict card ───────────────────────────────── */
function ConflictCard({ inView }: { inView: boolean }) {
  const [revealed, setRevealed] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(t);
  }, [inView]);

  const sources = [
    { name: "ABC Official Catalog 2024", val: "500 bar", conf: 92, auth: "OEM", color: "#4ade80" },
    { name: "TechSpec Database v3.1", val: "450 bar", conf: 78, auth: "Aggregator", color: "#fbbf24" },
    { name: "Distributor Portal X", val: "480 bar", conf: 65, auth: "Distributor", color: "#f87171" },
  ];

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-semibold text-amber-400">Conflict Detected</span>
        </div>
        <span className="mono text-xs text-slate-600">attribute: maximum_pressure</span>
      </div>

      <div className="p-6">
        {/* Attribute label */}
        <div className="mb-5">
          <div className="text-sm text-slate-400 mb-1">Conflicting attribute</div>
          <div className="font-semibold text-slate-100">Maximum Operating Pressure</div>
        </div>

        {/* Source comparison */}
        <div className="space-y-3 mb-6">
          {sources.map((src, i) => (
            <AnimatePresence key={src.name}>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.25 }}
                  className="rounded-xl p-4 border"
                  style={{ borderColor: src.color + "30", background: src.color + "08" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-300">{src.name}</div>
                      <div className="mono text-xs text-slate-600 mt-0.5">{src.auth} source · {src.conf}% authority</div>
                    </div>
                    <div className="text-right">
                      <div className="mono text-xl font-bold" style={{ color: src.color }}>{src.val}</div>
                    </div>
                  </div>
                  <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${src.conf}%` }}
                      transition={{ delay: i * 0.25 + 0.3, duration: 0.6 }}
                      style={{ background: src.color }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Human review trigger */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="rounded-xl p-5 border border-amber-500/30 bg-amber-900/12"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-900/30 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <span className="text-lg">⚠️</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-amber-400 mb-1">Human Review Required</div>
                  <div className="text-sm text-slate-400 mb-3">
                    3 sources report different values (500 / 450 / 480 bar). Confidence: <span className="text-amber-400 mono">72%</span> — below threshold.
                    Routed to domain expert review queue.
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setReviewSent(true)}
                      disabled={reviewSent}
                      className="text-xs px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                      style={{
                        background: reviewSent ? "#4ade8020" : "#fbbf2420",
                        border: `1px solid ${reviewSent ? "#4ade8050" : "#fbbf2450"}`,
                        color: reviewSent ? "#4ade80" : "#fbbf24",
                      }}
                    >
                      {reviewSent ? "✓ Sent to Review Queue" : "Assign to Expert"}
                    </button>
                    <button className="text-xs px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white transition-colors">
                      Accept Source A (500 bar)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const TRUSTED = [
  { name: "Flow Rate", value: "45 L/min", conf: 98, srcs: ["ABC Catalog", "IHS Markit", "OEM Portal", "+3 more"] },
  { name: "Max Speed", value: "1500 RPM", conf: 97, srcs: ["ABC Catalog", "TechSpec DB"] },
  { name: "Power Rating", value: "18.5 kW", conf: 94, srcs: ["ABC Catalog", "Distributor A", "OEM Portal"] },
  { name: "Displacement", value: "28 cm³/rev", conf: 95, srcs: ["ABC Catalog", "IHS Markit"] },
];

export default function ValidationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-32 overflow-hidden" id="validation" ref={ref}>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 75% 40%, rgba(251,191,36,0.05) 0%, transparent 55%)"
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 glass-bright px-5 py-2 rounded-full mb-6">
            <span className="mono text-xs text-amber-400 tracking-[0.2em] uppercase">Trust Engine</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            AI Shouldn&apos;t Just Generate.
            <br />
            <span className="gradient-text">It Should Prove.</span>
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Every attribute gets a confidence score, a source citation, and automatic conflict detection —
            so you always know exactly what to trust.
          </p>
        </motion.div>

        {/* Arc meters */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
        >
          <ArcMeter label="Operating Pressure" target={98} delay={0.3} color="#4ade80" />
          <ArcMeter label="Flow Rate" target={92} delay={0.5} color="#06b6d4" />
          <ArcMeter label="Power Rating" target={94} delay={0.7} color="#4ade80" />
          <ArcMeter label="Max Pressure" target={72} delay={0.9} color="#fbbf24" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Trusted attributes */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 px-6 py-4 border-b border-emerald-900/20">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="font-semibold text-emerald-400">Trusted Attributes</span>
            </div>
            <div className="p-6 space-y-4">
              {TRUSTED.map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-emerald-900/08 border border-emerald-500/10 hover:border-emerald-500/25 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-slate-200 mb-1.5">{a.name}</div>
                    <div className="flex flex-wrap gap-1">
                      {a.srcs.map((s) => (
                        <span key={s} className="mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/30 text-emerald-600">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="mono text-lg font-bold text-emerald-400">{a.value}</div>
                    <div className="mono text-xs text-emerald-600">{a.conf}% conf</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Conflict detection */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <ConflictCard inView={inView} />
          </motion.div>
        </div>

        {/* Trust pillars */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: "📌", label: "Source Attribution", desc: "Every value traced to its origin document and page" },
            { icon: "⚡", label: "Conflict Detection", desc: "Automatic cross-source consistency validation" },
            { icon: "📊", label: "Confidence Scoring", desc: "Per-attribute trust ratings from 0–100%" },
            { icon: "👁", label: "Human-in-Loop", desc: "Domain expert review for edge cases and conflicts" },
          ].map((f) => (
            <div key={f.label}
              className="glass rounded-2xl p-5 text-center hover:border-sky-500/30 transition-all duration-300 group hover:scale-105 cursor-default">
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-semibold text-sm text-slate-200 mb-2">{f.label}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
