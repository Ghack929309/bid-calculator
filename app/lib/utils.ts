import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  CalculationType,
  ConditionOperators,
  ConditionalCalculationType,
  FieldType,
  InputFieldType,
} from "./types";
import { v4 } from "uuid";
import {
  defaultConditionalComparator,
  defaultSimpleOperations,
} from "./constant";

export const isBrowser = typeof window !== "undefined";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getInitialFieldState = ({
  type,
  options,
  name,
  required,
}: {
  type: FieldType;
  options?: string[];
  name?: string;
  required?: boolean;
}): InputFieldType => {
  const baseField = {
    name: name || "",
    type,
    required: required || false,
    enabled: true,
  };

  return type === "number" || type === "text"
    ? { ...baseField }
    : { ...baseField, options: options || [] };
};

export const createInitialCondition = (): ConditionalCalculationType => ({
  id: v4(),
  logicId: "",
  type: CalculationType.CONDITIONAL,
  comparator: ConditionOperators.EQUALS,
  operations: {
    then: [defaultSimpleOperations],
    else: [defaultSimpleOperations],
  },
  comparedValues: defaultConditionalComparator,
});
