import {
  ConditionType,
  FieldTypes,
  InputFieldType,
  LogicFieldType,
} from "~/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type FieldSelectorProps = {
  condition: ConditionType;
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  onUpdate: (updates: Partial<ConditionType>) => void;
};

export const FieldSelector = ({
  condition,
  fields,
  logicFields,
  onUpdate,
}: FieldSelectorProps) => (
  <Select
    value={condition.field}
    onValueChange={(value) => onUpdate({ field: value })}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select field" />
    </SelectTrigger>
    <SelectContent>
      {condition.fieldType === FieldTypes.INPUT
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
);
