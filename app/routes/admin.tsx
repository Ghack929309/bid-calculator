import { useState } from "react";
import { Pencil, Shield } from "lucide-react";
import { AddLogic } from "~/components/add-logic";
import { LogicFieldType, InputFieldType } from "~/lib/types";
import { AddField } from "~/components/add-field";
import { DynamicForm } from "~/components/dynamic-form";
import { getInitialFieldState, isBrowser } from "~/lib/utils";
import { AddSection } from "~/components/add-section";
import { v4 as uuidv4 } from "uuid";
import { CreateField } from "~/components/create-field";

const CalculatorAdmin = () => {
  const [saved, setSaved] = useState(false);
  const [fields, setFields] = useState<InputFieldType[]>(
    isBrowser ? JSON.parse(localStorage?.getItem("fields") || "[]") : []
  );
  const [logicFields, setLogicFields] = useState<
    { id: string; name: string }[]
  >(isBrowser ? JSON.parse(localStorage?.getItem("logicFields") || "[]") : []);
  const [sections, setSections] = useState<string[]>(
    isBrowser ? JSON.parse(localStorage?.getItem("sections") || "[]") : []
  );
  const [activeTab, setActiveTab] = useState(sections[0]);

  const handleSave = () => {
    // This would send the data to your backend
  };

  const handleAddSection = (section: string) => {
    // TODO: validate section name, check if it already exists
    setSections([...sections, section]);
    localStorage?.setItem("sections", JSON.stringify([...sections, section]));
  };

  const handleDeleteSection = (section: string) => {
    const updatedSections = sections.filter((s) => s !== section);
    setSections(updatedSections);
    localStorage?.setItem("sections", JSON.stringify(updatedSections));
  };

  const handleAddLogic = (field: LogicFieldType) => {
    setLogicFields([...logicFields, field]);
    localStorage?.setItem(
      "logicFields",
      JSON.stringify([...logicFields, field])
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
  const handleAddLogicalField = (name: string) => {
    const id = uuidv4();
    setLogicFields((prev) => [...prev, { id, name }]);
    localStorage?.setItem(
      "logicFields",
      JSON.stringify([...logicFields, { id, name }])
    );
  };
  const handleUpdateLogicalField = (id: string, name: string) => {
    const updatedLogic = logicFields.map((f) =>
      f.id === id ? { id, name } : f
    );
    setLogicFields(updatedLogic);
    localStorage?.setItem("logicFields", JSON.stringify(updatedLogic));
  };
  return (
    <div className="max-w-7xl mx-auto p-6">
      <section>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Calculator Administration</h1>
          <p className="text-gray-600 mt-2">
            Manage fees, rates, and calculation parameters
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveTab(section)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === section ? "bg-white shadow" : "hover:bg-gray-200"
              }`}
            >
              <span>{section}</span>
            </button>
          ))}
          <AddSection handleAddSection={handleAddSection} />
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          <DynamicForm
            section={activeTab}
            fields={fields}
            onSubmit={() => {}}
            isEditing={true}
            handleDeleteField={handleDeleteField}
            handleUpdateField={handleUpdateField}
          />

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <AddField
              section={activeTab}
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
      </section>
      <section>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Calculator Logics</h1>
          <p className="text-gray-600 mt-2">Manage logic for each field</p>
        </div>
        <div>
          {logicFields?.map((logic) => (
            <div key={logic.id} className="flex items-center justify-between">
              <p>{logic.name}</p>
              <div className="flex items-center space-x-2">
                <CreateField
                  trigger={
                    <Pencil className="w-4 h-4 cursor-pointer text-blue-600" />
                  }
                  id={logic.id}
                  name={logic.name}
                  handleAddField={handleAddLogicalField}
                  handleUpdateField={handleUpdateLogicalField}
                />
                <AddLogic logicName={logic.name} fields={fields} />
              </div>
            </div>
          ))}
          <CreateField
            handleAddField={handleAddLogicalField}
            handleUpdateField={handleUpdateLogicalField}
          />
        </div>
      </section>
    </div>
  );
};

export default CalculatorAdmin;
