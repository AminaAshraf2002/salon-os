"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export type OpsNavItem = {
  label: string;
  href: string;
  badge?: number;
  icon: keyof typeof ICONS;
};

const ICONS = {
  queue: <path d="M3 5h18M3 12h18M3 19h12" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  boxes: (
    <>
      <path d="M3 9l9-5 9 5v10l-9 5-9-5z" />
      <path d="M3 9l9 5 9-5M12 14v10" />
    </>
  ),
  upload: <path d="M12 16V4m0 0L7 9m5-5l5 5M4 20h16" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
  gauge: (
    <>
      <path d="M12 15l4-6" />
      <path d="M4 18a9 9 0 1 1 16 0" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12l9-9 9 9-9 9z" opacity="0" />
      <path d="M20.6 13.4L11 3.8a2 2 0 0 0-1.4-.6H4a1 1 0 0 0-1 1v5.6c0 .5.2 1 .6 1.4l9.6 9.6a2 2 0 0 0 2.8 0l4.6-4.6a2 2 0 0 0 0-2.8z" />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4.5-6.2" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="14" r="4.5" />
      <path d="M11.5 10.5L20 2m-4 4l3 3" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />,
  chart: <path d="M4 20V10m5 10V4m5 16v-7m5 7V8" />,
  undo: (
    <>
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2 3h3l2.4 12.2a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21.5 7H6" />
    </>
  ),
  store: (
    <>
      <path d="M4 9h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M3 9l1.5-5h15L21 9M9 20v-5h6v5" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
} as const;

export function OpsShell({
  brand,
  subtitle,
  items,
  userName,
  orgName,
  children,
}: {
  brand: string;
  subtitle: string;
  items: OpsNavItem[];
  userName: string;
  orgName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const nav = (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto thin-scrollbar">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center ${expanded ? 'px-3 justify-start' : 'justify-center'} h-11 rounded-lg text-sm font-medium transition-all ${
              active
                ? "bg-velvet text-on-velvet shadow-sm"
                : "text-muted hover:text-ink hover:bg-velvet-soft"
            }`}
            title={!expanded ? item.label : undefined}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              {ICONS[item.icon]}
            </svg>
            {expanded && (
              <>
                <span className="flex-1 ml-3 whitespace-nowrap">{item.label}</span>
                {item.badge ? (
                  <span
                    className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold ${
                      active ? "bg-on-velvet text-velvet" : "bg-line text-ink"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className={`px-4 py-4 border-t border-line flex flex-col ${expanded ? '' : 'items-center'}`}>
      <div className={`flex items-center gap-3 ${expanded ? '' : 'justify-center'}`}>
        <span className="w-10 h-10 rounded-full bg-velvet text-on-velvet grid place-items-center text-sm font-bold shrink-0">
          {userName.charAt(0)}
        </span>
        {expanded && (
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-ink truncate">{userName}</div>
            <div className="text-[11px] text-muted truncate">{orgName}</div>
          </div>
        )}
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className={`mt-4 w-full h-10 flex items-center justify-center gap-2 rounded-lg border border-line text-xs font-semibold text-muted hover:text-ink hover:bg-line-soft transition-colors cursor-pointer ${expanded ? 'px-3' : 'px-0'}`}
        title={!expanded ? "Sign out" : undefined}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        {expanded && <span>Sign out</span>}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex bg-bg">
      {/* Desktop sidebar */}
      <aside 
        className={`hidden lg:flex flex-col bg-surface text-ink border-r border-line transition-all duration-300 relative ${expanded ? 'w-[260px]' : 'w-[80px]'}`}
      >
        <div className={`px-4 h-[72px] flex items-center border-b border-line relative ${expanded ? 'justify-between' : 'justify-center'}`}>
          {expanded ? (
            <div className="min-w-0">
              <div className="font-display text-xl font-bold tracking-tight truncate flex items-center gap-2">
                <span className="bg-velvet text-on-velvet w-6 h-6 rounded-md flex items-center justify-center text-sm">✦</span>
                {brand}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold mt-0.5 truncate pl-8">
                {subtitle}
              </div>
            </div>
          ) : (
            <span className="bg-velvet text-on-velvet w-8 h-8 rounded-md flex items-center justify-center text-lg font-bold shadow-md">✦</span>
          )}

          {/* Expand/Collapse Toggle */}
          <button 
            onClick={() => setExpanded(!expanded)}
            className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-surface text-ink rounded-full border border-line shadow-sm flex items-center justify-center hover:scale-105 transition-transform z-10"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {expanded ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
            </svg>
          </button>
        </div>
        {nav}
        {footer}
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="lg:hidden relative z-40 bg-surface text-ink border-b border-line flex items-center gap-3 px-4 h-14">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
          className="w-9 h-9 grid place-items-center rounded-lg hover:bg-velvet-soft cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
        <span className="font-display text-lg font-bold">{brand}</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted font-semibold mt-1">{subtitle}</span>
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 pt-14">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-surface border-r border-line shadow-lg w-[260px] h-[calc(100vh-56px)] flex flex-col animate-slide-down">
            {nav}
            {footer}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col max-h-screen overflow-y-auto">
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-[1400px] w-full mx-auto animate-fade-in flex flex-col gap-6">
          {/* Universal Header Banner */}
          <div className="bg-surface rounded-2xl p-8 relative overflow-hidden flex flex-col md:flex-row justify-between text-ink shadow-sm border border-line shrink-0">
            <div className="relative z-10 max-w-[600px] flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Good Morning, {userName.split(" ")[0]}!
              </h1>
              <p className="mt-3 text-[15px] text-muted leading-relaxed">
                Monitor operations, manage organizational assets, and track enterprise-wide activities from your command center.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-on-velvet bg-velvet w-fit px-4 py-2 rounded-full font-medium shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            
            {/* Decorative graphic */}
            <div className="hidden md:flex relative z-10 w-[240px] items-center justify-end">
              <div className="relative w-40 h-28 bg-bg rounded-xl shadow-md flex flex-col gap-3 p-4 opacity-90 transform rotate-[-2deg] border border-line">
                <div className="w-20 h-3 bg-velvet/40 rounded-full"></div>
                <div className="w-full h-3 bg-velvet/40 rounded-full"></div>
                <div className="w-16 h-3 bg-velvet/40 rounded-full"></div>
                
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-surface rounded-full border-4 border-velvet shadow-lg flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-velvet" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Subtle background circles */}
            <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-velvet-soft rounded-full blur-3xl pointer-events-none opacity-50"></div>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
}
