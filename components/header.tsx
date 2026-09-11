"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserLoggedIn(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setUserLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/"; // Full refresh to homepage
  };

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div
          className={`relative flex justify-between items-center h-16 sm:h-[68px] px-4 sm:px-6 rounded-2xl border transition-all duration-300 ${
            isHome
              ? "bg-[#0A0E17]/85 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]"
              : "bg-white/95 backdrop-blur-xl border-slate-200/80 shadow-md"
          }`}
        >
          {/* Logo with increased size and two-line brand label */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 select-none py-1 group shrink-0">
            <Image
              src="/aws-sbg-icon-orange.png"
              alt="AWS Student Builder Group icon"
              width={48}
              height={48}
              className="w-11 h-11 sm:w-12 sm:h-12 object-contain shrink-0 transition-transform group-hover:scale-105"
              priority
            />
            <div className="flex flex-col text-left font-sans min-w-0">
              <span
                className={`text-[13.5px] xs:text-[14.5px] sm:text-[15.5px] font-bold tracking-tight leading-tight whitespace-nowrap transition-colors ${
                  isHome ? "text-white" : "text-[#232F3E]"
                }`}
              >
                AWS Student Builder Group
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#FFA726] font-semibold tracking-wide leading-tight mt-0.5 whitespace-nowrap">
                University of Kelaniya
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {[
              { href: "/", label: "Home" },
              { href: "/about-us", label: "About Us" },
              { href: "/events", label: "Events" },
              { href: "/resources", label: "Resources" },
              { href: "/newsletter", label: "Newsletters" },
              { href: "/contact-us", label: "Contact" },
            ].map((item) => (
              <NavLink key={item.href} href={item.href} isDark={isHome}>
                {item.label}
              </NavLink>
            ))}
            {userLoggedIn && (
              <NavLink href="/dashboard" isDark={isHome}>
                Dashboard
              </NavLink>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {userLoggedIn ? (
              <Button
                onClick={handleLogout}
                variant={isHome ? "outline" : "default"}
                className={isHome ? "text-white border-slate-700 hover:bg-slate-800 rounded-xl" : "rounded-xl"}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#FF9900] to-[#FF8000] hover:from-[#FFA726] hover:to-[#FF9900] text-[#0A0E17] font-bold shadow-[0_0_20px_rgba(255,153,0,0.35)] hover:shadow-[0_0_28px_rgba(255,153,0,0.55)] transition-all px-4 sm:px-5 py-2 rounded-xl text-sm"
                >
                  <Link href="/join-us">Join Us</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className={
                    isHome
                      ? "text-slate-200 hover:text-white border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-[#FF9900]/40 rounded-xl transition-all"
                      : "rounded-xl"
                  }
                >
                  <Link href="/login">Login</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden transition-colors p-1.5 rounded-lg ${
              isHome
                ? "text-slate-200 hover:text-[#FF9900] hover:bg-slate-800/60"
                : "text-[#232F3E] hover:text-[#FF9900] hover:bg-slate-100"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className={`mt-2.5 rounded-2xl border p-5 shadow-2xl backdrop-blur-xl ${
                isHome
                  ? "bg-[#0A0E17]/95 border-slate-800 text-white"
                  : "bg-white/95 border-slate-200 text-[#232F3E]"
              }`}
            >
              <nav className="flex flex-col items-center space-y-3.5">
                {userLoggedIn && (
                  <NavLink
                    href="/dashboard"
                    isDark={isHome}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                )}
                {[
                  { href: "/", label: "Home" },
                  { href: "/about-us", label: "About Us" },
                  { href: "/events", label: "Events" },
                  { href: "/resources", label: "Resources" },
                  { href: "/newsletter", label: "Newsletters" },
                  { href: "/contact-us", label: "Contact" },
                ].map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    isDark={isHome}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}

                <div className="w-full pt-3 mt-2 border-t border-slate-700/50 flex flex-col gap-2.5 items-center">
                  {userLoggedIn ? (
                    <Button
                      onClick={handleLogout}
                      variant={isHome ? "outline" : "default"}
                      className={`w-full max-w-xs ${
                        isHome ? "text-white border-slate-700 hover:bg-slate-800" : ""
                      }`}
                    >
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Button
                        asChild
                        className="bg-gradient-to-r from-[#FF9900] to-[#FF8000] text-[#0A0E17] font-bold w-full max-w-xs rounded-xl"
                      >
                        <Link
                          href="/join-us"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Join Us
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className={`w-full max-w-xs rounded-xl ${
                          isHome
                            ? "text-slate-200 hover:text-white border-slate-700 bg-slate-900/60"
                            : ""
                        }`}
                      >
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Login
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  isDark = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & { isDark?: boolean }) {
  return (
    <Link
      href={href}
      className={`relative transition-colors duration-200 group py-2 font-medium ${
        isDark ? "text-slate-200 hover:text-[#FF9900]" : "text-[#232F3E] hover:text-[#FF9900]"
      }`}
      {...props}
    >
      <span className="relative">
        {children}
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF9900] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </span>
    </Link>
  );
}
