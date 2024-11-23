import { MathOperations } from "~/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type OperationSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export const OperationSelector = ({
  value,
  onValueChange,
}: OperationSelectorProps) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select operation" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={MathOperations.NONE}>None</SelectItem>
      <SelectItem value={MathOperations.ADD}>Add</SelectItem>
      <SelectItem value={MathOperations.SUBTRACT}>Subtract</SelectItem>
      <SelectItem value={MathOperations.MULTIPLY}>Multiply</SelectItem>
      <SelectItem value={MathOperations.DIVIDE}>Divide</SelectItem>
      <SelectItem value={MathOperations.PERCENTAGE}>Percentage</SelectItem>
    </SelectContent>
  </Select>
);
