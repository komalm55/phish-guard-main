import { useState } from "react";
import { Shield, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Scanner" },
    { to: "/about", label: "About" },
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-4 sm:gap-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity">
            <div className="relative">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              <motion.div
                className="absolute inset-0 bg-primary/30 blur-lg rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-bold gradient-text">PhishGuard</h1>
              <span className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase hidden xs:block">
                AI Phishing Detection
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  location.pathname === link.to 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  link.label === "Admin" && location.pathname === "/admin" && "border border-primary/30 shadow-[0_0_15px_-3px_rgba(0,255,100,0.3)]",
                  link.label === "Admin" && "flex items-center gap-2"
                )}
              >
                {link.label === "Admin" && <Shield className="w-3 h-3" />}
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <UserMenu />

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-md hover:bg-secondary/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden border-t border-border/50 overflow-hidden bg-card/50 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-3",
                    location.pathname === link.to 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  {link.label === "Admin" && <Shield className="w-4 h-4" />}
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
