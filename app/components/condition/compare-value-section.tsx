import {
  CompareValueTypes,
  ConditionalCalculationType,
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
  id: string;
  condition: ConditionalCalculationType["comparedValues"];
  type: "value1" | "value2";
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  hideFixedValue?: boolean;
  onUpdate: (updates: ConditionalCalculationType["comparedValues"]) => void;
};

export const CompareValueSection = ({
  condition,
  id,
  fields,
  type,
  logicFields,
  hideFixedValue = false,
  onUpdate,
}: CompareValueSectionProps) => {
  const handleUpdate = (updates: (typeof condition)[typeof type]) => {
    onUpdate({
      ...condition,
      [type]: updates,
    });
  };
  const isField = condition[type].type === CompareValueTypes.INPUT;

  return (
    <div className="space-y-2">
      <RadioGroup
        value={condition[type].type}
        onValueChange={(value) =>
          handleUpdate({
            ...condition[type],
            type: value as (typeof CompareValueTypes)[keyof typeof CompareValueTypes],
          })
        }
        className="flex items-center space-x-4"
      >
        {!hideFixedValue && (
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={CompareValueTypes.FIXED}
              id={`fixed-${condition[type].value}-${id}`}
            />
            <Label htmlFor={`fixed-${condition[type].value}-${id}`}>
              Number
            </Label>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value={CompareValueTypes.INPUT}
            id={`input-compare-${condition[type].value}-${id}`}
          />
          <Label htmlFor={`input-compare-${condition[type].value}-${id}`}>
            Field
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value={CompareValueTypes.LOGIC}
            id={`logic-compare-${condition[type].value}-${id}`}
          />
          <Label htmlFor={`logic-compare-${condition[type].value}-${id}`}>
            Logic
          </Label>
        </div>
      </RadioGroup>

      {!hideFixedValue && condition[type].type === CompareValueTypes.FIXED ? (
        <Input
          type="number"
          value={condition[type].value}
          onChange={(e) =>
            handleUpdate({
              ...condition[type],
              value: e.target.value,
            })
          }
          placeholder="Enter value to compare"
        />
      ) : (
        <Select
          value={
            (isField ? condition[type].fieldId : condition[type].logicId) || ""
          }
          onValueChange={(value) => {
            const valueType = isField ? "fieldId" : "logicId";
            handleUpdate({
              ...condition[type],
              [valueType]: value,
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select field to compare" />
          </SelectTrigger>
          <SelectContent>
            {condition[type].type === CompareValueTypes.INPUT
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
};
