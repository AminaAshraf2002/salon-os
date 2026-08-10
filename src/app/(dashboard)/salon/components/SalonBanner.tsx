"use client";

import { usePathname } from "next/navigation";

export function SalonBanner({ sessionName }: { sessionName: string }) {
  const pathname = usePathname();

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  }).toUpperCase();

  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  const firstName = sessionName.split(" ")[0];

  let config = {
    title: `${greeting}, ${firstName}`,
    description: "Monitor operations, manage organizational assets, and track enterprise-wide activities from your command center.",
    image: "/salon-bg.png"
  };

  if (pathname.includes("/sell")) {
    config = {
      title: "Point of Sale",
      description: "Quickly serve customers, scan products, and manage transactions directly from the terminal.",
      image: "/salon-1.png"
    };
  } else if (pathname.includes("/inventory")) {
    config = {
      title: "Branch Inventory",
      description: "Track and manage your salon's product catalogue. Monitor stock levels in real-time.",
      image: "/salon-2.png"
    };
  } else if (pathname.includes("/bills")) {
    config = {
      title: "Recent Bills",
      description: "Review past customer transactions, reprint receipts, and process any returns or refunds.",
      image: "/salon-3.png"
    };
  } else if (pathname.includes("/reports")) {
    config = {
      title: "Sales Report",
      description: "Analyze daily revenue, top selling items, and employee performance metrics.",
      image: "/salon-4.png"
    };
  } else if (pathname.includes("/catalogue")) {
    config = {
      title: "Shop Supplies",
      description: "Order more stock from the central warehouse. Ensure your branch always has what it needs.",
      image: "/salon-5.png"
    };
  }

  return (
    <div className="rounded-xl overflow-hidden bg-[#242423] flex h-[220px] shadow-sm relative border border-gray-800">
      <div className="p-10 flex-1 flex flex-col justify-center text-white relative z-10">
        <div suppressHydrationWarning className="inline-block border border-white/20 rounded-full px-3 py-1 text-[10px] tracking-widest font-mono mb-4 w-fit bg-white/5">
          {currentDate}
        </div>
        <h2 suppressHydrationWarning className="text-3xl font-serif font-light mb-2">{config.title}</h2>
        <p className="text-sm text-gray-400 max-w-md leading-relaxed">
          {config.description}
        </p>
      </div>
      <div className="w-[45%] h-full relative shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#242423] via-[#242423]/50 to-transparent z-10"></div>
        <img 
          suppressHydrationWarning
          src={config.image} 
          alt={config.title} 
          className="w-full h-full object-cover grayscale opacity-90"
        />
      </div>
    </div>
  );
}
