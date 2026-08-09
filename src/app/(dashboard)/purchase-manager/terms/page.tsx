import React from "react";

export default function TermsPage() {
  return (
    <div className="w-full bg-[#fbfaf8] min-h-screen py-24 md:py-32">
      <div className="max-w-[900px] mx-auto px-6 md:px-12 bg-white p-12 md:p-20 shadow-sm border border-gray-100">
        <div className="mb-16">
          <span className="text-[#c0a887] text-[11px] font-bold tracking-[0.2em] uppercase mb-4 block">Legal Information</span>
          <h1 className="text-4xl md:text-5xl text-black tracking-[0.05em]" style={{ fontFamily: "var(--font-bebas)" }}>
            TERMS OF SERVICE
          </h1>
          <p className="text-gray-500 text-sm mt-4">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-10 text-gray-700 text-sm md:text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-4 text-black tracking-widest uppercase" style={{ fontFamily: "var(--font-bebas)" }}>1. Introduction</h2>
            <p>
              Welcome to Beyond Demands. By accessing or using our wholesale salon supply platform, you agree to be bound by these Terms of Service. Please read them carefully. Our services are strictly designed for professional salons, distributors, and licensed professionals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-black tracking-widest uppercase" style={{ fontFamily: "var(--font-bebas)" }}>2. Wholesale Eligibility</h2>
            <p>
              To purchase from Beyond Demands, you must represent a registered business in the beauty or wellness industry. We reserve the right to request proof of licensure or business registration before approving an account or processing orders. 
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-black tracking-widest uppercase" style={{ fontFamily: "var(--font-bebas)" }}>3. Order Processing & Delivery</h2>
            <p>
              All orders are subject to availability and confirmation of the order price. Dispatch times may vary according to availability and any guarantees or representations made as to delivery times are limited to mainland deliveries and subject to any delays resulting from postal delays or force majeure for which we will not be responsible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-black tracking-widest uppercase" style={{ fontFamily: "var(--font-bebas)" }}>4. Pricing and Payment</h2>
            <p>
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-black tracking-widest uppercase" style={{ fontFamily: "var(--font-bebas)" }}>5. Returns and Refunds</h2>
            <p>
              Due to the nature of professional cosmetic and chemical supplies, returns are only accepted on unopened, unused merchandise within 14 days of delivery. Custom equipment orders are non-refundable. Contact your dedicated account manager to initiate a return.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
