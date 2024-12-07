import { ConditionOperators, ConditionalCalculationType } from "~/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type OperatorSelectorProps = {
  comparator: ConditionalCalculationType["comparator"];
  onUpdate: (updates: ConditionOperators) => void;
};

export const OperatorSelector = ({
  comparator,
  onUpdate,
}: OperatorSelectorProps) => (
  <Select
    value={comparator}
    onValueChange={(value) => onUpdate(value as ConditionOperators)}
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
