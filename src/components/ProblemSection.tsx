import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

/* ── Neural net canvas ──────────────────────────────────── */
function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;

    const nodes = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: 1.5 + Math.random() * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }
      // Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(14,165,233,${(1 - d / 100) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      // Nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(14,165,233,0.25)";
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    const ro = new ResizeObserver(() => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    });
    ro.observe(canvas);
    return () => { cancelAnimationFrame(animRef.current); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />;
}

/* ── Orbiting source objects ─────────────────────────────── */
const SOURCES = [
  { icon: "📄", label: "PDF Catalog", angle: 270, color: "#0ea5e9" },
  { icon: "🌐", label: "Supplier Site", angle: 330, color: "#06b6d4" },
  { icon: "📊", label: "Spreadsheet", angle: 30, color: "#818cf8" },
  { icon: "📚", label: "ERP System", angle: 90, color: "#06b6d4" },
  { icon: "📜", label: "Legacy DB", angle: 150, color: "#0ea5e9" },
  { icon: "🗂️", label: "Distributor", angle: 210, color: "#818cf8" },
];

function ConvergenceViz({ inView }: { inView: boolean }) {
  const [converged, setConverged] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setConverged(true), 800);
    return () => clearTimeout(t);
  }, [inView]);

  const R = 140; // orbit radius in px

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center">
      {/* Central AI engine */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="absolute z-20 flex flex-col items-center justify-center"
      >
        <div className="relative">
          {/* Pulse rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-sky-500/20"
              style={{ inset: `-${i * 20}px` }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
          <div className="w-24 h-24 rounded-full glass-bright flex flex-col items-center justify-center glow-blue">
            <span className="text-3xl">🧠</span>
            <span className="mono text-[10px] text-sky-400 mt-1">AI ENGINE</span>
          </div>
        </div>
      </motion.div>

      {/* Orbit ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 0.15, scale: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute w-72 h-72 rounded-full border border-sky-500/30"
        style={{ borderStyle: "dashed" }}
      />

      {/* Source nodes */}
      {SOURCES.map((src, i) => {
        const rad = (src.angle * Math.PI) / 180;
        const tx = converged ? 0 : Math.cos(rad) * R;
        const ty = converged ? 0 : Math.sin(rad) * R;

        return (
          <motion.div
            key={src.label}
            className="absolute z-10 cursor-pointer"
            initial={{ x: Math.cos(rad) * R, y: Math.sin(rad) * R, opacity: 0 }}
            animate={inView ? {
              x: tx, y: ty, opacity: 1,
              scale: activeIdx === i ? 1.1 : 1,
            } : {}}
            transition={{
              x: { delay: 0.2 + i * 0.1, duration: converged ? 0.8 : 0, type: "spring" },
              y: { delay: 0.2 + i * 0.1, duration: converged ? 0.8 : 0, type: "spring" },
              opacity: { delay: 0.1 + i * 0.08 },
            }}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            {!converged && (
              <div
                className="glass rounded-xl px-3 py-2 flex items-center gap-2 whitespace-nowrap"
                style={{ borderColor: src.color + "30" }}
              >
                <span className="text-base">{src.icon}</span>
                <div>
                  <div className="text-xs font-medium text-slate-300">{src.label}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="mono text-[10px] text-red-400">Unstructured</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Animated connection lines (SVG) */}
      {!converged && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          {SOURCES.map((src, i) => {
            const rad = (src.angle * Math.PI) / 180;
            const cx = 50 + (Math.cos(rad) * R / 2.5);
            const cy = 50 + (Math.sin(rad) * R / 2.5);
            return (
              <motion.line
                key={i}
                x1={`${cx}%`} y1={`${cy}%`}
                x2="50%" y2="50%"
                stroke={src.color}
                strokeWidth="0.5"
                strokeDasharray="3 3"
                strokeOpacity="0.3"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
              />
            );
          })}
        </svg>
      )}

      {/* Converged state */}
      {converged && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 5 }}
        >
          {SOURCES.map((src, i) => {
            const rad = (i / SOURCES.length) * Math.PI * 2;
            return (
              <motion.div
                key={src.label}
                className="absolute"
                style={{
                  left: `calc(50% + ${Math.cos(rad) * 56}px)`,
                  top: `calc(50% + ${Math.sin(rad) * 56}px)`,
                  transform: "translate(-50%,-50%)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8 + i, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center glass-bright" style={{ borderColor: src.color + "40" }}>
                  <span className="text-sm">{src.icon}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

/* ── Problem cards ──────────────────────────────────────── */
const PROBLEMS = [
  { label: "Fragmented", icon: "⚡", color: "#0ea5e9", bg: "rgba(14,165,233,0.06)",
    stat: "73%", statLabel: "of products lack unified data",
    desc: "Product data scattered across PDFs, ERP systems, supplier portals, and spreadsheets." },
  { label: "Incomplete", icon: "◯", color: "#06b6d4", bg: "rgba(6,182,212,0.06)",
    stat: "40%", statLabel: "avg. commerce fields filled",
    desc: "Critical attributes missing — making commerce catalog publishing impossible without manual effort." },
  { label: "Inconsistent", icon: "≠", color: "#818cf8", bg: "rgba(129,140,248,0.06)",
    stat: "3.4×", statLabel: "more errors than B2C",
    desc: "Same product, different specs across channels — causing costly returns and lost deals." },
  { label: "Manual", icon: "↻", color: "#fbbf24", bg: "rgba(251,191,36,0.06)",
    stat: "60%", statLabel: "of team time on data ops",
    desc: "Teams spend the majority of their time copying and cleaning data instead of driving value." },
  { label: "Can't Scale", icon: "↗", color: "#f87171", bg: "rgba(248,113,113,0.06)",
    stat: "8 wks", statLabel: "to onboard 10K new SKUs",
    desc: "Manual processes create compounding bottlenecks that grow worse with every new product." },
];

export default function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative py-32 overflow-hidden" id="problem" ref={ref}>
      {/* Neural net bg */}
      <div className="absolute inset-0"><NeuralCanvas /></div>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, rgba(3,6,15,0.9) 0%, rgba(3,6,15,0.7) 50%, rgba(3,6,15,0.9) 100%)"
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 glass-bright px-5 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="mono text-xs text-red-400 tracking-[0.2em] uppercase">The Problem</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Industrial Product Data Is{" "}
            <span className="gradient-text">Everywhere.</span>
            <br />
            Intelligence Isn&apos;t.
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            The industrial sector runs on fragmented, incomplete data —
            costing billions in lost revenue every year.
          </p>
        </motion.div>

        {/* Two-column: viz + stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <ConvergenceViz inView={inView} />
          </motion.div>

          <div className="space-y-4">
            {PROBLEMS.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="glass rounded-2xl p-5 cursor-default transition-all duration-300 group"
                style={{
                  borderColor: hovered === i ? p.color + "40" : "rgba(14,165,233,0.08)",
                  background: hovered === i ? p.bg : undefined,
                  transform: hovered === i ? "translateX(6px)" : "translateX(0)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: p.color + "15", border: `1px solid ${p.color}30` }}>
                    <span className="font-bold text-lg" style={{ color: p.color }}>{p.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-slate-100">{p.label}</span>
                      <span className="mono text-xs font-bold" style={{ color: p.color }}>{p.stat}</span>
                      <span className="mono text-xs text-slate-600">{p.statLabel}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Impact stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="glass rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { val: "$3.1T", label: "Annual losses from poor product data in B2B commerce", icon: "💸" },
            { val: "67%", label: "Customers abandon purchases due to missing specifications", icon: "🛒" },
            { val: "8 weeks", label: "Average time to onboard 10,000 new industrial SKUs manually", icon: "📅" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="text-4xl font-bold gradient-text mb-2">{stat.val}</div>
              <div className="text-sm text-slate-400 leading-relaxed">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
