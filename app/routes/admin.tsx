import { useState } from "react";
import { Settings, DollarSign, Truck, Package, Shield } from "lucide-react";
import { AddLogic } from "~/components/add-logic";
import { LogicFieldType, InputFieldType } from "~/lib/types";
import { AddField } from "~/components/add-field";
import { DynamicForm } from "~/components/dynamic-form";
import { getInitialFieldState, isBrowser } from "~/lib/utils";
import { Button } from "~/components/ui/button";

const CalculatorAdmin = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [fields, setFields] = useState<InputFieldType[]>(
    isBrowser ? JSON.parse(localStorage?.getItem("fields") || "[]") : []
  );
  const [fieldsLogic, setFieldsLogic] = useState<LogicFieldType[]>(
    isBrowser ? JSON.parse(localStorage?.getItem("fieldsLogic") || "[]") : []
  );

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
  };

  const handleAddLogic = (field: LogicFieldType) => {
    setFieldsLogic([...fieldsLogic, field]);
    localStorage?.setItem(
      "fieldsLogic",
      JSON.stringify([...fieldsLogic, field])
    );
  };

  const handleAddField = (field: InputFieldType) => {
    setFields([...fields, field]);
    localStorage?.setItem("fields", JSON.stringify([...fields, field]));
  };

  const handleUpdateField = (field: InputFieldType) => {
    console.log("field from handleUpdateField", field);
    const isFieldExists = fields.find((f) => f.id === field.id);
    if (isFieldExists) {
      const updatedFields = fields.map((f) => (f.id === field.id ? field : f));
      setFields(updatedFields);
      localStorage?.setItem("fields", JSON.stringify(updatedFields));
    }
  };

  const handleDeleteField = (field: InputFieldType) => {
    const updatedFields = fields.filter((f) => f.name !== field.name);
    setFields(updatedFields);
    localStorage?.setItem("fields", JSON.stringify(updatedFields));
  };

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
        {activeTab === "general" && (
          <DynamicForm
            fields={fields}
            onSubmit={() => {}}
            isEditing={true}
            handleDeleteField={handleDeleteField}
            handleUpdateField={handleUpdateField}
          />
        )}
        {/* {activeTab === "duty" && renderDutyRates()}
        {activeTab === "shipping" && renderShippingRates()} */}
        {activeTab === "auction" && renderAuctionFees()}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <AddLogic handleAddLogic={handleAddLogic} />

          <AddField
            initialField={getInitialFieldState({ type: "number" })}
            handleAddField={handleAddField}
          />

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
