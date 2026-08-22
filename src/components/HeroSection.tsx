import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float, MeshDistortMaterial, Trail, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

/* ── Particle cloud ─────────────────────────────────────── */
function ParticleCloud() {
  const ref = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  const [positions, colors] = useMemo(() => {
    const count = 4000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      pos[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      if (t < 0.5) {
        col[i * 3] = 0.055; col[i * 3 + 1] = 0.647; col[i * 3 + 2] = 0.914;
      } else if (t < 0.8) {
        col[i * 3] = 0.024; col[i * 3 + 1] = 0.714; col[i * 3 + 2] = 0.831;
      } else {
        col[i * 3] = 0.506; col[i * 3 + 1] = 0.549; col[i * 3 + 2] = 0.973;
      }
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.025 + mouse.x * 0.15;
    ref.current.rotation.x = state.clock.elapsedTime * 0.01 + mouse.y * 0.08;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors}>
      <PointMaterial transparent vertexColors size={0.05} sizeAttenuation depthWrite={false} opacity={0.7} />
    </Points>
  );
}

/* ── Inner ring particles ───────────────────────────────── */
function RingParticles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 3 + (Math.random() - 0.5) * 0.8;
      pos[i * 3]     = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Points ref={ref} positions={positions}>
      <PointMaterial color="#0ea5e9" size={0.035} sizeAttenuation transparent opacity={0.6} depthWrite={false} />
    </Points>
  );
}

/* ── Orbiting data node ─────────────────────────────────── */
function OrbitNode({ radius, speed, offset, color }: { radius: number; speed: number; offset: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.4) * 0.6, Math.sin(t) * radius);
    ref.current.rotation.x = t * 2;
    ref.current.rotation.y = t * 1.5;
  });
  return (
    <Trail width={0.8} length={6} color={color} attenuation={(t) => t * t}>
      <mesh ref={ref}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} metalness={1} roughness={0} />
      </mesh>
    </Trail>
  );
}

