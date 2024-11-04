import { InputFieldType } from "~/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { comparisons, logicalOperators } from "~/lib/constant";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface ConditionProps {
  condition: any;
  calculation: any;
  fields: InputFieldType[];
  isFirst: boolean;
  onUpdate: (calculationId: string, conditionId: string, updates: any) => void;
  onDelete: (calculationId: string, conditionId: string) => void;
}

export function Condition({
  condition,
  calculation,
  fields,
  isFirst,
  onUpdate,
  onDelete,
}: ConditionProps) {
  return (
    <div key={condition.id} className="flex items-center space-x-2 mb-2">
      {condition.id !== calculation.conditions[0].id && (
        <Select
          value={condition.logicalOperator}
          onValueChange={(value) =>
            onUpdate(calculation.id, condition.id, {
              logicalOperator: value,
            })
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {logicalOperators.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={condition.field}
        onValueChange={(value) =>
          onUpdate(calculation.id, condition.id, { field: value })
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select field" />
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
        value={condition.comparison}
        onValueChange={(value) =>
          onUpdate(calculation.id, condition.id, { comparison: value })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Comparison" />
        </SelectTrigger>
        <SelectContent>
          {comparisons.map((comp) => (
            <SelectItem key={comp.value} value={comp.value}>
              {comp.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        className="w-[150px]"
        placeholder="Value"
        value={condition.value}
        onChange={(e) =>
          onUpdate(calculation.id, condition.id, {
            value: e.target.value,
          })
        }
      />

      {condition.comparison === "between" && (
        <>
          <span>and</span>
          <Input
            type="number"
            className="w-[150px]"
            placeholder="Second value"
            value={condition.value2}
            onChange={(e) =>
              onUpdate(calculation.id, condition.id, {
                value2: e.target.value,
              })
            }
          />
        </>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={
          () => {}
          // onUpdate(calculation.id, {
          //   conditions: calculation.conditions.filter(
          //     (c) => c.id !== condition.id
          //   ),
          // })
        }
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
