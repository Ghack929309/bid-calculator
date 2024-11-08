import { useMemo, useState } from "react";
import { Pencil, Shield } from "lucide-react";
import { AddLogic } from "~/components/add-logic";
import {
  InputFieldType,
  LogicFieldType,
  SimpleCalculationType,
} from "~/lib/types";
import { AddField } from "~/components/add-field";
import { DynamicForm } from "~/components/dynamic-form";
import { getInitialFieldState, isBrowser } from "~/lib/utils";
import { AddSection } from "~/components/add-section";
import { v4 as uuidv4 } from "uuid";
import { CreateField } from "~/components/create-field";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { db } from "~/services/database-service";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";

export enum Action {
  createSection = "createSection",
  createField = "createField",
  createLogicField = "createLogicField",
  updateLogicField = "updateLogicField",
  updateField = "updateField",
  deleteField = "deleteField",
  createCalculation = "createCalculation",
  updateCalculation = "updateCalculation",
  deleteCalculation = "deleteCalculation",
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
        const { field } = data;
        return json({
          error: null,
          data: await db.createField(field),
        });
      }
      case Action.updateField: {
        const field = data.field as InputFieldType;
        if (!field)
          return json(
            { error: "Field id is required", data: null },
            { status: 400 }
          );
        const result = await db.updateField(field);
        return json({
          error: null,
          data: result,
        });
      }
      case Action.deleteField: {
        return json({
          error: null,
          data: await db.deleteField(data.id),
        });
      }
      case Action.createLogicField: {
        return json({
          error: null,
          data: await db.createLogicField(data),
        });
      }
      case Action.updateLogicField: {
        return json({
          error: null,
          data: await db.updateLogicField(data),
        });
      }
      case Action.createCalculation: {
        console.log("create calculation", data);
        return json({
          error: null,
          data: await db.createCalculation(data),
        });
      }
      case Action.updateCalculation: {
        return json({
          error: null,
          data: await db.updateCalculation(data),
        });
      }
      case Action.deleteCalculation: {
        return json({
          error: null,
          data: await db.deleteCalculation(data.id),
        });
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
    const searchParams = new URLSearchParams(new URL(request.url).search);
    const sections = await db.getSections();
    const sectionId =
      searchParams.get("section") || sections[0]?.id || undefined;

    if (!sectionId) {
      return json({
        fields: [],
        sections: [],
        logicFields: [],
        sectionId: undefined,
        calculations: [],
      });
    }
    const fields = await db.getFieldBySectionId(sectionId);
    const logicFields = await db.getLogicFields(sectionId);
    const calculations = await db.getCalculations();
    return json({ fields, sections, logicFields, sectionId, calculations });
  } catch (error) {
    console.error("Failed to fetch data", error);
    return json(
      {
        fields: [],
        sections: [],
        logicFields: [],
        sectionId: undefined,
        calculations: [],
      },
      { status: 500 }
    );
  }
}

const CalculatorAdmin = () => {
  const { fields, sections, logicFields, sectionId, calculations } =
    useLoaderData<typeof loader>();
  const calcFetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(sectionId);

  console.log("fields", fields);
  console.log("sections", sections);
  console.log("logicFields", logicFields);
  console.log("calculations", calculations);
  const [saved, setSaved] = useState(false);

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
    searchParams.set("section", sectionId);
    setSearchParams(searchParams);
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
    console.log("field from handle update field", field);
    calcFetcher.submit(
      { action: Action.updateField, data: { field } },
      { method: "post", encType: "application/json" }
    );
  };

  const handleDeleteField = (field: InputFieldType) => {
    calcFetcher.submit(
      { action: Action.deleteField, data: { id: field.id } },
      { method: "post", encType: "application/json" }
    );
  };

  const handleAddLogicalField = (name: string) => {
    calcFetcher.submit(
      { action: Action.createLogicField, data: { name, sectionId: activeTab } },
      { method: "post", encType: "application/json" }
    );
  };

  const handleUpdateLogicalField = (id: string, name: string) => {
    calcFetcher.submit(
      { action: Action.updateLogicField, data: { id, name } },
      { method: "post", encType: "application/json" }
    );
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
            sectionId={activeTab}
            fields={fields as unknown as InputFieldType[]}
            onSubmit={() => {}}
            isEditing={true}
            handleDeleteField={handleDeleteField}
            handleUpdateField={handleUpdateField}
          />

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <AddField
              sectionId={activeTab}
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
                <AddLogic
                  logicId={logic.id}
                  fields={fields as InputFieldType[]}
                  logicalField={logicFields as LogicFieldType[]}
                  initialCalculations={
                    calculations.filter(
                      (cal) => cal.logicId === logic.id
                    ) as SimpleCalculationType[]
                  }
                />
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
