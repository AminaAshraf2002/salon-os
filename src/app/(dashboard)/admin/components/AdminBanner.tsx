"use client";

import { usePathname } from "next/navigation";

export function AdminBanner({ firstName }: { firstName: string }) {
  const pathname = usePathname();

  let config = {
    title: `Good morning, ${firstName}`,
    description: "Monitor performance across all locations and optimize your premium salon ecosystem in real-time.",
    image: "/admin-hero.png"
  };

  if (pathname.includes("/products")) {
    config = {
      title: "Products",
      description: "Manage your entire catalogue of products. Hidden products disappear from the salon shop right away, but their history stays.",
      image: "/salon-1.png"
    };
  } else if (pathname.includes("/users")) {
    config = {
      title: "Users & Salons",
      description: "Manage salon locations and team members. Control access levels and view staff performance metrics.",
      image: "/salon-2.png"
    };
  } else if (pathname.includes("/codes")) {
    config = {
      title: "Auth Codes",
      description: "Generate and manage authorization codes for staff logins and secure system access.",
      image: "/salon-3.png"
    };
  } else if (pathname.includes("/audit")) {
    config = {
      title: "Audit Log",
      description: "Review a comprehensive history of system events, inventory changes, and administrative actions.",
      image: "/salon-4.png"
    };
  }

  return (
    <div className="-mx-8 -mt-8 relative h-[320px] bg-black overflow-hidden mb-12">
      <img 
        src={config.image} 
        alt={config.title} 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10"></div>
      
      <div className="relative z-20 h-full max-w-[1400px] mx-auto px-10 flex flex-col pt-16">
        <h2 suppressHydrationWarning className="text-5xl font-serif text-white mb-4">{config.title}</h2>
        <p className="text-[#a3a3a3] text-sm max-w-lg leading-relaxed mb-8 font-medium">
          {config.description}
        </p>
        
        {pathname.includes("/overview") && (
          <div className="flex items-center gap-10">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#a3a3a3] mb-1.5">Server Status</div>
              <div className="flex items-center text-[#4da85a] text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#4da85a] mr-2"></span> Operational
              </div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#a3a3a3] mb-1.5">Active Users</div>
              <div className="text-white text-sm font-semibold">
                1,284 Live
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
