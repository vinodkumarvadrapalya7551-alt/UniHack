import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STEPS = [
  { id: "01", name: "Ingest", icon: "⬇", color: "#0ea5e9", tag: "Input Layer",
    desc: "Multi-source ingestion: PDFs, supplier portals, ERPs, web scrapers, and REST APIs feed into a unified data lake.",
    inputs: ["PDF Catalogs", "ERP APIs", "Supplier Portals", "Web Scraping"],
    outputs: ["Raw Records", "File Queue"] },
  { id: "02", name: "Extract", icon: "🔍", color: "#0ba5d9", tag: "NLP Parsing",
    desc: "Transformer-based NLP extracts structured attributes from unstructured text, tables, and scanned documents via OCR.",
    inputs: ["Raw Documents", "OCR Output"],
    outputs: ["Entity Candidates", "Attribute Pairs"] },
  { id: "03", name: "Identify", icon: "🎯", color: "#06b6d4", tag: "Entity Resolution",
    desc: "ML classifiers resolve part numbers and product identifiers across sources, deduplicating with 99.1% precision.",
    inputs: ["Entity Candidates", "Fuzzy Matches"],
    outputs: ["Unified Product ID", "Confidence"] },
  { id: "04", name: "Retrieve", icon: "📡", color: "#06c2d4", tag: "RAG Engine",
    desc: "Vector similarity search queries 400M+ indexed product embeddings to surface the most relevant context for enrichment.",
    inputs: ["Product ID", "Query Embedding"],
    outputs: ["Top-K Context", "Source Citations"] },
  { id: "05", name: "Enrich", icon: "✨", color: "#818cf8", tag: "AI Generation",
    desc: "LLM (GPT-4 / Claude 3) synthesizes missing specifications, technical descriptions, and application context from retrieved sources.",
    inputs: ["Sparse Record", "Retrieved Context"],
    outputs: ["Full Attribute Set", "Descriptions"] },
  { id: "06", name: "Validate", icon: "🔒", color: "#9b8afb", tag: "Conflict Engine",
    desc: "Rule-based and ML conflict detection flags inconsistencies across sources. Conflicting values are logged with source attribution.",
    inputs: ["Multi-Source Attrs", "Conflict Rules"],
    outputs: ["Validated Attrs", "Conflict Flags"] },
  { id: "07", name: "Score", icon: "📊", color: "#34d399", tag: "Trust Engine",
    desc: "Per-attribute confidence scoring (0–100%) based on source authority, agreement count, recency, and LLM certainty signals.",
    inputs: ["Attributes", "Source Metadata"],
    outputs: ["Confidence Scores", "Tier Labels"] },
  { id: "08", name: "Review", icon: "👁", color: "#fbbf24", tag: "Human-in-Loop",
    desc: "Low-confidence or conflicted attributes are routed to domain experts via a structured review queue with inline editing.",
    inputs: ["Flagged Attrs", "Review Queue"],
    outputs: ["Approved Values", "Feedback Signal"] },
  { id: "09", name: "Publish", icon: "🚀", color: "#4ade80", tag: "Output",
    desc: "Commerce-ready product intelligence delivered via REST API, real-time webhooks, Shopify/SAP/PIM connectors, or bulk CSV.",
    inputs: ["Validated Record", "Schema Map"],
    outputs: ["API Response", "Webhook Event", "Export File"] },
];

