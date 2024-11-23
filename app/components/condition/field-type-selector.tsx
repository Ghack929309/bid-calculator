import { ConditionType, FieldTypes } from "~/lib/types";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type FieldTypeSelectorProps = {
  condition: ConditionType;
  onUpdate: (updates: Partial<ConditionType>) => void;
};

export const FieldTypeSelector = ({
  condition,
  onUpdate,
}: FieldTypeSelectorProps) => (
  <RadioGroup
    value={condition.fieldType}
    onValueChange={(value) =>
      onUpdate({
        fieldType: value as (typeof FieldTypes)[keyof typeof FieldTypes],
        field: "",
      })
    }
    className="flex items-center space-x-4"
  >
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={FieldTypes.INPUT} id={`input-${condition.id}`} />
      <Label htmlFor={`input-${condition.id}`}>Input Fields</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={FieldTypes.LOGIC} id={`logic-${condition.id}`} />
      <Label htmlFor={`logic-${condition.id}`}>Logic Fields</Label>
    </div>
  </RadioGroup>
);
