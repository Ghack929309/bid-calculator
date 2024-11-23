import { ConditionOperators, ConditionType } from "~/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type OperatorSelectorProps = {
  condition: ConditionType;
  onUpdate: (updates: Partial<ConditionType>) => void;
};

export const OperatorSelector = ({
  condition,
  onUpdate,
}: OperatorSelectorProps) => (
  <Select
    value={condition.operator}
    onValueChange={(value) => onUpdate({ operator: value })}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select operator" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={ConditionOperators.EQUALS}>Equals</SelectItem>
      <SelectItem value={ConditionOperators.GREATER_THAN}>
        Greater than
      </SelectItem>
      <SelectItem value={ConditionOperators.LESS_THAN}>Less than</SelectItem>
      <SelectItem value={ConditionOperators.GREATER_EQUAL}>
        Greater than or equal
      </SelectItem>
      <SelectItem value={ConditionOperators.LESS_EQUAL}>
        Less than or equal
      </SelectItem>
    </SelectContent>
  </Select>
);