/* ── Flow particle along pipeline ──────────────────────── */
function FlowDot({ color, delay }: { color: string; delay: number }) {
  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
      style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      animate={{ left: ["0%", "100%"] }}
      transition={{ duration: 2.4, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

export default function PipelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative py-32 overflow-hidden" id="pipeline" ref={ref}>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 50%, rgba(129,140,248,0.05) 0%, transparent 65%)"
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
            <span className="mono text-xs text-violet-400 tracking-[0.2em] uppercase">9-Step AI Pipeline</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            One Intelligence Layer.{" "}
            <span className="gradient-text-warm">Every Product.</span>
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            From a single part number to a complete, multi-source verified product profile — in seconds.
          </p>
        </motion.div>

        {/* Pipeline strip */}
        <div className="relative mb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="flex items-stretch gap-0 rounded-2xl overflow-hidden border border-sky-900/20"
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scaleY: 0.6 }}
                animate={inView ? { opacity: 1, scaleY: 1 } : {}}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.5, type: "spring" }}
                className="flex-1 relative cursor-pointer group transition-all duration-300"
                style={{
                  background: active === i ? step.color + "18" : "rgba(8,16,36,0.7)",
                  borderRight: i < STEPS.length - 1 ? "1px solid rgba(14,165,233,0.1)" : "none",
                }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {/* Top accent */}
                <div className="h-0.5 w-full transition-all duration-300"
                  style={{ background: active === i ? step.color : "transparent" }} />

                {/* Content */}
                <div className="p-4 flex flex-col items-center text-center min-h-[120px] justify-center">
                  <div className="text-xl mb-2">{step.icon}</div>
                  <div className="mono text-[10px] font-bold mb-1" style={{ color: step.color }}>{step.id}</div>
                  <div className="text-xs font-semibold text-slate-300">{step.name}</div>
                  <div className="mono text-[9px] text-slate-600 mt-1 leading-tight">{step.tag}</div>
                </div>

                {/* Active indicator */}
                {active === i && (
                  <motion.div
                    layoutId="step-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: step.color }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Flow dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
            <FlowDot color="#0ea5e9" delay={0} />
            <FlowDot color="#818cf8" delay={0.8} />
            <FlowDot color="#4ade80" delay={1.6} />
          </div>
        </div>

        {/* Flow labels */}
        <div className="flex justify-between mb-12 px-1">
          <span className="mono text-xs text-sky-500">← INPUT: Part Number + Brand</span>
          <span className="mono text-xs text-emerald-500">OUTPUT: Rich Product Intelligence →</span>
        </div>

        {/* Detail panel */}
        <div className="min-h-[220px]">
          {active !== null ? (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="glass rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8"
              style={{ borderColor: STEPS[active].color + "30" }}
            >
              <div className="md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: STEPS[active].color + "15", border: `1px solid ${STEPS[active].color}30` }}>
                    {STEPS[active].icon}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{STEPS[active].name}</div>
                    <div className="mono text-xs" style={{ color: STEPS[active].color }}>{STEPS[active].tag}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{STEPS[active].desc}</p>
              </div>

              <div>
                <div className="mono text-xs text-slate-600 mb-3 tracking-wider">INPUTS</div>
                <div className="space-y-2">
                  {STEPS[active].inputs.map((inp) => (
                    <div key={inp} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-slate-900/50 border border-slate-800/40">
                      <span className="text-sky-500 text-xs">▶</span>
                      <span className="mono text-xs text-slate-300">{inp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mono text-xs text-slate-600 mb-3 tracking-wider">OUTPUTS</div>
                <div className="space-y-2">
                  {STEPS[active].outputs.map((out) => (
                    <div key={out} className="flex items-center gap-2 py-1.5 px-3 rounded-lg border"
                      style={{ background: STEPS[active].color + "08", borderColor: STEPS[active].color + "25" }}>
                      <span className="text-xs" style={{ color: STEPS[active].color }}>◆</span>
                      <span className="mono text-xs text-slate-200">{out}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass rounded-2xl p-8 flex items-center justify-center text-slate-600 border-dashed">
              <span className="mono text-sm">Hover a pipeline step to inspect it</span>
            </div>
          )}
        </div>

        {/* I/O transform card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
        >
          {/* Input */}
          <div className="glass rounded-2xl p-6 border border-sky-500/15">
            <div className="mono text-xs text-sky-400 mb-5 tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />INPUT
            </div>
            <div className="space-y-2 font-mono text-sm">
              <div><span className="text-slate-500">part_number: </span><span className="text-emerald-400">&quot;HP-450&quot;</span></div>
              <div><span className="text-slate-500">brand: </span><span className="text-emerald-400">&quot;ABC Industries&quot;</span></div>
              <div><span className="text-slate-500">category: </span><span className="text-emerald-400">&quot;Hydraulic Pump&quot;</span></div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-600 text-xs">3 fields · ~30 bytes</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-3">
            <div className="glass-bright rounded-2xl p-6 w-full flex flex-col items-center text-center glow-blue">
              <div className="w-14 h-14 rounded-full bg-sky-900/40 border border-sky-500/30 flex items-center justify-center mb-3 node-pulse">
                <span className="text-2xl">🧠</span>
              </div>
              <div className="font-bold gradient-text text-sm">UniHack AI Engine</div>
              <div className="mono text-xs text-slate-600 mt-1">9-step pipeline · ~2.3s</div>
              <div className="flex flex-wrap justify-center gap-1 mt-3">
                {["RAG", "LLM", "Validator", "Scorer"].map((t) => (
                  <span key={t} className="mono text-[10px] px-1.5 py-0.5 rounded bg-sky-900/30 border border-sky-800/30 text-sky-400">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="glass rounded-2xl p-6 border border-emerald-500/15">
            <div className="mono text-xs text-emerald-400 mb-5 tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />OUTPUT
            </div>
            <div className="space-y-2 font-mono text-xs">
              {[
                ["pressure", "250 bar", 98],
                ["flow_rate", "45 L/min", 92],
                ["power", "18.5 kW", 94],
                ["rpm_max", "1500", 97],
                ["weight", "12.4 kg", 89],
              ].map(([k, v, c]) => (
                <div key={String(k)} className="flex items-center gap-2">
                  <span className="text-violet-400 w-20 shrink-0">{k}:</span>
                  <span className="text-slate-200 flex-1">{v}</span>
                  <span className="text-emerald-500 text-[10px]">{c}%</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-600 text-xs">23 attrs · 6 sources · 96.4% avg</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
