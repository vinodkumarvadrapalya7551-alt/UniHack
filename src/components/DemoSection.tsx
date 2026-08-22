import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const PROCESSING = [
  { label: "Identifying Product", detail: "Matching HP-450 across 47 registered data sources...", icon: "🎯", ms: 1100, pct: 25 },
  { label: "Retrieving Sources", detail: "Querying vector DB — found 234 relevant context chunks...", icon: "📡", ms: 1300, pct: 50 },
  { label: "Enriching Attributes", detail: "LLM synthesizing 23 technical attributes from context...", icon: "✨", ms: 1500, pct: 75 },
  { label: "Validating Data", detail: "Cross-referencing 6 authoritative sources for conflicts...", icon: "🔒", ms: 900, pct: 100 },
];

const OUTPUT = {
  id: "HP-450", brand: "ABC Industries", category: "Industrial Hydraulic Pump",
  confidence: 96.4, sources: 6, attributes: 23,
  attrs: [
    { name: "Operating Pressure", value: "250 bar", conf: 98, src: 6, flag: null },
    { name: "Flow Rate", value: "45 L/min", conf: 92, src: 4, flag: null },
    { name: "Displacement", value: "28 cm³/rev", conf: 95, src: 5, flag: null },
    { name: "Power Rating", value: "18.5 kW", conf: 94, src: 5, flag: null },
    { name: "Max Speed", value: "1500 RPM", conf: 97, src: 6, flag: null },
    { name: "Weight", value: "12.4 kg", conf: 89, src: 3, flag: null },
    { name: "Max Pressure", value: "500 bar", conf: 72, src: 3, flag: "conflict" },
    { name: "Fluid Viscosity", value: "15–400 cSt", conf: 87, src: 3, flag: null },
  ],
  applications: ["Hydraulic Press Systems", "Construction Machinery", "Industrial Automation", "Marine Equipment"],
  sourceList: ["ABC Catalog 2024", "TechSpec DB", "IHS Markit", "Distributor A", "Distributor B", "OEM Portal"],
};

/* ── Log line component ────────────────────────────────── */
function LogLine({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="mono text-xs text-slate-500 py-0.5"
    >
      <span className="text-sky-700 mr-2">›</span>{text}
    </motion.div>
  );
}

