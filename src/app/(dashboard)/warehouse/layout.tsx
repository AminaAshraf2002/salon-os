import { requireScopedSession, activeOrgName } from "@/lib/tenant";
import Link from "next/link";
import React from "react";
import { WarehouseBanner } from "./components/WarehouseBanner";
import { WarehouseSidebar } from "./components/WarehouseSidebar";

export default async function WarehouseLayout({ children }: { children: React.ReactNode }) {
  const { session, db } = await requireScopedSession("WAREHOUSE_MANAGER");
  const orgName = await activeOrgName();

  const [queueCount, outstandingOrders] = await Promise.all([
    db.order.count({ where: { status: { in: ["PENDING", "PROCESSING"] } } }),
    db.order.findMany({
      where: { status: "PARTIALLY_FULFILLED" },
      select: { items: { select: { requestedQty: true, deliveredQty: true } } },
    }),
  ]);
  const outstandingCount = outstandingOrders.reduce(
    (sum, o) => sum + o.items.filter((it) => it.deliveredQty < it.requestedQty).length,
    0
  );



  const navItems = [
    { label: "Order queue", href: "/warehouse/queue", icon: <OrdersIcon />, badge: queueCount || undefined },
    { label: "Pending supplies", href: "/warehouse/outstanding", icon: <ClockIcon />, badge: outstandingCount || undefined },
    { label: "Inventory", href: "/warehouse/inventory", icon: <InventoryIcon /> },
    { label: "Returns", href: "/warehouse/returns", icon: <UndoIcon /> },
    { label: "Import", href: "/warehouse/import", icon: <UploadIcon /> },
    { label: "Movement log", href: "/warehouse/log", icon: <AnalyticsIcon /> },
  ];

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden font-sans">
      <WarehouseSidebar navItems={navItems} sessionName={session.name} orgName={orgName} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
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
                placeholder="Search inventory..."
              />
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <button className="text-gray-500 hover:text-gray-900">
              <BellIcon className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
              {/* Fake user avatar */}
              <div className="w-full h-full bg-gradient-to-tr from-pink-300 to-orange-200 flex items-center justify-center text-[10px] font-bold">
                {session.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-[#fafafa]">
          <div className="p-8 max-w-[1400px] mx-auto space-y-8">
            <WarehouseBanner sessionName={session.name} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function DashboardIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> }
function InventoryIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-5 9 5v10l-9 5-9-5z" /><path d="M3 9l9 5 9-5M12 14v10" /></svg> }
function OrdersIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 5h18M3 12h18M3 19h12" /></svg> }
function AnalyticsIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></svg> }
function SettingsIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> }
function HelpIcon({className}: {className?: string}) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> }
function SignOutIcon({className}: {className?: string}) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> }
function SearchIcon({className}: {className?: string}) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> }
function BellIcon({className}: {className?: string}) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> }
function ClockIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg> }
function UploadIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 16V4m0 0L7 9m5-5l5 5M4 20h16" /></svg> }
function UndoIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg> }
