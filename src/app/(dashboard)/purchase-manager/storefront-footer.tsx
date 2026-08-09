import Link from "next/link";

export function StorefrontFooter() {
  return (
    <footer className="bg-black text-white mt-auto py-12 md:py-16 font-sans border-t border-[#d5d2cc]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="flex flex-col gap-4 md:col-span-1">
          <span className="text-[26px] font-display tracking-tight leading-none text-white">
            Beyond<span className="italic font-light"> Demands</span>
          </span>
          <p className="text-[13px] text-white/70 leading-relaxed max-w-[250px] font-medium">
            High performance salon supplies with clean, powerful ingredients that truly care.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="text-[11px] font-bold tracking-widest uppercase text-white">Shop</h4>
          <Link href="/purchase-manager/catalogue" className="text-[13px] text-white/60 hover:text-white transition-colors">All Supplies</Link>
          <Link href="/purchase-manager/catalogue?cat=Hair+Care" className="text-[13px] text-white/60 hover:text-white transition-colors">Hair Care</Link>
          <Link href="/purchase-manager/catalogue?cat=Skin+Care" className="text-[13px] text-white/60 hover:text-white transition-colors">Skin Care</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-[11px] font-bold tracking-widest uppercase text-white">Support</h4>
          <Link href="/purchase-manager/orders" className="text-[13px] text-white/60 hover:text-white transition-colors">Returns & Orders</Link>
          <Link href="/purchase-manager/account" className="text-[13px] text-white/60 hover:text-white transition-colors">Manage Account</Link>
          <Link href="/purchase-manager/account/addresses" className="text-[13px] text-white/60 hover:text-white transition-colors">Addresses</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-[11px] font-bold tracking-widest uppercase text-white">Newsletter</h4>
          <p className="text-[13px] text-white/70">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="flex mt-2 border-b border-white/30 focus-within:border-white transition-colors pb-2">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-transparent border-none outline-none text-[13px] text-white placeholder-white/50 flex-1 min-w-0"
            />
            <button type="button" className="text-[11px] font-bold tracking-widest uppercase text-white/70 hover:text-white transition-colors shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-12 mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-white/50">
        <p>© {new Date().getFullYear()} Beyond Demands. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/purchase-manager/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/purchase-manager/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
