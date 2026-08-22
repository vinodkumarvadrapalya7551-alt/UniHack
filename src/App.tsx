import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";

const ProblemSection = lazy(() => import("./components/ProblemSection"));
const PipelineSection = lazy(() => import("./components/PipelineSection"));
const DemoSection = lazy(() => import("./components/DemoSection"));
const ValidationSection = lazy(() => import("./components/ValidationSection"));
const KnowledgeGraphSection = lazy(() => import("./components/KnowledgeGraphSection"));
const ScaleSection = lazy(() => import("./components/ScaleSection"));

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#03060f] text-slate-100 relative">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[10%] left-[-15%] w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #818cf8 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main>
          <HeroSection />

          <Suspense fallback={<SectionLoader />}>
            <ProblemSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <PipelineSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <DemoSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <ValidationSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <KnowledgeGraphSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <ScaleSection />
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="border-t border-sky-900/20 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-sky-900/40 border border-sky-500/30 flex items-center justify-center">
                <span className="text-xs font-bold gradient-text">U</span>
              </div>
              <span className="font-semibold">UniHack</span>
              <span className="text-slate-600 text-sm">AI Product Intelligence Platform</span>
            </div>
            <div className="mono text-xs text-slate-600">
              © 2024 UniHack. Transforming industrial product data into trusted intelligence.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
