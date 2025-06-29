"use client";

// react
import React from "react";

export default function Pricing() {
  return (
    <section className="relative z-10 flex flex-col min-h-screen justify-center items-center text-center bg-white font-spectral">
      <h1 className="text-4xl font-bold mb-8">Pricing</h1>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
        <div className="flex-1 bg-[#FBFBF9] border border-[#F0EEE7] rounded-3xl p-8 shadow-md flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-2">
            Unlimited Subscription
          </h2>

          <p className="text-gray-600 mb-4">
            Access all Tomas services, anytime you need.
          </p>
          <div className="flex items-end mb-4">
            <span className="text-4xl font-bold">$100</span>
            <span className="text-lg text-gray-500 ml-2">/month</span>
          </div>
          <span className="text-sm text-gray-500 mb-6">Paid in ETH</span>
          <ul className="text-left text-gray-700 mb-6 space-y-2">
            <li>✔️ Unlimited legal requests</li>
            <li>✔️ Priority support</li>
            <li>✔️ All document types</li>
            <li>✔️ Vault access</li>
          </ul>

          <button className="bg-black text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-[#2c3552] transition shadow-md">
            Start Subscription
          </button>
        </div>

        <div className="flex-1 bg-white border border-[#F0EEE7] rounded-3xl p-8 shadow-md flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-2">Pay Per Work</h2>
          <p className="text-gray-600 mb-4">
            Only pay for what you need, when you need it.
          </p>

          <div className="flex items-end mb-4">
            <span className="text-4xl font-bold">From $X</span>
            <span className="text-lg text-gray-500 ml-2">/work</span>
          </div>

          <span className="text-sm text-gray-500 mb-6">Paid in ETH</span>
          <ul className="text-left text-gray-700 mb-6 space-y-2">
            <li>✔️ One-time legal document</li>
            <li>✔️ Fast delivery</li>
            <li>✔️ Vault access</li>
          </ul>
          <button className="bg-black text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-[#2c3552] transition shadow-md">
            Request a Work
          </button>
        </div>
      </div>
      <p className="text-gray-400 text-sm mt-8">
        All payments are processed in Ethereum (ETH). We use Chainlink data
        feeds to convert USD to ETH.
      </p>
    </section>
  );
}
