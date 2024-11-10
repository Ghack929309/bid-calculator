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
import { defaultSimpleOperations, operations } from "~/lib/constant";
import {
  SimpleCalculationType,
  InputFieldType,
  CalculationOperation,
  CalculationFieldType,
  OperatorType,
  LogicFieldType,
} from "~/lib/types";
import { CalculationValueSelector } from "~/components/calculation-value-selector";

interface SimpleCalculationProps {
  calculation?: SimpleCalculationType;
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  onDelete: (calculationId: string, operationId: string) => void;
  updateOperation: (newOperation: CalculationOperation) => void;
}

export function SimpleCalculation({
  calculation,
  fields,
  logicFields,
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
    where: "value1" | "value2" | "operator";
    value: string;
    type?: CalculationFieldType;
    fieldId?: string | null;
  }) => {
    if (type === "logic") {
      value =
        logicFields.find((field: LogicFieldType) => field.id === fieldId)
          ?.name || "";
    } else if (type === "field") {
      value = fields.find((field: any) => field.id === fieldId)?.name || "";
    }

    const updatedOperation = {
      ...defaultOperations,
      id: operationId,
      [where]: where === "operator" ? value : { type, fieldId, value },
    };
    setDefaultOperations(updatedOperation);
    updateOperation(updatedOperation);
  };

  if (!calculation) return null;
  return (
    <div className="grid grid-cols-1">
      {calculation.operations?.map((operation: CalculationOperation) => (
        <div key={operation.id} className="flex items-end gap-2 mb-4">
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
