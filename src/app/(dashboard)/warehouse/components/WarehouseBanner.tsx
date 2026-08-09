"use client";

import { usePathname } from "next/navigation";

export function WarehouseBanner({ sessionName }: { sessionName: string }) {
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
    image: "/warehouse-banner.png"
  };

  if (pathname.includes("/queue")) {
    config = {
      title: `${greeting}, ${firstName}`,
      description: "Manage incoming orders from branches. Dispatch what you have and keep an order open, or close it and record what's still owed.",
      image: "/warehouse-queue.png"
    };
  } else if (pathname.includes("/inventory")) {
    config = {
      title: "Inventory Management",
      description: "Track and manage your entire product catalogue. Monitor stock levels and update inventory records in real-time.",
      image: "/warehouse-inventory.png"
    };
  } else if (pathname.includes("/outstanding")) {
    config = {
      title: "Pending Supplies",
      description: "Review items that are currently out of stock or pending fulfillment. Ensure backordered items are prioritized.",
      image: "/warehouse-outstanding.png"
    };
  } else if (pathname.includes("/import")) {
    config = {
      title: "Stock Import",
      description: "Upload and process new inventory sheets. Ensure newly arrived stock is rapidly integrated into the system.",
      image: "/warehouse_import.png"
    };
  } else if (pathname.includes("/log")) {
    config = {
      title: "Movement Log",
      description: "Review detailed logs of all inventory movements, adjustments, and fulfillment activities for auditing and tracking.",
      image: "/warehouse-log.png"
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
