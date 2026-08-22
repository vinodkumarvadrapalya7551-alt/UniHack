import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";

type Node = {
  id: string; label: string; type: "center" | "product" | "mfg" | "industry" | "spec";
  x: number; y: number; color: string; size: number;
};

type Edge = { from: string; to: string; label?: string };

const NODES: Node[] = [
  { id: "hp450", label: "HP-450", type: "center", x: 50, y: 50, color: "#0ea5e9", size: 28 },
  { id: "hp300", label: "HP-300", type: "product", x: 20, y: 20, color: "#06b6d4", size: 18 },
  { id: "hp600", label: "HP-600", type: "product", x: 80, y: 15, color: "#06b6d4", size: 18 },
  { id: "hp450x", label: "HP-450X", type: "product", x: 85, y: 75, color: "#06b6d4", size: 18 },
  { id: "abc", label: "ABC Industries", type: "mfg", x: 15, y: 65, color: "#818cf8", size: 20 },
  { id: "parker", label: "Parker Hannifin", type: "mfg", x: 70, y: 90, color: "#818cf8", size: 20 },
  { id: "construction", label: "Construction", type: "industry", x: 30, y: 90, color: "#4ade80", size: 16 },
  { id: "marine", label: "Marine", type: "industry", x: 92, y: 45, color: "#4ade80", size: 16 },
  { id: "automation", label: "Automation", type: "industry", x: 8, y: 40, color: "#4ade80", size: 16 },
  { id: "pressure", label: "250 bar", type: "spec", x: 50, y: 15, color: "#fbbf24", size: 14 },
  { id: "flow", label: "45 L/min", type: "spec", x: 65, y: 60, color: "#fbbf24", size: 14 },
];

const EDGES: Edge[] = [
  { from: "hp450", to: "hp300", label: "compatible" },
  { from: "hp450", to: "hp600", label: "series" },
  { from: "hp450", to: "hp450x", label: "variant" },
  { from: "hp450", to: "abc", label: "made by" },
  { from: "hp450", to: "parker", label: "alternative" },
  { from: "hp450", to: "construction", label: "used in" },
  { from: "hp450", to: "marine", label: "used in" },
  { from: "hp450", to: "automation", label: "used in" },
  { from: "hp450", to: "pressure", label: "spec" },
  { from: "hp450", to: "flow", label: "spec" },
];

const typeLabels: Record<string, string> = {
  center: "Target Product",
  product: "Compatible Product",
  mfg: "Manufacturer",
  industry: "Industry",
  spec: "Specification",
};

const layers = [
  { id: "data", label: "Data Sources", color: "#0ea5e9", items: ["PDFs", "ERPs", "Portals", "Web"] },
  { id: "ingest", label: "Ingestion", color: "#06b6d4", items: ["Scrapers", "OCR", "Parsers"] },
  { id: "ai", label: "AI Processing", color: "#818cf8", items: ["LLM", "RAG", "NER", "Classification"] },
  { id: "trust", label: "Trust Engine", color: "#fbbf24", items: ["Validator", "Scorer", "Reviewer"] },
  { id: "datastore", label: "Data Store", color: "#4ade80", items: ["Vector DB", "Graph DB", "PostgreSQL"] },
  { id: "api", label: "API Layer", color: "#fb923c", items: ["REST", "GraphQL", "Webhooks"] },
  { id: "output", label: "Output", color: "#34d399", items: ["PIM", "Commerce", "ERP", "Catalog"] },
];