/* ── Central AI core ────────────────────────────────────── */
function AICore() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outer.current) { outer.current.rotation.y = t * 0.4; outer.current.rotation.z = t * 0.2; }
    if (inner.current) { inner.current.rotation.y = -t * 0.6; inner.current.rotation.x = t * 0.3; }
    if (ring1.current) { ring1.current.rotation.z = t * 0.5; }
    if (ring2.current) { ring2.current.rotation.x = t * 0.5; ring2.current.rotation.z = t * 0.3; }
  });

  return (
    <Float speed={1.2} floatIntensity={0.4} rotationIntensity={0.1}>
      <group>
        {/* Outer shell */}
        <mesh ref={outer}>
          <icosahedronGeometry args={[1.1, 1]} />
          <MeshDistortMaterial color="#0ea5e9" distort={0.25} speed={3} transparent opacity={0.15} wireframe={false} />
        </mesh>
        {/* Wireframe */}
        <mesh ref={inner}>
          <icosahedronGeometry args={[0.9, 2]} />
          <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.4} />
        </mesh>
        {/* Solid core */}
        <mesh>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial color="#0c1a2e" emissive="#0ea5e9" emissiveIntensity={0.8} metalness={1} roughness={0} />
        </mesh>
        {/* Rings */}
        <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.012, 8, 100]} />
          <meshBasicMaterial color="#0ea5e9" transparent opacity={0.5} />
        </mesh>
        <mesh ref={ring2} rotation={[0.5, 0.3, 0]}>
          <torusGeometry args={[1.8, 0.008, 8, 100]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

/* ── Data connection lines ──────────────────────────────── */
function DataConnections() {
  const endpoints = useMemo(() => [
    new THREE.Vector3(-4, 1.5, -1),
    new THREE.Vector3(4, 2, -2),
    new THREE.Vector3(-3, -2, -1),
    new THREE.Vector3(3.5, -1.5, -1),
    new THREE.Vector3(0, 3.5, -2),
  ], []);

  return (
    <>
      {endpoints.map((end, i) => (
        <Line
          key={i}
          points={[new THREE.Vector3(0, 0, 0), end]}
          color={i % 2 === 0 ? "#0ea5e9" : "#818cf8"}
          lineWidth={0.5}
          transparent
          opacity={0.15}
          dashed
          dashScale={5}
          dashSize={0.5}
          gapSize={0.5}
        />
      ))}
    </>
  );
}

/* ── Floating product boxes ─────────────────────────────── */
function FloatingProducts() {
  const products = useMemo(() => [
    { pos: [-4.5, 1.8, -3] as [number,number,number], color: "#0ea5e9", scale: 0.25 },
    { pos: [4.2, 2.2, -2.5] as [number,number,number], color: "#06b6d4", scale: 0.2 },
    { pos: [-3.5, -2.2, -1.5] as [number,number,number], color: "#818cf8", scale: 0.22 },
    { pos: [3.8, -1.8, -2] as [number,number,number], color: "#0ea5e9", scale: 0.18 },
    { pos: [0.5, 3.5, -3] as [number,number,number], color: "#06b6d4", scale: 0.3 },
    { pos: [-5, -0.5, -2] as [number,number,number], color: "#818cf8", scale: 0.15 },
  ], []);

  return (
    <>
      {products.map((p, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.6} floatIntensity={0.4}>
          <mesh position={p.pos} scale={p.scale}>
            <boxGeometry args={[1, 1.3, 0.8]} />
            <meshStandardMaterial color={p.color} transparent opacity={0.6} metalness={0.9} roughness={0.1} emissive={p.color} emissiveIntensity={0.2} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/* ── Full scene ─────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 3]} color="#0ea5e9" intensity={6} distance={15} />
      <pointLight position={[-6, 4, 0]} color="#06b6d4" intensity={3} distance={20} />
      <pointLight position={[6, -3, 0]} color="#818cf8" intensity={2} distance={15} />
      <pointLight position={[0, 0, 0]} color="#ffffff" intensity={0.5} distance={5} />

      <ParticleCloud />
      <RingParticles />
      <AICore />
      <DataConnections />
      <FloatingProducts />

      {[
        { radius: 2.8, speed: 0.5, offset: 0, color: "#0ea5e9" },
        { radius: 3.5, speed: -0.35, offset: 2, color: "#06b6d4" },
        { radius: 4.2, speed: 0.28, offset: 4, color: "#818cf8" },
        { radius: 3.0, speed: -0.45, offset: 1, color: "#0ea5e9" },
      ].map((o, i) => <OrbitNode key={i} {...o} />)}
    </>
  );
}

/* ── Word cycler ────────────────────────────────────────── */
const WORDS = ["Intelligence", "Insights", "Commerce", "Clarity"];

/* ── Hero ───────────────────────────────────────────────── */
export default function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const iv = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => { setWordIdx((i) => (i + 1) % WORDS.length); setFadeIn(true); }, 350);
    }, 2500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 30, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" id="hero">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg z-0" />

      {/* 3D canvas */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      {/* Radial center glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.07) 0%, rgba(129,140,248,0.04) 40%, transparent 70%)" }} />
      </div>

      {/* Scan line overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none scanlines" />

      {/* Floating parallax layer */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.2}px)`, transition: "transform 0.1s ease-out" }}
      >
        {[
          { label: "PART_NO", val: "HP-450", x: "8%", y: "25%" },
          { label: "PRESSURE", val: "250 bar", x: "85%", y: "20%" },
          { label: "FLOW_RATE", val: "45 L/min", x: "82%", y: "72%" },
          { label: "BRAND", val: "ABC Ind.", x: "6%", y: "72%" },
        ].map((tag) => (
          <div key={tag.label} className="absolute glass px-3 py-2 rounded-xl hidden lg:block"
            style={{ left: tag.x, top: tag.y }}>
            <div className="mono text-[10px] text-slate-600 mb-0.5">{tag.label}</div>
            <div className="mono text-xs text-sky-400 font-semibold">{tag.val}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-3 glass-bright px-5 py-2.5 rounded-full mb-10"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
            </span>
            <span className="mono text-xs text-cyan-400 tracking-[0.2em] uppercase">AI Product Intelligence Platform</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-[80px] font-bold leading-[1.02] tracking-tight mb-8"
          >
            Turn Product Data
            <br />
            Into Product{" "}
            <span
              className="gradient-text inline-block"
              style={{
                opacity: fadeIn ? 1 : 0,
                transform: fadeIn ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
              }}
            >
              {WORDS[wordIdx]}.
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg lg:text-xl text-slate-400 leading-relaxed max-w-2xl mb-12"
          >
            UniHack uses AI, RAG, knowledge graphs, and intelligent validation to transform
            minimal industrial product information into trusted, commerce-ready intelligence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <a href="#demo">
              <button className="relative group px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/20">
                <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4, #818cf8)" }} />
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(135deg, #38bdf8, #22d3ee, #a78bfa)" }} />
                <span className="relative z-10 flex items-center gap-2">🚀 Launch Live Demo</span>
              </button>
            </a>
            <a href="#pipeline">
              <button className="px-8 py-4 rounded-xl font-semibold text-slate-300 glass hover:border-sky-500/40 hover:text-white transition-all duration-300 hover:scale-105">
                Explore the Pipeline →
              </button>
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-wrap gap-x-10 gap-y-4 pt-8 border-t border-sky-900/20"
          >
            {[
              { val: "10M+", label: "Products Processed" },
              { val: "98.4%", label: "Data Accuracy" },
              { val: "< 2.3s", label: "Avg. Latency" },
              { val: "9-Step", label: "AI Pipeline" },
            ].map((s) => (
              <div key={s.label}>
                <div className="mono text-xl font-bold text-sky-400">{s.val}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Live data card floating bottom-right */}
      <motion.div
        initial={{ opacity: 0, x: 40, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-16 right-6 w-80 hidden xl:block z-10"
      >
        <div className="glass rounded-2xl p-5 glow-blue overflow-hidden">
          <div className="animate-shimmer absolute inset-0 rounded-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="mono text-[10px] text-sky-400 tracking-wider">INTELLIGENCE OUTPUT · HP-450</span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-900/30 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="mono text-[10px] text-emerald-400">LIVE</span>
              </span>
            </div>
            <div className="space-y-2.5">
              {[
                { k: "Pressure", v: "250 bar", c: 98 },
                { k: "Flow Rate", v: "45 L/min", c: 92 },
                { k: "Power", v: "18.5 kW", c: 94 },
                { k: "Speed", v: "1500 RPM", c: 97 },
              ].map((a) => (
                <div key={a.k} className="flex items-center gap-3">
                  <span className="mono text-[10px] text-slate-500 w-16 shrink-0">{a.k}</span>
                  <span className="text-xs text-slate-200 flex-1">{a.v}</span>
                  <div className="h-0.5 w-12 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: `${a.c}%` }} />
                  </div>
                  <span className="mono text-[10px] text-sky-500">{a.c}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-sky-900/20">
              <div className="flex items-center justify-between">
                <span className="mono text-[10px] text-slate-600">6 sources · AI-verified</span>
                <span className="mono text-[10px] text-emerald-400">96.4% avg confidence</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-700">
        <span className="mono text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-sky-600/50 to-transparent"
        />
      </div>
    </section>
  );
}
