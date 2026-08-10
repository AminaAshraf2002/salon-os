import { requireScopedSession, activeOrgName, activeLocationName } from "@/lib/tenant";
import { TillLock, LOCKABLE_ID } from "@/components/till-lock";
import React from "react";
import { SalonBanner } from "./components/SalonBanner";
import { SalonSidebar } from "./components/SalonSidebar";

export default async function SalonLayout({ children }: { children: React.ReactNode }) {
  const { session } = await requireScopedSession(["PURCHASE_MANAGER", "SALON_STAFF"]);
  const [orgName, branchName] = await Promise.all([activeOrgName(), activeLocationName()]);
  const isManager = session.role === "PURCHASE_MANAGER";

  // Using pastel colors for the icons as requested
  const items = [
    { label: "Dashboard", href: "/salon", icon: <DashboardIcon />, color: "#32988b" },
    { label: "Sell", href: "/salon/sell", icon: <CartIcon />, color: "#d65f49" },
    { label: "Bills", href: "/salon/bills", icon: <ReceiptIcon />, color: "#4889c9" },
    ...(isManager
      ? [
          { label: "My inventory", href: "/salon/inventory", icon: <BoxesIcon />, color: "#9d5eb6" },
          { label: "Sales report", href: "/salon/reports", icon: <ChartIcon />, color: "#e88c30" },
          { label: "Shop supplies", href: "/purchase-manager/catalogue", icon: <StoreIcon />, color: "#3da35f" },
        ]
      : []),
  ];

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden font-sans">
      <SalonSidebar navItems={items} sessionName={session.name} orgName={orgName} />

      {/* Wrapped so the till lock can make the whole console inert */}
      <div id={LOCKABLE_ID} className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Topbar */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 relative z-20">
          <div className="flex items-center gap-12 flex-1">
            <div className="relative w-full max-w-[320px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full bg-[#f4f4f4] border-none rounded-full py-2.5 pl-10 pr-4 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder="Search anything..."
              />
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="text-[13px] font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              📍 {branchName ?? "Salon"}
            </div>
            <button className="text-gray-500 hover:text-gray-900">
              <BellIcon className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
              <div className="w-full h-full bg-gradient-to-tr from-[#32988b] to-[#9d5eb6] flex items-center justify-center text-[10px] text-white font-bold">
                {session.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-[#fafafa]">
          <div className="p-8 max-w-[1400px] mx-auto space-y-8">
            <SalonBanner sessionName={session.name} />
            {children}
          </div>
        </div>
      </div>
      <TillLock userName={session.name} idleMinutes={5} />
    </div>
  );
}

// Icons
function DashboardIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 15l4-6" /><path d="M4 18a9 9 0 1 1 16 0" /></svg> }
function CartIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.4 12.2a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21.5 7H6" /></svg> }
function ReceiptIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21z" /><path d="M9 8h6M9 12h6" /></svg> }
function BoxesIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-5 9 5v10l-9 5-9-5z" /><path d="M3 9l9 5 9-5M12 14v10" /></svg> }
function ChartIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg> }
function StoreIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 9h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" /><path d="M3 9l1.5-5h15L21 9M9 20v-5h6v5" /></svg> }
function SearchIcon({className}: {className?: string}) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> }
function BellIcon({className}: {className?: string}) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> }
