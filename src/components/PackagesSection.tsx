import { useState } from "react";
import PackageCard from "./PackageCard";
import { currencies, packages } from "../data/data";

const PackagesSection = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const convertPrice = (priceUSD: number) => {
    const converted = priceUSD * selectedCurrency.rate;
    return `${selectedCurrency.symbol}${Math.round(converted)}`;
  };

  return (
    <div id="packages" className="w-full px-6 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Lead Packages
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect package for your business needs
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-gray-600">Currency:</span>
            <select
              value={selectedCurrency.code}
              onChange={(e) => {
                const currency = currencies.find(
                  (c) => c.code === e.target.value
                );
                if (currency) setSelectedCurrency(currency);
              }}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#007AFF] bg-white"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              price={pkg.priceUSD}
            />
          ))}
        </div>
        <div className="mt-16 text-center">
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              🎯 Full Access Package
            </h3>
            <p className="text-gray-600 mb-4">
              Get ALL categories + bonuses — 10+ million verified leads
            </p>
            <p className="text-4xl font-bold text-[#007AFF] mb-6">
              {convertPrice(299)}
            </p>
            <button className="px-8 py-4 bg-[#007AFF] text-white rounded-full font-semibold text-lg hover:bg-[#0066DD] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Buy Full Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesSection;
