import { InputFieldType } from "~/lib/types";
import { Label } from "./ui/label";
import { Variable } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

export const RenderField = ({
  field,
  value,
  isDisabled,
}: {
  field: InputFieldType;
  value?: string;
  isDisabled?: boolean;
}) => {
  switch (field.type) {
    case "miles":
    case "priceRange":
      return (
        <div className="py-2">
          <Label className="capitalize flex items-center gap-2">
            <Variable className="w-4 h-4" />
            <span>{field.name}</span>
          </Label>
        </div>
      );

    case "text":
    case "number":
      return (
        <div className="space-y-2">
          <Label className="capitalize">{field.name}</Label>
          <Input
            type={field.type}
            value={value}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            disabled={isDisabled}
          />
        </div>
      );

    case "select":
      return (
        <div className="space-y-2">
          <Label className="capitalize">{field.name}</Label>
          <Select value={value} disabled={isDisabled}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: { value: string; id: string }) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-4">
          <Label className="capitalize">{field.name}</Label>
          <div className="flex items-center flex-wrap gap-2">
            {field.options?.map((option: { value: string; id: string }) => (
              <div key={option.id} className="flex items-center gap-2">
                <Checkbox
                  id={option.id}
                  checked={value === option.value}
                  disabled={isDisabled}
                />
                <Label htmlFor={option.id} className="capitalize">
                  {option.value}
                </Label>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
};
