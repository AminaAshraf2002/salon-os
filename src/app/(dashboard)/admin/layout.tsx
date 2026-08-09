import { requireSession, activeOrgName } from "@/lib/tenant";
import Link from "next/link";
import React from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminBanner } from "./components/AdminBanner";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession("SUPER_ADMIN");
  const orgName = await activeOrgName();

  const navItems = [
    { label: "Overview", href: "/admin/overview", icon: <GaugeIcon /> },
    { label: "Reports", href: "/admin/reports", icon: <ChartIcon /> },
    { label: "Products", href: "/admin/products", icon: <TagIcon /> },
    { label: "Users & salons", href: "/admin/users", icon: <UsersIcon /> },
    { label: "Auth codes", href: "/admin/codes", icon: <KeyIcon /> },
    { label: "Audit log", href: "/admin/audit", icon: <ShieldIcon /> },
  ];

  return (
    <div className="flex h-screen bg-[#f7f7f7] overflow-hidden font-sans">
      <AdminSidebar navItems={navItems} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Topbar */}
        <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 relative z-20">
          <div className="flex items-center gap-12 flex-1">
            <div className="relative w-[280px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full bg-[#f4f4f4] border-none rounded-sm py-2 pl-10 pr-4 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder="Global Search..."
              />
            </div>
          </div>

          <div className="flex items-center gap-5 shrink-0 ml-6">
            <button className="bg-black text-white px-5 py-2 text-[11px] font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
              Create New
            </button>
            <button className="text-gray-500 hover:text-gray-900">
              <BellIcon className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
              <div className="w-full h-full bg-gradient-to-tr from-pink-300 to-orange-200 flex items-center justify-center text-[10px] font-bold">
                {session.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-transparent relative">
          <main className="px-8 py-8 w-full mx-auto max-w-[1400px]">
            <AdminBanner firstName={session.name.split(" ")[0]} />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

// Icons
function GaugeIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 15l4-6" /><path d="M4 18a9 9 0 1 1 16 0" /></svg> }
function ChartIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg> }
function TagIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.6 13.4L11 3.8a2 2 0 0 0-1.4-.6H4a1 1 0 0 0-1 1v5.6c0 .5.2 1 .6 1.4l9.6 9.6a2 2 0 0 0 2.8 0l4.6-4.6a2 2 0 0 0 0-2.8z" /><circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" /></svg> }
function UsersIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4.5-6.2" /></svg> }
function KeyIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="8" cy="14" r="4.5" /><path d="M11.5 10.5L20 2m-4 4l3 3" /></svg> }
function ShieldIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" /></svg> }
function HelpIcon({className}: {className?: string}) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> }
function SignOutIcon({className}: {className?: string}) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> }
function SearchIcon({className}: {className?: string}) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> }
function BellIcon({className}: {className?: string}) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> }
