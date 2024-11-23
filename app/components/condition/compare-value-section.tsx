import {
  CompareValueTypes,
  ConditionType,
  InputFieldType,
  LogicFieldType,
} from "~/lib/types";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";

type CompareValueSectionProps = {
  condition: ConditionType;
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  onUpdate: (updates: Partial<ConditionType>) => void;
};

export const CompareValueSection = ({
  condition,
  fields,
  logicFields,
  onUpdate,
}: CompareValueSectionProps) => (
  <div className="space-y-2">
    <RadioGroup
      value={condition.compareValueType}
      onValueChange={(value) =>
        onUpdate({
          compareValueType:
            value as (typeof CompareValueTypes)[keyof typeof CompareValueTypes],
          compareValue: "",
          compareFieldId: "",
        })
      }
      className="flex items-center space-x-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value={CompareValueTypes.FIXED}
          id={`fixed-${condition.id}`}
        />
        <Label htmlFor={`fixed-${condition.id}`}>Fixed Value</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value={CompareValueTypes.INPUT}
          id={`input-compare-${condition.id}`}
        />
        <Label htmlFor={`input-compare-${condition.id}`}>Input Field</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value={CompareValueTypes.LOGIC}
          id={`logic-compare-${condition.id}`}
        />
        <Label htmlFor={`logic-compare-${condition.id}`}>Logic Field</Label>
      </div>
    </RadioGroup>

    {condition.compareValueType === CompareValueTypes.FIXED ? (
      <Input
        type="number"
        value={condition.compareValue}
        onChange={(e) => onUpdate({ compareValue: e.target.value })}
        placeholder="Enter value to compare"
      />
    ) : (
      <Select
        value={condition.compareFieldId}
        onValueChange={(value) => onUpdate({ compareFieldId: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select field to compare" />
        </SelectTrigger>
        <SelectContent>
          {condition.compareValueType === CompareValueTypes.INPUT
            ? fields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name}
                </SelectItem>
              ))
            : logicFields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
    )}
  </div>
);
