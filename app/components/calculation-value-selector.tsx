import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { InputFieldType, CalculationFieldType } from "~/lib/types";
import { useState } from "react";

interface CalculationValueSelectorProps {
  fields: InputFieldType[];
  logicFields: any[];
  onValueChange: (params: {
    value: string;
    type: CalculationFieldType;
    fieldId: string | null;
  }) => void;
  placeholder?: string;
  defaultType?: CalculationFieldType;
  defaultValue?: string;
}

export function CalculationValueSelector({
  fields,
  logicFields,
  onValueChange,
  placeholder = "Select value",
  defaultType = "field",
  defaultValue = "",
}: CalculationValueSelectorProps) {
  const [selectedType, setSelectedType] =
    useState<CalculationFieldType>(defaultType);

  const handleValueChange = (value: string) => {
    onValueChange({
      value,
      type: selectedType,
      fieldId: selectedType === "number" ? null : value,
    });
  };
  console.log("defaultValue", defaultValue);
  return (
    <div className="space-y-2">
      <RadioGroup
        defaultValue={selectedType}
        onValueChange={(value) =>
          setSelectedType(value as CalculationFieldType)
        }
        className="flex gap-4"
      >
        <div className="flex items-center gap-1.5">
          <RadioGroupItem value="field" id="field" className="h-4 w-4" />
          <Label htmlFor="field" className="text-sm">
            Field
          </Label>
        </div>
        <div className="flex items-center gap-1.5">
          <RadioGroupItem value="logic" id="logic" className="h-4 w-4" />
          <Label htmlFor="logic" className="text-sm">
            Logic
          </Label>
        </div>
        <div className="flex items-center gap-1.5">
          <RadioGroupItem value="number" id="number" className="h-4 w-4" />
          <Label htmlFor="number" className="text-sm">
            Number
          </Label>
        </div>
      </RadioGroup>

      {selectedType === "number" ? (
        <Input
          type="number"
          placeholder="Enter value"
          className="w-full bg-white"
          defaultValue={defaultValue}
          onChange={(e) => handleValueChange(e.target.value)}
        />
      ) : (
        <Select onValueChange={handleValueChange}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue
              defaultValue={defaultValue}
              placeholder={placeholder}
            />
          </SelectTrigger>
          <SelectContent>
            {selectedType === "field"
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
}
