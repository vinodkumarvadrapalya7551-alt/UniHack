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

/* ── Sign In Modal ──────────────────────────────────────── */
function SignInModal({ onClose }: { onClose: () => void }) {
  function signInWithGoogle() {
    const clientId = "YOUR_GOOGLE_CLIENT_ID";
    const redirectUri = encodeURIComponent(window.location.origin);
    const scope = encodeURIComponent("openid email profile");
    window.location.href =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
  }

  function signInWithTwitter() {
    // Twitter OAuth 2.0 PKCE — redirects to Twitter login
    const clientId = "YOUR_TWITTER_CLIENT_ID";
    const redirectUri = encodeURIComponent(window.location.origin);
    const scope = encodeURIComponent("tweet.read users.read offline.access");
    const state = Math.random().toString(36).slice(2);
    sessionStorage.setItem("twitter_oauth_state", state);
    window.location.href =
      `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
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
        className="relative glass rounded-3xl p-8 w-full max-w-sm glow-blue"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-sky-900/40 border border-sky-500/30 flex items-center justify-center mx-auto mb-4 glow-blue">
            <span className="text-xl font-bold gradient-text">U</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">Welcome back</h3>
          <p className="text-slate-400 text-sm">Sign in to your UniHack account</p>
        </div>

        {/* OAuth buttons */}
        <div className="space-y-3">
          {/* Google */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl glass border border-slate-700/50 hover:border-sky-500/40 hover:bg-sky-900/10 transition-all duration-200 group"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              Continue with Google
            </span>
          </button>

          {/* Twitter / X */}
          <button
            onClick={signInWithTwitter}
            className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl glass border border-slate-700/50 hover:border-sky-500/40 hover:bg-sky-900/10 transition-all duration-200 group"
          >
            <svg className="w-5 h-5 shrink-0 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              Continue with X (Twitter)
            </span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          By signing in, you agree to our{" "}
          <span className="text-sky-500 cursor-pointer hover:underline">Terms</span> &amp;{" "}
          <span className="text-sky-500 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
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
            <button
              onClick={() => setShowSignIn(true)}
              className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowSignIn(true)}
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
                <button
                  onClick={() => { setMobileOpen(false); setShowSignIn(true); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-sky-900/20 transition-all"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
      </AnimatePresence>
    </>
  );
}
