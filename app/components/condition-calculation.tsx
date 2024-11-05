import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import { ConditionalCalculationType, InputFieldType } from "~/lib/types";
import { Condition } from "./condition";
import { SimpleCalculation } from "./simple-calculation";

interface ConditionalCalculationProps {
  calculation: ConditionalCalculationType;
  fields: InputFieldType[];
  onUpdate: (id: string, updates: any) => void;
  onAddCondition: (calculationId: string) => void;
}

export function ConditionalCalculation({
  calculation,
  fields,
  onUpdate,
  onAddCondition,
}: ConditionalCalculationProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        {/* <Select
          value={calculation.}
          onValueChange={(value) =>
            updateCalculation(calculation.id, { baseField: value })
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
        </Select> */}
        <Input
          className="w-[200px]"
          placeholder="Field name"
          // value={calculation.name}
          onChange={(e) => onUpdate(calculation.id, { name: e.target.value })}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Conditions</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddCondition(calculation.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            </div>
            {calculation.conditions.map((condition) => (
              <Condition
                key={condition.id}
                condition={condition}
                calculation={calculation}
                fields={fields}
                isFirst={condition.id === calculation.conditions[0].id}
                onUpdate={onUpdate}
                onDelete={() => {}}
              />
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Then</h3>
            <SimpleCalculation
              calculation={calculation.thenCalculations}
              fields={[]}
              onUpdate={() => {}}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Else</h3>
            <SimpleCalculation
              calculation={calculation.elseCalculations}
              fields={[]}
              onUpdate={() => {}}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
