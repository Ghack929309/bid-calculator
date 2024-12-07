import { Plus, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  InputFieldType,
  CalculationOperation,
  OperatorType,
  LogicFieldType,
} from "~/lib/types";
import { Render } from "./render";
import { OperationSelector } from "./condition/operation-selector";
import { CompareValueSection } from "./condition/compare-value-section";
import { defaultConditionalComparator } from "~/lib/constant";

interface CalculatorProps {
  operations?: CalculationOperation[];
  calculationId: string;
  addMoreOperation: () => void;
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  onDelete: (calculationId: string, operationId: string) => void;
  updateOperation: (newOperation: CalculationOperation) => void;
}

export function Calculator({
  operations,
  calculationId,
  fields,
  logicFields,
  addMoreOperation,
  onDelete,
  updateOperation,
}: CalculatorProps) {
  const updateConditionalOperation = (
    operationId: string,
    newOperation: CalculationOperation
  ) => {
    const operation = operations?.find(
      (operation) => operation.id === operationId
    ) as CalculationOperation;
    if (!operation) return;
    const updatedOperation = {
      ...operation,
      ...newOperation,
    };
    console.log("updatedOperation", updatedOperation);

    updateOperation(updatedOperation);
  };
  console.log("operations", operations);
  if (!operations) return null;
  return (
    <div className="grid grid-cols-1">
      {operations?.map((operation: CalculationOperation) => (
        // TODO: check if the last operation is percentage, then show the percentage UI
        <div className="w-full" key={operation.id}>
          <div className="flex items-end gap-2 mb-4">
            <CompareValueSection
              type="value1"
              condition={{
                value1:
                  operation.value1 || defaultConditionalComparator["value1"],
                value2:
                  operation.value2 || defaultConditionalComparator["value2"],
              }}
              fields={fields}
              logicFields={logicFields}
              onUpdate={(data) => {
                console.log("data", data);
                updateConditionalOperation(operation.id, {
                  ...operation,
                  value1: data.value1,
                });
              }}
            />

            <OperationSelector
              key={"middle-operation"}
              value={operation.operator || "none"}
              onValueChange={(value) =>
                updateConditionalOperation(operation.id, {
                  ...operation,
                  operator: value as OperatorType,
                })
              }
            />

            <CompareValueSection
              type="value2"
              condition={{
                value1:
                  operation.value1 || defaultConditionalComparator["value1"],
                value2:
                  operation.value2 || defaultConditionalComparator["value2"],
              }}
              fields={fields}
              logicFields={logicFields}
              onUpdate={(data) => {
                console.log("data", data);
                updateConditionalOperation(operation.id, {
                  ...operation,
                  value2: data.value2,
                });
              }}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onDelete?.(calculationId, operation.id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center pb-4 w-full">
            <OperationSelector
              key={"next-operation"}
              value={operation.nextOperator || "none"}
              onValueChange={(value) =>
                updateConditionalOperation(operation.id, {
                  ...operation,
                  nextOperator: value as OperatorType,
                })
              }
            />
          </div>
        </div>
      ))}

      <Render
        when={
          operations.length > 0 &&
          operations[operations.length - 1].nextOperator !== "none"
        }
      >
        <div className="flex flex-col gap-2">
          <Button onClick={addMoreOperation}>
            <Plus className="h-4 w-4 mr-2" />
            Add Operation
          </Button>
        </div>
      </Render>
    </div>
  );
}
