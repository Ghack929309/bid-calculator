import { v4 } from "uuid";
import { CalculationOperation, ConditionalCalculationType } from "./types";

export const OperationTypes = [
  { value: "add", label: "Add (+)" },
  { value: "subtract", label: "Subtract (-)" },
  { value: "multiply", label: "Multiply (×)" },
  { value: "divide", label: "Divide (÷)" },
  { value: "percentage", label: "Percentage (%)" },
];

export const comparisons = [
  { value: "equals", label: "Equals (=)" },
  { value: "notEquals", label: "Not Equals (≠)" },
  { value: "greaterThan", label: "Greater Than (>)" },
  { value: "lessThan", label: "Less Than (<)" },
  { value: "between", label: "Between" },
];

export const logicalOperators = [
  { value: "and", label: "AND" },
  { value: "or", label: "OR" },
];

export const defaultSimpleOperations: CalculationOperation = {
  id: v4(),
  operator: "add",
  nextOperator: "none",
  value1: {
    type: "field",
    fieldId: null,
    logicId: null,
    value: "",
  },
  value2: {
    type: "field",
    fieldId: null,
    logicId: null,
    value: "",
  },
};

export const defaultConditionalComparator: ConditionalCalculationType["comparedValues"] =
  {
    value1: {
      type: "field",
      fieldId: null,
      logicId: null,
      value: "",
    },
    value2: {
      type: "number",
      fieldId: null,
      logicId: null,
      value: "",
    },
  };