export default function KnowledgeGraphSection() {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ w: 600, h: 400 });

  const updateDimensions = useCallback(() => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setDimensions({ w: rect.width || 600, h: rect.height || 400 });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  const px = (pct: number) => (pct / 100) * dimensions.w;
  const py = (pct: number) => (pct / 100) * dimensions.h;

  const isConnected = (nodeId: string) => {
    if (!hoveredNode) return false;
    return EDGES.some(
      (e) => (e.from === hoveredNode && e.to === nodeId) || (e.to === hoveredNode && e.from === nodeId)
    );
  };

  const getEdgeLabel = (from: string, to: string) => {
    return EDGES.find((e) => (e.from === from && e.to === to) || (e.to === from && e.from === to))?.label;
  };

  return (
    <section className="relative py-32 overflow-hidden" id="knowledge" ref={ref}>
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
            <span className="mono text-xs text-violet-400 tracking-widest uppercase">Knowledge Graph</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Every Product,{" "}
            <span className="gradient-text-warm">Connected.</span>
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Products don&apos;t exist in isolation. UniHack&apos;s knowledge graph maps relationships
            across products, manufacturers, specifications, and industries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Interactive graph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass rounded-2xl p-4 overflow-hidden"
          >
            <div className="mono text-xs text-sky-400 mb-4 px-2 tracking-wider">KNOWLEDGE GRAPH — HP-450</div>

            <div className="relative" style={{ paddingBottom: "65%" }}>
              <svg
                ref={svgRef}
                className="absolute inset-0 w-full h-full"
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Edges */}
                {EDGES.map((edge) => {
                  const from = NODES.find((n) => n.id === edge.from)!;
                  const to = NODES.find((n) => n.id === edge.to)!;
                  const isActive = hoveredNode === from.id || hoveredNode === to.id;
                  return (
                    <g key={`${edge.from}-${edge.to}`}>
                      <line
                        x1={px(from.x)} y1={py(from.y)}
                        x2={px(to.x)} y2={py(to.y)}
                        stroke={isActive ? from.color : "rgba(255,255,255,0.06)"}
                        strokeWidth={isActive ? 1.5 : 1}
                        strokeDasharray={isActive ? "none" : "4 4"}
                        style={{ transition: "stroke 0.2s" }}
                      />
                      {isActive && edge.label && (
                        <text
                          x={(px(from.x) + px(to.x)) / 2}
                          y={(py(from.y) + py(to.y)) / 2 - 4}
                          fontSize="9"
                          fill="rgba(255,255,255,0.4)"
                          textAnchor="middle"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {edge.label}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Nodes */}
                {NODES.map((node) => {
                  const isHovered = hoveredNode === node.id;
                  const connected = isConnected(node.id);
                  const dimmed = hoveredNode && !isHovered && !connected;
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${px(node.x)}, ${py(node.y)})`}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      style={{ cursor: "pointer", opacity: dimmed ? 0.2 : 1, transition: "opacity 0.2s" }}
                    >
                      <circle
                        r={node.size / 2}
                        fill={node.type === "center" ? node.color + "30" : "rgba(0,0,0,0.5)"}
                        stroke={node.color}
                        strokeWidth={isHovered ? 2 : 1}
                        style={{
                          filter: isHovered ? `drop-shadow(0 0 8px ${node.color})` : "none",
                          transition: "all 0.2s",
                        }}
                      />
                      {node.type === "center" && (
                        <circle r={node.size / 2 + 6} fill="none" stroke={node.color} strokeWidth="0.5" opacity="0.3" />
                      )}
                      <text
                        y={node.size / 2 + 10}
                        textAnchor="middle"
                        fontSize={node.type === "center" ? "10" : "8"}
                        fontWeight={node.type === "center" ? "700" : "400"}
                        fill={isHovered ? "#ffffff" : node.color}
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 px-2 mt-2">
              {Object.entries(typeLabels).map(([type, label]) => {
                const node = NODES.find((n) => n.type === type as Node["type"]);
                return (
                  <div key={type} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: node?.color }} />
                    <span className="mono text-xs text-slate-500">{label}</span>
                  </div>
                );
              })}
            </div>

            {/* Hover info */}
            {hoveredNode && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 px-3 py-2 rounded-xl glass-bright"
              >
                {(() => {
                  const node = NODES.find((n) => n.id === hoveredNode)!;
                  const connections = EDGES
                    .filter((e) => e.from === hoveredNode || e.to === hoveredNode)
                    .map((e) => {
                      const otherId = e.from === hoveredNode ? e.to : e.from;
                      const other = NODES.find((n) => n.id === otherId)!;
                      return { label: other.label, rel: getEdgeLabel(hoveredNode, otherId) };
                    });
                  return (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm" style={{ color: node.color }}>{node.label}</span>
                        <span className="mono text-xs text-slate-500">· {typeLabels[node.type]}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {connections.map((c) => (
                          <span key={c.label} className="mono text-xs px-2 py-0.5 rounded bg-slate-800/50 text-slate-400">
                            {c.rel}: {c.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </motion.div>

          {/* Architecture layers */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="mono text-xs text-sky-400 mb-4 tracking-wider">7-LAYER ARCHITECTURE</div>
            <div className="space-y-2">
              {layers.map((layer, i) => (
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  onMouseEnter={() => setActiveLayer(layer.id)}
                  onMouseLeave={() => setActiveLayer(null)}
                  className="glass rounded-xl p-4 cursor-default transition-all duration-300 group"
                  style={{
                    borderColor: activeLayer === layer.id ? layer.color + "40" : "rgba(14,165,233,0.08)",
                    background: activeLayer === layer.id ? layer.color + "08" : undefined,
                    transform: activeLayer === layer.id ? "translateX(4px)" : "translateX(0)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-10 rounded-full" style={{ background: layer.color }} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold mb-1" style={{ color: layer.color }}>{layer.label}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {layer.items.map((item) => (
                          <span key={item} className="mono text-xs px-2 py-0.5 rounded-md bg-slate-800/50 text-slate-400">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mono text-xs text-slate-600">Layer {i + 1}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
