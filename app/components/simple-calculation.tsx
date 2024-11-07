import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { operations } from "~/lib/constant";
import {
  SimpleCalculationType,
  InputFieldType,
  CalculationOperation,
  CalculationFieldType,
  OperatorType,
} from "~/lib/types";
import { isBrowser } from "~/lib/utils";
import { CalculationValueSelector } from "~/components/calculation-value-selector";

interface SimpleCalculationProps {
  calculation?: SimpleCalculationType;
  fields: InputFieldType[];
  defaultData: CalculationOperation;
  onDelete: (calculationId: string, operationId: string) => void;
  updateOperation: (
    calculationLogicId: string,
    newOperation: CalculationOperation
  ) => void;
}

export function SimpleCalculation({
  calculation,
  fields,
  onDelete,
  updateOperation,
  defaultData,
}: SimpleCalculationProps) {
  const logicFields = isBrowser
    ? JSON.parse(localStorage?.getItem("logicFields") || "[]")
    : [];

  const [defaultOperations, setDefaultOperations] =
    useState<CalculationOperation>(defaultData);

  const handleUpdateValue = ({
    operationId,
    where,
    value,
    type,
    fieldId,
  }: {
    operationId: string;
    where: "value1" | "value2";
    value: string;
    type: CalculationFieldType;
    fieldId: string | null;
  }) => {
    if (type === "logic") {
      value =
        logicFields.find((field: any) => field.id === fieldId)?.name || "";
    } else if (type === "field") {
      value = fields.find((field: any) => field.id === fieldId)?.name || "";
    }
    const updatedOperation = {
      ...defaultOperations,
      id: operationId,
      [where]: { type, fieldId, value },
    };
    setDefaultOperations(updatedOperation);
    updateOperation(calculation?.logicId || "", updatedOperation);
  };

  if (!calculation) return null;
  return (
    <div className="grid grid-cols-1">
      {calculation.operations?.map((operation: CalculationOperation) => (
        <div key={operation.id} className="flex items-end  gap-2 mb-4">
          <CalculationValueSelector
            fields={fields}
            logicFields={logicFields}
            placeholder="Select a value"
            defaultType={operation.value1.type}
            defaultValue={operation.value1.value}
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
              setDefaultOperations({
                ...defaultOperations,
                operator: value as OperatorType,
              })
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Operation" />
            </SelectTrigger>
            <SelectContent>
              {operations.map((op, idx) => (
                <SelectItem key={idx} value={op.value}>
                  {op.label}
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
              onDelete?.(calculation?.id, operation.id);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
