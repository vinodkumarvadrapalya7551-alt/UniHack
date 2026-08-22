import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Demo", href: "#demo" },
  { label: "Validation", href: "#validation" },
  { label: "Knowledge Graph", href: "#knowledge" },
  { label: "Scale", href: "#scale" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass border-b border-sky-900/30" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-sky-900/40 border border-sky-500/30 flex items-center justify-center group-hover:border-sky-400/60 transition-colors glow-blue">
            <span className="text-sm font-bold gradient-text">U</span>
          </div>
          <span className="font-bold text-lg tracking-tight">
            Uni<span className="gradient-text">Hack</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-sky-900/20 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors">
            Sign In
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
          >
            Get Access
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-slate-400 hover:text-white p-2"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`w-full h-px bg-current transition-transform duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-full h-px bg-current transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`w-full h-px bg-current transition-transform duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-sky-900/20 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-sky-900/20 transition-all"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
