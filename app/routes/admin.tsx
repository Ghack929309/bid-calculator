import { useState } from "react";
import {
  Archive,
  GitBranchPlus,
  Globe,
  Pencil,
  Trash2,
  Variable,
} from "lucide-react";
import { AddLogic } from "~/components/add-logic";
import {
  CalculationType,
  ConditionalCalculationType,
  InputFieldType,
  LogicFieldType,
  SimpleCalculationType,
} from "~/lib/types";
import { AddField } from "~/components/add-field";
import { DynamicForm } from "~/components/dynamic-form";
import { getInitialFieldState } from "~/lib/utils";
import { AddSection } from "~/components/add-section";
import { CreateField } from "~/components/create-field";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { db } from "~/services/database-service";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import { calculationService } from "~/services/calculation-service";
import { Result } from "~/components/result";
import { AddVariableField } from "~/components/add-variable-field";
import { CalculatorProvider } from "~/lib/calculator-context";
import { Render } from "~/components/render";

export enum Action {
  createSection = "createSection",
  createMilesVariableField = "createMilesVariableField",
  createPriceRangeVariableField = "createPriceRangeVariableField",
  updateMilesVariableField = "updateMilesVariableField",
  deleteMilesVariableField = "deleteMilesVariableField",
  updatePriceRangeVariableField = "updatePriceRangeVariableField",
  deletePriceRangeVariableField = "deletePriceRangeVariableField",
  deleteSection = "deleteSection",
  createField = "createField",
  createLogicField = "createLogicField",
  updateLogicField = "updateLogicField",
  deleteLogicField = "deleteLogicField",
  toggleSectionVisibility = "toggleSectionVisibility",
  updateField = "updateField",
  deleteField = "deleteField",
  createAndUpdateCalculation = "createAndUpdateCalculation",
  deleteCalculation = "deleteCalculation",
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();
    const { action, data } = body;
    switch (action) {
      case Action.toggleSectionVisibility: {
        return json({
          error: null,
          data: await db.toggleSectionVisibility({
            sectionId: data.sectionId,
            isPublished: data.isPublished,
          }),
        });
      }
      case Action.createMilesVariableField: {
        return json({
          error: null,
          data: await db.createMilesVariableField(data),
        });
      }
      case Action.updateMilesVariableField: {
        console.log("update miles variable field", data);
        return json({
          error: null,
          data: await db.updateMilesVariableField(data),
        });
      }
      case Action.deleteMilesVariableField: {
        console.log("delete miles variable field", data);
        return json({
          error: null,
          data: await db.deleteMilesVariableField(data.id),
        });
      }
      case Action.createPriceRangeVariableField: {
        console.log("create price range variable field", data);
        return json({
          error: null,
          data: await db.createPriceRangeVariableField(data),
        });
      }
      case Action.updatePriceRangeVariableField: {
        return json({
          error: null,
          data: await db.updatePriceRangeVariableField(data),
        });
      }
      case Action.deletePriceRangeVariableField: {
        return json({
          error: null,
          data: await db.deletePriceRangeVariableField(data.id),
        });
      }
      case Action.deleteSection: {
        return json({
          error: null,
          data: await db.deleteSection(data.sectionId),
        });
      }
      case Action.deleteLogicField: {
        return json({
          error: null,
          data: await db.deleteLogicField(data.id),
        });
      }
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
        const field = data as InputFieldType;
        console.log("update field in update field", field);
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
      case Action.createAndUpdateCalculation: {
        const isExist = await db.getCalculationByLogicId(data.logicId);
        console.log("isExist", isExist);
        if (isExist?.id) {
          console.log("update calculation", data);
          return {
            error: null,
            data: await db.updateCalculation(data),
          };
        }
        console.log("create calculation", data);
        return {
          error: null,
          data: await db.createCalculation(data),
        };
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
    const sectionId = searchParams.get("section") || sections[0]?.id;

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
  const [activeLogicId, setActiveLogicId] = useState<string | null>(null);
  const calcFetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(sectionId);
  const selectedSection = sections?.find((s) => s?.id === activeTab);
  const isPublished = selectedSection?.isPublished;
  const [displayResult, setDisplayResult] = useState(false);
  const [calculationResults, setCalculationResults] = useState<
    Array<{ name: string; result: number }>
  >([]);

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

  const handleAddField = (field: InputFieldType) => {
    if (!activeTab) return;
    calcFetcher.submit(
      {
        action: Action.createField,
        data: {
          field,
          sectionId: activeTab,
        },
      },
      { method: "post", encType: "application/json" }
    );
  };
  const handleSaveMilesVariable = (field: InputFieldType) => {
    const fieldWithSection = {
      ...field,
      sectionId: activeTab,
    };

    calcFetcher.submit(
      {
        action: Action.createMilesVariableField,
        data: fieldWithSection,
      },
      { method: "post", encType: "application/json" }
    );
  };
  const handleUpdateMilesVariableField = (field: InputFieldType) => {
    calcFetcher.submit(
      { action: Action.updateMilesVariableField, data: field },
      { method: "post", encType: "application/json" }
    );
  };
  const handleDeleteMilesVariableField = (id: string) => {
    calcFetcher.submit(
      { action: Action.deleteMilesVariableField, data: { id } },
      { method: "post", encType: "application/json" }
    );
  };

  const handleUpdateField = (field: InputFieldType) => {
    console.log("field from handle update field", field);
    calcFetcher.submit(
      { action: Action.updateField, data: field },
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

  const handleToggleSectionVisibility = () => {
    if (!selectedSection) return;
    calcFetcher.submit(
      {
        action: Action.toggleSectionVisibility,
        data: { sectionId, isPublished: selectedSection.isPublished },
      },
      { method: "post", encType: "application/json" }
    );
  };

  const handleDeleteSection = () => {
    calcFetcher.submit(
      {
        action: Action.deleteSection,
        data: { sectionId },
      },
      {
        method: "post",
        encType: "application/json",
      }
    );
  };

  const handleDeleteLogicField = (id: string) => {
    calcFetcher.submit(
      { action: Action.deleteLogicField, data: { id } },
      { method: "post", encType: "application/json" }
    );
  };

  const handleSavePriceRangeVariable = (field: InputFieldType) => {
    calcFetcher.submit(
      {
        action: Action.createPriceRangeVariableField,
        data: { ...field, sectionId: activeTab },
      },
      { method: "post", encType: "application/json" }
    );
  };

  const handleUpdatePriceRangeVariableField = (field: InputFieldType) => {
    calcFetcher.submit(
      { action: Action.updatePriceRangeVariableField, data: field },
      { method: "post", encType: "application/json" }
    );
  };

  const handleDeletePriceRangeVariableField = (id: string) => {
    calcFetcher.submit(
      { action: Action.deletePriceRangeVariableField, data: { id } },
      { method: "post", encType: "application/json" }
    );
  };

  const handleFormSubmit = (formData: Record<string, string>) => {
    try {
      // Filter logic fields that belong to the current section
      const sectionLogicFields = logicFields.filter(
        (logic) => logic.sectionId === activeTab
      );

      // Get calculations for each logic field and compute results
      const results = sectionLogicFields
        .map((logic) => {
          const calculation = calculations.find(
            (calc) => calc.logicId === logic.id
          );
          if (!calculation) return null;

          const result = calculationService.computeCalculation(
            calculation,
            fields as InputFieldType[],
            formData
          );

          return {
            name: logic.name,
            result: Number(result.toFixed(2)), // Round to 2 decimal places
          };
        })
        .filter(
          (result): result is { name: string; result: number } =>
            result !== null
        );

      setCalculationResults(results);
      setDisplayResult(true);
      return results; // Return results for potential further processing
    } catch (error) {
      console.error("Calculation error:", error);
      throw error;
    }
  };
  console.log("calculations from admin", calculations);
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
            fields={fields as unknown as InputFieldType[]}
            onSubmit={handleFormSubmit}
            isEditing={true}
            sectionId={activeTab}
            handleDeleteField={handleDeleteField}
            handleUpdateField={handleUpdateField}
            handleUpdateMilesVariableField={handleUpdateMilesVariableField}
            handleDeleteMilesVariableField={handleDeleteMilesVariableField}
            updatePriceRangeVariableField={handleUpdatePriceRangeVariableField}
            handleDeletePriceRangeVariableField={
              handleDeletePriceRangeVariableField
            }
          />

          {displayResult && (
            <Result
              calculations={calculationResults}
              onClose={() => setDisplayResult(false)}
            />
          )}

          {/* Save Button */}
          <div className="mt-8 flex gap-x-3 items-end justify-end">
            <AddVariableField
              availableFields={fields as unknown as InputFieldType[]}
              onSaveMiles={handleSaveMilesVariable}
              onSavePriceRange={handleSavePriceRangeVariable}
              trigger={
                <Variable className="w-4 h-4 cursor-pointer text-gray-600 hover:text-gray-700" />
              }
            />
            <AddField
              sectionId={activeTab}
              initialField={getInitialFieldState({ type: "number" })}
              handleAddField={handleAddField}
              trigger={
                <GitBranchPlus className="w-4 h-4 cursor-pointer text-orange-500 hover:text-orange-700" />
              }
            />

            {isPublished ? (
              <Archive
                onClick={handleToggleSectionVisibility}
                className="w-4 h-4 cursor-pointer text-gray-600 hover:text-gray-700"
              />
            ) : (
              <Globe
                onClick={handleToggleSectionVisibility}
                className="w-4 h-4 cursor-pointer text-green-600 hover:text-green-700"
              />
            )}
            <Trash2
              onClick={handleDeleteSection}
              className="w-4 h-4 cursor-pointer text-red-600 hover:text-red-700"
            />
          </div>
        </div>
      </section>
      <section>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Calculator Logics</h1>
          <p className="text-gray-600 mt-2">Manage logic for each field</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <CalculatorProvider>
            {logicFields?.map((logic: any) => {
              return (
                <div
                  key={logic.id}
                  className="flex items-center justify-between"
                >
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
                    <GitBranchPlus
                      onClick={() => setActiveLogicId(logic.id)}
                      className="w-4 h-4 cursor-pointer text-orange-500 hover:text-orange-700"
                    />
                    <Render when={activeLogicId === logic.id}>
                      <AddLogic
                        open={activeLogicId === logic.id}
                        close={() => setActiveLogicId(null)}
                        allCalculations={calculations as any}
                        logicId={logic.id}
                        fields={fields as InputFieldType[]}
                        logicalField={logicFields as LogicFieldType[]}
                      />
                    </Render>
                    <Trash2
                      onClick={() => handleDeleteLogicField(logic.id)}
                      className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
                    />
                  </div>
                </div>
              );
            })}
            <CreateField
              handleAddField={handleAddLogicalField}
              handleUpdateField={handleUpdateLogicalField}
            />
          </CalculatorProvider>
        </div>
      </section>
    </div>
  );
};

export default CalculatorAdmin;
