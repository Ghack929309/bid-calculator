import React, { useState, useEffect } from "react";
import { Calculator, DollarSign, Car, MapPin, Ship } from "lucide-react";

const VehicleCalculator = () => {
  const [formData, setFormData] = useState({
    purchaseType: "regular", // regular, copart, iaai
    vehicleType: "car", // car, truck, boat, heavyEquipment, atv
    engineType: "gasoline", // gasoline, hybrid, electric
    state: "Florida",
    destinationIsland: "Nassau",
    finalPrice: "",
    inspectionRequired: false,
    isJapanImport: false,
  });

  const [summary, setSummary] = useState({
    totalLandedCost: 0,
    totalDueToCustoms: 0,
    breakdown: {},
  });

  // Vehicle type options
  const vehicleTypes = [
    { value: "car", label: "Car/Van/SUV" },
    { value: "truck", label: "Truck" },
    { value: "boat", label: "Boat" },
    { value: "heavyEquipment", label: "Heavy Equipment" },
    { value: "atv", label: "ATV" },
  ];

  // States for domestic transport
  const states = [
    "Florida",
    "Georgia",
    "South Carolina",
    "Alabama",
    "North Carolina",
    "Tennessee",
    "Kentucky",
    "Mississippi",
    "Louisiana",
    "Delaware",
    // ... add other states
  ];

  // Islands for shipping
  const islands = ["Nassau", "Freeport", "Abaco"];

  const calculateCosts = () => {
    // This would be handled by the backend
    // For now, we'll just set some placeholder calculations
    setSummary({
      totalLandedCost: 0,
      totalDueToCustoms: 0,
      breakdown: {
        purchasePrice: parseFloat(formData.finalPrice) || 0,
        customsDuty: 0,
        vat: 0,
        processingFee: 0,
        levyFee: 250,
        shippingCost: 0,
        serviceFee: 0,
      },
    });
  };

  useEffect(() => {
    if (formData.finalPrice) {
      calculateCosts();
    }
  }, [formData]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 ">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Vehicle Import Calculator</h1>
        <p className="text-gray-600">
          Calculate your total landed cost including customs, shipping, and fees
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black ">
        {/* Left Column - Input Form */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          {/* Purchase Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Purchase Type</label>
            <div className="flex space-x-4">
              {["regular", "copart", "iaai"].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setFormData({ ...formData, purchaseType: type })
                  }
                  className={`px-4 py-2 rounded-md ${
                    formData.purchaseType === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Vehicle Type</label>
              <select
                value={formData.vehicleType}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleType: e.target.value })
                }
                className="mt-1 block w-full bg-white rounded-md border border-gray-300 p-2"
              >
                {vehicleTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Engine Type</label>
              <select
                value={formData.engineType}
                onChange={(e) =>
                  setFormData({ ...formData, engineType: e.target.value })
                }
                className="mt-1 block w-full bg-white rounded-md border border-gray-300 p-2"
              >
                <option value="gasoline">Gasoline</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                State of Purchase
              </label>
              <select
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="mt-1 block w-full bg-white rounded-md border border-gray-300 p-2"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Destination Island
              </label>
              <select
                value={formData.destinationIsland}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destinationIsland: e.target.value,
                  })
                }
                className="mt-1 block w-full bg-white rounded-md border border-gray-300 p-2"
              >
                {islands.map((island) => (
                  <option key={island} value={island}>
                    {island}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price and Options */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Final Price ($)
              </label>
              <input
                type="number"
                value={formData.finalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, finalPrice: e.target.value })
                }
                className="mt-1 block w-full bg-white rounded-md border border-gray-300 p-2"
                placeholder="Enter vehicle price"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.inspectionRequired}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inspectionRequired: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Include Inspection ($500)</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isJapanImport}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isJapanImport: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Japan Import</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Cost Summary */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Cost Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Purchase Price</span>
              <span className="font-semibold">
                ${summary.breakdown.purchasePrice?.toLocaleString() || "0"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Customs Duty</span>
              <span className="font-semibold">
                ${summary.breakdown.customsDuty?.toLocaleString() || "0"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>VAT</span>
              <span className="font-semibold">
                ${summary.breakdown.vat?.toLocaleString() || "0"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Shipping Cost</span>
              <span className="font-semibold">
                ${summary.breakdown.shippingCost?.toLocaleString() || "0"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Service Fee</span>
              <span className="font-semibold">
                ${summary.breakdown.serviceFee?.toLocaleString() || "0"}
              </span>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center font-bold">
                <span>Total Due to Customs</span>
                <span className="text-blue-600">
                  ${summary.totalDueToCustoms?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex justify-between items-center font-bold mt-2">
                <span>Total Landed Cost</span>
                <span className="text-green-600">
                  ${summary.totalLandedCost?.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCalculator;
