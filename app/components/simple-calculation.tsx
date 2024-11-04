import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { operations } from "~/lib/constant";
import { SimpleCalculationType, InputFieldType } from "~/lib/types";

interface SimpleCalculationProps {
  calculation: SimpleCalculationType;
  fields: InputFieldType[];
  onUpdate: (id: string, updates: any) => void;
  onDelete?: (id: string) => void;
}

export function SimpleCalculation({
  calculation,
  fields,
  onUpdate,
  onDelete,
}: SimpleCalculationProps) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Input
        className="w-[200px]"
        placeholder="Field name"
        value={calculation.name}
        onChange={(e) => onUpdate(calculation.id, { name: e.target.value })}
      />

      <span>=</span>

      <Select
        value={calculation.baseField}
        onValueChange={(value) =>
          onUpdate(calculation.id, { baseField: value })
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select base field" />
        </SelectTrigger>
        <SelectContent>
          {fields.map((field) => (
            <SelectItem key={field.id} value={field.id}>
              {field.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={calculation.operation}
        onValueChange={(value) =>
          onUpdate(calculation.id, { operation: value })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Operation" />
        </SelectTrigger>
        <SelectContent>
          {operations.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-2">
        <Select
          value={calculation.existingLogic.name || ""}
          onValueChange={(value) =>
            onUpdate(calculation.existingLogic.id, {
              existingLogic: value,
            })
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="existing logic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem defaultChecked key="none" value="none">
              None
            </SelectItem>
            {fields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>OR</span>
        <Input
          type="number"
          disabled={calculation.existingLogic.name !== "none"}
          className="w-[150px]"
          placeholder="Value"
          value={calculation.value}
          onChange={(e) => onUpdate(calculation.id, { value: e.target.value })}
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={
          () => {}
          //   setCalculations((prev) =>
          //     prev.filter((c) => c.id !== calculation.id)
          //   )
        }
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
