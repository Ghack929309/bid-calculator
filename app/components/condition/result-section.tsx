import {
  ConditionType,
  InputFieldType,
  LogicFieldType,
  MathOperations,
} from "~/lib/types";
import { Input } from "../ui/input";
import { OperationSelector } from "./operation-selector";
import { SimpleCalculation } from "../simple-calculation";

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
  const calculations = isElse
    ? condition.elseCalculations
    : condition.thenCalculations;

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
                ...calculations,
                operations: calculations?.operations || [],
              },
            })
          }
        />
      </div>

      {operation !== MathOperations.NONE && (
        <div className="border rounded-lg p-4 bg-slate-50">
          <SimpleCalculation
            calculation={calculations}
            fields={fields}
            logicFields={logicFields}
            updateOperation={(operation) =>
              onUpdate({
                [isElse ? "elseCalculations" : "thenCalculations"]: {
                  ...calculations,
                  operations: [operation],
                },
              })
            }
            onDelete={() => {
              onUpdate({
                [isElse ? "elseOperation" : "thenOperation"]:
                  MathOperations.NONE,
                [isElse ? "elseCalculations" : "thenCalculations"]: {
                  ...calculations,
                  operations: [],
                },
              });
            }}
          />
        </div>
      )}
    </div>
  );
};
