"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export function AdminSidebar({
  navItems,
}: {
  navItems: { label: string; href: string; icon: React.ReactNode }[];
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={`bg-[#1a1a1a] text-[#a3a3a3] flex flex-col shrink-0 transition-all duration-300 relative ${
        expanded ? "w-[260px]" : "w-[80px]"
      }`}
    >
      <div className={`px-4 py-8 flex flex-col items-center gap-1 ${expanded ? "items-start px-8" : ""}`}>
        {expanded ? (
          <>
            <h1 className="text-[26px] tracking-tight text-white leading-none mb-1" style={{ fontFamily: "serif", fontStyle: "italic" }}>Beyond Demands</h1>
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/50">Premium Management</span>
          </>
        ) : (
          <span className="text-white text-xl font-serif italic mt-2">B</span>
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute -right-3.5 top-10 w-7 h-7 bg-white text-black rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:scale-105 transition-transform z-50"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {expanded ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
        </svg>
      </button>

      <nav className={`flex-1 py-4 space-y-1 ${expanded ? "px-4" : "px-2"}`}>
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={!expanded ? item.label : undefined}
              className={`flex items-center py-3 rounded-lg text-[13px] font-medium transition-colors ${
                expanded ? "px-4" : "justify-center"
              } ${
                active
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className={`w-5 h-5 shrink-0 opacity-80 ${expanded ? "mr-3" : ""}`}>{item.icon}</div>
              {expanded && item.label}
            </Link>
          );
        })}
      </nav>

      {/* PRO INSIGHTS Promo */}
      {expanded && (
        <div className="px-6 mb-8 mt-auto">
          <div className="bg-[#242424] border border-white/5 rounded-lg p-5">
            <h4 className="text-white text-[13px] font-bold mb-1">PRO INSIGHTS</h4>
            <p className="text-[#a3a3a3] text-[11px] leading-relaxed mb-4">Unlock cross-location heatmaps and AI forecasting.</p>
            <button className="w-full py-2 bg-white text-black font-bold text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-colors rounded">
              Unlock Pro
            </button>
          </div>
        </div>
      )}

      <div className={`pb-8 flex flex-col gap-4 text-[13px] font-medium border-t border-white/5 pt-6 ${expanded ? "px-8" : "px-0 items-center"}`}>
        <Link href="#" className={`flex items-center hover:text-white transition-colors ${expanded ? "" : "justify-center"}`} title={!expanded ? "Help" : undefined}>
          <svg className={`w-4 h-4 opacity-80 ${expanded ? "mr-3" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          {expanded && "Help"}
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className={`flex items-center hover:text-white transition-colors ${expanded ? "" : "justify-center"}`} title={!expanded ? "Sign Out" : undefined}>
          <svg className={`w-4 h-4 opacity-80 ${expanded ? "mr-3" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          {expanded && "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
