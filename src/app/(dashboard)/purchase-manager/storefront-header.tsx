"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";

export function StorefrontHeader({
  userName,
  orgName,
  branchName,
  cartCount,
  categories,
}: {
  userName: string;
  orgName: string;
  branchName: string | null;
  cartCount: number;
  categories: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const activeCat = params.get("cat") ?? "All";

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(`/purchase-manager/catalogue${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  function catHref(cat: string) {
    const p = new URLSearchParams();
    if (cat && cat !== "All") p.set("cat", cat);
    const s = p.toString();
    return `/purchase-manager/catalogue${s ? `?${s}` : ""}`;
  }

  const boxCls =
    "flex items-center gap-1 px-2 h-10 rounded-sm border border-transparent hover:border-line cursor-pointer transition-colors";

  return (
    <header className="relative z-30 font-sans border-b border-line/50">
      {/* Top Thin Banner */}
      <div className="bg-black text-white text-[10px] font-bold tracking-widest uppercase">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-12 h-10 flex items-center justify-between">
          <div className="flex-1"></div>
          
          <div className="flex-1 flex justify-center items-center gap-2 px-6 overflow-hidden whitespace-nowrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            <span className="truncate">FREE SHIPPING ON ORDERS OVER $75</span>
          </div>

          <div className="flex-1 flex justify-end items-center pl-6">
            USA (USD)
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="ml-1">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-[#fcfbf9] text-[#2c2a29]">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-12 h-24 flex items-center justify-between gap-6">
          
          {/* Logo Section */}
          <Link href="/purchase-manager/catalogue" className="flex flex-col shrink-0">
            <img src="/logo.png" alt="Beyond Demands" className="h-40 w-auto object-contain" />
          </Link>

          {/* Middle Content (Functional elements styled elegantly) */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-8 text-[11px] font-bold tracking-widest text-[#2c2a29]">
            {/* Deliver to */}
            <Link href="/purchase-manager/account/addresses" className="flex flex-col items-start hover:text-[#8b7355] transition-colors leading-tight shrink-0">
              <span className="text-[9px] text-[#6b6764]">DELIVER TO</span>
              <span className="text-[11px] truncate max-w-[120px] uppercase">{branchName ?? orgName}</span>
            </Link>

            {/* Elegant Search Bar */}
            <form onSubmit={submitSearch} className="flex-1 max-w-[450px] flex h-[42px] rounded-full border border-[#d5d2cc] bg-white overflow-hidden transition-colors focus-within:border-[#8b7355]">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search supplies, brands, SKU…"
                className="flex-1 min-w-0 px-5 text-[13px] text-[#2c2a29] outline-none bg-transparent placeholder-[#a8a4a1] font-sans font-normal tracking-normal"
              />
              <button type="submit" aria-label="Search" className="w-12 grid place-items-center text-[#2c2a29] hover:text-[#8b7355] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>

            {/* Orders */}
            <Link href="/purchase-manager/orders" className="flex flex-col items-start hover:text-[#8b7355] transition-colors leading-tight shrink-0">
              <span className="text-[9px] text-[#6b6764]">RETURNS</span>
              <span className="text-[11px] uppercase">ORDERS</span>
            </Link>
          </div>

          {/* Icons Right */}
          <div className="flex shrink-0 items-center justify-end gap-6 text-[#2c2a29]">
            {/* Account */}
            <div className="relative group">
              <button aria-label="Account" className="hover:text-[#8b7355] transition-colors pt-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              <div className="absolute right-0 top-8 w-48 bg-white text-[#2c2a29] border border-[#d5d2cc] rounded shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40">
                <div className="px-3 py-2 text-xs font-bold border-b border-[#d5d2cc] mb-1">
                  Hello, {userName.split(" ")[0]}
                </div>
                
                <Link href="/salon/sell" className="block px-3 py-2 text-xs font-semibold text-[#8b7355] hover:bg-[#f7f5f0] transition-colors rounded">
                  Salon counter — sell to customers
                </Link>
                <div className="h-px bg-[#d5d2cc] my-1" />

                <Link href="/purchase-manager/account" className="block px-3 py-2 text-xs font-medium hover:bg-[#f7f5f0] transition-colors">Your account</Link>
                <Link href="/purchase-manager/orders" className="block px-3 py-2 text-xs font-medium hover:bg-[#f7f5f0] transition-colors">Your orders</Link>
                <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[#f7f5f0] transition-colors">
                  Sign out
                </button>
              </div>
            </div>

            {/* Cart */}
            <Link href="/purchase-manager/cart" aria-label="Cart" className="relative hover:text-[#8b7355] transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 w-[16px] h-[16px] bg-[#1a1a1a] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2 — elegant category strip */}
      <div className="bg-white border-t border-[#d5d2cc] text-[#2c2a29] uppercase tracking-widest font-bold">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-12 flex items-center gap-1 overflow-x-auto no-scrollbar h-11">
          <Link
            href="/salon/sell"
            className="shrink-0 px-4 h-8 grid place-items-center text-[10px] text-white bg-[#2c2a29] hover:bg-[#1a1a1a] rounded transition-colors"
          >
            SELL TO CUSTOMER →
          </Link>
          <span className="shrink-0 w-px h-4 bg-[#d5d2cc] mx-2" />
          {["All", ...categories].map((cat) => {
            const on = cat === activeCat;
            return (
              <Link
                key={cat}
                href={catHref(cat)}
                className={`shrink-0 px-3 h-8 grid place-items-center text-[10px] rounded transition-colors ${
                  on ? "text-[#8b7355] bg-[#f7f5f0]" : "hover:text-[#8b7355]"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
