import { ConditionOperators, ConditionalCalculationType } from "~/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type OperatorSelectorProps = {
  condition: ConditionalCalculationType;
  onUpdate: (updates: Partial<ConditionalCalculationType>) => void;
};

export const OperatorSelector = ({
  condition,
  onUpdate,
}: OperatorSelectorProps) => (
  <Select
    value={condition.comparison}
    onValueChange={(value) =>
      onUpdate({ comparison: value as ConditionOperators })
    }
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
