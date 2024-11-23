import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  CalculationType,
  CompareValueTypes,
  ConditionOperators,
  ConditionType,
  FieldType,
  FieldTypes,
  InputFieldType,
  MathOperations,
} from "./types";
import { v4 } from "uuid";

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

const ValueTypes = {
  FIXED: "fixed",
  FIELD: "field",
};

export const createInitialCondition = (): ConditionType => ({
  id: v4(),
  fieldType: FieldTypes.INPUT,
  field: "",
  operator: ConditionOperators.EQUALS,
  compareValueType: CompareValueTypes.FIXED,
  compareValue: "",
  compareFieldId: "",
  valueType: ValueTypes.FIXED,
  resultType: ValueTypes.FIXED,
  resultValue: "",
  resultField: "",
  mathOperation: MathOperations.NONE,
  operationValue: "",
  thenValue: "",
  thenOperation: MathOperations.NONE,
  thenCalculations: {
    id: v4(),
    logicId: "",
    type: CalculationType.SIMPLE,
    operations: [],
  },
  elseValue: "",
  elseOperation: MathOperations.NONE,
  elseCalculations: {
    id: v4(),
    logicId: "",
    type: CalculationType.SIMPLE,
    operations: [],
  },
});
