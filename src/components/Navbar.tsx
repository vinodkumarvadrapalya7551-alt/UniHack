import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  auth, googleProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, type User,
} from "../firebase";

const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Demo", href: "#demo" },
  { label: "Validation", href: "#validation" },
  { label: "Knowledge Graph", href: "#knowledge" },
  { label: "Scale", href: "#scale" },
];

/* ── Auth Modal ─────────────────────────────────────────── */
function AuthModal({ onClose, onAuth }: { onClose: () => void; onAuth: (u: User) => void }) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setError(""); setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onAuth(result.user);
      onClose();
    } catch (e: any) {
      setError(e.message?.replace("Firebase: ", "") ?? "Google sign-in failed.");
    } finally { setLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      let result;
      if (tab === "signup") {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      onAuth(result.user);
      onClose();
    } catch (e: any) {
      const msg: string = e.message ?? "";
      if (msg.includes("email-already-in-use")) setError("Email already in use. Try signing in.");
      else if (msg.includes("wrong-password") || msg.includes("invalid-credential")) setError("Incorrect email or password.");
      else if (msg.includes("user-not-found")) setError("No account found. Please sign up.");
      else if (msg.includes("weak-password")) setError("Password must be at least 6 characters.");
      else setError("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative glass rounded-3xl p-8 w-full max-w-sm glow-blue"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >✕</button>

        {/* Logo + heading */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-sky-900/40 border border-sky-500/30 flex items-center justify-center mx-auto mb-4 glow-blue">
            <span className="text-xl font-bold gradient-text">U</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {tab === "signin" ? "Welcome back" : "Create account"}
          </h3>
          <p className="text-slate-400 text-sm">
            {tab === "signin" ? "Sign in to your UniHack account" : "Join UniHack today"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex glass rounded-xl p-1 mb-6">
          {(["signin", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: tab === t ? "linear-gradient(135deg,#0ea5e9,#06b6d4)" : "transparent",
                color: tab === t ? "#fff" : "#94a3b8",
              }}
            >
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl glass border border-slate-700/50 hover:border-sky-500/40 hover:bg-sky-900/10 transition-all duration-200 group mb-4 disabled:opacity-50"
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

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="mono text-xs text-slate-600">or</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === "signup" && (
            <div>
              <label className="mono text-xs text-slate-500 block mb-1.5">Full Name</label>
              <input
                type="text" required value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-900/60 border border-sky-900/40 focus:border-sky-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
              />
            </div>
          )}
          <div>
            <label className="mono text-xs text-slate-500 block mb-1.5">Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-slate-900/60 border border-sky-900/40 focus:border-sky-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="mono text-xs text-slate-500 block mb-1.5">Password</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900/60 border border-sky-900/40 focus:border-sky-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="mono text-xs text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {tab === "signin" ? "Signing in..." : "Creating account..."}
              </span>
            ) : tab === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-5">
          By continuing, you agree to our{" "}
          <span className="text-sky-500 cursor-pointer hover:underline">Terms</span> &amp;{" "}
          <span className="text-sky-500 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
}

/* ── User menu dropdown ─────────────────────────────────── */
function UserMenu({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() ?? "U";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl glass hover:border-sky-500/40 transition-all"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg,#0ea5e9,#818cf8)" }}>
            {initials}
          </div>
        )}
        <span className="text-sm text-slate-300 hidden md:block max-w-[100px] truncate">
          {user.displayName ?? user.email?.split("@")[0]}
        </span>
        <svg className={`w-3 h-3 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-56 glass rounded-2xl p-2 border border-sky-900/30 shadow-xl"
          >
            <div className="px-3 py-2 border-b border-sky-900/20 mb-1">
              <div className="text-sm font-semibold text-slate-200 truncate">
                {user.displayName ?? "User"}
              </div>
              <div className="mono text-xs text-slate-500 truncate">{user.email}</div>
            </div>
            <button
              onClick={() => { onSignOut(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  async function handleSignOut() {
    await signOut(auth);
    setUser(null);
  }

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
              <a key={link.href} href={link.href}
                className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-sky-900/20 transition-all duration-200">
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <UserMenu user={user} onSignOut={handleSignOut} />
            ) : (
              <>
                <button onClick={() => setShowAuth(true)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors">
                  Sign In
                </button>
                <button onClick={() => setShowAuth(true)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}>
                  Get Access
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-slate-400 hover:text-white p-2"
            onClick={() => setMobileOpen((o) => !o)}>
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
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-sky-900/20 overflow-hidden"
            >
              <div className="px-6 py-4 space-y-1">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-sky-900/20 transition-all">
                    {link.label}
                  </a>
                ))}
                {user ? (
                  <button onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-900/20 transition-all">
                    Sign Out
                  </button>
                ) : (
                  <button onClick={() => { setMobileOpen(false); setShowAuth(true); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-sky-900/20 transition-all">
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onAuth={(u) => setUser(u)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
