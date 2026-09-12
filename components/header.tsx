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
  const [isDark, setIsDark] = useState(true);
  const pathname = usePathname();

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

  // Scroll & Background Luminance Detector
  useEffect(() => {
    let rafId: number | null = null;

    const detectBackground = () => {
      if (typeof window === "undefined") return;

      // Sample probe point directly under the floating header
      const probeY = 52;
      const probeX = Math.floor(window.innerWidth / 2);

      const elements = document.elementsFromPoint(probeX, probeY);
      let detectedTheme: "dark" | "light" | null = null;

      for (const el of elements) {
        // Skip header itself and any portal / mobile overlays
        if (!el || el.closest("header") || el.hasAttribute("data-header-portal")) {
          continue;
        }

        let curr: Element | null = el;
        while (curr && curr !== document.documentElement) {
          // 1. Explicit data-header-theme attribute check
          const explicitTheme =
            curr.getAttribute("data-header-theme") || curr.getAttribute("data-theme");
          if (explicitTheme === "dark" || explicitTheme === "light") {
            detectedTheme = explicitTheme;
            break;
          }

          // 2. Direct class name hints
          const cls = typeof curr.className === "string" ? curr.className : "";
          if (
            cls.includes("squid-ink") ||
            cls.includes("bg-[#060a12]") ||
            cls.includes("bg-[#0c1220]") ||
            cls.includes("bg-[#0A0E17]") ||
            cls.includes("bg-slate-900") ||
            cls.includes("bg-black")
          ) {
            detectedTheme = "dark";
            break;
          }
          if (
            cls.includes("bg-white") ||
            cls.includes("bg-gray-50") ||
            cls.includes("bg-gray-100") ||
            cls.includes("bg-slate-50")
          ) {
            detectedTheme = "light";
            break;
          }

          // 3. Computed style background-color luminance check
          const style = window.getComputedStyle(curr);
          const bg = style.backgroundColor;
          if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (match) {
              const r = parseInt(match[1], 10);
              const g = parseInt(match[2], 10);
              const b = parseInt(match[3], 10);
              const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
              if (a > 0.2) {
                const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                detectedTheme = lum > 0.48 ? "light" : "dark";
                break;
              }
            }
          }

          // 4. Background gradient image check
          const bgImg = style.backgroundImage;
          if (bgImg && bgImg !== "none") {
            if (
              bgImg.includes("#060a12") ||
              bgImg.includes("#0c1220") ||
              bgImg.includes("#1e1038") ||
              bgImg.includes("squid-ink") ||
              bgImg.includes("173, 92, 255") ||
              bgImg.includes("139, 92, 246")
            ) {
              detectedTheme = "dark";
              break;
            }
          }

          curr = curr.parentElement;
        }

        if (detectedTheme) break;
      }

      // If no section background was found, inspect body background
      if (!detectedTheme && document.body) {
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        const match = bodyBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const lum =
            (0.299 * parseInt(match[1], 10) +
              0.587 * parseInt(match[2], 10) +
              0.114 * parseInt(match[3], 10)) /
            255;
          detectedTheme = lum > 0.48 ? "light" : "dark";
        }
      }

      setIsDark(detectedTheme !== "light");
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        detectBackground();
        rafId = null;
      });
    };

    // Run immediately and on scroll/resize
    detectBackground();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/"; // Full refresh to homepage
  };

  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const NAV_ITEMS = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/events", label: "Events" },
    { href: "/resources", label: "Resources" },
    { href: "/newsletter", label: "Newsletters" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact-us", label: "Contact" },
  ];

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div
          className={`relative flex justify-between items-center h-16 sm:h-[68px] px-4 sm:px-6 rounded-2xl border transition-all duration-300 ease-in-out backdrop-blur-2xl backdrop-saturate-150 ${
            isDark
              ? "bg-[#0c1220]/75 border-white/[0.12] hover:border-[#AD5CFF]/30 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.12),0_0_20px_rgba(173,92,255,0.06)]"
              : "bg-white/80 border-slate-200/90 hover:border-[#AD5CFF]/40 shadow-[0_12px_35px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9),0_0_20px_rgba(173,92,255,0.05)]"
          }`}
        >
          {/* Logo with increased size and two-line brand label */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 select-none py-1 group shrink-0">
            <Image
              src="/aws-sbg-icon.svg"
              alt="AWS Student Builder Group icon"
              width={48}
              height={48}
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0 transition-transform group-hover:scale-105"
              priority
            />
            <div className="flex flex-col text-left font-sans min-w-0">
              <span
                className={`text-[13.5px] xs:text-[14.5px] sm:text-[15.5px] font-bold tracking-tight leading-tight whitespace-nowrap transition-colors duration-300 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                AWS Student Builder Group
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-semibold tracking-wide leading-tight mt-0.5 whitespace-nowrap transition-colors duration-300 ${
                  isDark ? "text-[#E0AAFF]" : "text-[#7928CA]"
                }`}
              >
                University of Kelaniya
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with Framer Motion Shared-Element Sliding Indicator */}
          <nav
            className="hidden lg:flex items-center gap-0.5 xl:gap-1"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const isHovered = hoveredNav === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHoveredNav(item.href)}
                  className={`relative px-3 py-1.5 text-[13.5px] xl:text-[14px] font-semibold transition-colors duration-200 z-10 select-none rounded-xl ${
                    isHovered
                      ? isDark
                        ? "text-white"
                        : "text-slate-950"
                      : isActive
                      ? isDark
                        ? "text-[#AD5CFF]"
                        : "text-[#7928CA]"
                      : isDark
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {/* Shared-Element Sliding Pill on Hover */}
                  {isHovered && (
                    <motion.div
                      layoutId="navHoverPill"
                      className={`absolute inset-0 rounded-xl -z-10 ${
                        isDark
                          ? "bg-white/[0.09] border border-white/[0.12] shadow-[0_0_16px_rgba(173,92,255,0.22)]"
                          : "bg-purple-100/80 border border-purple-200/90 shadow-sm"
                      }`}
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}

                  {/* Shared-Element Sliding Underline on Hover */}
                  {isHovered && (
                    <motion.div
                      layoutId="navHoverUnderline"
                      className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-gradient-to-r from-[#AD5CFF] via-[#D946EF] to-[#AD5CFF] shadow-[0_0_8px_rgba(173,92,255,0.9)]"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}

                  {/* Active Indicator when not hovered */}
                  {isActive && !hoveredNav && (
                    <motion.div
                      layoutId="navActiveIndicator"
                      className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-[#AD5CFF] shadow-[0_0_6px_rgba(173,92,255,0.8)]"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}

                  <span>{item.label}</span>
                </Link>
              );
            })}

            {userLoggedIn && (
              <Link
                href="/dashboard"
                onMouseEnter={() => setHoveredNav("/dashboard")}
                className={`relative px-3 py-1.5 text-[13.5px] xl:text-[14px] font-semibold transition-colors duration-200 z-10 select-none rounded-xl ${
                  hoveredNav === "/dashboard"
                    ? isDark
                      ? "text-white"
                      : "text-slate-950"
                    : pathname === "/dashboard"
                    ? isDark
                      ? "text-[#AD5CFF]"
                      : "text-[#7928CA]"
                    : isDark
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {hoveredNav === "/dashboard" && (
                  <motion.div
                    layoutId="navHoverPill"
                    className={`absolute inset-0 rounded-xl -z-10 ${
                      isDark
                        ? "bg-white/[0.09] border border-white/[0.12] shadow-[0_0_16px_rgba(173,92,255,0.22)]"
                        : "bg-purple-100/80 border border-purple-200/90 shadow-sm"
                    }`}
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                {hoveredNav === "/dashboard" && (
                  <motion.div
                    layoutId="navHoverUnderline"
                    className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-gradient-to-r from-[#AD5CFF] via-[#D946EF] to-[#AD5CFF] shadow-[0_0_8px_rgba(173,92,255,0.9)]"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                {pathname === "/dashboard" && !hoveredNav && (
                  <motion.div
                    layoutId="navActiveIndicator"
                    className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-[#AD5CFF] shadow-[0_0_6px_rgba(173,92,255,0.8)]"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {userLoggedIn ? (
              <Button
                onClick={handleLogout}
                variant={isDark ? "outline" : "default"}
                className={`rounded-xl transition-all duration-300 ${
                  isDark
                    ? "text-white border-slate-700 hover:bg-slate-800"
                    : "text-slate-900 border-slate-300 hover:bg-slate-100"
                }`}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  className="bg-[#AD5CFF] hover:bg-[#9d4eed] text-white font-bold shadow-[0_4px_20px_rgba(173,92,255,0.4)] hover:shadow-[0_4px_28px_rgba(173,92,255,0.65)] border border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] px-5 py-2 rounded-full text-sm"
                >
                  <Link href="/join-us">Join Us</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className={`rounded-full transition-all duration-300 ${
                    isDark
                      ? "text-slate-200 hover:text-white border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-[#AD5CFF]/50"
                      : "text-slate-800 hover:text-black border-slate-300 bg-white/90 hover:bg-slate-50 hover:border-purple-400 shadow-sm"
                  }`}
                >
                  <Link href="/login">Login</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden transition-all duration-300 p-1.5 rounded-lg ${
              isDark
                ? "text-slate-200 hover:text-[#AD5CFF] hover:bg-slate-800/60"
                : "text-slate-800 hover:text-[#7928CA] hover:bg-slate-100"
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
              className={`mt-2.5 rounded-2xl border p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
                isDark
                  ? "bg-[#0c1220]/95 border-white/[0.1] text-white"
                  : "bg-white/95 border-slate-200/90 text-slate-900"
              }`}
            >
              <nav className="flex flex-col items-center space-y-2">
                {userLoggedIn && (
                  <MobileNavLink
                    href="/dashboard"
                    isDark={isDark}
                    isActive={pathname === "/dashboard"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </MobileNavLink>
                )}
                {NAV_ITEMS.map((item) => (
                  <MobileNavLink
                    key={item.href}
                    href={item.href}
                    isDark={isDark}
                    isActive={pathname === item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </MobileNavLink>
                ))}

                <div
                  className={`w-full pt-3 mt-2 border-t flex flex-col gap-2.5 items-center transition-colors duration-300 ${
                    isDark ? "border-slate-700/50" : "border-slate-200"
                  }`}
                >
                  {userLoggedIn ? (
                    <Button
                      onClick={handleLogout}
                      variant={isDark ? "outline" : "default"}
                      className={`w-full max-w-xs rounded-xl transition-all duration-300 ${
                        isDark ? "text-white border-slate-700 hover:bg-slate-800" : "text-slate-900 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Button
                        asChild
                        className="bg-[#AD5CFF] hover:bg-[#9d4eed] text-white font-bold w-full max-w-xs rounded-full shadow-[0_4px_20px_rgba(173,92,255,0.4)]"
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
                        className={`w-full max-w-xs rounded-full transition-all duration-300 ${
                          isDark
                            ? "text-slate-200 hover:text-white border-slate-700 bg-slate-900/60"
                            : "text-slate-800 hover:text-black border-slate-300 bg-white/90 shadow-sm"
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

function MobileNavLink({
  href,
  children,
  isDark = false,
  isActive = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & { isDark?: boolean; isActive?: boolean }) {
  return (
    <Link
      href={href}
      className={`relative w-full text-center py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
        isActive
          ? isDark
            ? "bg-[#AD5CFF]/15 text-[#AD5CFF] border border-[#AD5CFF]/30"
            : "bg-purple-50 text-[#7928CA] border border-purple-200"
          : isDark
          ? "text-slate-200 hover:text-white hover:bg-white/5"
          : "text-slate-700 hover:text-black hover:bg-slate-100"
      }`}
      {...props}
    >
      {children}
    </Link>
  );
}
