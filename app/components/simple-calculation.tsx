import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { defaultSimpleOperations } from "~/lib/constant";
import {
  SimpleCalculationType,
  InputFieldType,
  CalculationOperation,
  CalculationFieldType,
  OperatorType,
  LogicFieldType,
} from "~/lib/types";
import { CalculationValueSelector } from "~/components/calculation-value-selector";
import { Render } from "./render";
import { OperationSelector } from "./condition/operation-selector";

interface SimpleCalculationProps {
  operations?: SimpleCalculationType["operations"];
  calculationId: string;
  addMoreOperation: () => void;
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  onDelete: (calculationId: string, operationId: string) => void;
  updateOperation: (newOperation: CalculationOperation) => void;
}

export function SimpleCalculation({
  operations,
  calculationId,
  fields,
  logicFields,
  addMoreOperation,
  onDelete,
  updateOperation,
}: SimpleCalculationProps) {
  const [defaultOperations, setDefaultOperations] =
    useState<CalculationOperation>(
      defaultSimpleOperations as CalculationOperation
    );

  const handleUpdateValue = ({
    operationId,
    where,
    value,
    type,
    fieldId,
  }: {
    operationId: string;
    where: keyof CalculationOperation;
    value: string;
    type?: CalculationFieldType;
    fieldId?: string | null;
  }) => {
    let updatedValue = value;

    // Get field name if type is logic or field
    if (type === "logic") {
      updatedValue =
        logicFields.find((field: LogicFieldType) => field.id === fieldId)
          ?.name || "";
    } else if (type === "field") {
      updatedValue =
        fields.find((field: InputFieldType) => field.id === fieldId)?.name ||
        "";
    }

    const updatedOperation = {
      ...defaultOperations,
      id: operationId,
      [where]:
        typeof type !== "undefined"
          ? { type, fieldId, value: updatedValue }
          : updatedValue,
    };

    setDefaultOperations(updatedOperation);
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
            <CalculationValueSelector
              fields={fields}
              logicFields={logicFields}
              placeholder="Select a value"
              defaultType={operation.value1?.type}
              defaultValue={operation.value1?.value}
              onValueChange={({ value, type, fieldId }) =>
                handleUpdateValue({
                  operationId: operation.id,
                  where: "value1",
                  value,
                  type,
                  fieldId,
                })
              }
            />

            <Select
              value={operation.operator}
              onValueChange={(value) =>
                handleUpdateValue({
                  operationId: operation.id,
                  value: value as OperatorType,
                  where: "operator",
                })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Operation" />
              </SelectTrigger>
              <SelectContent>
                {operations.map((op, idx) => (
                  <SelectItem key={idx} value={op.operator}>
                    {op.operator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CalculationValueSelector
              fields={fields}
              logicFields={logicFields}
              placeholder="Select value"
              defaultType={operation.value2?.type}
              defaultValue={operation.value2?.value}
              onValueChange={({ value, type, fieldId }) =>
                handleUpdateValue({
                  operationId: operation.id,
                  where: "value2",
                  value,
                  type,
                  fieldId,
                })
              }
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
              key={calculationId}
              value={operation.nextOperator || "none"}
              onValueChange={(value) =>
                handleUpdateValue({
                  operationId: operation.id,
                  where: "nextOperator",
                  value: value as OperatorType,
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
