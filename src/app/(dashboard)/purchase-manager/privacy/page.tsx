import React from "react";

export default function PrivacyPage() {
  return (
    <div className="w-full bg-[#fbfaf8] min-h-screen py-24 md:py-32">
      <div className="max-w-[900px] mx-auto px-6 md:px-12 bg-white p-12 md:p-20 shadow-sm border border-gray-100">
        <div className="mb-16">
          <span className="text-[#c0a887] text-[11px] font-bold tracking-[0.2em] uppercase mb-4 block">Legal Information</span>
          <h1 className="text-4xl md:text-5xl text-black tracking-[0.05em]" style={{ fontFamily: "var(--font-bebas)" }}>
            PRIVACY POLICY
          </h1>
          <p className="text-gray-500 text-sm mt-4">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-10 text-gray-700 text-sm md:text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-4 text-black tracking-widest uppercase" style={{ fontFamily: "var(--font-bebas)" }}>1. Data Collection</h2>
            <p>
              We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey, or fill out a form. When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, mailing address, phone number, or credit card information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-black tracking-widest uppercase" style={{ fontFamily: "var(--font-bebas)" }}>2. Use of Information</h2>
            <p>
              Any of the information we collect from you may be used in one of the following ways:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>To personalize your experience and better respond to your individual needs.</li>
              <li>To improve our website offerings based on the information and feedback we receive from you.</li>
              <li>To improve customer service and effectively respond to your customer service requests and support needs.</li>
              <li>To process transactions securely and efficiently.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-black tracking-widest uppercase" style={{ fontFamily: "var(--font-bebas)" }}>3. Information Protection</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-black tracking-widest uppercase" style={{ fontFamily: "var(--font-bebas)" }}>4. Third Party Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
