import React, { useState } from "react";
import {
  Settings,
  DollarSign,
  Truck,
  Package,
  Map,
  Shield,
  BarChart,
  PlusCircle,
} from "lucide-react";
import { AddLogic } from "~/components/add-Logic";
import { Field } from "~/lib/types";
import { AddField } from "~/components/add-field";

const CalculatorAdmin = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);

  // State for general settings
  const [generalSettings, setGeneralSettings] = useState({
    serviceFeeBase: 1500,
    serviceFeePercentage: 10,
    serviceFeePriceThreshold: 20000,
    inspectionFee: 500,
    japanLandingFee: 340,
    processingFeePercentage: 1,
    bankTransferFeePercentage: 5,
    brokerageFee: 350,
    levyFee: 250,
  });

  // State for duty rates
  const [dutyRates, setDutyRates] = useState({
    petrol: 65,
    hybrid: 10,
    electric: 10,
  });

  // State for shipping rates
  const [shippingRates, setShippingRates] = useState({
    Nassau: 1800,
    Freeport: 1600,
    Abaco: 1700,
  });

  // State for auction fees
  const [auctionFees, setAuctionFees] = useState({
    copart: {
      buyerFee: 945,
      titleFee: 20,
      gateFee: 95,
      environmentalFee: 15,
      virtualBidFee: 160,
    },
    iaai: {
      buyerFee: 800,
      titleFee: 20,
      gateFee: 95,
      environmentalFee: 15,
      liveBidFee: 139,
    },
  });

  const handleSave = () => {
    // This would send the data to your backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddField = (field: Field) => {
    setFields([...fields, field]);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">General Fee Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Base Service Fee ($)
            </label>
            <input
              type="number"
              value={generalSettings.serviceFeeBase}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  serviceFeeBase: parseFloat(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Service Fee Percentage (%)
            </label>
            <input
              type="number"
              value={generalSettings.serviceFeePercentage}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  serviceFeePercentage: parseFloat(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Service Fee Threshold ($)
            </label>
            <input
              type="number"
              value={generalSettings.serviceFeePriceThreshold}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  serviceFeePriceThreshold: parseFloat(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Inspection Fee ($)
            </label>
            <input
              type="number"
              value={generalSettings.inspectionFee}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  inspectionFee: parseFloat(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Processing Fee (%)
            </label>
            <input
              type="number"
              value={generalSettings.processingFeePercentage}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  processingFeePercentage: parseFloat(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Bank Transfer Fee (%)
            </label>
            <input
              type="number"
              value={generalSettings.bankTransferFeePercentage}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  bankTransferFeePercentage: parseFloat(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDutyRates = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Customs Duty Rates</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(dutyRates).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium capitalize">
              {key} Vehicles (%)
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) =>
                setDutyRates({
                  ...dutyRates,
                  [key]: parseFloat(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderShippingRates = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Shipping Rates by Destination</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(shippingRates).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium">{key} ($)</label>
            <input
              type="number"
              value={value}
              onChange={(e) =>
                setShippingRates({
                  ...shippingRates,
                  [key]: parseFloat(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderAuctionFees = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Copart Fees</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(auctionFees.copart).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()} ($)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) =>
                  setAuctionFees({
                    ...auctionFees,
                    copart: {
                      ...auctionFees.copart,
                      [key]: parseFloat(e.target.value),
                    },
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">IAAI Fees</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(auctionFees.iaai).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()} ($)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) =>
                  setAuctionFees({
                    ...auctionFees,
                    iaai: {
                      ...auctionFees.iaai,
                      [key]: parseFloat(e.target.value),
                    },
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Calculator Administration</h1>
        <p className="text-gray-600 mt-2">
          Manage fees, rates, and calculation parameters
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            activeTab === "general" ? "bg-white shadow" : "hover:bg-gray-200"
          }`}
        >
          <Settings size={20} />
          <span>General</span>
        </button>
        <button
          onClick={() => setActiveTab("duty")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            activeTab === "duty" ? "bg-white shadow" : "hover:bg-gray-200"
          }`}
        >
          <DollarSign size={20} />
          <span>Duty Rates</span>
        </button>
        <button
          onClick={() => setActiveTab("shipping")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            activeTab === "shipping" ? "bg-white shadow" : "hover:bg-gray-200"
          }`}
        >
          <Truck size={20} />
          <span>Shipping</span>
        </button>
        <button
          onClick={() => setActiveTab("auction")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            activeTab === "auction" ? "bg-white shadow" : "hover:bg-gray-200"
          }`}
        >
          <Package size={20} />
          <span>Auction Fees</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === "general" && renderGeneralSettings()}
        {activeTab === "duty" && renderDutyRates()}
        {activeTab === "shipping" && renderShippingRates()}
        {activeTab === "auction" && renderAuctionFees()}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <AddLogic handleAddField={handleAddField} />
          <AddField handleAddField={() => {}} />
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Shield size={20} />
            <span>{saved ? "Saved!" : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorAdmin;
