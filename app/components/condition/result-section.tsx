import {
  ConditionType,
  InputFieldType,
  LogicFieldType,
  MathOperations,
  SimpleCalculationType,
  CalculationOperation,
} from "~/lib/types";
import { Input } from "../ui/input";
import { OperationSelector } from "./operation-selector";
import { SimpleCalculation } from "../simple-calculation";
import { CompareValueSection } from "./compare-value-section";
import { defaultSimpleOperations } from "~/lib/constant";
import { useState } from "react";

type ResultSectionProps = {
  condition: ConditionType;
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  type: "then" | "else";
  onUpdate: (updates: Partial<ConditionType>) => void;
};

export const ResultSection = ({
  condition,
  fields,
  logicFields,
  type,
  onUpdate,
}: ResultSectionProps) => {
  const isElse = type === "else";
  const value = isElse ? condition.elseValue : condition.thenValue;
  const operation = isElse ? condition.elseOperation : condition.thenOperation;
  const initialCalculations = isElse
    ? { ...condition.elseCalculations, operations: [defaultSimpleOperations] }
    : { ...condition.thenCalculations, operations: [defaultSimpleOperations] };
  const [calculation, setCalculation] = useState<SimpleCalculationType>(
    initialCalculations as SimpleCalculationType
  );

  const addMoreOperation = () => {
    setCalculation((prev) => ({
      ...prev,
      operations: [
        ...(prev?.operations || []),
        defaultSimpleOperations as CalculationOperation,
      ],
    }));
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        <Input
          type="number"
          value={value}
          onChange={(e) =>
            onUpdate({
              [isElse ? "elseValue" : "thenValue"]: e.target.value,
            })
          }
          placeholder="Enter value"
          className="flex-1"
        />
        <OperationSelector
          value={operation}
          onValueChange={(value) =>
            onUpdate({
              [isElse ? "elseOperation" : "thenOperation"]: value,
              [isElse ? "elseCalculations" : "thenCalculations"]: {
                ...calculation,
                operations: calculation?.operations || [],
              },
            })
          }
        />
      </div>

      {operation !== MathOperations.NONE && (
        <div className="border rounded-lg p-4 bg-slate-50">
          {operation === MathOperations.PERCENTAGE ? (
            <CompareValueSection
              condition={condition}
              fields={fields}
              logicFields={logicFields}
              onUpdate={onUpdate}
            />
          ) : (
            <SimpleCalculation
              calculation={calculation}
              addMoreOperation={addMoreOperation}
              fields={fields}
              logicFields={logicFields}
              updateOperation={(operation) =>
                onUpdate({
                  [isElse ? "elseCalculations" : "thenCalculations"]: {
                    ...calculation,
                    operations: [operation],
                  },
                })
              }
              onDelete={() => {
                onUpdate({
                  [isElse ? "elseOperation" : "thenOperation"]:
                    MathOperations.NONE,
                  [isElse ? "elseCalculations" : "thenCalculations"]: {
                    ...calculation,
                    operations: [],
                  },
                });
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
