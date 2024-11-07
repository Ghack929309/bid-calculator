import { useMemo, useState } from "react";
import { Pencil, Shield } from "lucide-react";
import { AddLogic } from "~/components/add-logic";
import { InputFieldType } from "~/lib/types";
import { AddField } from "~/components/add-field";
import { DynamicForm } from "~/components/dynamic-form";
import { getInitialFieldState, isBrowser } from "~/lib/utils";
import { AddSection } from "~/components/add-section";
import { v4 as uuidv4 } from "uuid";
import { CreateField } from "~/components/create-field";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { db } from "~/services/database-service";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";

enum Action {
  createSection = "createSection",
  createField = "createField",
  updateField = "updateField",
  deleteField = "deleteField",
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();
    const { action, data } = body;
    switch (action) {
      case Action.createSection: {
        const sections = await db.getSections();
        if (sections.includes(data.name)) {
          return json(
            { error: "Section already exists", data: null },
            { status: 400 }
          );
        }
        const section = await db.createSection(data.name);
        return json({ error: null, data: section });
      }
      case Action.createField: {
        const { sectionId, field } = data;
        return db.createField(field, sectionId);
      }
      default:
        return json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Failed to perform action", error);
    return json(
      { error: "Failed to perform action", data: null },
      { status: 500 }
    );
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const searchParams = new URLSearchParams(request.url);
    const sections = await db.getSections();
    const sectionId =
      searchParams.get("section") || sections?.[0]?.id || undefined;
    console.log("sectionId", sectionId);
    if (!sectionId) {
      return json({
        fields: [],
        sections: [],
        logicFields: [],
        sectionId: undefined,
      });
    }
    const fields = await db.getFields(sectionId);
    console.log("fields", fields);
    const logicFields = await db.getLogicFields(sectionId);
    return json({ fields, sections, logicFields, sectionId });
  } catch (error) {
    console.error("Failed to fetch data", error);
    return json(
      { fields: [], sections: [], logicFields: [], sectionId: undefined },
      { status: 500 }
    );
  }
}

const CalculatorAdmin = () => {
  const { fields, sections, logicFields, sectionId } =
    useLoaderData<typeof loader>();
  const calcFetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();

  console.log("fields", fields);
  console.log("sections", sections);
  console.log("logicFields", logicFields);
  const [saved, setSaved] = useState(false);
  // const [fields, setFields] = useState<InputFieldType[]>(
  //   isBrowser ? JSON.parse(localStorage?.getItem("fields") || "[]") : []
  // );
  // const [sections, setSections] = useState<string[]>(
  //   isBrowser ? JSON.parse(localStorage?.getItem("sections") || "[]") : []
  // );
  const [activeTab, setActiveTab] = useState(sectionId);

  // const [logicFields, setLogicFields] = useState<
  //   { id: string; name: string; section: string }[]
  // >(isBrowser ? JSON.parse(localStorage?.getItem("logicFields") || "[]") : []);
  // const logicsBasedOnActiveTab = useMemo(
  //   () => logicFields?.filter((f) => f.section === activeTab),
  //   [logicFields, activeTab]
  // );
  console.log("logicFields", logicFields);
  const handleSave = () => {
    // This would send the data to your backend
  };

  const handleAddSection = (section: string) => {
    calcFetcher.submit(
      { action: Action.createSection, data: { name: section } },
      { method: "post", encType: "application/json" }
    );
  };

  const handleSelectSectionTab = (sectionId: string) => {
    setActiveTab(sectionId);
    setSearchParams({ section: sectionId });
  };

  const handleDeleteSection = (section: string) => {
    const updatedSections = sections.filter((s) => s !== section);
    setSections(updatedSections);
    localStorage?.setItem("sections", JSON.stringify(updatedSections));
  };

  const handleAddField = (field: InputFieldType) => {
    if (!activeTab) return;
    calcFetcher.submit(
      { action: Action.createField, data: { field, sectionId: activeTab } },
      { method: "post", encType: "application/json" }
    );
  };

  const handleUpdateField = (field: InputFieldType) => {
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
    setLogicFields((prev) => [...prev, { id, name, section: activeTab }]);
    localStorage?.setItem(
      "logicFields",
      JSON.stringify([...logicFields, { id, name, section: activeTab }])
    );
  };
  const handleUpdateLogicalField = (id: string, name: string) => {
    const updatedLogic = logicFields.map((f) =>
      f.id === id ? { id, name, section: activeTab } : f
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
          {sections?.map((section) => (
            <button
              key={section?.id}
              onClick={() => handleSelectSectionTab(section?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === section?.id
                  ? "bg-white shadow"
                  : "hover:bg-gray-200"
              }`}
            >
              <span>{section?.name}</span>
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
          {[]?.map((logic) => (
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
                <AddLogic logicId={logic.id} fields={fields} />
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