export default function DemoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [step, setStep] = useState(-1);
  const [progress, setProgress] = useState(0);

  async function run() {
    setPhase("running");
    setStep(0);
    let cumMs = 0;
    for (let i = 0; i < PROCESSING.length; i++) {
      await new Promise<void>((r) => setTimeout(() => { setStep(i); r(); }, cumMs));
      cumMs += PROCESSING[i].ms;
      const targetPct = PROCESSING[i].pct;
      const prevPct = i === 0 ? 0 : PROCESSING[i - 1].pct;
      const duration = PROCESSING[i].ms;
      const startTime = Date.now();
      await new Promise<void>((r) => {
        const tick = () => {
          const elapsed = Date.now() - startTime;
          const t = Math.min(elapsed / duration, 1);
          setProgress(prevPct + (targetPct - prevPct) * t);
          if (t < 1) requestAnimationFrame(tick);
          else r();
        };
        requestAnimationFrame(tick);
      });
    }
    setPhase("done");
  }

  function reset() { setPhase("idle"); setStep(-1); setProgress(0); }

  return (
    <section className="relative py-32 overflow-hidden" id="demo" ref={ref}>
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 25% 50%, rgba(14,165,233,0.06) 0%, transparent 55%)"
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass-bright px-5 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="mono text-xs text-emerald-400 tracking-[0.2em] uppercase">Interactive Demo</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            See the Intelligence{" "}
            <span className="gradient-text">Pipeline Live.</span>
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Watch UniHack transform three sparse fields into a complete, validated product profile in real time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ── Left panel ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Input card */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-sky-900/20">
                <span className="mono text-xs text-sky-400 tracking-wider">INPUT PAYLOAD</span>
                <span className="mono text-xs text-slate-600">application/json</span>
              </div>
              <div className="p-6 font-mono text-sm space-y-2">
                <div className="text-slate-500">{"{"}</div>
                <div className="pl-4"><span className="text-violet-400">&quot;part_number&quot;</span><span className="text-slate-500">: </span><span className="text-emerald-400">&quot;HP-450&quot;</span><span className="text-slate-600">,</span></div>
                <div className="pl-4"><span className="text-violet-400">&quot;brand&quot;</span><span className="text-slate-500">: </span><span className="text-emerald-400">&quot;ABC Industries&quot;</span><span className="text-slate-600">,</span></div>
                <div className="pl-4"><span className="text-violet-400">&quot;category&quot;</span><span className="text-slate-500">: </span><span className="text-emerald-400">&quot;Industrial Hydraulic Pump&quot;</span></div>
                <div className="text-slate-500">{"}"}</div>
              </div>
            </div>

            {/* Pipeline steps */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-sky-900/20">
                <span className="mono text-xs text-sky-400 tracking-wider">PIPELINE EXECUTION</span>
                {phase === "running" && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    <span className="mono text-xs text-sky-400">Running</span>
                  </div>
                )}
                {phase === "done" && (
                  <span className="mono text-xs text-emerald-400">✓ Complete</span>
                )}
              </div>

              <div className="p-6 space-y-3">
                {PROCESSING.map((s, i) => {
                  const isDone = phase === "done" || (phase === "running" && i < step);
                  const isActive = phase === "running" && i === step;
                  const isPending = phase === "idle" || (phase === "running" && i > step);
                  return (
                    <div key={s.label} className={`flex items-start gap-4 p-3 rounded-xl transition-all duration-400 ${
                      isActive ? "glass-bright" : isDone ? "opacity-60" : "opacity-30"
                    }`}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: isActive ? "#0ea5e920" : isDone ? "#4ade8015" : "transparent",
                          border: `1px solid ${isActive ? "#0ea5e940" : isDone ? "#4ade8030" : "#ffffff10"}`,
                        }}>
                        {isDone ? (
                          <span className="text-emerald-400 text-sm">✓</span>
                        ) : isActive ? (
                          <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="text-slate-600 text-xs">{String(i + 1).padStart(2, "0")}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-200">{s.label}</div>
                        {isActive && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mono text-xs text-slate-500 mt-0.5 leading-relaxed">
                            {s.detail}
                          </motion.div>
                        )}
                        {isDone && <div className="mono text-xs text-emerald-600 mt-0.5">Completed</div>}
                      </div>
                      <div className="mono text-xs text-slate-700 shrink-0">{s.ms}ms</div>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              {phase !== "idle" && (
                <div className="px-6 pb-6">
                  <div className="flex justify-between mono text-xs text-slate-600 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="px-6 pb-6">
                {phase === "idle" && (
                  <button onClick={run}
                    className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/20"
                    style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}>
                    🚀 Run Intelligence Pipeline
                  </button>
                )}
                {phase === "done" && (
                  <button onClick={reset}
                    className="w-full py-4 rounded-xl font-semibold text-slate-400 glass hover:text-white transition-all duration-300">
                    ↺ Reset Demo
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Right panel ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass rounded-2xl flex flex-col items-center justify-center text-center py-24 gap-6">
                  <div className="w-20 h-20 rounded-full glass flex items-center justify-center opacity-30">
                    <span className="text-4xl">📊</span>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-2">Intelligence output will appear here</div>
                    <div className="mono text-xs text-slate-700">Awaiting pipeline execution...</div>
                  </div>
                </motion.div>
              )}

              {phase === "running" && (
                <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[500px] gap-6">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full border border-sky-900/40 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-t-sky-500 border-transparent animate-spin" />
                      <div className="absolute inset-3 rounded-full border border-t-violet-500 border-transparent animate-spin"
                        style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
                      <span className="text-4xl">🧠</span>
                    </div>
                    <div className="absolute inset-0 rounded-full animate-ping border border-sky-500/20" />
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold gradient-text mb-1">
                      {step >= 0 ? PROCESSING[step].label : "Initializing..."}
                    </div>
                    <div className="mono text-sm text-slate-500">
                      {step >= 0 ? PROCESSING[step].detail : ""}
                    </div>
                  </div>
                  {/* Activity log */}
                  <div className="w-full max-w-xs glass rounded-xl p-4 min-h-[80px]">
                    <div className="mono text-xs text-slate-700 mb-2">SYSTEM LOG</div>
                    {step >= 0 && [
                      `[${PROCESSING[step].id || "00"}] ${PROCESSING[step].label} — started`,
                      `worker-01 allocated · queue depth: ${Math.floor(Math.random() * 40 + 10)}`,
                      "embedding model v2.3 loaded",
                    ].map((l, i) => <LogLine key={`${step}-${i}`} text={l} delay={i * 0.15} />)}
                  </div>
                </motion.div>
              )}

              {phase === "done" && (
                <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl overflow-hidden glow-blue">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-sky-900/25">
                    <div>
                      <div className="mono text-xs text-sky-400 mb-1 tracking-wider">INTELLIGENCE REPORT</div>
                      <div className="font-bold">{OUTPUT.id} — {OUTPUT.brand}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="mono text-xs text-emerald-400">VERIFIED</span>
                      </div>
                      <div className="mono text-xs text-slate-500">{OUTPUT.sources} sources · {OUTPUT.attributes} attrs</div>
                    </div>
                  </div>

                  {/* Summary row */}
                  <div className="grid grid-cols-3 divide-x divide-sky-900/20 border-b border-sky-900/20">
                    {[
                      { label: "Avg Confidence", val: `${OUTPUT.confidence}%`, color: "#4ade80" },
                      { label: "Sources Used", val: String(OUTPUT.sources), color: "#0ea5e9" },
                      { label: "Attributes", val: String(OUTPUT.attributes), color: "#818cf8" },
                    ].map((m) => (
                      <div key={m.label} className="py-3 px-4 text-center">
                        <div className="mono text-lg font-bold" style={{ color: m.color }}>{m.val}</div>
                        <div className="mono text-xs text-slate-600 mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Attributes */}
                  <div className="p-5 space-y-2 max-h-64 overflow-y-auto">
                    {OUTPUT.attrs.map((a, i) => (
                      <motion.div key={a.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`flex items-center gap-3 py-1.5 px-3 rounded-lg ${a.flag === "conflict" ? "bg-amber-900/10 border border-amber-500/20" : ""}`}
                      >
                        <span className="mono text-xs text-slate-500 w-28 shrink-0">{a.name}</span>
                        <span className="text-sm text-slate-200 flex-1 font-medium">{a.value}</span>
                        {a.flag === "conflict" && (
                          <span className="mono text-[10px] text-amber-400 px-1.5 py-0.5 rounded bg-amber-900/30 border border-amber-500/20 shrink-0">⚠ conflict</span>
                        )}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="h-1 w-12 rounded-full bg-slate-800 overflow-hidden">
                            <motion.div className="h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${a.conf}%` }}
                              transition={{ delay: 0.4 + i * 0.06, duration: 0.5 }}
                              style={{ background: a.conf >= 95 ? "#4ade80" : a.conf >= 85 ? "#06b6d4" : "#fbbf24" }}
                            />
                          </div>
                          <span className="mono text-xs text-slate-500">{a.conf}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Applications */}
                  <div className="px-5 pb-3">
                    <div className="mono text-xs text-slate-600 mb-2 tracking-wider">APPLICATIONS</div>
                    <div className="flex flex-wrap gap-1.5">
                      {OUTPUT.applications.map((a) => (
                        <span key={a} className="text-xs px-3 py-1 rounded-full glass border border-sky-800/30 text-sky-300">{a}</span>
                      ))}
                    </div>
                  </div>

                  {/* Sources */}
                  <div className="px-5 pb-5">
                    <div className="mono text-xs text-slate-600 mb-2 tracking-wider">SOURCES</div>
                    <div className="flex flex-wrap gap-1">
                      {OUTPUT.sourceList.map((s) => (
                        <span key={s} className="mono text-xs px-2 py-0.5 rounded bg-slate-800/50 border border-slate-700/30 text-slate-500">{s}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
