import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#060a12] text-white border-t border-white/[0.08] overflow-hidden pt-16 pb-10">
      {/* Top Grid-Mesh Background Band with Centered Purple Ambient Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 overflow-hidden">
        {/* Soft Ambient Purple Glow Centered at Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[280px] bg-[#AD5CFF]/[0.18] rounded-full blur-[110px]" />
        
        {/* Purple-Tinted Grid-Mesh Pattern */}
        <div className="absolute inset-0 opacity-[0.55] purple-grid-mesh [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />

        {/* Top Hairline Purple Gradient Accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#AD5CFF]/40 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Brand Column - Proportional 5-column span with aligned typography */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 select-none group">
              <Image
                src="/aws-sbg-icon.svg"
                alt="AWS Student Builder Group icon"
                width={36}
                height={36}
                className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col text-left">
                <span className="text-[15px] font-bold tracking-tight text-white group-hover:text-purple-200 transition-colors leading-snug">
                  AWS Student Builder Group UOK
                </span>
                <span className="text-xs font-semibold text-[#AD5CFF] tracking-wide">
                  University of Kelaniya
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed pr-2">
              Empowering students and builders at University of Kelaniya through hands-on cloud architectures, workshops, and real-world AWS projects.
            </p>
          </div>

          {/* Quick Links Column - 2-column span */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#AD5CFF] mb-4 h-5 flex items-center">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                >
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                >
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                >
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column - 2-column span */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#AD5CFF] mb-4 h-5 flex items-center">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://community.aws/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                >
                  <span>AWS Community</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:text-[#AD5CFF] transition-all" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.awseducate.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                >
                  <span>AWS Educate</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:text-[#AD5CFF] transition-all" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.awsacademy.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                >
                  <span>AWS Academy</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:text-[#AD5CFF] transition-all" />
                </a>
              </li>
            </ul>
          </div>

          {/* Connect With Us Column - 3-column span */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#AD5CFF] mb-4 h-5 flex items-center">
              Connect With Us
            </h4>
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.facebook.com/people/AWS-Cloud-Club-of-University-of-Kelaniya/61568175273436/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300 hover:text-white hover:border-[#AD5CFF]/60 hover:bg-[#AD5CFF]/15 hover:shadow-[0_0_20px_rgba(173,92,255,0.35)] hover:-translate-y-0.5"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/aws_cloud_club"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300 hover:text-white hover:border-[#AD5CFF]/60 hover:bg-[#AD5CFF]/15 hover:shadow-[0_0_20px_rgba(173,92,255,0.35)] hover:-translate-y-0.5"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/aws-cloud-club-of-university-of-kelaniya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300 hover:text-white hover:border-[#AD5CFF]/60 hover:bg-[#AD5CFF]/15 hover:shadow-[0_0_20px_rgba(173,92,255,0.35)] hover:-translate-y-0.5"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.youtube.com/@AWSCloudClubUOK"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300 hover:text-white hover:border-[#AD5CFF]/60 hover:bg-[#AD5CFF]/15 hover:shadow-[0_0_20px_rgba(173,92,255,0.35)] hover:-translate-y-0.5"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Minimal Understated Centered Copyright Line */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] text-center">
          <p className="text-xs text-slate-500 tracking-wide">
            &copy; {new Date().getFullYear()} AWS Student Builder Group UOK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
