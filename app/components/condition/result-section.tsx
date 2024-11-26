import {
  InputFieldType,
  LogicFieldType,
  MathOperations,
  ConditionalCalculationType,
} from "~/lib/types";
import { SimpleCalculation } from "../simple-calculation";
import { CompareValueSection } from "./compare-value-section";
import { defaultSimpleOperations } from "~/lib/constant";
import { useState } from "react";
import { v4 } from "uuid";

type ResultSectionProps = {
  condition: ConditionalCalculationType;
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  type: "then" | "else";
  onUpdate: (updates: Partial<ConditionalCalculationType>) => void;
};

export const ResultSection = ({
  condition,
  fields,
  logicFields,
  type,
  onUpdate,
}: ResultSectionProps) => {
  const isElse = type === "else";
  const operations = isElse
    ? condition.operations.else
    : condition.operations.then;
  const initialCalculations = isElse
    ? {
        ...condition,
        operations: {
          ...condition.operations,
          else: [defaultSimpleOperations],
        },
      }
    : {
        ...condition,
        operations: {
          ...condition.operations,
          then: [defaultSimpleOperations],
        },
      };
  const [calculation, setCalculation] = useState<ConditionalCalculationType>(
    initialCalculations as ConditionalCalculationType
  );

  const addMoreOperation = () => {
    setCalculation((prev) => ({
      ...prev,
      id: v4(),
      operations: {
        ...prev.operations,
        [type]: [...(prev.operations[type] || []), defaultSimpleOperations],
      },
    }));
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-col items-center gap-4">
        <SimpleCalculation
          calculationId={calculation.id}
          operations={
            type === "then"
              ? calculation.operations.then
              : calculation.operations.else
          }
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
              [isElse ? "elseOperation" : "thenOperation"]: MathOperations.NONE,
              [isElse ? "elseCalculations" : "thenCalculations"]: {
                ...calculation,
                operations: [],
              },
            });
          }}
        />
      </div>

      {/* <div className="border rounded-lg p-4 bg-slate-50">
        {operations?.[operations.length - 1]?.operator ===
        MathOperations.PERCENTAGE ? (
          <CompareValueSection
            condition={condition}
            fields={fields}
            logicFields={logicFields}
            onUpdate={onUpdate}
          />
        ) : (
          <SimpleCalculation
            calculationId={calculation.id}
            operations={
              type === "then"
                ? calculation.operations.then
                : calculation.operations.else
            }
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
      </div> */}
    </div>
  );
};
